const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const inputPath = process.argv[2] || "/private/tmp/common-sense-scans-114-165/resolved-text.md";
const outputPath = process.argv[3] || path.resolve(__dirname, "../docs/common-sense-scan-114-165-fast-audit.json");
const sourceAuditDirectory = path.resolve(__dirname, "../docs/common-sense-source-audit");

const pagePoints = {
  114: ["state-president-judiciary-supervision", "central-military-commission"],
  115: ["central-military-commission", "judicial-system"],
  116: ["judicial-system", "national-supervisory-commission"],
  118: ["civil-code-general-persons", "civil-basic-principles", "civil-subjects"],
  119: ["civil-subjects"],
  120: ["civil-subjects"],
  121: ["civil-subjects", "legal-person", "civil-acts-agency-limitation", "civil-act-effect"],
  122: ["civil-act-effect"],
  123: ["civil-rights", "civil-property-rights"],
  124: ["civil-property-rights", "civil-agency", "civil-agency-authority", "unauthorized-agency"],
  125: ["unauthorized-agency", "civil-limitation", "civil-limitation-types"],
  126: ["property-contract", "ownership-rights", "usufruct-rights", "security-rights"],
  127: ["security-rights", "contract-formation", "contract-code-revisions"],
  128: ["contract-code-revisions", "contract-breach-liability", "personality-rights-part"],
  129: ["personality-rights-part", "invalid-marriage", "revocable-marriage", "divorce-rules"],
  130: ["divorce-rules", "inheritance-concept", "inheritance-methods"],
  131: ["inheritance-methods"],
  132: ["tort-liability", "tort-attribution"],
  134: ["criminal-law-overview", "criminal-law-effect"],
  135: ["criminal-law-effect", "criminal-law-general"],
  136: ["criminal-law-general"],
  137: ["criminal-law-general", "criminal-responsibility-capacity"],
  138: ["criminal-responsibility-capacity", "intentional-crime-forms"],
  139: ["intentional-crime-forms", "joint-crime"],
  140: ["joint-crime", "criminal-punishment"],
  141: ["criminal-punishment"],
  142: ["criminal-punishment"],
  143: ["criminal-punishment"],
  144: ["criminal-punishment"],
  145: ["criminal-punishment", "common-crimes"],
  146: ["common-crimes"],
  147: ["common-crimes"],
  148: ["common-crimes"],
  150: ["administrative-law-overview"],
  151: ["administrative-law-overview"],
  152: ["administrative-law-overview", "administrative-license"],
  153: ["administrative-penalty"],
  154: ["administrative-penalty"],
  155: ["administrative-penalty"],
  156: ["administrative-penalty", "administrative-compulsion"],
  157: ["administrative-compulsion", "administrative-reconsideration"],
  158: ["administrative-reconsideration"],
  159: ["administrative-reconsideration"],
  160: ["administrative-reconsideration", "administrative-litigation"],
  161: ["administrative-litigation"],
  162: ["administrative-litigation"],
  163: ["administrative-litigation"],
  164: ["administrative-litigation"],
};

const excludedPages = {
  117: "课后练习",
  133: "课后练习",
  149: "课后练习",
  165: "课后练习",
};

const riskWords = [
  "应当", "可以", "不得", "不予", "不能", "除外", "原则上", "必须", "仅限", "至少", "以上", "不满", "超过", "从轻", "减轻", "免除", "从重", "停止执行", "不停止执行", "终局裁决",
];

const riskEquivalents = {
  应当: ["应当", "应"],
  可以: ["可以", "可"],
  不能: ["不能", "不可"],
  必须: ["必须", "须"],
  不予: ["不予", "不"],
};

function normalize(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\s，。；：、（）()《》“”‘’【】\[\]—－…·,.!?！？:;"']/g, "")
    .replace(/辦/g, "辩")
    .replace(/決/g, "决")
    .replace(/為/g, "为");
}

function parsePages(text) {
  const pages = {};
  const matches = [...text.matchAll(/^## 第 (\d+) 页\s*$/gm)];
  matches.forEach((match, index) => {
    const page = Number(match[1]);
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    let body = text.slice(start, end);
    if (page === 164) body = body.split("【课后练习】")[0];
    pages[page] = body
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !/(第\s*\d+\s*页|关注|四海公|山海公|出海公考|SIHAI|GONG\s*KAO|HAI|AIGON|D巴海|公众号|每日图推|更新进度微信|SKA674)/i.test(line));
  });
  return pages;
}

function pointSegments(point) {
  const segments = [];
  (point.tabs || []).forEach((tab) => {
    (tab.blocks || []).forEach((block) => {
      if (block.label) segments.push(block.label);
      (block.items || []).forEach((item) => segments.push(item));
      (block.columns || []).forEach((item) => segments.push(item));
      (block.rows || []).forEach((row) => row.forEach((item) => segments.push(item)));
    });
  });
  return segments.filter((item) => normalize(item).length >= 2);
}

function gramCoverage(value, corpus, size = 3) {
  const text = normalize(value);
  const target = normalize(corpus);
  if (!text) return 1;
  if (target.includes(text)) return 1;
  if (text.length < size) return target.includes(text) ? 1 : 0;
  const grams = new Set();
  for (let index = 0; index <= text.length - size; index += 1) grams.add(text.slice(index, index + size));
  let hits = 0;
  grams.forEach((gram) => { if (target.includes(gram)) hits += 1; });
  return hits / grams.size;
}

function riskTokens(lines) {
  const text = lines.join("\n");
  const tokens = new Map();
  const numberPattern = /\d+(?:\.\d+)?(?:\s*[—至到]\s*\d+(?:\.\d+)?)?\s*(?:个?月|年|日|周岁|人|元|万元|小时|届|次|%|％)/g;
  lines.forEach((line) => (line.match(numberPattern) || []).forEach((token) => {
    const cleaned = normalize(token);
    if (cleaned) tokens.set(cleaned, line);
  }));
  riskWords.forEach((word) => {
    const context = lines.find((line) => line.includes(word));
    if (context) tokens.set(normalize(word), context);
  });
  return [...tokens].map(([token, context]) => ({ token, context }));
}

const rawText = fs.readFileSync(inputPath, "utf8");
const pages = parsePages(rawText);
const pointById = new Map(commonSense.points.map((point) => [point.id, point]));
const pageAudits = [];
const missingPoints = [];

Object.entries(pagePoints).forEach(([pageKey, pointIds]) => {
  const page = Number(pageKey);
  const sourceLines = pages[page] || [];
  const points = pointIds.map((pointId) => pointById.get(pointId)).filter(Boolean);
  pointIds.forEach((pointId) => { if (!pointById.has(pointId)) missingPoints.push({ page, pointId }); });
  const segments = points.flatMap(pointSegments);
  const cardCorpus = segments.join("\n");
  const comparableLines = sourceLines.filter((line) => {
    const text = normalize(line);
    return text.length >= 8 && !/^\d+$/.test(text);
  });
  const weakSourceLines = comparableLines
    .map((line) => ({ line, coverage: Number(gramCoverage(line, cardCorpus).toFixed(2)) }))
    .filter((item) => item.coverage < 0.38);
  const sourceRisks = riskTokens(sourceLines);
  const normalizedCardCorpus = normalize(cardCorpus);
  const missingRiskTokens = sourceRisks.filter((item) => {
    const equivalents = riskEquivalents[item.token] || [item.token];
    return !equivalents.some((token) => normalizedCardCorpus.includes(normalize(token)));
  });
  pageAudits.push({
    page,
    pointIds,
    sourceLineCount: comparableLines.length,
    sourceLinesCovered: comparableLines.length - weakSourceLines.length,
    missingRiskTokens,
    weakSourceLines: weakSourceLines.slice(0, 12),
  });
});

const mappedPointIds = new Set(Object.values(pagePoints).flat());
const sourceAuditByPointId = new Map();
fs.readdirSync(sourceAuditDirectory).filter((file) => file.endsWith(".json")).forEach((file) => {
  const audit = JSON.parse(fs.readFileSync(path.join(sourceAuditDirectory, file), "utf8"));
  sourceAuditByPointId.set(audit.pointId, audit);
});
const knowledgePointDetails = [...mappedPointIds].map((pointId) => {
  const point = pointById.get(pointId);
  const sourceCount = sourceAuditByPointId.get(pointId)?.knowledgePointIds?.length || 0;
  const guideCount = point?.readingMeta?.focus?.length || 0;
  return { pointId, sourceCount, guideCount, matched: sourceCount === guideCount };
});
const administrativePointIds = [...mappedPointIds].filter((pointId) => pointById.get(pointId)?.categoryId === "administrative-law");
const administrativeTables = administrativePointIds.flatMap((pointId) => {
  const point = pointById.get(pointId);
  return (point.tabs || []).flatMap((tab) => (tab.blocks || [])
    .filter((block) => block.type === "table")
    .map((block) => ({
      pointId,
      tab: tab.title,
      label: block.label,
      rows: (block.rows || []).length,
      columns: (block.columns || []).length,
      mobileLayout: block.mobileLayout,
      cardTitleColumn: block.cardTitleColumn,
    })));
});
const pointPages = new Map();
Object.entries(pagePoints).forEach(([page, pointIds]) => pointIds.forEach((pointId) => {
  if (!pointPages.has(pointId)) pointPages.set(pointId, []);
  pointPages.get(pointId).push(Number(page));
}));
const pointAudits = [...mappedPointIds].map((pointId) => {
  const point = pointById.get(pointId);
  const sourcePages = pointPages.get(pointId) || [];
  const sourceCorpus = sourcePages.flatMap((page) => pages[page] || []).join("\n");
  const segments = pointSegments(point).filter((segment) => normalize(segment).length >= 10);
  const weakCardSegments = segments
    .map((segment) => ({ segment, coverage: Number(gramCoverage(segment, sourceCorpus).toFixed(2)) }))
    .filter((item) => item.coverage < 0.32);
  return {
    pointId,
    sourcePages,
    cardSegmentCount: segments.length,
    cardSegmentsCovered: segments.length - weakCardSegments.length,
    weakCardSegments: weakCardSegments.slice(0, 12),
  };
});
const result = {
  generatedAt: new Date().toISOString(),
  scope: "第114页国家主席起，至第164页课后练习前",
  source: inputPath,
  mapping: {
    auditedPages: Object.keys(pagePoints).map(Number),
    excludedPages,
    mappedPointCount: mappedPointIds.size,
    missingPoints,
  },
  knowledgePoints: {
    sourceCount: knowledgePointDetails.reduce((sum, item) => sum + item.sourceCount, 0),
    guideCount: knowledgePointDetails.reduce((sum, item) => sum + item.guideCount, 0),
    mismatches: knowledgePointDetails.filter((item) => !item.matched),
    details: knowledgePointDetails,
  },
  administrativeTables: {
    count: administrativeTables.length,
    mobileCardCount: administrativeTables.filter((table) => table.mobileLayout === "cards" && Number.isInteger(table.cardTitleColumn)).length,
    problems: administrativeTables.filter((table) => table.mobileLayout !== "cards" || !Number.isInteger(table.cardTitleColumn)),
    details: administrativeTables,
  },
  coverage: {
    sourceLines: pageAudits.reduce((sum, item) => sum + item.sourceLineCount, 0),
    sourceLinesCovered: pageAudits.reduce((sum, item) => sum + item.sourceLinesCovered, 0),
    cardSegments: pointAudits.reduce((sum, item) => sum + item.cardSegmentCount, 0),
    cardSegmentsCovered: pointAudits.reduce((sum, item) => sum + item.cardSegmentsCovered, 0),
  },
  highRisk: {
    pagesWithMissingTokens: pageAudits.filter((item) => item.missingRiskTokens.length).map((item) => ({ page: item.page, tokens: item.missingRiskTokens })),
  },
  pages: pageAudits,
  points: pointAudits,
};

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({
  outputPath,
  mapping: result.mapping,
  knowledgePoints: {
    sourceCount: result.knowledgePoints.sourceCount,
    guideCount: result.knowledgePoints.guideCount,
    mismatches: result.knowledgePoints.mismatches,
  },
  administrativeTables: {
    count: result.administrativeTables.count,
    mobileCardCount: result.administrativeTables.mobileCardCount,
    problems: result.administrativeTables.problems,
  },
  coverage: result.coverage,
  highRiskPages: result.highRisk.pagesWithMissingTokens,
}, null, 2));
