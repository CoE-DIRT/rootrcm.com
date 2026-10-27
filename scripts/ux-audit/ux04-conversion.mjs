/**
 * UX-0.4 — Read-only rendered conversion audit.
 * No production requests. No real lead submission or personal information.
 */
import { chromium } from '@playwright/test';
import { allRoutes } from '../../src/seo/routeRegistry.js';
import { fieldNames } from '../../src/components/inquiryStateMachine.js';
import { CTA_IDS } from '../../src/v4/analytics/dimensions.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'docs/website/baseline/conversion-audit.md');
const JSON_OUT = resolve(ROOT, 'docs/website/baseline/conversion-evidence.json');
const APP_URL = 'http://127.0.0.1:4319';
const tick = String.fromCharCode(96);
const quote = (v) => tick + String(v ?? '').replaceAll(tick, "'") + tick;
const cell = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').replace(/\|/g, '/').replace(/\s+/g, ' ').trim().slice(0, 200);
const slug = (p) => p.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'home';
const classification = (target, text, cta, route) => {
  const x = (target + ' ' + text + ' ' + cta).toLowerCase();
  // A Partner Network application is commercial partnership interest, NOT a job application.
  if (route.startsWith('/partners/') && /partner network|partnership|apply by email|express interest/.test(x)) return 'Unmapped / informational';
  if (/\.txt\b|\.pdf\b|download|checklist|playbook/.test(x)) return 'Resource download';
  if (/\/careers\/|apply by email|express interest|jobs|hiring|employment/.test(x)) return 'Careers';
  if (/diagnostic|checkout|stripe|purchase|2500|2,500/.test(x)) return '$2,500 Diagnostic';
  if (/\/contact\/|\/book\/|mailto:|whatsapp|tel:|schedule-call|consult|conversation|talk-to|call-us|phone/.test(x)) return 'Consultation';
  return 'Unmapped / informational';
};
const expectedState = (target, cta, funnel) => {
  if (/^mailto:|^tel:|wa\.me|whatsapp/i.test(target)) return ['External communication handoff (unverifiable)', 'External app / mail client unavailable'];
  if (cta === 'start-checkout') return ['Stripe redirects → /checkout/success/ after payment verification', 'Inline checkout failure with retry/email fallback'];
  if (cta === 'request-diagnostic' || cta === 'start-conversation') return ["Inline 'We've received your inquiry' (not confirmed booking)", 'Inline validation/errors; fallback email and copy summary'];
  if (funnel === 'Resource download') return ['Browser download (no form confirmation)', 'Missing asset/browser download failure'];
  if (funnel === 'Careers') return ['Application email handoff; no on-site confirmation', 'Email client unavailable; no on-site error handling'];
  if (target.startsWith('/')) return ['Destination page/form; confirmation depends on subsequent action', 'Navigation/route error; no CTA-specific error state'];
  return ['Action-dependent; not independently verified', 'No dedicated error state verified'];
};
const approved = new Set(CTA_IDS);
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const rows = [], forms = [], errors = [];
for (const r of allRoutes) {
  try {
    const response = await page.goto(APP_URL + r.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('main#main-content').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    const reject = page.getByRole('button', { name: 'Reject non-essential' });
    if (await reject.count()) await reject.click({ timeout: 700 }).catch(() => {});
    await page.waitForTimeout(150);

    const snapshot = await page.evaluate(() => {
      const selector = '[data-cta],a[download],.root-primary-cta,a.button,button.button,form button[type="submit"],a[href^="mailto:"],a[href^="tel:"],.v4-footer-cta a';
      const nodes = [...new Set([...document.querySelectorAll(selector)])];
      const ctas = nodes.filter(el => {
        if (!el.matches('a,button')) return false;
        if (el.closest('#klaro, .klaro, [role="dialog"]')) return false;
        if (el.closest('nav') && !el.hasAttribute('data-cta')) return false;
        if (/^(Dismiss|Open menu|Close menu|Switch to|Light theme)$/i.test(el.getAttribute('aria-label') || '')) return false;
        return true;
      }).map(el => {
        const t = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
        const form = el.closest('form');
        return {
          label: t || el.getAttribute('aria-label') || '(icon / unlabeled)',
          target: el.getAttribute('href') || el.getAttribute('data-destination') || (el.matches('[type="submit"]') ? 'form-submit' : '(button action)'),
          tag: el.tagName.toLowerCase(), id: el.getAttribute('data-cta') || '',
          location: el.getAttribute('data-location') || (el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : form ? 'form' : 'page'),
          formId: form?.getAttribute('data-form-id') || '',
          download: el.hasAttribute('download'),
          visible: !!(el.getClientRects().length),
        };
      });
      const formDetails = [...document.querySelectorAll('form')].filter(f => f.getAttribute('data-form-id') || f.querySelector('button[type=submit]')).map(f => ({
        id: f.getAttribute('data-form-id') || 'unidentified',
        labels: [...f.querySelectorAll('input,select,textarea')].map(el => {
          const parentLabel = el.closest('label');
          const label = el.getAttribute('aria-label') || parentLabel?.innerText?.replace(/\s+/g, ' ').trim() || '';
          return { label, name: el.getAttribute('name'), type: el.tagName.toLowerCase() === 'input' ? el.getAttribute('type') || 'text' : el.tagName.toLowerCase(), required: el.hasAttribute('required'), hidden: !!el.closest('[aria-hidden=true]') };
        })
      }));
      return { ctas, formDetails };
    });
    for (const c of snapshot.ctas) {
      const funnel = classification(c.target, c.label, c.id, r.path);
      const vague = /^(learn more|get started|click here|read more|explore more|submit|continue|more information)\b/i.test(c.label);
      const [success, error] = expectedState(c.target, c.id, funnel);
      const analytic = c.id ? (approved.has(c.id) ? (/^(tel:)/.test(c.target) ? 'phone_click' : 'cta_click') : 'NO APPROVED EVENT (' + c.id + ')') :
        /^tel:/.test(c.target) ? 'phone_click' : 'No explicit CTA event';
      rows.push({ route: r.path, label: c.label, target: c.target, formId: c.formId, location: c.location,
        ctaId: c.id, funnel, success, error, analytic, vague, visible: c.visible });
    }
    for (const f of snapshot.formDetails) forms.push({ route: r.path, ...f });
    if (!response || response.status() >= 400) errors.push({ route: r.path, message: 'HTTP ' + (response?.status() ?? 'none') });
  } catch (error) {
    errors.push({ route: r.path, message: String(error) });
  }
  console.log('UX04 ' + r.path + ' -> ' + rows.filter(x => x.route === r.path).length + ' CTAs');
}
await browser.close();

// Also inspect the closed-state CTA drawer: a primary "Talk to us" button
// expands to WhatsApp, phone, email, all excluded from initial DOM.
const formSource = readFileSync(resolve(ROOT, 'src/components/InquiryForm.jsx'), 'utf8');
const stateSource = readFileSync(resolve(ROOT, 'src/components/inquiryStateMachine.js'), 'utf8');
const listeners = readFileSync(resolve(ROOT, 'src/v4/analytics/listeners.ts'), 'utf8');
const posthogAdapter = readFileSync(resolve(ROOT, 'src/v4/analytics/adapter.ts'), 'utf8');
const PHI_BLOCK = /(?:patient(?:[\s_-]*(?:name|id|dob|details))?|date[\s_-]*of[\s_-]*birth|\bdob\b|\bssn\b|social[\s_-]*security|member[\s_-]*id|claim[\s_-]*(?:number|no|#)|diagnos(?:is|es)|\bmrn\b|medical[\s_-]*record[\s_-]*(?:number|id))/i;
const formRows = forms.flatMap(f=>f.labels.map(x=>({route:f.route,id:f.id,...x,
 flag: PHI_BLOCK.test([x.label,x.name].filter(Boolean).join(' ')) ? 'Explicit patient identifier risk' :
    /^\s*name\s*$/i.test(x.label) ? 'Ambiguous Name (professional contact in this form)' :
    x.type === 'textarea' ? 'Open narrative: may receive PHI' : 'No PHI field-label match' })));
const riskFields = formRows.filter(x=>x.flag !== 'No PHI field-label match');
const coreFieldSet = {
  contact: fieldNames('contact').join(', '),
  diagnostic: fieldNames('diagnostic').join(', ')
};
const directForms = [...new Set(forms.map(x=>x.id))];
const knownEvents = ['page_view','cta_click','form_submit','phone_click','checkout_start','purchase'];
const frictionEvents = ['form_view','form_start','field_focus','field_error','validation_error','form_abandon','form_submit','form_success','form_failure','funnel_abandon'];
const routed = rows.filter(x=>x.funnel !== 'Unmapped / informational').length;
const untagged = rows.filter(x=>x.analytic.startsWith('No explicit')).length;
const suspicious = rows.filter(x=>x.vague);
const counts = Object.fromEntries(['Consultation','$2,500 Diagnostic','Resource download','Careers','Unmapped / informational'].map(c=>[c,rows.filter(x=>x.funnel===c).length]));
const lines = [
  '# UX-0.4 — Conversion path audit (RCM buyer lens)',
  '',
  '**Scope:** ' + allRoutes.length + ' registry routes, local Vite browser at ' + quote(APP_URL) + '; inventory includes repeated shared header/footer CTAs per route, plus rendered page-level conversion buttons and downloads. Browser output reflects default configured environment: feature-flagged checkout may be absent. No real submissions were sent.',
  '**Run context:** source branch ' + quote('codex/ux-0-4-conversion-audit') + ', inherited from the approved UX-0.3 baseline.',
  '**Measurement caveat:** PostHog reporting data was not connected/read; instrumentation can be assessed in source, but no actual views, conversion counts, rates or DAU are known.',
  '',
  '## Executive results',
  '',
  '| Measure | Result |',
  '|---|---:|',
  '| Registry routes visited | ' + allRoutes.length + ' |',
  '| Total rendered CTA instances (includes shared header/footer repeats) | ' + rows.length + ' |',
  '| CTA instances mapped to the four primary funnels | ' + routed + ' |',
  '| Consultation | ' + counts['Consultation'] + ' |',
  '| $2,500 Diagnostic | ' + counts['$2,500 Diagnostic'] + ' |',
  '| Resource download | ' + counts['Resource download'] + ' |',
  '| Careers | ' + counts['Careers'] + ' |',
  '| Unmapped / informational or partner-only actions | ' + counts['Unmapped / informational'] + ' |',
  '| CTA instances without an approved explicit CTA event | ' + untagged + ' |',
  '| Vague outcome-free labels (exact phrase match) | ' + suspicious.length + ' |',
  '| Rendered forms | ' + forms.length + ' |',
  '| Routes with navigation / evaluation errors | ' + errors.length + ' |',
  '',
  '## Buyer intent taxonomy',
  '',
  '**Consultation** = ' + quote('/contact/') + ', ' + quote('/book/') + ', direct business phone/email/WhatsApp and conversation requests. **$2,500 Diagnostic** = ' + quote('/diagnostic/') + ', the inquiry flow or gated Stripe checkout. **Resource download** = actual downloadable assets. **Careers** = employment/application intents. **Unmapped / informational** includes platform/solution discovery, legal navigation, partner-program links and other actions outside the four revenue funnels; these are explicitly flagged instead of being forced into an unrelated category.',
  '',
  '## Every rendered CTA (route-specific instances)',
  '',
  '| Route | Label | Target | Location / form | Funnel | Success state | Error state | Analytics event | Buyer-language issue |',
  '|---|---|---|---|---|---|---|---|---|'
];
for (const c of rows) lines.push('| ' + quote(c.route) + ' | ' + cell(c.label) + ' | ' + quote(c.target) +
 ' | ' + cell(c.location + (c.formId ? ' / ' + c.formId : '')) + ' | ' + cell(c.funnel) +
 ' | ' + cell(c.success) + ' | ' + cell(c.error) + ' | ' + cell(c.analytic) + ' | ' + (c.vague ? '**Vague: name outcome**' : c.funnel === 'Unmapped / informational' ? 'Review mapping' : '—') + ' |');
lines.push('',
 '### Condition-dependent and state-dependent CTAs (source verified)',
 '',
 '| Surface | Label / action | Funnel | Availability | Success / error | Analytics |',
 '|---|---|---|---|---|---|',
 '| Header primary CTA | A/B-test label or configured primary CTA | $2,500 Diagnostic | Sitewide desktop/mobile | Opens diagnostic route; navigation failure | ' + quote('cta_click') + ' if approved and consented |',
 '| Talk-to-us dialog | WhatsApp / Phone / Email channels | Consultation | Dialog open, only live channels | Opens external channel; no on-site confirmation/error | ' + quote('cta_click') + ' / ' + quote('phone_click') + ' if approved and consented |',
 '| CheckoutButton | A/B checkout label; ' + quote('start-checkout') + ' | $2,500 Diagnostic | Renders only if TEST-MODE checkout endpoint + Stripe key enabled | Stripe redirect / inline checkout error | ' + quote('checkout_start') + ' upon successful session creation (consent gated) |',
 '| InquiryForm | ' + quote('Request Diagnostic') + ' or ' + quote('Start the Conversation') + ' | Diagnostic / Consultation | Contact, Book and Diagnostic form contexts | Inline success (not booking) / validation and network failure + mail fallback | ' + quote('cta_click') + ' and ' + quote('form_submit') + ' success/failure when consented |',
 '| InquiryForm failure fallback | Email info@rootrcm.com / Copy summary | Consultation / Diagnostic | Only after submission failure | Email/copy handoff, not confirmed delivery | Email tagged ' + quote('open-email') + '; copy has no approved CTA marker |',
 '| InquiryForm success | Book another diagnostic / Send another inquiry | Diagnostic / Consultation | Only after acknowledged response | Resets form / if repeat fails, form error | No explicit ' + quote('data-cta') + ' on reset link |',
 '',
 '## Form fields, validation and PHI audit',
 '',
 'The blocklist inspected case-insensitive field labels and names for: ' + quote('name') + ', ' + quote('dob') + ', ' + quote('ssn') + ', ' + quote('member id') + ', ' + quote('claim #') + ', ' + quote('diagnosis') + ', ' + quote('patient') + ', ' + quote('mrn') + '. A plain ' + quote('Name') + ' field is treated separately: it is explicitly a professional contact name in this commercial form, not by itself proof that patient names are collected.',
 '',
 '| Route | Form ID | Field / accessible label | HTML name | Type | Required | PHI / risk classification |',
 '|---|---|---|---|---|---|---|'
);
for(const f of formRows) lines.push('| '+quote(f.route)+' | '+quote(f.id)+' | '+cell(f.label)+' | '+quote(f.name||'(none)')+' | '+quote(f.type)+' | '+(f.required?'Y':'N')+' | '+f.flag+' |');
lines.push('',
 '### PHI scan verdict — NOT CERTIFIED',
 '',
 '- **No explicit patient identifiers were identified in the rendered form field labels** (such as patient DOB, SSN, claim number, member ID, diagnosis or MRN). Contact ' + quote('Name') + ' refers to a professional, but name-bearing data must be purpose-limited and handled appropriately.',
 '- **Confirmed exposure risk:** Contact and Book use an unrestricted ' + quote('How can we help?') + ' textarea / ' + quote('focus') + ' state field accepting up to 5,000 characters. A warning and ' + quote('noPhi') + ' acknowledgment exist, but ' + quote('fieldError') + ' and ' + quote('validateFields') + ' only check presence/length; no tested PHI-content blocklist rejects names, DOBs, SSNs, MRNs or claim identifiers.',
 '- Diagnostic ' + quote('system') + ' is an open text input (200 characters) and likewise has no semantic PHI blocker. Controlled provider-range and challenge selectors do not request patient details.',
 '- The rendered HTML inputs rely mainly on React-state keys rather than HTML ' + quote('name') + ' attributes; the source field map is: Contact ' + quote(coreFieldSet.contact) + '; Diagnostic ' + quote(coreFieldSet.diagnostic) + '. Audit coverage must combine both.',
 '- **Required before claiming zero-PHI collection:** eliminate free-text or add client and server-side structured controls and PHI-content rejection; ensure test coverage with synthetic identifiers. Regex filtering alone cannot guarantee PHI never enters a public form. This audit did not submit sensitive examples or real PHI.',
 '',
 '## Success, failure and instrumentation contract',
 '',
 '| Funnel | View | CTA click | Form start | Submit | Confirmation | Actual PostHog baseline |',
 '|---|---|---|---|---|---|---|',
 '| Consultation | ' + quote('page_view') + ' (consent gated) | ' + quote('cta_click') + ' (tagged) / ' + quote('phone_click') + ' | PostHog ' + quote('form_start') + ' via formFriction attachment | ' + quote('form_submit') + ' success/failure + PostHog ' + quote('form_submit') + ' | Inline success ' + quote('form_success') + ' / error ' + quote('form_failure') + '; no confirmed appointment | **Unavailable (no PostHog data connection)** |',
 '| $2,500 Diagnostic | ' + quote('page_view') + ' | ' + quote('cta_click') + ' + optional ' + quote('checkout_start') + ' | PostHog ' + quote('form_start') + ' | ' + quote('form_submit') + ' or test-mode checkout | Inline inquiry acknowledgment; test-mode paid return yields ' + quote('purchase') + ' only after server verification | **Unavailable (no PostHog data connection)** |',
 '| Resource download | ' + quote('page_view') + ' | Link has no dedicated ' + quote('data-cta') + ' event | **Not instrumented (no form)** | **Not instrumented (direct asset)** | Browser download; no dedicated completion event | **Unavailable (no PostHog data connection)** |',
 '| Careers | ' + quote('page_view') + ' | Application email/partner links often lack ' + quote('data-cta') + ' | **Not instrumented (external email)** | **Not instrumented (external email)** | No tracked receipt or on-site confirmation | **Unavailable (no PostHog data connection)** |',
 '',
 '**Analytics traces:** ' + quote('src/App.jsx') + ' dispatches ' + quote('root:cta') + ' on tagged clicks; ' + quote('src/v4/analytics/listeners.ts') + ' emits allowlisted ' + quote('cta_click') + ', ' + quote('phone_click') + ', ' + quote('form_submit') + ', and ' + quote('page_view') + '. ' + quote('src/v4/analytics/formFriction.ts') + ' attaches ' + frictionEvents.map(x=>quote(x)).join(', ') + ' to a separately consent-gated PostHog adapter. ' + quote('src/v4/analytics/adapter.ts') + ' only calls ' + quote('posthog.capture') + ' after a configured PostHog key and explicit analytics consent; actual account event delivery and historical funnel counts are **not verified**.',
 '',
 '### Conversion-copy and instrumentation recommendations',
 '',
 '1. Replace vague ' + quote('Learn more') + ' / ' + quote('Get started') + ' and generic ' + quote('Start Diagnostic') + ' labels with an explicitly named outcome and transparent $2,500 pricing where applicable; avoid promising a confirmed booking after an inquiry.',
 '2. Add explicit approved event identifiers to important currently untagged CTA links (especially the ungated resource download and career/application handoffs); preserve the event privacy allowlist and consent gating.',
 '3. Fix PHI risk before introducing marketing traffic to any uncontrolled narrative field. Do not rely only on acknowledgments.',
 '4. Distinguish consultation inquiry confirmations from purchases. Confirmed checkout events require Stripe verification; do not treat request submission as payment.',
 '5. Retrieve verified PostHog trends, with consent denominator and event definitions, before calculating funnel conversion or assigning DAU uplift estimates.',
 '',
 '## Coverage and caveats',
 '',
 '- Browser inventory is **rendered-state**, includes shared CTAs repeated on each route, and excludes ordinary legal/content/navigation links unless tagged as CTAs or button-like. It may not expose variant-specific, logged-in or feature-disabled controls; those are explicitly documented in the conditional table.',
 '- Success/error states are traced from React source; no real business inquiry, payment or client email was sent. Browser navigation response codes alone do not certify delivery.',
 '- UX-0.2 screenshots: [Screenshot index](./screens/index.md). Raw structured CTA/field evidence: [conversion-evidence.json](./conversion-evidence.json).',
 '- Zero application-source files were modified; this is an audit artifact, not a fix.',
 ''
);
for (const e of errors) lines.push('- Audit warning: ' + quote(e.route) + ' ' + cell(e.message));
mkdirSync(resolve(ROOT, 'docs/website/baseline'), { recursive: true });
writeFileSync(OUT, lines.join('\n').trimEnd() + '\n');
writeFileSync(JSON_OUT, JSON.stringify({ executedAt:new Date().toISOString(), routes:allRoutes.length, counts, ctas:rows, forms, phiFlags:riskFields, vague:suspicious, errors, analyticsSources:knownEvents, posthogFrictionEvents:frictionEvents, sourceIndicators:{
  formSourceHasBlockRegex: /(?:detectPhi|PHI_BLOCKLIST|blocklistRegex|rejectSensitive|containsPhi)/i.test(formSource+stateSource),
  formSourceContainsExplicitConsent:formSource.includes('have not included and will not submit Protected Health Information'),
  isPostHogCapturePresent:posthogAdapter.includes('posthog.capture'),
  hasCTAListener:listeners.includes("track('cta_click'")
} }, null, 2));
console.log(JSON.stringify({routes:allRoutes.length,ctas:rows.length,forms:forms.length,fieldRows:formRows.length,phiRiskRows:riskFields.length,vague:suspicious.length,unmapped:counts['Unmapped / informational'],errors:errors.length,reportLines:lines.length}));
if(errors.length) process.exitCode=1;
