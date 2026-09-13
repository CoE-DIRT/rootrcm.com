import { ArrowRight, ShieldCheck } from 'lucide-react';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { TalkToUs } from '@/components/TalkToUs';
import { CookieConsent } from '@/consent/CookieConsent';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { Callout } from '@/components/ui/Callout';
import { dispatchLeadEvent } from '@/analytics/events';
import { platformNodes, servicePages, pricingModels, resourceArticles } from '../../siteData.js';

const diagnostic = pricingModels.find((model: { name: string }) => model.name === 'Revenue Optimization Diagnostic');

export function HomePage() {
  return (
    <div className="v4-root min-h-screen bg-bg text-text">
      <CookieConsent />
      <MarketingHeader />
      <main id="main-content">
        {/* 1. Hero */}
        <Section className="pt-14 md:pt-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                RCM + Operations + Technology
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
                Run the business side of medicine better.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted">
                ROOT is the operating partner for independent physician practices — managing billing, denials, A/R,
                credentialing, practice operations, and technology.
              </p>
              <CTAGroup className="mt-8">
                <LinkButton
                  href="/diagnostic/"
                  variant="primary"
                  size="lg"
                  data-cta="diagnostic-start"
                  data-location="home-hero"
                  onClick={() => dispatchLeadEvent('cta_click', { cta: 'diagnostic-start', location: 'home-hero' })}
                >
                  Start the $2,500 Diagnostic <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </LinkButton>
                <TalkToUs />
              </CTAGroup>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                Clinical care stays with your practice. ROOT runs the business layer.
              </p>
            </div>
            <div className="rounded-[var(--radius-root)] border border-border bg-panel/60 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Signal → Action</p>
              <p className="mt-3 text-sm text-muted">
                DIRT connects leakage, denial patterns, A/R priorities, and PracticeOps signals to owners and next
                actions — see it live on the DIRT command center.
              </p>
              <LinkButton href="/technology/dirt/" variant="secondary" size="sm" className="mt-5">
                Explore DIRT
              </LinkButton>
            </div>
          </div>
        </Section>

        {/* 2. Practice revenue/ops problems */}
        <Section tone="soft">
          <SectionHeader
            eyebrow="Where practices lose ground"
            title="Revenue leakage, aging A/R, and credentialing bottlenecks compound quietly."
            description="These are connected operating problems, not isolated billing issues — ROOT treats them as one system."
          />
        </Section>

        {/* 3. ROOT operating model */}
        <Section>
          <SectionHeader eyebrow="Operating model" title="One partner across the practice business." align="left" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformNodes.map((node: { label: string; copy: string }) => (
              <div key={node.label} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
                <p className="text-sm font-semibold text-text">{node.label}</p>
                <p className="mt-2 text-sm text-muted">{node.copy}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. Service directory */}
        <Section tone="soft">
          <SectionHeader
            eyebrow="Service families"
            title="One partner across the practice business."
            description="Revenue operations, practice operations, and technology stay visible as owned service groups."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {servicePages.map((service: { slug: string; title: string }) => (
              <a
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="rounded-[var(--radius-root)] border border-border px-4 py-2 text-sm text-text hover:border-accent"
              >
                {service.title}
              </a>
            ))}
          </div>
          <LinkButton href="/services/" variant="ghost" size="sm" className="mt-6">
            View all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
        </Section>

        {/* 5. DIRT product preview */}
        <Section>
          <SectionHeader
            eyebrow="DIRT intelligence"
            title="Know what to act on next."
            description="Signal → finding → financial significance → owner → next action."
          />
          <LinkButton href="/technology/dirt/" variant="secondary" size="sm" className="mt-6">
            Explore DIRT <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
        </Section>

        {/* 6. $2,500 Diagnostic */}
        {diagnostic ? (
          <Section tone="soft">
            <SectionHeader eyebrow="Primary launch offer" title={diagnostic.name} description={diagnostic.bestFor} />
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <p className="text-2xl font-semibold text-accent">{diagnostic.price}</p>
              <ul className="flex flex-wrap gap-2 text-xs text-muted">
                {diagnostic.includes.map((item: string) => (
                  <li key={item} className="rounded-full border border-border px-3 py-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <LinkButton href={diagnostic.href} variant="primary" size="md" className="mt-6" data-cta="diagnostic-start" data-location="home-pricing">
              {diagnostic.cta}
            </LinkButton>
          </Section>
        ) : null}

        {/* 7. Engagement process (uses the Diagnostic's own approved deliverables as the process steps) */}
        {diagnostic ? (
          <Section>
            <SectionHeader eyebrow="Engagement process" title="From evidence to a 90-day plan." />
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {diagnostic.includes.map((step: string, index: number) => (
                <li key={step} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
                  <span className="text-xs font-semibold text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-sm text-text">{step}</p>
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {/* 8. Proof/case-study preview */}
        <Section tone="soft">
          <SectionHeader
            eyebrow="Proof of capability"
            title="Illustrative case studies, not client claims."
            description="Anonymized proofs of concept showing how ROOT structures the work — never presented as verified client outcomes."
          />
          <LinkButton href="/case-studies/" variant="ghost" size="sm" className="mt-6">
            View proof of capability <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
        </Section>

        {/* 9. Technology/platform proficiency */}
        <Section>
          <SectionHeader
            eyebrow="Technology"
            title="Works with the systems practices already run."
            description="EHR/PM workflow alignment, healthcare IT support, automation, and analytics — no unverified integration claims."
          />
          <LinkButton href="/technology/" variant="ghost" size="sm" className="mt-6">
            See the technology map <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
        </Section>

        {/* 10. Resource/content preview */}
        <Section tone="soft">
          <SectionHeader eyebrow="Resources" title="Operating knowledge, not filler blog posts." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceArticles.slice(0, 3).map((article: { slug: string; title: string }) => (
              <a
                key={article.slug}
                href={`/resources/${article.slug}/`}
                className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 text-sm text-text hover:border-accent"
              >
                {article.title}
              </a>
            ))}
          </div>
        </Section>

        {/* 11. Final CTA */}
        <Section>
          <SectionHeader
            align="center"
            eyebrow="Ready when you are"
            title="Bring ROOT into the business layer of the practice."
            description="Start with the Diagnostic, or talk through a broader MSO need."
          />
          <CTAGroup className="mt-6 justify-center">
            <LinkButton href="/diagnostic/" variant="primary" size="lg" data-cta="diagnostic-start" data-location="home-final-cta">
              Start the $2,500 Diagnostic
            </LinkButton>
            <LinkButton
              href="/contact/"
              variant="outline"
              size="lg"
              onClick={() => dispatchLeadEvent('contact_start', { location: 'home-final-cta' })}
            >
              Talk to ROOT
            </LinkButton>
          </CTAGroup>
          <Callout tone="compliance" className="mx-auto mt-8 max-w-xl">
            No PHI is collected on this site. Diagnostic engagements use deidentified operational data only.
          </Callout>
        </Section>
      </main>
      <MarketingFooter />
    </div>
  );
}
