#!/usr/bin/env node
const assert = require("assert/strict");
const { spawnSync } = require("child_process");
const path = require("path");
const {
  qualityFingerprint,
  validateMnemonicQuality,
  validateRedBaseline,
} = require("./lib/validate-common-sense-mnemonic-quality");

const clone = (value) => JSON.parse(JSON.stringify(value));
const targetIds = ["curve", "symmetry", "whole", "closure"];
const mnemonic = {
  id: "shape-memory",
  revision: 2,
  status: "review",
  title: "图形识别",
  text: "屈臣氏整风",
  purpose: "记住曲直、对称、整体和封口四个图形观察维度。",
  coverage: "图形观察维度",
  conditions: ["只用于提示观察顺序。"],
  excludes: ["具体图形规律"],
  phrases: targetIds.map((targetId) => ({ id: `shape-${targetId}`, phrase: targetId, meaning: targetId, targetIds: [targetId], coverageType: "cue" })),
};
const pack = { version: "fixture.1", mnemonics: [mnemonic], targets: targetIds.map((id) => ({ id })) };
const specification = {
  mnemonicId: "shape-memory",
  mnemonicRevision: 2,
  classification: "natural-mnemonic",
  anchorType: "natural-phrase",
  anchorText: "屈臣氏整风",
  decodeMap: [
    { anchorSpan: [0, 1], chunk: "屈", targetId: "curve", concept: "曲直", mappingType: "homophone", ambiguous: false },
    { anchorSpan: [1, 2], chunk: "臣", targetId: "symmetry", concept: "对称", mappingType: "homophone", ambiguous: false },
    { anchorSpan: [2, 4], chunk: "氏整", targetId: "whole", concept: "整体", mappingType: "homophone", ambiguous: false },
    { anchorSpan: [4, 5], chunk: "风", targetId: "closure", concept: "封口", mappingType: "homophone", ambiguous: false },
  ],
  orderRequired: false,
  hasAmbiguity: false,
};
const protocol = {
  version: "q3-exploratory-pilot-v1",
  status: "review",
  evidenceLevel: "exploratory",
  minimumSampleSize: 5,
  requiredTimepoints: [
    { id: "baseline", delayMinutes: 0, toleranceMinutes: 0 },
    { id: "10m", delayMinutes: 10, toleranceMinutes: 2 },
    { id: "24h", delayMinutes: 1440, toleranceMinutes: 120 },
  ],
  requiredMetrics: ["anchorRecall", "decode", "falseExtensionCount"],
};
const authoring = (specs = [specification], trials = [], protocolRows = [protocol], dispositions = []) => ({
  schemaVersion: 1,
  qualitySchemaVersion: "q0a-mnemonic-quality-v1",
  mnemonicQualitySpecifications: specs,
  memoryTrials: trials,
  memoryTrialProtocols: protocolRows,
  mnemonicDispositionArchive: dispositions,
});
const test = (name, fn) => { fn(); reports.push(name); };
const reports = [];
const codes = (report) => new Set(report.issues.map((issue) => issue.code));

test("a reversible natural anchor with four decoded targets passes the review-candidate schema", () => {
  const report = validateMnemonicQuality(pack, authoring());
  assert.equal(report.passed, true);
  assert.equal(report.counts.validQualitySpecifications, 1);
});

test("missing, non-array or empty mnemonic and target collections fail closed", () => {
  assert.equal(codes(validateMnemonicQuality({}, authoring([]))).has("pack-mnemonics-invalid"), true);
  assert.equal(codes(validateMnemonicQuality({}, authoring([]))).has("pack-targets-invalid"), true);
  assert.equal(codes(validateMnemonicQuality({ version: "empty", mnemonics: [], targets: [] }, authoring([]))).has("pack-mnemonics-empty"), true);
  assert.equal(codes(validateMnemonicQuality({ version: "empty", mnemonics: [], targets: [] }, authoring([]))).has("pack-targets-empty"), true);
  assert.equal(codes(validateMnemonicQuality({ version: "wrong", mnemonics: {}, targets: {} }, authoring([]))).has("pack-mnemonics-invalid"), true);
});

test("mnemonic and specification revisions must both be matching positive integers", () => {
  const missingRevisionPack = clone(pack); delete missingRevisionPack.mnemonics[0].revision;
  const missingRevisionSpec = clone(specification); delete missingRevisionSpec.mnemonicRevision;
  const result = codes(validateMnemonicQuality(missingRevisionPack, authoring([missingRevisionSpec])));
  assert.equal(result.has("mnemonic-revision-invalid"), true);
  assert.equal(result.has("quality-specification-revision-invalid"), true);
  const zeroRevision = clone(specification); zeroRevision.mnemonicRevision = 0;
  assert.equal(codes(validateMnemonicQuality(pack, authoring([zeroRevision]))).has("quality-specification-revision-invalid"), true);
  const mismatch = clone(specification); mismatch.mnemonicRevision = 3;
  assert.equal(codes(validateMnemonicQuality(pack, authoring([mismatch]))).has("quality-specification-revision-mismatch"), true);
});

test("classification, anchor type, span, chunk, mapping type, concept and order fields fail closed", () => {
  const mutations = [
    ["classification-invalid", (item) => { item.classification = "keyword-string"; }],
    ["anchor-type-invalid", (item) => { item.anchorType = "acrostic-magic"; }],
    ["anchor-span-invalid", (item) => { item.decodeMap[0].anchorSpan = [-1, 1]; }],
    ["anchor-chunk-mismatch", (item) => { item.decodeMap[0].chunk = "曲"; }],
    ["mapping-type-invalid", (item) => { item.decodeMap[0].mappingType = "guess"; }],
    ["decode-concept-missing", (item) => { item.decodeMap[0].concept = ""; }],
    ["order-required-invalid", (item) => { delete item.orderRequired; }],
  ];
  for (const [code, mutate] of mutations) {
    const bad = clone(specification); mutate(bad);
    assert.equal(codes(validateMnemonicQuality(pack, authoring([bad]))).has(code), true, code);
  }
});

test("every anchor character and declared target must be reversible", () => {
  const uncoveredAnchor = clone(specification); uncoveredAnchor.decodeMap.splice(2, 1);
  const missingTarget = clone(specification); missingTarget.decodeMap[2].targetId = "curve";
  assert.equal(codes(validateMnemonicQuality(pack, authoring([uncoveredAnchor]))).has("anchor-character-unmapped"), true);
  assert.equal(codes(validateMnemonicQuality(pack, authoring([missingTarget]))).has("decode-target-coverage-incomplete"), true);
});

test("multi-meaning chunks require both row detail and an agreeing summary flag", () => {
  const missingNote = clone(specification); missingNote.decodeMap[0].ambiguous = true; missingNote.hasAmbiguity = true;
  const missingSummary = clone(missingNote); missingSummary.decodeMap[0].ambiguityNote = "需结合图形题语境识别。"; missingSummary.hasAmbiguity = false;
  assert.equal(codes(validateMnemonicQuality(pack, authoring([missingNote]))).has("ambiguity-note-missing"), true);
  assert.equal(codes(validateMnemonicQuality(pack, authoring([missingSummary]))).has("ambiguity-summary-mismatch"), true);
});

function validTrial(currentMnemonic = mnemonic, currentSpec = specification) {
  const timepoint = (id, delayMinutes, anchorCorrect, decodeCorrect) => ({
    id, delayMinutes, testedParticipants: 5,
    anchorRecall: { correct: anchorCorrect, total: 5 },
    decode: { correct: decodeCorrect, total: 20 },
    orderRecall: { correct: anchorCorrect, total: 5 },
    falseExtensionCount: 0,
  });
  return {
    id: "shape-memory-pilot-1",
    mnemonicId: "shape-memory",
    mnemonicRevision: currentMnemonic.revision,
    protocolVersion: "q3-exploratory-pilot-v1",
    contentFingerprint: qualityFingerprint(currentMnemonic, currentSpec),
    sample: { audience: "公考备考用户", participantCount: 5, recruitment: "未参与编写的自愿参与者" },
    timepoints: [timepoint("baseline", 0, 0, 3), timepoint("10m", 10, 5, 18), timepoint("24h", 1440, 4, 15)],
    date: "2026-10-22",
  };
}

test("memoryTrial binds protocol, sample, timepoints and date", () => {
  const report = validateMnemonicQuality(pack, authoring([specification], [validTrial()]), { currentDate: "2026-10-22" });
  assert.equal(report.passed, true);
  assert.equal(report.counts.validTrialMnemonics, 1);
  const bad = validTrial(); delete bad.sample.recruitment; bad.timepoints.pop(); bad.date = "2026-02-30";
  const badCodes = codes(validateMnemonicQuality(pack, authoring([specification], [bad]), { currentDate: "2026-10-22" }));
  assert.equal(badCodes.has("memory-trial-sample-invalid"), true);
  assert.equal(badCodes.has("memory-trial-required-timepoint-missing"), true);
  assert.equal(badCodes.has("memory-trial-date-invalid"), true);
});

test("protocol metrics are closed and trial delays and dates are bound", () => {
  const nonsense = clone(protocol); nonsense.requiredMetrics.push("feelGoodScore");
  assert.equal(codes(validateMnemonicQuality(pack, authoring([specification], [], [nonsense]))).has("memory-trial-protocol-metric-invalid"), true);
  const sameDelay = validTrial(); sameDelay.timepoints[2].delayMinutes = sameDelay.timepoints[1].delayMinutes;
  assert.equal(codes(validateMnemonicQuality(pack, authoring([specification], [sameDelay]), { currentDate: "2026-10-22" })).has("memory-trial-timepoint-invalid"), true);
  const wrongDelay = validTrial(); wrongDelay.timepoints[1].delayMinutes = 30;
  assert.equal(codes(validateMnemonicQuality(pack, authoring([specification], [wrongDelay]), { currentDate: "2026-10-22" })).has("memory-trial-delay-mismatch"), true);
  const future = validTrial(); future.date = "2026-10-23";
  assert.equal(codes(validateMnemonicQuality(pack, authoring([specification], [future]), { currentDate: "2026-10-22" })).has("memory-trial-date-invalid"), true);
});

test("content, anchor, decode or revision changes invalidate old evidence", () => {
  const trial = validTrial();
  const changedContentPack = clone(pack); changedContentPack.mnemonics[0].text += "。";
  assert.equal(codes(validateMnemonicQuality(changedContentPack, authoring([specification], [trial]))).has("memory-trial-stale"), true);
  const changedAnchor = clone(specification); changedAnchor.anchorText = "屈臣氏整疯"; changedAnchor.decodeMap[3].chunk = "疯";
  assert.equal(codes(validateMnemonicQuality(pack, authoring([changedAnchor], [trial]))).has("memory-trial-stale"), true);
  const changedDecode = clone(specification); changedDecode.decodeMap[0].concept = "先看曲线还是直线";
  assert.equal(codes(validateMnemonicQuality(pack, authoring([changedDecode], [trial]))).has("memory-trial-stale"), true);
  const revisedPack = clone(pack); revisedPack.mnemonics[0].revision = 3;
  const revisedSpec = clone(specification); revisedSpec.mnemonicRevision = 3;
  assert.equal(codes(validateMnemonicQuality(revisedPack, authoring([revisedSpec], [trial]))).has("memory-trial-stale"), true);
});

const approvalProtocol = {
  version: "q3-approval-v1",
  status: "approved",
  evidenceLevel: "approval",
  minimumSampleSize: 30,
  requiredTimepoints: clone(protocol.requiredTimepoints),
  requiredMetrics: ["anchorRecall", "decode", "orderRecall", "falseExtensionCount"],
  approvalCriteria: [
    { timepointId: "10m", minimumAnchorRecallRate: 0.8, minimumDecodeRate: 0.8, minimumOrderRecallRate: 0.8, maximumFalseExtensionRate: 0.1 },
    { timepointId: "24h", minimumAnchorRecallRate: 0.6, minimumDecodeRate: 0.6, minimumOrderRecallRate: 0.6, maximumFalseExtensionRate: 0.1 },
  ],
};

function approvalTrial(currentMnemonic = mnemonic, currentSpec = specification, zero = false) {
  const row = (id, delayMinutes, anchor, decode, order, falseExtensions) => ({
    id, delayMinutes, testedParticipants: 30,
    anchorRecall: { correct: anchor, total: 30 },
    decode: { correct: decode, total: 120 },
    orderRecall: { correct: order, total: 30 },
    falseExtensionCount: falseExtensions,
  });
  return {
    id: "shape-memory-approval-1",
    mnemonicId: currentMnemonic.id,
    mnemonicRevision: currentMnemonic.revision,
    protocolVersion: approvalProtocol.version,
    contentFingerprint: qualityFingerprint(currentMnemonic, currentSpec),
    sample: { audience: "公考备考用户", participantCount: 30, recruitment: "独立招募且未参与编写" },
    timepoints: zero ? [row("baseline", 0, 0, 0, 0, 0), row("10m", 10, 0, 0, 0, 30), row("24h", 1440, 0, 0, 0, 30)] :
      [row("baseline", 0, 0, 3, 0, 0), row("10m", 10, 27, 110, 27, 1), row("24h", 1440, 20, 80, 20, 2)],
    date: "2026-10-22",
  };
}

test("approved mnemonic requires a non-exploratory protocol, sufficient sample and passing actual results", () => {
  const approvedPack = clone(pack); approvedPack.mnemonics[0].status = "approved";
  assert.equal(codes(validateMnemonicQuality(approvedPack, authoring())).has("approved-mnemonic-trial-missing"), true);
  const fivePersonProtocol = clone(protocol); fivePersonProtocol.status = "approved";
  const fivePerson = validateMnemonicQuality(approvedPack, authoring([specification], [validTrial(approvedPack.mnemonics[0], specification)], [fivePersonProtocol]), { currentDate: "2026-10-22" });
  assert.equal(codes(fivePerson).has("approved-mnemonic-trial-missing"), true);
  const undersizedProtocol = clone(approvalProtocol); undersizedProtocol.minimumSampleSize = 5;
  assert.equal(codes(validateMnemonicQuality(approvedPack, authoring([specification], [], [undersizedProtocol]))).has("memory-trial-approval-protocol-invalid"), true);
  const weakThreshold = clone(approvalProtocol); weakThreshold.approvalCriteria[0].minimumAnchorRecallRate = 0;
  assert.equal(codes(validateMnemonicQuality(approvedPack, authoring([specification], [], [weakThreshold]))).has("memory-trial-approval-criteria-invalid"), true);
  const allZero = validateMnemonicQuality(approvedPack, authoring([specification], [approvalTrial(approvedPack.mnemonics[0], specification, true)], [approvalProtocol]), { currentDate: "2026-10-22" });
  assert.equal(codes(allZero).has("memory-trial-approval-threshold-failed"), true);
  assert.equal(codes(allZero).has("approved-mnemonic-trial-missing"), true);
  const attrited = approvalTrial(approvedPack.mnemonics[0], specification);
  attrited.timepoints[2].testedParticipants = 1;
  attrited.timepoints[2].anchorRecall = { correct: 1, total: 1 };
  attrited.timepoints[2].decode = { correct: 4, total: 4 };
  attrited.timepoints[2].orderRecall = { correct: 1, total: 1 };
  assert.equal(codes(validateMnemonicQuality(approvedPack, authoring([specification], [attrited], [approvalProtocol]), { currentDate: "2026-10-22" })).has("memory-trial-timepoint-sample-too-small"), true);
  const passing = validateMnemonicQuality(approvedPack, authoring([specification], [approvalTrial(approvedPack.mnemonics[0], specification)], [approvalProtocol]), { currentDate: "2026-10-22" });
  assert.equal(passing.passed, true);
  assert.equal(passing.counts.approvalEligibleTrialMnemonics, 1);
});

test("not-suitable is a real disposition and cannot leave an active mnemonic green", () => {
  const disposition = { mnemonicId: "shape-memory", mnemonicRevision: 2, classification: "not-suitable", anchorType: "none", anchorText: "", decodeMap: [], orderRequired: false, hasAmbiguity: false, dispositionReason: "应改为图表。" };
  assert.equal(codes(validateMnemonicQuality(pack, authoring([disposition]))).has("active-mnemonic-classified-not-suitable"), true);
});

test("a removed mnemonic can retain an independently validated retired disposition archive", () => {
  const retainedPack = clone(pack); retainedPack.mnemonics[0].id = "retained-memory";
  const retainedSpec = clone(specification); retainedSpec.mnemonicId = "retained-memory";
  const archived = { mnemonicId: "shape-memory", mnemonicRevision: 2, disposition: "retired", reason: "自然编码不可逆，改用对照表。", retiredAt: "2026-10-22" };
  const report = validateMnemonicQuality(retainedPack, authoring([retainedSpec], [], [protocol], [archived]), { currentDate: "2026-10-22" });
  assert.equal(report.passed, true);
  assert.equal(report.counts.retiredMnemonicDispositions, 1);
  assert.equal(codes(validateMnemonicQuality(pack, authoring([specification], [], [protocol], [archived]), { currentDate: "2026-10-22" })).has("retired-disposition-still-active"), true);
  const bad = clone(archived); bad.mnemonicRevision = 0; bad.reason = "";
  const badCodes = codes(validateMnemonicQuality(retainedPack, authoring([retainedSpec], [], [protocol], [bad]), { currentDate: "2026-10-22" }));
  assert.equal(badCodes.has("mnemonic-disposition-revision-invalid"), true);
  assert.equal(badCodes.has("mnemonic-disposition-reason-invalid"), true);
});

test("registered Q0-A red baseline rejects intentional Q0-B content drift and strict CLI stays closed", () => {
  const realPack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
  const realAuthoring = require("../docs/knowledge-platform/content/common-sense-mnemonic-quality-q0a");
  const report = validateMnemonicQuality(realPack, realAuthoring);
  const baseline = validateRedBaseline(report, realAuthoring.redBaseline);
  assert.equal(report.passed, false);
  assert.equal(baseline.matched, false);
  assert.equal(baseline.failures.includes("packVersion 已变化"), true);
  assert.equal(baseline.failures.includes("口诀或目标内容摘要已变化"), true);
  const changedPack = { ...realPack, mnemonics: realPack.mnemonics.map((item, index) => index ? item : { ...item, text: `${item.text}（改）` }) };
  const changedContentBaseline = validateRedBaseline(validateMnemonicQuality(changedPack, realAuthoring), realAuthoring.redBaseline);
  assert.equal(changedContentBaseline.matched, false);
  assert.equal(changedContentBaseline.failures.includes("口诀或目标内容摘要已变化"), true);
  const changedAuthoring = { ...realAuthoring, memoryTrialProtocols: realAuthoring.memoryTrialProtocols.map((item, index) => index ? item : { ...item, note: `${item.note}（改）` }) };
  const changedProtocolBaseline = validateRedBaseline(validateMnemonicQuality(realPack, changedAuthoring), realAuthoring.redBaseline);
  assert.equal(changedProtocolBaseline.matched, false);
  assert.equal(changedProtocolBaseline.failures.includes("质量 authoring 摘要已变化"), true);
  const cli = path.join(__dirname, "validate-common-sense-mnemonic-quality-q0a.js");
  assert.notEqual(spawnSync(process.execPath, [cli, "--expect-red"], { encoding: "utf8" }).status, 0);
  assert.notEqual(spawnSync(process.execPath, [cli], { encoding: "utf8" }).status, 0);
});

console.log(JSON.stringify({ passed: true, checks: reports.length, reports }, null, 2));
