import { ArrowRight } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PracticeLifecycle } from '@/components/sections/PracticeLifecycle';
import { ContinuousImprovementLoop } from '@/components/sections/ContinuousImprovementLoop';
import { VerticalExpansionMap } from '@/components/sections/VerticalExpansionMap';
import { platformNodes, mediaAssets, pricingModels } from '../../siteData.js';

const engagementRows = [
  {
    title: 'Diagnostic',
    eyebrow: '$2,500 fixed entry',
    copy: 'A focused financial and operating assessment that identifies revenue exposure, underlying causes, and a prioritized action plan.',
    href: '/diagnostic/',
  },
  {
    title: 'Managed RCM',
    eyebrow: 'Operating ownership',
    copy: 'ROOT connects billing, payer follow-up, denials, posting, and A/R recovery to measurable financial controls.',
    href: '/services/rcm/',
  },
  {
    title: 'DIRT Intelligence',
    eyebrow: '$1,500-$2,500/month when scoped',
    copy: 'Connect fragmented RCM data, investigate payer and denial patterns, and prioritize financial opportunities.',
    href: '/technology/dirt/',
  },
  {
    title: 'Full MSO Partnership',
    eyebrow: 'Custom',
    copy: 'A broader operating partnership across revenue operations, practice operations, technology, automation, analytics, and leadership visibility.',
    href: '/pricing/',
  },
];

const layers = [
  { title: 'Clinical practice', copy: 'Care delivery stays with the practice. ROOT never claims clinical authority.' },
  { title: 'DIRT intelligence', copy: 'Reconciled financial signals become payer insight, revenue exposure, and financially prioritized recommendations.' },
  { title: 'Management action', copy: 'Queues, cadence, and escalation turn insight into operating change.' },
];

export function PlatformPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Platform' }]} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Operating platform</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          The operating infrastructure behind healthcare revenue.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          ROOT connects managed revenue operations, credentialing, healthcare technology, and DIRT data intelligence to give leadership one coherent view of financial performance and operational accountability.
        </p>
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="platform-hero" data-destination="/diagnostic/">
            Discover Revenue Exposure
          </LinkButton>
          <LinkButton href="/technology/dirt/" variant="outline">
            Explore DIRT
          </LinkButton>
        </CTAGroup>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Architecture" title="Connected operations. Clear financial decisions." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {layers.map((layer) => (
            <div key={layer.title} className="rounded-[var(--radius-root)] border border-border bg-panel/50 p-5">
              <h2 className="text-lg font-semibold text-text">{layer.title}</h2>
              <p className="mt-2 text-sm text-muted">{layer.copy}</p>
            </div>
          ))}
        </div>
        <MediaFrame
          src={mediaAssets.operationsPlanning}
          alt="Operations planning workshop. Editorial stock photograph; not ROOT staff or clients."
          caption="Editorial planning context"
          className="mt-10"
          aspect="wide"
        />
      </Section>

      <Section>
        <SectionHeader eyebrow="Domains" title="Every capability connected to revenue performance." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformNodes.map((node: { label: string; copy: string }) => (
            <div key={node.label} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
              <p className="font-semibold text-text">{node.label}</p>
              <p className="mt-2 text-sm text-muted">{node.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="grid" wide>
        <SectionHeader
          eyebrow="Practice lifecycle"
          title="From provider readiness to final reimbursement."
          description="Clinical practice stays at the center — ROOT owns the operating stages around it."
        />
        <div className="mt-8">
          <PracticeLifecycle />
        </div>
      </Section>

      <Section tone="soft" wide>
        <SectionHeader
          eyebrow="Operating loop"
          title="Find the financial signal. Close the operational loop."
          description="Every engagement runs the same cycle: detect, explain, prioritize, improve, govern."
        />
        <div className="mt-8">
          <ContinuousImprovementLoop />
        </div>
      </Section>

      <Section wide>
        <SectionHeader
          eyebrow="Growth path"
          title="Build financial control without replacing the practice."
          description="A real sequence of ROOT engagements — not a hypothetical roadmap."
        />
        <div className="mt-8">
          <VerticalExpansionMap />
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Engagement choices" title="Build financial control without replacing the practice." />
        <ul className="mt-8 space-y-4">
          {engagementRows.map((item) => (
            <li key={item.title} className="grid gap-3 rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 md:grid-cols-[1fr_2fr_auto] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-accent">{item.eyebrow}</p>
                <h3 className="mt-1 text-lg font-semibold text-text">{item.title}</h3>
              </div>
              <p className="text-sm text-muted">{item.copy}</p>
              <a href={item.href} className="inline-flex items-center gap-1 text-sm font-medium text-accent" data-cta="engagement-row" data-location="platform-engagement">
                Explore <ArrowRight className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Reference pricing includes {pricingModels[2]?.price} for DIRT when scoped.
        </p>
      </Section>
    </V4Shell>
  );
}
