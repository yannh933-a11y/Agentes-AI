# Sprint 9 — Conversas reais e roteamento de mensagens

## Objetivo
Conectar os eventos dos canais ao sistema operacional de conversas da Agentes AI.

A partir desta sprint, mensagens recebidas por WhatsApp, Instagram, CRM, Calendar, webhooks customizados ou endpoint genérico passam por um roteador central que:

- identifica a empresa (`companyId`);
- identifica o canal;
- extrai contato, nome e texto do cliente;
- escolhe o agente mais adequado;
- cria ou reaproveita a conversa;
- salva mensagem do cliente;
- gera resposta automática quando for seguro;
- escala para humano quando detectar risco;
- registra eventos e auditoria.

## Novas páginas

- `/conversas` — inbox operacional multi-canal.
- `/conversas/[id]` — detalhe da conversa, histórico e resumo operacional.
- `/admin/conversas` — visão interna de conversas por empresa.

## Novas APIs

- `GET /api/conversas` — lista conversas por empresa, canal, agente ou status.
- `POST /api/conversas` — cria/roteia mensagem manualmente.
- `GET /api/conversas/[id]` — detalhe da conversa + mensagens.
- `PATCH /api/conversas/[id]` — altera status da conversa.
- `GET /api/conversas/[id]/mensagens` — lista mensagens.
- `POST /api/conversas/[id]/mensagens` — adiciona mensagem humana ou gera resposta da IA.
- `POST /api/routing/receive` — endpoint central para canais externos.

## Webhooks atualizados

- `/api/webhooks/whatsapp`
- `/api/webhooks/instagram`
- `/api/webhooks/custom`
- `/api/webhooks/crm`
- `/api/webhooks/calendar`

Agora eles conseguem enviar mensagens para o roteador central quando houver texto/conteúdo de cliente.

## Novos arquivos principais

- `frontend/src/lib/server/conversations-repository.js`
- `frontend/src/app/conversas/page.js`
- `frontend/src/app/conversas/[id]/page.js`
- `frontend/src/app/admin/conversas/page.js`
- `frontend/src/app/api/conversas/route.js`
- `frontend/src/app/api/conversas/[id]/route.js`
- `frontend/src/app/api/conversas/[id]/mensagens/route.js`
- `frontend/src/app/api/routing/receive/route.js`

## Banco de dados

A camada `ensureCommercialSchema` agora prepara campos operacionais nas tabelas:

- `ai_conversations`
- `ai_messages`
- `ai_agent_runs`
- `channel_events`

Campos operacionais adicionados:

- `agent_name`
- `priority`
- `external_thread_id`
- `last_message_at`
- `metadata` em mensagens

Também foram adicionados modelos Prisma:

- `AIConversation`
- `AIMessage`

## Comportamento de segurança

O roteador escala para humano quando detecta termos sensíveis, como:

- senha;
- CPF;
- cartão;
- cancelamento;
- reclamação;
- jurídico;
- processo;
- cobrança crítica.

Quando não há risco, a IA pode gerar resposta usando a base de conhecimento da empresa atual.

## Validação

Build do frontend executado com sucesso:

```bash
npm run build
```

## Próxima sprint recomendada

**Sprint 10 — Operação assistida e automação de respostas externas**

Próximos passos:

- criar fila de respostas pendentes;
- permitir aprovação humana antes de enviar;
- preparar envio real para WhatsApp/Instagram;
- criar status de SLA;
- criar notificações internas;
- registrar tempo de resposta e taxa de resolução.
