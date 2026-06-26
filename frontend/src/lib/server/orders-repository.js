import crypto from 'crypto';
import { buildCheckoutSummary, formatCents, getOrderStatusLabel } from '../billing';
import { ensureCommercialSchema, withDatabase } from './database';
import { writeAuditEvent } from './audit-repository';

export const orderStatuses = [
  { key: 'AWAITING_PAYMENT', label: 'Aguardando pagamento' },
  { key: 'PAYMENT_REVIEW', label: 'Pagamento em análise' },
  { key: 'PAID', label: 'Pago' },
  { key: 'IMPLEMENTATION', label: 'Em implantação' },
  { key: 'ACTIVE', label: 'Ativo' },
  { key: 'CANCELED', label: 'Cancelado' },
];

function normalizeOrder(row) {
  return {
    id: row.id,
    leadId: row.lead_id || null,
    empresa: row.company_name || '-',
    nome: row.customer_name,
    email: row.email,
    whatsapp: row.whatsapp || '-',
    agenteSlug: row.agent_slug || null,
    agente: row.agent_name || 'Agente personalizado',
    planoSlug: row.plan_slug || null,
    plano: row.plan_name || 'A definir',
    metodoPagamento: row.payment_method || 'pix_manual',
    provider: row.provider || row.payment_method || 'pix_manual',
    providerReference: row.provider_reference || null,
    checkoutUrl: row.checkout_url || null,
    setupCents: Number(row.setup_cents || 0),
    monthlyCents: Number(row.monthly_cents || 0),
    totalCents: Number(row.total_cents || 0),
    totalFormatado: formatCents(row.total_cents || 0),
    mensalidadeFormatada: formatCents(row.monthly_cents || 0),
    status: row.status || 'AWAITING_PAYMENT',
    statusLabel: getOrderStatusLabel(row.status || 'AWAITING_PAYMENT'),
    observacoes: row.notes || '',
    metadata: row.metadata || {},
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at,
  };
}

function fallbackOrders() {
  return [
    {
      id: 'mock-order-1',
      empresa: 'Clínica Horizonte',
      nome: 'Marina Lopes',
      email: 'marina@clinicahorizonte.com.br',
      whatsapp: '(31) 99999-0000',
      agente: 'Agente de Atendimento',
      agenteSlug: 'atendimento',
      plano: 'Pro',
      planoSlug: 'pro',
      metodoPagamento: 'pix_manual',
      provider: 'pix_manual',
      totalCents: 79400,
      setupCents: 49700,
      monthlyCents: 29700,
      totalFormatado: 'R$ 794,00',
      mensalidadeFormatada: 'R$ 297,00',
      status: 'PAYMENT_REVIEW',
      statusLabel: 'Pagamento em análise',
      observacoes: 'Aguardando conferência de comprovante.',
      criadoEm: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'mock-order-2',
      empresa: 'Studio Alpha',
      nome: 'Rafael Nunes',
      email: 'rafael@studioalpha.com.br',
      whatsapp: '(31) 98888-0000',
      agente: 'Agente de Vendas',
      agenteSlug: 'vendas',
      plano: 'Business',
      planoSlug: 'business',
      metodoPagamento: 'mercado_pago',
      provider: 'mercado_pago',
      totalCents: 179400,
      setupCents: 99700,
      monthlyCents: 79700,
      totalFormatado: 'R$ 1.794,00',
      mensalidadeFormatada: 'R$ 797,00',
      status: 'PAID',
      statusLabel: 'Pago',
      observacoes: 'Pronto para implantação.',
      criadoEm: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export async function createCommercialOrder(data) {
  const id = `order_${crypto.randomUUID()}`;
  const checkout = buildCheckoutSummary({ planSlug: data.plano || data.planSlug, agentSlug: data.agente || data.agentSlug });
  const paymentMethod = data.metodoPagamento || data.paymentMethod || 'pix_manual';
  const status = data.status || (paymentMethod === 'pix_manual' ? 'AWAITING_PAYMENT' : 'AWAITING_PAYMENT');

  const payload = {
    id,
    leadId: data.leadId || null,
    companyName: data.empresa?.trim() || null,
    customerName: data.nome?.trim(),
    email: data.email?.trim().toLowerCase(),
    whatsapp: data.whatsapp?.trim() || null,
    agentSlug: checkout.agent?.slug || data.agente || null,
    agentName: checkout.agent?.nome || data.agentName || 'Agente personalizado',
    planSlug: checkout.plan?.slug || data.plano || null,
    planName: checkout.plan?.nome || data.planName || 'A definir',
    paymentMethod,
    provider: data.provider || paymentMethod,
    providerReference: data.providerReference || null,
    checkoutUrl: data.checkoutUrl || null,
    setupCents: checkout.setupCents,
    monthlyCents: checkout.monthlyCents,
    totalCents: checkout.totalCents,
    status,
    notes: data.observacoes || data.notes || null,
    metadata: data.metadata || {},
  };

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `INSERT INTO commercial_orders
       (id, lead_id, company_name, customer_name, email, whatsapp, agent_slug, agent_name, plan_slug, plan_name, payment_method, provider, provider_reference, checkout_url, setup_cents, monthly_cents, total_cents, status, notes, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING *`,
      [payload.id, payload.leadId, payload.companyName, payload.customerName, payload.email, payload.whatsapp, payload.agentSlug, payload.agentName, payload.planSlug, payload.planName, payload.paymentMethod, payload.provider, payload.providerReference, payload.checkoutUrl, payload.setupCents, payload.monthlyCents, payload.totalCents, payload.status, payload.notes, JSON.stringify(payload.metadata)]
    );

    await client.query(
      `INSERT INTO commercial_payments (id, order_id, provider, provider_reference, amount_cents, status, raw_payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [`payment_${crypto.randomUUID()}`, payload.id, payload.provider, payload.providerReference, payload.totalCents, payload.status === 'PAID' ? 'PAID' : 'PENDING', JSON.stringify(payload.metadata)]
    );

    return normalizeOrder(response.rows[0]);
  });

  const order = result || normalizeOrder({
    id: payload.id,
    lead_id: payload.leadId,
    company_name: payload.companyName,
    customer_name: payload.customerName,
    email: payload.email,
    whatsapp: payload.whatsapp,
    agent_slug: payload.agentSlug,
    agent_name: payload.agentName,
    plan_slug: payload.planSlug,
    plan_name: payload.planName,
    payment_method: payload.paymentMethod,
    provider: payload.provider,
    provider_reference: payload.providerReference,
    checkout_url: payload.checkoutUrl,
    setup_cents: payload.setupCents,
    monthly_cents: payload.monthlyCents,
    total_cents: payload.totalCents,
    status: payload.status,
    notes: payload.notes,
    metadata: payload.metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  await writeAuditEvent({
    action: 'ORDER_CREATED',
    entity: 'CommercialOrder',
    entityId: order.id,
    metadata: { email: order.email, empresa: order.empresa, plano: order.plano, agente: order.agente, total: order.totalCents },
  });

  return { source: result ? 'database' : 'mock', order };
}

export async function listCommercialOrders({ limit = 100, status = null } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [];
    let where = '';
    if (status) {
      params.push(status);
      where = `WHERE status = $${params.length}`;
    }
    params.push(limit);
    const response = await client.query(`SELECT * FROM commercial_orders ${where} ORDER BY created_at DESC LIMIT $${params.length}`, params);
    return response.rows.map(normalizeOrder);
  });

  return { source: result ? 'database' : 'mock', items: result || fallbackOrders() };
}

export async function updateCommercialOrder(id, data) {
  const allowed = orderStatuses.map((item) => item.key);
  const status = data.status && allowed.includes(data.status) ? data.status : null;
  const notes = data.observacoes || data.notes || null;

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `UPDATE commercial_orders
       SET status = COALESCE($2, status), notes = COALESCE($3, notes), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status, notes]
    );
    return response.rows[0] ? normalizeOrder(response.rows[0]) : null;
  });

  if (!result) return { source: 'mock', order: null };

  await writeAuditEvent({
    actorType: 'ADMIN',
    actorLabel: data.actorLabel || 'Admin Agentes AI',
    action: 'ORDER_STATUS_UPDATE',
    entity: 'CommercialOrder',
    entityId: id,
    metadata: { status, notes },
  });

  return { source: 'database', order: result };
}

export async function getCommercialOrdersMetrics() {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const [total, byStatus, byPlan] = await Promise.all([
      client.query(`SELECT COUNT(*)::int AS total, COALESCE(SUM(total_cents),0)::int AS revenue FROM commercial_orders`),
      client.query(`SELECT status, COUNT(*)::int AS total, COALESCE(SUM(total_cents),0)::int AS revenue FROM commercial_orders GROUP BY status ORDER BY total DESC`),
      client.query(`SELECT COALESCE(plan_name,'A definir') AS plan, COUNT(*)::int AS total, COALESCE(SUM(total_cents),0)::int AS revenue FROM commercial_orders GROUP BY plan_name ORDER BY revenue DESC`),
    ]);

    return {
      totalOrders: total.rows[0]?.total || 0,
      revenueCents: total.rows[0]?.revenue || 0,
      revenue: formatCents(total.rows[0]?.revenue || 0),
      byStatus: byStatus.rows.map((row) => ({ ...row, label: getOrderStatusLabel(row.status), revenue: formatCents(row.revenue) })),
      byPlan: byPlan.rows.map((row) => ({ ...row, revenue: formatCents(row.revenue) })),
    };
  });

  if (result) return { source: 'database', metrics: result };

  const fallback = fallbackOrders();
  const revenueCents = fallback.reduce((sum, order) => sum + order.totalCents, 0);
  return {
    source: 'mock',
    metrics: {
      totalOrders: fallback.length,
      revenueCents,
      revenue: formatCents(revenueCents),
      byStatus: orderStatuses.map((status) => ({ status: status.key, label: status.label, total: fallback.filter((order) => order.status === status.key).length, revenue: formatCents(fallback.filter((order) => order.status === status.key).reduce((sum, order) => sum + order.totalCents, 0)) })).filter((item) => item.total > 0),
      byPlan: ['Start', 'Pro', 'Business'].map((plan) => ({ plan, total: fallback.filter((order) => order.plano === plan).length, revenue: formatCents(fallback.filter((order) => order.plano === plan).reduce((sum, order) => sum + order.totalCents, 0)) })),
    },
  };
}
