import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  CalendarCheck,
  Check,
  FileSearch,
  Gauge,
  Layers3,
  LockKeyhole,
  Network,
  Radar,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react';
import InquiryForm from './components/InquiryForm.jsx';
import { Breadcrumbs, ChannelButtons, GlassCard, SectionCta, TrackedLink } from './components/SiteChrome.jsx';
import {
  companyInfo,
  complianceStandards,
  diagnosticDeliverables,
  diagnosticFaq,
  platformNodes,
  pricingModels,
  resourceArticles,
  servicePages,
  solutionPages,
} from './siteData.js';

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
    eyebrow: '$2,500-$7,500/month when scoped',
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

function PageHero({ breadcrumbs, title, copy, eyebrow, cta = true }) {
  return (
    <section className="pageHero" data-reveal>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{copy}</p>
      {cta && (
        <TrackedLink href="/diagnostic/" cta="book-diagnostic" location="page-hero" engagementType="diagnostic">
          Book a Diagnostic <ArrowRight size={17} />
        </TrackedLink>
      )}
    </section>
  );
}

function PlatformOrbit({ compact = false }) {
  return (
    <div className={`platformOrbit ${compact ? 'compact' : ''}`} aria-label="ROOT platform architecture visual">
      <div className="orbitCore">
        <span>Clinical Practice</span>
        <strong>ROOT</strong>
        <small>Integrated operating layer</small>
      </div>
      {platformNodes.map((node, index) => (
        <div className="orbitNode" data-index={index} key={node.label}>
          <b>{node.label}</b>
          {!compact && <small>{node.copy}</small>}
        </div>
      ))}
    </div>
  );
}

function DirtCommandVisual() {
  const rows = [
    ['Aging landscape', 'Segment value, age, payer, status'],
    ['Denial intelligence', 'Pattern, preventability, recovery'],
    ['Recovery priority', 'Value at risk, owner, next action'],
    ['PracticeOps signals', 'Workflow friction and queue imbalance'],
  ];

  return (
    <div className="dirtVisual glassCard" aria-label="DIRT command center illustration">
      <div className="radarFace">
        <Radar size={34} />
        <span />
        <span />
        <span />
      </div>
      <div className="commandRows">
        {rows.map(([title, copy], index) => (
          <div key={title} style={{ '--level': `${54 + index * 11}%` }}>
            <b>{title}</b>
            <small>{copy}</small>
            <i />
          </div>
        ))}
      </div>
    </div>
  );
}

function EngagementCarousel() {
  const [index, setIndex] = useState(0);
  const item = carouselItems[index];

  function move(direction) {
    setIndex((current) => (current + direction + carouselItems.length) % carouselItems.length);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowLeft') move(-1);
  }

  return (
    <section className="carouselSection darkBand" data-reveal>
      <div>
        <p className="eyebrow">Engagement model</p>
        <h2>Start focused. Expand when the evidence earns it.</h2>
        <p>ROOT is not only a diagnostic company. The Diagnostic is the front door to a platform that can become managed RCM, data intelligence, projects, credentialing, or a full MSO partnership.</p>
      </div>
      <div className="engagementCarousel" role="region" aria-roledescription="carousel" aria-label="ROOT engagement models" aria-live="polite" tabIndex="0" onKeyDown={handleKeyDown}>
        <p className="eyebrow">{item.eyebrow}</p>
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
        <div className="carouselControls">
          <button type="button" aria-label="Previous engagement model" onClick={() => move(-1)}><ArrowLeft size={18} /></button>
          <span>{index + 1} / {carouselItems.length}</span>
          <button type="button" aria-label="Next engagement model" onClick={() => move(1)}><ArrowRight size={18} /></button>
        </div>
        <TrackedLink className="textLink" href={item.href} cta="engagement-carousel" location="engagement-carousel" engagementType={item.title.toLowerCase().replaceAll(' ', '-')}>
          Explore {item.title} <ArrowRight size={16} />
        </TrackedLink>
      </div>
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

function ServiceCards({ limit }) {
  const services = typeof limit === 'number' ? servicePages.slice(0, limit) : servicePages;
  return (
    <div className="cardGrid serviceGrid">
      {services.map((service) => (
        <a className="glassCard linkCard" href={`/services/${service.slug}/`} key={service.slug}>
          <span className="miniLabel">{service.family}</span>
          <h3>{service.title}</h3>
          <p>{service.summary}</p>
          <span>View service <ArrowRight size={15} /></span>
        </a>
      ))}
    </div>
  );
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

function ComplianceReadiness({ compact = false }) {
  const items = compact ? complianceStandards.slice(0, 4) : complianceStandards;
  return (
    <section className="contentSection complianceSection" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">Quality and data protection readiness</p>
        <h2>Built toward future certification discipline.</h2>
        <p>ROOT does not claim certification today. The MVP is structured so future quality, information-security, privacy, cloud, AI-governance, and HIPAA-readiness work has a clean operating foundation.</p>
      </div>
      <div className="cardGrid">
        {items.map((standard) => (
          <GlassCard key={standard.label}>
            <ShieldCheck size={22} />
            <h3>{standard.label}</h3>
            <p>{standard.posture}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function ContactMethodsPanel({ location = 'contact-methods' }) {
  return (
    <section className="contactMethods darkBand" data-reveal>
      <div>
        <p className="eyebrow">ROOT RCM LLC</p>
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
        <div className="virtualDesk glassCard">
          <p className="eyebrow">Coming soon</p>
          <h3>Chatbot and virtual front desk</h3>
          <p>Planned for future secure triage, scheduling support, service routing, and deidentified intake. PHI-enabled workflows will require agreements, access controls, approved storage, and documented safeguards before activation.</p>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <section className="homeHero fullBleedHero" data-reveal>
        <div className="heroCopy">
          <p className="eyebrow">Healthcare MSO + RCM + Operations + Technology</p>
          <h1>Run the business side of medicine better.</h1>
          <p className="lede">ROOT brings RCM, credentialing, practice operations, healthcare technology, automation, analytics, and DIRT intelligence into one partnership for independent medical practices.</p>
          <div className="actions">
            <TrackedLink href="/platform/" cta="explore-root" location="home-hero" engagementType="platform">
              Explore ROOT <ArrowRight size={17} />
            </TrackedLink>
            <TrackedLink className="button secondary" href="/diagnostic/" cta="book-diagnostic" location="home-hero" engagementType="diagnostic">
              Book Diagnostic
            </TrackedLink>
          </div>
          <p className="trustLine"><ShieldCheck size={16} /> Public website inquiries are deidentified. PHI is accepted only through an approved secure channel after required agreements and controls are in place.</p>
        </div>
        <PlatformOrbit compact />
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

      <section className="contentSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Platform first</p>
          <h2>ROOT is the operating layer around the clinical practice.</h2>
          <p>Clinical care remains the practice. ROOT supports the business system around it: revenue, credentialing, operations, technology, automation, analytics, and intelligence.</p>
        </div>
        <PlatformOrbit />
      </section>

      <section className="splitSection darkBand" data-reveal>
        <div>
          <p className="eyebrow">ROOT + DIRT</p>
          <h2>Execution with intelligence behind it.</h2>
          <p>DIRT is not a separate story competing with ROOT. It is the intelligence layer that helps ROOT identify leakage, understand denial patterns, prioritize A/R recovery, and expose PracticeOps constraints.</p>
          <TrackedLink className="textLink" href="/technology/dirt/" cta="explore-dirt" location="home-dirt" engagementType="technology">
            Explore DIRT <ArrowRight size={16} />
          </TrackedLink>
        </div>
        <DirtCommandVisual />
      </section>

      <section className="contentSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Solve the operating constraint</p>
          <h2>Solutions by the problem your practice feels.</h2>
          <p>Start with the symptom leadership can see, then trace it back to the revenue-cycle, credentialing, workflow, technology, or visibility issue causing it.</p>
        </div>
        <SolutionCards limit={6} />
      </section>

      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Service breadth</p>
          <h2>The full business side of medicine, under one roof.</h2>
        </div>
        <ServiceCards limit={9} />
      </section>

      <EngagementCarousel />
      <ComplianceReadiness compact />

      <section className="diagnosticBanner" data-reveal>
        <div>
          <p className="eyebrow">Revenue Optimization Diagnostic</p>
          <h2>The paid entry offer, not the whole company.</h2>
          <p>A fixed-fee $2,500 engagement for practices that want evidence before making a larger RCM, technology, or MSO decision.</p>
        </div>
        <div className="checkList compact">
          {diagnosticDeliverables.slice(0, 4).map((item) => <span key={item}><Check size={16} /> {item}</span>)}
        </div>
        <TrackedLink href="/diagnostic/" cta="book-diagnostic" location="home-diagnostic-banner" engagementType="diagnostic">
          See Diagnostic <ArrowRight size={17} />
        </TrackedLink>
      </section>

      <section className="contentSection" data-reveal>
        <div className="sectionHeading">
          <p className="eyebrow">Resources</p>
          <h2>Useful thinking before the first call.</h2>
        </div>
        <ResourceCards limit={3} />
      </section>
      <ContactMethodsPanel location="home-outreach" />
    </>
  );
}

export function PlatformPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Platform' }]} eyebrow="Healthcare MSO platform" title="One operating layer around the business side of medicine." copy="ROOT integrates revenue operations, credentialing, practice operations, healthcare IT, automation, analytics, and DIRT intelligence so practices can act on the whole system instead of isolated symptoms." />
      <section className="contentSection" data-reveal>
        <PlatformOrbit />
      </section>
      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading narrow"><p className="eyebrow">Architecture</p><h2>Clinical practice at the center. ROOT around the business system.</h2></div>
        <div className="cardGrid">
          {platformNodes.map((node) => <GlassCard key={node.label}><Network size={22} /><h3>{node.label}</h3><p>{node.copy}</p></GlassCard>)}
        </div>
      </section>
      <EngagementCarousel />
      <ComplianceReadiness />
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
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Solutions', href: '/solutions/' }, { label: page.title }]} eyebrow="Solution" title={page.title} copy={page.summary} />
      <section className="splitSection" data-reveal>
        <div><p className="eyebrow">Problem</p><h2>What is really happening</h2><p>{page.problem}</p></div>
        <div className="glassCard emphasisCard"><p className="eyebrow">ROOT response</p><h3>{page.rootResponse}</h3></div>
      </section>
      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading narrow"><p className="eyebrow">Connected services</p><h2>How ROOT handles it</h2></div>
        <div className="pillGrid">{page.services.map((service) => <span key={service}>{service}</span>)}</div>
      </section>
      <section className="splitSection darkBand" data-reveal>
        <DirtCommandVisual />
        <div><p className="eyebrow">DIRT contribution</p><h2>Intelligence makes the work more precise.</h2><p>{page.dirt}</p></div>
      </section>
      <SectionCta title={page.cta} copy="Start with the fixed-fee Diagnostic or talk with ROOT about a broader managed operating need." />
    </>
  );
}

export function ServicesHubPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Services' }]} eyebrow="Healthcare MSO services" title="The service catalog for a better-run practice." copy="ROOT supports independent practices across RCM, medical billing, A/R recovery, denials, payment posting, patient balances, credentialing, healthcare IT, automation, analytics, and operations." />
      <section className="contentSection" data-reveal><ServiceCards /></section>
      <SectionCta title="Need a managed partner, not just advice?" copy="ROOT can begin with a Diagnostic, a focused project, or a broader MSO model depending on the evidence." />
    </>
  );
}

export function ServicePage({ service }) {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Services', href: '/services/' }, { label: service.title }]} eyebrow={service.family} title={service.title} copy={service.summary} />
      <section className="splitSection" data-reveal>
        <div><p className="eyebrow">Best fit</p><h2>Who this is for</h2><p>{service.buyer}</p><TrackedLink className="textLink" href={service.related} cta="related-solution" location={`service-${service.slug}`} engagementType="solution">Related solution <ArrowRight size={16} /></TrackedLink></div>
        <div className="glassCard stackCard"><p className="eyebrow">Engagement</p><h3>{service.engagement}</h3><p>{service.pricing}</p></div>
      </section>
      <section className="contentSection mutedBand" data-reveal>
        <div className="sectionHeading narrow"><p className="eyebrow">Deliverables</p><h2>What ROOT can own</h2></div>
        <div className="cardGrid compactCards">{service.deliverables.map((item) => <GlassCard key={item}><Check size={18} /><h3>{item}</h3></GlassCard>)}</div>
      </section>
      <section className="featureBand darkBand" data-reveal>
        <div><p className="eyebrow">DIRT advantage</p><h2>Service work informed by better signals.</h2></div>
        <p>{service.dirt}</p>
      </section>
      <SectionCta title={`Talk to ROOT about ${service.title}.`} copy="Share deidentified commercial context and ROOT will route the conversation to the right next step." label="Talk to ROOT" href="/contact/" cta="talk-to-root" engagementType="consultation" />
    </>
  );
}

export function TechnologyHubPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Technology' }]} eyebrow="Healthcare technology + intelligence" title="Technology that serves the operating model." copy="ROOT uses healthcare IT alignment, workflow automation, reporting architecture, analytics, and DIRT intelligence to make the business side of medicine more visible and more governable." />
      <section className="splitSection" data-reveal>
        <div><p className="eyebrow">DIRT command layer</p><h2>From fragmented exports to prioritized decisions.</h2><p>DIRT turns operational and revenue-cycle data into views that show leakage, aging landscape, denial intelligence, recovery prioritization, PracticeOps signals, and command-center visibility.</p></div>
        <DirtCommandVisual />
      </section>
      <section className="contentSection mutedBand" data-reveal>
        <div className="cardGrid">
          {[
            ['Healthcare IT', 'System workflows, access, support model, and source-data reliability.', '/services/healthcare-it/'],
            ['Workflow Automation', 'Stable administrative workflows converted into monitored process support.', '/services/workflow-automation/'],
            ['Reporting & Analytics', 'Revenue and operations reporting that supports decisions and accountability.', '/services/reporting-analytics/'],
            ['DIRT Intelligence', 'The intelligence layer for leakage, denial, A/R, and PracticeOps signals.', '/technology/dirt/'],
          ].map(([title, copy, href]) => <a className="glassCard linkCard" href={href} key={title}><Blocks size={22} /><h3>{title}</h3><p>{copy}</p><span>Explore <ArrowRight size={15} /></span></a>)}
        </div>
      </section>
    </>
  );
}

export function DirtPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Technology', href: '/technology/' }, { label: 'DIRT Intelligence' }]} eyebrow="Data Intelligence for Revenue Transformation" title="The intelligence layer inside ROOT." copy="DIRT helps ROOT detect leakage, understand denial patterns, prioritize A/R recovery, expose PracticeOps signals, and turn data into operating decisions." />
      <section className="splitSection darkBand" data-reveal>
        <DirtCommandVisual />
        <div><p className="eyebrow">Command center</p><h2>Radar for the revenue system.</h2><p>DIRT is presented as ROOT's intelligence capability, not as an unsupported finished SaaS claim. It supports service delivery, Diagnostic analysis, and operating visibility.</p></div>
      </section>
      <section className="contentSection" data-reveal>
        <div className="cardGrid">
          {['Revenue leakage detection', 'Aging landscape', 'Denial intelligence', 'Recovery prioritization', 'PracticeOps signals', 'Leadership command view'].map((item) => <GlassCard key={item}><Gauge size={22} /><h3>{item}</h3><p>Signal, context, owner, and next action made easier to see.</p></GlassCard>)}
        </div>
      </section>
      <SectionCta title="Want DIRT applied to your revenue cycle?" copy="The Diagnostic is the fastest path from current data to a prioritized opportunity register." />
    </>
  );
}

export function PricingPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Pricing' }]} eyebrow="Engagement models" title="Clear ways to start. Room to expand." copy="ROOT pricing depends on the kind of operating relationship you need: Diagnostic, managed RCM, DIRT/Data Intelligence, projects, credentialing, or full MSO partnership." />
      <section className="contentSection" data-reveal>
        <div className="pricingGrid">
          {pricingModels.map((model) => (
            <GlassCard className="pricingCard" key={model.name}>
              <h3>{model.name}</h3>
              <strong>{model.price}</strong>
              <p>{model.bestFor}</p>
              <div className="checkList compact">{model.includes.map((item) => <span key={item}><Check size={16} /> {item}</span>)}</div>
              <TrackedLink className="textLink" href={model.href} cta={model.cta.toLowerCase().replaceAll(' ', '-')} location="pricing-card" engagementType={model.name.toLowerCase().replaceAll(' ', '-')}>{model.cta} <ArrowRight size={16} /></TrackedLink>
            </GlassCard>
          ))}
        </div>
      </section>
      <section className="featureBand darkBand" data-reveal><div><p className="eyebrow">Boundary</p><h2>No public guarantee claims.</h2></div><p>Revenue-cycle outcomes depend on source data quality, payer behavior, payer contracts, practice workflow, documentation, coding, staffing, and implementation discipline. Formal scope and fees are governed by the written agreement.</p></section>
      <ComplianceReadiness />
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
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Resources', href: '/resources/' }, { label: article.title }]} eyebrow="Guide" title={article.title} copy={article.summary} cta={false} />
      <article className="articlePage" data-reveal>
        {article.sections.map(([title, copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}
        <section>
          <h2>Further reading</h2>
          <div className="sourceList">{article.sources.map(([label, href]) => <a key={href} href={href}>{label} <ArrowRight size={14} /></a>)}</div>
        </section>
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
          <div className="checkList">{diagnosticDeliverables.map((item) => <span key={item}><Check size={17} /> {item}</span>)}</div>
          <p className="trustLine"><ShieldCheck size={16} /> Start with deidentified reports. PHI-enabled exchange opens only after the required agreement and secure channel are active.</p>
        </div>
        <div><InquiryForm variant="diagnostic" /></div>
      </section>
      <section className="contentSection faqSection" data-reveal><div className="sectionHeading narrow"><h2>Frequently asked questions</h2></div>{diagnosticFaq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Company' }, { label: 'About ROOT' }]} title="Built around the business side of independent medicine." copy="ROOT exists to give independent practices an accountable operating partner across revenue cycle, credentialing, practice operations, analytics, automation, and technology, without confusing business support with clinical authority." />
      <section className="contentSection twoColumnCopy" data-reveal><div><p className="eyebrow">How ROOT operates</p><h2>Revenue first. Evidence before complexity.</h2></div><div><p>ROOT prioritizes cash impact, client acquisition, delivery, retention, operational leverage, commercial credibility, automation, and then technical sophistication.</p><p>DIRT extends that model with analytical discipline: identify the constraint, quantify the opportunity, prioritize action, and measure what changes.</p></div></section>
      <SectionCta title="Bring us the number that does not make sense." label="Start a Conversation" href="/contact/" cta="talk-to-root" engagementType="consultation" />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <section className="contactPage" data-reveal>
        <div><p className="eyebrow">Contact ROOT</p><h1>Bring us the operating problem you cannot quite see.</h1><p className="lede">A/R rising? Denials repeating? Reporting unreliable? Credentialing stalled? Share deidentified commercial context and ROOT will route the conversation to the right next step.</p><p className="trustLine"><ShieldCheck size={16} /> Do not submit PHI through this website.</p></div>
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
