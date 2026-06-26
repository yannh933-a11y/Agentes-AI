import crypto from 'crypto';
import { ensureCommercialSchema, withDatabase } from './database';

export async function writeAuditEvent({ actorType = 'SYSTEM', actorLabel = 'Agentes AI', action, entity, entityId, metadata = {} }) {
  if (!action) return { ok: false, source: 'ignored' };

  try {
    const result = await withDatabase(async (client) => {
      await ensureCommercialSchema(client);
      const id = `audit_${crypto.randomUUID()}`;
      await client.query(
        `INSERT INTO commercial_audit_logs (id, actor_type, actor_label, action, entity, entity_id, metadata)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
        [id, actorType, actorLabel, action, entity || null, entityId || null, JSON.stringify(metadata)]
      );
      return { ok: true, source: 'database', id };
    });

    return result || { ok: true, source: 'mock' };
  } catch (error) {
    console.error('writeAuditEvent:', error.message);
    return { ok: false, source: 'database', error: error.message };
  }
}

export async function listAuditEvents({ limit = 20 } = {}) {
  try {
    const result = await withDatabase(async (client) => {
      await ensureCommercialSchema(client);
      const response = await client.query(
        `SELECT id, actor_type, actor_label, action, entity, entity_id, metadata, created_at
         FROM commercial_audit_logs
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );
      return response.rows.map((row) => ({
        id: row.id,
        actorType: row.actor_type,
        actorLabel: row.actor_label,
        action: row.action,
        entity: row.entity,
        entityId: row.entity_id,
        metadata: row.metadata,
        createdAt: row.created_at,
      }));
    });

    return { ok: true, source: result ? 'database' : 'mock', items: result || [] };
  } catch (error) {
    console.error('listAuditEvents:', error.message);
    return { ok: false, source: 'database', items: [], error: error.message };
  }
}
