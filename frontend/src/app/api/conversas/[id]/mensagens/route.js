import { appendMessage, getConversation, listMessages } from '@/lib/server/conversations-repository';
import { generateAgentPreview } from '@/lib/server/ai-service';
import { currentTenant } from '@/lib/tenant';

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listMessages({
      conversationId: params.id,
      companyId: searchParams.get('companyId') || currentTenant.id,
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('GET /api/conversas/[id]/mensagens:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao listar mensagens' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const body = await req.json();
    const companyId = body.companyId || currentTenant.id;
    const role = body.role || 'HUMAN';
    const content = body.content || body.message || '';
    const message = await appendMessage({ conversationId: params.id, companyId, role, content, metadata: body.metadata || { source: 'manual' } });

    let ai = null;
    if (body.generateAiReply) {
      const conversation = await getConversation({ id: params.id, companyId });
      ai = await generateAgentPreview({ companyId, agentSlug: conversation.conversation?.agentSlug || 'atendimento', message: content, conversationId: params.id });
      await appendMessage({ conversationId: params.id, companyId, role: 'ASSISTANT', content: ai.answer, metadata: { provider: ai.provider, usedDocuments: ai.usedDocuments } });
    }

    return Response.json({ ok: true, message: message.message, ai });
  } catch (error) {
    console.error('POST /api/conversas/[id]/mensagens:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao adicionar mensagem' }, { status: 500 });
  }
}
