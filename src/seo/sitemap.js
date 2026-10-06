import { SITE_ORIGIN, sitemapPaths } from './routeRegistry.js';

const xmlEscape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** XML sitemap of every public, canonical, indexable URL. Aliases, noindex and internal routes are excluded. */
export function buildSitemap(paths = sitemapPaths(), origin = SITE_ORIGIN) {
  const urls = paths.map((path) => `  <url><loc>${xmlEscape(origin + path)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * robots.txt. Production allows crawling and advertises the sitemap. Any other environment
 * (preview deployments, local builds) disallows everything so previews are never indexed.
 */
export function buildRobots({ siteEnv = 'production', origin = SITE_ORIGIN } = {}) {
  if (siteEnv !== 'production') return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
}
