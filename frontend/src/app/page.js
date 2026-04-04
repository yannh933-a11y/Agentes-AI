import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="pt-[72px]">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-glow min-h-[100vh] flex items-center justify-center px-5 sm:px-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-red-600/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-80px] w-[400px] h-[400px] rounded-full bg-blue-900/[0.06] blur-3xl pointer-events-none" />

        <div className="text-center max-w-4xl relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/[0.08] text-red-400 border border-red-500/15 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Inteligência Artificial para negócios
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black leading-[1.05] tracking-tight mb-7">
            Automatize seu{' '}
            <br className="hidden sm:block" />
            negócio com{' '}
            <span className="text-gradient-main">Agentes de IA</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Atendimento 24h, vendas automáticas e agendamentos inteligentes.
            Seu agente fica pronto em minutos — sem contratar ninguém.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/agentes"
              className="btn-primary font-bold px-10 py-4 rounded-full text-base sm:text-lg no-underline w-full sm:w-auto text-center"
            >
              Ver agentes disponíveis →
            </Link>
            <a
              href="#como-funciona"
              className="btn-outline font-semibold px-6 py-3.5 rounded-full text-sm no-underline w-full sm:w-auto text-center"
            >
              Como funciona ↓
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              ['7', 'Tipos de agentes'],
              ['24h', 'Sempre disponível'],
              ['5min', 'Para ativar'],
              ['100%', 'Automático'],
            ].map(([num, label]) => (
              <div key={label} className="card rounded-2xl px-4 py-6 text-center">
                <p className="text-3xl sm:text-4xl font-black text-gradient-red">{num}</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BRANDS BAR ═══════════════ */}
      <section className="py-10 sm:py-14 px-5 sm:px-8">
        <div className="divider-glow mb-10" />
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-8">
            Segmentos que já automatizaram
          </p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              ['🏪', 'Barbearias'],
              ['🏥', 'Clínicas'],
              ['🍕', 'Restaurantes'],
              ['🏋️', 'Academias'],
              ['👔', 'Lojas'],
            ].map(([emoji, name]) => (
              <div key={name} className="flex items-center gap-2 text-slate-500/60">
                <span className="text-xl">{emoji}</span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="divider-glow mt-10" />
      </section>

      {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
      <section id="como-funciona" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">
              Simples assim
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Como funciona
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              3 passos para ter seu agente funcionando
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              ['01', '🎯', 'Escolha o agente', 'Selecione entre nossos 7 modelos especializados para seu tipo de negócio.'],
              ['02', '💳', 'Realize o pagamento', 'Pague via PIX de forma rápida e 100% segura. Aprovação instantânea.'],
              ['03', '🚀', 'Receba em minutos', 'Seu agente é criado e as credenciais são enviadas direto no seu email.'],
            ].map(([num, icon, title, desc]) => (
              <div key={num} className="card rounded-2xl p-7 sm:p-9 text-left relative overflow-hidden group">
                {/* Big number bg */}
                <span className="absolute top-3 right-4 text-7xl font-black text-white/[0.02] group-hover:text-red-500/[0.04] transition-colors select-none">
                  {num}
                </span>
                {/* Red top line */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-14 h-14 bg-red-500/[0.08] rounded-2xl flex items-center justify-center text-3xl mb-5">
                  {icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATÁLOGO DE AGENTES ═══════════════ */}
      <section id="precos" className="section-alt py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">
              Catálogo
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Nossos Agentes
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Escolha o agente certo para o seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {agentes.map((a) => (
              <div key={a.slug} className="card rounded-2xl p-6 sm:p-7 flex flex-col text-left group">
                <div className="w-13 h-13 bg-red-500/[0.07] rounded-xl flex items-center justify-center text-2xl mb-5 w-[52px] h-[52px]">
                  {a.emoji}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {a.nome}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">
                  {a.descricao}
                </p>
                <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
                  <div>
                    <p className="text-slate-600 text-[11px] font-medium">a partir de</p>
                    <p className="text-white font-bold text-xl">
                      R$ {a.preco}
                      <span className="text-xs text-slate-500 font-medium">/mês</span>
                    </p>
                  </div>
                  <Link
                    href={`/agentes/${a.slug}`}
                    className="btn-primary font-semibold px-5 py-2.5 rounded-full text-sm no-underline"
                  >
                    Contratar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DEPOIMENTOS ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">
              Depoimentos
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              ['Carlos M.', 'Barbearia Premium', 'O agente de agendamento mudou minha vida. Não perco mais cliente por não atender o telefone. Funciona 24h!'],
              ['Ana L.', 'Clínica Estética', 'Meu atendimento agora é automático. Os clientes adoram poder tirar dúvidas a qualquer hora do dia.'],
              ['Pedro S.', 'Loja Online', 'As vendas aumentaram 40% depois que coloquei o agente de vendas. Melhor investimento que fiz.'],
            ].map(([name, role, text]) => (
              <div key={name} className="card rounded-2xl p-7 sm:p-8 text-left">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-red-500 text-sm">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed mb-8">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="border-t border-white/[0.05] pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600/20 to-blue-900/20 flex items-center justify-center text-sm font-bold text-white">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center cta-glow rounded-3xl px-6 sm:px-14 md:px-20 py-16 sm:py-20 relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-[-60px] left-[-40px] w-40 h-40 bg-red-600/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[-30px] w-32 h-32 bg-blue-800/[0.08] rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 relative z-10">
            Pronto para automatizar?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-10 relative z-10">
            Escolha seu agente e tenha ele funcionando em menos de 5 minutos.
          </p>
          <Link
            href="/agentes"
            className="btn-primary font-bold px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl no-underline inline-block relative z-10"
          >
            Começar agora →
          </Link>
        </div>
      </section>
    </main>
  );
}
