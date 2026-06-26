import { getOperationsMetrics } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const result = await getOperationsMetrics({ companyId: searchParams.get('companyId') || currentTenant.id, allCompanies: searchParams.get('allCompanies') === 'true' });
  return Response.json({ ok: true, ...result });
}
