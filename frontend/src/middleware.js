// ============================================================
// Agentes AI — Middleware Global
// Security headers, CORS e proteção de rotas privadas.
// ============================================================
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, getRouteRule, getUserByToken, hasPermission } from './lib/auth-data';

const ALLOWED_ORIGIN = 'https://agentes-ai-two.vercel.app';

const ALLOWED_ORIGINS = [
  ALLOWED_ORIGIN,
  'http://localhost:3000',
  'http://localhost:3001',
];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin') || '';
  const isApi = pathname.startsWith('/api/');

  if (isApi) {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (origin && !ALLOWED_ORIGINS.includes(origin) && process.env.NODE_ENV === 'production') {
      return new NextResponse(JSON.stringify({ erro: 'Origem não autorizada' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const protectedRule = !isApi ? getRouteRule(pathname) : null;
  if (protectedRule) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const user = getUserByToken(token);

    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    if (!hasPermission(user, protectedRule.permission)) {
      const url = req.nextUrl.clone();
      url.pathname = '/acesso-negado';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  if (isApi && ALLOWED_ORIGINS.includes(origin)) {
    const cors = corsHeaders(origin);
    Object.entries(cors).forEach(([key, value]) => res.headers.set(key, value));
  }

  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://www.mercadopago.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.groq.com https://api.mercadopago.com https://api.telegram.org https://api.resend.com https://graph.facebook.com https://graph.instagram.com https://www.googleapis.com",
      "frame-src https://www.mercadopago.com https://sdk.mercadopago.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; ')
  );

  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return res;
}

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)'],
};
