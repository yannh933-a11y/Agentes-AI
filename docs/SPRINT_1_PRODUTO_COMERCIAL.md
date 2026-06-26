# Agentes AI — Sprint 1: Produto Comercial

## Objetivo

Transformar a base pública do site em um produto comercial mais forte antes de avançar para dashboard real, multiempresa, pagamentos e IA operacional.

## O que foi implementado

### 1. Catálogo comercial de agentes

Arquivos principais:

- `frontend/src/app/agentes/page.js`
- `frontend/src/app/agentes/AgentesCatalog.js`
- `frontend/src/lib/agentes.js`

Melhorias:

- busca por necessidade;
- filtro por categoria;
- cards com segmento ideal, categoria, preço e destaque;
- CTA para demonstração e pré-cadastro;
- seção de orientação sobre qual agente escolher.

### 2. Páginas individuais mais persuasivas

Arquivo principal:

- `frontend/src/app/agentes/[slug]/page.js`

Melhorias:

- estrutura de página de produto;
- problema que o agente resolve;
- resultado esperado;
- demonstração de conversa;
- benefícios, funcionalidades e FAQ por agente;
- CTA para solicitar o agente;
- agentes relacionados.

### 3. Página de demo

Arquivos:

- `frontend/src/app/demo/page.js`
- `frontend/src/app/demo/DemoPageClient.js`

Melhorias:

- nova página `/demo`;
- seleção de cenário por tipo de agente;
- simulação visual de conversa;
- CTA para página do agente e pré-cadastro.

### 4. Página de planos mais comercial

Arquivo:

- `frontend/src/app/planos/page.js`

Melhorias:

- cards de planos mais claros;
- tabela comparativa;
- FAQ comercial;
- direcionamento para diagnóstico antes do pagamento.

### 5. Pré-cadastro melhorado

Arquivos:

- `frontend/src/app/pre-cadastro/PreCadastroForm.js`
- `frontend/src/app/api/precadastro/route.js`

Melhorias:

- validação de campos obrigatórios;
- seleção de agente e plano por URL;
- resumo da solicitação;
- melhora da mensagem de sucesso;
- API preparada para receber `planoDesejado` e `origem`;
- atualização automática da tabela `precadastros` com novas colunas se necessário.

### 6. Navegação atualizada

Arquivos:

- `frontend/src/app/components/Navbar.js`
- `frontend/src/app/components/Footer.js`
- `frontend/src/app/page.js`

Melhorias:

- link para `/demo` no menu;
- CTA de demo na home;
- FAQ da home citando a demonstração.

### 7. Base técnica

Arquivos:

- `frontend/package.json`
- `frontend/package-lock.json`

Melhoria:

- Next.js atualizado de `14.2.0` para `14.2.35` dentro da mesma linha major/minor.

## Validação

Comando executado:

```bash
cd frontend
npm run build
```

Resultado: build compilado com sucesso.

## Próxima sprint recomendada

### Sprint 2 — Dashboard Comercial e Admin Visual 2.0

Objetivo: transformar a área da empresa e o painel admin em interfaces mais completas antes de ligar dados reais.

Entregas sugeridas:

- `/dashboard` com visão de agentes, leads e status;
- `/meus-agentes` com cards e estados de implantação;
- `/conversas` com layout de inbox;
- `/documentos` com upload visual;
- `/admin` com visão de leads, empresas, planos e status;
- base visual pronta para autenticação e multiempresa.
