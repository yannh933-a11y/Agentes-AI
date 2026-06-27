import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { Container } from '../components/ui';

export const metadata = {
  title: 'Login | Agentes AI',
  description: 'Acesse o painel empresarial da Agentes AI para acompanhar agentes, conversas, documentos, configurações e relatórios.',
};

const highlights = [
  'Acompanhe seus agentes ativos',
  'Veja conversas e solicitações',
  'Organize documentos e regras',
  'Gerencie configurações da empresa',
];

const metrics = [
  { value: '24h', label: 'painel disponível' },
  { value: '1', label: 'ambiente por empresa' },
  { value: '100%', label: 'acesso protegido' },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(239,68,68,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(148,163,184,0.12),transparent_28%)]" />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Acesso empresarial</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
              Acesse o painel da sua empresa
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
              Entre para acompanhar seus agentes, conversas, documentos, configurações e relatórios.
            </p>
            <p className="mt-4 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300">
              Área exclusiva para clientes Agentes AI.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-300">
                  <span className="mr-2 text-emerald-300">✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="text-2xl font-black text-white">{metric.value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="btn-outline inline-flex justify-center rounded-full px-5 py-3 text-sm font-black no-underline">
                Voltar ao site
              </Link>
              <Link href="/contato" className="inline-flex justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-slate-200 no-underline transition hover:bg-white/[0.08]">
                Preciso de ajuda para acessar
              </Link>
            </div>
          </section>

          <Suspense fallback={<div className="card rounded-[2rem] p-8 text-slate-400">Preparando acesso...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
