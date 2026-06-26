import Link from 'next/link';
import { paymentMethods } from '../../lib/billing';
import { ButtonLink, Card, CheckItem, Container, Pill, Section, SectionTitle } from '../components/ui';

export const metadata = {
  title: 'Pagamentos | Agentes AI',
  description: 'Estratégia de pagamentos da Agentes AI: Pix manual, Mercado Pago, Stripe e assinaturas para agentes de IA empresariais.',
};

const roadmap = [
  ['Agora', 'Pix manual', 'Venda sem travar o produto. O pedido fica registrado e o pagamento é conferido manualmente.'],
  ['Próxima etapa', 'Mercado Pago', 'Checkout externo para cartão, Pix e boleto com menos operação manual.'],
  ['Escala', 'Stripe/assinaturas', 'Recorrência, invoices, upgrades, downgrade e métricas de receita.'],
];

export default function Page() {
  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Pagamentos</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Fluxo comercial pensado para vender agora e escalar depois.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">A Agentes AI começa com o método mais simples e confiável para validar vendas: pedidos registrados + Pix manual. Depois, o mesmo fluxo evolui para checkout e assinatura.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.recomendado ? 'border-red-500/30 bg-red-500/5' : ''}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-black">{method.nome}</h2>
                {method.recomendado && <Pill tone="red">Atual</Pill>}
              </div>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600">{method.status}</p>
              <p className="mt-4 leading-relaxed text-slate-400">{method.descricao}</p>
              <p className="mt-4 text-sm font-bold text-slate-300">{method.prazo}</p>
            </Card>
          ))}
        </div>
      </Container>

      <Section>
        <Container>
          <SectionTitle eyebrow="Roadmap financeiro" title="Não precisa começar complexo para vender de forma profissional." desc="O erro comum é tentar integrar tudo antes de validar demanda. O fluxo atual prioriza velocidade comercial e prepara a infraestrutura para recorrência depois." />
          <div className="grid gap-5 md:grid-cols-3">
            {roadmap.map(([fase, titulo, desc]) => (
              <Card key={titulo}>
                <Pill>{fase}</Pill>
                <h2 className="mt-4 text-2xl font-black">{titulo}</h2>
                <p className="mt-3 leading-relaxed text-slate-400">{desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-black/20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <SectionTitle align="left" eyebrow="Como funciona" title="Do pedido à implantação." desc="Cada contratação gera um registro interno para o painel admin. Assim você acompanha pagamento, plano, agente e início da implantação sem perder informação em conversas soltas." />
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/checkout">Criar contratação</ButtonLink>
                <ButtonLink href="/admin/contratacoes" variant="outline">Ver admin</ButtonLink>
              </div>
            </div>
            <Card>
              <ul className="space-y-4">
                <CheckItem>Cliente escolhe agente, plano e método de pagamento.</CheckItem>
                <CheckItem>Checkout cria um pedido comercial com valor validado no servidor.</CheckItem>
                <CheckItem>Pedido aparece no painel de contratações do admin.</CheckItem>
                <CheckItem>Após pagamento, status avança para implantação e operação assistida.</CheckItem>
              </ul>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-black text-white">Variáveis úteis</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  <p><code className="text-red-200">NEXT_PUBLIC_PIX_KEY</code> — chave Pix exibida no checkout.</p>
                  <p><code className="text-red-200">MP_ACCESS_TOKEN</code> — ativa Mercado Pago.</p>
                  <p><code className="text-red-200">DATABASE_URL</code> — salva pedidos no banco real.</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
