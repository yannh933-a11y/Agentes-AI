// API Route para envio de emails automáticos via Resend
// Tipos: 'precadastro' | 'compra' | 'followup'

const SITE = 'https://agentes-ai-two.vercel.app';
const FROM = 'AgentesIA <onboarding@resend.dev>';

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  return res.ok;
}

const base = (content) => `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#f1f5f9;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
  <div style="text-align:center;margin-bottom:28px">
    <div style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);width:48px;height:48px;border-radius:12px;font-size:22px;line-height:48px">🤖</div>
    <h2 style="color:#fff;margin:12px 0 0;font-size:22px">AgentesIA</h2>
  </div>
  ${content}
  <p style="color:#475569;font-size:12px;text-align:center;margin-top:32px">
    Dúvidas? <a href="${SITE}/suporte" style="color:#ef4444">Suporte 24h</a>
  </p>
</div>`;

const templates = {
  precadastro: ({ nome, interesse }) => ({
    subject: '🎉 Pré-cadastro confirmado — AgentesIA',
    html: base(`
      <h3 style="color:#fff;margin:0 0 12px">Olá, ${nome}! 🎉</h3>
      <p style="color:#94a3b8;line-height:1.7">Seu pré-cadastro foi registrado com sucesso. Quando estiver pronto, a contratação leva menos de 5 minutos!</p>
      ${interesse ? `<p style="color:#94a3b8;line-height:1.7;margin-top:8px">Você demonstrou interesse em: <strong style="color:#fff">${interesse}</strong></p>` : ''}
      <div style="text-align:center;margin:28px 0">
        <a href="${SITE}/agentes" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px">Ver agentes →</a>
      </div>`),
  }),

  compra: ({ nome, agente, codigo, linkBot }) => ({
    subject: '✅ Pagamento confirmado — seu agente está pronto!',
    html: base(`
      <h3 style="color:#fff;margin:0 0 12px">Pagamento confirmado! ✅</h3>
      <p style="color:#94a3b8;line-height:1.7">Obrigado, <strong style="color:#fff">${nome}</strong>! Seu <strong style="color:#fff">${agente || 'agente'}</strong> já está pronto para ativar.</p>
      ${codigo ? `
      <div style="background:#0a0a14;border:2px solid rgba(220,38,38,0.4);border-radius:12px;padding:20px;margin:20px 0;text-align:center">
        <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Seu código de ativação</p>
        <p style="color:#fff;font-size:32px;font-weight:900;letter-spacing:6px;margin:0;font-family:monospace">${codigo}</p>
      </div>
      ` : ''}
      <div style="background:#0a0a14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin:20px 0">
        <p style="color:#fca5a5;font-size:14px;margin:0 0 12px"><strong>Como ativar em 3 passos:</strong></p>
        <ol style="color:#94a3b8;font-size:14px;line-height:2.2;margin:0;padding-left:20px">
          <li>Abra o Telegram e acesse o link do seu bot abaixo</li>
          <li>Envie o código acima quando o bot pedir</li>
          <li>Configure nome, horários e serviços — pronto! 🎉</li>
        </ol>
      </div>
      ${linkBot ? `
      <div style="text-align:center;margin:24px 0">
        <a href="${linkBot}" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:700;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:15px">🤖 Abrir meu bot no Telegram →</a>
      </div>
      ` : ''}`),
  }),

  followup: ({ nome }) => ({
    subject: `Tudo bem, ${nome.split(' ')[0]}? Vimos que você não finalizou`,
    html: base(`
      <h3 style="color:#fff;margin:0 0 12px">Olá, ${nome.split(' ')[0]}! 👋</h3>
      <p style="color:#94a3b8;line-height:1.7">Notamos que você preencheu seus dados mas não finalizou a contratação. Ficou alguma dúvida?</p>
      <p style="color:#94a3b8;line-height:1.7;margin-top:8px">Nosso suporte resolve na hora — seja sobre preço, funcionalidades ou como funciona.</p>
      <div style="display:flex;gap:12px;justify-content:center;margin:28px 0;flex-wrap:wrap">
        <a href="${SITE}/suporte" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px">💬 Falar com suporte</a>
        <a href="${SITE}/agentes" style="background:transparent;color:#94a3b8;font-weight:600;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;border:1px solid rgba(255,255,255,0.1)">Ver agentes</a>
      </div>`),
  }),
};

export async function POST(req) {
  try {
    const { tipo, email, nome, agente, interesse } = await req.json();

    if (!tipo || !email || !nome) {
      return Response.json({ erro: 'tipo, email e nome são obrigatórios' }, { status: 400 });
    }

    const tpl = templates[tipo];
    if (!tpl) return Response.json({ erro: 'tipo inválido' }, { status: 400 });

    const { subject, html } = tpl({ nome, agente, interesse });
    const ok = await sendEmail({ to: email, subject, html });

    return Response.json({ ok });
  } catch (e) {
    return Response.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
