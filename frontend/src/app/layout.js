'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>AgentesIA — Automatize seu negócio com Inteligência Artificial</title>
        <meta name="description" content="Agentes de IA prontos para o seu negócio." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha menu ao clicar em link
  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0d1a]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline" onClick={closeMenu}>
          <div className="w-9 h-9 btn-gradient rounded-[10px] flex items-center justify-center text-lg">
            🤖
          </div>
          <span className="font-extrabold text-lg text-white">AgentesIA</span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            ['Agentes', '/agentes'],
            ['Como funciona', '/#como-funciona'],
            ['Preços', '/#precos'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors no-underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <Link
          href="/agentes"
          className="hidden md:inline-flex btn-gradient text-white font-bold px-5 py-2.5 rounded-full text-sm no-underline"
        >
          Começar agora
        </Link>

        {/* Hamburger Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-transparent border-none cursor-pointer"
          aria-label="Menu"
        >
          <span
            className={`block w-5 h-[2px] bg-white transition-all duration-300 ${
              open ? 'rotate-45 translate-y-[5px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-white transition-all duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-white transition-all duration-300 ${
              open ? '-rotate-45 -translate-y-[5px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0b0d1a]/98 backdrop-blur-xl border-b border-white/[0.06] ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-6 py-6 gap-4">
          {[
            ['Agentes', '/agentes'],
            ['Como funciona', '/#como-funciona'],
            ['Preços', '/#precos'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={closeMenu}
              className="text-slate-300 hover:text-white text-base font-medium transition-colors no-underline py-2"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/agentes"
            onClick={closeMenu}
            className="btn-gradient text-white font-bold px-5 py-3 rounded-full text-sm no-underline text-center mt-2"
          >
            Começar agora →
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0b0d1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center text-base">
              🤖
            </div>
            <span className="font-bold text-white">AgentesIA</span>
          </div>

          {/* Copyright */}
          <p className="text-slate-600 text-sm text-center">
            © {new Date().getFullYear()} AgentesIA — Todos os direitos reservados
          </p>

          {/* Links */}
          <div className="flex gap-6">
            {[
              ['Agentes', '/agentes'],
              ['Termos', '#'],
              ['Privacidade', '#'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-slate-500 hover:text-slate-300 text-sm no-underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
