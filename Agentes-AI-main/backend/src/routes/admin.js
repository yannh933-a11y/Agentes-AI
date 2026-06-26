const express = require('express');
const router = express.Router();
const { listarPedidos, detalhesPedido } = require('../controllers/adminController');
const { authAdmin } = require('../middleware/auth');

router.use(authAdmin);

router.get('/pedidos', listarPedidos);
router.get('/pedidos/:id', detalhesPedido);

module.exports = router;
