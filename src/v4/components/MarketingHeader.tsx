import { useState } from 'react';
import { Menu } from 'lucide-react';
import { LinkButton, IconButton } from '@/components/ui/Button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/NavigationMenu';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/Sheet';
import { servicePages, solutionPages } from '../../siteData.js';

interface MarketingHeaderProps {
  minimal?: boolean;
}

const primaryLinks = [
  { label: 'Platform', href: '/platform/' },
  { label: 'Technology', href: '/technology/' },
  { label: 'DIRT', href: '/technology/dirt/' },
  { label: 'Case Studies', href: '/case-studies/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Resources', href: '/resources/' },
];

export function MarketingHeader({ minimal = false }: MarketingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="v4-root sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-root)] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-text" data-cta="logo" data-location="header">
          <img src="/brand/logos/root/root-mark-76.webp" alt="" width={28} height={28} className="h-7 w-7" />
          <span>ROOT</span>
        </a>

        {!minimal ? (
          <>
            <nav className="hidden lg:block" aria-label="Primary navigation">
              <NavigationMenu className="relative">
                <NavigationMenuList className="flex list-none items-center gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        MSO service directory
                      </p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                        {servicePages.map((service: { slug: string; title: string }) => (
                          <NavigationMenuLink
                            key={service.slug}
                            href={`/services/${service.slug}/`}
                            className="text-sm text-muted hover:text-text"
                          >
                            {service.title}
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <NavigationMenuLink href="/services/" className="mt-4 inline-block text-sm font-medium text-accent">
                        View all services →
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        Solutions by practice problem
                      </p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                        {solutionPages.map((page: { slug: string; title: string }) => (
                          <NavigationMenuLink
                            key={page.slug}
                            href={`/solutions/${page.slug}/`}
                            className="text-sm text-muted hover:text-text"
                          >
                            {page.title}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  {primaryLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink
                        href={link.href}
                        className="block rounded-[var(--radius-root)] px-3 py-2 text-sm font-medium text-text hover:bg-panel"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <LinkButton href="/contact/" variant="ghost" size="sm" data-cta="contact" data-location="header">
                Contact
              </LinkButton>
              <LinkButton href="/diagnostic/" variant="primary" size="sm" data-cta="book-diagnostic" data-location="header" data-destination="/diagnostic/">
                Get the Diagnostic
              </LinkButton>
            </div>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <IconButton label="Open menu" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </IconButton>
              </SheetTrigger>
              <SheetContent title="Menu">
                <nav aria-label="Mobile" className="flex flex-col gap-1">
                  {[{ label: 'Services', href: '/services/' }, { label: 'Solutions', href: '/solutions/' }, ...primaryLinks].map(
                    (link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-[var(--radius-root)] px-3 py-2.5 text-sm font-medium text-text hover:bg-bg-soft"
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                  <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    <LinkButton href="/contact/" variant="secondary">
                      Contact
                    </LinkButton>
                    <LinkButton href="/diagnostic/" variant="primary" data-cta="book-diagnostic" data-location="mobile-nav" data-destination="/diagnostic/">
                      Get the Diagnostic
                    </LinkButton>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : null}
      </div>
    </header>
  );
}
