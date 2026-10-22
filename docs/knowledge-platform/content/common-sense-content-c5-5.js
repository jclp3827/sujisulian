// C5-5: add one bounded market-failure overview theme from audited body content.
// All authored material remains review-only until a separate human content review.
const { ref, question } = require("./learning-authoring");

const overview = ref("market-failure-factors", "market-failure-overview", "cs-23-30-p13-market-failure-factors-overview-list");

const target = (id, statement, conclusion, excludes) => ({
  id, revision: 1, status: "review", scope: "economics", groupId: "market-failure-four-factors",
  statement, conclusion, conditions: ["只按正文总览识别导致市场失灵的四类因素。"], excludes, refs: [overview],
});

const targets = [
  target("cs-target-market-failure-monopoly-factor", "能识别垄断是导致市场失灵的一类因素。", "垄断属于正文列出的市场失灵因素。", ["不在总览主题解释垄断如何造成市场失灵。"]),
  target("cs-target-market-failure-externality-factor", "能识别外部性是导致市场失灵的一类因素。", "外部性属于正文列出的市场失灵因素。", ["不在总览主题区分正外部性、负外部性及治理方式。"]),
  target("cs-target-market-failure-public-goods-factor", "能识别公共物品是导致市场失灵的一类因素。", "公共物品属于正文列出的市场失灵因素。", ["不在总览主题展开非竞争性、非排他性和搭便车。"]),
  target("cs-target-market-failure-information-factor", "能识别信息不对称是导致市场失灵的一类因素。", "信息不对称属于正文列出的市场失灵因素。", ["不在总览主题展开逆向选择和道德风险。"]),
];

const addedQuestions = [
  question("market-failure-factor-monopoly", "economics", "market-failure-four-factors", "识别垄断这一因素",
    "下列哪一项属于正文列出的市场失灵因素？", ["垄断", "货币流通速度", "劳动生产率"], 0,
    "正文列出的四类因素包括垄断、外部性、公共物品和信息不对称。", "本题只检测总览名单，不解释垄断机制。", [overview]),
  question("market-failure-factor-externality", "economics", "market-failure-four-factors", "识别外部性这一因素",
    "某项经济活动影响了与活动无关的第三方。仅按市场失灵因素总览，这提示哪一类因素？", ["公共物品", "外部性", "通货膨胀"], 1,
    "外部性是正文列出的市场失灵因素之一；其具体定义和正负分类留到独立主题。", "本题不要求判断正外部性或负外部性。", [overview]),
  question("market-failure-factor-public-goods", "economics", "market-failure-four-factors", "识别公共物品这一因素",
    "下列哪一项与垄断、外部性、信息不对称共同构成正文列出的四类市场失灵因素？", ["公共物品", "私人物品", "消费税"], 0,
    "四类因素是垄断、外部性、公共物品和信息不对称。", "本题不展开公共物品的特征和供给方式。", [overview]),
  question("market-failure-factor-information", "economics", "market-failure-four-factors", "识别信息不对称这一因素",
    "交易双方掌握的信息存在差异。仅按正文总览，应归入哪一类市场失灵因素？", ["规模经济", "信息不对称", "价格歧视"], 1,
    "信息不对称属于正文列出的市场失灵因素之一。", "本题不展开逆向选择、道德风险及具体治理措施。", [overview]),
  question("market-failure-four-factors-full", "economics", "market-failure-four-factors", "完整复辨四类因素",
    "下列哪一组完整对应正文列出的市场失灵四类因素？", ["垄断、外部性、公共物品、信息不对称", "通货膨胀、失业、财政赤字、贸易逆差", "供给、需求、价格、竞争"], 0,
    "正文总览列出垄断、外部性、公共物品和信息不对称四类因素。", "完整名单题不替代对四类因素具体机制的学习。", [overview]),
];

const questionSpecifications = [
  ["market-failure-factor-monopoly", ["cs-target-market-failure-monopoly-factor"], [], "direct-factor", { 1: "货币流通速度不在正文四类因素总览中。", 2: "劳动生产率不在正文四类因素总览中。" }],
  ["market-failure-factor-externality", ["cs-target-market-failure-externality-factor"], [], "scenario-factor", { 0: "公共物品是另一类因素，但题干描述的是第三方影响。", 2: "通货膨胀不在正文四类因素总览中。" }],
  ["market-failure-factor-public-goods", ["cs-target-market-failure-public-goods-factor"], [], "direct-factor", { 1: "正文列出公共物品，不是私人物品。", 2: "消费税不在正文四类因素总览中。" }],
  ["market-failure-factor-information", ["cs-target-market-failure-information-factor"], [], "scenario-factor", { 0: "规模经济不等同于交易双方信息存在差异。", 2: "价格歧视不是正文这处总览中的四类因素名称。" }],
  ["market-failure-four-factors-full", ["cs-target-market-failure-monopoly-factor", "cs-target-market-failure-externality-factor", "cs-target-market-failure-public-goods-factor", "cs-target-market-failure-information-factor"], [], "full-list-recheck", { 1: "该组是宏观经济现象，不是正文列出的四类市场失灵因素。", 2: "该组是市场运行的一般概念，不是正文列出的四类因素。" }],
].map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));

const mnemonics = [{
  id: "market-failure-four-factors-memory", revision: 1, status: "review", scope: "economics",
  title: "市场失灵四类因素", purpose: "用一个短句完整回忆正文总览中的四类因素。",
  text: "垄外公共信息差。", method: "首字压缩",
  coverage: "导致市场失灵的四类因素名称：垄断、外部性、公共物品、信息不对称。",
  conditions: ["“垄外公共信息差”只用于回忆四类名称，完整答题时应还原为规范表述。"],
  excludes: ["四类因素导致市场失灵的具体机制", "正负外部性、公共物品特征、逆向选择和道德风险"],
  phrases: [
    { id: "market-failure-memory-monopoly", phrase: "垄", meaning: "垄断。", targetIds: ["cs-target-market-failure-monopoly-factor"], coverageType: "factor-name", conditionRefs: [], refs: [overview], questionIds: ["market-failure-factor-monopoly", "market-failure-four-factors-full"], checks: [
      { questionId: "market-failure-factor-monopoly", checkPurpose: "direct-factor", reviewTarget: "phrase", reviewAnchorId: "market-failure-memory-monopoly" },
      { questionId: "market-failure-four-factors-full", checkPurpose: "full-list-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-memory-monopoly" },
    ] },
    { id: "market-failure-memory-externality", phrase: "外", meaning: "外部性。", targetIds: ["cs-target-market-failure-externality-factor"], coverageType: "factor-name", conditionRefs: [], refs: [overview], questionIds: ["market-failure-factor-externality", "market-failure-four-factors-full"], checks: [
      { questionId: "market-failure-factor-externality", checkPurpose: "scenario-factor", reviewTarget: "phrase", reviewAnchorId: "market-failure-memory-externality" },
      { questionId: "market-failure-four-factors-full", checkPurpose: "full-list-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-memory-externality" },
    ] },
    { id: "market-failure-memory-public-goods", phrase: "公共", meaning: "公共物品。", targetIds: ["cs-target-market-failure-public-goods-factor"], coverageType: "factor-name", conditionRefs: [], refs: [overview], questionIds: ["market-failure-factor-public-goods", "market-failure-four-factors-full"], checks: [
      { questionId: "market-failure-factor-public-goods", checkPurpose: "direct-factor", reviewTarget: "phrase", reviewAnchorId: "market-failure-memory-public-goods" },
      { questionId: "market-failure-four-factors-full", checkPurpose: "full-list-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-memory-public-goods" },
    ] },
    { id: "market-failure-memory-information", phrase: "信息差", meaning: "信息不对称。", targetIds: ["cs-target-market-failure-information-factor"], coverageType: "factor-name", conditionRefs: [], refs: [overview], questionIds: ["market-failure-factor-information", "market-failure-four-factors-full"], checks: [
      { questionId: "market-failure-factor-information", checkPurpose: "scenario-factor", reviewTarget: "phrase", reviewAnchorId: "market-failure-memory-information" },
      { questionId: "market-failure-four-factors-full", checkPurpose: "full-list-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-memory-information" },
    ] },
  ],
  questionIds: addedQuestions.map((item) => item.id),
}];

const mnemonicPhraseTargetRelations = mnemonics.flatMap((mnemonic) => mnemonic.phrases.map((phrase, phraseIndex) => ({
  mnemonicId: mnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
  coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
})));
const mnemonicSpecifications = mnemonics.map((mnemonic) => ({
  mnemonicId: mnemonic.id, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method,
  conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id), selfTestQuestionIds: mnemonic.questionIds.slice(),
}));
const variationDecisions = targets.map((target, index) => ({
  targetId: target.id,
  directQuestionIds: [addedQuestions[index].id],
  variationQuestionIds: ["market-failure-four-factors-full"],
}));
const groups = [{
  id: "market-failure-four-factors", title: "市场失灵的四类因素", scope: "economics",
  reason: "先把四类因素记完整，再分别进入具体机制。", questionIds: addedQuestions.map((item) => item.id),
}];

const sourceDispositions = [
  { candidateId: "market-failure-four-factors", pointId: "market-failure-factors", tabIds: ["market-failure-overview"], status: "已建设", batch: "C5-5", scope: "市场失灵四类因素总览；不在本主题展开具体机制" },
  { candidateId: "market-failure-monopoly-mechanism", pointId: "market-failure-factors", tabIds: ["market-failure-monopoly"], status: "可建设", batch: "C5-5", scope: "垄断含义、导致市场失灵的作用链与正文治理方式" },
  { candidateId: "market-failure-externality-mechanism", pointId: "market-failure-factors", tabIds: ["market-failure-externality"], status: "可建设", batch: "C5-5", scope: "外部性定义、正负分类、资源配置影响与正文治理方式" },
  { candidateId: "market-failure-public-goods-mechanism", pointId: "market-failure-factors", tabIds: ["market-failure-public-goods"], status: "可建设", batch: "C5-5", scope: "公共物品特征、分类、搭便车和正文供给方式" },
  { candidateId: "market-failure-information-mechanism", pointId: "market-failure-factors", tabIds: ["market-failure-information"], status: "可建设", batch: "C5-5", scope: "信息不对称含义、逆向选择、道德风险与正文治理方式" },
];

function applyQuestions(questions) { return questions.concat(addedQuestions); }
function applyGroups(existing) { return existing.concat(groups); }
function applyMnemonics(existing) { return existing.concat(mnemonics); }
function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  const questionIds = addedQuestions.map((item) => item.id);
  plan.revision = 11;
  plan.modes.qa.groupIds.push(groups[0].id);
  plan.modes.qa.questionIds.push(...questionIds);
  plan.modes.mnemonic.questionIds.push(...questionIds);
  plan.modes.mnemonic.mnemonicIds.push(mnemonics[0].id);
  return plan;
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-5", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
    ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions,
  sessionMigrations: [{
    fromVersion: "492636da", toPackVersion: "2026-10-21.9",
    changedQuestionIds: addedQuestions.map((item) => item.id), changedMnemonicIds: mnemonics.map((item) => item.id),
    reason: "C5-5 新增市场失灵四类因素总览学习组；既有会话继续保留，新主题从新的五题学习组开始。",
  }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
