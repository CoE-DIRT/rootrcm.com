# UX-0.1 — Route & component inventory

**Repository:** [CoE-DIRT/rootrcm.com](https://github.com/CoE-DIRT/rootrcm.com)  
**Baseline ref:** `main` @ `c5e31553c78bd68d3c1deb67b15e77760eea4e39` (2026-10-27)  
**Scope:** read-only inspection of route registry, site data, React route modules, component catalog, and code-search references. **No source code or deployment changes.**

## Definitions

- **Route** = entry in `src/seo/routeRegistry.js` (including 26 static entries, three aliases, 26 data-driven slug pages, two internal routes).
- **Page file** = React source implementation, not individual `<route>/index.html` entry. The HTML entry is given by the registry. Slug routes share template components.
- **Indexable Y** = canonical, public, not `noindex`/`internal`/`alias`/`system`, and therefore included in the generated production sitemap. This does *not* confirm Google indexing.
- **In-nav Y** = exposed through header primary links, header product links, the services/solutions dropdowns, or the header Diagnostic CTA. Footer and body links are not counted.
- **Has-CTA Y** = own page content contains a conversion button/form/action (not the globally present header CTA); informational hub navigation alone is N.
- **Theme both** = page integrates ROOT's light/dark token and toggle infrastructure via `V4Shell` or equivalent manual chrome. This is an architectural classification, **not** a proven visual contrast pass.
- **Components imported** lists relevant components used in the route's page implementation, excluding icon-only utilities and data imports. `src/v4/components/` direct token detection does not count inherited theme context.

## Route inventory

**57 routes · 48 indexable · 32 in navigation · 16 indexable but not in header navigation.**

| Route | Page file | Components imported | Indexable(Y/N) | In-nav(Y/N) | Has-CTA(Y/N) | Theme support(light/dark/both) |
|---|---|---|---|---|---|---|
| `/` | `src/v4/routes/HomePage.tsx` → `HomePage` | V4Shell, HeroSection, HeroMockup, DirtExecutiveMetrics, TrustSignals, GlassCard, GlassPlaceholder, EditorialEvidence, CTAGroup, Callout, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/about/` | `src/v4/routes/CompanyPages.tsx` → `AboutPage` | V4Shell, GlassCard, LinkButton, MediaFrame, Section, SectionHeader, WorkforceGrid | Y | Y | Y | both |
| `/services/` | `src/v4/routes/ServicesPages.tsx` → `ServicesHubPage` | V4Shell, Breadcrumb, EditorialEvidence, GlassCard, MediaFrame, Section | Y | Y | N | both |
| `/solutions/` | `src/v4/routes/ContentPages.tsx` → `SolutionsHubPage` | V4Shell, Breadcrumb, EditorialEvidence, GlassCard, Section | Y | Y | N | both |
| `/case-studies/` | `src/v4/routes/ContentPages.tsx` → `CaseStudiesHubPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, EditorialEvidence, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/pricing/` | `src/v4/routes/PricingPage.tsx` → `PricingPage` | V4Shell, Breadcrumb, CTAGroup, CheckoutButton, EditorialEvidence, GlassCard, GlassSkeleton, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/resources/` | `src/v4/routes/ContentPages.tsx` → `ResourcesHubPage` | V4Shell, Breadcrumb, EditorialEvidence, GlassCard, MediaFrame, Section | Y | Y | N | both |
| `/contact/` | `src/v4/routes/CompanyPages.tsx` → `ContactPage` | V4Shell, InquiryForm, TrustSignals, EditorialEvidence, GlassCard, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/opportunities/` | `src/v4/routes/OpportunitiesPages.tsx` → `OpportunitiesPage` | V4Shell, Section, SectionHeader | Y | Y | N | both |
| `/partners/` | `src/v4/routes/OpportunitiesPages.tsx` → `PartnersPage` | V4Shell, GlassCard, LinkButton, Section, SectionHeader | Y | N | Y | both |
| `/partners/terms/` | `src/v4/routes/OpportunitiesPages.tsx` → `PartnerTermsPage` | V4Shell, LinkButton, Section | Y | N | Y | both |
| `/careers/` | `src/v4/routes/OpportunitiesPages.tsx` → `CareersPage` | V4Shell, LinkButton, Section, SectionHeader | Y | N | Y | both |
| `/book/` | `src/v4/routes/CompanyPages.tsx` → `BookPage` | V4Shell, InquiryForm, Breadcrumb, Callout, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/faq/` | `src/v4/routes/CompanyPages.tsx` → `FaqPage` | V4Shell, Breadcrumb, LinkButton, Section, SectionHeader | Y | N | Y | both |
| `/privacy-policy/` | `src/v4/routes/LegalPages.tsx` → `PrivacyPage` | LegalShell, LegalSection, CookieSettings | Y | N | N | both |
| `/terms/` | `src/v4/routes/LegalPages.tsx` → `TermsPage` | LegalShell, LegalSection | Y | N | N | both |
| `/refund-policy/` | `src/v4/routes/LegalPages.tsx` → `RefundPolicyPage` | LegalShell, LegalSection | Y | N | N | both |
| `/legal/cookies/` | `src/v4/routes/CookiesLegalPage.tsx` → `CookiesLegalPage` | MarketingHeader, MarketingFooter, CookieConsent, AnalyticsBoot, CookieSettings, Breadcrumb, ResponsiveTableShell, Section, SectionHeader | Y | N | N | both |
| `/thank-you/` | `src/v4/routes/LegalPages.tsx` → `ThankYouPage` | V4Shell, GlassCard, LinkButton, Section | N | N | Y | both |
| `/checkout/success/` | `src/v4/routes/CheckoutPages.tsx` → `CheckoutSuccessPage` | V4Shell, GlassCard, LinkButton, Section | N | N | Y | both |
| `/checkout/cancel/` | `src/v4/routes/CheckoutPages.tsx` → `CheckoutCancelPage` | V4Shell, GlassCard, LinkButton, Section | N | N | Y | both |
| `/platform/` | `src/v4/routes/PlatformPage.tsx` → `PlatformPage` | V4Shell, Breadcrumb, CTAGroup, ContinuousImprovementLoop, LinkButton, MediaFrame, PracticeLifecycle, VerticalExpansionMap, Section, SectionHeader | Y | Y | Y | both |
| `/technology/` | `src/v4/routes/TechnologyPages.tsx` → `TechnologyHubPage` | V4Shell, CTAGroup, CompetitiveTable, InteroperabilityLifecycle, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/technology/dirt/` | `src/v4/routes/TechnologyPages.tsx` → `DirtPage` | V4Shell, CTAGroup, Callout, DirtSectionNav, GlassSkeleton, InteractiveMiniDashboard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/diagnostic/` | `src/v4/routes/DiagnosticPage.tsx` → `DiagnosticPage` | V4Shell, InquiryForm, CheckoutButton, NoPhiBanner, Callout, GlassCard, ImplementationSteps, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/404.html` | `src/v4/routes/LegalPages.tsx` → `NotFoundPage` | V4Shell, GlassCard, LinkButton, Section | N | N | Y | both |
| `/company/about/` | `src/v4/routes/CompanyPages.tsx` → `AboutPage` | V4Shell, GlassCard, LinkButton, MediaFrame, Section, SectionHeader, WorkforceGrid | N | N | Y | both |
| `/legal/privacy/` | `src/v4/routes/LegalPages.tsx` → `PrivacyPage` | LegalShell, LegalSection, CookieSettings | N | N | N | both |
| `/legal/terms/` | `src/v4/routes/LegalPages.tsx` → `TermsPage` | LegalShell, LegalSection | N | N | N | both |
| `/solutions/revenue-leakage/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/solutions/aging-ar/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/solutions/denials/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/solutions/credentialing-bottlenecks/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/solutions/operational-efficiency/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/solutions/reporting-visibility/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/solutions/scaling-practice-ops/` | `src/v4/routes/ContentPages.tsx` → `SolutionPage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, GlassCard, LinkButton, MediaFrame, Section, SectionHeader | Y | Y | Y | both |
| `/services/rcm/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/medical-billing/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/ar-recovery/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/denial-management/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/payment-posting/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/patient-balances/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/credentialing/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/practice-ops/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/healthcare-it/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/workflow-automation/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/reporting-analytics/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/services/operational-consulting/` | `src/v4/routes/ServicesPages.tsx` → `ServicePage` | V4Shell, AnnotationNote, Breadcrumb, CTAGroup, LinkButton, MediaFrame, MetricCard, Section, SectionHeader | Y | Y | Y | both |
| `/resources/healthcare-revenue-intelligence-asc-denials/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/resources/revenue-leakage-guide/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/resources/aging-ar-playbook/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/resources/denial-management-root-cause/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/resources/credentialing-operations-checklist/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/resources/practice-ops-kpi-model/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/resources/healthcare-automation-readiness/` | `src/v4/routes/ContentPages.tsx` → `ResourceArticlePage` | V4Shell, Breadcrumb, CTAGroup, GlassCard, LinkButton, Section | Y | N | Y | both |
| `/case-studies/dirt-poc-01/` | `src/v4/routes/ContentPages.tsx` → `CaseStudyDetailPage` | V4Shell, GlassSkeleton, Section | N | N | N | both |
| `/__v4-lab/` | `src/v4/routes/V4LabPage.tsx` → `V4LabPage` | TooltipProvider, MarketingHeader, MarketingFooter, Button, LinkButton, IconButton, Input, Textarea, FormField, Checkbox, Accordion, AccordionItem, Tabs, Dialog, Tooltip, Section, SectionHeader, Callout, Breadcrumb, FollowRoot, TalkToUs | N | N | Y | both |

## Route-module exports and wrappers

The table includes every JSX/TSX file in `src/v4/routes/`, including the test module and non-route `PricingGlance`. Most page modules use named exports (no default export). `PricingGlance` is the exception.

| Route file | Default export name | Top-level layout wrapper |
|---|---|---|
| `src/v4/routes/CheckoutPages.tsx` | none | CheckoutSuccessPage, CheckoutCancelPage → V4Shell |
| `src/v4/routes/CompanyPages.tsx` | none | ContactPage, AboutPage, FaqPage, BookPage → V4Shell |
| `src/v4/routes/ContentPages.tsx` | none | SolutionsHubPage, SolutionPage, ResourcesHubPage, ResourceArticlePage, CaseStudiesHubPage, CaseStudyDetailPage → V4Shell |
| `src/v4/routes/CookiesLegalPage.tsx` | none | CookiesLegalPage → manual div/header/main/footer (not V4Shell) |
| `src/v4/routes/DiagnosticPage.tsx` | none | DiagnosticPage → V4Shell |
| `src/v4/routes/HomePage.tsx` | none | HomePage → V4Shell |
| `src/v4/routes/LegalPages.test.tsx` | none | Test file, no exported page or layout |
| `src/v4/routes/LegalPages.tsx` | none | PrivacyPage, TermsPage, RefundPolicyPage → LegalShell → V4Shell; ThankYouPage, NotFoundPage → V4Shell |
| `src/v4/routes/OpportunitiesPages.tsx` | none | OpportunitiesPage, PartnersPage, CareersPage, PartnerTermsPage → V4Shell |
| `src/v4/routes/PlatformPage.tsx` | none | PlatformPage → V4Shell |
| `src/v4/routes/PricingGlance.tsx` | `PricingGlance` | PricingGlance → content element (not page shell) |
| `src/v4/routes/PricingPage.tsx` | none | PricingPage → V4Shell |
| `src/v4/routes/ServicesPages.tsx` | none | ServicesHubPage, ServicePage → V4Shell |
| `src/v4/routes/TechnologyPages.tsx` | none | TechnologyHubPage, DirtPage → V4Shell |
| `src/v4/routes/V4LabPage.tsx` | none | V4LabPage → TooltipProvider → manual div/header/main/footer (dev-only) |

## Component catalog

This covers every non-test `.tsx/.jsx` module in `src/v4/components/`. Props signatures list the explicit exported component API, including important local interface fields; inherited native DOM/React attributes are not expanded. **Radix** is direct when imported in that module; otherwise an indirect Radix dependency is explicitly labeled. **Token=Y** means the module directly uses canonical Tailwind theme classes or CSS token variables; N means the module delegates/inherits styling.

| Component file | Props signature / exported symbols | Radix primitive | Theme token(Y/N) |
|---|---|---|---|
| `src/v4/components/CheckoutButton.tsx` | CheckoutButton(location, className): CheckoutButtonProps | — | Y |
| `src/v4/components/FollowRoot.tsx` | FollowRoot(className?: string) | — | N |
| `src/v4/components/MarketingFooter.tsx` | MarketingFooter(minimal?: boolean) | Navigation indirectly via shared chrome | Y |
| `src/v4/components/MarketingHeader.tsx` | MarketingHeader(minimal?: boolean) | NavigationMenu + Sheet (indirect) | Y |
| `src/v4/components/SocialIcons.tsx` | SocialIcon(name, SVGProps) | — | N |
| `src/v4/components/SocialLinks.tsx` | SocialLinks(variant, location, className, label): SocialLinksProps | Tooltip (indirect) | Y |
| `src/v4/components/TalkToUs.tsx` | TalkToUs(): no props | Dialog (indirect) | Y |
| `src/v4/components/ThemeToggle.tsx` | ThemeToggle(className?: string) | — | Y |
| `src/v4/components/TrustSignals.tsx` | TrustSignals(className?: string) | — | Y |
| `src/v4/components/dirt/DirtCommandCenter.tsx` | DirtCommandCenter(compact?: boolean); ArAgingMatrix(); DenialPareto(); PayerPerformanceTable(); UnderpaymentPanel(); PriorityQueue(limit?, compact?); DirtSignalFlow() | — | Y |
| `src/v4/components/dirt/DirtExecutiveMetrics.tsx` | DirtExecutiveMetrics(compact?: boolean) | — | Y |
| `src/v4/components/dirt/DirtSectionNav.tsx` | DirtSectionNav(items: DirtSectionNavItem[], className?) | — | Y |
| `src/v4/components/dirt/InteractiveMiniDashboard.tsx` | InteractiveMiniDashboard() | — | Y |
| `src/v4/components/dirt/NestedDataGridContainer.tsx` | NestedDataGridContainer() | — | Y |
| `src/v4/components/sections/CompetitiveTable.tsx` | CompetitiveTable() | — | Y |
| `src/v4/components/sections/ContinuousImprovementLoop.tsx` | ContinuousImprovementLoop(label, cards): ContinuousImprovementLoopProps | — | Y |
| `src/v4/components/sections/EditorialEvidence.tsx` | EditorialEvidence(path: EditorialRoute) | — | Y |
| `src/v4/components/sections/HeroMockup.tsx` | HeroMockup(label, badge, children): HeroMockupProps | — | Y |
| `src/v4/components/sections/HeroSection.tsx` | HeroSection(eyebrow, title, description, supportLine?, mockup): HeroSectionProps | — | Y |
| `src/v4/components/sections/ImplementationSteps.tsx` | ImplementationSteps(steps: ImplementationStep[]) | — | Y |
| `src/v4/components/sections/InteroperabilityLifecycle.tsx` | InteroperabilityLifecycle(stages): InteroperabilityLifecycleProps | — | Y |
| `src/v4/components/sections/PracticeLifecycle.tsx` | PracticeLifecycle(steps, segments): PracticeLifecycleProps | — | Y |
| `src/v4/components/sections/VerticalExpansionMap.tsx` | VerticalExpansionMap(nodes): VerticalExpansionMapProps | — | Y |
| `src/v4/components/sections/WorkforceGrid.tsx` | WorkforceGrid() | — | Y |
| `src/v4/components/ui/Accordion.tsx` | Accordion(props: Radix Root); AccordionItem(value, trigger, children) | Accordion Root/Item/Header/Trigger/Content | Y |
| `src/v4/components/ui/AnnotationNote.tsx` | AnnotationNote(label, text, className?): AnnotationNoteProps | — | Y |
| `src/v4/components/ui/Breadcrumb.tsx` | Breadcrumb(items: BreadcrumbItem[]) | — | Y |
| `src/v4/components/ui/Button.tsx` | Button(ButtonProps); LinkButton(LinkButtonProps); IconButton(IconButtonProps) | — | Y |
| `src/v4/components/ui/Callout.tsx` | Callout(tone?, title?, children, className?); EmptyState(title, description?); ErrorState(title, description?) | — | Y |
| `src/v4/components/ui/Checkbox.tsx` | Checkbox(label, ...CheckboxProps) | Checkbox Root/Indicator | Y |
| `src/v4/components/ui/ConversionPanel.tsx` | ConversionPanel(title, text, primaryText, primaryHref, primaryProps?, secondaryText?, secondaryHref?, className?) | — | Y |
| `src/v4/components/ui/Dialog.tsx` | Dialog(props: Radix Root); DialogTrigger(props: Radix Trigger); DialogContent(children, title, description?, className?) | Dialog Root/Trigger/Portal/Overlay/Content | Y |
| `src/v4/components/ui/GlassCard.tsx` | GlassCard(as?, children, hover?, variant?, accent?): GlassCardProps | — | Y |
| `src/v4/components/ui/GlassPlaceholder.tsx` | GlassPlaceholder(aspect?, className?, children?, state?); GlassSkeleton(minHeight?, label?) | — | Y |
| `src/v4/components/ui/Input.tsx` | Input(InputHTMLAttributes); Textarea(TextareaHTMLAttributes); Label(LabelHTMLAttributes); FormField(label, htmlFor, error?, hint?, required?, children) | — | Y |
| `src/v4/components/ui/MediaFrame.tsx` | MediaFrame(src, alt, caption?, className?, imgClassName?, priority?, aspect?): MediaFrameProps | — | Y |
| `src/v4/components/ui/MetricCard.tsx` | MetricCard(label, displayLabel?, value, note?, tone?, accent?, className?) | — | Y |
| `src/v4/components/ui/NavigationMenu.tsx` | NavigationMenu(Root); NavigationMenuList(List); NavigationMenuLink(Link); NavigationMenuItem(Item props); NavigationMenuTrigger(Trigger props); NavigationMenuContent(Content props) | NavigationMenu Root/List/Link/Item/Trigger/Content | Y |
| `src/v4/components/ui/NoPhiBanner.tsx` | NoPhiBanner(children, tone?, className?) | — | Y |
| `src/v4/components/ui/PipelineCard.tsx` | PipelineCard(status, statusTone?, title, note?, contract?, accent?, className?) | — | Y |
| `src/v4/components/ui/ResponsiveTableShell.tsx` | ResponsiveTableShell(children, caption?, label?, minWidthClassName?, className?) | — | Y |
| `src/v4/components/ui/Section.tsx` | Section(children, tone?, wide?, dense?, ...HTMLAttributes); SectionHeader(as?, eyebrow?, title, description?, align?, className?); CTAGroup(children, className?) | — | Y |
| `src/v4/components/ui/Sheet.tsx` | Sheet(props: Dialog Root); SheetTrigger(props: Dialog Trigger); SheetContent(children, title, side?, className?) | Dialog Root/Trigger/Portal/Overlay/Content | Y |
| `src/v4/components/ui/StatusPill.tsx` | StatusPill(tone?: StatusPillProps.tone) | — | Y |
| `src/v4/components/ui/Tabs.tsx` | Tabs(props: Radix Root); TabsList(List props); TabsTrigger(Trigger props); TabsContent(Content props) | Tabs Root/List/Trigger/Content | Y |
| `src/v4/components/ui/Tooltip.tsx` | TooltipProvider(children); Tooltip(label, children, className?) | Tooltip Provider/Root/Trigger/Portal/Content/Arrow | Y |

## Findings

### Routes in the registry but not in header navigation

**Not in nav does not automatically mean unreachable.** Some are hub-linked resources, footer-only business/legal routes, redirects, checkout completion pages, and internal test routes.

| Route | Classification | Likely alternative discovery path |
|---|---|---|
| `/partners/` | indexable public | footer/legal navigation |
| `/partners/terms/` | indexable public | footer/legal navigation |
| `/careers/` | indexable public | footer/legal navigation |
| `/book/` | indexable public | footer/legal navigation |
| `/faq/` | indexable public | footer/legal navigation |
| `/privacy-policy/` | indexable public | footer/legal navigation |
| `/terms/` | indexable public | footer/legal navigation |
| `/refund-policy/` | indexable public | footer/legal navigation |
| `/legal/cookies/` | indexable public | footer/legal navigation |
| `/thank-you/` | system/noindex | not in header menu (check in-page linkage) |
| `/checkout/success/` | system/noindex | not in header menu (check in-page linkage) |
| `/checkout/cancel/` | system/noindex | not in header menu (check in-page linkage) |
| `/404.html` | system/noindex | not in header menu (check in-page linkage) |
| `/company/about/` | alias (canonical redirect) | not in header menu (check in-page linkage) |
| `/legal/privacy/` | alias (canonical redirect) | not in header menu (check in-page linkage) |
| `/legal/terms/` | alias (canonical redirect) | not in header menu (check in-page linkage) |
| `/resources/healthcare-revenue-intelligence-asc-denials/` | indexable public | resources hub article list |
| `/resources/revenue-leakage-guide/` | indexable public | resources hub article list |
| `/resources/aging-ar-playbook/` | indexable public | resources hub article list |
| `/resources/denial-management-root-cause/` | indexable public | resources hub article list |
| `/resources/credentialing-operations-checklist/` | indexable public | resources hub article list |
| `/resources/practice-ops-kpi-model/` | indexable public | resources hub article list |
| `/resources/healthcare-automation-readiness/` | indexable public | resources hub article list |
| `/case-studies/dirt-poc-01/` | dev/internal | not in header menu (check in-page linkage) |
| `/__v4-lab/` | dev/internal | not in header menu (check in-page linkage) |

**Review priority:** manually test footer/business/legal links and resource-hub cards; confirm no revenue-relevant indexable page lacks a deliberate navigation or internal-link entry.

### Dead / production-unused component candidates

1. **`src/v4/components/ui/ConversionPanel.tsx`** — GitHub code search found the declaration plus documentation mentions, but no consumer in application source. Candidate for deletion *only after* UX-0.6 verification and owner approval.
2. **Development-lab-only wrappers:** `src/v4/components/FollowRoot.tsx`, `src/v4/components/ui/Accordion.tsx`, `src/v4/components/ui/Tabs.tsx` and `src/v4/components/ui/Checkbox.tsx` appear primarily/only through `V4LabPage.tsx`; this is **not dead code** because the development lab is a deliberate consumer.
3. **`src/v4/components/ui/Input.tsx`** exports `Input`, `Textarea`, `Label`, `FormField`; the named wrappers are prominently used by the lab. Confirm other production imports per symbol before classification. Do not confuse native HTML input usages with imports from this module.
4. **Not dead:** `Tooltip.tsx` is used outside the lab through `SocialLinks.tsx`; `DirtCommandCenter.tsx` appears in `TechnologyPages.tsx`; `NestedDataGridContainer.tsx` is used by `DirtCommandCenter.tsx`.

This is a conservative **static-import/code-search audit**, not a bundler-based dead-code report. No component was removed.

### Duplicated layout wrappers

- **Canonical:** `src/v4/layout/V4Shell.tsx` integrates header, footer, cookie consent, analytics boot, main landmark, personalization and floating outreach.
- **Duplicate shell implementation:** `CookiesLegalPage.tsx` independently composes a root div, `MarketingHeader`, `AnalyticsBoot`, `CookieConsent`, `<main>` and `MarketingFooter`; it does **not** use `V4Shell`. This is a candidate for later consolidation, not an immediate change.
- **Dev-only duplicate:** `V4LabPage.tsx` manually constructs header/main/footer inside `TooltipProvider` without `V4Shell`; intentional isolation should be confirmed before consolidating.
- **Not duplication:** `LegalShell` in `LegalPages.tsx` **wraps `V4Shell`**, adding policy-specific headings and Section layout. `PricingGlance` is a nested content widget, not a second page shell.

### SEO, navigation and QA cautions

- `siteData.js` supplies **12 services, 7 solutions and 7 resource articles**, rendered from shared templates. Keep route registry and content data synchronized.
- `src/seo/sitemap.js` and `vite.config.js` generate `dist-staging/sitemap.xml` during build. There is intentionally **no** `public/sitemap.xml`.
- Navigation classification excludes footer-only links and the route's internal content links; false-positive “orphans” must be checked through the actual browser.
- Theme coverage and CTA presence were classified from source; keyboard access, visual contrast and functional event emission remain UX-0 follow-up audit gates.
- Forms, privacy notices, no-PHI acknowledgements, and canonical SEO metadata were not modified.

## Reproduction and verification commands

```bash
git fetch origin
git switch codex/ux-0-1-route-inventory
git diff --name-status origin/main...HEAD
git diff --check origin/main...HEAD
npm ci
npm run lint
npx tsc --noEmit
npx vitest run --coverage
npm run build
npx playwright test --workers=2
```

**Completion gate:** this Markdown document is the only Git diff; branch pushed; **no PR before UX-0.6**. The source-only audit does not imply that the commands above have already passed.

**Registry entry check:** all non-internal HTML entry paths occur in the inspected tree.
