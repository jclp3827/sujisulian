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

const commonSense = safeLoadNoteContent(
  { id: "common-sense", title: "常识判断", keywords: "历史、文化、法律、科技、地理", description: "按专题拆解常识背诵材料。", status: "ready", statusText: "可学习" },
  () => require("./note-common-sense-runtime.js"),
);



const noteModules = [commonSense.module];

const moduleContent = {
  [commonSense.module.id]: commonSense,
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

function collectBlockText(value, text = [], seen = new Set()) {
  if (value === null || value === undefined) return text;
  if (typeof value === "string" || typeof value === "number") {
    text.push(String(value));
    return text;
  }
  if (typeof value !== "object" || seen.has(value)) return text;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item) => collectBlockText(item, text, seen));
    return text;
  }

  Object.keys(value).forEach((key) => {
    // 标识和资源地址不是面向学习的正文，避免它们干扰结果排序。
    if (["id", "type", "src", "image", "video", "audio"].includes(key)) return;
    collectBlockText(value[key], text, seen);
  });
  return text;
}

function getPointBodyText(point) {
  return collectBlockText(point?.tabs || []).join(" ");
}

function commonSenseEntryContainsPoint(entry, point) {
  if (!entry || !point) return false;
  if (entry.pointId === point.id || entry.categoryId === point.categoryId) return true;
  return Boolean(entry.categoryId && getNotePointsByCategory("common-sense", entry.categoryId)
    .some((candidate) => candidate.id === point.id));
}

function getCommonSensePath(point) {
  const directory = getNoteContent("common-sense")?.directory || [];
  for (const part of directory) {
    for (const chapter of part.chapters || []) {
      for (const section of chapter.sections || []) {
        if (commonSenseEntryContainsPoint(section, point)) {
          return [part, chapter, section];
        }
      }
      if (commonSenseEntryContainsPoint(chapter, point)) return [part, chapter];
    }
  }
  return [];
}

function getSearchPath(moduleId, point, category) {
  if (moduleId !== "common-sense") {
    return [getNoteModule(moduleId)?.title, category?.title, point.title].filter(Boolean).join(" / ");
  }

  const directoryPath = getCommonSensePath(point)
    .map((item) => [item.order, item.title].filter(Boolean).join(" "));
  const categoryLabel = category?.title;
  if (categoryLabel && !directoryPath.some((item) => item.includes(categoryLabel))) directoryPath.push(`小节 ${categoryLabel}`);
  directoryPath.push(`知识点 ${point.title}`);
  return directoryPath.join(" / ");
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

function collectSearchText(point, bodyText) {
  return [
    point.title,
    point.summary,
    point.preview,
    ...(point.keywords || []),
    ...(point.aliases || []),
    ...(point.tags || []),
    point.indexText,
    bodyText,
  ];
}

function getSearchScore(point, query, bodyText) {
  let score = 0;
  const title = normalizeSearchText(point.title);
  const summary = normalizeSearchText(point.summary);
  const preview = normalizeSearchText(point.preview);
  const keywords = (point.keywords || []).map(normalizeSearchText);
  const aliases = (point.aliases || []).map(normalizeSearchText);
  const tags = (point.tags || []).map(normalizeSearchText);
  const indexText = normalizeSearchText(point.indexText);
  const body = normalizeSearchText(bodyText);

  if (title.includes(query)) score += 100;
  if (keywords.some((item) => item.includes(query))) score += 70;
  if (aliases.some((item) => item.includes(query))) score += 60;
  if (tags.some((item) => item.includes(query))) score += 40;
  if (summary.includes(query)) score += 25;
  if (preview.includes(query)) score += 20;
  if (indexText.includes(query)) score += 15;
  if (body.includes(query)) score += 10;

  return score;
}

function getMatchInfo(point, query, bodyText) {
  const fields = [
    ["标题", point.title],
    ["关键词", (point.keywords || []).find((item) => normalizeSearchText(item).includes(query))],
    ["别名", (point.aliases || []).find((item) => normalizeSearchText(item).includes(query))],
    ["标签", (point.tags || []).find((item) => normalizeSearchText(item).includes(query))],
    ["摘要", point.summary],
    ["速览", point.preview],
    ["正文索引", point.indexText],
    ["正文", bodyText],
  ];
  const matched = fields.find(([, value]) => normalizeSearchText(value).includes(query));
  if (!matched) return { matchText: "", preview: point.summary || point.preview || "" };

  const [field, value] = matched;
  const raw = String(value || "").replace(/\s+/g, " ").trim();
  const index = normalizeSearchText(raw).indexOf(query);
  // 中文内容通常没有空格；截取命中附近的正文，保证结果页能解释为何命中。
  const start = Math.max(0, index - 24);
  const preview = raw.length > 92 ? `${start ? "…" : ""}${raw.slice(start, start + 92)}${start + 92 < raw.length ? "…" : ""}` : raw;
  return { matchText: `命中${field}`, preview };
}

function searchNotePoints({ keyword = "", moduleId, categoryId, includeModuleIds, commonSensePartId } = {}) {
  const query = normalizeSearchText(keyword);
  if (isStopWordOnly(query)) return [];
  const module = moduleId ? getNoteModule(moduleId) : null;
  const category = moduleId && categoryId ? getNoteCategory(moduleId, categoryId) : null;
  const modulesToSearch = Array.isArray(includeModuleIds) && includeModuleIds.length
    ? noteModules.filter((item) => includeModuleIds.includes(item.id))
    : noteModules;
  const points = moduleId
    ? (categoryId ? getNotePointsByCategory(moduleId, categoryId) : getNotePoints(moduleId))
    : modulesToSearch.flatMap((item) => getNotePoints(item.id));
  const scopedPoints = commonSensePartId
    ? points.filter((point) => getCommonSensePath(point)[0]?.id === commonSensePartId)
    : points;

  return scopedPoints
    .map((point) => {
      const resolvedModuleId = moduleId || noteModules.find((item) => getNotePoints(item.id).some((candidate) => candidate.id === point.id && candidate.categoryId === point.categoryId))?.id;
      if (!resolvedModuleId) return null;
      const pointModule = module || getNoteModule(resolvedModuleId);
      const pointCategory = getNoteCategory(resolvedModuleId, point.categoryId);
      const bodyText = getPointBodyText(point);
      const searchText = collectSearchText(point, bodyText).map(normalizeSearchText).filter(Boolean);
      const matched = !query || searchText.some((item) => item.includes(query));
      if (!matched) return null;
      const matchInfo = getMatchInfo(point, query, bodyText);
      const matchTab = (point.tabs || []).find((tab) => normalizeSearchText(tab.title) === query)
        || (point.tabs || []).find((tab) => normalizeSearchText(tab.title).includes(query))
        || (point.tabs || []).find((tab) => normalizeSearchText(getPointBodyText({ tabs: [tab] })).includes(query));
      return {
        ...point,
        module: pointModule,
        category: pointCategory,
        score: query ? getSearchScore(point, query, bodyText) : 0,
        matchText: matchInfo.matchText,
        matchTabId: matchTab?.id || "",
        matchTabTitle: matchTab?.title || "",
        preview: matchInfo.preview,
        path: getSearchPath(resolvedModuleId, point, pointCategory),
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
