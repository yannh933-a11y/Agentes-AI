import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../lib/auth-data';

export async function GET(request) {
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
