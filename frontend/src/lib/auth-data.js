import { companies, currentTenant } from './tenant';

export const SESSION_COOKIE = 'agentes_ai_session';

export const roles = {
  OWNER: {
    label: 'Dono da empresa',
    level: 80,
    description: 'Gerencia agentes, usuários, documentos, integrações e cobrança da própria empresa.',
  },
  ADMIN: {
    label: 'Administrador',
    level: 70,
    description: 'Gerencia operação, documentos, conversas e configurações da empresa.',
  },
  MEMBER: {
    label: 'Operador',
    level: 40,
    description: 'Acompanha conversas, revisa respostas e atualiza conteúdos permitidos.',
  },
  VIEWER: {
    label: 'Visualizador',
    level: 10,
    description: 'Acompanha métricas e conversas sem alterar configurações críticas.',
  },
  SUPER_ADMIN: {
    label: 'Admin Agentes AI',
    level: 100,
    description: 'Acesso interno para gerenciar empresas, leads, planos, suporte e auditoria.',
  },
};

export const permissions = [
  { key: 'dashboard.view', label: 'Ver dashboard', roles: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER', 'SUPER_ADMIN'] },
  { key: 'agents.manage', label: 'Gerenciar agentes', roles: ['OWNER', 'ADMIN', 'SUPER_ADMIN'] },
  { key: 'chats.manage', label: 'Gerenciar conversas', roles: ['OWNER', 'ADMIN', 'MEMBER', 'SUPER_ADMIN'] },
  { key: 'operation.manage', label: 'Gerenciar operação assistida', roles: ['OWNER', 'ADMIN', 'MEMBER', 'SUPER_ADMIN'] },
  { key: 'documents.manage', label: 'Gerenciar documentos', roles: ['OWNER', 'ADMIN', 'MEMBER', 'SUPER_ADMIN'] },
  { key: 'settings.manage', label: 'Alterar configurações', roles: ['OWNER', 'ADMIN', 'SUPER_ADMIN'] },
  { key: 'integrations.manage', label: 'Gerenciar integrações', roles: ['OWNER', 'ADMIN', 'SUPER_ADMIN'] },
  { key: 'users.manage', label: 'Gerenciar usuários', roles: ['OWNER', 'ADMIN', 'SUPER_ADMIN'] },
  { key: 'billing.manage', label: 'Gerenciar cobrança', roles: ['OWNER', 'SUPER_ADMIN'] },
  { key: 'admin.access', label: 'Acessar painel interno', roles: ['SUPER_ADMIN'] },
  { key: 'tenants.manage', label: 'Gerenciar empresas', roles: ['SUPER_ADMIN'] },
];

export const demoUsers = [
  {
    id: 'usr-agentes-admin',
    token: 'demo-super-admin',
    name: 'Admin Agentes AI',
    email: 'admin@agentesai.com.br',
    role: 'SUPER_ADMIN',
    companyId: 'agentes-ai-interno',
    companyName: 'Agentes AI',
    avatar: 'AI',
  },
  {
    id: 'usr-owner-clinica',
    token: 'demo-owner-clinica',
    name: 'Fernanda Lima',
    email: 'fernanda@clinicaprime.com.br',
    role: 'OWNER',
    companyId: currentTenant.id,
    companyName: currentTenant.nome,
    avatar: 'FL',
  },
  {
    id: 'usr-admin-clinica',
    token: 'demo-admin-clinica',
    name: 'Camila Rocha',
    email: 'camila@clinicaprime.com.br',
    role: 'ADMIN',
    companyId: currentTenant.id,
    companyName: currentTenant.nome,
    avatar: 'CR',
  },
  {
    id: 'usr-member-clinica',
    token: 'demo-member-clinica',
    name: 'Equipe Recepção',
    email: 'recepcao@clinicaprime.com.br',
    role: 'MEMBER',
    companyId: currentTenant.id,
    companyName: currentTenant.nome,
    avatar: 'ER',
  },
];

export const protectedRouteRules = [
  { prefix: '/dashboard', permission: 'dashboard.view', scope: 'company' },
  { prefix: '/meus-agentes', permission: 'agents.manage', scope: 'company' },
  { prefix: '/conversas', permission: 'chats.manage', scope: 'company' },
  { prefix: '/operacao', permission: 'operation.manage', scope: 'company' },
  { prefix: '/documentos', permission: 'documents.manage', scope: 'company' },
  { prefix: '/configuracoes', permission: 'settings.manage', scope: 'company' },
  { prefix: '/integracoes', permission: 'integrations.manage', scope: 'company' },
  { prefix: '/usuarios', permission: 'users.manage', scope: 'company' },
  { prefix: '/admin', permission: 'admin.access', scope: 'global' },
  { prefix: '/empresas', permission: 'tenants.manage', scope: 'global' },
];

export const authChecklist = [
  'Rotas privadas redirecionam visitantes para /login.',
  'Sessão segura usa cookie httpOnly criado pela rota de autenticação.',
  'Admin interno só acessa /admin e /empresas com papel SUPER_ADMIN.',
  'Usuários de empresa acessam apenas módulos permitidos pelo papel.',
  'Cada sessão carrega companyId para manter isolamento multiempresa.',
  'Acesso restrito a usuários autorizados e perfis permitidos.',
];

export function getUserByToken(token) {
  return demoUsers.find((user) => user.token === token) || null;
}

export function getRole(role) {
  return roles[role] || roles.VIEWER;
}

export function hasPermission(user, permissionKey) {
  if (!user) return false;
  const permission = permissions.find((item) => item.key === permissionKey);
  return Boolean(permission?.roles.includes(user.role));
}

export function getPermissionsForRole(role) {
  return permissions.map((permission) => ({
    ...permission,
    enabled: permission.roles.includes(role),
  }));
}

export function getCompanyForUser(user) {
  if (!user) return currentTenant;
  return companies.find((company) => company.id === user.companyId) || currentTenant;
}

export function getRouteRule(pathname) {
  return protectedRouteRules.find((rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`));
}
