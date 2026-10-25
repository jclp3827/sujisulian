#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const evidencePath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-retrospective-audit-20261024.json';
const evidence = JSON.parse(fs.readFileSync(path.join(root, evidencePath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');

assert.equal(evidence.status, 'risk-open');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
for (const name of ['source', 'runtime', 'projection', 'governance']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}
assert.equal(evidence.scope.totalLessonCount, 72);
assert.equal(evidence.scope.totalGroupCount, 21);
assert.equal(evidence.scope.historicallyChangedLessonCount, 45);
assert.equal(evidence.scope.currentBoundaryLessonCount, 8);
assert.equal(evidence.scope.currentBoundaryLessonCount, source.lessons.filter(lesson => lesson.boundary).length);
assert.equal(evidence.scope.sectionEmphasisGapCount, 0);
assert.equal(evidence.scope.displayTitleAuditLessonCount, 72);
assert.equal(evidence.scope.runtimeVisualAuditLessonCount, 72);
assert.deepEqual(evidence.rulesActivated, [38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
assert.equal(evidence.acceptanceReporting.required, true);
assert.equal(evidence.acceptanceReporting.format, '<篇章>-<主题>-<小节>');
const expectedReviewPaths = buildLessonReviewPaths(source, projection.displayTitleForLessonId);
assert.deepEqual(evidence.acceptanceReporting.paths, expectedReviewPaths);
assert.equal(Object.keys(evidence.acceptanceReporting.paths).length, 72);
assert.equal(new Set(Object.values(evidence.acceptanceReporting.paths).map(item => item.displayPath)).size, 72);
assert.equal(
  evidence.acceptanceReporting.paths['TEN-01'].displayPath,
  '新时代思想-十个明确-党的领导、总任务、社会主要矛盾与人民立场·十个明确第1—3条',
);
assert.deepEqual(evidence.metaReview.retainedHoldLessonIds, ['CAPITAL-02']);
assert.equal(source.lessons.find(lesson => lesson.id === 'VALUE-01').boundary, undefined);
assert.match(source.lessons.find(lesson => lesson.id === 'VALUE-01').sections[3].text, /不可兼得/);
assert.equal(source.lessons.find(lesson => lesson.id === 'FOUND-03').question, '“两个结合”分别是什么？');
assert.deepEqual(source.lessons.find(lesson => lesson.id === 'FOUND-03').sections.slice(1, 3).map(section => section.label), [
  '马克思主义基本原理同中国具体实际相结合（第一个结合）',
  '马克思主义基本原理同中华优秀传统文化相结合（第二个结合）',
]);
assert.deepEqual(['TEN-01', 'TEN-02', 'TEN-03', 'TEN-04'].map(projection.displayTitleForLessonId), [
  '党的领导、总任务、社会主要矛盾与人民立场·十个明确第1—3条',
  '事业布局与改革、法治总目标·十个明确第4—6条',
  '经济发展要求·十个明确第7条',
  '强军目标、中国特色大国外交与全面从严治党·十个明确第8—10条',
]);
for (const id of ['VALUE-03', 'DEV-03', 'DEV-07', 'LIVELIHOOD-02', 'SUPPORT-02']) {
  assert.equal(source.lessons.find(lesson => lesson.id === id).boundary, undefined, id + ' boundary remains');
}
for (const id of ['DEMOCRACY-03', 'CULTUREECO-04', 'PARTY-03', 'UNITYFOREIGN-03', 'MONEY-02']) {
  assert.equal(source.lessons.find(lesson => lesson.id === id).boundary, undefined, id + ' boundary remains');
}
for (const id of ['DEV-02', 'DEV-05', 'DEV-06', 'MOD-02', 'SYS-01']) {
  assert.equal(source.lessons.find(lesson => lesson.id === id).boundary, undefined, id + ' boundary remains');
}
assert.deepEqual(evidence.prioritizedReviewQueues.themeEndingConclusionPriority, ['CAPITAL-02']);
assert.deepEqual(source.lessons.find(lesson => lesson.id === 'DEV-07').sections.map(section => section.label), [
  '区域协调发展战略', '区域重大战略', '主体功能区战略', '新型城镇化',
]);
assert.equal(evidence.releaseAuthorized, false);

console.log(JSON.stringify({
  status: 'passed',
  auditStatus: evidence.status,
  curriculumVersion: runtime.curriculumVersion,
  historicallyChangedLessonCount: evidence.scope.historicallyChangedLessonCount,
  currentBoundaryLessonCount: evidence.scope.currentBoundaryLessonCount,
  totalGroupCount: evidence.scope.totalGroupCount,
  totalLessonCount: evidence.scope.totalLessonCount,
}));
