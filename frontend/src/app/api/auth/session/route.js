import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getPermissionsForRole } from '../../../../lib/auth-data';

export async function GET() {
  const session = getCurrentSession();

  if (!session.authenticated) {
    return NextResponse.json({ authenticated: false, user: null, permissions: [] }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
    company: session.company,
    permissions: getPermissionsForRole(session.user.role),
  });
}
