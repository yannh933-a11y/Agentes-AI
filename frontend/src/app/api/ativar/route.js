// Gera código de ativação após pagamento confirmado
const DB_URL = process.env.DATABASE_URL;
const BOT_TOKEN_ADMIN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

const BOTS_LINK = {
  atendimento: 'https://t.me/AgentesIA_Atendimento_bot',
  calendario:  'https://t.me/AgentesIA_Calendario_bot',
  suporte:     'https://t.me/AgentesIA_Suporte_bot',
  agendamento: 'https://t.me/AgentesIA_Agendamento_bot',
  vendas:      'https://t.me/AgentesIA_Vendas_bot',
  emails:      'https://t.me/AgentesIA_Emails_bot',
};

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req) {
  try {
    const { nome, email, tipoAgente } = await req.json();
    if (!nome || !email || !tipoAgente) return Response.json({ erro: 'dados inválidos' }, { status: 400 });

    const codigo = gerarCodigo();
    const linkBot = BOTS_LINK[tipoAgente] || 'https://t.me/AgentesIA_Atendimento_bot';

    // Salva no banco
    const { Client } = await import('pg');
    const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes_bot (
        id SERIAL PRIMARY KEY, codigo TEXT UNIQUE, chat_id BIGINT,
        bot_tipo TEXT, nome_negocio TEXT, horario TEXT, servicos TEXT,
        info_extra TEXT, ativo BOOLEAN DEFAULT true, criado_em TIMESTAMP DEFAULT NOW()
      )
    `);
    await client.query(
      'INSERT INTO clientes_bot (codigo, bot_tipo) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [codigo, tipoAgente]
    );
    await client.end();

    // Envia email com código e link
    await fetch('https://agentes-ai-two.vercel.app/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'compra', email, nome, agente: tipoAgente, codigo, linkBot }),
    }).catch(() => {});

    // Notifica admin
    if (BOT_TOKEN_ADMIN && ADMIN_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN_ADMIN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: `💰 *Nova compra!*\n👤 ${nome}\n📧 ${email}\n🤖 ${tipoAgente}\n🔑 Código: \`${codigo}\``,
          parse_mode: 'Markdown',
        }),
      }).catch(() => {});
    }

    return Response.json({ ok: true, codigo, linkBot });
  } catch (e) {
    return Response.json({ erro: e.message }, { status: 500 });
  }
}
