# Sprint 5 — Página de Contato Comercial

## Objetivo
Transformar `/contato` em uma página profissional de contato, suporte e conversão para empresas interessadas em agentes de IA.

## Alterações principais

- A página deixou de funcionar apenas como ponte simples e passou a ter uma jornada comercial completa.
- Foram adicionados três caminhos claros para o visitante:
  - Quero contratar um agente
  - Quero uma demonstração
  - Sou cliente e preciso de suporte
- Foram adicionados CTAs para `/pre-cadastro`, `/ia-lab` e `/suporte`.
- Foi criado um formulário rápido com os campos:
  - Nome
  - WhatsApp
  - E-mail
  - Empresa
  - Motivo do contato
  - Mensagem
- O formulário possui validação, estado de carregamento, mensagens de erro e estado de sucesso.
- Foi criada a API `/api/contato` com validação server-side, rate limit e sanitização.
- Foi criada a estrutura `contact-repository` para persistir contatos em banco quando `DATABASE_URL` estiver configurado.
- Quando não houver banco configurado, a API responde em modo mock/demonstração sem quebrar a experiência.
- A estrutura está preparada para notificação via Telegram usando as variáveis já existentes:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_ADMIN_CHAT_ID`

## Arquivos alterados/criados

- `frontend/src/app/contato/page.js`
- `frontend/src/app/contato/ContactQuickForm.js`
- `frontend/src/app/api/contato/route.js`
- `frontend/src/lib/server/contact-repository.js`
- `docs/SPRINT_5_CONTATO_CONVERSAO.md`

## Observações

A página não expõe WhatsApp fictício. A seção de tempo de resposta informa que o retorno será feito pelos dados enviados, e a estrutura técnica permite adicionar um canal oficial futuramente.
