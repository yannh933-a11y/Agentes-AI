import Link from 'next/link';

export const metadata = { title: 'Obrigado | Agentes AI' };

export default function ObrigadoPage({ searchParams }) {
  const status = searchParams?.status || 'recebido';
  const isPending = status === 'pendente';
  const isApproved = status === 'aprovado' || status === 'approved';

  return (
    <main className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="max-w-2xl text-center">
        <div className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full ${isApproved ? 'bg-emerald-500/10 text-emerald-200' : 'bg-red-500/10 text-red-200'}`}>
          <span className="text-5xl">{isApproved ? '✓' : '→'}</span>
        </div>
        <h1 className="mb-4 text-4xl font-black text-white">{isApproved ? 'Pagamento confirmado.' : isPending ? 'Pagamento pendente.' : 'Solicitação recebida.'}</h1>
        <p className="mb-10 text-lg leading-relaxed text-slate-400">
          {isApproved
            ? 'A contratação foi confirmada. O próximo passo é iniciar implantação, base de conhecimento e configuração do agente exclusivo.'
            : 'Recebemos o retorno do checkout. Se o pagamento foi por Pix ou ficou pendente, acompanhe a confirmação pelo atendimento comercial.'}
        </p>

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-7 text-left">
          <h2 className="mb-5 font-black text-white">Próximas etapas:</h2>
          <div className="space-y-4">
            {[
              { icon: '01', text: 'Conferência do pagamento ou comprovante.' },
              { icon: '02', text: 'Criação do registro da empresa e do agente exclusivo.' },
              { icon: '03', text: 'Coleta de documentos, regras e tom de voz.' },
              { icon: '04', text: 'Testes assistidos antes de liberar o agente em produção.' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4 text-slate-400">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-xs font-black text-red-200">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-primary rounded-full px-6 py-3 text-sm font-black no-underline">Ir para área da empresa</Link>
          <Link href="/" className="btn-outline rounded-full px-6 py-3 text-sm font-black no-underline">Voltar para o início</Link>
        </div>
      </div>
    </main>
  );
}
