import { describe, expect, it, vi } from 'vitest';
import { cleanLeadAttribution, readLeadAttribution } from './leadAttribution.js';

describe('P0 safe first-touch lead attribution', () => {
  it('keeps registered source and medium while excluding injected identifiers, PII and unknown campaigns', () => {
    expect(readLeadAttribution('?utm_source=Google&utm_medium=CPC&utm_campaign=patient-123456789&utm_content=person%40example.com'))
      .toEqual({ utm_source: 'google', utm_medium: 'cpc' });
    expect(cleanLeadAttribution({ utm_source: 'alice@example.com', utm_medium: 'cpc', utm_campaign: 'john-doe' }))
      .toEqual({ utm_medium: 'cpc' });
  });

  it('preserves registered first-touch channel between pages even when later URL carries new UTMs', () => {
    const store = new Map();
    const storage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, value) => store.set(key, value),
    };
    expect(readLeadAttribution('?utm_source=google&utm_medium=cpc', storage))
      .toEqual({ utm_source: 'google', utm_medium: 'cpc' });
    expect(readLeadAttribution('?utm_source=linkedin&utm_medium=paid', storage))
      .toEqual({ utm_source: 'google', utm_medium: 'cpc' });
    expect(JSON.parse(store.get('root-attribution'))).toEqual({ utm_source: 'google', utm_medium: 'cpc' });
  });

  it('silently survives unavailable storage without blocking the inquiry', () => {
    const storage = { getItem: vi.fn(() => { throw new Error('blocked'); }), setItem: vi.fn(() => { throw new Error('blocked'); }) };
    expect(readLeadAttribution('?utm_source=google&utm_medium=cpc', storage))
      .toEqual({ utm_source: 'google', utm_medium: 'cpc' });
  });

  it('re-sanitizes legacy stored session values and never returns untrusted UTM content', () => {
    const storage = { getItem: () => JSON.stringify({ utm_source: 'google', utm_medium: 'cpc', utm_content: 'sensitive', utm_campaign: 'patient-id-321654987' }) };
    expect(readLeadAttribution('', storage)).toEqual({ utm_source: 'google', utm_medium: 'cpc' });
  });
});
