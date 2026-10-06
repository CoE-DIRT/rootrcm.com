import { createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';

// Stripe webhook endpoint: PLACEHOLDER (ADR-010 accepted). It verifies the signature and acknowledges test-mode
// events; it does not fulfil, store, email or log anything, because no fulfilment process has been approved.
// Signature scheme: https://docs.stripe.com/webhooks#verify-manually. Only `v1` signatures count (other schemes are
// ignored to prevent downgrade attacks), the comparison is constant-time, and a timestamp outside the tolerance is refused.

const MAX_BODY_BYTES = 512 * 1024;
export const TOLERANCE_SECONDS = 300;
const WEBHOOK_SECRET = /^whsec_[A-Za-z0-9+/=_-]{10,}$/;

const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
const respond = (status, body) => ({ status, body, headers });
const byteLength = (text) => new TextEncoder().encode(text).byteLength;

function parseSignatureHeader(header) {
  let timestamp = '';
  const signatures = [];
  for (const part of String(header || '').split(',')) {
    const separator = part.indexOf('=');
    if (separator < 1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === 't' && !timestamp) timestamp = value;
    else if (key === 'v1') signatures.push(value);
  }
  return { timestamp, signatures };
}

/** True only for a `v1` signature made with `secret` over `${timestamp}.${rawBody}` within the tolerance window. */
export function verifyStripeSignature({ rawBody, header, secret, nowMs, toleranceSeconds = TOLERANCE_SECONDS }) {
  const { timestamp, signatures } = parseSignatureHeader(header);
  if (!/^\d{1,12}$/.test(timestamp) || signatures.length === 0) return false;
  if (Math.abs(Math.floor(nowMs / 1000) - Number(timestamp)) > toleranceSeconds) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex'), 'utf8');
  let matched = false;
  for (const candidate of signatures) {
    const given = Buffer.from(candidate, 'utf8');
    // timingSafeEqual needs equal lengths; a wrong length can never match, and length is not secret.
    if (given.length === expected.length && timingSafeEqual(given, expected)) matched = true;
  }
  return matched;
}

/**
 * @param {{ method: string, headers: Record<string, string>, bodyText: string }} request
 * @param {{ env: Record<string, string | undefined>, now?: () => number }} deps
 */
export function handleStripeWebhook(request, { env, now = () => Date.now() }) {
  if (String(request.method || '').toUpperCase() !== 'POST') return respond(405, { ok: false });

  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (typeof secret !== 'string' || !WEBHOOK_SECRET.test(secret)) return respond(500, { ok: false });

  const rawBody = typeof request.bodyText === 'string' ? request.bodyText : '';
  if (byteLength(rawBody) > MAX_BODY_BYTES) return respond(413, { ok: false });

  const lower = Object.fromEntries(Object.entries(request.headers || {}).map(([key, value]) => [key.toLowerCase(), String(value)]));
  if (!verifyStripeSignature({ rawBody, header: lower['stripe-signature'], secret, nowMs: now() })) return respond(400, { ok: false });

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return respond(400, { ok: false });
  }
  if (!event || event.object !== 'event' || typeof event.type !== 'string') return respond(400, { ok: false });

  // Test mode only: a live event reaching this endpoint is misconfiguration and is refused, not processed.
  if (event.livemode !== false) return respond(400, { ok: false });

  // Placeholder: checkout.session.completed / async_payment_succeeded / async_payment_failed / expired are
  // acknowledged and intentionally not acted on. Fulfilment needs its own approval (ADR-010).
  return respond(200, { ok: true, received: true });
}
