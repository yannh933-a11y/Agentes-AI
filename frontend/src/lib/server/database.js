// ============================================================
// Agentes AI — camada mínima de banco para rotas server-side.
// Usa DATABASE_URL quando existir e cai para dados demonstrativos
// quando o projeto estiver rodando sem banco configurado.
// ============================================================

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export async function withDatabase(callback) {
  if (!process.env.DATABASE_URL) return null;

  const { Client } = await import('pg');
  const useSsl = process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false };
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl,
  });

  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

export async function ensureCommercialSchema(client) {
  await client.query(`CREATE TABLE IF NOT EXISTS commercial_leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT,
    email TEXT UNIQUE NOT NULL,
    whatsapp TEXT,
    segment TEXT,
    agent_type TEXT,
    plan TEXT,
    size TEXT,
    problem TEXT,
    origin TEXT DEFAULT 'site',
    status TEXT DEFAULT 'NEW',
    estimated_value_cents INTEGER DEFAULT 0,
    notes TEXT,
    last_interaction_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS commercial_audit_logs (
    id TEXT PRIMARY KEY,
    actor_type TEXT DEFAULT 'SYSTEM',
    actor_label TEXT,
    action TEXT NOT NULL,
    entity TEXT,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
  )`);



  await client.query(`CREATE TABLE IF NOT EXISTS commercial_orders (
    id TEXT PRIMARY KEY,
    lead_id TEXT,
    company_name TEXT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    agent_slug TEXT,
    agent_name TEXT,
    plan_slug TEXT,
    plan_name TEXT,
    payment_method TEXT DEFAULT 'pix_manual',
    provider TEXT,
    provider_reference TEXT,
    checkout_url TEXT,
    setup_cents INTEGER DEFAULT 0,
    monthly_cents INTEGER DEFAULT 0,
    total_cents INTEGER DEFAULT 0,
    status TEXT DEFAULT 'AWAITING_PAYMENT',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS commercial_payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    provider TEXT DEFAULT 'pix_manual',
    provider_reference TEXT,
    amount_cents INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    paid_at TIMESTAMP,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_leads_status ON commercial_leads(status)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_leads_plan ON commercial_leads(plan)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_leads_created_at ON commercial_leads(created_at DESC)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_audit_entity ON commercial_audit_logs(entity, entity_id)`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_orders_status ON commercial_orders(status)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_orders_email ON commercial_orders(email)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_orders_created_at ON commercial_orders(created_at DESC)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_commercial_payments_order ON commercial_payments(order_id)`);


  await client.query(`CREATE TABLE IF NOT EXISTS ai_knowledge_documents (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    agent_slug TEXT,
    title TEXT NOT NULL,
    type TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    priority TEXT DEFAULT 'MEDIUM',
    tags JSONB DEFAULT '[]'::jsonb,
    source_url TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    agent_slug TEXT,
    customer_name TEXT,
    customer_contact TEXT,
    channel TEXT DEFAULT 'site',
    status TEXT DEFAULT 'OPEN',
    summary TEXT,
    sentiment TEXT,
    next_action TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ai_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    company_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ai_agent_runs (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    agent_slug TEXT,
    conversation_id TEXT,
    provider TEXT DEFAULT 'demo',
    input TEXT,
    output TEXT,
    used_documents JSONB DEFAULT '[]'::jsonb,
    safety_flags JSONB DEFAULT '[]'::jsonb,
    latency_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_knowledge_company_agent ON ai_knowledge_documents(company_id, agent_slug)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_knowledge_status ON ai_knowledge_documents(status)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_conversations_company_agent ON ai_conversations(company_id, agent_slug)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_runs_company_agent ON ai_agent_runs(company_id, agent_slug)`);

  await client.query(`ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS agent_name TEXT`);
  await client.query(`ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Normal'`);
  await client.query(`ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS next_action TEXT`);
  await client.query(`ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS external_thread_id TEXT`);
  await client.query(`ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP`);
  await client.query(`ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_conversations_external_thread ON ai_conversations(company_id, channel, external_thread_id)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_message ON ai_conversations(last_message_at DESC)`);


  await client.query(`CREATE TABLE IF NOT EXISTS channel_integrations (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    name TEXT NOT NULL,
    provider TEXT DEFAULT 'custom',
    status TEXT DEFAULT 'configured',
    health TEXT DEFAULT 'Pendente',
    config JSONB DEFAULT '{}'::jsonb,
    last_event_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, channel, name)
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS channel_events (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    integration_id TEXT,
    channel TEXT NOT NULL,
    direction TEXT DEFAULT 'inbound',
    event_type TEXT NOT NULL,
    status TEXT DEFAULT 'received',
    summary TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_channel_integrations_company ON channel_integrations(company_id)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_channel_integrations_channel ON channel_integrations(channel)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_channel_events_company_channel ON channel_events(company_id, channel)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_channel_events_created_at ON channel_events(created_at DESC)`);


  await client.query(`CREATE TABLE IF NOT EXISTS outbound_responses (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    company_name TEXT,
    conversation_id TEXT,
    message_id TEXT,
    channel TEXT DEFAULT 'site',
    customer_name TEXT,
    customer_contact TEXT,
    agent_slug TEXT,
    agent_name TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_APPROVAL',
    priority TEXT DEFAULT 'Normal',
    approval_mode TEXT DEFAULT 'human_review',
    sla_minutes INTEGER DEFAULT 45,
    due_at TIMESTAMP,
    approved_by TEXT,
    approved_at TIMESTAMP,
    sent_at TIMESTAMP,
    provider TEXT,
    provider_reference TEXT,
    error TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS operation_notifications (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    type TEXT NOT NULL,
    severity TEXT DEFAULT 'INFO',
    title TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'UNREAD',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP
  )`);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_outbound_responses_company_status ON outbound_responses(company_id, status)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_outbound_responses_due ON outbound_responses(due_at)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_outbound_responses_conversation ON outbound_responses(conversation_id)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_operation_notifications_company_status ON operation_notifications(company_id, status)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_operation_notifications_created ON operation_notifications(created_at DESC)`);

}

export function normalizeDbError(error) {
  return {
    message: error?.message || 'Erro desconhecido de banco',
    code: error?.code || null,
  };
}
