const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5b-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);

assert.equal(runtime.curriculumVersion, latest.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-32d289a15964');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.equal(evidence.rewrittenSourceLanguageObjects, 44);
assert.equal(evidence.synchronizedScopeLimits, 72);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
assert.equal(source.lessons.length, 72);
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

for (const lesson of source.lessons) {
  const question = lesson.question.replace(/[？?。]$/, '');
  const visibleBody = [lesson.scopeLimit, ...lesson.sections.map(item => item.text), lesson.boundary.text,
    lesson.recap.text, lesson.reflection.answer].join('\n');
  assert.match(lesson.scopeLimit, /^学习重点：/);
  assert.ok(lesson.scopeLimit.includes(question), `${lesson.id} scope is not aligned with current question`);
  assert.doesNotMatch(visibleBody, /原文|正文|正式表述|的说明/, `${lesson.id} exposes author/source language`);
}

assert.equal(source.lessons.find(item => item.id === 'UNITYFOREIGN-03').scopeLimit,
  '学习重点：人类命运共同体包括哪些目标。不补写时事进展。');
assert.match(source.lessons.find(item => item.id === 'DEV-05').sections[0].text, /^社会主义市场经济体制既要发挥市场作用/);
assert.match(source.lessons.find(item => item.id === 'CAPITAL-02').boundary.text, /资本分类.*定义关系/);

console.log(JSON.stringify({ status: 'passed', batch: evidence.batchId, lessons: source.lessons.length,
  rewrittenObjects: evidence.rewrittenObjects, synchronizedScopeLimits: evidence.synchronizedScopeLimits,
  sourceLanguageLeaks: 0, currentCurriculumVersion: runtime.curriculumVersion,
  batchCurriculumVersion: evidence.curriculumVersion, realUserAcceptance: 'pending' }));
