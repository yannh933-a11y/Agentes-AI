# Sprint 6 — Páginas Legais Profissionais

## Objetivo
Refatorar `/privacidade` e `/termos` para que as páginas legais da Agentes AI pareçam mais completas, profissionais e adequadas para uso comercial inicial.

## Problema corrigido
As páginas anteriores estavam curtas demais e exibiam textos públicos indicando que eram uma base inicial para revisão jurídica. Isso passava impressão de produto inacabado e reduzia confiança do visitante.

## Alterações principais

### Política de Privacidade
A página `/privacidade` foi transformada em uma página completa com:

- hero section profissional;
- resumo prático de tratamento de dados;
- explicação sobre dados coletados;
- finalidade do uso dos dados;
- dados enviados em formulários;
- dados usados para configurar agentes de IA;
- compartilhamento de dados;
- segurança das informações;
- direitos do usuário;
- retenção de dados;
- contato para solicitações;
- CTA para `/contato` e `/termos`.

### Termos de Uso
A página `/termos` foi transformada em uma página completa com:

- hero section profissional;
- resumo dos limites de uso dos agentes;
- descrição do serviço;
- explicação de como os agentes de IA funcionam;
- limitações dos agentes;
- responsabilidade do cliente;
- validação humana em casos sensíveis;
- uso aceitável;
- pagamento e contratação;
- cancelamento;
- suporte;
- limitação de responsabilidade;
- alterações nos termos;
- CTA para `/pre-cadastro`, `/privacidade` e `/contato`.

## Melhorias de confiança

- Foram removidas frases públicas como “base inicial” e “revisar juridicamente antes do uso”.
- A linguagem ficou clara, direta e responsável.
- Não foram adicionadas promessas de resultado garantido.
- Foi reforçado que agentes de IA não substituem validação humana em casos sensíveis.
- As páginas mantêm visual premium, consistente com o restante do site.

## Arquivos alterados/criados

- `frontend/src/app/privacidade/page.js`
- `frontend/src/app/termos/page.js`
- `docs/SPRINT_6_LEGAIS_PRIVACIDADE_TERMOS.md`

## Observações

As páginas agora estão mais adequadas para apresentação comercial, mas continuam com linguagem acessível e sem excesso de juridiquês. Elas também evitam prometer segurança absoluta, resultados comerciais garantidos ou substituição total de análise humana em contextos sensíveis.
