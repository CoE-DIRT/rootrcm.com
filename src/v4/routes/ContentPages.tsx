import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { solutionPages, solutionMediaBySlug, mediaAssets, resourceArticles } from '../../siteData.js';
import { proofWorkAssets, proofPlacementBySolutionSlug, proofPlacementByResourceSlug } from '../../proofData.js';
import { getVisibleCaseStudies, getCaseStudyBySlug } from '../../data/caseStudies.js';
import {
  CaseStudyDetailPage as LegacyCaseStudyDetailPage,
} from '../../pages.jsx';

type Solution = (typeof solutionPages)[number];
type Article = (typeof resourceArticles)[number];

export function SolutionsHubPage() {
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Solutions' }]} />
        <h1 className="mt-4 text-4xl font-semibold text-text sm:text-5xl">Solutions by practice problem</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Start from the operating constraint — leakage, aging A/R, denials, credentialing, visibility — then map to ROOT
          services and DIRT.
        </p>
      </Section>
      <Section tone="soft">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutionPages.map((page: Solution) => (
            <a key={page.slug} href={`/solutions/${page.slug}/`} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 hover:border-accent">
              <h2 className="font-semibold text-text">{page.title}</h2>
              <p className="mt-2 text-sm text-muted">{page.summary}</p>
            </a>
          ))}
        </div>
      </Section>
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
            alt="Practice administrator workstation. Editorial stock photograph; not ROOT staff or clients."
            caption="Editorial operations context"
            aspect="video"
          />
        </Section>
      )}
      <Section>
            {'problem' in page && page.problem ? (
          <>
            <SectionHeader title="The operating problem" description={String(page.problem)} />
            {'rootResponse' in page && page.rootResponse ? (
              <p className="mt-4 text-sm text-muted">{String(page.rootResponse)}</p>
            ) : null}
            {'dirt' in page && page.dirt ? <p className="mt-3 text-sm text-muted">{String(page.dirt)}</p> : null}
          </>
        ) : null}
        {proof ? (
          <div className="mt-8 rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
            <p className="text-xs uppercase tracking-wide text-accent">{proof.label}</p>
            <h2 className="mt-1 text-lg font-semibold text-text">{proof.title}</h2>
            <p className="mt-2 text-sm text-muted">{proof.insight}</p>
          </div>
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
        <h1 className="mt-4 text-4xl font-semibold text-text sm:text-5xl">Operating knowledge for practice leadership.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">Guides and checklists — not filler blog posts.</p>
      </Section>
      <Section tone="soft">
        <MediaFrame
          src={mediaAssets.operationsPlanning}
          alt="Operations planning workshop. Editorial stock photograph; not ROOT staff or clients."
          caption="Editorial resource context"
          aspect="wide"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceArticles.map((article: Article) => (
            <a key={article.slug} href={`/resources/${article.slug}/`} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 hover:border-accent">
              <h2 className="font-semibold text-text">{article.title}</h2>
              <p className="mt-2 text-sm text-muted">{article.summary}</p>
            </a>
          ))}
        </div>
      </Section>
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
          <div className="mt-8 rounded-[var(--radius-root)] border border-border bg-panel/40 p-5">
            <p className="text-xs text-accent">{proof.label}</p>
            <p className="mt-1 font-medium text-text">{proof.title}</p>
            <p className="mt-2 text-sm text-muted">{proof.insight}</p>
          </div>
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
  const studies = getVisibleCaseStudies();
  return (
    <V4Shell>
      <Section className="pt-10 md:pt-14">
        <Breadcrumb items={[{ label: 'Proof of Capability' }]} />
        <h1 className="mt-4 text-4xl font-semibold text-text sm:text-5xl">Proof of Capability.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Anonymized proof-of-concept scenarios that show how ROOT and DIRT turn revenue-cycle signals into prioritized
          operating action. These are not client success stories.
        </p>
      </Section>
      <Section tone="soft">
        <div className="grid gap-4 md:grid-cols-2">
          {studies.length ? (
            studies.map((study: { slug: string; title: string; summary: string; proofLabel: string; publicReady: boolean }) => (
              <a key={study.slug} href={`/case-studies/${study.slug}/`} className="rounded-[var(--radius-root)] border border-border bg-panel/40 p-5 hover:border-accent">
                <span className="text-xs text-accent">{study.proofLabel}</span>
                <h2 className="mt-2 text-lg font-semibold text-text">{study.title}</h2>
                <p className="mt-2 text-sm text-muted">{study.summary}</p>
                {!study.publicReady ? <em className="mt-3 block text-xs text-signal-amber">Publication review required</em> : null}
              </a>
            ))
          ) : (
            <div className="rounded-[var(--radius-root)] border border-border p-6">
              <h2 className="font-semibold text-text">Proof materials are being prepared.</h2>
              <p className="mt-2 text-sm text-muted">Start with a practice-specific Revenue Optimization Diagnostic.</p>
            </div>
          )}
        </div>
        <MediaFrame
          src="/assets/case-studies/dirt-poc-01/previews/slide-01-the-problem.png"
          alt="DIRT proof slide preview — anonymized illustrative artifact."
          caption="Illustrative proof visual"
          className="mt-10"
          aspect="wide"
        />
      </Section>
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
        <LegacyCaseStudyDetailPage slug={slug} />
      </div>
    </V4Shell>
  );
}
