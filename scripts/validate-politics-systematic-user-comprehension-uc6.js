const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc6-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const runtimeProbe = JSON.parse(fs.readFileSync(path.join(root, evidence.runtimeProbePath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);

assert.equal(latest.curriculumVersion, evidence.curriculumVersion);
assert.equal(runtime.curriculumVersion, evidence.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.equal(digest(evidence.sourcePath), evidence.sourceSha256);
assert.equal(digest(evidence.runtimePath), evidence.runtimeSha256);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
assert.equal(runtimeProbe.postUc6.curriculumVersion, evidence.curriculumVersion);
assert.equal(runtimeProbe.postUc6.staticCandidateBuildPassed, true);
assert.equal(runtimeProbe.postUc6.runtimeProtocolValidationPassed, true);
assert.equal(runtimeProbe.postUc6.result, 'passed');
assert.equal(runtimeProbe.postUc6.actualPagePath, 'subpackages/politics/route/units');
assert.equal(runtimeProbe.postUc6.groupCount, 21);
assert.equal(runtimeProbe.postUc6.lessonCount, 72);
assert.equal(runtimeProbe.postUc6.existingProgressVisible, true);
assert.equal(runtimeProbe.runtimePageCheck, 'passed');
assert.equal(runtimeProbe.runtimePageAcceptance, 'pending');
assert.equal(source.lessons.length, 72);
assert.equal(source.groups.length, 21);
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

const exposed = [
  ...source.routes.flatMap(route => [route.scope, route.summary, route.conclusion?.title, route.conclusion?.summary, route.conclusion?.boundary]),
  ...source.groups.flatMap(group => [group.title, group.scope, group.following, group.connectionToNext]),
  ...source.lessons.flatMap(lesson => [lesson.title, lesson.question, lesson.scopeLimit,
    ...lesson.sections.flatMap(section => [section.label, section.text]),
    lesson.boundary.label, lesson.boundary.text, lesson.recap.label, lesson.recap.text,
    lesson.reflection.prompt, lesson.reflection.answer]),
].filter(Boolean);
const editorialLeak = /全部原文|保留查阅|可进一步查阅|可查阅|按现有来源|现有来源将|本主题按来源|当前知识范围|当前材料|本路线|待补源|前置不足|不假装|这里/;
assert.deepEqual(exposed.filter(value => editorialLeak.test(value)), []);
assert.match(source.lessons.find(item => item.id === 'CAPITAL-02').scopeLimit, /还需先掌握劳动力价值/);
assert.match(source.routes.find(item => item.id === 'principles').conclusion.boundary, /还需先掌握劳动力价值/);

console.log(JSON.stringify({ status: 'passed', batch: evidence.batchId, lessons: 72, groups: 21,
  changedRoutes: evidence.changedRouteIds.length, changedGroups: evidence.changedGroupIds.length,
  changedLessons: evidence.changedLessonIds.length, editorialSurfaceLeaks: 0,
  retainedHolds: evidence.retainedHoldLessonIds, curriculumVersion: runtime.curriculumVersion,
  runtimePageCheck: runtimeProbe.runtimePageCheck,
  runtimePageAcceptance: evidence.runtimePageAcceptance, realUserAcceptance: 'pending' }));
