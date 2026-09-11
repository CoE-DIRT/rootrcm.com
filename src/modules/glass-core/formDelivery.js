export const ROOT_FORM_EMAIL = 'info@rootrcm.com';
export const ROOT_FORM_RELAY = `https://formsubmit.co/ajax/${ROOT_FORM_EMAIL}`;

export function getInquiryEndpoint(configuredEndpoint = '') {
  const endpoint = configuredEndpoint?.trim();
  return endpoint || ROOT_FORM_RELAY;
}

export function buildDeliveryPayload(payload, pageUrl = '') {
  return {
    ...payload,
    _subject: payload.inquiryType === 'diagnostic'
      ? `ROOT Revenue Optimization Diagnostic inquiry — ${payload.organization || 'New practice'}`
      : `ROOT commercial inquiry — ${payload.organization || 'New practice'}`,
    _template: 'table',
    _replyto: payload.email || '',
    _url: pageUrl,
  };
}
