/**
 * Locale / currency architecture. Launch market is US/USD.
 * Coarse geo only from a configured lawful provider — never invent location.
 */

export type MarketLocale = {
  country: string;
  locale: string;
  currency: 'USD';
  currencySymbol: '$';
  source: 'default' | 'configured-header' | 'configured-provider';
};

const US_DEFAULT: MarketLocale = {
  country: 'US',
  locale: 'en-US',
  currency: 'USD',
  currencySymbol: '$',
  source: 'default',
};

/** Approved Diagnostic price — personalization must not change this. */
export const DIAGNOSTIC_PRICE_USD = 2500;

export function formatUsd(amount: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: Date | string, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
}

/**
 * Resolve market. Without a configured geo source, always US/USD.
 * Optional: VITE_GEO_COUNTRY injected at edge (e.g. CF-IPCountry) — still coarse.
 */
export function resolveMarketLocale(): MarketLocale {
  const configured = (import.meta.env.VITE_GEO_COUNTRY as string | undefined)?.trim().toUpperCase();
  if (configured && /^[A-Z]{2}$/.test(configured)) {
    return {
      ...US_DEFAULT,
      country: configured,
      source: 'configured-header',
      // Currency remains USD until founder-approved market pricing exists.
    };
  }
  return US_DEFAULT;
}
