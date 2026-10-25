#!/usr/bin/env node

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const sourcePdf = path.join(repo, "政治理论/政治理论.pdf");
const structure = require(path.join(repo, "docs/knowledge-pilot/political-toc-structure-20260827-v2.json"));
const audit = require(path.join(repo, "docs/knowledge-pilot/political-toc-audit-20260827-v2.json"));
const migration = require(path.join(repo, "docs/knowledge-pilot/political-toc-migration-20260827-v2.json"));
const outputDir = path.join(repo, "docs/knowledge-pilot/sources/politics/02-toc-audit-v2");

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

assert.strictEqual(sha256File(sourcePdf), structure.source_pdf_hash, "V2 结构清单的 PDF 哈希不一致");
assert.strictEqual(audit.source_pdf_hash, structure.source_pdf_hash, "V2 审计与结构清单来源不一致");
assert.strictEqual(audit.page_count, 72);
assert.strictEqual(structure.node_count, 42);
assert.strictEqual(structure.leaf_count, 37);
assert.strictEqual(audit.content_unit_count, 37);

const typeCounts = structure.nodes.reduce((counts, node) => {
  counts[node.type] = (counts[node.type] || 0) + 1;
  return counts;
}, {});
assert.deepStrictEqual(typeCounts, {
  part: 1,
  article: 2,
  chapter: 2,
  knowledge_point: 22,
  section: 15,
});

const nodesById = new Map(structure.nodes.map((node) => [node.id, node]));
for (const node of structure.nodes) {
  assert.strictEqual(node.body_page, node.expected_pdf_page, `${node.id}: 目录页码与正文标题页不一致`);
  assert.strictEqual(node.path_ids.at(-1), node.id, `${node.id}: 层级路径未以自身结束`);
  if (node.parent_id) {
    assert.ok(nodesById.has(node.parent_id), `${node.id}: 父节点不存在`);
    assert.ok(node.path_ids.includes(node.parent_id), `${node.id}: 层级路径缺少父节点`);
  }
}

const files = fs.readdirSync(outputDir).filter((name) => name.endsWith(".md")).sort();
assert.strictEqual(files.length, 37, "V2 草稿文件数必须为 37");
assert.strictEqual(audit.units.length, 37);

const coveredPages = new Set();
const riskPages = new Set();
for (const [index, unit] of audit.units.entries()) {
  assert.strictEqual(unit.toc_order, index + 1, `${unit.id}: 目录顺序不连续`);
  assert.strictEqual(unit.body_start_page, unit.expected_pdf_page, `${unit.id}: 正文起始页偏离目录`);
  assert.ok(unit.pages.length, `${unit.id}: 缺少正文页码`);
  unit.pages.forEach((page) => coveredPages.add(page));
  unit.risk_pages.forEach((page) => riskPages.add(page));
  const filePath = path.join(repo, unit.file);
  assert.ok(fs.existsSync(filePath), `${unit.id}: 草稿文件不存在`);
  const source = fs.readFileSync(filePath, "utf8");
  assert.ok(source.includes(`id: ${unit.id}`), `${unit.id}: frontmatter ID 不一致`);
  assert.ok(source.includes(`toc_node_id: ${unit.toc_node_id}`), `${unit.id}: 缺少目录节点映射`);
  assert.ok(source.includes("## 第二轮识别正文"), `${unit.id}: 缺少第二轮正文`);
  assert.ok(!/抖音关注公考|时政要点即时学/.test(source), `${unit.id}: 广告页眉未清除`);
}
assert.deepStrictEqual([...coveredPages].sort((a, b) => a - b), Array.from({ length: 69 }, (_, index) => index + 4));
assert.deepStrictEqual([...riskPages].sort((a, b) => a - b), [4, 7, 15, 16, 17, 20, 21, 36, 49, 57, 70]);

const unit4 = fs.readFileSync(path.join(repo, audit.units[3].file), "utf8");
const unit5 = fs.readFileSync(path.join(repo, audit.units[4].file), "utf8");
const unit19 = fs.readFileSync(path.join(repo, audit.units[18].file), "utf8");
assert.ok(!unit4.includes("第一节 党的全面领导"), "中国式现代化单元仍错误吞入第一节");
assert.ok(unit5.includes("第一节 党的全面领导"), "第一节没有形成独立单元");
assert.ok(!unit19.includes("第二篇《马克思主义基本原理》"), "第十五节仍错误吞入第二篇");

assert.strictEqual(migration.old_unit_count, 25);
assert.strictEqual(migration.new_unit_count, 37);
assert.strictEqual(migration.records.length, 25);
assert.strictEqual(migration.records.filter((item) => item.disposition === "one-to-one").length, 21);
assert.strictEqual(migration.records.filter((item) => item.disposition === "split-and-reassign").length, 2);
assert.strictEqual(migration.records.filter((item) => item.disposition === "merge-into-toc-section").length, 2);

const oldRawCount = fs.readdirSync(path.join(repo, "docs/knowledge-pilot/sources/politics/01-raw"))
  .filter((name) => name.endsWith(".md")).length;
const currentKnowledgeCount = fs.readdirSync(path.join(repo, "docs/knowledge-pilot/knowledge/politics"))
  .filter((name) => name.endsWith(".md")).length;
assert.strictEqual(oldRawCount, 25, "第一轮 01-raw 被意外改变");
assert.strictEqual(currentKnowledgeCount, 25, "当前知识层被第二轮审计提前替换");

console.log("political TOC audit v2 validation passed: 42 nodes, 37 units, 25 migrations, 11 content risk pages");
