import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getCommercialMetrics } from '@/lib/server/leads-repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getCurrentSession();
  if (!session.authenticated || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ ok: false, erro: 'Acesso administrativo obrigatório.' }, { status: 403 });
  }

  const result = await getCommercialMetrics();
  return NextResponse.json({ ok: true, source: result.source, metrics: result.metrics });
}
