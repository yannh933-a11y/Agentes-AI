'use client';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { agentes } from '../../lib/agentes';
import axios from 'axios';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('agente');
  const agente = agentes.find((a) => a.slug === slug);
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [pix, setPix] = useState(null);
  const [dadosSalvos, setDadosSalvos] = useState(false);

  // Follow-up: se usuario preencheu dados mas saiu sem comprar (30 min)
  useEffect(() => {
    if (!dadosSalvos || pix) return;
    const t = setTimeout(() => {
      fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'followup', email: form.email, nome: form.nome }),
      }).catch(() => {});
    }, 30 * 60 * 1000); // 30 minutos
    return () => clearTimeout(t);
  }, [dadosSalvos, pix]);

  if (!agente) return (
    <div className="text-center py-20 text-slate-400">
      Agente não encontrado. <a href="/agentes" className="text-red-400 underline">Ver agentes</a>
    </div>
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/pedidos`, {
        ...form, tipoAgente: agente.slug, metodoPagamento: 'pix',
      });
      setPix(res.data);
      // Email de confirmação de compra
      fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'compra', email: form.email, nome: form.nome, agente: agente.nome }),
      }).catch(() => {});
    } catch {
      setErro('Erro ao gerar cobrança. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (pix) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">PIX gerado!</h2>
          <p className="text-slate-400 text-sm mb-8">Escaneie o QR Code ou copie o código abaixo</p>

          {pix.qrCode && (
            <div className="bg-white p-4 rounded-xl inline-block mb-6">
              <img src={`data:image/png;base64,${pix.qrCode}`} alt="QR Code PIX" className="w-48 h-48" />
            </div>
          )}

          <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 mb-6 text-slate-300 text-xs break-all text-left">
            {pix.pixCopiaECola}
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(pix.pixCopiaECola)}
            className="w-full btn-primary font-bold py-4 rounded-full border-none cursor-pointer text-base mb-4"
          >
            Copiar código PIX
          </button>

          <p className="text-slate-500 text-xs">
            Após o pagamento, você receberá seu agente por email em poucos minutos.
          </p>
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
              <input
                required type="text" value={form.nome}
                onChange={(e) => { setForm({ ...form, nome: e.target.value }); if(e.target.value && form.email) setDadosSalvos(true); }}
                placeholder="João Silva"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Email *</label>
              <input
                required type="email" value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); if(e.target.value && form.nome) setDadosSalvos(true); }}
                placeholder="joao@email.com"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">WhatsApp <span className="text-slate-600">(opcional)</span></label>
              <input
                type="text" value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 transition"
              />
            </div>

            {erro && <p className="text-red-400 text-sm">{erro}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary font-bold py-4 rounded-full text-lg border-none cursor-pointer transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Gerando PIX...' : `Pagar R$ ${agente.preco} via PIX →`}
            </button>

            <p className="text-slate-600 text-xs text-center">🔒 Pagamento seguro · Cancele quando quiser</p>
          </form>
        </div>
      </div>

      {/* Resumo */}
      <div className="lg:col-span-2">
        <div className="card border-red-500/[0.15] rounded-2xl p-6 sm:p-7 sticky top-24">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-5">Resumo</h3>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="w-12 h-12 bg-red-500/[0.08] rounded-xl flex items-center justify-center text-2xl">
              {agente.emoji}
            </div>
            <div>
              <p className="text-white font-semibold">{agente.nome}</p>
              <p className="text-slate-400 text-sm">Mensalidade</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-slate-400">Total</span>
            <span className="text-white font-black text-2xl">R$ {agente.preco}<span className="text-sm text-slate-500 font-medium">/mês</span></span>
          </div>
          <ul className="space-y-2.5">
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
        <p className="text-slate-400">Preencha seus dados e pague via PIX</p>
      </div>
      <Suspense fallback={<p className="text-center text-slate-400">Carregando...</p>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
