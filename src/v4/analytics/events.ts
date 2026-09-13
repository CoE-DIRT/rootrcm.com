/**
 * Lead/engagement event taxonomy (spec section N). Extends the existing `root:cta`
 * CustomEvent dispatch in src/App.jsx rather than replacing it — that mechanism already
 * carries UTM/experiment context via getExperimentContext(). This module only names the
 * event vocabulary and keeps PHI/form-content out of the payload.
 */
export type LeadEventName =
  | 'page_view'
  | 'cta_click'
  | 'diagnostic_start'
  | 'diagnostic_submit'
  | 'contact_start'
  | 'contact_submit'
  | 'resource_view'
  | 'resource_download'
  | 'social_click'
  | 'talk_to_us_open'
  | 'consent_update';

export interface LeadEventPayload {
  cta?: string;
  location?: string;
  destination?: string;
  engagementType?: string;
  page?: string;
}

/** Never pass raw form field values here — attribution only, per spec section N. */
export function dispatchLeadEvent(name: LeadEventName, payload: LeadEventPayload = {}): void {
  window.dispatchEvent(new CustomEvent('root:cta', { detail: { cta: name, ...payload } }));
}
