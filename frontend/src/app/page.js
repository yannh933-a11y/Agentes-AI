import Link from 'next/link';
import { agentes } from '../lib/agentes';
import DemoChat from './components/DemoChat';

const segmentos = ['Clínicas', 'Barbearias', 'Lojas', 'Academias', 'Restaurantes', 'Cursos', 'Imobiliárias', 'Consultórios'];

const beneficios = [
  ['Agente exclusivo por empresa', 'Cada cliente recebe um agente configurado com dados, regras, linguagem e objetivo do próprio negócio.'],
  ['Tudo no mesmo chat', 'A empresa usa o agente em um ambiente simples, sem precisar aprender ferramentas complexas.'],
  ['Atendimento e vendas 24h', 'O agente responde dúvidas, qualifica interessados, agenda horários e encaminha oportunidades.'],
  ['Implantação guiada', 'O processo é estruturado: coleta de informações, treinamento, teste, ativação e acompanhamento.'],
];

const processo = [
  ['01', 'Diagnóstico', 'Entendemos o tipo de empresa, principais dúvidas dos clientes, serviços, preços e regras de atendimento.'],
  ['02', 'Configuração', 'Criamos o agente exclusivo, treinado com as informações e tom de voz da empresa.'],
  ['03', 'Validação', 'Testamos respostas, fluxos de venda, agendamento e limites antes de colocar em operação.'],
  ['04', 'Operação', 'A empresa começa a usar o agente no chat, com suporte e melhorias contínuas.'],
];

const comparacao = [
  ['Resposta ao cliente', 'Horas ou dias depois', 'Em segundos, 24h por dia'],
  ['Padronização', 'Cada pessoa responde de um jeito', 'Respostas alinhadas à empresa'],
  ['Vendas', 'Leads esquecidos no WhatsApp', 'Leads qualificados e encaminhados'],
  ['Escala', 'Depende de contratar mais gente', 'Atende múltiplos clientes ao mesmo tempo'],
];

const faqs = [
  ['O agente é igual para todas as empresas?', 'Não. A estrutura pode ser a mesma, mas cada empresa recebe um agente configurado com suas informações, serviços, regras e forma de atendimento.'],
  ['Preciso saber programação?', 'Não. A proposta é a empresa usar o agente pelo chat, de forma simples e prática.'],
  ['Serve para qual tipo de negócio?', 'Serve principalmente para empresas que recebem muitas perguntas repetidas, precisam qualificar clientes, vender, agendar ou prestar suporte.'],
  ['O agente substitui funcionários?', 'Ele reduz tarefas repetitivas e libera tempo da equipe. Casos importantes podem ser encaminhados para atendimento humano.'],
];

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-14">
      <span className="badge-red mb-4">{eyebrow}</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">{title}</h2>
      {description && <p className="text-slate-400 text-base sm:text-lg mt-5 leading-relaxed">{description}</p>}
    </div>
  );
}

function AgentIcon({ label }) {
  return (
    <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-300 font-black">
      {label.slice(0, 1)}
    </div>
  );
}

export default function Home() {
  return (
    <main className="pt-[72px] overflow-hidden">
      <section className="hero-glow relative min-h-[92vh] flex items-center px-5 sm:px-8 py-20">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)', backgroundSize: '64px 64px'}} />
        <div className="absolute -top-40 right-[-10%] w-[680px] h-[680px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[580px] h-[580px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 mb-7">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-slate-300 font-semibold">Agentes exclusivos de IA para empresas</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.03] mb-6">
              Venda, atenda e agende com um <span className="text-gradient-main">agente próprio</span> no chat da sua empresa.
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mb-5">
              A OpenClaw cria agentes de IA exclusivos para cada empresa. O cliente usa no mesmo chat, mas o agente trabalha com as informações, regras e objetivos daquele negócio.
            </p>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mb-9">
              Ideal para negócios que querem responder mais rápido, perder menos leads e automatizar tarefas repetitivas sem montar uma equipe técnica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/agentes" className="btn-primary rounded-full px-8 py-4 text-center font-bold no-underline">Ver agentes disponíveis</Link>
              <Link href="/pre-cadastro" className="btn-outline rounded-full px-8 py-4 text-center font-bold no-underline">Quero um agente exclusivo</Link>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {[
                ['24h', 'atendimento'],
                ['1:1', 'por empresa'],
                ['0', 'programação'],
              ].map(([num, label]) => (
                <div key={label} className="card rounded-2xl p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-black text-white">{num}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
            <div className="card rounded-[32px] p-5 sm:p-6 relative shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white font-black text-lg">Console OpenClaw</p>
                  <p className="text-slate-500 text-sm">Agente exclusivo em operação</p>
                </div>
                <span className="badge-green">Online</span>
              </div>

              <div className="rounded-3xl bg-[#05050d] border border-white/10 p-4 space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">CL</div>
                  <div className="bg-white/[0.055] rounded-2xl rounded-tl-sm p-3 text-sm text-slate-300 max-w-[80%]">Vocês têm horário amanhã às 18h?</div>
                </div>
                <div className="flex gap-3 items-start justify-end">
                  <div className="bg-red-500/15 border border-red-500/20 rounded-2xl rounded-tr-sm p-3 text-sm text-slate-100 max-w-[84%]">Tenho sim. Posso confirmar amanhã às 18h com o profissional Marcos. Deseja agendar?</div>
                  <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-xs font-black">OC</div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {['Lead qualificado', 'Agenda consultada', 'Resposta aprovada', 'Próxima ação definida'].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 mb-2" />
                      <p className="text-xs text-slate-400 font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-5 sm:px-8 section-alt">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-600 text-xs font-bold uppercase tracking-[4px] mb-7">Projetado para empresas que dependem de atendimento rápido</p>
          <div className="flex flex-wrap justify-center gap-3">
            {segmentos.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-slate-400 font-semibold">{item}</span>)}
          </div>
        </div>
      </section>

      <DemoChat />

      <section className="py-20 sm:py-28 px-5 sm:px-8 section-dark">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Posicionamento" title="Não é só um robô genérico. É um agente treinado para cada empresa." description="A proposta central do produto é transformar conhecimento do negócio em atendimento automático, confiável e fácil de usar." />
          <div className="grid md:grid-cols-2 gap-5">
            {beneficios.map(([title, desc]) => (
              <div key={title} className="card hover-lift rounded-3xl p-7">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5 flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                </div>
                <h3 className="text-xl font-black mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Como funciona" title="Da ideia ao agente operando em quatro etapas." description="Um processo simples para a empresa sair do atendimento manual repetitivo e começar a operar com IA." />
          <div className="grid md:grid-cols-4 gap-4">
            {processo.map(([num, title, desc]) => (
              <div key={title} className="card rounded-3xl p-6 relative overflow-hidden">
                <p className="text-red-400 font-black text-sm mb-8">{num}</p>
                <h3 className="text-lg font-black mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Impacto" title="O que muda quando a empresa tem um agente próprio." />
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
            <div className="grid grid-cols-3 bg-white/[0.04] text-xs sm:text-sm font-bold text-slate-300">
              <div className="p-4 sm:p-5">Área</div>
              <div className="p-4 sm:p-5 border-l border-white/10">Sem agente</div>
              <div className="p-4 sm:p-5 border-l border-white/10 text-red-300">Com OpenClaw</div>
            </div>
            {comparacao.map(([area, sem, com]) => (
              <div key={area} className="grid grid-cols-3 border-t border-white/10 text-sm">
                <div className="p-4 sm:p-5 text-white font-bold">{area}</div>
                <div className="p-4 sm:p-5 border-l border-white/10 text-slate-500">{sem}</div>
                <div className="p-4 sm:p-5 border-l border-white/10 text-slate-300">{com}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Agentes" title="Escolha o agente inicial e evolua conforme a empresa crescer." description="Você pode começar com um agente específico e depois ampliar para atendimento, vendas, agenda, suporte e e-mails." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentes.map((agente) => (
              <Link key={agente.slug} href={`/agentes/${agente.slug}`} className="card hover-lift rounded-3xl p-6 no-underline block">
                <div className="flex items-center justify-between mb-5">
                  <AgentIcon label={agente.nome} />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">{agente.complexidade}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{agente.nome}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5 min-h-[64px]">{agente.descricao}</p>
                <div className="flex items-end gap-2 mb-5">
                  <span className="text-3xl font-black text-white">R${agente.preco}</span>
                  <span className="text-slate-500 text-sm mb-1">/mês</span>
                </div>
                <div className="text-red-300 font-bold text-sm">Ver detalhes →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-5 sm:px-8 section-dark">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[.85fr_1.15fr] gap-10 items-start">
          <div>
            <span className="badge-violet mb-4">Confiança</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5">Feito para parecer simples para a empresa, mesmo sendo poderoso por trás.</h2>
            <p className="text-slate-400 leading-relaxed">A OpenClaw precisa vender clareza: a empresa não quer entender IA, ela quer responder clientes, vender mais e economizar tempo.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['LGPD e privacidade', 'Estruture páginas e textos para explicar cuidado com dados e uso responsável.'],
              ['Suporte humano', 'Mostre que existe acompanhamento real, não apenas uma automação abandonada.'],
              ['Melhoria contínua', 'O agente pode ser ajustado conforme perguntas e necessidades da empresa.'],
              ['Escala comercial', 'Permite vender agentes para várias empresas mantendo operação organizada.'],
            ].map(([title, desc]) => (
              <div key={title} className="card rounded-3xl p-6">
                <h3 className="text-lg font-black mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="FAQ" title="Dúvidas comuns antes de contratar." />
          <div className="space-y-4">
            {faqs.map(([q, a]) => (
              <div key={q} className="card rounded-3xl p-6">
                <h3 className="font-black text-white mb-2">{q}</h3>
                <p className="text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto cta-glow rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 hero-mesh opacity-60" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">Pronto para vender agentes de IA de forma profissional?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">Transforme a OpenClaw em uma vitrine clara, confiável e preparada para converter empresas que precisam automatizar atendimento e vendas.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pre-cadastro" className="btn-primary rounded-full px-8 py-4 font-bold no-underline">Solicitar agente exclusivo</Link>
              <Link href="/suporte" className="btn-outline rounded-full px-8 py-4 font-bold no-underline">Falar com suporte</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
