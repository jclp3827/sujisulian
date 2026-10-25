"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const frames = require("../docs/knowledge-platform/content/common-sense-concept-frames-q0c1");
const authoring = require("../docs/knowledge-platform/content/common-sense-concept-learning-q0c3");
const {
  learningFingerprint,
  validateConceptLearning,
  holdBaselineHashes,
  validateHoldBaseline,
} = require("./lib/validate-common-sense-concept-learning");

const clone = (value) => JSON.parse(JSON.stringify(value));
const codes = (report) => new Set(report.issues.map((item) => item.code));
const currentDate = "2026-10-23";

function validTrial(specification, index) {
  const frame = frames.conceptFrames.find((item) => item.id === specification.conceptFrameId);
  const binding = frames.mnemonicConceptBindings.find((item) => item.mnemonicId === specification.mnemonicId);
  const mnemonic = pack.mnemonics.find((item) => item.id === specification.mnemonicId);
  const phraseIds = mnemonic.phrases.map((item) => item.id);
  return {
    id: `q0c3-trial-${index}`,
    protocolVersion: specification.protocolVersion,
    conceptFrameId: specification.conceptFrameId,
    conceptFrameRevision: specification.conceptFrameRevision,
    mnemonicId: specification.mnemonicId,
    mnemonicRevision: specification.mnemonicRevision,
    contentFingerprint: learningFingerprint(frame, binding, mnemonic, specification),
    date: currentDate,
    independentFromAuthoring: true,
    sample: {
      audience: "未系统学习当前主题的公考备考用户",
      participantCount: 5,
      recruitedByAuthoringTeam: false,
    },
    observations: Array.from({ length: 5 }, (_, participant) => ({
      participantId: `p-${index}-${participant + 1}`,
      retoldNodeIds: specification.noviceRetelling.expectedNodeIds,
      retoldEdgeIds: specification.noviceRetelling.expectedEdgeIds,
      decodedPhraseIds: phraseIds,
      falseClaims: [],
    })),
  };
}

test("pilot specifications pass all static concept-learning gates and stop only for independent novice evidence", () => {
  const report = validateConceptLearning(pack, frames, authoring, { currentDate });
  assert.equal(report.structurallyPassed, true);
  assert.equal(report.readyForExpansion, false);
  assert.deepEqual(report.errorsByCode, {});
  assert.deepEqual(report.holdsByCode, { "missing-independent-novice-retelling": 3 });
  assert.equal(report.counts.structurallyValidSpecifications, 3);
});

test("frozen hold baseline binds content, authoring and exact owners", () => {
  const report = validateConceptLearning(pack, frames, authoring, { currentDate });
  const hashes = holdBaselineHashes(pack, frames, authoring, report);
  assert.deepEqual(validateHoldBaseline(report, hashes, authoring.holdBaseline), { matched: true, failures: [] });
});

test("every phrase must decode to known nodes, targets and the complete relation graph", () => {
  const changed = clone(authoring);
  changed.conceptLearningSpecifications[0].decodeMap[3].edgeIds = changed.conceptLearningSpecifications[0].decodeMap[3].edgeIds.filter((id) => !id.includes("interdependence"));
  const report = validateConceptLearning(pack, frames, changed, { currentDate });
  assert.equal(codes(report).has("concept-learning-relation-unmapped"), true);
  const missingPhrase = clone(authoring);
  missingPhrase.conceptLearningSpecifications[1].decodeMap.pop();
  assert.equal(codes(validateConceptLearning(pack, frames, missingPhrase, { currentDate })).has("concept-learning-decode-count-invalid"), true);
});

test("key terminology must be explained by a concept node before the mnemonic", () => {
  const changed = clone(authoring);
  changed.conceptLearningSpecifications[2].introducedTerms[0].term = "未解释的陌生术语";
  assert.equal(codes(validateConceptLearning(pack, frames, changed, { currentDate })).has("concept-learning-term-unexplained"), true);
});

test("self-tests must cover identity, relation and application without exceeding declared concept targets", () => {
  const changed = clone(authoring);
  changed.conceptLearningSpecifications[0].selfTests = changed.conceptLearningSpecifications[0].selfTests.filter((item) => item.stage !== "application");
  const report = validateConceptLearning(pack, frames, changed, { currentDate });
  assert.equal(codes(report).has("concept-learning-stage-missing"), true);
  assert.equal(codes(report).has("concept-learning-self-test-coverage-gap"), true);
});

test("novice retelling prompt cannot leak the mnemonic or multiple-choice cues", () => {
  const changed = clone(authoring);
  changed.conceptLearningSpecifications[1].noviceRetelling.prompt = "请根据口诀和选项复述。";
  assert.equal(codes(validateConceptLearning(pack, frames, changed, { currentDate })).has("concept-learning-retelling-prompt-invalid"), true);
});

test("current independent trials that meet the frozen protocol open the expansion gate", () => {
  const changed = clone(authoring);
  changed.conceptComprehensionTrials = changed.conceptLearningSpecifications.map(validTrial);
  const report = validateConceptLearning(pack, frames, changed, { currentDate });
  assert.equal(report.passed, true);
  assert.equal(report.readyForExpansion, true);
  assert.equal(report.counts.validTrials, 3);
});

test("same-author or stale trials cannot replace independent current evidence", () => {
  const changed = clone(authoring);
  changed.conceptComprehensionTrials = changed.conceptLearningSpecifications.map(validTrial);
  changed.conceptComprehensionTrials[0].independentFromAuthoring = false;
  changed.conceptComprehensionTrials[1].contentFingerprint = "stale";
  const report = validateConceptLearning(pack, frames, changed, { currentDate });
  assert.equal(codes(report).has("concept-learning-trial-independence-invalid"), true);
  assert.equal(codes(report).has("concept-learning-trial-stale"), true);
  assert.equal(report.readyForExpansion, false);
});
