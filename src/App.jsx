import { SiteFooter, SiteHeader } from './components/SiteChrome.jsx';
import {
  AboutPage,
  ContactPage,
  DiagnosticPage,
  DirtPage,
  HomePage,
  NotFoundPage,
  PracticeOpsPage,
  PrivacyPage,
  RcmPage,
  TermsPage,
  ThankYouPage,
} from './pages.jsx';

const routes = {
  '/': HomePage,
  '/services/rcm': RcmPage,
  '/services/practice-ops': PracticeOpsPage,
  '/technology/dirt': DirtPage,
  '/diagnostic': DiagnosticPage,
  '/company/about': AboutPage,
  '/contact': ContactPage,
  '/legal/privacy': PrivacyPage,
  '/legal/terms': TermsPage,
  '/thank-you': ThankYouPage,
};

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
}

export default function App() {
  const path = normalizePath(window.location.pathname);
  const Page = routes[path] || NotFoundPage;
  const minimal = path === '/diagnostic' || path === '/thank-you';

  return (
    <main className="clinicalGlass">
      <SiteHeader minimal={minimal} />
      <Page />
      <SiteFooter minimal={minimal} />
    </main>
  );
}
