import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { Container } from '../components/ui';

export const metadata = { title: 'Login | Agentes AI' };

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <Container>
        <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8 items-center">
          <div>
            <p className="text-red-300 font-black uppercase tracking-[0.25em] text-xs">Acesso empresarial</p>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">Área protegida para empresas e administradores.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">A Sprint 4 adiciona base de autenticação, papéis de usuário, permissões e separação clara entre cliente e painel interno.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {['Rotas protegidas', 'Papéis e permissões', 'Sessão por cookie', 'Admin separado'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-300">✓ {item}</div>
              ))}
            </div>
            <Link href="/" className="btn-outline mt-6 inline-flex rounded-full px-5 py-3 text-sm font-black no-underline">Voltar ao site</Link>
          </div>
          <Suspense fallback={<div className="card rounded-[2rem] p-8 text-slate-400">Carregando login...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
