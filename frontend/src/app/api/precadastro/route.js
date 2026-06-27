import { checkRateLimit, getClientIP, sanitizeBody, isValidEmail, rateLimitResponse } from '@/lib/security';
import { createCommercialLead } from '@/lib/server/leads-repository';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

function fieldLabel(field) {
  const labels = {
    nome: 'nome completo',
    email: 'e-mail',
    whatsapp: 'WhatsApp',
    empresa: 'nome da empresa',
    segmento: 'segmento',
    tamanho: 'tamanho da empresa',
    agente: 'tipo de agente',
    canal: 'canal de uso',
    volume: 'volume de atendimentos',
    problema: 'principal problema',
  };
  return labels[field] || field;
}

function getMissingFields(body) {
  return ['nome', 'email', 'whatsapp', 'empresa', 'segmento', 'tamanho', 'canal', 'volume', 'problema']
    .filter((field) => !String(body[field] || '').trim());
}

async function notify(data, savedLead) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;

  const txt = `📋 *Novo lead Agentes AI*\n👤 ${data.nome}\n🏢 ${data.empresa || '-'}\n📧 ${data.email}\n📱 ${data.whatsapp || '-'}\n🏷️ Segmento: ${data.segmento || '-'}\n🤖 Agente: ${data.agenteNome || data.interesse || data.agente || '-'}\n💳 Plano: ${data.planoNome || data.planoDesejado || data.plano || '-'}\n📡 Canal: ${data.canal || '-'}\n📊 Volume: ${data.volume || '-'}\n👥 Tamanho: ${data.tamanho || '-'}\n⚠️ Problema: ${data.problema || '-'}\n🧾 Lead ID: ${savedLead?.id || '-'}`;

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

    if (body.problema.length < 20) {
      return Response.json({ erro: 'Descreva melhor o principal problema da empresa.' }, { status: 400 });
    }

    const saved = await createCommercialLead(body);
    await notify(body, saved.lead);

    return Response.json({
      ok: true,
      source: saved.source,
      leadId: saved.lead?.id,
      message: saved.source === 'database'
        ? 'Lead salvo no banco e enviado para análise.'
        : 'Pré-cadastro recebido com sucesso.',
    });
  } catch (error) {
    console.error('POST /api/precadastro:', error.message);
    return Response.json({ erro: 'Erro interno ao enviar pré-cadastro.' }, { status: 500 });
  }
}
