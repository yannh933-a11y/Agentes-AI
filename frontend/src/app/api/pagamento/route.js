// API Route: Cria preferência de pagamento no Mercado Pago
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE = 'https://agentes-ai-two.vercel.app';

export async function POST(req) {
  try {
    const { nome, email, agente, precoAtivacao, preco } = await req.json();
    if (!nome || !email || !agente) return Response.json({ erro: 'dados inválidos' }, { status: 400 });

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
