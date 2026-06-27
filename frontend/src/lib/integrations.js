import { currentTenant } from './tenant';

export const integrationChannels = [
  {
    key: 'whatsapp',
    label: 'WhatsApp Cloud API',
    category: 'Atendimento e vendas',
    status: 'Preparado',
    priority: 'Crítico',
    provider: 'Meta',
    description: 'Recebe mensagens, envia respostas dos agentes e registra eventos por empresa.',
    useCases: ['Atendimento 24h', 'Qualificação de leads', 'Follow-up comercial', 'Escalação humana'],
    requiredEnv: ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_WEBHOOK_VERIFY_TOKEN'],
    webhookPath: '/api/webhooks/whatsapp',
    docs: 'Configure o webhook na Meta com o token de verificação e a URL pública do Vercel.',
  },
  {
    key: 'instagram',
    label: 'Instagram / Meta DM',
    category: 'Social e captação',
    status: 'Preparado',
    priority: 'Alta',
    provider: 'Meta',
    description: 'Transforma mensagens do Instagram em conversas rastreáveis para agentes de vendas e social media.',
    useCases: ['Responder directs', 'Capturar leads', 'Agendar diagnóstico', 'Enviar para CRM'],
    requiredEnv: ['META_APP_ID', 'META_APP_SECRET', 'INSTAGRAM_WEBHOOK_VERIFY_TOKEN'],
    webhookPath: '/api/webhooks/instagram',
    docs: 'Use uma conta profissional conectada ao Business Manager para receber eventos de direct.',
  },
  {
    key: 'google-calendar',
    label: 'Google Calendar',
    category: 'Agenda e operação',
    status: 'Estrutura pronta',
    priority: 'Alta',
    provider: 'Google',
    description: 'Permite que agentes consultem disponibilidade, criem eventos e enviem confirmações.',
    useCases: ['Agendamento', 'Reagendamento', 'Confirmação automática', 'Redução de faltas'],
    requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    webhookPath: '/api/webhooks/calendar',
    docs: 'A conexão deve ser validada pela operação antes de liberar o canal para uso.',
  },
  {
    key: 'crm',
    label: 'CRM / Webhook comercial',
    category: 'Vendas',
    status: 'Preparado',
    priority: 'Alta',
    provider: 'Webhook',
    description: 'Envia leads qualificados para CRM, planilha, automação ou sistema interno da empresa.',
    useCases: ['Lead qualificado', 'Atualização de etapa', 'Resumo da conversa', 'Tarefa para vendedor'],
    requiredEnv: ['CRM_WEBHOOK_URL'],
    webhookPath: '/api/webhooks/crm',
    docs: 'Funciona com qualquer CRM que aceite webhook HTTP ou automação intermediária como n8n/Make/Zapier.',
  },
  {
    key: 'email',
    label: 'E-mail transacional',
    category: 'Notificações',
    status: 'Preparado',
    priority: 'Média',
    provider: 'Resend/SMTP',
    description: 'Envia resumo de conversa, confirmação de agendamento, alertas e notificações comerciais.',
    useCases: ['Resumo diário', 'Confirmações', 'Avisos internos', 'Notificação de lead quente'],
    requiredEnv: ['RESEND_API_KEY', 'EMAIL_FROM'],
    webhookPath: null,
    docs: 'Use e-mails verificados para evitar bloqueios e melhorar entregabilidade.',
  },
  {
    key: 'custom-webhook',
    label: 'Webhook personalizado',
    category: 'Automação',
    status: 'Preparado',
    priority: 'Média',
    provider: 'HTTP',
    description: 'Permite conectar agentes a sistemas externos sem criar integração específica para cada cliente.',
    useCases: ['n8n', 'Make', 'Zapier', 'ERP', 'Sistemas próprios'],
    requiredEnv: ['WEBHOOK_SIGNING_SECRET'],
    webhookPath: '/api/webhooks/custom',
    docs: 'Eventos devem ser assinados com segredo compartilhado antes de produção.',
  },
];

export const integrationStatusFlow = [
  { key: 'draft', label: 'Rascunho', description: 'Dados coletados, mas sem credenciais.' },
  { key: 'configured', label: 'Configurada', description: 'Credenciais e URL cadastradas.' },
  { key: 'testing', label: 'Em teste', description: 'Recebendo eventos em ambiente controlado.' },
  { key: 'active', label: 'Ativa', description: 'Canal liberado para operação real.' },
  { key: 'paused', label: 'Pausada', description: 'Canal desativado temporariamente.' },
];

export const integrationSecurityChecklist = [
  'Cada evento de canal precisa carregar companyId ou uma chave mapeável para a empresa.',
  'Webhooks externos devem validar token, assinatura ou segredo compartilhado.',
  'Mensagens recebidas nunca podem acessar documentos de outra empresa.',
  'Eventos sensíveis precisam ser registrados em log de auditoria.',
  'Falhas de envio devem gerar fila de retentativa ou alerta operacional.',
  'Credenciais reais ficam apenas em Vercel/Railway, nunca no GitHub.',
];

export const channelEventTypes = [
  'message.received',
  'message.sent',
  'lead.qualified',
  'calendar.event_created',
  'crm.lead_pushed',
  'integration.tested',
  'webhook.failed',
];

export const demoIntegrations = integrationChannels.map((channel, index) => ({
  id: `int-${channel.key}`,
  companyId: currentTenant.id,
  companyName: currentTenant.nome,
  channel: channel.key,
  name: channel.label,
  provider: channel.provider,
  status: index < 2 ? 'active' : index < 4 ? 'testing' : 'configured',
  lastEventAt: index < 2 ? 'Hoje, 11:20' : index < 4 ? 'Ontem, 17:42' : 'Aguardando teste',
  health: index < 2 ? 'Saudável' : index < 4 ? 'Atenção' : 'Pendente',
  events24h: [84, 31, 6, 14, 3, 0][index] || 0,
  latency: ['320ms', '410ms', '680ms', '510ms', '—', '—'][index] || '—',
  webhookPath: channel.webhookPath,
}));

export const demoIntegrationEvents = [
  { id: 'evt-1', companyId: currentTenant.id, channel: 'whatsapp', direction: 'inbound', type: 'message.received', status: 'processed', summary: 'Cliente perguntou preço do plano Pro.', createdAt: 'Hoje, 11:20' },
  { id: 'evt-2', companyId: currentTenant.id, channel: 'whatsapp', direction: 'outbound', type: 'message.sent', status: 'sent', summary: 'Agente respondeu com diagnóstico e CTA.', createdAt: 'Hoje, 11:20' },
  { id: 'evt-3', companyId: currentTenant.id, channel: 'instagram', direction: 'inbound', type: 'lead.qualified', status: 'processed', summary: 'Lead vindo de direct qualificado para vendas.', createdAt: 'Hoje, 10:42' },
  { id: 'evt-4', companyId: currentTenant.id, channel: 'crm', direction: 'outbound', type: 'crm.lead_pushed', status: 'queued', summary: 'Resumo enviado para CRM externo.', createdAt: 'Ontem, 17:42' },
  { id: 'evt-5', companyId: currentTenant.id, channel: 'google-calendar', direction: 'outbound', type: 'calendar.event_created', status: 'processed', summary: 'Diagnóstico comercial agendado.', createdAt: 'Ontem, 16:10' },
];

export function getIntegrationChannel(key) {
  return integrationChannels.find((channel) => channel.key === key) || integrationChannels[0];
}

export function getWebhookUrl(path, origin = 'https://agentes-ai-two.vercel.app') {
  if (!path) return 'Sem webhook público';
  return `${origin}${path}`;
}
