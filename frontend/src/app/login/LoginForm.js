'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { demoUsers, getRole } from '../../lib/auth-data';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const [token, setToken] = useState('demo-owner-clinica');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      setError('Não foi possível iniciar sessão. Tente novamente.');
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-[2rem] p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">Sessão demo protegida</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-white">Entrar na Agentes AI</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">Escolha um perfil para testar permissões, isolamento por empresa e acesso administrativo. Na próxima etapa, isso pode ser conectado a autenticação real.</p>
      </div>

      <div className="space-y-3">
        {demoUsers.map((user) => {
          const role = getRole(user.role);
          const selected = token === user.token;
          return (
            <label key={user.id} className={`block cursor-pointer rounded-3xl border p-4 transition ${selected ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
              <div className="flex items-start gap-4">
                <input className="mt-1 accent-red-500" type="radio" name="user" value={user.token} checked={selected} onChange={() => setToken(user.token)} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-black text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-slate-300">{role.label}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{role.description}</p>
                  <p className="mt-2 text-xs font-bold text-slate-600">Empresa: {user.companyName}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-bold text-red-200">{error}</p>}

      <button disabled={loading} className="btn-primary mt-6 w-full rounded-full px-6 py-4 text-sm font-black disabled:opacity-60">
        {loading ? 'Entrando...' : 'Entrar na área protegida'}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-600">Este login é uma camada demo segura para desenvolvimento. Não use senhas reais aqui.</p>
    </form>
  );
}
