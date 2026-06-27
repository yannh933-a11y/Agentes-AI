# Sprint 4 — Navegação pública profissional

## Objetivo

Reorganizar o header e o footer públicos da Agentes AI para deixar a navegação mais limpa, comercial e confiável para visitantes e potenciais clientes.

## Problema corrigido

O rodapé público exibia links administrativos como Admin, Integrações Admin, Operação Admin e Contratações. Isso passava a impressão de produto inacabado e expunha atalhos internos para visitantes comuns.

## Alterações realizadas

### Header público

O header foi simplificado para focar em páginas comerciais:

- Agentes
- Demo
- IA Lab
- Planos
- Contato
- Entrar
- Solicitar agente

Foram removidos do header público links menos adequados para a navegação principal de venda, como Integrações, Operação, Suporte e Área da empresa.

### Footer público

O footer foi reorganizado em quatro grupos:

#### Produto
- Agentes
- Demo
- IA Lab
- Planos

#### Empresa
- Contato
- Suporte

#### Legal
- Privacidade
- Termos

#### Acesso
- Entrar

Também foi mantido um CTA comercial para /pre-cadastro com o texto "Solicitar agente".

### Rotas internas

Nenhuma rota administrativa foi deletada. A mudança foi apenas visual: os links internos deixaram de aparecer na navegação pública.

Rotas internas e protegidas continuam existindo, incluindo:

- /admin
- /integracoes
- /operacao
- /dashboard
- /pagamentos
- /checkout
- /documentos

## Arquivos alterados

- frontend/src/app/components/Navbar.js
- frontend/src/app/components/Footer.js
- docs/SPRINT_4_NAVEGACAO_PUBLICA.md

## Resultado esperado

A navegação pública agora passa uma impressão mais profissional, reduz ruído para visitantes, evita exposição desnecessária de áreas internas e direciona melhor o usuário para conversão.
