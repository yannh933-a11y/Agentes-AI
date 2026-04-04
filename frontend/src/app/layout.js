import './globals.css';

export const metadata = {
  title: 'Agentes IA — Automatize seu negócio com inteligência artificial',
  description: 'Agentes de IA prontos para o seu negócio. Atendimento, vendas, agendamento e muito mais.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
