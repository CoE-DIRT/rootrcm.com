import process from 'node:process';
import { handleStripeWebhook } from './handler.js';

// Appwrite HTTP Function adapter for the Stripe webhook PLACEHOLDER (ADR-010 accepted; do not deploy until preview gates and test credentials are ready).
// Server-only variable (never VITE_*): STRIPE_WEBHOOK_SECRET (whsec_...). The raw request body is required for the
// signature check, so it is passed through untouched. Nothing is logged, stored or sent onward.
export default async ({ req, res, error }) => {
  try {
    const result = handleStripeWebhook({ method: req.method, headers: req.headers, bodyText: req.bodyText || '' }, { env: process.env });
    if (result.status >= 500) error('stripe webhook is not configured');
    return res.json(result.body, result.status, result.headers);
  } catch {
    error('stripe webhook request failed');
    return res.json({ ok: false }, 500);
  }
};
