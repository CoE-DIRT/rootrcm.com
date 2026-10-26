import process from 'node:process';
import { purgeExpiredCounters } from './rateLimit.js';
import { handleContact } from './handler.js';

// Appwrite HTTP adapter. Ephemeral server key has only row read/write scopes.
// The original worker validates the public origin and Turnstile hostname before delivery.
export default async ({ req, res }) => {
  const env = { ...process.env, CONTACT_RUNTIME_API_KEY: req.headers['x-appwrite-key'] };
  if (req.headers['x-appwrite-trigger'] === 'schedule') {
    try { await purgeExpiredCounters(env); return res.json({ ok: true }); }
    catch { return res.json({ ok: false }, 503); }
  }
  const origin = req.headers.origin || '';
  if (!['https://rootrcm.com', 'https://www.rootrcm.com'].includes(origin)) {
    return res.json({ ok: false, message: 'Request origin is not allowed.' }, 403);
  }
  const body = req.bodyText || '';
  if (new TextEncoder().encode(body).byteLength > 32768) {
    return res.json({ ok: false, message: 'Request is too large.' }, 413);
  }
  const request = new Request(origin + '/api/contact', {
    method: req.method,
    headers: { origin, 'content-type': req.headers['content-type'] || '' },
    ...(req.method === 'POST' ? { body } : {}),
  });
  const response = await handleContact(request, env);
  return res.text(await response.text(), response.status, Object.fromEntries(response.headers));
};
