import { testIntegration } from '@/lib/server/integrations-repository';
import { currentTenant } from '@/lib/tenant';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await testIntegration({ channel: body.channel || 'whatsapp', companyId: body.companyId || currentTenant.id });
    return Response.json(result);
  } catch (error) {
    console.error('POST /api/integracoes/testar:', error.message);
    return Response.json({ erro: 'Erro ao testar integração' }, { status: 500 });
  }
}
