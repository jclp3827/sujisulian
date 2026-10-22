#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const repositoryRoot = path.resolve(__dirname, "..");
const auditDirectory = path.join(repositoryRoot, "docs/common-sense-current-law-audit");
const sourceAuditDirectory = path.join(repositoryRoot, "docs/common-sense-source-audit");
const outputPath = path.join(auditDirectory, "law-correction-log.md");
const moduleOrder = ["administrative-enforcement.json", "criminal-law.json", "civil-code.json", "constitution.json"];
const statusLabels = {
  "updated": "已按现行法更新",
  "boundary-clarified": "已澄清适用边界",
  "current-compatible": "与现行法一致",
  "doctrinal-current-compatible": "学理表述与现行法相容",
};

const sourceAudits = fs.readdirSync(sourceAuditDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(path.join(sourceAuditDirectory, file), "utf8")));

function sanitize(text) {
  return String(text ?? "")
    .replace(/\r/g, "")
    .replace(/\|/g, "｜")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tableRowsToText(rows, columns = []) {
  const lines = [];
  if (columns.length) lines.push(columns.join("｜"));
  for (const row of rows || []) lines.push((row || []).map((cell) => sanitize(cell)).join("｜"));
  return lines.join("\n");
}

function unitText(unit, display) {
  if (!unit) return "未找到对应源文单元。";
  if (unit.type === "list") return (display ? unit.displayItems : unit.items || []).map((item) => sanitize(item)).join("\n");
  if (unit.type === "table") return tableRowsToText(display ? unit.displayRows : unit.rows, unit.columns);
  return sanitize(unit.text || unit.label);
}

function exactOldNew(sourceAudit, item) {
  const point = commonSense.points.find((entry) => entry.id === item.pointId);
  const tab = point?.tabs?.find((entry) => entry.id === item.tabId);
  const mappedIds = [...new Set((tab?.blocks || []).flatMap((block) => block.sourceUnitIds || []))];
  const anchors = (sourceAudit.knowledgePoints || []).filter((entry) => mappedIds.includes(entry.id));
  const anchoredParentIds = new Set(anchors.map((entry) => entry.sourceUnitId));
  const fragments = [];
  for (const anchor of anchors) {
    const unit = sourceAudit.contentUnits.find((entry) => entry.id === anchor.sourceUnitId);
    fragments.push({
      label: unit?.label || anchor.label,
      oldText: tableRowsToText([unit?.rows?.[anchor.row]], unit?.columns),
      newText: tableRowsToText([unit?.displayRows?.[anchor.row]], unit?.columns),
    });
  }
  for (const sourceUnitId of mappedIds) {
    if (anchoredParentIds.has(sourceUnitId) || anchors.some((anchor) => anchor.id === sourceUnitId)) continue;
    const unit = sourceAudit.contentUnits.find((entry) => entry.id === sourceUnitId);
    if (!unit || !["list", "table"].includes(unit.type)) continue;
    fragments.push({ label: unit.label, oldText: unitText(unit, false), newText: unitText(unit, true) });
  }
  if (!fragments.length) {
    const unit = sourceAudit.contentUnits.find((entry) => entry.id === item.sourceUnitId);
    fragments.push({ label: unit?.label, oldText: unitText(unit, false), newText: unitText(unit, true) });
  }
  const formatFragments = (key) => fragments.map((fragment) => `${fragment.label ? `${fragment.label}\n` : ""}${fragment[key]}`).join("\n\n");
  return { oldText: formatFragments("oldText"), newText: formatFragments("newText") };
}

function quote(text) {
  return sanitize(text).split("\n").map((line) => `> ${line || "　"}`).join("\n");
}

const availableAuditFiles = fs.readdirSync(auditDirectory).filter((file) => file.endsWith(".json"));
const orderedAuditFiles = [
  ...moduleOrder.filter((file) => availableAuditFiles.includes(file)),
  ...availableAuditFiles.filter((file) => !moduleOrder.includes(file)).sort(),
];
const audits = orderedAuditFiles.map((file) => ({ file, audit: JSON.parse(fs.readFileSync(path.join(auditDirectory, file), "utf8")) }));
const checkedAt = audits.map(({ audit }) => audit.checkedAt).sort().at(-1);
const totalCards = audits.reduce((sum, { audit }) => sum + audit.coverage.cards, 0);
const totalKnowledgePoints = audits.reduce((sum, { audit }) => sum + audit.coverage.knowledgePoints, 0);
const totalChanged = audits.reduce((sum, { audit }) => sum + audit.knowledgePoints.filter((item) => !item.status.endsWith("current-compatible")).length, 0);

const lines = [
  "# 法律常识现行法校对更新台账",
  "",
  `> 统一维护日期：${checkedAt}。本文件由现行法审计记录自动生成，后续模块继续追加在本文件中。`,
  "",
  "## 使用口径",
  "",
  "- “PDF旧表述”忠实保留教材图片中的原始内容；它可能是旧法，也可能只是过度概括、学理分类或原书错误，不能一律理解为曾经有效的法律。",
  "- “现行法新表述”是小程序正式展示内容；PDF源文不会被覆盖，二者分别保存在源文层和展示层。",
  "- 每个源文知识点必须独立成页签，并逐项具备现行法状态和官方依据。",
  "- 本台账只展开发生更新或边界澄清的项目；其余项目已逐项审计并标记为与现行法相容。",
  "",
  "## 总览",
  "",
  `- 已校对：${totalCards} 张知识卡、${totalKnowledgePoints} 个知识点。`,
  `- 更新或澄清：${totalChanged} 个知识点。`,
  `- 模块：${audits.map(({ audit }) => audit.scope.split("/").at(-1)).join("、")}。`,
  "",
];

for (const { file, audit } of audits) {
  const changedItems = audit.knowledgePoints.filter((item) => !item.status.endsWith("current-compatible"));
  lines.push(`## ${audit.scope.split("/").at(-1)}`, "");
  lines.push(`- 覆盖：${audit.coverage.cards} 张卡、${audit.coverage.knowledgePoints} 个知识点。`);
  lines.push(`- 结果：${changedItems.length} 项更新或澄清，其余 ${audit.coverage.knowledgePoints - changedItems.length} 项与现行法相容。`);
  lines.push(`- 审计记录：[${file}](./${file})`);
  if (audit.latestVerification) {
    lines.push(`- 最新复核：${audit.latestVerification.conclusion}`);
    lines.push(`- 复核来源：${audit.latestVerification.sources.map((source) => `[${source.title}](${source.url})`).join("；")}。`);
  }
  lines.push("");

  changedItems.forEach((item, index) => {
    const sourceAudit = sourceAudits.find((entry) => entry.pointId === item.pointId);
    if (!sourceAudit) throw new Error(`缺少源文审计：${item.pointId}`);
    const { oldText, newText } = exactOldNew(sourceAudit, item);
    const bases = item.legalBasisIds.map((id) => audit.legalSources[id]).filter(Boolean);
    lines.push(`### ${index + 1}. ${item.title}`, "");
    lines.push(`- 状态：${statusLabels[item.status] || item.status}`);
    lines.push(`- 变更说明：${item.note || "按现行法完成逐项核对。"}`);
    lines.push(`- 法律依据：${bases.map((source) => `[${source.title}](${source.url})`).join("；")}。`, "");
    lines.push("PDF旧表述：", "", quote(oldText), "");
    lines.push("现行法新表述：", "", quote(newText), "");
  });
}

lines.push(
  "## 发布门槛",
  "",
  "每次新增或更新法律模块后，必须重新生成本台账，并通过以下检查：",
  "",
  "1. 源文知识点与页签一一对应。",
  "2. PDF源文和现行法展示内容分别保存。",
  "3. 每个知识点均有审计状态和官方法律依据。",
  "4. 所有填空答案在现行展示内容中继续保持重点高亮。",
  "5. 全量计数、源文还原、现行法审计和运行数据验证均无问题。",
  ""
);

fs.writeFileSync(outputPath, `${lines.join("\n")}\n`);
console.log(`已生成统一校对台账：${path.relative(repositoryRoot, outputPath)}（${totalChanged}项更新或澄清）`);
