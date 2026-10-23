/** ROOT www -> apex canonical redirect.
 * Appwrite Function invoked through a domain; only GET/HEAD are redirected.
 * The destination origin is hard-coded to prevent untrusted-host open redirects.
 */
const DESTINATION_ORIGIN = 'https://rootrcm.com';

export function getDestination(req = {}) {
  const raw = req.url || `${req.path || '/'}${req.queryString ? `?${req.queryString}` : ''}`;
  if (typeof raw !== 'string' || raw.length > 8192) return null;

  try {
    const url = new URL(raw, 'https://www.rootrcm.com');
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    // URL.pathname/search preserve percent-encoded paths, query ordering and values.
    // URL fragments are never transmitted in HTTP requests.
    const location = `${DESTINATION_ORIGIN}${url.pathname}${url.search}`;
    return location.length <= 8192 ? location : null;
  } catch {
    return null;
  }
}

export default async ({ req, res }) => {
  const method = String(req.method || '').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    return res.text('Method Not Allowed', 405, { allow: 'GET, HEAD' });
  }

  const location = getDestination(req);
  if (!location) return res.text('Bad Request', 400);
  // Keep 302 through staging and initial cutover; promote to 308 after verified monitoring.
  return res.redirect(location, 302);
};
