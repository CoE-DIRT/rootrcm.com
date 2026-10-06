import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { V4Shell } from '@/layout/V4Shell';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinkButton } from '@/components/ui/Button';
import { analyticsAllowed, subscribeAnalyticsConsent } from '@/analytics/consent';
import { isCheckoutSessionId, trackVerifiedPurchase, verifyCheckoutSession } from '@/growth/checkout';

type PageState = 'verifying' | 'paid' | 'unpaid' | 'unavailable' | 'invalid';

const sessionFromLocation = (): string | null => {
  const value = new URLSearchParams(window.location.search).get('session_id');
  return isCheckoutSessionId(value) ? value : null;
};

/**
 * Where Stripe returns after payment. The URL is never trusted: the session is verified server-side first, and a purchase is
 * recorded only for a session the server reports as paid, once per visitor, and only if analytics consent exists.
 */
export function CheckoutSuccessPage() {
  const [sessionId] = useState<string | null>(sessionFromLocation);
  const [state, setState] = useState<PageState>(sessionId ? 'verifying' : 'invalid');
  // Follows the visitor's analytics choice, including one made after this page loaded.
  const consented = useSyncExternalStore(subscribeAnalyticsConsent, analyticsAllowed, () => false);

  useEffect(() => {
    if (!sessionId) return undefined;
    let current = true;
    void verifyCheckoutSession(sessionId).then((result) => {
      if (!current) return;
      setState(result.state);
      // Drop the session id from the address bar once it has served its purpose.
      if (result.state === 'paid') window.history.replaceState(null, '', window.location.pathname);
    });
    return () => {
      current = false;
    };
  }, [sessionId]);

  // A visitor who accepts analytics only after the page loaded is still counted, and only once in this page's lifetime
  // (withdrawing and re-granting consent must not send it again; the server also stores one row per Stripe session).
  const purchaseSent = useRef(false);
  useEffect(() => {
    if (state !== 'paid' || !sessionId || !consented || purchaseSent.current) return;
    purchaseSent.current = true;
    trackVerifiedPurchase(sessionId);
  }, [state, sessionId, consented]);

  return (
    <V4Shell minimal>
      <Section className="mx-auto max-w-xl py-24">
        <GlassCard as="div" variant="glass" accent={state === 'paid' ? 'green' : 'amber'} hover={false} className="text-center">
          <div role="status" aria-live="polite">
            {state === 'verifying' ? (
              <>
                <h1 className="text-3xl font-semibold text-text">Confirming your payment…</h1>
                <p className="mt-4 text-muted">We are checking with Stripe. This usually takes a moment.</p>
              </>
            ) : null}
            {state === 'paid' ? (
              <>
                <h1 className="text-3xl font-semibold text-text">Payment received.</h1>
                <p className="mt-4 text-muted">Stripe confirmed your payment for the Revenue Optimization Diagnostic. ROOT confirms scope in writing before work begins.</p>
                <p className="mt-3 text-sm text-muted">Test mode: this was a test payment and no real money was taken.</p>
              </>
            ) : null}
            {state === 'unpaid' ? (
              <>
                <h1 className="text-3xl font-semibold text-text">We could not confirm a payment.</h1>
                <p className="mt-4 text-muted">
                  Stripe has not reported this checkout as paid. If you believe you were charged, email{' '}
                  <a className="text-accent underline" href="mailto:info@rootrcm.com">info@rootrcm.com</a>. Do not include card details or PHI.
                </p>
              </>
            ) : null}
            {state === 'unavailable' ? (
              <>
                <h1 className="text-3xl font-semibold text-text">We could not reach the payment check.</h1>
                <p className="mt-4 text-muted">
                  Your payment status is unchanged. Please try again shortly, or email{' '}
                  <a className="text-accent underline" href="mailto:info@rootrcm.com">info@rootrcm.com</a> (no PHI or card details).
                </p>
              </>
            ) : null}
            {state === 'invalid' ? (
              <>
                <h1 className="text-3xl font-semibold text-text">Checkout confirmation</h1>
                <p className="mt-4 text-muted">This page confirms completed payments. If you arrived here by mistake, you can review pricing or the Diagnostic.</p>
              </>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/" variant="secondary" data-cta="return-home" data-location="checkout-success">
              Return to ROOT
            </LinkButton>
            {state === 'invalid' ? (
              <LinkButton href="/pricing/" variant="outline" data-cta="compare-pricing" data-location="checkout-success" data-destination="/pricing/" data-engagement-type="pricing">
                View pricing
              </LinkButton>
            ) : null}
          </div>
        </GlassCard>
      </Section>
    </V4Shell>
  );
}

export function CheckoutCancelPage() {
  return (
    <V4Shell minimal>
      <Section className="mx-auto max-w-xl py-24">
        <GlassCard as="div" variant="glass" accent="amber" hover={false} className="text-center">
          <h1 className="text-3xl font-semibold text-text">Checkout canceled.</h1>
          <p className="mt-4 text-muted">No payment was taken. You can return to the Diagnostic, or ask ROOT a question first.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="checkout-cancel" data-destination="/diagnostic/" data-engagement-type="diagnostic">
              Back to the Diagnostic
            </LinkButton>
            <LinkButton href="/contact/" variant="outline" data-cta="talk-to-root" data-location="checkout-cancel" data-destination="/contact/" data-engagement-type="consultation">
              Talk to ROOT
            </LinkButton>
          </div>
        </GlassCard>
      </Section>
    </V4Shell>
  );
}
