// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHmac } from 'node:crypto';
import { handleContact } from './handler.js';

const env = { TURNSTILE_SECRET_KEY: 'synthetic-test-secret', CONTACT_RELAY_URL: 'https://relay.example.test/contact', CONTACT_RELAY_SECRET: 'synthetic-secret-only-for-tests-32-characters' };
const payload = { name: 'Synthetic QA', email: 'qa@example.test', organization: 'Synthetic Organization', need: 'Commercial inquiry', message: 'Synthetic test, no patient data.', no_phi_acknowledgement: true, 'cf-turnstile-response': 'synthetic-token' };
function request(data = payload, origin = 'https://rootrcm.com') {
  return new Request('https://rootrcm.com/api/contact', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(data) });
}
afterEach(() => vi.unstubAllGlobals());

describe('owned contact delivery boundary', () => {
  it('requires acknowledgement and verification before calling any vendor', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    for (const data of [{ ...payload, no_phi_acknowledgement: false }, { ...payload, 'cf-turnstile-response': '' }]) {
      expect((await handleContact(request(data), env)).status).toBe(400);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejects foreign origins and oversized payloads', async () => {
    expect((await handleContact(request(payload, 'https://attacker.example'), env)).status).toBe(403);
    expect((await handleContact(request({ ...payload, message: 'x'.repeat(34000) }), env)).status).toBe(413);
  });
  it.each([
    { success: false, hostname: 'rootrcm.com', action: 'contact' },
    { success: true, hostname: 'attacker.example', action: 'contact' },
    { success: true, hostname: 'rootrcm.com', action: 'other' },
  ])('rejects invalid verification without sending mail: %j', async verification => {
    const fetch = vi.fn().mockResolvedValue(Response.json(verification)); vi.stubGlobal('fetch', fetch);
    expect((await handleContact(request(), env)).status).toBe(403);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('requires the signed relay to confirm SMTP acceptance and the same request ID', async () => {
    const fetch = vi.fn().mockImplementation(async (url, options) => {
      if (url.includes('siteverify')) return Response.json({ success: true, hostname: 'rootrcm.com', action: 'contact' });
      const signature = createHmac('sha256', env.CONTACT_RELAY_SECRET).update(options.headers['x-root-timestamp'] + '.' + options.body).digest('hex');
      expect(options.headers['x-root-signature']).toBe(signature);
      return Response.json({ ok: true, smtpAccepted: true, requestId: JSON.parse(options.body).requestId });
    });
    vi.stubGlobal('fetch', fetch);
    const response = await handleContact(request(), env);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, delivered: true });
  });
  it('does not report delivery when SMTP rejects the message', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ success: true, hostname: 'rootrcm.com', action: 'contact' })).mockResolvedValueOnce(Response.json({ ok: true, smtpAccepted: false }));
    vi.stubGlobal('fetch', fetch);
    expect((await handleContact(request(), env)).status).toBe(503);
  });
});
