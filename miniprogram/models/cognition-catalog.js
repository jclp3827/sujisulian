const flashCalcLevelGroups = [
  {
    id: "basic",
    title: "基础阶段",
    levels: [
      { id: "fc-1", title: "难度1", subtitle: "个位数", digits: 1, allowNegative: false, columns: 1, rounds: 10, displayMs: 800 },
      { id: "fc-2", title: "难度2", subtitle: "两位数", digits: 2, allowNegative: false, columns: 1, rounds: 10, displayMs: 850 },
      { id: "fc-3", title: "难度3", subtitle: "三位数", digits: 3, allowNegative: false, columns: 1, rounds: 10, displayMs: 900 },
    ],
  },
  {
    id: "advanced",
    title: "进阶阶段",
    levels: [
      { id: "fc-4", title: "难度4", subtitle: "个位数+负数", digits: 1, allowNegative: true, columns: 1, rounds: 10, displayMs: 850 },
      { id: "fc-5", title: "难度5", subtitle: "两位数+负数", digits: 2, allowNegative: true, columns: 1, rounds: 10, displayMs: 900 },
      { id: "fc-6", title: "难度6", subtitle: "三位数+负数", digits: 3, allowNegative: true, columns: 1, rounds: 10, displayMs: 950 },
    ],
  },
  {
    id: "challenge",
    title: "挑战阶段",
    levels: [
      { id: "fc-7", title: "难度7", subtitle: "双列个位数", digits: 1, allowNegative: false, columns: 2, rounds: 10, displayMs: 900 },
      { id: "fc-8", title: "难度8", subtitle: "双列两位数", digits: 2, allowNegative: false, columns: 2, rounds: 10, displayMs: 950 },
      { id: "fc-9", title: "难度9", subtitle: "双列三位数", digits: 3, allowNegative: false, columns: 2, rounds: 10, displayMs: 1000 },
    ],
  },
];

const cognitionModules = {
  schulte: {
    id: "schulte",
    groupId: "search",
    title: "舒尔特方格",
    heading: "专注搜索训练",
    type: "schulte",
    available: true,
    descriptionLines: [
      "按顺序寻找并点击数字方格",
      "重点提升专注度、搜索效率和反应速度",
    ],
    levels: [
      { id: "3x3", title: "基础", subtitle: "3×3", size: 3, countdown: 3 },
      { id: "4x4", title: "进阶", subtitle: "4×4", size: 4, countdown: 3 },
      { id: "5x5", title: "专业", subtitle: "5×5", size: 5, countdown: 3 },
      { id: "6x6", title: "专家", subtitle: "6×6", size: 6, countdown: 3 },
      { id: "7x7", title: "大师", subtitle: "7×7", size: 7, countdown: 3 },
      { id: "8x8", title: "精英", subtitle: "8×8", size: 8, countdown: 3 },
      { id: "9x9", title: "极限", subtitle: "9×9", size: 9, countdown: 3 },
    ],
  },
  "rolling-schulte": {
    id: "rolling-schulte",
    groupId: "search",
    title: "滚动舒尔特",
    heading: "动态找数训练",
    type: "rolling-schulte",
    available: true,
    descriptionLines: [
      "以4×4方格为基础，按顺序持续找数",
      "每次点击后都会刷新新数字，节奏更快",
      "适合强化注意分配和连续搜索能力",
    ],
    levels: [{ id: "standard", title: "标准模式", subtitle: "4×4", size: 4, duration: 30 }],
  },
  "flash-memory": {
    id: "flash-memory",
    groupId: "memory",
    title: "瞬间记忆",
    heading: "视觉记忆训练",
    type: "flash-memory",
    available: true,
    descriptionLines: [
      "先记住画面中的数字位置",
      "再根据提示找出对应目标",
      "训练瞬时记忆、视觉定位和判断速度",
    ],
    levels: [
      { id: "starter", title: "入门", size: 3, lives: 3, targetMode: "ordered", previewCountdown: 3 },
      { id: "simple", title: "简单", size: 3, lives: 3, targetMode: "random", previewCountdown: 3 },
      { id: "normal", title: "一般", size: 4, lives: 3, targetMode: "random", previewCountdown: 3 },
      { id: "plus", title: "提高", size: 4, lives: 2, targetMode: "random", previewCountdown: 3 },
      { id: "hard", title: "困难", size: 5, lives: 2, targetMode: "random", previewCountdown: 3 },
      { id: "brain", title: "最强大脑", size: 5, lives: 1, targetMode: "random", previewCountdown: 3 },
      { id: "yyds", title: "yyds", size: 6, lives: 1, targetMode: "ordered", previewCountdown: 3 },
    ],
  },
  "flash-calc": {
    id: "flash-calc",
    groupId: "memory",
    title: "闪电心算",
    heading: "心算连加训练",
    type: "flash-calc",
    available: true,
    descriptionLines: [
      "数字会逐个出现，需要在脑中连续累加",
      "点击后进入下一步，结束时填写总和",
      "适合训练心算稳定性和短时保持能力",
    ],
    levelGroups: flashCalcLevelGroups,
    levels: flashCalcLevelGroups.flatMap((group) => group.levels),
  },
};

const cognitionGroups = [
  { id: "search", title: "搜索与专注", moduleIds: ["schulte", "rolling-schulte"] },
  { id: "memory", title: "记忆与心算", moduleIds: ["flash-memory", "flash-calc"] },
];

function toSectionItem(module) {
  return {
    id: module.id,
    title: module.title,
    available: module.available !== false,
  };
}

const cognitionSection = {
  id: "cognition",
  title: "思维能力训练",
  description: "通过节奏化训练，提升专注、记忆与心算反应",
  available: true,
  type: "single",
  flow: "cognition",
  groups: cognitionGroups.map((group) => ({
    id: group.id,
    title: group.title,
    items: group.moduleIds
      .map((moduleId) => cognitionModules[moduleId])
      .filter(Boolean)
      .map(toSectionItem),
  })),
};

function getCognitionModule(itemId) {
  return cognitionModules[itemId] || null;
}

function getCognitionLevel(itemId, levelId) {
  const module = getCognitionModule(itemId);
  if (!module) return null;
  return (module.levels || []).find((level) => level.id === levelId) || null;
}

module.exports = {
  cognitionSection,
  cognitionGroups,
  cognitionModules,
  getCognitionModule,
  getCognitionLevel,
};
