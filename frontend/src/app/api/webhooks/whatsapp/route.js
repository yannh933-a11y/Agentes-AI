import { routeInboundEvent } from '@/lib/server/conversations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token && expected && token === expected) return new Response(challenge || 'ok', { status: 200 });
  if (!expected && process.env.NODE_ENV !== 'production') return new Response(challenge || 'demo-ok', { status: 200 });
  return new Response('Token inválido', { status: 403 });
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const result = await routeInboundEvent({
      companyId: payload.companyId || currentTenant.id,
      channel: 'whatsapp',
      payload,
      autoReply: payload.autoReply !== false,
    });
    return Response.json(result);
  } catch (error) {
    console.error('POST /api/webhooks/whatsapp:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao processar webhook WhatsApp' }, { status: 500 });
  }
}
