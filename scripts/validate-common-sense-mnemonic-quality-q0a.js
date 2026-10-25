#!/usr/bin/env node
const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const authoring = require("../docs/knowledge-platform/content/common-sense-mnemonic-quality-q0a");
const { validateMnemonicQuality, validateRedBaseline } = require("./lib/validate-common-sense-mnemonic-quality");

const report = validateMnemonicQuality(pack, authoring);
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
      note: "红基线匹配只证明质量门准确识别存量缺口，不表示口诀质量通过。",
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
