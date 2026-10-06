import { describe, expect, it } from 'vitest';
import { referrerHost, sanitizeCampaign, sanitizePath, sanitizeProperties, sanitizeText } from './sanitize';
import { ALLOWED_PROPERTY_KEYS } from './taxonomy';

describe('sanitizeText', () => {
  it.each([
    ['alex@example.com', 'email address'],
    ['name is Alex Rivera, DOB 01/02/1980', 'free text with comma and slashes'],
    ['+1 (302) 506 4685', 'phone number'],
    ['3025064685', 'bare phone digits'],
    ['claim 12345678', 'long numeric run'],
    ['a'.repeat(101), 'oversized'],
    ['', 'empty'],
    ['<script>alert(1)</script>', 'markup'],
    ['line\nbreak', 'control characters'],
  ])('rejects %s (%s)', (value) => {
    expect(sanitizeText(value)).toBeNull();
  });

  it('accepts short identifiers and trims', () => {
    expect(sanitizeText('  book-diagnostic ')).toBe('book-diagnostic');
    expect(sanitizeText('home-hero')).toBe('home-hero');
    expect(sanitizeText(42)).toBeNull();
    expect(sanitizeText(null)).toBeNull();
  });
});

describe('sanitizePath', () => {
  it('drops query strings and fragments and lower-cases', () => {
    expect(sanitizePath('/Contact/?email=alex@example.com&utm_source=x#top')).toBe('/contact/');
  });

  it('collapses slashes, normalises index.html and defaults to the root', () => {
    expect(sanitizePath('//services///rcm/index.html')).toBe('/services/rcm/');
    expect(sanitizePath('')).toBe('/');
    expect(sanitizePath(undefined)).toBe('/');
    expect(sanitizePath('relative/path')).toBe('/relative/path');
  });

  it('redacts ID-like, email-like and long-numeric segments', () => {
    expect(sanitizePath('/patients/1234567890/records')).toBe('/patients/:id/records');
    expect(sanitizePath('/u/alex@example.com')).toBe('/u/:id');
    expect(sanitizePath('/s/3f2504e0-4f89-11d3-9a0c-0305e82c3301')).toBe('/s/:id');
    expect(sanitizePath('/a b')).toBe('/:id');
  });

  it('bounds the length', () => {
    expect(sanitizePath(`/${'a'.repeat(500)}`).length).toBeLessThanOrEqual(200);
  });
});

describe('sanitizeProperties', () => {
  it('keeps only allowlisted keys with valid values', () => {
    const clean = sanitizeProperties({
      cta_id: 'book-diagnostic',
      cta_location: 'home-hero',
      engagement_type: 'diagnostic',
      percent_scrolled: 50,
      value: 2500,
      currency: 'usd',
      product_id: 'revenue-optimization-diagnostic',
      transaction_id: 'cs_test_a1B2c3D4e5F6g7H8',
      variant: 'b',
      experiment_id: 'exp-hero-cta-v1',
      status: 'success',
      form_id: 'contact-inquiry',
    });
    expect(clean).toEqual({
      cta_id: 'book-diagnostic',
      cta_location: 'home-hero',
      engagement_type: 'diagnostic',
      percent_scrolled: 50,
      value: 2500,
      currency: 'USD',
      product_id: 'revenue-optimization-diagnostic',
      transaction_id: 'cs_test_a1B2c3D4e5F6g7H8',
      variant: 'b',
      experiment_id: 'exp-hero-cta-v1',
      status: 'success',
      form_id: 'contact-inquiry',
    });
  });

  it('drops unknown keys, including every field a form could contain', () => {
    const clean = sanitizeProperties({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      phone: '3025064685',
      message: 'patient John Doe MRN 12345678',
      organization: 'Northstar Clinic',
      claim_id: 'CLM-1',
      cta_id: 'book-diagnostic',
    });
    expect(clean).toEqual({ cta_id: 'book-diagnostic' });
  });

  it('drops allowlisted keys whose values look personal', () => {
    expect(sanitizeProperties({ cta_id: 'alex@example.com', cta_location: '+13025064685', status: 'x'.repeat(40) })).toEqual({});
  });

  it('never forwards phone, email or full-URL destinations', () => {
    for (const destination of ['tel:+13025064685', 'mailto:info@rootrcm.com', 'https://wa.me/13025064685?text=hello', 'sms:+1302', '/contact/?email=a@b.co']) {
      expect(sanitizeProperties({ destination }), destination).toEqual({});
    }
    expect(sanitizeProperties({ destination: '/diagnostic/' })).toEqual({ destination: '/diagnostic/' });
    expect(sanitizeProperties({ destination: 'LinkedIn' })).toEqual({ destination: 'LinkedIn' });
  });

  it('bounds numbers and validates currency and transaction identifiers', () => {
    expect(sanitizeProperties({ percent_scrolled: 101 })).toEqual({});
    expect(sanitizeProperties({ percent_scrolled: -1 })).toEqual({});
    expect(sanitizeProperties({ percent_scrolled: Number.NaN })).toEqual({});
    expect(sanitizeProperties({ value: 1e9 })).toEqual({});
    expect(sanitizeProperties({ value: '2500.456' })).toEqual({ value: 2500.46 });
    expect(sanitizeProperties({ currency: 'US$' })).toEqual({});
    expect(sanitizeProperties({ transaction_id: 'pi_123' })).toEqual({});
    expect(sanitizeProperties({ transaction_id: 'alex@example.com' })).toEqual({});
  });

  it('is total over hostile input', () => {
    expect(sanitizeProperties(undefined)).toEqual({});
    expect(sanitizeProperties(null)).toEqual({});
    expect(sanitizeProperties('string' as unknown as Record<string, unknown>)).toEqual({});
    expect(sanitizeProperties({ __proto__: { cta_id: 'x' }, constructor: 'y' } as Record<string, unknown>)).toEqual({});
  });

  it('exposes exactly the documented allowlist', () => {
    expect([...ALLOWED_PROPERTY_KEYS].sort()).toEqual(
      ['cta_id', 'cta_location', 'currency', 'destination', 'engagement_type', 'experiment_id', 'form_id', 'percent_scrolled', 'product_id', 'status', 'transaction_id', 'value', 'variant'].sort(),
    );
  });
});

describe('campaign and referrer helpers', () => {
  it('sanitises UTM values to slug-like text', () => {
    expect(sanitizeCampaign('LinkedIn')).toBe('linkedin');
    expect(sanitizeCampaign('spring_denials-2026')).toBe('spring_denials-2026');
    expect(sanitizeCampaign('alex@example.com')).toBeUndefined();
    expect(sanitizeCampaign('call 3025064685')).toBeUndefined();
    expect(sanitizeCampaign('x'.repeat(61))).toBeUndefined();
  });

  it('reduces a referrer to an external hostname', () => {
    expect(referrerHost('https://www.google.com/search?q=alex%40example.com', 'rootrcm.com')).toBe('www.google.com');
    expect(referrerHost('https://rootrcm.com/pricing/', 'rootrcm.com')).toBe('');
    expect(referrerHost('not a url', 'rootrcm.com')).toBe('');
    expect(referrerHost('', 'rootrcm.com')).toBe('');
  });
});
