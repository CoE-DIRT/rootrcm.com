import { describe, expect, it, vi } from 'vitest';
import { CATALOG, handleCheckout, parseOrigins } from './handler.js';

const ORIGIN = 'https://rootrcm.com';
const NOW = Date.parse('2026-10-06T12:00:00.000Z');
// Synthetic, obviously fake credentials assembled at runtime, so no literal in the repository looks like a real Stripe key
// (secret scanners and push protection should never have to guess).
const fake = (prefix, mode) => [prefix, mode, `SYNTHETIC${'x'.repeat(20)}`].join('_');
const fakeWebhookSecret = (tag = 'SYNTHETIC') => ['whsec', `${tag}${'x'.repeat(26)}`].join('_');
const KEY = fake('sk', 'test');
const SESSION = 'cs_test_a1B2c3D4e5F6g7H8i9J0';
const env = { STRIPE_SECRET_KEY: KEY };

const post = (body, extra = {}) => ({
  method: 'POST',
  headers: { origin: ORIGIN, 'content-type': 'text/plain;charset=UTF-8' },
  bodyText: typeof body === 'string' ? body : JSON.stringify(body),
  ...extra,
});

const json = (body, status = 200) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
const stripeOk = (overrides = {}) => json({ id: SESSION, object: 'checkout.session', livemode: false, url: `https://checkout.stripe.com/c/pay/${SESSION}#frag`, ...overrides });
const run = (request, { fetchImpl = vi.fn(async () => stripeOk()), environment = env } = {}) => handleCheckout(request, { env: environment, fetchImpl, now: () => NOW });

const paidSession = (overrides = {}) => ({
  id: SESSION,
  object: 'checkout.session',
  mode: 'payment',
  payment_status: 'paid',
  livemode: false,
  amount_total: 250000,
  currency: 'usd',
  metadata: { root_product: 'revenue-optimization-diagnostic' },
  ...overrides,
});

describe('checkout: creating a session', () => {
  it('asks Stripe for the server-owned $2,500 one-time payment and returns only the hosted URL', async () => {
    const fetchImpl = vi.fn(async () => stripeOk());
    const response = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), { fetchImpl });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, url: `https://checkout.stripe.com/c/pay/${SESSION}#frag` });

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.stripe.com/v1/checkout/sessions');
    expect(init.method).toBe('POST');
    expect(init.headers.authorization).toBe(`Bearer ${KEY}`);
    expect(init.headers['content-type']).toBe('application/x-www-form-urlencoded');
    const form = new URLSearchParams(init.body);
    expect(Object.fromEntries(form)).toEqual({
      mode: 'payment',
      success_url: 'https://rootrcm.com/checkout/success/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://rootrcm.com/checkout/cancel/',
      expires_at: String(Math.floor(NOW / 1000) + 3600),
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': '250000',
      'line_items[0][price_data][product_data][name]': 'Revenue Optimization Diagnostic',
      'line_items[0][price_data][product_data][description]': CATALOG['revenue-optimization-diagnostic'].description,
      'metadata[root_product]': 'revenue-optimization-diagnostic',
      'payment_intent_data[metadata][root_product]': 'revenue-optimization-diagnostic',
    });
    // No customer data is requested or sent: no email, name, phone, address or customer object.
    expect([...form.keys()].some((key) => /email|name$|phone|address|customer|shipping/.test(key.replace('product_data][name', '')))).toBe(false);
  });

  it('builds the success and cancel URLs from the validated request origin only', async () => {
    const fetchImpl = vi.fn(async () => stripeOk());
    await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }, { headers: { origin: 'https://www.rootrcm.com' } }), { fetchImpl });
    const form = new URLSearchParams(fetchImpl.mock.calls[0][1].body);
    expect(form.get('success_url')).toBe('https://www.rootrcm.com/checkout/success/?session_id={CHECKOUT_SESSION_ID}');
    expect(form.get('cancel_url')).toBe('https://www.rootrcm.com/checkout/cancel/');
  });

  it('refuses any amount, price, URL or extra field from the browser instead of ignoring it', async () => {
    const fetchImpl = vi.fn(async () => stripeOk());
    const attempts = [
      { action: 'create', product_id: 'revenue-optimization-diagnostic', amount: 1 },
      { action: 'create', product_id: 'revenue-optimization-diagnostic', success_url: 'https://evil.example' },
      { action: 'create', product_id: 'revenue-optimization-diagnostic', customer_email: 'someone@example.test' },
      { action: 'create', product_id: 'managed-rcm' },
      { action: 'create', product_id: '__proto__' },
      { action: 'create', product_id: 'constructor' },
      { action: 'create' },
      { action: 'refund', product_id: 'revenue-optimization-diagnostic' },
      { product_id: 'revenue-optimization-diagnostic' },
      [],
      null,
      'create',
    ];
    for (const attempt of attempts) {
      const response = await run(post(JSON.stringify(attempt)), { fetchImpl });
      expect(response.status, JSON.stringify(attempt)).toBe(400);
      expect(response.body).toEqual({ ok: false });
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('never returns a live-mode session, a missing URL or a URL that is not Stripe-hosted', async () => {
    const attempts = [
      stripeOk({ livemode: true }),
      stripeOk({ livemode: undefined }),
      stripeOk({ url: null }),
      stripeOk({ url: 'https://evil.example/checkout.stripe.com/' }),
      stripeOk({ url: 'http://checkout.stripe.com/c/pay/x' }),
      stripeOk({ url: 'https://checkout.stripe.com.evil.example/x' }),
      json({ error: { message: 'Invalid API Key provided: sk_test_***' } }, 401),
      json(null, 500),
    ];
    for (const result of attempts) {
      const response = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), { fetchImpl: vi.fn(async () => result) });
      expect(response.status).toBe(502);
      expect(response.body).toEqual({ ok: false });
      expect(JSON.stringify(response)).not.toMatch(/stripe|sk_test|invalid api key/i);
    }
  });

  it('answers 502 without detail when Stripe is unreachable or the response is not JSON', async () => {
    const down = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), {
      fetchImpl: vi.fn(async () => {
        throw new TypeError('connect ECONNREFUSED 10.0.0.1:443');
      }),
    });
    expect(down).toMatchObject({ status: 502, body: { ok: false } });
    expect(JSON.stringify(down)).not.toMatch(/ECONN|10\.0\.0\.1/);
    const html = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), {
      fetchImpl: vi.fn(async () => ({ status: 200, ok: true, json: async () => Promise.reject(new SyntaxError('Unexpected token <')) })),
    });
    expect(html.status).toBe(502);
  });
});

describe('checkout: test-mode guard', () => {
  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['a live secret key', fake('sk', 'live')],
    ['a live restricted key', fake('rk', 'live')],
    ['a publishable key', fake('pk', 'test')],
    ['a webhook secret', fakeWebhookSecret()],
    ['too short', 'sk_test_x'],
  ])('refuses to call Stripe with %s', async (_label, key) => {
    const fetchImpl = vi.fn(async () => stripeOk());
    const response = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), { fetchImpl, environment: { STRIPE_SECRET_KEY: key } });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ ok: false });
    expect(fetchImpl).not.toHaveBeenCalled();
    if (key) expect(JSON.stringify(response)).not.toContain(key);
  });

  it('accepts a restricted test key', async () => {
    const response = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), { environment: { STRIPE_SECRET_KEY: fake('rk', 'test') } });
    expect(response.status).toBe(200);
  });

  it('never puts the key in a response, even on failure', async () => {
    const responses = [
      await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' })),
      await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), { fetchImpl: vi.fn(async () => json({}, 500)) }),
      await run(post({ action: 'verify', session_id: SESSION }), { fetchImpl: vi.fn(async () => json(paidSession())) }),
    ];
    for (const response of responses) expect(JSON.stringify(response)).not.toContain('SYNTHETIC');
  });
});

describe('checkout: verifying a session (the only basis for purchase analytics)', () => {
  const verify = (session, status = 200) => run(post({ action: 'verify', session_id: SESSION }), { fetchImpl: vi.fn(async () => json(session, status)) });

  it('reports paid only for a completed, paid, test-mode, catalogued $2,500 session, with no personal data', async () => {
    const response = await verify(paidSession({ customer_details: { email: 'private@example.test', name: 'Synthetic Person' } }));
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'USD' });
    expect(JSON.stringify(response)).not.toMatch(/private@example|Synthetic Person/);
  });

  it('asks Stripe for exactly the requested session', async () => {
    const fetchImpl = vi.fn(async () => json(paidSession()));
    await run(post({ action: 'verify', session_id: SESSION }), { fetchImpl });
    expect(fetchImpl.mock.calls[0][0]).toBe(`https://api.stripe.com/v1/checkout/sessions/${SESSION}`);
    expect(fetchImpl.mock.calls[0][1].method).toBe('GET');
  });

  it.each([
    ['unpaid', { payment_status: 'unpaid' }],
    ['no payment required', { payment_status: 'no_payment_required' }],
    ['a live-mode session', { livemode: true }],
    ['a session of another mode', { mode: 'subscription' }],
    ['a different amount', { amount_total: 100 }],
    ['a different currency', { currency: 'eur' }],
    ['a product that is not in the catalog', { metadata: { root_product: 'something-else' } }],
    ['a session without ROOT metadata (not created by this Function)', { metadata: {} }],
    ['no metadata at all', { metadata: undefined }],
    ['a prototype-key product', { metadata: { root_product: 'constructor' } }],
    ['an id that differs from the one asked for', { id: 'cs_test_zzzzzzzzzzzzzzzzzzzz' }],
    ['a different object type', { object: 'payment_intent' }],
  ])('does not report paid for %s', async (_label, overrides) => {
    const response = await verify(paidSession(overrides));
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, paid: false });
  });

  it('treats an unknown session as not paid and a Stripe outage as an error, never as paid', async () => {
    expect((await verify({ error: { code: 'resource_missing' } }, 404)).body).toEqual({ ok: true, paid: false });
    for (const status of [401, 429, 500, 503]) {
      const response = await verify({ error: { message: 'boom' } }, status);
      expect(response.status).toBe(502);
      expect(response.body).toEqual({ ok: false });
    }
    const down = await run(post({ action: 'verify', session_id: SESSION }), {
      fetchImpl: vi.fn(async () => {
        throw new Error('network');
      }),
    });
    expect(down.status).toBe(502);
  });

  it('rejects session ids that are not test-mode Checkout Session ids without calling Stripe', async () => {
    const fetchImpl = vi.fn(async () => json(paidSession()));
    for (const id of ['cs_live_a1B2c3D4e5F6g7H8i9J0', 'pi_123456789012345', 'cs_test_short', '../../v1/customers', `${SESSION}/extra`, `${SESSION}?expand[]=customer`, '', 5, null]) {
      const response = await run(post({ action: 'verify', session_id: id }), { fetchImpl });
      expect(response.status, String(id)).toBe(400);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('refuses extra fields on a verification request', async () => {
    const fetchImpl = vi.fn(async () => json(paidSession()));
    for (const extra of [{ expand: 'customer' }, { amount: 2500 }, { product_id: 'revenue-optimization-diagnostic' }]) {
      const response = await run(post({ action: 'verify', session_id: SESSION, ...extra }), { fetchImpl });
      expect(response.status, JSON.stringify(extra)).toBe(400);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('checkout: origins, methods and limits', () => {
  it('refuses other or missing origins before touching Stripe', async () => {
    const fetchImpl = vi.fn(async () => stripeOk());
    for (const origin of ['https://evil.example', 'http://rootrcm.com', 'https://rootrcm.com.evil.example', 'null', '']) {
      const response = await run({ ...post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }), headers: origin ? { origin } : {} }, { fetchImpl });
      expect(response.status, origin).toBe(403);
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('answers preflight for allowed origins, rejects other methods and oversized bodies', async () => {
    const fetchImpl = vi.fn(async () => stripeOk());
    const preflight = await run({ method: 'OPTIONS', headers: { origin: ORIGIN }, bodyText: '' }, { fetchImpl });
    expect(preflight).toMatchObject({ status: 204, body: null });
    expect(preflight.headers['access-control-allow-origin']).toBe(ORIGIN);
    for (const method of ['GET', 'PUT', 'DELETE']) expect((await run({ method, headers: { origin: ORIGIN }, bodyText: '' }, { fetchImpl })).status).toBe(405);
    expect((await run(post(`{"action":"create","product_id":"${'x'.repeat(2100)}"}`), { fetchImpl })).status).toBe(413);
    expect((await run(post('{not json'), { fetchImpl })).status).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('parses ALLOWED_ORIGINS safely', () => {
    expect([...parseOrigins(undefined)].sort()).toEqual(['https://rootrcm.com', 'https://www.rootrcm.com']);
    expect([...parseOrigins('https://preview.example.test, http://insecure.example.test, http://localhost:4319, https://x.test/path, junk')].sort()).toEqual([
      'http://localhost:4319',
      'https://preview.example.test',
    ]);
  });

  it('returns generic, non-cacheable responses', async () => {
    const response = await run(post({ action: 'create', product_id: 'revenue-optimization-diagnostic' }));
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
