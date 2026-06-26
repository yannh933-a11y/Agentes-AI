import crypto from 'crypto';
import { currentTenant } from '../tenant';
import { getAgentAiProfile, buildSystemPrompt, aiQualityChecklist } from '../ai-config';
import { searchKnowledge } from './knowledge-repository';
import { ensureCommercialSchema, withDatabase } from './database';

function detectSafetyFlags(message = '') {
  const text = String(message).toLowerCase();
  const flags = [];
  const patterns = [
    ['dados_sensiveis', ['senha', 'cartão', 'cartao', 'cpf', 'cnpj', 'token', 'chave']],
    ['financeiro', ['cobrança', 'cobranca', 'reembolso', 'boleto', 'pagamento']],
    ['cancelamento', ['cancelar', 'cancelamento', 'reclamação', 'reclamacao']],
    ['fora_da_base', ['garantia', 'processo', 'contrato', 'jurídico', 'juridico']],
  ];
  for (const [flag, words] of patterns) {
    if (words.some((word) => text.includes(word))) flags.push(flag);
  }
  return flags;
}

function buildDemoResponse({ agentSlug, message, relevantDocs, safetyFlags }) {
  const text = String(message || '').toLowerCase();
  const docHint = relevantDocs?.[0]?.title ? `Consultei a base “${relevantDocs[0].title}”. ` : '';
  const escalation = safetyFlags.length ? 'Esse ponto pode precisar de validação humana, então vou registrar para a equipe confirmar com segurança. ' : '';

  if (text.includes('preço') || text.includes('valor') || text.includes('plano') || text.includes('quanto custa')) {
    return `${docHint}Para empresas que querem atendimento e vendas com base própria, o plano Pro costuma ser o melhor começo. Antes de indicar com precisão, sua prioridade é atender clientes, vender mais ou integrar canais?`;
  }

  if (text.includes('whatsapp') || text.includes('instagram') || text.includes('site')) {
    return `${docHint}Sim, o agente pode ser preparado para operar no canal principal da empresa e manter o histórico separado por cliente. Qual canal você quer priorizar primeiro?`;
  }

  if (text.includes('documento') || text.includes('base') || text.includes('treinar')) {
    return `${docHint}A base de conhecimento define o que o agente pode responder. O ideal é publicar FAQ, tabela de planos, regras de atendimento e limites de escalação humana.`;
  }

  if (agentSlug === 'vendas') {
    return `${docHint}${escalation}Entendi. Para qualificar corretamente, me diga o segmento da empresa e o principal gargalo comercial hoje.`;
  }

  return `${docHint}${escalation}Entendi. Posso te orientar com base nas regras da empresa. Para continuar com segurança, qual é o principal objetivo desse atendimento?`;
}

async function callAnthropic({ systemPrompt, message }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 320,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    }),
  });
  if (!response.ok) throw new Error(`Anthropic retornou ${response.status}`);
  const data = await response.json();
  return data.content?.map((part) => part.text).join('\n').trim() || null;
}

async function callOpenAI({ systemPrompt, message }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 320,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
    }),
  });
  if (!response.ok) throw new Error(`OpenAI retornou ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

async function callGroq({ systemPrompt, message }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.35,
      max_tokens: 300,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
    }),
  });
  if (!response.ok) throw new Error(`Groq retornou ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

async function persistRun({ companyId, agentSlug, conversationId, provider, input, output, usedDocuments, safetyFlags, latencyMs }) {
  await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    await client.query(
      `INSERT INTO ai_agent_runs (id, company_id, agent_slug, conversation_id, provider, input, output, used_documents, safety_flags, latency_ms)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [`run_${crypto.randomUUID()}`, companyId, agentSlug, conversationId || null, provider, input, output, JSON.stringify(usedDocuments || []), JSON.stringify(safetyFlags || []), latencyMs || 0]
    );
  });
}

export async function generateAgentPreview({ companyId = currentTenant.id, agentSlug = 'atendimento', message = '', conversationId = null } = {}) {
  const started = Date.now();
  const profile = getAgentAiProfile(agentSlug);
  const relevant = await searchKnowledge({ companyId, agentSlug, message, limit: 4 });
  const safetyFlags = detectSafetyFlags(message);
  const systemPrompt = buildSystemPrompt({
    company: currentTenant,
    agent: profile.agent,
    blueprint: profile.blueprint,
    documents: relevant.items,
  });

  let provider = 'demo';
  let answer = null;

  try {
    if (process.env.AI_PROVIDER === 'openai') {
      provider = 'openai';
      answer = await callOpenAI({ systemPrompt, message });
    } else if (process.env.AI_PROVIDER === 'groq') {
      provider = 'groq';
      answer = await callGroq({ systemPrompt, message });
    } else {
      provider = process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'demo';
      answer = await callAnthropic({ systemPrompt, message });
    }
  } catch (error) {
    provider = `${provider}_fallback`;
    answer = null;
  }

  if (!answer) {
    provider = provider.includes('fallback') ? provider : 'demo';
    answer = buildDemoResponse({ agentSlug, message, relevantDocs: relevant.items, safetyFlags });
  }

  const latencyMs = Date.now() - started;
  const usedDocuments = relevant.items.map((doc) => ({ id: doc.id, title: doc.title, status: doc.status, relevance: doc.relevance || null }));

  await persistRun({ companyId, agentSlug, conversationId, provider, input: message, output: answer, usedDocuments, safetyFlags, latencyMs });

  return {
    companyId,
    agentSlug,
    provider,
    answer,
    usedDocuments,
    safetyFlags,
    qualityChecklist: aiQualityChecklist,
    latencyMs,
    systemPreview: systemPrompt.slice(0, 1200),
  };
}
