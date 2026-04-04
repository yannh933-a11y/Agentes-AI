import Link from 'next/link';
import { agentes } from '../../lib/agentes';

export default function AgentesPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-brand-blue text-sm hover:underline">← Voltar</Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-3">Nossos Agentes</h1>
        <p className="text-slate-400 text-lg mb-12">Escolha o agente ideal para o seu negócio.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentes.map((agente) => (
            <div key={agente.slug} className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
              <span className="text-5xl mb-4">{agente.emoji}</span>
              <h2 className="text-white text-xl font-bold mb-2">{agente.nome}</h2>
              <p className="text-slate-400 flex-1 mb-6">{agente.descricao}</p>
              <div className="flex items-center justify-between">
                <span className="text-brand-green font-bold text-xl">R$ {agente.preco}/mês</span>
                <Link
                  href={`/agentes/${agente.slug}`}
                  className="bg-brand-blue text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-sky-400 transition text-sm"
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
