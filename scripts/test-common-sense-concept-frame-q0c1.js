#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const authoring = require("../docs/knowledge-platform/content/common-sense-concept-frames-q0c1");
const { validateConceptFrames, mnemonicTargetIds } = require("./lib/validate-common-sense-concept-frames");

const report = validateConceptFrames(pack, authoring);
assert.equal(report.counts.validConceptFrames, 3);
assert.equal(report.counts.validBindings, 3);
assert.deepEqual(report.errorsByCode, { "missing-concept-frame-binding": 126 });

const expected = {
  "market-structure-concept-frame": { title: "市场结构", relation: "classification", mnemonic: "market-structure-four-types-memory" },
  "price-discrimination-concept-frame": { title: "价格歧视", relation: "classification", mnemonic: "price-discrimination-levels-memory" },
  "public-goods-concept-frame": { title: "公共物品", relation: "causal-chain", mnemonic: "public-goods-mechanism-memory" },
};
for (const frame of authoring.conceptFrames) {
  const rule = expected[frame.id];
  assert.ok(rule);
  assert.equal(frame.conceptTitle, rule.title);
  assert.equal(frame.nodes.filter((node) => node.role === "root")[0].label, rule.title);
  assert.equal(frame.relationType, rule.relation);
  assert.ok(frame.definition && frame.examTask && frame.parentPath.length >= 3);
  assert.ok(!/(帮助|用于)(用户)?(记忆|回忆)|记住知识/.test(`${frame.definition}${frame.examTask}`));
  const binding = authoring.mnemonicConceptBindings.find((item) => item.conceptFrameId === frame.id);
  assert.equal(binding.mnemonicId, rule.mnemonic);
  const mnemonic = pack.mnemonics.find((item) => item.id === rule.mnemonic);
  const frameTargets = new Set(frame.nodes.flatMap((node) => node.targetIds));
  assert.deepEqual(mnemonicTargetIds(mnemonic).filter((id) => !frameTargets.has(id)), []);
}

const publicFrame = authoring.conceptFrames.find((item) => item.id === "public-goods-concept-frame");
assert.ok(publicFrame.edges.some((edge) => edge.type === "contains"));
assert.ok(publicFrame.edges.some((edge) => edge.type === "contrasts-with"));
assert.equal(publicFrame.edges.filter((edge) => edge.type === "causes").length, 3);

console.log(JSON.stringify({
  passed: true,
  checks: 7,
  pilotFrames: authoring.conceptFrames.map((item) => ({ id: item.id, conceptTitle: item.conceptTitle, relationType: item.relationType })),
  remainingBlockedMnemonics: report.errorsByCode["missing-concept-frame-binding"],
}, null, 2));
