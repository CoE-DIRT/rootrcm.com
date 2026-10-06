import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ArrowRight, MessageCircle, Share2, X } from 'lucide-react';
import { outreachChannels } from '../siteData.js';
import { SocialLinks } from '../v4/components/SocialLinks.tsx';
import { useExperiment } from '../v4/experiments/useExperiment.ts';

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
  // A/B test exp-talk-to-us-placement-v1: the "footer-only" variant drops the floating Talk to us control
  // (the header button and the footer Talk to us band remain).
  const placement = useExperiment('talkToUsPlacement');
  const showFloatingContact = placement.variant !== 'footer-only';

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
            <button type="button" className="floatingFollowButton" aria-controls="follow-panel" aria-label="Follow ROOT" title="Follow ROOT">
              <Share2 size={20} aria-hidden="true" />
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
              <SocialLinks variant="labeled" location="follow-panel" label="ROOT social profiles" />
            </Popover.Content>
          </Popover.Portal>
        </div>
      </Popover.Root>

      {showFloatingContact ? (
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
                {...placement.attrs}
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
      ) : null}
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(dock, document.body);
}
