import { diagnosticDeliverables, diagnosticFaq } from './siteData.js';

/**
 * FAQ content: single source for the visible /faq/ page and its FAQPage JSON-LD.
 * Every answer restates facts already published elsewhere on the site (pricing, Diagnostic scope,
 * privacy boundary, terms). Do not add outcomes, statistics, certifications or guarantees here.
 */
const deliverables = diagnosticDeliverables.join('; ').replace(/^./, (c) => c.toLowerCase());

const diagnosticItems = diagnosticFaq.map(([question, answer]) => ({ group: 'Revenue Optimization Diagnostic', question, answer }));

export const faqItems = [
  {
    group: 'About ROOT',
    question: 'What does ROOT do?',
    answer: 'ROOT (Revenue Operations & Outcomes Technology Incorporated) is a healthcare revenue intelligence and operating partner. ROOT connects revenue cycle management, credentialing, practice operations, healthcare technology and DIRT data intelligence so financial findings become accountable action.',
  },
  {
    group: 'About ROOT',
    question: 'What is DIRT?',
    answer: 'DIRT stands for Data Intelligence for Revenue Transformation. It is an intelligence capability embedded inside ROOT, not a separate company. DIRT helps connect fragmented revenue signals, identify financial exposure, explain likely root causes and prioritize action that people own.',
    href: '/technology/dirt/',
  },
  {
    group: 'About ROOT',
    question: 'Who is ROOT built for?',
    answer: 'ROOT is built for independent physician practices and specialty groups, including behavioral health groups, ambulatory surgery centers, office-based surgery and labs, anesthesia groups, cardiology and electrophysiology practices, and multispecialty organizations.',
    href: '/solutions/',
  },
  {
    group: 'Revenue Optimization Diagnostic',
    question: 'How much does the Revenue Optimization Diagnostic cost?',
    answer: 'The Revenue Optimization Diagnostic is a fixed-fee $2,500 engagement. ROOT confirms scope and payment arrangements in writing before work begins.',
    href: '/diagnostic/',
  },
  {
    group: 'Revenue Optimization Diagnostic',
    question: 'Is the Diagnostic free?',
    answer: 'No. The Revenue Optimization Diagnostic is a paid, fixed-fee engagement. It is separate from any later managed service, project or MSO recommendation, all of which are optional.',
    href: '/pricing/',
  },
  {
    group: 'Revenue Optimization Diagnostic',
    question: 'What does the Diagnostic include?',
    answer: `The Diagnostic includes ${deliverables}.`,
    href: '/diagnostic/',
  },
  ...diagnosticItems,
  {
    group: 'Engagement and pricing',
    question: 'What engagement models does ROOT offer?',
    answer: 'ROOT offers the fixed-fee Diagnostic, managed revenue cycle management, DIRT data intelligence, scoped projects and automation, credentialing, and a full MSO partnership. Final pricing depends on specialty, volume, payer mix, systems and scope.',
    href: '/pricing/',
  },
  {
    group: 'Engagement and pricing',
    question: 'Does ROOT guarantee financial results?',
    answer: 'No. Revenue-cycle outcomes depend on source data quality, payer behavior, contractual terms, practice workflows, documentation, coding and other factors. Scope, fees, deliverables and timelines are governed by the applicable written agreement.',
    href: '/terms/',
  },
  {
    group: 'Engagement and pricing',
    question: 'Can I pay online?',
    answer: 'Online checkout is offered only where it is shown on the Pricing or Diagnostic page. Otherwise, request the Diagnostic or book a conversation and ROOT will confirm scope and payment arrangements in writing.',
    href: '/book/',
  },
  {
    group: 'Data and privacy',
    question: 'Can I send patient information through this website?',
    answer: 'No. This public website accepts deidentified commercial inquiries only. Do not submit patient names, dates of birth, medical record numbers, clinical details, insurance identifiers or other Protected Health Information through forms, email or chat links.',
    href: '/privacy-policy/',
  },
  {
    group: 'Data and privacy',
    question: 'What analytics does this website use?',
    answer: 'Analytics stay off until you consent. When enabled, the site may use Google Analytics 4 and ROOT\'s own first-party measurement of page views, scrolling and clicks. Neither receives names, email addresses, phone numbers, form messages or PHI. You can change your choice at any time from the cookie settings.',
    href: '/legal/cookies/',
  },
  {
    group: 'Getting started',
    question: 'How do I get started?',
    answer: 'Request the Revenue Optimization Diagnostic or book a conversation. Describe your practice\'s revenue question in deidentified terms and ROOT will recommend the right next step.',
    href: '/book/',
  },
];

export const faqGroups = [...new Set(faqItems.map((item) => item.group))];
