import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { AnnotationNote } from '@/components/ui/AnnotationNote';
import { servicePages, serviceMediaBySlug, mediaAssets } from '../../siteData.js';
import { proofWorkAssets, proofPlacementByServiceSlug } from '../../proofData.js';

type Service = (typeof servicePages)[number];

export function ServicesHubPage() {
  const families = [...new Set(servicePages.map((s: Service) => s.family))];
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Services' }]} />
        <h1 className="mt-4 measure-exec text-4xl font-semibold text-text sm:text-5xl">MSO service directory</h1>
        <p className="mt-4 max-w-2xl measure-body text-lg text-muted">
          Revenue operations, practice operations, and technology services with clear ownership — not a menu of vague
          “solutions.”
        </p>
      </Section>
      <Section tone="soft">
        <MediaFrame
          src={mediaAssets.practiceAdmin}
          alt="Practice administrator workstation. Editorial stock photograph; not ROOT staff or clients."
          caption="Editorial practice operations context"
          aspect="wide"
        />
        {families.map((family) => (
          <div key={family} className="mt-12">
            <h2 className="text-xl font-semibold text-text">{family}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicePages
                .filter((s: Service) => s.family === family)
                .map((service: Service) => (
                  <a key={service.slug} href={`/services/${service.slug}/`} className="block h-full">
                    <GlassCard variant="glass" accent="cyan" className="h-full">
                      <h3 className="font-semibold text-text">{service.title}</h3>
                      <p className="mt-2 text-sm text-muted">{service.summary}</p>
                    </GlassCard>
                  </a>
                ))}
            </div>
          </div>
        ))}
      </Section>
    </V4Shell>
  );
}

export function ServicePage({ service }: { service: Service }) {
  const media = serviceMediaBySlug[service.slug as keyof typeof serviceMediaBySlug];
  const proofKey = proofPlacementByServiceSlug[service.slug as keyof typeof proofPlacementByServiceSlug];
  const proof = proofKey ? proofWorkAssets[proofKey as keyof typeof proofWorkAssets] : null;

  return (
    <V4Shell>
      {/* ORIENT + SIGNAL */}
      <Section className="pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { label: 'Services', href: '/services/' },
            { label: service.title },
          ]}
        />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{service.family}</p>
        <h1 className="mt-2 measure-exec text-4xl font-semibold text-text">{service.title}</h1>
        <p className="mt-4 max-w-2xl measure-body text-lg text-muted">{service.summary}</p>
        <p className="mt-4 text-sm text-accent">{service.pricing}</p>
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-destination="/diagnostic/">
            Start the $2,500 Diagnostic
          </LinkButton>
          <LinkButton href="/contact/" variant="outline">
            Talk to ROOT
          </LinkButton>
        </CTAGroup>
      </Section>

      {/* PROBLEM */}
      <Section tone="soft" dense>
        <SectionHeader
          eyebrow="Problem"
          title="Who this is for"
          description={service.buyer}
        />
        {media ? (
          <MediaFrame src={media.src} alt={media.alt} caption={media.caption} aspect="video" className="mt-8" />
        ) : (
          <MediaFrame
            src={mediaAssets.practiceOperations}
            alt="Practice operations workstation. Editorial stock photograph; not ROOT staff or clients."
            caption="Editorial operations context"
            aspect="video"
            className="mt-8"
          />
        )}
      </Section>

      {/* WORKFLOW + OWNERSHIP + DELIVERABLE */}
      <Section tone="grid" wide>
        <SectionHeader
          eyebrow="Workflow & ownership"
          title="What engagement includes"
          description={service.engagement}
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {service.deliverables.map((item: string) => (
            <li key={item} className="rounded-[var(--radius-root)] border border-border bg-panel/50 px-4 py-3 text-sm text-text">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* INTELLIGENCE */}
      {service.dirt ? (
        <Section dense>
          <SectionHeader eyebrow="Intelligence" title="How DIRT complements this service" />
          <AnnotationNote label="DIRT complement" text={service.dirt} className="mt-6" />
          {service.related ? (
            <LinkButton href={service.related} variant="ghost" size="sm" className="mt-4">
              Related solution
            </LinkButton>
          ) : null}
        </Section>
      ) : null}

      {/* PROOF */}
      {proof ? (
        <Section tone="soft">
          <SectionHeader eyebrow={proof.label} title={proof.title} description={proof.insight} />
          {'metrics' in proof && Array.isArray(proof.metrics) ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {proof.metrics.map((metric: string[]) => (
                <MetricCard key={metric[0]} label={metric[0]} value={metric[1]} tone="synthetic" accent="cyan" />
              ))}
            </div>
          ) : null}
        </Section>
      ) : null}

      {/* CONVERT */}
      <Section>
        <SectionHeader
          title={`Talk to ROOT about ${service.title}`}
          description="Share deidentified commercial context — Diagnostic, project, or managed ownership."
        />
        <CTAGroup className="mt-6">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-destination="/diagnostic/">
            Start the $2,500 Diagnostic
          </LinkButton>
          <LinkButton href="/contact/" variant="outline">
            Talk to ROOT
          </LinkButton>
        </CTAGroup>
      </Section>
    </V4Shell>
  );
}
