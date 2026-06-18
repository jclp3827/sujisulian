const dataAnalysis = safeLoadNoteContent(
  {
    id: "data-analysis",
    title: "资料分析",
    keywords: "增长、比重、分数、速算",
    description: "围绕资料分析常见公式、比较方法和速算技巧整理。",
    status: "ready",
    statusText: "可学习",
  },
  () => require("./note-data-analysis.js"),
);

function safeLoadNoteContent(moduleMeta, loadContent) {
  try {
    return loadContent();
  } catch (error) {
    return {
      module: moduleMeta,
      categories: [],
      points: [],
      loadError: error?.message || `${moduleMeta.title}模块加载失败`,
    };
  }
}

const quantity = safeLoadNoteContent(
  {
    id: "quantity",
    title: "数量关系",
    keywords: "工程、行程、排列组合",
    description: "数量关系知识点整理中。",
    status: "pending",
    statusText: "待整理",
  },
  () => require("./note-quantity.js"),
);

const logic = safeLoadNoteContent(
  {
    id: "logic",
    title: "判断推理",
    keywords: "定义、类比、逻辑判断",
    description: "判断推理知识点整理中。",
    status: "pending",
    statusText: "待整理",
  },
  () => require("./note-logic.js"),
);

const verbal = safeLoadNoteContent(
  {
    id: "verbal",
    title: "言语理解",
    keywords: "主旨、逻辑填空、语句排序",
    description: "言语理解知识点整理中。",
    status: "pending",
    statusText: "待整理",
  },
  () => require("./note-verbal.js"),
);

const graphic = safeLoadNoteContent(
  {
    id: "graphic",
    title: "图形推理",
    keywords: "图推、定性分析、定量分析、立体图形",
    description: "图形推理知识点整理。",
    status: "ready",
    statusText: "可学习",
  },
  () => require("./note-graphic.js"),
);

const pendingModules = [];



const noteModules = [
  dataAnalysis.module,
  quantity.module,
  logic.module,
  verbal.module,
  graphic.module,
  ...pendingModules,
];

const moduleContent = {
  [dataAnalysis.module.id]: dataAnalysis,
  [quantity.module.id]: quantity,
  [logic.module.id]: logic,
  [verbal.module.id]: verbal,
  [graphic.module.id]: graphic,
};

function getNoteModule(moduleId) {
  return noteModules.find((module) => module.id === moduleId) || null;
}

function getNoteContent(moduleId) {
  return moduleContent[moduleId] || null;
}

function getNoteCategories(moduleId) {
  return getNoteContent(moduleId)?.categories || [];
}

function getNoteCategory(moduleId, categoryId) {
  return getNoteCategories(moduleId).find((category) => category.id === categoryId) || null;
}

function getNotePoints(moduleId) {
  return getNoteContent(moduleId)?.points || [];
}

function getNotePointsByCategory(moduleId, categoryId) {
  const category = getNoteCategory(moduleId, categoryId);
  const points = getNotePoints(moduleId);
  if (!category?.pointIds?.length) {
    return points.filter((point) => point.categoryId === categoryId);
  }
  return category.pointIds
    .map((pointId) => points.find((point) => point.id === pointId))
    .filter(Boolean);
}

function getNotePoint(moduleId, pointId) {
  return getNotePoints(moduleId).find((point) => point.id === pointId) || null;
}

function getBlocksByType(point, blockType) {
  return (point?.tabs || []).reduce((blocks, tab) => {
    const matched = (tab.blocks || []).filter((block) => block.type === blockType);
    return blocks.concat(matched);
  }, []);
}

function getNoteCheatsheet(moduleId) {
  const moduleInfo = getNoteModule(moduleId);
  if (!moduleInfo || moduleInfo.status !== "ready") return null;

  const sections = getNoteCategories(moduleId)
    .map((category) => {
      const points = getNotePointsByCategory(moduleId, category.id).map((point) => {
        const formulaBlocks = getBlocksByType(point, "formula");
        const ruleBlocks = getBlocksByType(point, "rule").concat(getBlocksByType(point, "signal"));
        const primaryFormula = formulaBlocks[0]?.content || point.preview;
        const cues = ruleBlocks[0]?.items || [];

        return {
          id: point.id,
          title: point.title,
          type: point.type,
          preview: point.preview,
          summary: point.summary,
          primaryFormula,
          formulaCount: formulaBlocks.length,
          cues: cues.slice(0, 2),
          relatedTraining: point.relatedTraining || null,
        };
      });

      return {
        id: category.id,
        title: category.title,
        subtitle: category.subtitle,
        status: category.status,
        points,
      };
    })
    .filter((section) => section.status === "ready" && section.points.length);

  return {
    module: moduleInfo,
    sections,
  };
}

function getPointTabs(point) {
  return point?.tabs || [];
}

function getPointTab(point, tabId) {
  return getPointTabs(point).find((tab) => tab.id === tabId) || getPointTabs(point)[0] || null;
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

const STOP_WORDS = new Set([
  "的", "了", "是", "在", "和", "与", "就", "也", "还", "都",
  "有", "对", "把", "被", "让", "给", "向", "从", "到", "以",
  "或", "及", "而", "但", "可", "如", "若", "于", "因", "由",
  "之", "其", "此", "彼", "这", "那", "哪", "它", "他", "她",
  "们", "吗", "呢", "吧", "啊", "哦", "嗯", "嘛",
  "一", "不", "没", "能", "会",
]);

function isStopWordOnly(value) {
  const cleaned = normalizeSearchText(value);
  if (!cleaned) return true;
  for (const ch of cleaned) {
    if (!STOP_WORDS.has(ch)) return false;
  }
  return true;
}

function collectSearchText(point) {
  return [
    point.title,
    point.summary,
    point.preview,
    ...(point.keywords || []),
    ...(point.aliases || []),
    ...(point.tags || []),
    point.indexText,
  ];
}

function getSearchScore(point, query) {
  let score = 0;
  const title = normalizeSearchText(point.title);
  const summary = normalizeSearchText(point.summary);
  const preview = normalizeSearchText(point.preview);
  const keywords = (point.keywords || []).map(normalizeSearchText);
  const aliases = (point.aliases || []).map(normalizeSearchText);
  const tags = (point.tags || []).map(normalizeSearchText);
  const indexText = normalizeSearchText(point.indexText);

  if (title.includes(query)) score += 100;
  if (keywords.some((item) => item.includes(query))) score += 70;
  if (aliases.some((item) => item.includes(query))) score += 60;
  if (tags.some((item) => item.includes(query))) score += 40;
  if (summary.includes(query)) score += 25;
  if (preview.includes(query)) score += 20;
  if (indexText.includes(query)) score += 15;

  return score;
}

function searchNotePoints({ keyword = "", moduleId, categoryId } = {}) {
  const query = normalizeSearchText(keyword);
  if (isStopWordOnly(query)) return [];
  const module = moduleId ? getNoteModule(moduleId) : null;
  const category = moduleId && categoryId ? getNoteCategory(moduleId, categoryId) : null;
  const points = moduleId
    ? (categoryId ? getNotePointsByCategory(moduleId, categoryId) : getNotePoints(moduleId))
    : noteModules.filter((item) => item.status === "ready").flatMap((item) => getNotePoints(item.id));

  return points
    .map((point) => {
      const resolvedModuleId = moduleId || noteModules.find((item) => getNotePoints(item.id).some((candidate) => candidate.id === point.id && candidate.categoryId === point.categoryId))?.id;
      if (!resolvedModuleId) return null;
      const pointModule = module || getNoteModule(resolvedModuleId);
      const pointCategory = getNoteCategory(resolvedModuleId, point.categoryId);
      const searchText = collectSearchText(point).map(normalizeSearchText).filter(Boolean);
      const matched = !query || searchText.some((item) => item.includes(query));
      if (!matched) return null;
      return {
        ...point,
        module: pointModule,
        category: pointCategory,
        score: query ? getSearchScore(point, query) : 0,
        matchText: query
          ? point.aliases?.find((item) => normalizeSearchText(item).includes(query))
            || point.keywords?.find((item) => normalizeSearchText(item).includes(query))
            || point.tags?.find((item) => normalizeSearchText(item).includes(query))
            || point.title
          : "",
        scopeCategory: category,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, "zh-Hans-CN"));
}

module.exports = {
  noteModules,
  getNoteModule,
  getNoteContent,
  getNoteCategories,
  getNoteCategory,
  getNotePoints,
  getNotePointsByCategory,
  getNotePoint,
  getNoteCheatsheet,
  getPointTabs,
  getPointTab,
  searchNotePoints,
};
