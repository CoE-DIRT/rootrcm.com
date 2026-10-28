/**
 * Reference-led commercial presentation primitives for ROOT's React/Vite site.
 * Original implementation inspired by structural patterns at
 * https://outsourcemedicalbillingservices.us/ and
 * https://radiant-ui-components-library.webflow.io/.
 *
 * No Webflow-generated source, competitor assets, metrics, or third-party
 * brand/certification claims are copied into ROOT.
 */
import { ArrowRight, BarChart3, ClipboardCheck, Layers3, ReceiptText, ShieldCheck, Workflow, Activity } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { BentoGrid, BentoCard } from '@/components/vendor/magicui/BentoGrid';
import { GridPattern } from '@/components/vendor/magicui/GridPattern';
import { mediaAssets } from '../../../siteData.js';
import { Section, SectionHeader } from '@/components/ui/Section';

type Service = { slug: string; title: string; summary: string };

const operatingSignals = [
  { label: 'Collections visibility', detail: 'Payments, adjustments and reimbursement variance', Icon: BarChart3 },
  { label: 'Denial intelligence', detail: 'Payer reasons, preventability and next actions', Icon: ClipboardCheck },
  { label: 'A/R recovery', detail: 'Age, value, priority and accountable follow-up', Icon: Activity },
  { label: 'Enrollment readiness', detail: 'Provider, payer and effective-date status', Icon: ShieldCheck },
] as const;

const featuredServices = [
  { slug: 'medical-billing', number: '01', Icon: ReceiptText },
  { slug: 'denial-management', number: '02', Icon: ClipboardCheck },
  { slug: 'ar-recovery', number: '03', Icon: Activity },
  { slug: 'credentialing', number: '04', Icon: ShieldCheck },
  { slug: 'reporting-analytics', number: '05', Icon: BarChart3 },
  { slug: 'workflow-automation', number: '06', Icon: Workflow },
] as const;

const servicePhotography: Record<string, { src: string; alt: string }> = {
  'medical-billing': { src: mediaAssets.rcmBillingFinancialOperations, alt: 'Revenue operations workspace with financial reporting tools.' },
  'denial-management': { src: mediaAssets.practiceAdmin, alt: 'Healthcare practice administrator working at a computer.' },
  credentialing: { src: mediaAssets.credentialing, alt: 'Provider enrollment and payer documentation workspace.' },
};

/**
 * A proof-free operational signal rail, not invented client performance KPIs.
 * Designed for quick scanning directly below the home hero.
 */
export function RevenueSignalsRail() {
  return (
    <Section dense className="!py-8" aria-label="Revenue priorities we help practices monitor">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {operatingSignals.map(({ label, detail, Icon }) => (
          <GlassCard key={label} as="article" variant="readable" hover={false} className="flex h-full items-start gap-3 p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-root)] border border-border bg-panel">
              <Icon className="h-5 w-5 text-data-blue" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-snug text-text">{label}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

/** Uses the existing service registry so links and descriptions stay authoritative. */
export function CommercialServiceShowcase({ services }: { services: Service[] }) {
  const primaryServices = featuredServices.flatMap(({ slug, number, Icon }) => {
    const service = services.find((candidate) => candidate.slug === slug);
    return service ? [{ ...service, number, Icon }] : [];
  });
  const featuredSlugs = new Set<string>(featuredServices.map(({ slug }) => slug));
  const remainingServices = services.filter((service) => !featuredSlugs.has(service.slug));

  return (
    <Section tone="soft" aria-label="ROOT healthcare revenue services">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeader
          eyebrow="Full-service healthcare revenue operations"
          title="The services you need. One accountable operating partner."
          description="From claim submission and payer follow-up to financial reporting, ROOT connects hands-on revenue-cycle execution with evidence-based operational intelligence."
        />
        <LinkButton href="/services/" variant="outline" size="md" className="shrink-0 self-start">
          All services <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </LinkButton>
      </div>
      <BentoGrid className="mt-9" data-commercial-service-grid>
        {primaryServices.map(({ slug, title, summary, number, Icon }) => (
          <BentoCard
            key={slug}
            name={title}
            description={summary}
            number={number}
            href={`/services/${slug}/`}
            cta="Explore service"
            icon={<Icon className="h-7 w-7" aria-hidden="true" />}
            media={servicePhotography[slug]}
          />
        ))}
      </BentoGrid>
      {remainingServices.length ? (
        <div className="mt-6 rounded-[var(--radius-root)] border border-border bg-panel/50 p-5">
          <p className="text-sm font-semibold text-text">Additional operating capabilities</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {remainingServices.map((service) => (
              <a
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="inline-flex min-h-11 items-center rounded-full border border-border px-4 py-2 text-sm text-text transition-colors hover:border-data-blue hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue motion-reduce:transition-none"
              >
                {service.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}

/**
 * Distinguish DIRT's embedded operating intelligence from a standalone
 * commercially available SaaS; this is descriptive, not a fake live dashboard.
 */
export function DirtOperatingBridge() {
  const stages = [
    { name: 'Reconcile', detail: 'Connect billing, payment, payer and operational evidence.' },
    { name: 'Prioritize', detail: 'Surface exceptions by financial significance and cause.' },
    { name: 'Resolve', detail: 'Assign accountable action and review the outcome.' },
  ] as const;

  return (
    <Section wide tone="grid">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-data-blue">
            <Layers3 className="h-4 w-4" aria-hidden="true" /> ROOT intelligence layer
          </div>
          <h2 className="measure-exec text-balance text-3xl font-semibold text-text sm:text-4xl">
            Your revenue cycle, connected by DIRT.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            DIRT — Data Intelligence for Revenue Transformation — is ROOT's embedded analytical capability. It connects fragmented revenue signals to decisions and the people responsible for executing them.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/technology/dirt/" size="md" variant="primary">
              Explore DIRT <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/contact/" size="md" variant="outline">Discuss your workflows</LinkButton>
          </div>
        </div>
        <GlassCard variant="readable" accent="cyan" hover={false} className="relative isolate p-6 sm:p-8">
          <GridPattern className="!absolute inset-0 z-0 text-data-blue/10" width={42} height={42} />
          <div className="relative z-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-data-blue">How the intelligence loop works</p>
          <ol className="space-y-4">
            {stages.map((stage, index) => (
              <li key={stage.name} className="flex gap-4 rounded-[var(--radius-root)] border border-border bg-panel/50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold text-data-blue">{index + 1}</span>
                <div>
                  <h3 className="font-semibold text-text">{stage.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{stage.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-muted">Operating model illustration, not a live client system or product-performance claim.</p>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
