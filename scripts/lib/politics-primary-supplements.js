const assert = require('node:assert/strict');
const crypto = require('node:crypto');
function applyPrimarySupplements(points, registry) {
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.published, false);
  const refs = new Map(registry.sources.map(source => [source.id, source]));
  assert.equal(refs.size, registry.sources.length, 'duplicate supplemental source');
  for (const source of refs.values()) {
    assert.match(source.locator.url, /^https:\/\//);
    assert.equal(source.publishable, false);
  }
  const owners = new Map(points.map(point => [point.id, point]));
  for (const block of registry.blocks) {
    const point = owners.get(block.unitId);
    assert.ok(point, 'unknown supplemental owner');
    assert.ok(![...point.contentBlocks, ...point.confusionBlocks].some(item => item.id === block.id), 'supplement block collision');
    assert.equal(crypto.createHash('sha256').update(block.text).digest('hex'), block.textSha256, 'supplement text hash drift');
    assert.ok(block.sourceRefIds.length && block.sourceRefIds.every(id => refs.has(id)), 'missing supplemental provenance');
    const rendered = {id:block.id, type:block.type, semantic:block.semantic, text:block.text,
      sourceRefIds:block.sourceRefIds, sourceLocator:{section:block.locator},
      reviewState:block.reviewState, publishable:false};
    point.contentBlocks.push(rendered);
    point.content += '\n\n' + (block.teachingTitle || '') + '\n' + block.text;
    point.hasCandidateSupplement = true;
  }
  for (const correction of registry.sourceCorrections || []) {
    const point = owners.get(correction.unitId);
    const original = [...point.contentBlocks, ...point.confusionBlocks].find(block => block.id === correction.blockId);
    assert.ok(original, 'correction original missing');
    assert.ok(point.contentBlocks.some(block => 'block:' + point.id + ':' + block.id === correction.correctionBlockId), 'correction target missing');
    original.sourceCorrection = {note:correction.note, correctionBlockId:correction.correctionBlockId};
  }
  return registry.sources;
}
module.exports = { applyPrimarySupplements };
