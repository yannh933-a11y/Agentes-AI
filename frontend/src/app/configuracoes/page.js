import { Card, Pill, ButtonLink } from '../components/ui';
import { DashboardShell } from '../components/DashboardShell';
import { aiProviders, agentOperatingModes, promptBlueprints, aiQualityChecklist } from '../../lib/ai-config';
import { currentTenant } from '../../lib/tenant';

export const metadata = { title: 'Configurações de IA | Agentes AI' };

const settings = [
  ['Perfil da empresa', 'Nome, segmento, canais, horários e dados públicos que os agentes podem usar.', 'Pronto'],
  ['Tom de voz', 'Define se a IA fala de forma formal, consultiva, direta ou personalizada por marca.', 'Pronto'],
  ['Limites do agente', 'Regras sobre o que a IA pode responder, quando deve pedir confirmação e quando deve escalar.', 'Pronto'],
  ['Escalação humana', 'Casos financeiros, jurídicos, reclamações, descontos e dados sensíveis vão para humano.', 'Pronto'],
  ['Provedores de IA', 'Anthropic, OpenAI, Groq ou modo demo seguro conforme variáveis de ambiente.', 'Preparado'],
  ['Integrações', 'WhatsApp, Instagram, CRM, Google Calendar, e-mail e webhooks com isolamento por empresa.', 'Preparado'],
  ['Auditoria', 'Registro de documentos usados, flags de segurança, latência e provider usado.', 'Preparado'],
];

export default function Page() {
  return (
    <DashboardShell
      title="Configurações de IA"
      description="Controle empresa, usuários, prompts, provedores, limites e regras de segurança dos agentes antes de colocá-los em produção."
      actions={<><ButtonLink href="/integracoes">Gerenciar integrações</ButtonLink><ButtonLink href="/ia-lab" variant="secondary">Abrir IA Lab</ButtonLink></>}
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {settings.map(([title, desc, status]) => (
          <Card key={title}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-black">{title}</h2>
              <Pill tone={status === 'Pronto' ? 'green' : 'default'}>{status}</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>
            <button className="btn-outline mt-5 rounded-full px-5 py-3 text-sm font-black">Configurar</button>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <h2 className="text-2xl font-black">Provedores preparados</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">O sistema escolhe o provider por variável de ambiente e cai para modo demo seguro se nenhuma chave estiver configurada.</p>
          <div className="mt-5 space-y-3">
            {aiProviders.map((provider) => (
              <div key={provider.key} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="font-black text-white">{provider.label}</p>
                  <p className="text-xs text-slate-500">ENV: {provider.env}</p>
                </div>
                <Pill tone={provider.status === 'Ativo' || provider.status === 'Configurado' ? 'green' : 'default'}>{provider.status}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black">Prompts por tipo de agente</h2>
          <div className="mt-5 space-y-3">
            {Object.entries(promptBlueprints).map(([slug, config]) => (
              <div key={slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black capitalize text-white">{slug}</p>
                  <Pill>{config.tone}</Pill>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{config.goal}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {config.limits.slice(0, 3).map((item) => <span key={item} className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-100">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">Modo de operação</h2>
          <div className="mt-5 space-y-3">
            {agentOperatingModes.map((mode, index) => (
              <div key={mode.key} className={`rounded-2xl border p-4 ${index === 1 ? 'border-red-500/30 bg-red-500/10' : 'border-white/10 bg-white/[0.03]'}`}>
                <p className="font-black text-white">{mode.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{mode.description}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Política da {currentTenant.nome}</h2>
          <div className="mt-5 space-y-2">
            {aiQualityChecklist.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-slate-400">✓ {item}</div>)}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
