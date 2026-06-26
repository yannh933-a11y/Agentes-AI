# Sprint 5 — Banco real, leads persistentes e admin conectado

## Objetivo

Transformar o pré-cadastro comercial em um fluxo operacional mais real: o lead entra pelo site, é salvo no banco quando `DATABASE_URL` existe, aparece no painel admin e pode mudar de status.

## Entregas implementadas

### 1. Camada server-side de banco

Arquivos criados:

- `frontend/src/lib/server/database.js`
- `frontend/src/lib/server/leads-repository.js`
- `frontend/src/lib/server/audit-repository.js`

Responsabilidades:

- detectar se `DATABASE_URL` está configurada;
- conectar ao PostgreSQL;
- criar tabelas comerciais mínimas quando necessário;
- listar leads;
- salvar leads;
- atualizar status do pipeline;
- registrar auditoria.

### 2. Pré-cadastro persistente

Arquivo atualizado:

- `frontend/src/app/api/precadastro/route.js`

Agora o envio do formulário:

1. valida dados;
2. aplica rate limit;
3. salva o lead em `commercial_leads` quando há banco;
4. retorna `leadId`;
5. envia alerta por Telegram se as variáveis estiverem configuradas.

### 3. APIs administrativas

Arquivos criados:

- `frontend/src/app/api/admin/leads/route.js`
- `frontend/src/app/api/admin/leads/[id]/route.js`
- `frontend/src/app/api/admin/metrics/route.js`
- `frontend/src/app/api/health/route.js`

Rotas:

- `GET /api/admin/leads` — lista leads e métricas.
- `PATCH /api/admin/leads/:id` — altera status do lead.
- `GET /api/admin/metrics` — retorna métricas comerciais.
- `GET /api/health` — verifica conexão com banco e prepara tabelas.

As rotas admin exigem sessão `SUPER_ADMIN`.

### 4. Admin conectado

Arquivos criados/alterados:

- `frontend/src/app/admin/AdminLeadsPanel.js`
- `frontend/src/app/admin/page.js`
- `frontend/src/app/admin/leads/page.js`

O painel agora mostra:

- fonte dos dados: banco real ou modo demo;
- total de leads;
- leads dos últimos 7 dias;
- pipeline estimado;
- filtros por status;
- troca de status.

### 5. Schema Prisma ajustado

Arquivo atualizado:

- `backend/prisma/schema.prisma`

Ajuste importante:

- `UserRole` agora inclui `SUPER_ADMIN`, alinhando o Prisma com o sistema de permissões criado na Sprint 4.

## Tabelas criadas automaticamente

Quando `DATABASE_URL` estiver configurada, a API cria:

- `commercial_leads`
- `commercial_audit_logs`

Isso evita depender de migração manual nesta etapa inicial.

## Variáveis necessárias

No ambiente da Vercel, configure:

```env
DATABASE_URL=sua_url_postgres
DATABASE_SSL=true
TELEGRAM_BOT_TOKEN=opcional
TELEGRAM_ADMIN_CHAT_ID=opcional
```

Para banco local sem SSL:

```env
DATABASE_SSL=false
```

## Como testar

1. Acesse `/login`.
2. Entre como `Admin Agentes AI`.
3. Acesse `/admin`.
4. Acesse `/admin/leads`.
5. Envie um pré-cadastro em `/pre-cadastro`.
6. Confira se o lead aparece no pipeline.
7. Acesse `/api/health` para verificar se o banco está conectado.

## Status

Esta sprint prepara o painel comercial real, mas ainda não implementa:

- autenticação real com senha;
- migrations Prisma formais;
- envio real de e-mail transacional;
- CRM completo;
- cobrança/pagamentos conectados.

Esses pontos entram nas próximas sprints.
