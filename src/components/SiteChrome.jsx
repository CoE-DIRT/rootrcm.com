import { useState } from 'react';
import { ArrowRight, ChevronDown, Menu, ShieldCheck, X } from 'lucide-react';
import { brandAssets, footerGroups, siteNav } from '../siteData.js';

export function Brand({ compact = false }) {
  return (
    <a className="brand" href="/" aria-label="ROOT home">
      <span className="brandMark" aria-hidden="true">
        <img src={brandAssets.fallbackMark} alt="" width="38" height="38" />
      </span>
      <span className="brandText">
        ROOT
        {!compact && <small>Revenue Operations & Outcomes Technology</small>}
      </span>
    </a>
  );
}

export function SiteHeader({ minimal = false }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`siteHeader ${minimal ? 'minimal' : ''}`}>
      <Brand />
      {!minimal && (
        <>
          <nav className={open ? 'open' : ''} aria-label="Primary navigation">
            {siteNav.map((item) =>
              item.children ? (
                <div className="navGroup" key={item.label}>
                  <button type="button" className="navLabel" aria-haspopup="true">
                    {item.label} <ChevronDown size={14} />
                  </button>
                  <div className="navDropdown">
                    {item.children.map((child) => (
                      <a key={child.href} href={child.href} onClick={() => setOpen(false)}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ),
            )}
            <a className="navCta" href="/diagnostic/" onClick={() => setOpen(false)}>
              Get Diagnostic <ArrowRight size={15} />
            </a>
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

export function SectionCta({ title, copy, label = 'Book a Revenue Diagnostic', href = '/diagnostic/' }) {
  return (
    <section className="sectionCta">
      <div>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      <a className="button primary" href={href}>
        {label} <ArrowRight size={17} />
      </a>
    </section>
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
          <p>The RCM, operations, and technology partner for modern medical practices.</p>
          <span className="securityNote"><ShieldCheck size={15} /> Public website: no PHI intake.</span>
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
        <a href="/diagnostic/">Stop Revenue Leakage <ArrowRight size={14} /></a>
      </div>
    </footer>
  );
}
