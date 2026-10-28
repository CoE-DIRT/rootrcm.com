import { ArrowRight } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader } from '@/components/ui/Section';
import { HeroSection } from '@/components/sections/HeroSection';
import { HeroMockup } from '@/components/sections/HeroMockup';
import { RevenueSignalsRail, CommercialServiceShowcase, DirtOperatingBridge } from '@/components/sections/ReferenceCommercialBlocks';
import { EnterpriseProductNarrative, EnterpriseDirtWorkbench, EnterprisePricingSystem, EnterpriseProofGallery, EnterpriseAssuranceAndOffers } from '@/components/sections/EnterpriseExperience';
import { DirtExecutiveMetrics } from '@/components/dirt/DirtExecutiveMetrics';
import { LinkButton } from '@/components/ui/Button';
import { EditorialEvidence } from '@/components/sections/EditorialEvidence';
import { phase2Content } from '../../seo/phase2Content.js';
import { resourceArticles, servicePages } from '../../siteData.js';
import '../styles/homepage-refinement.css';
import '../styles/enterprise-experience.css';

/**
 * Conversion-first, product-led commercial homepage.
 * Five cohesive phases: executive hero, operating model, DIRT workbench,
 * engagement system and verifiable evidence + conversion.
 * All revenue figures remain illustrative; the site does not accept PHI.
 */
export function HomePage() {
  return (
    <V4Shell>
      <HeroSection
        eyebrow="ROOT / Revenue Operations & Outcomes Technology"
        title={phase2Content['/'].h1}
        description={phase2Content['/'].lead}
        supportLine="Medical billing. Practice operations. Revenue intelligence. Workflow technology. One accountable team."
        mockup={<HeroMockup badge="Interactive product preview"><div className="min-w-0 space-y-3" data-dirt-command><DirtExecutiveMetrics compact /></div></HeroMockup>}
      />
      <RevenueSignalsRail />
      <EnterpriseProductNarrative />
      <CommercialServiceShowcase services={servicePages} />
      <EnterpriseDirtWorkbench />
      <DirtOperatingBridge />
      <EnterprisePricingSystem />
      <EnterpriseProofGallery />
      <Section wide tone="soft">
        <div className="root-enterprise-heading">
          <div>
            <p className="root-enterprise-eyebrow">THE RESOURCE DESK</p>
            <h2>Better decisions start with <span>better questions.</span></h2>
            <p>Revenue intelligence briefings, practical operational guides and issue-by-issue explanations for healthcare decision makers.</p>
          </div>
          <LinkButton href="/resources/" variant="outline" data-cta="related-solution" data-location="resource-proof" data-destination="/resources/">Explore resources <ArrowRight size={16}/></LinkButton>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {resourceArticles.slice(0,3).map((article: { slug: string; title: string; summary?: string }) => (
            <a key={article.slug} href={`/resources/${article.slug}/`} className="root-workflow-card glass block rounded-[var(--radius-root)] p-6 transition-colors hover:border-data-blue/45">
              <p className="root-enterprise-eyebrow">ROOT INSIGHTS</p>
              <h3 className="text-lg font-semibold text-text">{article.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{article.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">Read the guide <ArrowRight size={15}/></span>
            </a>
          ))}
        </div>
      </Section>
      <EditorialEvidence path="/" />
      <EnterpriseAssuranceAndOffers />
    </V4Shell>
  );
}
