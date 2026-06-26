import crypto from 'crypto';
import { currentTenant, companies } from '../tenant';
import { ensureCommercialSchema, withDatabase } from './database';
import { recordIntegrationEvent } from './integrations-repository';
import { writeAuditEvent } from './audit-repository';
import { sendExternalMessage } from './channel-sender';

const STATUS_LABELS = {
  DRAFT: 'Rascunho',
  PENDING_APPROVAL: 'Aguardando aprovação',
  APPROVED: 'Aprovada',
  SENT: 'Enviada',
  FAILED: 'Falhou',
  REJECTED: 'Rejeitada',
  HOLD: 'Em espera',
};

const STATUS_TONES = {
  DRAFT: 'default',
  PENDING_APPROVAL: 'red',
  APPROVED: 'green',
  SENT: 'green',
  FAILED: 'red',
  REJECTED: 'red',
  HOLD: 'default',
};

function nowIso() { return new Date().toISOString(); }
function safeJson(value, fallback = {}) { if (!value) return fallback; if (typeof value === 'object') return value; try { return JSON.parse(value); } catch { return fallback; } }
function addMinutes(minutes) { return new Date(Date.now() + minutes * 60_000).toISOString(); }
function resolveSlaMinutes(priority = 'Normal') { const p = String(priority || '').toLowerCase(); if (p.includes('crítica') || p.includes('critica')) return Number(process.env.OPERATION_SLA_CRITICAL_MINUTES || 10); if (p.includes('alta')) return Number(process.env.OPERATION_SLA_HIGH_MINUTES || 20); return Number(process.env.OPERATION_SLA_DEFAULT_MINUTES || 45); }

function normalizeResponse(row) {
  const metadata = safeJson(row.metadata, {});
  return {
    id: row.id,
    companyId: row.company_id,
    companyName: row.company_name || companies.find((company) => company.id === row.company_id)?.nome || currentTenant.nome,
    conversationId: row.conversation_id,
    messageId: row.message_id,
    channel: row.channel || 'site',
    customerName: row.customer_name || 'Cliente',
    customerContact: row.customer_contact || 'Contato não informado',
    agentSlug: row.agent_slug || 'atendimento',
    agentName: row.agent_name || 'Agente IA',
    content: row.content,
    status: row.status || 'PENDING_APPROVAL',
    statusLabel: STATUS_LABELS[row.status] || row.status || 'Aguardando aprovação',
    tone: STATUS_TONES[row.status] || 'default',
    priority: row.priority || 'Normal',
    approvalMode: row.approval_mode || 'human_review',
    slaMinutes: Number(row.sla_minutes || resolveSlaMinutes(row.priority)),
    dueAt: row.due_at,
    approvedBy: row.approved_by || null,
    approvedAt: row.approved_at || null,
    sentAt: row.sent_at || null,
    provider: row.provider || null,
    providerReference: row.provider_reference || null,
    error: row.error || null,
    metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeNotification(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    type: row.type,
    severity: row.severity || 'INFO',
    title: row.title,
    message: row.message,
    status: row.status || 'UNREAD',
    metadata: safeJson(row.metadata, {}),
    createdAt: row.created_at,
    readAt: row.read_at || null,
  };
}

export function demoOutboundResponses(companyId = currentTenant.id) {
  const base = [
    { id: 'opr_demo_1', companyId, companyName: companies.find((c) => c.id === companyId)?.nome || currentTenant.nome, conversationId: 'demo_conv_1', messageId: 'demo_msg_1', channel: 'whatsapp', customerName: 'Mariana Alves', customerContact: '+55 31 99999-1001', agentSlug: 'atendimento', agentName: 'Agente de Atendimento', content: 'Olá, Mariana. Consigo te ajudar com os horários disponíveis. Temos encaixe amanhã às 14h ou quinta às 9h. Qual opção fica melhor para você?', status: 'PENDING_APPROVAL', priority: 'Alta', approvalMode: 'human_review', slaMinutes: 20, dueAt: addMinutes(20), metadata: { reason: 'Lead quente em WhatsApp' }, createdAt: nowIso(), updatedAt: nowIso() },
    { id: 'opr_demo_2', companyId, companyName: companies.find((c) => c.id === companyId)?.nome || currentTenant.nome, conversationId: 'demo_conv_2', messageId: 'demo_msg_2', channel: 'instagram', customerName: 'Pedro Martins', customerContact: 'ig_928173', agentSlug: 'vendas', agentName: 'Agente de Vendas', content: 'Pedro, o plano Pro é o mais indicado para sua operação porque inclui agentes para atendimento e vendas, além de acompanhamento de implantação. Posso te enviar uma proposta?', status: 'APPROVED', priority: 'Normal', approvalMode: 'assisted', slaMinutes: 45, dueAt: addMinutes(35), approvedBy: 'Camila Rocha', approvedAt: nowIso(), metadata: { reason: 'Resposta revisada' }, createdAt: nowIso(), updatedAt: nowIso() },
    { id: 'opr_demo_3', companyId, companyName: companies.find((c) => c.id === companyId)?.nome || currentTenant.nome, conversationId: 'demo_conv_3', messageId: 'demo_msg_3', channel: 'site', customerName: 'Equipe Financeira', customerContact: 'financeiro@demo.com', agentSlug: 'financeiro', agentName: 'Agente Financeiro', content: 'A segunda via pode ser enviada por e-mail após validação do CNPJ. Por segurança, não compartilho dados financeiros sensíveis neste canal.', status: 'SENT', priority: 'Normal', approvalMode: 'auto_safe', slaMinutes: 45, dueAt: addMinutes(-12), sentAt: nowIso(), provider: 'custom-webhook', providerReference: 'out_demo_3', metadata: { safety: 'Sem dados sensíveis' }, createdAt: nowIso(), updatedAt: nowIso() },
  ];
  return base.map((row) => ({ ...row, statusLabel: STATUS_LABELS[row.status], tone: STATUS_TONES[row.status] }));
}

export function demoNotifications(companyId = currentTenant.id) {
  return [
    { id: 'not_demo_1', companyId, type: 'SLA_WARNING', severity: 'WARNING', title: 'Resposta aguardando aprovação', message: 'Há uma resposta de WhatsApp com SLA menor que 20 minutos.', status: 'UNREAD', metadata: { responseId: 'opr_demo_1' }, createdAt: nowIso() },
    { id: 'not_demo_2', companyId, type: 'HUMAN_REVIEW', severity: 'INFO', title: 'Revisão humana recomendada', message: 'Mensagem comercial pronta para revisão antes do envio externo.', status: 'UNREAD', metadata: { channel: 'instagram' }, createdAt: nowIso() },
  ];
}

export async function createOperationNotification({ companyId = currentTenant.id, type = 'INFO', severity = 'INFO', title, message, metadata = {} } = {}) {
  const id = `notif_${crypto.randomUUID()}`;
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(`INSERT INTO operation_notifications (id, company_id, type, severity, title, message, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [id, companyId, type, severity, title, message, JSON.stringify(metadata)]);
    return normalizeNotification(response.rows[0]);
  });
  return { source: result ? 'database' : 'mock', notification: result || { id, companyId, type, severity, title, message, status: 'UNREAD', metadata, createdAt: nowIso() } };
}

export async function listOperationNotifications({ companyId = currentTenant.id, limit = 20 } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(`SELECT * FROM operation_notifications WHERE company_id = $1 ORDER BY created_at DESC LIMIT $2`, [companyId, limit]);
    return response.rows.map(normalizeNotification);
  });
  return { source: result ? 'database' : 'mock', items: result || demoNotifications(companyId) };
}

export async function createOutboundResponse({ companyId = currentTenant.id, conversationId, messageId = null, channel = 'site', customerName = 'Cliente', customerContact = null, agentSlug = 'atendimento', agentName = 'Agente IA', content = '', status = 'PENDING_APPROVAL', priority = 'Normal', approvalMode = 'human_review', metadata = {} } = {}) {
  const id = `opr_${crypto.randomUUID()}`;
  const slaMinutes = resolveSlaMinutes(priority);
  const dueAt = addMinutes(slaMinutes);
  const cleanContent = String(content || '').trim();
  if (!cleanContent) return { source: 'mock', response: null, error: 'Conteúdo vazio' };
  const companyName = companies.find((company) => company.id === companyId)?.nome || currentTenant.nome;

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(`INSERT INTO outbound_responses (id, company_id, company_name, conversation_id, message_id, channel, customer_name, customer_contact, agent_slug, agent_name, content, status, priority, approval_mode, sla_minutes, due_at, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`, [id, companyId, companyName, conversationId, messageId, channel, customerName, customerContact, agentSlug, agentName, cleanContent, status, priority, approvalMode, slaMinutes, dueAt, JSON.stringify(metadata)]);
    return normalizeResponse(response.rows[0]);
  });

  const response = result || normalizeResponse({ id, company_id: companyId, company_name: companyName, conversation_id: conversationId, message_id: messageId, channel, customer_name: customerName, customer_contact: customerContact, agent_slug: agentSlug, agent_name: agentName, content: cleanContent, status, priority, approval_mode: approvalMode, sla_minutes: slaMinutes, due_at: dueAt, metadata, created_at: nowIso(), updated_at: nowIso() });
  await createOperationNotification({ companyId, type: 'OUTBOUND_RESPONSE_CREATED', severity: priority === 'Crítica' || priority === 'Alta' ? 'WARNING' : 'INFO', title: 'Resposta pronta para revisão', message: `${agentName} preparou uma resposta para ${customerName}.`, metadata: { responseId: response.id, conversationId, channel, priority } });
  await writeAuditEvent({ action: 'OUTBOUND_RESPONSE_CREATED', entity: 'OutboundResponse', entityId: response.id, metadata: { companyId, conversationId, channel, source: result ? 'database' : 'mock' } });
  return { source: result ? 'database' : 'mock', response };
}

export async function listOutboundResponses({ companyId = currentTenant.id, status = null, limit = 50, allCompanies = false } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [];
    let where = 'WHERE 1=1';
    if (!allCompanies) { params.push(companyId); where += ` AND company_id = $${params.length}`; }
    if (status) { params.push(status); where += ` AND status = $${params.length}`; }
    params.push(limit);
    const response = await client.query(`SELECT * FROM outbound_responses ${where} ORDER BY created_at DESC LIMIT $${params.length}`, params);
    return response.rows.map(normalizeResponse);
  });
  let fallback = allCompanies ? companies.flatMap((company) => demoOutboundResponses(company.id).map((item) => ({ ...item, companyName: company.nome }))) : demoOutboundResponses(companyId);
  if (status) fallback = fallback.filter((item) => item.status === status);
  return { source: result ? 'database' : 'mock', items: result || fallback };
}

export async function getOutboundResponse({ id, companyId = currentTenant.id, allCompanies = false } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [id];
    let where = 'WHERE id = $1';
    if (!allCompanies) { params.push(companyId); where += ` AND company_id = $${params.length}`; }
    const response = await client.query(`SELECT * FROM outbound_responses ${where} LIMIT 1`, params);
    return response.rows[0] ? normalizeResponse(response.rows[0]) : null;
  });
  const fallback = (allCompanies ? companies.flatMap((company) => demoOutboundResponses(company.id)) : demoOutboundResponses(companyId)).find((item) => item.id === id) || null;
  return { source: result ? 'database' : 'mock', response: result || fallback };
}

async function updateOutboundResponse({ id, companyId = currentTenant.id, status, reviewer = null, error = null, provider = null, providerReference = null, allCompanies = false, metadata = {} } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [id, status, error, provider, providerReference, JSON.stringify(metadata), reviewer];
    let where = 'WHERE id = $1';
    if (!allCompanies) { params.push(companyId); where += ` AND company_id = $${params.length}`; }
    const response = await client.query(`UPDATE outbound_responses SET status = $2, error = $3, provider = COALESCE($4, provider), provider_reference = COALESCE($5, provider_reference), metadata = COALESCE(metadata, '{}'::jsonb) || $6::jsonb, approved_by = CASE WHEN $2 = 'APPROVED' THEN COALESCE($7, approved_by) ELSE approved_by END, approved_at = CASE WHEN $2 = 'APPROVED' THEN NOW() ELSE approved_at END, sent_at = CASE WHEN $2 = 'SENT' THEN NOW() ELSE sent_at END, updated_at = NOW() ${where} RETURNING *`, params);
    return response.rows[0] ? normalizeResponse(response.rows[0]) : null;
  });
  return { source: result ? 'database' : 'mock', response: result || null };
}

export async function approveOutboundResponse({ id, companyId = currentTenant.id, reviewer = 'Operador', sendNow = false, allCompanies = false } = {}) {
  const before = await getOutboundResponse({ id, companyId, allCompanies });
  const updated = await updateOutboundResponse({ id, companyId, status: 'APPROVED', reviewer, allCompanies, metadata: { approvedBy: reviewer, approvedAt: nowIso() } });
  const response = updated.response || before.response;
  await createOperationNotification({ companyId: response?.companyId || companyId, type: 'RESPONSE_APPROVED', severity: 'INFO', title: 'Resposta aprovada', message: `${reviewer} aprovou uma resposta para envio.`, metadata: { responseId: id } });
  await writeAuditEvent({ action: 'OUTBOUND_RESPONSE_APPROVED', entity: 'OutboundResponse', entityId: id, metadata: { companyId: response?.companyId || companyId, reviewer, source: updated.source } });
  if (sendNow && response) return sendOutboundResponse({ id, companyId: response.companyId, allCompanies: true });
  return { ok: true, ...updated, response };
}

export async function rejectOutboundResponse({ id, companyId = currentTenant.id, reviewer = 'Operador', reason = 'Rejeitada em revisão humana', allCompanies = false } = {}) {
  const updated = await updateOutboundResponse({ id, companyId, status: 'REJECTED', error: reason, allCompanies, metadata: { rejectedBy: reviewer, rejectedAt: nowIso(), reason } });
  await createOperationNotification({ companyId: updated.response?.companyId || companyId, type: 'RESPONSE_REJECTED', severity: 'WARNING', title: 'Resposta rejeitada', message: reason, metadata: { responseId: id } });
  await writeAuditEvent({ action: 'OUTBOUND_RESPONSE_REJECTED', entity: 'OutboundResponse', entityId: id, metadata: { companyId: updated.response?.companyId || companyId, reviewer, reason } });
  return { ok: true, ...updated };
}

export async function holdOutboundResponse({ id, companyId = currentTenant.id, reviewer = 'Operador', reason = 'Aguardando mais informações', allCompanies = false } = {}) {
  const updated = await updateOutboundResponse({ id, companyId, status: 'HOLD', error: reason, allCompanies, metadata: { heldBy: reviewer, heldAt: nowIso(), reason } });
  await createOperationNotification({ companyId: updated.response?.companyId || companyId, type: 'RESPONSE_HOLD', severity: 'INFO', title: 'Resposta colocada em espera', message: reason, metadata: { responseId: id } });
  return { ok: true, ...updated };
}

export async function sendOutboundResponse({ id, companyId = currentTenant.id, allCompanies = false } = {}) {
  const { response } = await getOutboundResponse({ id, companyId, allCompanies });
  if (!response) return { ok: false, error: 'Resposta não encontrada' };
  if (!['APPROVED', 'PENDING_APPROVAL'].includes(response.status)) return { ok: false, error: `Status ${response.status} não permite envio` };
  const result = await sendExternalMessage({ companyId: response.companyId, channel: response.channel, contact: response.customerContact, content: response.content, conversationId: response.conversationId, responseId: response.id, metadata: response.metadata });
  const updated = await updateOutboundResponse({ id, companyId: response.companyId, status: result.ok ? 'SENT' : 'FAILED', provider: result.provider, providerReference: result.providerReference, error: result.ok ? null : result.message, allCompanies: true, metadata: { sendResult: result, sentAt: nowIso() } });
  await recordIntegrationEvent({ companyId: response.companyId, channel: response.channel, direction: 'outbound', type: 'operation.response.dispatched', status: result.ok ? 'processed' : 'failed', summary: result.message, payload: { responseId: id, conversationId: response.conversationId, provider: result.provider, mode: result.mode } });
  await createOperationNotification({ companyId: response.companyId, type: result.ok ? 'RESPONSE_SENT' : 'RESPONSE_FAILED', severity: result.ok ? 'INFO' : 'ERROR', title: result.ok ? 'Resposta enviada' : 'Falha no envio', message: result.message, metadata: { responseId: id, provider: result.provider, mode: result.mode } });
  await writeAuditEvent({ action: 'OUTBOUND_RESPONSE_SENT', entity: 'OutboundResponse', entityId: id, metadata: { companyId: response.companyId, result } });
  return { ok: result.ok, source: updated.source, response: updated.response || response, send: result };
}

export async function getOperationsMetrics({ companyId = currentTenant.id, allCompanies = false } = {}) {
  const result = await listOutboundResponses({ companyId, allCompanies, limit: 200 });
  const items = result.items;
  const pending = items.filter((item) => item.status === 'PENDING_APPROVAL').length;
  const approved = items.filter((item) => item.status === 'APPROVED').length;
  const sent = items.filter((item) => item.status === 'SENT').length;
  const failed = items.filter((item) => item.status === 'FAILED').length;
  const overdue = items.filter((item) => item.dueAt && new Date(item.dueAt).getTime() < Date.now() && !['SENT', 'REJECTED'].includes(item.status)).length;
  return { source: result.source, metrics: { total: items.length, pending, approved, sent, failed, overdue, assistedRate: items.length ? Math.round(((pending + approved) / items.length) * 100) : 0 } };
}
