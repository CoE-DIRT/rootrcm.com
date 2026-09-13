/**
 * Diagnostic checkout / payment readiness.
 * Static GitHub Pages cannot host Stripe secrets — keep provider disabled until a
 * secure server or payment-link configuration exists.
 */

export type CheckoutEvent =
  | 'checkout_start'
  | 'checkout_redirect'
  | 'checkout_success'
  | 'checkout_cancel'
  | 'checkout_error';

export interface CheckoutSessionRequest {
  product: 'revenue-optimization-diagnostic';
  amountUsd: 2500;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutProvider {
  id: string;
  configured: boolean;
  startCheckout: (request: CheckoutSessionRequest) => Promise<{ redirectUrl?: string; error?: string }>;
}

const disabledProvider: CheckoutProvider = {
  id: 'disabled',
  configured: false,
  async startCheckout() {
    return { error: 'Checkout is not configured. Use the Diagnostic inquiry form.' };
  },
};

function envPaymentLink(): string {
  return (import.meta.env.VITE_DIAGNOSTIC_PAYMENT_LINK as string | undefined)?.trim() || '';
}

const paymentLinkProvider: CheckoutProvider = {
  id: 'payment-link',
  configured: Boolean(envPaymentLink()),
  async startCheckout() {
    const url = envPaymentLink();
    if (!url) return { error: 'Payment link missing' };
    return { redirectUrl: url };
  },
};

export function getCheckoutProvider(): CheckoutProvider {
  return envPaymentLink() ? paymentLinkProvider : disabledProvider;
}

export function isDiagnosticCheckoutActive(): boolean {
  return getCheckoutProvider().configured;
}

export async function startDiagnosticCheckout(): Promise<{ ok: boolean; redirectUrl?: string; error?: string }> {
  const provider = getCheckoutProvider();
  window.dispatchEvent(new CustomEvent('root:cta', { detail: { cta: 'checkout_start', product: 'diagnostic' } }));
  const result = await provider.startCheckout({
    product: 'revenue-optimization-diagnostic',
    amountUsd: 2500,
    successUrl: 'https://rootrcm.com/thank-you/?checkout=success',
    cancelUrl: 'https://rootrcm.com/diagnostic/?checkout=cancel',
  });
  if (result.redirectUrl) {
    window.dispatchEvent(new CustomEvent('root:cta', { detail: { cta: 'checkout_redirect' } }));
    window.location.assign(result.redirectUrl);
    return { ok: true, redirectUrl: result.redirectUrl };
  }
  window.dispatchEvent(new CustomEvent('root:cta', { detail: { cta: 'checkout_error', error: result.error } }));
  return { ok: false, error: result.error };
}
