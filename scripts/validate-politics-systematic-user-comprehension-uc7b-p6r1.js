#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p6r1';
const contentLessonIds = ['VALUE-01', 'FOUND-03', 'TEN-01', 'TEN-02', 'TEN-03', 'TEN-04'];
const probeLessonIds = ['VALUE-01', 'FOUND-03', 'TEN-01', 'TEN-02', 'TEN-03', 'TEN-04'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const source = read(evidence.sourcePath);
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const retrospective = read(evidence.retrospectiveAuditPath);
const acceptance = read(evidence.userAcceptancePath);
const { latest } = validateUserComprehensionLineage(root, batch);
const lessons = Object.fromEntries(probeLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
const runtimeLessons = Object.fromEntries(probeLessonIds.map(id => [id, runtime.lessons.find(item => item.id === id)]));

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified-retrospective-open');
assert.equal(evidence.previousCurriculumVersion, 'units-afd3d8a540e1');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, contentLessonIds);
assert.deepEqual(evidence.uiProjectionAffectedLessonIds, probeLessonIds);
assert.deepEqual(evidence.contractRules, [17, 23, 28, 29, 32, 34, 35, 38, 39, 40, 41, 42]);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(acceptance.status, 'passed');
assert.equal(acceptance.curriculumVersion, evidence.curriculumVersion);
assert.deepEqual(acceptance.lessonIds, probeLessonIds);
assert.equal(digest(evidence.userAcceptancePath), evidence.userAcceptanceSha256);
assert.equal(evidence.releaseAuthorized, false);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe', 'retrospectiveAudit']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

const value = lessons['VALUE-01'];
assert.equal(value.boundary, undefined);
assert.match(value.sections[3].text, /使用价值是价值的物质承担者/);
assert.match(value.sections[3].text, /使用价值和价值不可兼得/);
assert.deepEqual(value.sections[3].sourceBlockIds, [
  'block:politics-toc-v2-u033:b012', 'block:politics-toc-v2-u033:b013',
]);
assert.deepEqual(value.sections[3].emphasis.map(item => item.quote), [
  '使用价值是价值的物质承担者', '使用价值和价值不可兼得',
]);

const found = lessons['FOUND-03'];
assert.equal(found.question, '“两个结合”分别是什么？');
assert.equal(found.reflection.prompt, found.question);
assert.deepEqual(found.sections.slice(1, 3).map(item => item.label), [
  '马克思主义基本原理同中国具体实际相结合（第一个结合）',
  '马克思主义基本原理同中华优秀传统文化相结合（第二个结合）',
]);
assert.equal(found.boundary, undefined);

assert.deepEqual(probeLessonIds.filter(id => id.startsWith('TEN-')).map(projection.displayTitleForLessonId), [
  '党的领导、总任务、社会主要矛盾与人民立场·十个明确第1—3条',
  '事业布局与改革、法治总目标·十个明确第4—6条',
  '经济发展要求·十个明确第7条',
  '强军目标、中国特色大国外交与全面从严治党·十个明确第8—10条',
]);

const ten01 = lessons['TEN-01'];
assert.deepEqual(ten01.sections.map(item => item.label), [
  '党的领导（第一条）', '总任务（第二条）', '社会主要矛盾与人民立场（第三条）',
]);
assert.equal(ten01.boundary, undefined);
assert.doesNotMatch(JSON.stringify(ten01), /先读前三条|接下来的小节|理解时要保留/);
assert.match(ten01.recap.text, /最本质的特征/);
assert.match(ten01.recap.text, /以中国式现代化推进中华民族伟大复兴/);
assert.match(ten01.recap.text, /人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾/);
assert.match(ten01.reflection.answer, /发展全过程人民民主/);

const ten02 = lessons['TEN-02'];
assert.equal(ten02.question, '“五位一体”“四个全面”、全面深化改革总目标和全面依法治国总目标分别是什么？');
assert.equal(ten02.reflection.prompt, ten02.question);
assert.equal(ten02.boundary, undefined);
assert.deepEqual(ten02.sections.map(item => item.label), [
  '“五位一体”与“四个全面”（第四条）',
  '全面深化改革总目标（第五条）',
  '全面依法治国总目标（第六条）',
]);
assert.notEqual(ten02.recap.text, ten02.reflection.answer);
assert.match(ten02.recap.text, /经济建设、政治建设、文化建设、社会建设、生态文明建设/);

const ten03 = lessons['TEN-03'];
assert.equal(ten03.boundary, undefined);
assert.match(ten03.sections[2].text, /不是各地都搞自我小循环/);
assert.match(ten03.recap.text, /新发展阶段说明历史方位/);
assert.doesNotMatch(ten03.recap.text, /理解时|复习时/);

const ten04 = lessons['TEN-04'];
assert.deepEqual(ten04.sections.map(item => item.label), [
  '强军目标（第八条）', '中国特色大国外交（第九条）', '全面从严治党（第十条）',
]);
assert.deepEqual(ten04.sections.map(item => item.emphasis.map(emphasis => emphasis.quote)), [
  ['听党指挥、能打胜仗、作风优良', '把人民军队建设成为世界一流军队'],
  ['服务民族复兴、促进人类进步', '推动建设新型国际关系', '推动构建人类命运共同体'],
  ['全面从严治党的战略方针', '新时代党的建设总要求', '政治、思想、组织、作风、纪律建设'],
]);

for (const id of probeLessonIds) {
  assert.ok(lessons[id] && runtimeLessons[id], id + ' missing');
  assert.equal(lessons[id].reflection.prompt, lessons[id].question, id + ' reflection drift');
  assert.equal(lessons[id].recap.label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLessons[id].parts.at(-1).kind, 'recap', id + ' recap position drift');
  assert.equal(runtimeLessons[id].parts.at(-1).emphasized, true, id + ' recap emphasis drift');
}
for (const id of ['VALUE-01', 'FOUND-03', 'TEN-01', 'TEN-02', 'TEN-03', 'TEN-04']) {
  assert.equal(runtimeLessons[id].parts.some(part => part.kind === 'boundary'), false, id + ' boundary remains');
}

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.equal(ai.projectionSha256, evidence.projectionSha256);
assert.deepEqual(ai.lessonIds, probeLessonIds);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  assert.equal(ai.roles[roleId].status, 'pass');
  assert.equal(ai.roles[roleId].riskCount, 0);
  assert.equal(ai.roles[roleId].holdCount, 0);
  assert.deepEqual(Object.keys(ai.roles[roleId].lessonAssertions), probeLessonIds);
  assert.ok(ai.roles[roleId].priorRisks?.length, roleId + ' prior risks missing');
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, probeLessonIds);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
for (const id of probeLessonIds) {
  const screen = probe.screens.find(item => item.lessonId === id);
  assert.ok(screen, id + ' runtime screen missing');
  assert.equal(screen.title, projection.displayTitleForLessonId(id));
  assert.equal(screen.question, lessons[id].question);
  assert.deepEqual(screen.partLabels, runtimeLessons[id].parts.map(part => part.label));
  assert.equal(screen.dom.redundantBoundaryAbsent, true);
  assert.equal(screen.dom.secondaryBoundaryRendered, false);
  assert.equal(screen.dom.recapEmphasisRendered, true);
}
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);

assert.equal(retrospective.status, 'risk-open');
assert.equal(retrospective.curriculumVersion, runtime.curriculumVersion);
assert.equal(retrospective.scope.historicallyChangedLessonCount, 39);
assert.equal(retrospective.scope.currentBoundaryLessonCount, 42);
assert.equal(retrospective.scope.totalGroupCount, 21);
assert.equal(retrospective.scope.totalLessonCount, 72);
assert.deepEqual(retrospective.metaReview.retainedHoldLessonIds, ['CAPITAL-02']);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonIds: contentLessonIds,
  uiProjectionAffectedLessonIds: probeLessonIds,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  retrospectiveAudit: 'risk-open',
  realUserAcceptance: 'passed',
}));
