// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { consumeEmailSlot, purgeExpiredCounters } from './rateLimit.js';
const env = { APPWRITE_FUNCTION_API_ENDPOINT:'https://nyc.cloud.appwrite.io/v1', APPWRITE_FUNCTION_PROJECT_ID:'test', CONTACT_RUNTIME_API_KEY:'test-only', CONTACT_RELAY_SECRET:'test-only-key-at-least-32-characters-long' };
describe('distributed inquiry rate limits',()=>{
  it('allows exactly three concurrent requests, case-normalized, across fresh callers',async()=>{
    const ids = new Set();
    const fetch = vi.fn(async(url,options)=>{
      const {rowId,data,permissions} = JSON.parse(options.body);
      expect(data).toEqual({}); expect(permissions).toEqual([]);
      expect(rowId).not.toContain('example');
      if(ids.has(rowId)) return new Response(null,{status:409});
      ids.add(rowId); return new Response(null,{status:201});
    });
    const results = await Promise.all(Array.from({length:8},(_,i)=>consumeEmailSlot(i%2?' USER@example.test ':'user@example.test',env,1000000,fetch)));
    expect(results.filter(Boolean)).toHaveLength(3);
    expect(await consumeEmailSlot('user@example.test',env,1900000,fetch)).toBe(true);
    expect(await consumeEmailSlot('other@example.test',env,1000000,fetch)).toBe(true);
  });
  it('fails closed on storage and credentials errors',async()=>{
    await expect(consumeEmailSlot('a@example.test',{},0,vi.fn())).rejects.toThrow();
    await expect(consumeEmailSlot('a@example.test',env,0,vi.fn(async()=>new Response(null,{status:503})))).rejects.toThrow();
  });
  it('deletes only rows selected by the expiry query',async()=>{
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({rows:[{$id:'expired'}]})).mockResolvedValueOnce(new Response(null,{status:204}));
    await purgeExpiredCounters(env,86400001,fetch);
    expect(decodeURIComponent(fetch.mock.calls[0][0])).toContain('$createdAt');
    expect(fetch.mock.calls[1][0]).toMatch(/\/expired$/);
    expect(fetch.mock.calls[1][1].method).toBe('DELETE');
  });
});
