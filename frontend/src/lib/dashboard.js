import { agentes, planos } from './agentes';
import { companies, currentTenant } from './tenant';

export const empresaDemo = {
  nome: currentTenant.nome,
  segmento: currentTenant.segmento,
  plano: currentTenant.plano,
  status: currentTenant.etapaImplantacao,
  responsavel: currentTenant.responsavel,
  uso: `Ambiente isolado: ${currentTenant.isolamento}`,
};

export const dashboardStats = [
  { label: 'Agentes ativos', value: '3', change: 'todos vinculados à empresa atual', tone: 'red' },
  { label: 'Conversas no mês', value: '184', change: 'filtradas por companyId', tone: 'green' },
  { label: 'Leads capturados', value: '47', change: '18 qualificados para vendas', tone: 'blue' },
  { label: 'Resolvidos pela IA', value: '92%', change: 'sem intervenção humana', tone: 'purple' },
];

export const agentesContratados = [
  {
    ...agentes.find((a) => a.slug === 'atendimento'),
    companyId: currentTenant.id,
    tenantSlug: currentTenant.slug,
    status: 'Ativo',
    canais: ['Site', 'WhatsApp'],
    conversas: 96,
    resolucao: '94%',
    ultimaAtualizacao: 'Hoje, 09:42',
    qualidade: 'Alta',
    prompt: 'Responder dúvidas, qualificar intenção e encaminhar casos sensíveis para a equipe humana.',
    base: 'FAQ comercial, horários, especialidades, preços e regras de atendimento.',
  },
  {
    ...agentes.find((a) => a.slug === 'vendas'),
    companyId: currentTenant.id,
    tenantSlug: currentTenant.slug,
    status: 'Ativo',
    canais: ['Site', 'Instagram'],
    conversas: 61,
    resolucao: '88%',
    ultimaAtualizacao: 'Ontem, 18:20',
    qualidade: 'Alta',
    prompt: 'Qualificar leads, identificar necessidade, sugerir plano e registrar oportunidade comercial.',
    base: 'Planos, objeções comerciais, diferenciais, roteiro de diagnóstico e propostas.',
  },
  {
    ...agentes.find((a) => a.slug === 'agendamento'),
    companyId: currentTenant.id,
    tenantSlug: currentTenant.slug,
    status: 'Em implantação',
    canais: ['Google Calendar'],
    conversas: 27,
    resolucao: '91%',
    ultimaAtualizacao: 'Em revisão',
    qualidade: 'Média',
    prompt: 'Encontrar horários disponíveis, confirmar dados e reduzir faltas com lembretes.',
    base: 'Agenda, regras de reagendamento, horários disponíveis e políticas de confirmação.',
  },
].filter(Boolean);

export const agentesPorEmpresa = companies.map((company, index) => ({
  companyId: company.id,
  company: company.nome,
  plano: company.plano,
  agentes: [
    { nome: 'Agente de Atendimento', status: index === 2 ? 'Planejado' : 'Ativo', canais: company.canais.slice(0, 2) },
    { nome: index === 1 ? 'Agente de Vendas' : 'Agente de Agendamento', status: company.status === 'Lead qualificado' ? 'Aguardando contrato' : 'Em implantação', canais: company.canais.slice(-2) },
  ],
}));

export const conversasDemo = [
  {
    companyId: currentTenant.id,
    cliente: 'Mariana Alves',
    canal: 'WhatsApp',
    agente: 'Agente de Vendas',
    etapa: 'Lead qualificado',
    resumo: 'Cliente quer automatizar atendimento e pediu proposta do plano Pro.',
    sentimento: 'Quente',
    horario: '10:48',
  },
  {
    companyId: currentTenant.id,
    cliente: 'Clínica Prime',
    canal: 'Site',
    agente: 'Agente de Atendimento',
    etapa: 'Dúvida resolvida',
    resumo: 'Perguntou sobre funcionamento, implantação e integração com WhatsApp.',
    sentimento: 'Neutro',
    horario: '09:31',
  },
  {
    companyId: currentTenant.id,
    cliente: 'Academia Fit Center',
    canal: 'Instagram',
    agente: 'Agente de Agendamento',
    etapa: 'Reunião marcada',
    resumo: 'Agendou diagnóstico para amanhã e confirmou telefone de contato.',
    sentimento: 'Quente',
    horario: 'Ontem',
  },
  {
    companyId: currentTenant.id,
    cliente: 'João Martins',
    canal: 'WhatsApp',
    agente: 'Agente Financeiro',
    etapa: 'Encaminhado',
    resumo: 'Solicitou segunda via e foi encaminhado para validação financeira.',
    sentimento: 'Atenção',
    horario: 'Ontem',
  },
];

export const documentosDemo = [
  { companyId: currentTenant.id, nome: 'FAQ comercial', tipo: 'Base de conhecimento', agente: 'Atendimento', status: 'Publicado', tamanho: '24 respostas', escopo: currentTenant.nome },
  { companyId: currentTenant.id, nome: 'Tabela de planos', tipo: 'Documento comercial', agente: 'Vendas', status: 'Publicado', tamanho: '4 planos', escopo: currentTenant.nome },
  { companyId: currentTenant.id, nome: 'Política de atendimento', tipo: 'Regras internas', agente: 'Atendimento', status: 'Em revisão', tamanho: '12 regras', escopo: currentTenant.nome },
  { companyId: currentTenant.id, nome: 'Script de qualificação', tipo: 'Roteiro', agente: 'Vendas', status: 'Publicado', tamanho: '9 perguntas', escopo: currentTenant.nome },
];

export const tarefasImplantacao = [
  { title: 'Diagnóstico comercial', status: 'Concluído', progress: 100 },
  { title: 'Base de conhecimento inicial', status: 'Concluído', progress: 100 },
  { title: 'Tom de voz da marca', status: 'Em revisão', progress: 70 },
  { title: 'Integração com canal principal', status: 'Pendente', progress: 35 },
];

export const adminStats = [
  { label: 'Empresas cadastradas', value: String(companies.length), detail: 'tenant registry inicial' },
  { label: 'Leads recebidos', value: '126', detail: '31 nos últimos 7 dias' },
  { label: 'Empresas em implantação', value: '14', detail: '5 aguardando diagnóstico' },
  { label: 'MRR projetado', value: 'R$ 12,4k', detail: 'com base nos planos ativos' },
];

export const leadsAdmin = [
  { empresa: 'Clínica Norte', contato: 'Fernanda', agente: 'Atendimento', plano: 'Pro', status: 'Novo lead', valor: 'R$ 397/mês' },
  { empresa: 'Auto Peças BH', contato: 'Rafael', agente: 'Vendas', plano: 'Business', status: 'Proposta', valor: 'R$ 797/mês' },
  { empresa: 'Escola Alfa', contato: 'Camila', agente: 'Cobrança', plano: 'Business', status: 'Diagnóstico', valor: 'R$ 797/mês' },
  { empresa: 'Studio Prime', contato: 'Luiza', agente: 'Social Media', plano: 'Start', status: 'Contato inicial', valor: 'R$ 197/mês' },
];

export const receitaPorPlano = planos.map((plano, index) => ({
  plano: plano.nome,
  clientes: [18, 12, 7, 2][index] || 0,
  receita: ['R$ 3.546', 'R$ 4.764', 'R$ 5.579', 'Sob contrato'][index],
}));
