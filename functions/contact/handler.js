// Adapted from ROOT temporary Sites contact worker for the Appwrite migration.
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const ALLOWED_ORIGINS = new Set(['https://rootrcm.com', 'https://www.rootrcm.com']);
const ALLOWED_HOSTNAMES = new Set([...ALLOWED_ORIGINS].map(origin => new URL(origin).hostname));
const TURNSTILE_TIMEOUT_MS = 8000;
const RELAY_TIMEOUT_MS = 15000;

const jsonResponse = (body, status, origin) => {
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    vary: 'Origin'
  });
  if (ALLOWED_ORIGINS.has(origin)) {
    headers.set('access-control-allow-origin', origin);
    headers.set('access-control-allow-methods', 'POST, OPTIONS');
    headers.set('access-control-allow-headers', 'content-type');
  }
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
};

const isNonEmptyString = (value, maxLength) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

const isValidEmail = (value) =>
  typeof value === 'string' && value.length <= 254 && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value);

const failureMessage = "We couldn't send your inquiry just yet. Your information is still here — please try again.";
const metadataValue = (value) => typeof value === 'string' ? value.trim().slice(0, 200) : '';

async function sendInquiry(payload, env, url) {
  // Sites has no raw TCP sockets. Only this authenticated HTTPS relay uses SMTP.
  const relay = new URL(env.CONTACT_RELAY_URL);
  if (relay.protocol !== 'https:' || relay.username || relay.password ||
      relay.search || relay.hash || !isNonEmptyString(env.CONTACT_RELAY_SECRET, 1024) ||
      env.CONTACT_RELAY_SECRET.length < 32) throw new Error('Delivery unavailable');
  const body = JSON.stringify({
    name: payload.name.trim(), email: payload.email.trim(), organization: payload.organization.trim(),
    need: payload.need.trim(), message: payload.message.trim(),
    submittedAt: new Date().toISOString(), sourcePage: url.origin + '/', hostname: url.hostname,
    requestId: crypto.randomUUID(),
    metadata: {
      inquiryType: payload.inquiryType === 'diagnostic' ? 'diagnostic' : 'contact',
      attribution: {
        utm_source: metadataValue(payload.utm_source),
        utm_medium: metadataValue(payload.utm_medium),
        utm_campaign: metadataValue(payload.utm_campaign),
        utm_content: metadataValue(payload.utm_content),
      },
      experiment: {
        id: metadataValue(payload.experiment),
        variant: metadataValue(payload.experiment_variant),
      },
    }
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.CONTACT_RELAY_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key,
    encoder.encode(timestamp + '.' + body))), byte => byte.toString(16).padStart(2, '0')).join('');
  const response = await fetch(relay.href, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(RELAY_TIMEOUT_MS),
    headers: { 'content-type': 'application/json', 'x-root-timestamp': timestamp, 'x-root-signature': signature },
    body
  });
  const result = await response.json();
  if (!response.ok || result.ok !== true || result.smtpAccepted !== true ||
      result.requestId !== JSON.parse(body).requestId) throw new Error('Delivery unavailable');
}

export async function handleContact(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const host = url.hostname.toLowerCase();

  if (!ALLOWED_HOSTNAMES.has(host) || (origin && !ALLOWED_ORIGINS.has(origin))) {
    return jsonResponse({ ok: false, message: 'Request origin is not allowed.' }, 403, origin);
  }

  if (request.method === 'OPTIONS') return jsonResponse({ ok: true }, 204, origin);
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, message: 'Method not allowed.' }, 405, origin);
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ ok: false, message: failureMessage }, 415, origin);
  }

  if (!env || typeof env.TURNSTILE_SECRET_KEY !== 'string' || !env.TURNSTILE_SECRET_KEY.trim()) {
    return jsonResponse({ ok: false, message: failureMessage }, 503, origin);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 32768) {
    return jsonResponse({ ok: false, message: 'Request is too large.' }, 413, origin);
  }

  let payload;
  try {
    const bytes = [];
    let size = 0;
    for await (const chunk of request.body || []) {
      size += chunk.byteLength;
      if (size > 32768) return jsonResponse({ ok: false, message: failureMessage }, 413, origin);
      bytes.push(chunk);
    }
    payload = JSON.parse(await new Blob(bytes).text());
  } catch {
    return jsonResponse({ ok: false, message: 'Invalid request.' }, 400, origin);
  }

  const token = payload?.['cf-turnstile-response'];
  if (!isNonEmptyString(token, 2048)) {
    return jsonResponse({ ok: false, message: 'Verification is required.' }, 400, origin);
  }

  if (
    !isNonEmptyString(payload?.name, 200) ||
    !isValidEmail(payload?.email) ||
    !isNonEmptyString(payload?.organization, 240) ||
    !isNonEmptyString(payload?.need, 120) ||
    !isNonEmptyString(payload?.message, 5000) ||
    [...(payload.name + payload.organization + payload.need)].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) ||
    payload?.no_phi_acknowledgement !== true
  ) {
    return jsonResponse({ ok: false, message: 'Please complete all required fields.' }, 400, origin);
  }

  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token
  });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) verifyBody.set('remoteip', remoteIp);

  let verification;
  try {
    const verifyResponse = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: verifyBody,
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS)
    });
    if (!verifyResponse.ok) {
      return jsonResponse({ ok: false, message: 'Verification could not be completed.' }, 502, origin);
    }
    verification = await verifyResponse.json();
  } catch {
    return jsonResponse({ ok: false, message: 'Verification could not be completed.' }, 502, origin);
  }

  if (
    verification?.success !== true ||
    String(verification?.hostname || '').toLowerCase() !== host ||
    verification?.action !== 'contact'
  ) {
    return jsonResponse({ ok: false, message: 'Verification failed. Please try again.' }, 403, origin);
  }

  // A valid challenge alone is never a successful inquiry.
  try {
    await sendInquiry(payload, env, url);
    return jsonResponse({ ok: true, delivered: true }, 200, origin);
  } catch {
    return jsonResponse({ ok: false, message: failureMessage }, 503, origin);
  }
}
