export const companies = [
  {
    id: 'cmp-demo-prime',
    slug: 'clinica-prime',
    nome: 'Clínica Prime',
    razaoSocial: 'Clínica Prime Saúde Integrada Ltda.',
    segmento: 'Clínicas e saúde',
    tamanho: '21–50 colaboradores',
    plano: 'Pro',
    status: 'Ativa',
    billingStatus: 'Em dia',
    etapaImplantacao: 'Operação assistida',
    responsavel: 'Fernanda Lima',
    email: 'contato@clinicaprime.com.br',
    whatsapp: '(31) 99999-1001',
    dominio: 'clinicaprime.com.br',
    isolamento: 'tenant_cmp_demo_prime',
    canais: ['WhatsApp', 'Site', 'Google Calendar'],
    createdAt: '2026-06-01',
  },
  {
    id: 'cmp-bh-auto',
    slug: 'auto-pecas-bh',
    nome: 'Auto Peças BH',
    razaoSocial: 'BH Auto Peças Comércio Ltda.',
    segmento: 'Varejo e autopeças',
    tamanho: '11–20 colaboradores',
    plano: 'Business',
    status: 'Implantação',
    billingStatus: 'Aguardando ativação',
    etapaImplantacao: 'Base de conhecimento',
    responsavel: 'Rafael Souza',
    email: 'rafael@autopecasbh.com.br',
    whatsapp: '(31) 98888-2040',
    dominio: 'autopecasbh.com.br',
    isolamento: 'tenant_cmp_bh_auto',
    canais: ['WhatsApp', 'Instagram', 'CRM'],
    createdAt: '2026-06-08',
  },
  {
    id: 'cmp-studio-prime',
    slug: 'studio-prime',
    nome: 'Studio Prime',
    razaoSocial: 'Studio Prime Beleza e Estética Ltda.',
    segmento: 'Estética e serviços locais',
    tamanho: '1–10 colaboradores',
    plano: 'Start',
    status: 'Lead qualificado',
    billingStatus: 'Sem cobrança ativa',
    etapaImplantacao: 'Diagnóstico comercial',
    responsavel: 'Luiza Martins',
    email: 'luiza@studioprime.com.br',
    whatsapp: '(31) 97777-8821',
    dominio: 'studioprime.com.br',
    isolamento: 'tenant_cmp_studio_prime',
    canais: ['Instagram', 'WhatsApp'],
    createdAt: '2026-06-14',
  },
];

export const currentTenant = companies[0];

export const tenantUsers = [
  { id: 'usr-owner', companyId: 'cmp-demo-prime', nome: 'Fernanda Lima', email: 'fernanda@clinicaprime.com.br', role: 'OWNER', status: 'Ativa' },
  { id: 'usr-admin', companyId: 'cmp-demo-prime', nome: 'Camila Rocha', email: 'camila@clinicaprime.com.br', role: 'ADMIN', status: 'Ativa' },
  { id: 'usr-member', companyId: 'cmp-demo-prime', nome: 'Equipe Recepção', email: 'recepcao@clinicaprime.com.br', role: 'MEMBER', status: 'Limitada' },
];

export const tenantArchitecture = [
  { camada: 'Company', descricao: 'Dona de todos os dados e limite principal de isolamento.', status: 'Modelado' },
  { camada: 'Users', descricao: 'Usuários pertencem a uma empresa e recebem papéis específicos.', status: 'Modelado' },
  { camada: 'Agents', descricao: 'Cada agente pertence a uma empresa e possui prompt, canais e regras próprias.', status: 'Modelado' },
  { camada: 'Knowledge Base', descricao: 'Documentos ficam vinculados à empresa e opcionalmente a um agente.', status: 'Modelado' },
  { camada: 'Chats', descricao: 'Conversas sempre carregam companyId e agentId para evitar mistura de dados.', status: 'Modelado' },
  { camada: 'Messages', descricao: 'Mensagens herdam o contexto da conversa e preservam trilha de auditoria.', status: 'Modelado' },
];

export const isolationChecklist = [
  'Toda consulta de dashboard deverá receber companyId.',
  'Todo agente terá chave única por empresa: companyId + slug.',
  'Documentos de conhecimento não poderão ser buscados sem companyId.',
  'Conversas e mensagens ficam separadas por empresa desde a criação.',
  'Admin enxerga todas as empresas; cliente enxerga apenas a própria.',
  'Eventos críticos serão registrados em audit_logs para rastreabilidade.',
];

export const auditEvents = [
  { when: 'Hoje, 10:42', actor: 'Fernanda Lima', action: 'Atualizou base de conhecimento', scope: 'Clínica Prime', severity: 'Normal' },
  { when: 'Hoje, 09:18', actor: 'Agente de Atendimento', action: 'Escalou conversa para humano', scope: 'Clínica Prime', severity: 'Atenção' },
  { when: 'Ontem, 17:54', actor: 'Admin Agentes AI', action: 'Criou agente de vendas', scope: 'Auto Peças BH', severity: 'Normal' },
  { when: 'Ontem, 14:20', actor: 'Sistema', action: 'Bloqueou acesso sem companyId', scope: 'Global', severity: 'Segurança' },
];

export const tenantMetrics = [
  { label: 'Empresas mapeadas', value: '3', detail: 'modelo multiempresa preparado' },
  { label: 'Agentes isolados', value: '9', detail: 'companyId + agentId' },
  { label: 'Bases separadas', value: '12', detail: 'documentos por empresa' },
  { label: 'Eventos auditáveis', value: '4', detail: 'trilha inicial criada' },
];

export function getCompanyBySlug(slug) {
  return companies.find((company) => company.slug === slug) || currentTenant;
}

export function getTenantLabel(company = currentTenant) {
  return `${company.nome} • ${company.plano} • ${company.status}`;
}
