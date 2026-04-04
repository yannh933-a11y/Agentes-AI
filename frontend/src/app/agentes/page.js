import Link from 'next/link';
import { agentes } from '../../lib/agentes';

export default function AgentesPage() {
  return (
    <main className="pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Catálogo completo</span>
          <h1 className="text-5xl font-bold text-white mt-3 mb-4">Nossos Agentes</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Escolha o agente ideal para o seu negócio e tenha ele funcionando em minutos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentes.map((agente) => (
            <div
              key={agente.slug}
              className="group bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col hover:border-violet-500/40 hover:bg-white/[0.08] transition"
            >
              <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6">
                {agente.emoji}
              </div>
              <h2 className="text-white text-xl font-bold mb-3">{agente.nome}</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">{agente.descricao}</p>

              <ul className="space-y-2 mb-8">
                {agente.funcionalidades.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="text-violet-400 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                <div>
                  <p className="text-slate-500 text-xs">Mensalidade</p>
                  <p className="text-violet-400 font-bold text-xl">
                    R$ {agente.preco}<span className="text-sm text-slate-500">/mês</span>
                  </p>
                </div>
                <Link
                  href={`/agentes/${agente.slug}`}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition"
                >
                  Contratar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
