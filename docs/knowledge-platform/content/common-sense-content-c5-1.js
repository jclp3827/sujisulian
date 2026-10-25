// C5-1: migrate two bounded legacy themes into the target/question/mnemonic contract.
// All authored material remains review-only until a separate human content review.
const { ref, question } = require("./learning-authoring");

const li = ref("pre-qin-poetry", "li-bai", "cs-10-15-p2-p3-li-bai-list");
const du = ref("pre-qin-poetry", "du-fu", "cs-10-15-p3-du-fu-list");
const fx = ref("exchange-rate-quotation", "exchange-rate-quotation", "cs-23-30-p22-exchange-rate-quotation-list");

const target = (id, scope, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope, groupId, statement, conclusion, conditions, excludes, refs,
});

const targets = [
  target("cs-target-poet-li-bai-title", "humanities-history", "poet-titles",
    "能把“诗仙”这一常用称号与李白对应。", "李白被称为“诗仙”。",
    ["问题只判断本批正文列出的文学称号。"],
    ["不覆盖李白的全部字号、生平、作品和文学评价。", "不把“诗史”当作李白的称号。"], [li]),
  target("cs-target-poet-du-fu-title", "humanities-history", "poet-titles",
    "能把“诗圣”这一常用称号与杜甫对应。", "杜甫被称为“诗圣”。",
    ["问题只判断本批正文列出的文学称号。"],
    ["不覆盖杜甫的全部字号、生平和作品。", "不把“诗史”与“诗圣”理解为同一称谓对象。"], [du]),
  target("cs-target-poet-du-fu-poetry-history", "humanities-history", "poet-titles",
    "能判断“诗史”在本批正文中评价的是杜甫的诗歌，而不是人物称号、字号或官职。",
    "“诗史”评价杜甫的诗歌；“诗圣”是杜甫的人物称号。",
    ["问题语境为本批正文对杜甫及其诗歌的常用评价。"],
    ["不把“诗史”扩展为所有现实主义诗歌的统一称号。", "不覆盖具体作品为何被称为诗史。"], [du]),
  target("cs-target-fx-direct-base", "economics", "fx-quotation",
    "能根据“以一定单位外币为基准、用本币表示其价格”判断直接标价法。",
    "直接标价法固定外币单位，用本币表示外币价格。",
    ["必须先确定观察口径中的本币和外币。"],
    ["不凭货币排列顺序或数值大小判断。", "不推导汇率涨跌和进出口影响。"], [fx]),
  target("cs-target-fx-indirect-base", "economics", "fx-quotation",
    "能根据“以一定单位本币为基准、用外币表示其价格”判断间接标价法。",
    "间接标价法固定本币单位，用外币表示本币价格。",
    ["必须先确定观察口径中的本币和外币。"],
    ["不凭货币排列顺序或数值大小判断。", "不推导汇率涨跌和进出口影响。"], [fx]),
  target("cs-target-fx-observer-context", "economics", "fx-quotation",
    "能识别判断直接或间接标价法前必须先明确哪个国家或地区的货币是本币。",
    "没有本币观察口径，不能只凭“A货币等于若干B货币”判断标价法。",
    ["同一兑换式会随观察主体不同而改变本币、外币身份。"],
    ["不讨论实时汇率、交易时点、汇率制度和货币升贬值。"], [fx]),
];

const addedQuestions = [
  question("poet-titles-cross", "humanities-history", "poet-titles", "在同一组选项中区分李白与杜甫的称号",
    "下列人物与称号的对应，哪一项完整正确？",
    ["李白—诗圣；杜甫—诗仙", "李白—诗仙；杜甫—诗圣", "李白—诗史；杜甫—诗仙"], 1,
    "李白被称为诗仙，杜甫被称为诗圣。“诗史”评价杜甫的诗歌，不是李白的人物称号。",
    "本题只对照李白与杜甫的本批称号，不扩展到二人的全部文学评价。", [li, du]),
  question("poet-sage-history-object", "humanities-history", "poet-titles", "区分诗圣称人和诗史评诗",
    "关于杜甫的“诗圣”和“诗史”，下列理解正确的是？",
    ["诗圣评价其诗歌，诗史是其官职", "诗圣称杜甫其人，诗史评价其诗歌", "诗圣与诗史都是杜甫的字号"], 1,
    "“诗圣”是杜甫的人物称号；“诗史”用于评价杜甫的诗歌。二者的评价对象不同。",
    "本题不讨论具体作品及“诗史”评价形成的文学史过程。", [du]),
  question("fx-direct-scenario", "economics", "fx-quotation", "在明确本币口径的兑换式中判断直接标价",
    "对甲国居民而言，甲币是本币、乙币是外币。报价“1单位乙币可兑换若干甲币”采用哪种标价法？",
    ["直接标价法", "间接标价法", "仅凭数值大小才能判断"], 0,
    "题干固定一单位外币乙币，用本币甲币表示其价格，属于直接标价法。",
    "示例只检验标价定义，不代表真实汇率，也不讨论汇率升降。", [fx]),
  question("fx-indirect-scenario", "economics", "fx-quotation", "在明确本币口径的兑换式中判断间接标价",
    "对甲国居民而言，甲币是本币、乙币是外币。报价“1单位甲币可兑换若干乙币”采用哪种标价法？",
    ["直接标价法", "间接标价法", "无法区分任何标价方法"], 1,
    "题干固定一单位本币甲币，用外币乙币表示其价格，属于间接标价法。",
    "示例只检验标价定义；若不说明甲币是本币，则不能作出同样判断。", [fx]),
];

const questionSpecifications = [
  ["poet-immortal", ["cs-target-poet-li-bai-title"], [], "direct", { 0: "诗圣对应杜甫。", 2: "本批正文未把诗仙对应白居易。" }],
  ["poet-sage", ["cs-target-poet-du-fu-title"], ["cs-target-poet-li-bai-title"], "direct-contrast", { 0: "李白对应诗仙，不是诗圣。", 1: "杜甫对应诗圣，李白对应诗仙。" }],
  ["poet-history", ["cs-target-poet-du-fu-poetry-history"], [], "object-distinction", { 1: "诗史不是李白的字号。", 2: "诗史不是杜甫的官职。" }],
  ["poet-titles-cross", ["cs-target-poet-li-bai-title", "cs-target-poet-du-fu-title"], ["cs-target-poet-du-fu-poetry-history"], "scenario-contrast", { 0: "该项把李白与杜甫的称号对调。", 2: "诗史评价杜甫的诗歌，且杜甫并非诗仙。" }],
  ["poet-sage-history-object", ["cs-target-poet-du-fu-title", "cs-target-poet-du-fu-poetry-history"], [], "object-recheck", { 0: "诗圣称人，诗史评诗；诗史也不是官职。", 2: "诗圣和诗史都不是杜甫的字号，且二者评价对象不同。" }],
  ["fx-direct", ["cs-target-fx-direct-base"], [], "direct", { 0: "间接标价固定本币单位，不符合题干固定外币的条件。" }],
  ["fx-indirect", ["cs-target-fx-indirect-base"], [], "direct", { 1: "直接标价固定外币单位，不符合题干固定本币的条件。" }],
  ["fx-context", ["cs-target-fx-observer-context"], [], "boundary-context", { 0: "交易时点不决定直接或间接标价的定义。", 1: "数值是否为整数不决定标价方法。" }],
  ["fx-direct-scenario", ["cs-target-fx-direct-base"], ["cs-target-fx-observer-context"], "scenario-application", { 1: "题干固定的是外币乙币，不是本币甲币。", 2: "本币和外币口径已经给出，不需要再凭数值大小判断。" }],
  ["fx-indirect-scenario", ["cs-target-fx-indirect-base"], ["cs-target-fx-observer-context"], "scenario-application", { 0: "题干固定的是本币甲币，不是外币乙币。", 2: "题干已经说明本币口径，可以据此判断为间接标价法。" }],
].map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));

const mnemonicReplacements = [
  {
    id: "poet-memory", revision: 2, status: "review", scope: "humanities-history",
    title: "李杜称号怎么分", purpose: "记住李白、杜甫的常用称号，并把称人和评诗分开。",
    text: "李白诗仙，杜甫诗圣；诗史评诗，称号记人。", method: "对照记忆",
    coverage: "李白的诗仙称号、杜甫的诗圣称号，以及诗史评价杜甫诗歌。",
    conditions: ["称号记人指本批的诗仙与诗圣。", "诗史评诗指本批正文对杜甫诗歌的评价对象。"],
    excludes: ["人物全部字号、生平", "作品清单、名句与文学史"],
    phrases: [
      {
        id: "poet-memory-li-bai", phrase: "李白诗仙", meaning: "诗仙对应李白。",
        targetIds: ["cs-target-poet-li-bai-title"], coverageType: "complete-basic", conditionRefs: [], refs: [li],
        questionIds: ["poet-immortal", "poet-titles-cross"], checks: [
          { questionId: "poet-immortal", checkPurpose: "direct", reviewTarget: "phrase", reviewAnchorId: "poet-memory-li-bai" },
          { questionId: "poet-titles-cross", checkPurpose: "scenario-contrast", reviewTarget: "meaning", reviewAnchorId: "poet-memory-li-bai" },
        ],
      },
      {
        id: "poet-memory-du-fu", phrase: "杜甫诗圣", meaning: "诗圣对应杜甫。",
        targetIds: ["cs-target-poet-du-fu-title"], coverageType: "complete-basic", conditionRefs: [], refs: [du],
        questionIds: ["poet-sage"], checks: [
          { questionId: "poet-sage", checkPurpose: "direct-contrast", reviewTarget: "phrase", reviewAnchorId: "poet-memory-du-fu" },
        ],
      },
      {
        id: "poet-memory-object", phrase: "诗史评诗，称号记人", meaning: "诗史评价杜甫的诗歌；诗圣是杜甫的人物称号。",
        targetIds: ["cs-target-poet-du-fu-title", "cs-target-poet-du-fu-poetry-history"], coverageType: "object-distinction",
        conditionRefs: [{ id: "poet-memory-object-condition", text: "语境限定为本批正文对杜甫及其诗歌的常用评价。" }], refs: [du],
        questionIds: ["poet-history", "poet-sage-history-object"], checks: [
          { questionId: "poet-history", checkPurpose: "object-distinction", reviewTarget: "meaning", reviewAnchorId: "poet-memory-object" },
          { questionId: "poet-sage-history-object", checkPurpose: "object-recheck", reviewTarget: "condition", reviewAnchorId: "poet-memory-object-condition" },
        ],
      },
    ],
    questionIds: ["poet-immortal", "poet-titles-cross", "poet-sage", "poet-history", "poet-sage-history-object"],
  },
  {
    id: "fx-memory", revision: 2, status: "review", scope: "economics",
    title: "直接、间接标价", purpose: "先确定本币观察口径，再按固定的货币基准区分两种标价法。",
    text: "直接固定外币，间接固定本币；先认本外，再看标价。", method: "对照记忆",
    coverage: "两种标价法固定的货币基准，以及判断前需要的本币观察口径。",
    conditions: ["必须先明确哪个国家或地区的货币是本币。", "固定单位指报价中作为基准的一方。"],
    excludes: ["汇率涨跌和货币升贬值的推导", "贸易、资本流动与实时汇率"],
    phrases: [
      {
        id: "fx-memory-direct", phrase: "直接固定外币", meaning: "一定单位外币作为基准，用本币表示外币价格。",
        targetIds: ["cs-target-fx-direct-base"], coverageType: "conditional-basic",
        conditionRefs: [{ id: "fx-memory-context-condition", text: "先明确观察口径中的本币与外币。" }], refs: [fx],
        questionIds: ["fx-direct", "fx-direct-scenario"], checks: [
          { questionId: "fx-direct", checkPurpose: "direct", reviewTarget: "phrase", reviewAnchorId: "fx-memory-direct" },
          { questionId: "fx-direct-scenario", checkPurpose: "scenario-application", reviewTarget: "condition", reviewAnchorId: "fx-memory-context-condition" },
        ],
      },
      {
        id: "fx-memory-indirect", phrase: "间接固定本币", meaning: "一定单位本币作为基准，用外币表示本币价格。",
        targetIds: ["cs-target-fx-indirect-base"], coverageType: "conditional-basic",
        conditionRefs: [{ id: "fx-memory-indirect-condition", text: "先明确观察口径中的本币与外币。" }], refs: [fx],
        questionIds: ["fx-indirect", "fx-indirect-scenario"], checks: [
          { questionId: "fx-indirect", checkPurpose: "direct", reviewTarget: "phrase", reviewAnchorId: "fx-memory-indirect" },
          { questionId: "fx-indirect-scenario", checkPurpose: "scenario-application", reviewTarget: "condition", reviewAnchorId: "fx-memory-indirect-condition" },
        ],
      },
      {
        id: "fx-memory-context", phrase: "先认本外，再看标价", meaning: "先确认观察口径中的本币和外币，再判断固定的是哪一方。",
        targetIds: ["cs-target-fx-observer-context"], coverageType: "boundary-context", conditionRefs: [], refs: [fx],
        questionIds: ["fx-context"], checks: [
          { questionId: "fx-context", checkPurpose: "boundary-context", reviewTarget: "meaning", reviewAnchorId: "fx-memory-context" },
        ],
      },
    ],
    questionIds: ["fx-direct", "fx-direct-scenario", "fx-indirect", "fx-indirect-scenario", "fx-context"],
  },
];

const mnemonicPhraseTargetRelations = mnemonicReplacements.flatMap((mnemonic) => mnemonic.phrases.map((phrase, phraseIndex) => ({
  mnemonicId: mnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
  coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
})));

const mnemonicSpecifications = mnemonicReplacements.map((mnemonic) => ({
  mnemonicId: mnemonic.id, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method,
  conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id),
  selfTestQuestionIds: mnemonic.questionIds.slice(),
}));

const variationDecisions = [
  ["cs-target-poet-li-bai-title", ["poet-immortal"], ["poet-sage", "poet-titles-cross"]],
  ["cs-target-poet-du-fu-title", ["poet-sage"], ["poet-titles-cross", "poet-sage-history-object"]],
  ["cs-target-poet-du-fu-poetry-history", ["poet-history"], ["poet-titles-cross", "poet-sage-history-object"]],
  ["cs-target-fx-direct-base", ["fx-direct"], ["fx-direct-scenario"]],
  ["cs-target-fx-indirect-base", ["fx-indirect"], ["fx-indirect-scenario"]],
  ["cs-target-fx-observer-context", ["fx-context"], ["fx-direct-scenario", "fx-indirect-scenario"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));

const additionsByGroup = {
  "poet-titles": ["poet-titles-cross", "poet-sage-history-object"],
  "fx-quotation": ["fx-direct-scenario", "fx-indirect-scenario"],
};

function applyQuestions(questions) { return questions.concat(addedQuestions); }
function applyGroups(groups) {
  return groups.map((group) => additionsByGroup[group.id]
    ? { ...group, questionIds: group.questionIds.concat(additionsByGroup[group.id]) }
    : group);
}
function applyMnemonics(mnemonics) {
  const byId = new Map(mnemonicReplacements.map((item) => [item.id, item]));
  return mnemonics.map((item) => byId.get(item.id) || item);
}
function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  const ids = addedQuestions.map((item) => item.id);
  plan.revision = 7;
  plan.modes.qa.questionIds.push(...ids);
  plan.modes.mnemonic.questionIds.push(...ids);
  return plan;
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-1", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
    ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonicReplacements, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions,
  sessionMigrations: [{
    fromVersion: "d115fffa", toPackVersion: "2026-10-21.5", changedQuestionIds: [],
    changedMnemonicIds: mnemonicReplacements.map((item) => item.id),
    reason: "C5-1 将李杜称号与汇率标价迁入目标关系层并修订两条口诀；旧问答队列保持，相关口诀阅读与自测按新学习包重建。",
  }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
