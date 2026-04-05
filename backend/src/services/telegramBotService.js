const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Cache em memória: { sessionId -> chatId } e { chatId -> sessionId }
// (reset ao reiniciar o servidor — suficiente para sessões de suporte)
const sessionToChat = {};
const chatToSession = {};

// Fila de respostas pendentes: { sessionId -> [msgs] }
const pendingReplies = {};

// ─── Base de respostas do bot (sem gastar tokens de IA) ──────────────
const FAQ_RESPOSTAS = {
  saudacao: `Olá! 😊 Bem-vindo ao suporte da *AgentesIA*.\n\nSou seu assistente virtual. Como posso te ajudar?\n\n• Preços e planos\n• Qual agente escolher\n• Como funciona o pagamento\n• Ativação e uso\n• Cancelamento`,

  preco: `💰 *Nossos preços:*\n\n🟢 *Básicos* (Atendimento, Calendário, Suporte)\n→ Ativação: R$ 20 | Mensalidade: R$ 50/mês\n\n🔴 *Avançados* (Vendas, Agendamento, Emails, Manutenção)\n→ Ativação: R$ 20 | Mensalidade: R$ 65/mês\n\nTodos incluem ativação em até 5 minutos! ⚡`,

  agente: `🤖 *Nossos agentes:*\n\n• 🎧 Atendimento — R$50/mês\n• 🗓️ Calendário — R$50/mês\n• 🛠️ Suporte — R$50/mês\n• 📅 Agendamento — R$65/mês\n• 💰 Vendas — R$65/mês\n• 📧 Emails — R$65/mês\n• 🔧 Manutenção — R$65/mês\n\nQual tipo de negócio você tem? Posso indicar o melhor! 😊`,

  pagamento: `💳 *Pagamento via PIX:*\n\n1. Escolha seu agente no site\n2. Preencha nome e email\n3. Receba o QR Code\n4. Pague com seu banco\n5. Confirmação instantânea ✅\n\nApós o pagamento, as credenciais chegam em até *5 minutos* no seu email!`,

  ativacao: `⚡ *Ativação rápida:*\n\nApós o pagamento:\n• Você recebe um email com as credenciais\n• Acesse o Telegram e encontre seu bot\n• Envie qualquer mensagem para ativá-lo\n• Insira o código de pareamento\n• Pronto! Funcionando 24h 🎉`,

  cancelamento: `❌ *Cancelamento:*\n\n• Cancele quando quiser, sem multa\n• O agente fica ativo até o fim do período pago\n• Envie email para suporte@agentesia.com.br\n\nNão há fidelidade nem complicação! 😊`,

  telegram: `📱 *Como usar no Telegram:*\n\n1. Após contratar, você recebe um código por email\n2. Abra o Telegram e encontre o bot do seu agente\n3. Envie uma mensagem para ativá-lo\n4. Digite o código de pareamento\n5. Pronto! Seus clientes já podem interagir 🚀`,

  padrao: `Entendi! 😊 Posso te ajudar com:\n\n• *Preços* — quanto custa cada agente\n• *Agentes* — qual é o ideal para você\n• *Pagamento* — como funciona o PIX\n• *Ativação* — quanto tempo leva\n• *Cancelamento* — como funciona\n\nSobre o que você quer saber?`,
};

function detectarTopico(texto) {
  const t = texto.toLowerCase();
  if (/olá|oi|bom dia|boa tarde|boa noite|hello|hey|tudo bem/.test(t)) return 'saudacao';
  if (/preço|preco|valor|custa|mensalidade|quanto|barato|caro/.test(t)) return 'preco';
  if (/agente|qual|escolher|indicar|recomendar|melhor|tipo/.test(t)) return 'agente';
  if (/pagar|pagamento|pix|boleto|forma de pag/.test(t)) return 'pagamento';
  if (/ativar|ativação|ativacao|prazo|quando recebo|tempo/.test(t)) return 'ativacao';
  if (/cancelar|cancelamento|desistir|reembolso|devolução/.test(t)) return 'cancelamento';
  if (/telegram|usar|como funciona|funciona/.test(t)) return 'telegram';
  return 'padrao';
}

// ─── Envia mensagem ao usuário via Telegram ───────────────────────────
async function enviarMensagemAoUsuario(chatId, texto) {
  try {
    await axios.post(`${API}/sendMessage`, {
      chat_id: chatId,
      text: texto,
      parse_mode: 'Markdown',
    });
  } catch (e) {
    console.error('Erro ao enviar mensagem Telegram:', e.message);
  }
}

// ─── Processa mensagem recebida do site (chat widget) ─────────────────
async function processarMensagemDoSite({ sessionId, texto }) {
  // Gera chatId virtual para esta sessão (reutiliza se já existe)
  if (!sessionToChat[sessionId]) {
    sessionToChat[sessionId] = sessionId; // Usa sessionId como identificador
    chatToSession[sessionId] = sessionId;
  }

  // Detecta tópico e gera resposta sem consumir IA externa
  const topico = detectarTopico(texto);
  const resposta = FAQ_RESPOSTAS[topico] || FAQ_RESPOSTAS.padrao;

  // Adiciona à fila de respostas pendentes para o site buscar
  if (!pendingReplies[sessionId]) pendingReplies[sessionId] = [];
  pendingReplies[sessionId].push({
    texto: resposta,
    timestamp: Date.now(),
  });

  return { ok: true };
}

// ─── Site busca as respostas pendentes ────────────────────────────────
function buscarRespostas(sessionId) {
  const replies = pendingReplies[sessionId] || [];
  pendingReplies[sessionId] = []; // Limpa após entregar
  return replies;
}

// ─── Mensagem de boas-vindas ao abrir o chat ─────────────────────────
function boasVindas() {
  return FAQ_RESPOSTAS.saudacao;
}

module.exports = { processarMensagemDoSite, buscarRespostas, boasVindas };
