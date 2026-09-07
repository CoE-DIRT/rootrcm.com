import { useMemo, useState } from 'react';
import { ArrowRight, Copy, Mail, ShieldCheck } from 'lucide-react';
import { buildInquiryMailto, buildInquirySummary } from '../modules/glass-core/inquiryTemplate.js';

const initialState = {
  name: '',
  email: '',
  organization: '',
  providers: '',
  system: '',
  challenge: '',
  focus: '',
  noPhi: false,
};

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

export default function InquiryForm({ variant = 'contact' }) {
  const [form, setForm] = useState(initialState);
  const [attribution] = useState(getAttribution);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

  const payload = useMemo(() => ({ ...form, ...attribution, inquiryType: variant }), [form, attribution, variant]);
  const mailto = useMemo(() => buildInquiryMailto(payload), [payload]);
  const summary = useMemo(() => buildInquirySummary(payload), [payload]);
  const canSubmit = form.name && form.email && form.organization && form.noPhi && (variant === 'contact' ? form.focus : form.providers && form.challenge);

  const update = (field) => (event) => {
    const value = field === 'noPhi' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    if (!endpoint) {
      setStatus('fallback');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Submission failed');
      window.location.assign('/thank-you/');
    } catch {
      setStatus('fallback');
    }
  };

  const copy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  if (status === 'fallback') {
    return (
      <div className="glassCard formFallback" role="status">
        <ShieldCheck size={28} />
        <h3>Your deidentified inquiry is ready.</h3>
        <p>The secure form endpoint is not active yet, so nothing was stored by this website. Continue by email or copy the summary.</p>
        <div className="formActions">
          <a className="button primary" href={mailto}><Mail size={16} /> Open email</a>
          <button className="button secondary" type="button" onClick={copy}><Copy size={16} /> {copied ? 'Copied' : 'Copy summary'}</button>
        </div>
        <button className="textButton" type="button" onClick={() => setStatus('idle')}>Edit inquiry</button>
      </div>
    );
  }

  return (
    <form className="glassCard inquiryForm" onSubmit={submit}>
      <div className="fieldRow">
        <label>
          Name
          <input required value={form.name} onChange={update('name')} autoComplete="name" />
        </label>
        <label>
          Work email
          <input required type="email" value={form.email} onChange={update('email')} autoComplete="email" />
        </label>
      </div>
      <label>
        Practice / organization
        <input required value={form.organization} onChange={update('organization')} autoComplete="organization" />
      </label>

      {variant === 'diagnostic' ? (
        <>
          <div className="fieldRow">
            <label>
              Number of providers
              <select required value={form.providers} onChange={update('providers')}>
                <option value="">Select</option>
                <option>1-5</option><option>6-10</option><option>11-20</option><option>21+</option>
              </select>
            </label>
            <label>
              Primary EHR / PM system <span className="optional">Optional</span>
              <input value={form.system} onChange={update('system')} />
            </label>
          </div>
          <label>
            Biggest current challenge
            <select required value={form.challenge} onChange={update('challenge')}>
              <option value="">Select</option>
              <option>High / aging A/R</option>
              <option>Denials and rejections</option>
              <option>Staffing / workflow</option>
              <option>Reporting / visibility</option>
              <option>Credentialing / enrollment</option>
              <option>Other</option>
            </select>
          </label>
        </>
      ) : (
        <label>
          How can we help?
          <textarea required rows="5" value={form.focus} onChange={update('focus')} placeholder="A/R, denials, credentialing, reporting, practice operations…" />
        </label>
      )}

      <label className="phiCheck">
        <input required type="checkbox" checked={form.noPhi} onChange={update('noPhi')} />
        <span>I understand this is a commercial inquiry. I have not included and will not submit Protected Health Information (PHI) through this form.</span>
      </label>

      <button className="button primary full" type="submit" disabled={!canSubmit || status === 'sending'}>
        {status === 'sending' ? 'Sending…' : variant === 'diagnostic' ? 'Request Diagnostic' : 'Start the Conversation'} <ArrowRight size={17} />
      </button>
      <small className="formNote">Public-site inquiries must remain deidentified. PHI moves only through an approved secure channel after required agreements and controls are in place.</small>
    </form>
  );
}
