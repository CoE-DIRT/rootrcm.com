import { describe, expect, it } from 'vitest';
import handler, { getDestination } from './main.js';

const redirect = async (req) => handler({
  req,
  res: {
    redirect: (location, code) => ({ location, code }),
    text: (body, code, headers) => ({ body, code, headers }),
  },
});

describe('www canonical redirect', () => {
  it.each([
    ['https://www.rootrcm.com/', 'https://rootrcm.com/'],
    ['https://www.rootrcm.com/services/rcm/', 'https://rootrcm.com/services/rcm/'],
    ['https://www.rootrcm.com/partners/?source=linkedin&campaign=a%2Fb', 'https://rootrcm.com/partners/?source=linkedin&campaign=a%2Fb'],
    ['https://www.rootrcm.com/faq/?a=1&a=2', 'https://rootrcm.com/faq/?a=1&a=2'],
    ['https://www.rootrcm.com/a%20b/%E2%9C%93?q=a%20b', 'https://rootrcm.com/a%20b/%E2%9C%93?q=a%20b'],
    ['/contact/?source=www', 'https://rootrcm.com/contact/?source=www'],
    ['https://evil.example/steal?next=www', 'https://rootrcm.com/steal?next=www'],
  ])('preserves path/query with fixed target host: %s', (url, expected) => {
    expect(getDestination({ url })).toBe(expected);
  });

  it('uses the documented request path/query fallback', () => {
    expect(getDestination({ path: '/partners/', queryString: 's=1&s=2' })).toBe('https://rootrcm.com/partners/?s=1&s=2');
  });

  it('does not leak hash fragments into HTTP redirects', () => {
    expect(getDestination({ url: 'https://www.rootrcm.com/pricing/?a=1#private' })).toBe('https://rootrcm.com/pricing/?a=1');
  });

  it('does not accept non-HTTP URL schemes or oversized URLs', () => {
    expect(getDestination({ url: 'javascript:alert(1)' })).toBeNull();
    expect(getDestination({ url: `/${'x'.repeat(8300)}` })).toBeNull();
  });

  it('returns an HTTP redirect for GET and HEAD', async () => {
    for (const method of ['GET', 'HEAD']) {
      expect(await redirect({ method, url: 'https://www.rootrcm.com/partners/?ref=mail' })).toEqual({
        location: 'https://rootrcm.com/partners/?ref=mail', code: 302,
      });
    }
  });

  it('rejects other methods', async () => {
    expect(await redirect({ method: 'POST', url: 'https://www.rootrcm.com/form/' })).toEqual({
      body: 'Method Not Allowed', code: 405, headers: { allow: 'GET, HEAD' },
    });
  });

  it('rejects invalid URLs instead of redirecting', async () => {
    expect(await redirect({ method: 'GET', url: 'javascript:alert(1)' })).toEqual({
      body: 'Bad Request', code: 400, headers: undefined,
    });
  });
});
