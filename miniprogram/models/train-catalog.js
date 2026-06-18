const { cognitionSection } = require("./cognition-catalog");

const calculationAddSubItems = [
  { id: "two-digit-add-sub", title: "两位数加减", thresholds: { pass: 28, good: 22, excellent: 18 } },
  { id: "make-hundred", title: "凑整百练习", thresholds: { pass: 28, good: 22, excellent: 18 } },
  { id: "three-digit-add", title: "三位数加法", thresholds: { pass: 38, good: 30, excellent: 24 } },
  { id: "three-digit-sub", title: "三位数减法", thresholds: { pass: 38, good: 30, excellent: 24 } },
  { id: "three-digit-mix", title: "三位数加减", thresholds: { pass: 40, good: 32, excellent: 26 } },
  { id: "multi-add", title: "多数相加", thresholds: { pass: 90, good: 75, excellent: 60 } },
  { id: "mixed-add-sub", title: "混合加减", thresholds: { pass: 42, good: 34, excellent: 28 } },
];

const calculationMultiplyItems = [
  { id: "two-digit-mul-one-digit", title: "两位数乘一位数", thresholds: { pass: 38, good: 30, excellent: 24 }, tolerancePercent: 3 },
  { id: "three-digit-mul-one-digit", title: "三位数乘一位数", thresholds: { pass: 60, good: 50, excellent: 40 }, tolerancePercent: 3 },
  { id: "two-digit-mul-eleven", title: "两位数乘11", thresholds: { pass: 38, good: 30, excellent: 24 }, tolerancePercent: 3 },
  { id: "two-digit-mul-fifteen", title: "两位数乘15", thresholds: { pass: 38, good: 30, excellent: 24 }, tolerancePercent: 3 },
  { id: "two-digit-mul-two-digit", title: "两位数乘两位数", thresholds: { pass: 90, good: 75, excellent: 60 }, tolerancePercent: 3 },
  { id: "mul-estimate", title: "乘法估算", thresholds: { pass: 48, good: 40, excellent: 32 }, tolerancePercent: 5 },
];

const calculationDivisionItems = [
  { id: "three-digit-div-one-digit", title: "三位数除一位数", thresholds: { pass: 38, good: 30, excellent: 24 }, tolerancePercent: 3 },
  { id: "three-digit-div-two-digit", title: "三位数除两位数", thresholds: { pass: 90, good: 75, excellent: 60 }, tolerancePercent: 3 },
  { id: "three-digit-div-four-digit", title: "三位数除四位数", thresholds: { pass: 90, good: 75, excellent: 60 }, tolerancePercent: 3, displayAsPercent: true },
  { id: "five-digit-div-two-digit", title: "五位数除两位数", thresholds: { pass: 90, good: 75, excellent: 60 }, tolerancePercent: 3 },
];

const growthRelatedItems = [
  { id: "growth-pre", title: "估算前期量", tolerancePercent: 3 },
  { id: "growth-inc", title: "估算增长量", tolerancePercent: 3 },
  { id: "percent-calc", title: "百分化计算", tolerancePercent: 2 },
  { id: "inc-compare", title: "增量比大小", answerMode: "compare" },
  { id: "base-compare", title: "基期比大小", answerMode: "compare" },
];

const ratioRelatedItems = [
  { id: "fraction-small", title: "分数计算（分子<分母）", tolerancePercent: 2 },
  { id: "fraction-large", title: "分数计算（分子>分母）", tolerancePercent: 2 },
  { id: "base-ratio", title: "基期比重", tolerancePercent: 3 },
  { id: "fraction-compare", title: "分数比大小", answerMode: "compare" },
  { id: "annual-average", title: "年平均量", tolerancePercent: 1 },
];

const speedCalcItems = [
  { id: "assumption-tree", title: "分配树", standalonePage: true },
  { id: "estimation-split", title: "拆分估算", standalonePage: true },
  { id: "ratio-sense", title: "比例感训练", standalonePage: true },
];

const sections = [
  {
    id: "calculation",
    title: "基础计算练习",
    description: "从四则运算入手，稳步提升计算速度与准确率",
    type: "single",
    groups: [
      {
        id: "calculation-add-sub",
        title: "加减基础",
        items: calculationAddSubItems,
      },
      {
        id: "calculation-multiply",
        title: "乘法专项",
        items: calculationMultiplyItems,
      },
      {
        id: "calculation-division",
        title: "除法专项",
        items: calculationDivisionItems,
      },
    ],
  },
  {
    id: "data-analysis",
    title: "资料分析专项",
    description: "围绕高频公式与常见题型，进行资料分析单项训练",
    type: "single",
    groups: [
      {
        id: "growth-related",
        title: "增长计算",
        items: growthRelatedItems,
      },
      {
        id: "ratio-related",
        title: "比重与分数",
        items: ratioRelatedItems,
      },
      {
        id: "speed-calc-related",
        title: "假设分配法",
        items: speedCalcItems,
      },
    ],
  },
  cognitionSection,
];

function getSectionById(sectionId) {
  return sections.find((section) => section.id === sectionId) || null;
}

function getTrainingItem(sectionId, itemId) {
  const section = getSectionById(sectionId);
  if (!section) return null;

  for (const group of section.groups || []) {
    const found = (group.items || []).find((item) => item.id === itemId);
    if (found) {
      return {
        ...found,
        sectionId,
        relatedItems: group.items,
      };
    }
  }

  return null;
}

module.exports = {
  homeSections: sections.filter((section) => section.available !== false),
  getSectionById,
  getTrainingItem,
};
