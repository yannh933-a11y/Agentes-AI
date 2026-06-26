'use client';
import { useState, Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { agentes } from '../../lib/agentes';
import Link from 'next/link';

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

function CheckoutForm() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('agente');
  const agente = agentes.find((a) => a.slug === slug);
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [etapa, setEtapa] = useState('dados'); // 'dados' | 'pagamento'
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [preferenceId, setPreferenceId] = useState(null);
  const bricksRef = useRef(null);

  if (!agente) return (
    <div className="text-center py-20 text-slate-400">
      Agente não encontrado. <Link href="/agentes" className="text-red-400 underline">Ver agentes</Link>
    </div>
  );

  const valorTotal = agente.precoAtivacao + agente.preco;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          agente: agente.nome,
          precoAtivacao: agente.precoAtivacao,
          preco: agente.preco,
        }),
      });
      const data = await res.json();
      if (data.erro) throw new Error(data.erro);
      setPreferenceId(data.initPoint);
      setEtapa('pagamento');
    } catch (err) {
      setErro('Erro ao iniciar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Carrega MP Bricks quando chega na etapa de pagamento
  useEffect(() => {
    if (etapa !== 'pagamento' || !preferenceId) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-e5d11673-2164-4fd5-84df-38e31815c35c', { locale: 'pt-BR' });
      const bricksBuilder = mp.bricks();
      bricksBuilder.create('wallet', 'mp-wallet', {
        initialization: { preferenceId },
        customization: {
          texts: { valueProp: 'smart_option' },
          visual: { buttonBackground: 'black', borderRadius: '12px' },
        },
      });
    };
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, [etapa, preferenceId]);

  if (etapa === 'pagamento') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="card rounded-2xl p-8">
          <div className="text-3xl mb-4">{agente.emoji}</div>
          <h2 className="text-xl font-bold text-white mb-2">{agente.nome}</h2>
          <p className="text-slate-400 text-sm mb-8">
            Ativação: R${agente.precoAtivacao} + R${agente.preco}/mês<br/>
            <strong className="text-white text-lg">Total hoje: R${valorTotal}</strong>
          </p>
          <a href={preferenceId} className="btn-primary font-bold px-10 py-4 rounded-full text-lg no-underline inline-block w-full text-center">
            💳 Pagar com Mercado Pago →
          </a>
          <p className="text-slate-500 text-xs mt-4">Aceita cartão, débito e PIX</p>
          <p className="text-slate-600 text-xs mt-2">🔒 Pagamento seguro via Mercado Pago</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
      {/* Formulário */}
      <div className="lg:col-span-3">
        <div className="card rounded-2xl p-7 sm:p-9">
          <h2 className="text-white font-bold text-xl mb-6">Seus dados</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Nome completo *</label>
              <input required type="text" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="João Silva"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Email *</label>
              <input required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="joao@email.com"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">WhatsApp <span className="text-slate-600">(opcional)</span></label>
              <input type="text" value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>
            {erro && <p className="text-red-400 text-sm">{erro}</p>}
            <button type="submit" disabled={loading}
              className="w-full btn-primary font-bold py-4 rounded-full text-lg border-none cursor-pointer transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Aguarde...' : `Continuar para pagamento →`}
            </button>
            <p className="text-slate-600 text-xs text-center">🔒 Pagamento seguro · Cartão ou PIX</p>
          </form>
        </div>
      </div>

      {/* Resumo */}
      <div className="lg:col-span-2">
        <div className="card border-red-500/[0.15] rounded-2xl p-6 sm:p-7 sticky top-24">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-5">Resumo</h3>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="w-12 h-12 bg-red-500/[0.08] rounded-xl flex items-center justify-center text-2xl">{agente.emoji}</div>
            <div>
              <p className="text-white font-semibold">{agente.nome}</p>
              <p className="text-slate-400 text-sm">Ativação + 1º mês</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Ativação</span>
              <span className="text-white">R$ {agente.precoAtivacao}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">1º mensalidade</span>
              <span className="text-white">R$ {agente.preco}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-white/[0.06]">
              <span className="text-white">Total hoje</span>
              <span className="text-white text-xl">R$ {valorTotal}</span>
            </div>
          </div>
          <ul className="space-y-2.5 mt-4">
            {['Ativação em minutos', 'Disponível 24h', 'Suporte incluso', 'Cancele quando quiser'].map((i) => (
              <li key={i} className="flex items-center gap-2.5 text-slate-400 text-sm">
                <span className="text-red-400 text-xs">✓</span>{i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="pt-28 pb-24 px-5 sm:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Finalizar compra</h1>
        <p className="text-slate-400">Preencha seus dados e escolha como pagar</p>
      </div>
      <Suspense fallback={<p className="text-center text-slate-400">Carregando...</p>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
