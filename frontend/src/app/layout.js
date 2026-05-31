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
  const id = `logo_${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}_bg`} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff3a3a" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id={`${id}_shine`} x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="55%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}_eye`} x1="0" y1="0" x2="0" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#fecaca" />
        </linearGradient>
        <filter id={`${id}_glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="44" height="44" rx="12" fill={`url(#${id}_bg)`} />
      {/* Top shine */}
      <rect width="44" height="28" rx="12" fill={`url(#${id}_shine)`} />
      {/* Subtle inner border for depth */}
      <rect x="0.75" y="0.75" width="42.5" height="42.5" rx="11.5" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />

      {/* ── Robot head ── */}
      <rect x="9" y="12" width="26" height="21" rx="6.5" fill="none" stroke="white" strokeWidth="2.2" strokeOpacity="0.95" />

      {/* ── Eyes ── */}
      <rect x="13" y="18" width="6" height="6" rx="2" fill={`url(#${id}_eye)`} filter={`url(#${id}_glow)`} />
      <rect x="25" y="18" width="6" height="6" rx="2" fill={`url(#${id}_eye)`} filter={`url(#${id}_glow)`} />
      {/* Eye glow cores */}
      <rect x="14.5" y="19.5" width="3" height="3" rx="1" fill="#ff6b6b" fillOpacity="0.7" />
      <rect x="26.5" y="19.5" width="3" height="3" rx="1" fill="#ff6b6b" fillOpacity="0.7" />

      {/* ── Mouth / signal bars ── */}
      <rect x="15" y="27.5" width="4" height="2" rx="1" fill="white" fillOpacity="0.4" />
      <rect x="20" y="26.5" width="4" height="3" rx="1" fill="white" fillOpacity="0.65" />
      <rect x="25" y="25.5" width="4" height="4" rx="1" fill="white" fillOpacity="0.9" />

      {/* ── Antenna ── */}
      <line x1="22" y1="12" x2="22" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />
      <circle cx="22" cy="5.5" r="2.5" fill="white" fillOpacity="0.95" filter={`url(#${id}_glow)`} />
      <circle cx="22" cy="5.5" r="1.2" fill="#ff9999" />

      {/* ── Online indicator ── */}
      <circle cx="37" cy="37" r="4.5" fill="#0f0f1a" />
      <circle cx="37" cy="37" r="3.5" fill="#22c55e" />
      <circle cx="36" cy="36" r="1" fill="white" fillOpacity="0.5" />
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
