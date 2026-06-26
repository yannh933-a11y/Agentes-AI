// Webhook handler para todos os bots de agentes
// URL: /api/bot/[token_id]

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const DB_URL = process.env.DATABASE_URL;

// Mapeamento token_id → config do agente
const BOTS = {
  '8668251107': { nome: 'Agente de Atendimento', emoji: '🎧', tipo: 'atendimento', token: '8668251107:AAEOb_vVHoWxMeebpwRp6aB-5A6sZM1b7BU' },
  '8607324322': { nome: 'Agente de Calendário',  emoji: '🗓️', tipo: 'calendario',  token: '8607324322:AAEW3qZksTiZ4BUYkSFOxzXctzAV87Pqs78' },
  '8656807594': { nome: 'Agente de Suporte',     emoji: '🛠️', tipo: 'suporte',     token: '8656807594:AAGiGzbfM3YHrlyKMgLZJI8-z-H96BllGN0' },
  '8607327770': { nome: 'Agente de Agendamento', emoji: '📅', tipo: 'agendamento', token: '8607327770:AAEe1uL5f_0aj-XsG0zlHaZ1MF0r8IPlLoY' },
  '8709823664': { nome: 'Agente de Vendas',      emoji: '💰', tipo: 'vendas',      token: '8709823664:AAFmpZFfnImNgSrRMBwEZyGPlsK7ybsQcKQ' },
  '8600780400': { nome: 'Agente de Emails',      emoji: '📧', tipo: 'emails',      token: '8600780400:AAG60mfWxYfEkspDZrihSVO5ah6fUBLvt_E' },
};

// Histórico em memória (ok perder entre requests — apenas contexto de conversa)
const historicos = {};

async function getDb() {
  const { Client } = await import('pg');
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

async function initDb(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS clientes_bot (
      id SERIAL PRIMARY KEY,
      codigo TEXT UNIQUE,
      chat_id BIGINT,
      bot_tipo TEXT,
      estado TEXT DEFAULT 'aguardando_codigo',
      nome_negocio TEXT,
      horario TEXT,
      servicos TEXT,
      info_extra TEXT,
      ativo BOOLEAN DEFAULT true,
      criado_em TIMESTAMP DEFAULT NOW()
    )
  `);
  // Adiciona coluna estado se não existir (migração)
  await client.query(`ALTER TABLE clientes_bot ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'aguardando_codigo'`).catch(() => {});
}

async function getClientePorCodigo(client, codigo) {
  const { rows } = await client.query('SELECT * FROM clientes_bot WHERE codigo=$1 AND ativo=true', [codigo]);
  return rows[0] || null;
}

async function getClientePorChat(client, chatId, botTipo) {
  const { rows } = await client.query('SELECT * FROM clientes_bot WHERE chat_id=$1 AND bot_tipo=$2 AND ativo=true', [chatId, botTipo]);
  return rows[0] || null;
}

async function ativarCliente(client, codigo, chatId, botTipo) {
  await client.query('UPDATE clientes_bot SET chat_id=$1 WHERE codigo=$2 AND bot_tipo=$3', [chatId, codigo, botTipo]);
  const { rows } = await client.query('SELECT * FROM clientes_bot WHERE codigo=$1', [codigo]);
  return rows[0] || null;
}

async function salvarConfig(client, chatId, botTipo, campo, valor) {
  await client.query(`UPDATE clientes_bot SET ${campo}=$1 WHERE chat_id=$2 AND bot_tipo=$3`, [valor, chatId, botTipo]);
}

async function salvarEstado(client, chatId, botTipo, estado) {
  await client.query(`UPDATE clientes_bot SET estado=$1 WHERE chat_id=$2 AND bot_tipo=$3`, [estado, chatId, botTipo]);
}

async function getEstado(client, chatId, botTipo) {
  const { rows } = await client.query('SELECT estado FROM clientes_bot WHERE chat_id=$1 AND bot_tipo=$2', [chatId, botTipo]);
  return rows[0]?.estado || null;
}

async function sendMsg(token, chatId, text, teclado = null) {
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (teclado) body.reply_markup = { keyboard: teclado, resize_keyboard: true, one_time_keyboard: true };
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function gerarResposta(pergunta, cliente, botConfig) {
  const key = `${cliente.chat_id}_${botConfig.tipo}`;
  if (!historicos[key]) historicos[key] = [];
  historicos[key].push({ role: 'user', content: pergunta });
  if (historicos[key].length > 10) historicos[key] = historicos[key].slice(-10);

  const prompts = {
    atendimento: `Você é o assistente de atendimento do negócio "${cliente.nome_negocio}" 🎧.
Horário: ${cliente.horario || 'não informado'} | Serviços: ${cliente.servicos || 'não informado'} | Info: ${cliente.info_extra || ''}
Sua função: responder dúvidas dos clientes, informar horários, preços e serviços. Seja cordial e prestativo. Máx 3 linhas.`,

    calendario: `Você é o assistente de calendário do negócio "${cliente.nome_negocio}" 🗓️.
Horário: ${cliente.horario || 'não informado'} | Serviços: ${cliente.servicos || 'não informado'} | Info: ${cliente.info_extra || ''}
Sua função: ajudar a organizar agenda, informar disponibilidade, registrar compromissos e enviar lembretes. Máx 3 linhas.`,

    suporte: `Você é o assistente de suporte do negócio "${cliente.nome_negocio}" 🛠️.
Horário: ${cliente.horario || 'não informado'} | Serviços: ${cliente.servicos || 'não informado'} | Info: ${cliente.info_extra || ''}
Sua função: resolver problemas pós-venda, acompanhar reclamações e orientar clientes com dificuldades. Seja paciente e solucione o problema. Máx 3 linhas.`,

    agendamento: `Você é o assistente de agendamento do negócio "${cliente.nome_negocio}" 📅.
Horário: ${cliente.horario || 'não informado'} | Serviços: ${cliente.servicos || 'não informado'} | Info: ${cliente.info_extra || ''}
Sua função: marcar, confirmar e cancelar horários. Ao marcar, confirme: serviço, data, horário e nome do cliente. Seja organizado e objetivo. Máx 3 linhas.`,

    vendas: `Você é o agente de vendas do negócio "${cliente.nome_negocio}" 💰.
Horário: ${cliente.horario || 'não informado'} | Produtos/Serviços: ${cliente.servicos || 'não informado'} | Info: ${cliente.info_extra || ''}
Sua função: qualificar leads, apresentar produtos/serviços, responder objeções e conduzir o cliente até a decisão de compra. Seja persuasivo, entusiasmado e focado em converter. Máx 3 linhas.`,

    emails: `Você é o agente de emails do negócio "${cliente.nome_negocio}" 📧.
Horário: ${cliente.horario || 'não informado'} | Serviços: ${cliente.servicos || 'não informado'} | Info: ${cliente.info_extra || ''}
Sua função: redigir, responder e classificar emails com linguagem profissional. Quando solicitado, crie emails formais, de cobrança, agradecimento ou promoção. Seja claro e profissional. Máx 4 linhas.`,
  };

  const system = prompts[botConfig.tipo] || `Você é assistente do negócio "${cliente.nome_negocio}". Horário: ${cliente.horario}. Serviços: ${cliente.servicos}. Seja cordial. Máx 3 linhas.`;

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'system', content: system }, ...historicos[key]],
      max_tokens: 200, temperature: 0.7,
    }),
  });
  const data = await res.json();
  const resposta = data.choices?.[0]?.message?.content || 'Desculpe, tente novamente!';
  historicos[key].push({ role: 'assistant', content: resposta });
  return resposta;
}

export async function POST(req, { params }) {
  const tokenId = params.token;
  const botConfig = BOTS[tokenId];
  if (!botConfig) return Response.json({ ok: false });

  let update;
  try { update = await req.json(); } catch { return Response.json({ ok: false }); }

  const msg = update.message;
  if (!msg || !msg.text) return Response.json({ ok: true });

  const chatId = msg.chat.id;
  const texto = msg.text.trim();

  let dbClient;
  try {
    dbClient = await getDb();
    await initDb(dbClient);

    const clienteAtivo = await getClientePorChat(dbClient, chatId, botConfig.tipo);
    const estado = clienteAtivo?.estado || null;

    // ── ADMIN (Yann): modo livre, faz qualquer coisa ──
    if (chatId === 6495609272) {
      const adminSystem = `Você é um assistente pessoal do Yann, dono da AgentesIA. Responda de forma direta e objetiva. Faça qualquer tarefa que ele pedir. Máx 3 linhas por resposta.`;
      const key = `admin_${botConfig.tipo}`;
      if (!historicos[key]) historicos[key] = [];
      historicos[key].push({ role: 'user', content: texto });
      if (historicos[key].length > 20) historicos[key] = historicos[key].slice(-20);
      const res = await fetch(GROQ_API, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'system', content: adminSystem }, ...historicos[key]], max_tokens: 500, temperature: 0.8 }),
      });
      const data = await res.json();
      const resposta = data.choices?.[0]?.message?.content || 'Erro ao processar.';
      historicos[key].push({ role: 'assistant', content: resposta });
      await sendMsg(botConfig.token, chatId, resposta);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    // ── CLIENTE CONFIGURADO: responde normalmente ──
    if (clienteAtivo && clienteAtivo.nome_negocio && estado === 'ativo') {
      const resposta = await gerarResposta(texto, clienteAtivo, botConfig);
      await sendMsg(botConfig.token, chatId, resposta);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    // ── /start ──
    if (texto === '/start' || texto.startsWith('/start')) {
      if (clienteAtivo && clienteAtivo.nome_negocio) {
        await sendMsg(botConfig.token, chatId, `Olá! Seu ${botConfig.nome} já está ativo para *${clienteAtivo.nome_negocio}*. Como posso ajudar?`);
      } else {
        await sendMsg(botConfig.token, chatId, `Bem-vindo ao ${botConfig.nome} ${botConfig.emoji}!\n\nEnvie seu *código de ativação* para começar.`);
      }
      await dbClient.end();
      return Response.json({ ok: true });
    }

    // ── AGUARDANDO CÓDIGO ──
    if (!clienteAtivo || estado === 'aguardando_codigo') {
      const codigo = texto.toUpperCase().replace(/\s/g, '');
      const registro = await getClientePorCodigo(dbClient, codigo);

      if (!registro) {
        await sendMsg(botConfig.token, chatId, '❌ Código inválido. Verifique seu email e tente novamente.\n\nSe ainda não tem um código, acesse https://agentes-ai-two.vercel.app/agentes');
        await dbClient.end();
        return Response.json({ ok: true });
      }

      await ativarCliente(dbClient, codigo, chatId, botConfig.tipo);
      await salvarEstado(dbClient, chatId, botConfig.tipo, 'config_nome');
      await sendMsg(botConfig.token, chatId, `✅ Código válido! Vamos configurar seu agente.\n\n*Qual o nome do seu negócio?*`);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    // ── CONFIGURAÇÃO ──
    if (estado === 'config_nome') {
      await salvarConfig(dbClient, chatId, botConfig.tipo, 'nome_negocio', texto);
      await salvarEstado(dbClient, chatId, botConfig.tipo, 'config_horario');
      await sendMsg(botConfig.token, chatId, `Ótimo! *Qual o horário de funcionamento?*\n\nEx: Seg-Sex 8h-18h, Sáb 8h-12h`);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    if (estado === 'config_horario') {
      await salvarConfig(dbClient, chatId, botConfig.tipo, 'horario', texto);
      await salvarEstado(dbClient, chatId, botConfig.tipo, 'config_servicos');
      await sendMsg(botConfig.token, chatId, `Quais são seus *serviços ou produtos*?\n\nEx: Corte, barba, hidratação`);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    if (estado === 'config_servicos') {
      await salvarConfig(dbClient, chatId, botConfig.tipo, 'servicos', texto);
      await salvarEstado(dbClient, chatId, botConfig.tipo, 'config_extra');
      await sendMsg(botConfig.token, chatId, `Alguma informação extra? (endereço, preços, etc)\n\nOu envie *pular* para finalizar.`);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    if (estado === 'config_extra') {
      if (texto.toLowerCase() !== 'pular') {
        await salvarConfig(dbClient, chatId, botConfig.tipo, 'info_extra', texto);
      }
      await salvarEstado(dbClient, chatId, botConfig.tipo, 'ativo');
      const cliente = await getClientePorChat(dbClient, chatId, botConfig.tipo);
      await sendMsg(botConfig.token, chatId, `🎉 *${botConfig.nome} ativado para ${cliente?.nome_negocio}!*\n\nSeus clientes já podem enviar mensagens aqui. Estou pronto 24h!`);
      await dbClient.end();
      return Response.json({ ok: true });
    }

    await dbClient.end();
  } catch (e) {
    console.error(e.message);
    try { await dbClient?.end(); } catch {}
  }

  return Response.json({ ok: true });
}
