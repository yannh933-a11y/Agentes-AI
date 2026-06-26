import Link from 'next/link';
import { Card, Pill, ButtonLink } from '../../components/ui';
import { DashboardShell } from '../../components/DashboardShell';
import { getConversation, listMessages } from '../../../lib/server/conversations-repository';
import { currentTenant } from '../../../lib/tenant';
import { listOutboundResponses } from '../../../lib/server/operations-repository';
import OperationActions from '../../operacao/OperationActions';

export const metadata = { title: 'Detalhe da conversa | Agentes AI' };

export default async function Page({ params }) {
  const conversationResult = await getConversation({ id: params.id, companyId: currentTenant.id });
  const messagesResult = await listMessages({ conversationId: params.id, companyId: currentTenant.id });
  const operationResult = await listOutboundResponses({ companyId: currentTenant.id, limit: 50 });
  const conversation = conversationResult.conversation;
  const messages = messagesResult.items;
  const pendingResponses = operationResult.items.filter((item) => item.conversationId === conversation.id);

  return (
    <DashboardShell
      title={conversation.customerName}
      description={`Conversa ${conversation.channel} roteada para ${conversation.agentName}. Histórico isolado da empresa atual.`}
      actions={<><ButtonLink href="/conversas" variant="secondary">Voltar</ButtonLink><ButtonLink href="/ia-lab">Testar resposta</ButtonLink></>}
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{conversation.channel} • {conversation.customerContact}</p>
              <h2 className="mt-2 text-2xl font-black">Histórico da conversa</h2>
            </div>
            <div className="flex flex-wrap gap-2"><Pill>{conversation.statusLabel}</Pill><Pill tone={conversation.sentiment === 'Quente' ? 'red' : 'default'}>{conversation.sentiment}</Pill><Pill>{conversation.priority}</Pill></div>
          </div>
          <div className="space-y-4">
            {messages.map((message) => <Bubble key={message.id} message={message} />)}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-2xl font-black">Resumo operacional</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
              <Info label="Agente" value={conversation.agentName} />
              <Info label="Resumo" value={conversation.summary} />
              <Info label="Próxima ação" value={conversation.nextAction} />
              <Info label="Thread externa" value={conversation.externalThreadId || 'Não informada'} />
              <Info label="Fonte" value={conversationResult.source === 'database' ? 'Banco real' : 'Modo demo'} />
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-black">Resposta assistida</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Respostas geradas pela IA entram em revisão antes de chegar ao canal externo.</p>
            <div className="mt-4 space-y-4">
              {pendingResponses.length ? pendingResponses.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex flex-wrap gap-2"><Pill tone={item.tone}>{item.statusLabel}</Pill><Pill>{item.channel}</Pill></div>
                  <p className="text-sm leading-relaxed text-slate-200">{item.content}</p>
                  <OperationActions id={item.id} companyId={item.companyId} />
                </div>
              )) : <p className="text-sm text-slate-500">Nenhuma resposta pendente para esta conversa.</p>}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-black">Ações recomendadas</h2>
            <div className="mt-4 grid gap-3">
              <Link href={`/api/conversas/${conversation.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300 no-underline hover:bg-white/[0.06]">Ver JSON da conversa</Link>
              <Link href="/operacao" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300 no-underline hover:bg-white/[0.06]">Abrir operação assistida</Link>
              <Link href="/documentos" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300 no-underline hover:bg-white/[0.06]">Revisar base usada pela IA</Link>
              <Link href="/integracoes" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300 no-underline hover:bg-white/[0.06]">Ver canal de origem</Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function Bubble({ message }) {
  const isBot = message.role === 'ASSISTANT';
  const isHuman = message.role === 'HUMAN';
  return (
    <div className={`max-w-[88%] rounded-3xl p-4 text-sm leading-relaxed ${isBot ? 'ml-auto border border-red-500/20 bg-red-500/12 text-red-50' : isHuman ? 'ml-auto border border-emerald-500/20 bg-emerald-500/10 text-emerald-50' : 'border border-white/10 bg-white/[0.04] text-slate-300'}`}>
      <p className="mb-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{isBot ? 'Agente IA' : isHuman ? 'Humano' : 'Cliente'}</p>
      {message.content}
    </div>
  );
}

function Info({ label, value }) {
  return <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-1 text-white">{value}</p></div>;
}
