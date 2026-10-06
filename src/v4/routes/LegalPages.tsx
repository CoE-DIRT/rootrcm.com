import { V4Shell } from '@/layout/V4Shell';
import { Section } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { CookieSettings } from '@/consent/CookieSettings';

const LAST_UPDATED = 'October 2026';

function LegalShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <V4Shell>
      <Section className="prose-legal mx-auto max-w-3xl pt-10 md:pt-14">
        <h1 className="text-4xl font-semibold text-text">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-muted">{intro}</p>
        {children}
      </Section>
    </V4Shell>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="mt-10 text-2xl font-semibold text-text">{title}</h2>
      <div className="mt-3 space-y-3 text-muted">{children}</div>
    </>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      intro="ROOT's public website is designed for commercial information and deidentified inquiries. Do not submit patient names, dates of birth, medical record numbers, clinical details, insurance identifiers, or other Protected Health Information through public forms, email handoffs or chat links."
    >
      <LegalSection title="Public inquiry data">
        <p>
          Information you provide for a commercial inquiry may include your name, work email, practice or organization, provider count, operational concerns and campaign attribution parameters. Inquiries are verified with a bot-protection challenge and relayed to ROOT&apos;s business inbox at info@rootrcm.com. Do not use any form on this website for sensitive data.
        </p>
      </LegalSection>
      <LegalSection title="Analytics and cookies">
        <p>
          Analytics stay off until you consent. If you accept analytics, the site may use Google Analytics 4 (when ROOT has configured it) and ROOT&apos;s own first-party measurement to understand aggregate use of the website.
        </p>
        <p>
          Measurement is limited to the page path (without query strings), approved button and link identifiers, scroll depth, random anonymous browser and session identifiers, a coarse device and browser category, the referring website&apos;s host name, campaign (UTM) parameters, and an experiment variant when a test is running. It never includes names, email addresses, phone numbers, form messages, claim or patient information, payment details or other PHI.
        </p>
        <p>
          First-party measurement records are kept for a limited period (currently 90 days) and are not publicly readable. You can change or withdraw your choice at any time from Cookie Settings; the full list of cookies and browser storage keys is on the <a className="text-accent hover:underline" href="/legal/cookies/">cookie policy</a>.
        </p>
      </LegalSection>
      <LegalSection title="Payments">
        <p>
          Where online checkout is offered, card payments are processed by Stripe on Stripe&apos;s hosted payment page. ROOT does not receive or store card numbers. See the <a className="text-accent hover:underline" href="/refund-policy/">refund and cancellation policy</a>.
        </p>
      </LegalSection>
      <LegalSection title="Secure data exchange">
        <p>
          If an engagement requires sensitive or patient-level information, ROOT will establish the appropriate agreement, access controls, approved storage, retention rules, and secure transfer mechanism before accepting the data.
        </p>
      </LegalSection>
      <LegalSection title="Questions">
        <p>
          Email <a className="text-accent hover:underline" href="mailto:info@rootrcm.com">info@rootrcm.com</a> with privacy questions. Do not include PHI.
        </p>
      </LegalSection>
      <p className="mt-8">
        <CookieSettings />
      </p>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell
      title="Terms of Use"
      intro="This website provides general information about ROOT services and does not create a client relationship, guarantee financial outcomes, or constitute legal, coding, clinical, compliance, or reimbursement advice."
    >
      <LegalSection title="No guarantees">
        <p>
          Revenue-cycle outcomes depend on source data quality, payer behavior, contractual terms, practice workflows, documentation, coding, patient responsibility, and other factors. Any engagement scope, fee, deliverable, and timeline is governed by the applicable written agreement.
        </p>
      </LegalSection>
      <LegalSection title="No PHI through public channels">
        <p>Users must not submit PHI through public website forms or public email handoffs.</p>
      </LegalSection>
      <LegalSection title="Payments and refunds">
        <p>
          Fees are stated in the applicable written scope or order confirmation. Refund and cancellation handling is described in the <a className="text-accent hover:underline" href="/refund-policy/">refund and cancellation policy</a>.
        </p>
      </LegalSection>
      <LegalSection title="Privacy">
        <p>
          How this website handles inquiry data, cookies and analytics is described in the <a className="text-accent hover:underline" href="/privacy-policy/">privacy policy</a>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}

export function RefundPolicyPage() {
  return (
    <LegalShell
      title="Refund & Cancellation Policy"
      intro="This page explains how refunds and cancellations are handled for ROOT engagements, including the fixed-fee Revenue Optimization Diagnostic."
    >
      <LegalSection title="Written scope governs">
        <p>
          Every ROOT engagement is defined by a written scope of work or order confirmation agreed before payment. That document states the deliverables, fees, timing and the refund and cancellation terms that apply to the engagement.
        </p>
      </LegalSection>
      <LegalSection title="Revenue Optimization Diagnostic">
        <p>
          Before any Diagnostic work begins, ROOT confirms scope, data requirements and timing in writing. Questions about changing or cancelling a Diagnostic before work starts should be sent to info@rootrcm.com so they can be handled in writing.
        </p>
      </LegalSection>
      <LegalSection title="Online payments">
        <p>
          Where online checkout is offered, card payments are processed by Stripe. ROOT does not receive or store card numbers, and payment disputes with your card issuer are handled under the issuer&apos;s and Stripe&apos;s rules.
        </p>
      </LegalSection>
      <LegalSection title="No outcome guarantees">
        <p>
          ROOT does not guarantee financial outcomes. See the <a className="text-accent hover:underline" href="/terms/">Terms of Use</a>.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Email <a className="text-accent hover:underline" href="mailto:info@rootrcm.com">info@rootrcm.com</a>. Do not include PHI.
        </p>
      </LegalSection>
    </LegalShell>
  );
}

export function ThankYouPage() {
  return (
    <V4Shell minimal>
      <Section className="mx-auto max-w-xl py-24">
        <GlassCard as="div" variant="glass" accent="green" hover={false} className="text-center">
          <h1 className="text-3xl font-semibold text-text">Request received.</h1>
          <p className="mt-4 text-muted">
            Thank you. ROOT will review the deidentified commercial inquiry and follow up using the contact information
            provided.
          </p>
          <LinkButton href="/" variant="secondary" className="mt-8" data-cta="return-home" data-location="thank-you">
            Return to ROOT
          </LinkButton>
        </GlassCard>
      </Section>
    </V4Shell>
  );
}

export function NotFoundPage() {
  return (
    <V4Shell>
      <Section className="mx-auto max-w-xl py-24">
        <GlassCard as="div" variant="glass" accent="amber" hover={false} className="text-center">
          <span className="text-sm font-semibold text-signal-amber">404</span>
          <h1 className="mt-3 text-3xl font-semibold text-text">This route does not go to revenue.</h1>
          <p className="mt-4 text-muted">The page may have moved. Return to ROOT or go directly to the Revenue Optimization Diagnostic.</p>
          <div className="mt-8 flex justify-center gap-3">
            <LinkButton href="/" variant="outline">
              Home
            </LinkButton>
            <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="404" data-destination="/diagnostic/" data-engagement-type="diagnostic">
              Revenue Diagnostic
            </LinkButton>
          </div>
        </GlassCard>
      </Section>
    </V4Shell>
  );
}
