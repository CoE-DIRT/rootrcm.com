import { lazy, Suspense } from 'react';
import { GlassPlaceholder } from '@/components/ui/GlassPlaceholder';
import { phase2Content } from '../../seo/phase2Content.js';
const PricingGlance = lazy(() => import('./PricingGlance').then((module) => ({ default: module.PricingGlance })));
import { EditorialEvidence } from '@/components/sections/EditorialEvidence';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { pricingModels, mediaAssets } from '../../siteData.js';
import { CheckoutButton } from '@/components/CheckoutButton';
import { useExperiment } from '@/experiments/useExperiment';

type PricingModel = (typeof pricingModels)[number];

/** Lowercase slug used as the engagement type of a pricing-card click (a label, never visitor data). */
const modelSlug = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Attributes that make a pricing-card link a reportable `cta_click` (the pricing test's metric counts these). */
const cardTracking = (model: PricingModel, location: 'pricing-core' | 'pricing-specialized') => ({
  'data-cta': 'pricing-card',
  'data-location': location,
  'data-destination': model.href,
  'data-engagement-type': modelSlug(model.name),
});


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
          <h1 className="mt-4 measure-exec text-4xl font-semibold text-text sm:text-5xl">{phase2Content['/pricing/'].h1}</h1>
          <p className="mt-4 max-w-2xl measure-body text-lg text-muted">
            {phase2Content['/pricing/'].lead}
          </p>
        </Section>

        <Section tone="flow" wide>
          <GlassCard as="div" variant="glass" accent="cyan" hover={false} className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">Focused entry engagement</p>
            <h2 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">{diagnostic.name}</h2>
            <p className="mt-2 text-xl font-semibold text-text md:text-2xl">{diagnostic.price}</p>
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
              <CheckoutButton location="pricing-featured" />
            </CTAGroup>
          </GlassCard>
        </Section>

        {presentation.variant === 'at-a-glance' ? (
          <Suspense fallback={<Section tone="soft"><GlassPlaceholder busy minHeight="38rem" label="Loading pricing comparison" className="glass rounded-[var(--radius-root)]" /></Section>}>
            <PricingGlance />
          </Suspense>
        ) : null}

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
                <p className="mt-2 font-semibold text-text">{model.price}</p>
                <p className="mt-3 text-sm text-muted">{model.bestFor}</p>
                <ul className="mt-4 space-y-1 text-sm text-muted">
                  {model.includes.map((item: string) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
                <LinkButton href={model.href} variant="ghost" size="sm" className="mt-4" {...cardTracking(model, 'pricing-core')}>
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
                <p className="mt-2 text-sm font-semibold text-text">{model.price}</p>
                <p className="mt-2 text-sm text-muted">{model.bestFor}</p>
                <p className="mt-3 text-xs text-muted">Scope and outcomes</p>
                <LinkButton href={model.href} variant="ghost" size="sm" className="mt-3" {...cardTracking(model, 'pricing-specialized')}>
                  {model.cta}
                </LinkButton>
              </GlassCard>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">Includes Full MSO Partnership and credentialing ranges as published.</p>
          <MediaFrame
            src={mediaAssets.consulting}
            alt="Management consulting workshop. "
            caption="Editorial engagement context"
            className="mt-10"
            aspect="wide"
          />
        </Section>
      </div>
      <EditorialEvidence path="/pricing/" />
    </V4Shell>
  );
}
