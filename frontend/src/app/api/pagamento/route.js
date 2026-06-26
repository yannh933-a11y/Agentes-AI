import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, sanitizeBody, isValidEmail, rateLimitResponse } from '@/lib/security';
import { buildCheckoutSummary, getPaymentMethod, getPixInstructions } from '@/lib/billing';
import { createCommercialOrder } from '@/lib/server/orders-repository';

export const dynamic = 'force-dynamic';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://agentes-ai-two.vercel.app';

async function createMercadoPagoPreference({ nome, email, whatsapp, empresa, checkout, paymentMethod }) {
  if (!MP_ACCESS_TOKEN) {
    return {
      ok: false,
      reason: 'MERCADO_PAGO_NOT_CONFIGURED',
      message: 'Mercado Pago ainda não está configurado. Use Pix manual ou configure MP_ACCESS_TOKEN.',
    };
  }

  const preference = {
    items: [
      {
        title: `${checkout.agent?.nome || 'Agente AI'} — Ativação`,
        quantity: 1,
        unit_price: checkout.setup,
        currency_id: 'BRL',
      },
      {
        title: `${checkout.plan?.nome || 'Plano'} — 1ª mensalidade`,
        quantity: 1,
        unit_price: checkout.monthly,
        currency_id: 'BRL',
      },
    ].filter((item) => item.unit_price > 0),
    payer: { name: nome, email, phone: whatsapp ? { number: whatsapp } : undefined },
    payment_methods: { installments: 12 },
    back_urls: {
      success: `${SITE}/obrigado?status=aprovado&email=${encodeURIComponent(email)}`,
      failure: `${SITE}/checkout?status=falhou`,
      pending: `${SITE}/obrigado?status=pendente&email=${encodeURIComponent(email)}`,
    },
    auto_return: 'approved',
    notification_url: `${SITE}/api/pagamento/webhook`,
    metadata: {
      empresa,
      nome,
      email,
      whatsapp,
      agente: checkout.agent?.slug,
      plano: checkout.plan?.slug,
      metodoPagamento: paymentMethod,
    },
  };

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preference),
  });

  const data = await res.json();
  if (!res.ok || !data.id) {
    return { ok: false, reason: 'MERCADO_PAGO_ERROR', message: 'Erro ao criar preferência no Mercado Pago.', detalhe: data };
  }

  return { ok: true, preferenceId: data.id, initPoint: data.init_point };
}

export async function POST(req) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip, { max: 10, windowMs: 60_000 });
    if (!limit.ok) return rateLimitResponse(limit.retryAfter);

    const raw = await req.json();
    const clean = sanitizeBody(raw);

    const nome = clean.nome;
    const empresa = clean.empresa;
    const email = clean.email;
    const whatsapp = clean.whatsapp;
    const agente = clean.agente || clean.agentSlug;
    const plano = clean.plano || clean.planSlug || 'pro';
    const metodoPagamento = clean.metodoPagamento || clean.paymentMethod || 'pix_manual';
    const paymentMethod = getPaymentMethod(metodoPagamento);
    const checkout = buildCheckoutSummary({ planSlug: plano, agentSlug: agente });

    if (!nome || !email) return NextResponse.json({ ok: false, erro: 'Nome e email são obrigatórios.' }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ ok: false, erro: 'Email inválido.' }, { status: 400 });
    if (!checkout.plan) return NextResponse.json({ ok: false, erro: 'Plano inválido.' }, { status: 400 });
    if (checkout.isCustom) return NextResponse.json({ ok: false, erro: 'Plano Enterprise exige proposta comercial. Use o pré-cadastro.' }, { status: 400 });

    let providerPayload = null;
    let checkoutUrl = null;
    let providerReference = null;
    let status = 'AWAITING_PAYMENT';

    if (metodoPagamento === 'mercado_pago') {
      const mp = await createMercadoPagoPreference({ nome, email, whatsapp, empresa, checkout, paymentMethod: metodoPagamento });
      if (mp.ok) {
        providerPayload = mp;
        checkoutUrl = mp.initPoint;
        providerReference = mp.preferenceId;
      } else {
        providerPayload = mp;
      }
    }

    const orderResult = await createCommercialOrder({
      nome,
      empresa,
      email,
      whatsapp,
      agente,
      plano,
      metodoPagamento,
      provider: metodoPagamento,
      providerReference,
      checkoutUrl,
      status,
      metadata: {
        ip,
        paymentMethod: paymentMethod.nome,
        providerPayload,
        source: clean.origem || 'checkout',
      },
    });

    const pix = getPixInstructions();

    return NextResponse.json({
      ok: true,
      source: orderResult.source,
      order: orderResult.order,
      checkout: {
        plano: checkout.plan.nome,
        agente: checkout.agent?.nome || 'Agente personalizado',
        setup: checkout.setup,
        monthly: checkout.monthly,
        totalHoje: checkout.totalHoje,
        totalCents: checkout.totalCents,
      },
      payment: {
        method: metodoPagamento,
        methodLabel: paymentMethod.nome,
        status: providerReference ? 'PROVIDER_CREATED' : 'MANUAL_OR_PENDING',
        checkoutUrl,
        providerReference,
        pix: metodoPagamento === 'pix_manual' || !checkoutUrl ? pix : null,
        message: checkoutUrl
          ? 'Checkout externo criado com sucesso.'
          : 'Pedido criado. Use Pix manual ou configure o provedor de pagamento para checkout automático.',
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, erro: error.message || 'Erro ao iniciar pagamento.' }, { status: 500 });
  }
}
