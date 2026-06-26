import { recordIntegrationEvent } from '@/lib/server/integrations-repository';
import { routeInboundEvent } from '@/lib/server/conversations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req) {
  try {
    const payload = await req.json();
    const secret = req.headers.get('x-agentes-ai-secret');
    const expected = process.env.WEBHOOK_SIGNING_SECRET;
    if (expected && secret !== expected) return Response.json({ erro: 'Assinatura inválida' }, { status: 401 });

    if (payload.text || payload.message || payload.messageText || payload.content) {
      const routed = await routeInboundEvent({
        companyId: payload.companyId || currentTenant.id,
        channel: 'crm',
        payload,
        autoReply: payload.autoReply !== false,
      });
      return Response.json(routed);
    }

    const result = await recordIntegrationEvent({
      companyId: payload.companyId || currentTenant.id,
      channel: 'crm',
      direction: payload.direction || 'outbound',
      type: payload.type || 'crm.lead_pushed',
      status: 'received',
      summary: payload.summary || 'Evento CRM registrado.',
      payload,
    });

    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('POST /api/webhooks/crm:', error.message);
    return Response.json({ erro: 'Erro ao processar webhook CRM' }, { status: 500 });
  }
}
