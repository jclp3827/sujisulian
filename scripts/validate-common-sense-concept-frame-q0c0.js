#!/usr/bin/env node
"use strict";

const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const authoring = require("../docs/knowledge-platform/content/common-sense-concept-frames-q0c0");
const { validateConceptFrames, validateRedBaseline } = require("./lib/validate-common-sense-concept-frames");

const report = validateConceptFrames(pack, authoring);
if (process.argv.includes("--expect-red")) {
  const baseline = validateRedBaseline(report, authoring.redBaseline);
  if (!baseline.matched || report.passed) {
    console.error(JSON.stringify({ passed: false, mode: "expect-red", baseline, report }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      passed: true,
      mode: "expect-red",
      baselineMatched: true,
      packVersion: report.packVersion,
      counts: report.counts,
      errorsByCode: report.errorsByCode,
      hashes: report.hashes,
      firstMissingMnemonicIds: baseline.missingMnemonicIds.slice(0, 10),
      note: "红基线只证明契约准确识别存量口诀缺少概念框架，不表示概念链路已经通过。",
    }, null, 2));
  }
} else if (!report.passed) {
  console.error(JSON.stringify({
    passed: false,
    mode: "strict",
    packVersion: report.packVersion,
    counts: report.counts,
    errorsByCode: report.errorsByCode,
    hashes: report.hashes,
    firstIssues: report.issues.slice(0, 20),
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ passed: true, mode: "strict", packVersion: report.packVersion, counts: report.counts, hashes: report.hashes }, null, 2));
}
