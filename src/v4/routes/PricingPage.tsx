import { lazy, Suspense } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { GlassSkeleton } from '@/components/ui/GlassPlaceholder';
import { phase2Content } from '../../seo/phase2Content.js';
import { EditorialEvidence } from '@/components/sections/EditorialEvidence';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckoutButton } from '@/components/CheckoutButton';
import { useExperiment } from '@/experiments/useExperiment';
import { EnterprisePricingSystem } from '@/components/sections/EnterpriseExperience';
import { pricingModels } from '../../siteData.js';
import '../styles/enterprise-experience.css';

const PricingGlance = lazy(() => import('./PricingGlance'));

/** All prices are published ROOT ranges, never uncontracted guarantees. */
export function PricingPage() {
  const presentation = useExperiment('pricingPresentation');
  const extras = pricingModels.slice(3, 5);
  return (
    <V4Shell>
      <div className="contents" {...presentation.attrs}>
        <Section className="pt-12 md:pt-20" wide>
          <Breadcrumb items={[{ label: 'Pricing' }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,.55fr)] lg:items-center">
            <div>
              <p className="root-enterprise-eyebrow">ROOT ENGAGEMENTS / CLEAR COMMERCIAL TERMS</p>
              <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">{phase2Content['/pricing/'].h1}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{phase2Content['/pricing/'].lead}</p>
              <CTAGroup className="mt-8">
                <LinkButton href="/contact/#contact-form" variant="primary" size="lg" data-cta="talk-to-root" data-location="pricing-core" data-destination="/contact/">Free introductory consultation <ArrowRight size={16}/></LinkButton>
                <LinkButton href="/diagnostic/" variant="outline" size="lg" data-cta="book-diagnostic" data-location="pricing-featured" data-destination="/diagnostic/">Explore the Diagnostic</LinkButton>
              </CTAGroup>
            </div>
            <GlassCard as="aside" hover={false} variant="glass" className="p-7">
              <p className="root-enterprise-eyebrow">FIRST STEP / TWO OPTIONS</p>
              <h2 className="text-2xl font-bold tracking-tight text-text">Explore for free.<br/>Go deeper with evidence.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">Start with a conversation at no charge, or scope the fixed-fee Revenue Optimization Diagnostic for a structured review.</p>
              <p className="mt-5 text-xl font-semibold text-text">$2,500 <span className="text-sm font-normal text-muted">fixed-fee Diagnostic</span></p>
              <div className="mt-4"><CheckoutButton location="pricing-featured" /></div>
            </GlassCard>
          </div>
        </Section>
        <EnterprisePricingSystem />
        <Section wide className="root-scope-section">
          <SectionHeader eyebrow="Specialty services" title="Scoped projects, automation and enrollment." description="Operational support can be engaged independently or combined with recurring revenue-cycle management and technology services." />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {extras.map((model) => <GlassCard key={model.name} as="article" variant="glass" hover={false} className="p-7">
              <p className="root-enterprise-eyebrow">SERVICE ADD-ON OR STANDALONE</p>
              <h3 className="mt-3 text-xl font-semibold text-text">{model.name}</h3>
              <p className="mt-2 text-lg font-bold text-accent">{model.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{model.bestFor}</p>
              <ul className="mt-5 grid gap-2">{model.includes.map((feature: string) => <li key={feature} className="flex items-center gap-2 text-sm text-muted"><Check size={15} className="text-accent"/>{feature}</li>)}</ul>
              <LinkButton href={model.href} variant="outline" className="mt-6" data-cta="pricing-card" data-location="pricing-specialized" data-destination={model.href}>{model.cta} <ArrowRight size={16}/></LinkButton>
            </GlassCard>)}
          </div>
        </Section>
        {presentation.variant === 'at-a-glance' ? <Section tone="soft">
          <SectionHeader eyebrow="Model comparison" title="Compare the engagement structure at a glance." description="Every published ROOT engagement in one place." />
          <div className="mt-6 min-h-[30rem]"><Suspense fallback={<GlassSkeleton minHeight="30rem" label="Loading pricing comparison" />}><PricingGlance /></Suspense></div>
        </Section> : null}
      </div>
      <EditorialEvidence path="/pricing/" />
    </V4Shell>
  );
}
