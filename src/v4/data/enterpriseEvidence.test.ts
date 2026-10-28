import { describe, expect, it } from 'vitest';
import { enterpriseEvidenceSlots, publishedEvidenceSlots } from './enterpriseEvidence';

describe('public proof content controls', () => {
  it('reserves all three proof modules without inventing credentials or clients', () => {
    expect(enterpriseEvidenceSlots.map((slot) => slot.kind)).toEqual(['testimonial', 'credentials', 'partners']);
    expect(publishedEvidenceSlots().every((slot) => slot.status === 'pending')).toBe(true);
    expect(publishedEvidenceSlots().every((slot) => !slot.evidenceUrl && !slot.verifiedCopy)).toBe(true);
  });

  it('refuses to publish a verified testimonial without approved HTTPS evidence', () => {
    const slot = enterpriseEvidenceSlots[0];
    const result = publishedEvidenceSlots([{ ...slot, status: 'verified', verifiedCopy: 'Unverified claim' }]);
    expect(result[0].status).toBe('pending');
    expect(result[0].verifiedCopy).toBeUndefined();
  });

  it('allows a properly supported, approved record to replace its placeholder', () => {
    const slot = enterpriseEvidenceSlots[0];
    const result = publishedEvidenceSlots([{ ...slot, status: 'verified', verifiedCopy: 'Approved, attributable client statement', evidenceUrl: 'https://rootrcm.com/case-studies/' }]);
    expect(result[0]).toMatchObject({ status: 'verified', verifiedCopy: 'Approved, attributable client statement' });
  });
});
