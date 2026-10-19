import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { lazy, Suspense } from 'react';
const DirtCommandCenter = lazy(() => import('@/components/dirt/DirtCommandCenter').then((module) => ({ default: module.DirtCommandCenter })));
const DirtSignalFlow = lazy(() => import('@/components/dirt/DirtCommandCenter').then((module) => ({ default: module.DirtSignalFlow })));
import { InteractiveMiniDashboard } from '@/components/dirt/InteractiveMiniDashboard';
import { DirtSectionNav } from '@/components/dirt/DirtSectionNav';
import { InteroperabilityLifecycle } from '@/components/sections/InteroperabilityLifecycle';
import { CompetitiveTable } from '@/components/sections/CompetitiveTable';
import { Callout } from '@/components/ui/Callout';
import { mediaAssets } from '../../siteData.js';

const intelligenceStages = [
  ['Connect', 'Approved EHR/PM exports, payer and clearinghouse data, payment and enrollment records.'],
  ['Reconcile', 'Normalize source fields, map records, document lineage, and validate financial totals.'],
  ['Explain', 'Investigate revenue leakage, denial patterns, underpayments, payer delays, and aging A/R.'],
  ['Prioritize', 'Rank financially significant findings by value, age, recoverability, and operational risk.'],
  ['Act', 'Route validated findings to a named owner, workflow, and review cadence.'],
  ['Measure', 'Track follow-through and compare results with a documented baseline.'],
];

const dirtSections = [
  { id: 'orient', label: 'Orient' },
  { id: 'signal', label: 'Signal' },
  { id: 'command-center', label: 'Command center' },
  { id: 'scenario', label: 'Scenario' },
  { id: 'action', label: 'Action' },
];

export function TechnologyHubPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Technology</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-text sm:text-5xl">
          Connected data. Clearer revenue decisions.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          ROOT brings healthcare data architecture, EHR/PM workflow alignment, interoperability planning, analytics, and monitored automation together around financial performance.
        </p>
        <CTAGroup className="mt-8">
          <LinkButton href="/technology/dirt/" variant="primary">
            Open DIRT
          </LinkButton>
          <LinkButton href="/diagnostic/" variant="outline" data-cta="book-diagnostic" data-destination="/diagnostic/">
            Start Diagnostic
          </LinkButton>
        </CTAGroup>
      </Section>
      <Section tone="soft">
        <MediaFrame
          src={mediaAssets.healthcareIt}
          alt="Healthcare IT workstation. "
          caption="Editorial Healthcare IT context"
          aspect="wide"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['DIRT intelligence', 'Connect payer, denial, A/R, and revenue signals to financially prioritized action.', '/technology/dirt/'],
            ['Healthcare IT', 'Improve data reliability and align the systems your practice already uses.', '/services/healthcare-it/'],
            ['Workflow automation', 'Move from a validated revenue signal to a monitored, human-owned workflow.', '/services/workflow-automation/'],
          ].map(([title, copy, href]) => (
            <a key={title} href={href} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 hover:border-accent">
              <h2 className="text-lg font-semibold text-text">{title}</h2>
              <p className="mt-2 text-sm text-muted">{copy}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section tone="grid" wide>
        <SectionHeader
          eyebrow="Illustrative flow"
          title="A connected revenue data architecture."
          description="Illustrative architecture: connect approved exports, reconcile the source data, validate financial signals, and route findings to human-owned action. Production API integrations are scoped separately."
        />
        <div className="mt-8">
          <InteroperabilityLifecycle />
        </div>
      </Section>

      <Section wide>
        <SectionHeader
          eyebrow="Where things fit"
          title="Keep your systems. Connect the financial story."
          description="A neutral comparison of roles — not a claim about any vendor's limitations."
        />
        <div className="mt-8">
          <CompetitiveTable />
        </div>
      </Section>
    </V4Shell>
  );
}

export function DirtPage() {
  return (
    <V4Shell>
      <Section id="orient" className="pt-10 md:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">
          Data Intelligence for Revenue Transformation
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-text sm:text-5xl">
          Your data already contains the signals. DIRT connects them.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          DIRT — Data Intelligence for Revenue Transformation — is ROOT's embedded intelligence capability. It connects fragmented healthcare revenue data to explain leakage, examine payer performance, prioritize recovery, and identify what deserves action next.
        </p>
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="dirt-hero" data-destination="/diagnostic/">
            Discover Your Revenue Exposure
          </LinkButton>
        </CTAGroup>
        <DirtSectionNav items={dirtSections} className="mt-8" />
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="DIRT intelligence architecture"
          title="Connect → Reconcile → Explain → Prioritize → Act → Measure."
          description="The intelligence advantage is the closed loop: source-data reliability, financial interpretation, and operating follow-through — not another isolated dashboard."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {intelligenceStages.map(([name, detail], index) => (
            <div key={name} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-data-blue">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-text">{name}</h3>
              <p className="mt-2 text-sm text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="signal" tone="soft">
        <Suspense fallback={<div className="min-h-[12rem]" aria-busy="true" />}><DirtSignalFlow /></Suspense>
      </Section>

      <Section id="command-center" tone="grid" wide dense>
        <SectionHeader
          eyebrow="Command center"
          title="From financial visibility to decision-ready revenue intelligence"
          description="Explore an illustrative dashboard view that organizes executive measures, payer patterns, denial categories, underpayment signals, and prioritized work."
        />
        <div className="mt-8">
          <Suspense fallback={<div className="min-h-[24rem] rounded-[var(--radius-root)] border border-border bg-panel/40" aria-busy="true" />}><DirtCommandCenter /></Suspense>
        </div>
        <Callout tone="compliance" className="mt-8">
          The dashboard uses clearly labeled sample metrics to show how revenue signals can be organized for management review.
        </Callout>
      </Section>

      <Section id="scenario" tone="soft">
        <SectionHeader
          eyebrow="Bounded scenario"
          title="Explore an illustrative operating scenario"
          description="Adjust a sample scenario to compare baseline measures with a modeled set of operating assumptions."
        />
        <InteractiveMiniDashboard />
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Media"
          title="Product-grade information surfaces"
          description="A clear view of key measures, patterns, and accountable next actions."
        />
        <MediaFrame
          src={mediaAssets.dirtAnalytics}
          alt="Revenue analytics dashboard arranged for management review."
          caption="Illustrative dashboard view."
          className="mt-8"
          aspect="video"
        />
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Advanced intelligence roadmap"
          title="From explainable rules to validated predictive models."
          description="Denial-risk scoring, cash-flow forecasting, anomaly detection, and human-reviewed automation are development directions, not claims of live production AI on this public site."
        />
        <p className="mt-4 max-w-3xl text-sm text-muted">
          Models require adequate historical data, validation by payer and specialty, versioned logic, exception controls, and documented monitoring before use in client operations.
        </p>
      </Section>

      <Section id="action">
        <SectionHeader
          title="Turn your revenue data into an operating advantage."
          description="Start with a scoped Revenue Optimization Diagnostic to identify exposure, investigate root causes, and agree on the next operating intervention."
        />
        <LinkButton href="/diagnostic/" variant="primary" className="mt-6" data-cta="book-diagnostic" data-destination="/diagnostic/">
          Start Diagnostic
        </LinkButton>
      </Section>
    </V4Shell>
  );
}
