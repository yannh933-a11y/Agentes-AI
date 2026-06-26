'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { agentes, planos } from '../../lib/agentes';
import { buildCheckoutSummary, formatCurrency, paymentMethods } from '../../lib/billing';
import { Card, Container, Pill } from '../components/ui';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    nome: '',
    empresa: '',
    email: '',
    whatsapp: '',
    agente: searchParams.get('agente') || 'atendimento',
    plano: searchParams.get('plano') || 'pro',
    metodoPagamento: searchParams.get('metodo') || 'pix_manual',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState(null);

  const summary = useMemo(() => buildCheckoutSummary({ planSlug: form.plano, agentSlug: form.agente }), [form.plano, form.agente]);
  const planoAtual = planos.find((plano) => plano.slug === form.plano);

  async function submit(event) {
    event.preventDefault();
    setErro('');

    if (!form.nome.trim() || !form.email.trim() || !form.empresa.trim()) {
      setErro('Preencha nome, empresa e email para gerar a contratação.');
      return;
    }

    if (summary.isCustom) {
      setErro('O plano Enterprise exige proposta comercial. Use o pré-cadastro para solicitar diagnóstico.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, origem: 'checkout' }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.erro || 'Falha ao criar contratação');
      setResultado(data);
    } catch (error) {
      setErro(error.message || 'Não foi possível iniciar a contratação.');
    } finally {
      setLoading(false);
    }
  }

  if (resultado) {
    const pix = resultado.payment?.pix;
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-emerald-500/20 bg-emerald-500/[0.04] text-center">
          <Pill tone="green">Contratação criada</Pill>
          <h1 className="mt-5 text-4xl font-black tracking-tight">Pedido comercial registrado.</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-400">
            Criamos a contratação para {resultado.order?.empresa}. Agora falta confirmar o pagamento para iniciar implantação, base de conhecimento e configuração do agente.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
            <Resumo label="Pedido" value={resultado.order?.id?.slice(0, 16) || '—'} />
            <Resumo label="Plano" value={resultado.order?.plano || resultado.checkout?.plano} />
            <Resumo label="Total hoje" value={resultado.order?.totalFormatado || formatCurrency(resultado.checkout?.totalHoje)} />
          </div>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.85fr]">
          <Card>
            <h2 className="text-2xl font-black">Próximo passo de pagamento</h2>
            {resultado.payment?.checkoutUrl ? (
              <>
                <p className="mt-3 leading-relaxed text-slate-400">O checkout externo foi criado. Clique abaixo para finalizar no provedor de pagamento.</p>
                <a href={resultado.payment.checkoutUrl} className="btn-primary mt-6 inline-flex rounded-full px-6 py-3.5 text-sm font-black no-underline">Abrir checkout seguro</a>
              </>
            ) : (
              <>
                <p className="mt-3 leading-relaxed text-slate-400">Use o Pix manual enquanto o checkout automático não estiver ativo. Depois do pagamento, envie o comprovante para liberação da implantação.</p>
                <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5 text-left">
                  <CopyLine label="Chave Pix" value={pix?.chave || 'Configure a chave Pix'} />
                  <CopyLine label="Favorecido" value={pix?.favorecido || 'Agentes AI'} />
                  <CopyLine label="Banco" value={pix?.banco || 'Pix manual'} />
                  <CopyLine label="Valor" value={resultado.order?.totalFormatado || formatCurrency(resultado.checkout?.totalHoje)} />
                </div>
                <p className="mt-4 text-sm font-semibold text-red-100">{pix?.aviso}</p>
              </>
            )}
          </Card>

          <Card>
            <h2 className="text-2xl font-black">Fluxo após confirmação</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-slate-400">
              <li><b className="text-white">1.</b> Conferência do pagamento e status no admin.</li>
              <li><b className="text-white">2.</b> Criação da empresa e agente exclusivo.</li>
              <li><b className="text-white">3.</b> Coleta de documentos e regras da operação.</li>
              <li><b className="text-white">4.</b> Testes assistidos antes de liberar para clientes.</li>
            </ol>
            <div className="mt-6 grid gap-3">
              <Link href="/admin/contratacoes" className="btn-outline rounded-full px-5 py-3 text-center text-sm font-black no-underline">Ver contratações no admin</Link>
              <Link href="/pre-cadastro" className="btn-primary rounded-full px-5 py-3 text-center text-sm font-black no-underline">Criar outro pedido</Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_.75fr] lg:items-start">
      <Card>
        <div className="mb-6">
          <Pill tone="red">Checkout comercial</Pill>
          <h2 className="mt-4 text-3xl font-black">Gerar contratação</h2>
          <p className="mt-2 text-slate-400">Selecione agente, plano e método de pagamento. Os valores são calculados no servidor para evitar alteração indevida.</p>
        </div>

        {erro && <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-100">{erro}</div>}

        <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
          <Field label="Nome" required value={form.nome} onChange={(value) => setForm({ ...form, nome: value })} placeholder="Responsável pela contratação" />
          <Field label="Empresa" required value={form.empresa} onChange={(value) => setForm({ ...form, empresa: value })} placeholder="Nome da empresa" />
          <Field label="Email" required type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="contato@empresa.com" />
          <Field label="WhatsApp" value={form.whatsapp} onChange={(value) => setForm({ ...form, whatsapp: value })} placeholder="(31) 99999-9999" />

          <Select label="Agente" value={form.agente} onChange={(value) => setForm({ ...form, agente: value })} options={agentes.map((agente) => ({ value: agente.slug, label: agente.nome }))} />
          <Select label="Plano" value={form.plano} onChange={(value) => setForm({ ...form, plano: value })} options={planos.map((plano) => ({ value: plano.slug, label: plano.nome }))} />

          <div className="md:col-span-2">
            <label className="label">Forma de pagamento</label>
            <div className="grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setForm({ ...form, metodoPagamento: method.id })}
                  className={`rounded-3xl border p-4 text-left transition ${form.metodoPagamento === method.id ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-white">{method.nome}</h3>
                    {method.recomendado && <Pill tone="red">Agora</Pill>}
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-500">{method.status}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{method.descricao}</p>
                </button>
              ))}
            </div>
          </div>

          <button disabled={loading || summary.isCustom} className="btn-primary rounded-full border-0 py-4 font-black md:col-span-2 disabled:cursor-not-allowed disabled:opacity-50">
            {summary.isCustom ? 'Solicitar proposta Enterprise pelo pré-cadastro' : loading ? 'Criando contratação...' : 'Criar contratação e pagamento'}
          </button>
        </form>
      </Card>

      <div className="space-y-5 lg:sticky lg:top-28">
        <Card className="border-red-500/20">
          <h2 className="text-2xl font-black">Resumo</h2>
          <div className="mt-5 space-y-3">
            <Resumo label="Agente" value={summary.agent?.nome || 'Personalizado'} />
            <Resumo label="Plano" value={planoAtual?.nome || 'A definir'} />
            <Resumo label="Ativação" value={summary.isCustom ? 'Sob consulta' : formatCurrency(summary.setup)} />
            <Resumo label="Mensalidade" value={summary.isCustom ? 'Sob consulta' : formatCurrency(summary.monthly)} />
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-bold text-slate-500">Total hoje</p>
            <p className="mt-2 text-4xl font-black text-white">{summary.isCustom ? 'Sob consulta' : formatCurrency(summary.totalHoje)}</p>
            <p className="mt-2 text-sm text-slate-500">Inclui ativação + primeira mensalidade.</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Por que checkout manual primeiro?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Para vender rápido sem depender de integração complexa. Depois, Mercado Pago e Stripe podem ser ativados mantendo o mesmo fluxo.</p>
          <Link href="/pagamentos" className="mt-5 inline-flex text-sm font-black text-red-300 no-underline">Ver estratégia de pagamentos →</Link>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="pt-28 pb-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Contratação</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Checkout preparado para vender agora e escalar depois.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">Comece com Pix manual e pedidos registrados. Quando o negócio validar, ative Mercado Pago, Stripe e assinaturas recorrentes.</p>
        </div>
        <Suspense fallback={<p className="text-center text-slate-400">Carregando checkout...</p>}>
          <CheckoutForm />
        </Suspense>
      </Container>
    </main>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return <div><label className="label">{label}{required ? ' *' : ''}</label><input required={required} type={type} className="input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></div>;
}

function Select({ label, value, onChange, options }) {
  return <div><label className="label">{label}</label><select className="input" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}

function Resumo({ label, value }) {
  return <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3"><span className="text-sm text-slate-500">{label}</span><span className="text-right font-black text-white">{value}</span></div>;
}

function CopyLine({ label, value }) {
  return <div className="flex flex-col gap-1 border-b border-white/10 py-3 last:border-b-0"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">{label}</span><code className="break-all rounded-xl bg-white/[0.03] px-3 py-2 text-sm font-bold text-slate-100">{value}</code></div>;
}
