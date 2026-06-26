import { AdminShell } from '../../components/DashboardShell';
import { Badge, Card, Pill } from '../../components/ui';
import { companies } from '../../../lib/tenant';
import { demoIntegrationEvents, integrationChannels } from '../../../lib/integrations';

export const metadata = { title: 'Admin Integrações | Agentes AI' };

export default function Page() {
  return (
    <AdminShell title="Integrações globais" description="Visão interna dos canais, webhooks, health checks e eventos por empresa.">
      <div className="grid gap-5 md:grid-cols-4">
        <Card className="p-5"><p className="text-xs text-slate-500 uppercase font-black tracking-[0.2em]">Empresas</p><p className="mt-2 text-3xl font-black">{companies.length}</p></Card>
        <Card className="p-5"><p className="text-xs text-slate-500 uppercase font-black tracking-[0.2em]">Canais</p><p className="mt-2 text-3xl font-black">{integrationChannels.length}</p></Card>
        <Card className="p-5"><p className="text-xs text-slate-500 uppercase font-black tracking-[0.2em]">Eventos demo</p><p className="mt-2 text-3xl font-black">{demoIntegrationEvents.length}</p></Card>
        <Card className="p-5"><p className="text-xs text-slate-500 uppercase font-black tracking-[0.2em]">Health</p><p className="mt-2 text-3xl font-black text-emerald-300">OK</p></Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <Badge>Registry</Badge>
          <h2 className="mt-4 text-2xl font-black">Matriz empresa × canal</h2>
          <div className="mt-5 space-y-3">
            {companies.map((company, index) => (
              <div key={company.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-white">{company.nome}</p>
                    <p className="text-xs text-slate-500">{company.id} • {company.plano}</p>
                  </div>
                  <Pill tone={company.status === 'Ativa' ? 'green' : 'default'}>{company.status}</Pill>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.canais.map((canal) => <span key={canal} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-slate-300">{canal}</span>)}
                  {index === 0 && <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-200">IA em operação</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Badge>Eventos</Badge>
          <h2 className="mt-4 text-2xl font-black">Últimos eventos de canal</h2>
          <div className="mt-5 space-y-3">
            {demoIntegrationEvents.map((event) => (
              <div key={event.id} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[.8fr_1fr_1.4fr]">
                <div><p className="text-xs text-slate-500">Canal</p><p className="font-black text-white">{event.channel}</p></div>
                <div><p className="text-xs text-slate-500">Evento</p><p className="font-black text-white">{event.type}</p></div>
                <div><p className="text-xs text-slate-500">Resumo</p><p className="text-sm text-slate-400">{event.summary}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
