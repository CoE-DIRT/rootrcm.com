// Stripe Checkout (TEST MODE ONLY) for the fixed-fee Revenue Optimization Diagnostic. See docs/adr/ADR-010 (proposed).
//
// Two operations over one POST endpoint (JSON body, any content type):
//   { "action": "create", "product_id": "revenue-optimization-diagnostic" }  -> { ok, url }  (Stripe-hosted Checkout)
//   { "action": "verify", "session_id": "cs_test_..." }                      -> { ok, paid, ..., transaction_ref } (server-side verification)
//
// Nothing is trusted from the browser except which catalogued product to buy: the amount, currency, product name,
// success and cancel URLs are all decided here. Card data never touches ROOT. No database, no logging, no PHI.
// Live-mode keys and live sessions are refused. Pure logic: main.js supplies the environment and fetch.

import { createHmac } from 'node:crypto';

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions';
const STRIPE_HOSTED_PREFIX = 'https://checkout.stripe.com/';
const DEFAULT_ORIGINS = ['https://rootrcm.com', 'https://www.rootrcm.com'];
const MAX_BODY_BYTES = 2048;
const STRIPE_TIMEOUT_MS = 15_000;
const SESSION_LIFETIME_SECONDS = 60 * 60;

/** Server-owned catalog. The amount is in the smallest currency unit (cents). */
export const CATALOG = {
  'revenue-optimization-diagnostic': {
    name: 'Revenue Optimization Diagnostic',
    description: 'Fixed-fee review of A/R, denials, workflow and reporting with a prioritized 90-day roadmap.',
    unitAmount: 250000,
    currency: 'usd',
  },
};

const TEST_SECRET_KEY = /^(?:sk|rk)_test_[A-Za-z0-9_]{10,}$/;
const SESSION_ID = /^cs_test_[A-Za-z0-9]{10,100}$/;

export function parseOrigins(raw) {
  const origins = String(raw || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const allowed = new Set();
  for (const entry of origins.length ? origins : DEFAULT_ORIGINS) {
    try {
      const url = new URL(entry);
      if (url.origin === entry && (url.protocol === 'https:' || url.hostname === 'localhost')) allowed.add(url.origin);
    } catch {
      /* ignore malformed entries */
    }
  }
  if (!allowed.size) DEFAULT_ORIGINS.forEach((origin) => allowed.add(origin));
  return allowed;
}

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  vary: 'Origin',
};

function respond(status, body, origin, allowedOrigins) {
  const headers = { ...baseHeaders };
  if (allowedOrigins.has(origin)) {
    headers['access-control-allow-origin'] = origin;
    headers['access-control-allow-methods'] = 'POST, OPTIONS';
    headers['access-control-allow-headers'] = 'content-type';
    headers['access-control-max-age'] = '600';
  }
  return { status, body, headers };
}

const byteLength = (text) => new TextEncoder().encode(text).byteLength;

async function stripeRequest(fetchImpl, secretKey, url, init = {}) {
  const response = await fetchImpl(url, {
    ...init,
    headers: { authorization: `Bearer ${secretKey}`, ...(init.headers || {}) },
    signal: AbortSignal.timeout(STRIPE_TIMEOUT_MS),
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, json };
}

function createBody({ origin, product, productId, now }) {
  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('success_url', `${origin}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', `${origin}/checkout/cancel/`);
  form.set('expires_at', String(Math.floor(now() / 1000) + SESSION_LIFETIME_SECONDS));
  form.set('line_items[0][quantity]', '1');
  form.set('line_items[0][price_data][currency]', product.currency);
  form.set('line_items[0][price_data][unit_amount]', String(product.unitAmount));
  form.set('line_items[0][price_data][product_data][name]', product.name);
  form.set('line_items[0][price_data][product_data][description]', product.description);
  form.set('metadata[root_product]', productId);
  form.set('payment_intent_data[metadata][root_product]', productId);
  return form.toString();
}

async function createSession({ origin, productId, secretKey, fetchImpl, now, allowedOrigins }) {
  const product = CATALOG[productId];
  const result = await stripeRequest(fetchImpl, secretKey, STRIPE_API, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: createBody({ origin, product, productId, now }),
  });
  const session = result.json;
  // A live session, a missing URL or a URL that is not Stripe's hosted page is never handed to the browser.
  if (!result.ok || !session || session.livemode !== false || typeof session.url !== 'string' || !session.url.startsWith(STRIPE_HOSTED_PREFIX)) {
    return respond(502, { ok: false }, origin, allowedOrigins);
  }
  return respond(200, { ok: true, url: session.url }, origin, allowedOrigins);
}

/**
 * The reference the browser may send to analytics for a paid session. A Stripe Checkout Session id is a payment-system
 * identifier and never goes to analytics: the browser receives only this keyed digest (HMAC-SHA256, domain-separated,
 * truncated to 128 bits). It cannot be turned back into the session id, and without the server secret it cannot be linked
 * to Stripe. Rotating the Stripe key changes every reference, which affects only de-duplication across the rotation.
 */
export function purchaseReference(secretKey, sessionId) {
  const key = createHmac('sha256', secretKey).update('root-analytics-purchase-reference-v1').digest();
  return createHmac('sha256', key).update(sessionId).digest('hex').slice(0, 32);
}

async function verifySession({ origin, sessionId, secretKey, fetchImpl, allowedOrigins }) {
  const result = await stripeRequest(fetchImpl, secretKey, `${STRIPE_API}/${encodeURIComponent(sessionId)}`, { method: 'GET' });
  if (result.status === 404) return respond(200, { ok: true, paid: false }, origin, allowedOrigins);
  const session = result.json;
  if (!result.ok || !session || typeof session !== 'object') return respond(502, { ok: false }, origin, allowedOrigins);

  const productId = session.metadata && typeof session.metadata.root_product === 'string' ? session.metadata.root_product : '';
  const product = Object.hasOwn(CATALOG, productId) ? CATALOG[productId] : undefined;
  const paid =
    Boolean(product) &&
    session.id === sessionId &&
    session.object === 'checkout.session' &&
    session.mode === 'payment' &&
    session.payment_status === 'paid' &&
    session.livemode === false &&
    session.amount_total === product.unitAmount &&
    String(session.currency || '').toLowerCase() === product.currency;

  const body = paid
    ? { ok: true, paid: true, product_id: productId, amount: product.unitAmount / 100, currency: product.currency.toUpperCase(), transaction_ref: purchaseReference(secretKey, sessionId) }
    : { ok: true, paid: false };
  return respond(200, body, origin, allowedOrigins);
}

/**
 * @param {{ method: string, headers: Record<string, string>, bodyText: string }} request
 * @param {{ env: Record<string, string | undefined>, fetchImpl?: typeof fetch, now?: () => number }} deps
 */
export async function handleCheckout(request, { env, fetchImpl = fetch, now = () => Date.now() }) {
  const method = String(request.method || '').toUpperCase();
  const headers = Object.fromEntries(Object.entries(request.headers || {}).map(([key, value]) => [key.toLowerCase(), String(value)]));
  const origin = headers.origin || '';
  const allowedOrigins = parseOrigins(env.ALLOWED_ORIGINS);

  if (!allowedOrigins.has(origin)) return respond(403, { ok: false }, origin, allowedOrigins);
  if (method === 'OPTIONS') return respond(204, null, origin, allowedOrigins);
  if (method !== 'POST') return respond(405, { ok: false }, origin, allowedOrigins);

  const bodyText = typeof request.bodyText === 'string' ? request.bodyText : '';
  if (byteLength(bodyText) > MAX_BODY_BYTES) return respond(413, { ok: false }, origin, allowedOrigins);

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return respond(400, { ok: false }, origin, allowedOrigins);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return respond(400, { ok: false }, origin, allowedOrigins);
  const keys = Object.keys(payload).sort().join(',');

  // Strict shapes: anything else (an amount, a price, a URL, a customer) is refused rather than ignored.
  const isCreate = payload.action === 'create' && keys === 'action,product_id' && typeof payload.product_id === 'string' && Object.hasOwn(CATALOG, payload.product_id);
  const isVerify = payload.action === 'verify' && keys === 'action,session_id' && typeof payload.session_id === 'string' && SESSION_ID.test(payload.session_id);
  if (!isCreate && !isVerify) return respond(400, { ok: false }, origin, allowedOrigins);

  const secretKey = env.STRIPE_SECRET_KEY;
  if (typeof secretKey !== 'string' || !TEST_SECRET_KEY.test(secretKey)) return respond(500, { ok: false }, origin, allowedOrigins);

  try {
    return isCreate
      ? await createSession({ origin, productId: payload.product_id, secretKey, fetchImpl, now, allowedOrigins })
      : await verifySession({ origin, sessionId: payload.session_id, secretKey, fetchImpl, allowedOrigins });
  } catch {
    return respond(502, { ok: false }, origin, allowedOrigins);
  }
}
