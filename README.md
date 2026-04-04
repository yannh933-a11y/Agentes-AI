# Agentes IA — Sistema Completo

## Estrutura

```
agentes-ia/
├── backend/       → API Node.js + Express + Prisma
└── frontend/      → Site Next.js + Tailwind
```

## Como publicar

### Backend (Railway)
1. Crie um projeto no Railway
2. Adicione um banco PostgreSQL
3. Faça deploy do backend conectando o GitHub
4. Configure as variáveis de ambiente do `.env.example`
5. Rode: `npx prisma db push`

### Frontend (Vercel)
1. Conecte o repositório GitHub na Vercel
2. Configure: `NEXT_PUBLIC_API_URL=https://seu-backend.railway.app`
3. Deploy automático

## Variáveis de ambiente necessárias (Backend)

| Variável | Onde pegar |
|----------|-----------|
| DATABASE_URL | Railway → PostgreSQL → Connect |
| RESEND_API_KEY | resend.com → API Keys |
| INTER_CLIENT_ID | developers.inter.com.br |
| INTER_CLIENT_SECRET | developers.inter.com.br |
| INTER_PIX_KEY | Sua chave PIX (email/CPF/telefone) |
| ADMIN_TOKEN | Crie uma senha forte qualquer |

## Fluxo completo

1. Cliente acessa o site
2. Escolhe o agente → vai para checkout
3. Preenche nome e email → gera PIX
4. Paga o PIX
5. Inter envia webhook para o backend
6. Backend cria o agente no OpenClaw automaticamente
7. Backend envia email com credenciais para o cliente
8. Cliente ativa o agente no Telegram com o código recebido
