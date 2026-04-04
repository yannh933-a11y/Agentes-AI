import Link from 'next/link';

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-lg text-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-5xl">🎉</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Pagamento confirmado!</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Seu agente está sendo criado agora. Em poucos minutos você receberá um email com todas as instruções de ativação.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 text-left mb-10">
          <h2 className="text-white font-semibold mb-5">O que acontece agora:</h2>
          <div className="space-y-4">
            {[
              { icon: '✅', text: 'Pagamento confirmado', done: true },
              { icon: '⚙️', text: 'Criando seu agente automaticamente...', done: false },
              { icon: '📧', text: 'Email com credenciais sendo enviado', done: false },
              { icon: '🤖', text: 'Ative no Telegram com o código recebido', done: false },
            ].map((item) => (
              <div key={item.text} className={`flex items-center gap-4 ${item.done ? 'text-white' : 'text-slate-400'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <Link href="/" className="text-violet-400 hover:text-violet-300 transition text-sm">
          ← Voltar para o início
        </Link>
      </div>
    </main>
  );
}
