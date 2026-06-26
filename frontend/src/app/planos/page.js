import Link from 'next/link';
import { comparativoPlanos, planos } from '../../lib/agentes';
import { ButtonLink, Card, CheckItem, Container, Pill, Section, SectionTitle } from '../components/ui';

export const metadata = {
  title: 'Planos e preços | Agentes AI',
  description: 'Planos Start, Pro, Business e Enterprise para agentes de IA exclusivos por empresa.',
};

const faq = [
  ['Preciso pagar antes de falar com vocês?', 'Não. O fluxo recomendado é primeiro fazer o pré-cadastro, entender o cenário e depois confirmar plano, ativação e implantação.'],
  ['O valor inclui criação do agente?', 'Cada plano tem mensalidade e pode ter uma taxa de ativação conforme o agente escolhido e o nível de personalização.'],
  ['Dá para começar com Pix manual?', 'Sim. No início, Pix manual é suficiente para validar vendas. Mercado Pago ou Stripe entram quando o fluxo comercial estiver mais maduro.'],
  ['Posso trocar de plano depois?', 'Sim. A estrutura foi pensada para começar simples e evoluir conforme volume, integrações e número de agentes.'],
];

export default function PlanosPage() {
  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Planos</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Preços para começar simples e escalar com segurança.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">A Agentes AI pode começar com contratação manual e evoluir para pagamentos automatizados, assinaturas e integração completa conforme o negócio crescer.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {planos.map((plano) => (
            <Card key={plano.nome} className={`${plano.destaque ? 'border-red-500/40 bg-red-500/5' : ''} flex flex-col`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{plano.nome}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{plano.descricao}</p>
                </div>
                {plano.destaque && <Pill tone="red">Recomendado</Pill>}
              </div>
              <div className="mt-6 text-4xl font-black">
                {plano.preco === 'Sob consulta' ? plano.preco : `R$ ${plano.preco}`}
                <span className="text-sm text-slate-500">{plano.preco === 'Sob consulta' ? '' : '/mês'}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-300">{plano.melhorPara}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plano.recursos.map((recurso) => <CheckItem key={recurso}>{recurso}</CheckItem>)}
              </ul>
              <div className="mt-7 grid gap-3">
                <ButtonLink href={plano.slug === 'enterprise' ? `/pre-cadastro?plano=${plano.slug}` : `/checkout?plano=${plano.slug}&agente=atendimento`} className="w-full">{plano.slug === 'enterprise' ? plano.cta : 'Contratar agora'}</ButtonLink>
                <Link href={`/pre-cadastro?plano=${plano.slug}`} className="text-center text-xs font-black text-slate-500 no-underline hover:text-red-200">Solicitar diagnóstico antes</Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      <Section>
        <Container>
          <SectionTitle eyebrow="Comparação" title="Compare os planos antes de solicitar diagnóstico." desc="A tabela deixa claro o que muda conforme a empresa cresce em número de agentes, integrações e suporte." />
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="grid min-w-[760px] grid-cols-5 bg-white/10 text-sm font-black text-white">
              <div className="p-4">Recurso</div>
              {planos.map((plano) => <div key={plano.nome} className="p-4">{plano.nome}</div>)}
            </div>
            {comparativoPlanos.map((linha) => (
              <div key={linha[0]} className="grid min-w-[760px] grid-cols-5 border-t border-white/10 bg-[#080810] text-sm text-slate-300">
                {linha.map((coluna, index) => <div key={`${linha[0]}-${index}`} className={`${index === 0 ? 'font-bold text-white' : ''} p-4`}>{coluna}</div>)}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">Em telas pequenas, arraste a tabela para o lado.</p>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <SectionTitle align="left" eyebrow="Fluxo comercial" title="A melhor forma de vender agora é diagnóstico + proposta." desc="Antes de automatizar pagamentos, valide demanda, ticket, objeções e agentes mais vendidos. Isso reduz erro e aumenta chance de fechar empresas reais." />
              <div className="flex flex-col gap-3 sm:flex-row"><ButtonLink href="/pre-cadastro">Solicitar diagnóstico</ButtonLink><ButtonLink href="/pagamentos" variant="outline">Ver pagamentos</ButtonLink></div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {faq.map(([pergunta, resposta]) => (
                <Card key={pergunta}>
                  <h2 className="text-lg font-black">{pergunta}</h2>
                  <p className="mt-3 leading-relaxed text-slate-400">{resposta}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
