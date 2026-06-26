import { NextResponse } from 'next/server';
import { ensureCommercialSchema, hasDatabaseUrl, normalizeDbError, withDatabase } from '@/lib/server/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      database: 'not_configured',
      mode: 'mock',
      message: 'DATABASE_URL não configurada. O site funciona, mas leads e contratações não ficam persistidos.'
    });
  }

  try {
    const result = await withDatabase(async (client) => {
      await ensureCommercialSchema(client);
      const response = await client.query('SELECT NOW() AS now');
      return response.rows[0];
    });

    return NextResponse.json({ ok: true, database: 'connected', mode: 'database', modules: ['leads', 'orders', 'payments', 'audit', 'knowledge', 'ai_runs', 'conversations', 'channel_integrations', 'channel_events'], now: result?.now });
  } catch (error) {
    return NextResponse.json({ ok: false, database: 'error', error: normalizeDbError(error) }, { status: 500 });
  }
}
