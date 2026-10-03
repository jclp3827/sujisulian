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

module.exports = { ROUTE_TYPES, LEGACY_ROUTE_KEY, ROUTE_HISTORY_KEY, routeProgressKey, selectRouteRecord };
