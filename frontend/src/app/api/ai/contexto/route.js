import { NextResponse } from 'next/server';
import { currentTenant } from '@/lib/tenant';
import { getAgentAiProfile } from '@/lib/ai-config';
import { listKnowledgeDocuments } from '@/lib/server/knowledge-repository';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const agentSlug = searchParams.get('agentSlug') || 'atendimento';
  const companyId = searchParams.get('companyId') || currentTenant.id;
  const profile = getAgentAiProfile(agentSlug);
  const docs = await listKnowledgeDocuments({ companyId, agentSlug });

  return NextResponse.json({
    companyId,
    agentSlug,
    agent: profile.agent,
    blueprint: profile.blueprint,
    documents: docs.items,
    source: docs.source,
    systemPrompt: profile.systemPrompt,
  });
}
