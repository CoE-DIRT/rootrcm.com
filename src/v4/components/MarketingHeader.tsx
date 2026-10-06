import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { LinkButton, IconButton } from '@/components/ui/Button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navCurrentClass,
} from '@/components/ui/NavigationMenu';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/Sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';
import { useExperiment } from '@/experiments/useExperiment';
import { primaryCta, primaryNav, productLinks, servicePages, solutionPages } from '../../siteData.js';
import { normalizePath, resolveCanonicalPath } from '../../seo/routeRegistry.js';

interface MarketingHeaderProps {
  minimal?: boolean;
}

/** True once the page has scrolled, so the header can switch from transparent to a solid, blurred bar. */
function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (frame) return;
      // Coalesce bursts of scroll events into one update per frame (falls back to a timer without rAF).
      frame = typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame(update) : window.setTimeout(update, 16);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) {
        if (typeof window.cancelAnimationFrame === 'function') window.cancelAnimationFrame(frame);
        window.clearTimeout(frame);
      }
    };
  }, [threshold]);
  return scrolled;
}

type NavState = 'page' | 'section' | undefined;

/** Current-page state for a nav item: exact page, or a section that contains the current page. */
function navState(href: string, currentPath: string): NavState {
  const target = normalizePath(href);
  const current = normalizePath(currentPath);
  if (target === current) return 'page';
  return target !== '/' && current.startsWith(`${target}/`) ? 'section' : undefined;
}

const linkClass =
  'relative block rounded-[var(--radius-root)] px-3 py-2 text-sm font-medium text-text/90 transition-colors ' +
  'hover:bg-panel hover:text-text motion-reduce:transition-none ' +
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue ${navCurrentClass}`;

/** Assistive current-state for a nav item: "page" on the page itself, "true" on a section that contains the current page. */
const ariaCurrent = (state: NavState): 'page' | 'true' | undefined => (state === 'page' ? 'page' : state === 'section' ? 'true' : undefined);

/**
 * The header's primary button. Its own component so the header A/B test (label only) is resolved, and its
 * exposure recorded, only where the button is actually rendered.
 */
function PrimaryCtaLink({ location, size, className }: { location: string; size: 'sm' | 'md'; className?: string }) {
  const experiment = useExperiment('headerCta');
  return (
    <LinkButton
      href={primaryCta.href}
      variant="primary"
      size={size}
      className={className}
      data-cta={primaryCta.cta}
      data-location={location}
      data-destination={primaryCta.href}
      data-engagement-type={primaryCta.engagementType}
      {...experiment.attrs}
    >
      {experiment.label ?? primaryCta.label}
    </LinkButton>
  );
}

export function MarketingHeader({ minimal = false }: MarketingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // The floating Follow and Talk to us panels sit above the sheet unless they are told it opened.
  const toggleMobile = (open: boolean) => {
    setMobileOpen(open);
    if (open) window.dispatchEvent(new CustomEvent('root:nav-open'));
  };
  const scrolled = useScrolled();
  const currentPath = typeof window === 'undefined' ? '/' : resolveCanonicalPath(window.location.pathname);

  return (
    <header
      className="v4-header fixed inset-x-0 top-0 z-40"
      data-scrolled={scrolled || mobileOpen ? 'true' : 'false'}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-root)] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[var(--v4-header-h)] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          aria-label="ROOT home"
          className="flex shrink-0 items-center gap-2 rounded-[var(--radius-root)] text-lg font-semibold tracking-tight text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue"
          data-cta="logo"
          data-location="header"
        >
          <img src="/brand/logos/root/root-mark-76.webp" alt="" width={28} height={28} className="h-7 w-7" />
          <span>ROOT</span>
        </a>

        {!minimal ? (
          <>
            <nav className="hidden xl:block" aria-label="Primary navigation">
              <NavigationMenu className="relative">
                <NavigationMenuList className="flex list-none items-center gap-0.5">
                  {primaryNav.map((item: { label: string; href: string; menu?: string }) => {
                    const state = navState(item.href, currentPath);
                    if (item.menu === 'services') {
                      return (
                        <NavigationMenuItem key={item.label}>
                          <NavigationMenuTrigger data-current={state} aria-current={ariaCurrent(state)}>{item.label}</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Healthcare revenue services</p>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                              {servicePages.map((service: { slug: string; title: string }) => (
                                <li key={service.slug}>
                                  <NavigationMenuLink href={`/services/${service.slug}/`} className="text-sm text-muted hover:text-text">
                                    {service.title}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                            <NavigationMenuLink href={item.href} className="mt-4 inline-block text-sm font-medium text-accent">
                              View all services →
                            </NavigationMenuLink>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }
                    if (item.menu === 'solutions') {
                      return (
                        <NavigationMenuItem key={item.label}>
                          <NavigationMenuTrigger data-current={state} aria-current={ariaCurrent(state)}>{item.label}</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Solutions by practice problem</p>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                              {solutionPages.map((page: { slug: string; title: string }) => (
                                <li key={page.slug}>
                                  <NavigationMenuLink href={`/solutions/${page.slug}/`} className="text-sm text-muted hover:text-text">
                                    {page.title}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-5 border-t border-border pt-4">
                              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Platform & technology</p>
                              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                {productLinks.map((link: { label: string; href: string }) => (
                                  <li key={link.href}>
                                    <NavigationMenuLink href={link.href} className="text-sm text-muted hover:text-text">
                                      {link.label}
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <NavigationMenuLink href={item.href} className="mt-4 inline-block text-sm font-medium text-accent">
                              View all solutions →
                            </NavigationMenuLink>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }
                    return (
                      <NavigationMenuItem key={item.label}>
                        <NavigationMenuLink
                          href={item.href}
                          aria-current={ariaCurrent(state)}
                          data-current={state}
                          className={linkClass}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <PrimaryCtaLink location="header" size="sm" className="hidden whitespace-nowrap sm:inline-flex" />

              <Sheet open={mobileOpen} onOpenChange={toggleMobile}>
                <SheetTrigger asChild>
                  <IconButton label="Open menu" className="h-11 w-11 rounded-full border border-border hover:border-border-strong xl:hidden">
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </IconButton>
                </SheetTrigger>
                <SheetContent title="Menu">
                  <nav aria-label="Mobile" className="flex flex-col gap-1">
                    {primaryNav.map((item: { label: string; href: string }) => {
                      const state = navState(item.href, currentPath);
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={ariaCurrent(state)}
                          data-current={state}
                          className={cn(
                            'rounded-[var(--radius-root)] px-3 py-3 text-base font-medium text-text hover:bg-bg-soft',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue',
                            // The page itself is highlighted; the section that contains the page is marked too, so a visitor on
                            // /services/rcm/ still sees which primary item they are under.
                            state === 'page' && 'bg-bg-soft text-accent',
                            state === 'section' && 'text-accent',
                          )}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                    <p className="mt-5 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Platform & technology</p>
                    {productLinks.map((link: { label: string; href: string }) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-[var(--radius-root)] px-3 py-2.5 text-sm text-muted hover:bg-bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-blue"
                      >
                        {link.label}
                      </a>
                    ))}
                    <div className="mt-5 border-t border-border pt-5">
                      <PrimaryCtaLink location="mobile-nav" size="md" className="w-full" />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <ThemeToggle />
        )}
      </div>
    </header>
  );
}
