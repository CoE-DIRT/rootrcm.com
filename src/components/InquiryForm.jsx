import { useId, useMemo, useReducer, useState } from 'react';
import { ArrowRight, CircleAlert, CircleCheck, Copy, LoaderCircle, Mail, ShieldCheck, X } from 'lucide-react';
import { getExperimentContext } from '../v4/experiments/engine.ts';
import { buildDeliveryPayload, getInquiryEndpoint } from '../modules/glass-core/formDelivery.js';
import { submitDiagnosticLead, submitCommercialInquiry } from '../v4/lib/appwrite/mutations.ts';
import { buildInquiryMailto, buildInquirySummary } from '../modules/glass-core/inquiryTemplate.js';
import InquiryVerification from './InquiryVerification.jsx';
import { createInquiryState, inquiryReducer, validateFields, mapLeadError } from './inquiryStateMachine.js';

function getAttribution() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const current = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
  };
  const hasCurrent = Object.values(current).some(Boolean);
  if (hasCurrent) sessionStorage.setItem('root-attribution', JSON.stringify(current));
  try {
    return hasCurrent ? current : JSON.parse(sessionStorage.getItem('root-attribution') || '{}');
  } catch {
    return current;
  }
}

export default function InquiryForm({ variant = 'contact', formId = '' }) {
  const analyticsFormId = formId || (variant === 'diagnostic' ? 'diagnostic-inquiry' : 'contact-inquiry');
  const [machine, dispatch] = useReducer(inquiryReducer, undefined, createInquiryState);
  const form = machine.fields;
  const status = machine.phase;
  const errorPrefix = useId().replace(/:/g, '');
  const errorId = (name) => `${errorPrefix}-${name}-error`;
  const showError = (name) => machine.touched[name] ? machine.errors[name] : '';
  const invalidProps = (name) => ({ 'aria-invalid': Boolean(showError(name)), 'aria-describedby': showError(name) ? errorId(name) : undefined });
  const fieldMessage = (name) => showError(name) ? <small id={errorId(name)} className="fieldError">{showError(name)}</small> : null;
  const busy = status === 'submitting';
  const [attribution] = useState(getAttribution);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const ownedDelivery = import.meta.env.VITE_CONTACT_MODE === 'owned';
  const verificationKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
  const configuredEndpoint = import.meta.env.VITE_FORM_ENDPOINT || '';
  const endpoint = getInquiryEndpoint(configuredEndpoint);

  const payload = useMemo(() => ({
    ...form,
    ...attribution,
    inquiryType: variant,
    form_provider: configuredEndpoint ? 'configured-endpoint' : 'formsubmit-relay',
  }), [form, attribution, variant, configuredEndpoint]);
  const mailto = useMemo(() => buildInquiryMailto(payload), [payload]);
  const summary = useMemo(() => buildInquirySummary(payload), [payload]);
  const update = (field) => (event) => {
    const value = field === 'noPhi' ? event.target.checked : event.target.value;
    dispatch({ type: 'EDIT', field, value, variant });
  };
  const blur = (field) => () => dispatch({ type: 'BLUR', field, variant });

  const submit = async (event) => {
    event.preventDefault();
    if (busy || status === 'success' || form._honey) return;
    const errors = validateFields(form, variant);
    if (ownedDelivery && (!configuredEndpoint || !verificationKey || !verificationToken)) {
      errors.verification = 'Complete verification before submitting.';
    }
    if (Object.keys(errors).length) {
      dispatch({ type: 'INVALID', errors, variant });
      return; // VALIDATING never makes a network request.
    }
    // React clears currentTarget after the synchronous event handler returns.
    const formElement = event.currentTarget;
    dispatch({ type: 'SUBMIT' });
    try {
      // Read at submit time: by now every A/B surface on the page has resolved, so the context is complete.
      const experiment = getExperimentContext();
      const deliveryPayload = ownedDelivery ? {
        name: form.name, email: form.email, organization: form.organization,
        need: variant === 'diagnostic' ? 'Revenue Optimization Diagnostic' : 'Commercial inquiry',
        message: variant === 'diagnostic' ? `Providers: ${form.providers}\nSystem: ${form.system}\nChallenge: ${form.challenge}` : form.focus,
        no_phi_acknowledgement: form.noPhi,
        'cf-turnstile-response': verificationToken,
        inquiryType: variant,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        experiment: experiment.experiment,
        experiment_variant: experiment.experiment_variant,
      } : buildDeliveryPayload(
        { ...payload, ...experiment },
        typeof window === 'undefined' ? 'https://rootrcm.com' : window.location.origin + window.location.pathname,
      );
      const options = { endpoint, ownedDelivery, deliveryPayload };
      const identity = {
        name: form.name, email: form.email, organization: form.organization, noPhi: form.noPhi,
      };
      const result = variant === 'diagnostic'
        ? await submitDiagnosticLead({ ...identity, providers: form.providers, challenge: form.challenge }, options)
        : await submitCommercialInquiry(identity, options);
      if (!result.ok) {
        setVerificationToken('');
        formElement.dispatchEvent(new CustomEvent('root:form-failure'));
        dispatch({ type: 'FAILURE', message: mapLeadError(result.error) });
        return;
      }
      formElement.dispatchEvent(new CustomEvent('root:form-success'));
      dispatch({ type: 'SUCCESS' });
    } catch (error) {
      // Service exceptions are mapped, never shown verbatim to the visitor.
      if (import.meta.env.DEV && error?.name === 'AppwriteException') console.error(error.message);
      formElement.dispatchEvent(new CustomEvent('root:form-failure'));
      setVerificationToken('');
      dispatch({ type: 'FAILURE', message: mapLeadError({ code: error?.code ?? 0 }) });
    }
  };

  const copy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  const toast = machine.toast ? (
    <div className="inquiryToast glass-strong" role={machine.toast.kind === 'error' ? 'alert' : 'status'} aria-live={machine.toast.kind === 'error' ? 'assertive' : 'polite'}>
      {machine.toast.kind === 'success' ? <CircleCheck aria-hidden="true" size={20} /> : <CircleAlert aria-hidden="true" size={20} />}
      <span>{machine.toast.message}</span>
      <button type="button" className="inquiryToastClose" aria-label="Dismiss notification" onClick={() => dispatch({ type: 'DISMISS_TOAST' })}><X size={18} aria-hidden="true" /></button>
    </div>
  ) : null;

  if (status === 'success') {
    return (
      <div className="glassCard glass-success inquiryResult" data-state="success" role="status">
        <CircleCheck size={30} aria-hidden="true" />
        <h3>We've received your {variant === 'diagnostic' ? 'Diagnostic inquiry' : 'inquiry'}.</h3>
        <p>Thank you. Our team will review your deidentified details and follow up through the contact information supplied. This is not a confirmed appointment or payment.</p>
        <a className="button primary" href={variant === 'diagnostic' ? '/diagnostic/#diagnostic-form' : '/contact/'}>{variant === 'diagnostic' ? 'Book another diagnostic' : 'Send another inquiry'} <ArrowRight size={16} aria-hidden="true" /></a>
        {toast}
      </div>
    );
  }

  return (
    <form className="glassCard inquiryForm" onSubmit={submit} noValidate aria-busy={busy} data-state={status} data-form-id={analyticsFormId}>
      {status === 'error' && (
        <div className="inquiryErrorBanner glass-danger" role="alert">
          <CircleAlert size={20} aria-hidden="true" />
          <span>{machine.message}</span>
        </div>
      )}
      {toast}
      <div className="formHoney" aria-hidden="true">
        <label>
          Website
          <input tabIndex="-1" autoComplete="off" readOnly={busy} value={form._honey} onChange={update('_honey')} />
        </label>
      </div>
      <div className="fieldRow">
        <label>
          Name
          <input aria-label="Name" required readOnly={busy} value={form.name} onChange={update('name')} onBlur={blur('name')} autoComplete="name" {...invalidProps('name')} />
          {fieldMessage('name')}
        </label>
        <label>
          Work email
          <input aria-label="Work email" required readOnly={busy} type="email" value={form.email} onChange={update('email')} onBlur={blur('email')} autoComplete="email" {...invalidProps('email')} />
          {fieldMessage('email')}
        </label>
      </div>
      <label>
        Practice / organization
        <input aria-label="Practice / organization" required readOnly={busy} value={form.organization} onChange={update('organization')} onBlur={blur('organization')} autoComplete="organization" {...invalidProps('organization')} />
        {fieldMessage('organization')}
      </label>

      {variant === 'diagnostic' ? (
        <>
          <div className="fieldRow">
            <label>
              Number of providers
              <select aria-label="Number of providers" required disabled={busy} value={form.providers} onChange={update('providers')} onBlur={blur('providers')} {...invalidProps('providers')}>
                <option value="">Select</option>
                <option>1-5</option><option>6-10</option><option>11-20</option><option>21+</option>
              </select>
              {fieldMessage('providers')}
            </label>
            <label>
              Primary EHR / PM system <span className="optional">Optional</span>
              <input aria-label="Primary EHR / PM system" readOnly={busy} value={form.system} onChange={update('system')} onBlur={blur('system')} {...invalidProps('system')} />
              {fieldMessage('system')}
            </label>
          </div>
          <label>
            Biggest current challenge
            <select aria-label="Biggest current challenge" required disabled={busy} value={form.challenge} onChange={update('challenge')} onBlur={blur('challenge')} {...invalidProps('challenge')}>
              <option value="">Select</option>
              <option>High / aging A/R</option>
              <option>Denials and rejections</option>
              <option>Staffing / workflow</option>
              <option>Reporting / visibility</option>
              <option>Credentialing / enrollment</option>
              <option>Other</option>
            </select>
            {fieldMessage('challenge')}
          </label>
        </>
      ) : (
        <label>
          How can we help?
          <textarea aria-label="How can we help?" required readOnly={busy} rows="5" value={form.focus} onChange={update('focus')} onBlur={blur('focus')} placeholder="A/R, denials, credentialing, reporting, practice operations…" {...invalidProps('focus')} />
          {fieldMessage('focus')}
        </label>
      )}

      <label className="phiCheck">
        <input required disabled={busy} type="checkbox" checked={form.noPhi} onChange={update('noPhi')} onBlur={blur('noPhi')} {...invalidProps('noPhi')} />
        <span>I understand this is a commercial inquiry. I have not included and will not submit Protected Health Information (PHI) through this form.</span>
        {fieldMessage('noPhi')}
      </label>

      {ownedDelivery && <InquiryVerification siteKey={verificationKey} onToken={setVerificationToken} />}
      {machine.errors.verification && <small className="fieldError" role="alert">{machine.errors.verification}</small>}

      <button className="button primary full" type="submit" disabled={busy} data-cta={variant === 'diagnostic' ? 'request-diagnostic' : 'start-conversation'} data-location={`${variant}-form`} data-destination="info@rootrcm.com" data-engagement-type={variant}>
        {busy ? <><LoaderCircle className="inquirySpinner" size={18} aria-hidden="true" /> Sending…</> : <>{variant === 'diagnostic' ? 'Request Diagnostic' : 'Start the Conversation'} <ArrowRight size={17} /></>}
      </button>
      {status === 'error' && (
        <div className="formActions">
          <a className="button secondary" href={mailto} data-cta="open-email" data-location={`${variant}-form-fallback`} data-destination="mailto:info@rootrcm.com" data-engagement-type={variant}><Mail size={16} /> Email info@rootrcm.com</a>
          <button className="button secondary" type="button" onClick={copy}><Copy size={16} /> {copied ? 'Copied' : 'Copy summary'}</button>
        </div>
      )}
      <small className="formNote">Commercial inquiry only. Submission is relayed to info@rootrcm.com. Do not include PHI; sensitive data moves only through an approved secure channel after required agreements and controls are in place.</small>
    </form>
  );
}
