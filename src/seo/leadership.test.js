import { describe, expect, it } from 'vitest';
import { companyInfo, leadershipProfiles } from '../siteData.js';
import { organizationSchema } from './schema.js';

describe('verified ROOT public leadership identities', () => {
  it('publishes exactly the two approved named leadership records', () => {
    expect(leadershipProfiles.map((p) => p.name)).toEqual(['Aftab Shaukat', 'Kashif Ali']);
    expect(leadershipProfiles.map((p) => p.role)).toEqual([
      'Principal, Client Solutions & Service Delivery',
      'Senior Operations & Service Delivery Lead',
    ]);
  });
  it('does not invent a GitHub account for Kashif or assert unverified cofounder roles', () => {
    expect(leadershipProfiles[0].gitHub).toBe('https://github.com/aashaukatc');
    expect(leadershipProfiles[1].gitHub).toBeNull();
    expect(organizationSchema().founder).toBeUndefined();
    expect(organizationSchema().member).toHaveLength(2);
  });
  it('keeps structured identities and public signature contact synchronized', () => {
    const schema = organizationSchema();
    expect(schema.member.map((person) => person.sameAs[0])).toEqual(leadershipProfiles.map((p) => p.linkedIn));
    expect(schema.email).toBe(companyInfo.email);
    expect(schema.telephone).toBe(companyInfo.phone);
  });
});
