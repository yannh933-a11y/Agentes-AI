import ContactQuickForm from './ContactQuickForm';
import { Badge, ButtonLink, Card, CheckItem, Container, Pill, Section, SectionTitle } from '../components/ui';

export const metadata = {
  title: 'Contato | Agentes AI',
  description: 'Fale com a Agentes AI para contratar agentes de IA, testar uma demonstração ou solicitar suporte para sua empresa.',
};

const contactPaths = [
  {
    title: 'Quero contratar um agente',
    desc: 'Envie as informações da sua empresa e receba um diagnóstico para atendimento, vendas ou automação.',
    cta: 'Solicitar diagnóstico',
    href: '/pre-cadastro',
    detail: 'Melhor caminho para receber orientação comercial completa.',
  },
  {
    title: 'Quero uma demonstração',
    desc: 'Teste uma simulação de agente antes de decidir qual solução faz mais sentido para sua operação.',
    cta: 'Testar IA Lab',
    href: '/ia-lab',
    detail: 'Ideal para visualizar o valor do agente na prática.',
  },
  {
    title: 'Sou cliente e preciso de suporte',
    desc: 'Acesse a central de suporte para tratar implantação, operação, ajustes e dúvidas sobre agentes ativos.',
    cta: 'Abrir suporte',
    href: '/suporte',
    detail: 'Canal recomendado para empresas já em atendimento.',
  },
];

const contactInfo = [
  ['Comercial', 'Solicitações de contratação e diagnóstico são direcionadas para entender necessidade, canal e complexidade.'],
  ['Demonstração', 'O IA Lab ajuda sua empresa a visualizar como um agente pode responder, vender ou organizar processos.'],
  ['Suporte', 'Clientes podem usar a central dedicada para dúvidas de implantação, ajustes e operação.'],
];

export default function Contato() {
  return (
    <main className="pt-20">
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <Container className="relative py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Badge>Contato comercial e suporte</Badge>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Fale com a <span className="text-gradient-main">Agentes AI</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                Conte o que sua empresa precisa automatizar e vamos indicar o melhor agente de IA para sua operação.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/pre-cadastro">Solicitar diagnóstico</ButtonLink>
                <ButtonLink href="/ia-lab" variant="outline">Testar IA Lab</ButtonLink>
              </div>
            </div>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative">
                <Pill tone="red">Próximo passo recomendado</Pill>
                <h2 className="mt-4 text-2xl font-black">Comece pelo diagnóstico.</h2>
                <p className="mt-3 leading-relaxed text-slate-400">
                  Para contratação, o caminho mais eficiente é preencher o pré-cadastro. Ele coleta empresa, canal, volume e principal problema antes da proposta.
                </p>
                <div className="mt-6 grid gap-3">
                  {contactInfo.map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <h3 className="font-black text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow="Escolha o caminho"
            title="Contato organizado para cada etapa da sua empresa."
            desc="Contratação, demonstração e suporte têm jornadas diferentes. A página agora direciona cada visitante para o próximo passo correto."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {contactPaths.map((item) => (
              <Card key={item.title} className="flex h-full flex-col">
                <h2 className="text-2xl font-black">{item.title}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-slate-400">{item.desc}</p>
                <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs font-bold leading-relaxed text-slate-500">{item.detail}</p>
                <ButtonLink href={item.href} variant={item.href === '/pre-cadastro' ? 'primary' : 'outline'} className="mt-5">
                  {item.cta}
                </ButtonLink>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <Badge>Formulário rápido</Badge>
              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">Envie uma mensagem direta para a equipe.</h2>
              <p className="mt-5 leading-relaxed text-slate-400">
                Use este formulário para dúvidas rápidas, suporte inicial ou solicitações comerciais. Para uma proposta mais precisa, use também o diagnóstico completo.
              </p>

              <Card className="mt-6">
                <h3 className="text-xl font-black">Informações de atendimento</h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>Solicitações comerciais são encaminhadas para diagnóstico e proposta.</CheckItem>
                  <CheckItem>Pedidos de demonstração podem seguir direto para o IA Lab.</CheckItem>
                  <CheckItem>Clientes em operação devem usar a central de suporte para registro mais organizado.</CheckItem>
                </ul>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Tempo de resposta</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    O retorno é feito pelos contatos informados após análise da solicitação. Quando o canal oficial de WhatsApp/e-mail for definido, ele pode ser conectado aqui sem alterar a estrutura da página.
                  </p>
                </div>
              </Card>
            </div>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 border-b border-white/10 pb-6">
                  <h2 className="text-2xl font-black">Fale com a Agentes AI</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">Campos com * são obrigatórios.</p>
                </div>
                <ContactQuickForm />
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Pill tone="red">Conversão principal</Pill>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Quer receber uma orientação mais completa?</h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
                  O pré-cadastro coleta os dados necessários para entender o tipo de agente, canal de atendimento, volume e principal gargalo da empresa.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href="/pre-cadastro">Solicitar diagnóstico</ButtonLink>
                <ButtonLink href="/ia-lab" variant="outline">Testar IA Lab</ButtonLink>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
