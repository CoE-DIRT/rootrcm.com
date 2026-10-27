import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DesktopNav } from '@/components/Nav/DesktopNav';
import { MobileNav } from '@/components/Nav/MobileNav';
import { assertNavCoverage } from '@/components/Nav/coverage';
import { primaryNav } from '../../siteData.js';
import { resolveCanonicalPath } from '../../seo/routeRegistry.js';

interface MarketingHeaderProps {
  minimal?: boolean;
}

/** Shared chrome retains the existing 40px scroll threshold and theme switch. */
function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);
  return scrolled;
}

export function MarketingHeader({ minimal = false }: MarketingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  const currentPath = typeof window === 'undefined' ? '/' : resolveCanonicalPath(window.location.pathname);

  useEffect(() => { assertNavCoverage(primaryNav); }, []);

  return (
    <header className="v4-header glass-strong sticky inset-x-0 top-0 z-40" data-scrolled={scrolled || mobileOpen ? 'true' : 'false'}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[var(--radius-root)] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
        Skip to content
      </a>
      <div className="mx-auto flex h-[var(--v4-header-h)] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="ROOT home" className="flex shrink-0 items-center gap-2 rounded-[var(--radius-root)] text-lg font-semibold tracking-tight text-text focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          data-cta="logo" data-location="header">
          <img src="/brand/logos/root/root-mark-76.webp" alt="" width={28} height={28} className="h-7 w-7" />
          <span>ROOT</span>
        </a>
        {!minimal ? (
          <>
            <DesktopNav currentPath={currentPath} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <MobileNav currentPath={currentPath} onOpenChange={setMobileOpen} />
            </div>
          </>
        ) : (
          <ThemeToggle />
        )}
      </div>
    </header>
  );
}
