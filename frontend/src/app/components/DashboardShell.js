import Link from 'next/link';
import { Container, Pill } from './ui';
import { currentTenant } from '../../lib/tenant';
import { getCurrentSession } from '../../lib/auth';
import { getRole } from '../../lib/auth-data';

const nav = [
  ['Visão geral', '/dashboard', '📊'],
  ['Meus agentes', '/meus-agentes', '🤖'],
  ['Conversas', '/conversas', '💬'],
  ['Operação', '/operacao', '✅'],
  ['IA Lab', '/ia-lab', '🧠'],
  ['Integrações', '/integracoes', '🔌'],
  ['Documentos', '/documentos', '📚'],
  ['Usuários', '/usuarios', '👥'],
  ['Configurações', '/configuracoes', '⚙️'],
  ['Suporte', '/suporte', '🛟'],
];

export function DashboardShell({ eyebrow = 'Área da empresa', title, description, children, actions }) {
  const session = getCurrentSession();
  const tenant = session.company || currentTenant;
  const user = session.user;
  const role = getRole(user?.role || 'VIEWER');

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <Container>
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
          <aside className="card rounded-3xl p-4 lg:sticky lg:top-28">
            <div className="px-3 py-3 border-b border-white/10 mb-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 font-black">Área da empresa</p>
              <h2 className="mt-2 font-black text-white">{tenant.nome}</h2>
              <p className="text-sm text-slate-500">{tenant.plano} • {tenant.etapaImplantacao}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="green">{tenant.status}</Pill>
                <Pill>Dados separados</Pill>
              </div>
            </div>

            <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-sm font-black text-red-200 border border-red-500/20">{user?.avatar || 'AI'}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{user?.name || 'Usuário autorizado'}</p>
                  <p className="truncate text-xs text-slate-500">{role.label}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {nav.map(([label, href, icon]) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-400 no-underline hover:bg-white/5 hover:text-white">
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">Ambiente protegido</p>
              <p className="mt-2 text-xs leading-relaxed text-red-100/80">Dados, agentes e conversas vinculados apenas a esta empresa.</p>
            </div>

            <div className="mt-4 grid gap-2">
              <Link href="/pre-cadastro" className="btn-primary flex rounded-2xl px-4 py-3 text-center text-sm font-black no-underline justify-center">Solicitar novo agente</Link>
              <Link href="/logout" className="btn-outline flex rounded-2xl px-4 py-3 text-center text-sm font-black no-underline justify-center">Sair</Link>
            </div>
          </aside>

          <section>
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-red-300 font-black uppercase tracking-[0.25em] text-xs">{eyebrow}</p>
                <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight">{title}</h1>
                {description && <p className="mt-4 max-w-3xl text-slate-400 leading-relaxed">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
            {children}
          </section>
        </div>
      </Container>
    </main>
  );
}

export function AdminShell({ title, description, children }) {
  const session = getCurrentSession();
  const user = session.user;

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-red-300 font-black uppercase tracking-[0.25em] text-xs">Painel interno</p>
            <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight">{title}</h1>
            {description && <p className="mt-4 max-w-3xl text-slate-400 leading-relaxed">{description}</p>}
            {user && <p className="mt-3 text-sm text-slate-500">Sessão: <strong className="text-slate-300">{user.name}</strong> • {getRole(user.role).label}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/conversas" className="btn-primary rounded-full px-5 py-3 text-sm font-black no-underline">Conversas</Link>
            <Link href="/admin/operacao" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Operação</Link>
            <Link href="/admin/integracoes" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Integrações</Link>
            <Link href="/empresas" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Empresas</Link>
            <Link href="/admin/contratacoes" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Contratações</Link>
            <Link href="/usuarios" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Usuários</Link>
            <Link href="/dashboard" className="btn-outline rounded-full px-5 py-3 text-sm font-black no-underline">Área da empresa</Link>
          </div>
        </div>
        {children}
      </Container>
    </main>
  );
}
