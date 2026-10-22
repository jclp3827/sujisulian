// C5-4: add one bounded price-discrimination theme from audited body content.
// All authored material remains review-only until a separate human content review.
const { ref, question } = require("./learning-authoring");

const priceDiscrimination = ref("monopoly-market", "monopoly-price-discrimination", "cs-23-30-p12-monopoly-price-discrimination-list");

const target = (id, statement, conclusion, conditions, excludes) => ({
  id, revision: 1, status: "review", scope: "economics", groupId: "monopoly-price-discrimination",
  statement, conclusion, conditions, excludes, refs: [priceDiscrimination],
});

const targets = [
  target("cs-target-price-discrimination-definition",
    "能根据相同等级、相同质量的商品或服务向不同接受者实行不同价格识别价格歧视。",
    "价格歧视是在商品或服务等级、质量相同的条件下，对不同接受者实行不同销售价格或收费标准。",
    ["判断时同时保留相同等级、相同质量和不同接受者三个条件。"],
    ["不讨论不同成本、不同质量产品的合理价差。", "不判断具体商业行为是否合法。"]),
  target("cs-target-price-discrimination-first-degree",
    "能识别对每一单位产品按消费者愿意支付的最高价格出售的一级价格歧视。",
    "一级价格歧视按每一单位、每位消费者愿意支付的最高价格定价。",
    ["问题采用正文定义，不扩展完全攫取消费者剩余等理论结论。"],
    ["不把数量段定价归入一级。", "不讨论实现一级价格歧视所需的信息条件。"]),
  target("cs-target-price-discrimination-second-degree",
    "能识别对不同消费数量段规定不同价格的二级价格歧视。",
    "二级价格歧视按不同消费数量段定价。",
    ["区分依据是消费数量段。"],
    ["不把不同市场或消费群定价归入二级。", "不讨论具体阶梯价格设计。"]),
  target("cs-target-price-discrimination-third-degree",
    "能识别对不同市场或不同消费群收取不同价格的三级价格歧视。",
    "三级价格歧视按不同市场或不同消费群定价。",
    ["区分依据是市场或消费群。"],
    ["不把每一单位按最高意愿价格出售归入三级。", "不讨论市场分割的实现条件。"]),
];

const addedQuestions = [
  question("price-discrimination-definition", "economics", "monopoly-price-discrimination", "识别价格歧视的完整定义条件",
    "下列哪种情形符合正文对价格歧视的定义？",
    ["相同等级、相同质量的商品或服务，面向不同接受者采用不同价格", "质量更高的商品采用更高价格", "同一商品在成本上升后统一提价"], 0,
    "价格歧视强调商品或服务等级、质量相同，但对不同接受者实行不同销售价格或收费标准。",
    "本题只判断正文定义，不评价具体定价行为的合法性或合理性。", [priceDiscrimination]),
  question("price-discrimination-first-degree", "economics", "monopoly-price-discrimination", "识别一级价格歧视",
    "厂商对每一单位产品都按消费者愿意支付的最高价格出售，属于哪一级价格歧视？",
    ["一级价格歧视", "二级价格歧视", "三级价格歧视"], 0,
    "一级价格歧视对每一单位产品都按消费者愿意支付的最高价格出售。",
    "本题不讨论一级价格歧视的现实可行性和福利结果。", [priceDiscrimination]),
  question("price-discrimination-second-degree", "economics", "monopoly-price-discrimination", "识别二级价格歧视",
    "厂商对不同的消费数量段规定不同价格，属于哪一级价格歧视？",
    ["一级价格歧视", "二级价格歧视", "三级价格歧视"], 1,
    "二级价格歧视按不同消费数量段规定不同价格。",
    "本题只识别数量段这一正文标准，不扩展具体阶梯价格方案。", [priceDiscrimination]),
  question("price-discrimination-third-degree", "economics", "monopoly-price-discrimination", "识别三级价格歧视",
    "厂商对不同市场或不同消费群收取不同价格，属于哪一级价格歧视？",
    ["一级价格歧视", "二级价格歧视", "三级价格歧视"], 2,
    "三级价格歧视按不同市场或不同消费群收取不同价格。",
    "本题不判断具体市场划分是否成立。", [priceDiscrimination]),
  question("price-discrimination-three-levels", "economics", "monopoly-price-discrimination", "综合复辨三级价格歧视",
    "下列关于三级价格歧视的对应，哪一项完整正确？",
    ["一级—按消费数量段；二级—按不同消费群；三级—每单位按最高支付意愿", "一级—每单位按最高支付意愿；二级—按消费数量段；三级—按不同市场或消费群", "一级—按不同市场；二级—每单位统一价格；三级—按商品质量等级"], 1,
    "一级对应每一单位按消费者愿意支付的最高价格；二级对应不同消费数量段；三级对应不同市场或消费群。",
    "综合题只复核正文的三级划分，不扩展形成条件和政策评价。", [priceDiscrimination]),
];

const questionSpecifications = [
  ["price-discrimination-definition", ["cs-target-price-discrimination-definition"], [], "definition-identification", { 1: "商品质量不同，不满足正文中相同等级、相同质量的条件。", 2: "成本上升后统一提价不属于对不同接受者实行不同价格。" }],
  ["price-discrimination-first-degree", ["cs-target-price-discrimination-first-degree"], [], "direct-level", { 1: "二级价格歧视按不同消费数量段定价。", 2: "三级价格歧视按不同市场或消费群定价。" }],
  ["price-discrimination-second-degree", ["cs-target-price-discrimination-second-degree"], [], "direct-level", { 0: "一级价格歧视对每一单位按消费者愿意支付的最高价格出售。", 2: "三级价格歧视按不同市场或消费群定价。" }],
  ["price-discrimination-third-degree", ["cs-target-price-discrimination-third-degree"], [], "direct-level", { 0: "一级价格歧视对每一单位按消费者愿意支付的最高价格出售。", 1: "二级价格歧视按不同消费数量段定价。" }],
  ["price-discrimination-three-levels", ["cs-target-price-discrimination-first-degree", "cs-target-price-discrimination-second-degree", "cs-target-price-discrimination-third-degree"], ["cs-target-price-discrimination-definition"], "full-level-recheck", { 0: "该项把一级、二级和三级的区分依据全部错配。", 2: "一级、二级和三级均未按正文标准对应，商品质量等级也不是三级的划分依据。" }],
].map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));

const mnemonics = [{
  id: "price-discrimination-levels-memory", revision: 1, status: "review", scope: "economics",
  title: "三级价格歧视怎么分", purpose: "在保留价格歧视定义前提下，用三个短句区分一级、二级和三级。",
  text: "同质不同价；一级逐单位最高，二级分数量段，三级分市场人群。", method: "定义前提加递进分级",
  coverage: "价格歧视定义，以及一级、二级、三级的正文区分标准。",
  conditions: ["“同质”指相同等级、相同质量的商品或服务。", "口诀只帮助区分正文的三级划分，不代表具体商业行为必然构成价格歧视。"],
  excludes: ["实施价格歧视的经济条件和福利分析", "现实定价的合法性、成本差异与监管判断"],
  phrases: [
    { id: "price-discrimination-memory-definition", phrase: "同质不同价", meaning: "相同等级、相同质量的商品或服务，对不同接受者实行不同价格。", targetIds: ["cs-target-price-discrimination-definition"], coverageType: "definition-boundary", conditionRefs: [{ id: "price-discrimination-memory-same-quality", text: "必须保留相同等级、相同质量的前提。" }], refs: [priceDiscrimination], questionIds: ["price-discrimination-definition", "price-discrimination-three-levels"], checks: [
      { questionId: "price-discrimination-definition", checkPurpose: "definition-identification", reviewTarget: "condition", reviewAnchorId: "price-discrimination-memory-same-quality" },
      { questionId: "price-discrimination-three-levels", checkPurpose: "full-level-recheck", reviewTarget: "meaning", reviewAnchorId: "price-discrimination-memory-definition" },
    ] },
    { id: "price-discrimination-memory-first", phrase: "一级逐单位最高", meaning: "每一单位产品按消费者愿意支付的最高价格出售。", targetIds: ["cs-target-price-discrimination-first-degree"], coverageType: "level-rule", conditionRefs: [], refs: [priceDiscrimination], questionIds: ["price-discrimination-first-degree", "price-discrimination-three-levels"], checks: [
      { questionId: "price-discrimination-first-degree", checkPurpose: "direct-level", reviewTarget: "phrase", reviewAnchorId: "price-discrimination-memory-first" },
      { questionId: "price-discrimination-three-levels", checkPurpose: "full-level-recheck", reviewTarget: "meaning", reviewAnchorId: "price-discrimination-memory-first" },
    ] },
    { id: "price-discrimination-memory-second", phrase: "二级分数量段", meaning: "对不同消费数量段规定不同价格。", targetIds: ["cs-target-price-discrimination-second-degree"], coverageType: "level-rule", conditionRefs: [], refs: [priceDiscrimination], questionIds: ["price-discrimination-second-degree", "price-discrimination-three-levels"], checks: [
      { questionId: "price-discrimination-second-degree", checkPurpose: "direct-level", reviewTarget: "phrase", reviewAnchorId: "price-discrimination-memory-second" },
      { questionId: "price-discrimination-three-levels", checkPurpose: "full-level-recheck", reviewTarget: "meaning", reviewAnchorId: "price-discrimination-memory-second" },
    ] },
    { id: "price-discrimination-memory-third", phrase: "三级分市场人群", meaning: "对不同市场或不同消费群收取不同价格。", targetIds: ["cs-target-price-discrimination-third-degree"], coverageType: "level-rule", conditionRefs: [], refs: [priceDiscrimination], questionIds: ["price-discrimination-third-degree", "price-discrimination-three-levels"], checks: [
      { questionId: "price-discrimination-third-degree", checkPurpose: "direct-level", reviewTarget: "phrase", reviewAnchorId: "price-discrimination-memory-third" },
      { questionId: "price-discrimination-three-levels", checkPurpose: "full-level-recheck", reviewTarget: "meaning", reviewAnchorId: "price-discrimination-memory-third" },
    ] },
  ],
  questionIds: ["price-discrimination-definition", "price-discrimination-first-degree", "price-discrimination-second-degree", "price-discrimination-third-degree", "price-discrimination-three-levels"],
}];

const mnemonicPhraseTargetRelations = mnemonics.flatMap((mnemonic) => mnemonic.phrases.map((phrase, phraseIndex) => ({
  mnemonicId: mnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
  coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
})));
const mnemonicSpecifications = mnemonics.map((mnemonic) => ({
  mnemonicId: mnemonic.id, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method,
  conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id),
  selfTestQuestionIds: mnemonic.questionIds.slice(),
}));
const variationDecisions = [
  ["cs-target-price-discrimination-definition", ["price-discrimination-definition"], ["price-discrimination-three-levels"]],
  ["cs-target-price-discrimination-first-degree", ["price-discrimination-first-degree"], ["price-discrimination-three-levels"]],
  ["cs-target-price-discrimination-second-degree", ["price-discrimination-second-degree"], ["price-discrimination-three-levels"]],
  ["cs-target-price-discrimination-third-degree", ["price-discrimination-third-degree"], ["price-discrimination-three-levels"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));

const groups = [{
  id: "monopoly-price-discrimination", title: "三级价格歧视怎么分", scope: "economics",
  reason: "先保留定义前提，再按单位、数量段和市场人群区分三级。",
  questionIds: addedQuestions.map((item) => item.id),
}];

const sourceDispositions = [
  { candidateId: "monopoly-price-discrimination", pointId: "monopoly-market", tabIds: ["monopoly-price-discrimination"], status: "已建设", batch: "C5-4", scope: "价格歧视定义与一级、二级、三级区分，不作现实合法性判断" },
  { candidateId: "market-failure-four-factors", pointId: "market-failure-factors", tabIds: ["market-failure-overview"], status: "可建设", batch: "C5-4", scope: "市场失灵四类因素总览；各因素机制拆分为后续独立主题" },
];

function applyQuestions(questions) { return questions.concat(addedQuestions); }
function applyGroups(existing) { return existing.concat(groups); }
function applyMnemonics(existing) { return existing.concat(mnemonics); }
function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  const questionIds = addedQuestions.map((item) => item.id);
  plan.revision = 10;
  plan.modes.qa.groupIds.push(groups[0].id);
  plan.modes.qa.questionIds.push(...questionIds);
  plan.modes.mnemonic.questionIds.push(...questionIds);
  plan.modes.mnemonic.mnemonicIds.push(mnemonics[0].id);
  return plan;
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-4", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
    ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions,
  sessionMigrations: [{
    fromVersion: "3e34d010", toPackVersion: "2026-10-21.8",
    changedQuestionIds: addedQuestions.map((item) => item.id), changedMnemonicIds: mnemonics.map((item) => item.id),
    reason: "C5-4 新增价格歧视定义与三级区分学习组；既有会话继续保留，新主题从新的五题学习组开始。",
  }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
