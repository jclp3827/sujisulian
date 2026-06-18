#!/usr/bin/env node
/**
 * build-note-runtime.js
 *
 * 从拆分目录 miniprogram/models/note-{module}/
 * 重建运行时单文件 miniprogram/models/note-{module}.js
 *
 * 用法: node scripts/build-note-runtime.js
 * 或:   node scripts/build-note-runtime.js --check-only
 *       (只校验不一致，不写入文件)
 */

const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const modules = [
  "note-data-analysis",
  "note-quantity",
  "note-logic",
  "note-verbal",
  "note-graphic",
];

const checkOnly = process.argv.includes("--check-only");
let anyMismatch = false;

for (const baseName of modules) {
  const dir = path.join(repo, "miniprogram/models", baseName);
  const metaPath = path.join(dir, "meta.json");
  const catsPath = path.join(dir, "categories.json");
  const pointDir = path.join(dir, "points");

  if (!fs.existsSync(metaPath) || !fs.existsSync(catsPath) || !fs.existsSync(pointDir)) {
    console.log(`${baseName}: 拆分目录不完整，跳过`);
    continue;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const categories = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pointFiles = fs
    .readdirSync(pointDir)
    .filter((name) => name.endsWith(".json"))
    .sort();

  const points = pointFiles.flatMap((fileName) =>
    JSON.parse(fs.readFileSync(path.join(pointDir, fileName), "utf8")),
  );

  const runtimeSource = [
    `const moduleInfo = ${JSON.stringify(meta, null, 2)}`,
    `const categories = ${JSON.stringify(categories, null, 2)}`,
    `const points = ${JSON.stringify(points, null, 2)}`,
    "",
    "module.exports = {",
    "  module: moduleInfo,",
    "  categories,",
    "  points,",
    "}",
    "",
  ].join("\n");

  const runtimePath = path.join(repo, "miniprogram/models", `${baseName}.js`);

  if (checkOnly) {
    const current = fs.readFileSync(runtimePath, "utf8");
    if (current !== runtimeSource) {
      console.log(`${baseName}: 运行时文件与拆分目录不一致`);
      anyMismatch = true;
    } else {
      console.log(`${baseName}: 一致`);
    }
  } else {
    fs.writeFileSync(runtimePath, runtimeSource);
    console.log(`${baseName}: 已重建`);
  }
}

if (checkOnly) {
  process.exit(anyMismatch ? 1 : 0);
}
