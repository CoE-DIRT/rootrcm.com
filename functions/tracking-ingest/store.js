// Storage adapter for the private `web_analytics` / `tracking_events` TablesDB table. The Appwrite SDK objects are
// injected by main.js so this module (and its tests) never import the SDK.
//
// Rows are written with no row permissions: combined with a table that has no permissions and row security off,
// nothing but the Function's server-side API key can read or write them.

const PURGE_BATCH = 500;

export function createAppwriteStore({ tables, Query, databaseId, tableId }) {
  return {
    /** The row id is the event id (a hash of the Stripe session for purchases), so a retried or duplicated event is a 409 and is reported as a duplicate. */
    async createEvent(rowId, row) {
      try {
        await tables.createRow({ databaseId, tableId, rowId, data: row, permissions: [] });
        return 'created';
      } catch (error) {
        if (error && (error.code === 409 || error.type === 'row_already_exists' || error.type === 'document_already_exists')) return 'duplicate';
        throw error;
      }
    },

    /** Delete up to one batch of expired rows; returns how many were removed. */
    async purgeExpired(isoNow) {
      const result = await tables.deleteRows({
        databaseId,
        tableId,
        queries: [Query.lessThanEqual('expires_at', isoNow), Query.limit(PURGE_BATCH)],
      });
      return Array.isArray(result?.rows) ? result.rows.length : 0;
    },
  };
}
