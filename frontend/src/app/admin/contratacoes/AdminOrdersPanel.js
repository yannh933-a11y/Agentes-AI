'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Pill } from '../../components/ui';

const STATUS_OPTIONS = [
  ['AWAITING_PAYMENT', 'Aguardando pagamento'],
  ['PAYMENT_REVIEW', 'Pagamento em análise'],
  ['PAID', 'Pago'],
  ['IMPLEMENTATION', 'Em implantação'],
  ['ACTIVE', 'Ativo'],
  ['CANCELED', 'Cancelado'],
];

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [source, setSource] = useState('static');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/contratacoes', { cache: 'no-store', credentials: 'include' });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.erro || 'Falha ao carregar contratações');
        if (!active) return;
        setOrders(data.items || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'api');
      } catch (err) {
        if (!active) return;
        setError('Não foi possível conectar às contratações. Verifique login de SUPER_ADMIN e banco.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const visibleOrders = useMemo(() => {
    if (filter === 'ALL') return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  async function changeStatus(order, status) {
    const previous = orders;
    const label = STATUS_OPTIONS.find((item) => item[0] === status)?.[1] || status;
    setOrders((items) => items.map((item) => item.id === order.id ? { ...item, status, statusLabel: label } : item));

    try {
      const response = await fetch(`/api/admin/contratacoes/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (response.status === 202) return;
      const data = await response.json();
      if (!response.ok) throw new Error(data?.erro || 'Erro ao atualizar contratação');
      if (data.order) setOrders((items) => items.map((item) => item.id === order.id ? data.order : item));
    } catch (err) {
      setOrders(previous);
      setError('Não foi possível atualizar o status. Em modo demo, a alteração não é persistida.');
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black">Contratações e pagamentos</h2>
              <Pill tone={source === 'database' ? 'green' : 'red'}>{source === 'database' ? 'Banco real' : 'Modo demo'}</Pill>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">Acompanhe pedidos criados pelo checkout, método de pagamento, plano, valor e estágio operacional.</p>
            {error && <p className="mt-2 text-sm font-bold text-red-200">{error}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3 lg:min-w-[430px]">
            <Metric label="Pedidos" value={metrics?.totalOrders ?? orders.length} />
            <Metric label="Receita" value={metrics?.revenue || '—'} />
            <Metric label="Fonte" value={source === 'database' ? 'DB' : 'Demo'} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex flex-wrap gap-2">
          <button onClick={() => setFilter('ALL')} className={filter === 'ALL' ? 'filter-active' : 'filter-button'}>Todos</button>
          {STATUS_OPTIONS.map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={filter === value ? 'filter-active' : 'filter-button'}>{label}</button>)}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-slate-400">Carregando contratações...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>{['Empresa', 'Cliente', 'Agente/Plano', 'Pagamento', 'Valor', 'Status', 'Ação'].map((head) => <th key={head} className="pb-3 font-black">{head}</th>)}</tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10 align-top">
                    <td className="py-4"><p className="font-black text-white">{order.empresa}</p><p className="mt-1 text-xs text-slate-600">{order.id}</p></td>
                    <td className="py-4"><p className="font-bold text-slate-300">{order.nome}</p><p className="mt-1 text-xs text-slate-500">{order.email}</p><p className="mt-1 text-xs text-slate-600">{order.whatsapp}</p></td>
                    <td className="py-4"><p className="font-bold text-slate-300">{order.agente}</p><p className="mt-1 text-xs text-slate-500">{order.plano}</p></td>
                    <td className="py-4"><p className="font-bold text-slate-300">{order.metodoPagamento}</p><p className="mt-1 text-xs text-slate-600">{order.providerReference || 'manual'}</p></td>
                    <td className="py-4"><p className="font-black text-red-200">{order.totalFormatado}</p><p className="mt-1 text-xs text-slate-600">Mensal: {order.mensalidadeFormatada}</p></td>
                    <td className="py-4"><Pill tone={order.status === 'ACTIVE' || order.status === 'PAID' ? 'green' : order.status === 'CANCELED' ? 'red' : 'default'}>{order.statusLabel}</Pill></td>
                    <td className="py-4"><select className="input min-w-[180px] py-2 text-xs" value={order.status} onChange={(event) => changeStatus(order, event.target.value)}>{STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleOrders.length === 0 && <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-slate-400">Nenhuma contratação encontrada.</div>}
          </div>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p><p className="mt-1 text-lg font-black text-white">{value}</p></div>;
}
