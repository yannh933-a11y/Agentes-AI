'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>AgentesIA — Automatize seu negócio com Inteligência Artificial</title>
        <meta name="description" content="Agentes de IA prontos para o seu negócio. Atendimento 24h, vendas e agendamentos automáticos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050508]/90 backdrop-blur-2xl border-b border-white/[0.05] shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group" onClick={close}>
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-red-900/20 group-hover:shadow-red-600/30 transition-shadow">
            🤖
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Agentes<span className="text-red-500">IA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors no-underline relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-red-500 after:transition-all hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/agentes"
          className="hidden md:inline-flex btn-primary font-bold px-6 py-2.5 rounded-full text-sm no-underline"
        >
          Começar agora
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
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
            <Link
              key={label}
              href={href}
              onClick={close}
              className="text-slate-300 hover:text-white text-base font-medium no-underline py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-all"
            >
              {label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <Link
              href="/agentes"
              onClick={close}
              className="btn-primary font-bold px-6 py-3.5 rounded-full text-sm no-underline text-center block"
            >
              Começar agora →
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
    <Link
      href="/suporte"
      className="fixed bottom-6 right-6 z-40 no-underline group flex items-center gap-0"
      title="Suporte 24h"
    >
      {/* Label "Suporte" — aparece no hover */}
      <span
        className="
          overflow-hidden w-0 group-hover:w-[90px]
          opacity-0 group-hover:opacity-100
          transition-all duration-500 ease-in-out
          bg-red-600 text-black font-black text-sm
          rounded-l-full py-2
          whitespace-nowrap shadow-xl shadow-red-900/40
          select-none pointer-events-none
          flex items-center justify-center
        "
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 px-3">
          Suporte
        </span>
      </span>

      {/* Bolinha */}
      <div
        className="
          w-14 h-14 rounded-full
          bg-red-600
          flex items-center justify-center text-2xl
          shadow-xl shadow-red-900/40
          transition-transform duration-700 ease-in-out
          group-hover:rotate-[360deg]
        "
      >
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
    <footer className="border-t border-white/[0.05] bg-[#050508]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 md:py-16">
        {/* Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-base">🤖</div>
              <span className="font-extrabold text-lg text-white">Agentes<span className="text-red-500">IA</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">Agentes de inteligência artificial prontos para automatizar seu negócio.</p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-white font-semibold text-sm mb-3">Produto</p>
              <div className="flex flex-col gap-2">
                {[['Agentes', '/agentes'], ['Preços', '/#precos'], ['Pré-cadastro', '/pre-cadastro']].map(([l, h]) => (
                  <Link key={l} href={h} className="text-slate-500 hover:text-slate-300 text-sm no-underline transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Empresa</p>
              <div className="flex flex-col gap-2">
                {[['Suporte', '/suporte'], ['Termos de Uso', '/termos'], ['Privacidade', '/privacidade']].map(([l, h]) => (
                  <Link key={l} href={h} className="text-slate-500 hover:text-slate-300 text-sm no-underline transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-glow mb-6" />

        {/* Bottom */}
        <p className="text-slate-600 text-xs text-center sm:text-left">
          © {new Date().getFullYear()} AgentesIA — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
