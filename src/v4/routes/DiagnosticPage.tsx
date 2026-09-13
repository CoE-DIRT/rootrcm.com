import { useEffect, useRef } from 'react';
import { Check, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Callout } from '@/components/ui/Callout';
import { MediaFrame } from '@/components/ui/MediaFrame';
import InquiryForm from '../../components/InquiryForm.jsx';
import { attachFormFrictionListeners } from '@/analytics/formFriction';
import { diagnosticDeliverables, diagnosticFaq, mediaAssets } from '../../siteData.js';
import { diagnosticSample, syntheticPractice } from '../../proofData.js';
import { isDiagnosticCheckoutActive, startDiagnosticCheckout } from '@/growth/checkout';

const diagnosticJourney = [
  ['Share deidentified context', 'Describe operating pressure without PHI through the public inquiry form.'],
  ['Align on usable inputs', 'Aging, denial, rejection, posting, credentialing-status, and payment exports.'],
  ['ROOT analyzes the system', 'Leakage, denial families, A/R priority, workflow, and reporting gaps.'],
  ['Receive the 90-day plan', 'Ranked opportunity register with owners and next actions.'],
];

const diagnosticInputs = [
  'A/R aging by payer and age',
  'Denial and rejection exports',
  'Payment posting exception lists',
  'Credentialing / enrollment status views',
  'Leadership reports currently in use',
];

export function DiagnosticPage() {
  const formWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formWrapRef.current?.querySelector('form');
    if (!form) return undefined;
    return attachFormFrictionListeners(form, 'diagnostic-inquiry');
  }, []);

  return (
    <V4Shell minimal>
      <Section className="diagnosticHero pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Revenue Optimization Diagnostic</p>
            <h1 className="mt-3 text-4xl font-semibold text-text sm:text-5xl">See where your revenue system is leaking.</h1>
            <p className="lede mt-4 text-lg text-muted">
              For a fixed fee of $2,500, ROOT analyzes A/R, denials, workflow, payer signals, credentialing visibility, and
              operating reporting, then turns the findings into a prioritized 90-day roadmap.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-accent" aria-hidden="true" /> Fixed-fee $2,500 entry assessment
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-accent" aria-hidden="true" /> Prioritized opportunity register for leadership
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-accent" aria-hidden="true" /> 90-day operating roadmap with owners
              </li>
            </ul>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              Start with deidentified reports. PHI-enabled exchange opens only after the required agreement and secure
              channel are active.
            </p>
            <a href="#diagnostic-form" className="mt-6 inline-block text-sm font-medium text-accent">
              Start the inquiry form
            </a>
            {isDiagnosticCheckoutActive() ? (
              <button type="button" className="ml-4 text-sm text-muted underline" onClick={() => void startDiagnosticCheckout()}>
                Purchase Diagnostic checkout
              </button>
            ) : null}
          </div>
          <div id="diagnostic-form" ref={formWrapRef} className="rounded-[var(--radius-root)] border border-border bg-panel/50 p-4 ph-no-capture" data-ph-mask>
            <InquiryForm variant="diagnostic" />
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Delivery journey" title="From inputs to a 90-day roadmap." />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diagnosticJourney.map(([title, copy], index) => (
            <li key={title} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
              <span className="text-xs font-semibold text-accent">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-2 text-base font-semibold text-text">{title}</h2>
              <p className="mt-2 text-sm text-muted">{copy}</p>
            </li>
          ))}
        </ol>
        <details className="mt-6 rounded-[var(--radius-root)] border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium text-text">Inputs ROOT can review</summary>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {diagnosticInputs.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="h-4 w-4 text-accent" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </details>
        <details className="mt-3 rounded-[var(--radius-root)] border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium text-text">Deliverables included</summary>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {diagnosticDeliverables.map((item: string) => (
              <li key={item} className="flex gap-2">
                <ClipboardCheck className="h-4 w-4 text-accent" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </details>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Illustrative sample"
          title={diagnosticSample.title}
          description={`Synthetic demonstration for ${syntheticPractice.name} — not a client success story.`}
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {diagnosticSample.pages.map((page: string[]) => (
            <div key={page[0]} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
              <h3 className="font-semibold text-text">{page[0]}</h3>
              <p className="mt-2 text-sm text-muted">{page[1]}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">{syntheticPractice.name} · {syntheticPractice.label}</p>
        <MediaFrame
          src={mediaAssets.claimsAr}
          alt="Claims and A/R administration context. Editorial stock photograph; not ROOT staff or clients."
          caption="Editorial revenue-cycle context"
          className="mt-8"
          aspect="video"
        />
      </Section>

      <Section tone="soft">
        <SectionHeader title="Frequently asked questions" />
        <div className="mt-6 space-y-3">
          {diagnosticFaq.map((item: string[]) => (
            <details key={item[0]} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-4">
              <summary className="cursor-pointer font-medium text-text">{item[0]}</summary>
              <p className="mt-2 text-sm text-muted">{item[1]}</p>
            </details>
          ))}
        </div>
        <Callout tone="compliance" className="mt-8">
          Do not submit Protected Health Information through this website.
        </Callout>
      </Section>
    </V4Shell>
  );
}
