import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface PersonalizationInputs {
  route: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrerHost: string;
  isReturning: boolean;
  deviceClass: 'mobile' | 'tablet' | 'desktop';
}

export interface PersonalizationOutputs {
  ctaSupport: string;
  emphasis: 'dirt' | 'rcm' | 'diagnostic' | 'default';
  leadMagnet: string;
  resourceHint: string;
  bannerId: string | null;
}

const DEFAULT_OUTPUT: PersonalizationOutputs = {
  ctaSupport: 'Start with evidence. Expand when the operating case is clear.',
  emphasis: 'default',
  leadMagnet: 'Revenue Optimization Diagnostic',
  resourceHint: '/resources/',
  bannerId: null,
};

function readInputs(): PersonalizationInputs {
  if (typeof window === 'undefined') {
    return {
      route: '/',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      referrerHost: '',
      isReturning: false,
      deviceClass: 'desktop',
    };
  }
  const params = new URLSearchParams(window.location.search);
  const w = window.innerWidth;
  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    referrerHost = '';
  }
  const returning = window.localStorage.getItem('root-return-visitor') === '1';
  window.localStorage.setItem('root-return-visitor', '1');
  return {
    route: window.location.pathname,
    utmSource: (params.get('utm_source') || '').toLowerCase(),
    utmMedium: (params.get('utm_medium') || '').toLowerCase(),
    utmCampaign: (params.get('utm_campaign') || '').toLowerCase(),
    referrerHost,
    isReturning: returning,
    deviceClass: w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop',
  };
}

/** First-party rule engine — no PHI, no price changes, default always works. */
export function resolvePersonalization(inputs: PersonalizationInputs): PersonalizationOutputs {
  const out: PersonalizationOutputs = { ...DEFAULT_OUTPUT };

  if (inputs.utmCampaign.includes('dirt') || inputs.route.includes('/technology/dirt')) {
    out.emphasis = 'dirt';
    out.ctaSupport = 'See how DIRT turns leakage signals into owned next actions.';
    out.bannerId = 'dirt-diagnostic';
  } else if (inputs.utmSource.includes('linkedin') || inputs.utmMedium === 'cpc') {
    out.emphasis = 'diagnostic';
    out.ctaSupport = 'Campaign visitors often start with the fixed-fee Diagnostic.';
    out.bannerId = 'campaign-diagnostic';
  } else if (inputs.route.includes('/pricing') || inputs.route.includes('/services/rcm')) {
    out.emphasis = 'rcm';
    out.ctaSupport = 'Compare engagement models, then validate with the Diagnostic.';
    out.bannerId = 'pricing-diagnostic';
  } else if (inputs.isReturning) {
    out.ctaSupport = 'Welcome back — pick up with the Diagnostic or talk to ROOT.';
    out.bannerId = 'returning';
  }

  if (inputs.utmCampaign.includes('denial')) {
    out.resourceHint = '/resources/denial-management-root-cause/';
    out.leadMagnet = 'Denial Management Root-Cause Guide';
  }

  return out;
}

const PersonalizationContext = createContext<PersonalizationOutputs>(DEFAULT_OUTPUT);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => resolvePersonalization(readInputs()), []);
  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}

export function usePersonalization(): PersonalizationOutputs {
  return useContext(PersonalizationContext);
}
