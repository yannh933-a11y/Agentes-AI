import { agentes } from './agentes';
import { currentTenant } from './tenant';

export const aiProviders = [
  { key: 'anthropic', label: 'Anthropic Claude', status: process.env.ANTHROPIC_API_KEY ? 'Configurado' : 'Pendente', env: 'ANTHROPIC_API_KEY' },
  { key: 'openai', label: 'OpenAI', status: process.env.OPENAI_API_KEY ? 'Configurado' : 'Pendente', env: 'OPENAI_API_KEY' },
  { key: 'groq', label: 'Groq', status: process.env.GROQ_API_KEY ? 'Configurado' : 'Pendente', env: 'GROQ_API_KEY' },
  { key: 'demo', label: 'Modo demo seguro', status: 'Ativo', env: 'sem chave' },
];

export const agentOperatingModes = [
  { key: 'draft', label: 'Rascunho', description: 'Agente em configuração, sem contato com clientes reais.' },
  { key: 'assisted', label: 'Operação assistida', description: 'IA responde, mas casos sensíveis são revisados por humano.' },
  { key: 'live', label: 'Ao vivo', description: 'Agente atende clientes dentro dos limites definidos.' },
];

export const knowledgeDocuments = [
  {
    id: 'kb_demo_faq_comercial',
    companyId: currentTenant.id,
    agentSlug: 'atendimento',
    title: 'FAQ comercial da empresa',
    type: 'FAQ',
    status: 'PUBLISHED',
    priority: 'Alta',
    tags: ['atendimento', 'vendas', 'site'],
    updatedAt: 'Hoje, 09:30',
    content: `A empresa atende de segunda a sexta, das 8h às 18h. Para contratação de agentes, o cliente deve escolher um plano, informar segmento, canal desejado e principal problema. O plano Pro é recomendado para empresas que querem atendimento e vendas com base de conhecimento própria.`,
  },
  {
    id: 'kb_demo_planos',
    companyId: currentTenant.id,
    agentSlug: 'vendas',
    title: 'Tabela de planos e implantação',
    type: 'Comercial',
    status: 'PUBLISHED',
    priority: 'Alta',
    tags: ['planos', 'preços', 'contratação'],
    updatedAt: 'Ontem, 18:20',
    content: `Start é indicado para operação inicial. Pro é indicado para empresas que precisam de base própria, WhatsApp e melhoria comercial. Business é indicado para múltiplos agentes, integrações e operação mais avançada. Enterprise é sob contrato para empresas que precisam de white label, SLA e integrações específicas.`,
  },
  {
    id: 'kb_demo_escalacao',
    companyId: currentTenant.id,
    agentSlug: 'atendimento',
    title: 'Regras de escalação humana',
    type: 'Segurança',
    status: 'REVIEW',
    priority: 'Crítica',
    tags: ['segurança', 'limites', 'humano'],
    updatedAt: 'Em revisão',
    content: `O agente deve encaminhar para humano quando o cliente pedir desconto fora da política, reclamar de cobrança, solicitar dados sensíveis, ameaçar cancelar ou pedir informações que não existam na base. Nunca inventar valores, prazos ou garantias.`,
  },
  {
    id: 'kb_demo_tom_voz',
    companyId: currentTenant.id,
    agentSlug: 'vendas',
    title: 'Tom de voz e abordagem de vendas',
    type: 'Prompt',
    status: 'PUBLISHED',
    priority: 'Média',
    tags: ['tom de voz', 'vendas', 'qualificação'],
    updatedAt: '2 dias atrás',
    content: `O agente deve ser direto, educado e consultivo. Deve fazer no máximo uma pergunta por vez, evitar respostas longas, sempre buscar entender o problema da empresa antes de sugerir plano e finalizar com uma próxima ação clara.`,
  },
];

export const promptBlueprints = {
  atendimento: {
    goal: 'Responder dúvidas, orientar clientes e encaminhar situações sensíveis para a equipe humana.',
    tone: 'Claro, cordial, direto e seguro.',
    limits: ['Não inventar informações', 'Não prometer desconto', 'Não tratar dados sensíveis sem validação', 'Escalar quando não houver resposta na base'],
  },
  vendas: {
    goal: 'Qualificar leads, entender necessidade, sugerir o plano mais adequado e gerar próxima ação comercial.',
    tone: 'Consultivo, objetivo e confiante.',
    limits: ['Não pressionar o lead', 'Não criar preços fora da tabela', 'Não prometer integrações não listadas', 'Encaminhar contrato para humano'],
  },
  suporte: {
    goal: 'Diagnosticar problemas, coletar contexto e direcionar para solução ou equipe responsável.',
    tone: 'Calmo, técnico na medida certa e resolutivo.',
    limits: ['Não pedir senha', 'Não expor dados internos', 'Não alterar conta sem autorização', 'Registrar histórico'],
  },
};

export const aiQualityChecklist = [
  'Resposta baseada apenas na base da empresa atual.',
  'Uma pergunta por vez quando estiver qualificando lead.',
  'Não inventar preços, prazos, disponibilidade ou políticas.',
  'Escalar para humano quando houver risco comercial, financeiro, legal ou de reputação.',
  'Registrar resumo da conversa e próxima ação.',
  'Nunca misturar documentos de empresas diferentes.',
];

export function getAgentAiProfile(agentSlug = 'atendimento') {
  const agent = agentes.find((item) => item.slug === agentSlug) || agentes[0];
  const blueprint = promptBlueprints[agentSlug] || promptBlueprints.atendimento;
  const docs = knowledgeDocuments.filter((doc) => !doc.agentSlug || doc.agentSlug === agentSlug || doc.agentSlug === 'atendimento');

  return {
    companyId: currentTenant.id,
    companyName: currentTenant.nome,
    agent,
    blueprint,
    documents: docs,
    systemPrompt: buildSystemPrompt({ company: currentTenant, agent, blueprint, documents: docs }),
  };
}

export function buildSystemPrompt({ company = currentTenant, agent, blueprint, documents = [] }) {
  const context = documents
    .filter((doc) => doc.status === 'PUBLISHED')
    .map((doc, index) => `[Documento ${index + 1}: ${doc.title}]\n${doc.content}`)
    .join('\n\n');

  return `Você é ${agent?.nome || 'Agente de IA'}, um agente exclusivo da empresa ${company.nome}.\n\nObjetivo: ${blueprint.goal}\nTom de voz: ${blueprint.tone}\n\nRegras obrigatórias:\n- Use apenas informações da base da empresa atual.\n- Se não souber, diga que precisa confirmar com a equipe.\n- Não invente preço, prazo, contrato, desconto, disponibilidade ou regra.\n- Faça perguntas curtas e uma de cada vez.\n- Quando detectar caso sensível, encaminhe para humano.\n\nLimites específicos:\n${blueprint.limits.map((item) => `- ${item}`).join('\n')}\n\nBase de conhecimento disponível:\n${context || 'Nenhum documento publicado encontrado. Responda com cautela e peça confirmação humana.'}`;
}

export function findRelevantKnowledge(message = '', documents = knowledgeDocuments, limit = 3) {
  const normalized = String(message).toLowerCase();
  const tokens = normalized.split(/\s+/).filter((word) => word.length > 3);
  return documents
    .map((doc) => {
      const haystack = `${doc.title} ${doc.type} ${doc.tags?.join(' ')} ${doc.content}`.toLowerCase();
      const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0) + (doc.status === 'PUBLISHED' ? 0.5 : 0);
      return { ...doc, relevance: score };
    })
    .filter((doc) => doc.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}
