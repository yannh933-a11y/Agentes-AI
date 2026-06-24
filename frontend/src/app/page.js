import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="pt-[72px]">

      {/* ════════════════════════════════════════
          HERO
          ════════════════════════════════════════ */}
      <section className="hero-glow min-h-[100vh] flex items-center justify-center px-5 sm:px-8 relative overflow-hidden">

        {/* Background orbs */}
        <div className="absolute top-[-180px] right-[-120px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{background: 'radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)'}} />
        <div className="absolute bottom-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)'}} />
        <div className="absolute top-[30%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)'}} />

        {/* Grid lines subtle */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

        <div className="text-center max-w-5xl relative z-10">

          {/* Live badge */}
          <div className="inline-flex items-center gap-3 social-proof-pill rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium mb-8">
            <div className="flex -space-x-1.5">
              {['C','A','P','M','J'].map((l, i) => (
                <div key={i} style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: ['#dc2626','#7c3aed','#2563eb','#059669','#d97706'][i],
                  border: '2px solid #07070f',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0
                }}>{l}</div>
              ))}
            </div>
            <span className="text-slate-300">+200 negócios automatizados</span>
            <span className="flex items-center gap-1.5 text-green-400 font-semibold">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Ativo agora
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[74px] font-black leading-[1.06] tracking-tight mb-6">
            Seu negócio atendendo{' '}
            <br className="hidden sm:block" />
            clientes às{' '}
            <span className="text-gradient-main relative">
              3 da manhã
              <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                <path d="M0 5 Q50 1 100 4 Q150 7 200 3" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
              </svg>
            </span>
            <br className="hidden sm:block" />
            — sem você acordar
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-3">
            Agentes de IA que respondem, agendam e vendem por você{' '}
            <strong className="text-white font-semibold">24 horas por dia</strong>, 7 dias por semana.
          </p>
          <p className="text-slate-500 text-sm mb-10 max-w-xl mx-auto">
            Configure em <span className="text-slate-300 font-semibold">5 minutos</span> pelo Telegram. Sem programar. Sem contratar ninguém.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/agentes"
              className="btn-primary font-bold px-10 py-4 rounded-full text-base sm:text-lg no-underline w-full sm:w-auto text-center">
              Quero meu agente agora →
            </Link>
            <Link href="/suporte"
              className="btn-outline font-semibold px-7 py-4 rounded-full text-sm no-underline w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <span>💬</span> Tirar dúvida primeiro
            </Link>
          </div>

          {/* Trust micro-copy */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-16 text-slate-600 text-xs">
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Sem fidelidade</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Cancele quando quiser</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Suporte humano incluso</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { num: '6', label: 'Tipos de agentes', icon: '🤖', color: 'rgba(220,38,38,0.1)' },
              { num: '24h', label: 'Sem parar nunca', icon: '⚡', color: 'rgba(139,92,246,0.1)' },
              { num: '5min', label: 'Para ativar', icon: '🚀', color: 'rgba(37,99,235,0.1)' },
              { num: 'R$97', label: 'Para começar', icon: '💰', color: 'rgba(5,150,105,0.1)' },
            ].map(({ num, label, icon, color }) => (
              <div key={label} className="card rounded-2xl px-4 py-6 text-center hover-lift" style={{background: color, borderColor: 'rgba(255,255,255,0.07)'}}>
                <p className="text-2xl mb-2">{icon}</p>
                <p className="text-3xl sm:text-4xl font-black text-white mb-1" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>{num}</p>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LOGOS / SEGMENTOS
          ════════════════════════════════════════ */}
      <section className="py-12 sm:py-14 px-5 sm:px-8 section-alt">
        <div className="max-w-4xl mx-auto">
          <div className="divider-glow mb-10" />
          <p className="text-center text-slate-600 text-xs font-semibold uppercase tracking-[4px] mb-8">
            Funciona para qualquer tipo de negócio
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              ['🏪','Barbearias'],['🏥','Clínicas'],['🍕','Restaurantes'],
              ['🏋️','Academias'],['👔','Lojas'],['💇','Salões'],['🦷','Consultórios'],['🎓','Cursos'],
            ].map(([emoji, name]) => (
              <div key={name} className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-all duration-200 cursor-default group">
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
            ))}
          </div>
          <div className="divider-glow mt-10" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROBLEMA vs SOLUÇÃO
          ════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-red mb-4">A realidade de muitos donos de negócio</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Reconhece alguma dessas situações?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

            {/* Problema */}
            <div className="card rounded-2xl p-8 sm:p-10 relative overflow-hidden" style={{borderColor: 'rgba(220,38,38,0.15)', background: 'rgba(220,38,38,0.03)'}}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)'}} />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg">😤</div>
                <p className="text-red-400 text-sm font-bold">Sem o AgentesIA</p>
              </div>
              <div className="space-y-4">
                {[
                  'Perde cliente por não conseguir atender no horário',
                  'Passa o dia respondendo sempre as mesmas perguntas',
                  'Contrata funcionário só para fazer atendimento básico',
                  'Fica estressado quando sai e não tem ninguém para cobrir',
                  'Perde agendamentos porque o cliente desiste de esperar',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-[10px] font-black">✗</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solução */}
            <div className="card rounded-2xl p-8 sm:p-10 relative overflow-hidden" style={{borderColor: 'rgba(34,197,94,0.15)', background: 'rgba(34,197,94,0.03)'}}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)'}} />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg">🤖</div>
                <p className="text-green-400 text-sm font-bold">Com o AgentesIA</p>
              </div>
              <div className="space-y-4">
                {[
                  'Seu agente responde no mesmo segundo, sempre disponível',
                  'Faz agendamentos automaticamente mesmo de madrugada',
                  'Nunca fica mal-humorado, doente ou pede aumento',
                  'Você foca no trabalho que só você pode fazer',
                  'Mais tempo para família, descanso e crescimento real',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 text-[10px] font-black">✓</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/agentes" className="btn-primary font-bold px-7 py-3.5 rounded-full no-underline text-sm inline-block">
                  Quero essa solução →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMO FUNCIONA
          ════════════════════════════════════════ */}
      <section id="como-funciona" className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-violet mb-4">Simples assim</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Do zero ao funcionando em <span className="text-gradient-main">5 minutos</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Sem técnico, sem configuração complicada, sem dor de cabeça
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-[56px] left-[34%] right-[34%] h-px z-0"
              style={{background: 'linear-gradient(90deg, rgba(220,38,38,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(37,99,235,0.3) 100%)'}} />

            {[
              {
                num: '01', icon: '🎯', color: '#dc2626',
                title: 'Escolha seu agente',
                desc: 'Temos 6 tipos especializados. Cada um para uma função. Leva menos de 2 minutos para decidir qual é o ideal para você.',
                link: '/agentes', linkLabel: 'Ver os agentes',
              },
              {
                num: '02', icon: '💳', color: '#8b5cf6',
                title: 'Realize o pagamento',
                desc: 'PIX, cartão ou débito. Aprovação em segundos pelo Mercado Pago. Totalmente seguro e sem complicação.',
                link: null, linkLabel: null,
              },
              {
                num: '03', icon: '🚀', color: '#2563eb',
                title: 'Configure e use já',
                desc: 'Abre o bot no Telegram, envia o código que vai no email e responde 3 perguntas rápidas. Pronto para funcionar!',
                link: '/suporte', linkLabel: 'Tirar dúvida',
              },
            ].map(({ num, icon, color, title, desc, link, linkLabel }) => (
              <div key={num} className="card card-glow rounded-2xl p-7 sm:p-9 text-left relative overflow-hidden group hover-lift z-10">
                {/* Number background */}
                <span className="absolute top-2 right-4 text-8xl font-black select-none pointer-events-none transition-all duration-300"
                  style={{color: `${color}08`, fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
                  {num}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-300"
                  style={{background: `${color}15`, border: `1px solid ${color}25`}}>
                  {icon}
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background: `${color}15`, color: color, border: `1px solid ${color}25`}}>
                    Passo {num}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{desc}</p>
                {link && (
                  <Link href={link} className="text-sm font-semibold no-underline transition-colors" style={{color: color}}>
                    {linkLabel} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BANNER CTA DESTAQUE
          ════════════════════════════════════════ */}
      <section className="py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="banner-cta rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-2xl flex-shrink-0">
                🎧
              </div>
              <div className="text-center sm:text-left">
                <div className="badge-red mb-2">Mais popular</div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 mt-3">Agente de Atendimento</h3>
                <p className="text-slate-400 text-sm">Ativação por <strong className="text-white">R$97</strong> + R$59/mês · Sem fidelidade · Cancele quando quiser</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto flex-shrink-0">
              <Link href="/checkout?agente=atendimento" className="btn-primary font-bold px-8 py-3.5 rounded-full no-underline text-center whitespace-nowrap">
                Contratar por R$97 →
              </Link>
              <Link href="/agentes" className="btn-outline font-semibold px-8 py-3 rounded-full no-underline text-center text-sm whitespace-nowrap">
                Ver todos os planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CATÁLOGO
          ════════════════════════════════════════ */}
      <section id="precos" className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-red mb-4">Catálogo completo</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Escolha o seu agente
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Cada agente é treinado para uma função específica no seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {agentes.map((a) => (
              <div key={a.slug}
                className={`card card-glow rounded-2xl p-6 sm:p-7 flex flex-col text-left group hover-lift relative overflow-hidden ${a.complexidade === 'simples' ? 'price-best' : ''}`}>

                {a.complexidade === 'simples' && (
                  <div className="absolute top-4 right-4 badge-green text-[10px]">
                    ⭐ Mais vendido
                  </div>
                )}

                <div className="w-[52px] h-[52px] icon-box rounded-xl flex items-center justify-center text-2xl mb-5">
                  {a.emoji}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors pr-20">
                  {a.nome}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{a.descricao}</p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {a.funcionalidades.slice(0, 3).map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="text-red-400 text-xs flex-shrink-0">✓</span>
                      <span className="text-slate-500 text-xs">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
                  <div>
                    <p className="text-white font-bold text-xl">
                      R$ {a.preco}<span className="text-xs text-slate-500 font-normal">/mês</span>
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">+ R${a.precoAtivacao} ativação</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Link href={`/checkout?agente=${a.slug}`} className="btn-primary font-bold px-5 py-2.5 rounded-full text-sm no-underline">
                      Contratar
                    </Link>
                    <Link href={`/agentes/${a.slug}`} className="text-slate-600 text-[11px] hover:text-slate-300 transition-colors no-underline">
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/agentes" className="btn-outline font-semibold px-10 py-4 rounded-full text-base no-underline inline-block">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DEPOIMENTOS
          ════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-green mb-4">Depoimentos reais</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Quem já usa, não volta atrás
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Resultados reais de donos de negócio como você
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                nome: 'Carlos M.',
                cargo: 'Dono · Barbearia Premium SP',
                texto: 'Antes eu perdia pelo menos uns 5 clientes por semana porque não conseguia atender telefone enquanto cortava cabelo. Agora o agente agenda tudo automaticamente. Melhor investimento que fiz.',
                resultado: '+32 agendamentos/mês',
                emoji: '✂️',
                cor: '#dc2626',
              },
              {
                nome: 'Ana L.',
                cargo: 'Proprietária · Clínica Estética RJ',
                texto: 'Minha recepcionista saiu e fiquei desesperada. Uma amiga me indicou o AgentesIA. Em 10 minutos estava funcionando. Hoje atende melhor do que qualquer funcionário que já tive.',
                resultado: 'Economizou R$1.800/mês',
                emoji: '💆',
                cor: '#8b5cf6',
              },
              {
                nome: 'Pedro S.',
                cargo: 'Sócio · Loja de Materiais BH',
                texto: 'Coloquei o agente de vendas e nos primeiros 15 dias já tinha recuperado o investimento. Os clientes ficam surpresos com a rapidez. Todo mundo acha que é um atendente real.',
                resultado: 'ROI em 15 dias',
                emoji: '🏪',
                cor: '#059669',
              },
            ].map(({ nome, cargo, texto, resultado, emoji, cor }) => (
              <div key={nome} className="testimonial-card rounded-2xl p-7 sm:p-8 flex flex-col relative overflow-hidden">
                {/* Glow top border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                  style={{background: `linear-gradient(90deg, transparent, ${cor}60, transparent)`}} />

                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400 text-base">★</span>
                  ))}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{texto}&rdquo;
                </p>

                {/* Result badge */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5"
                  style={{background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)'}}>
                  <span className="text-green-400 text-sm">📈</span>
                  <p className="text-green-400 text-xs font-bold">{resultado}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{background: `${cor}20`, border: `1px solid ${cor}25`}}>
                    {emoji}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{nome}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust numbers */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { num: '200+', label: 'Negócios ativos', icon: '🏢' },
              { num: '98%', label: 'Satisfação', icon: '⭐' },
              { num: '5min', label: 'Para ativar', icon: '⚡' },
              { num: '24/7', label: 'Disponível', icon: '🔄' },
            ].map(({ num, label, icon }) => (
              <div key={label} className="card rounded-2xl p-5 text-center">
                <span className="text-2xl mb-2 block">{icon}</span>
                <p className="text-2xl sm:text-3xl font-black text-white mb-1"
                  style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>{num}</p>
                <p className="text-slate-500 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
          ════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-violet mb-4">Dúvidas frequentes</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Perguntas que todo mundo faz
            </h2>
            <p className="text-slate-400 text-base">Não achou sua dúvida? Nossa IA responde na hora.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Preciso saber programar para usar?',
                a: 'Zero. A configuração é feita pelo Telegram em 3 perguntinhas simples. Se você sabe mandar mensagem, você já sabe usar o AgentesIA.',
                icon: '💻',
              },
              {
                q: 'Quanto tempo leva para ativar?',
                a: '5 minutos, no máximo. Você paga, recebe o código no email, abre o bot no Telegram e configura. Imediato.',
                icon: '⏱️',
              },
              {
                q: 'O agente funciona no WhatsApp?',
                a: 'Hoje funciona via Telegram, que é gratuito, rápido e privado. Você compartilha o link do bot com clientes pelo WhatsApp, Instagram ou onde quiser.',
                icon: '💬',
              },
              {
                q: 'E se eu quiser cancelar?',
                a: 'Sem burocracia, sem multa. Basta não renovar a mensalidade. Não tem fidelidade de nenhum tipo.',
                icon: '🔓',
              },
              {
                q: 'Os clientes vão saber que é uma IA?',
                a: 'Isso é escolha sua. O agente responde de forma tão natural que a maioria não percebe. Mas você pode configurá-lo para ser transparente se preferir.',
                icon: '🤔',
              },
              {
                q: 'Tem suporte se eu tiver problema?',
                a: 'Sim. Nossa IA de suporte está disponível 24h e resolve a maioria das dúvidas na hora. Para casos específicos, respondemos em até 24h.',
                icon: '🛟',
              },
            ].map(({ q, a, icon }) => (
              <div key={q} className="card rounded-2xl p-6 hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2 text-sm sm:text-base leading-snug">{q}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/suporte" className="btn-primary font-bold px-8 py-3.5 rounded-full no-underline inline-block">
              💬 Falar com suporte →
            </Link>
            <Link href="/agentes" className="btn-outline font-semibold px-8 py-3.5 rounded-full no-underline inline-block text-sm">
              Ver agentes disponíveis
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRÉ-CADASTRO
          ════════════════════════════════════════ */}
      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)'}} />
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                🤔
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sem pressa</p>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Quer pensar mais um pouco?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Deixa seu email aqui. Quando decidir, a contratação leva menos de 5 minutos e você não precisa preencher nada de novo.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <Link href="/pre-cadastro" className="btn-primary font-bold px-7 py-3.5 rounded-full no-underline text-center whitespace-nowrap">
                Guardar minha vaga →
              </Link>
              <Link href="/suporte" className="btn-outline font-semibold px-7 py-3 rounded-full no-underline text-center whitespace-nowrap text-sm">
                Tirar dúvidas primeiro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
          ════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 section-alt">
        <div className="max-w-3xl mx-auto text-center cta-glow rounded-3xl px-6 sm:px-14 md:px-20 py-16 sm:py-20 relative overflow-hidden">

          {/* BG orbs */}
          <div className="absolute top-[-60px] left-[-40px] w-56 h-56 rounded-full pointer-events-none"
            style={{background: 'radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)'}} />
          <div className="absolute bottom-[-40px] right-[-30px] w-48 h-48 rounded-full pointer-events-none"
            style={{background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)'}} />

          <div className="badge-red mb-6 relative z-10">Última chance de hoje</div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 relative z-10">
            Seu concorrente já pode estar{' '}
            <br className="hidden sm:block" />
            usando IA. <span className="text-gradient-main">E você?</span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-10 relative z-10">
            Comece hoje por R$97. Veja funcionando em 5 minutos.
            Se não gostar, cancela sem custo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/agentes"
              className="btn-primary font-bold px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl no-underline inline-block">
              Começar agora por R$97 →
            </Link>
            <Link href="/suporte"
              className="btn-outline font-bold px-8 py-4 rounded-full text-base no-underline inline-block">
              Falar com suporte
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7 relative z-10">
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Pagamento seguro Mercado Pago
            </span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Sem fidelidade
            </span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Ativo em 5 minutos
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}
