import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicAppwriteIdentifiers, normalizeServiceError } from './client';
import { getCaseStudies, getPricingTiers } from './queries';
import { submitCommercialInquiry, submitDiagnosticLead, validateLead } from './mutations';

const valid = {
  name: 'Synthetic QA',
  email: 'qa@example.test',
  organization: 'Synthetic Practice',
  noPhi: true,
};
const extra = { providers: '6-10', challenge: 'Denials and rejections' };
const options = {
  endpoint: 'https://root.example.test/contact',
  ownedDelivery: true,
  deliveryPayload: {
    name: valid.name,
    email: valid.email,
    organization: valid.organization,
    need: 'Revenue Optimization Diagnostic',
    message: 'No patient data. Synthetic test.',
    no_phi_acknowledgement: true,
    'cf-turnstile-response': 'synthetic-turnstile-token',
  },
};

afterEach(() => vi.unstubAllGlobals());

describe('ROOT Appwrite public-site boundary', () => {
  it('leaves SDK identifiers optional but validates incomplete and insecure pairs', () => {
    expect(getPublicAppwriteIdentifiers({})).toBeNull();
    expect(() => getPublicAppwriteIdentifiers({ VITE_APPWRITE_PROJECT_ID: 'project' })).toThrow(/BOTH/);
    expect(() => getPublicAppwriteIdentifiers({
      VITE_APPWRITE_ENDPOINT: 'http://example.test/v1', VITE_APPWRITE_PROJECT_ID: 'project',
    })).toThrow(/HTTPS/);
    expect(getPublicAppwriteIdentifiers({
      VITE_APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1/', VITE_APPWRITE_PROJECT_ID: 'project',
    })).toEqual({ endpoint: 'https://cloud.appwrite.io/v1', projectId: 'project' });
  });
  it('translates AppwriteException and HTTP codes to safe public errors', () => {
    expect(normalizeServiceError({ code: 403 }).kind).toBe('unauthorized');
    expect(normalizeServiceError({ code: 429 }).kind).toBe('rate_limit');
    expect(normalizeServiceError({ code: 503 }).kind).toBe('unavailable');
    expect(normalizeServiceError(new Error('do not show this secret')).message).not.toContain('secret');
  });
  it('keeps case studies publication-gated and pricing typed as published', async () => {
    const studies = await getCaseStudies();
    expect(studies.ok).toBe(true);
    if (studies.ok) expect(studies.data.every((row) => row.publicReady)).toBe(true);
    const pricing = await getPricingTiers();
    expect(pricing.ok).toBe(true);
    if (pricing.ok) {
      expect(pricing.data[0].price).toBe('$2,500 fixed fee');
      expect(pricing.data[0].href).toBe('/diagnostic/');
    }
  });
});

describe('validated public lead mutations', () => {
  it('rejects malformed identity, emails, organizations and missing no-PHI consent', () => {
    expect(validateLead({ ...valid, email: 'bad' }).ok).toBe(false);
    expect(validateLead({ ...valid, organization: 'A' }).ok).toBe(false);
    expect(validateLead({ ...valid, organization: 'x'.repeat(241) }).ok).toBe(false);
    expect(validateLead({ ...valid, noPhi: false }).ok).toBe(false);
    expect(validateLead(valid, { providers: 'not-a-range', challenge: extra.challenge }).ok).toBe(false);
    expect(validateLead(valid, extra)).toEqual({ ok: true, data: true });
  });
  it('never calls the public relay on a validation failure', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await submitDiagnosticLead({ ...valid, email: 'not-an-email', ...extra }, options);
    expect(result).toMatchObject({ ok: false, error: { code: 400, kind: 'validation' } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('sends exactly the existing approved owned-contact body and confirms receipt', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true, delivered: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(await submitDiagnosticLead({ ...valid, ...extra }, options)).toEqual({ ok: true, data: { acknowledged: true } });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe(options.endpoint);
    expect(JSON.parse(request.body)).toEqual(options.deliveryPayload);
    expect(request.method).toBe('POST');
  });
  it('fails closed on unconfirmed response and suppresses thrown errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true, delivered: false }),
    }));
    expect((await submitCommercialInquiry(valid, options)).ok).toBe(false);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('private-data-do-not-echo')));
    const result = await submitDiagnosticLead({ ...valid, ...extra }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).not.toMatch(/private-data/);
  });
  it('rejects insecure URL, identity substitution and invalid HTTP responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 429 });
    vi.stubGlobal('fetch', fetchMock);
    expect((await submitDiagnosticLead({ ...valid, ...extra }, { ...options, endpoint: 'http://example.test/' })).ok).toBe(false);
    expect((await submitDiagnosticLead({ ...valid, ...extra }, { ...options, deliveryPayload: { ...options.deliveryPayload, name: 'someone else' } })).ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    const reply = await submitDiagnosticLead({ ...valid, ...extra }, options);
    expect(reply).toMatchObject({ ok: false, error: { code: 429, kind: 'rate_limit' } });
  });
});
