#!/usr/bin/env node
const { getPoliticsQuestionCatalogue: getQuestionCatalogue } = require('./lib/politics-question-catalogue');
function main(args = process.argv.slice(2)) {
  const keys = { objective: 'objectiveId', unit: 'unitId', source: 'sourceBlockId', kind: 'kind', consumer: 'consumer' };
  const filters = {}; let itemId;
  for (const arg of args) {
    const match = /^--(objective|unit|source|kind|consumer|item)=(.+)$/.exec(arg);
    if (!match) throw new Error('Use --objective=ID --unit=ID --source=ID --kind=TYPE --consumer=MODULE or --item=ID');
    const key = match[1] === 'item' ? 'itemId' : keys[match[1]];
    if (key === 'itemId') { if (itemId) throw new Error('Duplicate item filter'); itemId = match[2]; }
    else { if (filters[key]) throw new Error('Duplicate catalogue filter'); filters[key] = match[2]; }
  }
  if (itemId && Object.keys(filters).length) throw new Error('Item lookup cannot be combined with list filters');
  const catalogue = getQuestionCatalogue();
  const result = itemId ? [catalogue.get(itemId)].filter(Boolean) : args.length ? catalogue.list(filters) : [];
  const output = { mode: args.length ? 'query' : 'summary', version: catalogue.version, counts: catalogue.summary(), sourceVersions: catalogue.versions(),
    ...(args.length ? { query: itemId ? { itemId } : filters,
      objective: filters.objectiveId ? catalogue.objective(filters.objectiveId) : undefined, resultCount: result.length, items: result } : {}) };
  console.log(JSON.stringify(output, null, 2));
  return output;
}
if (require.main === module) main();
module.exports = { main };
