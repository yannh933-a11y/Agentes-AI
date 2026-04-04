import Link from 'next/link';
import { agentes } from '../../lib/agentes';

export default function AgentesPage() {
  return (
    <main className="pt-28 pb-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-red-400 text-xs font-bold uppercase tracking-[4px]">Catálogo completo</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-5 tracking-tight">Nossos Agentes</h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Escolha o agente ideal para o seu negócio e tenha ele funcionando em minutos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {agentes.map((agente) => (
            <div
              key={agente.slug}
              className="card rounded-2xl p-7 flex flex-col group"
            >
              <div className="w-14 h-14 bg-red-500/[0.08] rounded-2xl flex items-center justify-center text-3xl mb-6">
                {agente.emoji}
              </div>
              <h2 className="text-white text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">{agente.nome}</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">{agente.descricao}</p>

              <ul className="space-y-2.5 mb-8">
                {agente.funcionalidades.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-400 text-sm">
                    <span className="text-red-400 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/[0.05]">
                <div>
                  <p className="text-slate-600 text-xs">Mensalidade</p>
                  <p className="text-white font-bold text-xl">
                    R$ {agente.preco}<span className="text-sm text-slate-500">/mês</span>
                  </p>
                </div>
                <Link
                  href={`/agentes/${agente.slug}`}
                  className="btn-primary font-semibold px-5 py-2.5 rounded-full text-sm no-underline"
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
