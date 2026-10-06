import{StrictMode}from'react';
import{createRoot}from'react-dom/client';
import{MotionConfig}from'motion/react';
import App from'./App.jsx';
import'./styles.css';
import'./stabilization.css';
import'./revenue-hotfix.css';
import'./visual-recovery.css';
import'./v4/styles/tailwind.css';
import'./v4/styles/chrome.css';
import'./theme/theme.css';
import{applyAnalyticsConsent,readStoredConsent}from'./v4/analytics/consent.ts';

// Returning visitors: restore their saved analytics choice before the first render so A/B surfaces do not flicker.
applyAnalyticsConsent(readStoredConsent());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
