import { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle, Menu, X } from 'lucide-react';
import { brandAssets, companyInfo, footerGroups, outreachChannels, siteNav, socialProfiles } from '../siteData.js';

export function Brand({ compact = false }) {
  return (
    <a className="brand" href="/" aria-label="ROOT home">
      <span className="brandMark" aria-hidden="true">
        <img src={brandAssets.mark} alt="" width="38" height="38" />
      </span>
      <span className="brandText">
        ROOT
        {!compact && <small>Revenue Operations &amp; Outcomes Technology</small>}
      </span>
    </a>
  );
}

export function SiteHeader({ minimal = false }) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  function closeMenus() {
    setOpen(false);
    setActiveMenu(null);
  }

  return (
    <header className={`siteHeader ${minimal ? 'minimal' : ''}`}>
      <Brand />
      {!minimal && (
        <>
          <nav className={open ? 'open' : ''} aria-label="Primary navigation">
            {siteNav.map((item) =>
              item.children ? (
                <div className="navGroup" key={item.label} onMouseEnter={() => setActiveMenu(item.label)} onMouseLeave={() => setActiveMenu(null)}>
                  <button
                    type="button"
                    className="navLabel"
                    aria-haspopup="true"
                    aria-expanded={activeMenu === item.label}
                    onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                  >
                    {item.label} <ChevronDown size={14} />
                  </button>
                  <div className="navDropdown" data-open={activeMenu === item.label}>
                    <div className="megaIntro">
                      <a href={item.href} onClick={closeMenus}>{item.label} Hub <ArrowRight size={14} /></a>
                      <p>{item.description}</p>
                    </div>
                    <div className="megaLinks">
                      {item.children.map((child) => (
                        <a key={`${item.label}-${child.href}-${child.label}`} href={child.href} onClick={closeMenus}>
                          <span>{child.label}</span>
                          <small>{child.description}</small>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a key={item.href} href={item.href} onClick={closeMenus}>
                  {item.label}
                </a>
              ),
            )}
            <div className="navActions">
              <a
                className="navTextCta"
                href="/contact/"
                data-cta="talk-to-root"
                data-location="header"
                data-destination="/contact/"
                data-engagement-type="consultation"
                onClick={closeMenus}
              >
                Talk to ROOT
              </a>
              <a
                className="navCta"
                href="/diagnostic/"
                data-cta="book-diagnostic"
                data-location="header"
                data-destination="/diagnostic/"
                data-engagement-type="diagnostic"
                onClick={closeMenus}
              >
                Book a Diagnostic <ArrowRight size={15} />
              </a>
            </div>
          </nav>
          <button className="menuButton" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </>
      )}
    </header>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      {items.map((item, index) => (
        <span key={item.label}>
          <span aria-hidden="true">/</span>
          {index === items.length - 1 || !item.href ? <b>{item.label}</b> : <a href={item.href}>{item.label}</a>}
        </span>
      ))}
    </nav>
  );
}

export function GlassCard({ children, className = '' }) {
  return <div className={`glassCard ${className}`}>{children}</div>;
}

export function TrackedLink({
  children,
  className = 'button primary',
  href = '/diagnostic/',
  cta = 'book-diagnostic',
  location = 'section',
  engagementType = 'diagnostic',
}) {
  return (
    <a
      className={className}
      href={href}
      data-cta={cta}
      data-location={location}
      data-destination={href}
      data-engagement-type={engagementType}
    >
      {children}
    </a>
  );
}

export function SectionCta({
  title,
  copy,
  label = 'Book a Diagnostic',
  href = '/diagnostic/',
  cta = 'book-diagnostic',
  location = 'section-cta',
  engagementType = 'diagnostic',
}) {
  return (
    <section className="sectionCta" data-reveal>
      <div>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      <TrackedLink href={href} cta={cta} location={location} engagementType={engagementType}>
        {label} <ArrowRight size={17} />
      </TrackedLink>
    </section>
  );
}

export function ChannelButtons({ location = 'contact-panel', compact = false }) {
  const liveChannels = outreachChannels.filter((channel) => channel.href);

  return (
    <div className={`channelButtons ${compact ? 'compact' : ''}`}>
      {liveChannels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          data-cta={channel.cta}
          data-location={location}
          data-destination={channel.href}
          data-engagement-type={channel.engagementType}
          target={channel.href.startsWith('http') ? '_blank' : undefined}
          rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          <span>{channel.label}</span>
          <small>{channel.status}</small>
        </a>
      ))}
    </div>
  );
}

export function FloatingContactCta() {
  const [open, setOpen] = useState(false);

  return (
    <div className="floatingContact">
      {open && (
        <div id="assistant-panel" className="assistantPanel" role="dialog" aria-labelledby="assistant-panel-title" aria-describedby="assistant-panel-description">
          <strong id="assistant-panel-title">Chat assistant coming soon.</strong>
          <p id="assistant-panel-description">A future assistant will triage your inquiry and connect you with ROOT.</p>
          <a href="/contact/" data-cta="talk-to-root" data-location="floating-contact" data-destination="/contact/" data-engagement-type="consultation">Contact ROOT now <ArrowRight size={14} /></a>
        </div>
      )}
      <button type="button" aria-expanded={open} aria-controls="assistant-panel" onClick={() => setOpen((value) => !value)}>
        <MessageCircle size={18} /> Talk to us
      </button>
    </div>
  );
}

function FooterWordmark() {
  return (
    <a className="footerWordmark" href="/" aria-label="ROOT home">
      <strong>ROOT</strong>
      <span>Revenue Operations & Outcomes Technology</span>
    </a>
  );
}

function SocialMark({ label }) {
  if (label === 'Facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" /></svg>;
  if (label === 'Instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
  if (label === 'X') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h4.1l3.1 4.5L16 4h3l-5.3 6.1L19.5 20h-4.1l-3.7-5.2L7 20H4l5.7-6.8L5 4Zm3.1 2 7.9 12h.9L9 6h-.9Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0-8.7 11.3L3 21l6.9-2.2A9 9 0 1 0 12 3Zm0 2a7 7 0 0 1 0 14c-1.1 0-2.2-.3-3.2-.8l-.4-.2-3.7 1.2 1.2-3.6-.2-.4A7 7 0 0 1 12 5Zm-3 3.5c-.2 0-.5.1-.7.4-.2.3-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.8 3.4 1.9.8 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.3-.2-.7-.4l-1.5-.7c-.4-.1-.6-.2-.8.2-.2.3-.6.7-.7.9-.1.2-.3.2-.6.1-.3-.1-1.1-.4-2-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.6-1.5c-.2-.4-.4-.4-.7-.4Z" /></svg>;
}

function FooterSocials() {
  const [message, setMessage] = useState('');
  return (
    <div className="footerSocials">
      <span>Follow ROOT</span>
      <div>
        {socialProfiles.map((profile) => profile.href ? (
          <a key={profile.label} href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={profile.label}><SocialMark label={profile.label} /></a>
        ) : (
          <button key={profile.label} type="button" aria-label={profile.label} onClick={() => setMessage(profile.message)}><SocialMark label={profile.label} /></button>
        ))}
      </div>
      {message && <small role="status" aria-label="Social profile feedback">{message}</small>}
    </div>
  );
}

export function SiteFooter({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="siteFooter minimalFooter">
        <FooterWordmark />
        <div className="footerMeta">
          <span>No PHI is collected through this public website.</span>
          <a href="/legal/privacy/">Privacy</a>
        </div>
        <FooterSocials />
      </footer>
    );
  }

  return (
    <footer className="siteFooter">
      <div className="footerTop">
        <div className="footerIdentity">
          <FooterWordmark />
          <p className="footerLegalName">{companyInfo.legalName}</p>
          <p>One operating partner for the business side of medicine — RCM + Operations + Technology for independent medical practices.</p>
        </div>
        <div className="footerAction">
          <span>Start with evidence</span>
          <strong>$2,500 Revenue Optimization Diagnostic</strong>
          <a className="button primary" href="/diagnostic/" data-cta="book-diagnostic" data-location="footer" data-destination="/diagnostic/" data-engagement-type="diagnostic">
            Book a Diagnostic <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="footerLinks" aria-label="Footer navigation">
        {footerGroups.map((group) => (
          <div className="footerGroup" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>

      <div className="footerMeta">
        <div>
          <span>© 2026 {companyInfo.legalName}.</span>
          <span>Public website: no PHI intake.</span>
        </div>
        <div className="footerContact">
          <a href={companyInfo.phoneHref}>{companyInfo.phone}</a>
          <a href={companyInfo.emailHref}>{companyInfo.email}</a>
          <a href="/legal/privacy/">Privacy</a>
          <a href="/legal/terms/">Terms</a>
        </div>
      </div>
      <FooterSocials />
    </footer>
  );
}
