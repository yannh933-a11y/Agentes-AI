import { checkRateLimit, getClientIP, isValidEmail, rateLimitResponse, sanitizeBody } from '@/lib/security';
import { createContactRequest } from '@/lib/server/contact-repository';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

function fieldLabel(field) {
  const labels = {
    nome: 'nome',
    whatsapp: 'WhatsApp',
    email: 'e-mail',
    empresa: 'empresa',
    motivo: 'motivo do contato',
    mensagem: 'mensagem',
  };
  return labels[field] || field;
}

function getMissingFields(body) {
  return ['nome', 'whatsapp', 'email', 'empresa', 'motivo', 'mensagem']
    .filter((field) => !String(body[field] || '').trim());
}

async function notify(data, savedContact) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;

  const txt = `📨 *Novo contato Agentes AI*\n👤 ${data.nome}\n🏢 ${data.empresa}\n📧 ${data.email}\n📱 ${data.whatsapp}\n📌 Motivo: ${data.motivo}\n💬 Mensagem: ${data.mensagem}\n🧾 Contato ID: ${savedContact?.id || '-'}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: txt, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(req) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(`contato:${ip}`, { max: 8, windowMs: 60_000 });
    if (!limit.ok) return rateLimitResponse(limit.retryAfter);

    const body = sanitizeBody(await req.json());
    const missing = getMissingFields(body);
    if (missing.length) {
      return Response.json({ erro: `Preencha: ${missing.map(fieldLabel).join(', ')}.` }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return Response.json({ erro: 'Informe um e-mail válido.' }, { status: 400 });
    }

    const whatsappDigits = String(body.whatsapp || '').replace(/\D/g, '');
    if (whatsappDigits.length < 10) {
      return Response.json({ erro: 'Informe um WhatsApp válido com DDD.' }, { status: 400 });
    }

    if (body.mensagem.length < 15) {
      return Response.json({ erro: 'Escreva uma mensagem com pelo menos 15 caracteres.' }, { status: 400 });
    }

    const saved = await createContactRequest(body);
    await notify(body, saved.contact);

    return Response.json({
      ok: true,
      source: saved.source,
      contactId: saved.contact?.id,
      message: saved.source === 'database'
        ? 'Contato salvo e enviado para análise.'
        : 'Contato recebido com sucesso.',
    });
  } catch (error) {
    console.error('POST /api/contato:', error.message);
    return Response.json({ erro: 'Erro interno ao enviar contato.' }, { status: 500 });
  }
}
