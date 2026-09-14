import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { pricingModels, mediaAssets } from '../../siteData.js';
import { formatUsd, DIAGNOSTIC_PRICE_USD } from '@/growth/locale';
import { isDiagnosticCheckoutActive, startDiagnosticCheckout } from '@/growth/checkout';

export function PricingPage() {
  const diagnostic = pricingModels[0];
  const primaryModels = pricingModels.slice(1, 3);
  const specializedModels = pricingModels.slice(3);

  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Pricing' }]} />
        <h1 className="mt-4 measure-exec text-4xl font-semibold text-text sm:text-5xl">Engagement models with clear entry points.</h1>
        <p className="mt-4 max-w-2xl measure-body text-lg text-muted">
          Approved commercial pricing only. The Diagnostic remains {formatUsd(DIAGNOSTIC_PRICE_USD)} — personalization never
          changes price. Choose the path that matches how much ownership you need now.
        </p>
      </Section>

      <Section tone="flow" wide>
        <GlassCard as="div" variant="matrix" accent="cyan" hover={false} className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">Decision path · start here</p>
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
              Start the $2,500 Diagnostic
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

      <Section>
        <SectionHeader
          eyebrow="If you already know the ownership model"
          title="Core operating models"
          description="Managed RCM and DIRT when the Diagnostic evidence already points to ongoing execution."
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
          description="Scope and outcomes are defined in writing before work begins — secondary to the Diagnostic entry point."
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
    </V4Shell>
  );
}
