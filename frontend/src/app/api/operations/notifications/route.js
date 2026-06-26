import { listOperationNotifications } from '@/lib/server/operations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const result = await listOperationNotifications({ companyId: searchParams.get('companyId') || currentTenant.id, limit: Number(searchParams.get('limit') || 30) });
  return Response.json({ ok: true, ...result });
}
