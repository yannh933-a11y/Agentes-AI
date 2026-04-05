require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pedidoRoutes = require('./routes/pedidos');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const preCadastroRoutes = require('./routes/preCadastro');
const suporteRoutes = require('./routes/suporte');

const app = express();

// Webhook do Inter precisa do body raw
app.use('/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rotas
app.use('/api/pedidos', pedidoRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/precadastro', preCadastroRoutes);
app.use('/api/suporte', suporteRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
