const ROOT_INQUIRY_EMAIL = 'hello@rootrcm.com';

export function buildInquirySummary({ name, email, organization, focus }) {
  return [
    'ROOT PHI-capable MSO platform inquiry',
    '',
    `Name: ${name}`,
    `Work email: ${email}`,
    `Practice / organization: ${organization}`,
    '',
    'MSO / revenue operations area needing attention:',
    focus,
    '',
    'Compliance note: ROOT is structured for PHI-aware MSO operations, but this public inquiry must contain deidentified operational context only. A BAA, access control, and approved secure channel are required before sharing PHI or patient-level files.',
  ].join('\n');
}

export function buildInquiryMailto(inquiry) {
  const subject = encodeURIComponent(`ROOT MSO platform inquiry - ${inquiry.organization}`);
  const body = encodeURIComponent(buildInquirySummary(inquiry));

  return `mailto:${ROOT_INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}