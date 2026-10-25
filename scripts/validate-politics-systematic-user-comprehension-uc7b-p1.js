#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root,
  'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const units = require('../miniprogram/services/knowledge-platform/systematic-units');
const aiReview = JSON.parse(fs.readFileSync(path.join(root, evidence.aiReviewPath), 'utf8'));
const runtimeProbe = JSON.parse(fs.readFileSync(path.join(root, evidence.runtimeProbePath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const lesson = id => source.lessons.find(item => item.id === id);
const runtimeLesson = id => runtime.lessons.find(item => item.id === id);
const screen = id => runtimeProbe.screens.find(item => item.lessonId === id);
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);

assert.equal(latest.batchId, evidence.batchId);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified');
assert.equal(runtime.curriculumVersion, evidence.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-c707fa3f7b85');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.changedLessonIds, ['SYS-02', 'SYS-03', 'SYS-04', 'MOD-03', 'FOUND-01']);
assert.ok(evidence.contractRules.includes(29));
assert.equal(evidence.releaseAuthorized, false);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.aiReview, 'passed');
assert.equal(evidence.runtimePageCheck, 'passed');
assert.equal(digest(evidence.sourcePath), evidence.sourceSha256);
assert.equal(digest(evidence.inventoryPath), evidence.inventorySha256);
assert.equal(digest(evidence.runtimePath), evidence.runtimeSha256);
assert.equal(digest(evidence.displayProjectionPath), evidence.displayProjectionSha256);
assert.equal(digest(evidence.aiReviewPath), evidence.aiReviewSha256);
assert.equal(digest(evidence.runtimeProbePath), evidence.runtimeProbeSha256);
assert.ok(runtime.progressCompatibleVersions.includes(evidence.previousCurriculumVersion));
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

const noBoundaryIds = ['SYS-02', 'SYS-03', 'MOD-03', 'FOUND-01'];
for (const id of noBoundaryIds) {
  const item = lesson(id);
  const projected = runtimeLesson(id);
  assert.equal(item.boundary, undefined, `${id} retained redundant boundary`);
  assert.equal(projected.parts.some(part => part.kind === 'boundary'), false);
  const recap = projected.parts.find(part => part.kind === 'recap');
  assert.ok(recap);
  assert.equal(recap.emphasized, true);
}
const wxss = fs.readFileSync(path.join(root, 'miniprogram/subpackages/politics/route/units.wxss'), 'utf8');
const wxml = fs.readFileSync(path.join(root, 'miniprogram/subpackages/politics/route/units.wxml'), 'utf8');
assert.match(wxml, /item\.emphasized \? 'unit-part-emphasized'/);
assert.match(wxss, /\.unit-part-recap\.unit-part-emphasized[^}]*border-left/);

const sys02 = lesson('SYS-02');
assert.equal(sys02.scopeLimit, '学习重点：“十四个坚持”前七项的内容。');
assert.equal(sys02.recap.label, '本节结论');

const sys03 = lesson('SYS-03');
assert.equal(sys03.title, '十四个坚持·八至十四');
assert.equal(sys03.question, '“十四个坚持”第8至14项包括哪些内容？');
assert.deepEqual(sys03.objectives, ['理解“十四个坚持”第8至14项的内容']);
assert.equal(sys03.scopeLimit, '学习重点：“十四个坚持”第8至14项的内容。');
assert.deepEqual(sys03.sections.map(part => part.label), [
  '民生、人与自然与国家安全（第8—10项）',
  '人民军队、祖国统一与人类命运共同体（第11—13项）',
  '全面从严治党（第14项）',
]);
assert.doesNotMatch(sys03.sections[1].text, /对外关系/);
assert.doesNotMatch(sys03.recap.sourceBlockIds.join('\n'), /b018/);
assert.doesNotMatch(sys03.reflection.sourceBlockIds.join('\n'), /b018/);

const sys04 = lesson('SYS-04');
assert.equal(sys04.title, '六个必须坚持·一至三');
assert.equal(sys04.question, '人民至上、自信自立、守正创新分别强调什么？');
assert.deepEqual(sys04.sections.map(part => part.label), [
  '六个必须坚持的定位', '人民至上（第1项）', '自信自立（第2项）', '守正创新（第3项）',
]);
assert.equal(sys04.boundary.label, '人民至上与以人民为中心的关系');
assert.doesNotMatch(sys04.sections[0].text, /不同知识体系/);
assert.match(sys04.sections[0].text, /定位不同、不能互换/);
assert.match(sys04.boundary.text, /正式名称和体系定位不同/);

const mod03 = lesson('MOD-03');
assert.equal(mod03.sections[0].label, '中国式现代化的九项本质要求');
for (const phrase of [
  '坚持中国共产党领导', '坚持中国特色社会主义', '实现高质量发展', '发展全过程人民民主',
  '丰富人民精神世界', '实现全体人民共同富裕', '促进人与自然和谐共生',
  '推动构建人类命运共同体', '创造人类文明新形态',
]) assert.match(mod03.sections[0].text, new RegExp(phrase));
assert.deepEqual(mod03.sections[1].sourceBlockIds, ['block:politics-toc-v2-u004:b025']);
assert.deepEqual(mod03.reflection.sourceBlockIds,
  ['block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026']);

const found01 = lesson('FOUND-01');
assert.equal(found01.title, '坚持和发展中国特色社会主义与四个自信');
assert.equal(found01.question, '坚持和发展中国特色社会主义与四个自信是什么关系？');
assert.deepEqual(found01.sections.map(part => part.label),
  ['坚持和发展中国特色社会主义', '四个自信', '二者的关系']);
assert.doesNotMatch(JSON.stringify(found01), /为什么接着讲|保留各自的作用|基本线索/);
assert.deepEqual(found01.reflection.sourceBlockIds,
  ['block:politics-toc-v2-u001:b002', 'block:politics-toc-v2-u001:b004']);

const forbidden = /控制单次学习量|分成两节|后七项的正式名称|三项方法|其余本质要求|连同前面两项|保留各自的作用|对应主题中展开/;
for (const id of evidence.changedLessonIds) {
  const item = lesson(id);
  assert.doesNotMatch(JSON.stringify(item), forbidden);
  assert.equal(units.displayTitleForLessonId(id), item.title);
  const actual = screen(id);
  const projected = runtimeLesson(id);
  assert.equal(actual.screen, 'lesson');
  assert.equal(actual.title, item.title);
  assert.equal(actual.question, item.question);
  assert.equal(actual.outcomeSummary, item.objectives.join('；'));
  assert.deepEqual(actual.partLabels, projected.parts.map(part => part.label));
  assert.deepEqual(actual.partTexts, projected.parts.map(part => part.text));
  assert.deepEqual(actual.partKinds, projected.parts.map(part => part.kind));
  assert.deepEqual(actual.partEmphasis, projected.parts.map(part => Boolean(part.emphasized)));
  assert.equal(actual.reflection.prompt, item.reflection.prompt);
  assert.equal(actual.reflection.answer, item.reflection.answer);
}

assert.equal(aiReview.curriculumVersion, evidence.curriculumVersion);
assert.equal(aiReview.sourceSha256, evidence.sourceSha256);
assert.deepEqual(aiReview.lessonIds, evidence.changedLessonIds);
assert.ok(Object.values(aiReview.roles).every(role => role.status === 'pass'));
assert.ok(Object.values(aiReview.roles).every(role => role.riskCount === 0 && role.holdCount === 0));
assert.equal(runtimeProbe.status, 'passed');
assert.equal(runtimeProbe.curriculumVersion, evidence.curriculumVersion);
assert.deepEqual(runtimeProbe.lessonIds, evidence.changedLessonIds);
assert.equal(runtimeProbe.compileSuccess, true);
assert.equal(runtimeProbe.automatorVerified, true);
assert.equal(runtimeProbe.runtimePageCheck, 'passed');
assert.equal(runtimeProbe.progressProtection.existingProgressBeforeProbe, true);
assert.ok([evidence.previousCurriculumVersion, evidence.curriculumVersion]
  .includes(runtimeProbe.progressProtection.previousCurriculumVersion));
assert.equal(runtimeProbe.progressProtection.migratedCurriculumVersion, evidence.curriculumVersion);
assert.equal(runtimeProbe.progressProtection.testedCurriculumVersion, evidence.curriculumVersion);
assert.equal(runtimeProbe.progressProtection.temporaryNavigationStorageFree, true);
assert.equal(runtimeProbe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(runtimeProbe.progressProtection.completionStateChangedByProbe, false);

console.log(JSON.stringify({
  status: 'passed',
  batch: evidence.batchId,
  curriculumVersion: evidence.curriculumVersion,
  changedLessonIds: evidence.changedLessonIds,
  noBoundaryIds,
  aiReview: evidence.aiReview,
  runtimePageCheck: evidence.runtimePageCheck,
  realUserAcceptance: evidence.realUserAcceptance,
}));
