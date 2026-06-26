const { PrismaClient } = require('@prisma/client');
const { gerarCobrancaPix } = require('../services/interService');
const prisma = new PrismaClient();

async function criarPedido(req, res) {
  try {
    const { nome, email, whatsapp, tipoAgente, metodoPagamento } = req.body;

    if (!nome || !email || !tipoAgente || !metodoPagamento) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    }

    const precos = {
      // simples → R$50/mês
      atendimento: 50,
      calendario: 50,
      suporte: 50,
      // complexo → R$65/mês
      agendamento: 65,
      vendas: 65,
      emails: 65,
      manutencao: 65,
    };

    const valor = precos[tipoAgente];
    if (!valor) return res.status(400).json({ erro: 'Tipo de agente inválido.' });

    // Cria ou busca cliente
    let cliente = await prisma.cliente.findFirst({ where: { email } });
    if (!cliente) {
      cliente = await prisma.cliente.create({ data: { nome, email, whatsapp } });
    }

    // Cria pedido
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: cliente.id,
        tipoAgente,
        valor,
        metodoPagamento,
        status: 'PENDENTE',
      },
    });

    // Gera cobrança PIX
    if (metodoPagamento === 'pix') {
      const cobranca = await gerarCobrancaPix({ pedidoId: pedido.id, valor, email, nome });
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: { txId: cobranca.txid },
      });
      return res.json({
        pedidoId: pedido.id,
        pixCopiaECola: cobranca.pixCopiaECola,
        qrCode: cobranca.qrCode,
        valor,
      });
    }

    return res.json({ pedidoId: pedido.id, valor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function buscarPedido(req, res) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: req.params.id },
      include: { agente: true },
    });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { criarPedido, buscarPedido };
