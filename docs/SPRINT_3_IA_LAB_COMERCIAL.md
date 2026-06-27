# Sprint 3 — IA Lab comercial

## Objetivo
Transformar a página `/ia-lab` em uma experiência mais clara para empresários, mantendo os recursos técnicos existentes em uma área separada.

## O que foi alterado

- A página agora abre em **Modo Cliente**, com linguagem comercial e foco em valor de negócio.
- Foi adicionado um seletor de modo com:
  - **Modo Cliente**
  - **Modo Técnico**
- O Modo Cliente permite escolher o tipo de agente:
  - Atendimento
  - Vendas
  - Suporte
  - Agendamento
  - Documentos
  - Personalizado
- Foi adicionada seleção de segmento da empresa.
- Foram criados botões com perguntas prontas para acelerar a simulação.
- A experiência de resposta foi reorganizada em formato de chat demonstrativo.
- O painel lateral explica, em linguagem simples:
  - o que o agente faz;
  - resultado esperado para a empresa;
  - o que aconteceu na simulação;
  - CTA para pré-cadastro.
- O CTA principal leva para `/pre-cadastro`, já preenchendo parâmetros de agente e segmento na URL.
- O Modo Técnico concentra os itens mais avançados:
  - prompt operacional;
  - base de conhecimento;
  - limites do agente;
  - provedores;
  - checklist de segurança;
  - separação por empresa/tenant.

## Regras preservadas

- A rota `/ia-lab` foi mantida.
- A API `/api/ai/preview` continua sendo utilizada para o preview.
- Quando a API não responde, a página usa uma resposta demonstrativa local para não quebrar a experiência.
- Os botões técnicos para documentos e diagnóstico foram mantidos.
- Nenhuma rota existente foi removida.

## Resultado esperado

A página deixa de parecer uma tela apenas técnica e passa a funcionar como uma demonstração comercial para gerar desejo no visitante e levá-lo ao pré-cadastro.
