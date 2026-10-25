#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root,
  'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1r1-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const units = require('../miniprogram/services/knowledge-platform/systematic-units');
const aiReview = JSON.parse(fs.readFileSync(path.join(root, evidence.aiReviewPath), 'utf8'));
const runtimeProbe = JSON.parse(fs.readFileSync(path.join(root, evidence.runtimeProbePath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const lesson = id => source.lessons.find(item => item.id === id);
const runtimeLesson = id => runtime.lessons.find(item => item.id === id);
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);

assert.equal(latest.batchId, evidence.batchId);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified');
assert.equal(evidence.previousCurriculumVersion, 'units-e3431898f349');
assert.equal(evidence.curriculumVersion, 'units-a73e58ffcf88');
assert.equal(runtime.curriculumVersion, evidence.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, ['SYS-04']);
assert.equal(evidence.uiProjectionAffectedLessonIds.length, 72);
assert.equal(new Set(evidence.uiProjectionAffectedLessonIds).size, 72);
assert.deepEqual(evidence.contractRules, [29, 30]);
assert.equal(evidence.releaseAuthorized, false);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.aiReview, 'passed');
assert.equal(evidence.runtimePageCheck, 'passed');

for (const field of [
  ['sourcePath', 'sourceSha256'], ['inventoryPath', 'inventorySha256'], ['runtimePath', 'runtimeSha256'],
  ['projectionPath', 'projectionSha256'], ['wxmlPath', 'wxmlSha256'], ['wxssPath', 'wxssSha256'],
  ['governancePath', 'governanceSha256'], ['aiReviewPath', 'aiReviewSha256'],
  ['runtimeProbePath', 'runtimeProbeSha256'],
]) assert.equal(digest(evidence[field[0]]), evidence[field[1]], `${field[0]} hash drift`);

assert.ok(runtime.progressCompatibleVersions.includes(evidence.previousCurriculumVersion));
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

const sys04 = lesson('SYS-04');
const projectedSys04 = runtimeLesson('SYS-04');
assert.equal(sys04.boundary, undefined);
assert.equal(projectedSys04.parts.some(part => part.kind === 'boundary'), false);
assert.equal(projectedSys04.parts.find(part => part.kind === 'recap').emphasized, true);
assert.equal(sys04.recap.text,
  '人民至上、自信自立和守正创新分别体现根本价值立场、内在精神特质和鲜明理论品格。');
assert.equal(sys04.reflection.prompt, '人民至上、自信自立、守正创新分别强调什么？');

const wxml = fs.readFileSync(path.join(root, evidence.wxmlPath), 'utf8');
const wxss = fs.readFileSync(path.join(root, evidence.wxssPath), 'utf8');
assert.equal((wxml.match(/读完能理解：/g) || []).length, 1);
assert.doesNotMatch(wxml, /这次要回答/);
assert.doesNotMatch(wxml, /\{\{view\.question\}\}/);
assert.match(wxml, /unit-outcome-line/);
assert.match(wxml, /\{\{view\.outcomeSummary\}\}/);
assert.match(wxml, /unit-test-question[^<]*\{\{view\.reflection\.prompt\}\}/);
assert.match(wxss, /\.unit-outcome-line/);
assert.match(wxss, /\.unit-part-recap\.unit-part-emphasized[^}]*border-left/);

const actionPrefix = /^(?:完整说出|理解|认识|分清|区分|说清|建立|保留)/;
const outcomes = runtime.lessons.map(item => ({
  id: item.id,
  text: item.objectives.map(units.formatOutcomeObjective).join('；'),
}));
assert.equal(outcomes.length, 72);
assert.ok(outcomes.every(item => item.text.length > 0));
assert.deepEqual(outcomes.filter(item => actionPrefix.test(item.text)), []);
const outcome = id => outcomes.find(item => item.id === id).text;
assert.equal(outcome('SYS-03'), '“十四个坚持”第8至14项的内容');
assert.equal(outcome('SYS-04'), '人民至上、自信自立、守正创新的含义');
assert.equal(outcome('DEV-07'),
  '区域协调发展、区域重大战略与主体功能区战略的区别；乡村、区域与制度内容在高质量发展主题中的位置');
assert.equal(outcome('SUPPORT-02'), '研究环节与创新主体的区别，以及人才评价要求');
assert.equal(outcome('COGNITION-03'), '真理绝对性与相对性的关系');
assert.equal(outcome('DIALECTICS-06'), '辩证否定与否定之否定各自说明的问题');
assert.ok(runtime.lessons.every(item => item.reflection?.prompt));

assert.equal(aiReview.curriculumVersion, evidence.curriculumVersion);
assert.equal(aiReview.sourceSha256, evidence.sourceSha256);
assert.equal(aiReview.projectionSha256, evidence.projectionSha256);
assert.ok(Object.values(aiReview.roles).every(role => role.status === 'pass'));
assert.ok(Object.values(aiReview.roles).every(role => role.riskCount === 0 && role.holdCount === 0));

assert.equal(runtimeProbe.status, 'passed');
assert.equal(runtimeProbe.curriculumVersion, evidence.curriculumVersion);
assert.deepEqual(runtimeProbe.lessonIds, evidence.probeLessonIds);
assert.equal(runtimeProbe.compileSuccess, true);
assert.equal(runtimeProbe.automatorVerified, true);
assert.equal(runtimeProbe.headerDomCheck, 'passed');
assert.ok(runtimeProbe.screens.every(screen => Object.values(screen.dom).every(Boolean)));
assert.equal(runtimeProbe.screens.find(screen => screen.lessonId === 'SYS-03').outcomeSummary,
  '“十四个坚持”第8至14项的内容');
assert.equal(runtimeProbe.screens.find(screen => screen.lessonId === 'SYS-04').partKinds.includes('boundary'), false);
assert.equal(runtimeProbe.screens.find(screen => screen.lessonId === 'SYS-04').partEmphasis.at(-1), true);
assert.equal(runtimeProbe.progressProtection.existingProgressBeforeProbe, true);
assert.equal(runtimeProbe.progressProtection.testedCurriculumVersion, evidence.curriculumVersion);
assert.equal(runtimeProbe.progressProtection.temporaryNavigationStorageFree, true);
assert.equal(runtimeProbe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(runtimeProbe.progressProtection.completionStateChangedByProbe, false);

console.log(JSON.stringify({
  status: 'passed',
  batch: evidence.batchId,
  curriculumVersion: evidence.curriculumVersion,
  uiProjectionAffectedLessons: outcomes.length,
  contentChangedLessonIds: evidence.contentChangedLessonIds,
  aiReview: evidence.aiReview,
  runtimePageCheck: evidence.runtimePageCheck,
  realUserAcceptance: evidence.realUserAcceptance,
}));
