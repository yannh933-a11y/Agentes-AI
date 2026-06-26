// Webhook do Mercado Pago — processa pagamento aprovado (com validação de assinatura)
import { validateMercadoPagoWebhook } from '@/lib/security';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE = 'https://agentes-ai-two.vercel.app';

// IDs já processados para evitar duplicatas (idempotência)
const processados = new Set();

export async function POST(req) {
  try {
    // Lê o body como texto para validar assinatura HMAC
    const rawBody = await req.text();

    // ✅ Valida assinatura do Mercado Pago (anti-spoofing)
    const isValid = await validateMercadoPagoWebhook(req, rawBody);
    if (!isValid) {
      console.warn('Webhook MP: assinatura inválida — possível tentativa de spoofing');
      return new Response(JSON.stringify({ erro: 'Assinatura inválida' }), { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // MP envia type='payment' ou action='payment.updated'
    const tipo = body.type || body.action || '';
    const paymentId = body.data?.id || body.id;

    if (!tipo.includes('payment') || !paymentId) return Response.json({ ok: true });

    // ✅ Idempotência — evita processar o mesmo pagamento duas vezes
    const pid = String(paymentId);
    if (processados.has(pid)) {
      console.log(`Webhook MP: pagamento ${pid} já processado, ignorando`);
      return Response.json({ ok: true });
    }
    processados.add(pid);
    setTimeout(() => processados.delete(pid), 3_600_000); // remove após 1h

    // ✅ Busca detalhes do pagamento DIRETAMENTE na API do MP (não confia no payload)
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    });
    const payment = await res.json();

    // Só processa pagamentos aprovados
    if (payment.status !== 'approved') return Response.json({ ok: true });

    // ✅ Extrai metadados do pagamento (fonte confiável: API do MP)
    const meta = payment.metadata || {};
    const nome = meta.nome || meta.name || payment.payer?.first_name || 'Cliente';
    const email = meta.email || payment.payer?.email || '';
    const agente = meta.agente || meta.agent || '';

    if (!email) return Response.json({ ok: true });

    // Normaliza nome do agente
    const tipoAgente = agente
      .toLowerCase()
      .replace(/agente de /gi, '')
      .replace(/[^a-záéíóúâêôãõç]/gi, ' ')
      .trim()
      .split(' ')[0];

    // Dispara ativação e email
    await fetch(`${SITE}/api/ativar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, tipoAgente }),
    }).catch(() => {});

    console.log(`✅ Pagamento aprovado processado: ${pid} — ${nome} (${email})`);
    return Response.json({ ok: true });
  } catch (e) {
    console.error('Webhook MP erro:', e.message);
    return Response.json({ ok: false, erro: e.message });
  }
}

// MP valida o endpoint com GET
export async function GET() {
  return Response.json({ ok: true });
}
