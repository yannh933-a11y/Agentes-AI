import { holdOutboundResponse } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req, { params }) {
  const payload = await req.json().catch(() => ({}));
  const result = await holdOutboundResponse({ id: params.id, companyId: payload.companyId || currentTenant.id, reviewer: payload.reviewer || 'Operador Agentes AI', reason: payload.reason || 'Aguardando mais contexto antes do envio.', allCompanies: Boolean(payload.allCompanies) });
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
