import Link from 'next/link';
import { Card, Pill } from '../components/ui';
import { DashboardShell } from '../components/DashboardShell';
import { agentesContratados, conversasDemo, dashboardStats, tarefasImplantacao } from '../../lib/dashboard';
import { currentTenant, isolationChecklist } from '../../lib/tenant';
import { listConversations } from '../../lib/server/conversations-repository';

export const metadata = { title: 'Dashboard da empresa | Agentes AI' };

export default async function Dashboard() {
  const conversasResult = await listConversations({ companyId: currentTenant.id, limit: 4 });
  const conversasRecentes = conversasResult.items;
  return (
    <DashboardShell
      title="Dashboard da empresa"
      description="Central visual para acompanhar agentes, conversas, leads, documentos e implantação. Agora a experiência já trabalha com contexto de empresa isolada."
      actions={<div className="flex flex-wrap gap-3"><Link href="/ia-lab" className="btn-primary rounded-full px-5 py-3 text-sm font-black no-underline">Abrir IA Lab</Link><Link href="/demo" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Testar demo</Link></div>}
    >
      <Card className="mb-6 border-red-500/20 bg-red-500/[0.05]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-200 font-black">Contexto multiempresa ativo</p>
            <h2 className="mt-2 text-2xl font-black text-white">{currentTenant.nome}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Todos os cards abaixo representam dados filtrados por <strong className="text-red-100">companyId</strong>. Isso prepara o sistema para múltiplas empresas usando a mesma plataforma com dados separados.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm min-w-[280px]">
            <Info label="Company ID" value={currentTenant.id} />
            <Info label="Data key" value={currentTenant.isolamento} />
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <Pill tone={stat.tone === 'green' ? 'green' : stat.tone === 'red' ? 'red' : 'default'}>Tenant</Pill>
            </div>
            <div className="mt-4 text-4xl font-black text-white">{stat.value}</div>
            <p className="mt-2 text-xs font-bold text-slate-500">{stat.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.25fr_.75fr] gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-black">Agentes em operação</h2>
              <p className="text-sm text-slate-500">Agentes exclusivos vinculados à empresa atual.</p>
            </div>
            <Link href="/meus-agentes" className="text-sm font-black text-red-300 no-underline">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {agentesContratados.map((agent) => (
              <div key={agent.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-sm font-black text-red-200 border border-red-500/20">{agent.icon}</div>
                    <div>
                      <h3 className="font-black text-white">{agent.nome}</h3>
                      <p className="text-sm text-slate-500">{agent.canais.join(' + ')} • {agent.conversas} conversas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={agent.status === 'Ativo' ? 'green' : 'default'}>{agent.status}</Pill>
                    <Pill>{agent.resolucao}</Pill>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-2">Implantação</h2>
          <p className="text-sm text-slate-500 mb-5">Checklist para transformar agente vendido em agente operando.</p>
          <div className="space-y-4">
            {tarefasImplantacao.map((task) => (
              <div key={task.title}>
                <div className="flex justify-between gap-3 text-sm mb-2">
                  <span className="font-bold text-slate-300">{task.title}</span>
                  <span className="text-slate-500">{task.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-800" style={{ width: `${task.progress}%` }} /></div>
                <p className="mt-1 text-xs text-slate-600">{task.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mb-6 border-red-500/20 bg-red-500/[0.04]">
        <div className="grid gap-5 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">IA operacional preparada</p>
            <h2 className="mt-3 text-2xl font-black text-white">Agentes agora trabalham com prompt, base de conhecimento e auditoria de resposta.</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">A Sprint 7 adiciona estrutura para consultar documentos da empresa, montar contexto por agente, testar respostas com Anthropic/OpenAI/Groq ou modo demo e registrar documentos usados.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Contexto" value="companyId + agentSlug" />
            <Info label="Fallback" value="modo demo seguro" />
          </div>
        </div>
      </Card>

      <div className="grid xl:grid-cols-[1fr_.8fr] gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-black">Conversas recentes</h2>
              <p className="text-sm text-slate-500">Resumos já preparados para virem do banco por empresa.</p>
            </div>
            <Link href="/conversas" className="text-sm font-black text-red-300 no-underline">Abrir conversas →</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {conversasRecentes.map((chat) => (
              <Link key={chat.id} href={`/conversas/${chat.id}`} className="rounded-2xl border border-white/10 bg-[#07070f] p-4 no-underline hover:border-red-500/30">
                <div className="flex justify-between gap-3">
                  <h3 className="font-black text-white">{chat.customerName}</h3>
                  <span className="text-xs text-slate-600 font-bold">{chat.statusLabel}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{chat.agentName} • {chat.channel}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{chat.summary}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-4">Regras de isolamento</h2>
          <div className="space-y-3">
            {isolationChecklist.slice(0, 4).map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">✓ {item}</div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-[#07070f] p-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-600 font-black">{label}</p><p className="mt-1 break-all text-xs font-black text-white">{value}</p></div>;
}
