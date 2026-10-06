/**
 * The only campaign labels analytics will store. A free-form utm_* value can carry anything someone puts in a link,
 * including a person's name, so unregistered values are dropped (never stored, never "cleaned up"), in the browser and in
 * the tracking-ingest Function. The Function's copy is generated from this file by
 * `scripts/appwrite/sync-analytics-allowlists.js`; a test fails when the two differ.
 *
 * Values are lower-case. Sources and mediums are generic channel names. Add a campaign here, run the sync script and
 * redeploy the Function BEFORE using it in a link. Use short lower-case words and hyphens that describe the effort
 * (for example "spring-denials-webinar"); never a person, practice, payer, patient or client name.
 */
export const UTM_SOURCES = [
  'bing',
  'direct',
  'duckduckgo',
  'email',
  'facebook',
  'google',
  'instagram',
  'linkedin',
  'newsletter',
  'partner',
  'pinterest',
  'qr',
  'reddit',
  'referral',
  'twitter',
  'x',
  'youtube',
];

export const UTM_MEDIUMS = ['affiliate', 'cpc', 'display', 'email', 'newsletter', 'organic', 'paid', 'partner', 'ppc', 'print', 'qr', 'referral', 'social'];

/** None are registered yet: the owner decides which campaigns exist. Until then `utm_campaign` is never stored. */
export const UTM_CAMPAIGNS = [];
