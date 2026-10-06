import type { CaptureResult } from 'posthog-js';
import { describe, expect, it } from 'vitest';
import { buildPostHogConfig, isRegisteredPageUrl, sanitizePostHogEvent } from './posthogPrivacy';

const ORIGIN = 'https://rootrcm.com';
const event = (properties: Record<string, unknown>, extra: Partial<CaptureResult> = {}): CaptureResult => ({ uuid: '3f2504e0-4f89-41d3-9a0c-0305e82c3301', event: '$pageview', properties, ...extra });
const clean = (properties: Record<string, unknown>, extra: Partial<CaptureResult> = {}) => sanitizePostHogEvent(event(properties, extra), ORIGIN)!.properties;

describe('PostHog event sanitiser: addresses', () => {
  it('reduces this site\'s own address to a registered page path, dropping the query string and fragment', () => {
    const properties = clean({
      $current_url: 'https://rootrcm.com/pricing/?patient=jane-doe&mrn=123456#section',
      $pathname: '/pricing/',
      $session_entry_url: 'https://rootrcm.com/services/rcm/?q=jane', // a registered service page
      $session_entry_pathname: '/services/',
    });
    expect(properties).toMatchObject({
      $current_url: 'https://rootrcm.com/pricing/',
      $pathname: '/pricing/',
      $session_entry_url: 'https://rootrcm.com/services/rcm/',
      $session_entry_pathname: '/services/',
    });
    expect(JSON.stringify(properties)).not.toMatch(/jane|patient|mrn|123456|section/);
  });

  it('turns a visitor-typed path into the not-found page, in the address and in the pathname', () => {
    const properties = clean({ $current_url: 'https://rootrcm.com/patients/jane-doe-claim-12345/?x=1', $pathname: '/patients/jane-doe-claim-12345/' });
    expect(properties.$current_url).toBe('https://rootrcm.com/404/');
    expect(properties.$pathname).toBe('/404/');
    expect(JSON.stringify(properties)).not.toMatch(/jane|claim|12345/);
  });

  it('keeps only the origin of another site\'s address, and the domain only as a plain hostname', () => {
    const properties = clean({
      $referrer: 'https://search.example/results?q=jane+doe+denial#top',
      $referring_domain: 'Search.Example',
      $session_entry_referrer: 'https://mail.example/inbox/patient-jane',
      $session_entry_referring_domain: 'mail.example/inbox',
    });
    expect(properties.$referrer).toBe('https://search.example/');
    expect(properties.$referring_domain).toBe('search.example');
    expect(properties.$session_entry_referrer).toBe('https://mail.example/');
    expect(properties).not.toHaveProperty('$session_entry_referring_domain'); // not a hostname
    expect(JSON.stringify(properties)).not.toMatch(/jane|denial|inbox/);
  });

  it('keeps PostHog\'s own marker for "no referrer", and treats this site as a referrer like any page of it', () => {
    expect(clean({ $referrer: '$direct', $referring_domain: '$direct' })).toEqual({ $referrer: '$direct', $referring_domain: '$direct' });
    expect(clean({ $referrer: 'https://rootrcm.com/faq/?x=jane' }).$referrer).toBe('https://rootrcm.com/faq/');
  });

  it('drops an address that is not http(s) or cannot be read, and resolves a relative one against this site', () => {
    const properties = clean({ $current_url: 'javascript:alert(1)', $referrer: 'data:text/html,jane', $session_entry_url: '/contact/?name=jane' });
    expect(properties).not.toHaveProperty('$current_url');
    expect(properties).not.toHaveProperty('$referrer');
    expect(properties.$session_entry_url).toBe('https://rootrcm.com/contact/');
  });

  it('rewrites heatmap pages the same way and merges the ones that collapse together', () => {
    const properties = clean({
      $heatmap_data: {
        'https://rootrcm.com/pricing/?plan=jane': [{ x: 1 }],
        'https://rootrcm.com/pricing/': [{ x: 2 }],
        'https://rootrcm.com/patients/jane/': [{ x: 3 }],
        'https://other.example/a?b=c': [{ x: 4 }],
        'ftp://x/y': [{ x: 5 }],
      },
    });
    expect(properties.$heatmap_data).toEqual({
      'https://rootrcm.com/pricing/': [{ x: 1 }, { x: 2 }],
      'https://rootrcm.com/404/': [{ x: 3 }],
      'https://other.example/': [{ x: 4 }],
    });
    expect(clean({ $heatmap_data: 'not an object' })).not.toHaveProperty('$heatmap_data');
  });
});

describe('PostHog event sanitiser: campaigns, identifiers and person properties', () => {
  it('keeps a campaign tag only as a registered label and drops every other utm field and click identifier', () => {
    const properties = clean({
      utm_source: 'LinkedIn',
      utm_medium: 'social',
      utm_campaign: 'jane-doe-spring', // nothing is registered as a campaign
      utm_term: 'patient jane',
      utm_content: 'x',
      $session_entry_utm_source: 'Google',
      $session_entry_utm_campaign: 'jane',
      gclid: 'abc',
      fbclid: 'abc',
      msclkid: 'abc',
      mc_cid: 'abc',
      $initial_gclid: 'abc',
    });
    expect(properties).toEqual({ utm_source: 'linkedin', utm_medium: 'social', $session_entry_utm_source: 'google' });
  });

  it('drops free-text fields and the person properties, wherever they appear', () => {
    const sanitised = sanitizePostHogEvent(
      event(
        { email: 'a@b.test', phone: '3025550123', name: 'Jane Doe', $set: { email: 'a@b.test' }, $set_once: { $initial_referrer: 'https://x.example/?q=jane' }, $external_click_url: 'https://wa.me/1?text=jane', $el_text: 'Jane', keep: 'yes' },
        { $set: { name: 'Jane' }, $set_once: { $initial_current_url: 'https://rootrcm.com/?patient=jane' }, $unset: ['x'] },
      ),
      ORIGIN,
    )!;
    expect(sanitised.properties).toEqual({ keep: 'yes' });
    expect(sanitised).not.toHaveProperty('$set');
    expect(sanitised).not.toHaveProperty('$set_once');
    expect(sanitised).not.toHaveProperty('$unset');
    expect(JSON.stringify(sanitised)).not.toMatch(/jane|a@b\.test|3025550123/i);
  });

  it('leaves everything else untouched, does not modify its input and passes a cancelled event through', () => {
    const input = event({ $browser: 'Chrome', distinct_id: 'abc', $screen_width: 1200, $current_url: 'https://rootrcm.com/?x=1' });
    const before = JSON.stringify(input);
    const output = sanitizePostHogEvent(input, ORIGIN)!;
    expect(output.properties).toMatchObject({ $browser: 'Chrome', distinct_id: 'abc', $screen_width: 1200 });
    expect(output.uuid).toBe(input.uuid);
    expect(output.event).toBe('$pageview');
    expect(JSON.stringify(input)).toBe(before);
    expect(sanitizePostHogEvent(null, ORIGIN)).toBeNull();
  });

  it('accepts a campaign registry that has a campaign registered', () => {
    const registry = { utm_source: ['google'], utm_medium: ['email'], utm_campaign: ['spring-denials-webinar'] };
    const properties = sanitizePostHogEvent(event({ utm_campaign: 'Spring-Denials-Webinar', utm_source: 'x' }), ORIGIN, registry)!.properties;
    expect(properties).toEqual({ utm_campaign: 'spring-denials-webinar' });
  });
});

describe('what counts as a recordable page', () => {
  it.each([
    ['https://rootrcm.com/', true],
    ['https://rootrcm.com/pricing/', true],
    ['https://rootrcm.com/pricing', true], // the host serves it at the slash form
    ['https://rootrcm.com/pricing/?utm_source=google', false],
    ['https://rootrcm.com/pricing/#top', false],
    ['https://rootrcm.com/checkout/success/?session_id=cs_test_123', false],
    ['https://rootrcm.com/patients/jane-doe/', false],
    ['not a url', false],
  ])('%s -> %s', (href, expected) => {
    expect(isRegisteredPageUrl(href)).toBe(expected);
  });
});

describe('PostHog configuration', () => {
  const config = (pageUrl: string) => buildPostHogConfig({ host: 'https://ph.example.test', pageUrl });

  it('never captures element text or attributes, hashes, exceptions, dead clicks or surveys', () => {
    for (const pageUrl of ['https://rootrcm.com/pricing/', 'https://rootrcm.com/pricing/?x=1']) {
      expect(config(pageUrl)).toMatchObject({
        mask_all_text: true,
        mask_all_element_attributes: true,
        disable_capture_url_hashes: true,
        capture_exceptions: false,
        capture_dead_clicks: false,
        disable_surveys: true,
        api_host: 'https://ph.example.test',
      });
      expect(config(pageUrl).session_recording).toMatchObject({ maskAllInputs: true });
    }
  });

  it('records sessions and maps heatmaps only on a registered page opened without a query string or fragment', () => {
    expect(config('https://rootrcm.com/pricing/')).toMatchObject({ disable_session_recording: false });
    expect(config('https://rootrcm.com/pricing/')).not.toHaveProperty('capture_heatmaps');
    for (const pageUrl of ['https://rootrcm.com/pricing/?plan=jane', 'https://rootrcm.com/pricing/#x', 'https://rootrcm.com/patients/jane/']) {
      expect(config(pageUrl), pageUrl).toMatchObject({ disable_session_recording: true, capture_heatmaps: false });
    }
  });

  it('sends every event through the sanitiser and no longer uses the deprecated hook', () => {
    const built = config('https://rootrcm.com/pricing/');
    expect(built).not.toHaveProperty('sanitize_properties');
    expect(typeof built.before_send).toBe('function');
    const send = built.before_send as (capture: CaptureResult | null) => CaptureResult | null;
    expect(send(event({ $current_url: `${window.location.origin}/pricing/?patient=jane` }))!.properties.$current_url).toBe(`${window.location.origin}/pricing/`);
    expect(send(null)).toBeNull();
  });
});
