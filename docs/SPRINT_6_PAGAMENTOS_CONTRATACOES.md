# Sprint 6 — Pagamentos, planos e fluxo comercial de contratação

## Objetivo

Transformar o site em um fluxo comercial mais próximo de venda real, conectando planos, agentes, checkout, Pix manual, estrutura para Mercado Pago/Stripe e painel administrativo de contratações.

## Entregas implementadas

### 1. Checkout comercial

Página atualizada:

```txt
/checkout
```

Agora o checkout:

- recebe `agente` e `plano` por query string;
- calcula valores a partir das regras internas, não do valor enviado pelo cliente;
- permite escolher Pix manual, Mercado Pago ou Stripe futuro;
- cria pedido comercial via API;
- mostra instruções de Pix manual;
- mostra link externo quando Mercado Pago estiver configurado.

### 2. Estratégia de pagamentos

Nova página criada:

```txt
/pagamentos
```

Ela explica a estratégia:

1. Pix manual agora.
2. Mercado Pago na próxima etapa.
3. Stripe/assinaturas na fase de escala.

### 3. API de pagamento refatorada

Arquivo atualizado:

```txt
frontend/src/app/api/pagamento/route.js
```

A API agora:

- valida nome e email;
- valida plano e agente no servidor;
- cria pedido comercial;
- usa Mercado Pago somente quando `MP_ACCESS_TOKEN` estiver configurado;
- cai para Pix manual quando checkout externo não estiver ativo;
- registra metadados do pedido.

### 4. Contratações no admin

Nova página criada:

```txt
/admin/contratacoes
```

Ela permite acompanhar:

- pedidos;
- empresa;
- contato;
- agente;
- plano;
- método de pagamento;
- valor;
- status da contratação.

### 5. APIs administrativas de contratações

Novas rotas:

```txt
/api/admin/contratacoes
/api/admin/contratacoes/[id]
```

Permitem listar pedidos e atualizar status.

### 6. Persistência preparada

Novas tabelas server-side:

```txt
commercial_orders
commercial_payments
```

Criadas automaticamente quando `DATABASE_URL` estiver configurada.

### 7. Prisma preparado

Novos modelos adicionados ao schema:

```txt
CommercialOrder
CommercialPayment
```

### 8. Planos e agentes conectados ao checkout

Atualizações:

- `/planos` agora tem botão de contratar;
- páginas individuais de agentes agora têm botão de contratar;
- footer inclui links de pagamentos, checkout e contratações.

## Variáveis de ambiente úteis

Frontend/Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://agentes-ai-two.vercel.app
NEXT_PUBLIC_PIX_KEY=configure-sua-chave-pix@empresa.com
NEXT_PUBLIC_PIX_NAME=Agentes AI
NEXT_PUBLIC_PIX_BANK=Pix manual
MP_ACCESS_TOKEN=APP_USR_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR_xxxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:password@host:port/dbname
DATABASE_SSL=true
```

## Como testar

1. Acesse `/checkout?agente=atendimento&plano=pro`.
2. Preencha nome, empresa e email.
3. Escolha Pix manual.
4. Clique em criar contratação.
5. Acesse `/admin/contratacoes` com perfil de Admin Agentes AI.
6. Verifique se o pedido aparece em modo banco real ou modo demo.

## Próxima sprint recomendada

Sprint 7 — IA, documentos e base de conhecimento operacional.

Objetivo: preparar upload/cadastro de documentos, regras do agente e geração de respostas com contexto por empresa.
