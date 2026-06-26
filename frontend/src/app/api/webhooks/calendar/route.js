import { recordIntegrationEvent } from '@/lib/server/integrations-repository';
import { routeInboundEvent } from '@/lib/server/conversations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req) {
  try {
    const payload = await req.json();

    if (payload.text || payload.message || payload.messageText || payload.content) {
      const routed = await routeInboundEvent({
        companyId: payload.companyId || currentTenant.id,
        channel: 'google-calendar',
        payload: { ...payload, agentSlug: payload.agentSlug || 'agendamento' },
        autoReply: payload.autoReply !== false,
      });
      return Response.json(routed);
    }

    const result = await recordIntegrationEvent({
      companyId: payload.companyId || currentTenant.id,
      channel: 'google-calendar',
      direction: 'inbound',
      type: payload.type || 'calendar.event_received',
      status: 'received',
      summary: payload.summary || 'Evento de agenda recebido.',
      payload,
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('POST /api/webhooks/calendar:', error.message);
    return Response.json({ erro: 'Erro ao processar webhook Calendar' }, { status: 500 });
  }
}
