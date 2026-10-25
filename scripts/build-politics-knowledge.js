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
const runtimeDataPath = path.join(repo, "miniprogram/models/politics-preview.js");
const p3PreviewDataPath = path.join(
  repo,
  `miniprogram/models/${isTocV2 ? "politics-p3-v2-preview" : "politics-p3-preview"}.js`,
);
const tocStructurePath = path.join(repo, "docs/knowledge-pilot/political-toc-structure-20260827-v2.json");
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

function parseRelationReason(value) {
  const match = value.match(/^(prerequisites|contrasts|related)\|([^|]+)\|(.+)$/);
  if (!match) return null;
  return { type: match[1], targetId: match[2].trim(), why: match[3].trim() };
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
  const points = buildNotes.map(({ body, fileName, properties }) => {
    const card = getSection(body, "速记卡");
    const contentBlocks = markdownBlocks(getSection(body, "完整内容"), "content");
    const confusionBlocks = markdownBlocks(getSection(body, "易混与边界"), "confusion");
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
      relations[type].map((targetId) => ({
        type,
        targetId,
        why:
          reasonByKey.get(`${type}|${targetId}`) ||
          derivedRelationReason(type, properties.title, titleById.get(targetId)),
        whySource: reasonByKey.has(`${type}|${targetId}`) ? "authored" : "derived",
      })),
    );
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
      summary: getSection(body, "一句话理解"),
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
      },
      relations,
      relationItems,
      reverseRelations: [],
      sourceFile: fileName,
    };
  });
  const pointsById = new Map(points.map((point) => [point.id, point]));
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
  const contentHash = crypto
    .createHash("sha256")
    .update(buildNotes.map((note) => `${note.fileName}\n${note.source}`).join("\n"))
    .digest("hex");

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

  return {
    errors,
    notes,
    buildNotes,
    packageData: {
      schemaVersion: isTocV2 ? 3 : 2,
      packageType: isReviewBuild ? "review-preview" : "preview",
      packageVersion: `${isReviewBuild ? "review" : "preview"}-${contentHash.slice(0, 12)}`,
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
        statusText: isReviewBuild ? "待校对" : "试验中",
      },
      categories,
      directory,
      knowledgeMap,
      navigationOrder: points.map((point) => point.id),
      searchIndex,
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
      `- 目录：${result.packageData.categories.length}`,
      `- 数据协议：v${result.packageData.schemaVersion}`,
      `- 内容锚点：${blockCount}`,
      `- 正式关系：${relationCount}`,
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
