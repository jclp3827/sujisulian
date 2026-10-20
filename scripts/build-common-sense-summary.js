const fs = require('node:fs');
const path = require('node:path');

function summarySource(content) {
  const categories = new Map(content.categories.map(item => [item.id, item]));
  const entryIds = entry => [entry.pointId, ...(categories.get(entry.categoryId)?.pointIds
    || content.points.filter(point => point.categoryId === entry.categoryId).map(point => point.id))].filter(Boolean);
  const parts = content.directory.map(part => {
    const ids = new Set(part.chapters.flatMap(chapter => [...entryIds(chapter), ...(chapter.sections || []).flatMap(entryIds)]));
    return { id: part.id, order: part.order, title: part.title, subtitle: part.subtitle, metaText: `${part.chapters.length} 章`, pointCount: ids.size };
  });
  const result = { module: content.module, totalPointCount: content.points.length, parts };
  return '// Generated from the common-sense directory. Do not edit counts by hand.\nmodule.exports = ' + JSON.stringify(result, null, 2) + ';\n';
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const content = require(path.join(root, 'miniprogram/subpackages/common-sense/models/note-common-sense'));
  const output = path.join(root, 'miniprogram/models/common-sense-summary.js');
  const expected = summarySource(content);
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(output, 'utf8') !== expected) throw new Error('Common-sense summary is stale; rebuild it');
  } else fs.writeFileSync(output, expected);
  console.log('Common-sense summary verified against the source directory');
}
module.exports = { summarySource };
