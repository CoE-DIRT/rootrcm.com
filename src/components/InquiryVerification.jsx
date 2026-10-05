import { useEffect, useRef, useState } from 'react';

export default function InquiryVerification({ siteKey, onToken }) {
  const container = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let widget;
    let disposed = false;
    const mount = () => {
      if (disposed || !window.turnstile || widget !== undefined) return;
      widget = window.turnstile.render(container.current, {
        sitekey: siteKey, action: 'contact', theme: 'auto',
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => { onToken(''); setFailed(true); },
      });
    };
    let script = document.querySelector('script[data-root-turnstile]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.dataset.rootTurnstile = 'true';
      script.async = true;
      document.head.appendChild(script);
    }
    const fail = () => setFailed(true);
    script.addEventListener('load', mount);
    script.addEventListener('error', fail);
    mount();
    return () => {
      disposed = true;
      script.removeEventListener('load', mount);
      script.removeEventListener('error', fail);
      if (widget !== undefined) window.turnstile?.remove(widget);
    };
  }, [siteKey, onToken]);
  return <div>
    <div ref={container} />
    {failed && <p role="alert">Verification could not load. Please refresh or email info@rootrcm.com.</p>}
  </div>;
}
