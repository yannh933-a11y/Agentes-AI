import { getOutboundResponse, holdOutboundResponse, rejectOutboundResponse } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const result = await getOutboundResponse({ id: params.id, companyId: searchParams.get('companyId') || currentTenant.id, allCompanies: searchParams.get('allCompanies') === 'true' });
  return Response.json({ ok: Boolean(result.response), ...result }, { status: result.response ? 200 : 404 });
}

export async function PATCH(req, { params }) {
  const payload = await req.json();
  if (payload.status === 'REJECTED') return Response.json(await rejectOutboundResponse({ id: params.id, companyId: payload.companyId || currentTenant.id, reviewer: payload.reviewer, reason: payload.reason, allCompanies: payload.allCompanies }));
  if (payload.status === 'HOLD') return Response.json(await holdOutboundResponse({ id: params.id, companyId: payload.companyId || currentTenant.id, reviewer: payload.reviewer, reason: payload.reason, allCompanies: payload.allCompanies }));
  return Response.json({ ok: false, erro: 'Status não suportado nesta rota' }, { status: 400 });
}
