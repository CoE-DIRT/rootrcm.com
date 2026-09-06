import { useMemo, useState } from 'react';
import { ArrowRight, Check, Copy, Mail, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { buildInquiryMailto, buildInquirySummary } from './modules/glass-core/inquiryTemplate.js';
import { useGlassRefraction } from './modules/glass-core/useGlassRefraction.js';

const services = [
  [
    '01',
    'MSO Administration',
    'Centralized non-clinical operations for practices that need business infrastructure without weakening clinical control.',
  ],
  [
    '02',
    'Revenue Cycle Management',
    'End-to-end billing operations engineered around clean claims, faster reimbursement, and accountable follow-through.',
  ],
  [
    '03',
    'A/R Recovery & Denials',
    'Root-cause analysis and disciplined recovery for aging balances, recurring denials, and silent revenue leakage.',
  ],
  [
    '04',
    'Credentialing',
    'Provider enrollment, revalidation, payer follow-up, and status visibility without fragmented handoffs.',
  ],
  [
    '05',
    'Practice Operations',
    'Workflows, controls, reporting, and operating discipline connecting the front desk to final payment.',
  ],
  [
    '06',
    'Healthcare IT',
    'PHI-aware EHR, cybersecurity, automation, and systems support for regulated healthcare workflows.',
  ],
  [
    '07',
    'Revenue Intelligence',
    'Actionable analytics for payer behavior, denial patterns, productivity, aging, and collection performance.',
  ],
];

const msoFunctions = [
  ['Financial Management', 'Billing, coding, accounts receivable, payment controls, and executive reporting.'],
  ['Human Resources', 'Recruiting, training, role clarity, workforce coordination, and scalable admin support.'],
  ['Regulatory Compliance', 'HIPAA, OSHA, OIG, CPOM-aware governance, policies, and operational evidence.'],
  ['IT & Infrastructure', 'EHR implementation, secure workflows, cybersecurity, automations, and helpdesk support.'],
  ['Supply Chain', 'Vendor coordination, group purchasing support, equipment tracking, and admin oversight.'],
  ['Marketing & Growth', 'Patient acquisition support, brand systems, practice visibility, and growth operations.'],
];

const benefits = [
  ['Scalability', 'Economies of scale for independent practices without hospital-system complexity.'],
  ['Efficiency', 'Standardized workflows that reduce overhead, defects, rework, and avoidable admin burden.'],
  ['Investment Readiness', 'A CPOM-conscious operating model that supports compliant healthcare investment structures.'],
];

const methodSteps = [
  ['01', 'Diagnose', 'Map the revenue flow and identify preventable loss.'],
  ['02', 'Prioritize', 'Rank interventions by cash impact, risk, and effort.'],
  ['03', 'Execute', 'Implement controls with clear ownership and evidence.'],
  ['04', 'Protect', 'Route PHI through approved systems, BAAs, access controls, and audit-ready workflows.'],
  ['05', 'Instrument', 'Measure outcomes and expose the next constraint.'],
];

const deliverables = [
  'A/R and denial opportunity analysis',
  'Workflow and control assessment',
  'MSO operating gap matrix',
  'PHI intake and compliance readiness review',
  'Prioritized 90-day action roadmap',
  'Executive findings readout',
];

const emptyInquiry = {
  name: '',
  email: '',
  organization: '',
  focus: '',
  noPhi: false,
};

export default function App() {
  const [open, setOpen] = useState(false);
  const [inquiry, setInquiry] = useState(emptyInquiry);
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);
  const glass = useGlassRefraction();

  const canSubmit = inquiry.name && inquiry.email && inquiry.organization && inquiry.focus && inquiry.noPhi;
  const mailto = useMemo(() => (submitted ? buildInquiryMailto(submitted) : ''), [submitted]);
  const summary = useMemo(() => (submitted ? buildInquirySummary(submitted) : ''), [submitted]);

  const updateInquiry = (field) => (event) => {
    const value = field === 'noPhi' ? event.target.checked : event.target.value;
    setInquiry((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitted(inquiry);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <main className="glass-theme">
      <header>
        <a className="brand" href="#top">
          <b>R</b>
          <span>
            ROOT<small>Revenue Operations & Outcomes Technology</small>
          </span>
        </a>
        <nav className={open ? 'open' : ''}>
          <a href="#mso">MSO Platform</a>
          <a href="#services">Capabilities</a>
          <a href="#method">How we work</a>
          <a href="#diagnostic">Diagnostic</a>
          <a className="navCta" href="#contact">
            Start a conversation <ArrowRight size={15} />
          </a>
        </nav>
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">RCM + Operations + Technology</p>
          <h1>
            Find the friction.
            <br />
            <em>Recover the revenue.</em>
          </h1>
          <p className="lede">
            ROOT is a PHI-capable Management Services Organization platform for independent medical practices:
            non-clinical administration, revenue operations, compliance, technology, and growth infrastructure
            under one accountable operating layer.
          </p>
          <div className="actions">
            <a className="button primary" href="#contact">
              Book a revenue diagnostic <ArrowRight size={17} />
            </a>
            <a className="button quiet" href="#services">
              Explore capabilities
            </a>
          </div>
          <p className="trust">
            <ShieldCheck size={16} />
            Built for US healthcare workflows. PHI moves only through approved secure channels after BAA and
            access controls.
          </p>
        </div>
        <div className="glass heroVisual" ref={glass}>
          <div className="visualHead">
            <span>Revenue signal</span>
            <span className="live">Analysis ready</span>
          </div>
          <div className="metric">
            <small>Opportunity identified</small>
            <strong>$184,720</strong>
            <span>Illustrative diagnostic view</span>
          </div>
          <div className="chart">
            {[34, 52, 47, 69, 61, 82, 76, 92].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="signals">
            <span>
              <b>41%</b>A/R aging
            </span>
            <span>
              <b>26%</b>denials
            </span>
            <span>
              <b>18%</b>underpayments
            </span>
          </div>
        </div>
      </section>

      <section className="proof">
        <p>Healthcare MSO platform for practices that need</p>
        <div>
          <span>PHI-ready operations</span>
          <span>CPOM-aware structure</span>
          <span>Cleaner claims</span>
          <span>Lower A/R</span>
          <span>Decision-grade reporting</span>
        </div>
      </section>

      <section className="section mso" id="mso">
        <div className="msoIntro">
          <p className="eyebrow">Management Services Organization</p>
          <h2>
            ROOT carries the business load
            <br />
            so physicians can carry the care.
          </h2>
          <p>
            A healthcare MSO handles the non-clinical, administrative, and business operations of medical
            practices. ROOT is structured for PHI-aware service delivery while respecting the Corporate Practice
            of Medicine doctrine: clinicians retain clinical judgment and patient-care authority while ROOT
            standardizes the business machine around them.
          </p>
        </div>
        <div className="msoGrid">
          {msoFunctions.map(([title, description]) => (
            <article key={title} className="glass">
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="benefitStrip">
          {benefits.map(([title, description]) => (
            <div key={title}>
              <strong>{title}</strong>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section services" id="services">
        <div>
          <p className="eyebrow">Capabilities</p>
          <h2>
            One operating partner.
            <br />
            Every revenue lever.
          </h2>
        </div>
        <p className="sectionLede">
          Billing performance is rarely a single-department problem. ROOT works as an MSO platform across
          people, process, protected data, technology, and growth operations to correct the system - not just
          chase symptoms.
        </p>
        <div className="serviceList">
          {services.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <ArrowRight size={20} />
            </article>
          ))}
        </div>
      </section>

      <section className="method" id="method">
        <div>
          <p className="eyebrow">Our operating model</p>
          <h2>We go to the root.</h2>
          <p>
            More activity does not fix a broken revenue cycle. We isolate the constraint, quantify the impact,
            protect PHI movement, and sequence the work around what moves cash first.
          </p>
        </div>
        <ol>
          {methodSteps.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section diagnostic" id="diagnostic">
        <div className="glass diagnosticPanel">
          <div>
            <p className="eyebrow">Fixed-scope engagement</p>
            <h2>Revenue Optimization Diagnostic</h2>
            <p>
              A focused assessment for practices that need evidence before expanding into a broader MSO,
              revenue operations, or PHI-enabled technology engagement.
            </p>
          </div>
          <div className="deliverables">
            {deliverables.map((item) => (
              <p key={item}>
                <Check size={17} />
                {item}
              </p>
            ))}
          </div>
          <div className="price">
            <small>Fixed engagement</small>
            <strong>$2,500</strong>
            <span>Defined scope. Actionable output.</span>
            <small>Secure PHI exchange is activated only after the right agreement and channel are in place.</small>
            <a href="#contact">
              Discuss your practice <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div>
          <p className="eyebrow">Start here</p>
          <h2>
            Bring us the number
            <br />
            that does not make sense.
          </h2>
          <p>
            Share only deidentified operational context here. If the diagnostic requires PHI, ROOT will move the
            conversation into an approved secure channel with the right BAA, access control, and intake process.
          </p>
        </div>
        {submitted ? (
          <div className="glass success">
            <Sparkles />
            <h3>Inquiry package ready.</h3>
            <p>
              Nothing was stored on this site. Open the prepared email or copy the deidentified MSO/diagnostic
              summary into your approved outreach channel.
            </p>
            <div className="successActions">
              <a className="button primary" href={mailto}>
                <Mail size={17} />
                Open email
              </a>
              <button className="button secondary" onClick={handleCopy} type="button">
                <Copy size={16} />
                {copied ? 'Copied' : 'Copy summary'}
              </button>
            </div>
            <button className="reset" onClick={() => setSubmitted(null)} type="button">
              Start another inquiry
            </button>
          </div>
        ) : (
          <form className="glass" onSubmit={handleSubmit}>
            <label>
              Name
              <input required placeholder="Your name" value={inquiry.name} onChange={updateInquiry('name')} />
            </label>
            <label>
              Work email
              <input
                required
                type="email"
                placeholder="you@practice.com"
                value={inquiry.email}
                onChange={updateInquiry('email')}
              />
            </label>
            <label>
              Practice / organization
              <input
                required
                placeholder="Organization name"
                value={inquiry.organization}
                onChange={updateInquiry('organization')}
              />
            </label>
            <label>
              What needs attention?
              <textarea
                required
                rows="4"
                placeholder="A/R, denials, credentialing, reporting, MSO operations..."
                value={inquiry.focus}
                onChange={updateInquiry('focus')}
              />
            </label>
            <label className="phiCheck">
              <input required type="checkbox" checked={inquiry.noPhi} onChange={updateInquiry('noPhi')} />
              <span>
                I confirm this public inquiry contains no protected health information. ROOT may support PHI only
                after an approved secure channel and BAA are in place.
              </span>
            </label>
            <button className="button primary" disabled={!canSubmit}>
              Prepare inquiry <ArrowRight size={17} />
            </button>
            <small>No form data is transmitted or stored by this static site.</small>
          </form>
        )}
      </section>

      <footer>
        <a className="brand" href="#top">
          <b>R</b>
          <span>ROOT</span>
        </a>
        <p>PHI-aware MSO operations and revenue cycle clarity, from the root up.</p>
        <span>© 2026 ROOT.</span>
      </footer>
    </main>
  );
}