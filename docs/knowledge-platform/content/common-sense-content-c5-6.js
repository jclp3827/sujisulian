// C5-6: add two bounded market-failure mechanism themes.
// All authored material remains review-only until a separate human content review.
const { ref, question } = require("./learning-authoring");

const monopoly = ref("market-failure-factors", "market-failure-monopoly", "cs-23-30-p13-market-failure-monopoly-list");
const externality = ref("market-failure-factors", "market-failure-externality", "cs-23-30-p13-market-failure-externality-list");
const makeTarget = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs,
});

const targets = [
  makeTarget("cs-target-market-failure-monopoly-definition", "market-failure-monopoly-mechanism", "能识别正文中的垄断含义。", "垄断是一个大企业或少数几个大企业对相应部门产品生产和销售的独占或联合控制。", ["保留生产集中和资本集中高度发展的正文语境。"], ["不扩展垄断形成的全部原因和类型。"], [monopoly]),
  makeTarget("cs-target-market-failure-monopoly-chain", "market-failure-monopoly-mechanism", "能说明垄断控制供给、调节产量、影响价格并使市场机制不能正常作用的正文链路。", "控制供给并调节产量影响价格，使市场机制无法正常发挥作用。", ["按正文作用链理解，不把单一高价直接等同于垄断。"], ["不计算垄断产量、价格或福利损失。"], [monopoly]),
  makeTarget("cs-target-market-failure-monopoly-remedy", "market-failure-monopoly-mechanism", "能识别正文列出的限制垄断方式。", "正文列出限制垄断价格和制定反垄断法。", ["答案以正文举例为限。"], ["不评价具体执法案件和现行法条适用。"], [monopoly]),
  makeTarget("cs-target-market-failure-externality-definition", "market-failure-externality-mechanism", "能识别外部性是经济活动给无关第三方带来的影响。", "外部性是某种经济活动给与该活动无关第三方带来的影响。", ["第三方与该项活动无关。"], ["不把交易双方约定内的成本收益直接称为外部性。"], [externality]),
  makeTarget("cs-target-market-failure-externality-types", "market-failure-externality-mechanism", "能区分给第三方带来利益的正外部性和带来成本的负外部性。", "给第三方带来利益是正外部性，带来成本是负外部性。", ["判断对象是与活动无关的第三方。"], ["不按行为者主观动机判断正负。"], [externality]),
  makeTarget("cs-target-market-failure-negative-externality", "market-failure-externality-mechanism", "能识别负外部性的资源配置问题和正文治理方式。", "负外部性使未补偿的外部成本由社会承担，正文列出向行为者征税使外部成本转回行为者。", ["保留未补偿第三方成本这一条件。"], ["不计算最优税率。"], [externality]),
  makeTarget("cs-target-market-failure-positive-externality", "market-failure-externality-mechanism", "能识别正外部性的资源配置问题和正文治理方式。", "正外部性使行为者未取得带给社会的外部收益，正文列出补贴使外部收益转回行为者。", ["保留第三方获得利益而行为者未获收益这一条件。"], ["不计算最优补贴。"], [externality]),
];

const addedQuestions = [
  question("market-failure-monopoly-definition", "economics", "market-failure-monopoly-mechanism", "识别垄断含义", "按正文，垄断的核心含义是哪一项？", ["一个或少数几个大企业独占或联合控制相应部门产品的生产和销售", "市场中企业数量增加且产品完全相同", "政府统一发布商品参考信息"], 0, "正文把垄断表述为一个大企业或少数几个大企业对相应部门产品生产和销售的独占或联合控制。", "本题不扩展垄断的全部类型和形成原因。", [monopoly]),
  question("market-failure-monopoly-chain", "economics", "market-failure-monopoly-mechanism", "识别垄断导致市场失灵的作用链", "下列哪条链路符合正文对垄断导致市场失灵的说明？", ["控制产品供给—调节产量—影响价格—市场机制不能正常作用", "增加企业数量—产品同质—价格信息充分—市场失灵", "提高劳动生产率—降低单位成本—必然市场失灵"], 0, "垄断企业控制供给，并通过调节产量在相当大程度上影响价格，使市场机制无法正常发挥作用。", "不能仅凭价格较高断定存在这条完整链路。", [monopoly]),
  question("market-failure-monopoly-remedy", "economics", "market-failure-monopoly-mechanism", "识别正文治理方式", "正文列出的限制垄断方式包括哪一项？", ["限制垄断价格并制定反垄断法", "取消所有市场交易", "只增加货币发行量"], 0, "正文列举限制垄断价格和制定反垄断法。", "本题不评价具体案件或现行法条适用。", [monopoly]),
  question("market-failure-monopoly-full", "economics", "market-failure-monopoly-mechanism", "综合复辨垄断机制", "关于正文中的垄断与市场失灵，哪一项表述完整正确？", ["垄断只意味着商品价格较高，与供给控制无关", "垄断企业可控制供给、调节产量并影响价格；政府可通过限制垄断价格、制定反垄断法加以限制", "只要某企业规模较大，就必然已构成正文所说的垄断并造成市场失灵"], 1, "正文的作用链以控制供给、调节产量和影响价格为核心，并列出限制价格与反垄断法。", "企业规模大本身不足以替代正文的控制条件。", [monopoly]),

  question("market-failure-externality-definition", "economics", "market-failure-externality-mechanism", "识别外部性定义", "按正文，外部性指什么？", ["经济活动给与该活动无关第三方带来的影响", "交易双方已经计入合同的全部成本", "政府对市场价格的任何调整"], 0, "外部影响又称外部性，是某种经济活动给与这项活动无关的第三方带来的影响。", "第三方以及与活动无关是定义中的关键条件。", [externality]),
  question("market-failure-externality-types", "economics", "market-failure-externality-mechanism", "区分正负外部性", "某项活动给无关第三方带来利益；另一项活动给无关第三方带来成本。两者依次属于什么？", ["负外部性、正外部性", "正外部性、负外部性", "公共物品、垄断"], 1, "给第三方带来利益是正外部性，给第三方带来成本是负外部性。", "正负依据第三方承受的利益或成本判断，不看行为者主观动机。", [externality]),
  question("market-failure-negative-externality", "economics", "market-failure-externality-mechanism", "识别负外部性及治理", "生产者的行为使第三方付出成本却未补偿。按正文，哪项处理对应这种负外部性？", ["向行为者征税，使外部成本转回行为者", "向行为者补贴，使外部收益转回行为者", "把该影响归为正外部性"], 0, "负外部性的未补偿成本由社会承担；正文列出向行为者征税，把外部成本转回行为者。", "本题不计算税额。", [externality]),
  question("market-failure-positive-externality", "economics", "market-failure-externality-mechanism", "识别正外部性及治理", "某项活动给第三方带来利益，但行为者未获得相应收益。按正文，哪项处理与之对应？", ["对行为者征税", "给予行为者补贴，使外部收益转回行为者", "把第三方利益改称私人成本"], 1, "正外部性使社会收益大于私人收益；正文列出补贴，使外部收益转回行为者。", "本题不计算补贴额。", [externality]),
  question("market-failure-externality-full", "economics", "market-failure-externality-mechanism", "综合复辨正负外部性", "下列关于外部性及正文治理方式的对应，哪一项正确？", ["第三方受益—负外部性—征税；第三方受损—正外部性—补贴", "第三方受益—正外部性—补贴；第三方承担未补偿成本—负外部性—征税", "只要活动影响交易双方，就必然属于外部性"], 1, "第三方受益对应正外部性和补贴；第三方承担未补偿成本对应负外部性和征税。", "定义仍要求影响与活动无关的第三方。", [externality]),
];

const specs = [
  ["market-failure-monopoly-definition", ["cs-target-market-failure-monopoly-definition"], [], "definition-identification", { 1: "企业增加和产品同质不是正文垄断定义。", 2: "发布参考信息不等于控制生产和销售。" }],
  ["market-failure-monopoly-chain", ["cs-target-market-failure-monopoly-chain"], [], "mechanism-chain", { 1: "该链路描述竞争条件，与正文垄断机制相反。", 2: "提高生产率不构成正文所述垄断链路。" }],
  ["market-failure-monopoly-remedy", ["cs-target-market-failure-monopoly-remedy"], [], "remedy-identification", { 1: "正文没有提出取消所有市场交易。", 2: "增加货币发行量不是正文列出的限制垄断方式。" }],
  ["market-failure-monopoly-full", ["cs-target-market-failure-monopoly-definition", "cs-target-market-failure-monopoly-chain", "cs-target-market-failure-monopoly-remedy"], [], "full-mechanism-recheck", { 0: "该项丢失控制供给、调节产量的作用链。", 2: "企业规模大不能替代独占或联合控制条件。" }],
  ["market-failure-externality-definition", ["cs-target-market-failure-externality-definition"], [], "definition-identification", { 1: "合同内已计入的交易成本不是题干所问的第三方影响。", 2: "政府调价不是外部性的定义。" }],
  ["market-failure-externality-types", ["cs-target-market-failure-externality-types"], [], "type-classification", { 0: "正负顺序颠倒。", 2: "公共物品和垄断是其他市场失灵因素。" }],
  ["market-failure-negative-externality", ["cs-target-market-failure-negative-externality"], [], "negative-remedy", { 1: "补贴对应正文中的正外部性治理。", 2: "第三方承担未补偿成本属于负外部性。" }],
  ["market-failure-positive-externality", ["cs-target-market-failure-positive-externality"], [], "positive-remedy", { 0: "正文对正外部性列出的方式是补贴。", 2: "第三方利益不能改称私人成本。" }],
  ["market-failure-externality-full", ["cs-target-market-failure-externality-definition", "cs-target-market-failure-externality-types", "cs-target-market-failure-negative-externality", "cs-target-market-failure-positive-externality"], [], "full-mechanism-recheck", { 0: "正负外部性及征税、补贴全部错配。", 2: "外部性要求影响与活动无关的第三方，不能只看交易双方。" }],
];
const questionSpecifications = specs.map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));

function makeMnemonic(id, title, text, purpose, coverage, excludes, phrases, questionIds) {
  return { id, revision: 1, status: "review", scope: "economics", title, text, purpose, method: "作用链压缩", coverage, conditions: ["口诀只压缩正文关系，答题时应还原完整条件。"], excludes, phrases, questionIds };
}
const mnemonics = [
  makeMnemonic("market-failure-monopoly-memory", "垄断为何失灵", "控供调量影响价，限价立法来约束。", "记忆垄断作用链和正文治理方式。", "控制供给、调节产量、影响价格，以及限制价格和反垄断法。", ["垄断福利计算", "具体案件和现行法适用"], [
    { id: "market-failure-monopoly-memory-chain", phrase: "控供调量影响价", meaning: "控制供给，通过调节产量影响价格，使市场机制不能正常作用。", targetIds: ["cs-target-market-failure-monopoly-definition", "cs-target-market-failure-monopoly-chain"], coverageType: "mechanism-chain", conditionRefs: [{ id: "market-failure-monopoly-control", text: "不能只凭高价或企业规模判断垄断。" }], refs: [monopoly], questionIds: ["market-failure-monopoly-definition", "market-failure-monopoly-chain", "market-failure-monopoly-full"], checks: [
      { questionId: "market-failure-monopoly-definition", checkPurpose: "definition-identification", reviewTarget: "condition", reviewAnchorId: "market-failure-monopoly-control" }, { questionId: "market-failure-monopoly-chain", checkPurpose: "mechanism-chain", reviewTarget: "phrase", reviewAnchorId: "market-failure-monopoly-memory-chain" }, { questionId: "market-failure-monopoly-full", checkPurpose: "full-mechanism-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-monopoly-memory-chain" },
    ] },
    { id: "market-failure-monopoly-memory-remedy", phrase: "限价立法来约束", meaning: "限制垄断价格并制定反垄断法。", targetIds: ["cs-target-market-failure-monopoly-remedy"], coverageType: "remedy", conditionRefs: [], refs: [monopoly], questionIds: ["market-failure-monopoly-remedy", "market-failure-monopoly-full"], checks: [
      { questionId: "market-failure-monopoly-remedy", checkPurpose: "remedy-identification", reviewTarget: "phrase", reviewAnchorId: "market-failure-monopoly-memory-remedy" }, { questionId: "market-failure-monopoly-full", checkPurpose: "full-mechanism-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-monopoly-memory-remedy" },
    ] },
  ], addedQuestions.slice(0, 4).map((item) => item.id)),
  makeMnemonic("market-failure-externality-memory", "正负外部性怎么分", "利他为正，损他为负；负征税，正补贴。", "区分正负外部性及正文治理方式。", "第三方利益与成本、负外部性征税、正外部性补贴。", ["最优税率和补贴额", "未影响无关第三方的交易内成本收益"], [
    { id: "market-failure-externality-memory-types", phrase: "利他为正，损他为负", meaning: "给无关第三方带来利益是正外部性，带来成本是负外部性。", targetIds: ["cs-target-market-failure-externality-definition", "cs-target-market-failure-externality-types"], coverageType: "definition-and-types", conditionRefs: [{ id: "market-failure-externality-third-party", text: "判断对象必须是与该活动无关的第三方。" }], refs: [externality], questionIds: ["market-failure-externality-definition", "market-failure-externality-types", "market-failure-externality-full"], checks: [
      { questionId: "market-failure-externality-definition", checkPurpose: "definition-identification", reviewTarget: "condition", reviewAnchorId: "market-failure-externality-third-party" }, { questionId: "market-failure-externality-types", checkPurpose: "type-classification", reviewTarget: "phrase", reviewAnchorId: "market-failure-externality-memory-types" }, { questionId: "market-failure-externality-full", checkPurpose: "full-mechanism-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-externality-memory-types" },
    ] },
    { id: "market-failure-externality-memory-remedies", phrase: "负征税，正补贴", meaning: "负外部性征税以转回外部成本；正外部性补贴以转回外部收益。", targetIds: ["cs-target-market-failure-negative-externality", "cs-target-market-failure-positive-externality"], coverageType: "paired-remedies", conditionRefs: [], refs: [externality], questionIds: ["market-failure-negative-externality", "market-failure-positive-externality", "market-failure-externality-full"], checks: [
      { questionId: "market-failure-negative-externality", checkPurpose: "negative-remedy", reviewTarget: "phrase", reviewAnchorId: "market-failure-externality-memory-remedies" }, { questionId: "market-failure-positive-externality", checkPurpose: "positive-remedy", reviewTarget: "phrase", reviewAnchorId: "market-failure-externality-memory-remedies" }, { questionId: "market-failure-externality-full", checkPurpose: "full-mechanism-recheck", reviewTarget: "meaning", reviewAnchorId: "market-failure-externality-memory-remedies" },
    ] },
  ], addedQuestions.slice(4).map((item) => item.id)),
];

const mnemonicPhraseTargetRelations = mnemonics.flatMap((mnemonic) => mnemonic.phrases.map((phrase, phraseIndex) => ({ mnemonicId: mnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds, coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id })));
const mnemonicSpecifications = mnemonics.map((mnemonic) => ({ mnemonicId: mnemonic.id, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method, conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id), selfTestQuestionIds: mnemonic.questionIds.slice() }));
const variationDecisions = [
  ["cs-target-market-failure-monopoly-definition", ["market-failure-monopoly-definition"], ["market-failure-monopoly-full"]], ["cs-target-market-failure-monopoly-chain", ["market-failure-monopoly-chain"], ["market-failure-monopoly-full"]], ["cs-target-market-failure-monopoly-remedy", ["market-failure-monopoly-remedy"], ["market-failure-monopoly-full"]],
  ["cs-target-market-failure-externality-definition", ["market-failure-externality-definition"], ["market-failure-externality-full"]], ["cs-target-market-failure-externality-types", ["market-failure-externality-types"], ["market-failure-externality-full"]], ["cs-target-market-failure-negative-externality", ["market-failure-negative-externality"], ["market-failure-externality-full"]], ["cs-target-market-failure-positive-externality", ["market-failure-positive-externality"], ["market-failure-externality-full"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));
const groups = [
  { id: "market-failure-monopoly-mechanism", title: "垄断为何导致市场失灵", scope: "economics", reason: "从含义、作用链到正文治理方式形成一个闭环。", questionIds: addedQuestions.slice(0, 4).map((item) => item.id) },
  { id: "market-failure-externality-mechanism", title: "正负外部性与治理", scope: "economics", reason: "先识别第三方影响，再区分正负及征税、补贴。", questionIds: addedQuestions.slice(4).map((item) => item.id) },
];
const sourceDispositions = [
  { candidateId: "market-failure-monopoly-mechanism", pointId: "market-failure-factors", tabIds: ["market-failure-monopoly"], status: "已建设", batch: "C5-6", scope: "垄断含义、作用链与正文治理方式，不作案件法律判断" },
  { candidateId: "market-failure-externality-mechanism", pointId: "market-failure-factors", tabIds: ["market-failure-externality"], status: "已建设", batch: "C5-6", scope: "外部性定义、正负分类、配置影响与正文治理方式，不计算税率和补贴" },
];
function applyQuestions(questions) { return questions.concat(addedQuestions); }
function applyGroups(existing) { return existing.concat(groups); }
function applyMnemonics(existing) { return existing.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((item) => item.id); plan.revision = 12; plan.modes.qa.groupIds.push(...groups.map((item) => item.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((item) => item.id)); return plan; }
module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-6", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions,
  sessionMigrations: [{ fromVersion: "bdbe9e4d", toPackVersion: "2026-10-21.10", changedQuestionIds: addedQuestions.map((item) => item.id), changedMnemonicIds: mnemonics.map((item) => item.id), reason: "C5-6 新增垄断与外部性两个机制组；既有会话保留，新主题分别从四题和五题组开始。" }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
