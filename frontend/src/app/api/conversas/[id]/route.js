import { getConversation, listMessages, updateConversationStatus } from '@/lib/server/conversations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId') || currentTenant.id;
    const conversation = await getConversation({ id: params.id, companyId });
    const messages = await listMessages({ conversationId: params.id, companyId });
    return Response.json({ ok: true, conversation: conversation.conversation, messages: messages.items, source: conversation.source });
  } catch (error) {
    console.error('GET /api/conversas/[id]:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao carregar conversa' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const result = await updateConversationStatus({
      id: params.id,
      companyId: body.companyId || currentTenant.id,
      status: body.status || 'OPEN',
      nextAction: body.nextAction || null,
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('PATCH /api/conversas/[id]:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao atualizar conversa' }, { status: 500 });
  }
}
