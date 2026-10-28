import { ArrowRight } from 'lucide-react';
import { phase2Content } from '../../seo/phase2Content.js';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader } from '@/components/ui/Section';
import { GlassPlaceholder } from '@/components/ui/GlassPlaceholder';
import { HeroSection } from '@/components/sections/HeroSection';
import { HeroMockup } from '@/components/sections/HeroMockup';
import { RevenueSignalsRail, CommercialServiceShowcase } from '@/components/sections/ReferenceCommercialBlocks';
import { EnterpriseProductNarrative, EnterpriseDirtWorkbench, EnterprisePricingSystem, EnterpriseProofGallery, EnterpriseAssuranceAndOffers } from '@/components/sections/EnterpriseExperience';

import { BuyerConfidence, ThreeStepTransition, CredentialingReadiness } from '@/components/sections/BuyerConfidence';
import { usePersonalization } from '@/growth/PersonalizationProvider';
import {
  servicePages,
  resourceArticles,
} from '../../siteData.js';

import { DirtExecutiveMetrics } from '@/components/dirt/DirtExecutiveMetrics';
import '../styles/enterprise-experience.css';
import '../styles/homepage-refinement.css';

const featureImages = [
  '/media/images/healthcare-operations-collaboration.jpg',
  '/media/images/practice-operations-workstation.jpg',
  '/media/images/practice-admin-workstation.jpg',
  '/media/images/rcm-billing-financial-operations.jpg',
  '/media/images/physician-nurse-coordination.jpg',
  '/media/images/practice-team-collaboration.jpg',
];

const healthcareSegments = [
  { name: 'Behavioral Health Groups', signal: 'Documentation-driven denials, payer enrollment timelines, and revenue visibility across group practices.', href: '/solutions/denials/' },
  { name: 'Ambulatory Surgery Centers', signal: 'Case reimbursement, authorization exposure, payer performance, and facility A/R.', href: '/solutions/revenue-leakage/' },
  { name: 'Office-Based Surgery & Labs', signal: 'Procedure economics, site-of-service workflows, participation, and reimbursement variance.', href: '/solutions/reporting-visibility/' },
  { name: 'Anesthesia Groups', signal: 'Provider enrollment, professional claims, payer follow-up, and aging A/R.', href: '/solutions/credentialing-bottlenecks/' },
  { name: 'Cardiology & Electrophysiology', signal: 'Complex procedures, authorization workflow, payer behavior, and financial visibility.', href: '/solutions/denials/' },
  { name: 'Multispecialty Practices', signal: 'Revenue intelligence by specialty, provider, payer, and location.', href: '/solutions/scaling-practice-ops/' },
];
/* Each specialty links to an existing ROOT solution; imagery is editorial, not claimed client evidence. */

export function HomePage() {
  return (
    <V4Shell>
      <HomePageContent />
    </V4Shell>
  );
}

function HomePageContent() {
  const personalization = usePersonalization();

  return (
    <>
      <HeroSection
        eyebrow="Healthcare Revenue Intelligence + Operating Infrastructure"
        title={phase2Content['/'].h1}
        description={phase2Content['/'].lead}
        supportLine={personalization.ctaSupport}
        mockup={
          <HeroMockup badge="DIRT product preview">
            <div className="min-w-0 space-y-3" data-dirt-command><DirtExecutiveMetrics compact /></div>
          </HeroMockup>
        }
      />

      <RevenueSignalsRail />
      <EnterpriseProductNarrative />

      <BuyerConfidence />
      <ThreeStepTransition />

      <CommercialServiceShowcase services={servicePages} />
      <CredentialingReadiness />
      <EnterpriseDirtWorkbench />

      <Section>
        <SectionHeader
          eyebrow="Built for US healthcare"
          title="Different specialties. One accountable revenue picture."
          description="We work with practice owners, administrators, and revenue leaders. Our focus includes cardiology, vascular, surgical, and multispecialty revenue operations."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {healthcareSegments.map((segment, index) => (
            <a key={segment.name} href={segment.href} className="root-feature-card glass block overflow-hidden rounded-[var(--radius-root)]">
              <GlassPlaceholder aspect="video" className="bg-panel-solid">
                <img src={featureImages[index]} alt={`${segment.name} administrative and clinical operations context`} width={480} height={480} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </GlassPlaceholder>
              <div className="p-5">
                <h3 className="font-semibold text-text">{segment.name}</h3>
                <p className="mt-2 text-sm text-muted">{segment.signal}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Explore revenue solution <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Section>

      <EnterprisePricingSystem />

      <Section tone="soft">
        <SectionHeader eyebrow="Resources" title="Practical intelligence for healthcare revenue leaders." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.slice(0, 3).map((article: { slug: string; title: string; summary?: string }) => (
            <a
              key={article.slug}
              href={`/resources/${article.slug}/`}
              className="glass rounded-[var(--radius-root)] p-5 transition-colors hover:border-data-blue/45"
            >
              <p className="text-sm font-medium text-text">{article.title}</p>
              {article.summary ? <p className="mt-2 text-xs text-muted">{article.summary}</p> : null}
            </a>
          ))}
        </div>
      </Section>

      <EnterpriseProofGallery />

      <EnterpriseAssuranceAndOffers />

    </>
  );
}
