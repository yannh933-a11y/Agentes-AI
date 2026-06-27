import crypto from 'crypto';
import { currentTenant } from '../tenant';
import { agentes } from '../agentes';
import { conversasDemo } from '../dashboard';
import { ensureCommercialSchema, withDatabase } from './database';
import { recordIntegrationEvent } from './integrations-repository';
import { generateAgentPreview } from './ai-service';
import { writeAuditEvent } from './audit-repository';
import { createOutboundResponse } from './operations-repository';

const STATUS_LABELS = {
  OPEN: 'Aberta',
  WAITING_HUMAN: 'Aguardando humano',
  AUTO_REPLIED: 'Respondida pela IA',
  ESCALATED: 'Escalada',
  CLOSED: 'Fechada',
};

function nowIso() {
  return new Date().toISOString();
}

function safeJson(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function normalizeConversation(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    agentSlug: row.agent_slug || 'atendimento',
    agentName: row.agent_name || getAgentName(row.agent_slug),
    customerName: row.customer_name || 'Cliente',
    customerContact: row.customer_contact || 'Contato não informado',
    channel: row.channel || 'site',
    status: row.status || 'OPEN',
    statusLabel: STATUS_LABELS[row.status] || row.status || 'Aberta',
    sentiment: row.sentiment || 'Neutro',
    priority: row.priority || 'Normal',
    summary: row.summary || 'Conversa recebida e aguardando classificação.',
    nextAction: row.next_action || 'Acompanhar atendimento.',
    externalThreadId: row.external_thread_id || null,
    lastMessage: row.last_message || null,
    lastMessageAt: row.last_message_at || row.updated_at || row.created_at,
    messagesCount: Number(row.messages_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeMessage(row) {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    companyId: row.company_id,
    role: row.role,
    content: row.content,
    metadata: safeJson(row.metadata, {}),
    createdAt: row.created_at,
  };
}

function getAgentName(agentSlug = 'atendimento') {
  return agentes.find((item) => item.slug === agentSlug)?.nome || 'Agente de Atendimento';
}

function demoConversations(companyId = currentTenant.id) {
  return conversasDemo.map((item, index) => ({
    id: `demo_conv_${index + 1}`,
    companyId,
    agentSlug: inferAgentSlug(`${item.agente} ${item.resumo}`),
    agentName: item.agente,
    customerName: item.cliente,
    customerContact: item.canal === 'WhatsApp' ? '+55 31 99999-0000' : `${item.cliente.toLowerCase().replace(/\s+/g, '.')}@demo.com`,
    channel: item.canal.toLowerCase().replace('whatsapp', 'whatsapp').replace('instagram', 'instagram').replace('site', 'site'),
    status: item.etapa === 'Encaminhado' ? 'ESCALATED' : 'AUTO_REPLIED',
    statusLabel: item.etapa,
    sentiment: item.sentimento,
    priority: item.sentimento === 'Quente' ? 'Alta' : item.sentimento === 'Atenção' ? 'Crítica' : 'Normal',
    summary: item.resumo,
    nextAction: item.sentimento === 'Quente' ? 'Enviar proposta comercial.' : 'Acompanhar atendimento.',
    externalThreadId: `demo-thread-${index + 1}`,
    lastMessage: item.resumo,
    lastMessageAt: item.horario,
    messagesCount: 4,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));
}

function demoMessages(conversationId) {
  return [
    { id: `${conversationId}_m1`, conversationId, companyId: currentTenant.id, role: 'USER', content: 'Quero entender como funciona um agente para minha empresa.', metadata: { channel: 'demo' }, createdAt: nowIso() },
    { id: `${conversationId}_m2`, conversationId, companyId: currentTenant.id, role: 'ASSISTANT', content: 'Claro. O agente é exclusivo da sua empresa, usa sua base de conhecimento e atende sem misturar dados com outros clientes.', metadata: { provider: 'demo' }, createdAt: nowIso() },
    { id: `${conversationId}_m3`, conversationId, companyId: currentTenant.id, role: 'USER', content: 'Dá para usar no WhatsApp?', metadata: { channel: 'demo' }, createdAt: nowIso() },
    { id: `${conversationId}_m4`, conversationId, companyId: currentTenant.id, role: 'ASSISTANT', content: 'Sim. O WhatsApp pode ser conectado como canal principal, com histórico e roteamento por agente.', metadata: { provider: 'demo' }, createdAt: nowIso() },
  ];
}

export function inferAgentSlug(text = '') {
  const value = String(text).toLowerCase();
  const rules = [
    ['juridico', ['jurídico', 'juridico', 'contrato', 'processo', 'cláusula', 'clausula']],
    ['cobranca', ['cobrança', 'cobranca', 'pendência', 'pendencia', 'inadimplência', 'inadimplencia']],
    ['financeiro', ['boleto', 'pagamento', 'financeiro', 'pix', 'nota fiscal', 'segunda via']],
    ['agendamento', ['agendar', 'agenda', 'horário', 'horario', 'consulta', 'marcar', 'remarcar']],
    ['social-media', ['post', 'conteúdo', 'conteudo', 'instagram', 'legenda', 'social media']],
    ['suporte', ['suporte', 'erro', 'problema', 'não funciona', 'nao funciona', 'acesso', 'bug']],
    ['vendas', ['preço', 'preco', 'valor', 'plano', 'comprar', 'contratar', 'proposta', 'orçamento', 'orcamento']],
  ];
  return rules.find(([, words]) => words.some((word) => value.includes(word)))?.[0] || 'atendimento';
}

export function classifyConversation({ message = '', agentSlug = 'atendimento' } = {}) {
  const text = String(message).toLowerCase();
  const hot = ['contratar', 'preço', 'preco', 'valor', 'proposta', 'orçamento', 'orcamento', 'quero comprar'];
  const risk = ['reclamação', 'reclamacao', 'cancelar', 'processo', 'jurídico', 'juridico', 'senha', 'cpf', 'cartão', 'cartao'];
  const sentiment = hot.some((word) => text.includes(word)) ? 'Quente' : risk.some((word) => text.includes(word)) ? 'Atenção' : 'Neutro';
  const priority = risk.some((word) => text.includes(word)) ? 'Crítica' : hot.some((word) => text.includes(word)) ? 'Alta' : 'Normal';
  const shouldEscalate = risk.some((word) => text.includes(word)) || agentSlug === 'juridico';
  return { sentiment, priority, shouldEscalate };
}

export async function listConversations({ companyId = currentTenant.id, status = null, channel = null, agentSlug = null, limit = 50 } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [companyId];
    let where = 'WHERE c.company_id = $1';
    if (status) { params.push(status); where += ` AND c.status = $${params.length}`; }
    if (channel) { params.push(channel); where += ` AND c.channel = $${params.length}`; }
    if (agentSlug) { params.push(agentSlug); where += ` AND c.agent_slug = $${params.length}`; }
    params.push(limit);
    const response = await client.query(
      `SELECT c.*, 
        (SELECT m.content FROM ai_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
        (SELECT COUNT(*) FROM ai_messages m WHERE m.conversation_id = c.id) AS messages_count
       FROM ai_conversations c
       ${where}
       ORDER BY COALESCE(c.last_message_at, c.updated_at, c.created_at) DESC
       LIMIT $${params.length}`,
      params
    );
    return response.rows.map(normalizeConversation);
  });

  return { source: result ? 'database' : 'mock', items: result || demoConversations(companyId) };
}

export async function getConversation({ id, companyId = currentTenant.id } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(`SELECT * FROM ai_conversations WHERE id = $1 AND company_id = $2 LIMIT 1`, [id, companyId]);
    return response.rows[0] ? normalizeConversation(response.rows[0]) : null;
  });

  if (result) return { source: 'database', conversation: result };
  const fallback = demoConversations(companyId).find((item) => item.id === id) || demoConversations(companyId)[0];
  return { source: 'mock', conversation: fallback };
}

export async function listMessages({ conversationId, companyId = currentTenant.id, limit = 80 } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `SELECT * FROM ai_messages WHERE conversation_id = $1 AND company_id = $2 ORDER BY created_at ASC LIMIT $3`,
      [conversationId, companyId, limit]
    );
    return response.rows.map(normalizeMessage);
  });

  return { source: result ? 'database' : 'mock', items: result || demoMessages(conversationId) };
}

export async function appendMessage({ conversationId, companyId = currentTenant.id, role = 'USER', content = '', metadata = {} } = {}) {
  const message = {
    id: `msg_${crypto.randomUUID()}`,
    conversationId,
    companyId,
    role,
    content: String(content || '').trim(),
    metadata,
  };
  if (!message.content) return { source: 'mock', message: { ...message, createdAt: nowIso() } };

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `INSERT INTO ai_messages (id, conversation_id, company_id, role, content, metadata)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [message.id, conversationId, companyId, role, message.content, JSON.stringify(metadata)]
    );
    await client.query(`UPDATE ai_conversations SET updated_at = NOW(), last_message_at = NOW() WHERE id = $1 AND company_id = $2`, [conversationId, companyId]);
    return normalizeMessage(response.rows[0]);
  });

  return { source: result ? 'database' : 'mock', message: result || { ...message, createdAt: nowIso() } };
}

export async function upsertConversation({
  companyId = currentTenant.id,
  agentSlug = 'atendimento',
  customerName = 'Cliente',
  customerContact = null,
  channel = 'site',
  externalThreadId = null,
  summary = null,
  sentiment = 'Neutro',
  priority = 'Normal',
  nextAction = null,
  status = 'OPEN',
} = {}) {
  const conversationId = `conv_${crypto.randomUUID()}`;
  const agentName = getAgentName(agentSlug);

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);

    let existing = null;
    if (externalThreadId) {
      const byThread = await client.query(
        `SELECT * FROM ai_conversations WHERE company_id = $1 AND channel = $2 AND external_thread_id = $3 ORDER BY created_at DESC LIMIT 1`,
        [companyId, channel, externalThreadId]
      );
      existing = byThread.rows[0];
    }
    if (!existing && customerContact) {
      const byContact = await client.query(
        `SELECT * FROM ai_conversations WHERE company_id = $1 AND channel = $2 AND customer_contact = $3 AND status IN ('OPEN','AUTO_REPLIED','WAITING_HUMAN','ESCALATED') ORDER BY updated_at DESC LIMIT 1`,
        [companyId, channel, customerContact]
      );
      existing = byContact.rows[0];
    }

    if (existing) {
      const response = await client.query(
        `UPDATE ai_conversations SET
          agent_slug = COALESCE($3, agent_slug),
          agent_name = COALESCE($4, agent_name),
          customer_name = COALESCE($5, customer_name),
          sentiment = $6,
          priority = $7,
          summary = COALESCE($8, summary),
          next_action = COALESCE($9, next_action),
          status = $10,
          updated_at = NOW(),
          last_message_at = NOW()
         WHERE id = $1 AND company_id = $2
         RETURNING *`,
        [existing.id, companyId, agentSlug, agentName, customerName, sentiment, priority, summary, nextAction, status]
      );
      return normalizeConversation(response.rows[0]);
    }

    const response = await client.query(
      `INSERT INTO ai_conversations
       (id, company_id, agent_slug, agent_name, customer_name, customer_contact, channel, status, summary, sentiment, priority, next_action, external_thread_id, last_message_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
       RETURNING *`,
      [conversationId, companyId, agentSlug, agentName, customerName, customerContact, channel, status, summary, sentiment, priority, nextAction, externalThreadId]
    );
    return normalizeConversation(response.rows[0]);
  });

  const conversation = result || {
    id: conversationId,
    companyId,
    agentSlug,
    agentName,
    customerName,
    customerContact,
    channel,
    status,
    statusLabel: STATUS_LABELS[status] || status,
    sentiment,
    priority,
    summary: summary || 'Conversa criada para acompanhamento operacional.',
    nextAction: nextAction || 'Acompanhar atendimento.',
    externalThreadId,
    lastMessageAt: nowIso(),
    messagesCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  return { source: result ? 'database' : 'mock', conversation };
}

export async function updateConversationStatus({ id, companyId = currentTenant.id, status = 'OPEN', nextAction = null } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `UPDATE ai_conversations SET status = $3, next_action = COALESCE($4, next_action), updated_at = NOW()
       WHERE id = $1 AND company_id = $2 RETURNING *`,
      [id, companyId, status, nextAction]
    );
    return response.rows[0] ? normalizeConversation(response.rows[0]) : null;
  });

  await writeAuditEvent({ action: 'CONVERSATION_STATUS_UPDATED', entity: 'AIConversation', entityId: id, metadata: { companyId, status } });
  return { source: result ? 'database' : 'mock', conversation: result || null };
}

function extractWhatsapp(payload = {}) {
  const entry = payload?.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value || {};
  const message = value?.messages?.[0] || payload.message || {};
  const contact = value?.contacts?.[0] || payload.contact || {};
  const text = message?.text?.body || message?.button?.text || message?.interactive?.button_reply?.title || payload.text || payload.messageText || '';
  const from = message?.from || payload.from || payload.customerContact || null;
  const name = contact?.profile?.name || payload.customerName || from || 'Cliente WhatsApp';
  return { text, customerName: name, customerContact: from, externalThreadId: from, messageType: message?.type || 'text' };
}

function extractInstagram(payload = {}) {
  const msg = payload?.entry?.[0]?.messaging?.[0] || payload.message || {};
  const text = msg?.message?.text || payload.text || payload.messageText || '';
  const from = msg?.sender?.id || payload.from || payload.customerContact || null;
  return { text, customerName: payload.customerName || from || 'Cliente Instagram', customerContact: from, externalThreadId: from, messageType: 'text' };
}

function extractGeneric(payload = {}) {
  const text = payload.text || payload.message || payload.messageText || payload.content || payload.summary || '';
  const contact = payload.customerContact || payload.email || payload.whatsapp || payload.from || payload.phone || null;
  return {
    text,
    customerName: payload.customerName || payload.name || payload.nome || payload.companyName || contact || 'Cliente',
    customerContact: contact,
    externalThreadId: payload.externalThreadId || payload.threadId || contact,
    messageType: payload.type || 'text',
  };
}

export function extractInboundMessage({ channel = 'custom-webhook', payload = {} } = {}) {
  if (channel === 'whatsapp') return extractWhatsapp(payload);
  if (channel === 'instagram') return extractInstagram(payload);
  return extractGeneric(payload);
}

export async function routeInboundEvent({ companyId = currentTenant.id, channel = 'custom-webhook', payload = {}, autoReply = true } = {}) {
  const inbound = extractInboundMessage({ channel, payload });
  const text = String(inbound.text || '').trim() || 'Evento recebido sem texto explícito.';
  const agentSlug = payload.agentSlug || inferAgentSlug(`${text} ${channel}`);
  const classification = classifyConversation({ message: text, agentSlug });
  const status = classification.shouldEscalate ? 'WAITING_HUMAN' : 'OPEN';

  const integrationEvent = await recordIntegrationEvent({
    companyId,
    channel,
    direction: 'inbound',
    type: text ? 'message.received' : 'webhook.received',
    status: 'received',
    summary: `Mensagem ${channel} roteada para ${getAgentName(agentSlug)}.`,
    payload,
  });

  const conversationResult = await upsertConversation({
    companyId,
    agentSlug,
    customerName: inbound.customerName,
    customerContact: inbound.customerContact,
    channel,
    externalThreadId: inbound.externalThreadId,
    sentiment: classification.sentiment,
    priority: classification.priority,
    status,
    summary: `Cliente enviou: ${text.slice(0, 160)}`,
    nextAction: classification.shouldEscalate ? 'Revisão humana antes da resposta final.' : 'IA pode responder dentro da base.',
  });

  const conversation = conversationResult.conversation;
  const userMessage = await appendMessage({
    conversationId: conversation.id,
    companyId,
    role: 'USER',
    content: text,
    metadata: { channel, sourceEventId: integrationEvent.event?.id, messageType: inbound.messageType, rawContact: inbound.customerContact },
  });

  let ai = null;
  let assistantMessage = null;
  let finalStatus = status;

  if (autoReply && !classification.shouldEscalate) {
    ai = await generateAgentPreview({ companyId, agentSlug, message: text, conversationId: conversation.id });
    assistantMessage = await appendMessage({
      conversationId: conversation.id,
      companyId,
      role: 'ASSISTANT',
      content: ai.answer,
      metadata: { provider: ai.provider, usedDocuments: ai.usedDocuments, safetyFlags: ai.safetyFlags, latencyMs: ai.latencyMs },
    });
    finalStatus = 'WAITING_HUMAN';
    await updateConversationStatus({ id: conversation.id, companyId, status: finalStatus, nextAction: 'Resposta gerada pela IA e aguardando aprovação humana antes do envio externo.' });
    await createOutboundResponse({
      companyId,
      conversationId: conversation.id,
      messageId: assistantMessage.message?.id,
      channel,
      customerName: inbound.customerName,
      customerContact: inbound.customerContact,
      agentSlug,
      agentName: getAgentName(agentSlug),
      content: ai.answer,
      priority: classification.priority,
      approvalMode: 'human_review',
      metadata: { provider: ai.provider, usedDocuments: ai.usedDocuments, safetyFlags: ai.safetyFlags, source: 'routeInboundEvent' },
    });
    await recordIntegrationEvent({
      companyId,
      channel,
      direction: 'internal',
      type: 'message.response_pending_approval',
      status: 'processed',
      summary: `Resposta automática preparada para ${inbound.customerName} e enviada para revisão humana.`,
      payload: { conversationId: conversation.id, answer: ai.answer, provider: ai.provider },
    });
  } else if (classification.shouldEscalate) {
    await updateConversationStatus({ id: conversation.id, companyId, status: 'WAITING_HUMAN', nextAction: 'Atendimento precisa de revisão humana.' });
    await recordIntegrationEvent({
      companyId,
      channel,
      direction: 'internal',
      type: 'conversation.escalated',
      status: 'processed',
      summary: `Conversa escalada para humano por prioridade ${classification.priority}.`,
      payload: { conversationId: conversation.id, classification },
    });
  }

  await writeAuditEvent({
    action: 'INBOUND_MESSAGE_ROUTED',
    entity: 'AIConversation',
    entityId: conversation.id,
    metadata: { companyId, channel, agentSlug, status: finalStatus, source: conversationResult.source },
  });

  return {
    ok: true,
    source: conversationResult.source,
    channel,
    companyId,
    routing: { agentSlug, agentName: getAgentName(agentSlug), classification, autoReply: Boolean(assistantMessage) },
    conversation: { ...conversation, status: finalStatus },
    messages: { inbound: userMessage.message, assistant: assistantMessage?.message || null },
    ai,
    integrationEvent: integrationEvent.event,
  };
}
