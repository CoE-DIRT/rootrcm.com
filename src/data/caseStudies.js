// Staging metadata only. No public route imports this registry yet.
// Assets remain in LOCAL-CONTROL until the source review gates are cleared.
export const caseStudies = [
  {
    slug: 'dirt-poc-01',
    series: 'DIRT Proof of Capability',
    number: 1,
    title: 'DIRT Revenue Intelligence',
    shortTitle: 'Revenue Intelligence',
    summary: 'Illustrative revenue intelligence methodology and financial review scenario.',
    proofLabel: 'Proof of Capability',
    carouselSrc: '/assets/case-studies/dirt-poc-01/carousel.html',
    cover: '/assets/case-studies/dirt-poc-01/previews/master-infographic.png',
    slides: [
      'slide-01-the-problem.png',
      'slide-02-the-dirt-method.png',
      'slide-03-the-financial-picture.png',
      'slide-04-kpi-to-root-cause.png',
      'slide-05-the-proof.png',
      'slide-06-from-proof-to-client-use.png',
    ].map((filename) => `/assets/case-studies/dirt-poc-01/previews/${filename}`),
    sourceType: 'illustrative-proof-of-concept',
    disclaimer: 'No PHI displayed. Financial opportunities require client-specific validation. No recovery outcome is guaranteed.',
    featured: false,
    cta: { label: 'Explore the $2,500 Revenue Optimization Diagnostic', href: '/diagnostic/' },
    seoTitle: '',
    seoDescription: '',
    publicReady: false,
    reviewRequired: ['Reconcile source financial totals.', 'Review and re-export source raster claims.'],
  },
];
