import Link from 'next/link';
import { Container, Card } from '../components/ui';

export const metadata = { title: 'Acesso negado | Agentes AI' };

export default function AcessoNegado() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <Container className="max-w-4xl">
        <Card className="text-center p-8 sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Permissão insuficiente</p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">Acesso negado</h1>
          <p className="mx-auto mt-5 max-w-2xl text-slate-400 leading-relaxed">Sua sessão não possui permissão para acessar este módulo. Entre com perfil administrativo ou volte para a área da empresa.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?next=/admin" className="btn-primary rounded-full px-6 py-3 text-sm font-black no-underline">Entrar como admin</Link>
            <Link href="/dashboard" className="btn-outline rounded-full px-6 py-3 text-sm font-black no-underline">Voltar ao dashboard</Link>
          </div>
        </Card>
      </Container>
    </main>
  );
}
