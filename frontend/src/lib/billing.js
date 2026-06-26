import { agentes, planos } from './agentes';

export const paymentMethods = [
  {
    id: 'pix_manual',
    nome: 'Pix manual',
    status: 'Disponível agora',
    descricao: 'Gera uma solicitação com dados de Pix para pagamento e conferência manual.',
    prazo: 'Confirmação após validação',
    recomendado: true,
  },
  {
    id: 'mercado_pago',
    nome: 'Mercado Pago',
    status: 'Preparado para ativação',
    descricao: 'Cartão, boleto e Pix pelo checkout externo quando o token estiver configurado.',
    prazo: 'Automático quando integrado',
    recomendado: false,
  },
  {
    id: 'stripe',
    nome: 'Stripe',
    status: 'Estrutura futura',
    descricao: 'Assinaturas recorrentes, cartão internacional e billing avançado.',
    prazo: 'Fase de escala',
    recomendado: false,
  },
];

export const commercialPlans = planos.map((plano) => {
  const monthly = plano.preco === 'Sob consulta' ? 0 : Number(plano.preco);
  const setupByPlan = {
    start: 297,
    pro: 497,
    business: 997,
    enterprise: 0,
  };

  return {
    ...plano,
    monthly,
    setup: setupByPlan[plano.slug] ?? 0,
    totalHoje: monthly + (setupByPlan[plano.slug] ?? 0),
    isCustom: plano.preco === 'Sob consulta',
  };
});

export const orderStatuses = [
  { key: 'DRAFT', label: 'Rascunho' },
  { key: 'AWAITING_PAYMENT', label: 'Aguardando pagamento' },
  { key: 'PAYMENT_REVIEW', label: 'Pagamento em análise' },
  { key: 'PAID', label: 'Pago' },
  { key: 'IMPLEMENTATION', label: 'Em implantação' },
  { key: 'ACTIVE', label: 'Ativo' },
  { key: 'CANCELED', label: 'Cancelado' },
];

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

export function formatCents(cents) {
  return formatCurrency(Number(cents || 0) / 100);
}

export function getPaymentMethod(id) {
  return paymentMethods.find((method) => method.id === id) || paymentMethods[0];
}

export function getCommercialPlan(slug) {
  if (!slug) return commercialPlans.find((plan) => plan.slug === 'pro') || commercialPlans[0];
  return commercialPlans.find((plan) => plan.slug === slug) || null;
}

export function getAgentForCheckout(slug) {
  if (!slug) return null;
  return agentes.find((agent) => agent.slug === slug) || null;
}

export function buildCheckoutSummary({ planSlug, agentSlug }) {
  const plan = getCommercialPlan(planSlug) || getCommercialPlan('pro');
  const agent = getAgentForCheckout(agentSlug);

  const setup = agent?.precoAtivacao || plan.setup || 0;
  const monthly = plan.monthly || agent?.preco || 0;
  const totalHoje = plan.isCustom ? 0 : setup + monthly;

  return {
    plan,
    agent,
    setup,
    monthly,
    totalHoje,
    setupCents: Math.round(setup * 100),
    monthlyCents: Math.round(monthly * 100),
    totalCents: Math.round(totalHoje * 100),
    isCustom: plan.isCustom,
  };
}

export function getOrderStatusLabel(status) {
  return orderStatuses.find((item) => item.key === status)?.label || status || 'Aguardando pagamento';
}

export function getPixInstructions() {
  return {
    chave: process.env.NEXT_PUBLIC_PIX_KEY || 'configure-sua-chave-pix@empresa.com',
    favorecido: process.env.NEXT_PUBLIC_PIX_NAME || 'Agentes AI',
    banco: process.env.NEXT_PUBLIC_PIX_BANK || 'Pix manual',
    aviso: 'Após o pagamento, envie o comprovante para o WhatsApp comercial para liberarmos a implantação.',
  };
}
