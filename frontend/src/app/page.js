import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <span className="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-4">
          Inteligência Artificial para o seu negócio
        </span>
        <h1 className="text-5xl font-bold text-white leading-tight max-w-3xl mb-6">
          Automatize seu negócio com{' '}
          <span className="text-brand-blue">Agentes de IA</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mb-10">
          Atendimento 24h, vendas automáticas, agendamentos e muito mais. 
          Sem contratar funcionários. Sem complicação.
        </p>
        <Link
          href="/agentes"
          className="bg-brand-blue text-slate-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-400 transition"
        >
          Ver agentes disponíveis →
        </Link>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01', titulo: 'Escolha o agente', desc: 'Selecione o agente ideal para o seu negócio no catálogo.' },
            { num: '02', titulo: 'Realize o pagamento', desc: 'Pague via PIX de forma rápida e segura.' },
            { num: '03', titulo: 'Receba em minutos', desc: 'Seu agente é criado automaticamente e enviado para seu email.' },
          ].map((item) => (
            <div key={item.num} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <span className="text-brand-blue text-4xl font-bold">{item.num}</span>
              <h3 className="text-white text-xl font-semibold mt-3 mb-2">{item.titulo}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTES EM DESTAQUE */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Nossos Agentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentes.map((agente) => (
              <div key={agente.slug} className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
                <span className="text-4xl mb-4">{agente.emoji}</span>
                <h3 className="text-white text-xl font-bold mb-2">{agente.nome}</h3>
                <p className="text-slate-400 flex-1 mb-4">{agente.descricao}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-green font-bold text-xl">R$ {agente.preco}/mês</span>
                  <Link
                    href={`/agentes/${agente.slug}`}
                    className="bg-brand-blue text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-sky-400 transition text-sm"
                  >
                    Saiba mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-slate-500 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} Agentes IA — Todos os direitos reservados
      </footer>
    </main>
  );
}
