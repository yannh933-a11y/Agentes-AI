import { approveOutboundResponse } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req, { params }) {
  const payload = await req.json().catch(() => ({}));
  const result = await approveOutboundResponse({ id: params.id, companyId: payload.companyId || currentTenant.id, reviewer: payload.reviewer || 'Operador Agentes AI', sendNow: Boolean(payload.sendNow), allCompanies: Boolean(payload.allCompanies) });
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
