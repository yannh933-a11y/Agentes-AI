import crypto from 'crypto';
import { currentTenant } from '../tenant';
import { demoIntegrations, demoIntegrationEvents, getIntegrationChannel } from '../integrations';
import { ensureCommercialSchema, withDatabase } from './database';
import { writeAuditEvent } from './audit-repository';

function normalizeIntegration(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    companyName: row.company_name || currentTenant.nome,
    channel: row.channel,
    name: row.name,
    provider: row.provider || 'custom',
    status: row.status || 'configured',
    health: row.health || 'Pendente',
    config: row.config || {},
    lastEventAt: row.last_event_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeEvent(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    integrationId: row.integration_id || null,
    channel: row.channel,
    direction: row.direction || 'inbound',
    type: row.event_type,
    status: row.status || 'received',
    summary: row.summary || '-',
    payload: row.payload || {},
    error: row.error || null,
    createdAt: row.created_at,
  };
}

export async function listIntegrations({ companyId = currentTenant.id } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `SELECT * FROM channel_integrations WHERE company_id = $1 ORDER BY created_at DESC`,
      [companyId]
    );
    return response.rows.map(normalizeIntegration);
  });

  return {
    source: result ? 'database' : 'mock',
    items: result && result.length ? result : demoIntegrations.filter((item) => item.companyId === companyId),
  };
}

export async function upsertIntegration(data) {
  const channel = getIntegrationChannel(data.channel || 'whatsapp');
  const id = data.id || `integration_${crypto.randomUUID()}`;
  const companyId = data.companyId || currentTenant.id;
  const payload = {
    id,
    companyId,
    channel: channel.key,
    name: data.name || channel.label,
    provider: data.provider || channel.provider,
    status: data.status || 'configured',
    health: data.health || 'Pendente',
    config: data.config || {},
  };

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `INSERT INTO channel_integrations
       (id, company_id, channel, name, provider, status, health, config)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (company_id, channel, name) DO UPDATE SET
        provider=$5,
        status=$6,
        health=$7,
        config=$8,
        updated_at=NOW()
       RETURNING *`,
      [payload.id, payload.companyId, payload.channel, payload.name, payload.provider, payload.status, payload.health, JSON.stringify(payload.config)]
    );
    return normalizeIntegration(response.rows[0]);
  });

  const integration = result || {
    ...payload,
    companyName: currentTenant.nome,
    lastEventAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await writeAuditEvent({
    action: 'INTEGRATION_UPSERT',
    entity: 'ChannelIntegration',
    entityId: integration.id,
    metadata: { companyId, channel: channel.key, source: result ? 'database' : 'mock' },
  });

  return { source: result ? 'database' : 'mock', integration };
}

export async function recordIntegrationEvent(data) {
  const id = data.id || `evt_${crypto.randomUUID()}`;
  const companyId = data.companyId || currentTenant.id;
  const event = {
    id,
    companyId,
    integrationId: data.integrationId || null,
    channel: data.channel || 'custom-webhook',
    direction: data.direction || 'inbound',
    type: data.type || data.eventType || 'message.received',
    status: data.status || 'received',
    summary: data.summary || 'Evento recebido pelo canal.',
    payload: data.payload || {},
    error: data.error || null,
  };

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `INSERT INTO channel_events
       (id, company_id, integration_id, channel, direction, event_type, status, summary, payload, error)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [event.id, event.companyId, event.integrationId, event.channel, event.direction, event.type, event.status, event.summary, JSON.stringify(event.payload), event.error]
    );

    await client.query(
      `UPDATE channel_integrations
       SET last_event_at = NOW(), health = CASE WHEN $3 = 'failed' THEN 'Erro' ELSE 'Saudável' END, updated_at = NOW()
       WHERE company_id = $1 AND channel = $2`,
      [event.companyId, event.channel, event.status]
    );

    return normalizeEvent(response.rows[0]);
  });

  await writeAuditEvent({
    action: 'CHANNEL_EVENT_RECEIVED',
    entity: 'ChannelEvent',
    entityId: id,
    metadata: { companyId, channel: event.channel, type: event.type, status: event.status },
  });

  return { source: result ? 'database' : 'mock', event: result || { ...event, createdAt: new Date().toISOString() } };
}

export async function listIntegrationEvents({ companyId = currentTenant.id, channel = null, limit = 50 } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [companyId];
    let where = 'WHERE company_id = $1';
    if (channel) {
      params.push(channel);
      where += ` AND channel = $${params.length}`;
    }
    params.push(limit);
    const response = await client.query(
      `SELECT * FROM channel_events ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
      params
    );
    return response.rows.map(normalizeEvent);
  });

  const fallback = demoIntegrationEvents.filter((event) => event.companyId === companyId && (!channel || event.channel === channel));
  return { source: result ? 'database' : 'mock', items: result || fallback };
}

export async function testIntegration({ channel = 'whatsapp', companyId = currentTenant.id } = {}) {
  const config = getIntegrationChannel(channel);
  const eventResult = await recordIntegrationEvent({
    companyId,
    channel,
    direction: 'internal',
    type: 'integration.tested',
    status: 'processed',
    summary: `Teste de integração executado para ${config.label}.`,
    payload: { channel, provider: config.provider, testedAt: new Date().toISOString() },
  });

  return {
    ok: true,
    source: eventResult.source,
    message: `Integração ${config.label} testada em modo seguro.`,
    event: eventResult.event,
  };
}
