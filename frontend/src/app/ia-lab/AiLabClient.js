'use client';

import { useMemo, useState } from 'react';
import { agentes } from '../../lib/agentes';
import { currentTenant } from '../../lib/tenant';
import { aiProviders, aiQualityChecklist, getAgentAiProfile } from '../../lib/ai-config';
import { ButtonLink, Card, Container, Pill } from '../components/ui';

const exemplos = [
  'Quanto custa para colocar um agente no WhatsApp da minha empresa?',
  'Quero treinar o agente com documentos próprios. Como funciona?',
  'Vocês conseguem integrar com Instagram e Google Agenda?',
  'Tenho uma reclamação de cobrança. O agente pode resolver sozinho?',
];

export default function AiLabClient() {
  const [agentSlug, setAgentSlug] = useState('vendas');
  const [message, setMessage] = useState(exemplos[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const profile = useMemo(() => getAgentAiProfile(agentSlug), [agentSlug]);

  async function runPreview(text = message) {
    setLoading(true);
    setMessage(text);
    try {
      const response = await fetch('/api/ai/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: currentTenant.id, agentSlug, message: text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ erro: 'Não foi possível gerar a resposta agora.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">IA operacional</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Teste o agente com base de conhecimento, prompt e limites.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">O IA Lab simula como o agente usa documentos publicados, regras de segurança e contexto da empresa antes de ir ao vivo.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">Configuração do teste</h2>
                <p className="mt-2 text-sm text-slate-500">Empresa: {currentTenant.nome} • {currentTenant.plano}</p>
              </div>
              <Pill tone="green">Tenant isolado</Pill>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Agente</label>
                <select value={agentSlug} onChange={(event) => setAgentSlug(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#07070f] px-4 py-3 text-sm text-white outline-none focus:border-red-500/50">
                  {agentes.map((agent) => <option key={agent.slug} value={agent.slug}>{agent.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Mensagem do cliente</label>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} className="w-full resize-none rounded-2xl border border-white/10 bg-[#07070f] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-red-500/50" />
              </div>

              <div className="flex flex-wrap gap-2">
                {exemplos.map((item) => <button key={item} type="button" onClick={() => runPreview(item)} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/[0.06] hover:text-white">{item}</button>)}
              </div>

              <button type="button" onClick={() => runPreview()} disabled={loading} className="btn-primary w-full rounded-2xl px-5 py-4 text-sm font-black disabled:cursor-wait disabled:opacity-60">
                {loading ? 'Gerando resposta...' : 'Testar resposta do agente'}
              </button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Resposta gerada</h2>
                  <p className="mt-2 text-sm text-slate-500">Fornecedor: {result?.provider || 'aguardando teste'} {result?.latencyMs ? `• ${result.latencyMs}ms` : ''}</p>
                </div>
                {result?.safetyFlags?.length ? <Pill tone="red">Escalação sugerida</Pill> : <Pill>Preview</Pill>}
              </div>

              <div className="mt-5 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm leading-relaxed text-red-50">
                {result?.erro || result?.answer || 'Clique em “Testar resposta do agente” para gerar uma resposta com contexto.'}
              </div>

              {result?.usedDocuments?.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Documentos usados</p>
                  <div className="grid gap-2">
                    {result.usedDocuments.map((doc) => <div key={doc.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">{doc.title}</div>)}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-2xl font-black">Prompt operacional</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">Resumo do comportamento que será aplicado ao agente.</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400 whitespace-pre-wrap max-h-72 overflow-auto">{result?.systemPreview || profile.systemPrompt}</div>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card>
            <h3 className="text-xl font-black">Provedores</h3>
            <div className="mt-4 space-y-2">
              {aiProviders.map((provider) => <div key={provider.key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3"><span className="text-sm font-bold text-slate-300">{provider.label}</span><Pill tone={provider.status === 'Ativo' || provider.status === 'Configurado' ? 'green' : 'default'}>{provider.status}</Pill></div>)}
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="text-xl font-black">Checklist de qualidade</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {aiQualityChecklist.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-slate-400">✓ {item}</div>)}
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/documentos" variant="outline">Gerenciar documentos</ButtonLink>
          <ButtonLink href="/configuracoes" variant="outline">Configurar limites</ButtonLink>
          <ButtonLink href="/pre-cadastro">Solicitar implantação</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
