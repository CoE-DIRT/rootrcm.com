/**
 * Build-time guard for browser-exposed configuration. Vite inlines every `VITE_*` variable into the
 * public bundle, so anything secret-shaped must fail the build instead of shipping.
 *
 * Names are matched, not values, because a secret has no recognisable shape. The list errs on the side of refusing: any
 * name that says "token", "credential", "webhook" or "passphrase", or names a private kind of key, is refused. The public
 * keys (VITE_STRIPE_PUBLISHABLE_KEY, VITE_PUBLIC_POSTHOG_KEY, VITE_TURNSTILE_SITE_KEY) do not use those words.
 */
const SECRET_NAME = /(SECRET|API_?KEY|ACCESS_?KEY|SIGNING_?KEY|ENCRYPTION_?KEY|MASTER_?KEY|SERVICE_?KEY|PRIVATE|PASSWORD|PASSWD|PASSPHRASE|CREDENTIAL|TOKEN|BEARER|JWT|WEBHOOK)/i;

/** Public identifiers whose names merely contain a secret-looking word. */
const PUBLIC_ALLOWLIST = new Set(['VITE_TURNSTILE_SITE_KEY']);

const GA4_ID = /^G-[A-Z0-9]{4,20}$/;
const SITE_ENVS = new Set(['production', 'preview', 'development']);
const GSC_TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

export function assertSafePublicEnv(env = {}) {
  const problems = [];

  for (const name of Object.keys(env)) {
    if (!name.startsWith('VITE_') || PUBLIC_ALLOWLIST.has(name)) continue;
    if (SECRET_NAME.test(name) && String(env[name] || '').trim()) {
      problems.push(`${name} looks like a secret. Server-side secrets must never use the VITE_ prefix.`);
    }
  }

  const ga = String(env.VITE_GA_MEASUREMENT_ID || '').trim();
  if (ga && !GA4_ID.test(ga)) problems.push('VITE_GA_MEASUREMENT_ID must look like G-XXXXXXXXXX or be empty.');

  const stripeKey = String(env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
  if (stripeKey && !stripeKey.startsWith('pk_test_')) {
    problems.push('VITE_STRIPE_PUBLISHABLE_KEY must be a pk_test_ key. Live payments are not permitted.');
  }

  const siteEnv = String(env.VITE_SITE_ENV || '').trim();
  if (siteEnv && !SITE_ENVS.has(siteEnv)) problems.push('VITE_SITE_ENV must be production, preview or development.');

  for (const name of ['VITE_TRACKING_ENDPOINT', 'VITE_CHECKOUT_ENDPOINT', 'VITE_BOOKING_URL']) {
    const value = String(env[name] || '').trim();
    if (value && !/^https:\/\//.test(value)) problems.push(`${name} must be an https:// URL.`);
  }

  for (const name of ['VITE_EXPERIMENTS_ENABLED', 'VITE_GA_NON_PRODUCTION']) {
    const flag = String(env[name] || '').trim().toLowerCase();
    if (flag && flag !== 'true' && flag !== 'false') problems.push(`${name} must be true, false or empty.`);
  }

  const gsc = String(env.VITE_GSC_VERIFICATION || '').trim();
  if (gsc && !GSC_TOKEN.test(gsc)) problems.push('VITE_GSC_VERIFICATION must be the verification token only (letters, digits, - and _), not a full meta tag.');

  if (problems.length) throw new Error(`Unsafe public configuration:\n- ${problems.join('\n- ')}`);
}
