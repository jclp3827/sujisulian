#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const pagePath = path.resolve(__dirname, "../miniprogram/pages/common-sense/index.js");
const pageSource = fs.readFileSync(pagePath, "utf8");
const categoryById = new Map(commonSense.categories.map((category) => [category.id, category]));
const actual = {};

for (const part of commonSense.directory) {
  actual[part.id] = (part.chapters || []).reduce((partTotal, chapter) => partTotal + (chapter.sections || []).reduce((chapterTotal, section) => {
    if (section.pointId) return chapterTotal + 1;
    return chapterTotal + (categoryById.get(section.categoryId)?.pointIds.length || 0);
  }, 0), 0);
}

const problems = [];
const total = Object.values(actual).reduce((sum, count) => sum + count, 0);
const totalMatch = pageSource.match(/COMMON_SENSE_POINT_COUNT\s*=\s*(\d+)/);
if (Number(totalMatch?.[1]) !== total) problems.push(`首页总数 ${totalMatch?.[1] || "缺失"}，实际 ${total}`);

for (const [partId, count] of Object.entries(actual)) {
  const pattern = new RegExp(`id:\\s*["']${partId}["'][\\s\\S]{0,240}?pointCount:\\s*(\\d+)`);
  const match = pageSource.match(pattern);
  if (Number(match?.[1]) !== count) problems.push(`${partId} 首页计数 ${match?.[1] || "缺失"}，实际 ${count}`);
}

console.log(JSON.stringify({ total, parts: actual, problems }, null, 2));
if (problems.length) process.exit(1);
