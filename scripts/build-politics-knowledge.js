#!/usr/bin/env node

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const inputDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics");
const outputDir = path.join(repo, "docs/knowledge-pilot/dist/politics");
const outputPath = path.join(outputDir, "politics-preview.json");
const reportPath = path.join(outputDir, "build-report.md");
const runtimeDataPath = path.join(repo, "miniprogram/models/politics-preview.js");
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
const allowedStatuses = new Set(["draft", "review", "approved", "published", "stale"]);
const requiredSections = ["一句话理解", "完整内容", "易混与边界", "速记卡"];
const forbiddenPlaceholders = ["待人工", "待补", "请用一到两句", "抽样审核项"];

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

function markdownBlocks(markdown) {
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
  return blocks;
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

function validateAndBuild() {
  const errors = [];
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
    if (properties.module !== "politics") errors.push(`${fileName}: module 必须为 politics`);
    if (!allowedStatuses.has(properties.status)) errors.push(`${fileName}: status 不合法`);
    if (!Number.isInteger(properties.version) || properties.version < 1) {
      errors.push(`${fileName}: version 必须为正整数`);
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

    if (["approved", "published"].includes(properties.status)) {
      for (const placeholder of forbiddenPlaceholders) {
        if (body.includes(placeholder)) errors.push(`${fileName}: 已批准内容仍含占位文字“${placeholder}”`);
      }
    }

    for (const relation of relationProperties) {
      if (!Array.isArray(properties[relation])) {
        errors.push(`${fileName}: ${relation} 必须为列表`);
        continue;
      }
      for (const value of properties[relation]) {
        const target = linkTarget(value);
        if (!target) errors.push(`${fileName}: ${relation} 包含非法链接 ${value}`);
        else if (!references.has(target)) errors.push(`${fileName}: ${relation} 无法解析 ${value}`);
      }
    }

    const card = getSection(body, "速记卡");
    for (const heading of ["提示", "答案", "易错"]) {
      if (!card || !getSubsection(card, heading)) errors.push(`${fileName}: 速记卡缺少“### ${heading}”`);
    }
  }

  if (errors.length) return { errors, packageData: null, notes };

  const relationIds = (values) =>
    values.map((value) => references.get(linkTarget(value)).properties.id);
  const points = notes.map(({ body, fileName, properties }) => {
    const card = getSection(body, "速记卡");
    return {
      id: properties.id,
      title: properties.title,
      category: properties.category,
      status: properties.status,
      version: properties.version,
      aliases: properties.aliases || [],
      tags: properties.tags || [],
      sourceUnits: properties.source_units,
      sourceHash: properties.source_hash,
      reviewedAt: properties.reviewed_at || "",
      summary: getSection(body, "一句话理解"),
      content: getSection(body, "完整内容"),
      contentBlocks: markdownBlocks(getSection(body, "完整内容")),
      confusion: getSection(body, "易混与边界"),
      confusionBlocks: markdownBlocks(getSection(body, "易混与边界")),
      card: {
        prompt: getSubsection(card, "提示"),
        answer: getSubsection(card, "答案"),
        pitfall: getSubsection(card, "易错"),
      },
      relations: {
        prerequisites: relationIds(properties.prerequisites || []),
        contrasts: relationIds(properties.contrasts || []),
        related: relationIds(properties.related || []),
      },
      sourceFile: fileName,
    };
  });
  const categories = [...new Set(points.map((point) => point.category))].map((title) => ({
    title,
    pointIds: points.filter((point) => point.category === title).map((point) => point.id),
  }));
  let knowledgeMap;
  try {
    knowledgeMap = buildKnowledgeMap(points, categories);
  } catch (error) {
    return { errors: [error.message], packageData: null, notes };
  }
  const contentHash = crypto
    .createHash("sha256")
    .update(notes.map((note) => `${note.fileName}\n${note.source}`).join("\n"))
    .digest("hex");

  return {
    errors,
    notes,
    packageData: {
      schemaVersion: 1,
      packageType: "preview",
      packageVersion: `preview-${contentHash.slice(0, 12)}`,
      module: {
        id: "politics",
        title: "政治理论",
        keywords: "马克思主义基本原理",
        description: "使用已审核的正式知识样本，验证政治目录与知识详情。",
        pointCount: points.length,
        status: "ready",
        statusText: "试验中",
      },
      categories,
      knowledgeMap,
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
  assert.deepStrictEqual(markdownBlocks("### 标题\n\n1. 第一项\n2. 第二项\n\n正文"), [
    { type: "heading", text: "标题" },
    { type: "list", ordered: true, items: ["第一项", "第二项"] },
    { type: "paragraph", text: "正文" },
  ]);
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

console.log(`政治知识校验通过：${result.notes.length} 篇`);
if (!checkOnly) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result.packageData, null, 2)}\n`);
  fs.mkdirSync(path.dirname(runtimeDataPath), { recursive: true });
  fs.writeFileSync(
    runtimeDataPath,
    `module.exports = ${JSON.stringify(result.packageData, null, 2)};\n`,
  );
  fs.writeFileSync(
    reportPath,
    [
      "# 政治知识预览构建报告",
      "",
      `- 知识点：${result.packageData.module.pointCount}`,
      `- 目录：${result.packageData.categories.length}`,
      `- 包版本：${result.packageData.packageVersion}`,
      "- 协议错误：0",
      "- 小程序产物：政治主包运行时数据",
      "- 产物性质：本地预览，不可作为正式发布包",
      "",
    ].join("\n"),
  );
  console.log(`已生成：${path.relative(repo, outputPath)}`);
  console.log(`已生成：${path.relative(repo, reportPath)}`);
  console.log(`已生成：${path.relative(repo, runtimeDataPath)}`);
}
