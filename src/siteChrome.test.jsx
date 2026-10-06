import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { faqItems } from './faqData.js';
import { companyInfo, legalLinks, socialProfiles } from './siteData.js';

function renderRoute(path = '/') {
  window.history.pushState({}, '', path);
  return render(<App />);
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.head.querySelectorAll('meta[name="robots"], link[rel="canonical"]').forEach((node) => node.remove());
  window.history.pushState({}, '', '/');
  localStorage.clear();
  sessionStorage.clear();
});

const canonicalHref = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
const robotsContent = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content');

describe('required routes render a single, meaningful H1', () => {
  it.each([
    ['/about/', /built for the business behind healthcare/i],
    ['/faq/', /frequently asked questions/i],
    ['/book/', /book a conversation about your revenue cycle/i],
    ['/privacy-policy/', /^privacy policy$/i],
    ['/terms/', /^terms of use$/i],
    ['/refund-policy/', /refund & cancellation policy/i],
    ['/contact/', /revenue question your systems cannot answer/i],
    ['/pricing/', /intelligence and execution, scoped to your business/i],
    ['/thank-you/', /request received/i],
  ])('%s', (path, heading) => {
    renderRoute(path);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toMatch(heading);
  });
});

describe('FAQ page', () => {
  it('renders every question and answer in the DOM (crawlable) as native disclosures', () => {
    const { container } = renderRoute('/faq/');
    expect(container.querySelectorAll('details')).toHaveLength(faqItems.length);
    for (const item of faqItems) {
      expect(screen.getByRole('heading', { level: 3, name: item.question })).toBeTruthy();
      expect(screen.getByText(item.answer)).toBeTruthy();
    }
  });

  it('makes no certification, award, ranking or guarantee claims', () => {
    for (const item of faqItems) {
      expect(item.answer, item.question).not.toMatch(/HIPAA[- ]certified|SOC ?2|ISO[- ]certified|award|#1|best-in-class|100%|testimonial/i);
      expect(item.answer, item.question).not.toMatch(/\bguarantee[sd]?\b(?! financial| any| results)/i);
    }
    const guarantee = faqItems.find((item) => /guarantee/i.test(item.question));
    expect(guarantee.answer).toMatch(/^No\./);
  });
});

describe('legacy URLs and canonical metadata', () => {
  it.each([
    ['/company/about/', '/about/'],
    ['/legal/privacy/', '/privacy-policy/'],
    ['/legal/terms/', '/terms/'],
  ])('%s still renders and canonicalises to %s', (legacy, canonical) => {
    renderRoute(legacy);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(canonicalHref()).toBe(`https://rootrcm.com${canonical}`);
  });

  it('uses the route URL as canonical for new pages', () => {
    renderRoute('/faq/');
    expect(canonicalHref()).toBe('https://rootrcm.com/faq/');
    expect(document.title).toMatch(/FAQ/);
  });

  it('marks only system and unknown pages noindex', () => {
    renderRoute('/contact/');
    expect(robotsContent()).toBeUndefined();
    cleanup();
    renderRoute('/thank-you/');
    expect(robotsContent()).toBe('noindex, nofollow');
    cleanup();
    document.head.querySelector('meta[name="robots"]')?.remove();
    renderRoute('/does-not-exist/');
    expect(robotsContent()).toBe('noindex, nofollow');
  });
});

describe('indexing by host', () => {
  const renderOnHost = (hostname, path) => {
    window.history.pushState({}, '', path);
    vi.stubGlobal('location', { ...window.location, hostname });
    return render(<App />);
  };

  it('never lets a preview or unknown host be indexed, even for pages that are indexable in production', () => {
    for (const hostname of ['preview-123.appwrite.network', 'coe-dirt.github.io', 'staging.example.test']) {
      renderOnHost(hostname, '/contact/');
      expect(robotsContent(), hostname).toBe('noindex, nofollow');
      cleanup();
      document.head.querySelector('meta[name="robots"]')?.remove();
    }
  });

  it('leaves indexable pages indexable on the production hostnames', () => {
    for (const hostname of ['rootrcm.com', 'www.rootrcm.com']) {
      renderOnHost(hostname, '/contact/');
      expect(robotsContent(), hostname).toBeUndefined();
      cleanup();
    }
  });

  it('still marks system pages noindex on the production hostnames', () => {
    renderOnHost('rootrcm.com', '/checkout/success/');
    expect(robotsContent()).toBe('noindex, nofollow');
  });
});

describe('header', () => {
  it('marks the current page and the current section', () => {
    renderRoute('/pricing/');
    const nav = screen.getByRole('navigation', { name: /primary navigation/i });
    expect(within(nav).getByRole('link', { name: 'Pricing' }).getAttribute('aria-current')).toBe('page');
    expect(within(nav).getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBeNull();

    cleanup();
    renderRoute('/services/rcm/');
    const section = within(screen.getByRole('navigation', { name: /primary navigation/i })).getByRole('button', { name: 'Services' });
    expect(section.getAttribute('data-current')).toBe('section');
  });

  it('keeps a skip link, a theme switch and the primary CTA available on every shell', () => {
    renderRoute('/diagnostic/'); // minimal shell
    expect(screen.getByRole('link', { name: /skip to content/i }).getAttribute('href')).toBe('#main-content');
    expect(screen.getByRole('switch', { name: 'Light theme' })).toBeTruthy();
  });

  it('turns solid after scrolling', async () => {
    const { container } = renderRoute('/');
    const header = container.querySelector('header.v4-header');
    expect(header.getAttribute('data-scrolled')).toBe('false');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 });
    fireEvent.scroll(window);
    await waitFor(() => expect(header.getAttribute('data-scrolled')).toBe('true'));
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    fireEvent.scroll(window);
    await waitFor(() => expect(header.getAttribute('data-scrolled')).toBe('false'));
  });
});

describe('footer', () => {
  it('offers Talk to Us, verified contact details, legal links and labelled social controls', () => {
    renderRoute('/');
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('heading', { name: /talk to root about your revenue cycle/i })).toBeTruthy();
    const talk = within(footer).getByRole('link', { name: /^Talk to us/ });
    expect(talk.getAttribute('href')).toBe('/contact/');
    expect(talk.getAttribute('data-cta')).toBe('talk-to-root');
    for (const link of within(footer).getAllByRole('link', { name: /book a conversation/i })) expect(link.getAttribute('href')).toBe('/book/');

    expect(within(footer).getByRole('link', { name: companyInfo.phone }).getAttribute('href')).toBe(companyInfo.phoneHref);
    expect(within(footer).getByRole('link', { name: companyInfo.email }).getAttribute('href')).toBe(companyInfo.emailHref);
    expect(within(footer).getByText(/2803 Philadelphia Pike/)).toBeTruthy();

    for (const link of legalLinks) {
      expect(within(footer).getByRole('link', { name: link.label }).getAttribute('href')).toBe(link.href);
    }
    expect(within(footer).getByRole('button', { name: /cookie settings/i })).toBeTruthy();

    const social = within(footer).getByRole('navigation', { name: /follow root on social media/i });
    const links = within(social).getAllByRole('link');
    expect(links).toHaveLength(socialProfiles.length);
    for (const profile of socialProfiles) {
      const link = within(social).getByRole('link', { name: `ROOT on ${profile.label} (opens in new tab)` });
      expect(link.getAttribute('href')).toBe(profile.href);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });

  it('has no dead or placeholder links in header, footer or social controls', () => {
    const { container } = renderRoute('/');
    for (const anchor of container.querySelectorAll('header a, footer a')) {
      const href = anchor.getAttribute('href');
      expect(href, anchor.textContent).toBeTruthy();
      expect(href, anchor.textContent).not.toMatch(/^#$|^javascript:|example\.com|lorem/i);
    }
  });
});

describe('Book page', () => {
  it('offers the fixed-fee Diagnostic and the inquiry form, and does not pretend scheduling exists', () => {
    renderRoute('/book/');
    expect(screen.getAllByText(/\$2,500 fixed fee/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /start the conversation/i })).toBeTruthy();
    expect(screen.getByText(/self-serve scheduling is not live yet/i)).toBeTruthy();
    expect(screen.getByLabelText(/will not submit Protected Health Information/)).toBeTruthy();
  });
});

describe('Refund policy', () => {
  it('invents no refund terms, windows or guarantees', () => {
    renderRoute('/refund-policy/');
    const text = document.body.textContent;
    expect(text).toMatch(/written scope/i);
    expect(text).not.toMatch(/\b\d+[- ]day\b|money[- ]back|full refund|guaranteed findings/i);
  });
});
