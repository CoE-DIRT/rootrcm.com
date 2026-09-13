import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { usePersonalization } from './PersonalizationProvider';
import { cn } from '@/lib/cn';

type BannerConfig = {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

const BANNERS: Record<string, BannerConfig> = {
  'dirt-diagnostic': {
    id: 'dirt-diagnostic',
    title: 'See DIRT on your revenue cycle',
    body: 'Start with the fixed-fee Diagnostic — signal to owned next action.',
    href: '/diagnostic/',
    cta: 'Start Diagnostic',
  },
  'campaign-diagnostic': {
    id: 'campaign-diagnostic',
    title: 'Campaign path: Revenue Diagnostic',
    body: 'Validate leakage and priorities before changing vendors or systems.',
    href: '/diagnostic/',
    cta: 'Book Diagnostic',
  },
  'pricing-diagnostic': {
    id: 'pricing-diagnostic',
    title: 'Not sure which engagement fits?',
    body: 'The $2,500 Diagnostic produces the evidence before a larger commitment.',
    href: '/diagnostic/',
    cta: 'Start here',
  },
  returning: {
    id: 'returning',
    title: 'Continue where you left off',
    body: 'Talk to ROOT or reopen the Diagnostic inquiry.',
    href: '/contact/',
    cta: 'Talk to ROOT',
  },
  'exit-diagnostic': {
    id: 'exit-diagnostic',
    title: 'Before you go',
    body: 'Take the Revenue Optimization Diagnostic — $2,500 fixed, no PHI on this site.',
    href: '/diagnostic/',
    cta: 'Open Diagnostic',
  },
};

const DISMISS_KEY = 'root-intent-banner-dismissed';
const FREQ_KEY = 'root-intent-banner-shown';

function wasDismissed(id: string): boolean {
  try {
    const raw = JSON.parse(window.localStorage.getItem(DISMISS_KEY) || '{}');
    return Boolean(raw[id]);
  } catch {
    return false;
  }
}

function markDismissed(id: string) {
  try {
    const raw = JSON.parse(window.localStorage.getItem(DISMISS_KEY) || '{}');
    raw[id] = Date.now();
    window.localStorage.setItem(DISMISS_KEY, JSON.stringify(raw));
  } catch {
    /* ignore */
  }
}

function underFrequencyCap(): boolean {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const raw = JSON.parse(window.sessionStorage.getItem(FREQ_KEY) || '{}');
    return (raw[day] || 0) < 1;
  } catch {
    return true;
  }
}

function bumpFrequency() {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const raw = JSON.parse(window.sessionStorage.getItem(FREQ_KEY) || '{}');
    raw[day] = (raw[day] || 0) + 1;
    window.sessionStorage.setItem(FREQ_KEY, JSON.stringify(raw));
  } catch {
    /* ignore */
  }
}

export function IntentBannerHost() {
  const personalization = usePersonalization();
  const [active, setActive] = useState<BannerConfig | null>(null);
  const [exitArmed, setExitArmed] = useState(false);

  useEffect(() => {
    if (!underFrequencyCap()) return;

    const timer = window.setTimeout(() => setExitArmed(true), 12000);
    const onScroll = () => {
      const depth = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (depth > 0.55 && personalization.bannerId && !wasDismissed(personalization.bannerId)) {
        const cfg = BANNERS[personalization.bannerId];
        if (cfg) {
          setActive(cfg);
          bumpFrequency();
          window.removeEventListener('scroll', onScroll);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [personalization.bannerId]);

  useEffect(() => {
    if (!exitArmed) return;
    const isDesktop = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024;
    if (!isDesktop) {
      // Mobile: inactivity / scroll-reversal — no fake pointer exit intent
      let lastY = window.scrollY;
      let idle: number | undefined;
      const onScroll = () => {
        const y = window.scrollY;
        if (y + 80 < lastY && !active && !wasDismissed('exit-diagnostic') && underFrequencyCap()) {
          setActive(BANNERS['exit-diagnostic']);
          bumpFrequency();
        }
        lastY = y;
      };
      const resetIdle = () => {
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          if (!active && !wasDismissed('exit-diagnostic') && underFrequencyCap()) {
            setActive(BANNERS['exit-diagnostic']);
            bumpFrequency();
          }
        }, 45000);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointerdown', resetIdle);
      resetIdle();
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointerdown', resetIdle);
        window.clearTimeout(idle);
      };
    }

    const onOut = (event: MouseEvent) => {
      if (event.clientY > 8) return;
      if (active || wasDismissed('exit-diagnostic') || !underFrequencyCap()) return;
      setActive(BANNERS['exit-diagnostic']);
      bumpFrequency();
    };
    document.addEventListener('mouseout', onOut);
    return () => document.removeEventListener('mouseout', onOut);
  }, [exitArmed, active]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-label={active.title}
      className={cn(
        'fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-[var(--radius-root)] border border-border bg-panel p-4 shadow-root sm:left-auto sm:right-6',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">{active.title}</p>
          <p className="mt-1 text-xs text-muted">{active.body}</p>
        </div>
        <button
          type="button"
          className="rounded p-1 text-muted hover:text-text"
          aria-label="Dismiss"
          onClick={() => {
            markDismissed(active.id);
            setActive(null);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <LinkButton href={active.href} variant="primary" size="sm" className="mt-3" data-cta="intent-banner" data-location={active.id}>
        {active.cta}
      </LinkButton>
    </div>
  );
}
