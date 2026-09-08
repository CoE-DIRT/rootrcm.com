import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, '.cache', 'stock-assets');
const PROVENANCE_PATH = path.join(ROOT, 'docs', 'evidence', 'stock-asset-provenance.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const PROVIDERS = {
  pexels: {
    key: 'PEXELS_API_KEY',
    license: 'https://www.pexels.com/license/',
    apiDocs: 'https://www.pexels.com/api/documentation/',
    localDownload: true,
  },
  pixabay: {
    key: 'PIXABAY_API_KEY',
    license: 'https://pixabay.com/service/license-summary/',
    apiDocs: 'https://pixabay.com/api/docs/',
    localDownload: true,
  },
  unsplash: {
    key: 'UNSPLASH_ACCESS_KEY',
    license: 'https://unsplash.com/license',
    apiDocs: 'https://unsplash.com/documentation',
    localDownload: false,
    note: 'Discovery only here. Unsplash API guidelines require API image hotlinking and download tracking, so this pipeline does not check API-sourced Unsplash files into the repo.',
  },
};

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }
    const eq = token.indexOf('=');
    if (eq > -1) {
      args[token.slice(2, eq)] = token.slice(eq + 1);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function cleanEnvValue(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

async function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const text = await fs.readFile(path.join(ROOT, file), 'utf8');
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq < 1) continue;
        const key = line.slice(0, eq).trim();
        if (process.env[key] !== undefined) continue;
        process.env[key] = cleanEnvValue(line.slice(eq + 1));
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function orientationForPixabay(value) {
  if (value === 'portrait') return 'vertical';
  if (value === 'square') return 'all';
  return 'horizontal';
}

function clampLimit(value) {
  const parsed = Number.parseInt(value ?? '12', 10);
  if (!Number.isFinite(parsed)) return 12;
  return Math.max(1, Math.min(parsed, 40));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

async function searchPexels({ query, orientation, limit }) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return { skipped: 'PEXELS_API_KEY missing', results: [] };
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(limit));
  if (orientation && orientation !== 'square') url.searchParams.set('orientation', orientation);

  const payload = await requestJson(url, { headers: { Authorization: key } });
  return {
    results: (payload.photos ?? []).map((photo) => ({
      provider: 'pexels',
      providerId: String(photo.id),
      author: photo.photographer,
      authorUrl: photo.photographer_url,
      sourceUrl: photo.url,
      width: photo.width,
      height: photo.height,
      alt: photo.alt || '',
      previewUrl: photo.src?.medium || photo.src?.large,
      downloadUrl: photo.src?.large2x || photo.src?.original,
      licenseUrl: PROVIDERS.pexels.license,
    })),
  };
}

async function searchPixabay({ query, orientation, limit }) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return { skipped: 'PIXABAY_API_KEY missing', results: [] };
  const url = new URL('https://pixabay.com/api/');
  url.searchParams.set('key', key);
  url.searchParams.set('q', query);
  url.searchParams.set('image_type', 'photo');
  url.searchParams.set('orientation', orientationForPixabay(orientation));
  url.searchParams.set('safesearch', 'true');
  url.searchParams.set('per_page', String(Math.max(3, limit)));

  const payload = await requestJson(url);
  return {
    results: (payload.hits ?? []).slice(0, limit).map((photo) => ({
      provider: 'pixabay',
      providerId: String(photo.id),
      author: photo.user,
      authorUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
      sourceUrl: photo.pageURL,
      width: photo.imageWidth,
      height: photo.imageHeight,
      alt: photo.tags || '',
      previewUrl: photo.webformatURL,
      downloadUrl: photo.largeImageURL || photo.webformatURL,
      licenseUrl: PROVIDERS.pixabay.license,
    })),
  };
}

async function searchUnsplash({ query, orientation, limit }) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return { skipped: 'UNSPLASH_ACCESS_KEY missing', results: [] };
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(Math.min(limit, 30)));
  if (orientation) url.searchParams.set('orientation', orientation === 'square' ? 'squarish' : orientation);
  url.searchParams.set('client_id', key);

  const payload = await requestJson(url);
  return {
    results: (payload.results ?? []).map((photo) => ({
      provider: 'unsplash',
      providerId: photo.id,
      author: photo.user?.name,
      authorUrl: photo.user?.links?.html,
      sourceUrl: photo.links?.html,
      width: photo.width,
      height: photo.height,
      alt: photo.alt_description || photo.description || '',
      previewUrl: photo.urls?.small,
      hotlinkUrl: photo.urls?.regular,
      downloadLocation: photo.links?.download_location,
      downloadUrl: null,
      licenseUrl: PROVIDERS.unsplash.license,
      note: PROVIDERS.unsplash.note,
    })),
  };
}

function cacheKey({ provider, query, orientation, limit }) {
  return crypto.createHash('sha256').update(JSON.stringify({ provider, query, orientation, limit })).digest('hex').slice(0, 16);
}

async function readFreshCache(file) {
  try {
    const stat = await fs.stat(file);
    if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return null;
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function runSearch(args) {
  const query = String(args.query || '').trim();
  if (!query) throw new Error('Missing --query. Example: npm run assets:search -- --query="healthcare analytics dashboard"');

  const provider = String(args.provider || 'all').toLowerCase();
  const orientation = String(args.orientation || 'landscape').toLowerCase();
  const limit = clampLimit(args.limit);
  const key = cacheKey({ provider, query, orientation, limit });
  const cacheFile = path.join(CACHE_DIR, `search-${key}.json`);
  const latestFile = path.join(CACHE_DIR, 'latest.json');
  const cached = await readFreshCache(cacheFile);
  if (cached) {
    await writeJson(latestFile, cached);
    printSearch(cached, cacheFile, true);
    return;
  }

  const requested = provider === 'all' ? ['pexels', 'pixabay'] : [provider];
  for (const name of requested) {
    if (!PROVIDERS[name]) throw new Error(`Unknown provider: ${name}`);
  }

  const providerResults = [];
  for (const name of requested) {
    let result;
    if (name === 'pexels') result = await searchPexels({ query, orientation, limit });
    else if (name === 'pixabay') result = await searchPixabay({ query, orientation, limit });
    else if (name === 'unsplash') result = await searchUnsplash({ query, orientation, limit });
    providerResults.push({ provider: name, ...result });
  }

  const results = providerResults.flatMap((entry) => entry.results).filter((item) => item.width >= 1200);
  const output = {
    generatedAt: new Date().toISOString(),
    query,
    orientation,
    requestedProvider: provider,
    providers: providerResults.map(({ provider: name, skipped }) => ({ provider: name, skipped: skipped || null })),
    results,
  };
  await writeJson(cacheFile, output);
  await writeJson(latestFile, output);
  printSearch(output, cacheFile, false);
}

function printSearch(output, file, fromCache) {
  console.log(`\nStock search: ${output.query}`);
  console.log(`Results: ${output.results.length}${fromCache ? ' (24h cache)' : ''}`);
  console.log(`Saved: ${path.relative(ROOT, file)}`);
  for (const [index, item] of output.results.entries()) {
    console.log(`\n[${index}] ${item.provider.toUpperCase()} ${item.width}x${item.height}`);
    console.log(`    by ${item.author || 'Unknown'} | ${item.sourceUrl}`);
    console.log(`    ${item.alt || '(no description)'}`);
    console.log(`    preview: ${item.previewUrl || item.hotlinkUrl || '(none)'}`);
  }
  console.log('\nDownload one approved Pexels/Pixabay candidate with:');
  console.log('npm run assets:fetch -- --index=0 --slug=root-hero-revenue-operations --dest=public/brand/graphics');
}

function extensionFor(contentType, url) {
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return '.jpg';
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
}

async function readProvenance() {
  try {
    return JSON.parse(await fs.readFile(PROVENANCE_PATH, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 1, assets: [] };
    throw error;
  }
}

async function runFetch(args) {
  const searchFile = path.resolve(ROOT, String(args.file || path.join('.cache', 'stock-assets', 'latest.json')));
  const payload = JSON.parse(await fs.readFile(searchFile, 'utf8'));
  const index = Number.parseInt(String(args.index ?? ''), 10);
  if (!Number.isInteger(index) || index < 0 || index >= payload.results.length) {
    throw new Error(`Invalid --index. Choose 0-${Math.max(0, payload.results.length - 1)} from ${path.relative(ROOT, searchFile)}.`);
  }
  const item = payload.results[index];
  if (!PROVIDERS[item.provider]?.localDownload || !item.downloadUrl) {
    throw new Error(`${item.provider} is discovery-only in this pipeline. Use Pexels or Pixabay for local checked-in assets.`);
  }

  const slug = slugify(String(args.slug || `${item.provider}-${item.providerId}`));
  if (!slug) throw new Error('Provide a usable --slug.');
  const destDir = path.resolve(ROOT, String(args.dest || 'public/brand/graphics'));
  if (!destDir.startsWith(ROOT)) throw new Error('Destination must stay inside the repository.');

  const response = await fetch(item.downloadUrl);
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = extensionFor(response.headers.get('content-type'), item.downloadUrl);
  const outFile = path.join(destDir, `${slug}${ext}`);
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(outFile, buffer);

  const provenance = await readProvenance();
  provenance.assets = provenance.assets.filter((asset) => asset.localPath !== path.relative(ROOT, outFile).replaceAll('\\', '/'));
  provenance.assets.push({
    localPath: path.relative(ROOT, outFile).replaceAll('\\', '/'),
    status: 'downloaded-candidate-needs-creative-review',
    provider: item.provider,
    providerId: item.providerId,
    photographer: item.author || null,
    photographerUrl: item.authorUrl || null,
    sourceUrl: item.sourceUrl,
    licenseUrl: item.licenseUrl,
    searchQuery: payload.query,
    downloadedAt: new Date().toISOString(),
    originalWidth: item.width,
    originalHeight: item.height,
    altSource: item.alt || null,
  });
  await writeJson(PROVENANCE_PATH, provenance);

  console.log(`Downloaded: ${path.relative(ROOT, outFile)}`);
  console.log(`Provenance: ${path.relative(ROOT, PROVENANCE_PATH)}`);
  console.log('Next: visually review composition, people/brand/trademark risk, relevance, crop, and page placement before publishing.');
}

function runProviders() {
  console.log('\nROOT build-time stock providers\n');
  for (const [name, config] of Object.entries(PROVIDERS)) {
    const configured = Boolean(process.env[config.key]);
    console.log(`${configured ? 'READY' : 'MISSING'}  ${name.padEnd(10)} ${config.key}`);
    console.log(`         local download: ${config.localDownload ? 'yes' : 'no'}`);
    if (config.note) console.log(`         ${config.note}`);
  }
}

async function main() {
  await loadLocalEnv();
  const [command = 'providers', ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  if (command === 'search') await runSearch(args);
  else if (command === 'fetch') await runFetch(args);
  else if (command === 'providers') runProviders();
  else throw new Error(`Unknown command: ${command}. Use search, fetch, or providers.`);
}

main().catch((error) => {
  console.error(`\nAsset pipeline error: ${error.message}`);
  process.exitCode = 1;
});
