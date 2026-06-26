import { routeInboundEvent } from '@/lib/server/conversations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req) {
  try {
    const payload = await req.json();
    const secret = req.headers.get('x-agentes-ai-secret');
    const expected = process.env.WEBHOOK_SIGNING_SECRET;
    if (expected && secret !== expected) return Response.json({ erro: 'Assinatura inválida' }, { status: 401 });

    const result = await routeInboundEvent({
      companyId: payload.companyId || currentTenant.id,
      channel: payload.channel || 'custom-webhook',
      payload,
      autoReply: payload.autoReply !== false,
    });
    return Response.json(result);
  } catch (error) {
    console.error('POST /api/webhooks/custom:', error.message);
    return Response.json({ erro: 'Erro ao processar webhook customizado' }, { status: 500 });
  }
}
