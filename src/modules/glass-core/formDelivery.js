export const ROOT_FORM_EMAIL = 'info@rootrcm.com';
export const ROOT_FORM_RELAY = `https://formsubmit.co/ajax/${ROOT_FORM_EMAIL}`;

export function getInquiryEndpoint(configuredEndpoint = '') {
  const endpoint = configuredEndpoint?.trim();
  return endpoint || ROOT_FORM_RELAY;
}

export function isDeliveryAcknowledged(result, ownedDelivery = false) {
  // The owned relay confirms SMTP acceptance; FormSubmit uses success.
  // Never treat an HTTP 200 containing an application error as delivery.
  if (!result || result.ok === false || result.success === false || result.success === 'false') return false;
  if (ownedDelivery) return result.ok === true && result.delivered === true;
  return (result.ok === true && result.delivered === true)
    || result.success === true || result.success === 'true';
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
