#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const path = require("path");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const baseline = require("../docs/knowledge-platform/implementations/common-sense-content-quality-q0a-red-baseline.json");
const { auditPack, baselineSignature, RULES } = require("./lib/common-sense-content-quality-gate");
const { failureFixtures, valid } = require("./fixtures/common-sense-content-quality-q0a-fixtures");
const clone = (value) => JSON.parse(JSON.stringify(value));

const args = new Set(process.argv.slice(2));
const expectRed = args.has("--expect-red");
const unknownArgs = [...args].filter((arg) => !["--expect-red"].includes(arg));
if (unknownArgs.length) throw new Error(`未知参数：${unknownArgs.join(", ")}`);

const validReport = auditPack(valid);
assert.equal(validReport.status, "green", "完整合规 fixture 应通过质量门");
assert.deepEqual(validReport.rules.filter((rule) => rule.violationCount).map((rule) => rule.id), [], "完整合规 fixture 不应触发规则");

const fixtureResults = failureFixtures.map((fixture) => {
  const report = auditPack(fixture.pack);
  const rule = report.rules.find((item) => item.id === fixture.ruleId);
  assert.ok(rule && rule.violationCount > 0, `${fixture.name} 未触发 ${fixture.ruleId}`);
  const actualRuleIds = report.rules.filter((item) => item.violationCount > 0).map((item) => item.id).sort();
  const expectedRuleIds = [...new Set([fixture.ruleId, ...(fixture.expectedCoViolationRuleIds || [])])].sort();
  assert.deepEqual(actualRuleIds, expectedRuleIds, `${fixture.name} 的规则隔离结果不符合声明`);
  return { name: fixture.name, ruleId: fixture.ruleId, expectedRuleIds, violationCount: rule.violationCount };
});
assert.deepEqual([...new Set(fixtureResults.map((item) => item.ruleId))].sort(), RULES.map((rule) => rule.id).sort(), "每条规则必须有登记的失败 fixture");

const report = auditPack(pack);
const signature = baselineSignature(report);
const drifted = clone(pack);
drifted.questions[0].prompt += " ";
const driftedSignature = baselineSignature(auditPack(drifted));
assert.notEqual(driftedSignature.contentSha256, signature.contentSha256, "任意内容漂移都必须改变冻结指纹");
assert.notDeepEqual(driftedSignature, baseline, "内容漂移不得继续匹配 --expect-red 基线");
if (expectRed) {
  assert.equal(report.status, "red", "--expect-red 要求当前库稳定复现红色基线");
  assert.deepEqual(signature, baseline, `红色基线漂移；不得通过放宽规则规避。请先审查 ${path.basename(__filename)} 的输出`);
  console.log(JSON.stringify({
    passed: true,
    mode: "expect-red",
    expectedRedObserved: true,
    fixtureChecks: fixtureResults.length + 2,
    contentDriftRejected: true,
    signature,
    rules: report.rules,
  }, null, 2));
} else {
  console.log(JSON.stringify({
    passed: !report.blocking,
    mode: "strict",
    fixtureChecks: fixtureResults.length + 2,
    contentDriftRejected: true,
    signature,
    rules: report.rules,
  }, null, 2));
  if (report.blocking) process.exitCode = 1;
}
