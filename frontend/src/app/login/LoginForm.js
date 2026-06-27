'use client';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { demoUsers, getRole } from '../../lib/auth-data';

function normalizeNext(value) {
  if (!value || !value.startsWith('/')) return '/dashboard';
  return value;
}

function getInitialToken(nextPath) {
  const wantsInternalArea = nextPath.startsWith('/admin') || nextPath.startsWith('/empresas');
  const admin = demoUsers.find((user) => user.role === 'SUPER_ADMIN');
  const owner = demoUsers.find((user) => user.role === 'OWNER') || demoUsers[0];
  return wantsInternalArea && admin ? admin.token : owner.token;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = normalizeNext(searchParams.get('next'));
  const wantsInternalArea = next.startsWith('/admin') || next.startsWith('/empresas');

  const availableUsers = useMemo(() => {
    if (wantsInternalArea) return demoUsers.filter((user) => user.role === 'SUPER_ADMIN');
    return demoUsers.filter((user) => user.role !== 'SUPER_ADMIN');
  }, [wantsInternalArea]);

  const [token, setToken] = useState(getInitialToken(next));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedUser = availableUsers.find((user) => user.token === token) || availableUsers[0];

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedUser) {
      setError('Selecione um perfil de acesso válido para continuar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: selectedUser.token }),
      });

      if (!response.ok) {
        setError('Não foi possível validar seu acesso. Confira os dados e tente novamente.');
        setLoading(false);
        return;
      }

      setSuccess('Acesso autorizado. Redirecionando para o painel...');
      router.push(next);
      router.refresh();
    } catch (err) {
      setError('Não foi possível conectar ao servidor de acesso. Tente novamente em instantes.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-[2rem] p-6 shadow-2xl shadow-red-950/20 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
          {wantsInternalArea ? 'Acesso interno autorizado' : 'Painel do cliente'}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
          {wantsInternalArea ? 'Entrar na operação Agentes AI' : 'Entrar na área da empresa'}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          {wantsInternalArea
            ? 'Use uma conta interna autorizada para gerenciar empresas, leads e módulos administrativos.'
            : 'Selecione o acesso da empresa para abrir o painel com agentes, conversas, documentos e relatórios.'}
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-white">Tipo de acesso</p>
            <p className="mt-1 text-xs text-slate-500">
              {wantsInternalArea ? 'Operação interna' : 'Cliente empresarial'}
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-200">
            Protegido
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {availableUsers.map((user) => {
          const role = getRole(user.role);
          const selected = selectedUser?.token === user.token;
          return (
            <label
              key={user.id}
              className={`block cursor-pointer rounded-3xl border p-4 transition ${
                selected ? 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-950/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  className="mt-1 accent-red-500"
                  type="radio"
                  name="user"
                  value={user.token}
                  checked={selected}
                  onChange={() => setToken(user.token)}
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-black text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-slate-300">
                      {role.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{role.description}</p>
                  <p className="mt-2 text-xs font-bold text-slate-600">Empresa: {user.companyName}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-bold text-red-200">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-200">
          {success}
        </p>
      )}

      <button disabled={loading || !selectedUser} className="btn-primary mt-6 w-full rounded-full px-6 py-4 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? 'Validando acesso...' : 'Acessar painel'}
      </button>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-relaxed text-slate-500">
        O acesso é restrito a empresas e usuários autorizados. Para solicitar uma conta, entre em contato com a Agentes AI.
      </div>
    </form>
  );
}
