export const brandAssets = {
  mark: '/brand/logos/root/root-mark.png',
  horizontalLockup: '/brand/logos/root/root-lockup-horizontal-white.png',
  stackedLockup: '/brand/logos/root/root-lockup-stacked.png',
  favicon: '/brand/favicon/favicon-32.png',
  appleTouchIcon: '/brand/favicon/apple-touch-icon.png',
  webManifest: '/brand/favicon/site.webmanifest',
  og: 'https://rootrcm.com/brand/social/og-root.png',
};

export const mediaAssets = {
  homePracticeOperations: '/media/images/home-practice-operations.jpg',
  practiceOperations: '/media/images/practice-operations-workstation.jpg',
  practiceAdmin: '/media/images/practice-admin-workstation.jpg',
  practiceTeamCollaboration: '/media/images/practice-team-collaboration.jpg',
  physicianNurseCoordination: '/media/images/physician-nurse-coordination.jpg',
  practiceConsultation: '/media/images/practice-consultation-context.jpg',
  operationsPlanning: '/media/images/operations-planning-workshop.jpg',
  credentialing: '/media/images/credentialing-payer-documentation.jpg',
  claimsAr: '/media/images/claims-ar-administration.jpg',
  healthcareIt: '/media/images/healthcare-it-workstation.jpg',
  dirtAnalytics: '/media/images/dirt-analytics-illustrative.jpg',
  operationsCollaboration: '/media/images/healthcare-operations-collaboration.jpg',
  consulting: '/media/images/management-consulting-workshop.jpg',
  workflowAutomation: '/media/images/workflow-automation-collaboration.jpg',
};

export const serviceMediaBySlug = {
  'ar-recovery': { src: mediaAssets.claimsAr, alt: 'Administrative paperwork and desk tools used as an editorial stand-in for A/R work queues', caption: 'Editorial reference — not claim software' },
  'denial-management': { src: mediaAssets.practiceAdmin, alt: 'Practice administrator working at a desk workstation', caption: 'Editorial practice operations context' },
  'patient-balances': null,
  credentialing: { src: mediaAssets.credentialing, alt: 'Payer credentialing documentation and workflow materials' },
  'practice-ops': { src: mediaAssets.practiceOperations, alt: 'Practice operations workstation for scheduling and front-office workflows' },
  'healthcare-it': { src: mediaAssets.healthcareIt, alt: 'Healthcare-themed desk and laptop workstation' },
  'workflow-automation': { src: mediaAssets.workflowAutomation, alt: 'Healthcare operations collaboration around workflow automation' },
  'reporting-analytics': { src: mediaAssets.dirtAnalytics, alt: 'Illustrative analytics imagery for revenue and operations reporting', caption: 'Illustrative analytics imagery — not a DIRT product screen' },
  'operational-consulting': { src: mediaAssets.consulting, alt: 'Operational assessment workshop in a healthcare business setting' },
  rcm: { src: mediaAssets.physicianNurseCoordination, alt: 'Physician and nurse coordinating in a clinical hallway. Editorial stock; not ROOT staff.', caption: 'Editorial clinical operations context' },
  'medical-billing': { src: mediaAssets.practiceConsultation, alt: 'Practice consultation context photograph. Editorial stock; not ROOT staff or customers.', caption: 'Editorial practice context' },
  'payment-posting': null,
};

export const solutionMediaBySlug = {
  'aging-ar': { src: mediaAssets.claimsAr, alt: 'Administrative paperwork used as an editorial stand-in for aging A/R review', caption: 'Editorial reference — not claim software' },
  denials: { src: mediaAssets.practiceAdmin, alt: 'Practice administrator working at a desk workstation', caption: 'Editorial practice operations context' },
  'credentialing-bottlenecks': { src: mediaAssets.credentialing, alt: 'Payer credentialing documentation and workflow materials' },
  'operational-efficiency': { src: mediaAssets.practiceOperations, alt: 'Practice operations workstation for scheduling and front-office workflows' },
  'reporting-visibility': { src: mediaAssets.dirtAnalytics, alt: 'Illustrative analytics imagery for revenue and operations reporting', caption: 'Illustrative analytics imagery — not a DIRT product screen' },
  'scaling-practice-ops': { src: mediaAssets.operationsCollaboration, alt: 'Healthcare operations collaboration around practice growth and coordination' },
  'revenue-leakage': { src: mediaAssets.practiceTeamCollaboration, alt: 'Healthcare professionals coordinating in a practice setting. Editorial stock; not ROOT staff.', caption: 'Editorial practice operations context' },
};

export const companyInfo = {
  legalName: 'ROOT Revenue Operations & Outcomes Technology Incorporated',
  addressLines: ['2803 Philadelphia Pike', 'Suite B #1864', 'Claymont, DE 19703'],
  phone: '+1 (302) 506 4685',
  phoneHref: 'tel:+13025064685',
  email: 'info@rootrcm.com',
  emailHref: 'mailto:info@rootrcm.com',
  whatsappHref: 'https://wa.me/13025064685?text=Hello%20ROOT%20Revenue%20Operations%20%26%20Outcomes%20Technology%20Incorporated%2C%20I%20would%20like%20to%20discuss%20a%20deidentified%20practice%20operations%20or%20revenue%20cycle%20need.',
};

export const outreachChannels = [
  { label: 'WhatsApp', href: companyInfo.whatsappHref, status: 'Live', cta: 'whatsapp-instant-chat', engagementType: 'instant-chat' },
  { label: 'Call', href: companyInfo.phoneHref, status: 'Live', cta: 'phone-call', engagementType: 'phone' },
  { label: 'Email', href: companyInfo.emailHref, status: 'Live', cta: 'email-root', engagementType: 'email' },
  { label: 'LinkedIn', status: 'Coming soon', cta: 'linkedin-coming-soon', engagementType: 'social' },
  { label: 'Facebook', status: 'Coming soon', cta: 'facebook-coming-soon', engagementType: 'social' },
  { label: 'Instagram', status: 'Coming soon', cta: 'instagram-coming-soon', engagementType: 'social' },
  { label: 'X', status: 'Coming soon', cta: 'x-coming-soon', engagementType: 'social' },
  { label: 'YouTube', status: 'Coming soon', cta: 'youtube-coming-soon', engagementType: 'social' },
  { label: 'Google Business', status: 'Coming soon', cta: 'google-business-coming-soon', engagementType: 'local-profile' },
  { label: 'Calendly', status: 'Coming soon', cta: 'calendly-coming-soon', engagementType: 'scheduling' },
];

export const socialProfiles = [
  { label: 'Facebook', href: null, message: 'Facebook profile coming soon.' },
  { label: 'Instagram', href: null, message: 'Instagram profile coming soon.' },
  { label: 'X', href: null, message: 'X profile coming soon.' },
  { label: 'Google Business Profile', href: null, message: 'Google Business Profile coming soon.' },
];

export const complianceStandards = [
  {
    label: 'ISO 9001 quality management',
    posture: 'Documented processes, quality objectives, review cadence, customer feedback, corrective action, and continual improvement readiness.',
  },
  {
    label: 'ISO/IEC 27001 information security',
    posture: 'Risk-based ISMS planning, access governance, asset handling, security responsibility, incident readiness, and evidence discipline.',
  },
  {
    label: 'ISO/IEC 27701 privacy management',
    posture: 'PII accountability, privacy-by-design, processor/controller role clarity, retention thinking, and privacy evidence readiness.',
  },
  {
    label: 'ISO/IEC 27018 cloud PII controls',
    posture: 'Cloud-provider evaluation, transparency, auditability, outsourced processing controls, and PII protection expectations.',
  },
  {
    label: 'ISO/IEC 42001 AI governance',
    posture: 'Governed automation and AI-assisted workflows with risk review, transparency, traceability, human oversight, and change control.',
  },
  {
    label: 'HIPAA Security Rule readiness',
    posture: 'Administrative, physical, and technical safeguards planning for future PHI-enabled workflows after required agreements and secure channels.',
  },
];

export const platformNodes = [
  { label: 'Revenue Operations', copy: 'Billing, charge capture, posting, A/R recovery, denial management, payer follow-up, and revenue controls.' },
  { label: 'Credentialing', copy: 'Enrollment, revalidation, payer status, provider rosters, and the operational discipline around participation.' },
  { label: 'Practice Operations', copy: 'Workflow, staffing rhythms, handoffs, escalation, reporting cadence, and leadership visibility.' },
  { label: 'Technology', copy: 'EHR/PM workflow alignment, healthcare IT support, integration planning, automation, and practical tooling.' },
  { label: 'Automation', copy: 'Repeatable administrative work converted into monitored workflows where automation is safe and useful.' },
  { label: 'Analytics', copy: 'Operational and revenue-cycle signals translated into prioritization, accountability, and decision-grade reporting.' },
  { label: 'DIRT Intelligence', copy: 'The Data Intelligence for Revenue Transformation layer that helps ROOT find leakage and prioritize action.' },
];

export const solutionPages = [
  {
    slug: 'revenue-leakage',
    title: 'Revenue Leakage',
    summary: 'Find where earned revenue disappears across front-end workflow, payer behavior, denials, underpayments, and aging balances.',
    problem: 'Revenue leakage often hides as ordinary backlog: unresolved edits, small recurring denials, payer variance, delayed credentialing, weak follow-up, and reports no one trusts.',
    rootResponse: 'ROOT combines revenue-cycle execution, workflow redesign, DIRT analysis, and leadership reporting so leakage becomes a prioritized operating plan.',
    services: ['Medical billing', 'A/R recovery', 'Denial management', 'Reporting analytics', 'Operational consulting'],
    dirt: 'DIRT segments opportunities by value, age, payer, recurrence, and recoverability so the team works the highest-impact constraint first.',
    cta: 'Find revenue leakage',
  },
  {
    slug: 'aging-ar',
    title: 'Aging A/R',
    summary: 'Turn a growing aging report into a recoverability map, ownership rhythm, and weekly cash action plan.',
    problem: 'Older A/R grows when claims are worked oldest-first without enough payer segmentation, escalation standards, documentation, or ownership.',
    rootResponse: 'ROOT cleans up backlog, builds follow-up logic, tightens reporting, and creates an operating cadence that keeps aging from rebuilding.',
    services: ['A/R recovery', 'Payment posting', 'Patient balances', 'Reporting analytics'],
    dirt: 'DIRT separates collectible, doubtful, payer-stalled, patient-responsibility, and workflow-generated balances to guide work sequencing.',
    cta: 'Prioritize A/R recovery',
  },
  {
    slug: 'denials',
    title: 'Denials',
    summary: 'Move from denial counts to root causes, preventable patterns, and financially prioritized recovery.',
    problem: 'Denials become expensive when the team only works transactions and the upstream workflow keeps creating the same failure.',
    rootResponse: 'ROOT works recoverable denials, traces patterns to cause, and helps practices correct the operational source of recurring denials.',
    services: ['Denial management', 'Medical billing', 'Workflow automation', 'Operational consulting'],
    dirt: 'DIRT groups denial signals by payer, code family, reason, recurrence, preventability, and value at risk.',
    cta: 'Reduce denial drag',
  },
  {
    slug: 'credentialing-bottlenecks',
    title: 'Credentialing Bottlenecks',
    summary: 'Create visibility and follow-through across provider enrollment, revalidation, payer status, and roster maintenance.',
    problem: 'Credentialing issues can quietly delay revenue, disrupt growth, and create payer participation ambiguity across locations or providers.',
    rootResponse: 'ROOT brings process ownership, payer follow-up, status tracking, roster discipline, and escalation routines into one managed workflow.',
    services: ['Credentialing', 'Operational consulting', 'Healthcare IT', 'Reporting analytics'],
    dirt: 'DIRT connects enrollment status and revenue signals so leaders can see which bottlenecks are commercially material.',
    cta: 'Fix credentialing visibility',
  },
  {
    slug: 'operational-efficiency',
    title: 'Operational Efficiency',
    summary: 'Reduce administrative drag by aligning workflows, technology, accountability, and automation around the work that matters.',
    problem: 'Many practices are not understaffed as much as they are under-systemized: handoffs are unclear, reports disagree, and exceptions are invisible.',
    rootResponse: 'ROOT maps the workflow, redesigns ownership, adds controls, and automates repetitive work where it can be measured and monitored.',
    services: ['Practice operations', 'Workflow automation', 'Healthcare IT', 'Operational consulting'],
    dirt: 'DIRT highlights where revenue and operating signals suggest workflow friction, queue imbalance, or preventable rework.',
    cta: 'Improve practice operations',
  },
  {
    slug: 'reporting-visibility',
    title: 'Reporting Visibility',
    summary: 'Replace scattered spreadsheets with a leadership view of revenue, operations, payer behavior, and action ownership.',
    problem: 'Practices cannot manage what they cannot see. Disconnected reports make it hard to understand constraint, priority, and progress.',
    rootResponse: 'ROOT builds practical reporting architecture, KPI rhythm, and leadership review structures connected to operating action.',
    services: ['Reporting analytics', 'DIRT intelligence', 'Healthcare IT', 'Operational consulting'],
    dirt: 'DIRT translates raw exports into segmented intelligence views for leakage, aging, denials, payer behavior, and recovery priority.',
    cta: 'Build operating visibility',
  },
  {
    slug: 'scaling-practice-ops',
    title: 'Scaling Practice Operations',
    summary: 'Give growing practices the operating system needed to add providers, locations, services, and revenue without chaos.',
    problem: 'Growth exposes weak process. Founder-level oversight, manual tracking, and informal escalation do not scale cleanly.',
    rootResponse: 'ROOT provides management systems, recurring review rhythm, workflow design, technology alignment, and revenue-cycle accountability.',
    services: ['Practice operations', 'Credentialing', 'Healthcare IT', 'Workflow automation', 'Full MSO support'],
    dirt: 'DIRT helps leadership see where growth is creating revenue friction before backlog becomes the first warning sign.',
    cta: 'Scale with control',
  },
];

export const servicePages = [
  {
    slug: 'rcm',
    family: 'Revenue Operations',
    title: 'Revenue Cycle Management',
    summary: 'Accountable revenue-cycle execution across billing, posting, denials, A/R, reporting, and operating controls.',
    buyer: 'Independent practices that need a partner to run and improve the revenue engine.',
    deliverables: ['Charge and claim workflow review', 'Denial and rejection management', 'A/R follow-up and recovery', 'Payment posting controls', 'Leadership reporting cadence'],
    engagement: 'Managed monthly service, often preceded by the Diagnostic.',
    pricing: 'Onboarding from $1,500; approximately 5% of collections where appropriate. Final pricing depends on specialty, volume, payer mix, systems, and operating scope.',
    dirt: 'DIRT supports queue prioritization, payer-pattern visibility, and root-cause analysis.',
    related: '/solutions/revenue-leakage/',
  },
  {
    slug: 'medical-billing',
    family: 'Revenue Operations',
    title: 'Medical Billing',
    summary: 'Clean-claim workflow, billing discipline, claim submission, rework reduction, and revenue-cycle ownership.',
    buyer: 'Practices that want billing handled with operational context rather than transactional processing alone.',
    deliverables: ['Billing workflow review', 'Claim submission support', 'Rejection cleanup', 'Payer follow-up standards', 'Issue escalation register'],
    engagement: 'Managed monthly service or project-based cleanup.',
    pricing: 'Custom by specialty, volume, and required ownership.',
    dirt: 'DIRT helps identify billing patterns that create downstream denials or aging.',
    related: '/solutions/denials/',
  },
  {
    slug: 'ar-recovery',
    family: 'Revenue Operations',
    title: 'A/R Recovery',
    summary: 'Focused recovery work for aging balances, payer follow-up, priority segmentation, and cleanup campaigns.',
    buyer: 'Practices carrying aging balances that need financial triage and disciplined follow-through.',
    deliverables: ['Aging segmentation', 'Recoverability prioritization', 'Payer follow-up plan', 'Escalation workflow', 'Weekly recovery reporting'],
    engagement: 'Diagnostic, project campaign, or managed monthly recovery program.',
    pricing: 'Project or managed model based on backlog size and complexity.',
    dirt: 'DIRT ranks A/R by value, age, payer, status, and recoverability signals.',
    related: '/solutions/aging-ar/',
  },
  {
    slug: 'denial-management',
    family: 'Revenue Operations',
    title: 'Denial Management',
    summary: 'Recover denials, identify preventable patterns, and feed root causes back into front-end workflows.',
    buyer: 'Practices with repeat denials, unclear denial ownership, or unreliable denial reporting.',
    deliverables: ['Denial inventory review', 'Reason-code patterning', 'Recovery workflow', 'Preventability review', 'Root-cause recommendations'],
    engagement: 'Diagnostic, cleanup project, or ongoing managed service.',
    pricing: 'Custom by denial volume, payer mix, and rework scope.',
    dirt: 'DIRT groups denial families and value-at-risk to focus the right operational response.',
    related: '/solutions/denials/',
  },
  {
    slug: 'payment-posting',
    family: 'Revenue Operations',
    title: 'Payment Posting',
    summary: 'ERA and manual posting support with reconciliation controls, exception handling, and cash visibility.',
    buyer: 'Practices that need posting accuracy, faster reconciliation, and cleaner downstream reporting.',
    deliverables: ['ERA workflow review', 'Manual posting support', 'Exception tracking', 'Reconciliation controls', 'Posting-status reporting'],
    engagement: 'Managed monthly service or targeted process repair.',
    pricing: 'Custom by volume, payer mix, and system workflow.',
    dirt: 'DIRT can surface posting exceptions that distort aging, denial, or collection views.',
    related: '/solutions/reporting-visibility/',
  },
  {
    slug: 'patient-balances',
    family: 'Revenue Operations',
    title: 'Patient Balances',
    summary: 'Clear, respectful workflows for patient responsibility, statements, follow-up, and escalation logic.',
    buyer: 'Practices that need patient balances handled with transparency, consistency, and practical guardrails.',
    deliverables: ['Patient-balance workflow review', 'Statement and follow-up cadence', 'Exception handling', 'Escalation standards', 'Balance reporting'],
    engagement: 'Managed service or operational project.',
    pricing: 'Custom by scope and system requirements.',
    dirt: 'DIRT separates patient-responsibility balances from payer-side backlog so leadership sees the right constraint.',
    related: '/solutions/aging-ar/',
  },
  {
    slug: 'credentialing',
    family: 'Practice Operations',
    title: 'Credentialing',
    summary: 'Provider enrollment, revalidation, payer follow-up, roster visibility, and credentialing operations.',
    buyer: 'Practices adding providers, opening locations, repairing payer status, or trying to reduce enrollment ambiguity.',
    deliverables: ['Provider enrollment support', 'Revalidation tracking', 'Payer follow-up cadence', 'Roster maintenance', 'Status dashboard'],
    engagement: 'Initial provider setup plus optional monthly maintenance.',
    pricing: '$750-$1,500 per provider initial setup; $150-$300 per provider/month maintenance when scoped.',
    dirt: 'DIRT connects status and revenue signals to show where credentialing delays are commercially material.',
    related: '/solutions/credentialing-bottlenecks/',
  },
  {
    slug: 'practice-ops',
    family: 'Practice Operations',
    title: 'Practice Operations',
    summary: 'Workflow design, operating cadence, KPI rhythm, controls, staffing visibility, and practice-management support.',
    buyer: 'Independent practices that need scalable operational structure without building a large internal admin layer.',
    deliverables: ['Workflow mapping', 'Ownership model', 'Leadership KPI cadence', 'Escalation paths', 'Operating controls'],
    engagement: 'Project, advisory, or managed operating support.',
    pricing: 'Custom by scope, complexity, and required operating ownership.',
    dirt: 'DIRT highlights where operational friction is affecting revenue, cash timing, or team workload.',
    related: '/solutions/operational-efficiency/',
  },
  {
    slug: 'healthcare-it',
    family: 'Technology',
    title: 'Healthcare IT',
    summary: 'Practical EHR/PM workflow alignment, support planning, integration thinking, permissions, and tool governance.',
    buyer: 'Practices whose technology stack is making operations harder instead of clearer.',
    deliverables: ['System workflow review', 'Permissions and access review', 'Integration planning', 'Support model recommendations', 'Technology operating map'],
    engagement: 'Project, advisory, or managed support coordination.',
    pricing: 'Custom by system footprint and operating scope.',
    dirt: 'DIRT depends on reliable source data, so healthcare IT work improves the quality of downstream intelligence.',
    related: '/solutions/reporting-visibility/',
  },
  {
    slug: 'workflow-automation',
    family: 'Technology',
    title: 'Workflow Automation',
    summary: 'Automate repetitive administrative work where the process is stable, monitored, secure, and commercially useful.',
    buyer: 'Practices with repetitive queues, manual status tracking, spreadsheet workarounds, or avoidable rework.',
    deliverables: ['Automation opportunity review', 'Workflow design', 'Control points', 'Pilot automation', 'Monitoring plan'],
    engagement: 'Project-based build or managed automation program.',
    pricing: '$5,000-$25,000 for scoped projects when requirements are defined.',
    dirt: 'DIRT can supply the prioritization logic for which queues or exceptions should be worked first.',
    related: '/solutions/operational-efficiency/',
  },
  {
    slug: 'reporting-analytics',
    family: 'Technology',
    title: 'Reporting & Analytics',
    summary: 'Revenue-cycle and operations reporting that leadership can use to decide, prioritize, and hold work accountable.',
    buyer: 'Practices that have data exports but lack a reliable operating view.',
    deliverables: ['KPI definition', 'Source-data review', 'Dashboard design', 'Operating cadence', 'Decision register'],
    engagement: 'Diagnostic, project, or monthly intelligence layer.',
    pricing: '$1,500-$2,500/month for DIRT/Data Intelligence when scoped as an ongoing layer.',
    dirt: 'DIRT is the analytics engine behind leakage detection, denial intelligence, A/R priority, and PracticeOps signals.',
    related: '/solutions/reporting-visibility/',
  },
  {
    slug: 'operational-consulting',
    family: 'Practice Operations',
    title: 'Operational Consulting',
    summary: 'Focused advisory and implementation support for practices that need structure, accountability, and execution.',
    buyer: 'Leadership teams that know something is off but need an outside operator to diagnose and implement the fix.',
    deliverables: ['Operating assessment', '90-day roadmap', 'Workflow redesign', 'Team cadence', 'Implementation support'],
    engagement: 'Diagnostic, fixed-scope project, or broader MSO partnership.',
    pricing: 'Custom by scope; projects commonly start once the Diagnostic defines the opportunity.',
    dirt: 'DIRT gives consulting work a stronger evidence base and a clearer action sequence.',
    related: '/solutions/scaling-practice-ops/',
  },
];

export const pricingModels = [
  { name: 'Revenue Optimization Diagnostic', price: '$2,500 fixed fee', bestFor: 'Practices that want evidence before changing vendors, systems, staffing, or operating model.', includes: ['A/R and denial review', 'Revenue opportunity register', 'Workflow and reporting assessment', '90-day roadmap'], cta: 'Book Diagnostic', href: '/diagnostic/' },
  { name: 'Managed RCM', price: 'Onboarding from $1,500; approximately 5% of collections where appropriate', bestFor: 'Practices that need ROOT to own revenue-cycle execution and continuous improvement.', includes: ['Billing and follow-up', 'Denial management', 'A/R recovery', 'Leadership reporting'], cta: 'Talk to ROOT', href: '/contact/' },
  { name: 'DIRT / Data Intelligence', price: '$1,500-$2,500/month', bestFor: 'Practices that need revenue-cycle and operations intelligence without buying another static dashboard.', includes: ['Leakage analysis', 'Denial intelligence', 'A/R prioritization', 'PracticeOps signals'], cta: 'Explore DIRT', href: '/technology/dirt/' },
  { name: 'Projects & Automation', price: '$5,000-$25,000 scoped projects', bestFor: 'Specific cleanup, automation, reporting, technology, or operating-system improvement needs.', includes: ['Defined scope', 'Implementation roadmap', 'Workflow controls', 'Measured handoff'], cta: 'Discuss Project', href: '/contact/' },
  { name: 'Credentialing', price: '$750-$1,500/provider initial; $150-$300/provider/month maintenance', bestFor: 'Provider enrollment, revalidation, roster maintenance, and payer-status visibility.', includes: ['Enrollment support', 'Payer follow-up', 'Status tracking', 'Maintenance cadence'], cta: 'Review Credentialing', href: '/services/credentialing/' },
  { name: 'Full MSO Partnership', price: 'Custom', bestFor: 'Practices that want one operating partner across revenue, operations, technology, analytics, and growth support.', includes: ['Revenue operations', 'Practice operations', 'Technology', 'DIRT intelligence'], cta: 'Talk to ROOT', href: '/contact/' },
];

export const resourceArticles = [
  {
    slug: 'revenue-leakage-guide',
    title: 'Revenue Leakage Guide for Independent Practices',
    summary: 'How to think about leakage across claim quality, payer behavior, aging, denials, credentialing, and reporting.',
    sections: [
      ['Leakage is a system problem', 'Most leakage is not one dramatic miss. It is the accumulation of avoidable rework, weak visibility, ambiguous ownership, and delayed escalation.'],
      ['What to review first', 'Start with aging by payer and age, denial families, rejection patterns, credentialing status, charge lag, posting exceptions, and the reports leadership actually uses.'],
      ['What good looks like', 'A useful leakage review ends with a ranked opportunity register, owners, timelines, and a decision cadence that keeps the work moving.'],
    ],
    sources: [['AMA revenue cycle management resources', 'https://www.ama-assn.org/practice-management/sustainability/revenue-cycle-management'], ['CMS Medicare Remit Easy Print', 'https://www.cms.gov/medicare/medicare-general-information/bni/mrep']],
  },
  {
    slug: 'aging-ar-playbook',
    title: 'Aging A/R Recovery Playbook',
    summary: 'A practical way to segment aging balances and build a weekly recovery rhythm.',
    sections: [
      ['Segment before action', 'Oldest-first work can miss recoverable value. Segment by payer, age, balance size, status, denial relationship, patient responsibility, and missing information.'],
      ['Create ownership', 'Every priority segment needs an owner, next action, escalation trigger, and review date. Without that, aging reports become historical records instead of operating tools.'],
      ['Prevent rebuild', 'Backlog cleanup is incomplete unless the practice also fixes the workflow that produced the backlog.'],
    ],
    sources: [['HFMA revenue cycle content', 'https://www.hfma.org/revenue-cycle/'], ['CMS Medicare Billing resources', 'https://www.cms.gov/medicare/billing']],
  },
  {
    slug: 'denial-management-root-cause',
    title: 'Denial Management Root-Cause Guide',
    summary: 'How to move denial work from transaction cleanup to prevention and operating improvement.',
    sections: [
      ['Reason codes are only the start', 'CARC and RARC information can help categorize denials, but the operational question is why the same pattern keeps recurring.'],
      ['Separate recoverable from preventable', 'Recovery work and prevention work are different jobs. Strong denial operations do both and keep leadership aware of the tradeoffs.'],
      ['Close the loop upstream', 'Eligibility, authorization, documentation, coding, credentialing, and payer-specific workflows all need feedback from denial patterns.'],
    ],
    sources: [['X12 Claim Adjustment Reason Codes', 'https://x12.org/codes/claim-adjustment-reason-codes'], ['X12 Remittance Advice Remark Codes', 'https://x12.org/codes/remittance-advice-remark-codes']],
  },
  {
    slug: 'credentialing-operations-checklist',
    title: 'Credentialing Operations Checklist',
    summary: 'A leadership checklist for enrollment visibility, payer follow-up, roster maintenance, and growth readiness.',
    sections: [
      ['Credentialing needs operations', 'Enrollment is not only paperwork. It requires status visibility, payer follow-up, ownership, deadlines, and escalation.'],
      ['Keep a living roster', 'A maintained provider and payer roster helps leadership understand participation status, revalidation exposure, and revenue timing risk.'],
      ['Connect to growth', 'Adding providers or locations without credentialing visibility can create revenue delays that are only obvious after services are already delivered.'],
    ],
    sources: [['CAQH ProView resources', 'https://www.caqh.org/solutions/caqh-proview'], ['CAQH provider data guidance', 'https://www.caqh.org/resources']],
  },
  {
    slug: 'practice-ops-kpi-model',
    title: 'Practice Operations KPI Model',
    summary: 'A practical KPI model for connecting revenue-cycle work to operating decisions.',
    sections: [
      ['KPIs should create decisions', 'A useful KPI rhythm tells leadership what changed, why it changed, who owns the next action, and what decision is needed.'],
      ['Pair revenue and workflow signals', 'A/R, denials, charge lag, posting exceptions, credentialing status, staffing capacity, and queue aging tell a stronger story together than alone.'],
      ['Review cadence matters', 'Metrics without a recurring decision meeting rarely change operations. The meeting is part of the system.'],
    ],
    sources: [['MGMA operations resources', 'https://www.mgma.com/resources'], ['HFMA revenue cycle content', 'https://www.hfma.org/revenue-cycle/']],
  },
  {
    slug: 'healthcare-automation-readiness',
    title: 'Healthcare Automation Readiness Guide',
    summary: 'How to decide which administrative workflows are ready for automation and which need process repair first.',
    sections: [
      ['Automate stable work', 'Automation works best when inputs are reliable, rules are understood, exceptions are visible, and human review is designed into the workflow.'],
      ['Protect sensitive data', 'Automation touching patient-level or sensitive data needs proper agreements, controls, access, storage, monitoring, and retention before implementation.'],
      ['Measure the result', 'A useful automation should reduce rework, shorten cycle time, improve visibility, or free staff capacity for higher-value work.'],
    ],
    sources: [['HHS HIPAA information', 'https://www.hhs.gov/hipaa/index.html'], ['ONC health IT resources', 'https://www.healthit.gov/']],
  },
];

export const diagnosticDeliverables = [
  'Comprehensive A/R and aging analysis',
  'Denial and rejection root-cause review',
  'Workflow and payer assessment',
  'Prioritized revenue opportunity register',
  'Credentialing and reporting visibility review',
  '90-day improvement roadmap',
  'Executive findings presentation',
];

export const diagnosticFaq = [
  ['What data do you need?', 'ROOT begins with deidentified operational and revenue-cycle exports such as aging, denial, rejection, posting, credentialing-status, and payment reports. If patient-level data becomes necessary, ROOT first establishes an approved secure channel and the required agreements.'],
  ['Is ROOT only a diagnostic company?', 'No. The Diagnostic is the paid entry offer. ROOT is a healthcare MSO, RCM, operations, technology, automation, analytics, and DIRT intelligence partner.'],
  ['Do we have to sign a long-term RCM contract?', 'No. The Revenue Optimization Diagnostic is standalone. Any managed service, project, or MSO recommendation is separate and optional.'],
  ['How long does the diagnostic take?', 'The target delivery window is within 14 days after the required, usable data set is received. Timing may change if source data is incomplete or requires remediation.'],
  ['How is sensitive data handled?', 'The public website does not accept PHI. Any later PHI-enabled workflow is activated only after the appropriate agreement, access controls, approved storage, and secure transfer process are in place.'],
];

export const siteNav = [
  {
    label: 'Platform',
    href: '/platform/',
    description: 'How ROOT integrates revenue operations, credentialing, practice operations, technology, automation, analytics, and DIRT.',
    children: platformNodes.slice(0, 5).map((node) => ({ label: node.label, href: '/platform/', description: node.copy })),
  },
  {
    label: 'Solutions',
    href: '/solutions/',
    description: 'Start from the business problem: leakage, aging A/R, denials, credentialing, efficiency, visibility, and growth.',
    children: solutionPages.map((page) => ({ label: page.title, href: `/solutions/${page.slug}/`, description: page.summary })),
  },
  {
    label: 'Services',
    href: '/services/',
    description: 'Managed services and projects across RCM, operations, healthcare IT, automation, analytics, and credentialing.',
    children: servicePages.map((service) => ({ label: service.title, href: `/services/${service.slug}/`, description: service.summary })),
  },
  {
    label: 'Technology',
    href: '/technology/',
    description: 'DIRT and the practical technology layer behind ROOT operating intelligence.',
    children: [
      { label: 'Technology Hub', href: '/technology/', description: 'Healthcare IT, automation, analytics, and operating intelligence.' },
      { label: 'DIRT Intelligence', href: '/technology/dirt/', description: 'Data Intelligence for Revenue Transformation.' },
      { label: 'Proof of Capability', href: '/case-studies/', description: 'Anonymized proof scenarios and revenue-intelligence evidence.' },
      { label: 'Workflow Automation', href: '/services/workflow-automation/', description: 'Monitored automation for stable administrative workflows.' },
      { label: 'Reporting & Analytics', href: '/services/reporting-analytics/', description: 'Decision-grade operating visibility.' },
    ],
  },
  { label: 'Pricing', href: '/pricing/', description: 'Diagnostic, managed RCM, DIRT, projects, credentialing, and full MSO engagement models.' },
  {
    label: 'Resources',
    href: '/resources/',
    description: 'Guides for revenue leakage, A/R, denials, credentialing, KPIs, and automation readiness.',
    children: resourceArticles.map((article) => ({ label: article.title, href: `/resources/${article.slug}/`, description: article.summary })),
  },
  {
    label: 'Company',
    href: '/company/about/',
    description: 'About ROOT, contact, and commercial boundaries.',
    children: [
      { label: 'About ROOT', href: '/company/about/', description: 'The operating philosophy behind ROOT.' },
      { label: 'Contact', href: '/contact/', description: 'Talk with ROOT about a deidentified commercial inquiry.' },
      { label: 'Privacy', href: '/legal/privacy/', description: 'Public site data and no-PHI boundary.' },
      { label: 'Terms', href: '/legal/terms/', description: 'Commercial website terms and limitations.' },
    ],
  },
];

export const footerGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'ROOT Platform', href: '/platform/' },
      { label: 'Technology', href: '/technology/' },
      { label: 'DIRT Intelligence', href: '/technology/dirt/' },
      { label: 'Proof of Capability', href: '/case-studies/' },
      { label: 'Pricing', href: '/pricing/' },
    ],
  },
  { title: 'Solutions', links: solutionPages.map((page) => ({ label: page.title, href: `/solutions/${page.slug}/` })) },
  { title: 'Services', links: [{ label: 'Services Hub', href: '/services/' }, ...servicePages.slice(0, 8).map((service) => ({ label: service.title, href: `/services/${service.slug}/` }))] },
  { title: 'Resources', links: [{ label: 'Resource Library', href: '/resources/' }, ...resourceArticles.slice(0, 4).map((article) => ({ label: article.title, href: `/resources/${article.slug}/` }))] },
  {
    title: 'Company',
    links: [
      { label: 'About ROOT', href: '/company/about/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Diagnostic', href: '/diagnostic/' },
      { label: 'Privacy', href: '/legal/privacy/' },
      { label: 'Terms', href: '/legal/terms/' },
    ],
  },
];

export const routeMeta = {
  '/': {
    title: 'ROOT | Healthcare MSO, RCM, Operations & Technology',
    description: 'ROOT is a healthcare MSO platform for independent practices, combining RCM, credentialing, practice operations, technology, automation, analytics, and DIRT intelligence.',
    image: brandAssets.og,
  },
  '/platform': {
    title: 'ROOT Platform | Healthcare MSO Operating Layer',
    description: 'See how ROOT integrates revenue operations, credentialing, practice operations, healthcare IT, automation, analytics, and DIRT intelligence.',
    image: brandAssets.og,
  },
  '/solutions': {
    title: 'Healthcare Practice Solutions | ROOT',
    description: 'Solutions for revenue leakage, aging A/R, denials, credentialing bottlenecks, operational efficiency, reporting visibility, and scaling practice operations.',
    image: brandAssets.og,
  },
  '/services': {
    title: 'Healthcare MSO Services | ROOT',
    description: 'ROOT services include medical billing, A/R recovery, denial management, credentialing, practice operations, healthcare IT, automation, analytics, and consulting.',
    image: brandAssets.og,
  },
  '/technology': {
    title: 'Healthcare Operations Technology | ROOT',
    description: 'ROOT technology brings healthcare IT, automation, analytics, and DIRT intelligence into one practical operating model for medical practices.',
    image: brandAssets.og,
  },
  '/technology/dirt': {
    title: 'DIRT Intelligence | Data Intelligence for Revenue Transformation',
    description: 'DIRT is ROOT’s intelligence layer for leakage detection, denial analysis, aging A/R prioritization, PracticeOps signals, and revenue command visibility.',
    image: brandAssets.og,
  },
  '/case-studies': {
    title: 'Proof of Capability | ROOT',
    description: 'Browse ROOT anonymized proof-of-capability scenarios that show how revenue intelligence becomes prioritized operating action.',
    image: brandAssets.og,
  },
  '/case-studies/dirt-poc-01': {
    title: 'DIRT Revenue Intelligence | Proof of Capability | ROOT',
    description: 'Anonymized proof of concept showing how DIRT turns revenue-cycle signals into prioritized management action. Publication review required.',
    image: brandAssets.og,
  },
  '/pricing': {
    title: 'ROOT Pricing | Diagnostic, Managed RCM, DIRT & MSO Models',
    description: 'Explore ROOT engagement models: Diagnostic, managed RCM, DIRT/Data Intelligence, projects, credentialing, and full MSO partnership.',
    image: brandAssets.og,
  },
  '/resources': {
    title: 'Healthcare Revenue Cycle Resources | ROOT',
    description: 'Guides for revenue leakage, aging A/R, denial management, credentialing operations, practice KPIs, and healthcare automation readiness.',
    image: brandAssets.og,
  },
  '/diagnostic': {
    title: 'Revenue Optimization Diagnostic | ROOT',
    description: 'A fixed-fee $2,500 Diagnostic for independent practices: A/R analysis, denial root causes, opportunity register, workflow review, and 90-day roadmap.',
    image: brandAssets.og,
  },
  '/company/about': {
    title: 'About ROOT | Healthcare MSO Platform',
    description: 'ROOT combines healthcare operations, revenue-cycle execution, credentialing, analytics, automation, and technology for independent practices.',
    image: brandAssets.og,
  },
  '/contact': {
    title: 'Contact ROOT | Healthcare MSO, RCM & Practice Operations',
    description: 'Talk with ROOT about RCM, A/R recovery, denial management, credentialing, practice operations, healthcare IT, DIRT, or analytics.',
    image: brandAssets.og,
  },
  '/legal/privacy': { title: 'Privacy | ROOT', description: 'ROOT public website privacy boundary and no-PHI intake policy.', image: brandAssets.og },
  '/legal/terms': { title: 'Terms | ROOT', description: 'ROOT commercial website terms of use.', image: brandAssets.og },
  '/thank-you': { title: 'Request Received | ROOT', description: 'ROOT has received your deidentified commercial inquiry.', image: brandAssets.og },
};

solutionPages.forEach((page) => {
  routeMeta[`/solutions/${page.slug}`] = { title: `${page.title} Solution | ROOT`, description: page.summary, image: brandAssets.og };
});

servicePages.forEach((service) => {
  routeMeta[`/services/${service.slug}`] = { title: `${service.title} Services | ROOT`, description: service.summary, image: brandAssets.og };
});

resourceArticles.forEach((article) => {
  routeMeta[`/resources/${article.slug}`] = { title: `${article.title} | ROOT Resources`, description: article.summary, image: brandAssets.og };
});
