import './globals.css';

export const metadata = {
  title: 'AgentesIA — Automatize seu negócio com Inteligência Artificial',
  description: 'Agentes de IA prontos para o seu negócio. Atendimento 24h, vendas automáticas, agendamento e muito mais. Sem contratar funcionários.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#060818] text-white antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#060818]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-lg tracking-tight">AgentesIA</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="/agentes" className="hover:text-white transition">Agentes</a>
          <a href="#como-funciona" className="hover:text-white transition">Como funciona</a>
          <a href="#depoimentos" className="hover:text-white transition">Depoimentos</a>
        </nav>
        <a
          href="/agentes"
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
        >
          Ver agentes →
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-semibold text-slate-400">AgentesIA</span>
        </div>
        <p>© {new Date().getFullYear()} AgentesIA — Todos os direitos reservados</p>
        <div className="flex gap-6">
          <a href="/agentes" className="hover:text-slate-300 transition">Agentes</a>
          <a href="#" className="hover:text-slate-300 transition">Termos</a>
          <a href="#" className="hover:text-slate-300 transition">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
