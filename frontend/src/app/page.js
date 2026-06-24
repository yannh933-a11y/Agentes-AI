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
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

        <div className="text-center max-w-5xl relative z-10">

          {/* Social proof live badge */}
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
            <span className="text-slate-300">+200 donos de negócio já automatizaram</span>
            <span className="flex items-center gap-1.5 text-green-400 font-semibold">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Funcionando agora
            </span>
          </div>

          {/* Headline principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[74px] font-black leading-[1.06] tracking-tight mb-6">
            Chega de perder cliente<br className="hidden sm:block" />
            por não conseguir{' '}
            <span className="text-gradient-main relative">
              atender
              <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                <path d="M0 5 Q50 1 100 4 Q150 7 200 3" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
              </svg>
            </span>
            <br className="hidden sm:block" />
            na hora certa
          </h1>

          {/* Subtítulo com benefício claro */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-3">
            Seu agente de IA responde clientes, agenda horários e fecha vendas por você
            — de domingo às 23h a segunda às 6h da manhã.{' '}
            <strong className="text-white font-semibold">Sem você precisar tocar no celular.</strong>
          </p>
          <p className="text-slate-500 text-sm mb-10 max-w-xl mx-auto">
            Ativa em <span className="text-slate-300 font-semibold">5 minutos</span> direto pelo Telegram.
            Sem programar. Sem contratar funcionário. Sem mensalidade de SaaS cara.
          </p>

          {/* CTAs principais */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/agentes"
              className="btn-primary font-bold px-10 py-4 rounded-full text-base sm:text-lg no-underline w-full sm:w-auto text-center">
              Ver meu agente ideal →
            </Link>
            <Link href="/suporte"
              className="btn-outline font-semibold px-7 py-4 rounded-full text-sm no-underline w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <span className="emoji">💬</span> Tenho uma dúvida antes
            </Link>
          </div>

          {/* Micro-copy de confiança */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-16 text-slate-600 text-xs">
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Sem contrato de fidelidade</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Cancela quando quiser</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Suporte humano incluso</span>
          </div>

          {/* Stats de impacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { num: '6', label: 'Agentes especializados', color: 'rgba(220,38,38,0.1)', dot: '#dc2626' },
              { num: '24h', label: 'Atendendo sem parar', color: 'rgba(139,92,246,0.1)', dot: '#8b5cf6' },
              { num: '5min', label: 'Para ativar tudo', color: 'rgba(37,99,235,0.1)', dot: '#2563eb' },
              { num: 'R$97', label: 'Investimento inicial', color: 'rgba(5,150,105,0.1)', dot: '#059669' },
            ].map(({ num, label, color, dot }) => (
              <div key={label} className="card rounded-2xl px-4 py-6 text-center hover-lift" style={{background: color, borderColor: 'rgba(255,255,255,0.07)'}}>
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-3" style={{background: dot}} />
                <p className="text-3xl sm:text-4xl font-black text-white mb-1" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>{num}</p>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SEGMENTOS
          ════════════════════════════════════════ */}
      <section className="py-12 sm:py-14 px-5 sm:px-8 section-alt">
        <div className="max-w-4xl mx-auto">
          <div className="divider-glow mb-10" />
          <p className="text-center text-slate-600 text-xs font-semibold uppercase tracking-[4px] mb-8">
            Já ajudamos negócios como o seu
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              'Barbearias','Clínicas','Restaurantes','Academias',
              'Lojas','Salões','Consultórios','Cursos online',
            ].map((name) => (
              <span key={name}
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white transition-all duration-200 cursor-default"
                style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)'}}>
                {name}
              </span>
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
            <div className="badge-red mb-4">Você se identifica?</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Seja honesto com você mesmo
            </h2>
            <p className="text-slate-400 text-base mt-4 max-w-lg mx-auto">
              Esses problemas estão custando clientes, dinheiro e seu descanso — todo dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

            {/* Problema */}
            <div className="card rounded-2xl p-8 sm:p-10 relative overflow-hidden" style={{borderColor: 'rgba(220,38,38,0.15)', background: 'rgba(220,38,38,0.03)'}}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)'}} />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
                <p className="text-red-400 text-sm font-bold">Hoje, sem o AgentesIA</p>
              </div>
              <div className="space-y-4">
                {[
                  'Cliente manda mensagem às 21h. Você vê só amanhã. Ele já agendou com o concorrente.',
                  'Você corta cabelo, atende telefone, responde WhatsApp — tudo ao mesmo tempo.',
                  'Paga R$1.800/mês em recepcionista para responder sempre as mesmas 5 perguntas.',
                  'Final de semana deveria ser descanso, mas o celular não para de vibrar.',
                  'Perde venda porque o cliente desistiu de esperar por uma resposta simples.',
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
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h3V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/><circle cx="9" cy="13" r="1.5" fill="#4ade80"/><circle cx="15" cy="13" r="1.5" fill="#4ade80"/><path d="M9 17h6"/></svg>
              </div>
                <p className="text-green-400 text-sm font-bold">Com o AgentesIA</p>
              </div>
              <div className="space-y-4">
                {[
                  'Às 21h o agente já respondeu, confirmou o horário e o cliente está satisfeito.',
                  'Você foca no que só você sabe fazer. O agente cuida do resto.',
                  'Economiza R$1.800/mês e ainda atende melhor — sem folga, sem falta, sem estresse.',
                  'Fim de semana é para você e sua família. O negócio trabalha sozinho.',
                  'Cada cliente recebe resposta em segundos, qualquer hora do dia ou da noite.',
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
                  Quero essa mudança →
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
            <div className="badge-violet mb-4">Mais simples do que parece</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Do pagamento ao funcionando<br className="hidden sm:block" />
              em <span className="text-gradient-main">menos de 5 minutos</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Sem técnico, sem tutorial em vídeo de 2 horas, sem frustração.
              Sério, qualquer pessoa consegue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-[56px] left-[34%] right-[34%] h-px z-0"
              style={{background: 'linear-gradient(90deg, rgba(220,38,38,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(37,99,235,0.3) 100%)'}} />

            {[
              {
                num: '01', icon: '🎯', color: '#dc2626',
                title: 'Escolha o agente certo para você',
                desc: 'São 6 tipos, cada um com uma especialidade. Barbearia, clínica, loja, academia — tem um feito pra você. Dois minutos para decidir.',
                link: '/agentes', linkLabel: 'Comparar agentes',
              },
              {
                num: '02', icon: '💳', color: '#8b5cf6',
                title: 'Pague e receba acesso na hora',
                desc: 'PIX ou cartão via Mercado Pago. Em segundos você recebe o código de ativação no seu email. Seguro e sem complicação.',
                link: null, linkLabel: null,
              },
              {
                num: '03', icon: '🚀', color: '#2563eb',
                title: 'Ative e pronto — tá no ar',
                desc: 'Abre o bot no Telegram, insere o código e responde 3 perguntinhas sobre seu negócio. Feito. Seu agente já começa a trabalhar.',
                link: '/suporte', linkLabel: 'Tem dúvida? Fale conosco',
              },
            ].map(({ num, icon, color, title, desc, link, linkLabel }) => (
              <div key={num} className="card card-glow rounded-2xl p-7 sm:p-9 text-left relative overflow-hidden group hover-lift z-10">
                <span className="absolute top-2 right-4 text-8xl font-black select-none pointer-events-none"
                  style={{color: `${color}08`, fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
                  {num}
                </span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-300 emoji"
                  style={{background: `${color}15`, border: `1px solid ${color}25`}}>
                  {icon}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background: `${color}15`, color: color, border: `1px solid ${color}25`}}>
                    Passo {num}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{desc}</p>
                {link && (
                  <Link href={link} className="text-sm font-semibold no-underline transition-colors" style={{color: color}}>
                    {linkLabel} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA inline */}
          <div className="text-center mt-12">
            <p className="text-slate-500 text-sm mb-5">
              Já imaginou ter isso funcionando hoje à noite?
            </p>
            <Link href="/agentes" className="btn-primary font-bold px-10 py-4 rounded-full text-base no-underline inline-block">
              Quero ativar agora →
            </Link>
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
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="badge-red mb-3">⭐ O favorito de quem começa</div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Agente de Atendimento</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Responde perguntas, passa informações e deixa seus clientes sempre bem atendidos.
                  Ideal para quem quer começar rápido e ver resultado logo.
                </p>
                <p className="text-slate-500 text-xs mt-2">Ativação <strong className="text-white">R$97</strong> · R$59/mês · Cancele quando quiser</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto flex-shrink-0">
              <Link href="/checkout?agente=atendimento" className="btn-primary font-bold px-8 py-3.5 rounded-full no-underline text-center whitespace-nowrap">
                Contratar por R$97 →
              </Link>
              <Link href="/agentes" className="btn-outline font-semibold px-8 py-3 rounded-full no-underline text-center text-sm whitespace-nowrap">
                Ver todos os agentes
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
            <div className="badge-red mb-4">Catálogo de agentes</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Qual parte do seu negócio<br className="hidden sm:block" />
              você quer automatizar primeiro?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Cada agente é treinado e especializado para uma função específica.
              Escolha o que mais faz sentido para você agora.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {agentes.map((a) => (
              <div key={a.slug}
                className={`card card-glow rounded-2xl p-6 sm:p-7 flex flex-col text-left group hover-lift relative overflow-hidden ${a.complexidade === 'simples' ? 'price-best' : ''}`}>

                {a.complexidade === 'simples' && (
                  <div className="absolute top-4 right-4 badge-green text-[10px]">
                    + Mais contratado
                  </div>
                )}

                <div className="w-[52px] h-[52px] icon-box rounded-xl flex items-center justify-center text-2xl mb-5" style={{fontFamily:"'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif"}}>
                  {a.emoji}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors pr-20">
                  {a.nome}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{a.descricao}</p>

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
                      R${a.preco}<span className="text-xs text-slate-500 font-normal">/mês</span>
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">+ R${a.precoAtivacao} ativação única</p>
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
            <p className="text-slate-500 text-sm mb-4">Não tem certeza qual é o ideal para você?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/agentes" className="btn-outline font-semibold px-10 py-4 rounded-full text-base no-underline inline-block">
                Ver catálogo completo →
              </Link>
              <Link href="/suporte" className="btn-outline font-semibold px-10 py-4 rounded-full text-base no-underline inline-block">
                Me ajuda a escolher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DEPOIMENTOS
          ════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-green mb-4">Histórias reais</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Eles duvidaram também.<br className="hidden sm:block" />
              Até experimentar.
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Donos de negócio que decidiram parar de perder clientes por falta de atendimento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                nome: 'Carlos M.',
                cargo: 'Dono · Barbearia Premium — São Paulo',
                texto: 'Ficava na minha cabeça que IA era coisa de empresa grande. Resolvi testar com R$97 mesmo sem muita fé. Em duas semanas o agente tinha agendado 32 clientes novos que eu nunca teria conseguido atender. Hoje não abro mão.',
                resultado: '+32 novos clientes em 2 semanas',
                inicial: 'C',
                cor: '#dc2626',
              },
              {
                nome: 'Ana L.',
                cargo: 'Proprietária · Clínica Estética — Rio de Janeiro',
                texto: 'Minha recepcionista pediu demissão numa sexta. Segunda-feira o AgentesIA já estava respondendo tudo. Sem crise, sem desespero. Hoje, honestamente, ele atende melhor do que qualquer funcionário que eu já tive — e nunca falta.',
                resultado: 'Economizou R$1.800/mês em pessoal',
                inicial: 'A',
                cor: '#8b5cf6',
              },
              {
                nome: 'Pedro S.',
                cargo: 'Sócio · Loja de Materiais — Belo Horizonte',
                texto: 'Coloquei o agente de vendas e nos primeiros 15 dias já recuperei o valor da ativação. Os clientes nem percebem que é IA — acham que é um atendente muito eficiente. E é mesmo. Nunca mais perdi venda por demora.',
                resultado: 'Investimento recuperado em 15 dias',
                inicial: 'P',
                cor: '#059669',
              },
            ].map(({ nome, cargo, texto, resultado, inicial, cor }) => (
              <div key={nome} className="testimonial-card rounded-2xl p-7 sm:p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                  style={{background: `linear-gradient(90deg, transparent, ${cor}60, transparent)`}} />

                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400 text-base">★</span>
                  ))}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{texto}&rdquo;
                </p>

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5"
                  style={{background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)'}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  <p className="text-green-400 text-xs font-bold">{resultado}</p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{background: `${cor}25`, border: `1px solid ${cor}50`, color: '#fff', fontSize: '16px'}}>
                    {inicial}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{nome}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { num: '200+', label: 'Negócios automatizados', color: '#f87171' },
              { num: '98%', label: 'Clientes satisfeitos', color: '#facc15' },
              { num: '5min', label: 'Ativação média', color: '#60a5fa' },
              { num: '24/7', label: 'Atendimento ativo', color: '#a78bfa' },
            ].map(({ num, label, color }) => (
              <div key={label} className="card rounded-2xl p-5 text-center">
                <div className="w-2 h-2 rounded-full mx-auto mb-3" style={{background: color}} />
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
            <div className="badge-violet mb-4">Suas dúvidas respondidas</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              A gente sabe o que passa<br className="hidden sm:block" />
              pela sua cabeça agora
            </h2>
            <p className="text-slate-400 text-base">
              Aqui estão as perguntas que todo mundo faz antes de contratar.
              Se ainda restar alguma, nossa IA responde na hora.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Preciso saber programar ou ter conhecimento técnico?',
                a: 'Zero. Se você sabe mandar uma mensagem no WhatsApp, você já sabe usar o AgentesIA. A configuração é feita no Telegram em 3 perguntinhas sobre o seu negócio. Sem código, sem manual, sem dor de cabeça.',
                num: '01',
              },
              {
                q: 'Quanto tempo demora do pagamento ao funcionando?',
                a: 'Menos de 5 minutos. Você paga, recebe o código de ativação no email, abre o bot no Telegram, insere o código e configura em 3 passos. Já testamos com pessoas que nunca tinham usado um bot. Funciona para todo mundo.',
                num: '02',
              },
              {
                q: 'O agente funciona no WhatsApp dos meus clientes?',
                a: 'Hoje o agente opera via Telegram, que é gratuito e muito mais ágil. Você compartilha o link do seu bot com clientes pelo WhatsApp, Instagram, Google, onde quiser. Eles clicam e já caem no atendimento.',
                num: '03',
              },
              {
                q: 'E se eu contratar e não gostar? Posso cancelar?',
                a: 'Claro. Sem burocracia, sem ligação de retenção, sem multa. Basta não renovar a mensalidade e acabou. Você nunca vai se sentir preso. Nossa confiança no produto é a nossa maior garantia.',
                num: '04',
              },
              {
                q: 'Meus clientes vão perceber que é uma IA respondendo?',
                a: 'Provavelmente não. O agente conversa de forma natural e contextual. A maioria dos clientes dos nossos usuários pensa que é um atendente de verdade. Mas se preferir ser transparente, você pode configurá-lo assim também.',
                num: '05',
              },
              {
                q: 'E se eu tiver algum problema ou precisar de ajuda?',
                a: 'Nossa IA de suporte responde qualquer dúvida na hora, 24 horas por dia. Para situações mais específicas, nossa equipe retorna em até 24h. Você nunca vai ficar na mão.',
                num: '06',
              },
            ].map(({ q, a, num }) => (
              <div key={q} className="card rounded-2xl p-6 hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 font-black text-xs">{num}</span>
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
              Ainda tem dúvida? Fale conosco →
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
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sem pressão</p>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Precisa de mais um tempinho?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tudo bem. Deixa seu email aqui e a gente guarda sua vaga.
                  Quando você decidir, a contratação leva menos de 5 minutos e você não preenche nada de novo.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <Link href="/pre-cadastro" className="btn-primary font-bold px-7 py-3.5 rounded-full no-underline text-center whitespace-nowrap">
                Guardar minha vaga →
              </Link>
              <Link href="/suporte" className="btn-outline font-semibold px-7 py-3 rounded-full no-underline text-center whitespace-nowrap text-sm">
                Prefiro tirar dúvidas antes
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

          <div className="absolute top-[-60px] left-[-40px] w-56 h-56 rounded-full pointer-events-none"
            style={{background: 'radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)'}} />
          <div className="absolute bottom-[-40px] right-[-30px] w-48 h-48 rounded-full pointer-events-none"
            style={{background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)'}} />

          <div className="badge-red mb-6 relative z-10">Uma última coisa</div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 relative z-10">
            Todo minuto que passa é<br className="hidden sm:block" />
            um cliente que{' '}
            <span className="text-gradient-main">não esperou.</span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-4 relative z-10">
            A boa notícia? A solução custa R$97 e leva 5 minutos para ativar.
            A ruim? Cada dia sem ela é outro dia perdendo clientes.
          </p>

          <p className="text-slate-500 text-sm mb-10 relative z-10">
            Mais de 200 donos de negócio já tomaram essa decisão. A maioria disse que deveria ter feito antes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/agentes"
              className="btn-primary font-bold px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl no-underline inline-block">
              Ativar meu agente agora →
            </Link>
            <Link href="/suporte"
              className="btn-outline font-bold px-8 py-4 rounded-full text-base no-underline inline-block">
              Ainda tenho dúvidas
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7 relative z-10">
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Pagamento seguro Mercado Pago
            </span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Sem fidelidade ou contrato
            </span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Funcionando em 5 minutos
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}
