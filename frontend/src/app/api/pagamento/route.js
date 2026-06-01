// API Route: Cria preferência de pagamento no Mercado Pago
import { checkRateLimit, getClientIP, sanitizeBody, isValidEmail, rateLimitResponse } from '@/lib/security';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE = 'https://agentes-ai-two.vercel.app';

export async function POST(req) {
  try {
    // Rate limit: 10 tentativas de pagamento/min por IP
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip, { max: 10, windowMs: 60_000 });
    if (!limit.ok) return rateLimitResponse(limit.retryAfter);

    const raw = await req.json();
    const clean = sanitizeBody(raw);
    const { nome, email, agente } = clean;
    const precoAtivacao = Number(raw.precoAtivacao) || 0;
    const preco = Number(raw.preco) || 0;

    if (!nome || !email || !agente) return Response.json({ erro: 'dados inválidos' }, { status: 400 });
    if (!isValidEmail(email)) return Response.json({ erro: 'Email inválido' }, { status: 400 });

    // Valida preços contra lista permitida (anti-tampering)
    const PRECOS_VALIDOS = [97, 147, 197, 247, 299, 59, 69, 79, 97, 139];
    if (precoAtivacao > 0 && !PRECOS_VALIDOS.includes(precoAtivacao))
      return Response.json({ erro: 'Preço de ativação inválido' }, { status: 400 });
    if (preco > 0 && !PRECOS_VALIDOS.includes(preco))
      return Response.json({ erro: 'Preço de mensalidade inválido' }, { status: 400 });

    const valorTotal = (precoAtivacao || 0) + (preco || 0);

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: `${agente} — Ativação`,
            quantity: 1,
            unit_price: precoAtivacao,
            currency_id: 'BRL',
          },
          {
            title: `${agente} — 1º Mensalidade`,
            quantity: 1,
            unit_price: preco,
            currency_id: 'BRL',
          },
        ],
        payer: { name: nome, email },
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${SITE}/obrigado?agente=${encodeURIComponent(agente)}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}`,
          failure: `${SITE}/checkout`,
          pending: `${SITE}/obrigado?status=pendente`,
        },
        auto_return: 'approved',
        notification_url: `${SITE}/api/pagamento/webhook`,
        metadata: { nome, email, agente },
      }),
    });

    const data = await res.json();
    if (!data.id) return Response.json({ erro: 'Erro ao criar preferência', detalhe: data }, { status: 500 });

    return Response.json({ preferenceId: data.id, initPoint: data.init_point });
  } catch (e) {
    return Response.json({ erro: e.message }, { status: 500 });
  }
}
