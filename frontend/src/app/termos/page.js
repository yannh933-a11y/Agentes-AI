export default function TermosPage() {
  return (
    <main className="pt-28 pb-24 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Termos de Uso</h1>
        <p className="text-slate-500 text-sm mb-10">Última atualização: abril de 2026</p>

        {[
          ['1. Aceitação dos Termos', 'Ao acessar ou utilizar os serviços da AgentesIA, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize nossos serviços.'],
          ['2. Descrição do Serviço', 'A AgentesIA fornece agentes de inteligência artificial via Telegram para automação de atendimento, vendas, agendamento e suporte empresarial. Os agentes são entregues digitalmente após confirmação do pagamento.'],
          ['3. Cadastro e Responsabilidade', 'Você é responsável pelas informações fornecidas no cadastro. Dados falsos podem resultar no cancelamento imediato do serviço sem reembolso.'],
          ['4. Pagamento e Cobrança', 'O pagamento é realizado via PIX. Após a confirmação, o agente é ativado em até 5 minutos. A mensalidade é cobrada todo mês na data de contratação. O não pagamento resulta na suspensão do agente.'],
          ['5. Cancelamento', 'Você pode cancelar a qualquer momento enviando email para suporte@agentesia.com.br. O acesso ao agente permanece ativo até o fim do período pago. Não há reembolso proporcional.'],
          ['6. Uso Aceitável', 'É proibido utilizar os agentes para spam, fraudes, conteúdo ilegal, ou qualquer atividade que viole leis brasileiras ou os termos do Telegram. Violações resultam no cancelamento imediato sem reembolso.'],
          ['7. Limitação de Responsabilidade', 'A AgentesIA não se responsabiliza por perdas indiretas decorrentes do uso ou não disponibilidade dos agentes. Nossa responsabilidade máxima é limitada ao valor pago no último mês.'],
          ['8. Alterações nos Termos', 'Podemos atualizar estes termos a qualquer momento. Notificaremos por email com 15 dias de antecedência. O uso continuado após as mudanças implica aceitação.'],
          ['9. Legislação Aplicável', 'Estes termos são regidos pelas leis brasileiras. Disputas serão resolvidas no foro da comarca de São Paulo - SP.'],
        ].map(([titulo, texto]) => (
          <div key={titulo} className="mb-8">
            <h2 className="text-white font-bold text-lg mb-2">{titulo}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{texto}</p>
          </div>
        ))}

        <div className="card rounded-2xl p-6 mt-10">
          <p className="text-slate-400 text-sm">
            Dúvidas sobre os termos?{' '}
            <a href="/suporte" className="text-red-400 hover:text-red-300 no-underline">
              Fale com nosso suporte →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
