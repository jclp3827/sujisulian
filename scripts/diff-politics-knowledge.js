#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repo = path.resolve(__dirname, "..");
const defaultPackagePath = "docs/knowledge-pilot/dist/politics/politics-preview.json";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(repo, filePath), "utf8"));
}

function readHeadPackage() {
  return JSON.parse(execFileSync("git", ["show", `HEAD:${defaultPackagePath}`], {
    cwd: repo,
    encoding: "utf8",
  }));
}

function pointShape(point) {
  return {
    title: point.title,
    category: point.category,
    version: point.version,
    sourceHash: point.sourceHash,
    summary: point.summary,
    contentBlocks: point.contentBlocks,
    confusionBlocks: point.confusionBlocks,
    card: point.card,
    relationItems: point.relationItems || point.relations,
  };
}

function changedFields(before, after) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
}

function comparePackages(before, after) {
  const beforeById = new Map(before.points.map((point) => [point.id, point]));
  const afterById = new Map(after.points.map((point) => [point.id, point]));
  const added = after.points.filter((point) => !beforeById.has(point.id)).map((point) => point.id);
  const removed = before.points.filter((point) => !afterById.has(point.id)).map((point) => point.id);
  const changed = after.points
    .filter((point) => beforeById.has(point.id))
    .map((point) => {
      const fields = changedFields(pointShape(beforeById.get(point.id)), pointShape(point));
      return fields.length ? { id: point.id, fields } : null;
    })
    .filter(Boolean);
  return {
    beforeSchemaVersion: before.schemaVersion || 1,
    afterSchemaVersion: after.schemaVersion || 1,
    added,
    removed,
    changed,
    navigationChanged: JSON.stringify(before.navigationOrder || []) !== JSON.stringify(after.navigationOrder || []),
  };
}

function selfTest() {
  const before = {
    schemaVersion: 1,
    navigationOrder: ["a"],
    points: [{ id: "a", title: "A", version: 1, relations: {} }],
  };
  const after = {
    schemaVersion: 2,
    navigationOrder: ["a", "b"],
    points: [
      { id: "a", title: "A2", version: 2, relations: {} },
      { id: "b", title: "B", version: 1, relations: {} },
    ],
  };
  const diff = comparePackages(before, after);
  assert.deepStrictEqual(diff.added, ["b"]);
  assert.deepStrictEqual(diff.removed, []);
  assert.deepStrictEqual(diff.changed, [{ id: "a", fields: ["title", "version"] }]);
  assert.strictEqual(diff.navigationChanged, true);
  console.log("politics knowledge diff: self-test passed");
}

if (process.argv.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

const beforePath = argument("--before");
const afterPath = argument("--after") || defaultPackagePath;
const before = beforePath ? readJson(beforePath) : readHeadPackage();
const after = readJson(afterPath);
const diff = comparePackages(before, after);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(diff, null, 2));
} else {
  console.log("# 政治知识构建差异");
  console.log("");
  console.log(`- 数据协议：v${diff.beforeSchemaVersion} → v${diff.afterSchemaVersion}`);
  console.log(`- 新增知识：${diff.added.length ? diff.added.join("、") : "无"}`);
  console.log(`- 删除知识：${diff.removed.length ? diff.removed.join("、") : "无"}`);
  console.log(`- 变更知识：${diff.changed.length}`);
  for (const item of diff.changed) console.log(`  - ${item.id}：${item.fields.join("、")}`);
  console.log(`- 导航顺序变化：${diff.navigationChanged ? "是" : "否"}`);
}
