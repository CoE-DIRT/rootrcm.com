const STORAGE_KEY = 'root-conversion-experiments-v1';

const experiments = {
  homeHero: {
    id: 'home-hero-revenue-framing-v1',
    path: '/',
    variants: {
      a: {
        headline: 'Run the business side of medicine better.',
        lede: 'ROOT brings RCM, credentialing, practice operations, healthcare technology, automation, analytics, and DIRT intelligence into one partnership for independent medical practices.',
      },
      b: {
        headline: 'Find where your practice is losing revenue—and what to fix first.',
        lede: 'ROOT combines revenue-cycle execution, practice operations, credentialing, technology, and DIRT intelligence to turn revenue leakage into a prioritized operating plan.',
      },
    },
  },
  diagnosticHero: {
    id: 'diagnostic-hero-value-framing-v1',
    path: '/diagnostic',
    variants: {
      a: {
        headline: 'See where your revenue system is leaking.',
        lede: 'For a fixed fee of $2,500, ROOT analyzes A/R, denials, workflow, payer signals, credentialing visibility, and operating reporting, then turns the findings into a prioritized 90-day roadmap.',
      },
      b: {
        headline: 'Turn revenue leakage into a 90-day action plan.',
        lede: 'The fixed-fee $2,500 Revenue Optimization Diagnostic shows where A/R, denials, workflow, credentialing, payer signals, and reporting are costing control—and ranks what to address first.',
      },
    },
  },
};

function readAssignments() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAssignments(assignments) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch {
    // Experiment persistence must never block the public website.
  }
}

function normalizedPath(path) {
  if (!path || path === '/') return '/';
  return path.replace(/\/$/, '');
}

function overrideFor(key) {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get(`exp_${key}`);
  return value === 'a' || value === 'b' ? value : null;
}

function randomVariant() {
  if (import.meta.env.MODE === 'test') return 'a';
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0 ? 'a' : 'b';
  }
  return Math.random() < 0.5 ? 'a' : 'b';
}

export function getExperimentAssignment(key) {
  const experiment = experiments[key];
  if (!experiment) return null;
  const override = overrideFor(key);
  if (override) return override;

  const assignments = readAssignments();
  if (assignments[key] === 'a' || assignments[key] === 'b') return assignments[key];

  const variant = randomVariant();
  assignments[key] = variant;
  writeAssignments(assignments);
  return variant;
}

export function getExperimentContext(pathname) {
  const path = normalizedPath(pathname);
  const context = {};
  Object.entries(experiments).forEach(([key, experiment]) => {
    if (experiment.path !== path) return;
    const variant = getExperimentAssignment(key);
    context.experiment = experiment.id;
    context.experiment_variant = variant;
  });
  return context;
}

export function applyPageExperiment(pathname) {
  if (typeof document === 'undefined') return {};
  const path = normalizedPath(pathname);

  if (path === '/') {
    const variant = getExperimentAssignment('homeHero');
    const copy = experiments.homeHero.variants[variant];
    const hero = document.querySelector('.homeHero');
    const headline = hero?.querySelector('.heroCopy h1');
    const lede = hero?.querySelector('.heroCopy .lede');
    if (headline) headline.textContent = copy.headline;
    if (lede) lede.textContent = copy.lede;
    if (hero) {
      hero.dataset.experiment = experiments.homeHero.id;
      hero.dataset.variant = variant;
      hero.classList.toggle('experimentRevenueDirect', variant === 'b');
    }
    return { experiment: experiments.homeHero.id, experiment_variant: variant };
  }

  if (path === '/diagnostic') {
    const variant = getExperimentAssignment('diagnosticHero');
    const copy = experiments.diagnosticHero.variants[variant];
    const hero = document.querySelector('.diagnosticHero');
    const headline = hero?.querySelector('h1');
    const lede = hero?.querySelector('.lede');
    if (headline) headline.textContent = copy.headline;
    if (lede) lede.textContent = copy.lede;
    if (hero) {
      hero.dataset.experiment = experiments.diagnosticHero.id;
      hero.dataset.variant = variant;
      hero.classList.toggle('experimentRevenueDirect', variant === 'b');
    }
    return { experiment: experiments.diagnosticHero.id, experiment_variant: variant };
  }

  return {};
}

export function applyOperationalCopy(pathname) {
  if (typeof document === 'undefined' || normalizedPath(pathname) !== '/legal/privacy') return;
  const headings = Array.from(document.querySelectorAll('.legalPage h2'));
  const inquiryHeading = headings.find((heading) => heading.textContent.trim() === 'Public inquiry data');
  const paragraph = inquiryHeading?.nextElementSibling;
  if (paragraph) {
    paragraph.textContent = 'Information voluntarily provided for a commercial inquiry may include business contact information, practice name, provider count, operational concerns, and campaign attribution. Public form submissions are relayed to info@rootrcm.com through the current commercial form processor. Do not submit PHI or other sensitive patient information through this channel.';
  }
}

export function resetExperimentAssignments() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
}
