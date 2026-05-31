'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>AgentesIA — Automatize seu negócio com Inteligência Artificial</title>
        <meta name="description" content="Agentes de IA prontos para o seu negócio. Atendimento 24h, vendas e agendamentos automáticos. Ative em 5 minutos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AgentesIA — Automatize seu negócio" />
        <meta property="og:description" content="Agentes de IA que trabalham 24h por você. Sem contratar ninguém." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
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

/* ─── Logo SVG ─── */
function Logo({ size = 38 }) {
  const id = `lg${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}_bg`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1a0404" />
          <stop offset="100%" stopColor="#050508" />
        </radialGradient>
        <filter id={`${id}_glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ─── HEAD CIRCLE ─── */}
      <circle cx="60" cy="60" r="46" fill={`url(#${id}_bg)`} />
      {/* Outer ring — vermelho, principal */}
      <circle cx="60" cy="60" r="46" fill="none" stroke="#dc2626" strokeWidth="4.5" />
      {/* Inner ring — branco sutil */}
      <circle cx="60" cy="60" r="41" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.12" />

      {/* ─── COROA / CROWN ─── */}
      {/* Haste central */}
      <line x1="60" y1="14" x2="60" y2="6" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Asa esquerda */}
      <path d="M 60 10 Q 50 5 44 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Asa direita */}
      <path d="M 60 10 Q 70 5 76 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Gema central */}
      <circle cx="60" cy="5.5" r="4" fill="#dc2626" filter={`url(#${id}_glow)`} />
      <circle cx="60" cy="5.5" r="2" fill="white" fillOpacity="0.9" />

      {/* ─── SOBRANCELHA / BROW ─── */}
      <path d="M 34 46 Q 47 39 60 39 Q 73 39 86 46"
        fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

      {/* ─── OLHO ESQUERDO (diamante) ─── */}
      <path d="M 34 57 L 46 46 L 58 57 L 46 68 Z" fill="white" />
      <circle cx="46" cy="57" r="6" fill="#0d000a" />
      <circle cx="46" cy="57" r="3" fill="#dc2626" filter={`url(#${id}_glow)`} />
      {/* Reflexo */}
      <circle cx="44.2" cy="55.2" r="1.3" fill="white" fillOpacity="0.85" />

      {/* ─── OLHO DIREITO (diamante) ─── */}
      <path d="M 62 57 L 74 46 L 86 57 L 74 68 Z" fill="white" />
      <circle cx="74" cy="57" r="6" fill="#0d000a" />
      <circle cx="74" cy="57" r="3" fill="#dc2626" filter={`url(#${id}_glow)`} />
      {/* Reflexo */}
      <circle cx="72.2" cy="55.2" r="1.3" fill="white" fillOpacity="0.85" />

      {/* ─── NARIZ ─── */}
      <line x1="60" y1="68" x2="60" y2="79" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 54 79 Q 60 79 66 79" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" />

      {/* ─── BOCA ─── */}
      <path d="M 47 88 Q 60 98 73 88"
        fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

      {/* ─── QUEIXO / CHIN ─── */}
      <path d="M 54 99 Q 60 105 66 99"
        fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.35" />

      {/* ─── LINHAS DE CIRCUITO — ESQUERDA ─── */}
      {/* Linha L superior com dot vermelho */}
      <path d="M 16 50 L 7 50 L 7 34"
        fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="34" r="4" fill="#dc2626" filter={`url(#${id}_glow)`} />
      <circle cx="7" cy="34" r="2" fill="white" fillOpacity="0.7" />
      {/* Linha L central */}
      <line x1="14" y1="65" x2="3" y2="65"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <circle cx="3" cy="65" r="2.5" fill="white" fillOpacity="0.6" />
      {/* Linha L inferior */}
      <path d="M 19 80 L 10 88"
        fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.25" />

      {/* ─── LINHAS DE CIRCUITO — DIREITA ─── */}
      {/* Linha R superior com dot vermelho */}
      <path d="M 104 50 L 113 50 L 113 34"
        fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="113" cy="34" r="4" fill="#dc2626" filter={`url(#${id}_glow)`} />
      <circle cx="113" cy="34" r="2" fill="white" fillOpacity="0.7" />
      {/* Linha R central */}
      <line x1="106" y1="65" x2="117" y2="65"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <circle cx="117" cy="65" r="2.5" fill="white" fillOpacity="0.6" />
      {/* Linha R inferior */}
      <path d="M 101 80 L 110 88"
        fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.25" />
    </svg>
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#050508]/92 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/40' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group" onClick={close}>
          <div className="group-hover:scale-105 transition-transform duration-200">
            <Logo size={38} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[18px] text-white tracking-tight">
              Agentes<span className="text-red-500">IA</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">Automação inteligente</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <Link key={label} href={href}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors no-underline relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-red-500 after:transition-all hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/pre-cadastro" className="text-slate-400 hover:text-white text-sm font-medium no-underline transition-colors">
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
          <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-[#050508]/98 backdrop-blur-2xl ${open ? 'max-h-96 opacity-100 border-b border-white/[0.05]' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-6 py-6 gap-1">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={close}
              className="text-slate-300 hover:text-white text-base font-medium no-underline py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-all"
            >
              {label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-3">
            <Link href="/agentes" onClick={close} className="btn-primary font-bold px-6 py-3.5 rounded-full text-sm no-underline text-center block">
              Contratar agora →
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
      className="fixed bottom-6 right-6 z-40 no-underline group flex items-center gap-0"
      title="Suporte 24h"
    >
      <span className="overflow-hidden w-0 group-hover:w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out bg-red-600 text-white font-bold text-sm rounded-l-full py-[14px] whitespace-nowrap shadow-xl shadow-red-900/40 select-none pointer-events-none flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 px-3">
          Precisa de ajuda?
        </span>
      </span>
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl shadow-xl shadow-red-900/50 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
        💬
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#030305]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={34} />
              <div className="flex flex-col leading-none">
                <span className="font-black text-[17px] text-white">Agentes<span className="text-red-500">IA</span></span>
                <span className="text-[10px] text-slate-500 font-medium">Automação inteligente</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Agentes de IA criados para donos de negócio que querem crescer sem contratar mais funcionários.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Todos os sistemas operando
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <p className="text-white font-bold text-sm mb-4">Produto</p>
              <div className="flex flex-col gap-3">
                {[['Ver agentes', '/agentes'], ['Preços', '/#precos'], ['Como funciona', '/#como-funciona'], ['Pré-cadastro', '/pre-cadastro']].map(([l, h]) => (
                  <Link key={l} href={h} className="text-slate-500 hover:text-slate-300 text-sm no-underline transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-4">Suporte</p>
              <div className="flex flex-col gap-3">
                {[['Falar com IA', '/suporte'], ['Termos de Uso', '/termos'], ['Privacidade', '/privacidade']].map(([l, h]) => (
                  <Link key={l} href={h} className="text-slate-500 hover:text-slate-300 text-sm no-underline transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-4">Contato</p>
              <div className="flex flex-col gap-3">
                <p className="text-slate-500 text-sm">Suporte 24h via IA</p>
                <Link href="/suporte" className="text-red-400 hover:text-red-300 text-sm no-underline font-semibold transition-colors">→ Abrir chat</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-glow mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} AgentesIA — Todos os direitos reservados</p>
          <p className="text-slate-700 text-xs">Feito com ❤️ para donos de negócio brasileiros</p>
        </div>
      </div>
    </footer>
  );
}
