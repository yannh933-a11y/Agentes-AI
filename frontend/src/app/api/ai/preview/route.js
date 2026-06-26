import { NextResponse } from 'next/server';
import { currentTenant } from '@/lib/tenant';
import { generateAgentPreview } from '@/lib/server/ai-service';
import { checkRateLimit, getClientIP, sanitizeString, rateLimitResponse } from '@/lib/security';

export async function POST(req) {
  const ip = getClientIP(req);
  const limit = checkRateLimit(`ai-preview:${ip}`, { max: 20, windowMs: 60_000 });
  if (!limit.ok) return rateLimitResponse(limit.retryAfter);

  try {
    const body = await req.json();
    const message = sanitizeString(body.message || body.texto || '');
    const agentSlug = sanitizeString(body.agentSlug || 'atendimento');
    const companyId = sanitizeString(body.companyId || currentTenant.id);

    if (!message || message.length < 2) {
      return NextResponse.json({ erro: 'Mensagem muito curta' }, { status: 400 });
    }

    const result = await generateAgentPreview({ companyId, agentSlug, message, conversationId: body.conversationId || null });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ erro: 'Erro temporário ao gerar resposta', detalhe: error.message }, { status: 500 });
  }
}
