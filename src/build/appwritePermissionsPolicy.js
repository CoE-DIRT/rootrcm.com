/** Policy-as-code for NEW, separately approved Appwrite collections.
 * Never grants permissions or changes existing private TablesDB on import.
 */
export const appwriteCollectionPolicy = Object.freeze({
  diagnostic_leads: {
    // Future collection only: requires server-side anti-bot validation and
    // explicit risk sign-off BEFORE enabling unauthenticated create.
    permissions: ['create("any")'],
    documentSecurity: false,
    status: 'NOT_PROVISIONED_DO_NOT_ENABLE',
  },
  case_studies: {
    permissions: ['read("any")', 'create("label:admin")', 'update("label:admin")', 'delete("label:admin")'],
    documentSecurity: false,
    status: 'NOT_PROVISIONED',
  },
  resources: {
    permissions: ['read("any")', 'create("label:admin")', 'update("label:admin")', 'delete("label:admin")'],
    documentSecurity: false,
    status: 'NOT_PROVISIONED',
  },
});
/** Detect accidental disclosure in CURRENT private analytics or any future lead collection. */
export function inspectAppwritePermissionSet(collectionId, permissions = []) {
  const all = Array.isArray(permissions) ? permissions : [];
  const publicReads = all.filter(p => /^(read|update|delete|write)\("(any|guests|users)"\)$/.test(p));
  const publicWrites = all.filter(p => /^(create|update|delete|write)\("(any|guests|users)"\)$/.test(p));
  if (collectionId === 'tracking_events' || collectionId === 'diagnostic_leads') {
    return { safe: publicReads.length === 0 && (collectionId === 'tracking_events' ? publicWrites.length === 0 : true),
      violations: collectionId === 'tracking_events' ? [...publicReads, ...publicWrites] : publicReads };
  }
  if (collectionId === 'case_studies' || collectionId === 'resources') {
    const expected = appwriteCollectionPolicy[collectionId].permissions;
    return { safe: expected.every(p => all.includes(p)) && all.every(p => expected.includes(p)), violations: all.filter(p => !expected.includes(p)) };
  }
  return { safe: false, violations: ['Unknown collection; review manually'] };
}
