const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5c-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);

assert.equal(runtime.curriculumVersion, latest.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-79af43cfcff1');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.equal(evidence.rewrittenEditorialObjects, 35);
assert.equal(evidence.scopeTailChanges, 21);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
assert.equal(source.lessons.length, 72);
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

for (const lesson of source.lessons) {
  const visibleBody = [lesson.scopeLimit, ...lesson.sections.map(item => item.text), lesson.boundary.text,
    lesson.recap.text, lesson.reflection.answer].join('\n');
  assert.doesNotMatch(visibleBody, /这次|本次|本节|这里|保留查阅|可查阅/,
    `${lesson.id} exposes editorial perspective or weak deixis`);
  assert.doesNotMatch(visibleBody, /原文|正文|正式表述|的说明/,
    `${lesson.id} exposes author/source language`);
}

assert.match(source.lessons.find(item => item.id === 'FOUND-02').sections[2].text, /判断对象不同/);
assert.match(source.lessons.find(item => item.id === 'MOD-03').sections[2].text, /中国特色说明“是什么”/);
assert.match(source.lessons.find(item => item.id === 'MONEY-02').boundary.text, /^贮藏手段的条件限定在金属货币理论口径/);

console.log(JSON.stringify({ status: 'passed', batch: evidence.batchId, lessons: source.lessons.length,
  rewrittenObjects: evidence.rewrittenObjects, editorialPerspectiveLeaks: 0,
  currentCurriculumVersion: runtime.curriculumVersion, batchCurriculumVersion: evidence.curriculumVersion,
  realUserAcceptance: 'pending' }));
