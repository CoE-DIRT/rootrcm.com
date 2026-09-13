// Proof of Capability registry.
// POC 01 remains PUBLICATION REVIEW REQUIRED — do not treat as a client success story.
const isDevelopment = import.meta.env?.DEV === true;
const stagingCaseStudies = isDevelopment ? [
  {
    slug: 'dirt-poc-01',
    series: 'DIRT Proof of Capability',
    number: 1,
    title: 'DIRT Revenue Intelligence',
    shortTitle: 'Revenue Intelligence',
    proofLabel: 'Proof of Capability',
    sourceType: 'Anonymized Proof of Concept',
    scenarioLabel: 'Representative Revenue Scenario',
    summary:
      'An anonymized proof of concept that shows how DIRT moves from raw revenue-cycle exports to validated signals, financial significance, and prioritized operating action.',
    executiveSummary:
      'This Proof of Capability walks through a representative revenue scenario: fragmented exports become validated signals, those signals become revenue intelligence, and that intelligence becomes a ranked action queue with owners and next steps. Figures remain illustrative pending source reconciliation.',
    problem:
      'Leadership often receives aging, denial, posting, and workflow exports that do not reconcile into a single decision. Teams work transactions while the highest-value leakage, preventable denial patterns, and ownership gaps stay buried.',
    analyticalApproach:
      'DIRT validates field lineage and recurring patterns, separates recoverability from noise, and organizes findings into financial significance with clear owners. The method emphasizes evidence over spectacle.',
    findings: [
      'Raw exports alone do not create management control.',
      'Validated signals expose concentration by payer, age, and preventability.',
      'Financial significance must connect to an owner and a next action.',
      'Prioritized queues outperform age-only worklists for operating focus.',
    ],
    methodology: [
      'Ingest deidentified aging, denial, posting, and workflow report families.',
      'Validate definitions, reconcile totals, and isolate recurring failure modes.',
      'Translate validated signals into revenue intelligence and ranked actions.',
      'Preserve no-PHI boundaries and require client-specific validation before any engagement claim.',
    ],
    disclaimer:
      'No PHI displayed. This is an anonymized proof of concept and representative revenue scenario, not a client success story. Financial opportunities require client-specific validation. No recovery outcome is guaranteed. Source financial totals and raster wording remain under publication review.',
    cover: '/assets/case-studies/dirt-poc-01/previews/master-infographic.png',
    slides: [
      {
        src: '/assets/case-studies/dirt-poc-01/previews/slide-01-the-problem.png',
        alt: 'The problem: fragmented revenue-cycle exports without a ranked operating decision',
        title: 'The Problem',
      },
      {
        src: '/assets/case-studies/dirt-poc-01/previews/slide-02-the-dirt-method.png',
        alt: 'The DIRT method from raw signals to prioritized action',
        title: 'The DIRT Method',
      },
      {
        src: '/assets/case-studies/dirt-poc-01/previews/slide-03-the-financial-picture.png',
        alt: 'Representative financial picture for an anonymized revenue scenario',
        title: 'The Financial Picture',
      },
      {
        src: '/assets/case-studies/dirt-poc-01/previews/slide-04-kpi-to-root-cause.png',
        alt: 'KPI signals traced to root-cause operating constraints',
        title: 'KPI to Root Cause',
      },
      {
        src: '/assets/case-studies/dirt-poc-01/previews/slide-05-the-proof.png',
        alt: 'Proof structure connecting evidence to management action',
        title: 'The Proof',
      },
      {
        src: '/assets/case-studies/dirt-poc-01/previews/slide-06-from-proof-to-client-use.png',
        alt: 'From proof of capability to client-specific Diagnostic use',
        title: 'From Proof to Use',
      },
    ],
    cta: {
      label: 'Explore the $2,500 Revenue Optimization Diagnostic',
      href: '/diagnostic/',
    },
    seoTitle: 'DIRT Revenue Intelligence | Proof of Capability | ROOT',
    seoDescription:
      'Anonymized proof of concept showing how DIRT turns revenue-cycle signals into prioritized management action. Publication review required.',
    featured: true,
    stagingVisible: true,
    publicReady: false,
    reviewRequired: [
      'Reconcile source financial totals before public claims.',
      'Review and re-export source raster wording.',
      'Do not strengthen financial claims until reconciliation clears.',
    ],
  },
] : [];

const allowStagingStudies = isDevelopment;
export const caseStudies = isDevelopment ? stagingCaseStudies : [];

export function getVisibleCaseStudies() {
  return caseStudies.filter((study) => study.publicReady === true || (allowStagingStudies && study.stagingVisible === true));
}

export function getCaseStudyBySlug(slug) {
  return getVisibleCaseStudies().find((study) => study.slug === slug) || null;
}
