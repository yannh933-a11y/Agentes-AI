const express = require('express');
const router = express.Router();
const { processarMensagemDoSite, buscarRespostas, boasVindas } = require('../services/telegramBotService');

// POST /api/suporte/mensagem — site envia mensagem
router.post('/mensagem', async (req, res) => {
  try {
    const { sessionId, texto } = req.body;
    if (!sessionId || !texto) return res.status(400).json({ erro: 'sessionId e texto são obrigatórios.' });
    await processarMensagemDoSite({ sessionId, texto });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// GET /api/suporte/respostas/:sessionId — site busca respostas do bot
router.get('/respostas/:sessionId', (req, res) => {
  const respostas = buscarRespostas(req.params.sessionId);
  res.json({ respostas });
});

// GET /api/suporte/boas-vindas — mensagem inicial
router.get('/boas-vindas', (req, res) => {
  res.json({ texto: boasVindas() });
});

module.exports = router;
