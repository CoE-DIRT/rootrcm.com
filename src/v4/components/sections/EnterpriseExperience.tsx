/**
 * ROOT enterprise commercial experience — five-phase launch.
 * All product-data figures are synthetic and explicitly labeled.
 * No partner status, customer testimonial, certification, accreditation, outcome or live integration is implied.
 */
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, Building2, Check, ChevronLeft, ChevronRight, CircleCheck, ClipboardCheck, Command, Database, FileText, Layers3, LockKeyhole, MonitorPlay, Play, ScanSearch, ShieldCheck, SlidersHorizontal, Sparkles, Workflow, Zap } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { publishedEvidenceSlots } from '../../data/enterpriseEvidence';

const workflow = [
  { label: 'CONNECT', title: 'Bring the systems into focus', description: 'EHR/PM, clearinghouse, payer response and operating exports are reconciled against approved scope.', Icon: Database },
  { label: 'UNDERSTAND', title: 'Separate signal from noise', description: 'DIRT organizes denial, A/R, reimbursement and enrollment patterns for financial review.', Icon: ScanSearch },
  { label: 'EXECUTE', title: 'Turn findings into ownership', description: 'A named specialist follows through on the next action with human review and an audit trail.', Icon: Workflow },
] as const;

export function EnterpriseProductNarrative() {
  return (
    <Section className="ent-enterprise-narrative" wide>
      <div className="ent-enterprise-heading">
        <div>
          <p className="ent-enterprise-eyebrow"><span className="ent-live-dot" /> ONE OPERATING PLATFORM</p>
          <h2>Not another billing vendor. <span>One connected operating partner.</span></h2>
          <p>Managed revenue operations, business intelligence, workflow engineering and MSO support—delivered as one accountable relationship, not disconnected handoffs.</p>
        </div>
        <LinkButton href="/solutions/" variant="outline" size="md" data-cta="view-services" data-location="home-capabilities" data-destination="/solutions/">Explore solutions <ArrowUpRight size={16}/></LinkButton>
      </div>
      <div className="ent-workflow-grid">
        {workflow.map(({ label, title, description, Icon }, index) => (
          <GlassCard key={label} as="article" variant="glass" hover={false} className="ent-workflow-card">
            <div className="ent-workflow-top"><span>0{index + 1} / {label}</span><Icon size={24} aria-hidden="true" /></div>
            <h3>{title}</h3>
            <p>{description}</p>
          </GlassCard>
        ))}
      </div>
      <div className="ent-operating-ribbon">
        <span><CircleCheck size={16} /> Your existing practice systems</span>
        <span><CircleCheck size={16} /> Human-owned actions</span>
        <span><CircleCheck size={16} /> Decision-grade reporting</span>
        <span><CircleCheck size={16} /> Scoped MSO execution</span>
      </div>
    </Section>
  );
}

type DemoTab = 'revenue' | 'denials' | 'enrollment';
const demoViews = {
  revenue: {
    label: 'Revenue command',
    headline: 'An operating view of where cash is held up.',
    kicker: 'A/R intelligence',
    metrics: [{ label: 'Total A/R', value: '$780K' }, { label: 'Over 90 days', value: '$265K' }, { label: 'Collections', value: '$842K' }],
    values: [64, 82, 53, 72, 93, 79, 96],
    legend: ['Receivables normalized', 'Payer variance reviewed', 'Recovery action assigned'],
    rows: [{ tag: 'A/R > 90', issue: 'Aging balances by payer', owner: 'A/R specialist', status: 'Prioritize' }, { tag: 'PAYMENTS', issue: 'Variance in allowed amount', owner: 'Reimbursement analyst', status: 'Review' }],
  },
  denials: {
    label: 'Denial intelligence',
    headline: 'Find the denial families that need action.',
    kicker: 'Preventability signals',
    metrics: [{ label: 'Sample denials', value: '186' }, { label: 'Payer groups', value: '6' }, { label: 'Review queue', value: '34' }],
    values: [35, 59, 42, 76, 53, 62, 83],
    legend: ['Top reasons grouped', 'Preventability assessed', 'Correction workflow routed'],
    rows: [{ tag: 'AUTH', issue: 'Missing authorization pattern', owner: 'Authorization team', status: 'Triage' }, { tag: 'CODING', issue: 'Modifier denial cluster', owner: 'Coding reviewer', status: 'Validate' }],
  },
  enrollment: {
    label: 'Credentialing readiness',
    headline: 'Track revenue readiness before claims stall.',
    kicker: 'Participation monitoring',
    metrics: [{ label: 'Sample providers', value: '24' }, { label: 'Open actions', value: '8' }, { label: 'Payer rosters', value: '12' }],
    values: [25, 43, 56, 52, 73, 85, 92],
    legend: ['Enrollment status mapped', 'Dates and rosters checked', 'Pending tasks escalated'],
    rows: [{ tag: 'ROSTER', issue: 'Location roster reconciliation', owner: 'Enrollment lead', status: 'Follow up' }, { tag: 'EFFECTIVE', issue: 'Effective-date validation', owner: 'Payer liaison', status: 'Verify' }],
  },
} as const;

export function EnterpriseDirtWorkbench({ location = 'home-dirt' }: { location?: 'home-dirt' | 'platform-engagement' } = {}) {
  const [tab, setTab] = useState<DemoTab>('revenue');
  const view = demoViews[tab];
  return (
    <Section className="ent-product-section" wide id="platform-preview">
      <div className="ent-enterprise-heading">
        <div>
          <p className="ent-enterprise-eyebrow"><span className="ent-live-dot" /> THE INTELLIGENCE LAYER</p>
          <h2>Explore the revenue operating system. <span>Then put people behind it.</span></h2>
          <p>DIRT connects the data view to actual management and follow-up. Explore three working sample scenarios; production integrations are scoped per engagement.</p>
        </div>
        <LinkButton href="/technology/dirt/" variant="primary" size="md" data-cta="explore-dirt" data-location={location} data-destination="/technology/dirt/">Explore DIRT <ArrowRight size={17}/></LinkButton>
      </div>
      <div className="ent-product-frame" aria-label="Interactive sample revenue intelligence workspace">
        <aside className="ent-product-sidebar">
          <div className="ent-product-logo"><Command size={23}/><span>ROOT <b>DIRT</b></span></div>
          <p className="ent-sidebar-label">WORKSPACES</p>
          <div role="tablist" aria-label="Sample DIRT workspace views" className="ent-product-tabs">
            {([
              ['revenue', BarChart3, 'Revenue intelligence'],
              ['denials', ClipboardCheck, 'Denial analytics'],
              ['enrollment', BadgeCheck, 'Credentialing'],
            ] as const).map(([id, Icon, name]) => (
              <button key={id} type="button" role="tab" id={`ent-demo-tab-${id}`} aria-controls="ent-demo-panel" aria-selected={tab === id} className={tab === id ? 'ent-product-tab is-active' : 'ent-product-tab'} onClick={() => setTab(id)}>
                <Icon size={17} aria-hidden="true" /> {name}
              </button>
            ))}
          </div>
          <div className="ent-sidebar-bottom"><LockKeyhole size={15} /> Sample workspace</div>
        </aside>
        <div className="ent-product-main" role="tabpanel" id="ent-demo-panel" aria-labelledby={`ent-demo-tab-${tab}`}>
          <div className="ent-product-toolbar">
            <div><span className="ent-product-breadcrumb">Workspace / {view.label}</span><h3>{view.headline}</h3></div>
            <span className="ent-sample-pill"><span className="ent-live-dot"/> SAMPLE DATA</span>
          </div>
          <div className="ent-product-metrics">{view.metrics.map((m) => <div className="ent-product-metric" key={m.label}><span>{m.label}</span><strong>{m.value}</strong><small>{view.kicker}</small></div>)}</div>
          <div className="ent-product-middle">
            <div className="ent-product-chart" role="img" aria-label={`Illustrative seven-period trend for ${view.label}`}>
              <div className="ent-product-chart-heading"><strong>Performance signals</strong><span>Illustrative 7-period trend</span></div>
              <div className="ent-bars">{view.values.map((n,i) => <div key={i} className="ent-bar-column"><span className="ent-bar" style={{height:`${n}%`}}/><small>W{i + 1}</small></div>)}</div>
            </div>
            <div className="ent-product-insights"><strong>From insight to action</strong>{view.legend.map((line,index) => <div key={line}><span>{index + 1}</span><p>{line}</p><Check size={15}/></div>)}<p className="ent-product-note">Priorities remain subject to human review and accountable ownership.</p></div>
          </div>
          <div className="ent-product-workqueue">
            <div className="ent-workqueue-heading"><strong>Action workqueue</strong><span>Illustrative assignments</span></div>
            {view.rows.map((row) => <div className="ent-workqueue-row" key={row.tag}><span className="ent-workqueue-tag">{row.tag}</span><span>{row.issue}</span><span className="ent-workqueue-owner">{row.owner}</span><b>{row.status}</b></div>)}
          </div>
        </div>
      </div>
      <div className="ent-platform-lower"><span><Zap size={17} /> Analytics + operating teams + managed workflows</span><a href="/contact/#contact-form" data-cta="talk-to-root" data-location={location} data-destination="/contact/" data-engagement-type="consultation">Book a free walkthrough <ArrowRight size={17}/></a></div>
    </Section>
  );
}

const tierItems = [
  { tag: 'ENTRY', name: 'Introductory consultation', price: 'Free', unit: 'initial conversation', detail: 'A focused first discussion about your billing, systems, priorities or planned transition.', bullets: ['Practice fit and goals', 'High-level workflow discussion', 'Recommended next step'], href: '/contact/#contact-form', cta: 'Request a free conversation', accent: false },
  { tag: 'DIAGNOSTIC', name: 'Revenue Optimization Diagnostic', price: '$2,500', unit: 'fixed-fee assessment', detail: 'A defined revenue-cycle review with an opportunity register and prioritized 90-day roadmap.', bullets: ['A/R and denial review', 'Process and reporting assessment', '90-day opportunity roadmap'], href: '/diagnostic/', cta: 'Explore the Diagnostic', accent: true },
  { tag: 'OPERATIONS', name: 'Managed RCM', price: '≈5%', unit: 'of collections where appropriate', detail: 'Revenue-cycle execution and controls, scoped to your specialty and existing systems.', bullets: ['Billing and A/R operations', 'Denial escalation and follow-up', 'Leadership operating cadence'], href: '/pricing/', cta: 'See managed RCM terms', accent: false },
  { tag: 'INTELLIGENCE', name: 'DIRT Intelligence', price: '$1.5–2.5K', unit: 'per month · scoped', detail: 'Financial and operational intelligence connected to human-reviewed next actions.', bullets: ['A/R and payer visibility', 'Revenue exception intelligence', 'Executive decision reporting'], href: '/pricing/', cta: 'Compare intelligence plans', accent: false },
  { tag: 'CUSTOM', name: 'Full MSO + Technology', price: 'Custom', unit: 'scope-based partnership', detail: 'Tailored management, integration and automation support across the healthcare business.', bullets: ['Integrated operations support', 'Technology and process design', 'Custom onboarding and milestones'], href: '/contact/#contact-form', cta: 'Design a partnership', accent: false },
] as const;

export function EnterprisePricingSystem({ compact = false }: { compact?: boolean }) {
  const visible = compact ? tierItems.slice(0, 4) : tierItems;
  return (
    <Section tone="soft" wide className="ent-tiers-section" id="engagement-models">
      <div className="ent-enterprise-heading"><div><p className="ent-enterprise-eyebrow">ENGAGEMENT MODELS</p><h2>Start small. <span>Scale into one accountable system.</span></h2><p>Free introductions, predefined assessments, ongoing operating models and custom MSO partnerships—without forcing every practice into the same contract.</p></div><LinkButton href="/pricing/" variant="outline" data-cta="compare-pricing" data-location="home-pricing" data-destination="/pricing/">Full pricing details <ArrowUpRight size={17}/></LinkButton></div>
      <div className="ent-tier-grid">
        {visible.map((tier) => <GlassCard key={tier.name} as="article" variant="glass" hover={false} className={tier.accent ? 'ent-tier-card ent-tier-featured' : 'ent-tier-card'}>
          <span className="ent-tier-label">{tier.tag}</span><h3>{tier.name}</h3><p className="ent-tier-price">{tier.price}</p><p className="ent-tier-unit">{tier.unit}</p><p className="ent-tier-detail">{tier.detail}</p>
          <ul>{tier.bullets.map((bullet) => <li key={bullet}><Check size={15}/>{bullet}</li>)}</ul>
          <a href={tier.href} data-cta={tier.tag === 'DIAGNOSTIC' ? 'book-diagnostic' : tier.tag === 'ENTRY' ? 'talk-to-root' : 'pricing-card'} data-location="home-pricing" data-destination={tier.href} data-engagement-type="pricing" className={tier.accent ? 'ent-tier-button is-featured' : 'ent-tier-button'}>{tier.cta} <ArrowRight size={16}/></a>
        </GlassCard>)}
      </div>
      <p className="ent-pricing-footnote">Indicative published pricing; managed RCM onboarding starts at $1,500 where applicable. DIRT, credentialing, implementation and MSO scopes are agreed in writing. Free introductions cover a scoped initial conversation; comprehensive reviews have a separate, written Diagnostic scope.</p>
    </Section>
  );
}

const scenarios = [
  { industry: 'Ambulatory surgery', problem: 'Authorization and payment variance', title: 'Turn claim exceptions into a prioritized recovery queue.', detail: 'Model: unify case-level reimbursement, payer correspondence and follow-up status into one management view.', signal: 'Payer variance → owner → review cadence', link: '/solutions/revenue-leakage/' },
  { industry: 'Multispecialty groups', problem: 'Fragmented reporting', title: 'Give leadership one operating picture across specialties.', detail: 'Model: reconcile collections, aging and denial trends by specialty and provider before deciding what to fix.', signal: 'Reconcile → investigate → assign', link: '/solutions/reporting-visibility/' },
  { industry: 'Provider enrollment', problem: 'Readiness blind spots', title: 'Catch enrollment gaps before they block reimbursement.', detail: 'Model: track payer effective dates, provider rosters and outstanding responses alongside billing readiness.', signal: 'Enroll → verify → escalate', link: '/solutions/credentialing-bottlenecks/' },
] as const;

export function EnterpriseProofGallery() {
  const [index, setIndex] = useState(0);
  const selected = scenarios[index];
  return (
    <Section wide className="ent-proof-section">
      <div className="ent-enterprise-heading"><div><p className="ent-enterprise-eyebrow">HOW THE OPERATING MODEL WORKS</p><h2>See the method. <span>From financial signal to owned action.</span></h2><p>Explore representative scenarios showing the analysis, prioritization and follow-through behind a ROOT engagement.</p></div><div className="ent-carousel-controls"><button type="button" aria-label="Previous scenario" onClick={() => setIndex((index + scenarios.length - 1) % scenarios.length)}><ChevronLeft size={20}/></button><span>{String(index + 1).padStart(2,'0')} / {String(scenarios.length).padStart(2,'0')}</span><button type="button" aria-label="Next scenario" onClick={() => setIndex((index + 1) % scenarios.length)}><ChevronRight size={20}/></button></div></div>
      <div className="ent-scenario-carousel" aria-live="polite" aria-roledescription="carousel">
        <div className="ent-scenario-visual"><span className="ent-scenario-kicker">SCENARIO {String(index + 1).padStart(2,'0')}</span><div className="ent-scenario-orbit"><Layers3 size={44}/><span>ROOT OPERATIONS</span><div><Zap size={20}/> DIRT SIGNAL</div></div><p>Illustrative operating workflow</p></div>
        <div className="ent-scenario-copy"><span className="ent-tier-label">{selected.industry} · {selected.problem}</span><h3>{selected.title}</h3><p>{selected.detail}</p><div className="ent-scenario-signal"><CircleCheck size={17}/>{selected.signal}</div><a href={selected.link} data-cta="related-solution" data-location="resource-proof" data-destination={selected.link}>Explore related solution <ArrowRight size={17}/></a></div>
      </div>
      <div className="ent-proof-under">
        {publishedEvidenceSlots().map((slot) => {
          const Icon = slot.kind === 'testimonial' ? FileText : slot.kind === 'partners' ? Layers3 : ShieldCheck;
          return (
            <GlassCard key={slot.kind} as="article" variant="glass" hover={false} className="ent-proof-pending">
              <div className="ent-proof-icon"><Icon size={22} aria-hidden="true" /></div>
              <div><h3>{slot.title}</h3><p>{slot.status === 'verified' ? slot.verifiedCopy : slot.description}</p></div>
              {slot.status === 'verified' && slot.evidenceUrl
                ? <a className="ent-proof-evidence-link" href={slot.evidenceUrl} target="_blank" rel="noopener noreferrer">Verify evidence <ArrowUpRight size={14} aria-hidden="true" /></a>
                : <span>{slot.statusLabel}</span>}
            </GlassCard>
          );
        })}
      </div>
    </Section>
  );
}

export function EnterpriseAssuranceAndOffers() {
  return (
    <>
      <Section className="ent-assurance-section" wide>
        <div className="ent-enterprise-heading"><div><p className="ent-enterprise-eyebrow">BUILT FOR ACCOUNTABILITY</p><h2>Serious infrastructure. <span>Clear boundaries.</span></h2><p>A U.S.-incorporated healthcare operations company, with defined work, clear contacts and a public-site privacy boundary.</p></div><LinkButton href="/about/" variant="outline" data-cta="related-solution" data-location="home-outreach" data-destination="/about/">Company details <ArrowUpRight size={16}/></LinkButton></div>
        <div className="ent-assurance-grid">
          <div><Building2 size={21}/><strong>U.S. corporate identity</strong><span>ROOT Revenue Operations & Outcomes Technology Incorporated</span></div>
          <div><ShieldCheck size={21}/><strong>Privacy-aware intake</strong><span>Public inquiries do not accept PHI; secure exchange is separately scoped.</span></div>
          <div><SlidersHorizontal size={21}/><strong>Defined commercial scope</strong><span>Written deliverables, owners, pricing terms and change control.</span></div>
          <div><MonitorPlay size={21}/><strong>Demo-first discovery</strong><span>Explore representative data workflows before committing to a project.</span></div>
        </div>
      </Section>
      <Section className="ent-bottom-conversion" wide>
        <div className="ent-conversion-frame"><div><span className="ent-conversion-label"><Sparkles size={15}/> YOUR NEXT REVENUE DECISION</span><h2>See the system. <span>Talk to the people behind it.</span></h2><p>Start with a complimentary introductory consultation, a DIRT sample walkthrough or a scoped diagnostic. No practice data required for the first conversation.</p><div className="ent-conversion-actions"><LinkButton href="/contact/#contact-form" variant="primary" size="lg" data-cta="talk-to-root" data-location="home-final-cta" data-destination="/contact/">Request a free consultation <ArrowRight size={17}/></LinkButton><LinkButton href="/technology/dirt/" variant="outline" size="lg" data-cta="explore-dirt" data-location="home-final-cta" data-destination="/technology/dirt/"><Play size={16}/> View the DIRT demo</LinkButton></div></div><div className="ent-conversion-art" aria-hidden="true"><Command size={62}/><span>ROOT</span><b>OPERATIONS × INTELLIGENCE</b></div></div>
      </Section>
    </>
  );
}
