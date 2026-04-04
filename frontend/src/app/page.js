import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="pt-16">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Fundo com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-[#060818] to-[#060818]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Inteligência Artificial para o seu negócio
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Automatize seu negócio com{' '}
            <span className="gradient-text">Agentes de IA</span>
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Atendimento 24h, vendas automáticas e agendamentos sem precisar contratar ninguém.
            Seu agente fica pronto em minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/agentes"
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-full text-lg transition glow"
            >
              Ver agentes disponíveis →
            </Link>
            <a href="#como-funciona" className="text-slate-400 hover:text-white transition text-sm font-medium">
              Como funciona ↓
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '7', label: 'Tipos de agentes' },
              { num: '24h', label: 'Disponível sempre' },
              { num: '5min', label: 'Para ficar pronto' },
              { num: '100%', label: 'Automático' },
            ].map((s) => (
              <div key={s.label} className="glass-card p-6 text-center">
                <p className="text-3xl font-bold gradient-text">{s.num}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Simples assim</span>
            <h2 className="text-4xl font-bold text-white mt-3">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { num: '01', icon: '🎯', titulo: 'Escolha o agente', desc: 'Selecione o agente ideal entre nossos 7 modelos especializados.' },
              { num: '02', icon: '💳', titulo: 'Realize o pagamento', desc: 'Pague via PIX de forma rápida e 100% segura.' },
              { num: '03', icon: '🚀', titulo: 'Receba em minutos', desc: 'Seu agente é criado automaticamente e enviado para seu email.' },
            ].map((item, i) => (
              <div key={item.num} className="glass-card p-8 relative">
                <span className="absolute top-6 right-6 text-5xl font-bold text-white/5">{item.num}</span>
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-white text-xl font-bold mb-3">{item.titulo}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTES */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Catálogo</span>
            <h2 className="text-4xl font-bold text-white mt-3">Nossos Agentes</h2>
            <p className="text-slate-400 mt-4 text-lg">Escolha o agente certo para o seu negócio</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {agentes.map((agente) => (
              <div key={agente.slug} className="glass-card p-6 flex flex-col hover:border-violet-500/30 hover:bg-white/[0.07] transition group">
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-2xl mb-5">
                  {agente.emoji}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{agente.nome}</h3>
                <p className="text-slate-400 text-sm flex-1 mb-5 leading-relaxed">{agente.descricao}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-slate-500 text-xs">a partir de</p>
                    <p className="text-violet-400 font-bold text-lg">R$ {agente.preco}<span className="text-xs text-slate-500">/mês</span></p>
                  </div>
                  <Link
                    href={`/agentes/${agente.slug}`}
                    className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                  >
                    Contratar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Clientes</span>
            <h2 className="text-4xl font-bold text-white mt-3">Quem já usa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nome: 'Carlos M.', cargo: 'Dono de barbearia', texto: 'O agente de agendamento mudou minha vida. Não perco mais cliente por não atender o telefone.', estrelas: 5 },
              { nome: 'Ana L.', cargo: 'Clínica estética', texto: 'Meu atendimento é 24h agora. Os clientes adoram poder tirar dúvidas a qualquer hora.', estrelas: 5 },
              { nome: 'Pedro S.', cargo: 'Loja online', texto: 'As vendas aumentaram 40% depois que coloquei o agente de vendas. Vale cada centavo.', estrelas: 5 },
            ].map((d) => (
              <div key={d.nome} className="glass-card p-8">
                <div className="flex gap-1 mb-4">
                  {Array(d.estrelas).fill(0).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">"{d.texto}"</p>
                <div>
                  <p className="text-white font-semibold">{d.nome}</p>
                  <p className="text-slate-500 text-sm">{d.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass-card p-16 relative overflow-hidden glow">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/5" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para automatizar<br />seu negócio?
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Escolha seu agente e tenha ele funcionando em menos de 5 minutos.
            </p>
            <Link
              href="/agentes"
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-5 rounded-full text-xl transition inline-block"
            >
              Começar agora →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
