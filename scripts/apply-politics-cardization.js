#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const sourceDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics-v2");
const relationPath = path.join(repo, "docs/knowledge-pilot/political-relations-v2-20260828.json");
const apply = process.argv.includes("--apply");

const plans = {
  u001: { summary: "b002", answer: ["b002", "b012"], pitfall: ["b015"], roles: { conclusion: ["b002"], reason: ["b011"], exception: ["b012"], contrast: ["b015"] } },
  u002: { summary: "b002", answer: ["b002"], pitfall: ["b012"], roles: { definition: ["b002"], evidence: ["b003", "b004"], conclusion: ["b005"], contrast: ["b012"] } },
  u003: { summary: "b003", answer: ["b004", "b015", "b018"], pitfall: ["b020"], roles: { hierarchy: ["b003"], definition: ["b004", "b015", "b018"], contrast: ["b020"] } },
  u004: { summary: "b002", answer: ["b019", "b020", "b021", "b022", "b023"], pitfall: ["b032"], roles: { conclusion: ["b002"], definition: ["b008"], sequence: ["b009", "b013"], hierarchy: ["b019", "b020", "b021", "b022", "b023", "b024"], contrast: ["b032"] } },
  u005: { summary: "b004", answer: ["b004", "b009"], pitfall: ["b016"], roles: { conclusion: ["b004", "b009"], hierarchy: ["b015"], contrast: ["b016"] } },
  u006: { summary: "b006", answer: ["b006", "b008", "b009", "b010", "b015"], pitfall: ["b024"], roles: { conclusion: ["b006", "b008"], definition: ["b009", "b010", "b015"], hierarchy: ["b019", "b021", "b022", "b023"], contrast: ["b024"] } },
  u007: { summary: "b002", answer: ["b002", "b009", "b010", "b011", "b012", "b013", "b015", "b022"], pitfall: ["b057"], roles: { conclusion: ["b002", "b015"], definition: ["b003"], hierarchy: ["b009", "b010", "b011", "b012", "b013", "b022", "b048"], exception: ["b016", "b017"], contrast: ["b057"] } },
  u008: { summary: "b003", answer: ["b003"], pitfall: ["b035"], roles: { definition: ["b003", "b023"], hierarchy: ["b006", "b007", "b008", "b009", "b024", "b026"], conclusion: ["b031", "b034"], contrast: ["b035"] } },
  u009: { summary: "b006", answer: ["b004", "b005", "b006", "b007"], pitfall: ["b013"], roles: { conclusion: ["b003", "b004", "b006"], hierarchy: ["b005"], sequence: ["b007"], condition: ["b010"], contrast: ["b013"] } },
  u010: { summary: "b002", answer: ["b002", "b024"], pitfall: ["b024"], roles: { conclusion: ["b002"], definition: ["b004", "b009", "b015"], hierarchy: ["b016"], condition: ["b023"], contrast: ["b024"] } },
  u011: { summary: "b005", answer: ["b005", "b008"], pitfall: ["b012"], roles: { conclusion: ["b002", "b005", "b008"], condition: ["b006"], evidence: ["b009"], contrast: ["b012"] } },
  u012: { summary: "b008", answer: ["b008"], pitfall: ["b015"], roles: { definition: ["b004"], conclusion: ["b005", "b008"], condition: ["b009"], hierarchy: ["b014"], contrast: ["b015"] } },
  u013: { summary: "b002", answer: ["b009", "b010"], pitfall: ["b020"], roles: { conclusion: ["b002", "b009"], hierarchy: ["b004", "b010"], sequence: ["b014", "b019"], contrast: ["b020"] } },
  u014: { summary: "b003", answer: ["b003"], pitfall: ["b040"], roles: { conclusion: ["b002", "b006", "b012", "b021", "b029"], hierarchy: ["b003"], sequence: ["b027"], reason: ["b023", "b024"], contrast: ["b040"] } },
  u015: { summary: "b002", answer: ["b002"], pitfall: ["b025"], roles: { conclusion: ["b002", "b005", "b013"], hierarchy: ["b003"], definition: ["b016", "b020"], condition: ["b023"], contrast: ["b025"] } },
  u016: { summary: "b003", answer: ["b003"], pitfall: ["b012"], roles: { definition: ["b002", "b004"], hierarchy: ["b003"], conclusion: ["b005", "b006", "b007", "b008", "b009"], contrast: ["b012"] } },
  u017: { summary: "b002", answer: ["b008", "b011"], pitfall: ["b012"], roles: { conclusion: ["b002", "b008", "b011"], sequence: ["b003"], hierarchy: ["b007"], evidence: ["b009"], contrast: ["b012"] } },
  u018: { summary: "b003", answer: ["b003", "b015"], pitfall: ["b015"], roles: { definition: ["b003"], conclusion: ["b004", "b007", "b009"], hierarchy: ["b010", "b011", "b012", "b013", "b014"], contrast: ["b015"] } },
  u019: { summary: "b008", answer: ["b008", "b009"], pitfall: ["b010"], roles: { conclusion: ["b008"], hierarchy: ["b003", "b004", "b005", "b006", "b009"], contrast: ["b010"] } },
  u020: { summary: "b003", answer: ["b003"], pitfall: ["b004", "b010"], roles: { evidence: ["b002"], hierarchy: ["b003", "b004", "b005"], conclusion: ["b006", "b007", "b008", "b009"], contrast: ["b010"] } },
  u021: { summary: "b002", answer: ["b003", "b005"], pitfall: ["b012"], roles: { definition: ["b002", "b004", "b007", "b010"], contrast: ["b003", "b005", "b012"], hierarchy: ["b006"] } },
  u022: { summary: "b002", answer: ["b002", "b003", "b007", "b008"], pitfall: ["b016"], roles: { definition: ["b002", "b003", "b006"], contrast: ["b004", "b016"], conclusion: ["b007", "b008"], condition: ["b009"], evidence: ["b012", "b013", "b014"], exception: ["b015"] } },
  u023: { summary: "b002", answer: ["b011"], pitfall: ["b012"], roles: { conclusion: ["b002"], hierarchy: ["b004"], definition: ["b010"], condition: ["b011"], contrast: ["b012"] } },
  u024: { summary: "b002", answer: ["b015", "b017"], pitfall: ["b025"], roles: { definition: ["b002", "b003", "b004", "b015", "b016", "b017", "b018", "b022", "b023"], hierarchy: ["b005", "b014", "b021"], condition: ["b013", "b024"], conclusion: ["b019", "b020"], contrast: ["b025"] } },
  u025: { summary: "b002", answer: ["b003"], pitfall: ["b010"], roles: { conclusion: ["b002", "b006"], condition: ["b003", "b007"], definition: ["b004"], sequence: ["b005"], hierarchy: ["b009"], contrast: ["b010"] } },
  u026: { summary: "b002", answer: ["b007"], pitfall: ["b011"], roles: { conclusion: ["b002", "b010"], hierarchy: ["b003", "b004", "b005", "b006"], definition: ["b007"], sequence: ["b008", "b009"], contrast: ["b011"] } },
  u027: { summary: "b011", answer: ["b012", "b013", "b014", "b015"], pitfall: ["b023"], roles: { definition: ["b003", "b008"], hierarchy: ["b005", "b006", "b011", "b012", "b013", "b014", "b015"], conclusion: ["b004", "b016"], evidence: ["b019", "b020", "b021", "b022"], contrast: ["b023"] } },
  u028: { summary: "b002", answer: ["b002"], pitfall: ["b006"], roles: { sequence: ["b002", "b005"], definition: ["b003", "b004"], contrast: ["b006"] } },
  u029: { summary: "b002", answer: ["b004", "b005", "b007", "b008"], pitfall: ["b009"], roles: { definition: ["b002"], conclusion: ["b004"], hierarchy: ["b005", "b007"], contrast: ["b008", "b009"] } },
  u030: { summary: "b010", answer: ["b010", "b011", "b012"], pitfall: ["b013"], roles: { definition: ["b002", "b005", "b006", "b007", "b008"], contrast: ["b003", "b013"], hierarchy: ["b009", "b012"], conclusion: ["b010", "b011"] } },
  u031: { summary: "b002", answer: ["b002", "b010", "b018"], pitfall: ["b012", "b020"], roles: { definition: ["b002", "b004", "b008", "b012", "b013"], conclusion: ["b010", "b018"], reason: ["b019"], hierarchy: ["b005", "b014", "b015", "b016"], contrast: ["b020"] } },
  u032: { summary: "b004", answer: ["b005"], pitfall: ["b006"], roles: { contrast: ["b002", "b006"], conclusion: ["b003", "b004"], hierarchy: ["b005"] } },
  u033: { summary: "b003", answer: ["b005", "b009"], pitfall: ["b012", "b014"], roles: { definition: ["b002", "b005", "b009"], hierarchy: ["b003"], conclusion: ["b012"], contrast: ["b013", "b014"] } },
  u034: { summary: "b002", answer: ["b006"], pitfall: ["b007"], roles: { definition: ["b002", "b003", "b004"], contrast: ["b005", "b007"], hierarchy: ["b006"] } },
  u035: { summary: "b004", answer: ["b004", "b007"], pitfall: ["b012"], roles: { definition: ["b003", "b005", "b006"], reason: ["b004"], conclusion: ["b007", "b009", "b010"], hierarchy: ["b011"], contrast: ["b012"] } },
  u036: { summary: "b003", answer: ["b002", "b003"], pitfall: ["b014"], roles: { definition: ["b002", "b005", "b007", "b009", "b011", "b013"], hierarchy: ["b003"], conclusion: ["b004"], contrast: ["b014"] } },
  u037: { summary: "b002", answer: ["b004", "b005"], pitfall: ["b014"], roles: { definition: ["b002", "b008", "b009", "b013"], condition: ["b004", "b005"], hierarchy: ["b006", "b010"], reason: ["b007"], contrast: ["b014"] } },
};

const contrastDetails = {
  "politics-rel-v2-030": { dimensions: ["发展规律回答的问题"], boundaries: ["对立统一规律回答发展动力；量变质变规律回答发展状态和形式。"] },
  "politics-rel-v2-031": { dimensions: ["发展规律回答的问题"], boundaries: ["对立统一规律揭示发展动力；否定之否定规律揭示发展方向和道路。"] },
  "politics-rel-v2-032": { dimensions: ["发展过程的观察角度"], boundaries: ["量变质变规律侧重状态变化；否定之否定规律侧重前进性和曲折性。"] },
  "politics-rel-v2-033": { dimensions: ["哲学关系的适用层级"], boundaries: ["物质与意识讨论一般哲学关系；社会存在与社会意识讨论社会历史领域。"] },
  "politics-rel-v2-039": { dimensions: ["分析对象"], boundaries: ["商品二因素是商品属性；劳动二重性是生产商品劳动的两重规定。"] },
};

function flattenRoles(plan) {
  const result = new Map();
  for (const [role, ids] of Object.entries(plan.roles)) {
    for (const id of ids) {
      assert.ok(!result.has(id), `${id}: 重复语义 ${result.get(id)}/${role}`);
      result.set(id, role);
    }
  }
  return result;
}

function addFrontmatterRefs(source, plan) {
  source = source.replace(/^version: 1$/m, "version: 2");
  if (/^summary_block_id:/m.test(source)) return source;
  const lines = source.split("\n");
  const end = lines.indexOf("---", 1);
  assert.ok(end > 0, "frontmatter未闭合");
  const fields = [
    `summary_block_id: "${plan.summary}"`,
    "recall_answer_block_ids:",
    ...plan.answer.map((id) => `  - "${id}"`),
    "recall_pitfall_block_ids:",
    ...plan.pitfall.map((id) => `  - "${id}"`),
  ];
  lines.splice(end, 0, ...fields);
  return lines.join("\n");
}

function wrapSemanticBlocks(source, semantics) {
  const lines = source.split("\n");
  const output = [];
  for (let index = 0; index < lines.length;) {
    const anchor = lines[index].match(/^<!--\s*kp:block-id=([^\s]+)\s*-->$/);
    if (!anchor) {
      output.push(lines[index]);
      index += 1;
      continue;
    }
    output.push(lines[index]);
    const id = anchor[1];
    index += 1;
    const chunk = [];
    while (index < lines.length && !/^<!--\s*kp:block-id=/.test(lines[index]) && !/^##\s+/.test(lines[index])) {
      chunk.push(lines[index]);
      index += 1;
    }
    const role = semantics.get(id);
    if (!role) {
      output.push(...chunk);
      continue;
    }
    let contentEnd = chunk.length;
    while (contentEnd > 0 && !chunk[contentEnd - 1].trim()) contentEnd -= 1;
    const content = chunk.slice(0, contentEnd);
    const trailing = chunk.slice(contentEnd);
    assert.ok(content.length && !/^###\s+/.test(content[0]), `${id}: heading不能转为atom`);
    if (/^>\s*\[!/.test(content[0])) {
      output.push(`> [!${role}]`, ...content.slice(1), ...trailing);
    } else {
      output.push(`> [!${role}]`, ...content.map((line) => `> ${line}`), ...trailing);
    }
  }
  return output.join("\n");
}

const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith(".md")).sort();
assert.strictEqual(files.length, 37);
assert.strictEqual(Object.keys(plans).length, 37);
const summaryByPointId = new Map();

for (const fileName of files) {
  const shortId = fileName.match(/-(u\d{3})-/)?.[1];
  const plan = plans[shortId];
  assert.ok(plan, `${fileName}: 缺少卡片化计划`);
  const filePath = path.join(sourceDir, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const pointId = source.match(/^id:\s*(\S+)$/m)?.[1];
  assert.ok(pointId, `${fileName}: 缺少pointId`);
  const ids = new Set([...source.matchAll(/^<!--\s*kp:block-id=([^\s]+)\s*-->$/gm)].map((match) => match[1]));
  for (const id of [plan.summary, ...plan.answer, ...plan.pitfall, ...flattenRoles(plan).keys()]) {
    assert.ok(ids.has(id), `${fileName}: 计划引用不存在 ${id}`);
  }
  summaryByPointId.set(pointId, plan.summary);
  const expected = wrapSemanticBlocks(addFrontmatterRefs(source, plan), flattenRoles(plan));
  if (apply) fs.writeFileSync(filePath, expected);
  else assert.strictEqual(source, expected, `${fileName}: 卡片化结果漂移`);
}

const ledger = JSON.parse(fs.readFileSync(relationPath, "utf8"));
for (const relation of ledger.relations) {
  const details = contrastDetails[relation.id] || { dimensions: [], boundaries: [] };
  relation.source_block_ids = [summaryByPointId.get(relation.source_id)];
  relation.target_block_ids = [summaryByPointId.get(relation.target_id)];
  relation.dimensions = details.dimensions;
  relation.boundaries = details.boundaries;
  relation.recall_item_ids = relation.type === "contrasts"
    ? [`recall:${relation.source_id}:qa`, `recall:${relation.target_id}:qa`]
    : [];
  assert.ok(relation.source_block_ids[0] && relation.target_block_ids[0], `${relation.id}: 关系锚点缺失`);
  if (relation.type === "contrasts") {
    assert.ok(relation.dimensions.length && relation.boundaries.length, `${relation.id}: 对照证据缺失`);
  }
}
const expectedLedger = `${JSON.stringify(ledger, null, 2)}\n`;
if (apply) fs.writeFileSync(relationPath, expectedLedger);
else assert.strictEqual(fs.readFileSync(relationPath, "utf8"), expectedLedger, "关系卡片证据漂移");

console.log(`politics cardization ${apply ? "applied" : "validated"}: 37 points, ${ledger.relations.length} relations`);
