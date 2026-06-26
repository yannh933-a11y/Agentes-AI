# Sprint 3 — Multiempresa e dados reais preparados

## Objetivo
Preparar a Agentes AI para operar várias empresas dentro do mesmo sistema, mantendo agentes, documentos, conversas e mensagens isolados por empresa.

## O que foi implementado

### Frontend
- Criado `frontend/src/lib/tenant.js` com registro inicial de empresas, usuários, arquitetura multiempresa, checklist de isolamento e eventos de auditoria.
- Criada página `/empresas` para painel administrativo de empresas e tenants.
- Atualizado `DashboardShell` para mostrar o contexto da empresa atual e `companyId`.
- Atualizado `/dashboard` com bloco de contexto multiempresa.
- Atualizado `/meus-agentes` para exibir `companyId`, prompt próprio e base vinculada por agente.
- Atualizado `/admin` com visão de tenant registry e auditoria.

### APIs
- Criada rota `GET/POST /api/empresas`.
  - Sem `DATABASE_URL`, retorna dados mockados.
  - Com `DATABASE_URL`, cria tabela `companies` e `audit_logs` e grava empresas.
- Criada rota `GET /api/contexto-empresa` para consultar regras de escopo por empresa.

### Banco e backend
- `backend/prisma/schema.prisma` foi redesenhado para arquitetura multiempresa:
  - `Company`
  - `User`
  - `Agent`
  - `KnowledgeDocument`
  - `Chat`
  - `Message`
  - `Lead`
  - `Plan`
  - `Subscription`
  - `Integration`
  - `AuditLog`
- Modelos legados foram mantidos para compatibilidade com o MVP atual.

## Decisão arquitetural
Toda entidade operacional importante deve carregar `companyId`. Isso evita mistura de dados entre clientes e prepara o sistema para escala.

## Regra principal
Nenhuma consulta de dashboard, agente, conversa, documento ou mensagem deve ser feita sem o contexto de empresa.

## Próxima sprint recomendada
Sprint 4 — Autenticação, permissões e área da empresa real.

Objetivo: criar estrutura de login, papéis de usuário, proteção visual de rotas e preparação para autenticação real.
