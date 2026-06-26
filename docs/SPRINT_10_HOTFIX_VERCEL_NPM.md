# Hotfix Vercel — npm install timeout

Este hotfix corrige o erro de deploy da Vercel em `npm install` causado por URLs internas no `frontend/package-lock.json`.

## Problema

A Vercel tentava baixar pacotes em um registry interno inacessível fora do ambiente de geração do ZIP:

```text
packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public
```

Isso gerava erro `ETIMEDOUT` durante `npm install`.

## Correção aplicada

- `frontend/package-lock.json` agora usa `https://registry.npmjs.org/`.
- Adicionados arquivos `.npmrc` no root, frontend e backend forçando o registry público do npm.
- Nenhuma funcionalidade foi removida.

## Resultado esperado

Após subir este ZIP no GitHub, a Vercel deve conseguir instalar as dependências e continuar o build normalmente.
