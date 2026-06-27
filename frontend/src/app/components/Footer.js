import Link from 'next/link';
import { Logo } from './Navbar';

const footerSections = [
  {
    title: 'Produto',
    links: [
      ['Agentes', '/agentes'],
      ['Demo', '/demo'],
      ['IA Lab', '/ia-lab'],
      ['Planos', '/planos'],
    ],
  },
  {
    title: 'Empresa',
    links: [
      ['Contato', '/contato'],
      ['Suporte', '/suporte'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacidade', '/privacidade'],
      ['Termos', '/termos'],
    ],
  },
  {
    title: 'Acesso',
    links: [['Entrar', '/login']],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040408]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_repeat(4,0.75fr)]">
        <div>
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-slate-500 max-w-sm">
            Plataforma para vender, configurar e operar agentes de IA exclusivos para empresas.
          </p>
          <Link href="/pre-cadastro" className="btn-primary inline-flex mt-6 rounded-full px-5 py-3 text-sm font-bold no-underline">
            Solicitar agente
          </Link>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-black text-white mb-4">{section.title}</h3>
            {section.links.map(([label, href]) => (
              <FooterLink key={href} href={href}>
                {label}
              </FooterLink>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 border-t border-white/10 text-xs text-slate-600 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Agentes AI. Todos os direitos reservados.</span>
        <span>Agentes de IA para atendimento, vendas, suporte e automação empresarial.</span>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link href={href} className="block text-sm text-slate-500 hover:text-white no-underline mb-2">
      {children}
    </Link>
  );
}
