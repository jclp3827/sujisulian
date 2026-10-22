#!/usr/bin/env node
// Checks material readiness and explicit user acceptance separately; never scores real answers.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = 'docs/knowledge-platform/implementations';
const load = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const pack = load(`${base}/evidence/politics-exam-alignment-e3-tasks-20261022.json`);
const template = load(`${base}/evidence/politics-exam-e3-observation-template-20261022.json`);
const banks = require(path.join(root, 'miniprogram/models/politics-learning-banks-runtime'));
const applied = require(path.join(root, 'miniprogram/models/politics-applied-questions-runtime'));
const curriculum = require(path.join(root, 'miniprogram/models/politics-systematic-units-runtime'));
const clone = value => JSON.parse(JSON.stringify(value));
function validate(value) {
  assert.ok(['prepared-not-run', 'sample-passed'].includes(value.status));
  if (value.status === 'sample-passed') {
    assert.equal(value.acceptance?.status, 'sample-passed');
    assert.equal(value.acceptance?.basis, 'explicit-user-confirmation');
    assert.ok(value.acceptance?.statement);
    assert.equal(value.formalProtocolStatus, 'detailed-observations-and-24h-retest-not-provided');
    assert.equal(value.acceptance.delayedRetestEvidenceProvided, false);
  }
  assert.equal(value.protocolVersion, 'e3-preparation-v2');
  assert.deepEqual(value.participants, [], 'a preparation record must not pretend to include observed users');
  assert.deepEqual(value.buildVersions, { recall: banks.bankVersion, applied: applied.bankVersion, curriculum: curriculum.curriculumVersion });
  assert.equal(value.sessionRules.minimumDelayHours, 24);
  assert.equal(value.sessionRules.topicsPerParticipant, 2);
  for (const key of ['delayedUsesDistinctForm', 'retestBeforeFeedback', 'resultRemainsUnrun', 'quickOverviewAssessedSeparately', 'notAllTopicsRequiredPerPerson']) assert.equal(value.sessionRules[key], true);
  assert.equal(value.tasks.length, 8);
  const ids = new Set(value.tasks.map(t => t.id));
  assert.equal(ids.size, 8);
  const forms = new Set(), prompts = new Set();
  for (const task of value.tasks) {
    assert.ok(curriculum.lessons.some(lesson => lesson.id === task.lessonId), `unknown lesson ${task.lessonId}`);
    assert.ok(task.recallPrompt && task.scoringNote);
    assert.ok(task.delayedForm, `missing delayed form ${task.id}`);
    assert.notEqual(task.prompt, task.delayedForm.prompt, 'delayed form must not repeat the immediate material');
    for (const form of [task, task.delayedForm]) {
      assert.equal(form.result, null, 'no hypothetical performance result may be written');
      assert.ok(form.formId && !forms.has(form.formId), 'form IDs must be distinct');
      forms.add(form.formId);
      assert.ok(typeof form.prompt === 'string' && form.prompt.length > 15 && !prompts.has(form.prompt), 'material prompts must be distinct');
      prompts.add(form.prompt);
      for (const key of ['authored', 'notPastExam', 'firstExposureRequired']) assert.equal(form[key], true);
      assert.ok(Array.isArray(form.requiredMeanings) && form.requiredMeanings.length >= 2);
      assert.ok(form.requiredMeanings.every(x => typeof x === 'string' && x.trim().length > 0));
      assert.ok(!applied.questions.some(question => question.prompt === form.prompt), 'a runtime question cannot be labelled unseen diagnostic material');
    }
  }
  assert.equal(forms.size, 16);
  const slots = new Set();
  for (const assignment of value.assignmentPlan) {
    assert.ok(!slots.has(assignment.participantSlot)); slots.add(assignment.participantSlot);
    assert.equal(assignment.taskIds.length, 2);
    assert.equal(new Set(assignment.taskIds).size, 2);
    assert.ok(assignment.taskIds.every(id => ids.has(id)));
  }
  assert.equal(new Set(value.assignmentPlan.slice(0, 3).flatMap(x => x.taskIds)).size, 6);
  assert.equal(new Set(value.assignmentPlan.slice(0, 4).flatMap(x => x.taskIds)).size, 8);
  assert.equal(value.recallSupplement.status, 'prepared-not-run');
  const recallIds = value.recallSupplement.tasks.flatMap(task => {
    assert.equal(task.result, null); return task.cardIds;
  });
  assert.equal(new Set(recallIds).size, 9);
  assert.ok(recallIds.every(id => banks.recallCards.some(card => card.cardId === id)));
  for (const field of ['answeredAt', 'immediateAnsweredAt', 'delayHours', 'priorExposure', 'reviewedBetween', 'verbatimAnswer', 'hintsGiven', 'sourceOpenedBeforeAnswer', 'missingReason']) assert.ok(value.recordFields.includes(field));
  for (const category of ['independent', 'prompted', 'failed', 'not-tested', 'delayedEligibility']) assert.ok(value.resultRules[category]);
}
validate(pack);
assert.equal(template.status, 'blank-template-not-results');
assert.deepEqual(template.participants, []); assert.deepEqual(template.attempts, []);
assert.deepEqual(Object.keys(template.attemptTemplate).sort(), pack.recordFields.slice().sort());
assert.ok(Object.values(template.attemptTemplate).every(x => x === null));
assert.ok(fs.existsSync(path.join(root, base, 'politics-exam-e3-moderator-guide-20261022.md')));
const negativeCases = [
  value => { delete value.tasks[0].delayedForm; },
  value => { value.tasks[0].delayedForm.prompt = value.tasks[0].prompt; },
  value => { value.buildVersions.applied = 'stale'; },
  value => { value.participants.push({ participantId: 'invented' }); },
  value => { value.tasks[0].delayedForm.result = 'independent'; },
  value => { value.assignmentPlan[0].taskIds.push(value.tasks[2].id); },
  value => { value.tasks[0].delayedForm.requiredMeanings = []; },
  value => { value.sessionRules.minimumDelayHours = 23; },
  value => { value.status = 'sample-passed'; delete value.acceptance; },
];
for (const mutate of negativeCases) { const invalid = clone(pack); mutate(invalid); assert.throws(() => validate(invalid)); }
console.log(JSON.stringify({ status: 'prepared-artifacts-passed', immediateForms: 8, delayedForms: 8, recallSupplementCards: 9, negativeCasesRejected: negativeCases.length, participants: 0, observedResults: 0, acceptanceStatus: pack.acceptance?.status || 'pending', learningEffectVerified: false }));
