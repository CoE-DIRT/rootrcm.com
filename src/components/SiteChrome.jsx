import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ArrowRight, ChevronDown, MessageCircle, Menu, Share2, X } from 'lucide-react';
import { brandAssets, companyInfo, footerGroups, outreachChannels, siteNav, socialProfiles } from '../siteData.js';

export function Brand({ compact = false }) {
  return (
    <a className="brand" href="/" aria-label="ROOT home">
      <span className="brandMark" aria-hidden="true">
        <img src={brandAssets.mark} alt="" width="38" height="38" decoding="async" />
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

  function toggleNav() {
    setOpen((value) => {
      const next = !value;
      if (next && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('root:nav-open'));
      }
      return next;
    });
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
              <button
                type="button"
                className="navTextCta"
                onClick={() => {
                  closeMenus();
                  window.dispatchEvent(new CustomEvent('root:open-follow'));
                }}
              >
                Follow ROOT
              </button>
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
          <button className="menuButton" type="button" onClick={toggleNav} aria-label="Toggle menu" aria-expanded={open}>
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
  return <FloatingSiteControls />;
}

function useViewportDockOffset() {
  const [offset, setOffset] = useState({ bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    function sync() {
      const vv = window.visualViewport;
      if (!vv) return;
      setOffset({
        bottom: Math.max(0, window.innerHeight - vv.height - vv.offsetTop),
        left: Math.max(0, vv.offsetLeft),
        right: Math.max(0, window.innerWidth - vv.width - vv.offsetLeft),
      });
    }

    sync();
    viewport.addEventListener('resize', sync);
    viewport.addEventListener('scroll', sync);
    return () => {
      viewport.removeEventListener('resize', sync);
      viewport.removeEventListener('scroll', sync);
    };
  }, []);

  return offset;
}

export function FloatingSiteControls() {
  const [openPanel, setOpenPanel] = useState(null);
  const offset = useViewportDockOffset();
  const liveChannels = outreachChannels.filter((channel) => channel.href);
  const profiles = socialProfiles.filter((profile) => profile.href);

  useEffect(() => {
    function closePanels() {
      setOpenPanel(null);
    }
    function openFollow() {
      setOpenPanel('follow');
    }
    window.addEventListener('root:nav-open', closePanels);
    window.addEventListener('root:open-follow', openFollow);
    return () => {
      window.removeEventListener('root:nav-open', closePanels);
      window.removeEventListener('root:open-follow', openFollow);
    };
  }, []);

  const dockStyle = {
    '--dock-bottom-extra': `${offset.bottom}px`,
    '--dock-left-extra': `${offset.left}px`,
    '--dock-right-extra': `${offset.right}px`,
  };

  const dock = (
    <div className="floatingDockRoot" style={dockStyle}>
      <Popover.Root open={openPanel === 'follow'} onOpenChange={(open) => setOpenPanel(open ? 'follow' : null)}>
        <div className="floatingFollow">
          <Popover.Trigger asChild>
            <button type="button" aria-controls="follow-panel" aria-label="Follow ROOT">
              <Share2 size={20} aria-hidden="true" /> Follow ROOT
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              id="follow-panel"
              className="followPanel"
              side="top"
              align="start"
              sideOffset={12}
              collisionPadding={12}
              avoidCollisions
              sticky="always"
              aria-labelledby="follow-panel-title"
              onOpenAutoFocus={(event) => {
                const first = event.currentTarget.querySelector('a');
                if (first instanceof HTMLElement) {
                  event.preventDefault();
                  first.focus();
                }
              }}
            >
              <div className="floatingPanelHeader">
                <strong id="follow-panel-title">Follow ROOT</strong>
                <Popover.Close asChild>
                  <button type="button" className="floatingPanelClose" aria-label="Close Follow ROOT">
                    <X size={18} aria-hidden="true" />
                  </button>
                </Popover.Close>
              </div>
              <nav className="followLinkGrid" aria-label="ROOT social profiles">
                {profiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={profile.label}
                    aria-label={`ROOT on ${profile.label} (opens in new tab)`}
                  >
                    <SocialMark label={profile.label} />
                    <span>{profile.label}</span>
                  </a>
                ))}
              </nav>
            </Popover.Content>
          </Popover.Portal>
        </div>
      </Popover.Root>

      <Popover.Root open={openPanel === 'contact'} onOpenChange={(open) => setOpenPanel(open ? 'contact' : null)}>
        <div className="floatingContact">
          <Popover.Trigger asChild>
            <button type="button" aria-controls="assistant-panel" aria-label="Talk to us">
              <MessageCircle size={20} aria-hidden="true" /> Talk to us
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              id="assistant-panel"
              className="assistantPanel"
              side="top"
              align="end"
              sideOffset={12}
              collisionPadding={12}
              avoidCollisions
              sticky="always"
              aria-labelledby="assistant-panel-title"
              aria-describedby="assistant-panel-description"
              onOpenAutoFocus={(event) => {
                const first = event.currentTarget.querySelector('a');
                if (first instanceof HTMLElement) {
                  event.preventDefault();
                  first.focus();
                }
              }}
            >
              <div className="floatingPanelHeader">
                <strong id="assistant-panel-title">Talk to ROOT</strong>
                <Popover.Close asChild>
                  <button type="button" className="floatingPanelClose" aria-label="Close Talk to us">
                    <X size={18} aria-hidden="true" />
                  </button>
                </Popover.Close>
              </div>
              <p id="assistant-panel-description">Discuss your practice&apos;s operations. Do not include PHI.</p>
              <div className="assistantChannelList">
                <a href="/contact/" data-cta="talk-to-root" data-location="floating-contact" data-destination="/contact/" data-engagement-type="consultation">
                  Contact ROOT <ArrowRight size={14} />
                </a>
                {liveChannels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    data-cta={channel.cta}
                    data-location="floating-contact"
                    data-destination={channel.href}
                    data-engagement-type={channel.engagementType}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {channel.label} <ArrowRight size={14} />
                  </a>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </div>
      </Popover.Root>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(dock, document.body);
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
  if (label === 'LinkedIn') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4A1.65 1.65 0 1 0 5.1 7.3 1.65 1.65 0 0 0 5.1 4Zm15.2 5.3c-1.6 0-2.7.7-3.3 1.5V9.5h-2.8c0 .5-.1 10.5-.1 10.5h2.8v-5.9c0-.3 0-.6.1-.8.3-.6.9-1.3 2-1.3 1.4 0 2 1.1 2 2.6V20h2.8v-6.4c0-3.4-1.8-4.8-4.5-4.8Z" /></svg>;
  if (label === 'Pinterest') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2A8.8 8.8 0 0 0 7.6 20c0-1.1.3-2.7.7-3.9.4-.9 2.4-9.7 2.4-9.7s-.6-1.2-.6-3c0-2.8 1.6-4.9 3.7-4.9 1.7 0 2.6 1.3 2.6 2.9 0 1.7-1.1 4.3-1.7 6.7-.5 2 1 3.6 3 3.6 3.5 0 5.9-4.5 5.9-9.8 0-4.1-2.7-7.1-7.7-7.1C7.7 3.8 4.5 7 4.5 11.3c0 1.7.5 2.9 1.3 3.8.3.3.3.5.2.8l-.5 1.8c-.1.3-.3.4-.6.3-2.2-.9-3.2-3.4-3.2-6.2C1.7 6.3 6.3 1.8 12.3 1.8 17.8 1.8 21.5 5.7 21.5 10.7c0 6.4-3.6 11.2-8.9 11.2-1.8 0-3.4-.9-4-2l-1.1 4c-.4 1.4-1.4 3.2-2.1 4.3A8.8 8.8 0 0 0 12 21.8 8.8 8.8 0 0 0 12 3.2Z" /></svg>;
  if (label === 'Reddit') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.5 3.3 15.9 8c1.4.1 2.7.6 3.7 1.4a2 2 0 1 1 1.3 3.5c0 3.6-4.1 6.5-9 6.5s-9-2.9-9-6.5a2 2 0 1 1 1.3-3.5A8.5 8.5 0 0 1 8 8l1.5-4.7 3.1.8 1.9-.8ZM8.8 13.1a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm6.4 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm-6.1 3.5a4.8 4.8 0 0 0 5.8 0 .6.6 0 0 1 .8.9 6 6 0 0 1-7.4 0 .6.6 0 1 1 .8-.9Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M6 9v10h12V9M3 9l2-5h14l2 5M9 19v-5h6v5" /></svg>;
}

function FooterSocials() {
  const verifiedProfiles = socialProfiles.filter((profile) => profile.href);
  if (!verifiedProfiles.length) return null;

  return (
    <nav className="footerSocials" aria-label="Follow ROOT on social">
      {verifiedProfiles.map((profile) => (
        <a
          key={profile.label}
          href={profile.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`ROOT on ${profile.label} (opens in new tab)`}
          title={profile.label}
        >
          <SocialMark label={profile.label} />
        </a>
      ))}
    </nav>
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
