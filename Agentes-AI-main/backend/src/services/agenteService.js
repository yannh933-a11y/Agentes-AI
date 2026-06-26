const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const templates = require('../templates');
const prisma = new PrismaClient();

const OPENCLAW_DIR = process.env.OPENCLAW_STATE_DIR || '/data/.openclaw';

async function criarAgente({ pedidoId, tipoAgente, nomeCliente, emailCliente }) {
  const slugCliente = emailCliente.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
  const nomeAgente = `${tipoAgente}-${slugCliente}-${uuidv4().slice(0, 6)}`;
  const workspace = `${OPENCLAW_DIR}/workspace-${nomeAgente}`;

  // 1. Criar agente no OpenClaw
  execSync(`openclaw agents add ${nomeAgente} --non-interactive --workspace ${workspace}`, {
    stdio: 'pipe',
  });

  // 2. Instalar arquivos do template
  const template = templates[tipoAgente];
  fs.writeFileSync(path.join(workspace, 'SOUL.md'), template.soul(nomeCliente));
  fs.writeFileSync(path.join(workspace, 'AGENTS.md'), template.agents);
  fs.writeFileSync(path.join(workspace, 'USER.md'), template.user(nomeCliente, emailCliente));

  // 3. Criar bot no Telegram via BotFather (manual por enquanto)
  // Token será adicionado pelo admin após criação do bot
  const tokenPlaceholder = `AGUARDANDO_TOKEN_${uuidv4().slice(0, 8).toUpperCase()}`;
  const codigoPareamento = uuidv4().slice(0, 8).toUpperCase();

  // 4. Salvar no banco
  await prisma.agenteEntregue.create({
    data: {
      pedidoId,
      nomeAgente,
      tokenTelegram: tokenPlaceholder,
      codigoPareamento,
      workspace,
    },
  });

  return {
    nomeAgente,
    tokenTelegram: tokenPlaceholder,
    codigoPareamento,
    workspace,
  };
}

module.exports = { criarAgente };
