import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { TOLERANCE_SECONDS, handleStripeWebhook, verifyStripeSignature } from './handler.js';

// Synthetic, obviously fake credentials assembled at runtime, so no literal in the repository looks like a real Stripe key
// (secret scanners and push protection should never have to guess).
const fake = (prefix, mode) => [prefix, mode, `SYNTHETIC${'x'.repeat(20)}`].join('_');
const fakeWebhookSecret = (tag = 'SYNTHETIC') => ['whsec', `${tag}${'x'.repeat(26)}`].join('_');
const SECRET = fakeWebhookSecret();
const NOW_MS = Date.parse('2026-10-06T12:00:00.000Z');
const NOW_S = Math.floor(NOW_MS / 1000);

const event = (overrides = {}) => ({ id: 'evt_synthetic', object: 'event', type: 'checkout.session.completed', livemode: false, data: { object: { id: 'cs_test_a1B2c3D4e5F6g7H8i9J0' } }, ...overrides });
const sign = (body, { secret = SECRET, t = NOW_S } = {}) => createHmac('sha256', secret).update(`${t}.${body}`, 'utf8').digest('hex');
const headerFor = (body, options = {}) => `t=${options.t ?? NOW_S},v1=${sign(body, options)}`;
const request = (body, header, method = 'POST') => ({ method, headers: header === undefined ? {} : { 'Stripe-Signature': header }, bodyText: body });
const run = (req, env = { STRIPE_WEBHOOK_SECRET: SECRET }) => handleStripeWebhook(req, { env, now: () => NOW_MS });

describe('stripe webhook (placeholder): signature verification', () => {
  const body = JSON.stringify(event());

  it('accepts a correctly signed, in-tolerance test-mode event and acknowledges it without acting', () => {
    const response = run(request(body, headerFor(body)));
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, received: true });
  });

  it('rejects a missing, malformed or empty header', () => {
    for (const header of [undefined, '', 'garbage', 't=,v1=', `v1=${sign(body)}`, `t=${NOW_S}`, `t=${NOW_S},v1=`, `t=abc,v1=${sign(body)}`, `t=-1,v1=${sign(body)}`]) {
      expect(run(request(body, header)).status, String(header)).toBe(400);
    }
  });

  it('rejects a signature made with a different secret or over a different body', () => {
    expect(run(request(body, headerFor(body, { secret: fakeWebhookSecret('OTHER') }))).status).toBe(400);
    expect(run(request(`${body} `, headerFor(body))).status).toBe(400);
    expect(run(request(body.replace('cs_test', 'cs_tesx'), headerFor(body))).status).toBe(400);
  });

  it('rejects a non-numeric timestamp even when its signature is valid (NaN must not skip the tolerance check)', () => {
    for (const t of ['abc', '1e3', '0x10', '12.5', ' 5']) {
      expect(run(request(body, `t=${t},v1=${sign(body, { t })}`)).status, t).toBe(400);
    }
  });

  it('rejects a signature whose timestamp was altered (it is part of the signed payload)', () => {
    expect(run(request(body, `t=${NOW_S + 1},v1=${sign(body)}`)).status).toBe(400);
  });

  it('enforces the timestamp tolerance in both directions', () => {
    const at = (t) => run(request(body, headerFor(body, { t }))).status;
    expect(at(NOW_S - TOLERANCE_SECONDS)).toBe(200);
    expect(at(NOW_S + TOLERANCE_SECONDS)).toBe(200);
    expect(at(NOW_S - TOLERANCE_SECONDS - 1)).toBe(400);
    expect(at(NOW_S + TOLERANCE_SECONDS + 1)).toBe(400);
  });

  it('ignores every scheme except v1 (no downgrade to v0)', () => {
    expect(run(request(body, `t=${NOW_S},v0=${sign(body)}`)).status).toBe(400);
    expect(run(request(body, `t=${NOW_S},v2=${sign(body)}`)).status).toBe(400);
    expect(run(request(body, `t=${NOW_S},v0=${sign(body)},v1=${sign(body)}`)).status).toBe(200);
  });

  it('accepts any one valid v1 among several (secret rotation) and still rejects when none match', () => {
    const rotated = `t=${NOW_S},v1=${sign(body, { secret: fakeWebhookSecret('OLD') })},v1=${sign(body)}`;
    expect(run(request(body, rotated)).status).toBe(200);
    expect(run(request(body, `t=${NOW_S},v1=${'0'.repeat(64)},v1=${'1'.repeat(64)}`)).status).toBe(400);
  });

  it('handles signatures of the wrong length without throwing', () => {
    for (const bad of ['a', 'zz', sign(body).slice(0, 63), `${sign(body)}00`, '0'.repeat(1000)]) {
      expect(run(request(body, `t=${NOW_S},v1=${bad}`)).status).toBe(400);
    }
  });

  it('exposes the pure verifier for reuse', () => {
    expect(verifyStripeSignature({ rawBody: body, header: headerFor(body), secret: SECRET, nowMs: NOW_MS })).toBe(true);
    expect(verifyStripeSignature({ rawBody: body, header: headerFor(body), secret: fakeWebhookSecret('OTHER'), nowMs: NOW_MS })).toBe(false);
  });
});

describe('stripe webhook (placeholder): payload and configuration', () => {
  const signed = (payload) => {
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return request(raw, headerFor(raw));
  };

  it('refuses live-mode events, even with a valid signature', () => {
    expect(run(signed(event({ livemode: true }))).status).toBe(400);
    const { livemode, ...withoutFlag } = event();
    expect(livemode).toBe(false);
    expect(run(signed(withoutFlag)).status).toBe(400);
  });

  it('refuses payloads that are not Stripe events', () => {
    for (const payload of ['not json', '[]', 'null', JSON.stringify({ object: 'charge', type: 'x', livemode: false }), JSON.stringify({ object: 'event', livemode: false })]) {
      expect(run(signed(payload)).status, payload).toBe(400);
    }
  });

  it('acknowledges other test-mode event types without acting on them', () => {
    for (const type of ['checkout.session.expired', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'charge.refunded']) {
      expect(run(signed(event({ type }))).body).toEqual({ ok: true, received: true });
    }
  });

  it('accepts only POST', () => {
    const body = JSON.stringify(event());
    for (const method of ['GET', 'PUT', 'DELETE', 'OPTIONS']) expect(run(request(body, headerFor(body), method)).status).toBe(405);
  });

  it('fails closed, without detail, when the secret is missing or not a webhook secret', () => {
    const body = JSON.stringify(event());
    const req = request(body, headerFor(body));
    for (const secret of [undefined, '', fake('sk', 'test'), 'whsec_short', fake('pk', 'test')]) {
      const response = run(req, { STRIPE_WEBHOOK_SECRET: secret });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ ok: false });
      if (secret) expect(JSON.stringify(response)).not.toContain(secret);
    }
  });

  it('rejects oversized bodies and never echoes the payload, signature or secret', () => {
    expect(run(request('x'.repeat(512 * 1024 + 1), 't=1,v1=a')).status).toBe(413);
    const raw = JSON.stringify(event({ data: { object: { customer_email: 'private@example.test' } } }));
    const ok = run(request(raw, headerFor(raw)));
    const bad = run(request(raw, `t=${NOW_S},v1=${'f'.repeat(64)}`));
    for (const response of [ok, bad]) {
      const text = JSON.stringify(response);
      expect(text).not.toMatch(/private@example|whsec_|SYNTHETIC|v1=/);
    }
  });
});
