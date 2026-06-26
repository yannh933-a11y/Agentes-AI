import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  metadataBase: new URL('https://agentes-ai-two.vercel.app'),
  title: 'Agentes AI — Agentes de IA exclusivos para empresas',
  description: 'Venda, atenda e automatize com agentes de IA exclusivos por empresa. Catálogo de agentes, pré-cadastro, planos e área da empresa.',
  openGraph: {
    title: 'Agentes AI — Agentes de IA para empresas',
    description: 'Agentes exclusivos para atendimento, vendas, suporte e automação empresarial.',
    images: ['/agentes-ai-logo.svg']
  },
  icons: { icon: '/favicon.svg', apple: '/agentes-ai-mark.svg' }
};

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body><Navbar />{children}<Footer /></body></html>;
}
