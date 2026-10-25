#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p8';
const lessonIds = ['DEMOCRACY-03', 'CULTUREECO-04', 'PARTY-03', 'UNITYFOREIGN-03', 'MONEY-02'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const predecessor = read('docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p7-20261024.json');
const acceptance = read(predecessor.userAcceptancePath);
const userAcceptance = read(evidence.userAcceptancePath);
const source = read(evidence.sourcePath);
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const retrospective = read(evidence.retrospectiveAuditPath);
const { latest } = validateUserComprehensionLineage(root, batch);
const lessons = Object.fromEntries(lessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
const runtimeLessons = Object.fromEntries(lessonIds.map(id => [id, runtime.lessons.find(item => item.id === id)]));

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified-retrospective-open');
assert.equal(evidence.previousCurriculumVersion, 'units-f7bce4b31d42');
assert.equal(evidence.curriculumVersion, 'units-9cbea1ee7d98');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(userAcceptance.status, 'passed');
assert.equal(userAcceptance.curriculumVersion, evidence.curriculumVersion);
assert.deepEqual(userAcceptance.lessonIds, lessonIds);
assert.equal(digest(evidence.userAcceptancePath), evidence.userAcceptanceSha256);
assert.equal(evidence.releaseAuthorized, false);
assert.equal(predecessor.realUserAcceptance, 'passed');
assert.equal(acceptance.status, 'passed');
assert.equal(digest(predecessor.userAcceptancePath), predecessor.userAcceptanceSha256);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe', 'retrospectiveAudit']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

for (const id of lessonIds) {
  assert.ok(lessons[id] && runtimeLessons[id], id + ' missing');
  assert.equal(lessons[id].boundary, undefined, id + ' boundary remains');
  assert.equal(lessons[id].reflection.prompt, lessons[id].question, id + ' question drift');
  assert.equal(lessons[id].recap.label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLessons[id].parts.at(-1).kind, 'recap', id + ' recap position drift');
  assert.equal(runtimeLessons[id].parts.at(-1).emphasized, true, id + ' recap emphasis drift');
}

const democracy = lessons['DEMOCRACY-03'];
assert.equal(democracy.question, '统一战线如何处理一致性与多样性的关系？');
assert.deepEqual(democracy.sections.map(item => item.label), ['统一战线的本质要求', '一致性与多样性的关系']);
assert.match(democracy.sections[1].text, /求同不是抹平合理差异/);
assert.match(democracy.sections[1].text, /多样性也不是放弃共同方向/);

const ecology = lessons['CULTUREECO-04'];
assert.deepEqual(ecology.sections.map(item => item.label), ['碳达峰碳中和目标', '三条控制线', '自然保护地体系']);
assert.match(ecology.reflection.answer, /力争2030年前/);
assert.match(ecology.reflection.answer, /努力争取2060年前/);
assert.match(ecology.reflection.answer, /以国家公园为主体、自然保护区为基础、各类自然公园为补充/);

const party = lessons['PARTY-03'];
assert.deepEqual(party.sections.map(item => item.label), ['不敢腐强化震慑', '不能腐强化制度约束', '不想腐发挥思想教育优势', '一体推进服务党的自我革命']);
assert.doesNotMatch(JSON.stringify(party), /监督机制|思想自觉|全面从严治党不能缩减/);
assert.match(party.sections[3].text, /三不腐共同服务于党的自我革命/);

const foreign = lessons['UNITYFOREIGN-03'];
assert.equal(foreign.question, '人类命运共同体的目标和实现框架分别是什么？');
assert.deepEqual(foreign.sections.map(item => item.label), ['人类命运共同体的目标', '人类命运共同体的实现框架']);
assert.deepEqual(foreign.sections.flatMap(item => item.sourceBlockIds), ['block:politics-toc-v2-u019:b009', 'block:politics-toc-v2-u019:b009']);
for (const quote of ['共商共建共享全球治理为路径', '全人类共同价值为遵循', '新型国际关系为支撑', '全球发展倡议、全球安全倡议、全球文明倡议为战略引领', '高质量共建“一带一路”为实践平台']) {
  assert.ok(foreign.sections[1].emphasis.some(item => item.quote === quote), 'foreign emphasis missing: ' + quote);
}

const money = lessons['MONEY-02'];
assert.deepEqual(money.sections.map(item => item.label), ['贮藏手段', '支付手段', '世界货币']);
assert.match(money.sections[0].text, /在金属货币理论口径下/);
assert.doesNotMatch(JSON.stringify(money), /现代信用货币|本节材料口径|u036:b014/);

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.equal(ai.projectionSha256, evidence.projectionSha256);
assert.deepEqual(ai.lessonIds, lessonIds);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  assert.equal(ai.roles[roleId].status, 'pass');
  assert.equal(ai.roles[roleId].riskCount, 0);
  assert.equal(ai.roles[roleId].holdCount, 0);
  assert.deepEqual(Object.keys(ai.roles[roleId].lessonAssertions), lessonIds);
  assert.ok(ai.roles[roleId].priorRisks.length > 0, roleId + ' prior risks missing');
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, lessonIds);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);
for (const id of lessonIds) {
  const screen = probe.screens.find(item => item.lessonId === id);
  assert.ok(screen, id + ' runtime screen missing');
  assert.equal(screen.title, projection.displayTitleForLessonId(id));
  assert.equal(screen.question, lessons[id].question);
  assert.deepEqual(screen.partLabels, runtimeLessons[id].parts.map(part => part.label));
  assert.equal(screen.dom.redundantBoundaryAbsent, true);
  assert.equal(screen.dom.secondaryBoundaryRendered, false);
  assert.equal(screen.dom.recapEmphasisRendered, true);
}

assert.equal(retrospective.status, 'risk-open');
assert.equal(retrospective.curriculumVersion, runtime.curriculumVersion);
assert.equal(retrospective.scope.historicallyChangedLessonCount, 41);
assert.equal(retrospective.scope.currentBoundaryLessonCount, 32);
assert.equal(retrospective.scope.totalGroupCount, 21);
assert.equal(retrospective.scope.totalLessonCount, 72);
assert.equal(retrospective.scope.sectionEmphasisGapCount, 18);
assert.deepEqual(retrospective.prioritizedReviewQueues.themeEndingConclusionPriority, ['CAPITAL-02']);
assert.deepEqual(retrospective.metaReview.retainedHoldLessonIds, ['CAPITAL-02']);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonIds: lessonIds,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  retrospectiveAudit: 'risk-open',
  realUserAcceptance: 'passed',
}));
