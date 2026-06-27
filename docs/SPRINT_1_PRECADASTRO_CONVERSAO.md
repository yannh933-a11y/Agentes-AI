# Sprint 1 — Pré-cadastro e conversão

## Objetivo
Corrigir a página `/pre-cadastro`, remover o carregamento infinito e transformar a rota em uma página profissional de captação de leads para empresas interessadas em contratar agentes de IA.

## Arquivos alterados

- `frontend/src/app/pre-cadastro/page.js`
- `frontend/src/app/pre-cadastro/PreCadastroForm.js`
- `frontend/src/app/api/precadastro/route.js`
- `frontend/src/lib/server/leads-repository.js`
- `frontend/src/lib/server/database.js`
- `frontend/src/lib/security.js`
- `frontend/src/app/admin/AdminLeadsPanel.js`

## Melhorias implementadas

1. Remoção do `useSearchParams()` dentro do componente client da página de pré-cadastro, eliminando o risco de a rota ficar presa no fallback `Carregando...`.
2. Nova página comercial com headline, subtítulo, blocos de valor, resumo dinâmico e formulário responsivo.
3. Formulário completo com os campos exigidos:
   - Nome completo
   - WhatsApp
   - E-mail
   - Nome da empresa
   - Segmento da empresa
   - Tamanho da empresa
   - Tipo de agente desejado
   - Canal de uso
   - Volume aproximado de atendimentos por dia
   - Principal problema
4. Validação client-side para campos obrigatórios, e-mail, WhatsApp com DDD e descrição mínima do problema.
5. Estado de envio com loading visual.
6. Tela de sucesso pós-envio com próximos passos.
7. API `/api/precadastro` reforçada com validações server-side.
8. Notificação Telegram atualizada para incluir canal e volume.
9. Repositório de leads preparado para armazenar canal e volume em banco PostgreSQL.
10. Schema comercial atualizado com `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para manter compatibilidade com bancos já existentes.
11. Painel admin de leads atualizado para mostrar canal e volume.
12. Ajuste no rate limiter para evitar que o intervalo de limpeza segure processos Node.js durante builds.

## Observação de persistência
Se `DATABASE_URL` estiver configurada, os leads são persistidos no banco. Sem banco configurado, a API responde em modo demonstração, mantendo a estrutura pronta para produção.
