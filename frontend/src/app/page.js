import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="pt-16">

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero-glow min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        <div className="text-center max-w-3xl relative z-10">
          {/* Tag */}
          <div className="inline-block bg-violet-500/[0.12] text-violet-400 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6">
            ⚡ Inteligência Artificial para negócios
          </div>

          {/* Título */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Automatize seu negócio com{' '}
            <span className="text-gradient-purple">Agentes de IA</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10">
            Atendimento 24h, vendas automáticas e agendamentos. Seu agente fica pronto em minutos, sem contratar ninguém.
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              href="/agentes"
              className="btn-gradient text-white font-bold px-8 py-4 rounded-full text-base sm:text-lg no-underline w-full sm:w-auto text-center"
            >
              Ver agentes disponíveis →
            </Link>
            <a
              href="#como-funciona"
              className="border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-semibold px-5 py-3 rounded-full text-sm no-underline transition-colors w-full sm:w-auto text-center"
            >
              Como funciona ↓
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-16 sm:mt-20">
            {[
              ['7', 'Tipos de agentes'],
              ['24h', 'Sempre disponível'],
              ['5min', 'Para ativar'],
              ['100%', 'Automático'],
            ].map(([num, label]) => (
              <div
                key={label}
                className="card-dark rounded-2xl px-4 py-5 text-center"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-gradient-purple">{num}</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LOGOS / CONFIANÇA ═══════════ */}
      <section className="border-y border-white/[0.04] py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-600 text-xs sm:text-sm font-medium mb-6">
            Empresas que já automatizaram com AgentesIA
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 opacity-40">
            {['🏪 Barbearias', '🏥 Clínicas', '🍕 Restaurantes', '🏋️ Academias', '👔 Lojas'].map(
              (n) => (
                <span key={n} className="text-sm sm:text-base text-slate-500 font-semibold whitespace-nowrap">
                  {n}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ COMO FUNCIONA ═══════════ */}
      <section id="como-funciona" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-violet-500 text-xs font-bold uppercase tracking-[3px] mb-3">
            Simples assim
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Como funciona
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto mb-14">
            3 passos para ter seu agente funcionando
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ['01', '🎯', 'Escolha o agente', 'Selecione entre nossos 7 modelos especializados para seu tipo de negócio.'],
              ['02', '💳', 'Realize o pagamento', 'Pague via PIX de forma rápida e 100% segura. Aprovação instantânea.'],
              ['03', '🚀', 'Receba em minutos', 'Seu agente é criado e as credenciais são enviadas direto no seu email.'],
            ].map(([num, icon, titulo, desc]) => (
              <div key={num} className="card-dark rounded-2xl p-7 sm:p-8 text-left relative overflow-hidden">
                <span className="absolute top-4 right-4 text-6xl font-black text-white/[0.03] select-none">
                  {num}
                </span>
                <span className="text-4xl block mb-4">{icon}</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATÁLOGO DE AGENTES ═══════════ */}
      <section id="precos" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#0d0f22]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-violet-500 text-xs font-bold uppercase tracking-[3px] mb-3">
            Catálogo
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Nossos Agentes
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto mb-14">
            Escolha o agente certo para o seu negócio
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {agentes.map((a) => (
              <div
                key={a.slug}
                className="card-dark rounded-2xl p-6 sm:p-7 flex flex-col text-left"
              >
                <div className="w-12 h-12 bg-violet-500/[0.1] rounded-xl flex items-center justify-center text-2xl mb-5">
                  {a.emoji}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{a.nome}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
                  {a.descricao}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    <p className="text-slate-600 text-[11px]">a partir de</p>
                    <p className="text-violet-400 font-bold text-lg sm:text-xl">
                      R$ {a.preco}
                      <span className="text-xs text-slate-600">/mês</span>
                    </p>
                  </div>
                  <Link
                    href={`/agentes/${a.slug}`}
                    className="btn-gradient text-white font-semibold px-4 py-2 rounded-full text-sm no-underline"
                  >
                    Contratar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DEPOIMENTOS ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-violet-500 text-xs font-bold uppercase tracking-[3px] mb-3">
            Clientes
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
            O que nossos clientes dizem
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ['Carlos M.', 'Barbearia Premium', 'O agente de agendamento mudou minha vida. Não perco mais cliente por não atender o telefone. Funciona 24h!'],
              ['Ana L.', 'Clínica Estética', 'Meu atendimento agora é automático. Os clientes adoram poder tirar dúvidas a qualquer hora do dia.'],
              ['Pedro S.', 'Loja Online', 'As vendas aumentaram 40% depois que coloquei o agente de vendas. Melhor investimento que fiz.'],
            ].map(([nome, cargo, texto]) => (
              <div key={nome} className="card-dark rounded-2xl p-7 text-left">
                {/* Estrelas */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-amber-400 text-base">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  &ldquo;{texto}&rdquo;
                </p>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="font-bold text-white text-sm">{nome}</p>
                  <p className="text-slate-500 text-xs">{cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center cta-glow border border-violet-500/20 rounded-3xl px-6 sm:px-12 md:px-16 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Pronto para automatizar?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-10">
            Escolha seu agente e tenha ele funcionando em menos de 5 minutos.
          </p>
          <Link
            href="/agentes"
            className="btn-gradient text-white font-bold px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl no-underline inline-block"
          >
            Começar agora →
          </Link>
        </div>
      </section>
    </main>
  );
}
