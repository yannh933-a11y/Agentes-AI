import { AdminShell } from '../../components/DashboardShell';
import { Card, Pill } from '../../components/ui';
import { getOperationsMetrics, listOutboundResponses } from '../../../lib/server/operations-repository';
import OperationActions from '../../operacao/OperationActions';

export const metadata = { title: 'Admin Operação | Agentes AI' };

export default async function Page() {
  const [queue, metrics] = await Promise.all([listOutboundResponses({ allCompanies: true, limit: 80 }), getOperationsMetrics({ allCompanies: true })]);
  const byCompany = queue.items.reduce((acc, item) => { acc[item.companyName] = acc[item.companyName] || { total: 0, pending: 0, sent: 0 }; acc[item.companyName].total += 1; if (item.status === 'PENDING_APPROVAL') acc[item.companyName].pending += 1; if (item.status === 'SENT') acc[item.companyName].sent += 1; return acc; }, {});
  return (
    <AdminShell title="Operação assistida" description="Central interna para acompanhar respostas geradas pela IA, aprovações humanas, envio externo, SLA e erros por empresa.">
      <div className="mb-6 grid gap-4 md:grid-cols-5"><Metric label="Total" value={metrics.metrics.total} /><Metric label="Pendentes" value={metrics.metrics.pending} /><Metric label="Aprovadas" value={metrics.metrics.approved} /><Metric label="Enviadas" value={metrics.metrics.sent} /><Metric label="Vencidas" value={metrics.metrics.overdue} /></div>
      <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <Card><h2 className="text-2xl font-black">Empresas em operação</h2><p className="mt-2 text-sm text-slate-500">Acompanhe gargalos de aprovação e envio por tenant.</p><div className="mt-5 space-y-3">{Object.entries(byCompany).map(([company, values]) => <div key={company} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-black text-white">{company}</h3><Pill tone={values.pending ? 'red' : 'green'}>{values.pending} pendentes</Pill></div><p className="mt-2 text-sm text-slate-400">{values.total} respostas • {values.sent} enviadas</p></div>)}</div></Card>
        <Card><div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5"><div><h2 className="text-2xl font-black">Fila global</h2><p className="mt-1 text-sm text-slate-500">Ações administrativas usam allCompanies=true para operação central.</p></div><Pill>{queue.source === 'database' ? 'Banco real' : 'Demo'}</Pill></div><div className="space-y-4">{queue.items.map((item) => <article key={`${item.companyId}-${item.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-black text-white">{item.companyName} → {item.customerName}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{item.channel} • {item.agentName}</p></div><Pill tone={item.tone}>{item.statusLabel}</Pill></div><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">{item.content}</p><OperationActions id={item.id} companyId={item.companyId} allCompanies /></article>)}</div></Card>
      </div>
    </AdminShell>
  );
}
function Metric({ label, value }) { return <Card className="p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></Card>; }
