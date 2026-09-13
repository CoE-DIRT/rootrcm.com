import { lazy, Suspense } from 'react';
import {
  ArrowRight,
  Activity,
  Blocks,
  CalendarCheck,
  Check,
  ClipboardCheck,
  FileSearch,
  Layers3,
  LineChart,
  LockKeyhole,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react';
import InquiryForm from './components/InquiryForm.jsx';
import {
  DirtCapabilityMatrix,
  DirtCommandVisual,
  DirtPipelineFlow,
} from './components/DirtEvidence.jsx';
import HeroPracticeVisual from './components/HeroPracticeVisual.jsx';
import {
  CapabilityProofSection,
  DiagnosticSampleSection,
  DirtDemonstrationSection,
  ProofLibrarySection,
  ResourceProofCallout,
} from './components/ProofWork.jsx';
import { Breadcrumbs, ChannelButtons, GlassCard, SectionCta, TrackedLink } from './components/SiteChrome.jsx';
import { getCaseStudyBySlug, getVisibleCaseStudies } from './data/caseStudies.js';
import {
  companyInfo,
  diagnosticDeliverables,
  diagnosticFaq,
  platformNodes,
  pricingModels,
  resourceArticles,
  mediaAssets,
  serviceMediaBySlug,
  solutionMediaBySlug,
  servicePages,
  solutionPages,
} from './siteData.js';
import { proofPlacementByResourceSlug, proofPlacementByServiceSlug, proofPlacementBySolutionSlug } from './proofData.js';

const CaseStudyCarousel = lazy(() => import('./components/CaseStudyCarousel.jsx'));

const trustSignals = [
  ['Full MSO Scope', 'Revenue, operations, technology, automation, analytics, and DIRT in one operating partnership.'],
  ['Diagnostic Entry', 'Start with a fixed $2,500 assessment before a broader managed-service decision.'],
  ['No-PHI Public Intake', 'Commercial inquiries stay deidentified by design.'],
  ['Built for Action', 'Every recommendation connects to owner, priority, cadence, and next step.'],
];

const carouselItems = [
  {
    title: 'Diagnostic',
    eyebrow: '$2,500 fixed entry',
    copy: 'A focused assessment that turns A/R, denial, workflow, credentialing, and reporting signals into a ranked opportunity register.',
    href: '/diagnostic/',
  },
  {
    title: 'Managed RCM',
    eyebrow: 'Operating ownership',
    copy: 'ROOT runs revenue-cycle execution and improvement across billing, denials, A/R, posting, reporting, and escalation.',
    href: '/services/rcm/',
  },
  {
    title: 'DIRT Intelligence',
    eyebrow: '$1,500-$2,500/month when scoped',
    copy: 'The intelligence layer for revenue leakage, denial patterns, A/R priority, payer behavior, and PracticeOps signals.',
    href: '/technology/dirt/',
  },
  {
    title: 'Full MSO Partnership',
    eyebrow: 'Custom',
    copy: 'A broader operating partnership across revenue operations, practice operations, technology, automation, analytics, and leadership visibility.',
    href: '/pricing/',
  },
];

const operatingSymptoms = [
  ['A/R keeps aging', 'Backlog grows because queues are worked by age alone, not recoverability, payer behavior, or owner accountability.'],
  ['Denials repeat', 'Teams fix transactions while eligibility, authorization, coding, credentialing, or payer-specific workflow keeps recreating failure.'],
  ['Reports do not decide', 'Leadership sees exports and dashboards, but not the ranked action, owner, cadence, or operating constraint.'],
  ['Credentialing slows growth', 'Provider enrollment and payer status become revenue-timing risks when they are not managed as an operating workflow.'],
];

const rootOperatingSteps = [
  ['Diagnose', 'Read A/R, denials, workflow, credentialing, payer, and reporting signals together.'],
  ['Prioritize', 'Separate value at risk from noise and sequence work by recoverability, urgency, and owner.'],
  ['Operate', 'Install revenue-cycle controls, escalation paths, service ownership, and weekly management rhythm.'],
  ['Instrument', 'Use DIRT to keep leakage, denial, A/R, and PracticeOps signals visible after the first push.'],
];

const diagnosticInputs = [
  'A/R aging and payer balance exports',
  'Denial, rejection, and adjustment summaries',
  'Charge lag, posting, and unresolved work queues',
  'Credentialing status and payer participation context',
  'Existing KPI reports or dashboards leadership uses',
];

function EditorialMedia({ media, className = '' }) {
  if (!media) return null;
  return (
    <figure className={`editorialMedia glassCard ${className}`}>
      <img src={media.src} alt={media.alt} loading="lazy" decoding="async" width={media.width || 960} height={media.height || 720} />
      <figcaption className="editorialMediaCaption">{media.caption || 'Editorial reference image'}</figcaption>
    </figure>
  );
}

function PageHero({ breadcrumbs, title, copy, eyebrow, cta = true, offerLine }) {
  return (
    <section className="pageHero" data-reveal>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{copy}</p>
      {offerLine && <p className="pricingOfferLine">{offerLine}</p>}
      {cta && (
        <TrackedLink href="/diagnostic/" cta="book-diagnostic" location="page-hero" engagementType="diagnostic">
          Book a Diagnostic <ArrowRight size={17} />
        </TrackedLink>
      )}
    </section>
  );
}

function PlatformLayers() {
  return (
    <figure className="platformLayers" aria-label="Practice, ROOT, and DIRT operating layers">
      <div className="platformLayer tone-practice">
        <p className="eyebrow">Clinical practice</p>
        <h3>Care stays with the practice</h3>
        <p>Clinical authority and patient care remain inside the practice. ROOT does not replace the clinical center.</p>
      </div>
      <div className="platformLayer tone-root">
        <p className="eyebrow">ROOT operating layer</p>
        <h3>Business systems around the practice</h3>
        <p>Revenue operations, credentialing, practice operations, healthcare IT, automation, and analytics run as one accountable operating partner.</p>
      </div>
      <div className="platformLayer tone-dirt">
        <p className="eyebrow">DIRT intelligence</p>
        <h3>Signals connected to action</h3>
        <p>DIRT keeps leakage, denial, A/R, and PracticeOps signals tied to financial significance, owners, and next actions.</p>
      </div>
      <figcaption className="srOnly">Three-layer responsibility diagram: clinical practice, ROOT services, and DIRT intelligence.</figcaption>
    </figure>
  );
}

function PlatformDomainDirectory() {
  return (
    <ul className="platformDomainList">
      {platformNodes.map((node) => (
        <li key={node.label}>
          <a href="/platform/">
            <strong>{node.label}</strong>
            <span>{node.copy}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ServiceFamilyDirectory({ limitPerFamily }) {
  const families = ['Revenue Operations', 'Practice Operations', 'Technology'];
  return (
    <div className="capabilityFamilies">
      {families.map((family) => {
        const icons = { 'Revenue Operations': TrendingUp, 'Practice Operations': CalendarCheck, Technology: Blocks };
        const Icon = icons[family];
        let services = servicePages.filter((service) => service.family === family);
        if (typeof limitPerFamily === 'number') services = services.slice(0, limitPerFamily);
        return (
          <section className="capabilityFamily" key={family}>
            <header>
              <Icon size={22} aria-hidden="true" />
              <div>
                <p className="eyebrow">{family}</p>
                <h3>{family === 'Technology' ? 'Technology and intelligence' : family}</h3>
              </div>
            </header>
            <div className="serviceDirectory">
              {services.map((service) => (
                <a className="serviceDirectoryRow" href={`/services/${service.slug}/`} key={service.slug}>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <span>View service <ArrowRight size={15} /></span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ServiceProcessFlow({ service }) {
  const flows = {
    rcm: ['Charge review', 'Claim quality', 'Submission', 'Payer follow-up', 'Posting and reporting controls'],
    'ar-recovery': ['Segment backlog', 'Prioritize recoverability', 'Follow up', 'Escalate', 'Review cadence'],
    'denial-management': ['Inventory and reason patterning', 'Recovery work', 'Prevention feedback to operations'],
    credentialing: ['Enrollment', 'Revalidation', 'Payer follow-up', 'Roster maintenance', 'Status visibility'],
    'practice-ops': ['Workflow map', 'Owner assignment', 'Cadence', 'Escalation', 'Control review'],
  };
  const steps = flows[service.slug];
  if (!steps) {
    return (
      <div className="cardGrid compactCards">
        {service.deliverables.map((item) => (
          <GlassCard key={item}><Check size={18} /><h3>{item}</h3></GlassCard>
        ))}
      </div>
    );
  }
  return (
    <ol className="processRail serviceProcessRail">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="stepIndex">{String(index + 1).padStart(2, '0')}</span>
          <h3>{step}</h3>
          <p>{service.deliverables[index] || service.summary}</p>
        </li>
      ))}
    </ol>
  );
}

function OperatingPainSection() {
  return (
    <section className="contentSection painSection homeValueBand" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">Operating strain</p>
        <h2>Where the operating strain shows up.</h2>
        <p>Independent practices often feel the symptom before they can see the system. Each row pairs the visible problem with the ROOT response path.</p>
      </div>
      <div className="symptomResponseList">
        {operatingSymptoms.map(([title, copy], index) => {
          const icons = [TrendingUp, ShieldCheck, LineChart, CalendarCheck];
          const responses = [
            'Segment A/R by recoverability, payer behavior, and owner accountability.',
            'Trace recurring denials into prevention work across eligibility, auth, coding, and credentialing.',
            'Replace export theater with ranked action, owner, cadence, and constraint.',
            'Run enrollment and payer status as an operating workflow with deadlines and escalation.',
          ];
          const Icon = icons[index];
          return (
            <article className="symptomResponseRow" key={title}>
              <div className="symptomLabel">
                <Icon size={22} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
              <p className="responseCopy"><b>ROOT response.</b> {responses[index]}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OperatingModelSection() {
  return (
    <section className="operatingModelSection contentSection" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">How ROOT operates</p>
        <h2>Diagnose, prioritize, operate, instrument.</h2>
        <p>ROOT starts with evidence, then turns it into ownership, rhythm, and visible work. DIRT keeps the signal alive so decisions do not disappear back into exports.</p>
      </div>
      <ol className="processRail">
        {rootOperatingSteps.map(([title, copy], index) => (
          <li key={title}>
            <span className="stepIndex">{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DiagnosticOfferPreview() {
  return (
    <section className="diagnosticOfferSection contentSection homeOfferBand" data-reveal>
      <div className="diagnosticOfferCopy">
        <p className="eyebrow">Revenue Optimization Diagnostic</p>
        <h2>A clear starting point: the $2,500 Diagnostic.</h2>
        <p>ROOT reviews deidentified operating material and delivers a prioritized opportunity register and 90-day roadmap.</p>
        <TrackedLink href="/diagnostic/" cta="book-diagnostic" location="home-diagnostic-preview" engagementType="diagnostic">
          Start the $2,500 Diagnostic <ArrowRight size={17} />
        </TrackedLink>
        <TrackedLink className="textLink" href="/pricing/" cta="compare-pricing" location="home-diagnostic-preview" engagementType="pricing">
          Compare engagement models <ArrowRight size={16} />
        </TrackedLink>
      </div>
      <div className="diagnosticArtifact glassCard diagnosticOfferArtifact">
        <span>Representative deliverable</span>
        {diagnosticDeliverables.slice(0, 5).map((item) => (
          <div key={item}><ClipboardCheck size={17} aria-hidden="true" /><b>{item}</b></div>
        ))}
      </div>
      <ul className="engagementRows">
        {carouselItems.map((item) => (
          <li key={item.title}>
            <div>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
            </div>
            <p>{item.copy}</p>
            <TrackedLink className="textLink" href={item.href} cta="engagement-row" location="home-engagement" engagementType={item.title.toLowerCase().replaceAll(' ', '-')}>
              Explore <ArrowRight size={16} />
            </TrackedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EngagementRowsPanel() {
  return (
    <section className="contentSection mutedBand" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">Engagement choices</p>
        <h2>Start focused. Expand when the evidence earns it.</h2>
      </div>
      <ul className="engagementRows">
        {carouselItems.map((item) => (
          <li key={item.title}>
            <div>
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
            </div>
            <p>{item.copy}</p>
            <TrackedLink className="textLink" href={item.href} cta="engagement-row" location="platform-engagement" engagementType={item.title.toLowerCase().replaceAll(' ', '-')}>
              Explore <ArrowRight size={16} />
            </TrackedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SolutionCards({ limit }) {
  const pages = typeof limit === 'number' ? solutionPages.slice(0, limit) : solutionPages;
  return (
    <div className="cardGrid solutionGrid">
      {pages.map((page) => (
        <a className="glassCard linkCard" href={`/solutions/${page.slug}/`} key={page.slug}>
          <Target size={21} />
          <h3>{page.title}</h3>
          <p>{page.summary}</p>
          <span>View solution <ArrowRight size={15} /></span>
        </a>
      ))}
    </div>
  );
}

function ServiceProofCopy({ service }) {
  const copy = {
    rcm: 'A representative control view shows how ROOT connects charge review, claim quality, payer follow-up, denial rate, collections, and A/R into one operating rhythm.',
    'medical-billing': 'A representative clean-claim view shows how billing work moves from charge review through scrub, submission, warning cleanup, and payer follow-up.',
    'ar-recovery': 'A synthetic aging analysis shows how ROOT segments backlog by value, age, payer behavior, recoverability, owner, and next action.',
    'payment-posting': 'A representative revenue-cycle control view keeps posting exceptions connected to cash, adjustments, A/R accuracy, and leadership reporting.',
    'patient-balances': 'A synthetic A/R view separates payer-side backlog from patient-responsibility balances so the right workflow receives the right follow-up.',
    'denial-management': 'A synthetic denial Pareto shows how recurring denial events become root-cause categories, value-at-risk signals, and prevention priorities.',
    credentialing: 'A de-identified command view shows payer enrollment as an operating workflow with status, age, owner, missing document, and escalation signals.',
    'practice-ops': 'A synthetic scorecard links workflow backlog, ownership, queue aging, and leadership cadence to revenue-cycle operating priorities.',
    'healthcare-it': 'A DIRT-style signal view shows why system workflow, source-data reliability, access governance, and reporting architecture matter operationally.',
    'workflow-automation': 'A synthetic operations scorecard separates stable repeatable workflows from process issues that need cleanup before automation.',
    'reporting-analytics': 'A DIRT management view shows how raw exports become governed metrics, root-cause signals, and prioritized decision support.',
    'operational-consulting': 'A synthetic PracticeOps view shows how consulting output becomes owner-based action, operating cadence, and a 30/60/90 implementation sequence.',
  };

  return copy[service.slug];
}

function ResourceCards({ limit }) {
  const articles = typeof limit === 'number' ? resourceArticles.slice(0, limit) : resourceArticles;
  return (
    <div className="cardGrid resourceGrid">
      {articles.map((article) => (
        <a className="glassCard linkCard" href={`/resources/${article.slug}/`} key={article.slug}>
          <FileSearch size={21} />
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <span>Read guide <ArrowRight size={15} /></span>
        </a>
      ))}
    </div>
  );
}

function ContactMethodsPanel({ location = 'contact-methods' }) {
  return (
    <section className="contactMethods darkBand" data-reveal>
      <div>
        <p className="eyebrow">ROOT Revenue Operations & Outcomes Technology Incorporated</p>
        <h2>Reach ROOT the way your team works.</h2>
        <address>
          <strong>{companyInfo.legalName}</strong>
          {companyInfo.addressLines.map((line) => <span key={line}>{line}</span>)}
          <a href={companyInfo.phoneHref}>{companyInfo.phone}</a>
          <a href={companyInfo.emailHref}>{companyInfo.email}</a>
        </address>
      </div>
      <div>
        <ChannelButtons location={location} />
        <div className="virtualDesk">
          <p>Chatbot and virtual front desk are planned for future secure triage after agreements and safeguards are in place.</p>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <section className="homeHero fullBleedHero homeHeroRecovered" data-reveal>
        <div className="heroCopy">
          <p className="eyebrow">Healthcare MSO · Revenue intelligence</p>
          <h1>Run the business side of medicine better.</h1>
          <p className="lede">ROOT brings revenue operations, practice operations, technology, and DIRT intelligence into one partnership for independent medical practices.</p>
          <div className="actions">
            <TrackedLink href="/diagnostic/" cta="book-diagnostic" location="home-hero" engagementType="diagnostic">
              Start the $2,500 Diagnostic <ArrowRight size={17} />
            </TrackedLink>
            <TrackedLink className="button secondary" href="/technology/dirt/" cta="explore-dirt" location="home-hero" engagementType="technology">
              Explore DIRT
            </TrackedLink>
          </div>
          <p className="trustLine"><ShieldCheck size={16} /> Public website inquiries are deidentified. PHI is accepted only through an approved secure channel after required agreements and controls are in place.</p>
        </div>
        <HeroPracticeVisual />
      </section>

      <section className="trustBand" aria-label="ROOT operating principles" data-reveal>
        {trustSignals.map(([title, copy], index) => {
          const icons = [Layers3, CalendarCheck, LockKeyhole, TrendingUp];
          const Icon = icons[index];
          return (
            <span key={title}>
              <Icon size={20} />
              <b>{title}</b>
              <small>{copy}</small>
            </span>
          );
        })}
      </section>

      <OperatingPainSection />

      <section className="contentSection homeCapabilities mutedBand" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Service breadth</p>
          <h2>One partner across the practice business.</h2>
          <p>Revenue, practice operations, and technology stay visible as owned service groups—not a wall of equal cards.</p>
        </div>
        <ServiceFamilyDirectory limitPerFamily={4} />
      </section>

      <OperatingModelSection />

      <section className="splitSection darkBand dirtHomeBand" data-reveal>
        <div>
          <p className="eyebrow">ROOT + DIRT</p>
          <h2>Execution with intelligence behind it.</h2>
          <p>DIRT connects leakage, denial patterns, A/R priorities, and PracticeOps signals to owners and next actions.</p>
          <TrackedLink className="textLink" href="/technology/dirt/" cta="explore-dirt" location="home-dirt" engagementType="technology">
            Explore DIRT <ArrowRight size={16} />
          </TrackedLink>
          {getCaseStudyBySlug('dirt-poc-01') && (
            <TrackedLink className="textLink" href="/case-studies/dirt-poc-01/" cta="view-proof" location="home-dirt" engagementType="proof">
              View Proof of Capability <ArrowRight size={16} />
            </TrackedLink>
          )}
        </div>
        <DirtCommandVisual compact />
      </section>

      <ProofLibrarySection />
      <DiagnosticOfferPreview />
      <ContactMethodsPanel location="home-outreach" />
    </>
  );
}

export function PlatformPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Platform' }]}
        eyebrow="Healthcare MSO platform"
        title="One operating layer for your practice."
        copy="ROOT connects revenue operations, credentialing, practice operations, technology, and DIRT intelligence around the clinical practice."
      />
      <section className="contentSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Practice · ROOT · DIRT</p>
          <h2>Clinical care at the center. Operating intelligence around it.</h2>
          <p>One diagram explains responsibility. The domain directory below keeps every operating area linked and scannable.</p>
        </div>
        <PlatformLayers />
        <PlatformDomainDirectory />
        <EditorialMedia
          className="platformContextMedia"
          media={{
            src: mediaAssets.operationsPlanning,
            alt: 'Operations planning workshop in a professional setting. Editorial stock photograph; not ROOT staff or customers.',
            caption: 'Editorial operating context',
            width: 640,
            height: 480,
          }}
        />
      </section>
      <EngagementRowsPanel />
      <section className="contentSection" data-reveal>
        <div className="sectionHeading narrow">
          <p className="eyebrow">Quality and data protection readiness</p>
          <h2>Built toward future certification discipline.</h2>
          <p>ROOT does not claim certification today. The MVP is structured so future quality, information-security, privacy, cloud, AI-governance, and HIPAA-readiness work has a clean operating foundation.</p>
        </div>
      </section>
      <SectionCta title="Bring ROOT into the business layer of the practice." copy="Start with the Diagnostic, or talk through a broader MSO need." />
    </>
  );
}

export function SolutionsHubPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Solutions' }]} eyebrow="Problem-led healthcare operations" title="Start where the business pain shows up." copy="Revenue leakage, aging A/R, denials, credentialing bottlenecks, operational drag, poor reporting, and growth friction are connected problems. ROOT solves them across the operating system." />
      <section className="contentSection" data-reveal><SolutionCards /></section>
      <SectionCta title="Not sure which problem is primary?" copy="The Diagnostic finds the constraint, ranks the opportunity, and gives leadership a 90-day action plan." />
    </>
  );
}

export function SolutionPage({ page }) {
  const proofAsset = proofPlacementBySolutionSlug[page.slug];
  const media = solutionMediaBySlug[page.slug];
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Solutions', href: '/solutions/' }, { label: page.title }]} eyebrow="Solution" title={page.title} copy={page.summary} />
      <section className="splitSection" data-reveal>
        <div><p className="eyebrow">Problem</p><h2>What is really happening</h2><p>{page.problem}</p></div>
        <div>
          <EditorialMedia media={media} />
          <div className="glassCard emphasisCard"><p className="eyebrow">ROOT response</p><h3>{page.rootResponse}</h3></div>
        </div>
      </section>
      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading narrow"><p className="eyebrow">Connected services</p><h2>How ROOT handles it</h2></div>
        <div className="pillGrid">{page.services.map((service) => <span key={service}>{service}</span>)}</div>
      </section>
      <section className="splitSection darkBand" data-reveal>
        <DirtCommandVisual />
        <div><p className="eyebrow">DIRT contribution</p><h2>Intelligence makes the work more precise.</h2><p>{page.dirt}</p></div>
      </section>
      <CapabilityProofSection assetKey={proofAsset} heading={`${page.title} example output`} copy="This synthetic preview shows what ROOT analyzes, how the operating issue is structured, and how the work becomes a prioritized action view without using client data." />
      <SectionCta title={page.cta} copy="Start with the fixed-fee Diagnostic or talk with ROOT about a broader managed operating need." />
    </>
  );
}

export function ServicesHubPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Services' }]}
        eyebrow="Healthcare MSO services"
        title="Services for the business side of medicine."
        copy="ROOT supports independent practices across revenue operations, practice operations, and technology. Scan by family, then open the owned service that fits."
      />
      <section className="contentSection" data-reveal>
        <ServiceFamilyDirectory />
      </section>
      <SectionCta title="Need a managed partner, not just advice?" copy="ROOT can begin with a Diagnostic, a focused project, or a broader MSO model depending on the evidence." label="Talk to ROOT" href="/contact/" cta="talk-to-root" engagementType="consultation" />
    </>
  );
}

export function ServicePage({ service }) {
  const proofAsset = proofPlacementByServiceSlug[service.slug];
  const media = serviceMediaBySlug[service.slug];
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Services', href: '/services/' }, { label: service.title }]} eyebrow={service.family} title={service.title} copy={service.summary} cta={false} />
      <section className="splitSection" data-reveal>
        <div>
          <p className="eyebrow">Best fit</p>
          <h2>Who this is for</h2>
          <p>{service.buyer}</p>
          <TrackedLink href="/contact/" cta="talk-to-root" location={`service-${service.slug}`} engagementType="consultation">
            Talk to ROOT <ArrowRight size={17} />
          </TrackedLink>
          <TrackedLink className="textLink" href="/diagnostic/" cta="book-diagnostic" location={`service-${service.slug}`} engagementType="diagnostic">
            Or start the Diagnostic <ArrowRight size={16} />
          </TrackedLink>
          <TrackedLink className="textLink" href={service.related} cta="related-solution" location={`service-${service.slug}`} engagementType="solution">
            Related solution <ArrowRight size={16} />
          </TrackedLink>
        </div>
        <div>
          <EditorialMedia media={media} />
          <div className="glassCard stackCard"><p className="eyebrow">Engagement</p><h3>{service.engagement}</h3><p>{service.pricing}</p></div>
        </div>
      </section>
      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading narrow"><p className="eyebrow">Owned mechanism</p><h2>What ROOT can own</h2></div>
        <ServiceProcessFlow service={service} />
      </section>
      <section className="featureBand darkBand" data-reveal>
        <div><p className="eyebrow">DIRT advantage</p><h2>Service work informed by better signals.</h2></div>
        <p>{service.dirt}</p>
      </section>
      <CapabilityProofSection assetKey={proofAsset} heading={`${service.title} work product preview`} copy={ServiceProofCopy({ service })} />
      <SectionCta title={`Talk to ROOT about ${service.title}.`} copy="Share deidentified commercial context and ROOT will route the conversation to the right next step." label="Talk to ROOT" href="/contact/" cta="talk-to-root" engagementType="consultation" />
    </>
  );
}

export function TechnologyHubPage() {
  const stages = [
    ['Source reliability', 'System workflows, access, support model, and source-data reliability.', '/services/healthcare-it/', ''],
    ['Monitored workflow', 'Stable administrative workflows converted into monitored process support.', '/services/workflow-automation/', ''],
    ['Reporting', 'Revenue and operations reporting that supports decisions and accountability.', '/services/reporting-analytics/', ''],
    ['Decision', 'The intelligence layer for leakage, denial, A/R, and PracticeOps signals.', '/technology/dirt/', 'tone-dirt'],
  ];
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Technology' }]} eyebrow="Healthcare technology + intelligence" title="Technology that serves the operating model." copy="ROOT uses healthcare IT alignment, workflow automation, reporting architecture, analytics, and DIRT intelligence to make the business side of medicine more visible and more governable." />
      <section className="contentSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Technology mechanism</p>
          <h2>From source reliability to decision support.</h2>
          <p>Each stage depends on the one before it. DIRT is the final decision layer, not a decorative dashboard.</p>
        </div>
        <ol className="techMechanism">
          {stages.map(([title, copy, href, tone]) => (
            <li className={`techMechanismStage ${tone}`} key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href={href}>Explore <ArrowRight size={15} /></a>
            </li>
          ))}
        </ol>
      </section>
      <section className="splitSection darkBand techEvidenceBand" data-reveal>
        <div>
          <p className="eyebrow">DIRT sample</p>
          <h2>One representative command record.</h2>
          <p>Technology value shows up when a signal becomes financially significant, owned, and actionable.</p>
          <EditorialMedia
            media={{
              src: mediaAssets.healthcareIt,
              alt: 'Desk and laptop workstation. Editorial stock photograph.',
              caption: 'Editorial Healthcare IT context — not an EHR or PM integration claim',
            }}
            className="platformContextMedia"
          />
        </div>
        <DirtCommandVisual compact />
      </section>
      <SectionCta title="Put technology behind a revenue decision." copy="Start with the $2,500 Diagnostic when you need evidence before a broader technology or DIRT engagement." />
    </>
  );
}

export function DirtPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Technology', href: '/technology/' }, { label: 'DIRT Intelligence' }]}
        eyebrow="Data Intelligence for Revenue Transformation"
        title="Revenue intelligence, connected to action."
        copy="DIRT helps ROOT detect leakage, understand denial patterns, prioritize A/R recovery, and assign the next operating action."
      />
      <section className="contentSection dirtPipelineSection dirtCommandSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">DIRT operating logic</p>
          <h2>From signal to an owned next action.</h2>
          <p>Five ordered stages keep evidence hierarchy visible: signal, finding, financial significance, owner, and next action.</p>
        </div>
        <DirtPipelineFlow />
      </section>
      <section className="splitSection darkBand dirtCommandBand" data-reveal>
        <DirtCommandVisual />
      </section>
      <section className="contentSection" data-reveal>
        <div className="sectionHeading narrow">
          <p className="eyebrow">Capability map</p>
          <h2>What leadership should be able to see.</h2>
        </div>
        <DirtCapabilityMatrix />
      </section>
      <DirtDemonstrationSection />
      <SectionCta title="Want DIRT applied to your revenue cycle?" copy="The Diagnostic is the fastest path from current data to a prioritized opportunity register." />
    </>
  );
}

export function CaseStudiesHubPage() {
  const studies = getVisibleCaseStudies();
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Proof of Capability' }]}
        eyebrow="Evidence over spectacle"
        title="Proof of Capability."
        copy="Anonymized proof-of-concept scenarios that show how ROOT and DIRT turn revenue-cycle signals into prioritized operating action. These are not client success stories."
        cta={false}
      />
      <section className="contentSection" data-reveal>
        <div className="cardGrid caseStudyGrid">
          {studies.length ? studies.map((study) => (
            <a className="glassCard linkCard caseStudyCard" href={`/case-studies/${study.slug}/`} key={study.slug}>
              <span className="miniLabel">{study.proofLabel}</span>
              <h3>{study.title}</h3>
              <p>{study.summary}</p>
              {!study.publicReady && <em className="reviewBadge">Publication review required</em>}
              <span>Open proof <ArrowRight size={15} /></span>
            </a>
          )) : (
            <div className="glassCard caseStudyEmptyState">
              <h3>Proof materials are being prepared.</h3>
              <p>Start with a practice-specific Revenue Optimization Diagnostic for evidence grounded in your own deidentified operating data.</p>
            </div>
          )}
        </div>
      </section>
      <SectionCta title="Ready for a practice-specific review?" copy="The $2,500 Revenue Optimization Diagnostic turns your deidentified operating material into a ranked opportunity register." />
    </>
  );
}

export function CaseStudyDetailPage({ slug }) {
  const study = getCaseStudyBySlug(slug);
  if (!study) return <NotFoundPage />;

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Proof of Capability', href: '/case-studies/' }, { label: study.shortTitle }]}
        eyebrow={`${study.proofLabel} · ${study.sourceType}`}
        title={study.title}
        copy={study.summary}
        cta={false}
      />

      {!study.publicReady && (
        <section className="publicationReviewBanner" data-reveal role="status">
          <strong>PUBLICATION REVIEW REQUIRED</strong>
          <p>Local staging experience only. Financial totals and source raster claims remain under review. Do not treat this as a published client success story.</p>
          <ul>
            {study.reviewRequired.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}

      <section className="contentSection caseStudyNarrative" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">{study.scenarioLabel}</p>
          <h2>Executive summary</h2>
          <p>{study.executiveSummary}</p>
        </div>
        <div className="caseStudyBodyGrid">
          <article className="glassCard">
            <p className="eyebrow">Problem</p>
            <h3>What leadership usually sees</h3>
            <p>{study.problem}</p>
          </article>
          <article className="glassCard">
            <p className="eyebrow">Analytical approach</p>
            <h3>How DIRT reads the system</h3>
            <p>{study.analyticalApproach}</p>
          </article>
        </div>
      </section>

      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Visual evidence</p>
          <h2>Proof carousel</h2>
          <p>Slides support the narrative. Semantic content and disclaimers live on this page, not only inside the carousel.</p>
        </div>
        <Suspense fallback={<p className="caseStudyCarouselStatus">Loading proof slides…</p>}>
          <CaseStudyCarousel slides={study.slides} label={`${study.title} proof slides`} />
        </Suspense>
      </section>

      <section className="splitSection" data-reveal>
        <div>
          <p className="eyebrow">Findings</p>
          <h2>What the method makes visible</h2>
          <div className="checkList">
            {study.findings.map((item) => <span key={item}><Check size={16} /> {item}</span>)}
          </div>
        </div>
        <div>
          <p className="eyebrow">Methodology</p>
          <h2>How the proof is structured</h2>
          <div className="checkList">
            {study.methodology.map((item) => <span key={item}><Check size={16} /> {item}</span>)}
          </div>
        </div>
      </section>

      <section className="featureBand darkBand" data-reveal>
        <div>
          <p className="eyebrow">Disclaimer</p>
          <h2>Claim discipline</h2>
        </div>
        <p>{study.disclaimer}</p>
      </section>

      <SectionCta
        title={study.cta.label}
        copy="Start with a fixed-fee Diagnostic when you want practice-specific evidence before a broader operating decision."
        href={study.cta.href}
      />
    </>
  );
}

export function PricingPage() {
  const diagnostic = pricingModels[0];
  const comparisonModels = pricingModels.slice(1);

  function splitFee(price) {
    const parts = price.split(';');
    return {
      primary: parts[0].trim(),
      basis: parts.slice(1).join(';').trim(),
    };
  }

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Pricing' }]}
        eyebrow="Engagement models"
        title="Clear ways to start. Room to expand."
        copy="ROOT pricing depends on the kind of operating relationship you need: Diagnostic, managed RCM, DIRT/Data Intelligence, projects, credentialing, or full MSO partnership."
        offerLine="$2,500 fixed-fee Diagnostic"
      />
      <section className="contentSection" data-reveal>
        <article className="pricingFeatured glassCard">
          <p className="eyebrow">Featured entry offer</p>
          <h2>{diagnostic.name}</h2>
          <strong className="priceMetric">{diagnostic.price}</strong>
          <p className="priceBasis">{diagnostic.bestFor}</p>
          <div className="checkList compact">{diagnostic.includes.map((item) => <span key={item}><Check size={16} /> {item}</span>)}</div>
          <TrackedLink href={diagnostic.href} cta="book-diagnostic" location="pricing-featured" engagementType="diagnostic">
            {diagnostic.cta} <ArrowRight size={16} />
          </TrackedLink>
        </article>

        <div className="sectionHeading narrow">
          <p className="eyebrow">Compare models</p>
          <h2>Fee, basis, fit, and next step.</h2>
        </div>

        <div className="pricingComparisonWrap">
          <table className="pricingComparison">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Fee / basis</th>
                <th scope="col">Best fit</th>
                <th scope="col">Includes</th>
                <th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              {comparisonModels.map((model) => {
                const fee = splitFee(model.price);
                return (
                  <tr key={model.name}>
                    <th scope="row">{model.name}</th>
                    <td className="feeCell">
                      <strong>{fee.primary}</strong>
                      {fee.basis ? <small>{fee.basis}</small> : null}
                    </td>
                    <td>{model.bestFor}</td>
                    <td>{model.includes.join('; ')}</td>
                    <td>
                      <TrackedLink className="textLink" href={model.href} cta={model.cta.toLowerCase().replaceAll(' ', '-')} location="pricing-table" engagementType={model.name.toLowerCase().replaceAll(' ', '-')}>
                        {model.cta} <ArrowRight size={16} />
                      </TrackedLink>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pricingMobileRecords">
          {comparisonModels.map((model) => {
            const fee = splitFee(model.price);
            return (
              <article className="pricingMobileRecord" key={model.name}>
                <h3>{model.name}</h3>
                <dl>
                  <div>
                    <dt>Fee / basis</dt>
                    <dd><strong>{fee.primary}</strong>{fee.basis ? ` — ${fee.basis}` : ''}</dd>
                  </div>
                  <div>
                    <dt>Best fit</dt>
                    <dd>{model.bestFor}</dd>
                  </div>
                  <div>
                    <dt>Includes</dt>
                    <dd>{model.includes.join('; ')}</dd>
                  </div>
                </dl>
                <TrackedLink className="textLink" href={model.href} cta={model.cta.toLowerCase().replaceAll(' ', '-')} location="pricing-mobile" engagementType={model.name.toLowerCase().replaceAll(' ', '-')}>
                  {model.cta} <ArrowRight size={16} />
                </TrackedLink>
              </article>
            );
          })}
        </div>
      </section>
      <section className="featureBand darkBand" data-reveal>
        <div>
          <p className="eyebrow">Boundary</p>
          <h3>Scope and outcomes</h3>
        </div>
        <p className="pricingBoundaryNote">Revenue-cycle outcomes depend on source data quality, payer behavior, payer contracts, practice workflow, documentation, coding, staffing, and implementation discipline. Formal scope and fees are governed by the written agreement.</p>
      </section>
      <SectionCta title="Ready to compare against your current operating cost?" copy="Start with the fixed-fee Diagnostic or talk through a broader managed engagement." />
    </>
  );
}

export function ResourcesHubPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Resources' }]} eyebrow="Guides" title="Operating guides for independent practices." copy="Practical resources for revenue leakage, aging A/R, denial management, credentialing operations, practice KPIs, and healthcare automation readiness." />
      <section className="contentSection" data-reveal><ResourceCards /></section>
    </>
  );
}

export function ResourceArticlePage({ article }) {
  const proofAsset = proofPlacementByResourceSlug[article.slug];
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Resources', href: '/resources/' }, { label: article.title }]} eyebrow="Guide" title={article.title} copy={article.summary} cta={false} />
      <article className="articlePage" data-reveal>
        {article.sections.map(([title, copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}
        <section>
          <h2>Further reading</h2>
          <div className="sourceList">{article.sources.map(([label, href]) => <a key={href} href={href}>{label} <ArrowRight size={14} /></a>)}</div>
        </section>
        <ResourceProofCallout assetKey={proofAsset} />
      </article>
      <SectionCta title="Turn the guide into a plan." copy="ROOT can apply this thinking to deidentified practice data through the Revenue Optimization Diagnostic." />
    </>
  );
}

export function DiagnosticPage() {
  return (
    <>
      <section className="diagnosticHero" data-reveal>
        <div>
          <p className="eyebrow">Revenue Optimization Diagnostic</p>
          <h1>See where your revenue system is leaking.</h1>
          <p className="lede">For a fixed fee of $2,500, ROOT analyzes A/R, denials, workflow, payer signals, credentialing visibility, and operating reporting, then turns the findings into a prioritized 90-day roadmap.</p>
          <ul className="diagnosticSummaryLines">
            <li><Check size={17} aria-hidden="true" /> Fixed-fee $2,500 entry assessment</li>
            <li><Check size={17} aria-hidden="true" /> Prioritized opportunity register for leadership</li>
            <li><Check size={17} aria-hidden="true" /> 90-day operating roadmap with owners</li>
          </ul>
          <p className="trustLine"><ShieldCheck size={16} /> Start with deidentified reports. PHI-enabled exchange opens only after the required agreement and secure channel are active.</p>
          <a className="button secondary diagnosticFormAnchor" href="#diagnostic-form">Start the inquiry form</a>
        </div>
        <div id="diagnostic-form"><InquiryForm variant="diagnostic" /></div>
      </section>
      <section className="contentSection diagnosticInputsSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">What ROOT reviews</p>
          <h2>Inputs become analysis, analysis becomes an operating decision.</h2>
          <p>The Diagnostic is designed to make the business problem legible without turning the public website into a data intake portal.</p>
        </div>
        <div className="diagnosticFlowGrid">
          <div className="glassCard inputChecklist">
            <h3>1. Deidentified inputs</h3>
            {diagnosticInputs.map((item) => <span key={item}><Check size={16} aria-hidden="true" /> {item}</span>)}
          </div>
          <div className="glassCard inputChecklist">
            <h3>2. ROOT analysis</h3>
            {['Leakage and aging concentration', 'Denial root-cause and preventability', 'Payer and workflow constraints', 'Credentialing visibility and revenue timing', 'Prioritized opportunity register'].map((item) => <span key={item}><Activity size={16} aria-hidden="true" /> {item}</span>)}
          </div>
          <div className="glassCard inputChecklist">
            <h3>3. Deliverables</h3>
            {diagnosticDeliverables.map((item) => <span key={item}><ClipboardCheck size={16} aria-hidden="true" /> {item}</span>)}
          </div>
        </div>
      </section>
      <DiagnosticSampleSection />
      <section className="contentSection faqSection" data-reveal><div className="sectionHeading narrow"><h2>Frequently asked questions</h2></div>{diagnosticFaq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Company' }, { label: 'About ROOT' }]} title="Built around the business side of independent medicine." copy="ROOT exists to give independent practices an accountable operating partner across revenue cycle, credentialing, practice operations, analytics, automation, and technology, without confusing business support with clinical authority." />
      <section className="contentSection twoColumnCopy" data-reveal><div><p className="eyebrow">How ROOT operates</p><h2>Revenue first. Evidence before complexity.</h2></div><div><p>ROOT prioritizes cash impact, client acquisition, delivery, retention, operational leverage, commercial credibility, automation, and then technical sophistication.</p><p>DIRT extends that model with analytical discipline: identify the constraint, quantify the opportunity, prioritize action, and measure what changes.</p></div></section>
      <section className="splitSection mutedBand" data-reveal><EditorialMedia media={{ src: mediaAssets.operationsCollaboration, alt: 'Healthcare operations collaboration in an independent-practice setting' }} /><div><p className="eyebrow">Operational partnership</p><h2>Built to work alongside the practice team.</h2><p>Photography on this site is editorial context only and does not represent ROOT clients, employees, facilities, partnerships, or results.</p></div></section>
      <SectionCta title="Bring us the number that does not make sense." label="Start a Conversation" href="/contact/" cta="talk-to-root" engagementType="consultation" />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <section className="contactPage" data-reveal>
        <div>
          <p className="eyebrow">Contact ROOT</p>
          <h1>Talk through your practice&apos;s operating problem.</h1>
          <p className="lede">Share deidentified commercial context about A/R, denials, reporting, credentialing, or practice operations. ROOT will route the conversation to the right next step.</p>
          <p className="trustLine"><ShieldCheck size={16} /> Do not submit PHI through this website.</p>
        </div>
        <InquiryForm />
      </section>
      <ContactMethodsPanel location="contact-page-outreach" />
    </>
  );
}

export function PrivacyPage() {
  return <section className="legalPage"><h1>Privacy</h1><p>ROOT's public website is designed for commercial information and deidentified inquiries. Do not submit patient names, dates of birth, medical record numbers, clinical details, insurance identifiers, or other Protected Health Information through public forms or email handoffs.</p><h2>Public inquiry data</h2><p>Information voluntarily provided for a commercial inquiry may include business contact information, practice name, provider count, operational concerns, and campaign attribution parameters. A future secure form endpoint will be documented before activation.</p><h2>Analytics</h2><p>Analytics must not be configured to collect PHI or sensitive form contents. URL parameters and event names must be reviewed before production analytics are enabled.</p><h2>Secure data exchange</h2><p>If an engagement requires sensitive or patient-level information, ROOT will establish the appropriate agreement, access controls, approved storage, retention rules, and secure transfer mechanism before accepting the data.</p></section>;
}

export function TermsPage() {
  return <section className="legalPage"><h1>Terms of Use</h1><p>This website provides general information about ROOT services and does not create a client relationship, guarantee financial outcomes, or constitute legal, coding, clinical, compliance, or reimbursement advice.</p><h2>No guarantees</h2><p>Revenue-cycle outcomes depend on source data quality, payer behavior, contractual terms, practice workflows, documentation, coding, patient responsibility, and other factors. Any engagement scope, fee, deliverable, and timeline is governed by the applicable written agreement.</p><h2>No PHI through public channels</h2><p>Users must not submit PHI through public website forms or public email handoffs.</p></section>;
}

export function ThankYouPage() {
  return <section className="statePage"><Check size={40} /><h1>Request received.</h1><p>Thank you. ROOT will review the deidentified commercial inquiry and follow up using the contact information provided.</p><TrackedLink href="/" cta="return-home" location="thank-you" engagementType="navigation">Return to ROOT</TrackedLink></section>;
}

export function NotFoundPage() {
  return <section className="statePage"><span className="errorCode">404</span><h1>This route does not go to revenue.</h1><p>The page may have moved. Return to ROOT or go directly to the Revenue Optimization Diagnostic.</p><div className="actions"><a className="button secondary" href="/">Home</a><TrackedLink href="/diagnostic/" cta="book-diagnostic" location="404" engagementType="diagnostic">Revenue Diagnostic</TrackedLink></div></section>;
}
