// ============================================================
// AgentesIA — Middleware Global (Security Headers + CORS)
// ============================================================
import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN = 'https://agentes-ai-two.vercel.app';

// Domínios permitidos como origem (inclui localhost para dev)
const ALLOWED_ORIGINS = [
  ALLOWED_ORIGIN,
  'http://localhost:3000',
  'http://localhost:3001',
];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin') || '';
  const isApi = pathname.startsWith('/api/');

  // ---------- CORS para rotas de API ----------
  if (isApi) {
    // Preflight OPTIONS
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // Bloqueia origens não autorizadas em produção
    if (
      origin &&
      !ALLOWED_ORIGINS.includes(origin) &&
      process.env.NODE_ENV === 'production'
    ) {
      return new NextResponse(
        JSON.stringify({ erro: 'Origem não autorizada' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ---------- Aplica Security Headers em todas as respostas ----------
  const res = NextResponse.next();

  // CORS headers nas respostas de API
  if (isApi && ALLOWED_ORIGINS.includes(origin)) {
    const cors = corsHeaders(origin);
    Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
  }

  // Security Headers
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://www.mercadopago.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.groq.com https://api.mercadopago.com https://api.telegram.org https://api.resend.com",
      "frame-src https://www.mercadopago.com https://sdk.mercadopago.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
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

// Aplica o middleware em todas as rotas
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
