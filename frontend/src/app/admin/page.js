import Link from 'next/link';
import { AdminShell } from '../components/DashboardShell';
import { Card, Pill } from '../components/ui';
import AdminLeadsPanel from './AdminLeadsPanel';
import { adminStats, leadsAdmin, receitaPorPlano } from '../../lib/dashboard';
import { companies, auditEvents } from '../../lib/tenant';

export const metadata = { title: 'Admin | Agentes AI' };

export default function Page() {
  return (
    <AdminShell title="Painel administrativo" description="Central interna para acompanhar leads, empresas, agentes vendidos, planos, status operacional e saúde da operação comercial.">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            <div className="mt-4 text-4xl font-black text-white">{stat.value}</div>
            <p className="mt-2 text-xs font-bold text-slate-500">{stat.detail}</p>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <AdminLeadsPanel initialLeads={leadsAdmin.map((lead, index) => ({
          id: `static-${index}`,
          nome: lead.contato,
          empresa: lead.empresa,
          email: `${lead.contato.toLowerCase()}@empresa.com.br`,
          whatsapp: '(31) 99999-0000',
          segmento: 'Demonstração',
          agente: lead.agente,
          plano: lead.plano,
          status: index === 0 ? 'NEW' : index === 1 ? 'PROPOSAL' : 'QUALIFIED',
          statusLabel: lead.status,
          valorEstimadoFormatado: lead.valor,
        }))} />
      </div>

      <div className="grid xl:grid-cols-[1.1fr_.9fr] gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl font-black">Tenant registry</h2>
            <Link href="/empresas" className="text-sm font-black text-red-300 no-underline">Abrir →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {companies.map((company) => (
              <div key={company.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-black text-white">{company.nome}</h3>
                    <p className="mt-1 text-xs text-slate-600">{company.isolamento}</p>
                  </div>
                  <Pill tone={company.status === 'Ativa' ? 'green' : 'default'}>{company.status}</Pill>
                </div>
                <p className="mt-3 text-xs font-bold text-slate-500">{company.plano} • {company.segmento}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-4">Saúde da operação</h2>
          <div className="space-y-3">
            <HealthItem label="Banco de leads" value="/api/health" desc="Verifica DATABASE_URL e cria tabelas comerciais quando necessário." />
            <HealthItem label="Pipeline" value="/api/admin/leads" desc="Lista leads persistentes para usuários SUPER_ADMIN." />
            <HealthItem label="Métricas" value="/api/admin/metrics" desc="Calcula volume de leads, pipeline e distribuição por plano." />
            <HealthItem label="Integrações" value="/api/integracoes" desc="Lista canais, health checks e eventos de integração por empresa." />
            <HealthItem label="Operação" value="/api/operations/metrics" desc="Mede fila de aprovação, SLA, envios e falhas de respostas externas." />
          </div>
        </Card>
      </div>

      <div className="grid xl:grid-cols-[.8fr_1.2fr] gap-5 mb-6">
        <Card>
          <h2 className="text-2xl font-black mb-4">Receita por plano</h2>
          <div className="space-y-3">
            {receitaPorPlano.map((item) => (
              <div key={item.plano} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex justify-between gap-3">
                  <div><h3 className="font-black text-white">{item.plano}</h3><p className="text-sm text-slate-500">{item.clientes} clientes</p></div>
                  <p className="font-black text-red-200">{item.receita}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-4">Auditoria recente</h2>
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
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Module title="Leads" desc="Pipeline comercial conectado ao pré-cadastro e preparado para banco real." href="/admin/leads" />
        <Module title="Contratações" desc="Pedidos, pagamentos, Pix manual, Mercado Pago e início de implantação." href="/admin/contratacoes" />
        <Module title="Empresas" desc="Cadastro, plano, status, usuários e histórico de cada cliente." href="/empresas" />
        <Module title="Integrações" desc="Canais, webhooks, eventos, credenciais e health checks por empresa." href="/admin/integracoes" />
        <Module title="Conversas" desc="Roteamento, escalonamentos, respostas automáticas e histórico por empresa." href="/admin/conversas" />
        <Module title="Operação" desc="Fila de aprovação humana, envio externo, SLA e auditoria de respostas." href="/admin/operacao" />
        <Module title="Suporte" desc="Chamados, solicitações, prioridade e acompanhamento de clientes." href="/suporte" />
      </div>
    </AdminShell>
  );
}

function HealthItem({ label, value, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-white">{label}</h3>
        <code className="rounded-lg bg-black/30 px-2 py-1 text-[11px] font-bold text-red-200">{value}</code>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}

function Module({ title, desc, href }) {
  return <Card><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p><Link href={href} className="btn-outline mt-5 inline-flex rounded-full px-5 py-3 text-sm font-black no-underline">Abrir módulo</Link></Card>;
}
