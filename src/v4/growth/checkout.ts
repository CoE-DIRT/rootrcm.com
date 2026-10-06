import { track } from '../analytics/tracker';
import { getProduct } from './catalog';

/**
 * Stripe TEST-MODE checkout (ADR-010, proposed). The browser never holds a secret and never decides an amount:
 * it asks the `checkout` Function to create a Stripe-hosted Checkout session for a catalogued product, redirects to
 * Stripe's page, and after the return asks the Function to verify the session. Card data never touches ROOT.
 *
 * The checkout UI exists only when BOTH `VITE_CHECKOUT_ENDPOINT` (https) and a `pk_test_` `VITE_STRIPE_PUBLISHABLE_KEY`
 * are set. Hosted Checkout needs no publishable key to run; the key is a build-time declaration of test mode (the build
 * refuses any non-test key, see src/build/envGuard.js) and is never sent anywhere.
 */
export const DIAGNOSTIC_PRODUCT_ID = 'revenue-optimization-diagnostic';

const SESSION_ID = /^cs_test_[A-Za-z0-9]{10,100}$/;
/** What the Function returns for analytics: a keyed digest of the session id, never the id itself. */
const PURCHASE_REFERENCE = /^[0-9a-f]{32}$/;
const STRIPE_HOSTED_PREFIX = 'https://checkout.stripe.com/';
const REQUEST_TIMEOUT_MS = 20_000;

const readEnv = (name: string): string => {
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  return typeof value === 'string' ? value.trim() : '';
};

export function getCheckoutEndpoint(): string {
  const value = readEnv('VITE_CHECKOUT_ENDPOINT');
  return /^https:\/\//.test(value) ? value : '';
}

export const isTestModeBuild = (): boolean => /^pk_test_[A-Za-z0-9_]+$/.test(readEnv('VITE_STRIPE_PUBLISHABLE_KEY'));

/** Checkout is offered only when it is configured for test mode; otherwise nothing about it is rendered. */
export const isCheckoutEnabled = (): boolean => getCheckoutEndpoint() !== '' && isTestModeBuild();

export const isCheckoutSessionId = (value: unknown): value is string => typeof value === 'string' && SESSION_ID.test(value);
export const isStripeHostedUrl = (value: unknown): value is string => typeof value === 'string' && value.startsWith(STRIPE_HOSTED_PREFIX);

async function callCheckout(body: Record<string, string>): Promise<Record<string, unknown> | null> {
  const endpoint = getCheckoutEndpoint();
  if (!endpoint) return null;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(body),
      credentials: 'omit',
      mode: 'cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export interface CheckoutContext {
  experiment_id?: string;
  variant?: string;
}

const navigateTo = (url: string): void => window.location.assign(url);

/** Create a session and send the visitor to Stripe's hosted page. Resolves `{ ok: false }` if checkout could not start. */
export async function startDiagnosticCheckout(context: CheckoutContext = {}, navigate: (url: string) => void = navigateTo): Promise<{ ok: boolean }> {
  const product = getProduct(DIAGNOSTIC_PRODUCT_ID);
  if (!product || !isCheckoutEnabled()) return { ok: false };
  const data = await callCheckout({ action: 'create', product_id: product.id });
  // Only Stripe's own hosted page is ever navigated to, whatever the Function returned.
  if (!data || data.ok !== true || !isStripeHostedUrl(data.url)) return { ok: false };
  track(
    'checkout_start',
    { product_id: product.id, value: product.amountUsd, currency: product.currency, experiment_id: context.experiment_id, variant: context.variant },
    { immediate: true },
  );
  navigate(data.url);
  return { ok: true };
}

/**
 * `reference` is the server-derived, non-reversible purchase reference used to count a purchase once. It is absent if the
 * Function did not supply one; the payment is still confirmed to the visitor, but no purchase event is recorded.
 */
export type CheckoutVerification = { state: 'paid'; reference?: string } | { state: 'unpaid' } | { state: 'unavailable' };

const verifying = new Map<string, Promise<CheckoutVerification>>();

async function verify(sessionId: string): Promise<CheckoutVerification> {
  const data = await callCheckout({ action: 'verify', session_id: sessionId });
  if (!data || data.ok !== true) return { state: 'unavailable' };
  const product = getProduct(DIAGNOSTIC_PRODUCT_ID);
  const paid = data.paid === true && product !== undefined && data.product_id === product.id && data.amount === product.amountUsd && data.currency === product.currency;
  if (!paid) return { state: 'unpaid' };
  const reference = typeof data.transaction_ref === 'string' && PURCHASE_REFERENCE.test(data.transaction_ref) ? data.transaction_ref : undefined;
  return reference ? { state: 'paid', reference } : { state: 'paid' };
}

/**
 * Ask the Function whether Stripe reports this session as paid. `paid` is the only state that may lead to a purchase event.
 * Concurrent calls for one session share a single request (React StrictMode runs effects twice in development).
 */
export function verifyCheckoutSession(sessionId: string): Promise<CheckoutVerification> {
  if (!isCheckoutSessionId(sessionId)) return Promise.resolve({ state: 'unpaid' });
  const pending = verifying.get(sessionId) ?? verify(sessionId).finally(() => verifying.delete(sessionId));
  verifying.set(sessionId, pending);
  return pending;
}

export const isPurchaseReference = (value: unknown): value is string => typeof value === 'string' && PURCHASE_REFERENCE.test(value);

/**
 * Record the purchase for a session the server has verified as paid, identified only by the server's non-reversible
 * reference (the Stripe session id is never sent to analytics or kept in browser storage by it). At most once per
 * visitor, and only with consent.
 */
export function trackVerifiedPurchase(reference: string): void {
  const product = getProduct(DIAGNOSTIC_PRODUCT_ID);
  if (!product || !isPurchaseReference(reference)) return;
  track(
    'purchase',
    { product_id: product.id, transaction_id: reference, value: product.amountUsd, currency: product.currency, status: 'paid' },
    { dedupeKey: `purchase:${reference}`, dedupeScope: 'visitor', immediate: true },
  );
}
