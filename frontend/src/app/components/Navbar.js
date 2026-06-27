'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const publicLinks = [
  ['Agentes', '/agentes'],
  ['Demo', '/demo'],
  ['IA Lab', '/ia-lab'],
  ['Planos', '/planos'],
  ['Contato', '/contato'],
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Agentes AI - Página inicial">
      <img src="/agentes-ai-mark.svg" alt="Agentes AI" className="h-10 w-10 shrink-0" />
      <div className="leading-none">
        <div className="font-black text-white text-lg tracking-tight">
          Agentes <span className="text-red-500">AI</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">AI Agents</div>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled ? 'bg-[#06060d]/90 border-b border-white/10 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
          {publicLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 no-underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex gap-3">
          <Link href="/login" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white no-underline">
            Entrar
          </Link>
          <Link href="/pre-cadastro" className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold no-underline">
            Solicitar agente
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl bg-transparent border-0"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? '×' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#06060d] px-5 pb-5 shadow-2xl shadow-black/40">
          <nav className="flex flex-col gap-2 pt-4" aria-label="Navegação mobile">
            {publicLinks.map(([label, href]) => (
              <Link onClick={closeMenu} key={href} href={href} className="p-3 rounded-xl text-slate-300 no-underline hover:bg-white/5">
                {label}
              </Link>
            ))}
            <Link onClick={closeMenu} href="/login" className="p-3 rounded-xl text-slate-300 no-underline hover:bg-white/5">
              Entrar
            </Link>
            <Link onClick={closeMenu} href="/pre-cadastro" className="btn-primary rounded-full px-5 py-3 text-center font-bold no-underline">
              Solicitar agente
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
