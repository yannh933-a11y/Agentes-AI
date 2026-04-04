import Link from 'next/link';

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <span className="text-6xl">🎉</span>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">Pagamento confirmado!</h1>
        <p className="text-slate-400 text-lg mb-8">
          Seu agente está sendo criado. Em poucos minutos você receberá um email com todas as instruções de ativação.
        </p>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-left mb-8">
          <h2 className="text-white font-semibold mb-3">O que acontece agora:</h2>
          <ol className="space-y-2 text-slate-400">
            <li>✅ Pagamento confirmado</li>
            <li>⚙️ Criando seu agente automaticamente...</li>
            <li>📧 Email com credenciais sendo enviado</li>
            <li>🤖 Ative no Telegram com o código que você receberá</li>
          </ol>
        </div>
        <Link href="/" className="text-brand-blue hover:underline">← Voltar para o início</Link>
      </div>
    </main>
  );
}
