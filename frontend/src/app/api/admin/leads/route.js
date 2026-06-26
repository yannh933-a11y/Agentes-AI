import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getCommercialMetrics, listCommercialLeads } from '@/lib/server/leads-repository';

export const dynamic = 'force-dynamic';

function requireAdmin() {
  const session = getCurrentSession();
  if (!session.authenticated || session.user.role !== 'SUPER_ADMIN') {
    return { ok: false, response: NextResponse.json({ ok: false, erro: 'Acesso administrativo obrigatório.' }, { status: 403 }) };
  }
  return { ok: true, session };
}

export async function GET(req) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const limit = Number(searchParams.get('limit') || 100);

  const [leads, metrics] = await Promise.all([
    listCommercialLeads({ limit, status }),
    getCommercialMetrics(),
  ]);

  return NextResponse.json({
    ok: true,
    source: leads.source,
    items: leads.items,
    metrics: metrics.metrics,
    metricsSource: metrics.source,
  });
}
