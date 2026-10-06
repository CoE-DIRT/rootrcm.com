import { isApprovedCta } from './approvedCtas';
import { analyticsAllowed } from './consent';
import { sanitizePath } from './sanitize';
import { track } from './tracker';

/**
 * DOM-level event capture for the tracker. All listeners are cheap no-ops until consent is granted
 * (`track()` enforces consent), and none of them ever read form values, text content or URLs with query strings.
 */
export const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

interface CtaDetail {
  cta?: unknown;
  location?: unknown;
  destination?: unknown;
  engagementType?: unknown;
  experiment?: unknown;
  experiment_variant?: unknown;
}

const asString = (value: unknown): string | undefined => (typeof value === 'string' && value ? value : undefined);

/** `root:cta` is dispatched by src/App.jsx for every `[data-cta]` click. */
export function handleCtaDetail(detail: CtaDetail): void {
  const cta = asString(detail.cta);
  if (!cta || !isApprovedCta(cta)) return;
  const destination = asString(detail.destination);
  const isPhone = detail.engagementType === 'phone' || cta === 'phone-call' || Boolean(destination?.startsWith('tel:'));
  if (isPhone) {
    track('phone_click', { cta_id: cta, cta_location: asString(detail.location) });
    return;
  }
  track('cta_click', {
    cta_id: cta,
    cta_location: asString(detail.location),
    destination,
    engagement_type: asString(detail.engagementType),
    experiment_id: asString(detail.experiment),
    variant: asString(detail.experiment_variant),
  });
}

function formIdFor(target: EventTarget | null): string | undefined {
  const form = target instanceof Element ? target.closest('form') ?? (target as Element) : null;
  return form?.getAttribute('data-form-id') || undefined;
}

export function attachAnalyticsListeners(): () => void {
  if (typeof window === 'undefined') return () => {};

  const onCta = (event: Event) => handleCtaDetail(((event as CustomEvent).detail ?? {}) as CtaDetail);

  // tel: links that carry no data-cta still count as phone clicks (the number itself is never recorded).
  const onClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest?.('a[href^="tel:"]');
    if (anchor && !anchor.hasAttribute('data-cta')) track('phone_click', { cta_location: anchor.getAttribute('data-location') || 'page' });
  };

  const onForm = (event: Event) => {
    const formId = formIdFor(event.target);
    if (!formId) return;
    track('form_submit', { form_id: formId, status: event.type === 'root:form-success' ? 'success' : 'failure' }, { immediate: true });
  };

  let frame = 0;
  const onScroll = () => {
    if (frame || !analyticsAllowed()) return;
    const run = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < 200) return; // short pages: nothing meaningful to measure
      const percent = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      const path = sanitizePath(window.location.pathname);
      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone) track('scroll', { percent_scrolled: milestone }, { dedupeKey: `scroll:${path}:${milestone}` });
      }
    };
    frame = typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame(run) : window.setTimeout(run, 16);
  };

  window.addEventListener('root:cta', onCta);
  document.addEventListener('click', onClick, true);
  document.addEventListener('root:form-success', onForm, true);
  document.addEventListener('root:form-failure', onForm, true);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('root:cta', onCta);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('root:form-success', onForm, true);
    document.removeEventListener('root:form-failure', onForm, true);
    window.removeEventListener('scroll', onScroll);
  };
}

/** One page view per page load per path, however many times the consent state changes or React remounts. */
export function trackPageViewOnce(): void {
  const path = sanitizePath(typeof window === 'undefined' ? '/' : window.location.pathname);
  track('page_view', {}, { dedupeKey: `page_view:${path}` });
}
