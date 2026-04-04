export default function PrivacidadePage() {
  return (
    <main className="pt-28 pb-24 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Política de Privacidade</h1>
        <p className="text-slate-500 text-sm mb-10">Última atualização: abril de 2026</p>

        {[
          ['1. Quais dados coletamos', 'Coletamos: nome completo, endereço de email, número de WhatsApp (opcional), tipo de agente contratado, data e hora da contratação, e dados de pagamento PIX (apenas confirmação — não armazenamos chaves PIX).'],
          ['2. Como usamos seus dados', 'Seus dados são usados para: criar e entregar seu agente de IA, enviar emails transacionais (confirmação, credenciais, suporte), melhorar nossos serviços, e cumprir obrigações legais.'],
          ['3. Compartilhamento de dados', 'Não vendemos seus dados. Compartilhamos apenas com: processadores de pagamento (Inter Bank), serviço de email (Resend), e autoridades quando exigido por lei.'],
          ['4. Armazenamento e segurança', 'Seus dados são armazenados em servidores seguros com criptografia. Mantemos seus dados pelo período de vigência do contrato mais 5 anos conforme legislação fiscal brasileira.'],
          ['5. Seus direitos (LGPD)', 'Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados, corrigir dados incorretos, solicitar exclusão, revogar consentimento, e portabilidade dos dados. Para exercer esses direitos, entre em contato pelo suporte.'],
          ['6. Cookies', 'Utilizamos apenas cookies essenciais para funcionamento do site (sessão e preferências). Não utilizamos cookies de rastreamento ou publicidade de terceiros.'],
          ['7. Emails automáticos', 'Ao se cadastrar ou comprar, você recebe emails automáticos relacionados ao seu pedido. Você pode cancelar emails de marketing a qualquer momento clicando em "descadastrar" no rodapé do email.'],
          ['8. Contato do Encarregado (DPO)', 'Para questões de privacidade, entre em contato: privacidade@agentesia.com.br'],
          ['9. Alterações nesta política', 'Podemos atualizar esta política. A data no topo desta página indica a versão atual. Mudanças significativas serão comunicadas por email.'],
        ].map(([titulo, texto]) => (
          <div key={titulo} className="mb-8">
            <h2 className="text-white font-bold text-lg mb-2">{titulo}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{texto}</p>
          </div>
        ))}

        <div className="card rounded-2xl p-6 mt-10">
          <p className="text-slate-400 text-sm">
            Dúvidas sobre privacidade?{' '}
            <a href="/suporte" className="text-red-400 hover:text-red-300 no-underline">
              Fale com nosso suporte →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
