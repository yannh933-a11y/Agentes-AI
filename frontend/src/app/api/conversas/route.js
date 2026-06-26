import { listConversations, routeInboundEvent } from '@/lib/server/conversations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listConversations({
      companyId: searchParams.get('companyId') || currentTenant.id,
      status: searchParams.get('status') || null,
      channel: searchParams.get('channel') || null,
      agentSlug: searchParams.get('agentSlug') || null,
      limit: Number(searchParams.get('limit') || 50),
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('GET /api/conversas:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao listar conversas' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await routeInboundEvent({
      companyId: body.companyId || currentTenant.id,
      channel: body.channel || 'site',
      payload: body,
      autoReply: body.autoReply !== false,
    });
    return Response.json(result);
  } catch (error) {
    console.error('POST /api/conversas:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao rotear conversa' }, { status: 500 });
  }
}
