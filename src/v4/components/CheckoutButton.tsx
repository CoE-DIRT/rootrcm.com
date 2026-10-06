import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DIAGNOSTIC_PRICE_USD, formatUsd } from '@/growth/locale';
import { isCheckoutEnabled, startDiagnosticCheckout } from '@/growth/checkout';
import { useExperiment } from '@/experiments/useExperiment';

interface CheckoutButtonProps {
  /** Analytics location key (`data-location`). */
  location: string;
  className?: string;
}

function CheckoutButtonInner({ location, className }: CheckoutButtonProps) {
  // Resolved here, not in the wrapper, so the checkout A/B test is only exposed where the button really renders.
  const experiment = useExperiment('checkoutCta');
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  // A ref, not state: two clicks in the same tick must never start two sessions, whatever React has rendered yet.
  const busy = useRef(false);
  const label = experiment.label ?? `Pay ${formatUsd(DIAGNOSTIC_PRICE_USD)} securely`;

  async function onClick() {
    if (busy.current) return;
    busy.current = true;
    setStatus('working');
    const result = await startDiagnosticCheckout({
      experiment_id: experiment.attrs['data-experiment'],
      variant: experiment.attrs['data-variant'],
    });
    // On success the browser is navigating to Stripe; stay disabled so a second click cannot start a second session.
    if (!result.ok) {
      busy.current = false;
      setStatus('error');
    }
  }

  return (
    <div className={className} {...experiment.attrs}>
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={() => void onClick()}
        disabled={status === 'working'}
        aria-busy={status === 'working'}
        data-cta="start-checkout"
        data-location={location}
        data-destination="stripe-checkout"
        data-engagement-type="checkout"
      >
        {status === 'working' ? 'Opening secure checkout…' : label}
      </Button>
      <p className="mt-2 max-w-md text-xs text-muted">
        Test mode: no real payment is taken. Payments are processed by Stripe on its hosted page; ROOT never sees your card number.
        See the <a className="text-accent underline" href="/refund-policy/">refund and cancellation policy</a>.
      </p>
      {status === 'error' ? (
        <p role="alert" className="mt-2 text-sm text-signal-amber">
          We could not open checkout. Please try again, or email <a className="underline" href="mailto:info@rootrcm.com">info@rootrcm.com</a> (no PHI).
        </p>
      ) : null}
    </div>
  );
}

/** Renders nothing unless Stripe test-mode checkout is configured for this build. */
export function CheckoutButton(props: CheckoutButtonProps) {
  if (!isCheckoutEnabled()) return null;
  return <CheckoutButtonInner {...props} />;
}
