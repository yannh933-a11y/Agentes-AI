const express = require('express');
const router = express.Router();
const { criarPreCadastro, verificarAbandonos } = require('../controllers/preCadastroController');

router.post('/', criarPreCadastro);
router.post('/verificar-abandonos', verificarAbandonos); // Chamado por cron ou manualmente

module.exports = router;
