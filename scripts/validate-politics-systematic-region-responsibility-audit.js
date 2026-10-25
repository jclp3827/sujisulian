#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const evidencePath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-region-responsibility-audit-p10-20261024.json';
const evidence = JSON.parse(fs.readFileSync(path.join(root, evidencePath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');

assert.equal(evidence.status, 'passed-with-retained-hold');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
for (const name of ['source', 'runtime', 'projection', 'wxml', 'wxss', 'governance']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}
assert.deepEqual(evidence.rulesApplied, [44, 45, 46, 47]);
assert.equal(evidence.scope.historicallyChangedLessonCount, 45);
assert.equal(evidence.scope.previouslyAcceptedLessonCount, 44);
assert.equal(evidence.scope.reviewedLessonCount, 45);
assert.equal(evidence.scope.fixedInP10Count, 2);
assert.equal(evidence.scope.fixedInP10R1Count, 11);
assert.equal(evidence.scope.fixedTotalCount, 15);
assert.equal(evidence.scope.openRiskCount, 0);
assert.equal(evidence.scope.retainedHoldCount, 1);
assert.equal(evidence.scope.passedCount, 29);
assert.equal(evidence.entries.length, 45);
assert.deepEqual([...evidence.fixedLessonIds].sort(), [
  'BASICS-01', 'BASICS-04', 'CULTUREECO-04', 'DEV-02', 'DEV-04', 'DEV-06',
  'DIALECTICS-01', 'LEADERSHIP-03', 'MOD-02', 'MONEY-02', 'REFORMLAW-03', 'SYS-01',
  'TEN-01', 'TEN-02', 'TEN-04',
].sort());
assert.deepEqual(evidence.retainedHoldLessonIds, ['CAPITAL-02']);

const ten = source.lessons.find(item => item.id === 'TEN-01');
const modern = source.lessons.find(item => item.id === 'MOD-02');
assert.equal(ten.boundary.label, '主要矛盾变化不改变基本国情');
assert.doesNotMatch(ten.sections[2].text, /基本国情/);
assert.doesNotMatch(ten.recap.text, /基本国情/);
assert.match(ten.recap.text, /依次明确党的领导地位/);
assert.match(modern.recap.text, /五个方面/);
assert.doesNotMatch(modern.recap.text, /中国式现代化是人口规模巨大的现代化/);
assert.equal(source.lessons.find(item => item.id === 'BASICS-04').boundary, undefined);
assert.equal(source.lessons.find(item => item.id === 'LEADERSHIP-03').boundary, undefined);
assert.equal(source.lessons.find(item => item.id === 'REFORMLAW-03').boundary.label, '重点不等于省略其他环节');
assert.match(source.lessons.find(item => item.id === 'TEN-02').recap.text, /两个布局回答事业怎样展开/);

const mockPart = {
  id: 'mock-recap', kind: 'recap', label: '本节结论',
  text: '第一项；第二项；第三项', sourceBlockIds: [], emphasized: true,
};
const lesson = runtime.lessons.find(item => item.id === 'MONEY-01');
const projected = projection.projectLessonPart(mockPart);
assert.match(fs.readFileSync(path.join(root, evidence.wxmlPath), 'utf8'), /item\.paragraphs\.length > 1/);
assert.match(fs.readFileSync(path.join(root, evidence.wxssPath), 'utf8'), /unit-body-paragraph \+ \.unit-body-paragraph/);
assert.equal(projected.paragraphs.length, 3);
assert.deepEqual(projected.paragraphs.map(item => item.runs.map(run => run.text).join('')), ['第一项', '第二项', '第三项']);
assert.ok(lesson);
assert.equal(evidence.releaseAuthorized, false);

console.log(JSON.stringify({
  status: 'passed',
  auditStatus: evidence.status,
  curriculumVersion: runtime.curriculumVersion,
  reviewedLessonCount: evidence.scope.reviewedLessonCount,
  fixedInP10Count: evidence.scope.fixedInP10Count,
  fixedInP10R1Count: evidence.scope.fixedInP10R1Count,
  openRiskCount: evidence.scope.openRiskCount,
}));
