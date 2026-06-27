'use client';

import { useMemo, useState } from 'react';
import { currentTenant } from '../../lib/tenant';
import { aiProviders, aiQualityChecklist, getAgentAiProfile } from '../../lib/ai-config';
import { ButtonLink, Card, Container, Pill } from '../components/ui';

const labAgents = [
  {
    slug: 'atendimento',
    previewSlug: 'atendimento',
    nome: 'Atendimento',
    title: 'Agente de Atendimento',
    icon: 'AT',
    promessa: 'Responde dúvidas frequentes, coleta dados e encaminha casos importantes para a equipe.',
    resultado: 'Menos fila no WhatsApp, respostas mais rápidas e atendimento padronizado.',
    perguntas: [
      'Vocês atendem hoje? Quero saber horários e valores.',
      'Quais serviços vocês oferecem e como posso falar com alguém?',
      'Preciso remarcar um atendimento. Como funciona?',
    ],
    faz: ['Identifica a necessidade do cliente', 'Responde com base nas regras da empresa', 'Encaminha casos sensíveis para humano'],
  },
  {
    slug: 'vendas',
    previewSlug: 'vendas',
    nome: 'Vendas',
    title: 'Agente de Vendas',
    icon: 'VD',
    promessa: 'Qualifica interessados, responde objeções e leva o lead para a próxima etapa de compra.',
    resultado: 'Leads atendidos mais rápido e oportunidades comerciais menos esquecidas.',
    perguntas: [
      'Quanto custa e qual plano vocês recomendam para minha empresa?',
      'Quero vender mais pelo WhatsApp. Como esse agente ajudaria?',
      'Tenho muitos leads do Instagram, mas demoro para responder. O que dá para fazer?',
    ],
    faz: ['Entende o objetivo do lead', 'Sugere o próximo passo comercial', 'Evita prometer preços ou condições fora da política'],
  },
  {
    slug: 'suporte',
    previewSlug: 'suporte',
    nome: 'Suporte',
    title: 'Agente de Suporte',
    icon: 'SP',
    promessa: 'Ajuda clientes no pós-venda, organiza solicitações e reduz tickets repetitivos.',
    resultado: 'Mais organização no suporte e menos retrabalho para a equipe.',
    perguntas: [
      'Não consigo acessar minha conta. O que eu faço?',
      'Quero abrir um chamado de suporte. Quais dados você precisa?',
      'Meu pedido está com problema. Como posso resolver?',
    ],
    faz: ['Coleta contexto antes de acionar a equipe', 'Classifica a solicitação', 'Evita pedir senhas ou dados inseguros'],
  },
  {
    slug: 'agendamento',
    previewSlug: 'agendamento',
    nome: 'Agendamento',
    title: 'Agente de Agendamento',
    icon: 'AG',
    promessa: 'Ajuda a marcar, confirmar e remarcar horários seguindo as regras da empresa.',
    resultado: 'Mais horários preenchidos, menos mensagens manuais e menos esquecimentos.',
    perguntas: [
      'Tem horário disponível amanhã no fim da tarde?',
      'Quero marcar uma avaliação. Quais horários estão disponíveis?',
      'Preciso remarcar meu horário de hoje. Consegue me ajudar?',
    ],
    faz: ['Pergunta preferência de horário', 'Coleta dados para reserva', 'Confirma regras antes de finalizar'],
  },
  {
    slug: 'documentos',
    previewSlug: 'atendimento',
    nome: 'Documentos',
    title: 'Agente de Documentos',
    icon: 'DC',
    promessa: 'Usa FAQs, políticas, tabelas e materiais internos para responder com mais precisão.',
    resultado: 'Respostas consistentes, menos improviso e operação com base de conhecimento própria.',
    perguntas: [
      'Quero treinar o agente com documentos próprios. Como funciona?',
      'O agente consegue responder usando uma tabela de planos ou FAQ?',
      'Como vocês evitam que o agente invente informações?',
    ],
    faz: ['Consulta a base da empresa', 'Responde dentro dos limites cadastrados', 'Pede validação humana quando falta informação'],
  },
  {
    slug: 'personalizado',
    previewSlug: 'vendas',
    nome: 'Personalizado',
    title: 'Agente Personalizado',
    icon: 'IA',
    promessa: 'Combina atendimento, vendas, suporte e automações de acordo com a operação da empresa.',
    resultado: 'Um agente desenhado para o processo real do cliente, não um chatbot genérico.',
    perguntas: [
      'Minha empresa tem um processo próprio. Vocês conseguem criar um agente sob medida?',
      'Quero automatizar atendimento, vendas e suporte no mesmo fluxo. É possível?',
      'Como vocês descobrem qual agente faz mais sentido para meu negócio?',
    ],
    faz: ['Mapeia o processo antes de sugerir solução', 'Combina fluxos comerciais e operacionais', 'Direciona para diagnóstico quando precisa de configuração sob medida'],
  },
];

const segmentos = [
  'Clínica ou consultório',
  'Loja ou e-commerce',
  'Escola ou curso',
  'Academia ou estética',
  'Prestador de serviço',
  'Imobiliária',
  'SaaS ou tecnologia',
  'Outro segmento',
];


function formatProviderLabel(provider) {
  const value = String(provider || '').toLowerCase();
  if (!value || value === 'demo' || value.includes('fallback')) return 'Simulação Agentes AI';
  if (value.includes('anthropic')) return 'IA conectada';
  if (value.includes('openai')) return 'IA conectada';
  if (value.includes('groq')) return 'IA conectada';
  return 'Resposta gerada';
}

function buildFallbackResult({ selectedAgent, segment, text }) {
  const lower = String(text || '').toLowerCase();
  const safeSegment = segment || 'sua empresa';

  let answer = `Perfeito. Para uma operação de ${safeSegment}, eu começaria entendendo o volume de mensagens, o canal principal e o tipo de dúvida mais comum. Com isso, o ${selectedAgent.title} pode responder o cliente, coletar informações e encaminhar para a equipe quando o caso precisar de validação humana.`;

  if (lower.includes('preço') || lower.includes('custa') || lower.includes('plano') || lower.includes('valor')) {
    answer = `Para indicar o melhor plano, eu preciso entender o objetivo principal: atendimento, vendas, suporte ou agendamento. Em uma operação de ${safeSegment}, normalmente começamos com um agente focado no canal com maior volume e evoluímos depois para integrações.`;
  }

  if (lower.includes('whatsapp') || lower.includes('instagram') || lower.includes('site')) {
    answer = `Sim. O agente pode ser preparado para atuar no canal principal da empresa, como WhatsApp, Instagram ou site. O primeiro passo é definir quais perguntas ele pode responder sozinho e quais situações devem ir para atendimento humano.`;
  }

  if (lower.includes('documento') || lower.includes('faq') || lower.includes('treinar') || lower.includes('base')) {
    answer = `Funciona assim: vocês enviam materiais como FAQ, regras, serviços, preços permitidos e políticas internas. A partir disso, o agente responde com base nesses conteúdos e evita inventar informações fora da base.`;
  }

  return {
    provider: 'Simulação Agentes AI',
    latencyMs: 0,
    answer,
    usedDocuments: [
      { id: 'demo_fluxo', title: 'Fluxo comercial demonstrativo', status: 'PUBLISHED' },
      { id: 'demo_regras', title: 'Regras de atendimento e escalação', status: 'PUBLISHED' },
    ],
    safetyFlags: lower.includes('cobrança') || lower.includes('cancelar') || lower.includes('reclamação') ? ['validacao_humana'] : [],
    systemPreview: `Agente: ${selectedAgent.title}\nSegmento: ${safeSegment}\nObjetivo: ${selectedAgent.promessa}\nRegras: responder com clareza, não inventar informações e encaminhar casos sensíveis para humano.`,
  };
}

export default function AiLabClient() {
  const [mode, setMode] = useState('cliente');
  const [agentSlug, setAgentSlug] = useState('vendas');
  const [segment, setSegment] = useState(segmentos[1]);
  const selectedAgent = useMemo(() => labAgents.find((agent) => agent.slug === agentSlug) || labAgents[0], [agentSlug]);
  const [message, setMessage] = useState(selectedAgent.perguntas[0]);
  const [lastQuestion, setLastQuestion] = useState(selectedAgent.perguntas[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const profile = useMemo(() => getAgentAiProfile(selectedAgent.previewSlug), [selectedAgent.previewSlug]);
  const preCadastroHref = `/pre-cadastro?agente=${encodeURIComponent(selectedAgent.nome)}&segmento=${encodeURIComponent(segment)}`;

  function selectAgent(nextSlug) {
    const nextAgent = labAgents.find((agent) => agent.slug === nextSlug) || labAgents[0];
    setAgentSlug(nextSlug);
    setMessage(nextAgent.perguntas[0]);
    setLastQuestion(nextAgent.perguntas[0]);
    setResult(null);
  }

  async function runPreview(text = message) {
    const cleanText = String(text || '').trim();
    if (!cleanText) return;

    setLoading(true);
    setMessage(cleanText);
    setLastQuestion(cleanText);
    setResult(null);

    try {
      const response = await fetch('/api/ai/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: currentTenant.id,
          agentSlug: selectedAgent.previewSlug,
          message: `Segmento da empresa: ${segment}. Mensagem do cliente: ${cleanText}`,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.answer) {
        throw new Error(data?.erro || 'Preview indisponível');
      }
      setResult(data);
    } catch (error) {
      setResult(buildFallbackResult({ selectedAgent, segment, text: cleanText }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-28 pb-20">
      <Container>
        <div className="mx-auto mb-8 max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">IA Lab</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Teste como um agente de IA atenderia sua empresa</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">Escolha um tipo de agente, simule uma conversa e veja como a Agentes AI pode automatizar atendimento, vendas e suporte.</p>
        </div>

        <div className="mx-auto mb-10 flex max-w-xl rounded-full border border-white/10 bg-white/[0.03] p-1">
          {[
            ['cliente', 'Modo Cliente'],
            ['tecnico', 'Modo Técnico'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              aria-pressed={mode === key}
              className={`flex-1 rounded-full px-5 py-3 text-sm font-black transition ${mode === key ? 'bg-red-500 text-white shadow-lg shadow-red-950/30' : 'text-slate-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'cliente' ? (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.15fr_0.9fr]">
            <Card className="self-start">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">Monte a simulação</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">Escolha o agente e o segmento para visualizar uma experiência parecida com um atendimento real.</p>
                </div>
                <Pill tone="green">Comercial</Pill>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Tipo de agente</label>
                  <div className="grid grid-cols-2 gap-2">
                    {labAgents.map((agent) => (
                      <button
                        key={agent.slug}
                        type="button"
                        onClick={() => selectAgent(agent.slug)}
                        className={`rounded-2xl border p-3 text-left transition ${agentSlug === agent.slug ? 'border-red-500/50 bg-red-500/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'}`}
                      >
                        <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-red-200">{agent.icon}</span>
                        <span className="mt-1 block text-sm font-black">{agent.nome}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Segmento da empresa</label>
                  <select value={segment} onChange={(event) => setSegment(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#07070f] px-4 py-3 text-sm text-white outline-none focus:border-red-500/50">
                    {segmentos.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Perguntas prontas</label>
                  <div className="space-y-2">
                    {selectedAgent.perguntas.map((item) => (
                      <button key={item} type="button" onClick={() => runPreview(item)} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left text-sm leading-relaxed text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="min-h-[620px]">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Chat demonstrativo</p>
                  <h2 className="mt-2 text-2xl font-black">{selectedAgent.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">Simulação para {segment.toLowerCase()}</p>
                </div>
                <Pill>{formatProviderLabel(result?.provider)}</Pill>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[86%] rounded-3xl rounded-tr-md bg-red-500 px-5 py-4 text-sm font-semibold leading-relaxed text-white shadow-lg shadow-red-950/30">
                    {lastQuestion}
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-relaxed text-slate-200">
                    {loading ? (
                      <span className="text-slate-400">O agente está analisando a mensagem e consultando as regras da empresa...</span>
                    ) : (
                      result?.answer || 'Escolha uma pergunta pronta ou escreva uma mensagem para ver a resposta do agente.'
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Escreva uma mensagem do cliente</label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#07070f] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-red-500/50"
                  placeholder="Exemplo: Quero saber valores, horários ou como funciona o atendimento."
                />
                <button type="button" onClick={() => runPreview()} disabled={loading || !message.trim()} className="btn-primary mt-3 w-full rounded-2xl px-5 py-4 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Simulando atendimento...' : 'Simular resposta do agente'}
                </button>
              </div>
            </Card>

            <div className="space-y-6 self-start">
              <Card>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Valor para a empresa</p>
                <h3 className="mt-3 text-2xl font-black">O que esse agente faz</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{selectedAgent.promessa}</p>
                <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold leading-relaxed text-emerald-100">
                  Resultado esperado: {selectedAgent.resultado}
                </div>
                <ul className="mt-5 space-y-3">
                  {selectedAgent.faz.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs text-red-200">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-xl font-black">O que aconteceu na simulação</h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-400">
                  <p>1. O agente identificou a intenção do cliente.</p>
                  <p>2. Consultou uma base ou regra demonstrativa.</p>
                  <p>3. Respondeu com próximo passo claro.</p>
                  {result?.safetyFlags?.length ? <p className="text-red-200">4. O caso tem sinal de atenção e deveria ser revisado por uma pessoa.</p> : <p>4. Se fosse um caso sensível, ele encaminharia para atendimento humano.</p>}
                </div>
              </Card>

              <Card className="border-red-500/20 bg-red-500/10">
                <h3 className="text-2xl font-black">Quer um agente assim?</h3>
                <p className="mt-3 text-sm leading-relaxed text-red-50/85">Receba um diagnóstico para saber qual agente faz mais sentido para sua empresa.</p>
                <ButtonLink href={preCadastroHref} className="mt-5 w-full">Quero um agente assim</ButtonLink>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Modo Técnico</p>
                  <h2 className="mt-2 text-2xl font-black">Configuração operacional</h2>
                  <p className="mt-2 text-sm text-slate-500">Empresa: {currentTenant.nome} • {currentTenant.plano}</p>
                </div>
                <Pill tone="green">Tenant isolado</Pill>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Agente técnico usado no preview</label>
                  <select value={agentSlug} onChange={(event) => selectAgent(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#07070f] px-4 py-3 text-sm text-white outline-none focus:border-red-500/50">
                    {labAgents.map((agent) => <option key={agent.slug} value={agent.slug}>{agent.title}</option>)}
                  </select>
                </div>

                <div>
                  <h3 className="text-xl font-black">Limites do agente</h3>
                  <div className="mt-4 grid gap-2">
                    {(profile.blueprint?.limits || []).map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-slate-400">✓ {item}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black">Provedores</h3>
                  <div className="mt-4 space-y-2">
                    {aiProviders.map((provider) => <div key={provider.key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3"><span className="text-sm font-bold text-slate-300">{provider.label}</span><Pill tone={provider.status === 'Ativo' || provider.status === 'Configurado' ? 'green' : 'default'}>{provider.status}</Pill></div>)}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-black">Prompt operacional</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">Resumo técnico do comportamento aplicado ao agente. Esta área fica separada para não confundir o visitante comercial.</p>
                <div className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">{result?.systemPreview || profile.systemPrompt}</div>
              </Card>

              <Card>
                <h2 className="text-2xl font-black">Base de conhecimento</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">Documentos demonstrativos que orientam as respostas do agente.</p>
                <div className="mt-5 grid gap-3">
                  {profile.documents.map((doc) => (
                    <div key={doc.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-black text-white">{doc.title}</p>
                        <Pill tone={doc.status === 'PUBLISHED' ? 'green' : 'default'}>{doc.status}</Pill>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{doc.content}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-black">Checklist de segurança e qualidade</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {aiQualityChecklist.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-slate-400">✓ {item}</div>)}
                </div>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/ia-lab" variant="outline">Continuar testando</ButtonLink>
          <ButtonLink href="/documentos" variant="outline">Gerenciar documentos</ButtonLink>
          <ButtonLink href={preCadastroHref}>Solicitar diagnóstico</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
