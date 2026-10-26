import { isPlainText, isValidEmail, parseContactPayload } from '../../../../functions/contact/validation.js';
/**
 * A single, validated mutation boundary for ROOT's deidentified inquiries.
 * No browser Databases.createDocument; ADR-008 limits public delivery to the
 * existing Turnstile-verified contact Function (or approved legacy relay).
 */
import { isDeliveryAcknowledged } from '../../../modules/glass-core/formDelivery.js';
import { normalizeServiceError, rejected, type Result } from './client';

export interface LeadIdentity {
  name: string;
  email: string;
  organization: string;
  noPhi: boolean;
}
export interface DiagnosticLead extends LeadIdentity {
  providers: string;
  challenge: string;
}
export type ContactLead = LeadIdentity;

export interface SubmissionOptions {
  endpoint: string;
  ownedDelivery: boolean;
  /** Existing, pre-constructed transport payload; preserves the relay's exact contract. */
  deliveryPayload: Record<string, unknown>;
}
export interface DeliveryReceipt { acknowledged: true }

/** Validate inputs before any Appwrite Function / legacy-relay request is attempted. */
export function validateLead(identity: LeadIdentity, extra?: Pick<DiagnosticLead, 'providers' | 'challenge'>): Result<true> {
  if (typeof identity?.name !== 'string' || !identity.name.trim() || identity.name.length > 200) {
    return rejected(400, 'Enter a name of no more than 200 characters.');
  }
  if (typeof identity.email !== 'string' || identity.email.length > 254
      || !isValidEmail(identity.email)) {
    return rejected(400, 'Enter a valid work email address.');
  }
  if (typeof identity.organization !== 'string' || identity.organization.trim().length < 2 || identity.organization.length > 240) {
    return rejected(400, 'Enter a practice or organization name between 2 and 240 characters.');
  }
  if (!isPlainText(identity.name, 200, 1) || !isPlainText(identity.organization, 240, 2)) return rejected(400, 'Use plain text without HTML.');
  if (identity.noPhi !== true) return rejected(400, 'Acknowledge that this public form contains no PHI.');
  if (extra && (!['1-5', '6-10', '11-20', '21+'].includes(extra.providers) ||
    !['High / aging A/R','Denials and rejections','Staffing / workflow','Reporting / visibility',
      'Credentialing / enrollment','Other'].includes(extra.challenge))) {
    return rejected(400, 'Select the provider range and main operational challenge.');
  }
  return { ok: true, data: true };
}

async function sendValidated(identity: LeadIdentity, options: SubmissionOptions, extra?: Pick<DiagnosticLead, 'providers' | 'challenge'>): Promise<Result<DeliveryReceipt>> {
  const validation = validateLead(identity, extra);
  if (!validation.ok) return validation;
  let endpoint: URL;
  try { endpoint = new URL(options.endpoint); } catch { return rejected(503, 'The inquiry endpoint is not configured.', 'unavailable'); }
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) {
    return rejected(503, 'A secure inquiry endpoint is required.', 'unavailable');
  }
  let payload = options.deliveryPayload;
  // Do not accept substituted identity values in the relay body.
  if (payload.name !== identity.name || payload.email !== identity.email ||
      payload.organization !== identity.organization ||
      (options.ownedDelivery && payload.no_phi_acknowledgement !== true)) {
    return rejected(400, 'Please review the submitted identity and privacy acknowledgment.');
  }
  try {
    if (options.ownedDelivery) payload = parseContactPayload(payload);
    else {
      for (const value of Object.values(payload)) {
        if (typeof value === 'string' && !isPlainText(value, 5000, 0, true)) return rejected(400, 'Use bounded plain text without HTML.');
      }
      payload = Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
    }
  } catch { return rejected(400, 'Please review the inquiry fields.'); }
  try {
    const response = await fetch(endpoint.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) return { ok: false, error: normalizeServiceError({ code: response.status }) };
    const result: unknown = await response.json();
    if (!isDeliveryAcknowledged(result, options.ownedDelivery)) {
      return rejected(502, 'The inquiry service did not confirm delivery.', 'unavailable');
    }
    return { ok: true, data: { acknowledged: true } };
  } catch (cause: unknown) {
    return { ok: false, error: normalizeServiceError(cause) };
  }
}

/** Diagnostic booking/inquiry, validated and forwarded by the existing protected relay. */
export async function submitDiagnosticLead(payload: DiagnosticLead, options: SubmissionOptions): Promise<Result<DeliveryReceipt>> {
  return sendValidated(payload, options, { providers: payload.providers, challenge: payload.challenge });
}

/** Identical safeguards for Contact and Book inquiry variants. */
export async function submitCommercialInquiry(payload: ContactLead, options: SubmissionOptions): Promise<Result<DeliveryReceipt>> {
  return sendValidated(payload, options);
}
