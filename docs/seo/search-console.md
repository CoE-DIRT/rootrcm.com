# Google Search Console

**Status: not done. Search Console is not verified and no sitemap has been submitted.** These are owner actions; nothing in the
repository or this change proves ownership of the property.

## Before you start

- Verification only works against the host that actually serves `https://rootrcm.com`. While production is still the ChatGPT Sites
  deployment (rollback backup) or GitHub Pages, the verification tag must be live **there**. Do not change DNS, the registrar or
  custom-domain routing to verify; that is a separate, later step.
- Pick **URL-prefix** property `https://rootrcm.com/` for the HTML-tag method (no DNS needed). A **Domain** property verifies by DNS TXT and
  covers every subdomain and protocol, but needs a DNS change, which this work does not make.

## Verify with the HTML tag (no DNS change)

1. In Search Console choose **Add property > URL prefix**, enter `https://rootrcm.com/`, and choose the **HTML tag** method. Copy only the
   `content="..."` value.
2. Set `VITE_GSC_VERIFICATION` to that value for the **production** build (the build rejects a pasted full tag or anything that is not a bare token).
3. Deploy that build to the host serving `rootrcm.com`, confirm `<meta name="google-site-verification">` is in the page source, then click **Verify**.
4. Keep the tag in place: removing it can un-verify the property.

A preview build never needs the tag and is never indexed (see [technical-seo.md](technical-seo.md)).

## Submit the sitemap

1. **Sitemaps > Add a new sitemap**: `sitemap.xml` (it is generated at build time at `https://rootrcm.com/sitemap.xml`; 43 URLs; no `noindex`
   pages, aliases, `404.html` or development routes).
2. Expect "Success" and a discovered-URL count that matches the build output. A mismatch means the deployed build is not the one you think.

## First-week checks

| Check | Pass condition |
| --- | --- |
| URL Inspection on `/`, `/services/`, `/pricing/`, `/diagnostic/`, `/faq/` | "URL is on Google" or "can be indexed"; user-declared canonical equals Google-selected canonical |
| `/company/about/`, `/legal/privacy/`, `/legal/terms/` | canonical points at `/about/`, `/privacy-policy/`, `/terms/` |
| `/thank-you/`, `/checkout/success/`, `/checkout/cancel/` | "Excluded by noindex" (expected); **do not** request indexing |
| Pages > "Why pages aren't indexed" | no unexpected "Duplicate", "Soft 404" or "Blocked by robots.txt" for public routes |
| Page experience / Core Web Vitals | review after enough field data exists; no result is claimed here |
| Enhancements | the `FAQPage` markup validates; **do not expect** FAQ rich results (Google limits them for most sites) |
| Security issues / Manual actions | none |

## Hygiene

- Never request indexing for a preview host, and remove any preview URL that appears in the index.
- Add users with the least privilege needed; the owner account holds ownership.
- Record the verification method and date here once done. Do not state in the site or in marketing that the site "ranks" for anything.
- Submitting the sitemap and verifying ownership are not evidence of ranking; do not report them as outcomes.
