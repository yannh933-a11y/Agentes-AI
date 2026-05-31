// Gera código de ativação após pagamento confirmado
const DB_URL = process.env.DATABASE_URL;
const BOT_TOKEN_ADMIN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE = 'https://agentes-ai-two.vercel.app';
const FROM = 'AgentesIA <onboarding@resend.dev>';

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

const base = (content) => `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#f1f5f9;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
  <div style="text-align:center;margin-bottom:28px">
    <div style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);width:48px;height:48px;border-radius:12px;font-size:22px;line-height:48px">🤖</div>
    <h2 style="color:#fff;margin:12px 0 0;font-size:22px">AgentesIA</h2>
  </div>
  ${content}
  <p style="color:#475569;font-size:12px;text-align:center;margin-top:32px">
    Dúvidas? <a href="${SITE}/suporte" style="color:#ef4444">Suporte 24h</a>
  </p>
</div>`;

async function enviarEmailCompra({ nome, email, agente, codigo, linkBot }) {
  const subject = '✅ Pagamento confirmado — seu agente está pronto!';
  const html = base(`
    <h3 style="color:#fff;margin:0 0 12px">Pagamento confirmado! ✅</h3>
    <p style="color:#94a3b8;line-height:1.7">Obrigado, <strong style="color:#fff">${nome}</strong>! Seu <strong style="color:#fff">${agente}</strong> já está pronto para ativar.</p>

    <div style="background:#0a0a14;border:2px solid rgba(220,38,38,0.4);border-radius:12px;padding:20px;margin:24px 0;text-align:center">
      <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Seu código de ativação</p>
      <p style="color:#fff;font-size:36px;font-weight:900;letter-spacing:8px;margin:0;font-family:monospace">${codigo}</p>
    </div>

    <div style="background:#0a0a14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin:20px 0">
      <p style="color:#fca5a5;font-size:14px;margin:0 0 12px"><strong>Como ativar em 3 passos:</strong></p>
      <ol style="color:#94a3b8;font-size:14px;line-height:2.2;margin:0;padding-left:20px">
        <li>Clique no botão abaixo para abrir seu bot no Telegram</li>
        <li>Envie o código acima quando o bot pedir</li>
        <li>Configure nome, horários e serviços — pronto! 🎉</li>
      </ol>
    </div>

    <div style="text-align:center;margin:28px 0">
      <a href="${linkBot}" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:700;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:15px">🤖 Abrir meu bot no Telegram →</a>
    </div>
  `);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: email, subject, html }),
  });
  return res.ok;
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
        bot_tipo TEXT, estado TEXT DEFAULT 'aguardando_codigo', nome_negocio TEXT,
        horario TEXT, servicos TEXT, info_extra TEXT, ativo BOOLEAN DEFAULT true,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `);
    await client.query(
      'INSERT INTO clientes_bot (codigo, bot_tipo) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [codigo, tipoAgente]
    );
    await client.end();

    // Envia email diretamente via Resend (sem auto-chamada HTTP)
    const emailOk = await enviarEmailCompra({ nome, email, agente: tipoAgente, codigo, linkBot });

    // Notifica Yann no Telegram
    if (BOT_TOKEN_ADMIN && ADMIN_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN_ADMIN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: `💰 *Nova compra!*\n👤 ${nome}\n📧 ${email}\n🤖 ${tipoAgente}\n🔑 Código: \`${codigo}\`\n📧 Email: ${emailOk ? '✅ enviado' : '❌ falhou'}`,
          parse_mode: 'Markdown',
        }),
      }).catch(() => {});
    }

    return Response.json({ ok: true, codigo, linkBot, emailOk });
  } catch (e) {
    console.error('Ativar erro:', e.message);
    return Response.json({ erro: e.message }, { status: 500 });
  }
}
