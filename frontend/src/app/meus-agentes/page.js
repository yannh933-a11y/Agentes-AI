import Link from 'next/link';
import { Card, Pill } from '../components/ui';
import { DashboardShell } from '../components/DashboardShell';
import { agentesContratados } from '../../lib/dashboard';
import { currentTenant } from '../../lib/tenant';

export const metadata = { title: 'Meus agentes | Agentes AI' };

export default function Page() {
  return (
    <DashboardShell
      title="Meus agentes"
      description={`Agentes exclusivos da ${currentTenant.nome}. Cada agente possui prompt, base de conhecimento, canais, histórico e regras próprias.`}
      actions={<Link href="/pre-cadastro" className="btn-primary rounded-full px-5 py-3 text-sm font-black no-underline">Adicionar agente</Link>}
    >
      <div className="grid xl:grid-cols-3 gap-5">
        {agentesContratados.map((agent) => (
          <Card key={agent.slug} className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-base font-black text-red-200 border border-red-500/20">{agent.icon}</div>
              <Pill tone={agent.status === 'Ativo' ? 'green' : 'default'}>{agent.status}</Pill>
            </div>
            <h2 className="mt-5 text-2xl font-black">{agent.nome}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{agent.resumo}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Info label="Company ID" value={agent.companyId} />
              <Info label="Resolução" value={agent.resolucao} />
              <Info label="Qualidade" value={agent.qualidade} />
              <Info label="Atualização" value={agent.ultimaAtualizacao} />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-600 font-black">Prompt próprio</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{agent.prompt}</p>
            </div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-600 font-black">Base vinculada</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{agent.base}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {agent.canais.map((canal) => <Pill key={canal}>{canal}</Pill>)}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href={`/agentes/${agent.slug}`} className="btn-outline flex-1 rounded-full px-4 py-3 text-center text-sm font-black no-underline">Ver produto</Link>
              <Link href="/configuracoes" className="btn-primary flex-1 rounded-full px-4 py-3 text-center text-sm font-black no-underline">Configurar</Link>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"><p className="text-[11px] uppercase tracking-[0.18em] text-slate-600 font-black">{label}</p><p className="mt-1 break-all font-black text-white">{value}</p></div>;
}
