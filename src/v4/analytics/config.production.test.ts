// @vitest-environment jsdom
// @vitest-environment-options { "url": "https://www.rootrcm.com/pricing/" }
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGaMeasurementId, getSiteEnv } from './config';

// This file runs the real module on a production hostname (jsdom is given https://www.rootrcm.com/), which the shared
// analytics tests cannot do because they run on localhost.
const GA_ID = 'G-TEST12345';

afterEach(() => vi.unstubAllEnvs());

describe('GA4 on the production hostname', () => {
  it('reports the production environment', () => {
    expect(window.location.hostname).toBe('www.rootrcm.com');
    expect(getSiteEnv()).toBe('production');
  });

  it('stays disabled without a Measurement ID and for a malformed one', () => {
    expect(getGaMeasurementId()).toBe('');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'UA-123456-1');
    expect(getGaMeasurementId()).toBe('');
  });

  it('uses a valid Measurement ID without any opt-in flag', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    expect(getGaMeasurementId()).toBe(GA_ID);
  });

  it('lets an explicit preview environment keep production traffic out even on this hostname', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    vi.stubEnv('VITE_SITE_ENV', 'preview');
    expect(getSiteEnv()).toBe('preview');
    expect(getGaMeasurementId()).toBe('');
  });
});
