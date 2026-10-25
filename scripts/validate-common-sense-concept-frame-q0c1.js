#!/usr/bin/env node
"use strict";

const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const authoring = require("../docs/knowledge-platform/content/common-sense-concept-frames-q0c1");
const { validateConceptFrames, validateRedBaseline } = require("./lib/validate-common-sense-concept-frames");

const report = validateConceptFrames(pack, authoring);
if (process.argv.includes("--expect-partial")) {
  const baseline = validateRedBaseline(report, authoring.redBaseline);
  if (!baseline.matched || report.passed || report.counts.validConceptFrames !== 3 || report.counts.validBindings !== 3) {
    console.error(JSON.stringify({ passed: false, mode: "expect-partial", baseline, report }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      passed: true,
      mode: "expect-partial",
      baselineMatched: true,
      packVersion: report.packVersion,
      counts: report.counts,
      errorsByCode: report.errorsByCode,
      hashes: report.hashes,
      pilotFrameIds: authoring.conceptFrames.map((item) => item.id),
      note: "三个试点已通过概念框架契约；其余126条口诀仍按设计阻断。",
    }, null, 2));
  }
} else if (!report.passed) {
  console.error(JSON.stringify({ passed: false, mode: "strict", counts: report.counts, errorsByCode: report.errorsByCode, firstIssues: report.issues.slice(0, 20) }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ passed: true, mode: "strict", counts: report.counts }, null, 2));
}
