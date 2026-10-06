# Google Business Profile

**Status: not done. No Business Profile is verified or claimed to exist, and no `LocalBusiness` markup is on the site.** This is a manual
owner action with an eligibility question that only the owner can answer.

## Eligibility first (owner decision)

Google lists a business only if it has a real location or service area and in-person contact with customers or serves customers at their
locations. The published address (`2803 Philadelphia Pike, Suite B #1864, Claymont, DE 19703`, from `companyInfo`) looks like a mailing
or mailbox address. Mailbox and virtual-office addresses are generally **not** eligible and a Profile created with one can be suspended.

Decide, with Google's current guidelines open, which is true:

1. ROOT staffs a physical location and meets customers there: eligible as a storefront-style business.
2. ROOT serves clients at their sites or remotely, with no public location: at most a **service-area business** that hides the address; confirm
   that ROOT's remote consulting qualifies.
3. Neither: do not create a Profile. Rely on the website and LinkedIn instead.

## If eligible: setup checklist

| Item | Guidance |
| --- | --- |
| Business name | Exactly the registered or publicly used name. No keywords, locations or slogans added. |
| Category | Choose the primary category from Google's list that matches the real service; confirm the exact label in the Profile editor (the list changes). Add secondary categories only for services ROOT actually delivers. |
| Address / service area | Per the eligibility decision. Do not publish a mailbox address as a storefront. |
| Phone, website, email | Use the same values as the website (`+1 (302) 506 4685`, `https://rootrcm.com/`, `info@rootrcm.com`) so name, address and phone match everywhere (NAP consistency). |
| Hours | The owner supplies real hours. Do not guess; do not claim 24/7. |
| Description | Plain, factual, within Google's limit; no unverifiable claims, awards, guarantees or rankings. |
| Photos | Only images ROOT owns or is licensed to use; no stock photos presented as ROOT staff or clients; **no PHI** and no patient or payer documents. |
| Verification | Complete Google's prompted method (postcard, phone, email or video) as the owner. Do not share verification codes. |
| Link tagging | Optional UTM on the website link (for example `utm_source=google&utm_medium=organic&utm_campaign=gbp`); the site records campaign labels only after analytics consent. |

## Reviews and posts

- Never create, buy, exchange or incentivise reviews. Reply to genuine reviews professionally.
- **Never include PHI** or anything identifying a patient, claim or payer in a reply, post or photo.
- Do not post unverified outcomes, statistics, testimonials or certifications.

## After verification (separate change)

Only once the Profile is verified and its details are final: add `ProfessionalService` or `LocalBusiness` JSON-LD from the verified data in
`src/seo/schema.js`, with real hours and the verified address, and update the `Organization` `sameAs` only with confirmed profile URLs. Until then
`src/seo/schema.js` deliberately emits no `LocalBusiness`.

## Record

Date verified: _not yet_. Method: _not yet_. Owner: _not yet_.
