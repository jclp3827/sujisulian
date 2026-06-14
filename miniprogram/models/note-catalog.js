const dataAnalysis = require("./note-data-analysis.js");

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
};
