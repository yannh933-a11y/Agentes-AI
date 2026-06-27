import crypto from 'crypto';
import { withDatabase } from './database';

function normalizeContact(row) {
  return {
    id: String(row.id),
    nome: row.name,
    whatsapp: row.whatsapp,
    email: row.email,
    empresa: row.company_name,
    motivo: row.motive,
    mensagem: row.message,
    origem: row.origin || 'contato-site',
    status: row.status || 'NEW',
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at,
  };
}

async function ensureContactSchema(client) {
  await client.query(`CREATE TABLE IF NOT EXISTS contact_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    motive TEXT NOT NULL,
    message TEXT NOT NULL,
    origin TEXT DEFAULT 'contato-site',
    status TEXT DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC)`);
}

export async function createContactRequest(data) {
  const id = `contact_${crypto.randomUUID()}`;
  const payload = {
    id,
    name: data.nome?.trim(),
    whatsapp: data.whatsapp?.trim(),
    email: data.email?.trim().toLowerCase(),
    companyName: data.empresa?.trim(),
    motive: data.motivo?.trim(),
    message: data.mensagem?.trim(),
    origin: data.origem || 'contato-site',
  };

  const result = await withDatabase(async (client) => {
    await ensureContactSchema(client);
    const response = await client.query(
      `INSERT INTO contact_requests
       (id, name, whatsapp, email, company_name, motive, message, origin, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'NEW')
       RETURNING *`,
      [payload.id, payload.name, payload.whatsapp, payload.email, payload.companyName, payload.motive, payload.message, payload.origin]
    );

    return normalizeContact(response.rows[0]);
  });

  if (!result) {
    return {
      source: 'mock',
      contact: normalizeContact({
        id,
        name: payload.name,
        whatsapp: payload.whatsapp,
        email: payload.email,
        company_name: payload.companyName,
        motive: payload.motive,
        message: payload.message,
        origin: payload.origin,
        status: 'NEW',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    };
  }

  return { source: 'database', contact: result };
}
