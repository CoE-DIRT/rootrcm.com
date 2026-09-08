import { useEffect } from 'react';
import { SiteFooter, SiteHeader } from './components/SiteChrome.jsx';
import { brandAssets, routeMeta } from './siteData.js';
import {
  AboutPage,
  ContactPage,
  DiagnosticPage,
  DirtPage,
  HomePage,
  NotFoundPage,
  PracticeOpsPage,
  PrivacyPage,
  RcmPage,
  TermsPage,
  ThankYouPage,
} from './pages.jsx';

const routes = {
  '/': HomePage,
  '/services/rcm': RcmPage,
  '/services/practice-ops': PracticeOpsPage,
  '/technology/dirt': DirtPage,
  '/diagnostic': DiagnosticPage,
  '/company/about': AboutPage,
  '/contact': ContactPage,
  '/legal/privacy': PrivacyPage,
  '/legal/terms': TermsPage,
  '/thank-you': ThankYouPage,
};

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
}

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
}

function syncDocumentMeta(path) {
  const meta = routeMeta[path] || {
    title: 'Page Not Found | ROOT',
    description: 'The requested ROOT public website page could not be found.',
    image: brandAssets.fallbackOg,
  };
  const canonicalPath = path === '/' ? '/' : `${path}/`;
  const canonicalUrl = `https://rootrcm.com${canonicalPath}`;

  document.title = meta.title;
  upsertMeta('meta[name="description"]', { name: 'description', content: meta.description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: meta.description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: meta.image });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: meta.image });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
}

export default function App() {
  const path = normalizePath(window.location.pathname);
  const Page = routes[path] || NotFoundPage;
  const minimal = path === '/diagnostic' || path === '/thank-you';

  useEffect(() => {
    syncDocumentMeta(path);
  }, [path]);

  return (
    <main className="clinicalGlass">
      <SiteHeader minimal={minimal} />
      <Page />
      <SiteFooter minimal={minimal} />
    </main>
  );
}
