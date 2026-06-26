import { listIntegrations, upsertIntegration } from '@/lib/server/integrations-repository';
import { currentTenant } from '@/lib/tenant';
import { integrationChannels } from '@/lib/integrations';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId') || currentTenant.id;
  const result = await listIntegrations({ companyId });
  return Response.json({ ok: true, channels: integrationChannels, ...result });
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.channel) return Response.json({ erro: 'channel obrigatório' }, { status: 400 });
    const result = await upsertIntegration(body);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error('POST /api/integracoes:', error.message);
    return Response.json({ erro: 'Erro ao salvar integração' }, { status: 500 });
  }
}
