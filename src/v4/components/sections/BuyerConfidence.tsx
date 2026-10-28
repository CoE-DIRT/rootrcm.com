/**
 * Homepage buyer-confidence layer.
 * Buyer objections are framed as concerns, never as quantified outcomes or promises.
 * Credentialing guidance is payer-specific and integration capabilities are scoped.
 */
import { ArrowRight, CheckCircle2, ClipboardCheck, FileCheck2, GitBranch, Layers3, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import './buyer-confidence.css';

const worries = [
  {
    title: '“Outsourcing turns billing into a black box.”',
    concern: 'Who touched a claim, what happened, and who is responsible now?',
    answer: 'We connect payer contacts, missing evidence, next actions and named owners to a reviewable financial worklist.',
    Icon: LockKeyhole,
  },
  {
    title: '“Changing vendors will disrupt collections.”',
    concern: 'What happens to open A/R, historical records and the current team?',
    answer: 'We start with the systems you have, establish an A/R baseline and plan an incremental handover before recommending a migration.',
    Icon: GitBranch,
  },
  {
    title: '“The new partner will blame our front desk.”',
    concern: 'Will preventable denials and handoff failures remain our problem?',
    answer: 'We trace repeat issues to eligibility, authorization, coding and enrollment, then agree who owns the corrective workflow.',
    Icon: Layers3,
  },
] as const;

const switchRisks = [
  { title: 'Cash-flow continuity', fear: 'Will a handover create a costly gap in collections?', approach: 'Baseline outstanding claims, protect payer follow-up ownership and track unresolved balances through cutover.' },
  { title: 'Records and migration', fear: 'Will we lose historical claims, balances or documents?', approach: 'Inventory source data and reconcile critical totals before any migration. A software switch is not our starting requirement.' },
  { title: 'Team fatigue', fear: 'Will a new process overwhelm clinical or administrative staff?', approach: 'Stage workflow changes and train to specific tasks instead of imposing an unfamiliar end-to-end system.' },
  { title: 'Interoperability', fear: 'Will our EHR, clearinghouse and billing tools actually work together?', approach: 'Review access, exports and supported interfaces first. Use governed data exchange or manual reconciliation where an API is unavailable.' },
] as const;

const operatingSteps = [
  { number: '01', title: 'Measure collections, not activity', text: 'Establish net collection rate and reconcile allowed amounts, payments, adjustments and takebacks using a consistent reporting period.' },
  { number: '02', title: 'Make aging A/R traceable', text: 'Segment open A/R by payer, age and specialty; identify stalled work and attach an owner, evidence and next action.' },
  { number: '03', title: 'Prevent repeat denials upstream', text: 'Classify root causes and correct eligibility, authorization, coding and enrollment handoffs before the same failures recur.' },
] as const;

const enrollmentSteps = [
  { title: 'Connected intake', Icon: GitBranch, text: 'Use approved APIs, structured data exchanges and payer portals where supported. Track unsupported steps in the same controlled workflow.' },
  { title: 'Pre-submission verification', Icon: FileCheck2, text: 'Check identifiers, licenses, locations, group affiliations, CAQH attestations and payer-specific documents before sending an application.' },
  { title: 'Timeline and exception control', Icon: ClipboardCheck, text: 'Map payer-specific stages, historical processing ranges where available, missing items, follow-up dates and escalation owners.' },
] as const;

const additionalPressures = [
  'Specialty-specific coding and payer rules',
  'Prior authorization and repeat denials',
  'Patient-responsibility balances',
  'Key-person staffing dependencies',
  'Payer policy and regulatory change',
  'Privacy, security and controlled access',
] as const;

export function BuyerConfidence() {
  return (
    <Section id="buyer-confidence" className="root-buyer-confidence" dense>
      <SectionHeader
        eyebrow="For practice owners, CFOs and revenue leaders"
        title="Keep visibility. Keep control. Change only what needs changing."
        description="Your concern is not simply whether billing can be outsourced. It is whether financial oversight, cash flow and the people running your practice stay protected."
      />
      <div className="root-confidence-grid">
        {worries.map(({ title, concern, answer, Icon }) => (
          <GlassCard key={title} as="article" variant="readable" hover={false} className="root-confidence-card">
            <span className="root-confidence-icon"><Icon size={20} aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p className="root-confidence-concern">{concern}</p>
            <p>{answer}</p>
          </GlassCard>
        ))}
      </div>

      <details className="root-confidence-disclosure">
        <summary>Four more reasons leaders hesitate to switch <span>See how ROOT reduces transition risk</span></summary>
        <div className="root-risk-grid">
          {switchRisks.map(({ title, fear, approach }) => (
            <div key={title} className="root-risk-item">
              <h3>{title}</h3>
              <p className="root-risk-fear">{fear}</p>
              <p>{approach}</p>
            </div>
          ))}
        </div>
      </details>

      <div className="root-pressure-row" aria-label="Additional operating pressures we address">
        {additionalPressures.map((pressure) => <span key={pressure}><CheckCircle2 size={14} aria-hidden="true" />{pressure}</span>)}
      </div>
    </Section>
  );
}

export function ThreeStepTransition() {
  return (
    <Section id="how-transition-works" dense tone="soft" className="root-transition-section">
      <div className="root-transition-heading">
        <SectionHeader
          eyebrow="Low-disruption entry"
          title="Getting clarity is as easy as 1–2–3."
          description="We can assess and improve your existing revenue operation without requiring an EHR or practice-management replacement."
        />
        <LinkButton href="/diagnostic/" variant="outline" size="md" data-cta="book-diagnostic" data-location="home-three-steps" data-destination="/diagnostic/">
          Review the $2,500 Diagnostic <ArrowRight size={16} aria-hidden="true" />
        </LinkButton>
      </div>
      <ol className="root-transition-grid">
        {operatingSteps.map(({ number, title, text }) => (
          <li key={number} className="root-transition-step">
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function CredentialingReadiness() {
  return (
    <Section id="credentialing-readiness" dense className="root-credentialing-section">
      <div className="root-credentialing-intro">
        <div>
          <p className="root-credentialing-eyebrow"><ShieldCheck size={16} aria-hidden="true" /> Revenue-readiness infrastructure</p>
          <h2>Credentialing delays can stop a practice from collecting.</h2>
          <p>Missing provider enrollment, unverified locations, missed revalidations and unclear effective dates can delay payer participation and create substantial revenue exposure. For larger organizations, the billing value at risk can reach millions.</p>
        </div>
        <GlassCard as="div" hover={false} variant="readable" className="root-credentialing-commitment">
          <span>Our approach</span>
          <strong>Verify before submitting. Track every payer handoff.</strong>
          <p>Pre-submission quality control + milestone monitoring + accountable follow-up. We do not ask practices to change their EHR to begin.</p>
          <LinkButton href="/services/credentialing/" size="sm" variant="outline">
            Explore credentialing <ArrowRight size={15} aria-hidden="true" />
          </LinkButton>
        </GlassCard>
      </div>
      <div className="root-enrollment-grid">
        {enrollmentSteps.map(({ title, Icon, text }) => (
          <div className="root-enrollment-item" key={title}>
            <Icon size={21} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <p className="root-enrollment-context">
        Payers determine acceptance and approval dates. We assess submission completeness and time risk before filing, then track outcomes and follow-up evidence; no universal API connectivity or guaranteed payer fast-track is implied.
        {' '}<a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/chain-ownership-system-pecos/manage-your-enrollment" target="_blank" rel="noopener noreferrer">CMS enrollment guidance</a>.
      </p>
    </Section>
  );
}
