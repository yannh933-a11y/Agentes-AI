// API Route: Chat inteligente com Groq + coleta de dados + armazenamento no Postgres

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const DB_URL = process.env.DATABASE_URL;

// Histórico em memória por sessão
const sessions = {};

const SYSTEM = `Você é o assistente da AgentesIA — empresa que vende agentes de IA para negócios via Telegram.

AGENTES E PREÇOS:
- Atendimento🎧: R$97 criação + R$59/mês
- Calendário🗓️: R$147 criação + R$69/mês
- Suporte🛠️: R$147 criação + R$69/mês
- Agendamento📅: R$197 criação + R$79/mês
- Vendas💰: R$247 criação + R$97/mês
- Emails📧: R$247 criação + R$97/mês
- Manutenção🔧: R$299 criação + R$139/mês

REGRAS:
1. Seja natural e receptivo como uma pessoa real
2. Respostas curtas (máx 3 linhas)
3. Colete naturalmente: nome, email, telefone, interesse do cliente
4. Quando tiver nome+email, confirme os dados coletados de forma sutil
5. Nunca invente informações
6. Sugira o agente certo para cada tipo de negócio
7. NUNCA ofereça, sugira ou mencione agendamento de demonstração`;

async function saveToDb(data) {
  if (!DB_URL) return;
  try {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads_suporte (
        id SERIAL PRIMARY KEY,
        session_id TEXT,
        nome TEXT,
        email TEXT,
        telefone TEXT,
        interesse TEXT,
        agente_adquirido TEXT,
        mensagens INTEGER DEFAULT 0,
        criado_em TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW(),
        UNIQUE(session_id)
      )
    `);
    await client.query(`
      INSERT INTO leads_suporte (session_id, nome, email, telefone, interesse, agente_adquirido, mensagens)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (session_id) DO UPDATE SET
        nome = COALESCE(EXCLUDED.nome, leads_suporte.nome),
        email = COALESCE(EXCLUDED.email, leads_suporte.email),
        telefone = COALESCE(EXCLUDED.telefone, leads_suporte.telefone),
        interesse = COALESCE(EXCLUDED.interesse, leads_suporte.interesse),
        agente_adquirido = COALESCE(EXCLUDED.agente_adquirido, leads_suporte.agente_adquirido),
        mensagens = EXCLUDED.mensagens,
        atualizado_em = NOW()
    `, [data.sessionId, data.nome, data.email, data.telefone, data.interesse, data.agenteAdquirido, data.mensagens]);
    await client.end();
  } catch (e) {
    console.error('DB error:', e.message);
  }
}

async function notifyAdmin(texto) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: texto, parse_mode: 'Markdown' }),
    });
  } catch {}
}

function extractData(messages) {
  const text = messages.map(m => m.content).join(' ');
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/);
  const namePatterns = [
    /(?:me chamo|meu nome é|sou o|sou a|pode me chamar de)\s+([A-Z][a-záéíóúâêîôûãõç]+(?:\s[A-Z][a-záéíóúâêîôûãõç]+)*)/i,
    /^([A-Z][a-záéíóúâêîôûãõç]+ [A-Z][a-záéíóúâêîôûãõç]+)/m,
  ];
  let nome = null;
  for (const p of namePatterns) {
    const m = text.match(p);
    if (m) { nome = m[1]; break; }
  }
  const interests = ['barbearia','clínica','clinica','restaurante','academia','loja','salão','salao','empresa','negócio','negocio'];
  const interesse = interests.find(i => text.toLowerCase().includes(i)) || null;
  const agentes = ['atendimento','calendário','calendario','suporte','agendamento','vendas','emails','manutenção','manutencao'];
  const agenteAdquirido = agentes.find(a => text.toLowerCase().includes(a)) || null;
  return { nome, email: emailMatch?.[0] || null, telefone: phoneMatch?.[1] || null, interesse, agenteAdquirido };
}

export async function POST(req) {
  try {
    const { sessionId, texto } = await req.json();
    if (!sessionId || !texto) return Response.json({ erro: 'Dados inválidos' }, { status: 400 });

    if (!sessions[sessionId]) sessions[sessionId] = { messages: [], dados: {} };
    const sess = sessions[sessionId];

    sess.messages.push({ role: 'user', content: texto });
    if (sess.messages.length > 12) sess.messages = sess.messages.slice(-12);

    // Chama Groq
    const groqRes = await fetch(GROQ_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: SYSTEM }, ...sess.messages],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });
    const groqData = await groqRes.json();
    const resposta = groqData.choices?.[0]?.message?.content || 'Desculpe, tente novamente!';
    sess.messages.push({ role: 'assistant', content: resposta });

    // Extrai dados da conversa
    const extracted = extractData(sess.messages);
    const dadosAntigos = sess.dados;
    sess.dados = {
      nome: extracted.nome || dadosAntigos.nome,
      email: extracted.email || dadosAntigos.email,
      telefone: extracted.telefone || dadosAntigos.telefone,
      interesse: extracted.interesse || dadosAntigos.interesse,
      agenteAdquirido: extracted.agenteAdquirido || dadosAntigos.agenteAdquirido,
    };

    // Salva no DB quando tiver email
    if (sess.dados.email) {
      await saveToDb({ sessionId, ...sess.dados, mensagens: sess.messages.length });

      // Notifica admin no Telegram quando lead completo (nome + email)
      if (sess.dados.nome && sess.dados.email && !dadosAntigos.email) {
        await notifyAdmin(
          `🔔 *Novo lead no suporte!*\n👤 ${sess.dados.nome}\n📧 ${sess.dados.email}${sess.dados.telefone ? `\n📱 ${sess.dados.telefone}` : ''}${sess.dados.interesse ? `\n🎯 Interesse: ${sess.dados.interesse}` : ''}${sess.dados.agenteAdquirido ? `\n🤖 Agente: ${sess.dados.agenteAdquirido}` : ''}`
        );
      }
    }

    return Response.json({ resposta, dados: sess.dados });
  } catch (e) {
    console.error(e);
    return Response.json({ resposta: 'Erro temporário. Tente novamente! 😊' });
  }
}

// GET para consultar leads
export async function GET() {
  if (!DB_URL) return Response.json({ erro: 'DB não configurado' });
  try {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const { rows } = await client.query('SELECT * FROM leads_suporte ORDER BY atualizado_em DESC LIMIT 50');
    await client.end();
    return Response.json({ leads: rows });
  } catch (e) {
    return Response.json({ erro: e.message });
  }
}
