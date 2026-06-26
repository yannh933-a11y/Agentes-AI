import Link from 'next/link';
import { AdminShell } from '../../components/DashboardShell';
import { Card, Pill } from '../../components/ui';
import { listConversations } from '../../../lib/server/conversations-repository';
import { companies } from '../../../lib/tenant';

export const metadata = { title: 'Admin Conversas | Agentes AI' };

export default async function Page() {
  const batches = await Promise.all(companies.slice(0, 3).map((company) => listConversations({ companyId: company.id, limit: 8 })));
  const items = batches.flatMap((batch, index) => batch.items.map((conversation) => ({ ...conversation, companyName: companies[index]?.nome || 'Empresa' })));
  const byStatus = items.reduce((acc, item) => ({ ...acc, [item.status]: (acc[item.status] || 0) + 1 }), {});

  return (
    <AdminShell title="Conversas e roteamento" description="Visão interna para acompanhar conversas de todas as empresas, status de IA, escalonamentos e canais conectados.">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Conversas" value={items.length} />
        <Metric label="Auto reply" value={byStatus.AUTO_REPLIED || 0} />
        <Metric label="Revisão humana" value={(byStatus.WAITING_HUMAN || 0) + (byStatus.ESCALATED || 0)} />
        <Metric label="Empresas" value={companies.length} />
      </div>

      <Card className="mt-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Central multiempresa</h2>
            <p className="mt-1 text-sm text-slate-500">Cada conversa é separada por companyId e nunca mistura documentos ou histórico entre empresas.</p>
          </div>
          <Pill>Roteador central</Pill>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Canal</th>
                <th className="px-4 py-3">Agente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map((item) => (
                <tr key={`${item.companyId}-${item.id}`} className="text-slate-300">
                  <td className="px-4 py-4 font-bold text-white">{item.companyName}</td>
                  <td className="px-4 py-4">{item.customerName}</td>
                  <td className="px-4 py-4">{item.channel}</td>
                  <td className="px-4 py-4">{item.agentName}</td>
                  <td className="px-4 py-4"><Pill>{item.statusLabel}</Pill></td>
                  <td className="px-4 py-4"><Link href={`/conversas/${item.id}`} className="font-bold text-red-300 no-underline hover:text-red-200">Abrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}

function Metric({ label, value }) {
  return <Card className="p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-white">{value}</p></Card>;
}
