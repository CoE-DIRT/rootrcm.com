import { SITE_ENVIRONMENTS, type SiteEnv } from './taxonomy';
import { PRODUCTION_HOSTS } from '../../seo/routeRegistry.js';

const GA4_ID = /^G-[A-Z0-9]{4,20}$/;

const readEnv = (name: string): string => {
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  return typeof value === 'string' ? value.trim() : '';
};

/** GA4 Measurement ID. Empty means GA4 stays disabled — never substitute a placeholder. */
export function getGaMeasurementId(): string {
  const value = readEnv('VITE_GA_MEASUREMENT_ID');
  return GA4_ID.test(value) ? value : '';
}

/** Public URL of the `tracking-ingest` Function. HTTPS only; empty disables first-party transport. */
export function getTrackingEndpoint(): string {
  const value = readEnv('VITE_TRACKING_ENDPOINT');
  return /^https:\/\//.test(value) ? value : '';
}

/**
 * Pure resolution rules (exported for tests). "production" is only ever reported on the production
 * hostnames, so a production build served from a preview domain cannot pollute production data.
 */
export function resolveSiteEnv({ hostname, configured }: { hostname: string; configured: string }): SiteEnv {
  const explicit = (SITE_ENVIRONMENTS as readonly string[]).includes(configured) ? (configured as SiteEnv) : null;
  if (PRODUCTION_HOSTS.includes(hostname)) return explicit && explicit !== 'production' ? explicit : 'production';
  if (explicit === 'development') return 'development';
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) return 'development';
  return 'preview';
}

export function getSiteEnv(): SiteEnv {
  if (typeof window === 'undefined') return 'production';
  return resolveSiteEnv({ hostname: window.location.hostname, configured: readEnv('VITE_SITE_ENV') });
}

export const isProductionEnv = (): boolean => getSiteEnv() === 'production';
