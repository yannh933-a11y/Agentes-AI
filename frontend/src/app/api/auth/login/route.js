import { NextResponse } from 'next/server';
import { SESSION_COOKIE, demoUsers } from '../../../../lib/auth-data';

export async function POST(request) {
  try {
    const body = await request.json();
    const selectedToken = body?.token;
    const user = demoUsers.find((item) => item.token === selectedToken) || demoUsers.find((item) => item.role === 'OWNER');

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName,
      },
      message: 'Sessão demo iniciada com sucesso.',
    });

    response.cookies.set(SESSION_COOKIE, user.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Não foi possível iniciar sessão.' }, { status: 400 });
  }
}
