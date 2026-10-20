#!/usr/bin/env node

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const profileArgIndex = process.argv.findIndex((value) => value === "--profile");
const inlineProfileArg = process.argv.find((value) => value.startsWith("--profile="));
const buildProfile = inlineProfileArg
  ? inlineProfileArg.slice("--profile=".length)
  : profileArgIndex >= 0
    ? process.argv[profileArgIndex + 1]
    : "legacy";
if (!new Set(["legacy", "toc-v2"]).has(buildProfile)) {
  throw new Error("--profile 只允许 legacy 或 toc-v2");
}
const isTocV2 = buildProfile === "toc-v2";
const inputDir = path.join(repo, `docs/knowledge-pilot/knowledge/${isTocV2 ? "politics-v2" : "politics"}`);
const scopeArgIndex = process.argv.findIndex((value) => value === "--scope");
const scopeArg = process.argv.find((value) => value.startsWith("--scope="));
const buildScope = scopeArg
  ? scopeArg.slice("--scope=".length)
  : scopeArgIndex >= 0
    ? process.argv[scopeArgIndex + 1]
    : "runtime";
if (!new Set(["runtime", "review"]).has(buildScope)) {
  throw new Error("--scope 只允许 runtime 或 review");
}
const isReviewBuild = buildScope === "review";
const includedStatuses = isReviewBuild
  ? new Set(["review", "approved", "published"])
  : new Set(["approved", "published"]);
const outputName = isTocV2
  ? `politics-v2-${isReviewBuild ? "review" : "runtime"}`
  : isReviewBuild ? "politics-review" : "politics";
const outputDir = path.join(repo, `docs/knowledge-pilot/dist/${outputName}`);
const outputPath = path.join(outputDir, `${outputName}-preview.json`);
const reportPath = path.join(outputDir, "build-report.md");
const runtimeDataPath = path.join(
  repo,
  `miniprogram/models/${isTocV2 ? "politics-p3-v2-runtime" : "politics-preview"}.js`,
);
const p3PreviewDataPath = path.join(
  repo,
  `miniprogram/models/${isTocV2 ? "politics-p3-v2-preview" : "politics-p3-preview"}.js`,
);
const tocStructurePath = path.join(repo, "docs/knowledge-pilot/political-toc-structure-20260827-v2.json");
const blockMigrationPath = path.join(repo, "docs/knowledge-pilot/political-block-id-migrations-20260829.json");
const relationAuditPath = path.join(repo, "docs/knowledge-pilot/political-relations-v2-20260828.json");
const quickPrimerPath = path.join(repo, "docs/knowledge-pilot/sources/politics/quick-primer-v2.json");
const checkOnly = process.argv.includes("--check-only");

const requiredProperties = [
  "id",
  "title",
  "module",
  "category",
  "status",
  "version",
  "source_units",
  "source_hash",
];
const relationProperties = ["prerequisites", "contrasts", "related"];
const reverseRelationTypes = {
  prerequisites: "subsequent",
  contrasts: "contrasts",
  related: "related",
};
const canonicalRelationTypes = {
  prerequisites: "prerequisite",
  contrasts: "contrast",
  related: "related",
};
const allowedStatuses = new Set(["draft", "review", "approved", "published", "stale"]);
const requiredSections = ["一句话理解", "完整内容", "易混与边界", "速记卡"];
const forbiddenPlaceholders = ["待人工", "待补", "请用一到两句", "抽样审核项"];
const cardSemantics = new Set([
  "definition",
  "conclusion",
  "reason",
  "hierarchy",
  "sequence",
  "condition",
  "exception",
  "contrast",
  "evidence",
]);
const POLITICS_ROUTE_DEFAULTS = Object.freeze({
  quick: {
    scopeId: "politics-toc-v2-n001",
    primerId: "politics-quick-primer-v2",
    anchorNodeIds: [
      "politics-toc-v2-n006",
      "politics-toc-v2-n007",
      "politics-toc-v2-n025",
      "politics-toc-v2-n029",
      "politics-toc-v2-n032",
      "politics-toc-v2-n038",
    ],
    reason: "按正式两篇主分支和六个策展锚点建立整体认识；锚点只引用现有知识，不改变正式目录",
  },
  systematic: {
    scopeId: "politics-toc-v2-n003",
    allowedScopeTypes: ["article", "chapter", "section"],
    reason: "从边界明确的第一章总论开始，按正式顺序和前置约束连续学习",
  },
  confusion: {
    priorityRelationIds: [
      "relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024",
      "relation:politics-toc-v2-u026:contrast:politics-toc-v2-u024",
      "relation:politics-toc-v2-u026:contrast:politics-toc-v2-u025",
      "relation:politics-toc-v2-u030:contrast:politics-toc-v2-u022",
      "relation:politics-toc-v2-u034:contrast:politics-toc-v2-u033",
    ],
    reason: "按已确认ContrastPair策展顺序推荐，不预测用户弱点",
  },
  exam: {
    scopeId: "politics-toc-v2-n003",
    order: "navigation",
    reason: "使用同一边界明确的正式范围生成冻结卡组；随机仅由用户显式开启",
  },
});
const sourceBlockIdPattern = /^b\d{3,}$/;
const readingAnnotationKeys = new Set(["heading", "emphasis", "relationPlacements", "comparison", "flow"]);
const readingEmphasisRoles = new Set(["key", "boundary"]);
const readingRelationRoles = new Set(["localBoundary", "crossPointComparison", "background"]);
const readingRelationPlacements = new Set(["section-end", "footer"]);

function loadQuickPrimerArtifact(points, directory) {
  if (!isTocV2) return { quickPrimers: [], contentCoverage: null, source: "" };
  if (!fs.existsSync(quickPrimerPath)) throw new Error("J2 v2 quick primer artifact missing");
  const source = fs.readFileSync(quickPrimerPath, "utf8");
  const artifact = JSON.parse(source);
  const primer = artifact.primer;
  const coverage = artifact.contentCoverage;
  const eligibleStatuses = isReviewBuild
    ? new Set(["review", "approved", "published"])
    : new Set(["approved", "published"]);
  if (!primer || primer.id !== "politics-quick-primer-v2" || !eligibleStatuses.has(primer.status)) {
    throw new Error("J2 v2 quick primer metadata invalid");
  }
  if (!coverage || coverage.moduleId !== "politics") throw new Error("politics content coverage missing");
  const nodes = new Set((directory?.nodes || []).map((item) => item.id));
  const units = new Map(points.map((point) => [point.id, point]));
  const blocks = new Set(points.flatMap((point) => [...point.contentBlocks, ...point.confusionBlocks]
    .map((block) => `block:${point.id}:${block.id}`)));
  const atoms = new Set(points.flatMap((point) => point.cardSchema === 1
    ? [...point.contentBlocks, ...point.confusionBlocks]
      .filter((block) => cardSemantics.has(block.semantic))
      .map((block) => `atom:${point.id}:${block.id}`)
    : []));
  if (primer.sections?.length !== 8) throw new Error("J2 v2 quick primer must contain eight sections");
  for (const [index, section] of primer.sections.entries()) {
    const expectedId = `J2V2-SEC-${String(index + 1).padStart(2, "0")}`;
    if (section.id !== expectedId || section.order !== index + 1 || !section.narrativeSegments?.length) {
      throw new Error(`J2 v2 quick primer section invalid: ${expectedId}`);
    }
    for (const nodeId of section.structureFocusNodeIds || []) {
      if (!nodes.has(nodeId)) throw new Error(`${section.id}: structure node missing ${nodeId}`);
    }
    for (const pointId of section.detailTargets || []) {
      if (!units.has(pointId)) throw new Error(`${section.id}: detail target missing ${pointId}`);
    }
    for (const segment of section.narrativeSegments) {
      if (!["source", "bridge", "scenario", "label"].includes(segment.type) || !segment.text) {
        throw new Error(`${section.id}: narrative segment invalid`);
      }
      if (["source", "bridge"].includes(segment.type) && !(segment.sourceBlockIds?.length || segment.sourceAtomRefIds?.length)) {
        throw new Error(`${section.id}: factual narrative segment is unsourced`);
      }
      for (const blockId of segment.sourceBlockIds || []) if (!blocks.has(blockId)) throw new Error(`${section.id}: source block missing ${blockId}`);
      for (const atomId of segment.sourceAtomRefIds || []) if (!atoms.has(atomId)) throw new Error(`${section.id}: source atom missing ${atomId}`);
    }
  }
  for (const nodeId of primer.structure?.macroNodeIds || []) if (!nodes.has(nodeId)) throw new Error(`quick primer macro node missing ${nodeId}`);
  for (const proposition of primer.structure?.propositions || []) {
    if (!nodes.has(proposition.fromNodeId) || !nodes.has(proposition.toNodeId) || !proposition.label) throw new Error(`quick primer proposition invalid: ${proposition.id}`);
    for (const blockId of proposition.sourceBlockIds || []) if (!blocks.has(blockId)) throw new Error(`quick primer proposition block missing ${blockId}`);
  }
  return { quickPrimers: [primer], contentCoverage: coverage, source };
}

function unquote(value) {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source, fileName) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: 缺少合法的 YAML frontmatter`);

  const properties = {};
  let activeList = null;
  for (const [index, line] of match[1].split("\n").entries()) {
    if (!line.trim()) continue;
    const listItem = line.match(/^\s{2}-\s+(.+)$/);
    if (listItem && activeList) {
      properties[activeList].push(unquote(listItem[1]));
      continue;
    }

    const property = line.match(/^([a-z_]+):(?:\s*(.*))?$/);
    if (!property) {
      throw new Error(`${fileName}:${index + 2}: 不支持的 frontmatter 结构`);
    }
    const [, key, rawValue = ""] = property;
    if (Object.hasOwn(properties, key)) throw new Error(`${fileName}: 属性 ${key} 重复`);
    if (!rawValue || rawValue === "[]") {
      properties[key] = [];
      activeList = key;
    } else if (/^\d+$/.test(rawValue)) {
      properties[key] = Number(rawValue);
      activeList = null;
    } else {
      properties[key] = unquote(rawValue);
      activeList = null;
    }
  }

  return { properties, body: match[2].trim() };
}

function getSection(body, heading) {
  const lines = body.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return null;
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n").trim();
}

function getSubsection(section, heading) {
  const lines = section.split("\n");
  const start = lines.findIndex((line) => line.trim() === `### ${heading}`);
  if (start === -1) return null;
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^###\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n").trim();
}

function linkTarget(value) {
  const match = value.match(/^\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]$/);
  return match ? match[1] : null;
}

function parseRelationReason(value) {
  const match = value.match(/^(prerequisites|contrasts|related)\|([^|]+)\|(.+)$/);
  if (!match) return null;
  return { type: match[1], targetId: match[2].trim(), why: match[3].trim() };
}

function canonicalRelationId(sourcePointId, sourceType, targetPointId) {
  return `relation:${sourcePointId}:${canonicalRelationTypes[sourceType] || sourceType}:${targetPointId}`;
}

function derivedRelationReason(type, pointTitle, targetTitle) {
  if (type === "prerequisites") return `“${targetTitle}”是进入“${pointTitle}”的已确认前置。`;
  if (type === "contrasts") return `“${pointTitle}”与“${targetTitle}”已标记为易混知识，建议对照辨析。`;
  return `“${pointTitle}”与“${targetTitle}”已确认关联，可结合阅读。`;
}

function blockSemantic(block, namespace) {
  if (namespace === "confusion") return "boundary";
  if (block.type === "heading") return "section";
  if (block.type === "list") return block.ordered ? "sequence" : "hierarchy";
  return "explanation";
}

function blockText(block) {
  if (block.text) return block.text;
  return (block.items || []).join("\n");
}

function normalizeSearchText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function withBlockMetadata(blocks, namespace) {
  const occurrences = new Map();
  return blocks.map((block) => {
    const digest = crypto
      .createHash("sha1")
      .update(`${block.type}\n${blockText(block)}`)
      .digest("hex")
      .slice(0, 8);
    const key = `${block.type}-${digest}`;
    const occurrence = (occurrences.get(key) || 0) + 1;
    occurrences.set(key, occurrence);
    return {
      id: `${namespace}-${key}${occurrence > 1 ? `-${occurrence}` : ""}`,
      semantic: blockSemantic(block, namespace),
      ...block,
    };
  });
}

function markdownBlocks(markdown, namespace = "content") {
  const blocks = [];
  const lines = markdown.split("\n");
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push(list);
    list = null;
  };

  for (const line of lines) {
    const heading = line.match(/^###\s+(.+)$/);
    const listItem = line.match(/^(-|\d+\.)\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading[1] });
    } else if (listItem) {
      flushParagraph();
      const ordered = listItem[1] !== "-";
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { type: "list", ordered, items: [] };
      }
      list.items.push(listItem[2]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return withBlockMetadata(blocks, namespace);
}

function tableCells(line) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function isTableSeparator(line) {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function readingPartValue(block, part) {
  if (part === "text") return typeof block.text === "string" ? block.text : null;
  const item = String(part || "").match(/^items\/(\d+)$/);
  if (item) return Array.isArray(block.items) ? block.items[Number(item[1])] ?? null : null;
  const cell = String(part || "").match(/^rows\/(\d+)\/(\d+)$/);
  if (cell) return Array.isArray(block.rows?.[Number(cell[1])])
    ? block.rows[Number(cell[1])][Number(cell[2])] ?? null
    : null;
  return null;
}

function locateReadingSelector(block, selector, context) {
  if (!selector || typeof selector !== "object" || Array.isArray(selector)) {
    throw new Error(`${context}: 片段选择器必须为对象`);
  }
  const value = readingPartValue(block, selector.part);
  if (typeof value !== "string") throw new Error(`${context}: part ${selector.part} 不存在`);
  if (typeof selector.quote !== "string" || !selector.quote.length) throw new Error(`${context}: quote 不能为空`);
  if (!Number.isInteger(selector.occurrence) || selector.occurrence < 1) {
    throw new Error(`${context}: occurrence 必须为正整数`);
  }
  let start = -1;
  let cursor = 0;
  for (let count = 0; count < selector.occurrence; count += 1) {
    start = value.indexOf(selector.quote, cursor);
    if (start < 0) throw new Error(`${context}: 无法精确定位第 ${selector.occurrence} 处“${selector.quote}”`);
    cursor = start + selector.quote.length;
  }
  return { part: selector.part, start, end: start + selector.quote.length };
}

function validateReadingAnnotation(block, reading, context) {
  if (!reading || typeof reading !== "object" || Array.isArray(reading)) {
    throw new Error(`${context}: kp:reading 必须为 JSON 对象`);
  }
  for (const key of Object.keys(reading)) {
    if (!readingAnnotationKeys.has(key)) throw new Error(`${context}: 未知阅读标注字段 ${key}`);
  }
  const ranges = [];
  if (reading.heading !== undefined) {
    if (!reading.heading || typeof reading.heading !== "object" || Array.isArray(reading.heading)) {
      throw new Error(`${context}: heading 必须为对象`);
    }
    if (!Number.isInteger(reading.heading.level) || reading.heading.level < 1 || reading.heading.level > 3) {
      throw new Error(`${context}: heading.level 只允许 1 至 3`);
    }
    ranges.push({ ...locateReadingSelector(block, reading.heading, `${context}/heading`), role: "heading" });
  }
  if (reading.emphasis !== undefined && !Array.isArray(reading.emphasis)) {
    throw new Error(`${context}: emphasis 必须为数组`);
  }
  for (const [index, emphasis] of (reading.emphasis || []).entries()) {
    if (!readingEmphasisRoles.has(emphasis?.role)) {
      throw new Error(`${context}/emphasis/${index}: role 只允许 key 或 boundary`);
    }
    ranges.push({
      ...locateReadingSelector(block, emphasis, `${context}/emphasis/${index}`),
      role: emphasis.role,
    });
  }
  const byPart = new Map();
  for (const range of ranges) {
    const partRanges = byPart.get(range.part) || [];
    if (partRanges.some((item) => range.start < item.end && item.start < range.end)) {
      throw new Error(`${context}: ${range.part} 的阅读片段发生重叠`);
    }
    partRanges.push(range);
    byPart.set(range.part, partRanges);
  }
  if (reading.flow !== undefined) {
    const flow = reading.flow;
    if (!flow || flow.kind !== "list" || !Array.isArray(flow.starts) || !flow.starts.length) {
      throw new Error(`${context}: flow 必须包含 list 和非空 starts`);
    }
    if (flow.columns !== undefined && ![1, 2].includes(flow.columns)) throw new Error(`${context}: flow.columns 只允许 1 或 2`);
    let previous = -1;
    for (const selector of flow.starts) {
      if (selector.part !== "text") throw new Error(`${context}: flow 只支持 text`);
      const range = locateReadingSelector(block, selector, `${context}/flow`);
      if (range.start <= previous) throw new Error(`${context}: flow 起点必须按原文顺序且不能重复`);
      if (ranges.some((item) => item.part === "text" && item.start < range.start && range.start < item.end)) {
        throw new Error(`${context}: flow 不能切开标题或强调片段`);
      }
      previous = range.start;
    }
  }
  if (reading.relationPlacements !== undefined && !Array.isArray(reading.relationPlacements)) {
    throw new Error(`${context}: relationPlacements 必须为数组`);
  }
  for (const [index, placement] of (reading.relationPlacements || []).entries()) {
    if (!placement || typeof placement.relationId !== "string" || !placement.relationId) {
      throw new Error(`${context}/relationPlacements/${index}: relationId 不能为空`);
    }
    if (!readingRelationRoles.has(placement.readingRole)) {
      throw new Error(`${context}/relationPlacements/${index}: readingRole 不合法`);
    }
    if (!readingRelationPlacements.has(placement.placement)) {
      throw new Error(`${context}/relationPlacements/${index}: placement 不合法`);
    }
    if (placement.readingRole === "localBoundary" && placement.placement !== "section-end") {
      throw new Error(`${context}/relationPlacements/${index}: localBoundary 必须放在 section-end`);
    }
  }
  if (reading.comparison !== undefined) {
    const comparison = reading.comparison;
    if (!comparison || typeof comparison !== "object" || Array.isArray(comparison) || !comparison.groupId) {
      throw new Error(`${context}: comparison 必须包含稳定 groupId`);
    }
    if (!Array.isArray(comparison.rows) || !comparison.rows.length) {
      throw new Error(`${context}: comparison.rows 不能为空`);
    }
    for (const [rowIndex, row] of comparison.rows.entries()) {
      if (!row?.dimension || !Array.isArray(row.cells) || row.cells.length !== 2) {
        throw new Error(`${context}/comparison/rows/${rowIndex}: 每行必须包含 dimension 和两个单元`);
      }
      for (const [cellIndex, cell] of row.cells.entries()) {
        if (!cell?.roleLabel || !cell.blockId) {
          throw new Error(`${context}/comparison/rows/${rowIndex}/cells/${cellIndex}: 缺少 roleLabel 或 blockId`);
        }
      }
    }
  }
}

function validateReadingReferences(point) {
  const errors = [];
  const blocks = [...point.contentBlocks, ...point.confusionBlocks];
  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  let previousLevel = 0;
  for (const owner of blocks) {
    const level = owner.reading?.heading?.level || (owner.type === "heading" ? 1 : null);
    if (level) {
      if (level > previousLevel + 1) errors.push(`${owner.id}: 章节层级不能跳级或缺少父节`);
      previousLevel = level;
    }
    const comparison = owner.reading?.comparison;
    if (!comparison) continue;
    for (const [rowIndex, row] of comparison.rows.entries()) {
      for (const [cellIndex, cell] of row.cells.entries()) {
        const target = blocksById.get(cell.blockId);
        if (!target) {
          errors.push(`${owner.id}/comparison/rows/${rowIndex}/cells/${cellIndex}: 块 ${cell.blockId} 不存在`);
          continue;
        }
        try {
          locateReadingSelector(target, cell, `${owner.id}/comparison/rows/${rowIndex}/cells/${cellIndex}`);
        } catch (error) {
          errors.push(error.message);
        }
      }
    }
  }
  return errors;
}

function strictMarkdownBlocks(markdown, namespace = "content", usedIds = new Set()) {
  const blocks = [];
  const diagnostics = [];
  const lines = String(markdown || "").split("\n");
  let pendingId = null;
  let pendingReading = null;

  const addBlock = (block, lineNumber) => {
    if (!pendingId) throw new Error(`${namespace}:${lineNumber}: card_schema 1 内容块缺少 kp:block-id`);
    if (!sourceBlockIdPattern.test(pendingId)) {
      throw new Error(`${namespace}:${lineNumber}: 非法 kp:block-id ${pendingId}`);
    }
    if (usedIds.has(pendingId)) throw new Error(`${namespace}:${lineNumber}: kp:block-id ${pendingId} 重复`);
    usedIds.add(pendingId);
    const next = { id: pendingId, semantic: "plain", ...block };
    if (pendingReading) {
      validateReadingAnnotation(next, pendingReading, `${namespace}:${lineNumber}:${pendingId}`);
      next.reading = pendingReading;
    }
    blocks.push(next);
    pendingId = null;
    pendingReading = null;
  };

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const anchor = line.match(/^<!--\s*kp:block-id=([^\s]+)\s*-->$/);
    if (anchor) {
      if (pendingId) throw new Error(`${namespace}:${index + 1}: kp:block-id ${pendingId} 后没有内容块`);
      pendingId = anchor[1];
      pendingReading = null;
      index += 1;
      continue;
    }

    const reading = line.match(/^<!--\s*kp:reading=(\{.*\})\s*-->$/);
    if (reading) {
      if (!pendingId) throw new Error(`${namespace}:${index + 1}: kp:reading 前缺少 kp:block-id`);
      if (pendingReading) throw new Error(`${namespace}:${index + 1}: kp:block-id ${pendingId} 的 kp:reading 重复`);
      try {
        pendingReading = JSON.parse(reading[1]);
      } catch (error) {
        throw new Error(`${namespace}:${index + 1}: kp:reading 不是合法 JSON`);
      }
      index += 1;
      continue;
    }

    const callout = line.match(/^>\s*\[!([a-z]+)\](?:\s+(.+))?$/);
    if (callout) {
      const body = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const quoted = lines[cursor].match(/^>\s?(.*)$/);
        if (!quoted) break;
        body.push(quoted[1]);
        cursor += 1;
      }
      const semantic = cardSemantics.has(callout[1]) ? callout[1] : "plain";
      if (semantic === "plain") diagnostics.push({
        code: "UNKNOWN_CARD_SEMANTIC",
        semantic: callout[1],
        line: index + 1,
      });
      addBlock({
        type: "callout",
        semantic,
        calloutType: callout[1],
        title: callout[2] || null,
        text: [callout[2], ...body].filter(Boolean).join("\n"),
      }, index + 1);
      index = cursor;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      addBlock({ type: "heading", level: heading[1].length, text: heading[2] }, index + 1);
      index += 1;
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const columns = tableCells(line);
      const rows = [];
      let cursor = index + 2;
      while (cursor < lines.length && lines[cursor].includes("|") && lines[cursor].trim()) {
        rows.push(tableCells(lines[cursor]));
        cursor += 1;
      }
      addBlock({ type: "table", columns, rows }, index + 1);
      index = cursor;
      continue;
    }

    const media = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (media) {
      addBlock({ type: "media", alt: media[1], url: media[2], text: line }, index + 1);
      index += 1;
      continue;
    }

    const listItem = line.match(/^\s*(-|\d+\.)\s+(.+)$/);
    if (listItem) {
      const ordered = listItem[1] !== "-";
      const items = [];
      let cursor = index;
      while (cursor < lines.length) {
        const item = lines[cursor].match(/^\s*(-|\d+\.)\s+(.+)$/);
        if (!item || (item[1] !== "-") !== ordered) break;
        items.push(item[2]);
        cursor += 1;
      }
      addBlock({ type: "list", ordered, items }, index + 1);
      index = cursor;
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      const quoted = [];
      let cursor = index;
      while (cursor < lines.length) {
        const item = lines[cursor].match(/^>\s?(.*)$/);
        if (!item) break;
        quoted.push(item[1]);
        cursor += 1;
      }
      addBlock({ type: "quote", text: quoted.join("\n") }, index + 1);
      index = cursor;
      continue;
    }

    const paragraph = [];
    let cursor = index;
    while (cursor < lines.length && lines[cursor].trim()) {
      const candidate = lines[cursor];
      if (cursor > index && (
        /^<!--\s*kp:(?:block-id|reading)=/.test(candidate) ||
        /^(#{1,6})\s+/.test(candidate) ||
        /^>/.test(candidate) ||
        /^\s*(-|\d+\.)\s+/.test(candidate) ||
        /^!\[[^\]]*\]\([^)]+\)$/.test(candidate) ||
        (candidate.includes("|") && cursor + 1 < lines.length && isTableSeparator(lines[cursor + 1]))
      )) break;
      paragraph.push(candidate);
      cursor += 1;
    }
    addBlock({ type: "paragraph", text: paragraph.join("\n") }, index + 1);
    index = cursor;
  }

  if (pendingId) throw new Error(`${namespace}: kp:block-id ${pendingId} 后没有内容块`);
  return { blocks, diagnostics };
}

function validateCardReferences(properties, blocks) {
  const errors = [];
  const ids = new Set(blocks.map((block) => block.id));
  const references = [
    ["summary_block_id", properties.summary_block_id ? [properties.summary_block_id] : []],
    ["recall_answer_block_ids", properties.recall_answer_block_ids || []],
    ["recall_pitfall_block_ids", properties.recall_pitfall_block_ids || []],
  ];
  for (const [field, values] of references) {
    if (!Array.isArray(values)) {
      errors.push(`${field} 必须为列表`);
      continue;
    }
    for (const id of values) if (!ids.has(id)) errors.push(`${field} 引用了不存在的块 ${id}`);
  }
  return errors;
}

function validateBlockIdMigrations(migrations, validTargetIds) {
  const errors = [];
  const claimedSources = new Set();
  for (const migration of migrations) {
    const from = migration.fromBlockIds || [];
    const to = migration.toBlockIds || [];
    if (!new Set(["rename", "split", "merge", "removed"]).has(migration.disposition)) {
      errors.push("migration disposition invalid");
    }
    if (!from.length || !migration.reason) errors.push("migration source and reason required");
    for (const id of from) {
      if (claimedSources.has(id)) errors.push(`migration source duplicated: ${id}`);
      claimedSources.add(id);
    }
    for (const id of to) if (!validTargetIds.has(id)) errors.push(`migration target missing: ${id}`);
    if (migration.disposition === "rename" && (from.length !== 1 || to.length !== 1)) {
      errors.push("rename migration must be one-to-one");
    }
    if (migration.disposition === "removed" && (to.length || migration.primaryTargetId)) {
      errors.push("removed migration cannot have a target");
    }
    if (new Set(["split", "merge"]).has(migration.disposition) && !to.includes(migration.primaryTargetId)) {
      errors.push("split/merge migration primary target missing");
    }
  }
  return errors;
}

function buildKnowledgeMap(points, categories) {
  const pointsById = new Map(points.map((point) => [point.id, point]));
  const depthById = new Map();

  function getDepth(id, visiting = new Set()) {
    if (depthById.has(id)) return depthById.get(id);
    if (visiting.has(id)) throw new Error(`前置关系存在循环：${[...visiting, id].join(" → ")}`);
    const point = pointsById.get(id);
    if (!point) return 0;
    const nextVisiting = new Set(visiting).add(id);
    const depth = point.relations.prerequisites.length
      ? 1 + Math.max(...point.relations.prerequisites.map((item) => getDepth(item, nextVisiting)))
      : 0;
    depthById.set(id, depth);
    return depth;
  }

  return categories.map((category) => {
    const layers = new Map();
    for (const id of category.pointIds) {
      const depth = getDepth(id);
      if (!layers.has(depth)) layers.set(depth, []);
      layers.get(depth).push(id);
    }
    return {
      title: category.title,
      layers: [...layers]
        .sort(([left], [right]) => left - right)
        .map(([depth, pointIds]) => ({ depth, pointIds })),
    };
  });
}

function buildDirectory(points) {
  const structure = JSON.parse(fs.readFileSync(tocStructurePath, "utf8"));
  const pointByTocNodeId = new Map(points.map((point) => [point.tocNodeId, point]));
  const nodes = structure.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    title: node.title,
    label: node.label,
    parentId: node.parent_id,
    order: node.order,
    depth: node.depth,
    pathTitles: node.path_titles,
    pointId: pointByTocNodeId.get(node.id)?.id || "",
    childrenIds: [],
    pointCount: 0,
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  for (const node of nodes) {
    if (node.parentId && byId.has(node.parentId)) byId.get(node.parentId).childrenIds.push(node.id);
  }
  function countPoints(node) {
    node.pointCount = (node.pointId ? 1 : 0) + node.childrenIds
      .map((id) => countPoints(byId.get(id)))
      .reduce((total, count) => total + count, 0);
    return node.pointCount;
  }
  const rootIds = nodes.filter((node) => !node.parentId).map((node) => node.id);
  for (const rootId of rootIds) countPoints(byId.get(rootId));
  return {
    source: path.relative(repo, tocStructurePath),
    sourceHash: structure.source_pdf_hash,
    rootIds,
    nodes,
  };
}

function validateAndBuild() {
  const errors = [];
  const relationAuditByKey = new Map();
  if (isTocV2 && fs.existsSync(relationAuditPath)) {
    const audit = JSON.parse(fs.readFileSync(relationAuditPath, "utf8"));
    for (const relation of audit.relations || []) {
      relationAuditByKey.set(`${relation.source_id}|${relation.type}|${relation.target_id}`, relation);
    }
  }
  const files = fs
    .readdirSync(inputDir)
    .filter((name) => name.endsWith(".md"))
    .sort();
  const notes = [];

  for (const fileName of files) {
    const source = fs.readFileSync(path.join(inputDir, fileName), "utf8");
    try {
      const parsed = parseFrontmatter(source, fileName);
      notes.push({
        fileName,
        fileStem: path.basename(fileName, ".md"),
        source,
        ...parsed,
      });
    } catch (error) {
      errors.push(error.message);
    }
  }

  const ids = new Set();
  const references = new Map();
  for (const note of notes) {
    const { properties } = note;
    if (properties.id) {
      if (ids.has(properties.id)) errors.push(`${note.fileName}: id ${properties.id} 重复`);
      ids.add(properties.id);
    }
    references.set(note.fileStem, note);
    if (properties.title) references.set(properties.title, note);
  }

  for (const note of notes) {
    const { body, fileName, properties } = note;
    for (const key of requiredProperties) {
      if (
        !Object.hasOwn(properties, key) ||
        properties[key] === "" ||
        (Array.isArray(properties[key]) && properties[key].length === 0)
      ) {
        errors.push(`${fileName}: 缺少必填属性 ${key}`);
      }
    }
    if (isTocV2) {
      for (const key of ["toc_node_id", "node_type", "parent_id", "toc_order", "hierarchy_ids", "hierarchy_titles"]) {
        if (!Object.hasOwn(properties, key) || properties[key] === "" || (Array.isArray(properties[key]) && !properties[key].length)) {
          errors.push(`${fileName}: V2 目录知识缺少 ${key}`);
        }
      }
      if (!new Set(["section", "knowledge_point"]).has(properties.node_type)) {
        errors.push(`${fileName}: node_type 必须为 section 或 knowledge_point`);
      }
      if (!Number.isInteger(properties.toc_order) || properties.toc_order < 1) {
        errors.push(`${fileName}: toc_order 必须为正整数`);
      }
      if (
        Array.isArray(properties.hierarchy_ids) &&
        Array.isArray(properties.hierarchy_titles) &&
        properties.hierarchy_ids.length !== properties.hierarchy_titles.length
      ) {
        errors.push(`${fileName}: hierarchy_ids 与 hierarchy_titles 长度不一致`);
      }
      if (properties.hierarchy_ids?.at(-1) !== properties.toc_node_id) {
        errors.push(`${fileName}: hierarchy_ids 末项必须等于 toc_node_id`);
      }
    }
    if (properties.module !== "politics") errors.push(`${fileName}: module 必须为 politics`);
    if (!allowedStatuses.has(properties.status)) errors.push(`${fileName}: status 不合法`);
    if (!Number.isInteger(properties.version) || properties.version < 1) {
      errors.push(`${fileName}: version 必须为正整数`);
    }
    if (Object.hasOwn(properties, "reading_schema") && properties.reading_schema !== 1) {
      errors.push(`${fileName}: reading_schema 只允许 1`);
    }
    if (properties.reading_schema === 1 && !new Set(["candidate", "reviewed"]).has(properties.reading_review_state)) {
      errors.push(`${fileName}: reading_review_state 必须为 candidate 或 reviewed`);
    }
    if (!/^[a-f0-9]{12,64}$/.test(properties.source_hash || "")) {
      errors.push(`${fileName}: source_hash 格式不合法`);
    }

    const h1 = body.match(/^#\s+(.+)$/m);
    if (!h1 || h1[1].trim() !== properties.title) {
      errors.push(`${fileName}: 一级标题必须与 title 一致`);
    }
    for (const heading of requiredSections) {
      const occurrences = body.match(new RegExp(`^## ${heading}$`, "gm")) || [];
      if (occurrences.length !== 1) errors.push(`${fileName}: 必须且只能有一个“## ${heading}”`);
    }

    if (Object.hasOwn(properties, "card_schema")) {
      if (properties.card_schema !== 1) {
        errors.push(`${fileName}: card_schema 只允许 1`);
      } else {
        try {
          const usedIds = new Set();
          const content = strictMarkdownBlocks(getSection(body, "完整内容"), "content", usedIds);
          const confusion = strictMarkdownBlocks(getSection(body, "易混与边界"), "confusion", usedIds);
          note.cardBuild = {
            contentBlocks: content.blocks,
            confusionBlocks: confusion.blocks,
            diagnostics: [...content.diagnostics, ...confusion.diagnostics],
          };
          const hasReadingAnnotations = [...content.blocks, ...confusion.blocks].some((block) => block.reading);
          if (hasReadingAnnotations && properties.reading_schema !== 1) {
            errors.push(`${fileName}: 使用 kp:reading 时必须声明 reading_schema: 1`);
          }
          for (const error of validateCardReferences(properties, [...content.blocks, ...confusion.blocks])) {
            errors.push(`${fileName}: ${error}`);
          }
        } catch (error) {
          errors.push(`${fileName}: ${error.message}`);
        }
      }
    }

    if (["approved", "published"].includes(properties.status)) {
      for (const placeholder of forbiddenPlaceholders) {
        if (body.includes(placeholder)) errors.push(`${fileName}: 已批准内容仍含占位文字“${placeholder}”`);
      }
    }

    const relationTargets = new Set();
    for (const relation of relationProperties) {
      if (!Array.isArray(properties[relation])) {
        errors.push(`${fileName}: ${relation} 必须为列表`);
        continue;
      }
      for (const value of properties[relation]) {
        const target = linkTarget(value);
        if (!target) errors.push(`${fileName}: ${relation} 包含非法链接 ${value}`);
        else if (!references.has(target)) errors.push(`${fileName}: ${relation} 无法解析 ${value}`);
        else relationTargets.add(`${relation}|${references.get(target).properties.id}`);
      }
    }

    const relationReasons = properties.relation_reasons || [];
    if (!Array.isArray(relationReasons)) {
      errors.push(`${fileName}: relation_reasons 必须为列表`);
    } else {
      const reasonKeys = new Set();
      for (const value of relationReasons) {
        const reason = parseRelationReason(value);
        if (!reason) {
          errors.push(`${fileName}: relation_reasons 格式必须为“关系类型|目标 ID|说明”`);
          continue;
        }
        const key = `${reason.type}|${reason.targetId}`;
        if (reasonKeys.has(key)) errors.push(`${fileName}: 关系说明 ${key} 重复`);
        reasonKeys.add(key);
        if (!ids.has(reason.targetId)) errors.push(`${fileName}: 关系说明目标 ${reason.targetId} 不存在`);
        if (!relationTargets.has(key)) errors.push(`${fileName}: 关系说明 ${key} 没有对应正式关系`);
      }
    }

    const card = getSection(body, "速记卡");
    for (const heading of ["提示", "答案", "易错"]) {
      if (!card || !getSubsection(card, heading)) errors.push(`${fileName}: 速记卡缺少“### ${heading}”`);
    }
  }

  const buildNotes = notes
    .filter((note) => includedStatuses.has(note.properties.status))
    .sort((left, right) => isTocV2
      ? left.properties.toc_order - right.properties.toc_order
      : left.fileName.localeCompare(right.fileName));
  const buildIds = new Set(buildNotes.map((note) => note.properties.id));
  for (const note of buildNotes) {
    for (const relation of relationProperties) {
      for (const value of note.properties[relation] || []) {
        const target = references.get(linkTarget(value));
        if (target && !buildIds.has(target.properties.id)) {
          errors.push(`${note.fileName}: ${relation} 指向未进入 ${buildScope} 构建的 ${target.properties.id}`);
        }
      }
    }
  }

  if (errors.length) return { errors, packageData: null, notes, buildNotes };

  const relationIds = (values) => values.map((value) => references.get(linkTarget(value)).properties.id);
  const titleById = new Map(buildNotes.map((note) => [note.properties.id, note.properties.title]));
  const points = buildNotes.map((note) => {
    const { body, fileName, properties } = note;
    const card = getSection(body, "速记卡");
    const contentBlocks = note.cardBuild?.contentBlocks || markdownBlocks(getSection(body, "完整内容"), "content");
    const confusionBlocks = note.cardBuild?.confusionBlocks || markdownBlocks(getSection(body, "易混与边界"), "confusion");
    const reasonByKey = new Map(
      (properties.relation_reasons || []).map((value) => {
        const reason = parseRelationReason(value);
        return [`${reason.type}|${reason.targetId}`, reason.why];
      }),
    );
    const relations = {
      prerequisites: relationIds(properties.prerequisites || []),
      contrasts: relationIds(properties.contrasts || []),
      related: relationIds(properties.related || []),
    };
    const relationItems = relationProperties.flatMap((type) =>
      relations[type].map((targetId) => {
        const audit = relationAuditByKey.get(`${properties.id}|${type}|${targetId}`);
        return {
          type,
          targetId,
          why:
            reasonByKey.get(`${type}|${targetId}`) ||
            derivedRelationReason(type, properties.title, titleById.get(targetId)),
          whySource: reasonByKey.has(`${type}|${targetId}`) ? "authored" : "derived",
          sourceBlockIds: audit?.source_block_ids || [],
          targetBlockIds: audit?.target_block_ids || [],
          dimensions: audit?.dimensions || [],
          boundaries: audit?.boundaries || [],
          recallItemIds: audit?.recall_item_ids || [],
        };
      }),
    );
    const relationItemsById = new Map(relationItems.map((item) => [
      canonicalRelationId(properties.id, item.type, item.targetId),
      item,
    ]));
    for (const block of [...contentBlocks, ...confusionBlocks]) {
      for (const placement of block.reading?.relationPlacements || []) {
        const item = relationItemsById.get(placement.relationId);
        if (!item) {
          errors.push(`${fileName}/${block.id}: relationPlacements 引用了不属于本篇的关系 ${placement.relationId}`);
          continue;
        }
        if (item.readingRole && (item.readingRole !== placement.readingRole || item.placement !== placement.placement)) {
          errors.push(`${fileName}: 关系 ${placement.relationId} 的阅读位置重复且不一致`);
          continue;
        }
        item.readingRole = placement.readingRole;
        item.placement = placement.placement;
        item.placementBlockId = block.id;
      }
    }
    const pointForReadingValidation = { contentBlocks, confusionBlocks };
    for (const error of validateReadingReferences(pointForReadingValidation)) {
      errors.push(`${fileName}: ${error}`);
    }
    return {
      id: properties.id,
      title: properties.title,
      category: properties.category,
      tocNodeId: properties.toc_node_id || "",
      nodeType: properties.node_type || "knowledge_point",
      parentId: properties.parent_id || "",
      tocOrder: properties.toc_order || 0,
      hierarchyIds: properties.hierarchy_ids || [],
      hierarchyTitles: properties.hierarchy_titles || [properties.category, properties.title],
      status: properties.status,
      version: properties.version,
      aliases: properties.aliases || [],
      tags: properties.tags || [],
      sourceUnits: properties.source_units,
      sourcePages: properties.source_pages || [],
      sourceHash: properties.source_hash,
      reviewedAt: properties.reviewed_at || "",
      reviewState: properties.review_state || "",
      relationState: properties.relation_state || "",
      riskPages: properties.risk_pages || [],
      riskFlags: properties.risk_flags || [],
      publishable: ["approved", "published"].includes(properties.status),
      cardSchema: properties.card_schema || null,
      readingSchema: properties.reading_schema || null,
      summary: getSection(body, "一句话理解"),
      summaryBlockId: properties.summary_block_id || null,
      content: getSection(body, "完整内容"),
      contentBlocks,
      outline: contentBlocks
        .filter((block) => block.type === "heading")
        .map((block) => ({ id: block.id, title: block.text })),
      confusion: getSection(body, "易混与边界"),
      confusionBlocks,
      card: {
        prompt: getSubsection(card, "提示"),
        answer: getSubsection(card, "答案"),
        pitfall: getSubsection(card, "易错"),
        answerBlockIds: properties.recall_answer_block_ids || [],
        pitfallBlockIds: properties.recall_pitfall_block_ids || [],
      },
      cardDiagnostics: note.cardBuild?.diagnostics || [],
      relations,
      relationItems,
      reverseRelations: [],
      sourceFile: fileName,
    };
  });
  const pointsById = new Map(points.map((point) => [point.id, point]));
  const blockIdsByPointId = new Map(points.map((point) => [
    point.id,
    new Set([...point.contentBlocks, ...point.confusionBlocks].map((block) => block.id)),
  ]));
  for (const point of points) {
    if (!isTocV2 || point.cardSchema !== 1) continue;
    for (const relation of point.relationItems) {
      const targetIds = blockIdsByPointId.get(relation.targetId);
      if (!relation.sourceBlockIds.length || !relation.targetBlockIds.length) {
        errors.push(`${point.id}/${relation.type}/${relation.targetId}: 正式关系缺少块锚点`);
      }
      for (const id of relation.sourceBlockIds) {
        if (!blockIdsByPointId.get(point.id).has(id)) errors.push(`${point.id}: 关系源块不存在 ${id}`);
      }
      for (const id of relation.targetBlockIds) {
        if (!targetIds?.has(id)) errors.push(`${point.id}: 关系目标块不存在 ${relation.targetId}/${id}`);
      }
      if (relation.type === "contrasts" && (!relation.dimensions.length || !relation.boundaries.length)) {
        errors.push(`${point.id}/${relation.targetId}: contrast缺少维度或边界`);
      }
      for (const id of relation.recallItemIds) {
        if (!/^recall:politics-toc-v2-u\d{3}:qa$/.test(id)) errors.push(`${point.id}: 对照回忆引用非法 ${id}`);
      }
    }
  }
  if (errors.length) return { errors, packageData: null, notes, buildNotes };
  for (const point of points) {
    for (const relation of point.relationItems) {
      pointsById.get(relation.targetId).reverseRelations.push({
        type: reverseRelationTypes[relation.type],
        sourceType: relation.type,
        targetId: point.id,
        why: relation.why,
      });
    }
  }
  const categories = [...new Set(points.map((point) => point.category))].map((title, index) => ({
    id: `category-${index + 1}`,
    title,
    pointIds: points.filter((point) => point.category === title).map((point) => point.id),
  }));
  let knowledgeMap;
  try {
    knowledgeMap = buildKnowledgeMap(points, categories);
  } catch (error) {
    return { errors: [error.message], packageData: null, notes };
  }
  const depthById = new Map();
  for (const category of knowledgeMap) {
    for (const layer of category.layers) {
      for (const pointId of layer.pointIds) depthById.set(pointId, layer.depth);
    }
  }
  for (const point of points) point.mapDepth = depthById.get(point.id) || 0;
  let idMigrations = [];
  if (isTocV2 && fs.existsSync(blockMigrationPath)) {
    try {
      const ledger = JSON.parse(fs.readFileSync(blockMigrationPath, "utf8"));
      if (ledger.module_id !== "politics" || ledger.migration_count !== ledger.migrations?.length) {
        throw new Error("块ID迁移账本元数据不一致");
      }
      idMigrations = ledger.migrations;
      const migrationsByPointId = new Map(points.map((point) => [point.id, []]));
      for (const migration of idMigrations) {
        if (!migrationsByPointId.has(migration.pointId)) throw new Error(`迁移知识不存在：${migration.pointId}`);
        migrationsByPointId.get(migration.pointId).push(migration);
      }
      for (const point of points) {
        const targetIds = new Set([...point.contentBlocks, ...point.confusionBlocks].map((block) => block.id));
        const migrationErrors = validateBlockIdMigrations(migrationsByPointId.get(point.id), targetIds);
        if (migrationErrors.length) throw new Error(`${point.id}: ${migrationErrors.join("；")}`);
      }
    } catch (error) {
      return { errors: [`块ID迁移账本失败：${error.message}`], packageData: null, notes, buildNotes };
    }
  }
  const searchIndex = points.map((point) => ({
    id: point.id,
    title: point.title,
    category: point.category,
    aliases: point.aliases,
    tags: point.tags,
    summary: point.summary,
    indexText: normalizeSearchText([
      point.title,
      point.category,
      ...point.aliases,
      ...point.tags,
      point.summary,
      point.content,
      point.confusion,
      point.card.prompt,
      point.card.answer,
      point.card.pitfall,
    ].join(" ")),
  }));
  const statusCounts = Object.fromEntries(
    [...allowedStatuses].map((status) => [
      status,
      notes.filter((note) => note.properties.status === status).length,
    ]),
  );
  let directory = null;
  if (isTocV2) {
    try {
      directory = buildDirectory(points);
      const mappedPointIds = new Set(directory.nodes.map((node) => node.pointId).filter(Boolean));
      if (mappedPointIds.size !== points.length) {
        return { errors: [`V2 目录只映射 ${mappedPointIds.size}/${points.length} 个知识单元`], packageData: null, notes };
      }
    } catch (error) {
      return { errors: [`V2 目录构建失败：${error.message}`], packageData: null, notes };
    }
  }

  let primerArtifact;
  try {
    primerArtifact = loadQuickPrimerArtifact(points, directory);
  } catch (error) {
    return { errors: [`J2 v2导读制品失败：${error.message}`], packageData: null, notes, buildNotes };
  }
  const contentHash = crypto
    .createHash("sha256")
    .update(buildNotes.map((note) => `${note.fileName}\n${note.source}`).join("\n"))
    .update(primerArtifact.source)
    .digest("hex");
  const packageVersion = `${isReviewBuild ? "review" : isTocV2 ? "runtime" : "preview"}-${contentHash.slice(0, 12)}`;
  const quickPrimers = primerArtifact.quickPrimers.map((primer) => ({ ...primer, sourcePackageVersion: packageVersion }));
  const contentCoverage = primerArtifact.contentCoverage
    ? { ...primerArtifact.contentCoverage, packageVersion }
    : null;

  return {
    errors,
    notes,
    buildNotes,
    packageData: {
      schemaVersion: isTocV2 ? 3 : 2,
      packageType: isReviewBuild ? "review-preview" : isTocV2 ? "runtime" : "preview",
      packageVersion,
      buildScope,
      statusCounts,
      module: {
        id: "politics",
        title: "政治理论",
        keywords: "习近平新时代中国特色社会主义思想 马克思主义基本原理",
        description: isReviewBuild
          ? `${isTocV2 ? "目录优先第二轮" : "全量"}结构化校对包；包含待最终校对内容，不得作为发布包。`
          : "使用已审核的正式知识，构建政治目录与知识详情。",
        pointCount: points.length,
        status: isReviewBuild ? "review" : "ready",
        statusText: isReviewBuild ? "待校对" : isTocV2 ? "可学习" : "试验中",
        routeDefaults: POLITICS_ROUTE_DEFAULTS,
      },
      categories,
      directory,
      knowledgeMap,
      navigationOrder: points.map((point) => point.id),
      searchIndex,
      idMigrations,
      quickPrimers,
      contentCoverage,
      points,
    },
  };
}

function selfTest() {
  const sample = [
    "---",
    "id: example",
    "version: 1",
    "related:",
    '  - "[[Other|其他]]"',
    "tags: []",
    "---",
    "# Example",
  ].join("\n");
  const parsed = parseFrontmatter(sample, "example.md");
  assert.deepStrictEqual(parsed.properties.related, ["[[Other|其他]]"]);
  assert.strictEqual(parsed.properties.version, 1);
  assert.strictEqual(linkTarget("[[Other|其他]]"), "Other");
  const blocks = markdownBlocks("### 标题\n\n1. 第一项\n2. 第二项\n\n正文");
  assert.deepStrictEqual(blocks.map(({ type, semantic }) => ({ type, semantic })), [
    { type: "heading", semantic: "section" },
    { type: "list", semantic: "sequence" },
    { type: "paragraph", semantic: "explanation" },
  ]);
  assert.ok(blocks.every((block) => /^content-/.test(block.id)));
  const strictFixture = [
    "<!-- kp:block-id=b001 -->",
    "### 标题",
    "",
    "<!-- kp:block-id=b002 -->",
    "普通段落。",
    "",
    "<!-- kp:block-id=b003 -->",
    "1. 第一项",
    "2. 第二项",
    "",
    "<!-- kp:block-id=b004 -->",
    "| 名称 | 内容 |",
    "| --- | --- |",
    "| A | B |",
    "",
    "<!-- kp:block-id=b005 -->",
    "> 普通引用",
    "",
    "<!-- kp:block-id=b006 -->",
    "![示意图](figure.png)",
    "",
    "<!-- kp:block-id=b007 -->",
    "> [!definition] 概念",
    "> 定义正文。",
  ].join("\n");
  const strict = strictMarkdownBlocks(strictFixture);
  assert.deepStrictEqual(strict.blocks.map(({ id, type, semantic }) => ({ id, type, semantic })), [
    { id: "b001", type: "heading", semantic: "plain" },
    { id: "b002", type: "paragraph", semantic: "plain" },
    { id: "b003", type: "list", semantic: "plain" },
    { id: "b004", type: "table", semantic: "plain" },
    { id: "b005", type: "quote", semantic: "plain" },
    { id: "b006", type: "media", semantic: "plain" },
    { id: "b007", type: "callout", semantic: "definition" },
  ]);
  const semanticFixture = [...cardSemantics].map((semantic, index) => [
    `<!-- kp:block-id=b${String(index + 101).padStart(3, "0")} -->`,
    `> [!${semantic}] ${semantic}`,
    "> 正文。",
  ].join("\n")).join("\n\n");
  assert.deepStrictEqual(
    strictMarkdownBlocks(semanticFixture).blocks.map((block) => block.semantic),
    [...cardSemantics],
  );
  const unknown = strictMarkdownBlocks("<!-- kp:block-id=b200 -->\n> [!future] 未知\n> 完整降级文本");
  assert.strictEqual(unknown.blocks[0].semantic, "plain");
  assert.strictEqual(unknown.diagnostics[0].code, "UNKNOWN_CARD_SEMANTIC");
  assert.strictEqual(unknown.blocks[0].text, "未知\n完整降级文本");
  const readingFixture = strictMarkdownBlocks([
    "<!-- kp:block-id=b201 -->",
    '<!-- kp:reading={"heading":{"level":1,"part":"text","quote":"一、判断标准：","occurrence":1},"emphasis":[{"part":"text","quote":"是否越过边界","occurrence":1,"role":"boundary"}]} -->',
    "一、判断标准：关键看是否越过边界。",
    "",
    "<!-- kp:block-id=b202 -->",
    '<!-- kp:reading={"comparison":{"groupId":"compare-a","rows":[{"dimension":"回答什么","cells":[{"roleLabel":"左侧","blockId":"b201","part":"text","quote":"判断标准","occurrence":1},{"roleLabel":"右侧","blockId":"b201","part":"text","quote":"越过边界","occurrence":1}]}]}} -->',
    "比较说明。",
  ].join("\n"));
  assert.equal(readingFixture.blocks[0].reading.heading.level, 1);
  assert.equal(readingFixture.blocks[0].reading.emphasis[0].role, "boundary");
  assert.deepStrictEqual(validateReadingReferences({
    contentBlocks: readingFixture.blocks,
    confusionBlocks: [],
  }), []);
  assert.throws(() => strictMarkdownBlocks([
    "<!-- kp:block-id=b203 -->",
    '<!-- kp:reading={"future":true} -->',
    "原文。",
  ].join("\n")), /未知阅读标注字段/);
  assert.throws(() => strictMarkdownBlocks([
    "<!-- kp:block-id=b204 -->",
    '<!-- kp:reading={"emphasis":[{"part":"text","quote":"原文","occurrence":2,"role":"key"}]} -->',
    "原文。",
  ].join("\n")), /无法精确定位/);
  assert.throws(() => strictMarkdownBlocks([
    "<!-- kp:block-id=b205 -->",
    '<!-- kp:reading={"heading":{"level":1,"part":"text","quote":"标题","occurrence":1},"emphasis":[{"part":"text","quote":"标题","occurrence":1,"role":"key"}]} -->',
    "标题正文。",
  ].join("\n")), /发生重叠/);
  const flowFixture = { text: "前言：第一项；第二项。" };
  validateReadingAnnotation(flowFixture, { flow: { kind: "list", starts: [
    { part: "text", quote: "第一项", occurrence: 1 },
    { part: "text", quote: "第二项", occurrence: 1 },
  ] } }, "flow-fixture");
  for (const starts of [
    [{ part: "text", quote: "不存在", occurrence: 1 }],
    [{ part: "text", quote: "第二项", occurrence: 1 }, { part: "text", quote: "第一项", occurrence: 1 }],
  ]) assert.throws(() => validateReadingAnnotation(flowFixture, { flow: { kind: "list", starts } }, "flow-fixture"));
  assert.throws(() => validateReadingAnnotation(flowFixture, {
    emphasis: [{ part: "text", quote: "第一项；第二项", occurrence: 1, role: "key" }],
    flow: { kind: "list", starts: [{ part: "text", quote: "第二项", occurrence: 1 }] },
  }, "flow-fixture"), /切开/);
  assert.ok(validateReadingReferences({ contentBlocks: [{ id: "bad-level", reading: { heading: { level: 3 } } }], confusionBlocks: [] }).some((message) => message.includes("跳级")));
  const stableBefore = strictMarkdownBlocks("<!-- kp:block-id=b301 -->\n原文").blocks[0];
  const stableAfter = strictMarkdownBlocks("<!-- kp:block-id=b301 -->\n修改后的正文").blocks[0];
  assert.strictEqual(stableBefore.id, stableAfter.id);
  assert.notStrictEqual(stableBefore.text, stableAfter.text);
  const moved = strictMarkdownBlocks([
    "<!-- kp:block-id=b302 -->",
    "第二块",
    "",
    "<!-- kp:block-id=b301 -->",
    "原文",
  ].join("\n")).blocks;
  assert.deepStrictEqual(moved.map((block) => block.id), ["b302", "b301"]);
  assert.throws(() => strictMarkdownBlocks("没有锚点"), /缺少 kp:block-id/);
  assert.throws(
    () => strictMarkdownBlocks("<!-- kp:block-id=b001 -->\n第一段\n\n<!-- kp:block-id=b001 -->\n第二段"),
    /重复/,
  );
  assert.deepStrictEqual(validateCardReferences({
    summary_block_id: "b001",
    recall_answer_block_ids: ["b007"],
    recall_pitfall_block_ids: [],
  }, strict.blocks), []);
  assert.match(validateCardReferences({ recall_answer_block_ids: ["b999"] }, strict.blocks)[0], /不存在/);
  assert.deepStrictEqual(validateBlockIdMigrations([{
    fromBlockIds: ["content-old"],
    toBlockIds: ["b001", "b002"],
    primaryTargetId: "b001",
    disposition: "split",
    reason: "原块拆成标题和正文",
  }], new Set(strict.blocks.map((block) => block.id))), []);
  assert.match(validateBlockIdMigrations([{
    fromBlockIds: ["content-old"],
    toBlockIds: ["b999"],
    primaryTargetId: "b999",
    disposition: "split",
    reason: "错误目标",
  }], new Set(strict.blocks.map((block) => block.id)))[0], /target missing/);
  assert.deepStrictEqual(strictMarkdownBlocks(strictFixture), strictMarkdownBlocks(strictFixture));
  assert.deepStrictEqual(parseRelationReason("related|example|用于说明关系"), {
    type: "related",
    targetId: "example",
    why: "用于说明关系",
  });
  assert.strictEqual(normalizeSearchText("  马克思主义\n哲学  "), "马克思主义 哲学");
  assert.deepStrictEqual(buildKnowledgeMap([
    { id: "a", relations: { prerequisites: [] } },
    { id: "b", relations: { prerequisites: ["a"] } },
  ], [{ title: "示例", pointIds: ["a", "b"] }]), [
    {
      title: "示例",
      layers: [
        { depth: 0, pointIds: ["a"] },
        { depth: 1, pointIds: ["b"] },
      ],
    },
  ]);
  assert.throws(() => buildKnowledgeMap([
    { id: "a", relations: { prerequisites: ["b"] } },
    { id: "b", relations: { prerequisites: ["a"] } },
  ], [{ title: "循环", pointIds: ["a", "b"] }]), /前置关系存在循环/);
  console.log("politics knowledge builder: self-test passed");
}

if (process.argv.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

const result = validateAndBuild();
if (result.errors.length) {
  console.error(`政治知识校验失败（${result.errors.length} 项）：`);
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`政治知识校验通过：全量 ${result.notes.length} 篇，${buildScope} 构建 ${result.buildNotes.length} 篇`);
if (!checkOnly) {
  const relationCount = result.packageData.points.reduce(
    (total, point) => total + point.relationItems.length,
    0,
  );
  const derivedReasonCount = result.packageData.points.reduce(
    (total, point) => total + point.relationItems.filter((item) => item.whySource === "derived").length,
    0,
  );
  const blockCount = result.packageData.points.reduce(
    (total, point) => total + point.contentBlocks.length + point.confusionBlocks.length,
    0,
  );
  const atomBlockCount = result.packageData.points.reduce(
    (total, point) => total + [...point.contentBlocks, ...point.confusionBlocks]
      .filter((block) => cardSemantics.has(block.semantic)).length,
    0,
  );
  const relationAnchorCount = result.packageData.points.reduce(
    (total, point) => total + point.relationItems
      .filter((item) => item.sourceBlockIds.length && item.targetBlockIds.length).length,
    0,
  );
  const recallAnchorCount = result.packageData.points.filter((point) =>
    point.card.answerBlockIds.length && point.card.pitfallBlockIds.length).length;
  const summaryAnchorCount = result.packageData.points.filter((point) => point.summaryBlockId).length;
  const contrastEvidenceCount = result.packageData.points.reduce(
    (total, point) => total + point.relationItems.filter((item) =>
      item.type === "contrasts" && item.dimensions.length && item.boundaries.length).length,
    0,
  );
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result.packageData, null, 2)}\n`);
  if (!isReviewBuild) {
    fs.mkdirSync(path.dirname(runtimeDataPath), { recursive: true });
    fs.writeFileSync(
      runtimeDataPath,
      `module.exports = ${JSON.stringify(result.packageData, null, 2)};\n`,
    );
  } else {
    fs.mkdirSync(path.dirname(p3PreviewDataPath), { recursive: true });
    fs.writeFileSync(
      p3PreviewDataPath,
      `module.exports = ${JSON.stringify(result.packageData, null, 2)};\n`,
    );
  }
  fs.writeFileSync(
    reportPath,
    [
      `# 政治知识${isReviewBuild ? "全量校对包" : "预览"}构建报告`,
      "",
      `- 构建范围：${buildScope}`,
      `- 知识目录总数：${result.notes.length}`,
      `- 知识点：${result.packageData.module.pointCount}`,
      `- 待最终校对：${result.packageData.statusCounts.review}`,
      `- 已批准/已发布：${result.packageData.statusCounts.approved + result.packageData.statusCounts.published}`,
      `- 命中风险标记的知识点：${result.packageData.points.filter((point) => point.riskFlags.length).length}`,
      `- 风险页：${new Set(result.packageData.points.flatMap((point) => point.riskPages)).size}`,
      `- 目录：${result.packageData.categories.length}`,
      `- 数据协议：v${result.packageData.schemaVersion}`,
      `- 内容锚点：${blockCount}`,
      `- 稳定ID迁移：${result.packageData.idMigrations.length}`,
      `- 显式知识原子块：${atomBlockCount}`,
      `- summary精确锚点：${summaryAnchorCount}/${result.packageData.points.length}`,
      `- Recall精确锚点：${recallAnchorCount}/${result.packageData.points.length}`,
      `- 正式关系：${relationCount}`,
      `- 正式关系双端块锚点：${relationAnchorCount}/${relationCount}`,
      `- 正式Contrast证据：${contrastEvidenceCount}`,
      `- 派生关系说明：${derivedReasonCount}`,
      `- 搜索索引：${result.packageData.searchIndex.length}`,
      `- 包版本：${result.packageData.packageVersion}`,
      "- 协议错误：0",
      `- 小程序产物：${isReviewBuild ? "独立 P3 试验模型，不覆盖正式运行模型" : "政治正式预览运行时数据"}`,
      `- 产物性质：${isReviewBuild ? "全量展现联调与校对，禁止作为发布包" : "本地正式内容预览，不可作为正式发布包"}`,
      "",
    ].join("\n"),
  );
  console.log(`已生成：${path.relative(repo, outputPath)}`);
  console.log(`已生成：${path.relative(repo, reportPath)}`);
  if (!isReviewBuild) console.log(`已生成：${path.relative(repo, runtimeDataPath)}`);
  if (isReviewBuild) console.log(`已生成：${path.relative(repo, p3PreviewDataPath)}`);
}
