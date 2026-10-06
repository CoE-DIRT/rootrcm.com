import process from 'node:process';
import { handleCheckout } from './handler.js';

// Appwrite HTTP Function adapter for Stripe TEST-MODE checkout (ADR-010 accepted; do not deploy until preview gates and test credentials are ready).
// Server-only variables (never VITE_*): STRIPE_SECRET_KEY (sk_test_ or rk_test_ only), ALLOWED_ORIGINS.
// No database, no logging of requests, no card data. Failures log a constant string only.
export default async ({ req, res, error }) => {
  try {
    const result = await handleCheckout(
      { method: req.method, headers: req.headers, bodyText: req.bodyText || '' },
      { env: process.env, fetchImpl: fetch, now: () => Date.now() },
    );
    if (result.status >= 500) error('checkout request failed');
    return result.body === null ? res.text('', result.status, result.headers) : res.json(result.body, result.status, result.headers);
  } catch {
    error('checkout request failed');
    return res.json({ ok: false }, 500);
  }
};
