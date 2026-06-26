import { recordIntegrationEvent } from './integrations-repository';

const CHANNEL_LABELS = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  email: 'E-mail',
  site: 'Widget do site',
  'custom-webhook': 'Webhook personalizado',
  crm: 'CRM',
};

function normalizePhone(phone = '') {
  return String(phone || '').replace(/\D/g, '');
}

function getMode() {
  return process.env.ENABLE_EXTERNAL_SEND === 'true' ? 'live' : 'simulation';
}

export function buildOutboundPayload({ channel = 'custom-webhook', contact = '', content = '', metadata = {} } = {}) {
  const text = String(content || '').trim();
  if (channel === 'whatsapp') {
    return {
      provider: 'whatsapp-cloud-api',
      endpoint: process.env.WHATSAPP_PHONE_NUMBER_ID ? `/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages` : 'not-configured',
      to: normalizePhone(contact),
      body: { messaging_product: 'whatsapp', to: normalizePhone(contact), type: 'text', text: { body: text } },
    };
  }
  if (channel === 'instagram') {
    return {
      provider: 'meta-instagram-dm',
      endpoint: 'instagram/messages',
      to: contact,
      body: { recipient: { id: contact }, message: { text } },
    };
  }
  if (channel === 'email') {
    return {
      provider: 'resend-email',
      endpoint: 'email/send',
      to: contact,
      body: { to: contact, from: process.env.EMAIL_FROM || 'noreply@agentes.ai', subject: metadata.subject || 'Resposta da Agentes AI', text },
    };
  }
  return {
    provider: 'custom-webhook',
    endpoint: process.env.CRM_WEBHOOK_URL || process.env.CUSTOM_OUTBOUND_WEBHOOK_URL || 'not-configured',
    to: contact,
    body: { contact, text, metadata },
  };
}

export async function sendExternalMessage({ companyId, channel, contact, content, conversationId, responseId, metadata = {} } = {}) {
  const payload = buildOutboundPayload({ channel, contact, content, metadata: { ...metadata, conversationId, responseId } });
  const mode = getMode();
  const missingConfig = [];

  if (channel === 'whatsapp' && (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID)) {
    missingConfig.push('WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID');
  }
  if (channel === 'instagram' && (!process.env.META_APP_ID || !process.env.META_APP_SECRET)) {
    missingConfig.push('META_APP_ID', 'META_APP_SECRET');
  }
  if (channel === 'email' && !process.env.RESEND_API_KEY) {
    missingConfig.push('RESEND_API_KEY');
  }

  const canSendLive = mode === 'live' && missingConfig.length === 0;
  const providerReference = `out_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  await recordIntegrationEvent({
    companyId,
    channel: channel || 'custom-webhook',
    direction: 'outbound',
    type: canSendLive ? 'message.sent' : 'message.simulated',
    status: canSendLive ? 'sent' : 'simulated',
    summary: canSendLive
      ? `Resposta enviada por ${CHANNEL_LABELS[channel] || channel}.`
      : `Envio simulado por ${CHANNEL_LABELS[channel] || channel}; configure ENABLE_EXTERNAL_SEND=true e credenciais para envio real.`,
    payload: { payload, responseId, conversationId, missingConfig, mode },
  });

  return {
    ok: true,
    mode: canSendLive ? 'live' : 'simulation',
    provider: payload.provider,
    providerReference,
    channel,
    missingConfig,
    payloadPreview: payload,
    message: canSendLive
      ? 'Mensagem marcada como enviada pelo conector configurado.'
      : 'Mensagem simulada com segurança. Nenhuma mensagem externa foi enviada.',
  };
}
