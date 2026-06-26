import { cookies } from 'next/headers';
import { SESSION_COOKIE, getUserByToken, demoUsers, hasPermission, getRouteRule, getCompanyForUser } from './auth-data';

export function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return getUserByToken(token) || null;
}

export function getCurrentSession() {
  const user = getCurrentUser();
  if (!user) {
    return {
      authenticated: false,
      user: null,
      company: null,
      isAdmin: false,
    };
  }

  return {
    authenticated: true,
    user,
    company: getCompanyForUser(user),
    isAdmin: user.role === 'SUPER_ADMIN',
  };
}

export function canAccessPath(pathname, user = getCurrentUser()) {
  const rule = getRouteRule(pathname);
  if (!rule) return true;
  return hasPermission(user, rule.permission);
}

export function getDefaultSessionUser() {
  return demoUsers.find((user) => user.role === 'OWNER') || demoUsers[0];
}
