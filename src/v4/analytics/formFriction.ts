import { trackAnalytics } from './adapter';

export type FormFrictionEvent =
  | 'form_view'
  | 'form_start'
  | 'field_focus'
  | 'field_error'
  | 'validation_error'
  | 'form_abandon'
  | 'form_submit'
  | 'form_success'
  | 'form_failure'
  | 'funnel_abandon';

export interface FormFrictionPayload {
  formId: string;
  fieldId?: string;
  errorCode?: string;
  step?: number;
  elapsedMs?: number;
  deviceClass?: string;
  route?: string;
  experimentVariant?: string;
}

/** Behavior metadata only — never pass field values. */
export function trackFormFriction(name: FormFrictionEvent, payload: FormFrictionPayload): void {
  trackAnalytics({
    name,
    properties: {
      form_id: payload.formId,
      field_id: payload.fieldId,
      error_code: payload.errorCode,
      step: payload.step,
      elapsed_ms: payload.elapsedMs,
      device_class: payload.deviceClass ?? inferDeviceClass(),
      route: payload.route ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
      experiment_variant: payload.experimentVariant,
    },
  });
}

function inferDeviceClass(): string {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function attachFormFrictionListeners(form: HTMLFormElement, formId: string): () => void {
  let started = false;
  const startedAt = Date.now();

  const onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null;
    const fieldId = target?.getAttribute('name') || target?.id || undefined;
    if (!started) {
      started = true;
      trackFormFriction('form_start', { formId, fieldId });
    }
    trackFormFriction('field_focus', { formId, fieldId });
  };

  const onSubmit = () => {
    trackFormFriction('form_submit', { formId, elapsedMs: Date.now() - startedAt });
  };

  const onPageHide = () => {
    if (started) {
      trackFormFriction('form_abandon', { formId, elapsedMs: Date.now() - startedAt });
      trackFormFriction('funnel_abandon', { formId, elapsedMs: Date.now() - startedAt });
    }
  };

  trackFormFriction('form_view', { formId });
  form.addEventListener('focusin', onFocus);
  form.addEventListener('submit', onSubmit);
  window.addEventListener('pagehide', onPageHide);

  return () => {
    form.removeEventListener('focusin', onFocus);
    form.removeEventListener('submit', onSubmit);
    window.removeEventListener('pagehide', onPageHide);
  };
}
