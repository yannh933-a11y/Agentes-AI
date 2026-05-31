import Link from 'next/link';
import { agentes } from '../lib/agentes';

export default function Home() {
  return (
    <main className="pt-[72px]">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-glow min-h-[100vh] flex items-center justify-center px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-red-600/[0.05] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-80px] w-[500px] h-[500px] rounded-full bg-blue-900/[0.07] blur-3xl pointer-events-none" />

        <div className="text-center max-w-5xl relative z-10">

          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <div className="flex -space-x-1.5">
              {['C','A','P','M'].map((l,i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-800 border-2 border-[#050508] flex items-center justify-center text-[9px] font-bold text-white">{l}</div>
              ))}
            </div>
            <span className="text-slate-300">+200 negócios automatizados</span>
            <span className="text-green-400 font-semibold">● Ativo agora</span>
          </div>

          {/* Headline humano */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black leading-[1.08] tracking-tight mb-6">
            Seu negócio atendendo{' '}
            <br className="hidden sm:block" />
            clientes às <span className="text-gradient-main">3 da manhã</span>
            <br className="hidden sm:block" />
            — sem você precisar acordar
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            Agentes de IA que respondem, agendam e vendem por você 24 horas por dia.
            Configure em <strong className="text-white">5 minutos</strong> pelo Telegram.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Sem mensalidade cara de SaaS. Sem precisar saber programar. Sem contratar ninguém.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-5">
            <Link href="/agentes" className="btn-primary font-bold px-10 py-4 rounded-full text-base sm:text-lg no-underline w-full sm:w-auto text-center shadow-lg shadow-red-900/30">
              Quero meu agente agora →
            </Link>
            <Link href="/suporte" className="btn-outline font-semibold px-7 py-4 rounded-full text-sm no-underline w-full sm:w-auto text-center">
              💬 Tirar dúvida antes
            </Link>
          </div>
          <p className="text-slate-600 text-xs mb-16">
            ✓ Cancele quando quiser &nbsp;·&nbsp; ✓ Sem fidelidade &nbsp;·&nbsp; ✓ Suporte humano incluso
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              ['6', 'Tipos de agentes', '🤖'],
              ['24h', 'Sem parar', '⚡'],
              ['5min', 'Para ativar', '🚀'],
              ['R$97', 'Para começar', '💰'],
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

      {/* ═══════════════ SEGMENTOS ═══════════════ */}
      <section className="py-10 sm:py-14 px-5 sm:px-8">
        <div className="divider-glow mb-10" />
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-8">
            Funciona para qualquer tipo de negócio
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              ['🏪','Barbearias'],['🏥','Clínicas'],['🍕','Restaurantes'],
              ['🏋️','Academias'],['👔','Lojas'],['💇','Salões'],['🦷','Consultórios'],
            ].map(([emoji, name]) => (
              <div key={name} className="flex items-center gap-2 text-slate-500/70 hover:text-slate-300 transition-colors cursor-default">
                <span className="text-xl">{emoji}</span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="divider-glow mt-10" />
      </section>

      {/* ═══════════════ DOR / SOLUÇÃO ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

            {/* Problema */}
            <div className="card rounded-2xl p-8 border-red-900/30">
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-5">😤 Reconhece essa situação?</p>
              <div className="space-y-4">
                {[
                  'Perdeu cliente porque não conseguiu atender no horário',
                  'Passa o dia respondendo sempre as mesmas perguntas',
                  'Precisa contratar alguém só para fazer atendimento',
                  'Fica estressado quando sai e não tem ninguém para responder',
                  'Perde agendamentos porque o cliente desiste de esperar',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                    <p className="text-slate-400 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solução */}
            <div className="card rounded-2xl p-8 border-green-900/20 bg-gradient-to-br from-[#0a0a14] to-[#0a1008]">
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-5">✅ Com AgentesIA</p>
              <div className="space-y-4">
                {[
                  'Seu agente responde no mesmo segundo, sempre',
                  'Faz agendamentos automaticamente mesmo de madrugada',
                  'Nunca fica mal-humorado nem pede aumento',
                  'Você foca no trabalho que só você pode fazer',
                  'Mais tempo para família, descanso e crescimento',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
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

      {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
      <section id="como-funciona" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Simples assim</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Do zero ao funcionando em 5 minutos
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Sem precisar de técnico, sem configuração complicada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-14 left-[33%] right-[33%] h-[1px] bg-gradient-to-r from-red-500/20 via-red-500/50 to-red-500/20 z-0" />
            {[
              ['01','🎯','Escolha seu agente','Tem 6 tipos. Cada um especializado em uma função. Leva menos de 2 minutos para decidir.','/agentes','Ver os agentes'],
              ['02','💳','Faça o pagamento','PIX, cartão ou débito. Aprovação em segundos pelo Mercado Pago. Totalmente seguro.',null,null],
              ['03','🤖','Configure e use já','Abre o bot no Telegram, envia o código que vai no email e responde 3 perguntinhas. Pronto!','/suporte','Tirar dúvida'],
            ].map(([num, icon, title, desc, link, linkLabel]) => (
              <div key={num} className="card rounded-2xl p-7 sm:p-9 text-left relative overflow-hidden group hover-lift z-10">
                <span className="absolute top-3 right-4 text-7xl font-black text-white/[0.02] group-hover:text-red-500/[0.05] transition-colors select-none">{num}</span>
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-red-500/[0.08] rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-red-500/[0.14] transition-colors">{icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{desc}</p>
                {link && (
                  <Link href={link} className="text-red-400 text-xs font-semibold hover:text-red-300 transition-colors no-underline">{linkLabel} →</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BANNER CTA ═══════════════ */}
      <section className="py-10 px-5 sm:px-8 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="banner-cta rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Mais popular</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Comece com o Agente de Atendimento</h3>
              <p className="text-slate-400 text-sm">Ativação por R$97 + R$59/mês · Sem fidelidade · Cancele quando quiser</p>
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

      {/* ═══════════════ CATÁLOGO ═══════════════ */}
      <section id="precos" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Catálogo</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">Escolha o seu agente</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Cada agente é treinado para uma função específica no seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {agentes.map((a) => (
              <div key={a.slug} className="card rounded-2xl p-6 sm:p-7 flex flex-col text-left group hover-lift relative overflow-hidden">
                {a.complexidade === 'simples' && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    ⭐ Mais vendido
                  </div>
                )}
                <div className="w-[52px] h-[52px] bg-red-500/[0.07] rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-red-500/[0.13] transition-colors">
                  {a.emoji}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors pr-16">
                  {a.nome}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{a.descricao}</p>

                {/* Features preview */}
                <div className="space-y-1.5 mb-6">
                  {a.funcionalidades.slice(0,3).map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="text-red-400 text-xs flex-shrink-0">✓</span>
                      <span className="text-slate-500 text-xs">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
                  <div>
                    <p className="text-white font-bold text-xl">
                      R$ {a.preco}<span className="text-xs text-slate-500 font-normal">/mês</span>
                    </p>
                    <p className="text-slate-600 text-[11px]">+ R${a.precoAtivacao} na ativação</p>
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

      {/* ═══════════════ DEPOIMENTOS ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 section-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-[4px] mb-4">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Quem já usa, não volta atrás
            </h2>
            <p className="text-slate-400">Resultados reais de donos de negócio como você</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                nome: 'Carlos M.',
                cargo: 'Dono · Barbearia Premium SP',
                texto: 'Antes eu perdia pelo menos uns 5 clientes por semana porque não conseguia atender telefone enquanto cortava cabelo. Agora o agente agenda tudo. Melhor coisa que fiz pro meu negócio.',
                resultado: '+32 agendamentos/mês',
                cor: 'from-red-600/30 to-orange-900/20',
              },
              {
                nome: 'Ana L.',
                cargo: 'Proprietária · Clínica Estética RJ',
                texto: 'Minha recepcionista saiu e eu fiquei desesperada. Uma amiga me indicou o AgentesIA. Em 10 minutos estava funcionando. Hoje atende melhor do que qualquer funcionário que já tive.',
                resultado: 'Economizou R$1.800/mês',
                cor: 'from-purple-600/20 to-blue-900/20',
              },
              {
                nome: 'Pedro S.',
                cargo: 'Sócio · Loja de Materiais BH',
                texto: 'Coloquei o agente de vendas e nos primeiros 15 dias já tinha recuperado o investimento. Os clientes ficam surpresos com a rapidez das respostas. Todo mundo acha que é um atendente real.',
                resultado: 'ROI em 15 dias',
                cor: 'from-green-600/20 to-teal-900/20',
              },
            ].map(({ nome, cargo, texto, resultado, cor }) => (
              <div key={nome} className="card rounded-2xl p-7 sm:p-8 text-left hover-lift flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">&ldquo;{texto}&rdquo;</p>
                <div className="bg-green-500/[0.07] border border-green-500/20 rounded-xl px-4 py-2.5 mb-5">
                  <p className="text-green-400 text-xs font-bold">📈 {resultado}</p>
                </div>
                <div className="border-t border-white/[0.05] pt-5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cor} flex items-center justify-center text-sm font-black text-white border border-white/10`}>
                    {nome.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{nome}</p>
                    <p className="text-slate-500 text-xs">{cargo}</p>
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
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Perguntas frequentes</h2>
            <p className="text-slate-400 text-base">Não achou sua dúvida? Nossa IA responde na hora.</p>
          </div>

          <div className="space-y-3">
            {[
              ['Preciso saber programar para usar?','Não, zero. A configuração é feita pelo Telegram em 3 perguntinhas simples. Se você sabe mandar mensagem, você sabe usar o AgentesIA.'],
              ['Quanto tempo leva para ativar?','5 minutos, no máximo. Você paga, recebe o código no email, abre o bot no Telegram e configura. Imediato.'],
              ['O agente funciona no WhatsApp?','Hoje funciona via Telegram. É gratuito, rápido e privado. Você compartilha o link do bot com seus clientes no WhatsApp, Instagram e onde quiser.'],
              ['E se eu quiser cancelar?','Sem burocracia, sem multa. Basta não renovar a mensalidade. Não tem fidelidade de nenhum tipo.'],
              ['Os clientes vão saber que é uma IA?','Isso é uma escolha sua. O agente responde de forma tão natural que a maioria não percebe. Mas você pode configurá-lo para ser transparente se preferir.'],
              ['Tem suporte se eu tiver problema?','Sim. Nossa IA de suporte está disponível 24h e resolve a maioria das dúvidas na hora. Para casos específicos, respondemos em até 24h.'],
            ].map(([q, a]) => (
              <div key={q} className="card rounded-2xl p-6 hover-lift">
                <div className="flex items-start gap-4">
                  <span className="text-red-500 text-lg mt-0.5 flex-shrink-0 font-black">?</span>
                  <div>
                    <p className="font-bold text-white mb-2 text-sm sm:text-base">{q}</p>
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

      {/* ═══════════════ PRÉ-CADASTRO ═══════════════ */}
      <section className="py-14 px-5 sm:px-8 section-alt">
        <div className="max-w-4xl mx-auto">
          <div className="card rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left flex-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sem pressa</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Quer pensar mais um pouco?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Deixa seu email aqui. Quando decidir, a contratação leva menos de 5 minutos e você não precisa preencher nada de novo.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <Link href="/pre-cadastro" className="btn-primary font-bold px-7 py-3 rounded-full no-underline text-center whitespace-nowrap">
                Guardar minha vaga →
              </Link>
              <Link href="/suporte" className="btn-outline font-semibold px-7 py-3 rounded-full no-underline text-center whitespace-nowrap text-sm">
                Tirar dúvidas primeiro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center cta-glow rounded-3xl px-6 sm:px-14 md:px-20 py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute top-[-60px] left-[-40px] w-52 h-52 bg-red-600/[0.08] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[-30px] w-40 h-40 bg-blue-800/[0.1] rounded-full blur-3xl pointer-events-none" />

          <p className="text-red-400 text-xs font-bold uppercase tracking-[4px] mb-4 relative z-10">Última chance de hoje</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 relative z-10">
            Seu concorrente já pode estar usando IA.
            <br />
            <span className="text-gradient-main">E você?</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-10 relative z-10">
            Comece hoje por R$97. Veja funcionando em 5 minutos. Se não gostar, cancela sem custo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/agentes" className="btn-primary font-bold px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl no-underline inline-block shadow-xl shadow-red-900/30">
              Começar agora por R$97 →
            </Link>
            <Link href="/suporte" className="btn-outline font-bold px-8 py-4 rounded-full text-base no-underline inline-block">
              Falar com suporte
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-6 relative z-10">
            ✓ Pagamento seguro via Mercado Pago &nbsp;·&nbsp; ✓ Sem fidelidade &nbsp;·&nbsp; ✓ Ativo em 5 minutos
          </p>
        </div>
      </section>

    </main>
  );
}
