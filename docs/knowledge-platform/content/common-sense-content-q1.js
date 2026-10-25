"use strict";

// Q1: two-topic quality pilot. All resources remain review-only until the
// per-question content review and two independent form-only reviews pass.
const { ref, question } = require("./learning-authoring");

const nanjing = ref("late-qing-invasions", "treaty-of-nanjing", "cs-1-9-p14-treaty-of-nanjing-list");
const shimonoseki = ref("first-sino-japanese-war", "treaty-of-shimonoseki", "cs-1-9-p15-treaty-of-shimonoseki-list");
const boxer = ref("boxer-rebellion-eight-nation-alliance", "boxer-protocol", "cs-1-9-p16-boxer-protocol-list");
const marketOverview = ref("market-failure-factors", "market-failure-overview", "cs-23-30-p13-market-failure-factors-overview-list");
const externality = ref("market-failure-factors", "market-failure-externality", "cs-23-30-p13-market-failure-externality-list");
const information = ref("market-failure-factors", "market-failure-information", "cs-23-30-p14-market-failure-information-asymmetry-list");

const target = (id, scope, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope, groupId, statement, conclusion, conditions, excludes, refs,
});

const targets = [
  target("q1-target-nanjing-treaty", "humanities-history", "q1-modern-treaty-contrast",
    "能用割香港岛、开放五口、协定关税识别《南京条约》。",
    "割香港岛、开放广州厦门福州宁波上海五口、协定关税属于《南京条约》。",
    ["只用条约中的高辨识度条款判断。"], ["不在本组记忆赔款数字或条约全部影响。"], [nanjing]),
  target("q1-target-shimonoseki-treaty", "humanities-history", "q1-modern-treaty-contrast",
    "能用割辽台澎、允许在口岸设厂识别《马关条约》。",
    "割辽东半岛、台湾、澎湖列岛并允许日本在口岸开工厂属于《马关条约》。",
    ["辽东半岛须与台湾、澎湖列岛及设厂条款一并辨认。"], ["不在本组展开三国干涉还辽的后续过程。"], [shimonoseki]),
  target("q1-target-boxer-protocol", "humanities-history", "q1-modern-treaty-contrast",
    "能用划使馆界、允许驻兵识别《辛丑条约》。",
    "划定北京东交民巷为使馆界并允许各国驻兵属于《辛丑条约》。",
    ["使馆界和驻兵应作为同一组高辨识度条款理解。"], ["不在本组背诵赔款本息计算。"], [boxer]),
  target("q1-target-market-failure-four-factors", "economics", "q1-market-failure",
    "能完整识别垄断、外部性、公共物品、信息不对称四类市场失灵因素。",
    "导致市场失灵的四类因素是垄断、外部性、公共物品和信息不对称。",
    ["先识别四类名称，再进入具体机制。"], ["不把通货膨胀、财政赤字等宏观现象混入四类因素。"], [marketOverview]),
  target("q1-target-market-failure-external-cost", "economics", "q1-market-failure",
    "能依据未计入价格的第三方成本识别负外部性。",
    "经济活动让未直接参与该项生产或交易的第三方承担未获补偿的成本，属于负外部性。",
    ["第三方未直接参与该项生产或交易，且成本未得到补偿。"], ["不按行为者主观动机判断正负。"], [externality]),
  target("q1-target-market-failure-adverse-selection", "economics", "q1-market-failure",
    "能依据交易前的信息差和劣品驱逐优品识别逆向选择。",
    "交易前买卖双方信息不对称并导致差的商品驱逐好的商品，属于逆向选择。",
    ["保留交易前的信息不对称和劣品驱逐优品两个条件。"], ["不把交易后的隐蔽行动误判为逆向选择。"], [information]),
];

const addedQuestions = [
  question("q1-treaty-quick-recall", "humanities-history", "q1-modern-treaty-contrast", "用高辨识度条款识别《南京条约》",
    "“割香港岛、开放五口、协定关税”对应哪一条约？",
    ["《马关条约》", "《南京条约》", "《辛丑条约》"], 1,
    "割香港岛、开放广州等五口并协定关税，是《南京条约》的高辨识度条款。",
    "判断时抓条款组合，不用签约年份单独猜测。", [nanjing, shimonoseki, boxer]),
  question("q1-treaty-boundary", "humanities-history", "q1-modern-treaty-contrast", "区分《马关条约》与《辛丑条约》的条款边界",
    "下列条约与高辨识度条款的对应，哪一项正确？",
    ["《南京条约》—开放沙市重庆苏州杭州并允许设厂", "《马关条约》—划东交民巷为使馆界并允许驻兵", "《辛丑条约》—划东交民巷为使馆界并允许驻兵"], 2,
    "划东交民巷为使馆界并允许驻兵对应《辛丑条约》；开放沙市、重庆、苏州、杭州并允许设厂对应《马关条约》。",
    "本题只比较可直接区分条约的条款，不展开条约影响。", [nanjing, shimonoseki, boxer]),
  question("q1-treaty-material", "humanities-history", "q1-modern-treaty-contrast", "在短材料中按条款顺序识别三项条约",
    "某复习材料依次写道：“割香港岛、开五口”；“割辽台澎、允许设厂”；“划使馆界、允许驻兵”。对应顺序是什么？",
    ["《南京条约》—《马关条约》—《辛丑条约》", "《马关条约》—《南京条约》—《辛丑条约》", "《辛丑条约》—《马关条约》—《南京条约》"], 0,
    "三组条款依次对应《南京条约》《马关条约》《辛丑条约》。",
    "材料使用高辨识度条款的缩写，作答时应还原完整名称。", [nanjing, shimonoseki, boxer]),
  question("q1-market-quick-recall", "economics", "q1-market-failure", "完整识别市场失灵四类因素",
    "造成市场失灵的四类因素，哪一组列举完整？",
    ["垄断、通货膨胀、公共物品、财政赤字", "外部性、失业、价格竞争、国际收支", "垄断、外部性、公共物品、信息不对称"], 2,
    "四类因素是垄断、外部性、公共物品和信息不对称。",
    "本题只检查四类名称，具体机制由后续辨析题检验。", [marketOverview]),
  question("q1-market-boundary", "economics", "q1-market-failure", "区分负外部性与信息不对称",
    "某工厂排放使附近居民承担健康成本，居民未获补偿，这部分成本也没有计入产品价格。该情形首先体现什么？",
    ["负外部性造成的外部成本", "信息不对称造成的逆向选择", "公共物品造成的搭便车问题"], 0,
    "居民未直接参与该项生产或交易，却承担未获补偿且未计入价格的成本，因此首先体现负外部性。",
    "信息差、公共物品和外部性都可能造成市场失灵，但判断条件不同。", [marketOverview, externality, information]),
  question("q1-market-application", "economics", "q1-market-failure", "在两个短情境中区分负外部性与逆向选择",
    "甲工厂排放使附近居民承担未补偿成本；乙市场交易前卖方知道车辆隐患，买方难以识别，优质二手车逐渐退出。两种情形依次属于什么？",
    ["逆向选择、负外部性", "负外部性、逆向选择", "公共物品、道德风险"], 1,
    "甲让未直接参与该项生产或交易的第三方承担未补偿成本，属于负外部性；乙在交易前存在信息差并出现劣品驱逐优品，属于逆向选择。",
    "逆向选择发生在交易前；道德风险通常关注交易后的隐蔽行动。", [marketOverview, externality, information]),
].map((item) => ({ ...item, assessmentType: "learning-card", examBasis: { originType: "self-authored", displayLabel: "自编学习题" } }));

const specs = [
  ["q1-treaty-quick-recall", ["q1-target-nanjing-treaty"], [], "q1-quick-recall", "recall", { 0: "《马关条约》的高辨识度条款是割辽台澎并允许设厂。", 2: "《辛丑条约》的高辨识度条款是划使馆界并允许驻兵。" }],
  ["q1-treaty-boundary", ["q1-target-boxer-protocol"], ["q1-target-shimonoseki-treaty"], "q1-adjacent-boundary", "distinction", { 0: "开放沙市、重庆、苏州、杭州并允许设厂对应《马关条约》，不是《南京条约》。", 1: "划使馆界并允许驻兵对应《辛丑条约》，不是《马关条约》。" }],
  ["q1-treaty-material", ["q1-target-nanjing-treaty", "q1-target-shimonoseki-treaty", "q1-target-boxer-protocol"], [], "q1-sequence-recall", "distinction", { 1: "前两组被调换；割香港岛、开五口应先对应《南京条约》。", 2: "首尾被调换；使馆界、驻兵应对应《辛丑条约》。" }],
  ["q1-market-quick-recall", ["q1-target-market-failure-four-factors"], [], "q1-quick-recall", "recall", { 0: "通货膨胀和财政赤字不在这四类因素的列举中。", 1: "失业、价格竞争和国际收支不在这四类因素的列举中。" }],
  ["q1-market-boundary", ["q1-target-market-failure-external-cost"], ["q1-target-market-failure-adverse-selection", "q1-target-market-failure-four-factors"], "q1-condition-boundary", "condition", { 1: "题干没有交易双方的信息差或劣品驱逐优品，不能判断为逆向选择。", 2: "题干没有公共物品的非竞争、非排他或搭便车条件。" }],
  ["q1-market-application", ["q1-target-market-failure-external-cost", "q1-target-market-failure-adverse-selection"], ["q1-target-market-failure-four-factors"], "q1-scenario-application", "application", { 0: "两个情形的顺序颠倒：第三方未补偿成本在先，交易前信息差在后。", 2: "工厂排放不是公共物品问题，二手车交易前的信息差也不是交易后的道德风险。" }],
];
const questionSpecifications = specs.map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, cognitiveLevel, distractorReasons]) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, cognitiveLevel, distractorReasons }));
const questionTargetRelations = questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }));

const treatyMnemonic = {
  id: "q1-modern-treaty-contrast-memory", revision: 1, status: "review", scope: "humanities-history",
  title: "三条约高辨识度条款", purpose: "用三段顺序锚点区分《南京条约》《马关条约》《辛丑条约》。",
  text: "南港五关税，马辽台澎厂，辛馆驻兵。", method: "条约首字与高辨识度条款顺序压缩",
  coverage: "《南京条约》的香港岛、五口、协定关税；《马关条约》的辽台澎与设厂；《辛丑条约》的使馆界与驻兵。",
  conditions: ["每段首字对应条约名，其余字块只提示高辨识度条款；作答时必须还原完整条款。"],
  excludes: ["赔款具体数额、签约国家列表和三国干涉还辽后续", "三个条约的全部历史影响"],
  learningForm: "structural-mnemonic", formLabel: "结构口诀",
  phrases: [
    { id: "q1-treaty-memory-nanjing", phrase: "南港五关税", meaning: "《南京条约》：割香港岛、开放五口、协定关税。", targetIds: ["q1-target-nanjing-treaty"], coverageType: "treaty-clause-contrast", conditionRefs: [], refs: [nanjing], questionIds: ["q1-treaty-quick-recall", "q1-treaty-material"], checks: [
      { questionId: "q1-treaty-quick-recall", checkPurpose: "q1-quick-recall", reviewTarget: "phrase", reviewAnchorId: "q1-treaty-memory-nanjing" },
      { questionId: "q1-treaty-material", checkPurpose: "q1-sequence-recall", reviewTarget: "meaning", reviewAnchorId: "q1-treaty-memory-nanjing" },
    ] },
    { id: "q1-treaty-memory-shimonoseki", phrase: "马辽台澎厂", meaning: "《马关条约》：割辽东半岛、台湾、澎湖列岛，允许在口岸设厂。", targetIds: ["q1-target-shimonoseki-treaty"], coverageType: "treaty-clause-contrast", conditionRefs: [], refs: [shimonoseki], questionIds: ["q1-treaty-boundary", "q1-treaty-material"], checks: [
      { questionId: "q1-treaty-boundary", checkPurpose: "q1-adjacent-boundary", reviewTarget: "phrase", reviewAnchorId: "q1-treaty-memory-shimonoseki" },
      { questionId: "q1-treaty-material", checkPurpose: "q1-sequence-recall", reviewTarget: "meaning", reviewAnchorId: "q1-treaty-memory-shimonoseki" },
    ] },
    { id: "q1-treaty-memory-boxer", phrase: "辛馆驻兵", meaning: "《辛丑条约》：划使馆界、允许驻兵。", targetIds: ["q1-target-boxer-protocol"], coverageType: "treaty-clause-contrast", conditionRefs: [], refs: [boxer], questionIds: ["q1-treaty-boundary", "q1-treaty-material"], checks: [
      { questionId: "q1-treaty-boundary", checkPurpose: "q1-adjacent-boundary", reviewTarget: "phrase", reviewAnchorId: "q1-treaty-memory-boxer" },
      { questionId: "q1-treaty-material", checkPurpose: "q1-sequence-recall", reviewTarget: "meaning", reviewAnchorId: "q1-treaty-memory-boxer" },
    ] },
  ],
  questionIds: ["q1-treaty-quick-recall", "q1-treaty-boundary", "q1-treaty-material"],
};
const mnemonics = [treatyMnemonic];
const mnemonicSpecifications = [{
  mnemonicId: treatyMnemonic.id, revision: treatyMnemonic.revision, purpose: treatyMnemonic.purpose, method: treatyMnemonic.method,
  conditionCount: treatyMnemonic.conditions.length, phraseIds: treatyMnemonic.phrases.map((item) => item.id), selfTestQuestionIds: treatyMnemonic.questionIds.slice(),
}];
const mnemonicPhraseTargetRelations = treatyMnemonic.phrases.map((phrase, phraseIndex) => ({
  mnemonicId: treatyMnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
  coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
}));

const variationDecisions = [
  ["q1-target-nanjing-treaty", ["q1-treaty-quick-recall"], ["q1-treaty-material"], "由单组条款回忆改为三组条款的顺序还原。"],
  ["q1-target-shimonoseki-treaty", ["q1-treaty-boundary"], ["q1-treaty-material"], "由排除相邻条约的错误对应改为短材料顺序还原。"],
  ["q1-target-boxer-protocol", ["q1-treaty-boundary"], ["q1-treaty-material"], "由识别使馆界与驻兵的正确对应改为三条约联合定位。"],
  ["q1-target-market-failure-four-factors", ["q1-market-quick-recall"], ["q1-market-boundary", "q1-market-application"], "由完整列举改为在机制情境中识别因素类别。"],
  ["q1-target-market-failure-external-cost", ["q1-market-boundary"], ["q1-market-application"], "由单一第三方成本条件判断改为与交易前信息差并列辨析。"],
  ["q1-target-market-failure-adverse-selection", ["q1-market-application"], ["q1-market-boundary"], "直接题要求识别劣品驱逐优品；变式要求说明只有第三方成本时为何不能套用逆向选择。"],
].map(([targetId, directQuestionIds, variationQuestionIds, processDifference]) => ({ targetId, directQuestionIds, variationQuestionIds, processDifference }));

const groups = [
  { id: "q1-modern-treaty-contrast", title: "近代史条约辨析", scope: "humanities-history", reason: "按快速回忆、相邻边界和短材料顺序还原逐层辨析三项条约。", questionIds: addedQuestions.slice(0, 3).map((item) => item.id), mnemonicDecision: "structural-mnemonic", mnemonicReason: "三个条约与高辨识度条款存在稳定顺序，可用三段结构锚点反解。" },
  { id: "q1-market-failure", title: "市场失灵辨析", scope: "economics", reason: "先完整回忆四类因素，再用第三方成本和交易前信息差完成条件与应用判断。", questionIds: addedQuestions.slice(3).map((item) => item.id), mnemonicDecision: "study-outline-existing", mnemonicReason: "四类因素沿用既有速记提纲；机制判断不再强造新口诀。" },
];

function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  plan.revision += 1;
  plan.modes.qa.groupIds.push(...groups.map((item) => item.id));
  plan.modes.qa.questionIds.push(...addedQuestions.map((item) => item.id));
  plan.modes.mnemonic.questionIds.push(...treatyMnemonic.questionIds);
  plan.modes.mnemonic.mnemonicIds.push(treatyMnemonic.id);
  return plan;
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q1", status: "review-accepted",
  targets, addedQuestions, questionSpecifications, questionTargetRelations,
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations,
  variationDecisions, groups,
  sessionMigrations: [{
    fromVersion: "b065", toPackVersion: "2026-10-22.66",
    changedQuestionIds: addedQuestions.map((item) => item.id), changedMnemonicIds: mnemonics.map((item) => item.id),
    reason: "Q1 新增两个质量试点主题；既有会话保留，新增资源保持 review；独立 AI 形式盲审、领域预审和产品负责人抽样验收已完成。",
  }],
  applyEntryPlans,
};
