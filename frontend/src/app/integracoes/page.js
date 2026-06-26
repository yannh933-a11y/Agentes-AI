import { DashboardShell } from '../components/DashboardShell';
import { Badge, ButtonLink, Card, CheckItem, Pill } from '../components/ui';
import { currentTenant } from '../../lib/tenant';
import {
  demoIntegrationEvents,
  demoIntegrations,
  getWebhookUrl,
  integrationChannels,
  integrationSecurityChecklist,
  integrationStatusFlow,
} from '../../lib/integrations';

export const metadata = {
  title: 'Integrações | Agentes AI',
  description: 'Canais e integrações da empresa para WhatsApp, Instagram, CRM, Google Calendar, e-mail e webhooks.',
};

const statusTone = {
  active: 'green',
  testing: 'red',
  configured: 'default',
};

export default function Page() {
  return (
    <DashboardShell
      eyebrow="Operação multicanal"
      title="Integrações e canais"
      description="Conecte agentes aos canais reais da empresa sem misturar dados entre clientes. Cada integração carrega companyId, status, health check e trilha de eventos."
      actions={<ButtonLink href="/ia-lab">Testar IA com contexto</ButtonLink>}
    >
      <div className="grid gap-5 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Empresa</p>
          <p className="mt-2 text-2xl font-black text-white">{currentTenant.nome}</p>
          <p className="mt-1 text-sm text-slate-500">{currentTenant.id}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Canais ativos</p>
          <p className="mt-2 text-2xl font-black text-white">2</p>
          <p className="mt-1 text-sm text-slate-500">WhatsApp e Instagram</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Eventos 24h</p>
          <p className="mt-2 text-2xl font-black text-white">138</p>
          <p className="mt-1 text-sm text-slate-500">recebidos e enviados</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Health</p>
          <p className="mt-2 text-2xl font-black text-emerald-300">Saudável</p>
          <p className="mt-1 text-sm text-slate-500">sem falhas críticas</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="grid gap-5 md:grid-cols-2">
          {integrationChannels.map((channel) => {
            const linked = demoIntegrations.find((item) => item.channel === channel.key);
            return (
              <Card key={channel.key}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">{channel.category}</p>
                    <h2 className="mt-2 text-2xl font-black text-white">{channel.label}</h2>
                  </div>
                  <Pill tone={statusTone[linked?.status] || 'default'}>{linked?.status || channel.status}</Pill>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{channel.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {channel.useCases.slice(0, 4).map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-slate-300">{item}</span>)}
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Webhook</p>
                  <p className="mt-2 break-all text-xs leading-relaxed text-slate-300">{getWebhookUrl(channel.webhookPath)}</p>
                </div>
                <div className="mt-4 grid gap-2">
                  {channel.requiredEnv.map((env) => <code key={env} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-red-100">{env}</code>)}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-5">
          <Card>
            <Badge>Fluxo de ativação</Badge>
            <h2 className="mt-4 text-2xl font-black">Do rascunho ao canal ativo</h2>
            <div className="mt-5 space-y-3">
              {integrationStatusFlow.map((step, index) => (
                <div key={step.key} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-sm font-black text-red-200 border border-red-500/20">{index + 1}</div>
                  <div>
                    <p className="font-black text-white">{step.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Badge>Segurança</Badge>
            <h2 className="mt-4 text-2xl font-black">Regras para não misturar empresas</h2>
            <ul className="mt-5 space-y-3">
              {integrationSecurityChecklist.map((item) => <CheckItem key={item}>{item}</CheckItem>)}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge>Eventos recentes</Badge>
            <h2 className="mt-4 text-2xl font-black">Trilha operacional dos canais</h2>
            <p className="mt-2 text-sm text-slate-400">A sprint já prepara armazenamento em banco via <code>channel_events</code> quando DATABASE_URL estiver configurada.</p>
          </div>
          <ButtonLink href="/api/integracoes/eventos" variant="secondary">Ver API</ButtonLink>
        </div>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          {demoIntegrationEvents.map((event) => (
            <div key={event.id} className="grid gap-3 border-b border-white/10 bg-white/[0.025] p-4 last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1.4fr]">
              <div><p className="text-xs text-slate-500">Canal</p><p className="font-black text-white">{event.channel}</p></div>
              <div><p className="text-xs text-slate-500">Tipo</p><p className="font-black text-white">{event.type}</p></div>
              <div><p className="text-xs text-slate-500">Status</p><Pill tone={event.status === 'processed' || event.status === 'sent' ? 'green' : 'default'}>{event.status}</Pill></div>
              <div><p className="text-xs text-slate-500">Resumo</p><p className="text-sm text-slate-300">{event.summary}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
