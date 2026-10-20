const ROUTE_TYPES = ["quick", "systematic", "confusion", "exam"];
const LEGACY_ROUTE_KEY = "knowledgeRoute:politics:active";
const ROUTE_HISTORY_KEY = "knowledgeRoute:politics:history";

function routeProgressKey(type) {
  if (!ROUTE_TYPES.includes(type)) throw new Error(`Unknown route type: ${type}`);
  return `knowledgeRoute:politics:${type}`;
}

function selectRouteRecord(type, ownRecord, legacyRecord) {
  if (ownRecord) return ownRecord;
  return legacyRecord?.planOptions?.type === type ? legacyRecord : null;
}

function recordIdentity(record) {
  return record?.session?.planId || null;
}

function savedSystematicRecords(record) {
  if (record?.savedSystematicRecords !== undefined && !Array.isArray(record.savedSystematicRecords)) throw new Error('Invalid saved systematic records');
  return record?.savedSystematicRecords || [];
}

function plainRecord(record) {
  const { savedSystematicRecords: ignored, recoverySnapshots: snapshots, ...plain } = record;
  return plain;
}

function switchSystematicRecord(current, next, options = {}) {
  if (!recordIdentity(next) || next.planOptions?.type !== 'systematic') throw new Error('Invalid systematic record');
  const records = savedSystematicRecords(current).map(plainRecord);
  if (recordIdentity(current) && recordIdentity(current) !== recordIdentity(next)) {
    const index = records.findIndex(record => recordIdentity(record) === recordIdentity(current));
    if (index >= 0) records[index] = plainRecord(current);
    else records.push(plainRecord(current));
  }
  const recoverySnapshots = current?.recoverySnapshots || [];
  if (!Array.isArray(recoverySnapshots)) throw new Error('Invalid recovery snapshots');
  return { ...plainRecord(next), savedSystematicRecords: records.filter(record => recordIdentity(record) !== recordIdentity(next)),
    ...(recoverySnapshots.length || options.preserveCurrentAsRecovery ? { recoverySnapshots: options.preserveCurrentAsRecovery && current
      ? [...recoverySnapshots, plainRecord(current)] : recoverySnapshots } : {}) };
}

module.exports = { ROUTE_TYPES, LEGACY_ROUTE_KEY, ROUTE_HISTORY_KEY, routeProgressKey, selectRouteRecord,
  recordIdentity, savedSystematicRecords, switchSystematicRecord };
