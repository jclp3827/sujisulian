const scanPoints = require("./note-common-sense-remaining-law");
const criminalContent = require("./note-common-sense-scans-114-165-criminal");
const administrativeContent = require("./note-common-sense-scans-114-165-administrative");
const scanContent = { ...criminalContent, ...administrativeContent };

const supplementalScanPoints = [
  {
    id: "intentional-crime-forms",
    type: "quick-check",
    title: "故意犯罪形态",
    summary: "按犯罪进程与停止原因，区分预备、未遂、中止和既遂四种形态及其处罚后果。",
    preview: "犯罪预备、犯罪未遂、犯罪中止、犯罪既遂",
    keywords: ["犯罪预备", "犯罪未遂", "犯罪中止", "犯罪既遂"],
    aliases: ["故意犯罪形态", "犯罪停止形态"],
    tags: ["常识判断", "法律常识", "刑法"],
    indexText: "故意犯罪形态包括犯罪预备、犯罪未遂、犯罪中止和犯罪既遂，重点区分着手、意志原因、损害结果与处罚后果。",
    tabs: criminalContent["intentional-crime-forms"],
  },
  {
    id: "joint-crime",
    type: "quick-check",
    title: "共同犯罪",
    summary: "从二人以上共同故意入手，掌握共同犯罪构成及主犯、从犯、胁从犯、教唆犯的责任。",
    preview: "共同故意、一般共犯、犯罪集团、主犯、从犯、胁从犯、教唆犯",
    keywords: ["共同犯罪", "主犯", "从犯", "胁从犯", "教唆犯"],
    aliases: ["共犯", "犯罪集团"],
    tags: ["常识判断", "法律常识", "刑法"],
    indexText: "共同犯罪是二人以上共同故意犯罪，包括一般共犯、犯罪集团及主犯从犯胁从犯教唆犯的认定与处罚。",
    tabs: criminalContent["joint-crime"],
  },
];

const SCAN_META = {
  "intentional-crime-forms": {
    categoryId: "criminal-general",
    sourceSections: [138, 139],
  },
  "joint-crime": {
    categoryId: "criminal-general",
    sourceSections: [139, 140],
  },
  "criminal-punishment": {
    categoryId: "criminal-punishment-section",
    sourceSections: [140, 141, 142, 143, 144, 145],
  },
  "common-crimes": {
    categoryId: "common-crimes-section",
    sourceSections: [145, 146, 147, 148],
  },
  "administrative-law-overview": {
    categoryId: "administrative-law",
    sourceSections: [150, 151, 152],
  },
  "administrative-license": {
    categoryId: "administrative-law",
    sourceSections: [152],
  },
  "administrative-penalty": {
    categoryId: "administrative-law",
    sourceSections: [153, 154, 155, 156],
  },
  "administrative-compulsion": {
    categoryId: "administrative-law",
    sourceSections: [156, 157],
  },
  "administrative-reconsideration": {
    categoryId: "administrative-law",
    sourceSections: [157, 158, 159, 160],
  },
  "administrative-litigation": {
    categoryId: "administrative-law",
    sourceSections: [160, 161, 162, 163, 164],
  },
};

function sourceId(pointId, label) {
  return `cs-scan-114-165-${pointId}-${label}`;
}

function buildReadingMeta(point) {
  const focus = point.tabs.map((tab, index) => ({
    label: tab.title,
    note: tab.guide,
    sourceUnitIds: [sourceId(point.id, `kp-${index + 1}`)],
  }));
  return {
    label: "学习导读",
    takeaway: point.summary,
    focus,
    route: point.tabs.map((tab) => tab.title),
    review: focus.map((item) => item.note),
  };
}

module.exports = function mountScanPoints(points) {
  [...supplementalScanPoints, ...scanPoints].forEach((scanPoint) => {
    const meta = SCAN_META[scanPoint.id];
    if (!meta) return;
    const tabs = (scanContent[scanPoint.id] || scanPoint.tabs || []).map((tab, tabIndex) => ({
      ...tab,
      blocks: (tab.blocks || []).map((block, blockIndex) => {
        const normalizedBlock = {
          ...block,
          sourceUnitIds: [sourceId(scanPoint.id, blockIndex === 0 ? `kp-${tabIndex + 1}` : `block-${tabIndex + 1}-${blockIndex + 1}`)],
        };
        if (meta.categoryId === "administrative-law" && block.type === "table") {
          normalizedBlock.mobileLayout = "cards";
          normalizedBlock.cardTitleColumn = Number.isInteger(block.cardTitleColumn) ? block.cardTitleColumn : 0;
        }
        return normalizedBlock;
      }),
    }));
    const point = {
      ...scanPoint,
      categoryId: meta.categoryId,
      sourceSections: meta.sourceSections,
      sourceAuditStatus: "ready-for-user-acceptance",
      sourceUnitIds: [sourceId(scanPoint.id, "heading")],
      tabs,
    };
    point.readingMeta = buildReadingMeta(point);
    const index = points.findIndex((item) => item.id === point.id);
    if (index >= 0) points[index] = point;
    else points.push(point);
  });
};
