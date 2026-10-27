# UX-0.3 — Route defect matrix

**Scope:** local Vite browser audits against the feature-branch source; all 57 route-registry entries, both themes for axe, mobile and desktop for Lighthouse.
**Evidence:** [Browser/axe/links JSON](./ux-0-3-evidence/browser.json), [Lighthouse metrics JSON](./ux-0-3-evidence/lighthouse.json), [Style comparison JSON](./ux-0-3-evidence/styles.json), [Duplicate pairs JSON](./ux-0-3-evidence/duplicates.json).

**Limits:** Lighthouse navigation reports LCP, CLS and TBT; field INP is not measured without real interactions / CrUX data and is recorded as null. No INP value is inferred from TBT. A Lighthouse failure is explicitly reported, never scored as passing.
**Classification:** Critical = axe WCAG violation, broken CTA/404 or theme control failure; High = LCP > 2.5s, CLS > 0.1 or missing canonical; Medium = copy overlap > 85% / >2 style signatures; Low = redirect/cosmetic or incomplete lab measurement.

| Metric | Audited / finding count |
|---|---:|
| Registry routes | 57 |
| Axe scans (light + dark) | 114 |
| Lighthouse runs (mobile + desktop) | 114 |
| Lighthouse runs with errors | 0 |
| Tested unique internal URLs | 49 |
| Critical | 15 |
| High | 116 |
| Medium | 11 |
| Low | 0 |

## Performance measurements

| Route | Mobile LCP ms | Mobile CLS | Mobile TBT ms | Mobile INP ms | Desktop LCP ms | Desktop CLS | Desktop TBT ms | Desktop INP ms |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| / | 84244 | 0.006 | 649 | N/A | 14095 | 0.001 | 123 | N/A |
| /about/ | 84560 | 0.006 | 551 | N/A | 13997 | 0.001 | 93 | N/A |
| /services/ | 83994 | 0.006 | 465 | N/A | 13966 | 0.001 | 82 | N/A |
| /solutions/ | 83877 | 0.006 | 254 | N/A | 13849 | 0.001 | 18 | N/A |
| /case-studies/ | 83864 | 0.006 | 579 | N/A | 14004 | 0.001 | 90 | N/A |
| /pricing/ | 83811 | 0.006 | 637 | N/A | 13954 | 0.001 | 123 | N/A |
| /resources/ | 84273 | 0.006 | 563 | N/A | 13940 | 0.001 | 102 | N/A |
| /contact/ | 83977 | 0.006 | 513 | N/A | 13964 | 0.001 | 102 | N/A |
| /opportunities/ | 83525 | 0.006 | 553 | N/A | 13878 | 0.001 | 101 | N/A |
| /partners/ | 83727 | 0.006 | 262 | N/A | 13812 | 0.001 | 17 | N/A |
| /partners/terms/ | 83895 | 0.006 | 547 | N/A | 13981 | 0.001 | 91 | N/A |
| /careers/ | 83869 | 0.006 | 613 | N/A | 13947 | 0.001 | 94 | N/A |
| /book/ | 83818 | 0.006 | 650 | N/A | 13889 | 0.001 | 105 | N/A |
| /faq/ | 83967 | 0.006 | 544 | N/A | 13953 | 0.001 | 110 | N/A |
| /privacy-policy/ | 83941 | 0.006 | 482 | N/A | 13919 | 0.001 | 81 | N/A |
| /terms/ | 83764 | 0.006 | 249 | N/A | 13830 | 0.001 | 17 | N/A |
| /refund-policy/ | 83722 | 0.006 | 568 | N/A | 13948 | 0.001 | 96 | N/A |
| /legal/cookies/ | 83688 | 0.000 | 644 | N/A | 13808 | 0.000 | 132 | N/A |
| /thank-you/ | 83813 | 0.006 | 450 | N/A | 13877 | 0.001 | 63 | N/A |
| /checkout/success/ | 83323 | 0.006 | 375 | N/A | 13880 | 0.001 | 47 | N/A |
| /checkout/cancel/ | 83976 | 0.006 | 329 | N/A | 13924 | 0.001 | 45 | N/A |
| /platform/ | 84038 | 0.006 | 271 | N/A | 13865 | 0.001 | 26 | N/A |
| /technology/ | 84013 | 0.006 | 644 | N/A | 14038 | 0.001 | 121 | N/A |
| /technology/dirt/ | 83747 | 0.006 | 2348 | N/A | 13892 | 0.001 | 385 | N/A |
| /diagnostic/ | 83825 | 0.006 | 469 | N/A | 14019 | 0.001 | 76 | N/A |
| /404.html | 83976 | 0.006 | 529 | N/A | 13887 | 0.001 | 73 | N/A |
| /company/about/ | 84362 | 0.006 | 545 | N/A | 14023 | 0.001 | 96 | N/A |
| /legal/privacy/ | 83743 | 0.006 | 231 | N/A | 13840 | 0.001 | 16 | N/A |
| /legal/terms/ | 84006 | 0.006 | 543 | N/A | 13897 | 0.001 | 106 | N/A |
| /solutions/revenue-leakage/ | 84130 | 0.006 | 617 | N/A | 13936 | 0.001 | 122 | N/A |
| /solutions/aging-ar/ | 84135 | 0.006 | 618 | N/A | 13973 | 0.001 | 114 | N/A |
| /solutions/denials/ | 84212 | 0.006 | 509 | N/A | 13930 | 0.001 | 74 | N/A |
| /solutions/credentialing-bottlenecks/ | 84258 | 0.006 | 512 | N/A | 13910 | 0.001 | 77 | N/A |
| /solutions/operational-efficiency/ | 84489 | 0.006 | 233 | N/A | 13996 | 0.001 | 17 | N/A |
| /solutions/reporting-visibility/ | 84200 | 0.006 | 546 | N/A | 13941 | 0.001 | 108 | N/A |
| /solutions/scaling-practice-ops/ | 84648 | 0.006 | 646 | N/A | 14027 | 0.001 | 110 | N/A |
| /services/rcm/ | 84068 | 0.006 | 569 | N/A | 13991 | 0.001 | 106 | N/A |
| /services/medical-billing/ | 84044 | 0.006 | 507 | N/A | 13980 | 0.001 | 71 | N/A |
| /services/ar-recovery/ | 84360 | 0.006 | 477 | N/A | 14027 | 0.001 | 73 | N/A |
| /services/denial-management/ | 83948 | 0.006 | 244 | N/A | 13897 | 0.001 | 18 | N/A |
| /services/payment-posting/ | 84514 | 0.006 | 582 | N/A | 14062 | 0.001 | 107 | N/A |
| /services/patient-balances/ | 84515 | 0.006 | 628 | N/A | 14052 | 0.001 | 139 | N/A |
| /services/credentialing/ | 84357 | 0.006 | 582 | N/A | 14053 | 0.001 | 93 | N/A |
| /services/practice-ops/ | 84506 | 0.006 | 499 | N/A | 14028 | 0.001 | 103 | N/A |
| /services/healthcare-it/ | 84433 | 0.006 | 515 | N/A | 13969 | 0.001 | 80 | N/A |
| /services/workflow-automation/ | 84118 | 0.006 | 252 | N/A | 13957 | 0.001 | 23 | N/A |
| /services/reporting-analytics/ | 84432 | 0.006 | 542 | N/A | 14033 | 0.001 | 119 | N/A |
| /services/operational-consulting/ | 84340 | 0.006 | 647 | N/A | 14008 | 0.001 | 120 | N/A |
| /resources/healthcare-revenue-intelligence-asc-denials/ | 83679 | 0.006 | 549 | N/A | 13908 | 0.001 | 116 | N/A |
| /resources/revenue-leakage-guide/ | 83823 | 0.006 | 488 | N/A | 13887 | 0.001 | 92 | N/A |
| /resources/aging-ar-playbook/ | 83855 | 0.006 | 480 | N/A | 13852 | 0.001 | 72 | N/A |
| /resources/denial-management-root-cause/ | 83809 | 0.006 | 247 | N/A | 13853 | 0.001 | 16 | N/A |
| /resources/credentialing-operations-checklist/ | 83836 | 0.006 | 558 | N/A | 13885 | 0.001 | 83 | N/A |
| /resources/practice-ops-kpi-model/ | 83961 | 0.006 | 585 | N/A | 13840 | 0.001 | 119 | N/A |
| /resources/healthcare-automation-readiness/ | 83822 | 0.006 | 583 | N/A | 13946 | 0.001 | 107 | N/A |
| /case-studies/dirt-poc-01/ | 87792 | 0.242 | 513 | N/A | 14707 | 0.332 | 75 | N/A |
| /__v4-lab/ | 79583 | 0.019 | 314 | N/A | 13248 | 0.012 | 46 | N/A |

## Ranked findings

| ID | Route | Category | Severity | Evidence (screenshot/JSON link) | Proposed fix |
|---|---|---|---|---|---|
| UX03-0001 | /about/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (1 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/about__390x844__light.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0002 | /about/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (1 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/about__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0003 | /checkout/cancel/ | Accessibility: color-contrast: Elements must meet minimum color contrast ratio thresholds (5 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/checkout-cancel__390x844__light.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0004 | /company/about/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (1 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/company-about__390x844__light.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0005 | /company/about/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (1 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/company-about__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0006 | /legal/cookies/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (1 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/legal-cookies__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0007 | /legal/privacy/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (4 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/legal-privacy__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0008 | /legal/terms/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (3 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/legal-terms__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0009 | /partners/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (3 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/partners__390x844__light.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0010 | /partners/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (3 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/partners__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0011 | /privacy-policy/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (4 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/privacy-policy__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0012 | /refund-policy/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (2 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/refund-policy__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0013 | /technology/dirt/ | Accessibility: color-contrast: Elements must meet minimum color contrast ratio thresholds (1 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/technology-dirt__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0014 | /terms/ | Accessibility: link-in-text-block: Links must be distinguishable without relying on color (3 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/terms__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0015 | /thank-you/ | Accessibility: color-contrast: Elements must meet minimum color contrast ratio thresholds (5 elements; serious) | **Critical** | [JSON](./ux-0-3-evidence/browser.json) · [Screenshot](./screens/thank-you__390x844__dark.png) | Correct the affected element(s) per axe rule, then retest keyboard/assistive tech in both themes. |
| UX03-0016 | / | LCP (desktop): 14095 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0017 | / | LCP (mobile): 84244 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0018 | /__v4-lab/ | LCP (desktop): 13248 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0019 | /__v4-lab/ | LCP (mobile): 79583 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0020 | /404.html | LCP (desktop): 13887 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0021 | /404.html | LCP (mobile): 83976 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0022 | /about/ | LCP (desktop): 13997 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0023 | /about/ | LCP (mobile): 84560 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0024 | /book/ | LCP (desktop): 13889 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0025 | /book/ | LCP (mobile): 83818 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0026 | /careers/ | LCP (desktop): 13947 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0027 | /careers/ | LCP (mobile): 83869 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0028 | /case-studies/ | LCP (desktop): 14004 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0029 | /case-studies/ | LCP (mobile): 83864 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0030 | /case-studies/dirt-poc-01/ | CLS (desktop): 0.332 (threshold 0.100) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Reserve image/component dimensions and eliminate post-load font or layout shifts. |
| UX03-0031 | /case-studies/dirt-poc-01/ | CLS (mobile): 0.242 (threshold 0.100) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Reserve image/component dimensions and eliminate post-load font or layout shifts. |
| UX03-0032 | /case-studies/dirt-poc-01/ | LCP (desktop): 14707 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0033 | /case-studies/dirt-poc-01/ | LCP (mobile): 87792 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0034 | /checkout/cancel/ | LCP (desktop): 13924 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0035 | /checkout/cancel/ | LCP (mobile): 83976 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0036 | /checkout/success/ | LCP (desktop): 13880 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0037 | /checkout/success/ | LCP (mobile): 83323 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0038 | /company/about/ | LCP (desktop): 14023 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0039 | /company/about/ | LCP (mobile): 84362 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0040 | /contact/ | LCP (desktop): 13964 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0041 | /contact/ | LCP (mobile): 83977 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0042 | /diagnostic/ | LCP (desktop): 14019 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0043 | /diagnostic/ | LCP (mobile): 83825 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0044 | /faq/ | LCP (desktop): 13953 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0045 | /faq/ | LCP (mobile): 83967 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0046 | /legal/cookies/ | LCP (desktop): 13808 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0047 | /legal/cookies/ | LCP (mobile): 83688 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0048 | /legal/privacy/ | LCP (desktop): 13840 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0049 | /legal/privacy/ | LCP (mobile): 83743 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0050 | /legal/terms/ | LCP (desktop): 13897 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0051 | /legal/terms/ | LCP (mobile): 84006 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0052 | /opportunities/ | LCP (desktop): 13878 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0053 | /opportunities/ | LCP (mobile): 83525 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0054 | /partners/ | LCP (desktop): 13812 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0055 | /partners/ | LCP (mobile): 83727 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0056 | /partners/terms/ | LCP (desktop): 13981 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0057 | /partners/terms/ | LCP (mobile): 83895 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0058 | /platform/ | LCP (desktop): 13865 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0059 | /platform/ | LCP (mobile): 84038 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0060 | /pricing/ | LCP (desktop): 13954 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0061 | /pricing/ | LCP (mobile): 83811 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0062 | /privacy-policy/ | LCP (desktop): 13919 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0063 | /privacy-policy/ | LCP (mobile): 83941 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0064 | /refund-policy/ | LCP (desktop): 13948 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0065 | /refund-policy/ | LCP (mobile): 83722 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0066 | /resources/ | LCP (desktop): 13940 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0067 | /resources/ | LCP (mobile): 84273 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0068 | /resources/aging-ar-playbook/ | LCP (desktop): 13852 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0069 | /resources/aging-ar-playbook/ | LCP (mobile): 83855 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0070 | /resources/credentialing-operations-checklist/ | LCP (desktop): 13885 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0071 | /resources/credentialing-operations-checklist/ | LCP (mobile): 83836 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0072 | /resources/denial-management-root-cause/ | LCP (desktop): 13853 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0073 | /resources/denial-management-root-cause/ | LCP (mobile): 83809 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0074 | /resources/healthcare-automation-readiness/ | LCP (desktop): 13946 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0075 | /resources/healthcare-automation-readiness/ | LCP (mobile): 83822 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0076 | /resources/healthcare-revenue-intelligence-asc-denials/ | LCP (desktop): 13908 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0077 | /resources/healthcare-revenue-intelligence-asc-denials/ | LCP (mobile): 83679 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0078 | /resources/practice-ops-kpi-model/ | LCP (desktop): 13840 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0079 | /resources/practice-ops-kpi-model/ | LCP (mobile): 83961 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0080 | /resources/revenue-leakage-guide/ | LCP (desktop): 13887 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0081 | /resources/revenue-leakage-guide/ | LCP (mobile): 83823 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0082 | /services/ | LCP (desktop): 13966 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0083 | /services/ | LCP (mobile): 83994 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0084 | /services/ar-recovery/ | LCP (desktop): 14027 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0085 | /services/ar-recovery/ | LCP (mobile): 84360 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0086 | /services/credentialing/ | LCP (desktop): 14053 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0087 | /services/credentialing/ | LCP (mobile): 84357 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0088 | /services/denial-management/ | LCP (desktop): 13897 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0089 | /services/denial-management/ | LCP (mobile): 83948 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0090 | /services/healthcare-it/ | LCP (desktop): 13969 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0091 | /services/healthcare-it/ | LCP (mobile): 84433 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0092 | /services/medical-billing/ | LCP (desktop): 13980 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0093 | /services/medical-billing/ | LCP (mobile): 84044 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0094 | /services/operational-consulting/ | LCP (desktop): 14008 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0095 | /services/operational-consulting/ | LCP (mobile): 84340 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0096 | /services/patient-balances/ | LCP (desktop): 14052 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0097 | /services/patient-balances/ | LCP (mobile): 84515 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0098 | /services/payment-posting/ | LCP (desktop): 14062 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0099 | /services/payment-posting/ | LCP (mobile): 84514 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0100 | /services/practice-ops/ | LCP (desktop): 14028 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0101 | /services/practice-ops/ | LCP (mobile): 84506 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0102 | /services/rcm/ | LCP (desktop): 13991 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0103 | /services/rcm/ | LCP (mobile): 84068 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0104 | /services/reporting-analytics/ | LCP (desktop): 14033 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0105 | /services/reporting-analytics/ | LCP (mobile): 84432 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0106 | /services/workflow-automation/ | LCP (desktop): 13957 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0107 | /services/workflow-automation/ | LCP (mobile): 84118 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0108 | /solutions/ | LCP (desktop): 13849 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0109 | /solutions/ | LCP (mobile): 83877 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0110 | /solutions/aging-ar/ | LCP (desktop): 13973 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0111 | /solutions/aging-ar/ | LCP (mobile): 84135 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0112 | /solutions/credentialing-bottlenecks/ | LCP (desktop): 13910 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0113 | /solutions/credentialing-bottlenecks/ | LCP (mobile): 84258 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0114 | /solutions/denials/ | LCP (desktop): 13930 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0115 | /solutions/denials/ | LCP (mobile): 84212 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0116 | /solutions/operational-efficiency/ | LCP (desktop): 13996 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0117 | /solutions/operational-efficiency/ | LCP (mobile): 84489 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0118 | /solutions/reporting-visibility/ | LCP (desktop): 13941 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0119 | /solutions/reporting-visibility/ | LCP (mobile): 84200 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0120 | /solutions/revenue-leakage/ | LCP (desktop): 13936 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0121 | /solutions/revenue-leakage/ | LCP (mobile): 84130 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0122 | /solutions/scaling-practice-ops/ | LCP (desktop): 14027 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0123 | /solutions/scaling-practice-ops/ | LCP (mobile): 84648 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0124 | /technology/ | LCP (desktop): 14038 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0125 | /technology/ | LCP (mobile): 84013 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0126 | /technology/dirt/ | LCP (desktop): 13892 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0127 | /technology/dirt/ | LCP (mobile): 83747 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0128 | /terms/ | LCP (desktop): 13830 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0129 | /terms/ | LCP (mobile): 83764 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0130 | /thank-you/ | LCP (desktop): 13877 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0131 | /thank-you/ | LCP (mobile): 83813 ms (threshold 2500 ms) | **High** | [JSON](./ux-0-3-evidence/lighthouse.json) | Profile the LCP element; optimize hero asset delivery, render blocking resources and initial route chunk. |
| UX03-0132 | /about/ ↔ /company/about/ | Duplicate copy: 100% 5-word shingle Jaccard overlap of main content | **Medium** | [JSON](./ux-0-3-evidence/duplicates.json) | Review canonical intent and differentiate decision-support information; retain legally necessary shared wording. |
| UX03-0133 | /privacy-policy/ ↔ /legal/privacy/ | Duplicate copy: 100% 5-word shingle Jaccard overlap of main content | **Medium** | [JSON](./ux-0-3-evidence/duplicates.json) | Review canonical intent and differentiate decision-support information; retain legally necessary shared wording. |
| UX03-0134 | /terms/ ↔ /legal/terms/ | Duplicate copy: 100% 5-word shingle Jaccard overlap of main content | **Medium** | [JSON](./ux-0-3-evidence/duplicates.json) | Review canonical intent and differentiate decision-support information; retain legally necessary shared wording. |
| UX03-0135 | Cross-route (button, dark) | Computed-style conflict: 10 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0136 | Cross-route (button, light) | Computed-style conflict: 10 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0137 | Cross-route (h1, dark) | Computed-style conflict: 4 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0138 | Cross-route (h1, light) | Computed-style conflict: 4 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0139 | Cross-route (h2, dark) | Computed-style conflict: 7 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0140 | Cross-route (h2, light) | Computed-style conflict: 7 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0141 | Cross-route (p, dark) | Computed-style conflict: 24 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |
| UX03-0142 | Cross-route (p, light) | Computed-style conflict: 22 distinct computed style signatures (>2 threshold; may include intentional variants) | **Medium** | [JSON](./ux-0-3-evidence/styles.json) | Compare element roles and canonical Clinical Glass typography/button tokens; remove only unintended overrides. |

## Calibration and interpretation warnings

- **LCP values are provisional, not confirmed production defects.** All 114 simulated Lighthouse scans exceeded 2.5 s. Median LCP is approximately **83,976 ms mobile** and **13,946 ms desktop**, with remarkably similar results across unrelated routes. The audits used a **Vite development server**, not an optimized production preview. This unusually uniform pattern suggests test-environment or shared loading overhead may dominate; these 114 High flags require repeat measurement against `npm run build` + `npm run preview` before any route-specific performance remediation or public performance claim.
- **CLS exceptions occur on an internal prototype.** The two CLS High flags (0.242 mobile, 0.332 desktop) are for `/case-studies/dirt-poc-01/`, excluded from production builds. Prioritize validation of real public routes separately.
- **Copy overlaps are intentional aliases.** All three >85% shingle-overlap pairs are legacy canonical aliases (`/company/about/`, `/legal/privacy/`, `/legal/terms/`) and their destination pages. Treat as SEO canonical/redirect hygiene checks, **not** instructions to rewrite legitimate page content. No non-alias page pairs crossed the duplication threshold.
- **15 Critical rows are theme/route observations, not 15 independent root causes.** Several repeat the same link styling rule across light/dark themes or canonical aliases. Axe JSON identifies affected nodes; linked UX-0.2 screenshots provide route/theme visual context but are not element-highlighted defect screenshots.
- **INP is unmeasured.** Lighthouse's lab navigation cannot establish field Interaction to Next Paint. All 114 INP cells deliberately show `N/A`. TBT is reported independently, not as INP.

## Interpretation and release decision

- Axe criticals require semantic/component remediation, then retest with a keyboard and at least one screen reader; axe alone cannot prove WCAG 2.2 AA compliance.
- Styles compare computed font, color, padding and border-radius. Distinct signatures can be legitimate role-specific designs; they are triage flags, not automatic CSS changes.
- Shingle similarity uses **5-word Jaccard similarity of main-content text**, excluding global navigation and footer.
- Screenshot links point to the immutable UX-0.2 route/theme evidence on this branch; screenshots establish visual context, while the JSON identifies exact axe selectors and rule IDs.
- Tests run against local development Vite, **not measured production field experience**. Performance numbers must be reconfirmed against a representative production preview before launch.
- No user-facing website source files or deployment configuration were modified for this audit.
