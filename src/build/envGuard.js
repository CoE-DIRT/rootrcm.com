/**
 * Build-time guard for browser-exposed configuration. Vite inlines every `VITE_*` variable into the
 * public bundle, so anything secret-shaped must fail the build instead of shipping.
 */
const SECRET_NAME = /(SECRET|API_KEY|APIKEY|PRIVATE|PASSWORD|PASSWD|ACCESS_TOKEN|AUTH_TOKEN)/i;

/** Public identifiers whose names merely contain a secret-looking word. */
const PUBLIC_ALLOWLIST = new Set(['VITE_TURNSTILE_SITE_KEY']);

const GA4_ID = /^G-[A-Z0-9]{4,20}$/;
const SITE_ENVS = new Set(['production', 'preview', 'development']);

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

  for (const name of ['VITE_TRACKING_ENDPOINT', 'VITE_CHECKOUT_ENDPOINT']) {
    const value = String(env[name] || '').trim();
    if (value && !/^https:\/\//.test(value)) problems.push(`${name} must be an https:// URL.`);
  }

  if (problems.length) throw new Error(`Unsafe public configuration:\n- ${problems.join('\n- ')}`);
}
