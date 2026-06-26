import { DashboardShell } from '../components/DashboardShell';
import { Card, Pill } from '../components/ui';
import { tenantUsers, currentTenant } from '../../lib/tenant';
import { authChecklist, getPermissionsForRole, roles } from '../../lib/auth-data';
import { getCurrentSession } from '../../lib/auth';

export const metadata = { title: 'Usuários e permissões | Agentes AI' };

export default function UsuariosPage() {
  const session = getCurrentSession();
  const users = tenantUsers.map((user) => ({
    ...user,
    roleLabel: roles[user.role?.toUpperCase()]?.label || user.role,
  }));
  const activeRole = session.user?.role || 'OWNER';
  const permissions = getPermissionsForRole(activeRole);

  return (
    <DashboardShell
      eyebrow="Segurança e acesso"
      title="Usuários e permissões"
      description="Controle visual dos perfis que acessam a área da empresa. Esta sprint prepara o sistema para login real, RBAC e isolamento por empresa."
    >
      <Card className="mb-6 border-red-500/20 bg-red-500/[0.05]">
        <div className="grid lg:grid-cols-[1fr_.8fr] gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-200 font-black">Sessão atual</p>
            <h2 className="mt-2 text-2xl font-black text-white">{session.user?.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Perfil: <strong className="text-red-100">{roles[activeRole]?.label}</strong>. Empresa vinculada: <strong className="text-red-100">{session.company?.nome || currentTenant.nome}</strong>.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Info label="companyId" value={session.user?.companyId || currentTenant.id} />
            <Info label="role" value={activeRole} />
          </div>
        </div>
      </Card>

      <div className="grid xl:grid-cols-[1.1fr_.9fr] gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-black">Equipe da empresa</h2>
              <p className="text-sm text-slate-500">Usuários vinculados ao tenant atual.</p>
            </div>
            <Pill tone="green">RBAC pronto</Pill>
          </div>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-black text-white">{user.nome}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone={user.status === 'Ativa' ? 'green' : 'default'}>{user.status}</Pill>
                    <Pill>{user.roleLabel}</Pill>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black mb-2">Permissões da sessão</h2>
          <p className="text-sm text-slate-500 mb-5">Matriz calculada pelo papel atual.</p>
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div key={permission.key} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="font-black text-white">{permission.label}</p>
                  <p className="text-xs text-slate-600">{permission.key}</p>
                </div>
                <Pill tone={permission.enabled ? 'green' : 'default'}>{permission.enabled ? 'Permitido' : 'Bloqueado'}</Pill>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {authChecklist.map((item) => (
          <Card key={item} className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">✓</div>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{item}</p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-[#07070f] p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-slate-600 font-black">{label}</p><p className="mt-2 break-all text-sm font-bold text-slate-300">{value}</p></div>;
}
