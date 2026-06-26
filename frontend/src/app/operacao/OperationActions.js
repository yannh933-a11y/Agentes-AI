'use client';
import { useState } from 'react';

export default function OperationActions({ id, companyId, allCompanies = false }) {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');

  async function run(action, payload = {}) {
    setLoading(action);
    setMessage('');
    try {
      const response = await fetch(`/api/operations/responses/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, allCompanies, ...payload }),
      });
      const data = await response.json();
      setMessage(data.ok ? 'Ação executada. Atualize a página para ver o status final.' : (data.error || data.erro || 'Não foi possível executar.'));
    } catch {
      setMessage('Falha de rede ao executar a ação.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button disabled={loading} onClick={() => run('approve')} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-100 disabled:opacity-50">Aprovar</button>
        <button disabled={loading} onClick={() => run('send')} className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-black text-red-100 disabled:opacity-50">Enviar</button>
        <button disabled={loading} onClick={() => run('approve', { sendNow: true })} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-white disabled:opacity-50">Aprovar + enviar</button>
        <button disabled={loading} onClick={() => run('hold')} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-slate-300 disabled:opacity-50">Pausar</button>
        <button disabled={loading} onClick={() => run('reject')} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-slate-400 disabled:opacity-50">Rejeitar</button>
      </div>
      {message && <p className="text-xs leading-relaxed text-slate-400">{loading ? 'Processando...' : message}</p>}
    </div>
  );
}
