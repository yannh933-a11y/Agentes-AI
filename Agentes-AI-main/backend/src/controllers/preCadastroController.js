const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const BASE = process.env.FRONTEND_URL || 'https://agentes-ai-two.vercel.app';
const FROM = process.env.EMAIL_FROM || 'AgentesIA <noreply@agentesia.com.br>';

// ─── Email: pré-cadastro (só salvou dados, não comprou) ───────────────
async function enviarEmailPreCadastro({ nome, email, interesse }) {
  const nomeAgente = interesse ? `o ${interesse}` : 'um dos nossos agentes';
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '🎉 Obrigado pelo seu interesse na AgentesIA!',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#f1f5f9;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);width:56px;height:56px;border-radius:14px;font-size:26px;line-height:56px;text-align:center">🤖</div>
          <h1 style="color:#fff;font-size:24px;margin:16px 0 4px">Obrigado, ${nome}! 🎉</h1>
          <p style="color:#94a3b8;font-size:15px">Seu pré-cadastro foi registrado com sucesso.</p>
        </div>
        <div style="background:#0a0a14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px">
          <p style="color:#e2e8f0;font-size:15px;line-height:1.7">Ficamos felizes em saber que você tem interesse em ${nomeAgente}!</p>
          <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-top:12px">Quando estiver pronto para contratar, é só acessar o site — o processo leva menos de 5 minutos e o agente é ativado na hora. ⚡</p>
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="${BASE}/agentes" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:700;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:15px">Ver agentes disponíveis →</a>
        </div>
        <p style="color:#475569;font-size:12px;text-align:center">Dúvidas? Acesse nosso <a href="${BASE}/suporte" style="color:#ef4444">suporte 24h</a> ou responda este email.</p>
      </div>
    `,
  });
}

// ─── Email: comprou — agradecimento por adquirir ─────────────────────
async function enviarEmailCompra({ nome, email, tipoAgente }) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '✅ Pagamento confirmado — seu agente está sendo ativado!',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#f1f5f9;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-block;background:linear-gradient(135deg,#16a34a,#166534);width:56px;height:56px;border-radius:14px;font-size:26px;line-height:56px;text-align:center">✅</div>
          <h1 style="color:#fff;font-size:24px;margin:16px 0 4px">Pagamento confirmado!</h1>
          <p style="color:#94a3b8;font-size:15px">Obrigado por adquirir seu agente, ${nome}!</p>
        </div>
        <div style="background:#0a0a14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px">
          <p style="color:#e2e8f0;font-size:15px;line-height:1.7">Seu <strong style="color:#fff">${tipoAgente}</strong> está sendo ativado agora. Em breve você receberá outro email com as credenciais para acessar seu agente no Telegram.</p>
          <p style="color:#94a3b8;font-size:14px;margin-top:12px">⏱️ Prazo: até <strong style="color:#fff">5 minutos</strong></p>
        </div>
        <div style="background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.15);border-radius:12px;padding:20px;margin-bottom:24px">
          <p style="color:#fca5a5;font-size:14px;margin:0"><strong>O que acontece agora?</strong></p>
          <ol style="color:#94a3b8;font-size:14px;line-height:2;margin-top:8px;padding-left:20px">
            <li>Você receberá as credenciais por email</li>
            <li>Acesse o Telegram e encontre seu bot</li>
            <li>Insira o código de pareamento</li>
            <li>Seu agente já está respondendo! 🎉</li>
          </ol>
        </div>
        <p style="color:#475569;font-size:12px;text-align:center">Precisa de ajuda? <a href="${BASE}/suporte" style="color:#ef4444">Suporte 24h disponível</a></p>
      </div>
    `,
  });
}

// ─── Email: salvou dados mas não comprou ─────────────────────────────
async function enviarEmailAbandonou({ nome, email, interesse }) {
  const nomeAgente = interesse ? `o ${interesse}` : 'um agente';
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '🤔 Ficou com alguma dúvida, ' + nome.split(' ')[0] + '?',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#f1f5f9;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#5b21b6);width:56px;height:56px;border-radius:14px;font-size:26px;line-height:56px;text-align:center">💬</div>
          <h1 style="color:#fff;font-size:22px;margin:16px 0 4px">Olá ${nome.split(' ')[0]}, tudo certo?</h1>
          <p style="color:#94a3b8;font-size:15px">Vimos que você se interessou por ${nomeAgente}.</p>
        </div>
        <div style="background:#0a0a14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px">
          <p style="color:#e2e8f0;font-size:15px;line-height:1.7">Ficamos na dúvida se algo te impediu de finalizar a contratação. Podemos te ajudar!</p>
          <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-top:12px">Seja dúvida sobre preço, funcionalidades ou como funciona — nosso suporte automático resolve na hora! ⚡</p>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;margin:28px 0;flex-wrap:wrap">
          <a href="${BASE}/suporte" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px">💬 Falar com suporte</a>
          <a href="${BASE}/agentes" style="display:inline-block;background:transparent;color:#94a3b8;font-weight:600;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;border:1px solid rgba(255,255,255,0.1)">Ver agentes →</a>
        </div>
        <p style="color:#475569;font-size:12px;text-align:center">Responda este email se preferir conversar por aqui. Estamos sempre disponíveis!</p>
      </div>
    `,
  });
}

// ─── Controller: criar pré-cadastro ──────────────────────────────────
async function criarPreCadastro(req, res) {
  try {
    const { nome, email, whatsapp, interesse } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Nome e email são obrigatórios.' });

    // Upsert (evita duplicados)
    const precadastro = await prisma.preCadastro.upsert({
      where: { email },
      update: { nome, whatsapp, interesse },
      create: { nome, email, whatsapp, interesse },
    });

    // Envia email de pré-cadastro (uma vez apenas)
    if (!precadastro.emailEnviado) {
      try {
        await enviarEmailPreCadastro({ nome, email, interesse });
        await prisma.preCadastro.update({ where: { email }, data: { emailEnviado: true } });
      } catch (e) {
        console.error('Erro ao enviar email pré-cadastro:', e.message);
      }
    }

    return res.json({ ok: true, id: precadastro.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

// ─── Job: verificar quem salvou dados e não comprou (chamado por cron) ─
async function verificarAbandonos(req, res) {
  try {
    // Pré-cadastros com mais de 30 min sem pedido associado
    const limite = new Date(Date.now() - 30 * 60 * 1000);
    const precadastros = await prisma.preCadastro.findMany({
      where: { criadoEm: { lt: limite }, emailEnviado: true },
    });

    let enviados = 0;
    for (const pc of precadastros) {
      // Verifica se tem pedido aprovado com esse email
      const cliente = await prisma.cliente.findFirst({ where: { email: pc.email } });
      if (cliente) {
        const pedidoAprovado = await prisma.pedido.findFirst({
          where: { clienteId: cliente.id, status: 'APROVADO' },
        });
        if (pedidoAprovado) continue; // Já comprou, não manda email
      }

      // Não comprou — manda email de "o que aconteceu?"
      try {
        await enviarEmailAbandonou({ nome: pc.nome, email: pc.email, interesse: pc.interesse });
        await prisma.preCadastro.delete({ where: { email: pc.email } }); // Remove para não reenviar
        enviados++;
        await new Promise(r => setTimeout(r, 1000)); // Evita rate limit do Resend
      } catch (e) {
        console.error('Erro email abandono:', e.message);
      }
    }

    res.json({ ok: true, enviados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { criarPreCadastro, verificarAbandonos, enviarEmailCompra };
