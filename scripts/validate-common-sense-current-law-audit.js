#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const repositoryRoot = path.resolve(__dirname, "..");
const auditDirectory = path.join(repositoryRoot, "docs/common-sense-current-law-audit");
const sourceAuditDirectory = path.join(repositoryRoot, "docs/common-sense-source-audit");
const sourceAudits = fs.readdirSync(sourceAuditDirectory).filter((file) => file.endsWith(".json")).map((file) => ({
  file,
  audit: JSON.parse(fs.readFileSync(path.join(sourceAuditDirectory, file), "utf8")),
}));
const problems = [];
const summaries = [];
const globallyReviewedSourceUnits = new Set();

for (const auditFile of fs.readdirSync(auditDirectory).filter((file) => file.endsWith(".json")).sort()) {
  const auditPath = path.join(auditDirectory, auditFile);
  const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
  const expectedPointIds = audit.scopePointIds || [];
  const expectedKnowledgePoints = [];
  const sourceAuditByPoint = new Map();

  if (!expectedPointIds.length) problems.push(`${auditFile}: scopePointIds 不能为空`);
  for (const pointId of expectedPointIds) {
    const point = commonSense.points.find((item) => item.id === pointId);
    const sourceAuditRecord = sourceAudits.find((record) => record.audit.pointId === pointId);
    if (!point) {
      problems.push(`${auditFile}: 缺少知识卡 ${pointId}`);
      continue;
    }
    if (!sourceAuditRecord) {
      problems.push(`${pointId} 缺少源文审计`);
      continue;
    }
    sourceAuditByPoint.set(pointId, sourceAuditRecord.audit);
    for (const sourceUnitId of sourceAuditRecord.audit.knowledgePointIds || []) {
      const sourceUnit = sourceAuditRecord.audit.contentUnits.find((unit) => unit.id === sourceUnitId)
        || sourceAuditRecord.audit.knowledgePoints?.find((unit) => unit.id === sourceUnitId);
      expectedKnowledgePoints.push({ pointId, sourceUnitId, title: sourceUnit?.label || "" });
    }
  }

  const reviewKeyCounts = new Map();
  for (const item of audit.knowledgePoints || []) {
    const key = `${item.pointId}/${item.sourceUnitId}`;
    reviewKeyCounts.set(key, (reviewKeyCounts.get(key) || 0) + 1);
    if (globallyReviewedSourceUnits.has(key)) problems.push(`${key} 被多个现行法审计重复覆盖`);
    globallyReviewedSourceUnits.add(key);
    if (!item.sourceUnitId) problems.push(`${item.pointId}/${item.tabId} 缺少源文知识点 ID`);
    if (!item.status) problems.push(`${key} 缺少现行法状态`);
    if (!Array.isArray(item.legalBasisIds) || !item.legalBasisIds.length) problems.push(`${key} 缺少现行法依据`);
    for (const basisId of item.legalBasisIds || []) {
      const source = audit.legalSources?.[basisId];
      if (!source) problems.push(`${key} 引用了不存在的依据：${basisId}`);
      else if (!/^https:\/\//.test(source.url || "")) problems.push(`${basisId} 缺少官方 HTTPS 链接`);
    }
    const point = commonSense.points.find((candidate) => candidate.id === item.pointId);
    const tab = point?.tabs?.find((candidate) => candidate.id === item.tabId);
    if (!tab) problems.push(`${key} 指向不存在的页签 ${item.tabId}`);
    else if (!tab.blocks.some((block) => (block.sourceUnitIds || []).includes(item.sourceUnitId))) problems.push(`${key} 未映射到页签 ${item.tabId} 的展示块`);
  }

  for (const expected of expectedKnowledgePoints) {
    const key = `${expected.pointId}/${expected.sourceUnitId}`;
    if (reviewKeyCounts.get(key) !== 1) problems.push(`${key} 必须且只能有一条现行法审计，当前 ${reviewKeyCounts.get(key) || 0}`);
    const reviewed = audit.knowledgePoints.find((item) => item.pointId === expected.pointId && item.sourceUnitId === expected.sourceUnitId);
    if (reviewed && expected.title && reviewed.title !== expected.title) problems.push(`${key} 审计标题与源文知识点标题不一致`);
  }
  for (const [key, count] of reviewKeyCounts) {
    if (count !== 1 || !expectedKnowledgePoints.some((item) => `${item.pointId}/${item.sourceUnitId}` === key)) problems.push(`${key} 不是当前审计范围内知识点或存在重复`);
  }

  if (audit.coverage?.cards !== expectedPointIds.length) problems.push(`${auditFile}: 声明卡片数 ${audit.coverage?.cards}，实际 ${expectedPointIds.length}`);
  if (audit.coverage?.knowledgePoints !== expectedKnowledgePoints.length) problems.push(`${auditFile}: 声明知识点数 ${audit.coverage?.knowledgePoints}，实际 ${expectedKnowledgePoints.length}`);

  for (const pointId of expectedPointIds) {
    const sourceAudit = sourceAuditByPoint.get(pointId);
    if (!sourceAudit) continue;
    if (sourceAudit.currentLawReview?.checkedAt !== audit.checkedAt) problems.push(`${pointId} 尚未同步本次现行法审计`);
    if (sourceAudit.currentLawReview?.auditFile !== path.relative(repositoryRoot, auditPath)) problems.push(`${pointId} 现行法审计文件指向错误`);
    if (sourceAudit.currentLawReview?.knowledgePointCount !== (sourceAudit.knowledgePointIds || []).length) problems.push(`${pointId} 双层审计记录的知识点数量错误`);
    for (const unit of sourceAudit.contentUnits || []) {
      if (unit.type === "list" && !Array.isArray(unit.displayItems)) problems.push(`${pointId}/${unit.id} 缺少 displayItems`);
      if (unit.type === "table" && !Array.isArray(unit.displayRows)) problems.push(`${pointId}/${unit.id} 缺少 displayRows`);
    }
  }

  summaries.push({ scope: audit.scope, cards: expectedPointIds.length, knowledgePoints: expectedKnowledgePoints.length, reviewed: (audit.knowledgePoints || []).length });
}

console.log(JSON.stringify({ audits: summaries, problems }, null, 2));
if (problems.length) process.exit(1);
