const DB_URL = process.env.DATABASE_URL;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

async function saveDb(data) {
  if (!DB_URL) return;
  try {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(`CREATE TABLE IF NOT EXISTS precadastros (
      id SERIAL PRIMARY KEY, nome TEXT, email TEXT UNIQUE, whatsapp TEXT, interesse TEXT, criado_em TIMESTAMP DEFAULT NOW()
    )`);
    await client.query(
      `INSERT INTO precadastros (nome, email, whatsapp, interesse) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO UPDATE SET nome=$1, whatsapp=$3, interesse=$4`,
      [data.nome, data.email, data.whatsapp, data.interesse]
    );
    await client.end();
  } catch (e) { console.error('DB:', e.message); }
}

async function notify(data) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;
  const txt = `📋 *Novo Pré-cadastro!*\n👤 ${data.nome}\n📧 ${data.email}${data.whatsapp ? `\n📱 ${data.whatsapp}` : ''}${data.interesse ? `\n🎯 Interesse: ${data.interesse}` : ''}`;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: txt, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nome, email } = body;
    if (!nome || !email) return Response.json({ erro: 'nome e email obrigatórios' }, { status: 400 });
    await Promise.all([saveDb(body), notify(body)]);
    return Response.json({ ok: true });
  } catch { return Response.json({ erro: 'Erro interno' }, { status: 500 }); }
}
