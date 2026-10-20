const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { knowledgePackage } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const { projectTextRuns } = require('../miniprogram/services/knowledge-platform/reading-text');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'docs/knowledge-pilot/sources/politics');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const read = file => fs.readFileSync(path.join(root, file));
const field = value => assert.ok(typeof value === 'string' && value.trim().length, 'missing content field');

function validate(samples, inventory, pkg = knowledgePackage, readFile = read) {
  assert.equal(samples.schemaVersion, 1);
  assert.equal(inventory.schemaVersion, 1);
  assert.equal(samples.status, 'draft');
  assert.equal(samples.contentApproval, 'pending-editorial-review');
  assert.equal(samples.userExperienceAccepted, false);
  assert.equal(samples.published, false);
  assert.equal(inventory.published, false);
  assert.equal(samples.sourcePackageVersion, pkg.packageVersion);
  assert.equal(inventory.sourcePackageVersion, pkg.packageVersion);

  const units = new Map(pkg.knowledgeUnits.map(unit => [unit.id, unit]));
  const blocks = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, block])));
  const rows = new Map(inventory.units.map(row => [row.unitId, row]));
  assert.equal(rows.size, inventory.units.length, 'duplicate inventory unit');
  assert.equal(rows.size, units.size, 'incomplete inventory');
  for (const [id, unit] of units) {
    const row = rows.get(id);
    assert.ok(row, 'missing inventory unit ' + id);
    assert.ok(['reorganize', 'explain', 'source-gap'].includes(row.action));
    assert.ok(row.proposedGoals.length > 0);
    field(row.note);
    assert.equal(row.contentSha256, digest(JSON.stringify(unit.blocks.map(block => ({ id: block.id, text: block.fallbackText || '' })))), 'unit source drift ' + id);
    assert.ok(row.sourceFile.path.startsWith('docs/knowledge-pilot/knowledge/politics-v2/' + id + '-'), 'wrong source file identity');
    assert.equal(row.sourceFile.sha256, digest(readFile(row.sourceFile.path)), 'Markdown source drift ' + id);
    assert.equal(row.sourceBlocks.length, unit.blocks.length);
    assert.equal(new Set(row.sourceBlocks.map(block => block.blockId)).size, unit.blocks.length);
    for (const item of row.sourceBlocks) {
      const block = blocks.get(item.blockId);
      assert.ok(unit.blocks.some(candidate => candidate.id === item.blockId));
      assert.equal(item.textSha256, digest(block.fallbackText || ''), 'inventory source drift');
    }
  }
  assert.equal(inventory.gaps.length, 3);
  for (const gap of inventory.gaps) {
    assert.ok(gap.unitIds.every(id => rows.get(id)?.action === 'source-gap'));
    field(gap.topic); field(gap.handling);
  }

  const bindings = new Map(samples.sourceBindings.map(item => [item.blockId, item.textSha256]));
  assert.equal(bindings.size, samples.sourceBindings.length, 'duplicate binding');
  for (const [id, sha] of bindings) {
    assert.ok(blocks.has(id), 'missing source block ' + id);
    assert.equal(sha, digest(blocks.get(id).fallbackText || ''), 'sample source drift ' + id);
  }

  const lessons = new Map(samples.lessons.map(lesson => [lesson.id, lesson]));
  assert.equal(lessons.size, samples.lessons.length, 'duplicate lesson');
  const usedBindings = new Set();
  function evidence(part) {
    field(part.text || part.answer);
    assert.ok(part.sourceBlockIds?.length, 'missing evidence');
    for (const id of part.sourceBlockIds) {
      assert.ok(bindings.has(id), 'unbound source ' + id);
      usedBindings.add(id);
    }
    if (part.text) {
      const runs = projectTextRuns({ text: part.text }, part.text, { emphasis: part.emphasis || [] }, 'text');
      assert.equal(runs.map(run => run.text).join(''), part.text);
      for (const selection of part.emphasis || []) {
        assert.ok(part.text.split(selection.quote).length > selection.occurrence, 'invalid emphasis selector');
        assert.ok(runs.some(run => run.role === selection.role && run.text.includes(selection.quote)), 'emphasis not consumed');
      }
    }
  }
  const sizes = [];
  for (const lesson of lessons.values()) {
    field(lesson.title); field(lesson.question); field(lesson.scopeLimit);
    assert.ok(lesson.objectives.length >= 1 && lesson.objectives.length <= 3);
    lesson.objectives.forEach(field);
    assert.ok(lesson.sections.length >= 2, 'no explanatory sequence');
    lesson.sections.forEach(evidence);
    assert.ok(lesson.boundary, 'missing necessary boundary');
    evidence(lesson.boundary); evidence(lesson.recap);
    field(lesson.reflection.prompt); evidence(lesson.reflection);
    const chars = [...lesson.sections, lesson.boundary, lesson.recap].reduce((sum, part) => sum + part.text.length, 0);
    assert.ok(chars <= 900, 'sample needs budget review ' + lesson.id);
    sizes.push(chars);
  }

  const grouped = new Set();
  for (const group of samples.groups) {
    assert.ok(group.lessonIds.length > 1, 'not a continuous sample');
    group.lessonIds.forEach((id, index) => {
      const lesson = lessons.get(id);
      assert.ok(lesson && lesson.groupId === group.id, 'missing or foreign lesson');
      assert.ok(!grouped.has(id), 'lesson in multiple groups');
      grouped.add(id);
      assert.equal(lesson.previousLessonId, group.lessonIds[index - 1] || null);
      assert.equal(lesson.nextLessonId, group.lessonIds[index + 1] || null, 'broken lesson continuity');
      field(lesson.transition);
    });
    if (group.enumeration) {
      const items = group.lessonIds.flatMap(id => lessons.get(id).enumerationItems || []);
      assert.equal(items.length, group.enumeration.count, 'missing enumeration item');
      assert.deepEqual(items.map(item => item.ordinal).sort((a, b) => a - b), Array.from({ length: group.enumeration.count }, (_, i) => i + 1));
      for (const item of items) {
        assert.equal(item.groupId, group.enumeration.id);
        assert.equal(item.sourceBlockId, `block:politics-toc-v2-u003:b${String(item.ordinal + 4).padStart(3, '0')}`);
        assert.ok(group.lessonIds.some(id => lessons.get(id).sections.some(part => part.sourceBlockIds.includes(item.sourceBlockId))), 'enumeration only in optional or recap content');
      }
    }
  }
  assert.equal(grouped.size, lessons.size, 'ungrouped lesson');
  assert.equal(usedBindings.size, bindings.size, 'unused source binding');
  for (const row of inventory.units) for (const item of row.sourceBlocks) {
    const actual = samples.lessons.filter(lesson => [...lesson.sections, lesson.boundary, lesson.recap, lesson.reflection].some(part => part.sourceBlockIds.includes(item.blockId))).map(lesson => lesson.id);
    assert.deepEqual(item.sampleLessonIds, actual, 'false sample coverage ' + item.blockId);
  }
  return { status: 'passed', stage: 'P1-draft-only', inventoryUnits: rows.size, sampleGroups: samples.groups.length,
    sampleLessons: lessons.size, exactSourceBindings: bindings.size, defaultChars: { min: Math.min(...sizes), max: Math.max(...sizes) },
    remainingSourceGaps: inventory.gaps.length, contentApproved: false, userExperienceAccepted: false, runtimeIntegrationAssessed: false };
}

function main() {
  const samples = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'systematic-learning-v2-samples.json'), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'systematic-learning-v2-content-inventory.json'), 'utf8'));
  const result = validate(samples, inventory);
  const readingFile = path.join(root, 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md');
  const reading = fs.readFileSync(readingFile, 'utf8').replace(/\*\*/g, '');
  for (const lesson of samples.lessons) {
    assert.ok(reading.includes(lesson.title), 'reading draft missing lesson');
    for (const part of [...lesson.sections, lesson.boundary, lesson.recap]) assert.ok(reading.includes(part.text), 'reading draft differs from source artifact');
    assert.ok(reading.includes(lesson.reflection.prompt) && reading.includes(lesson.reflection.answer), 'reading draft missing optional reflection');
  }
  const rejects = [
    ['source drift', (s, i, p) => { p.knowledgeUnits[0].blocks[1].fallbackText += '漂移'; }],
    ['missing ten item', s => { s.lessons[0].enumerationItems.pop(); }],
    ['missing boundary', s => { delete s.lessons[0].boundary; }],
    ['broken continuity', s => { s.lessons[0].nextLessonId = 'UNKNOWN'; }],
    ['invalid emphasis', s => { s.lessons[0].sections[0].emphasis = [{ quote: '不存在的重点', part: 'text', occurrence: 1, role: 'key' }]; }],
    ['missing evidence', s => { s.lessons[0].sections[0].sourceBlockIds = []; }],
    ['false coverage', (s, i) => { i.units[0].sourceBlocks[0].sampleLessonIds.push('TEN-01'); }],
    ['missing inventory unit', (s, i) => { i.units.pop(); }],
  ];
  for (const [name, mutate] of rejects) {
    const s = clone(samples), i = clone(inventory), p = clone(knowledgePackage);
    mutate(s, i, p);
    assert.throws(() => validate(s, i, p), undefined, name + ' was not rejected');
  }
  assert.throws(() => validate(samples, inventory, knowledgePackage, () => Buffer.from('changed Markdown')), /Markdown source drift/);
  result.negativeCasesRejected = rejects.length + 1;
  console.log(JSON.stringify(result));
}

if (require.main === module) main();
module.exports = { validate };
