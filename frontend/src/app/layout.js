'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>OpenClaw — Agentes de IA exclusivos para empresas</title>
        <meta name="description" content="Crie agentes de IA exclusivos para empresas: atendimento, vendas, agendamento e suporte em um chat simples e profissional." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="OpenClaw — Agentes de IA para empresas" />
        <meta property="og:description" content="Agentes exclusivos para atendimento, vendas e automação empresarial." />
        <meta property="og:image" content="/openclaw-logo.svg" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/openclaw-logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <BotaoSuporte />
      </body>
    </html>
  );
}

/* ─── Logo ─── */
function Logo({ size = 38 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: 'linear-gradient(135deg, rgba(255,69,69,0.22), rgba(127,29,29,0.12))',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(220,38,38,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.14)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{width: size * 0.56, height: size * 0.56, border: '3px solid #ff4545', borderRadius: '50%', position: 'relative'}}>
        <span style={{position: 'absolute', width: size * 0.18, height: size * 0.18, borderRadius: '50%', background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />
        <span style={{position: 'absolute', width: size * 0.34, height: 3, borderRadius: 999, background: '#ff4545', right: -size * 0.32, top: '50%', transform: 'translateY(-50%)'}} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  const links = [
    ['Agentes', '/agentes'],
    ['Como funciona', '/#como-funciona'],
    ['Preços', '/#precos'],
    ['Suporte', '/suporte'],
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#07070f]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group" onClick={close}>
          <div className="group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Logo size={38} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[18px] text-white tracking-tight" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
              Open<span className="text-red-500">Claw</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider">Agentes exclusivos</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(([label, href]) => (
            <Link key={label} href={href}
              className="text-slate-400 hover:text-white text-sm font-medium transition-all duration-200 no-underline px-4 py-2 rounded-full hover:bg-white/[0.05]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/pre-cadastro" className="text-slate-400 hover:text-white text-sm font-medium no-underline transition-colors px-3 py-2">
            Pré-cadastro
          </Link>
          <Link href="/agentes" className="btn-primary font-bold px-6 py-2.5 rounded-full text-sm no-underline">
            Contratar →
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] bg-transparent border-none cursor-pointer"
          aria-label="Menu"
        >
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 bg-[#07070f]/98 backdrop-blur-2xl ${open ? 'max-h-[500px] opacity-100 border-b border-white/[0.05]' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-6 py-6 gap-1">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={close}
              className="text-slate-300 hover:text-white text-base font-medium no-underline py-3 px-4 rounded-xl hover:bg-white/[0.04] transition-all"
            >
              {label}
            </Link>
          ))}
          <div className="mt-5 pt-5 border-t border-white/[0.06] flex flex-col gap-3">
            <Link href="/agentes" onClick={close} className="btn-primary font-bold px-6 py-3.5 rounded-full text-sm no-underline text-center block">
              Contratar agente →
            </Link>
            <Link href="/pre-cadastro" onClick={close} className="btn-outline font-semibold px-6 py-3 rounded-full text-sm no-underline text-center block">
              Fazer pré-cadastro
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   BOTÃO FLUTUANTE SUPORTE
   ═══════════════════════════════════════════ */
function BotaoSuporte() {
  return (
    <Link href="/suporte"
      className="fixed bottom-6 right-6 z-40 no-underline group flex flex-col items-center gap-2"
    >
      {/* Tooltip */}
      <span className="
        opacity-0 group-hover:opacity-100
        translate-y-2 group-hover:translate-y-0
        transition-all duration-250
        bg-[#0d0d1e] text-white text-xs font-semibold
        px-3 py-1.5 rounded-lg whitespace-nowrap
        border border-white/[0.08] shadow-xl
        pointer-events-none select-none
      ">
        💬 Suporte 24h
      </span>
      {/* Ring animation */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{animationDuration: '2.5s'}} />
        <div className="
          w-14 h-14 rounded-full
          bg-gradient-to-br from-red-500 to-red-700
          flex items-center justify-center text-2xl emoji
          shadow-xl shadow-red-900/60
          transition-all duration-300
          group-hover:scale-110 group-hover:shadow-red-900/80
          border border-red-400/20
          relative z-10
        ">
          💬
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/[0.05]" style={{background: '#040408'}}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-14">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-5">
              <Logo size={34} />
              <div className="flex flex-col leading-none">
                <span className="font-black text-[17px] text-white" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
                  Open<span className="text-red-500">Claw</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider">Agentes exclusivos</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Agentes de IA exclusivos para empresas que querem automatizar atendimento, vendas e suporte sem criar uma operação técnica complexa.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/[0.05] border border-green-500/10 w-fit">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-green-400 text-xs font-medium">✅ Todos os sistemas operando</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <p className="text-white font-bold text-sm mb-5" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>Produto</p>
              <div className="flex flex-col gap-3">
                {[['Ver agentes', '/agentes'], ['Preços', '/#precos'], ['Como funciona', '/#como-funciona'], ['Pré-cadastro', '/pre-cadastro']].map(([l, h]) => (
                  <Link key={l} href={h} className="text-slate-500 hover:text-slate-200 text-sm no-underline transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-5" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>Suporte</p>
              <div className="flex flex-col gap-3">
                {[['Falar com IA', '/suporte'], ['Termos de Uso', '/termos'], ['Privacidade', '/privacidade']].map(([l, h]) => (
                  <Link key={l} href={h} className="text-slate-500 hover:text-slate-200 text-sm no-underline transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-5" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>Contato</p>
              <div className="flex flex-col gap-3">
                <p className="text-slate-500 text-sm">Suporte 24h via IA</p>
                <Link href="/suporte" className="text-red-400 hover:text-red-300 text-sm no-underline font-semibold transition-colors inline-flex items-center gap-1">
                  Abrir chat <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-glow mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} OpenClaw — Todos os direitos reservados</p>
          <p className="text-slate-700 text-xs flex items-center gap-1">
            Construído para empresas que querem vender e atender melhor com IA
          </p>
        </div>
      </div>
    </footer>
  );
}
