import { companyInfo, resourceArticles, routeMeta, servicePages, socialProfiles } from '../siteData.js';
import { SITE_ORIGIN } from './routeRegistry.js';

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

/**
 * Profiles that may be asserted as `sameAs`. Reddit is intentionally excluded until a valid
 * profile URL is confirmed (Reddit handles cannot contain dots, so the supplied URL is suspect).
 */
const SAME_AS_EXCLUDED = new Set(['Reddit']);

/**
 * Organization schema. LocalBusiness is deliberately NOT emitted: business hours and Google Business
 * Profile ownership are unverified, and the published address appears to be a mailing address.
 */
export function organizationSchema() {
  const [streetAddress, suite, cityLine] = companyInfo.addressLines;
  // "Claymont, DE 19703" -> locality, region, postal code
  const [, city = cityLine, region = '', postalCode = ''] = /^(.+),\s*([A-Z]{2})\s+(\d{5})$/.exec(cityLine) || [];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: companyInfo.legalName,
    alternateName: 'ROOT',
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/brand/logos/root/root-mark.png`,
    description: 'ROOT connects healthcare revenue cycle management, credentialing, practice operations, data architecture and DIRT revenue intelligence to uncover financial exposure and turn insight into accountable action.',
    email: companyInfo.email,
    telephone: companyInfo.phone.replace(/\s+/g, ' ').trim(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${streetAddress}, ${suite}`,
      addressLocality: city,
      addressRegion: region,
      postalCode,
      addressCountry: 'US',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: companyInfo.email,
        telephone: companyInfo.phone,
        availableLanguage: 'English',
      },
    ],
    sameAs: socialProfiles.filter((profile) => !SAME_AS_EXCLUDED.has(profile.label)).map((profile) => profile.href),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: 'ROOT',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };
}

export function webPageSchema({ path, title, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_ORIGIN}${path}#webpage`,
    url: `${SITE_ORIGIN}${path}`,
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };
}

/** FAQPage schema generated from the same items the page renders, so markup and content cannot drift. */
/** Breadcrumbs mirror the published route hierarchy and use the same canonical paths as the page head. */
export function breadcrumbSchema(path, title) {
  const segments = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', item: `${SITE_ORIGIN}/` }];
  for (let index = 0; index < segments.length; index += 1) {
    const routePath = `/${segments.slice(0, index + 1).join('/')}/`;
    const routeKey = routePath.replace(/\/$/, '');
    const label = index === segments.length - 1 ? title : (routeMeta[routeKey]?.h1 || routeMeta[routeKey]?.title || segments[index]);
    items.push({ name: label, item: `${SITE_ORIGIN}${routePath}` });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

/** Describes ROOT's published service pages without adding outcomes, availability, or prices not stated there. */
export function serviceSchema({ path, title, description }) {
  const slug = path.split('/').filter(Boolean).pop();
  const service = servicePages.find((item) => item.slug === slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_ORIGIN}${path}#service`,
    name: service?.title || title,
    serviceType: service?.family || 'Healthcare revenue operations',
    description: service?.summary || description,
    url: `${SITE_ORIGIN}${path}`,
    provider: { '@id': ORGANIZATION_ID },
  };
}

/** Resource articles have no publication dates in the source data, so none are asserted here. */
export function articleSchema({ path, title, description, image }) {
  const slug = path.split('/').filter(Boolean).pop();
  const article = resourceArticles.find((item) => item.slug === slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_ORIGIN}${path}#article`,
    headline: article?.title || title,
    description: article?.summary || description,
    image,
    mainEntityOfPage: { '@id': `${SITE_ORIGIN}${path}#webpage` },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
