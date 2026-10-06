import { describe, expect, it } from 'vitest';
import { assertSafePublicEnv } from './envGuard.js';

describe('public build configuration guard', () => {
  it('accepts the intended public variables', () => {
    expect(() =>
      assertSafePublicEnv({
        VITE_CONTACT_MODE: 'owned',
        VITE_TURNSTILE_SITE_KEY: '0x4AAAAAAAexample',
        VITE_FORM_ENDPOINT: 'https://fn.example.test/',
        VITE_GA_MEASUREMENT_ID: 'G-ABC123DEF4',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_exampleexample',
        VITE_TRACKING_ENDPOINT: 'https://track.example.test/',
        VITE_SITE_ENV: 'preview',
      }),
    ).not.toThrow();
    expect(() => assertSafePublicEnv({})).not.toThrow();
  });

  it.each([
    ['VITE_STRIPE_SECRET_KEY', 'sk_test_x'],
    ['VITE_APPWRITE_API_KEY', 'standard_x'],
    ['VITE_TURNSTILE_SECRET_KEY', 'x'],
    ['VITE_CONTACT_RELAY_SECRET', 'x'],
    ['VITE_ADMIN_PASSWORD', 'x'],
  ])('refuses a secret-shaped browser variable: %s', (name, value) => {
    expect(() => assertSafePublicEnv({ [name]: value })).toThrow(/looks like a secret/);
  });

  it('ignores empty secret-shaped names (nothing would be shipped)', () => {
    expect(() => assertSafePublicEnv({ VITE_STRIPE_SECRET_KEY: '' })).not.toThrow();
  });

  it('refuses live Stripe keys', () => {
    expect(() => assertSafePublicEnv({ VITE_STRIPE_PUBLISHABLE_KEY: 'pk_live_example' })).toThrow(/pk_test_/);
  });

  it('refuses malformed analytics, environment and endpoint values', () => {
    expect(() => assertSafePublicEnv({ VITE_GA_MEASUREMENT_ID: 'UA-123' })).toThrow(/G-XXXXXXXXXX/);
    expect(() => assertSafePublicEnv({ VITE_SITE_ENV: 'staging' })).toThrow(/VITE_SITE_ENV/);
    expect(() => assertSafePublicEnv({ VITE_TRACKING_ENDPOINT: 'http://insecure.example.test' })).toThrow(/https/);
    expect(() => assertSafePublicEnv({ VITE_CHECKOUT_ENDPOINT: 'ftp://x' })).toThrow(/https/);
  });

  it('reports every problem at once', () => {
    expect(() => assertSafePublicEnv({ VITE_GA_MEASUREMENT_ID: 'bad', VITE_SITE_ENV: 'nope' })).toThrow(/VITE_GA_MEASUREMENT_ID[\s\S]*VITE_SITE_ENV/);
  });
});
