#!/usr/bin/env node
"use strict";

const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const frames = require("../docs/knowledge-platform/content/common-sense-concept-frames-q0c1");
const authoring = require("../docs/knowledge-platform/content/common-sense-concept-learning-q0c3");
const {
  validateConceptLearning,
  holdBaselineHashes,
  validateHoldBaseline,
} = require("./lib/validate-common-sense-concept-learning");

const expectHold = process.argv.includes("--expect-hold");
const report = validateConceptLearning(pack, frames, authoring, { currentDate: "2026-10-23" });
const hashes = holdBaselineHashes(pack, frames, authoring, report);
const baseline = validateHoldBaseline(report, hashes, authoring.holdBaseline);
const output = {
  batchId: "Q0-C3",
  checkedAt: "2026-10-23",
  packVersion: pack.version,
  status: report.readyForExpansion ? "passed" : report.structurallyPassed ? "hold-independent-novice-retelling" : "failed",
  report,
  hashes,
  holdBaselineMatched: baseline.matched,
  holdBaselineFailures: baseline.failures,
  formalAdmissionChanged: false,
};
console.log(JSON.stringify(output, null, 2));
if (expectHold) process.exit(report.structurallyPassed && !report.readyForExpansion && baseline.matched ? 0 : 1);
process.exit(report.readyForExpansion ? 0 : 1);
