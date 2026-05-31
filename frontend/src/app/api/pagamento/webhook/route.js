// Webhook do Mercado Pago — processa pagamento aprovado
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE = 'https://agentes-ai-two.vercel.app';

// IDs já processados para evitar duplicatas
const processados = new Set();

export async function POST(req) {
  try {
    const body = await req.json();

    // MP envia type='payment' ou action='payment.updated'
    const tipo = body.type || body.action || '';
    const paymentId = body.data?.id || body.id;

    if (!tipo.includes('payment') || !paymentId) return Response.json({ ok: true });

    // Evita processar o mesmo pagamento duas vezes
    if (processados.has(String(paymentId))) return Response.json({ ok: true });
    processados.add(String(paymentId));
    setTimeout(() => processados.delete(String(paymentId)), 3600000);

    // Busca detalhes do pagamento
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    });
    const payment = await res.json();

    if (payment.status !== 'approved') return Response.json({ ok: true });

    // MP retorna metadata com snake_case ou camelCase dependendo da versão
    const meta = payment.metadata || {};
    const nome = meta.nome || meta.name || payment.payer?.first_name || 'Cliente';
    const email = meta.email || payment.payer?.email || '';
    const agente = meta.agente || meta.agent || '';

    if (!email) return Response.json({ ok: true });

    // Normaliza nome do agente para chave (ex: 'Agente de Vendas' → 'vendas')
    const tipoAgente = agente
      .toLowerCase()
      .replace(/agente de /gi, '')
      .replace(/[^a-záéíóúâêôãõç]/gi, ' ')
      .trim()
      .split(' ')[0];

    // Gera código de ativação + envia email + notifica admin
    await fetch(`${SITE}/api/ativar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, tipoAgente }),
    }).catch(() => {});

    return Response.json({ ok: true });
  } catch (e) {
    console.error('Webhook MP erro:', e.message);
    return Response.json({ ok: false, erro: e.message });
  }
}

// MP às vezes faz GET no webhook para validar
export async function GET() {
  return Response.json({ ok: true });
}
