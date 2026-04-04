const { PrismaClient } = require('@prisma/client');
const { criarAgente } = require('../services/agenteService');
const { enviarEmailCredenciais } = require('../services/emailService');
const prisma = new PrismaClient();

async function webhookInter(req, res) {
  try {
    const payload = JSON.parse(req.body.toString());

    // Inter envia evento de PIX recebido
    const txId = payload?.pix?.[0]?.txid || payload?.txid;
    if (!txId) return res.status(400).json({ erro: 'txId não encontrado.' });

    const pedido = await prisma.pedido.findUnique({
      where: { txId },
      include: { cliente: true },
    });

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    if (pedido.status === 'APROVADO') return res.json({ ok: true }); // já processado

    // Aprova o pedido
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { status: 'APROVADO' },
    });

    // Cria o agente automaticamente
    const credenciais = await criarAgente({
      pedidoId: pedido.id,
      tipoAgente: pedido.tipoAgente,
      nomeCliente: pedido.cliente.nome,
      emailCliente: pedido.cliente.email,
    });

    // Envia email com credenciais
    await enviarEmailCredenciais({
      email: pedido.cliente.email,
      nome: pedido.cliente.nome,
      tipoAgente: pedido.tipoAgente,
      credenciais,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook erro:', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { webhookInter };
