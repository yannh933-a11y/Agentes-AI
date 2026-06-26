const axios = require('axios');
const fs = require('fs');
const https = require('https');

// Autenticação OAuth2 com certificado digital do Inter
async function getTokenInter() {
  const cert = fs.readFileSync(process.env.INTER_CERT_PATH);
  const key = fs.readFileSync(process.env.INTER_KEY_PATH);

  const agent = new https.Agent({ cert, key });

  const params = new URLSearchParams();
  params.append('client_id', process.env.INTER_CLIENT_ID);
  params.append('client_secret', process.env.INTER_CLIENT_SECRET);
  params.append('scope', 'cob.write cob.read');
  params.append('grant_type', 'client_credentials');

  const res = await axios.post(
    'https://cdpj.partners.bancointer.com.br/oauth/v2/token',
    params,
    { httpsAgent: agent }
  );

  return { token: res.data.access_token, agent };
}

async function gerarCobrancaPix({ pedidoId, valor, email, nome }) {
  const { token, agent } = await getTokenInter();
  const txid = pedidoId.replace(/-/g, '').slice(0, 35);

  const payload = {
    calendario: { expiracao: 3600 },
    devedor: { cpf: '00000000000', nome }, // será preenchido com CPF real depois
    valor: { original: valor.toFixed(2) },
    chave: process.env.INTER_PIX_KEY,
    infoAdicionais: [{ nome: 'Pedido', valor: pedidoId }],
  };

  const res = await axios.put(
    `https://cdpj.partners.bancointer.com.br/pix/v2/cob/${txid}`,
    payload,
    {
      httpsAgent: agent,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Busca QR Code
  const qrRes = await axios.get(
    `https://cdpj.partners.bancointer.com.br/pix/v2/cob/${txid}/qrcode`,
    {
      httpsAgent: agent,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    txid,
    pixCopiaECola: qrRes.data.pixCopiaECola,
    qrCode: qrRes.data.imagemQrcode,
  };
}

module.exports = { gerarCobrancaPix };
