'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Pill } from '../components/ui';

const STATUS_OPTIONS = [
  ['NEW', 'Novo lead'],
  ['CONTACTED', 'Contato feito'],
  ['QUALIFIED', 'Qualificado'],
  ['PROPOSAL', 'Proposta'],
  ['WON', 'Ganho'],
  ['LOST', 'Perdido'],
];

export default function AdminLeadsPanel({ initialLeads = [] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [metrics, setMetrics] = useState(null);
  const [source, setSource] = useState('static');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/leads', { cache: 'no-store', credentials: 'include' });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.erro || 'Falha ao carregar leads');
        if (!active) return;
        setLeads(data.items || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'api');
      } catch (err) {
        if (!active) return;
        setError('Não foi possível conectar ao painel de leads. Mantendo dados estáticos.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const visibleLeads = useMemo(() => {
    if (filter === 'ALL') return leads;
    return leads.filter((lead) => lead.status === filter || lead.statusLabel === filter);
  }, [filter, leads]);

  async function changeStatus(lead, status) {
    const previous = leads;
    setLeads((items) => items.map((item) => item.id === lead.id ? { ...item, status, statusLabel: STATUS_OPTIONS.find((option) => option[0] === status)?.[1] || status } : item));

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.status === 202) return;
      const data = await response.json();
      if (!response.ok) throw new Error(data?.erro || 'Erro ao atualizar');
      if (data.lead) {
        setLeads((items) => items.map((item) => item.id === lead.id ? data.lead : item));
      }
    } catch (err) {
      setLeads(previous);
      setError('Não foi possível atualizar o status do lead. Verifique a conexão com o banco.');
    }
  }

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black">Pipeline comercial conectado</h2>
            <Pill tone={source === 'database' ? 'green' : 'red'}>{source === 'database' ? 'Banco real' : 'Modo demo'}</Pill>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Leads vindos do pré-cadastro. Com DATABASE_URL configurada, esta tabela passa a usar dados persistentes do banco.
          </p>
          {error && <p className="mt-2 text-sm font-bold text-red-200">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
          <Metric label="Leads" value={metrics?.totalLeads ?? leads.length} />
          <Metric label="7 dias" value={metrics?.recentLeads ?? leads.length} />
          <Metric label="Pipeline" value={metrics?.pipeline || '—'} />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setFilter('ALL')} className={filter === 'ALL' ? 'filter-active' : 'filter-button'}>Todos</button>
        {STATUS_OPTIONS.map(([value, label]) => (
          <button key={value} onClick={() => setFilter(value)} className={filter === value ? 'filter-active' : 'filter-button'}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-slate-400">Carregando pipeline...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>{['Empresa', 'Contato', 'Agente', 'Plano', 'Status', 'Valor', 'Ação'].map((head) => <th key={head} className="pb-3 font-black">{head}</th>)}</tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-white/10 align-top">
                  <td className="py-4">
                    <p className="font-black text-white">{lead.empresa}</p>
                    <p className="mt-1 text-xs text-slate-600">{lead.segmento}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-slate-300">{lead.nome}</p>
                    <p className="mt-1 text-xs text-slate-500">{lead.email}</p>
                    <p className="mt-1 text-xs text-slate-600">{lead.whatsapp}</p>
                  </td>
                  <td className="py-4 text-slate-400">{lead.agente}</td>
                  <td className="py-4 text-slate-400">{lead.plano}</td>
                  <td className="py-4"><Pill tone={lead.status === 'WON' ? 'green' : lead.status === 'LOST' ? 'red' : 'default'}>{lead.statusLabel}</Pill></td>
                  <td className="py-4 font-black text-red-200">{lead.valorEstimadoFormatado}</td>
                  <td className="py-4">
                    <select className="input min-w-[150px] py-2 text-xs" value={lead.status} onChange={(event) => changeStatus(lead, event.target.value)}>
                      {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleLeads.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-slate-400">Nenhum lead encontrado para este filtro.</div>
          )}
        </div>
      )}
    </Card>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
