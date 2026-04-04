'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { agentes } from '../../lib/agentes';
import axios from 'axios';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('agente');
  const agente = agentes.find((a) => a.slug === slug);

  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [pix, setPix] = useState(null);

  if (!agente) return <p className="text-center text-slate-400 py-20">Agente não encontrado.</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/pedidos`, {
        ...form,
        tipoAgente: agente.slug,
        metodoPagamento: 'pix',
      });
      setPix(res.data);
    } catch (err) {
      setErro('Erro ao gerar cobrança. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (pix) {
    return (
      <div className="max-w-md mx-auto bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Pague via PIX</h2>
        <p className="text-slate-400 mb-6">Escaneie o QR Code ou copie o código abaixo</p>
        {pix.qrCode && (
          <img src={`data:image/png;base64,${pix.qrCode}`} alt="QR Code PIX" className="mx-auto mb-6 rounded-lg w-48 h-48" />
        )}
        <div className="bg-slate-900 rounded-lg p-4 mb-6 break-all text-slate-300 text-sm">
          {pix.pixCopiaECola}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(pix.pixCopiaECola)}
          className="bg-brand-green text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-emerald-400 transition w-full mb-4"
        >
          Copiar código PIX
        </button>
        <p className="text-slate-500 text-sm">Após o pagamento, você receberá seu agente por email em poucos minutos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <div className="flex items-center gap-3 mb-6 p-4 bg-slate-900 rounded-xl">
        <span className="text-3xl">{agente.emoji}</span>
        <div>
          <p className="text-white font-semibold">{agente.nome}</p>
          <p className="text-brand-green font-bold">R$ {agente.preco}/mês</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-slate-300 text-sm block mb-1">Nome completo *</label>
          <input
            required
            type="text"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm block mb-1">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm block mb-1">WhatsApp (opcional)</label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      {erro && <p className="text-red-400 text-sm mt-4">{erro}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-brand-blue text-slate-900 font-bold py-4 rounded-full text-lg hover:bg-sky-400 transition disabled:opacity-50"
      >
        {loading ? 'Gerando PIX...' : 'Gerar PIX →'}
      </button>

      <p className="text-slate-500 text-xs text-center mt-4">🔒 Pagamento seguro via Banco Inter</p>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-md mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Finalizar compra</h1>
        <p className="text-slate-400">Preencha seus dados e pague via PIX</p>
      </div>
      <Suspense fallback={<p className="text-center text-slate-400">Carregando...</p>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
