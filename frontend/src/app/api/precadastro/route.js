import { checkRateLimit, getClientIP, sanitizeBody, isValidEmail, rateLimitResponse } from '@/lib/security';
import { createCommercialLead } from '@/lib/server/leads-repository';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

async function notify(data, savedLead) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;

  const txt = `📋 *Novo lead Agentes AI*\n👤 ${data.nome}\n🏢 ${data.empresa || '-'}\n📧 ${data.email}\n📱 ${data.whatsapp || '-'}\n🏷️ Segmento: ${data.segmento || '-'}\n🤖 Agente: ${data.interesse || data.agente || '-'}\n💳 Plano: ${data.planoDesejado || data.plano || '-'}\n👥 Tamanho: ${data.tamanho || '-'}\n⚠️ Problema: ${data.problema || '-'}\n🧾 Lead ID: ${savedLead?.id || '-'}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: txt, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(req) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(`precadastro:${ip}`, { max: 5, windowMs: 60_000 });
    if (!limit.ok) return rateLimitResponse(limit.retryAfter);

    const body = sanitizeBody(await req.json());
    if (!body.nome || !body.email || !body.whatsapp) {
      return Response.json({ erro: 'nome, email e whatsapp obrigatórios' }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return Response.json({ erro: 'Email inválido' }, { status: 400 });
    }

    if (body.problema && body.problema.length < 10) {
      return Response.json({ erro: 'Descreva melhor o problema da empresa.' }, { status: 400 });
    }

    const saved = await createCommercialLead(body);
    await notify(body, saved.lead);

    return Response.json({
      ok: true,
      source: saved.source,
      leadId: saved.lead?.id,
      message: saved.source === 'database'
        ? 'Lead salvo no banco e enviado para análise.'
        : 'Lead recebido em modo demonstração. Configure DATABASE_URL para persistir no banco.',
    });
  } catch (error) {
    console.error('POST /api/precadastro:', error.message);
    return Response.json({ erro: 'Erro interno ao enviar pré-cadastro' }, { status: 500 });
  }
}
