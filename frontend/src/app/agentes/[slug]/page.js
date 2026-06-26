import { notFound } from 'next/navigation';
import { agentes, getAgente } from '../../../lib/agentes';
import { ButtonLink, Card, CheckItem, Container, Pill, Section, SectionTitle } from '../../components/ui';

export function generateStaticParams() {
  return agentes.map((agente) => ({ slug: agente.slug }));
}

export function generateMetadata({ params }) {
  const agente = getAgente(params.slug);
  if (!agente) return { title: 'Agente | Agentes AI' };
  return {
    title: `${agente.nome} | Agentes AI`,
    description: `${agente.descricao} Agente exclusivo para empresas, com implantação guiada e base de conhecimento própria.`,
  };
}

export default function AgentePage({ params }) {
  const agente = getAgente(params.slug);
  if (!agente) return notFound();

  const relacionados = agentes.filter((item) => item.slug !== agente.slug && item.categoria === agente.categoria).slice(0, 3);
  const fallbackRelacionados = relacionados.length ? relacionados : agentes.filter((item) => item.slug !== agente.slug).slice(0, 3);

  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-xl font-black text-red-200">{agente.icon}</div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="red">{agente.categoria}</Pill>
                <Pill>{agente.nivel}</Pill>
                <Pill>{agente.tempoImplantacao}</Pill>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{agente.nome}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{agente.descricao}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Problema</p>
                <p className="mt-3 leading-relaxed text-slate-300">{agente.problema}</p>
              </Card>
              <Card>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Resultado esperado</p>
                <p className="mt-3 leading-relaxed text-slate-300">{agente.resultado}</p>
              </Card>
            </div>
          </div>

          <Card className="lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-500">A partir de</div>
                <div className="mt-2 text-5xl font-black">R$ {agente.preco}<span className="text-base text-slate-500">/mês</span></div>
                <div className="mt-1 text-sm text-slate-500">Ativação: R$ {agente.precoAtivacao}</div>
              </div>
              {agente.destaque && <Pill tone="red">Popular</Pill>}
            </div>
            <ButtonLink href={`/checkout?agente=${agente.slug}&plano=pro`} className="mt-6 w-full">Contratar agora</ButtonLink>
            <ButtonLink href={`/pre-cadastro?agente=${agente.slug}`} variant="outline" className="mt-3 w-full">Solicitar diagnóstico</ButtonLink>
            <ButtonLink href="/demo" variant="outline" className="mt-3 w-full">Ver demo antes</ButtonLink>
            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="mb-4 text-lg font-black">Inclui</h2>
              <ul className="space-y-3">
                {agente.funcionalidades.map((item) => <CheckItem key={item}>{item}</CheckItem>)}
              </ul>
            </div>
          </Card>
        </div>
      </Container>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <SectionTitle align="left" eyebrow="Demonstração" title="Como esse agente conversa com o cliente." desc="Exemplo ilustrativo de como o agente conduz a conversa com linguagem clara, coleta de contexto e próxima ação." />
            </div>
            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-black">{agente.nome}</h2>
                  <p className="text-sm text-slate-500">Agente exclusivo da empresa</p>
                </div>
                <Pill tone="green">Online</Pill>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/10 bg-black/25 p-4">
                {agente.conversa.map(([autor, texto], index) => (
                  <div key={`${autor}-${index}`} className={`flex ${autor === 'Agente' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${autor === 'Agente' ? 'border-red-500/20 bg-red-500/15' : 'border-white/10 bg-white/5'} max-w-[88%] rounded-2xl border p-3 text-sm leading-relaxed text-slate-200`}>
                      <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{autor}</div>
                      {texto}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container>
          <SectionTitle eyebrow="Aplicação comercial" title="Feito para empresas que precisam de resposta rápida e processo claro." />
          <div className="grid gap-5 md:grid-cols-3">
            <Card>
              <h2 className="text-xl font-black">Para quem serve</h2>
              <p className="mt-3 leading-relaxed text-slate-400">{agente.paraQuem}</p>
            </Card>
            <Card>
              <h2 className="text-xl font-black">Segmentos ideais</h2>
              <div className="mt-4 flex flex-wrap gap-2">{agente.idealPara.map((item) => <Pill key={item}>{item}</Pill>)}</div>
            </Card>
            <Card>
              <h2 className="text-xl font-black">Implantação</h2>
              <p className="mt-3 leading-relaxed text-slate-400">Diagnóstico, base de conhecimento, tom de voz, regras, validação e acompanhamento inicial.</p>
            </Card>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {agente.beneficios.map((beneficio) => (
              <Card key={beneficio} className="p-5">
                <p className="font-semibold text-slate-200">✓ {beneficio}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle eyebrow="FAQ do agente" title="Dúvidas antes de solicitar." />
          <div className="grid gap-5 md:grid-cols-2">
            {agente.faq.map(([pergunta, resposta]) => (
              <Card key={pergunta}>
                <h2 className="text-lg font-black">{pergunta}</h2>
                <p className="mt-3 leading-relaxed text-slate-400">{resposta}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Próximo passo</p>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">Quer esse agente na sua empresa?</h2>
              <p className="mt-4 max-w-2xl text-slate-400">Envie as informações comerciais e receba um diagnóstico para implantação do agente.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row"><ButtonLink href={`/checkout?agente=${agente.slug}&plano=pro`} className="w-full lg:w-auto">Contratar agora</ButtonLink><ButtonLink href={`/pre-cadastro?agente=${agente.slug}`} variant="outline" className="w-full lg:w-auto">Solicitar diagnóstico</ButtonLink></div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {fallbackRelacionados.map((item) => (
              <a key={item.slug} href={`/agentes/${item.slug}`} className="card rounded-3xl p-5 no-underline">
                <Pill>{item.categoria}</Pill>
                <h3 className="mt-4 text-xl font-black">{item.nome}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.resumo}</p>
              </a>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
