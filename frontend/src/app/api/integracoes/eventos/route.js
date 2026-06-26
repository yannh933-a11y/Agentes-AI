import { listIntegrationEvents, recordIntegrationEvent } from '@/lib/server/integrations-repository';
import { currentTenant } from '@/lib/tenant';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId') || currentTenant.id;
  const channel = searchParams.get('channel') || null;
  const limit = Number(searchParams.get('limit') || 50);
  const result = await listIntegrationEvents({ companyId, channel, limit });
  return Response.json({ ok: true, ...result });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await recordIntegrationEvent(body);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('POST /api/integracoes/eventos:', error.message);
    return Response.json({ erro: 'Erro ao registrar evento' }, { status: 500 });
  }
}
