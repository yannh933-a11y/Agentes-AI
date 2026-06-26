'use client';
import { useState, useEffect, useRef } from 'react';

const scenarios = [
  {
    id: 'barbearia',
    label: 'Barbearia',
    botNome: 'Agente Barbearia Silva',
    subtitulo: 'Online agora',
    cor: '#dc2626',
    messages: [
      { from: 'client', text: 'Oi! Tem horário amanhã às 18h?', time: '21:34' },
      { from: 'bot', text: 'Olá! Tenho sim, amanhã às 18h com o Marcos está disponível. Confirmo para você?', time: '21:34' },
      { from: 'client', text: 'Sim, pode confirmar!', time: '21:35' },
      { from: 'bot', text: 'Perfeito! Confirmado:\n\n📅 Amanhã — 18h00\n💈 Barbeiro: Marcos\n📍 Barbearia Silva\n\nTe esperamos! Qualquer dúvida é só chamar.', time: '21:35' },
    ],
  },
  {
    id: 'clinica',
    label: 'Clínica',
    botNome: 'Agente Clínica Estética',
    subtitulo: 'Online agora',
    cor: '#8b5cf6',
    messages: [
      { from: 'client', text: 'Qual o valor da limpeza de pele?', time: '14:22' },
      { from: 'bot', text: 'A limpeza de pele profunda custa R$180 e dura cerca de 1h30. Temos horários esta semana ainda!', time: '14:22' },
      { from: 'client', text: 'Que dias vocês têm disponível?', time: '14:23' },
      { from: 'bot', text: 'Disponibilidade desta semana:\n\n📅 Quinta — 10h, 14h ou 16h\n📅 Sexta — 9h, 11h ou 15h\n\nQual horário prefere? Já agendo agora mesmo!', time: '14:23' },
    ],
  },
  {
    id: 'loja',
    label: 'Loja',
    botNome: 'Agente Loja do Pedro',
    subtitulo: 'Online agora',
    cor: '#059669',
    messages: [
      { from: 'client', text: 'Vocês têm tênis Nike Air Max no 42?', time: '10:05' },
      { from: 'bot', text: 'Temos sim! Nike Air Max no 42 disponível em preto e branco. R$349,90. Quer reservar um?', time: '10:05' },
      { from: 'client', text: 'O preto! Como faço pra comprar?', time: '10:06' },
      { from: 'bot', text: 'Ótima escolha!\n\n🛍️ Retire na loja: Rua das Flores, 42\n📦 Entrega com frete grátis acima de R$200\n💳 Pix, cartão ou dinheiro\n\nReservo o tamanho para você?', time: '10:06' },
    ],
  },
];

export default function DemoChat() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef(null);

  const scenario = scenarios[activeIdx];

  function resetAndPlay(idx) {
    clearTimeout(timerRef.current);
    setActiveIdx(idx);
    setVisibleCount(0);
    setTyping(false);
  }

  useEffect(() => {
    const msgs = scenario.messages;
    if (visibleCount >= msgs.length) return;

    const next = msgs[visibleCount];
    // Show typing indicator before bot messages
    if (next.from === 'bot') {
      setTyping(true);
      timerRef.current = setTimeout(() => {
        setTyping(false);
        setVisibleCount(v => v + 1);
      }, 1400);
    } else {
      timerRef.current = setTimeout(() => {
        setVisibleCount(v => v + 1);
      }, 900);
    }
    return () => clearTimeout(timerRef.current);
  }, [visibleCount, activeIdx]);

  // Auto-restart loop
  useEffect(() => {
    if (visibleCount === scenario.messages.length && !typing) {
      timerRef.current = setTimeout(() => {
        setVisibleCount(0);
      }, 4000);
      return () => clearTimeout(timerRef.current);
    }
  }, [visibleCount, typing, scenario.messages.length]);

  const visibleMessages = scenario.messages.slice(0, visibleCount);

  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="badge-violet mb-4">Demo ao vivo</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Veja seu agente<br className="hidden sm:block" />
            respondendo na prática
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
            É assim que seus clientes vão ser atendidos —
            em segundos, qualquer hora do dia ou da noite.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: benefits */}
          <div className="flex-1 space-y-6 order-2 lg:order-1 w-full">

            {/* Scenario tabs */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
                Escolha um cenário:
              </p>
              <div className="flex gap-2 flex-wrap">
                {scenarios.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => resetAndPlay(i)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border"
                    style={activeIdx === i ? {
                      background: `${s.cor}20`,
                      borderColor: `${s.cor}50`,
                      color: s.cor,
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: '#64748b',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                {
                  title: 'Responde em menos de 3 segundos',
                  desc: 'Sem deixar o cliente esperando. A primeira impressão já é de eficiência.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  ),
                  color: '#dc2626',
                },
                {
                  title: 'Faz agendamentos automaticamente',
                  desc: 'Consulta disponibilidade, confirma horário e envia lembrete. Tudo sozinho.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  ),
                  color: '#8b5cf6',
                },
                {
                  title: 'Responde perguntas com sua voz',
                  desc: 'Você configura as informações do seu negócio. Ele responde exatamente do seu jeito.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  ),
                  color: '#2563eb',
                },
                {
                  title: 'Funciona 24h sem você tocar no celular',
                  desc: 'Domingos, feriados, madrugadas. Seu negócio nunca para de atender.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="19" cy="5" r="3" fill="#059669" stroke="none"/>
                    </svg>
                  ),
                  color: '#059669',
                },
              ].map(({ title, desc, icon, color }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                    style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}>
                    {icon}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm mb-0.5">{title}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="order-1 lg:order-2 flex-shrink-0 w-full max-w-[320px] mx-auto lg:mx-0">
            <div className="relative">

              {/* Glow behind phone */}
              <div className="absolute inset-[-20px] rounded-[50px] blur-3xl opacity-20 pointer-events-none transition-all duration-700"
                style={{ background: scenario.cor }} />

              {/* Phone frame */}
              <div className="relative rounded-[36px] overflow-hidden shadow-2xl"
                style={{
                  background: '#1a1a2e',
                  border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}>

                {/* Phone notch */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-24 h-5 rounded-full" style={{ background: '#0d0d1a' }} />
                </div>

                {/* Telegram header */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: '#17212b', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

                  {/* Back arrow */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 transition-all duration-500"
                    style={{ background: `linear-gradient(135deg, ${scenario.cor}, ${scenario.cor}99)` }}>
                    AI
                  </div>

                  {/* Name + status */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {scenario.botNome}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-[11px] font-medium">online agora</span>
                    </div>
                  </div>

                  {/* Menu dots */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                  </svg>
                </div>

                {/* Chat area */}
                <div className="px-3 py-4 space-y-2 overflow-hidden"
                  style={{ background: '#0d1117', minHeight: '360px' }}>

                  {/* Date label */}
                  <div className="text-center mb-4">
                    <span className="text-[10px] text-slate-600 bg-slate-800/40 px-3 py-1 rounded-full">Hoje</span>
                  </div>

                  {/* Messages */}
                  {visibleMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
                      style={{ animation: 'msgIn 0.3s ease-out forwards' }}
                    >
                      <div
                        className="max-w-[78%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed shadow-md"
                        style={msg.from === 'client' ? {
                          background: `linear-gradient(135deg, ${scenario.cor}dd, ${scenario.cor}99)`,
                          color: '#fff',
                          borderBottomRightRadius: '4px',
                        } : {
                          background: '#1e293b',
                          color: '#e2e8f0',
                          borderBottomLeftRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${msg.from === 'client' ? 'text-white/50' : 'text-slate-600'}`}>
                          {msg.time}
                          {msg.from === 'client' && (
                            <span className="ml-1">✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {typing && (
                    <div className="flex justify-start" style={{ animation: 'msgIn 0.25s ease-out forwards' }}>
                      <div className="px-4 py-3 rounded-2xl rounded-bl-[4px] flex items-center gap-1"
                        style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full"
                            style={{ animation: `typingDot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 px-3 py-3"
                  style={{ background: '#17212b', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex-1 rounded-full px-4 py-2 text-slate-600 text-xs"
                    style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.06)' }}>
                    Mensagem...
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: scenario.cor }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Home bar */}
                <div className="flex justify-center pb-2 pt-1" style={{ background: '#17212b' }}>
                  <div className="w-20 h-1 rounded-full bg-slate-600" />
                </div>
              </div>

              {/* Speed badge */}
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white text-xs font-black px-3 py-2 rounded-2xl shadow-lg shadow-green-900/50"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                &lt; 3s ⚡
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-slate-400 text-base mb-2">
            Seu agente responde assim — configurado com as informações do <strong className="text-white">seu</strong> negócio.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Em 5 minutos ele já está funcionando para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/agentes" className="btn-primary font-bold px-10 py-4 rounded-full text-base no-underline inline-block">
              Quero meu agente assim →
            </a>
            <a href="/suporte" className="btn-outline font-semibold px-8 py-4 rounded-full text-sm no-underline inline-block">
              Tenho uma dúvida antes
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
