import { GlassSkeleton } from '@/components/ui/GlassPlaceholder';
import { phase2Content } from '../../seo/phase2Content.js';
import { EditorialEvidence } from '@/components/sections/EditorialEvidence';
import { lazy, Suspense } from 'react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnnotationNote } from '@/components/ui/AnnotationNote';
import { solutionPages, solutionMediaBySlug, mediaAssets, resourceArticles } from '../../siteData.js';
import { proofWorkAssets, proofPlacementBySolutionSlug, proofPlacementByResourceSlug } from '../../proofData.js';
import { getCaseStudyBySlug } from '../../data/caseStudies.js';
const LegacyCaseStudyDetailPage = (import.meta.env.DEV || import.meta.env.MODE === 'development')
  ? lazy(() => import('../../pages.jsx').then((module) => ({ default: module.CaseStudyDetailPage })))
  : () => null;

type Solution = (typeof solutionPages)[number];
type Article = (typeof resourceArticles)[number];

export function SolutionsHubPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Solutions' }]} />
        <h1 className="mt-4 text-4xl font-semibold text-text sm:text-5xl">{phase2Content['/solutions/'].h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          {phase2Content['/solutions/'].lead}
        </p>
      </Section>
      <Section tone="soft">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutionPages.map((page: Solution) => (
            <a key={page.slug} href={`/solutions/${page.slug}/`} className="block h-full">
              <GlassCard variant="glass" accent="indigo" className="h-full">
                <h2 className="font-semibold text-text">{page.title}</h2>
                <p className="mt-2 text-sm text-muted">{page.summary}</p>
              </GlassCard>
            </a>
          ))}
        </div>
      </Section>
      <EditorialEvidence path="/solutions/" />
    </V4Shell>
  );
}

export function SolutionPage({ page }: { page: Solution }) {
  const media = solutionMediaBySlug[page.slug as keyof typeof solutionMediaBySlug];
  const proofKey = proofPlacementBySolutionSlug[page.slug as keyof typeof proofPlacementBySolutionSlug];
  const proof = proofKey ? proofWorkAssets[proofKey as keyof typeof proofWorkAssets] : null;

  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions/' }, { label: page.title }]} />
        <h1 className="mt-4 text-4xl font-semibold text-text">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{page.summary}</p>
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-destination="/diagnostic/">
            Start Diagnostic
          </LinkButton>
        </CTAGroup>
      </Section>
      {media ? (
        <Section tone="soft">
          <MediaFrame src={media.src} alt={media.alt} caption={media.caption} aspect="video" />
        </Section>
      ) : (
        <Section tone="soft">
          <MediaFrame
            src={mediaAssets.practiceAdmin}
            alt="Practice administrator workstation."
            aspect="video"
          />
        </Section>
      )}
      <Section tone="grid" wide>
            {'problem' in page && page.problem ? (
          <>
            <SectionHeader title="The financial and operating problem" description={String(page.problem)} />
            {'rootResponse' in page && page.rootResponse ? (
              <p className="mt-4 text-sm text-muted">{String(page.rootResponse)}</p>
            ) : null}
            {'dirt' in page && page.dirt ? <AnnotationNote label="DIRT signal" text={String(page.dirt)} className="mt-3" /> : null}
          </>
        ) : null}
        {proof ? (
          <GlassCard as="div" variant="glass" accent="cyan" hover={false} className="mt-8">
            <p className="text-xs uppercase tracking-wide text-data-blue">{proof.label}</p>
            <h2 className="mt-1 text-lg font-semibold text-text">{proof.title}</h2>
            <p className="mt-2 text-sm text-muted">{proof.insight}</p>
          </GlassCard>
        ) : null}
      </Section>
    </V4Shell>
  );
}

export function ResourcesHubPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Resources' }]} />
        <h1 className="mt-4 text-4xl font-semibold text-text sm:text-5xl">{phase2Content['/resources/'].h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{phase2Content['/resources/'].lead}</p>
        <a href="/downloads/root-revenue-intelligence-checklist.txt" download className="mt-5 inline-flex min-h-11 items-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-accent hover:underline">
          Download the free revenue evidence checklist (TXT, ungated)
        </a>
      </Section>
      <Section tone="soft">
        <MediaFrame
          src={mediaAssets.operationsPlanning}
          alt="Operations planning workshop."
          aspect="wide"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.map((article: Article) => (
            <a key={article.slug} href={`/resources/${article.slug}/`} className="block h-full">
              <GlassCard variant="glass" accent="green" className="h-full">
                <h2 className="font-semibold text-text">{article.title}</h2>
                <p className="mt-2 text-sm text-muted">{article.summary}</p>
              </GlassCard>
            </a>
          ))}
        </div>
      </Section>
      <EditorialEvidence path="/resources/" />
    </V4Shell>
  );
}

export function ResourceArticlePage({ article }: { article: Article }) {
  const proofKey = proofPlacementByResourceSlug[article.slug as keyof typeof proofPlacementByResourceSlug];
  const proof = proofKey ? proofWorkAssets[proofKey as keyof typeof proofWorkAssets] : null;

  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Resources', href: '/resources/' }, { label: article.title }]} />
        <h1 className="mt-4 text-4xl font-semibold text-text">{article.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{article.summary}</p>
      </Section>
      <Section tone="soft">
        {article.sections.map((section: string[]) => (
          <article key={section[0]} className="mb-8 max-w-3xl">
            <h2 className="text-xl font-semibold text-text">{section[0]}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{section[1]}</p>
          </article>
        ))}
        {article.sources?.length ? (
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-sm font-semibold text-text">Sources</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {article.sources.map((source: string[]) => (
                <li key={source[1]}>
                  <a href={source[1]} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {source[0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {proof ? (
          <GlassCard as="div" variant="glass" hover={false} className="mt-8">
            <p className="text-xs text-data-blue">{proof.label}</p>
            <p className="mt-1 font-medium text-text">{proof.title}</p>
            <p className="mt-2 text-sm text-muted">{proof.insight}</p>
          </GlassCard>
        ) : null}
        <CTAGroup className="mt-10">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-destination="/diagnostic/">
            Start Diagnostic
          </LinkButton>
        </CTAGroup>
      </Section>
    </V4Shell>
  );
}

export function CaseStudiesHubPage() {
  const steps = [
    { number: '01', title: 'Frame the operating question', copy: 'Start with the financial or workflow decision leadership needs to make, then agree on the measures and time period that will answer it.' },
    { number: '02', title: 'Connect the relevant signals', copy: 'Organize the practice reports it authorizes across revenue, payer activity, enrollment, and operations into a clear working view.' },
    { number: '03', title: 'Prioritize work with evidence', copy: 'Separate recurring causes from one-off exceptions, then rank opportunities by financial significance, recoverability, dependencies, and effort.' },
    { number: '04', title: 'Assign action and review progress', copy: 'Turn agreed priorities into named ownership, a next action, and a review cadence tied to baseline measures.' },
  ];

  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'How We Work' }]} />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">The ROOT method</p>
        <h1 className="mt-3 max-w-4xl text-balance text-4xl font-semibold text-text sm:text-5xl">
          {phase2Content['/case-studies/'].h1}
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-muted">
          {phase2Content['/case-studies/'].lead}
        </p>
        <MediaFrame src={mediaAssets.dirtAnalytics} alt="Illustrative analytics workstation." className="mt-10" aspect="wide" />
      </Section>

      <Section tone="soft">
        <SectionHeader eyebrow="A practical method" title="Move from scattered reports to accountable action." description="The work follows a clear sequence: define the question, connect the right evidence, prioritize what matters, and keep ownership visible." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <GlassCard key={step.number} variant="glass" accent="indigo" className="h-full">
              <p className="text-xs font-semibold tracking-[0.16em] text-data-blue">{step.number}</p>
              <h2 className="mt-3 text-lg font-semibold text-text">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{step.copy}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <SectionHeader eyebrow="What you can take forward" title="A decision-ready operating plan." description="A practice-specific review can organize findings into a useful working set for leadership and the teams responsible for follow-through." />
          <GlassCard as="div" variant="glass" hover={false}>
            <h2 className="text-lg font-semibold text-text">Typical working outputs</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="border-l-2 border-data-blue pl-3">Current-state findings with definitions and source context</li>
              <li className="border-l-2 border-data-blue pl-3">A prioritized opportunity register with evidence and next actions</li>
              <li className="border-l-2 border-data-blue pl-3">Named ownership, follow-up cadence, and escalation points</li>
              <li className="border-l-2 border-data-blue pl-3">Baseline measures for reviewing progress over time</li>
            </ul>
          </GlassCard>
        </div>
        <AnnotationNote label="Illustrative examples" text="Dashboards on this site use sample operating figures. A ROOT engagement is grounded in the reports and measures the practice authorizes for its own review." className="mt-8" />
        <CTAGroup className="mt-8">
          <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-destination="/diagnostic/">Explore the Revenue Optimization Diagnostic</LinkButton>
          <LinkButton href="/contact/" variant="outline">Talk to ROOT</LinkButton>
        </CTAGroup>
      </Section>
      <EditorialEvidence path="/case-studies/" />
    </V4Shell>
  );
}

/** Preserve Splide carousel / POC publication contracts from legacy detail page. */
export function CaseStudyDetailPage({ slug }: { slug: string }) {
  const study = getCaseStudyBySlug(slug);
  if (!study) {
    return (
      <V4Shell>
        <Section className="pt-20">
          <p className="text-sm text-muted">404</p>
          <h1 className="mt-2 text-3xl font-semibold">Proof not found</h1>
        </Section>
      </V4Shell>
    );
  }

  return (
    <V4Shell>
      <div className="v4-legacy-case-study">
        <Suspense fallback={<GlassSkeleton minHeight="32rem" label="Loading illustrative case study…" />}>
          <LegacyCaseStudyDetailPage slug={slug} />
        </Suspense>
      </div>
    </V4Shell>
  );
}
