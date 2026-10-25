/**
 * ROOT public-Appwrite boundary (ADR-007/008/009).
 *
 * This React/Vite marketing site is NOT an authenticated Appwrite application:
 * no database, storage, or write-capable SDK singleton may be exposed to visitors.
 * Commercial inquiries travel to the existing anti-bot, server-validated
 * Appwrite contact Function via its separately configured HTTPS URL.
 *
 * A future authenticated Appwrite SDK (Client/Databases/Storage/Functions)
 * requires a scoped ADR, permitted collections, and an API security review.
 */
export interface PublicAppwriteIdentifiers {
  readonly endpoint: string;
  readonly projectId: string;
}

/** A public identifier pair is optional until an authenticated SDK use is authorized. */
export function getPublicAppwriteIdentifiers(
  config: { VITE_APPWRITE_ENDPOINT?: string; VITE_APPWRITE_PROJECT_ID?: string },
): PublicAppwriteIdentifiers | null {
  const endpoint = config.VITE_APPWRITE_ENDPOINT?.trim() ?? '';
  const projectId = config.VITE_APPWRITE_PROJECT_ID?.trim() ?? '';
  if (!endpoint && !projectId) return null;
  if (!endpoint || !projectId) {
    throw new Error('ROOT Appwrite configuration: set BOTH VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID (public values only), or leave both unset.');
  }
  let url: URL;
  try { url = new URL(endpoint); } catch {
    throw new Error('ROOT Appwrite configuration: VITE_APPWRITE_ENDPOINT must be a valid HTTPS URL.');
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('ROOT Appwrite configuration: VITE_APPWRITE_ENDPOINT must be a plain HTTPS URL without credentials or query strings.');
  }
  if (!/^[A-Za-z0-9._-]{3,128}$/.test(projectId)) {
    throw new Error('ROOT Appwrite configuration: VITE_APPWRITE_PROJECT_ID must be a public Appwrite project identifier.');
  }
  return Object.freeze({ endpoint: url.href.replace(/\/$/, ''), projectId });
}

export type PublicErrorKind = 'validation' | 'unauthorized' | 'rate_limit' | 'unavailable' | 'network';
export interface PublicError {
  kind: PublicErrorKind;
  code: number;
  message: string;
}
export type Result<T> = { ok: true; data: T } | { ok: false; error: PublicError };

export function rejected(code: number, message: string, kind: PublicErrorKind = 'validation'): Result<never> {
  return { ok: false, error: { code, kind, message } };
}

/** Inspect AppwriteException.code OR a Response-like status without leaking stack/body. */
export function normalizeServiceError(cause: unknown): PublicError {
  const code = typeof cause === 'object' && cause !== null
    ? ('code' in cause && typeof cause.code === 'number' ? cause.code
      : 'status' in cause && typeof cause.status === 'number' ? cause.status : 0)
    : 0;
  if (code === 401 || code === 403) return { code, kind: 'unauthorized', message: 'This service is not available to the current visitor.' };
  if (code === 429) return { code, kind: 'rate_limit', message: 'Too many requests. Please try again later.' };
  if (code >= 500) return { code, kind: 'unavailable', message: 'The inquiry service is temporarily unavailable.' };
  if (code >= 400) return { code, kind: 'validation', message: 'Please review your details and try again.' };
  return { code: 0, kind: 'network', message: 'We could not confirm delivery. Please use the email option.' };
}
