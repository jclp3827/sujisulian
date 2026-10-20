#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const knowledgeDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics-v2");
const audit = JSON.parse(fs.readFileSync(
  path.join(repo, "docs/knowledge-pilot/political-toc-audit-20260827-v2.json"),
  "utf8",
));
const structure = JSON.parse(fs.readFileSync(
  path.join(repo, "docs/knowledge-pilot/political-toc-structure-20260827-v2.json"),
  "utf8",
));
const packageData = require(path.join(repo, "miniprogram/models/politics-p3-v2-runtime"));

function parseFrontmatter(source, fileName) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, `${fileName}: frontmatter 不合法`);
  const values = {};
  let activeList = null;
  for (const line of match[1].split("\n")) {
    const item = line.match(/^\s{2}-\s+(.+)$/);
    if (item && activeList) {
      values[activeList].push(item[1].replace(/^['"]|['"]$/g, ""));
      continue;
    }
    const property = line.match(/^([a-z_]+):(?:\s*(.*))?$/);
    if (!property) continue;
    const [, key, raw = ""] = property;
    if (!raw || raw === "[]") {
      values[key] = [];
      activeList = key;
    } else if (/^\d+$/.test(raw)) {
      values[key] = Number(raw);
      activeList = null;
    } else {
      values[key] = raw.replace(/^['"]|['"]$/g, "");
      activeList = null;
    }
  }
  return { values, body: match[2] };
}

const files = fs.readdirSync(knowledgeDir).filter((name) => name.endsWith(".md")).sort();
assert.strictEqual(files.length, 37, "V2 结构化候选必须为 37 篇");
const byId = new Map();
for (const fileName of files) {
  const source = fs.readFileSync(path.join(knowledgeDir, fileName), "utf8");
  const parsed = parseFrontmatter(source, fileName);
  assert.strictEqual(parsed.values.status, "approved", `${fileName}: 首批内容必须已批准`);
  assert.strictEqual(parsed.values.review_state, "final_checked", `${fileName}: 内容终审状态错误`);
  assert.strictEqual(parsed.values.audit_state, "content_final_checked", `${fileName}: audit_state 错误`);
  assert.strictEqual(parsed.values.reviewed_at, "2026-10-04", `${fileName}: 缺少终审日期`);
  assert.ok(["section", "knowledge_point"].includes(parsed.values.node_type), `${fileName}: node_type 错误`);
  assert.strictEqual(parsed.values.hierarchy_ids.at(-1), parsed.values.toc_node_id, `${fileName}: 目录路径错误`);
  assert.strictEqual(parsed.values.hierarchy_ids.length, parsed.values.hierarchy_titles.length, `${fileName}: 目录路径长度错误`);
  for (const heading of ["一句话理解", "完整内容", "易混与边界", "速记卡"]) {
    assert.strictEqual((parsed.body.match(new RegExp(`^## ${heading}$`, "gm")) || []).length, 1, `${fileName}: ${heading} 数量错误`);
  }
  for (const forbidden of ["【考场传真】", "【小黑母题特训】", "A.", "B.", "C.", "D."]) {
    assert.ok(!parsed.body.includes(forbidden), `${fileName}: 仍含训练题内容 ${forbidden}`);
  }
  assert.ok(!byId.has(parsed.values.id), `${fileName}: id 重复`);
  byId.set(parsed.values.id, parsed);
}

for (const unit of audit.units) {
  const note = byId.get(unit.id);
  assert.ok(note, `${unit.id}: 缺少结构化候选`);
  assert.strictEqual(note.values.toc_node_id, unit.toc_node_id, `${unit.id}: toc_node_id 漂移`);
  assert.strictEqual(note.values.toc_order, unit.toc_order, `${unit.id}: toc_order 漂移`);
  assert.deepStrictEqual(note.values.source_pages.map(Number), unit.pages, `${unit.id}: source_pages 漂移`);
  assert.deepStrictEqual(note.values.risk_pages.map(Number), unit.risk_pages, `${unit.id}: risk_pages 漂移`);
  assert.strictEqual(note.values.source_hash, unit.source_hash, `${unit.id}: source_hash 漂移`);
}

assert.strictEqual(packageData.schemaVersion, 3);
assert.strictEqual(packageData.points.length, 37);
assert.strictEqual(packageData.directory.nodes.length, 42);
assert.deepStrictEqual(packageData.directory.rootIds, ["politics-toc-v2-n001"]);
assert.strictEqual(packageData.directory.nodes.find((node) => node.id === "politics-toc-v2-n001").pointCount, 37);
assert.strictEqual(new Set(packageData.points.map((point) => point.tocNodeId)).size, 37);
assert.deepStrictEqual(packageData.navigationOrder, audit.units.map((unit) => unit.id));
assert.deepStrictEqual(packageData.categories.map((category) => category.pointIds.length), [4, 15, 18]);
assert.strictEqual(structure.node_count, packageData.directory.nodes.length);
assert.strictEqual(packageData.buildScope, "runtime");
assert.ok(packageData.points.every((point) => point.status === "approved" && point.publishable === true));

console.log("politics TOC V2 content validation passed: 37 approved units, 42 directory nodes, 37 publishable");
