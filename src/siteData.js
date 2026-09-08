export const siteNav = [
  {
    label: 'Solutions',
    children: [
      { label: 'Revenue Cycle Management', href: '/services/rcm/' },
      { label: 'Practice Operations & IT', href: '/services/practice-ops/' },
    ],
  },
  { label: 'DIRT Intelligence', href: '/technology/dirt/' },
  { label: 'About ROOT', href: '/company/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerGroups = [
  {
    title: 'Solutions',
    links: [
      { label: 'Revenue Cycle Management', href: '/services/rcm/' },
      { label: 'AR Recovery & Cleanup', href: '/services/rcm/#ar-recovery' },
      { label: 'Denial Management', href: '/services/rcm/#denials' },
      { label: 'Credentialing', href: '/services/rcm/#credentialing' },
      { label: 'Practice Operations', href: '/services/practice-ops/' },
    ],
  },
  {
    title: 'Technology & Company',
    links: [
      { label: 'DIRT Intelligence', href: '/technology/dirt/' },
      { label: 'Revenue Optimization Diagnostic', href: '/diagnostic/' },
      { label: 'About ROOT', href: '/company/about/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy/' },
      { label: 'Terms', href: '/legal/terms/' },
    ],
  },
];

export const rcmCapabilities = [
  ['Billing & Charge Capture', 'Build clean-claim discipline upstream so avoidable edits and rework do not become tomorrow’s A/R.'],
  ['Denial Management', 'Analyze CARC/RARC patterns, work recoverable denials, and feed root causes back into front-end workflows.'],
  ['A/R Recovery & Cleanup', 'Prioritize aging balances by value, recoverability, payer behavior, and next-best action.'],
  ['Payment Posting', 'Maintain accurate ERA and manual-payment posting with reconciliation controls and exception visibility.'],
  ['Credentialing & Enrollment', 'Coordinate provider enrollment, revalidation, payer follow-up, and status visibility.'],
  ['Patient Balances', 'Design clear, respectful workflows for patient responsibility, statements, follow-up, and escalation.'],
];

export const diagnosticDeliverables = [
  'Comprehensive A/R and aging analysis',
  'Denial and rejection root-cause review',
  'Workflow and payer assessment',
  'Prioritized revenue opportunity register',
  '90-day improvement roadmap',
  'Executive findings presentation',
];

export const brandAssets = {
  fallbackMark: '/brand/logos/root/root-fallback-mark.svg',
  fallbackWordmark: '/brand/logos/root/root-fallback-wordmark.svg',
  favicon: '/brand/favicon/favicon.svg',
  webManifest: '/brand/favicon/site.webmanifest',
  fallbackOg: 'https://rootrcm.com/brand/social/og-root-fallback.svg',
};

export const diagnosticFaq = [
  ['What data do you need?', 'We begin with deidentified operational and revenue-cycle exports such as aging, denial, rejection, and payment reports. If patient-level data becomes necessary, ROOT first establishes an approved secure channel and the required agreements.'],
  ['Do we have to sign a long-term RCM contract?', 'No. The Revenue Optimization Diagnostic is a standalone, fixed-fee engagement. Any managed-service recommendation is separate and optional.'],
  ['How long does the diagnostic take?', 'The target delivery window is within 14 days after the required, usable data set is received. Timing may change if source data is incomplete or requires remediation.'],
  ['How is sensitive data handled?', 'The public website does not accept PHI. Any later PHI-enabled workflow is activated only after the appropriate agreement, access controls, approved storage, and secure transfer process are in place.'],
];

export const routeMeta = {
  '/': {
    title: 'ROOT | Revenue Cycle Management & Practice Operations',
    description: 'ROOT is the RCM, operations, and technology partner for independent medical practices. Find revenue leakage and build scalable operations.',
    image: brandAssets.fallbackOg,
  },
  '/services/rcm': {
    title: 'Medical Billing & A/R Recovery Services | ROOT',
    description: 'Managed revenue cycle services for independent practices: billing, denial management, A/R recovery, credentialing, posting, and revenue intelligence.',
    image: brandAssets.fallbackOg,
  },
  '/services/practice-ops': {
    title: 'Practice Management Consulting & Automation | ROOT',
    description: 'Improve medical-practice workflows, reporting, technology, controls, and operating visibility with ROOT Practice Operations.',
    image: brandAssets.fallbackOg,
  },
  '/technology/dirt': {
    title: 'Revenue Cycle Analytics & Intelligence | DIRT by ROOT',
    description: 'DIRT is ROOT’s revenue-intelligence layer for leakage detection, denial analysis, payer patterns, workflow prioritization, and practice analytics.',
    image: brandAssets.fallbackOg,
  },
  '/diagnostic': {
    title: 'Revenue Cycle Assessment | ROOT Revenue Diagnostic',
    description: 'A fixed-fee Revenue Optimization Diagnostic for independent practices: A/R analysis, denial root causes, opportunity register, and a 90-day roadmap.',
    image: brandAssets.fallbackOg,
  },
  '/company/about': {
    title: 'About ROOT | RCM, Operations & Technology',
    description: 'ROOT combines healthcare operations, revenue-cycle execution, analytics, and technology for independent physician practices.',
    image: brandAssets.fallbackOg,
  },
  '/contact': {
    title: 'Contact ROOT | Revenue Cycle & Practice Operations',
    description: 'Talk with ROOT about revenue cycle management, A/R recovery, denial management, practice operations, credentialing, or analytics.',
    image: brandAssets.fallbackOg,
  },
};
