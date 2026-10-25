#!/usr/bin/env node
const assert = require("assert/strict");
const path = require("path");

const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const {
  createGoldenGuideContent,
} = require("../miniprogram/subpackages/common-sense/services/guide-content");

const sourceArg = process.argv[2];
const probesArg = process.argv[3];
if (!sourceArg || !probesArg) {
  throw new Error("用法：node scripts/test-common-sense-guide-expansion-user.js <候选批次文件> <冷读探针文件>");
}
const batch = require(path.resolve(process.cwd(), sourceArg));
const probes = require(path.resolve(process.cwd(), probesArg));
const content = createGoldenGuideContent(body, batch);

assert.equal(probes.batchId, batch.id, "冷读探针与批次不对应");
assert.ok(Array.isArray(probes.cases) && probes.cases.length, "冷读探针为空");
const caseIds = probes.cases.map((item) => item.cardId);
assert.equal(new Set(caseIds).size, caseIds.length, "冷读样本重复");

const sampledGroups = new Set();
const sampledModes = { reuse: 0, "light-edit": 0, synthesized: 0 };
const metaLanguage = /(?:先记|抓住|挂回|配对|按.+记忆|背诵|口诀|收束)/u;

probes.cases.forEach((probe) => {
  const card = content.cardById[probe.cardId];
  assert.ok(card, `冷读样本不存在：${probe.cardId}`);
  const visibleText = `${card.title}\n${card.content}`;
  assert.equal(metaLanguage.test(visibleText), false, `冷读内容依赖元学习指令：${probe.cardId}`);
  assert.ok(card.title.length >= 2 && card.title.length <= 24, `冷读标题长度异常：${probe.cardId}`);
  assert.ok(card.content.length >= 35 && card.content.length <= 180, `冷读正文长度异常：${probe.cardId}`);
  assert.ok(typeof probe.question === "string" && probe.question.trim(), `冷读问题为空：${probe.cardId}`);
  assert.ok(Array.isArray(probe.requiredTermGroups) && probe.requiredTermGroups.length >= 2,
    `冷读探针覆盖不足：${probe.cardId}`);
  probe.requiredTermGroups.forEach((alternatives) => {
    assert.ok(Array.isArray(alternatives) && alternatives.length, `冷读关键词组为空：${probe.cardId}`);
    assert.equal(alternatives.some((term) => visibleText.includes(term)), true,
      `仅看卡片不能回答冷读问题：${probe.cardId} / ${alternatives.join("|")}`);
  });
  sampledGroups.add(card.pointId);
  sampledModes[card.productionMode] += 1;
});

assert.equal(sampledGroups.size, content.groups.length, "冷读抽样必须覆盖本批全部知识组");
assert.ok(Object.values(sampledModes).every((count) => count > 0), "冷读抽样必须覆盖三种生产方式");

console.log(JSON.stringify({
  ok: true,
  testType: "simulated-novice-cold-read",
  batchId: batch.id,
  sampleCards: probes.cases.length,
  coveredGroups: sampledGroups.size,
  productionModes: sampledModes,
  failures: 0,
  realUserStudy: "still-pending"
}, null, 2));
