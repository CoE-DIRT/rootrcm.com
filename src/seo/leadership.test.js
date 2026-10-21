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
  it('asserts both owner-confirmed co-founders without inventing a GitHub account for Kashif', () => {
    expect(leadershipProfiles[0].gitHub).toBe('https://github.com/aashaukatc');
    expect(leadershipProfiles[1].gitHub).toBeNull();
    expect(leadershipProfiles.every((person) => person.isCoFounder)).toBe(true);
    expect(organizationSchema().founder.map((person) => person.name)).toEqual(['Aftab Shaukat', 'Kashif Ali']);
    expect(organizationSchema().founder[1].sameAs).toEqual(['https://www.linkedin.com/in/kashif-ali-9874a6237/']);
    expect(organizationSchema().member).toHaveLength(2);
  });
  it('keeps structured identities and public signature contact synchronized', () => {
    const schema = organizationSchema();
    expect(schema.member.map((person) => person.sameAs[0])).toEqual(leadershipProfiles.map((p) => p.linkedIn));
    expect(schema.email).toBe(companyInfo.email);
    expect(schema.telephone).toBe(companyInfo.phone);
  });
});
