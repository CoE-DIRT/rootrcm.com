import { readStoredConsent, readStoredServices, type AnalyticsConsent } from '../analytics/consent';
import { buildKlaroServices } from './klaroConfig';

/**
 * The visitor's saved choice, honoured only while it still answers for every service this build configures — the same
 * rule Klaro applies before it stops showing the banner. A cookie written before a service was added is treated as no
 * choice at all, so nothing runs on an old answer while Klaro is asking again.
 */
const configuredServices = (): string[] => buildKlaroServices().map((service) => service.name);

export const readConfirmedServices = (): Record<string, unknown> => readStoredServices(configuredServices());
export const readConfirmedConsent = (): AnalyticsConsent => readStoredConsent(configuredServices());
