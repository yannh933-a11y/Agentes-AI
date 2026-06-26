# Sprint 4 — Autenticação, permissões e área protegida

## Objetivo

Preparar a Agentes AI para operar como plataforma SaaS com separação entre:

- visitantes públicos;
- clientes logados na área da empresa;
- administradores internos da Agentes AI.

Esta sprint ainda não implementa autenticação real com provedor externo. Ela cria uma camada demo funcional e segura para desenvolvimento, validando fluxo, rotas protegidas, papéis de usuário e permissões.

## Arquivos principais criados

- `frontend/src/lib/auth-data.js`
- `frontend/src/lib/auth.js`
- `frontend/src/app/login/page.js`
- `frontend/src/app/login/LoginForm.js`
- `frontend/src/app/acesso-negado/page.js`
- `frontend/src/app/usuarios/page.js`
- `frontend/src/app/api/auth/login/route.js`
- `frontend/src/app/api/auth/session/route.js`
- `frontend/src/app/api/auth/logout/route.js`
- `frontend/src/app/logout/route.js`

## Arquivos principais modificados

- `frontend/src/middleware.js`
- `frontend/src/app/components/DashboardShell.js`
- `frontend/src/app/components/Navbar.js`
- `frontend/src/lib/tenant.js`
- `backend/prisma/schema.prisma`

## O que foi implementado

### 1. Login demo

Nova página:

```txt
/login
```

Ela permite testar perfis diferentes:

- Admin interno da Agentes AI;
- dono da empresa;
- administrador da empresa;
- operador da empresa.

A rota `/api/auth/login` cria um cookie `httpOnly` de sessão demo.

### 2. Proteção de rotas

O middleware agora protege as rotas privadas:

```txt
/dashboard
/meus-agentes
/conversas
/documentos
/configuracoes
/usuarios
/admin
/empresas
```

Usuário sem sessão é enviado para `/login`.

Usuário sem permissão é enviado para `/acesso-negado`.

### 3. Papéis e permissões

Papéis preparados:

- `SUPER_ADMIN`
- `OWNER`
- `ADMIN`
- `MEMBER`
- `VIEWER`

Permissões preparadas:

- ver dashboard;
- gerenciar agentes;
- gerenciar conversas;
- gerenciar documentos;
- gerenciar configurações;
- gerenciar usuários;
- gerenciar cobrança;
- acessar admin;
- gerenciar empresas.

### 4. Página de usuários

Nova página:

```txt
/usuarios
```

Mostra usuários da empresa, papel, status e matriz de permissões da sessão atual.

### 5. Dashboard com sessão

O `DashboardShell` agora mostra:

- usuário logado;
- papel;
- empresa atual;
- `companyId`;
- botão de logout;
- novo módulo de usuários.

### 6. Prisma preparado

O schema agora inclui base para sessões de acesso:

```txt
AccessSession
```

Também foram adicionados campos para autenticação futura no model `User`.

## Resultado

A plataforma agora tem uma camada inicial de segurança e acesso, permitindo evoluir para autenticação real sem redesenhar toda a estrutura.

## Próxima sprint recomendada

Sprint 5 — Banco real, leads persistentes e painel admin conectado.

Objetivo:

- conectar pré-cadastro ao banco;
- listar leads reais no admin;
- preparar empresas reais;
- criar camada de repositórios/services;
- deixar Railway/Prisma mais próximo de produção.
