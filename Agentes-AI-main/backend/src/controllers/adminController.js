const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listarPedidos(req, res) {
  const pedidos = await prisma.pedido.findMany({
    include: { cliente: true, agente: true },
    orderBy: { criadoEm: 'desc' },
  });
  res.json(pedidos);
}

async function detalhesPedido(req, res) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: req.params.id },
    include: { cliente: true, agente: true },
  });
  if (!pedido) return res.status(404).json({ erro: 'Não encontrado.' });
  res.json(pedido);
}

module.exports = { listarPedidos, detalhesPedido };
