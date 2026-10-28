#!/usr/bin/env node
/**
 * ROOT paid-advertising launch preflight.
 *
 * This script intentionally NEVER invents GA4/Google Ads IDs, claims a live inbox
 * receipt, reads passwords or makes an advertising purchase. A passing engineering
 * build is not evidence that an ad account or delivery path was verified.
 *
 * Use --strict only after recording externally validated evidence; CI runs the
 * default informative mode so missing third-party account setup cannot block
 * ordinary bug fixes or website builds.
 */
import process from 'node:process';

const env = process.env;
const ga4 = (env.ROOT_P0_GA4_MEASUREMENT_ID || '').trim();
const realGaId = /^G-[A-Z0-9]{4,20}$/.test(ga4) && !/TEST|EXAMPLE|LOREM|PLACEHOLDER/i.test(ga4);
const receipt = (key) => {
  const value = (env[key] || '').trim();
  return value.length >= 8 && value.length <= 120 && !/lorem|test-placeholder|example/i.test(value);
};
const affirmed = (key) => env[key] === 'verified';

const checks = [
  ['Contact inbox delivery proof', receipt('ROOT_P0_CONTACT_RECEIPT_ID'), 'Record the actual mailbox receipt/message ID for a synthetic no-PHI contact submission.'],
  ['Diagnostic inbox delivery proof', receipt('ROOT_P0_DIAGNOSTIC_RECEIPT_ID'), 'Record the actual mailbox receipt/message ID for a synthetic no-PHI Diagnostic inquiry.'],
  ['GA4 configured in production', realGaId, 'Set the real VITE_GA_MEASUREMENT_ID on the Appwrite Site and redeploy; supply the same ID as ROOT_P0_GA4_MEASUREMENT_ID for this check.'],
  ['GA4 generate_lead verified', affirmed('ROOT_P0_GENERATE_LEAD_VERIFIED'), 'Verify exactly one consented generate_lead event after an acknowledged submission.'],
  ['Google Ads conversion linked and verified', affirmed('ROOT_P0_ADS_CONVERSION_VERIFIED'), 'Link the real Google Ads conversion action to the verified GA4 key event and test attribution.'],
  ['Email-domain authentication checked', affirmed('ROOT_P0_EMAIL_AUTH_VERIFIED'), 'Confirm SPF, DKIM, DMARC and reply routing for info@rootrcm.com.'],
  ['Consent/privacy review completed', affirmed('ROOT_P0_CONSENT_VERIFIED'), 'Confirm rejection/GPC blocks Google analytics and no patient information is forwarded.'],
  ['Campaign/landing compliance approved', affirmed('ROOT_P0_AD_POLICY_VERIFIED'), 'Approve ad copy, landing pages, no-PHI and healthcare advertising audience rules.'],
];

console.log('ROOT P0 — advertising launch evidence gate');
for (const [title, passed, next] of checks) {
  console.log(`${passed ? '[VERIFIED]' : '[BLOCKED]'} ${title}`);
  if (!passed) console.log(`          ${next}`);
}
const missing = checks.filter(([, passed]) => !passed).length;
console.log(missing ? `NO-GO: ${missing} evidence gates remain open. Do not activate paid advertising.` : 'EVIDENCE-COMPLETE: independently check account-side conversion and spend settings before activation.');
if (process.argv.includes('--strict') && missing) process.exitCode = 1;
