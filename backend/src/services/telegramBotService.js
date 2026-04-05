const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';

// Fila de respostas pendentes por sessão: { sessionId -> [msgs] }
const pendingReplies = {};

// Histórico de conversa por sessão (para contexto): { sessionId -> [msgs] }
const historico = {};

// Prompt de sistema — define a personalidade do bot (compacto para economizar tokens)
const SYSTEM_PROMPT = `Você é o assistente virtual da AgentesIA, uma empresa que vende agentes de IA para negócios via Telegram.

SEUS AGENTES E PREÇOS:
- Atendimento 🎧, Calendário 🗓️, Suporte 🛠️ → Ativação R$20 + R$50/mês (básicos)
- Agendamento 📅, Vendas 💰, Emails 📧, Manutenção 🔧 → Ativação R$20 + R$65/mês (avançados)

COMO FUNCIONA:
- Pagamento via PIX, ativação automática em até 5 minutos
- Agente funciona 24h no Telegram
- Cancele quando quiser, sem multa

SITE: https://agentes-ai-two.vercel.app
SUPORTE: suporte@agentesia.com.br

COMO SE COMPORTAR:
- Seja caloroso, natural e receptivo — como uma pessoa real, não um robô
- Respostas curtas e diretas (máx 3-4 linhas)
- Use emojis com moderação
- Se não souber algo, sugira contato por email
- Nunca invente informações
- Sempre que relevante, sugira o agente mais adequado para o negócio do cliente`;

// ─── Chama o Groq para gerar resposta inteligente ─────────────────────
async function gerarRespostaIA(sessionId, textoUsuario) {
  // Inicializa histórico da sessão
  if (!historico[sessionId]) {
    historico[sessionId] = [];
  }

  // Adiciona mensagem do usuário ao histórico
  historico[sessionId].push({ role: 'user', content: textoUsuario });

  // Mantém histórico curto (últimas 10 mensagens) para economizar tokens
  if (historico[sessionId].length > 10) {
    historico[sessionId] = historico[sessionId].slice(-10);
  }

  try {
    const response = await axios.post(
      GROQ_API,
      {
        model: 'llama-3.1-8b-instant', // Mais rápido e barato
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...historico[sessionId],
        ],
        max_tokens: 200,      // Respostas curtas para economizar
        temperature: 0.7,     // Natural mas focado
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const resposta = response.data.choices[0].message.content;

    // Adiciona resposta do bot ao histórico
    historico[sessionId].push({ role: 'assistant', content: resposta });

    return resposta;
  } catch (err) {
    console.error('Erro Groq:', err.response?.data || err.message);
    return 'Desculpe, tive um problema técnico. Por favor, tente novamente em instantes! 😊';
  }
}

// ─── Processa mensagem do site e gera resposta IA ─────────────────────
async function processarMensagemDoSite({ sessionId, texto }) {
  const resposta = await gerarRespostaIA(sessionId, texto);

  if (!pendingReplies[sessionId]) pendingReplies[sessionId] = [];
  pendingReplies[sessionId].push({
    texto: resposta,
    timestamp: Date.now(),
  });

  return { ok: true };
}

// ─── Site busca respostas pendentes ───────────────────────────────────
function buscarRespostas(sessionId) {
  const replies = pendingReplies[sessionId] || [];
  pendingReplies[sessionId] = [];
  return replies;
}

// ─── Mensagem de boas-vindas ──────────────────────────────────────────
function boasVindas() {
  return 'Olá! 😊 Sou o assistente da **AgentesIA**. Estou aqui para te ajudar a escolher o agente ideal para o seu negócio e tirar qualquer dúvida. Como posso te ajudar?';
}

// ─── Limpa históricos antigos (a cada 30 min) ─────────────────────────
setInterval(() => {
  const agora = Date.now();
  Object.keys(pendingReplies).forEach(sid => {
    if (!pendingReplies[sid] || pendingReplies[sid].length === 0) {
      delete pendingReplies[sid];
      delete historico[sid];
    }
  });
}, 30 * 60 * 1000);

module.exports = { processarMensagemDoSite, buscarRespostas, boasVindas };
