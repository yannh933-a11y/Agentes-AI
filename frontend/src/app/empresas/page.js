import Link from 'next/link';
import { AdminShell } from '../components/DashboardShell';
import { Card, Pill } from '../components/ui';
import { companies, tenantArchitecture, isolationChecklist, tenantMetrics, auditEvents } from '../../lib/tenant';
import { agentesPorEmpresa } from '../../lib/dashboard';

export const metadata = { title: 'Empresas e multiempresa | Agentes AI' };

export default function Page() {
  return (
    <AdminShell
      title="Empresas e isolamento de dados"
      description="Registro visual de empresas, agentes e regras de isolamento. Esta sprint prepara o produto para operar várias empresas no mesmo sistema sem misturar dados."
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {tenantMetrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <p className="text-sm font-bold text-slate-500">{metric.label}</p>
            <div className="mt-4 text-4xl font-black text-white">{metric.value}</div>
            <p className="mt-2 text-xs font-bold text-slate-500">{metric.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-black">Empresas cadastradas</h2>
              <p className="text-sm text-slate-500">Cada empresa vira um tenant com usuários, agentes, documentos e conversas próprios.</p>
            </div>
            <Pill tone="red">Sprint 3</Pill>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-slate-500"><tr>{['Empresa','Segmento','Plano','Status','Isolamento','Responsável'].map((h)=><th key={h} className="pb-3 font-black">{h}</th>)}</tr></thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-t border-white/10">
                    <td className="py-4"><p className="font-black text-white">{company.nome}</p><p className="text-xs text-slate-600">{company.dominio}</p></td>
                    <td className="py-4 text-slate-400">{company.segmento}</td>
                    <td className="py-4 text-slate-400">{company.plano}</td>
                    <td className="py-4"><Pill tone={company.status === 'Ativa' ? 'green' : 'default'}>{company.status}</Pill></td>
                    <td className="py-4"><code className="rounded-lg bg-white/5 px-2 py-1 text-xs text-red-200">{company.isolamento}</code></td>
                    <td className="py-4 text-slate-400">{company.responsavel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-4">Arquitetura multiempresa</h2>
          <div className="space-y-3">
            {tenantArchitecture.map((item) => (
              <div key={item.camada} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black text-white">{item.camada}</h3>
                  <Pill tone="green">{item.status}</Pill>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.descricao}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid xl:grid-cols-2 gap-5 mb-6">
        <Card>
          <h2 className="text-2xl font-black mb-4">Agentes por empresa</h2>
          <div className="space-y-3">
            {agentesPorEmpresa.map((group) => (
              <div key={group.companyId} className="rounded-2xl border border-white/10 bg-[#07070f] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div><h3 className="font-black text-white">{group.company}</h3><p className="text-xs text-slate-600">{group.plano}</p></div>
                  <Pill>{group.companyId}</Pill>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {group.agentes.map((agent) => (
                    <div key={`${group.companyId}-${agent.nome}`} className="rounded-xl bg-white/[0.03] p-3">
                      <p className="font-bold text-slate-200">{agent.nome}</p>
                      <p className="mt-1 text-xs text-slate-600">{agent.canais.join(' + ')}</p>
                      <Pill tone={agent.status === 'Ativo' ? 'green' : 'default'}>{agent.status}</Pill>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-4">Checklist de segurança por tenant</h2>
          <div className="space-y-3">
            {isolationChecklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-black">Eventos de auditoria</h2>
            <p className="text-sm text-slate-500">Modelo inicial para rastrear ações importantes por empresa, usuário e sistema.</p>
          </div>
          <Link href="/admin" className="text-sm font-black text-red-300 no-underline">Voltar ao admin →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {auditEvents.map((event) => (
            <div key={`${event.when}-${event.action}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex justify-between gap-3"><p className="font-black text-white">{event.action}</p><Pill>{event.severity}</Pill></div>
              <p className="mt-2 text-sm text-slate-500">{event.actor} • {event.scope}</p>
              <p className="mt-1 text-xs font-bold text-slate-600">{event.when}</p>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
