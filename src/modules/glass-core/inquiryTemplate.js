const ROOT_INQUIRY_EMAIL = 'hello@rootrcm.com';

export function buildInquirySummary({ name, email, organization, focus }) {
  return [
    'ROOT Revenue Optimization Diagnostic inquiry',
    '',
    `Name: ${name}`,
    `Work email: ${email}`,
    `Practice / organization: ${organization}`,
    '',
    'Area needing attention:',
    focus,
    '',
    'Compliance note: This outreach should contain deidentified operational context only. A BAA or approved secure channel is required before sharing PHI or patient-level files.',
  ].join('\n');
}

export function buildInquiryMailto(inquiry) {
  const subject = encodeURIComponent(`ROOT diagnostic inquiry - ${inquiry.organization}`);
  const body = encodeURIComponent(buildInquirySummary(inquiry));

  return `mailto:${ROOT_INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}
