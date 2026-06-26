# Sprint 10 — Operação assistida e envio externo

## Objetivo

Transformar respostas geradas pela IA em um fluxo operacional seguro: a IA prepara a resposta, um humano pode aprovar, e o sistema envia ou simula o envio para o canal externo.

## Entregas

### Páginas

- `/operacao` — fila da empresa para aprovar, pausar, rejeitar ou enviar respostas.
- `/admin/operacao` — fila global para acompanhar operação multiempresa.

### APIs

- `GET /api/operations/responses`
- `POST /api/operations/responses`
- `GET /api/operations/responses/[id]`
- `PATCH /api/operations/responses/[id]`
- `POST /api/operations/responses/[id]/approve`
- `POST /api/operations/responses/[id]/send`
- `POST /api/operations/responses/[id]/reject`
- `POST /api/operations/responses/[id]/hold`
- `GET /api/operations/metrics`
- `GET /api/operations/notifications`

### Backend server-side

- `frontend/src/lib/server/operations-repository.js`
- `frontend/src/lib/server/channel-sender.js`

### Banco preparado

- `outbound_responses`
- `operation_notifications`

### Prisma preparado

- `OutboundResponse`
- `OperationNotification`

## Segurança operacional

Por padrão, o envio externo fica em modo simulado.

Para liberar envio real futuramente:

```env
ENABLE_EXTERNAL_SEND=true
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
META_APP_ID=
META_APP_SECRET=
RESEND_API_KEY=
CUSTOM_OUTBOUND_WEBHOOK_URL=
```

Mesmo com envio real, a rota mantém auditoria, status e registro de evento do canal.

## Fluxo criado

1. Canal externo recebe mensagem.
2. Roteador cria ou atualiza conversa.
3. IA gera resposta com base da empresa.
4. Resposta entra em `outbound_responses` como `PENDING_APPROVAL`.
5. Operador aprova, pausa, rejeita ou envia.
6. Sistema registra evento, notificação e auditoria.

## Próxima sprint recomendada

**Sprint 11 — Suporte, SLA e Customer Success**

Objetivo: criar central de suporte para clientes, chamados, prioridades, status de implantação, sucesso do cliente e acompanhamento pós-venda.
