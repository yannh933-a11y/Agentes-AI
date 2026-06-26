import Link from 'next/link';
import { DashboardShell } from '../components/DashboardShell';
import { Card, Pill, ButtonLink } from '../components/ui';
import { currentTenant } from '../../lib/tenant';
import { getOperationsMetrics, listOperationNotifications, listOutboundResponses } from '../../lib/server/operations-repository';
import OperationActions from './OperationActions';

export const metadata = { title: 'Operação assistida | Agentes AI' };

export default async function Page() {
  const [queue, metrics, notifications] = await Promise.all([
    listOutboundResponses({ companyId: currentTenant.id, limit: 40 }),
    getOperationsMetrics({ companyId: currentTenant.id }),
    listOperationNotifications({ companyId: currentTenant.id, limit: 8 }),
  ]);
  const items = queue.items;
  const pending = items.filter((item) => item.status === 'PENDING_APPROVAL');

  return (
    <DashboardShell eyebrow="Operação assistida" title="Fila de respostas" description="Revise, aprove e envie respostas geradas pela IA antes de elas chegarem ao WhatsApp, Instagram, e-mail, site ou CRM. Essa camada reduz erro operacional e dá controle para a empresa." actions={<><ButtonLink href="/conversas" variant="secondary">Conversas</ButtonLink><ButtonLink href="/integracoes">Canais</ButtonLink></>}>
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Metric label="Fonte" value={queue.source === 'database' ? 'Banco' : 'Demo'} />
        <Metric label="Pendentes" value={metrics.metrics.pending} />
        <Metric label="Aprovadas" value={metrics.metrics.approved} />
        <Metric label="Enviadas" value={metrics.metrics.sent} />
        <Metric label="SLA vencido" value={metrics.metrics.overdue} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-black">Respostas aguardando decisão</h2><p className="mt-1 text-sm text-slate-500">A IA prepara, mas a operação decide quando enviar.</p></div>
            <Pill tone={pending.length ? 'red' : 'green'}>{pending.length} pendentes</Pill>
          </div>
          <div className="space-y-4">{items.map((item) => <ResponseCard key={item.id} item={item} />)}</div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-2xl font-black">Fluxo seguro</h2>
            <div className="mt-5 space-y-3">
              {[
                ['1', 'IA gera resposta', 'A resposta é criada com documentos da empresa atual.'],
                ['2', 'Humano aprova', 'Um operador revisa tom, promessa comercial e risco.'],
                ['3', 'Envio externo', 'O conector envia ou simula o envio conforme configuração.'],
                ['4', 'Auditoria', 'Tudo fica registrado com status, canal, operador e horário.'],
              ].map(([n, title, desc]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-sm font-black text-white">{n}. {title}</p><p className="mt-1 text-sm leading-relaxed text-slate-400">{desc}</p></div>)}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Notificações</h2>
            <div className="mt-4 space-y-3">{notifications.items.map((item) => <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black text-white">{item.title}</h3><Pill tone={item.severity === 'WARNING' || item.severity === 'ERROR' ? 'red' : 'default'}>{item.severity}</Pill></div><p className="mt-2 text-sm leading-relaxed text-slate-400">{item.message}</p></div>)}</div>
          </Card>
          <Card><h2 className="text-2xl font-black">Envio real</h2><p className="mt-3 text-sm leading-relaxed text-slate-400">Por segurança, o envio externo fica em modo simulado por padrão. Para liberar envio real, configure as chaves dos canais e use ENABLE_EXTERNAL_SEND=true nas variáveis da Vercel/Railway.</p></Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function ResponseCard({ item }) {
  const overdue = item.dueAt && new Date(item.dueAt).getTime() < Date.now() && !['SENT', 'REJECTED'].includes(item.status);
  return <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap gap-2"><Pill tone={item.tone}>{item.statusLabel}</Pill><Pill>{item.channel}</Pill><Pill tone={overdue ? 'red' : 'default'}>{overdue ? 'SLA vencido' : `${item.slaMinutes} min SLA`}</Pill></div><h3 className="mt-3 text-xl font-black text-white">{item.customerName}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{item.agentName} • {item.customerContact}</p></div><Link href={`/conversas/${item.conversationId}`} className="text-sm font-black text-red-300 no-underline hover:text-red-200">Abrir conversa</Link></div><p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-slate-200">{item.content}</p>{item.error && <p className="mt-3 text-xs text-red-200">Observação: {item.error}</p>}<OperationActions id={item.id} companyId={item.companyId} /></article>;
}
function Metric({ label, value }) { return <Card className="p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></Card>; }
