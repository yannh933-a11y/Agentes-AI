import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { updateCommercialLead } from '@/lib/server/leads-repository';

export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
  const session = getCurrentSession();
  if (!session.authenticated || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ ok: false, erro: 'Acesso administrativo obrigatório.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const result = await updateCommercialLead(params.id, {
    ...body,
    actorLabel: session.user.name,
  });

  if (!result.lead) {
    return NextResponse.json({ ok: false, erro: 'Lead não encontrado ou banco não configurado.' }, { status: result.source === 'mock' ? 202 : 404 });
  }

  return NextResponse.json({ ok: true, source: result.source, lead: result.lead });
}
