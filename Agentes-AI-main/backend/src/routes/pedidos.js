const express = require('express');
const router = express.Router();
const { criarPedido, buscarPedido } = require('../controllers/pedidoController');

// POST /api/pedidos → cria novo pedido e gera cobrança
router.post('/', criarPedido);

// GET /api/pedidos/:id → consulta status do pedido
router.get('/:id', buscarPedido);

module.exports = router;
