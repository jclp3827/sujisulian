#!/usr/bin/env node
/**
 * build-note-runtime.js
 *
 * 从拆分目录 miniprogram/models/note-{module}/
 * 重建运行时单文件，并同步到对应分包：
 * - 笔记：miniprogram/subpackages/note/models/
 * - 常识：miniprogram/subpackages/common-sense/models/
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

function ensureSameFile(outputPath, source, label) {
  if (checkOnly) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== source) {
      console.log(`${label}: 运行时文件不一致`);
      anyMismatch = true;
    } else {
      console.log(`${label}: 一致`);
    }
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, source);
  console.log(`${label}: 已重建`);
}

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

  ensureSameFile(runtimePath, runtimeSource, `${baseName} 主包镜像`);
  ensureSameFile(
    path.join(repo, "miniprogram/subpackages/note/models", `${baseName}.js`),
    runtimeSource,
    `${baseName} 笔记分包`,
  );
}

const commonSenseSourcePath = path.join(repo, "miniprogram/models/note-common-sense/index.js");
if (fs.existsSync(commonSenseSourcePath)) {
  delete require.cache[require.resolve(commonSenseSourcePath)];
  const commonSense = require(commonSenseSourcePath);
  const runtimeSource = `module.exports=${JSON.stringify(commonSense)};\n`;
  ensureSameFile(
    path.join(repo, "miniprogram/models/note-common-sense.js"),
    runtimeSource,
    "note-common-sense 主包镜像",
  );
  ensureSameFile(
    path.join(repo, "miniprogram/subpackages/common-sense/models/note-common-sense.js"),
    runtimeSource,
    "note-common-sense 常识分包",
  );
} else {
  console.log("note-common-sense: 拆分目录不完整，跳过");
}

if (checkOnly) {
  process.exit(anyMismatch ? 1 : 0);
}
