import crypto from 'crypto';
import { leadsAdmin } from '../dashboard';
import { ensureCommercialSchema, withDatabase } from './database';
import { writeAuditEvent } from './audit-repository';

const PLAN_VALUES = {
  start: 19700,
  pro: 39700,
  business: 79700,
  enterprise: 0,
  Start: 19700,
  Pro: 39700,
  Business: 79700,
  Enterprise: 0,
};

export const leadStatuses = [
  { key: 'NEW', label: 'Novo lead' },
  { key: 'CONTACTED', label: 'Contato feito' },
  { key: 'QUALIFIED', label: 'Qualificado' },
  { key: 'PROPOSAL', label: 'Proposta' },
  { key: 'WON', label: 'Ganho' },
  { key: 'LOST', label: 'Perdido' },
];

export function getStatusLabel(status) {
  return leadStatuses.find((item) => item.key === status)?.label || status || 'Novo lead';
}

function estimatePlanValue(plan) {
  if (!plan) return 0;
  return PLAN_VALUES[plan] ?? PLAN_VALUES[String(plan).toLowerCase()] ?? 0;
}

function normalizeLead(row) {
  return {
    id: String(row.id),
    nome: row.name,
    empresa: row.company_name || '-',
    email: row.email,
    whatsapp: row.whatsapp || '-',
    segmento: row.segment || '-',
    agente: row.agent_type || 'A definir',
    plano: row.plan || 'A definir',
    tamanho: row.size || '-',
    problema: row.problem || '-',
    canal: row.channel || '-',
    volume: row.daily_volume || '-',
    origem: row.origin || 'site',
    status: row.status || 'NEW',
    statusLabel: getStatusLabel(row.status || 'NEW'),
    valorEstimado: Number(row.estimated_value_cents || 0),
    valorEstimadoFormatado: formatMoney(row.estimated_value_cents || 0),
    observacoes: row.notes || '',
    ultimaInteracao: row.last_interaction_at,
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at,
  };
}

function fallbackLeads() {
  return leadsAdmin.map((lead, index) => ({
    id: `mock-${index + 1}`,
    nome: lead.contato,
    empresa: lead.empresa,
    email: `${lead.contato.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '.')}@empresa.com.br`,
    whatsapp: '(31) 99999-0000',
    segmento: 'Comercial',
    agente: lead.agente,
    plano: lead.plano,
    tamanho: '11-20 pessoas',
    problema: 'Lead de referência usado para visualização inicial do pipeline.',
    canal: ['WhatsApp', 'Instagram', 'Site', 'Multicanal'][index] || 'WhatsApp',
    volume: ['51 a 100 atendimentos/dia', '101 a 300 atendimentos/dia', '21 a 50 atendimentos/dia', 'Até 20 atendimentos/dia'][index] || 'Até 20 atendimentos/dia',
    origem: 'mock',
    status: index === 0 ? 'NEW' : index === 1 ? 'PROPOSAL' : 'QUALIFIED',
    statusLabel: lead.status,
    valorEstimado: [39700, 79700, 79700, 19700][index] || 19700,
    valorEstimadoFormatado: lead.valor,
    observacoes: '',
    criadoEm: new Date(Date.now() - index * 86400000).toISOString(),
    atualizadoEm: new Date(Date.now() - index * 86400000).toISOString(),
  }));
}

export async function createCommercialLead(data) {
  const id = `lead_${crypto.randomUUID()}`;
  const payload = {
    id,
    name: data.nome?.trim(),
    companyName: data.empresa?.trim() || null,
    email: data.email?.trim().toLowerCase(),
    whatsapp: data.whatsapp?.trim() || null,
    segment: data.segmento || null,
    agentType: data.agenteNome || data.interesse || data.agente || null,
    plan: data.planoNome || data.planoDesejado || data.plano || null,
    size: data.tamanho || null,
    problem: data.problema || null,
    channel: data.canal || null,
    dailyVolume: data.volume || null,
    origin: data.origem || 'site',
    estimatedValue: estimatePlanValue(data.planoDesejado || data.plano),
  };

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `INSERT INTO commercial_leads
       (id, name, company_name, email, whatsapp, segment, agent_type, plan, size, problem, channel, daily_volume, origin, status, estimated_value_cents, last_interaction_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'NEW',$14,NOW())
       ON CONFLICT (email) DO UPDATE SET
        name=$2,
        company_name=$3,
        whatsapp=$5,
        segment=$6,
        agent_type=$7,
        plan=$8,
        size=$9,
        problem=$10,
        channel=$11,
        daily_volume=$12,
        origin=$13,
        estimated_value_cents=$14,
        last_interaction_at=NOW(),
        updated_at=NOW()
       RETURNING *`,
      [payload.id, payload.name, payload.companyName, payload.email, payload.whatsapp, payload.segment, payload.agentType, payload.plan, payload.size, payload.problem, payload.channel, payload.dailyVolume, payload.origin, payload.estimatedValue]
    );

    return normalizeLead(response.rows[0]);
  });

  if (!result) {
    return {
      source: 'mock',
      lead: normalizeLead({
        id,
        name: payload.name,
        company_name: payload.companyName,
        email: payload.email,
        whatsapp: payload.whatsapp,
        segment: payload.segment,
        agent_type: payload.agentType,
        plan: payload.plan,
        size: payload.size,
        problem: payload.problem,
        channel: payload.channel,
        daily_volume: payload.dailyVolume,
        origin: payload.origin,
        status: 'NEW',
        estimated_value_cents: payload.estimatedValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    };
  }

  await writeAuditEvent({
    action: 'LEAD_UPSERT',
    entity: 'CommercialLead',
    entityId: result.id,
    metadata: { email: result.email, empresa: result.empresa, agente: result.agente, plano: result.plano, canal: result.canal, volume: result.volume },
  });

  return { source: 'database', lead: result };
}

export async function listCommercialLeads({ limit = 100, status = null } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [];
    let where = '';
    if (status) {
      params.push(status);
      where = `WHERE status = $${params.length}`;
    }
    params.push(limit);
    const response = await client.query(
      `SELECT * FROM commercial_leads ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
      params
    );
    return response.rows.map(normalizeLead);
  });

  return { source: result ? 'database' : 'mock', items: result || fallbackLeads() };
}

export async function updateCommercialLead(id, data) {
  const allowedStatus = leadStatuses.map((item) => item.key);
  const status = data.status && allowedStatus.includes(data.status) ? data.status : null;
  const notes = data.observacoes || data.notes || null;

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `UPDATE commercial_leads
       SET status = COALESCE($2, status), notes = COALESCE($3, notes), last_interaction_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status, notes]
    );
    return response.rows[0] ? normalizeLead(response.rows[0]) : null;
  });

  if (!result) return { source: 'mock', lead: null };

  await writeAuditEvent({
    actorType: 'ADMIN',
    actorLabel: data.actorLabel || 'Admin Agentes AI',
    action: 'LEAD_STATUS_UPDATE',
    entity: 'CommercialLead',
    entityId: id,
    metadata: { status, notes },
  });

  return { source: 'database', lead: result };
}

export async function getCommercialMetrics() {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const [total, byStatus, byPlan, recent] = await Promise.all([
      client.query(`SELECT COUNT(*)::int AS total, COALESCE(SUM(estimated_value_cents),0)::int AS pipeline FROM commercial_leads`),
      client.query(`SELECT status, COUNT(*)::int AS total FROM commercial_leads GROUP BY status ORDER BY total DESC`),
      client.query(`SELECT COALESCE(plan,'A definir') AS plan, COUNT(*)::int AS total, COALESCE(SUM(estimated_value_cents),0)::int AS pipeline FROM commercial_leads GROUP BY plan ORDER BY pipeline DESC`),
      client.query(`SELECT COUNT(*)::int AS total FROM commercial_leads WHERE created_at >= NOW() - INTERVAL '7 days'`),
    ]);

    return {
      totalLeads: total.rows[0]?.total || 0,
      pipelineCents: total.rows[0]?.pipeline || 0,
      pipeline: formatMoney(total.rows[0]?.pipeline || 0),
      recentLeads: recent.rows[0]?.total || 0,
      byStatus: byStatus.rows.map((row) => ({ ...row, label: getStatusLabel(row.status) })),
      byPlan: byPlan.rows.map((row) => ({ ...row, pipeline: formatMoney(row.pipeline) })),
    };
  });

  if (result) return { source: 'database', metrics: result };

  const fallback = fallbackLeads();
  const pipelineCents = fallback.reduce((sum, lead) => sum + lead.valorEstimado, 0);
  return {
    source: 'mock',
    metrics: {
      totalLeads: fallback.length,
      pipelineCents,
      pipeline: formatMoney(pipelineCents),
      recentLeads: fallback.length,
      byStatus: leadStatuses.map((status) => ({ status: status.key, label: status.label, total: fallback.filter((lead) => lead.status === status.key).length })).filter((item) => item.total > 0),
      byPlan: ['Start', 'Pro', 'Business'].map((plan) => ({ plan, total: fallback.filter((lead) => lead.plano === plan).length, pipeline: formatMoney(fallback.filter((lead) => lead.plano === plan).reduce((sum, lead) => sum + lead.valorEstimado, 0)) })),
    },
  };
}

function formatMoney(cents) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(cents) || 0) / 100);
}
