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
git commit -m "Agentes AI 3.0 - fundacao e site comercial"
git push
```

A Vercel fará o deploy automaticamente.

## Observação importante

As telas de dashboard, área da empresa e admin são estrutura visual e arquitetura inicial. Autenticação real, permissões, isolamento de dados por empresa, pagamentos e IA operacional devem ser conectados nas próximas sprints.
