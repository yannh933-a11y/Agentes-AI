import { createOutboundResponse, listOutboundResponses } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const result = await listOutboundResponses({
    companyId: searchParams.get('companyId') || currentTenant.id,
    status: searchParams.get('status'),
    allCompanies: searchParams.get('allCompanies') === 'true',
    limit: Number(searchParams.get('limit') || 50),
  });
  return Response.json({ ok: true, ...result });
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const result = await createOutboundResponse({ companyId: payload.companyId || currentTenant.id, ...payload });
    return Response.json({ ok: Boolean(result.response), ...result }, { status: result.response ? 201 : 400 });
  } catch (error) {
    console.error('POST /api/operations/responses:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao criar resposta operacional' }, { status: 500 });
  }
}
