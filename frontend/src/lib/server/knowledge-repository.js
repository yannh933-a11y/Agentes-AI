import crypto from 'crypto';
import { currentTenant } from '../tenant';
import { knowledgeDocuments, findRelevantKnowledge } from '../ai-config';
import { ensureCommercialSchema, withDatabase } from './database';
import { writeAuditEvent } from './audit-repository';

function normalizeDoc(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    agentSlug: row.agent_slug || null,
    title: row.title,
    type: row.type || 'Base de conhecimento',
    content: row.content,
    status: row.status || 'DRAFT',
    priority: row.priority || 'Média',
    tags: Array.isArray(row.tags) ? row.tags : safeJson(row.tags, []),
    sourceUrl: row.source_url || null,
    version: Number(row.version || 1),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeJson(value, fallback) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function fallbackDocs({ companyId = currentTenant.id, agentSlug = null } = {}) {
  return knowledgeDocuments
    .filter((doc) => doc.companyId === companyId)
    .filter((doc) => !agentSlug || !doc.agentSlug || doc.agentSlug === agentSlug || doc.agentSlug === 'atendimento')
    .map((doc) => ({
      ...doc,
      sourceUrl: null,
      version: 1,
      createdAt: new Date().toISOString(),
    }));
}

export async function listKnowledgeDocuments({ companyId = currentTenant.id, agentSlug = null, status = null } = {}) {
  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const params = [companyId];
    let where = 'WHERE company_id = $1';

    if (agentSlug) {
      params.push(agentSlug);
      where += ` AND (agent_slug = $${params.length} OR agent_slug IS NULL)`;
    }

    if (status) {
      params.push(status);
      where += ` AND status = $${params.length}`;
    }

    const response = await client.query(
      `SELECT * FROM ai_knowledge_documents ${where} ORDER BY updated_at DESC, title ASC`,
      params
    );
    return response.rows.map(normalizeDoc);
  });

  return { source: result ? 'database' : 'mock', items: result || fallbackDocs({ companyId, agentSlug }) };
}

export async function createKnowledgeDocument(data) {
  const payload = {
    id: data.id || `kb_${crypto.randomUUID()}`,
    companyId: data.companyId || currentTenant.id,
    agentSlug: data.agentSlug || null,
    title: String(data.title || '').trim(),
    type: data.type || 'Base de conhecimento',
    content: String(data.content || '').trim(),
    status: data.status || 'DRAFT',
    priority: data.priority || 'Média',
    tags: Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(',').map((item) => item.trim()).filter(Boolean),
    sourceUrl: data.sourceUrl || null,
  };

  if (!payload.title || !payload.content) {
    throw new Error('Título e conteúdo são obrigatórios.');
  }

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `INSERT INTO ai_knowledge_documents
       (id, company_id, agent_slug, title, type, content, status, priority, tags, source_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [payload.id, payload.companyId, payload.agentSlug, payload.title, payload.type, payload.content, payload.status, payload.priority, JSON.stringify(payload.tags), payload.sourceUrl]
    );
    return normalizeDoc(response.rows[0]);
  });

  const document = result || { ...payload, version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  await writeAuditEvent({
    actorType: 'COMPANY_USER',
    action: 'KNOWLEDGE_DOCUMENT_CREATE',
    entity: 'KnowledgeDocument',
    entityId: document.id,
    metadata: { companyId: document.companyId, agentSlug: document.agentSlug, status: document.status },
  });

  return { source: result ? 'database' : 'mock', document };
}

export async function updateKnowledgeDocument(id, data) {
  const tags = Array.isArray(data.tags) ? data.tags : data.tags ? String(data.tags).split(',').map((item) => item.trim()).filter(Boolean) : null;

  const result = await withDatabase(async (client) => {
    await ensureCommercialSchema(client);
    const response = await client.query(
      `UPDATE ai_knowledge_documents
       SET title = COALESCE($2, title),
           type = COALESCE($3, type),
           content = COALESCE($4, content),
           status = COALESCE($5, status),
           priority = COALESCE($6, priority),
           tags = COALESCE($7::jsonb, tags),
           source_url = COALESCE($8, source_url),
           version = version + 1,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, data.title || null, data.type || null, data.content || null, data.status || null, data.priority || null, tags ? JSON.stringify(tags) : null, data.sourceUrl || null]
    );
    return response.rows[0] ? normalizeDoc(response.rows[0]) : null;
  });

  if (!result) return { source: 'mock', document: null };

  await writeAuditEvent({
    actorType: 'COMPANY_USER',
    action: 'KNOWLEDGE_DOCUMENT_UPDATE',
    entity: 'KnowledgeDocument',
    entityId: id,
    metadata: { status: data.status },
  });

  return { source: 'database', document: result };
}

export async function searchKnowledge({ companyId = currentTenant.id, agentSlug = null, message = '', limit = 3 } = {}) {
  const { source, items } = await listKnowledgeDocuments({ companyId, agentSlug, status: 'PUBLISHED' });
  const relevant = findRelevantKnowledge(message, items, limit);
  return { source, items: relevant.length ? relevant : items.slice(0, limit) };
}
