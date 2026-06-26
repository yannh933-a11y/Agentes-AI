import { checkRateLimit, getClientIP, sanitizeBody, isValidEmail, rateLimitResponse } from '@/lib/security';
import { companies } from '@/lib/tenant';

const DB_URL = process.env.DATABASE_URL;

function slugify(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `empresa-${Date.now()}`;
}

async function getDbClient() {
  if (!DB_URL) return null;
  const { Client } = await import('pg');
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

async function ensureTenantTables(client) {
  await client.query(`CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    legal_name TEXT,
    segment TEXT,
    size TEXT,
    plan TEXT DEFAULT 'Start',
    status TEXT DEFAULT 'LEAD',
    billing_status TEXT DEFAULT 'PENDING',
    deployment_stage TEXT DEFAULT 'DIAGNOSIS',
    owner_email TEXT,
    whatsapp TEXT,
    domain TEXT,
    data_isolation_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID,
    actor_type TEXT DEFAULT 'SYSTEM',
    actor_id TEXT,
    action TEXT NOT NULL,
    entity TEXT,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
  )`);
}

export async function GET() {
  let client;
  try {
    client = await getDbClient();
    if (!client) return Response.json({ ok: true, source: 'mock', empresas: companies });
    await ensureTenantTables(client);
    const result = await client.query(`SELECT id, slug, name AS nome, legal_name AS "razaoSocial", segment AS segmento, size AS tamanho, plan AS plano, status, billing_status AS "billingStatus", deployment_stage AS "etapaImplantacao", owner_email AS email, whatsapp, domain AS dominio, data_isolation_key AS isolamento, created_at AS "createdAt" FROM companies ORDER BY created_at DESC LIMIT 100`);
    return Response.json({ ok: true, source: 'database', empresas: result.rows });
  } catch (error) {
    console.error('GET /api/empresas:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao listar empresas' }, { status: 500 });
  } finally {
    if (client) await client.end();
  }
}

export async function POST(req) {
  let client;
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(`empresas:${ip}`, { max: 10, windowMs: 60_000 });
    if (!limit.ok) return rateLimitResponse(limit.retryAfter);

    const body = sanitizeBody(await req.json());
    if (!body.nome || !body.email) {
      return Response.json({ erro: 'nome e email são obrigatórios' }, { status: 400 });
    }
    if (!isValidEmail(body.email)) {
      return Response.json({ erro: 'Email inválido' }, { status: 400 });
    }

    const slug = slugify(body.slug || body.nome);
    const isolationKey = `tenant_${slug.replace(/-/g, '_')}`;

    client = await getDbClient();
    if (!client) {
      return Response.json({ ok: true, source: 'mock', empresa: { ...body, slug, isolamento: isolationKey } });
    }

    await ensureTenantTables(client);
    const result = await client.query(
      `INSERT INTO companies (slug, name, legal_name, segment, size, plan, status, billing_status, deployment_stage, owner_email, whatsapp, domain, data_isolation_key)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (slug) DO UPDATE SET name=$2, legal_name=$3, segment=$4, size=$5, plan=$6, owner_email=$10, whatsapp=$11, domain=$12, updated_at=NOW()
       RETURNING id, slug, name AS nome, plan AS plano, status, data_isolation_key AS isolamento`,
      [slug, body.nome, body.razaoSocial || null, body.segmento || null, body.tamanho || null, body.plano || 'Start', 'LEAD', 'PENDING', 'DIAGNOSIS', body.email, body.whatsapp || null, body.dominio || null, isolationKey]
    );

    await client.query(`INSERT INTO audit_logs (company_id, actor_type, action, entity, entity_id, metadata) VALUES ($1,'SYSTEM','COMPANY_UPSERT','Company',$2,$3)`, [result.rows[0].id, result.rows[0].id, JSON.stringify({ origem: body.origem || 'api' })]);

    return Response.json({ ok: true, source: 'database', empresa: result.rows[0] });
  } catch (error) {
    console.error('POST /api/empresas:', error.message);
    return Response.json({ ok: false, erro: 'Erro ao cadastrar empresa' }, { status: 500 });
  } finally {
    if (client) await client.end();
  }
}
