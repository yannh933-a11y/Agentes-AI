# Sprint 8 — Integrações reais e canais

Esta sprint prepara a Agentes AI para operar agentes em canais reais, mantendo isolamento por empresa e trilha de auditoria.

## Objetivo

Preparar a plataforma para conectar agentes aos canais usados pelas empresas:

- WhatsApp Cloud API
- Instagram / Meta DM
- Google Calendar
- CRM via webhook
- E-mail transacional
- Webhook personalizado

## Arquivos principais adicionados

```txt
frontend/src/lib/integrations.js
frontend/src/lib/server/integrations-repository.js
frontend/src/app/integracoes/page.js
frontend/src/app/admin/integracoes/page.js
frontend/src/app/api/integracoes/route.js
frontend/src/app/api/integracoes/testar/route.js
frontend/src/app/api/integracoes/eventos/route.js
frontend/src/app/api/webhooks/whatsapp/route.js
frontend/src/app/api/webhooks/instagram/route.js
frontend/src/app/api/webhooks/crm/route.js
frontend/src/app/api/webhooks/calendar/route.js
frontend/src/app/api/webhooks/custom/route.js
```

## Estrutura de banco preparada

Foram adicionadas tabelas SQL automáticas via `ensureCommercialSchema`:

```txt
channel_integrations
channel_events
```

E modelos no Prisma:

```txt
ChannelIntegration
ChannelEvent
```

## APIs criadas

### `GET /api/integracoes`
Lista integrações da empresa atual.

### `POST /api/integracoes`
Cria ou atualiza uma integração.

### `POST /api/integracoes/testar`
Registra um teste seguro de integração.

### `GET /api/integracoes/eventos`
Lista eventos de integração.

### `POST /api/integracoes/eventos`
Registra evento manualmente.

### Webhooks

```txt
GET/POST /api/webhooks/whatsapp
GET/POST /api/webhooks/instagram
POST /api/webhooks/crm
POST /api/webhooks/calendar
POST /api/webhooks/custom
```

## Variáveis de ambiente novas

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
META_APP_ID=
META_APP_SECRET=
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
CRM_WEBHOOK_URL=
RESEND_API_KEY=
EMAIL_FROM=
WEBHOOK_SIGNING_SECRET=
```

## Segurança

A sprint implementa a base para:

- validar token de webhook Meta/WhatsApp;
- validar segredo compartilhado em webhooks customizados;
- registrar eventos com `companyId`;
- preparar rastreabilidade de canal;
- separar eventos de empresas diferentes.

## Próxima sprint recomendada

Sprint 9 — Conversas reais e roteamento de mensagens.

Ela deve conectar eventos de canais ao motor de IA, criando conversas, mensagens e respostas automáticas com base no agente e na empresa corretos.
