/**
 * Deidentified, first-touch commercial campaign labels. This is functional form attribution,
 * NOT a marketing pixel or an ad-click identifier. The same strict registry used by
 * ROOT's first-party tracker rejects arbitrary query strings, client names and PHI.
 *
 * UTM content is intentionally excluded until a governed creative-label registry exists.
 */
import { sanitizeCampaign } from '../../v4/analytics/sanitize.ts';

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];

export function cleanLeadAttribution(source = {}) {
  if (!source || typeof source !== 'object') return {};
  const safe = {};
  for (const key of KEYS) {
    const label = sanitizeCampaign(key, source[key]);
    if (label) safe[key] = label;
  }
  return safe;
}

export function readLeadAttribution(search = '', storage = undefined) {
  const parsed = new URLSearchParams(typeof search === 'string' ? search : '');
  const current = cleanLeadAttribution(Object.fromEntries(KEYS.map((key) => [key, parsed.get(key)])));
  if (!storage) return current;

  let previous = {};
  try {
    previous = cleanLeadAttribution(JSON.parse(storage.getItem('root-attribution') || '{}'));
  } catch {
    // Storage may be denied; the inquiry form must still work.
  }

  // First touch wins; a later ad must not silently overwrite a valid earlier channel.
  if (Object.keys(previous).length) return previous;
  if (Object.keys(current).length) {
    try { storage.setItem('root-attribution', JSON.stringify(current)); } catch {
      // Attribution is best-effort, never a form submission prerequisite.
    }
  }
  return current;
}
