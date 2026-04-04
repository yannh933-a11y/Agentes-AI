const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const nomesAgentes = {
  vendas: 'Agente de Vendas',
  atendimento: 'Agente de Atendimento',
  agendamento: 'Agente de Agendamento',
  calendario: 'Agente de Calendário',
  manutencao: 'Agente de Manutenção',
  suporte: 'Agente de Suporte',
  emails: 'Agente de Emails',
};

async function enviarEmailCredenciais({ email, nome, tipoAgente, credenciais }) {
  const nomeAgente = nomesAgentes[tipoAgente] || tipoAgente;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `✅ Seu ${nomeAgente} está pronto!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9; padding: 40px; border-radius: 12px;">
        <h1 style="color: #38bdf8;">✅ Seu agente está pronto, ${nome}!</h1>
        <p style="font-size: 16px;">Seu <strong>${nomeAgente}</strong> foi criado com sucesso. Siga os passos abaixo para ativá-lo no Telegram:</p>
        
        <div style="background: #1e293b; padding: 24px; border-radius: 8px; margin: 24px 0;">
          <h2 style="color: #38bdf8; margin-top: 0;">📋 Suas Credenciais</h2>
          <p><strong>Nome do agente:</strong> ${credenciais.nomeAgente}</p>
          <p><strong>Código de pareamento:</strong> <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px; font-size: 18px; color: #34d399;">${credenciais.codigoPareamento}</code></p>
        </div>

        <div style="background: #1e293b; padding: 24px; border-radius: 8px; margin: 24px 0;">
          <h2 style="color: #38bdf8; margin-top: 0;">🚀 Como ativar</h2>
          <ol style="line-height: 2;">
            <li>Abra o Telegram</li>
            <li>Procure pelo bot do seu agente (você receberá o nome em breve)</li>
            <li>Envie qualquer mensagem para o bot</li>
            <li>Quando pedir o código de pareamento, insira: <strong>${credenciais.codigoPareamento}</strong></li>
            <li>Pronto! Seu agente está ativo 🎉</li>
          </ol>
        </div>

        <p style="color: #94a3b8; font-size: 14px;">Dúvidas? Responda este email que te ajudamos.</p>
      </div>
    `,
  });
}

module.exports = { enviarEmailCredenciais };
