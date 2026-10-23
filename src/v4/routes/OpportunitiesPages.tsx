import { ArrowRight, BriefcaseBusiness, CheckCircle2, Handshake, Mail, ShieldCheck, UsersRound } from 'lucide-react';
import { V4Shell } from '@/layout/V4Shell';
import { Section, SectionHeader } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinkButton } from '@/components/ui/Button';

const applyEmail = 'mailto:info@rootrcm.com?subject=ROOT%20Partner%20Network%20Application&body=Hello%20ROOT%20Team%2C%0A%0AI%20am%20interested%20in%20the%20ROOT%20Partner%20Network.%0A%0AName%3A%0AOrganization%20(optional)%3A%0AProfessional%20role%3A%0AState%20or%20country%3A%0APartnership%20type%3A%0ARelevant%20experience%3A%0AProfessional%20profile%20(optional)%3A%0A%0APlease%20do%20not%20include%20patient%20information%20or%20confidential%20client%20information.%0A';
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.14em] text-accent';
const paragraph = 'mt-4 max-w-2xl text-lg text-muted';

const partnerTypes = [
  ['Independent RCM professionals', 'Help practices evaluate their billing, denials, A/R, and revenue cycle operations.'],
  ['Healthcare business consultants', 'Introduce operations, growth, or performance challenges that ROOT may be able to address.'],
  ['EHR, PM & healthcare IT specialists', 'Connect technology engagements with practice operations and revenue needs.'],
  ['Professional agencies & business developers', 'Explore approved channel relationships and co-marketing opportunities.'],
];

const process = [
  ['01', 'Introduce yourself', 'Share your business background and proposed partnership model. No PHI or confidential client files.'],
  ['02', 'Eligibility review', 'We review independence, conflicts, healthcare regulatory exposure, and commercial fit.'],
  ['03', 'Agree on the arrangement', 'Qualified participants receive approved written terms before any compensable activity.'],
  ['04', 'Create shared opportunity', 'Once authorized, collaborate on qualified business introductions with clear attribution and oversight.'],
];

function CardLink({ href, title, description, icon: Icon }: { href: string; title: string; description: string; icon: typeof Handshake }) {
  return <a href={href} className="block h-full rounded-[var(--radius-root)] border border-border bg-bg-soft p-6 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none">
    <Icon className="h-7 w-7 text-accent" aria-hidden="true" />
    <h2 className="mt-5 text-2xl font-semibold text-text">{title}</h2>
    <p className="mt-3 text-sm text-muted">{description}</p>
    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">Explore <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
  </a>;
}

export function OpportunitiesPage() {
  return <V4Shell>
    <Section className="pt-10 md:pt-14">
      <p className={eyebrow}>Connect with ROOT</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">Build what comes next in healthcare revenue.</h1>
      <p className={paragraph}>We work with independent professionals, strategic collaborators, and future team members who believe healthcare operations can be more accountable, connected, and effective.</p>
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        <CardLink href="/partners/" title="Partner with ROOT" icon={Handshake} description="Discover our growth partner network for eligible independent consultants, agencies, and business development professionals." />
        <CardLink href="/careers/" title="Careers at ROOT" icon={BriefcaseBusiness} description="Explore our approach to work and check for future openings. No positions are advertised at this time." />
      </div>
    </Section>
    <Section tone="soft">
      <SectionHeader eyebrow="Our standard" title="Professional relationships. Clear boundaries." description="We design each relationship around written responsibilities, measurable service delivery, confidentiality, and ethical conduct." />
      <p className="mt-6 text-sm text-muted">Partner activities and any compensation are subject to eligibility, independent review, applicable law, and a signed agreement. We never ask for patient referrals or PHI through this site.</p>
    </Section>
  </V4Shell>;
}

export function PartnersPage() {
  return <V4Shell>
    <Section className="pt-10 md:pt-14">
      <p className={eyebrow}>ROOT Growth Partner Network</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">Your network. Our expertise. Shared growth.</h1>
      <p className={paragraph}>We invite independent RCM professionals, healthcare consultants, implementation specialists, agencies, and business development professionals to explore helping healthcare organizations find the right revenue operations partner.</p>
      <p className="mt-4 max-w-2xl text-sm text-muted">Approved eligible partners may qualify for compensation under an individual written agreement. Applications are open for review; participation, fees, commissions, and acceptance are not guaranteed.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href={applyEmail} size="lg" variant="primary">Apply by email <ArrowRight className="h-4 w-4" aria-hidden="true" /></LinkButton>
        <LinkButton href="/partners/terms/" size="lg" variant="outline">Partner program guidelines</LinkButton>
      </div>
      <p className="mt-3 text-xs text-muted">Applications open your email app for you to review and send. We do not collect applications through a new web form.</p>
    </Section>
    <Section tone="soft">
      <SectionHeader eyebrow="Who we collaborate with" title="Bring industry insight. Find the right fit." description="The network is designed for independent, transparent commercial relationships, not patient referrals or undisclosed influence." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {partnerTypes.map(([title, copy]) => <GlassCard key={title} as="article" variant="glass" hover={false} className="p-6">
          <UsersRound className="h-6 w-6 text-accent" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-semibold text-text">{title}</h3><p className="mt-3 text-sm text-muted">{copy}</p>
        </GlassCard>)}
      </div>
      <p className="mt-6 text-sm text-muted">Physicians, practice managers, executives, and employees of healthcare organizations are welcome to discuss strategic collaboration or ROOT services. Personal referral compensation is not offered to decision-makers for influencing their organization's vendor selection.</p>
    </Section>
    <Section>
      <SectionHeader eyebrow="ROOT capabilities" title="What we bring to the relationship" description="We support independent healthcare practices with connected commercial and nonclinical operating services." />
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {['Medical billing and managed revenue cycle management','Denial management and accounts receivable recovery','Provider credentialing and payer enrollment','Practice operations and process optimization','Revenue intelligence, reporting and analytics','Healthcare IT and workflow automation planning'].map(text => <li key={text} className="flex items-start gap-3 text-sm text-muted"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />{text}</li>)}
      </ul>
      <p className="mt-6 text-sm text-muted">Our fixed-scope Revenue Optimization Diagnostic is <a href="/diagnostic/" className="font-semibold text-accent underline-offset-4 hover:underline">$2,500</a>. Other services are separately scoped. No specific customer result is promised.</p>
    </Section>
    <Section tone="soft">
      <SectionHeader eyebrow="Simple, deliberate process" title="How partnership evaluation works" />
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {process.map(([number,title,copy]) => <li key={number} className="rounded-[var(--radius-root)] border border-border bg-bg p-5">
          <span className="text-sm font-semibold text-accent">{number}</span>
          <h3 className="mt-3 text-lg font-semibold text-text">{title}</h3>
          <p className="mt-2 text-sm text-muted">{copy}</p>
        </li>)}
      </ol>
    </Section>
    <Section>
      <div className="rounded-[var(--radius-hero)] border border-border bg-bg-soft p-6 md:p-10">
        <div className="flex items-start gap-3"><ShieldCheck className="h-7 w-7 shrink-0 text-accent" aria-hidden="true" />
          <div><h2 className="text-2xl font-semibold text-text">Integrity is part of the offer.</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted">No commissions are payable merely for submitting a name or referring patients. Compensation, if any, is determined only in approved written arrangements following conflict and legal review. Paid endorsements require clear disclosure. Partners may not imply they speak for ROOT without written permission.</p>
          <p className="mt-3 text-sm text-muted">Do not send PHI, patient lists, payer records, confidential employment data, or private practice files to ROOT through public channels. Read the <a href="/partners/terms/" className="text-accent hover:underline">program guidelines</a>, <a href="/privacy-policy/" className="text-accent hover:underline">privacy policy</a>, and <a href="/terms/" className="text-accent hover:underline">site terms</a>.</p></div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-text">Interested in building business together?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">Email a short introduction, your independent professional role, location, and the kind of work you would like to explore. We will review your request.</p>
        <LinkButton href={applyEmail} size="lg" variant="primary" className="mt-6"><Mail className="h-4 w-4" aria-hidden="true" /> Express interest</LinkButton>
      </div>
    </Section>
  </V4Shell>;
}

export function CareersPage() {
  return <V4Shell>
    <Section className="pt-10 md:pt-14">
      <p className={eyebrow}>Careers at ROOT</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-text sm:text-5xl">Help build more accountable healthcare operations.</h1>
      <p className={paragraph}>We bring revenue operations, credentialing, practice management, automation, and financial intelligence into one connected operating model. This page is the home for future employment and contract opportunities with ROOT.</p>
      <div className="mt-8 rounded-[var(--radius-root)] border border-border bg-bg-soft p-6 md:p-8" role="status">
        <BriefcaseBusiness className="h-7 w-7 text-accent" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-text">No open positions posted currently.</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">When opportunities are approved, we will publish role descriptions, locations or remote arrangements, responsibilities, eligibility, and an official application route here. We do not currently operate a public candidate intake portal.</p>
      </div>
    </Section>
    <Section tone="soft">
      <SectionHeader eyebrow="Other ways to work together" title="Independent collaborator or prospective client?" description="Our partner program is separate from hiring, employment, and contractor recruitment." />
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton href="/partners/" variant="primary">Explore partnerships <ArrowRight className="h-4 w-4" aria-hidden="true" /></LinkButton>
        <LinkButton href="/contact/" variant="outline">Contact ROOT</LinkButton>
      </div>
      <p className="mt-5 text-xs text-muted">ROOT does not require applicants to pay recruitment fees. Do not send identity documents, bank details, medical records, or other sensitive data through the public website.</p>
    </Section>
  </V4Shell>;
}

export function PartnerTermsPage() {
  return <V4Shell>
    <Section className="pt-10 md:pt-14">
      <p className={eyebrow}>Partner program governance</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-text sm:text-5xl">ROOT Growth Partner Network Guidelines</h1>
      <p className="mt-3 text-sm text-muted">Published October 22, 2026 · Program information, not an offer of employment or a binding compensation agreement.</p>
      <p className={paragraph}>We assess partnerships case by case. These public guidelines describe the eligibility and conduct standards required before any independent participant may represent a commercial opportunity to ROOT.</p>
    </Section>
    <Section tone="soft" className="pt-10">
      <div className="mx-auto max-w-4xl space-y-9">
        {[
          ['1. Independent eligibility', 'Applicants must disclose their employer and professional role, location, relevant affiliations, and any business or financial conflicts. ROOT may decline or discontinue participation at its discretion. Healthcare practitioners and employees of potential clients are not automatically eligible for compensation.'],
          ['2. No automatic payment', 'Submitting an application, sharing a lead, or introducing a prospective client does not create a payment right. No compensation rate or commission is publicly promised. Any permitted consideration, scope, attribution method, payment conditions, and term must be set in advance in a separate approved written agreement.'],
          ['3. Healthcare compliance', 'No patient referrals, patient steering, federally reimbursable healthcare referrals, or inducements are authorized. Any arrangement presenting risk under the federal Anti-Kickback Statute, Stark Law, state anti-kickback or fee-splitting laws, corporate policies, procurement rules, or conflicts-of-interest restrictions requires specific legal review and written approval; potentially impermissible arrangements will not be offered.'],
          ['4. Professional independence', 'Partners must not misuse an employer’s confidential information, exploit procurement authority, or solicit compensation for influencing purchasing decisions they are obliged to make independently. No one may act as ROOT’s agent, employee, or contracting representative without specific written authorization.'],
          ['5. Accurate and disclosed communications', 'Partners may not promise reimbursement results, falsely imply certifications or healthcare endorsements, publish unapproved offers, or make false or misleading claims. Material financial relationships must be clearly disclosed wherever relevant under advertising laws and platform rules.'],
          ['6. Data and privacy', 'Partner applications and business introductions must include only business contact information that may lawfully be shared. Do not transmit PHI, patient lists, credentials, claims, proprietary reports, or personal financial data through the public website, email, or messaging links. See our Privacy Policy.'],
          ['7. Selection and future opportunities', 'We may request additional verification and may update, suspend, or close the program. Employment openings, if any, will be published separately at /careers/. These guidelines do not create a franchise, joint venture, employment relationship, or exclusive appointment.'],
        ].map(([title,copy]) => <article key={title}><h2 className="text-xl font-semibold text-text">{title}</h2><p className="mt-3 text-sm leading-7 text-muted">{copy}</p></article>)}
        <p className="border-t border-border pt-6 text-sm text-muted">Questions? Email <a href="mailto:info@rootrcm.com?subject=ROOT%20Partner%20Network%20Guidelines" className="text-accent hover:underline">info@rootrcm.com</a>. Review our <a href="/privacy-policy/" className="text-accent hover:underline">Privacy Policy</a> and <a href="/terms/" className="text-accent hover:underline">Terms of Use</a>.</p>
        <LinkButton href="/partners/" variant="outline">Return to partner network</LinkButton>
      </div>
    </Section>
  </V4Shell>;
}
