import { NextResponse } from 'next/server';
import { currentTenant } from '@/lib/tenant';
import { createKnowledgeDocument, listKnowledgeDocuments } from '@/lib/server/knowledge-repository';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId') || currentTenant.id;
  const agentSlug = searchParams.get('agentSlug') || null;
  const status = searchParams.get('status') || null;
  const result = await listKnowledgeDocuments({ companyId, agentSlug, status });
  return NextResponse.json(result);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createKnowledgeDocument({ ...body, companyId: body.companyId || currentTenant.id });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erro: error.message || 'Erro ao criar documento' }, { status: 400 });
  }
}
