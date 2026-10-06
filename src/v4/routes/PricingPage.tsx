import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { pricingModels, mediaAssets } from '../../siteData.js';
import { formatUsd, DIAGNOSTIC_PRICE_USD } from '@/growth/locale';
import { isDiagnosticCheckoutActive, startDiagnosticCheckout } from '@/growth/checkout';
import { useExperiment } from '@/experiments/useExperiment';

type PricingModel = (typeof pricingModels)[number];

/** Variant of the pricing A/B test: the same published models in one comparison table. No new claims or numbers. */
function PricingGlance() {
  return (
    <Section tone="soft">
      <SectionHeader
        eyebrow="At a glance"
        title="Compare engagement models"
        description="Every published ROOT engagement in one place. Project and operating-partner scope is defined in writing."
      />
      <div className="mt-6 overflow-x-auto rounded-[var(--radius-root)] border border-border">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm" data-testid="pricing-glance">
          <caption className="sr-only">ROOT engagement models and their published pricing</caption>
          <thead>
            <tr className="border-b border-border bg-bg-soft text-xs uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">
                Engagement
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Published pricing
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Best for
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingModels.map((model: PricingModel) => (
              <tr key={model.name} className="border-b border-border last:border-b-0 align-top">
                <th scope="row" className="px-4 py-3 font-semibold text-text">
                  {model.name}
                </th>
                <td className="px-4 py-3 text-accent">{model.price}</td>
                <td className="px-4 py-3 text-muted">{model.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export function PricingPage() {
  const diagnostic = pricingModels[0];
  const primaryModels = pricingModels.slice(1, 3);
  const specializedModels = pricingModels.slice(3);
  const presentation = useExperiment('pricingPresentation');

  return (
    <V4Shell>
      {/* display: contents keeps the layout identical while letting clicks inside carry the experiment context. */}
      <div className="contents" {...presentation.attrs}>
        <Section className="pt-10 md:pt-14">
          <Breadcrumb items={[{ label: 'Pricing' }]} />
          <h1 className="mt-4 measure-exec text-4xl font-semibold text-text sm:text-5xl">Intelligence and execution, scoped to your business.</h1>
          <p className="mt-4 max-w-2xl measure-body text-lg text-muted">
            Start with a fixed-fee {formatUsd(DIAGNOSTIC_PRICE_USD)} Revenue Optimization Diagnostic or choose an ongoing revenue operations, DIRT intelligence, credentialing, project, or MSO engagement. The published Diagnostic price does not change with personalization.
          </p>
        </Section>

        <Section tone="flow" wide>
          <GlassCard as="div" variant="matrix" accent="cyan" hover={false} className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">Focused entry engagement</p>
            <h2 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">{diagnostic.name}</h2>
            <p className="mt-2 text-xl text-accent md:text-2xl">{diagnostic.price}</p>
            <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">{diagnostic.bestFor}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {diagnostic.includes.map((item: string) => (
                <li key={item} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                  {item}
                </li>
              ))}
            </ul>
            <CTAGroup className="mt-6">
              <LinkButton href="/diagnostic/" variant="primary" size="lg" data-cta="book-diagnostic" data-destination="/diagnostic/">
                Explore the Diagnostic
              </LinkButton>
              {isDiagnosticCheckoutActive() ? (
                <button
                  type="button"
                  className="rounded-[var(--radius-root)] border border-border px-4 py-2 text-sm text-text"
                  onClick={() => void startDiagnosticCheckout()}
                >
                  Purchase Diagnostic (checkout)
                </button>
              ) : null}
            </CTAGroup>
          </GlassCard>
        </Section>

        {presentation.variant === 'at-a-glance' ? <PricingGlance /> : null}

        <Section>
          <SectionHeader
            eyebrow="If you already know the ownership model"
            title="Core operating models"
            description="Managed revenue-cycle execution and DIRT financial intelligence can be scoped directly or follow an initial Diagnostic."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {primaryModels.map((model: (typeof pricingModels)[number]) => (
              <GlassCard key={model.name} as="div" variant="glass" accent="indigo" className="p-6">
                <h2 className="text-xl font-semibold text-text">{model.name}</h2>
                <p className="mt-2 text-accent">{model.price}</p>
                <p className="mt-3 text-sm text-muted">{model.bestFor}</p>
                <ul className="mt-4 space-y-1 text-sm text-muted">
                  {model.includes.map((item: string) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
                <LinkButton href={model.href} variant="ghost" size="sm" className="mt-4">
                  {model.cta}
                </LinkButton>
              </GlassCard>
            ))}
          </div>
        </Section>

        <Section tone="soft">
          <SectionHeader
            eyebrow="Specialized paths"
            title="Projects & partnership models"
            description="Project and operating-partner scope is defined in writing around the financial and operational work required."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {specializedModels.map((model: (typeof pricingModels)[number]) => (
              <GlassCard key={model.name} as="div" variant="glass" className="p-5">
                <h3 className="font-semibold text-text">{model.name}</h3>
                <p className="mt-2 text-sm text-accent">{model.price}</p>
                <p className="mt-2 text-sm text-muted">{model.bestFor}</p>
                <p className="mt-3 text-xs text-muted">Scope and outcomes</p>
                <LinkButton href={model.href} variant="ghost" size="sm" className="mt-3">
                  {model.cta}
                </LinkButton>
              </GlassCard>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">Includes Full MSO Partnership and credentialing ranges as published.</p>
          <MediaFrame
            src={mediaAssets.consulting}
            alt="Management consulting workshop. Editorial stock photograph; not ROOT staff or clients."
            caption="Editorial engagement context"
            className="mt-10"
            aspect="wide"
          />
        </Section>
      </div>
    </V4Shell>
  );
}
