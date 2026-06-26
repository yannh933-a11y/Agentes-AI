import { checkRateLimit, getClientIP, sanitizeBody, isValidEmail, rateLimitResponse } from '@/lib/security';

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
      id SERIAL PRIMARY KEY,
      nome TEXT,
      empresa TEXT,
      email TEXT UNIQUE,
      whatsapp TEXT,
      segmento TEXT,
      interesse TEXT,
      tamanho TEXT,
      problema TEXT,
      criado_em TIMESTAMP DEFAULT NOW()
    )`);
    await client.query(
      `INSERT INTO precadastros (nome, empresa, email, whatsapp, segmento, interesse, tamanho, problema)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (email) DO UPDATE SET nome=$1, empresa=$2, whatsapp=$4, segmento=$5, interesse=$6, tamanho=$7, problema=$8`,
      [data.nome, data.empresa, data.email, data.whatsapp, data.segmento, data.interesse || data.agente, data.tamanho, data.problema]
    );
    await client.end();
  } catch (e) { console.error('DB:', e.message); }
}

async function notify(data) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;
  const txt = `📋 *Novo lead Agentes AI*\n👤 ${data.nome}\n🏢 ${data.empresa || '-'}\n📧 ${data.email}\n📱 ${data.whatsapp || '-'}\n🏷️ Segmento: ${data.segmento || '-'}\n🤖 Agente: ${data.interesse || data.agente || '-'}\n👥 Tamanho: ${data.tamanho || '-'}\n⚠️ Problema: ${data.problema || '-'}`;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: txt, parse_mode: 'Markdown' }) }).catch(() => {});
}

export async function POST(req) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip, { max: 5, windowMs: 60_000 });
    if (!limit.ok) return rateLimitResponse(limit.retryAfter);
    const body = sanitizeBody(await req.json());
    if (!body.nome || !body.email) return Response.json({ erro: 'nome e email obrigatórios' }, { status: 400 });
    if (!isValidEmail(body.email)) return Response.json({ erro: 'Email inválido' }, { status: 400 });
    await Promise.all([saveDb(body), notify(body)]);
    return Response.json({ ok: true });
  } catch (e) { return Response.json({ erro: 'Erro interno' }, { status: 500 }); }
}
