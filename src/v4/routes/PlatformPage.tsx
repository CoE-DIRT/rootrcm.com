import { ArrowRight } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { platformNodes, mediaAssets, pricingModels } from '../../siteData.js';

const engagementRows = [
  {
    title: 'Diagnostic',
    eyebrow: '$2,500 fixed entry',
    copy: 'A focused assessment that turns A/R, denial, workflow, credentialing, and reporting signals into a ranked opportunity register.',
    href: '/diagnostic/',
  },
  {
    title: 'Managed RCM',
    eyebrow: 'Operating ownership',
    copy: 'ROOT runs revenue-cycle execution and improvement across billing, denials, A/R, posting, reporting, and escalation.',
    href: '/services/rcm/',
  },
  {
    title: 'DIRT Intelligence',
    eyebrow: '$1,500-$2,500/month when scoped',
    copy: 'The intelligence layer for revenue leakage, denial patterns, A/R priority, payer behavior, and PracticeOps signals.',
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
  { title: 'DIRT intelligence', copy: 'Signals become findings with financial significance, owners, and next actions.' },
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
          One operating layer for your practice.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          ROOT connects revenue operations, practice operations, and technology so leadership sees one accountable system —
          not a stack of disconnected vendors.
        </p>
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="platform-hero" data-destination="/diagnostic/">
            Start the $2,500 Diagnostic
          </LinkButton>
          <LinkButton href="/technology/dirt/" variant="outline">
            Explore DIRT
          </LinkButton>
        </CTAGroup>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Architecture" title="Clinical practice at the center." />
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
        <SectionHeader eyebrow="Domains" title="What the platform owns." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformNodes.map((node: { label: string; copy: string }) => (
            <div key={node.label} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
              <p className="font-semibold text-text">{node.label}</p>
              <p className="mt-2 text-sm text-muted">{node.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="Engagement choices" title="Start focused. Expand when the evidence earns it." />
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
