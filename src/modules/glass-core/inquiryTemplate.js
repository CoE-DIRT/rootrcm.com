const ROOT_INQUIRY_EMAIL = 'hello@rootrcm.com';

export function buildInquirySummary({
  name,
  email,
  organization,
  providers,
  system,
  challenge,
  focus,
  inquiryType,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
}) {
  const lines = [
    inquiryType === 'diagnostic' ? 'ROOT Revenue Optimization Diagnostic inquiry' : 'ROOT commercial inquiry',
    '',
    `Name: ${name || ''}`,
    `Work email: ${email || ''}`,
    `Practice / organization: ${organization || ''}`,
  ];

  if (providers) lines.push(`Providers: ${providers}`);
  if (system) lines.push(`EHR / PM system: ${system}`);
  if (challenge) lines.push(`Primary challenge: ${challenge}`);
  if (focus) lines.push('', 'Deidentified operating context:', focus);

  if (utm_source || utm_medium || utm_campaign || utm_content) {
    lines.push('', 'Attribution:', `Source: ${utm_source || ''}`, `Medium: ${utm_medium || ''}`, `Campaign: ${utm_campaign || ''}`, `Content: ${utm_content || ''}`);
  }

  lines.push(
    '',
    'Compliance note: this public inquiry contains deidentified commercial context only. Do not send PHI through public website or email channels. ROOT will establish an approved secure channel and required agreements before accepting patient-level or other protected data.',
  );

  return lines.join('\n');
}

export function buildInquiryMailto(inquiry) {
  const subject = encodeURIComponent(`${inquiry.inquiryType === 'diagnostic' ? 'ROOT Diagnostic' : 'ROOT'} inquiry - ${inquiry.organization || 'Practice'}`);
  const body = encodeURIComponent(buildInquirySummary(inquiry));
  return `mailto:${ROOT_INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}
