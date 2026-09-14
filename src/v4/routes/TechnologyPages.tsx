import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { DirtCommandCenter, DirtSignalFlow } from '@/components/dirt/DirtCommandCenter';
import { InteractiveMiniDashboard } from '@/components/dirt/InteractiveMiniDashboard';
import { DirtSectionNav } from '@/components/dirt/DirtSectionNav';
import { InteroperabilityLifecycle } from '@/components/sections/InteroperabilityLifecycle';
import { CompetitiveTable } from '@/components/sections/CompetitiveTable';
import { Callout } from '@/components/ui/Callout';
import { mediaAssets } from '../../siteData.js';

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
          Technology that serves the operating model.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          EHR/PM alignment, healthcare IT support, automation readiness, and DIRT intelligence — without unverified
          integration claims.
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
          alt="Healthcare IT workstation. Editorial stock photograph; not ROOT staff or clients."
          caption="Editorial Healthcare IT context"
          aspect="wide"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['DIRT intelligence', 'Management intelligence connected to action queues.', '/technology/dirt/'],
            ['Healthcare IT', 'Support for the systems practices already run.', '/services/healthcare-it/'],
            ['Workflow automation', 'Automate stable work after process repair.', '/services/workflow-automation/'],
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
          title="Export → review, not a live connector."
          description="A future-state pattern for how a practice's existing systems could feed DIRT review — illustrative and planned, not a working integration today."
        />
        <div className="mt-8">
          <InteroperabilityLifecycle />
        </div>
      </Section>

      <Section wide>
        <SectionHeader
          eyebrow="Where things fit"
          title="ROOT and DIRT next to what you already run."
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
          Revenue intelligence, connected to action.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          DIRT helps ROOT detect leakage, understand denial patterns, prioritize A/R recovery, and assign the next
          operating action.
        </p>
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="dirt-hero" data-destination="/diagnostic/">
            Start the $2,500 Diagnostic
          </LinkButton>
        </CTAGroup>
        <DirtSectionNav items={dirtSections} className="mt-8" />
      </Section>

      <Section id="signal" tone="soft">
        <DirtSignalFlow />
      </Section>

      <Section id="command-center" tone="grid" wide>
        <SectionHeader
          eyebrow="Command center"
          title="Executive view, expandable triage, human-reviewed explanation"
          description="ROOT's metrics, charts, payer table, and priority queue — plus DIRT's row-level explain workflow."
        />
        <div className="mt-8">
          <DirtCommandCenter />
        </div>
        <Callout tone="compliance" className="mt-8">
          All figures on this page are synthetic / deidentified demonstration data for product education — not client
          outcomes.
        </Callout>
      </Section>

      <Section id="scenario" tone="soft">
        <SectionHeader
          eyebrow="Bounded scenario"
          title="Model the improvement, on synthetic data"
          description="A local, no-network scenario toggle over ROOT's fixture practice — never a live account."
        />
        <InteractiveMiniDashboard />
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Media"
          title="Product-grade information surfaces"
          description="Charts and tables above are the live demo. Photography below is editorial context only."
        />
        <MediaFrame
          src={mediaAssets.dirtAnalytics}
          alt="Illustrative analytics context. Editorial stock photograph; not live PHI or client dashboards."
          caption="Editorial context — DIRT demo data is synthetic"
          className="mt-8"
          aspect="video"
        />
      </Section>

      <Section id="action">
        <SectionHeader
          title="Want DIRT applied to your revenue cycle?"
          description="The Diagnostic is the fastest path from current data to a prioritized opportunity register."
        />
        <LinkButton href="/diagnostic/" variant="primary" className="mt-6" data-cta="book-diagnostic" data-destination="/diagnostic/">
          Start Diagnostic
        </LinkButton>
      </Section>
    </V4Shell>
  );
}
