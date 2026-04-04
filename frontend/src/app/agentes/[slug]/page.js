import Link from 'next/link';
import { agentes } from '../../../lib/agentes';
import { notFound } from 'next/navigation';

export default function AgenteDetalhe({ params }) {
  const agente = agentes.find((a) => a.slug === params.slug);
  if (!agente) return notFound();

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/agentes" className="text-brand-blue text-sm hover:underline">← Ver todos os agentes</Link>

        <div className="mt-8 bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <span className="text-6xl">{agente.emoji}</span>
          <h1 className="text-4xl font-bold text-white mt-4 mb-3">{agente.nome}</h1>
          <p className="text-slate-400 text-lg mb-8">{agente.descricao}</p>

          <h2 className="text-white font-semibold text-lg mb-4">O que este agente faz:</h2>
          <ul className="space-y-3 mb-10">
            {agente.funcionalidades.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300">
                <span className="text-brand-green text-xl">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-slate-700 pt-6">
            <div>
              <p className="text-slate-400 text-sm">Mensalidade</p>
              <p className="text-brand-green text-3xl font-bold">R$ {agente.preco}<span className="text-base font-normal text-slate-400">/mês</span></p>
            </div>
            <Link
              href={`/checkout?agente=${agente.slug}`}
              className="bg-brand-blue text-slate-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-400 transition"
            >
              Contratar agora →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
