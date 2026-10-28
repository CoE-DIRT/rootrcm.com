/**
 * Public commercial evidence slots for the ROOT website.
 * Replace pending records only after written authorization, independent verification
 * and a check of the exact scope of any endorsement or accreditation.
 *
 * This is the intentional static read-model behind the visible proof modules.
 * A future read-only Appwrite/approved CMS adapter may hydrate verified data,
 * but no public browser write access or PHI-capable backend is introduced.
 */
export type EvidenceKind = 'testimonial' | 'credentials' | 'partners';
export type EvidenceStatus = 'pending' | 'verified';

export interface EvidenceSlot {
  kind: EvidenceKind;
  title: string;
  description: string;
  status: EvidenceStatus;
  statusLabel: string;
  /** Public proof evidence URL, if and only if published/approved. */
  evidenceUrl?: string;
  /** Displayed verified statement, never fill with an invented quote or claim. */
  verifiedCopy?: string;
}

export const enterpriseEvidenceSlots: readonly EvidenceSlot[] = [
  {
    kind: 'testimonial',
    title: 'Verified client testimonials',
    description: 'A dedicated space for approved client quotations and independently reviewable engagement references.',
    status: 'pending',
    statusLabel: 'IN PREPARATION',
  },
  {
    kind: 'credentials',
    title: 'Licensing & certifications',
    description: 'Relevant registrations, accreditations and credentials, with issuer, applicable scope and verification evidence.',
    status: 'pending',
    statusLabel: 'VERIFICATION PENDING',
  },
  {
    kind: 'partners',
    title: 'Technology partners & ecosystem',
    description: 'An approved partner directory for validated technology relationships and trademark-authorized brand marks.',
    status: 'pending',
    statusLabel: 'PARTNER REVIEW IN PROGRESS',
  },
] as const;

/** A verified record without attributable evidence is never publishable. */
export function publishedEvidenceSlots(slots: readonly EvidenceSlot[] = enterpriseEvidenceSlots): EvidenceSlot[] {
  return slots.map((slot) => (
    slot.status === 'verified' && (!slot.verifiedCopy?.trim() || !/^https:\/\//.test(slot.evidenceUrl || ''))
      ? { ...slot, status: 'pending' as const, statusLabel: 'VERIFICATION PENDING', verifiedCopy: undefined, evidenceUrl: undefined }
      : slot
  ));
}
