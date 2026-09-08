import { useEffect, useLayoutEffect } from 'react';
import { FloatingContactCta, SiteFooter, SiteHeader } from './components/SiteChrome.jsx';
import { brandAssets, pricingModels, resourceArticles, routeMeta, servicePages, solutionPages } from './siteData.js';
import {
  AboutPage,
  ContactPage,
  DiagnosticPage,
  DirtPage,
  HomePage,
  NotFoundPage,
  PlatformPage,
  PrivacyPage,
  PricingPage,
  ResourceArticlePage,
  ResourcesHubPage,
  ServicePage,
  ServicesHubPage,
  SolutionPage,
  SolutionsHubPage,
  TermsPage,
  TechnologyHubPage,
  ThankYouPage,
} from './pages.jsx';

const APPROVED_LAUNCH_TERMS = {
  managedRcm: 'Onboarding from $1,500; approximately 5% of collections where appropriate',
  dirt: '$1,500-$2,500/month',
};

function applyApprovedLaunchPricing() {
  const managedRcm = pricingModels.find((model) => model.name === 'Managed RCM');
  if (managedRcm) managedRcm.price = APPROVED_LAUNCH_TERMS.managedRcm;

  const dirt = pricingModels.find((model) => model.name === 'DIRT / Data Intelligence');
  if (dirt) dirt.price = APPROVED_LAUNCH_TERMS.dirt;

  const rcmService = servicePages.find((service) => service.slug === 'rcm');
  if (rcmService) {
    rcmService.pricing = `${APPROVED_LAUNCH_TERMS.managedRcm}. Final pricing depends on specialty, volume, payer mix, systems, and operating scope.`;
  }

  const reportingAnalytics = servicePages.find((service) => service.slug === 'reporting-analytics');
  if (reportingAnalytics) {
    reportingAnalytics.pricing = `${APPROVED_LAUNCH_TERMS.dirt} for DIRT/Data Intelligence when scoped as an ongoing layer.`;
  }
}

applyApprovedLaunchPricing();

const routes = {
  '/': HomePage,
  '/platform': PlatformPage,
  '/solutions': SolutionsHubPage,
  '/services': ServicesHubPage,
  '/technology': TechnologyHubPage,
  '/technology/dirt': DirtPage,
  '/pricing': PricingPage,
  '/resources': ResourcesHubPage,
  '/diagnostic': DiagnosticPage,
  '/company/about': AboutPage,
  '/contact': ContactPage,
  '/legal/privacy': PrivacyPage,
  '/legal/terms': TermsPage,
  '/thank-you': ThankYouPage,
};

solutionPages.forEach((page) => {
  routes[`/solutions/${page.slug}`] = () => <SolutionPage page={page} />;
});

servicePages.forEach((service) => {
  routes[`/services/${service.slug}`] = () => <ServicePage service={service} />;
});

resourceArticles.forEach((article) => {
  routes[`/resources/${article.slug}`] = () => <ResourceArticlePage article={article} />;
});

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
  const quietContact = path === '/thank-you';

  useLayoutEffect(() => {
    const carouselPrice = document.querySelector('.engagementCarousel .eyebrow');
    if (carouselPrice?.textContent?.includes('$2,500-$7,500/month')) {
      carouselPrice.textContent = '$1,500-$2,500/month when scoped';
    }
  }, [path]);

  useEffect(() => {
    syncDocumentMeta(path);
  }, [path]);

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      reveals.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);

  useEffect(() => {
    function handleCtaClick(event) {
      const target = event.target.closest('[data-cta]');
      if (!target) return;
      window.dispatchEvent(new CustomEvent('root:cta', {
        detail: {
          cta: target.dataset.cta,
          location: target.dataset.location,
          destination: target.dataset.destination,
          engagementType: target.dataset.engagementType,
          page: path,
        },
      }));
    }

    document.addEventListener('click', handleCtaClick);
    return () => document.removeEventListener('click', handleCtaClick);
  }, [path]);

  return (
    <main className="clinicalGlass">
      <SiteHeader minimal={minimal} />
      <Page />
      {!quietContact && <FloatingContactCta />}
      <SiteFooter minimal={minimal} />
    </main>
  );
}
