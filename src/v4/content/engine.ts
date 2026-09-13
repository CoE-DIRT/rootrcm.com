/**
 * Content engine over approved siteData + case study registry.
 * MDX filesystem folders can be added later; schema + indexes ship now.
 */
import { resourceArticles, servicePages, solutionPages, routeMeta, socialProfiles } from '../../siteData.js';
import { getVisibleCaseStudies } from '../../data/caseStudies.js';

export type ContentKind = 'resource' | 'guide' | 'insight' | 'service' | 'solution' | 'case-study';

export interface ContentRecord {
  kind: ContentKind;
  slug: string;
  title: string;
  summary: string;
  href: string;
  tags: string[];
}

function asResources(): ContentRecord[] {
  return resourceArticles.map((article: { slug: string; title: string; summary: string }) => ({
    kind: article.slug.includes('guide') || article.slug.includes('playbook') || article.slug.includes('checklist')
      ? 'guide'
      : 'insight',
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    href: `/resources/${article.slug}/`,
    tags: ['resources'],
  }));
}

export function buildContentIndex(): ContentRecord[] {
  const services = servicePages.map((s: { slug: string; title: string; summary: string; family: string }) => ({
    kind: 'service' as const,
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    href: `/services/${s.slug}/`,
    tags: [s.family, 'services'],
  }));
  const solutions = solutionPages.map((s: { slug: string; title: string; summary: string }) => ({
    kind: 'solution' as const,
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    href: `/solutions/${s.slug}/`,
    tags: ['solutions'],
  }));
  const cases = getVisibleCaseStudies().map((c: { slug: string; title: string; summary: string }) => ({
    kind: 'case-study' as const,
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    href: `/case-studies/${c.slug}/`,
    tags: ['proof'],
  }));
  return [...asResources(), ...services, ...solutions, ...cases];
}

export function searchContent(query: string): ContentRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return buildContentIndex();
  return buildContentIndex().filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function relatedContent(slug: string, limit = 3): ContentRecord[] {
  const all = buildContentIndex();
  const seed = all.find((item) => item.slug === slug);
  if (!seed) return all.slice(0, limit);
  return all.filter((item) => item.slug !== slug && item.kind === seed.kind).slice(0, limit);
}

export function buildSitemapPaths(): string[] {
  const staticPaths = Object.keys(routeMeta).map((path) => (path === '/' ? '/' : `${path}/`));
  return [...new Set(staticPaths)].sort();
}

export function buildRssItems(): { title: string; link: string; description: string }[] {
  return asResources().map((item) => ({
    title: item.title,
    link: `https://rootrcm.com${item.href}`,
    description: item.summary,
  }));
}

/** Six approved ROOT social profiles only. */
export function buildSocialPack(): { platform: string; href: string; shareText: string }[] {
  return socialProfiles.map((profile: { label: string; href: string }) => ({
    platform: profile.label,
    href: profile.href,
    shareText: `ROOT — Revenue Operations & Outcomes Technology for independent practices. ${profile.href}`,
  }));
}

export function validateContentSchemas(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const article of resourceArticles) {
    if (!article.slug || !article.title || !article.summary || !article.sections?.length) {
      errors.push(`Invalid resource schema: ${article.slug || '(missing slug)'}`);
    }
  }
  for (const service of servicePages) {
    if (!service.slug || !service.title || !service.pricing) {
      errors.push(`Invalid service schema: ${service.slug || '(missing slug)'}`);
    }
  }
  return { ok: errors.length === 0, errors };
}
