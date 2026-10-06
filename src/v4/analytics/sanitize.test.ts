import { describe, expect, it } from 'vitest';
import { analyticsPaths } from '../../seo/routeRegistry.js';
import { referrerHost, sanitizeCampaign, sanitizePath, sanitizeProperties, sanitizeText, type UtmRegistry } from './sanitize';
import { ALLOWED_PROPERTY_KEYS, MAX_PATH_LENGTH } from './taxonomy';

// A purchase reference as the checkout Function derives it: 32 lower-case hex characters, never a Stripe id.
const REFERENCE = '3f2504e04f8941d39a0c0305e82c3301';

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

  it('normalises slashes, a missing trailing slash and index.html to the page', () => {
    expect(sanitizePath('//services///rcm/index.html')).toBe('/services/rcm/');
    expect(sanitizePath('/pricing')).toBe('/pricing/');
    expect(sanitizePath('/pricing/index.html')).toBe('/pricing/');
    expect(sanitizePath('/')).toBe('/');
    expect(sanitizePath('')).toBe('/');
    expect(sanitizePath(undefined)).toBe('/');
    expect(sanitizePath('pricing/')).toBe('/pricing/');
  });

  it('reports every public page and legacy alias as itself', () => {
    for (const path of analyticsPaths()) expect(sanitizePath(path), path).toBe(path);
    expect(sanitizePath('/company/about/')).toBe('/company/about/');
    expect(sanitizePath('/checkout/success/?session_id=cs_test_a1B2c3D4e5F6g7H8')).toBe('/checkout/success/');
  });

  it('never reports a path that is not one of the site pages: it becomes /404/', () => {
    for (const hostile of [
      '/patients/jane-doe/',
      '/patients/1234567890/records',
      '/u/alex@example.com',
      '/s/3f2504e0-4f89-11d3-9a0c-0305e82c3301',
      '/a b',
      '/services/jane-doe/',
      '/resources/some-unpublished-article/',
      '/__v4-lab/',
      '/case-studies/dirt-poc-01/',
      '/404.html',
      '/%E0%A4%A',
      `/${'a'.repeat(500)}`,
      '/about/extra/',
    ]) {
      expect(sanitizePath(hostile), hostile).toBe('/404/');
    }
  });

  it('keeps every reportable path within the column size the Function stores', () => {
    expect(Math.max(...analyticsPaths().map((path) => path.length))).toBeLessThanOrEqual(MAX_PATH_LENGTH);
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
      transaction_id: REFERENCE,
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
      transaction_id: REFERENCE,
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

  it('keeps an internal destination only when it is one of the site pages', () => {
    expect(sanitizeProperties({ destination: '/Technology/DIRT' })).toEqual({ destination: '/technology/dirt/' });
    expect(sanitizeProperties({ destination: '/patients/jane-doe/' })).toEqual({});
    expect(sanitizeProperties({ destination: '/404/' })).toEqual({ destination: '/404/' });
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

  it('never lets a Stripe identifier into analytics: only the server-derived purchase reference is accepted', () => {
    for (const stripeId of ['cs_test_a1B2c3D4e5F6g7H8', 'cs_live_a1B2c3D4e5F6g7H8', 'pi_3Abc123', 'ch_3Abc123', 'cus_Abc123', 'in_1Abc123']) {
      expect(sanitizeProperties({ transaction_id: stripeId }), stripeId).toEqual({});
    }
    expect(sanitizeProperties({ transaction_id: REFERENCE })).toEqual({ transaction_id: REFERENCE });
    for (const malformed of [REFERENCE.toUpperCase(), REFERENCE.slice(1), `${REFERENCE}0`, ` ${REFERENCE}`, 'g'.repeat(32)]) {
      expect(sanitizeProperties({ transaction_id: malformed }), malformed).toEqual({});
    }
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
  const registry: UtmRegistry = {
    utm_source: ['linkedin', 'google'],
    utm_medium: ['social', 'cpc'],
    utm_campaign: ['spring-denials-webinar'],
  };

  it('keeps a UTM value only when it is a registered label, whatever its case', () => {
    expect(sanitizeCampaign('utm_source', 'LinkedIn', registry)).toBe('linkedin');
    expect(sanitizeCampaign('utm_medium', ' social ', registry)).toBe('social');
    expect(sanitizeCampaign('utm_campaign', 'Spring-Denials-Webinar', registry)).toBe('spring-denials-webinar');
  });

  it('drops anything unregistered: a name, a practice, an email, a number, a label used in the wrong field', () => {
    for (const value of ['jane-smith', 'jane smith', 'northstar-clinic', 'alex@example.com', 'call 3025064685', 'x'.repeat(61), 'spring-denials', '', 42, null, undefined]) {
      expect(sanitizeCampaign('utm_campaign', value, registry), String(value)).toBeUndefined();
    }
    expect(sanitizeCampaign('utm_source', 'spring-denials-webinar', registry)).toBeUndefined();
    expect(sanitizeCampaign('utm_medium', 'linkedin', registry)).toBeUndefined();
  });

  it('registers no campaign by default, so no free-form campaign label can be stored until the owner registers one', () => {
    expect(sanitizeCampaign('utm_campaign', 'jane-smith')).toBeUndefined();
    expect(sanitizeCampaign('utm_campaign', 'denials')).toBeUndefined();
    expect(sanitizeCampaign('utm_source', 'LinkedIn')).toBe('linkedin');
    expect(sanitizeCampaign('utm_medium', 'Social')).toBe('social');
  });

  it('reduces a referrer to an external hostname', () => {
    expect(referrerHost('https://www.google.com/search?q=alex%40example.com', 'rootrcm.com')).toBe('www.google.com');
    expect(referrerHost('https://rootrcm.com/pricing/', 'rootrcm.com')).toBe('');
    expect(referrerHost('not a url', 'rootrcm.com')).toBe('');
    expect(referrerHost('', 'rootrcm.com')).toBe('');
  });
});
