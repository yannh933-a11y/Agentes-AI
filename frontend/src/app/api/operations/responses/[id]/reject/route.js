import { rejectOutboundResponse } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req, { params }) {
  const payload = await req.json().catch(() => ({}));
  const result = await rejectOutboundResponse({ id: params.id, companyId: payload.companyId || currentTenant.id, reviewer: payload.reviewer || 'Operador Agentes AI', reason: payload.reason || 'Resposta rejeitada em revisão humana.', allCompanies: Boolean(payload.allCompanies) });
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
