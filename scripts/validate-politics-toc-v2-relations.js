#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const ledger = JSON.parse(fs.readFileSync(
  path.join(repo, "docs/knowledge-pilot/political-relations-v2-20260828.json"),
  "utf8",
));
const packageData = require(path.join(repo, "miniprogram/models/politics-p3-v2-preview"));
const { buildCanonicalPackage } = require(path.join(
  repo,
  "miniprogram/services/knowledge-platform/politics-adapter",
));
const pointsById = new Map(packageData.points.map((point) => [point.id, point]));

assert.strictEqual(ledger.point_count, 37);
assert.strictEqual(ledger.relation_count, ledger.relations.length);
assert.strictEqual(ledger.relation_count, 39);
assert.deepStrictEqual(ledger.counts, { prerequisites: 20, contrasts: 5, related: 14 });

const seen = new Set();
for (const relation of ledger.relations) {
  assert.ok(pointsById.has(relation.source_id), `${relation.id}: source 不存在`);
  assert.ok(pointsById.has(relation.target_id), `${relation.id}: target 不存在`);
  assert.notStrictEqual(relation.source_id, relation.target_id, `${relation.id}: 自循环`);
  assert.ok(["prerequisites", "contrasts", "related"].includes(relation.type), `${relation.id}: 类型错误`);
  assert.ok(relation.why.length >= 12, `${relation.id}: 理由过短`);
  const key = `${relation.source_id}|${relation.type}|${relation.target_id}`;
  assert.ok(!seen.has(key), `${relation.id}: 重复关系`);
  seen.add(key);

  const source = pointsById.get(relation.source_id);
  const item = source.relationItems.find((candidate) =>
    candidate.type === relation.type && candidate.targetId === relation.target_id,
  );
  assert.ok(item, `${relation.id}: 未进入构建包`);
  assert.strictEqual(item.why, relation.why, `${relation.id}: 构建理由漂移`);
  assert.strictEqual(item.whySource, "authored", `${relation.id}: 关系理由必须是 authored`);
  const target = pointsById.get(relation.target_id);
  const sourceBlockIds = new Set([...source.contentBlocks, ...source.confusionBlocks].map((block) => block.id));
  const targetBlockIds = new Set([...target.contentBlocks, ...target.confusionBlocks].map((block) => block.id));
  assert.ok(relation.source_block_ids.length, `${relation.id}: 缺少source_block_ids`);
  assert.ok(relation.target_block_ids.length, `${relation.id}: 缺少target_block_ids`);
  relation.source_block_ids.forEach((id) => assert.ok(sourceBlockIds.has(id), `${relation.id}: source块不存在 ${id}`));
  relation.target_block_ids.forEach((id) => assert.ok(targetBlockIds.has(id), `${relation.id}: target块不存在 ${id}`));
  assert.deepStrictEqual(item.sourceBlockIds, relation.source_block_ids, `${relation.id}: source块构建漂移`);
  assert.deepStrictEqual(item.targetBlockIds, relation.target_block_ids, `${relation.id}: target块构建漂移`);
  if (relation.type === "contrasts") {
    assert.ok(relation.dimensions.length, `${relation.id}: 缺少对照维度`);
    assert.ok(relation.boundaries.length, `${relation.id}: 缺少对照边界`);
    assert.strictEqual(relation.recall_item_ids.length, 2, `${relation.id}: 对照回忆引用不足`);
  }
  assert.ok(
    target.reverseRelations.some((candidate) => candidate.targetId === relation.source_id),
    `${relation.id}: 缺少反向索引`,
  );
}

const prerequisiteTargets = new Map(packageData.points.map((point) => [point.id, point.relations.prerequisites]));
function visit(id, visiting = new Set(), visited = new Set()) {
  if (visiting.has(id)) throw new Error(`前置关系成环：${[...visiting, id].join(" -> ")}`);
  if (visited.has(id)) return;
  const nextVisiting = new Set(visiting).add(id);
  for (const targetId of prerequisiteTargets.get(id) || []) visit(targetId, nextVisiting, visited);
  visited.add(id);
}
const visited = new Set();
for (const id of pointsById.keys()) visit(id, new Set(), visited);

const degreeById = new Map(packageData.points.map((point) => [point.id, 0]));
for (const relation of ledger.relations) {
  degreeById.set(relation.source_id, degreeById.get(relation.source_id) + 1);
  degreeById.set(relation.target_id, degreeById.get(relation.target_id) + 1);
}
assert.ok([...degreeById.values()].every((degree) => degree > 0), "存在关系孤立知识点");
assert.ok(Math.max(...degreeById.values()) <= 6, "单点关系密度超过移动端首轮控制值 6");
assert.ok(packageData.points.every((point) => point.relationState === "authored_pending_final"));
assert.ok(packageData.points.every((point) => !point.publishable), "关系创立不得改变发布资格");
const canonical = buildCanonicalPackage(packageData);
assert.deepStrictEqual(canonical.diagnostics.errors, []);
assert.strictEqual(canonical.relations.filter((relation) =>
  relation.sourceBlockIds.length && relation.targetBlockIds.length).length, 39);
assert.strictEqual(canonical.contrastPairs.length, 5);

console.log(`politics TOC V2 relation validation passed: ${ledger.relation_count} authored relations, DAG, max degree ${Math.max(...degreeById.values())}`);
