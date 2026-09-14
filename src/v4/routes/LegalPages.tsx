import { V4Shell } from '@/layout/V4Shell';
import { Section } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { CookieSettings } from '@/consent/CookieSettings';

export function PrivacyPage() {
  return (
    <V4Shell>
      <Section className="prose-legal mx-auto max-w-3xl pt-10 md:pt-14">
        <h1 className="text-4xl font-semibold text-text">Privacy</h1>
        <p className="mt-4 text-muted">
          ROOT&apos;s public website is designed for commercial information and deidentified inquiries. Do not submit
          patient names, dates of birth, medical record numbers, clinical details, insurance identifiers, or other
          Protected Health Information through public forms or email handoffs.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-text">Public inquiry data</h2>
        <p className="mt-3 text-muted">
          Information voluntarily provided for a commercial inquiry may include business contact information, practice
          name, provider count, operational concerns, and campaign attribution parameters. A future secure form endpoint
          will be documented before activation.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-text">Analytics</h2>
        <p className="mt-3 text-muted">
          Analytics, heatmaps, and session replay remain off until you consent. Session replay masks inputs by default and
          never records submitted form values, passwords, payment fields, or PHI. URL parameters known to be sensitive are
          redacted. No analytics vendor is active without a configured project key and consent.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-text">Secure data exchange</h2>
        <p className="mt-3 text-muted">
          If an engagement requires sensitive or patient-level information, ROOT will establish the appropriate agreement,
          access controls, approved storage, retention rules, and secure transfer mechanism before accepting the data.
        </p>
        <p className="mt-8">
          <CookieSettings />
        </p>
      </Section>
    </V4Shell>
  );
}

export function TermsPage() {
  return (
    <V4Shell>
      <Section className="mx-auto max-w-3xl pt-10 md:pt-14">
        <h1 className="text-4xl font-semibold text-text">Terms of Use</h1>
        <p className="mt-4 text-muted">
          This website provides general information about ROOT services and does not create a client relationship,
          guarantee financial outcomes, or constitute legal, coding, clinical, compliance, or reimbursement advice.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-text">No guarantees</h2>
        <p className="mt-3 text-muted">
          Revenue-cycle outcomes depend on source data quality, payer behavior, contractual terms, practice workflows,
          documentation, coding, patient responsibility, and other factors. Any engagement scope, fee, deliverable, and
          timeline is governed by the applicable written agreement.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-text">No PHI through public channels</h2>
        <p className="mt-3 text-muted">Users must not submit PHI through public website forms or public email handoffs.</p>
      </Section>
    </V4Shell>
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
