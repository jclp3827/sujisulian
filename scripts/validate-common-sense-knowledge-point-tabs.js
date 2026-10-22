#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const auditDirectory = path.resolve(__dirname, "../docs/common-sense-source-audit");
const audits = fs.readdirSync(auditDirectory).filter((file) => file.endsWith(".json")).map((file) => JSON.parse(fs.readFileSync(path.join(auditDirectory, file), "utf8")));
const requestedPartId = (process.argv.find((arg) => arg.startsWith("--part=")) || "").split("=")[1];
const categoryById = new Map(commonSense.categories.map((category) => [category.id, category]));
const scopedPointIds = new Set();

for (const part of commonSense.directory) {
  if (requestedPartId && part.id !== requestedPartId) continue;
  for (const chapter of part.chapters || []) {
    for (const section of chapter.sections || []) {
      if (section.pointId) scopedPointIds.add(section.pointId);
      else for (const pointId of categoryById.get(section.categoryId)?.pointIds || []) scopedPointIds.add(pointId);
    }
  }
}

const problems = [];
let knowledgePointCount = 0;
for (const pointId of scopedPointIds) {
  const point = commonSense.points.find((item) => item.id === pointId);
  const audit = audits.find((item) => item.pointId === pointId);
  if (!point || !audit) continue;
  const anchoredIds = new Set((audit.knowledgePoints || []).map((item) => item.id));
  const mappings = point.tabs.map((tab) => ({
    tabId: tab.id,
    title: tab.title,
    knowledgePointIds: (audit.knowledgePointIds || []).filter((knowledgePointId) => tab.blocks.some((block) => {
      const sourceIds = block.sourceUnitIds || [];
      return sourceIds.includes(knowledgePointId) || (!anchoredIds.has(knowledgePointId) && sourceIds.includes(knowledgePointId));
    })),
  }));

  for (const knowledgePointId of audit.knowledgePointIds || []) {
    knowledgePointCount += 1;
    const matchedTabs = mappings.filter((mapping) => mapping.knowledgePointIds.includes(knowledgePointId));
    if (matchedTabs.length !== 1) problems.push(`${pointId}/${knowledgePointId}: 必须且只能映射一个独立页签，当前 ${matchedTabs.length}`);
  }
  for (const mapping of mappings) {
    if (mapping.knowledgePointIds.length !== 1) problems.push(`${pointId}/${mapping.tabId}: 页签必须只承载一个源文知识点，当前 ${mapping.knowledgePointIds.length}`);
    const knowledgePoint = (audit.knowledgePoints || []).find((item) => item.id === mapping.knowledgePointIds[0]);
    const sourceUnit = audit.contentUnits.find((item) => item.id === mapping.knowledgePointIds[0]);
    const expectedTitle = knowledgePoint?.label || sourceUnit?.label;
    if (expectedTitle && mapping.title !== expectedTitle) problems.push(`${pointId}/${mapping.tabId}: 页签标题“${mapping.title}”与知识点“${expectedTitle}”不一致`);
  }
}

console.log(JSON.stringify({ scope: requestedPartId || "all", cards: scopedPointIds.size, knowledgePoints: knowledgePointCount, problems }, null, 2));
if (problems.length) process.exit(1);
