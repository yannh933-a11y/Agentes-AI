import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="pt-[72px]">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-glow min-h-[100vh] flex items-center justify-center px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-red-600/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-80px] w-[500px] h-[500px] rounded-full bg-blue-900/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-red-900/[0.02] blur-[120px] pointer-events-none" />

        <div className="text-center max-w-5xl relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/[0.08] text-red-400 border border-red-500/15 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Inteligência Artificial para negócios brasileiros
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-black leading-[1.05] tracking-tight mb-7">
            Automatize seu{' '}
            <br className="hidden sm:block" />
            negócio com{' '}
            <span className="text-gradient-main">Agentes de IA</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Atendimento 24h, vendas automáticas e agendamentos inteligentes.
            Seu agente fica pronto em <strong className="text-white">5 minutos</strong> — sem contratar ninguém.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/agentes" className="btn-primary font-bold px-10 py-4 rounded-full text-base sm:text-lg no-underline w-full sm:w-auto text-center">
              Ver agentes disponíveis →
            </Link>
            <Link href="/suporte" className="btn-outline font-semibold px-7 py-4 rounded-full text-sm no-underline w-full sm:w-auto text-center">
              💬 Falar com IA grátis
            </Link>
          </div>
          <p className="text-slate-600 text-xs mb-16">✓ Sem fidelidade &nbsp;·&nbsp; ✓ Cancele quando quiser &nbsp;·&nbsp; ✓ Suporte incluso</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              ['6', 'Tipos de agentes', '🤖'],
              ['24h', 'Sempre disponível', '⚡'],
              ['5min', 'Para ativar', '🚀'],
              ['100%', 'Automático', '✨'],
            ].map(([num, label, icon]) => (
              <div key={label} className="card rounded-2xl px-4 py-6 text-center hover-lift">
                <p className="text-2xl mb-1">{icon}</p>
                <p className="text-3xl sm:text-4xl font-black text-gradient-red">{num}</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">{label}</p>
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
            Segmentos que já automatizaram com AgentesIA
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              ['🏪', 'Barbearias'],
              ['🏥', 'Clínicas'],
              ['🍕', 'Restaurantes'],
              ['🏋️', 'Academias'],
              ['👔', 'Lojas'],
              ['💇', 'Salões'],
              ['🦷', 'Consultórios'],
            ].map(([emoji, name]) => (
              <div key={name} className="flex items-center gap-2 text-slate-500/60 hover:text-slate-400 transition-colors">
                <span className="text-xl">{emoji}</span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="divider-glow mt-10" />
      </section>

      {/* ═══════════════ POR QUE AGENTESIA ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Vantagens</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Por que usar AgentesIA?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Tudo que seu negócio precisa, sem complicação
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ['⚡', 'Ativação em 5 minutos', 'Nada de semanas de configuração. Pague, receba o código, ative no Telegram e está funcionando.'],
              ['🌙', 'Atende 24h sem parar', 'Enquanto você dorme, seu agente responde clientes, marca horários e fecha vendas automaticamente.'],
              ['🧠', 'IA treinada pro seu negócio', 'O agente aprende os seus horários, serviços e preços. Responde como se fosse você.'],
              ['📊', 'Sem contratar funcionário', 'Economize R$2.000+/mês em salário. Seu agente não falta, não fica doente e nunca reclama.'],
              ['🔒', 'Pagamento 100% seguro', 'Mercado Pago com proteção total. Cartão de crédito, débito ou PIX instantâneo.'],
              ['🛠️', 'Suporte incluso', 'Qualquer dúvida, nossa IA de suporte resolve na hora. Sem fila de espera.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="card rounded-2xl p-7 flex gap-5 items-start group hover-lift">
                <div className="w-12 h-12 bg-red-500/[0.08] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-red-500/[0.14] transition-colors">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/agentes" className="btn-outline font-semibold px-8 py-3.5 rounded-full text-sm no-underline inline-block">
              Ver todos os agentes →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
      <section id="como-funciona" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Simples assim</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">Como funciona</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              3 passos para ter seu agente funcionando hoje mesmo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 relative">
            {/* Connecting line desktop */}
            <div className="hidden sm:block absolute top-14 left-[33%] right-[33%] h-[1px] bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 z-0" />

            {[
              ['01', '🎯', 'Escolha o agente', 'Selecione entre 7 modelos especializados. Cada um tem habilidades específicas para seu tipo de negócio.', '/agentes', 'Ver agentes'],
              ['02', '💳', 'Realize o pagamento', 'Pague via PIX, cartão ou débito. Aprovação instantânea pelo Mercado Pago com total segurança.', null, null],
              ['03', '🚀', 'Ative em 5 minutos', 'Receba o código no email, abra o bot no Telegram, configure em 3 perguntas. Pronto!', '/suporte', 'Tirar dúvidas'],
            ].map(([num, icon, title, desc, link, linkLabel]) => (
              <div key={num} className="card rounded-2xl p-7 sm:p-9 text-left relative overflow-hidden group hover-lift z-10">
                <span className="absolute top-3 right-4 text-7xl font-black text-white/[0.02] group-hover:text-red-500/[0.05] transition-colors select-none">{num}</span>
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-red-500/[0.08] rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-red-500/[0.14] transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{desc}</p>
                {link && (
                  <Link href={link} className="text-red-400 text-xs font-semibold hover:text-red-300 transition-colors no-underline">
                    {linkLabel} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BANNER CTA MEIO ═══════════════ */}
      <section className="py-10 px-5 sm:px-8 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="banner-cta rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Oferta atual</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Comece hoje por R$97</h3>
              <p className="text-slate-400 text-sm">Agente de Atendimento · Ativação + 1º mês · Sem fidelidade</p>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto flex-shrink-0">
              <Link href="/checkout?agente=atendimento" className="btn-primary font-bold px-8 py-3.5 rounded-full no-underline text-center whitespace-nowrap">
                Contratar agora →
              </Link>
              <Link href="/agentes" className="btn-outline font-semibold px-8 py-3 rounded-full no-underline text-center text-sm whitespace-nowrap">
                Ver todos os planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CATÁLOGO DE AGENTES ═══════════════ */}
      <section id="precos" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Catálogo</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">Nossos Agentes</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Escolha o agente certo para o seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {agentes.map((a) => (
              <div key={a.slug} className="card rounded-2xl p-6 sm:p-7 flex flex-col text-left group hover-lift">
                <div className="w-[52px] h-[52px] bg-red-500/[0.07] rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-red-500/[0.13] transition-colors">
                  {a.emoji}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {a.nome}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">{a.descricao}</p>
                <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${a.complexidade === 'complexo' ? 'bg-red-500/15 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {a.complexidade === 'complexo' ? '🔴 Avançado' : '🟢 Básico'}
                    </span>
                    <p className="text-white font-bold text-lg">
                      R$ {a.preco}<span className="text-xs text-slate-500 font-medium">/mês</span>
                    </p>
                    <p className="text-slate-600 text-[10px]">+ R${a.precoAtivacao} ativação única</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/agentes/${a.slug}`} className="btn-primary font-semibold px-5 py-2.5 rounded-full text-sm no-underline text-center">
                      Contratar
                    </Link>
                    <Link href={`/agentes/${a.slug}`} className="text-slate-500 text-[11px] text-center hover:text-slate-300 transition-colors no-underline">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/agentes" className="btn-primary font-bold px-10 py-4 rounded-full text-base no-underline inline-block">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ DEPOIMENTOS ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">O que nossos clientes dizem</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              ['Carlos M.', 'Barbearia Premium', 'O agente de agendamento mudou minha vida. Não perco mais cliente por não atender o telefone. Funciona 24h!', '⭐⭐⭐⭐⭐'],
              ['Ana L.', 'Clínica Estética', 'Meu atendimento agora é automático. Os clientes adoram poder tirar dúvidas a qualquer hora do dia.', '⭐⭐⭐⭐⭐'],
              ['Pedro S.', 'Loja Online', 'As vendas aumentaram 40% depois que coloquei o agente de vendas. Melhor investimento que fiz.', '⭐⭐⭐⭐⭐'],
            ].map(([name, role, text, stars]) => (
              <div key={name} className="card rounded-2xl p-7 sm:p-8 text-left hover-lift">
                <div className="flex gap-1 mb-5 text-sm">{stars}</div>
                <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed mb-8">&ldquo;{text}&rdquo;</p>
                <div className="border-t border-white/[0.05] pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600/30 to-blue-900/30 flex items-center justify-center text-sm font-bold text-white border border-white/10">
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

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Dúvidas</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-5">Perguntas frequentes</h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">Não encontrou sua dúvida? Fale com nossa IA de suporte.</p>
          </div>

          <div className="space-y-3">
            {[
              ['Preciso saber programar?', 'Não. A configuração é feita pelo Telegram em 3 perguntas simples. Qualquer pessoa consegue ativar em menos de 5 minutos.'],
              ['O agente funciona no WhatsApp?', 'Atualmente os agentes funcionam via Telegram. É gratuito, rápido e seguro. Integração com WhatsApp está em desenvolvimento.'],
              ['Posso cancelar quando quiser?', 'Sim. Sem fidelidade, sem multa. Basta não renovar a mensalidade e o agente é desativado automaticamente.'],
              ['O agente responde de forma natural?', 'Sim! Usamos o modelo LLaMA 3.1 da Meta, um dos mais avançados do mundo. As respostas são contextuais e personalizadas para o seu negócio.'],
              ['E se eu tiver problemas?', 'Nosso suporte com IA está disponível 24h em /suporte. Responde na hora, sem fila de espera.'],
            ].map(([q, a]) => (
              <div key={q} className="card rounded-2xl p-6 group hover-lift">
                <div className="flex items-start gap-4">
                  <span className="text-red-500 text-lg mt-0.5 flex-shrink-0">▸</span>
                  <div>
                    <p className="font-bold text-white mb-2 text-sm sm:text-base">{q}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/suporte" className="btn-primary font-bold px-8 py-3.5 rounded-full no-underline inline-block">
              💬 Falar com suporte →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRÉ-CADASTRO ═══════════════ */}
      <section className="py-14 px-5 sm:px-8 section-alt">
        <div className="max-w-4xl mx-auto">
          <div className="card rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left flex-1">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Sem pressa</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Não está pronto ainda?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Salve seus dados agora e contrate quando quiser — sem perder tempo preenchendo tudo de novo.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/pre-cadastro" className="btn-primary font-bold px-7 py-3 rounded-full no-underline text-center whitespace-nowrap">
                Fazer pré-cadastro →
              </Link>
              <Link href="/agentes" className="btn-outline font-semibold px-7 py-3 rounded-full no-underline text-center whitespace-nowrap text-sm">
                Ver agentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center cta-glow rounded-3xl px-6 sm:px-14 md:px-20 py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute top-[-60px] left-[-40px] w-52 h-52 bg-red-600/[0.07] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[-30px] w-40 h-40 bg-blue-800/[0.09] rounded-full blur-3xl pointer-events-none" />

          <p className="text-red-400 text-xs font-bold uppercase tracking-[4px] mb-4 relative z-10">Comece agora</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 relative z-10">
            Pronto para automatizar seu negócio?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-10 relative z-10">
            Junte-se a centenas de negócios que já economizam tempo e dinheiro com IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/agentes" className="btn-primary font-bold px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl no-underline inline-block">
              Começar agora →
            </Link>
            <Link href="/suporte" className="btn-outline font-bold px-8 py-4 rounded-full text-base no-underline inline-block">
              Tirar dúvidas primeiro
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-6 relative z-10">✓ Sem fidelidade &nbsp;·&nbsp; ✓ Ativo em 5 minutos &nbsp;·&nbsp; ✓ Suporte 24h</p>
        </div>
      </section>
    </main>
  );
}
