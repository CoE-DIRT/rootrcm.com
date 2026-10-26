// Shared browser/server schema. Reject markup rather than silently rewriting user input.
export function isPlainText(value, max, min = 0, multiline = false) {
  return typeof value === 'string' && value.length <= max && value.trim().length >= min
    && !/[<>]/.test(value)
    && ![...value].some(c => (c.charCodeAt(0) < 32 && !(multiline && '\n\r\t'.includes(c))) || c.charCodeAt(0) === 127);
}
export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length > 254) return false;
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0].length > 64) return false;
  // Dot-atom local part and DNS labels; reject consecutive dots and edge hyphens.
  return /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(parts[0])
    && parts[1].length <= 253 && parts[1].includes('.')
    && parts[1].split('.').every(label => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label))
    && /^[A-Za-z]{2,63}$/.test(parts[1].split('.').at(-1));
}
const fields = { name: [200, 1], email: [254, 1], organization: [240, 2], need: [120, 1], message: [5000, 1, true] };
const metadata = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'experiment', 'experiment_variant'];
export function parseContactPayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Invalid inquiry');
  /** @type {Record<string, string | boolean>} */
  const data = {};
  for (const [field, [max, min, multiline]] of Object.entries(fields)) {
    if (!isPlainText(input[field], max, min, multiline)) throw new TypeError('Invalid inquiry');
    data[field] = input[field].trim();
  }
  if (!isValidEmail(data.email) || input.no_phi_acknowledgement !== true
      || !isPlainText(input['cf-turnstile-response'], 2048, 1)) throw new TypeError('Invalid inquiry');
  data.no_phi_acknowledgement = true;
  data['cf-turnstile-response'] = input['cf-turnstile-response'].trim();
  data.inquiryType = input.inquiryType === 'diagnostic' ? 'diagnostic' : 'contact';
  for (const field of metadata) {
    const value = input[field] ?? '';
    if (!isPlainText(value, 200)) throw new TypeError('Invalid inquiry');
    data[field] = value.trim();
  }
  return data;
}
