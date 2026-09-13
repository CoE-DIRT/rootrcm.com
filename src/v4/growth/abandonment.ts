/**
 * Abandonment automation adapter — production-ready, disabled until a CRM provider
 * is configured. Never email/SMS from typed-but-unsubmitted contact data.
 */

export type AbandonmentEventName = 'funnel_abandon' | 'lead_submitted' | 'recovery_eligible';

export interface AbandonmentPayload {
  funnelId: string;
  step?: string;
  route?: string;
  /** Consent already collected for contact follow-up */
  contactConsented?: boolean;
  /** Lead was explicitly submitted (required for recovery) */
  submitted?: boolean;
}

export interface AbandonmentAdapter {
  id: string;
  emit: (name: AbandonmentEventName, payload: AbandonmentPayload) => void | Promise<void>;
}

const noopAdapter: AbandonmentAdapter = {
  id: 'noop',
  emit() {},
};

let adapter: AbandonmentAdapter = noopAdapter;

export function registerAbandonmentAdapter(next: AbandonmentAdapter): void {
  adapter = next;
}

export function emitAbandonment(name: AbandonmentEventName, payload: AbandonmentPayload): void {
  // Hard gate: recovery messages only after explicit submit + consent.
  if (name === 'recovery_eligible' && !(payload.submitted && payload.contactConsented)) {
    return;
  }
  void adapter.emit(name, {
    funnelId: payload.funnelId,
    step: payload.step,
    route: payload.route,
    contactConsented: payload.contactConsented,
    submitted: payload.submitted,
  });
}

export function getAbandonmentAdapterId(): string {
  return adapter.id;
}
