import { phase2Content, positioning } from '../../../seo/phase2Content.js';
import { LinkButton } from '@/components/ui/Button';
import { CTAGroup, Section } from '@/components/ui/Section';

type EditorialRoute = keyof typeof phase2Content;

/**
 * Rendered buyer-facing answers that mirror route-specific build-time content.
 * It never repeats an H1; each owning route renders its one canonical H1.
 * All public content is self-contained and safe for indexing or quotation.
 */
export function EditorialEvidence({ path }: { path: EditorialRoute }) {
  const page = phase2Content[path];
  return (
    <>
      <Section tone="soft" dense data-cso-route={path}>
        <p className="max-w-4xl text-base font-medium leading-relaxed text-text">{positioning}</p>
        <div className="mt-8 grid gap-7 lg:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.heading} className="glass rounded-[var(--radius-root)] p-6">
              <h2 className="text-xl font-semibold text-text">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{section.body}</p>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </Section>
      <Section dense>
        <blockquote className="border-l-4 border-accent pl-5 text-lg font-medium leading-relaxed text-text">
          {page.principle}
        </blockquote>
        <div className="mt-7 max-w-4xl">
          <h2 className="text-xl font-semibold text-text">A clear definition</h2>
          <p className="mt-3 text-base leading-relaxed text-muted" data-cso-definition>{page.definition}</p>
        </div>
        <div className="mt-7 border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-text">Choose the next evidence-led step</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Start a fixed-fee $2,500 Revenue Optimization Diagnostic to define financial exposure, required evidence, and a prioritized 90-day plan.
            Or review our open-access resources and bring a specific question to the discussion.
          </p>
          <CTAGroup className="mt-5">
            <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="page" data-destination="/diagnostic/" data-engagement-type="diagnostic">Explore the $2,500 Diagnostic and 90-day roadmap</LinkButton>
            <LinkButton href="/resources/" variant="outline">Read the revenue intelligence guides</LinkButton>
          </CTAGroup>
        </div>
      </Section>
    </>
  );
}
