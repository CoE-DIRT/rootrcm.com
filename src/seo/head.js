import { companyInfo, primaryNav, routeMeta } from '../siteData.js';
import { faqItems } from '../faqData.js';
import { themeBootstrapScript } from '../theme/themeConfig.js';
import { SITE_ORIGIN, allRoutes, canonicalForm, normalizePath, resolveCanonicalPath } from './routeRegistry.js';
import { faqSchema, organizationSchema, webPageSchema, webSiteSchema } from './schema.js';

const NOT_FOUND = {
  title: 'Page Not Found | ROOT',
  description: 'The requested ROOT public website page could not be found.',
  h1: 'This route does not go to revenue.',
};

const escapeAttr = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeText = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;

function upsertTag(html, pattern, tag) {
  return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', () => `  ${tag}\n</head>`);
}

const setMeta = (html, attribute, key, content) =>
  upsertTag(html, new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`), `<meta ${attribute}="${key}" content="${escapeAttr(content)}" />`);

/** Stable metadata lookup for a route path (legacy aliases resolve to their canonical entry). */
export function metaForPath(pathname) {
  const canonical = resolveCanonicalPath(pathname);
  const key = normalizePath(canonical);
  const meta = routeMeta[key] || (canonical === '/404.html' ? NOT_FOUND : null);
  return { canonical, key, meta };
}

function structuredData(canonical, meta) {
  const blocks = [];
  if (canonical === '/') blocks.push(organizationSchema(), webSiteSchema());
  if (canonical === '/about/') blocks.push(organizationSchema());
  blocks.push(webPageSchema({ path: canonical, title: meta.title, description: meta.description }));
  if (canonical === '/faq/') blocks.push(faqSchema(faqItems));
  return blocks;
}

/** Crawlable fallback for visitors and bots that do not run JavaScript. Replaced by React on mount. */
function noscriptFallback(canonical, meta) {
  const links = primaryNav.map((item) => `<li><a href="${escapeAttr(item.href)}">${escapeText(item.label)}</a></li>`).join('');
  const faq = canonical === '/faq/'
    ? faqItems.map((item) => `<h2>${escapeText(item.question)}</h2><p>${escapeText(item.answer)}</p>`).join('')
    : '';
  return (
    `<noscript><div style="max-width:60rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif">` +
    `<nav aria-label="Primary"><ul style="display:flex;flex-wrap:wrap;gap:1rem;list-style:none;padding:0">${links}</ul></nav>` +
    `<main><h1>${escapeText(meta.h1 || meta.title)}</h1><p>${escapeText(meta.description)}</p>${faq}` +
    `<p>JavaScript is required for interactive features. Email <a href="${escapeAttr(companyInfo.emailHref)}">${escapeText(companyInfo.email)}</a> or call ${escapeText(companyInfo.phone)}. Do not send PHI.</p></main></div></noscript>`
  );
}

/**
 * Rewrite a route's static HTML head so crawlers and social scrapers see the same, unique, canonical
 * metadata the hydrated app renders. Pure function: used by the Vite plugin and by tests.
 */
export function renderPageHtml(html, pathname, { siteEnv = 'production', gscVerification = '' } = {}) {
  const { canonical, meta } = metaForPath(pathname);
  if (!meta) return html;

  const route = allRoutes.find((candidate) => candidate.path === canonicalForm(normalizePath(pathname)));
  const noindex = siteEnv !== 'production' || Boolean(route?.noindex) || canonical === '/404.html';
  const url = `${SITE_ORIGIN}${canonical}`;
  const image = meta.image || `${SITE_ORIGIN}/brand/social/og-root.png`;

  let out = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeText(meta.title)}</title>`);
  out = setMeta(out, 'name', 'description', meta.description);
  out = upsertTag(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  out = setMeta(out, 'property', 'og:type', 'website');
  out = setMeta(out, 'property', 'og:site_name', 'ROOT');
  out = setMeta(out, 'property', 'og:title', meta.title);
  out = setMeta(out, 'property', 'og:description', meta.description);
  out = setMeta(out, 'property', 'og:url', url);
  out = setMeta(out, 'property', 'og:image', image);
  out = setMeta(out, 'name', 'twitter:card', 'summary_large_image');
  out = setMeta(out, 'name', 'twitter:title', meta.title);
  out = setMeta(out, 'name', 'twitter:description', meta.description);
  out = setMeta(out, 'name', 'twitter:image', image);
  out = out.replace(/\s*<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/g, '');
  if (noindex) out = out.replace('</head>', () => '  <meta name="robots" content="noindex, nofollow" />\n</head>');
  if (gscVerification) out = setMeta(out, 'name', 'google-site-verification', gscVerification);

  // Structured data and the theme bootstrap are always re-emitted together, in this order, so the output is stable.
  out = out.replace(/\s*<script data-root-theme>[\s\S]*?<\/script>/g, '');
  out = out.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const tags = [...structuredData(canonical, meta).map(jsonLd), `<script data-root-theme>${themeBootstrapScript()}</script>`];
  out = out.replace('</head>', () => `  ${tags.join('\n  ')}\n</head>`);

  if (!/<noscript>/.test(out)) {
    out = out.replace('<div id="root"></div>', () => `<div id="root"></div>\n  ${noscriptFallback(canonical, meta)}`);
  }
  return out;
}
