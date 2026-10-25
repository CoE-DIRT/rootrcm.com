/**
 * Phase 3.2 explicit finite-state reducer. Network side-effects stay in the
 * form controller; each transition is deterministic and individually testable.
 */
export const PHASES = Object.freeze(['idle', 'validating', 'submitting', 'success', 'error']);
const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
const providers = new Set(['1-5','6-10','11-20','21+']);
const challenges = new Set(['High / aging A/R','Denials and rejections','Staffing / workflow','Reporting / visibility','Credentialing / enrollment','Other']);
export const initialFields = {
  name: '', email: '', organization: '', providers: '', system: '',
  challenge: '', focus: '', noPhi: false, _honey: '',
};

export function fieldError(field, value, variant = 'contact') {
  const string = typeof value === 'string' ? value.trim() : '';
  switch (field) {
    case 'name': return !string || string.length > 200 ? 'Enter your name (up to 200 characters).' : '';
    case 'email': return !emailPattern.test(string) || string.length > 254 ? 'Enter a valid work email address.' : '';
    case 'organization': return string.length < 2 || string.length > 240 ? 'Enter a practice name between 2 and 240 characters.' : '';
    case 'providers': return variant === 'diagnostic' && !providers.has(value) ? 'Select the number of providers.' : '';
    case 'challenge': return variant === 'diagnostic' && !challenges.has(value) ? 'Select your primary challenge.' : '';
    case 'focus': return variant !== 'diagnostic' && (!string || string.length > 5000) ? 'Describe the inquiry in up to 5,000 characters; do not include PHI.' : '';
    case 'system': return string.length > 200 ? 'Use 200 characters or fewer.' : '';
    case 'noPhi': return value !== true ? 'Confirm that this inquiry contains no PHI.' : '';
    default: return '';
  }
}

export function fieldNames(variant) {
  return variant === 'diagnostic'
    ? ['name','email','organization','providers','challenge','system','noPhi']
    : ['name','email','organization','focus','noPhi'];
}
export function validateFields(fields, variant) {
  return Object.fromEntries(fieldNames(variant)
    .map((field) => [field, fieldError(field, fields[field], variant)])
    .filter(([,message]) => Boolean(message)));
}

export function createInquiryState() {
  return { phase: 'idle', fields: { ...initialFields }, touched: {}, errors: {}, message: '', toast: null };
}

export function inquiryReducer(state, action) {
  const { type } = action;
  if (type === 'RESET') return createInquiryState();
  if (type === 'DISMISS_TOAST') return { ...state, toast: null };
  if (type === 'EDIT') {
    if (state.phase === 'submitting' || state.phase === 'success') return state;
    const fields = { ...state.fields, [action.field]: action.value };
    const errors = { ...state.errors };
    if (state.touched[action.field]) {
      const issue = fieldError(action.field, action.value, action.variant);
      if (issue) errors[action.field] = issue;
      else delete errors[action.field];
    }
    return { ...state, fields, errors, phase: state.phase === 'error' ? 'validating' : state.phase,
      message: state.phase === 'error' ? '' : state.message, toast: state.phase === 'error' ? null : state.toast };
  }
  if (type === 'BLUR') {
    if (state.phase === 'submitting' || state.phase === 'success') return state;
    const errors = { ...state.errors };
    const issue = fieldError(action.field, state.fields[action.field], action.variant);
    if (issue) errors[action.field] = issue;
    else delete errors[action.field];
    // Do not hide the failure banner / email fallback just because a field
    // loses focus. Only an actual edit or deliberate resubmit changes phase.
    return { ...state, phase: state.phase === 'error' ? 'error' : 'validating',
      touched: { ...state.touched, [action.field]: true }, errors };
  }
  if (type === 'INVALID') {
    if (state.phase === 'submitting' || state.phase === 'success') return state;
    return { ...state, phase: 'validating', errors: action.errors,
      touched: Object.fromEntries(fieldNames(action.variant).map((field) => [field, true])), message: '', toast: null };
  }
  if (type === 'SUBMIT') {
    if (state.phase === 'submitting' || state.phase === 'success') return state;
    return { ...state, phase: 'submitting', message: '', toast: null };
  }
  if (type === 'SUCCESS' && state.phase === 'submitting')
    return { ...state, phase: 'success', message: '', toast: { kind: 'success', message: 'Your inquiry was received.' } };
  if (type === 'FAILURE' && state.phase === 'submitting')
    return { ...state, phase: 'error', message: action.message,
      toast: { kind: 'error', message: 'Something went wrong — please try again' } };
  return state;
}

/** Never render server exception strings, response bodies, or user-submitted values. */
export function mapLeadError(error) {
  switch (error?.code) {
    case 401: return 'Your session expired. Refresh and try again.';
    case 409: return 'A booking already exists for this email.';
    case 429: return 'Too many requests. Please try again shortly.';
    default:
      return error?.code >= 500
        ? 'Our system is temporarily unavailable. Please retry in a moment.'
        : 'We could not confirm delivery. Please review your details and try again.';
  }
}
