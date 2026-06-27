// ============================================================
// AgentesIA — Camada de Segurança Centralizada
// ============================================================

// ---------- Rate Limiter (in-memory por IP) ----------
const rateLimitStore = new Map();

/**
 * Verifica rate limit por IP.
 * @param {string} ip
 * @param {object} options { max: número de requisições, windowMs: janela em ms }
 * @returns {{ ok: boolean, remaining: number, retryAfter?: number }}
 */
export function checkRateLimit(ip, { max = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }

  entry.count += 1;
  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { ok: false, remaining: 0, retryAfter };
  }

  return { ok: true, remaining: max - entry.count };
}

// Limpa entradas expiradas a cada 5 minutos para evitar memory leak
if (typeof setInterval !== 'undefined') {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) rateLimitStore.delete(key);
    }
  }, 5 * 60_000);

  // Permite que o processo do build encerre normalmente no Node.js.
  cleanupInterval?.unref?.();
}

// ---------- Extrai IP real da request ----------
export function getClientIP(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '0.0.0.0';
}

// ---------- Sanitização de Inputs (XSS + Injection) ----------
/**
 * Remove tags HTML e caracteres perigosos de uma string.
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>]/g, '')                      // tags HTML
    .replace(/javascript:/gi, '')              // js: URI
    .replace(/on\w+\s*=/gi, '')               // event handlers (onclick=, etc.)
    .replace(/['";\\]/g, (c) => ({            // SQL injection chars
      "'": '\u2019',
      '"': '\u201C',
      ';': '',
      '\\': '',
    }[c] || c))
    .trim()
    .slice(0, 500);                            // limite de comprimento
}

/**
 * Sanitiza um objeto recursivamente (profundidade 1).
 */
export function sanitizeBody(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') clean[key] = sanitizeString(val);
    else if (typeof val === 'number') clean[key] = isFinite(val) ? val : 0;
    else clean[key] = val; // outros tipos passam sem modificação
  }
  return clean;
}

// ---------- Validação de Email ----------
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ---------- Resposta de Rate Limit Padronizada ----------
export function rateLimitResponse(retryAfter = 60) {
  return new Response(
    JSON.stringify({ erro: 'Muitas requisições. Aguarde e tente novamente.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}

// ---------- Validação de Webhook Mercado Pago ----------
/**
 * Valida a assinatura HMAC-SHA256 do webhook do Mercado Pago.
 * Header: x-signature → ts=...,v1=...
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function validateMercadoPagoWebhook(req, rawBody) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // se não configurado, deixa passar (configure na produção!)

  const xSignature = req.headers.get('x-signature') || '';
  const xRequestId = req.headers.get('x-request-id') || '';

  const tsMatch = xSignature.match(/ts=([^,]+)/);
  const v1Match = xSignature.match(/v1=([^,]+)/);
  if (!tsMatch || !v1Match) return false;

  const ts = tsMatch[1];
  const signatureReceived = v1Match[1];

  // Monta a string de assinatura conforme docs do MP
  const dataId = new URL(req.url).searchParams.get('data.id') || '';
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(manifest);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const hashHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex === signatureReceived;
}
