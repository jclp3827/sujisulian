// Historical audit reproducer: observes the pre-EV0 target-dependency gap; it is not an acceptance test.
const fs = require('fs');
const assert = require('assert/strict');
const path = require('path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '../../../..'));
const { compile, loadBody, approvalDigest } = require(root + '/scripts/lib/notes-learning-compiler');
const { availableContent, fingerprint, inScope } = require(root + '/miniprogram/subpackages/note/services/learning-content');
const { createEngine, STORAGE_KEY } = require(root + '/miniprogram/subpackages/note/services/practice-session');
const source = JSON.parse(fs.readFileSync(root + '/docs/knowledge-platform/content/notes/learning-v1.json', 'utf8'));
const body = loadBody(root), clone = x => JSON.parse(JSON.stringify(x));
const questionId = 'notes-q-nq4-logic-basic-conjunction';
const initialPack = compile(source, body);
const initialContent = availableContent(body, initialPack, true);
initialContent.entryPlans.basic.resourceIds = [questionId];
const data = {};
const storage = { getStorageSync: key => clone(data[key] || null), setStorageSync: (key, val) => data[key] = clone(val) };
const session = createEngine(initialContent, storage, () => 1, () => 'probe-1').start({ kind: 'basic', fresh: true }).session;
assert(session);
const changed = clone(source);
const question = changed.questions.find(q => q.id === questionId);
const target = changed.targets.find(t => t.id === question.primaryTargetIds[0]);
const targetBefore = clone(target);
target.revision += 1;
target.conditions.push('工程审计夹具新增条件：须重新核对目标与实际考察的一致性。');
const changedPack = compile(changed, body);
const changedContent = availableContent(body, changedPack, true);
changedContent.entryPlans.basic.resourceIds = [questionId];
const r0 = initialContent.resources.find(q => q.id === questionId);
const r1 = changedContent.resources.find(q => q.id === questionId);
const resumed = createEngine(changedContent, storage, () => 2, () => 'probe-2').getSession(session.id);
assert.notEqual(fingerprint(targetBefore), fingerprint(target));
assert.equal(fingerprint(r0), fingerprint(r1));
assert(resumed);
const hypotheticalShared = clone(r0);
hypotheticalShared.subjectId = 'graphic';
hypotheticalShared.categoryId = 'overview';
const result = {
  sourceFileWritten: false,
  runtimePackWritten: false,
  persistentUserStorageWritten: false,
  targetRevisionChanged: [targetBefore.revision, target.revision],
  targetFingerprintChanged: fingerprint(targetBefore) !== fingerprint(target),
  packVersionChanged: initialPack.version !== changedPack.version,
  questionApprovalDigestChanged: approvalDigest(source.questions.find(q => q.id === questionId)) !== approvalDigest(question),
  availableResourceSignatureChanged: fingerprint(r0) !== fingerprint(r1),
  existingSessionResumedAfterTargetConditionsChanged: !!resumed,
  storedSessionHasResolvedTargetSnapshot: Object.hasOwn(session.items[0], 'targets') || Object.hasOwn(session.items[0], 'examTarget'),
  sharedOwnerSourceFilter: {
    mainGraphicModuleAllPoints: inScope(hypotheticalShared, {subjectId:'graphic', categoryId:'all', pointId:''}),
    originalLogicNote: inScope(hypotheticalShared, {subjectId:'logic', categoryId:'all', pointId:hypotheticalShared.refs[0].pointId}),
    graphicModuleWithOriginalPoint: inScope(hypotheticalShared, {subjectId:'graphic', categoryId:'all', pointId:hypotheticalShared.refs[0].pointId})
  },
  sourceQuestionId: questionId,
  sourceTargetId: targetBefore.id
};
console.log(JSON.stringify(result, null, 2));
