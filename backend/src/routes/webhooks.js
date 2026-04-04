const express = require('express');
const router = express.Router();
const { webhookInter } = require('../controllers/webhookController');

// POST /webhook/inter → confirmação de pagamento PIX do Inter
router.post('/inter', webhookInter);

module.exports = router;
