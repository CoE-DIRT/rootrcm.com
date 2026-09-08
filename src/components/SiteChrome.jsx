import { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { brandAssets, companyInfo, footerGroups, outreachChannels, siteNav } from '../siteData.js';

export function Brand({ compact = false }) {
  return (
    <a className="brand" href="/" aria-label="ROOT home">
      <span className="brandMark" aria-hidden="true">
        <img src={brandAssets.fallbackMark} alt="" width="38" height="38" />
      </span>
      <span className="brandText">
        ROOT
        {!compact && <small>Healthcare MSO Platform</small>}
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
  return (
    <div className={`channelButtons ${compact ? 'compact' : ''}`}>
      {outreachChannels.map((channel) => channel.href ? (
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
      ) : (
        <button
          key={channel.label}
          type="button"
          disabled
          data-cta={channel.cta}
          data-location={location}
          data-destination="coming-soon"
          data-engagement-type={channel.engagementType}
        >
          <span>{channel.label}</span>
          <small>{channel.status}</small>
        </button>
      ))}
    </div>
  );
}

export function FloatingContactCta() {
  return (
    <div className="floatingContact" aria-label="Instant contact options">
      <a href={companyInfo.whatsappHref} data-cta="whatsapp-instant-chat" data-location="floating-contact" data-destination={companyInfo.whatsappHref} data-engagement-type="instant-chat" target="_blank" rel="noreferrer">
        <MessageCircle size={18} /> WhatsApp
      </a>
      <a href={companyInfo.phoneHref} data-cta="phone-call" data-location="floating-contact" data-destination={companyInfo.phoneHref} data-engagement-type="phone">
        <Phone size={16} /> Call
      </a>
    </div>
  );
}

export function SiteFooter({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="siteFooter minimalFooter">
        <Brand compact />
        <p>No PHI is collected through this public website.</p>
        <a href="/legal/privacy/">Privacy</a>
      </footer>
    );
  }

  return (
    <footer className="siteFooter">
      <div className="footerGrid">
        <div className="footerBrand">
          <Brand />
          <p>ROOT is the healthcare MSO, RCM, operations, technology, automation, analytics, and DIRT intelligence partner for modern medical practices.</p>
          <span className="securityNote"><ShieldCheck size={15} /> Public website: no PHI intake.</span>
          <address>
            <strong>{companyInfo.legalName}</strong>
            {companyInfo.addressLines.map((line) => <span key={line}>{line}</span>)}
            <a href={companyInfo.phoneHref}>{companyInfo.phone}</a>
            <a href={companyInfo.emailHref}>{companyInfo.email}</a>
          </address>
          <ChannelButtons location="footer-outreach" compact />
        </div>
        {footerGroups.map((group) => (
          <div className="footerGroup" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="footerBottom">
        <span>© 2026 ROOT Revenue Operations & Outcomes Technology.</span>
        <a href="/diagnostic/" data-cta="book-diagnostic" data-location="footer" data-destination="/diagnostic/" data-engagement-type="diagnostic">
          Book a Diagnostic <ArrowRight size={14} />
        </a>
      </div>
    </footer>
  );
}
