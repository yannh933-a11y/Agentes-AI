import Link from 'next/link';
import { Badge, ButtonLink, Card, CheckItem, Container, Pill, Section } from '../components/ui';

export const metadata = {
  title: 'Termos de Uso | Agentes AI',
  description: 'Conheça as condições de uso, limites dos agentes de IA, responsabilidades, suporte, contratação e cancelamento da Agentes AI.',
};

const termsTopics = [
  {
    title: '1. Descrição do serviço',
    body: [
      'A Agentes AI fornece soluções de agentes de inteligência artificial para empresas, incluindo demonstrações, configuração, personalização, operação assistida, suporte e recursos relacionados a atendimento, vendas, suporte, documentos, agendamento e automação de processos.',
      'As funcionalidades disponíveis podem variar conforme o plano contratado, estágio de implantação, integrações configuradas e necessidades específicas da empresa cliente.',
    ],
  },
  {
    title: '2. Como funcionam os agentes de IA',
    body: [
      'Os agentes de IA são configurados com base em informações fornecidas pela empresa, como perguntas frequentes, regras comerciais, documentos, instruções de atendimento, fluxos de conversa e limites de atuação.',
      'As respostas podem ser geradas automaticamente, simuladas em ambiente demonstrativo ou encaminhadas para revisão humana, conforme a configuração do projeto e o nível de risco da interação.',
    ],
  },
  {
    title: '3. Limitações dos agentes',
    body: [
      'Agentes de IA podem interpretar informações de forma incompleta, gerar respostas imprecisas ou depender de dados desatualizados quando a base de conhecimento fornecida pela empresa não estiver correta ou atualizada.',
      'A Agentes AI não garante resultado comercial específico, aumento obrigatório de vendas, redução absoluta de custos ou funcionamento sem falhas em todos os cenários.',
    ],
  },
  {
    title: '4. Responsabilidade do cliente',
    body: [
      'A empresa cliente é responsável por fornecer informações corretas, revisar conteúdos estratégicos, validar regras comerciais, indicar limites de resposta e manter atualizados os documentos e orientações usados pelos agentes.',
      'Também cabe ao cliente garantir que o uso do agente respeite leis, contratos, políticas internas, direitos de terceiros e obrigações relacionadas ao setor em que atua.',
    ],
  },
  {
    title: '5. Validação humana em casos sensíveis',
    body: [
      'Agentes de IA não devem substituir completamente análise humana em situações sensíveis, críticas, jurídicas, financeiras, médicas, emergenciais, regulatórias ou que possam gerar impacto relevante para pessoas ou empresas.',
      'Nesses casos, a empresa deve manter revisão humana, canais de escalonamento e critérios claros para quando o agente deve limitar a resposta, orientar contato com um responsável ou encaminhar a conversa para atendimento humano.',
    ],
  },
  {
    title: '6. Uso aceitável',
    body: [
      'O serviço deve ser usado para finalidades lícitas, profissionais e compatíveis com a proposta contratada.',
      'É proibido usar a plataforma para fraude, spam, coleta indevida de dados, violação de direitos, manipulação enganosa, atividades ilegais, abuso de sistemas, tentativa de acesso não autorizado ou qualquer finalidade que comprometa a segurança de terceiros ou da própria plataforma.',
    ],
  },
  {
    title: '7. Pagamento e contratação',
    body: [
      'Planos, valores, escopo de implantação, prazo, canais, quantidade de agentes, suporte e recursos incluídos são definidos na proposta, página de planos, checkout ou comunicação comercial aplicável.',
      'Recursos adicionais, integrações específicas, personalizações avançadas e demandas fora do escopo podem exigir nova análise, prazo próprio e cobrança complementar.',
    ],
  },
  {
    title: '8. Cancelamento',
    body: [
      'A contratação pode ser cancelada conforme as condições informadas no plano, proposta ou canal de contratação utilizado.',
      'Após o cancelamento, acessos, agentes, integrações e recursos operacionais podem ser suspensos, respeitando prazos técnicos necessários para encerramento, retenção de dados ou cumprimento de obrigações aplicáveis.',
    ],
  },
  {
    title: '9. Suporte',
    body: [
      'O suporte pode abranger dúvidas de uso, ajustes de agente, orientações operacionais, acompanhamento de implantação e análise de falhas reportadas pelo cliente.',
      'O nível de suporte, prioridade, canal de atendimento e prazo de resposta podem variar conforme o plano contratado e a complexidade da solicitação.',
    ],
  },
  {
    title: '10. Limitação de responsabilidade',
    body: [
      'A Agentes AI atua para entregar uma plataforma útil, segura e adequada à operação contratada, mas não se responsabiliza por decisões tomadas exclusivamente com base em respostas automatizadas sem validação humana quando ela for necessária.',
      'Também não nos responsabilizamos por prejuízos decorrentes de dados incorretos fornecidos pelo cliente, uso inadequado do serviço, falhas de terceiros, indisponibilidades externas, integrações mal configuradas ou descumprimento destes termos.',
    ],
  },
  {
    title: '11. Alterações nos termos',
    body: [
      'Estes termos podem ser atualizados para refletir mudanças na plataforma, no modelo comercial, nas integrações, em requisitos operacionais ou em obrigações aplicáveis.',
      'A versão mais recente ficará disponível nesta página. O uso contínuo do site, da plataforma ou dos serviços após atualizações representa ciência das condições vigentes.',
    ],
  },
];

const summaryItems = [
  'Os agentes são configurados com base em dados e regras fornecidos pela empresa cliente.',
  'IA não deve substituir validação humana em situações sensíveis ou de alto impacto.',
  'Resultados comerciais dependem de contexto, operação, qualidade dos dados e uso correto da solução.',
  'Planos, suporte e recursos podem variar conforme a contratação realizada.',
];

function LegalSection({ title, body }) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="text-xl font-black text-white sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}

export default function Termos() {
  return (
    <main className="pt-20">
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <Container className="relative py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Badge>Condições comerciais e operacionais</Badge>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Termos de <span className="text-gradient-main">Uso</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                Estes termos organizam as principais condições para uso do site, demonstrações, contratação e operação dos agentes de IA oferecidos pela Agentes AI.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/pre-cadastro">Solicitar diagnóstico</ButtonLink>
                <ButtonLink href="/privacidade" variant="outline">Ver privacidade</ButtonLink>
              </div>
              <p className="mt-5 text-sm font-bold text-slate-500">Última atualização: junho de 2026</p>
            </div>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative">
                <Pill tone="red">Resumo dos limites</Pill>
                <h2 className="mt-4 text-2xl font-black">IA com responsabilidade operacional.</h2>
                <p className="mt-3 leading-relaxed text-slate-400">
                  Os agentes ajudam a automatizar atendimento, vendas e processos, mas devem ser configurados com bons dados, limites claros e revisão humana quando necessário.
                </p>
                <ul className="mt-6 space-y-3">
                  {summaryItems.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-5xl">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Serviço</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Agentes de IA configurados para empresas, canais e fluxos específicos.</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Responsabilidade</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Dados corretos, regras claras e validação humana em casos sensíveis.</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Contratação</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Escopo, planos, suporte e recursos definidos conforme proposta ou plano contratado.</p>
            </Card>
          </div>

          <div className="space-y-5">
            {termsTopics.map((topic) => (
              <LegalSection key={topic.title} title={topic.title} body={topic.body} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container className="max-w-5xl">
          <Card className="overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Pill tone="red">Contratação consciente</Pill>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Quer entender o melhor agente para sua empresa?</h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
                  O pré-cadastro ajuda a mapear canal, volume de atendimento, tipo de agente e nível de complexidade antes da proposta.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href="/pre-cadastro">Solicitar diagnóstico</ButtonLink>
                <Link href="/contato" className="btn-outline inline-flex items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-bold no-underline">
                  Falar com a equipe
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
