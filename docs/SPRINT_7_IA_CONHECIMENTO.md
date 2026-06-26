# Sprint 7 — IA, documentos e base de conhecimento operacional

## Objetivo
Preparar a plataforma para operar agentes de IA por empresa, usando base de conhecimento isolada, prompt por tipo de agente e auditoria de resposta.

## Entregas implementadas

- Nova página `/ia-lab` para testar respostas de agentes com contexto.
- Nova configuração central `frontend/src/lib/ai-config.js`.
- Base de conhecimento operacional em `/documentos`.
- Configurações de IA em `/configuracoes`.
- Conversas com auditoria de documentos usados e flags de segurança em `/conversas`.
- APIs server-side:
  - `GET/POST /api/knowledge-documents`
  - `PATCH /api/knowledge-documents/[id]`
  - `POST /api/ai/preview`
  - `GET /api/ai/contexto`
- Camadas server-side:
  - `frontend/src/lib/server/knowledge-repository.js`
  - `frontend/src/lib/server/ai-service.js`
- Banco preparado com tabelas operacionais:
  - `ai_knowledge_documents`
  - `ai_conversations`
  - `ai_messages`
  - `ai_agent_runs`
- Prisma preparado com:
  - `DocumentChunk`
  - `AgentRun`

## Provedores preparados

O sistema tenta usar o provider configurado e cai para modo demo seguro quando nenhuma chave existir.

Variáveis futuras:

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-haiku-latest
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
```

## Regra de segurança principal

A resposta do agente deve usar apenas documentos da empresa atual e do agente escolhido. Caso a base não tenha a informação, o agente deve pedir confirmação humana, sem inventar preços, prazos, contratos, descontos ou políticas.

## Próxima sprint recomendada

Sprint 8 — Integrações reais e canais:

- WhatsApp Cloud API ou provedor intermediário.
- Instagram/Meta.
- Google Calendar.
- Webhooks.
- CRM.
- Registro de eventos por canal.
