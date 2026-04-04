import Link from 'next/link';
import { agentes } from '../../../lib/agentes';
import { notFound } from 'next/navigation';

export default function AgenteDetalhe({ params }) {
  const agente = agentes.find((a) => a.slug === params.slug);
  if (!agente) return notFound();

  const outros = agentes.filter((a) => a.slug !== agente.slug).slice(0, 3);

  return (
    <main className="pt-28 pb-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <Link href="/agentes" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition mb-10 no-underline">
          ← Voltar para agentes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card rounded-2xl p-7 sm:p-9">
              <div className="w-16 h-16 bg-red-500/[0.08] rounded-2xl flex items-center justify-center text-4xl mb-6">
                {agente.emoji}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">{agente.nome}</h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">{agente.descricao}</p>
            </div>

            <div className="card rounded-2xl p-7 sm:p-9">
              <h2 className="text-white font-bold text-xl mb-6">O que este agente faz</h2>
              <ul className="space-y-4">
                {agente.funcionalidades.map((f) => (
                  <li key={f} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-red-500/[0.15] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs">✓</span>
                    </div>
                    <span className="text-slate-300 text-sm sm:text-base">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card de compra */}
          <div className="lg:col-span-1">
            <div className="card border-red-500/[0.15] rounded-2xl p-7 sticky top-24">
              <p className="text-slate-400 text-sm mb-1">Mensalidade</p>
              <p className="text-5xl font-black text-white mb-1">
                R$ {agente.preco}
              </p>
              <p className="text-slate-500 text-sm mb-8">/mês · cancele quando quiser</p>

              <Link
                href={`/checkout?agente=${agente.slug}`}
                className="btn-primary block w-full font-bold py-4 rounded-full text-center text-lg no-underline mb-4"
              >
                Contratar agora →
              </Link>

              <p className="text-slate-500 text-xs text-center mb-6">🔒 Pagamento 100% seguro via PIX</p>

              <ul className="space-y-3">
                {[
                  'Ativação em menos de 5 minutos',
                  'Disponível 24h no Telegram',
                  'Suporte por email incluso',
                  'Cancele quando quiser',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-400 text-sm">
                    <span className="text-red-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Outros agentes */}
        {outros.length > 0 && (
          <div className="mt-16">
            <h2 className="text-white font-bold text-2xl mb-6">Outros agentes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {outros.map((a) => (
                <Link
                  key={a.slug}
                  href={`/agentes/${a.slug}`}
                  className="card rounded-xl p-6 no-underline group"
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <p className="text-white font-semibold mt-3 mb-1 group-hover:text-red-400 transition-colors">{a.nome}</p>
                  <p className="text-red-400 text-sm font-bold">R$ {a.preco}/mês</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
