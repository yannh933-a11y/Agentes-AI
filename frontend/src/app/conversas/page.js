import Link from 'next/link';
import { Card, Pill, ButtonLink } from '../components/ui';
import { DashboardShell } from '../components/DashboardShell';
import { listConversations } from '../../lib/server/conversations-repository';
import { currentTenant } from '../../lib/tenant';

export const metadata = { title: 'Conversas roteadas | Agentes AI' };

const statusTone = { AUTO_REPLIED: 'green', WAITING_HUMAN: 'red', ESCALATED: 'red', OPEN: 'default', CLOSED: 'default' };

export default async function Page() {
  const result = await listConversations({ companyId: currentTenant.id, limit: 30 });
  const conversations = result.items;
  const hot = conversations.filter((item) => item.sentiment === 'Quente').length;
  const waiting = conversations.filter((item) => ['WAITING_HUMAN', 'ESCALATED'].includes(item.status)).length;
  const auto = conversations.filter((item) => item.status === 'AUTO_REPLIED').length;

  return (
    <DashboardShell
      title="Conversas roteadas"
      description="Inbox operacional que recebe mensagens de WhatsApp, Instagram, site e webhooks, identifica o agente correto, salva histórico e prepara resposta automática com base da empresa."
      actions={<><ButtonLink href="/ia-lab">Testar IA</ButtonLink><ButtonLink href="/integracoes" variant="secondary">Canais</ButtonLink></>}
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label="Fonte" value={result.source === 'database' ? 'Banco real' : 'Modo demo'} />
        <Metric label="Conversas" value={conversations.length} />
        <Metric label="Leads quentes" value={hot} />
        <Metric label="Revisão humana" value={waiting} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Inbox multi-canal</h2>
              <p className="mt-1 text-sm text-slate-500">companyId: {currentTenant.id}</p>
            </div>
            <Pill tone={auto > 0 ? 'green' : 'default'}>{auto} automáticas</Pill>
          </div>
          <div className="space-y-3">
            {conversations.map((chat) => (
              <Link key={chat.id} href={`/conversas/${chat.id}`} className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 no-underline transition hover:border-red-500/30 hover:bg-red-500/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-white">{chat.customerName}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{chat.channel} • {chat.agentName}</p>
                  </div>
                  <Pill tone={statusTone[chat.status]}>{chat.statusLabel}</Pill>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">{chat.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone={chat.sentiment === 'Quente' ? 'red' : 'default'}>{chat.sentiment}</Pill>
                  <Pill>{chat.priority}</Pill>
                  <Pill>{chat.messagesCount} msgs</Pill>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black">Como o roteamento funciona</h2>
          <div className="mt-5 space-y-4">
            {[
              ['1', 'Evento recebido', 'Webhook de WhatsApp, Instagram, site ou CRM entra em /api/routing/receive ou no webhook do canal.'],
              ['2', 'Classificação', 'O sistema identifica empresa, canal, contato, mensagem, intenção, prioridade e agente mais adequado.'],
              ['3', 'Histórico isolado', 'A conversa é criada ou reaproveitada usando companyId, canal, contato e thread externa.'],
              ['4', 'Resposta controlada', 'Se não houver risco, a IA gera resposta usando apenas documentos da empresa atual.'],
              ['5', 'Escalação', 'Casos sensíveis ficam como revisão humana antes de resposta final.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-sm font-black text-red-200">{num}</div>
                <div>
                  <h3 className="font-black text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="text-sm font-black text-red-100">Endpoint operacional</p>
            <p className="mt-2 break-all text-sm text-red-100/80">POST /api/routing/receive</p>
            <p className="mt-2 text-sm leading-relaxed text-red-100/70">Use esse endpoint para qualquer canal externo enviar mensagens para o roteador central da Agentes AI.</p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }) {
  return <Card className="p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-white">{value}</p></Card>;
}
