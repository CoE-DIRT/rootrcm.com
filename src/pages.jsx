import { Activity, ArrowRight, BarChart3, Check, Database, FileSearch, Layers3, ShieldCheck, Workflow } from 'lucide-react';
import InquiryForm from './components/InquiryForm.jsx';
import { Breadcrumbs, GlassCard, SectionCta } from './components/SiteChrome.jsx';
import { diagnosticDeliverables, diagnosticFaq, rcmCapabilities } from './siteData.js';

const problems = [
  ['High / Aging A/R', 'Cash remains trapped in older aging buckets when payer follow-up, ownership, and escalation are inconsistent.'],
  ['Denial Backlogs', 'Denials accumulate when teams work transactions without correcting the upstream workflow creating them.'],
  ['Operational Blind Spots', 'Disconnected reports make it difficult to see which payer, process, location, or workflow is constraining cash.'],
];

function PageHero({ breadcrumbs, title, copy, cta = true, eyebrow }) {
  return (
    <section className="pageHero">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{copy}</p>
      {cta && <a className="button primary" href="/diagnostic/">Book a Revenue Diagnostic <ArrowRight size={17} /></a>}
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <section className="homeHero">
        <div className="heroCopy">
          <p className="eyebrow">Revenue Cycle + Practice Operations + Technology</p>
          <h1>Stop Revenue Leakage.<br /><em>Build Scalable Operations.</em></h1>
          <p className="lede">ROOT is the RCM, operations, and technology partner for independent physician practices. We combine healthcare operations expertise with the DIRT intelligence layer to find revenue leakage, improve workflows, and create decision-grade operating visibility.</p>
          <div className="actions">
            <a className="button primary" href="/diagnostic/">Book a Revenue Diagnostic — $2,500 <ArrowRight size={17} /></a>
            <a className="button secondary" href="/services/rcm/">Explore Our Solutions</a>
          </div>
          <p className="trustLine"><ShieldCheck size={16} /> Public website inquiries are deidentified. PHI is accepted only through an approved secure channel after required agreements and controls are in place.</p>
        </div>
        <div className="signalPanel glassCard" aria-label="Illustrative ROOT revenue intelligence view">
          <div className="signalTop"><span>Revenue intelligence</span><span className="signalState">Illustrative view</span></div>
          <div className="signalTitle">From backlog to prioritized action.</div>
          <div className="signalFlow">
            <span><Database size={18} /> Source data</span>
            <ArrowRight size={16} />
            <span><FileSearch size={18} /> Root cause</span>
            <ArrowRight size={16} />
            <span><Activity size={18} /> Next action</span>
          </div>
          <div className="signalRows">
            <div><b>A/R aging</b><span>Segment by value, payer, age, recoverability</span></div>
            <div><b>Denials</b><span>Group patterns and feed root causes upstream</span></div>
            <div><b>Underpayments</b><span>Surface variance for targeted review</span></div>
          </div>
        </div>
      </section>

      <section className="trustBand" aria-label="ROOT operating principles">
        <span>Data-driven</span><span>Independent-practice focus</span><span>No-PHI public intake</span><span>Decision-grade reporting</span>
      </section>

      <section className="contentSection">
        <div className="sectionHeading">
          <p className="eyebrow">The constraint is rarely one claim</p>
          <h2>Is your practice growing, but your cash flow is not?</h2>
          <p>Revenue problems compound across people, payer rules, front-end workflows, credentialing, reporting, and follow-up. ROOT works across the operating system rather than treating each symptom in isolation.</p>
        </div>
        <div className="threeGrid">
          {problems.map(([title, copy]) => <GlassCard key={title}><h3>{title}</h3><p>{copy}</p></GlassCard>)}
        </div>
      </section>

      <section className="splitSection darkBand">
        <div>
          <p className="eyebrow">ROOT</p>
          <h2>Managed RCM & Practice Operations</h2>
          <p>ROOT takes accountable ownership across billing, A/R recovery, denial management, credentialing, reporting, and operational workflows. The objective is not more activity—it is a better-performing revenue system.</p>
          <a className="textLink" href="/services/rcm/">See Revenue Cycle Management <ArrowRight size={16} /></a>
        </div>
        <div className="dividerVisual">
          <Layers3 size={28} />
          <strong>One operating partner</strong>
          <span>Revenue cycle</span><span>Practice operations</span><span>Technology</span><span>Analytics</span>
        </div>
      </section>

      <section className="splitSection">
        <div className="dataVisual glassCard">
          <BarChart3 size={30} />
          <strong>DIRT</strong>
          <span>Data Intelligence for Revenue Transformation</span>
          <div className="miniBars">{[38, 67, 53, 82, 61, 91].map((height) => <i key={height} style={{ height: `${height}%` }} />)}</div>
        </div>
        <div>
          <p className="eyebrow">Powered by DIRT</p>
          <h2>Revenue intelligence, not another static report.</h2>
          <p>DIRT is the intelligence layer behind ROOT: designed to normalize revenue-cycle signals, expose leakage patterns, analyze denials, and prioritize operational action based on financial impact.</p>
          <a className="textLink" href="/technology/dirt/">Explore DIRT Intelligence <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="diagnosticBanner">
        <div>
          <p className="eyebrow">Revenue Optimization Diagnostic</p>
          <h2>Find the leakage. Build the 90-day plan.</h2>
          <p>A fixed-fee $2,500 engagement for practices that want evidence before making a larger RCM or technology decision.</p>
        </div>
        <div className="checkList compact">
          {diagnosticDeliverables.slice(0, 4).map((item) => <span key={item}><Check size={16} /> {item}</span>)}
        </div>
        <a className="button primary" href="/diagnostic/">See the Diagnostic <ArrowRight size={17} /></a>
      </section>
    </>
  );
}

export function RcmPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Solutions' }, { label: 'Revenue Cycle Management' }]} title="Intelligent Revenue Cycle Management" copy="End-to-end revenue-cycle execution for independent practices, strengthened by analytical discipline and accountable follow-through." />
      <section className="contentSection">
        <div className="sectionHeading narrow"><p className="eyebrow">Core capabilities</p><h2>Work the revenue cycle—and improve the system producing it.</h2></div>
        <div className="capabilityGrid">
          {rcmCapabilities.map(([title, copy], index) => <GlassCard key={title} className="capabilityCard"><span>0{index + 1}</span><h3 id={title.includes('A/R') ? 'ar-recovery' : title.includes('Denial') ? 'denials' : title.includes('Credentialing') ? 'credentialing' : undefined}>{title}</h3><p>{copy}</p></GlassCard>)}
        </div>
      </section>
      <section className="darkBand featureBand">
        <div><p className="eyebrow">The DIRT difference</p><h2>Most billing teams work a queue. ROOT analyzes the system.</h2></div>
        <p>DIRT helps organize payer behavior, denial patterns, aging, and opportunity signals so operational work can be sequenced around financial impact rather than simply worked oldest-first.</p>
      </section>
      <SectionCta title="Ready to see what your revenue cycle is hiding?" copy="Start with the fixed-fee Revenue Optimization Diagnostic before making a larger operating commitment." />
    </>
  );
}

export function PracticeOpsPage() {
  const capabilities = [
    ['Workflow Design', 'Map ownership, handoffs, exceptions, and escalation paths from front desk to final payment.'],
    ['Reporting & KPI Discipline', 'Create an operating cadence around meaningful measures instead of disconnected spreadsheet activity.'],
    ['Healthcare IT', 'Align EHR/PM workflows, integrations, permissions, automation, and support with the operating model.'],
    ['Credentialing Operations', 'Reduce enrollment ambiguity through status tracking, ownership, payer follow-up, and revalidation controls.'],
    ['Automation', 'Remove repetitive administrative work where automation is safe, auditable, and commercially useful.'],
    ['Management Systems', 'Define roles, controls, review rhythms, and evidence so operations scale without founder-level firefighting.'],
  ];
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Solutions' }, { label: 'Practice Operations & IT' }]} title="Practice Operations That Scale With the Practice" copy="ROOT connects workflow, reporting, technology, controls, and revenue operations so independent practices can grow without multiplying administrative friction." />
      <section className="contentSection"><div className="capabilityGrid">{capabilities.map(([title, copy]) => <GlassCard key={title}><Workflow size={22} /><h3>{title}</h3><p>{copy}</p></GlassCard>)}</div></section>
      <SectionCta title="Fix the operating constraint behind the revenue problem." copy="The Revenue Optimization Diagnostic identifies where workflow and revenue-cycle breakdowns are creating measurable friction." />
    </>
  );
}

export function DirtPage() {
  const intelligence = [
    ['Revenue Leakage Detection', 'Surface where value is being lost across aging, denials, underpayments, workflow defects, and payer behavior.'],
    ['Denial Intelligence', 'Move from denial counts to patterns, causes, recurrence, preventability, and prioritized corrective action.'],
    ['PracticeOps Analytics', 'Connect revenue outcomes to operational signals so practice leadership can see the constraint earlier.'],
    ['Workflow Prioritization', 'Organize queues around financial value, recoverability, aging, and operational risk rather than raw volume alone.'],
  ];
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Technology' }, { label: 'DIRT Intelligence' }]} eyebrow="Data Intelligence for Revenue Transformation" title="Turn Revenue-Cycle Data Into Operating Decisions" copy="DIRT is ROOT’s analytics and intelligence layer. It is designed to transform fragmented revenue-cycle data into prioritized signals for action." />
      <section className="contentSection"><div className="twoGrid">{intelligence.map(([title, copy]) => <GlassCard key={title}><BarChart3 size={22} /><h3>{title}</h3><p>{copy}</p></GlassCard>)}</div></section>
      <section className="darkBand featureBand"><div><p className="eyebrow">Commercial boundary</p><h2>Sell the outcome now. Build the platform deliberately.</h2></div><p>For the public MVP, DIRT is presented as ROOT’s intelligence capability—not as a finished SaaS product. Product claims, integrations, and customer outcomes will only be published when the evidence exists.</p></section>
      <SectionCta title="Want to see DIRT applied to your revenue cycle?" copy="The Diagnostic is the fastest path from your current data to a prioritized opportunity register and 90-day roadmap." />
    </>
  );
}

export function DiagnosticPage() {
  return (
    <>
      <section className="diagnosticHero">
        <div>
          <p className="eyebrow">Revenue Optimization Diagnostic</p>
          <h1>Stop guessing. See where your revenue is leaking.</h1>
          <p className="lede">For a fixed fee of $2,500, ROOT performs a focused analysis of A/R, denials, workflow, payer signals, and operating visibility—then turns the findings into a prioritized 90-day roadmap.</p>
          <div className="checkList">{diagnosticDeliverables.map((item) => <span key={item}><Check size={17} /> {item}</span>)}</div>
          <p className="trustLine"><ShieldCheck size={16} /> Start with deidentified reports. PHI-enabled exchange is opened only after the required agreement and secure channel are active.</p>
        </div>
        <div><InquiryForm variant="diagnostic" /></div>
      </section>
      <section className="contentSection faqSection"><div className="sectionHeading narrow"><h2>Frequently asked questions</h2></div>{diagnosticFaq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Company' }, { label: 'About ROOT' }]} title="Built Around the Business of Independent Medicine" copy="ROOT exists to give independent practices an accountable operating partner across revenue cycle, practice operations, analytics, and technology—without confusing business support with clinical authority." />
      <section className="contentSection twoColumnCopy"><div><p className="eyebrow">How we operate</p><h2>Revenue first. Evidence before complexity.</h2></div><div><p>ROOT prioritizes cash impact, client acquisition, delivery, retention, operational leverage, commercial credibility, automation, and then technical sophistication—in that order.</p><p>DIRT extends that model with analytical rigor: identify the constraint, quantify the opportunity, prioritize action, and measure what changes.</p></div></section>
      <SectionCta title="Bring us the revenue number that does not make sense." label="Start a Conversation" href="/contact/" />
    </>
  );
}

export function ContactPage() {
  return (
    <section className="contactPage">
      <div><p className="eyebrow">Contact ROOT</p><h1>Bring us the number that does not make sense.</h1><p className="lede">A/R rising? Denials repeating? Reporting unreliable? Credentialing stalled? Share the deidentified operating context and we will route the conversation to the right next step.</p><p className="trustLine"><ShieldCheck size={16} /> Do not submit PHI through this website.</p></div>
      <InquiryForm />
    </section>
  );
}

export function PrivacyPage() {
  return <section className="legalPage"><h1>Privacy</h1><p>ROOT’s public website is designed for commercial information and deidentified inquiries. Do not submit patient names, dates of birth, medical record numbers, clinical details, insurance identifiers, or other Protected Health Information through public forms or email handoffs.</p><h2>Public inquiry data</h2><p>Information voluntarily provided for a commercial inquiry may include business contact information, practice name, provider count, operational concerns, and campaign attribution parameters. A future secure form endpoint will be documented before activation.</p><h2>Analytics</h2><p>Analytics must not be configured to collect PHI or sensitive form contents. URL parameters and event names must be reviewed before production analytics are enabled.</p><h2>Secure data exchange</h2><p>If an engagement requires sensitive or patient-level information, ROOT will establish the appropriate agreement, access controls, approved storage, retention rules, and secure transfer mechanism before accepting the data.</p></section>;
}

export function TermsPage() {
  return <section className="legalPage"><h1>Terms of Use</h1><p>This website provides general information about ROOT services and does not create a client relationship, guarantee financial outcomes, or constitute legal, coding, clinical, compliance, or reimbursement advice.</p><h2>No guarantees</h2><p>Revenue-cycle outcomes depend on source data quality, payer behavior, contractual terms, practice workflows, documentation, coding, patient responsibility, and other factors. Any engagement scope, fee, deliverable, and timeline is governed by the applicable written agreement.</p><h2>No PHI through public channels</h2><p>Users must not submit PHI through public website forms or public email handoffs.</p></section>;
}

export function ThankYouPage() {
  return <section className="statePage"><Check size={40} /><h1>Request received.</h1><p>Thank you. ROOT will review the deidentified commercial inquiry and follow up using the contact information provided.</p><a className="button primary" href="/">Return to ROOT</a></section>;
}

export function NotFoundPage() {
  return <section className="statePage"><span className="errorCode">404</span><h1>This route does not go to revenue.</h1><p>The page may have moved. Return to ROOT or go directly to the Revenue Optimization Diagnostic.</p><div className="actions"><a className="button secondary" href="/">Home</a><a className="button primary" href="/diagnostic/">Revenue Diagnostic</a></div></section>;
}
