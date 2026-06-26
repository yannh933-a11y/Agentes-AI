# Agentes AI 3.0

Plataforma para venda, implantação e operação de agentes de IA exclusivos para empresas.

## Entregue nesta versão

- Fundação frontend organizada com componentes reutilizáveis.
- Design System base: botões, cards, seções, inputs, tipografia e espaçamentos.
- Landing page comercial.
- Catálogo completo de agentes.
- Páginas individuais dos agentes.
- Página de planos.
- Pré-cadastro comercial com campos completos.
- Páginas de contato, suporte, termos e privacidade.
- Área visual da empresa: dashboard, agentes, conversas, documentos e configurações.
- Painel administrativo visual.
- Schema Prisma preparado para Company, Users, Agents, Knowledge Base, Chats e Messages.
- Sprint 1 Produto Comercial: catálogo com busca/filtros, páginas de agentes mais completas, página `/demo`, planos mais claros e pré-cadastro melhorado.

## Rodar localmente

```bash
cd frontend
npm install
npm run dev
```

## Publicar

Depois de substituir os arquivos no projeto local:

```bash
git add .
git commit -m "Agentes AI 3.0 - sprint 1 produto comercial"
git push
```

A Vercel fará o deploy automaticamente.

## Observação importante

As telas de dashboard, área da empresa e admin são estrutura visual e arquitetura inicial. Autenticação real, permissões, isolamento de dados por empresa, pagamentos e IA operacional devem ser conectados nas próximas sprints.

## Sprint 2 — Dashboard e Admin Visual

A Sprint 2 adiciona uma camada visual mais profissional para a área da empresa e o painel administrativo:

- Dashboard da empresa com métricas e implantação.
- Meus agentes com status, canais e desempenho.
- Conversas com inbox, resumo e simulação de atendimento.
- Documentos como base de conhecimento por agente.
- Configurações de empresa, tom de voz, permissões e integrações.
- Painel admin com pipeline comercial, receita por plano e módulos internos.

Documentação: `docs/SPRINT_2_DASHBOARD_ADMIN.md`.

## Sprint 3 — Multiempresa

Esta versão prepara a plataforma para múltiplas empresas usando o mesmo sistema, com dados separados por `companyId`.

Principais entregas:
- Registro visual de empresas em `/empresas`.
- Contexto de empresa no dashboard.
- Prisma preparado para `Company`, `Users`, `Agents`, `KnowledgeDocument`, `Chats`, `Messages`, `Subscriptions`, `Integrations` e `AuditLog`.
- APIs iniciais `/api/empresas` e `/api/contexto-empresa`.

## Sprint 4 — Autenticação e permissões

A Sprint 4 adicionou login demo, sessão por cookie, proteção de rotas, papéis de usuário, permissões e página de usuários. A base está preparada para evoluir para autenticação real e isolamento de acesso por empresa.

Documentação: `docs/SPRINT_4_AUTH_PERMISSOES.md`


## Sprint 5 — Banco, leads e admin conectado

A Sprint 5 conectou o pré-cadastro comercial ao fluxo de dados real:

- camada server-side de banco em `frontend/src/lib/server`;
- API `/api/precadastro` salvando leads comerciais;
- APIs admin `/api/admin/leads`, `/api/admin/metrics` e `/api/health`;
- painel `/admin` conectado ao pipeline;
- página `/admin/leads` dedicada;
- auditoria inicial em `commercial_audit_logs`;
- fallback para modo demonstração quando `DATABASE_URL` não está configurada.

Documentação: `docs/SPRINT_5_BANCO_LEADS_ADMIN.md`.

## Sprint 6 — Pagamentos e contratações

A Sprint 6 adiciona o fluxo comercial de contratação:

- checkout `/checkout` com agente, plano e método de pagamento;
- estratégia `/pagamentos` para Pix manual, Mercado Pago e Stripe futuro;
- API `/api/pagamento` com valores validados no servidor;
- pedido comercial salvo em `commercial_orders` quando `DATABASE_URL` existe;
- pagamentos registrados em `commercial_payments`;
- painel `/admin/contratacoes` para acompanhar pedidos e status;
- links de contratação em `/planos` e nas páginas individuais de agentes.

Documentação: `docs/SPRINT_6_PAGAMENTOS_CONTRATACOES.md`.

## Evolução recente

- Sprint 7: IA, base de conhecimento, prompt por empresa e auditoria de respostas.

## Sprint 8 — Integrações reais e canais

A Sprint 8 prepara a plataforma para operar agentes em canais reais:

- página `/integracoes` para empresas conectarem WhatsApp, Instagram, Google Calendar, CRM, e-mail e webhooks;
- página `/admin/integracoes` para visão interna de health checks e eventos;
- APIs `/api/integracoes`, `/api/integracoes/testar` e `/api/integracoes/eventos`;
- webhooks `/api/webhooks/whatsapp`, `/api/webhooks/instagram`, `/api/webhooks/crm`, `/api/webhooks/calendar` e `/api/webhooks/custom`;
- tabelas `channel_integrations` e `channel_events` preparadas;
- modelos Prisma `ChannelIntegration` e `ChannelEvent`;
- variáveis de ambiente para Meta, WhatsApp, Google, CRM, e-mail e segredo de webhook.

Documentação: `docs/SPRINT_8_INTEGRACOES_CANAIS.md`.

## Sprint 9 — Conversas e roteamento

A plataforma agora possui um roteador central de mensagens para transformar eventos de canais em conversas operacionais. Os webhooks de WhatsApp, Instagram, CRM, Calendar e Custom Webhook podem criar conversas, classificar intenção, selecionar agente, salvar histórico e gerar resposta automática segura.

Principais rotas adicionadas:

- `/conversas`
- `/conversas/[id]`
- `/admin/conversas`
- `/api/routing/receive`
- `/api/conversas`


## Sprint 10 — Operação assistida e envio externo

A Sprint 10 adiciona a camada que controla respostas geradas pela IA antes de envio externo:

- página `/operacao` para a empresa revisar respostas;
- página `/admin/operacao` para visão global multiempresa;
- fila `outbound_responses` com status, SLA, operador, canal e auditoria;
- notificações operacionais em `operation_notifications`;
- ações de aprovar, enviar, aprovar + enviar, pausar e rejeitar;
- envio externo em modo simulado por padrão;
- estrutura pronta para WhatsApp, Instagram, e-mail e webhook personalizado.

Documentação: `docs/SPRINT_10_OPERACAO_ASSISTIDA.md`.
