// C5-14: exchange-rate systems and the textbook direction table for exchange-rate changes.
const { ref, question } = require("./learning-authoring");

const rateMeaning = ref("exchange-rate-system", "exchange-rate-meaning", "cs-23-30-p22-exchange-rate-meaning-list");
const rateSystems = ref("exchange-rate-system", "exchange-rate-systems", "cs-23-30-p22-exchange-rate-systems-list");
const rateEffects = ref("exchange-rate-effects", "exchange-rate-effects", "cs-23-30-p22-exchange-rate-effects-table");
const t = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope: "economics", groupId,
  statement, conclusion, conditions, excludes, refs,
});

const targets = [
  t("cs-target-exchange-rate-meaning", "exchange-rate-system-core", "能识别汇率是一种货币表示另一种货币的价格或兑换比率。", "汇率连接两种货币的兑换关系。", ["须同时出现两种货币。"], ["不把商品价格或利率称为汇率。"], [rateMeaning]),
  t("cs-target-fixed-rate-system", "exchange-rate-system-core", "能识别固定汇率制由政府制定公布并只在一定幅度内波动。", "政府制定公布和限幅波动是正文识别线索。", ["按正文基础定义。"], ["不推断现实制度安排。"], [rateSystems]),
  t("cs-target-floating-rate-system", "exchange-rate-system-core", "能识别浮动汇率由市场供求决定、涨落基本自由。", "市场供求决定是浮动汇率制的核心线索。", ["正文同时保留必要时可以干预。"], ["不把基本自由理解为绝对不干预。"], [rateSystems]),
  t("cs-target-managed-floating", "exchange-rate-system-core", "能识别正文所述我国实行有管理的浮动汇率制度。", "有管理和浮动两个限定必须同时保留。", ["只复述正文制度名称。"], ["不扩展当前汇率形成机制。"], [rateSystems]),
  t("cs-target-rate-direction-pair", "exchange-rate-effects-core", "能识别本币汇率下降对应外币汇率上升，反向亦然。", "本币与外币汇率方向相反。", ["保持同一观察口径。"], ["不依据实时数值判断。"], [rateEffects]),
  t("cs-target-rate-import-effect", "exchange-rate-effects-core", "能按正文识别本币汇率下降时进口品价格上涨、进口受抑，本币汇率上升时方向相反。", "进口价格和进口数量方向随本币升贬值成组变化。", ["限于正文基础方向表。"], ["不推断具体商品弹性和滞后。"], [rateEffects]),
  t("cs-target-rate-export-effect", "exchange-rate-effects-core", "能按正文识别本币汇率下降时出口品价格下降、出口受促，本币汇率上升时方向相反。", "出口价格和出口数量方向随本币升贬值成组变化。", ["限于正文基础方向表。"], ["不推断具体贸易余额。"], [rateEffects]),
  t("cs-target-rate-capital-effect", "exchange-rate-effects-core", "能按正文表格识别本币汇率下降对应资本外流、上升对应资本内流。", "资本方向只按正文给出的基础对照记忆。", ["题干必须说明按正文表格。"], ["不作为现实资本流动预测。"], [rateEffects]),
];

const addedQuestions = [
  question("exchange-rate-meaning", "economics", "exchange-rate-system-core", "识别汇率含义", "汇率最准确的基础含义是哪一项？", ["一种货币表示另一种货币的价格或兑换比率", "商品总价格水平", "中央银行规定的贷款利率"], 0, "汇率描述两种货币之间的兑换价格或比率。", "不把商品价格或利率称为汇率。", [rateMeaning]),
  question("fixed-rate-system", "economics", "exchange-rate-system-core", "识别固定汇率制", "由政府制定和公布，并只能在一定幅度内波动，属于哪种汇率制度？", ["固定汇率制", "完全自由浮动", "价格歧视制度"], 0, "政府制定公布且限幅波动是固定汇率制的正文定义。", "不推断现实制度安排。", [rateSystems]),
  question("floating-rate-system", "economics", "exchange-rate-system-core", "识别浮动汇率制", "主要由市场供求关系决定、涨落基本自由的汇率制度是？", ["固定汇率制", "浮动汇率制", "财政转移制度"], 1, "市场供求决定是浮动汇率制的核心线索。", "必要时可以干预，不等于绝对不干预。", [rateSystems]),
  question("managed-floating-system", "economics", "exchange-rate-system-core", "识别有管理浮动", "按正文，我国实行的汇率制度表述是哪一项？", ["永久固定汇率制", "完全不干预的自由浮动", "有管理的浮动汇率制度"], 2, "正文表述为有管理的浮动汇率制度。", "不扩展当前汇率形成机制。", [rateSystems]),
  question("exchange-rate-system-full", "economics", "exchange-rate-system-core", "综合复辨汇率制度", "下列哪一项完整正确？", ["汇率是两种货币的兑换比率；固定汇率由政府制定并限幅波动；浮动汇率主要由市场供求决定", "汇率是商品价格；固定与浮动只按货币名称区分", "浮动汇率意味着任何情况下都不能干预"], 0, "该项同时保留汇率含义及两种制度的核心差异。", "浮动汇率并不排除必要干预。", [rateMeaning, rateSystems]),
  question("rate-direction-pair", "economics", "exchange-rate-effects-core", "识别本外币方向", "按正文对照，本币汇率下降时，外币汇率如何变化？", ["同时下降", "上升", "必然不变"], 1, "同一观察口径下，本币汇率下降对应外币汇率上升。", "不依据实时数值判断。", [rateEffects]),
  question("rate-import-effect", "economics", "exchange-rate-effects-core", "识别进口方向", "按正文基础方向表，本币汇率下降时进口方面的组合是？", ["进口品价格上涨、进口受抑", "进口品价格下降、进口受促", "进口品价格不变、进口必然不变"], 0, "正文表格给出进口品价格上涨、进口受抑。", "不推断具体商品弹性。", [rateEffects]),
  question("rate-export-effect", "economics", "exchange-rate-effects-core", "识别出口方向", "按正文基础方向表，本币汇率下降时出口方面的组合是？", ["出口品价格上涨、出口受抑", "出口品价格下降、出口受促", "出口品价格不变、出口停止"], 1, "正文表格给出出口品价格下降、出口受促。", "不据此推断最终贸易余额。", [rateEffects]),
  question("rate-capital-effect", "economics", "exchange-rate-effects-core", "识别资本方向", "仅按正文表格，本币汇率上升对应哪种资本流动方向？", ["资本外流", "资本内流", "资本流动必然为零"], 1, "正文表格将本币汇率上升与资本内流对应。", "该关系不作为现实资本流动预测。", [rateEffects]),
  question("rate-effects-full", "economics", "exchange-rate-effects-core", "综合复辨汇率影响", "按正文基础方向表，下列哪一项完整正确？", ["本币汇率下降：进口变贵受抑、出口变便宜受促、资本外流", "本币汇率下降：进口变便宜受促、出口变贵受抑、资本内流", "本币汇率变化只影响资本，不影响进出口"], 0, "该项完整保留正文对本币汇率下降的三组方向。", "只用于教材基础对照。", [rateEffects]),
];

const rows = [
  ["exchange-rate-meaning", ["cs-target-exchange-rate-meaning"], "meaning", {1: "商品总价格水平不是两种货币的兑换比率。", 2: "贷款利率不是汇率。"}],
  ["fixed-rate-system", ["cs-target-fixed-rate-system"], "fixed", {1: "题干含政府制定和限幅波动。", 2: "价格歧视不是汇率制度。"}],
  ["floating-rate-system", ["cs-target-floating-rate-system"], "floating", {0: "固定汇率由政府制定公布。", 2: "财政转移不是汇率制度。"}],
  ["managed-floating-system", ["cs-target-managed-floating"], "managed", {0: "正文不是永久固定汇率。", 1: "有管理浮动并非完全不干预。"}],
  ["exchange-rate-system-full", ["cs-target-exchange-rate-meaning", "cs-target-fixed-rate-system", "cs-target-floating-rate-system", "cs-target-managed-floating"], "full-recheck", {1: "混淆汇率含义和制度区分。", 2: "浮动汇率必要时仍可干预。"}],
  ["rate-direction-pair", ["cs-target-rate-direction-pair"], "direction", {0: "本外币汇率方向相反。", 2: "正文并非必然不变。"}],
  ["rate-import-effect", ["cs-target-rate-import-effect"], "import", {1: "这是本币汇率上升时的进口方向。", 2: "正文给出明确方向。"}],
  ["rate-export-effect", ["cs-target-rate-export-effect"], "export", {0: "这是本币汇率上升时的出口方向。", 2: "正文未说出口停止。"}],
  ["rate-capital-effect", ["cs-target-rate-capital-effect"], "capital", {0: "正文把外流与本币汇率下降对应。", 2: "正文未说资本流动为零。"}],
  ["rate-effects-full", ["cs-target-rate-direction-pair", "cs-target-rate-import-effect", "cs-target-rate-export-effect", "cs-target-rate-capital-effect"], "full-recheck", {1: "进口、出口和资本方向全部反置。", 2: "正文同时列出进出口影响。"}],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
const mk = (id, title, text, coverage, excludes, phrases, questionIds) => ({ id, revision: 1, status: "review", scope: "economics", title, purpose: `帮助回忆${title}。`, text, method: "定义与方向压缩", coverage, conditions: ["口诀只压缩正文基础关系。"], excludes, phrases, questionIds });
const mnemonics = [
  mk("exchange-rate-system-memory", "汇率制度怎么分", "汇率两币换；固定政府定限幅，浮动供求定可管。", "汇率含义、固定和浮动汇率制的识别边界。", ["现实汇率形成机制", "实时汇率"], [
    { id: "rate-system-memory-meaning", phrase: "汇率两币换", meaning: "汇率是一种货币表示另一种货币的价格或兑换比率。", targetIds: ["cs-target-exchange-rate-meaning"], coverageType: "meaning", conditionRefs: [], refs: [rateMeaning], questionIds: ["exchange-rate-meaning", "exchange-rate-system-full"], checks: [{ questionId: "exchange-rate-meaning", checkPurpose: "meaning", reviewTarget: "phrase", reviewAnchorId: "rate-system-memory-meaning" }, { questionId: "exchange-rate-system-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-system-memory-meaning" }] },
    { id: "rate-system-memory-fixed", phrase: "固定政府定限幅", meaning: "固定汇率由政府制定公布并只在一定幅度内波动。", targetIds: ["cs-target-fixed-rate-system"], coverageType: "fixed", conditionRefs: [], refs: [rateSystems], questionIds: ["fixed-rate-system", "exchange-rate-system-full"], checks: [{ questionId: "fixed-rate-system", checkPurpose: "fixed", reviewTarget: "phrase", reviewAnchorId: "rate-system-memory-fixed" }, { questionId: "exchange-rate-system-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-system-memory-fixed" }] },
    { id: "rate-system-memory-floating", phrase: "浮动供求定可管", meaning: "浮动汇率由市场供求决定，必要时可以干预；我国正文表述为有管理浮动。", targetIds: ["cs-target-floating-rate-system", "cs-target-managed-floating"], coverageType: "floating-managed", conditionRefs: [], refs: [rateSystems], questionIds: ["floating-rate-system", "managed-floating-system", "exchange-rate-system-full"], checks: [{ questionId: "floating-rate-system", checkPurpose: "floating", reviewTarget: "phrase", reviewAnchorId: "rate-system-memory-floating" }, { questionId: "managed-floating-system", checkPurpose: "managed", reviewTarget: "meaning", reviewAnchorId: "rate-system-memory-floating" }, { questionId: "exchange-rate-system-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-system-memory-floating" }] },
  ], addedQuestions.slice(0, 5).map((x) => x.id)),
  mk("exchange-rate-effects-memory", "本币升贬看三路", "本币贬：进贵抑、出便促、资本外；本币升，方向反。", "正文对本币升贬值与进出口、资本流动的基础方向。", ["具体商品弹性与时滞", "现实资本流动预测", "最终贸易余额"], [
    { id: "rate-effects-memory-direction", phrase: "本币贬", meaning: "正文将本币汇率下降与外币汇率上升对应。", targetIds: ["cs-target-rate-direction-pair"], coverageType: "direction", conditionRefs: [], refs: [rateEffects], questionIds: ["rate-direction-pair", "rate-effects-full"], checks: [{ questionId: "rate-direction-pair", checkPurpose: "direction", reviewTarget: "phrase", reviewAnchorId: "rate-effects-memory-direction" }, { questionId: "rate-effects-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-effects-memory-direction" }] },
    { id: "rate-effects-memory-import", phrase: "进贵抑", meaning: "本币汇率下降时，进口品价格上涨、进口受抑。", targetIds: ["cs-target-rate-import-effect"], coverageType: "import", conditionRefs: [], refs: [rateEffects], questionIds: ["rate-import-effect", "rate-effects-full"], checks: [{ questionId: "rate-import-effect", checkPurpose: "import", reviewTarget: "phrase", reviewAnchorId: "rate-effects-memory-import" }, { questionId: "rate-effects-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-effects-memory-import" }] },
    { id: "rate-effects-memory-export", phrase: "出便促", meaning: "本币汇率下降时，出口品价格下降、出口受促。", targetIds: ["cs-target-rate-export-effect"], coverageType: "export", conditionRefs: [], refs: [rateEffects], questionIds: ["rate-export-effect", "rate-effects-full"], checks: [{ questionId: "rate-export-effect", checkPurpose: "export", reviewTarget: "phrase", reviewAnchorId: "rate-effects-memory-export" }, { questionId: "rate-effects-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-effects-memory-export" }] },
    { id: "rate-effects-memory-capital", phrase: "资本外；本币升，方向反", meaning: "按正文表格，本币汇率下降对应资本外流；上升时各方向相反。", targetIds: ["cs-target-rate-capital-effect"], coverageType: "capital-reverse", conditionRefs: [], refs: [rateEffects], questionIds: ["rate-capital-effect", "rate-effects-full"], checks: [{ questionId: "rate-capital-effect", checkPurpose: "capital", reviewTarget: "phrase", reviewAnchorId: "rate-effects-memory-capital" }, { questionId: "rate-effects-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "rate-effects-memory-capital" }] },
  ], addedQuestions.slice(5).map((x) => x.id)),
];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const direct = { "cs-target-exchange-rate-meaning": "exchange-rate-meaning", "cs-target-fixed-rate-system": "fixed-rate-system", "cs-target-floating-rate-system": "floating-rate-system", "cs-target-managed-floating": "managed-floating-system", "cs-target-rate-direction-pair": "rate-direction-pair", "cs-target-rate-import-effect": "rate-import-effect", "cs-target-rate-export-effect": "rate-export-effect", "cs-target-rate-capital-effect": "rate-capital-effect" };
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: [x.groupId === "exchange-rate-system-core" ? "exchange-rate-system-full" : "rate-effects-full"] }));
const groups = [
  { id: "exchange-rate-system-core", title: "汇率制度先看谁决定", scope: "economics", reason: "把汇率含义、固定、浮动和有管理浮动放在同一组辨认。", questionIds: addedQuestions.slice(0, 5).map((x) => x.id) },
  { id: "exchange-rate-effects-core", title: "本币升贬看进出", scope: "economics", reason: "以本币方向统一对照进口、出口与资本流动。", questionIds: addedQuestions.slice(5).map((x) => x.id) },
];
const sourceDispositions = [
  { candidateId: "exchange-rate-system-core", pointId: "exchange-rate-system", tabIds: ["exchange-rate-meaning", "exchange-rate-systems"], status: "已建设", batch: "C5-14", scope: "汇率含义、固定与浮动制度；不扩展现实机制" },
  { candidateId: "exchange-rate-effects", pointId: "exchange-rate-effects", tabIds: ["exchange-rate-effects"], status: "已建设", batch: "C5-14", scope: "按正文表格建设本币升贬值对进出口和资本方向；明确仅作基础对照" },
  { candidateId: "international-economic-organizations-source", pointId: "imf", relatedPointIds: ["world-bank", "wto"], tabIds: ["imf-profile"], status: "待补依据", batch: "C5-14", scope: "正文与机构现行官方口径存在日期、组织范围或性质差异；先修正文再建设" },
  { candidateId: "economic-effects-core", pointId: "economic-effects", tabIds: ["effect-ratchet", "effect-matthew", "effect-marginal", "effect-scale", "effect-substitution", "effect-income", "effect-crowding-out"], status: "可建设", batch: "C5-14", scope: "七类经济效应先逐项核对定义与边界，再拆成不超过两个主题" },
];
function applyQuestions(items) { return items.concat(addedQuestions); }
function applyGroups(items) { return items.concat(groups); }
function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((x) => x.id);
  plan.revision = 20; plan.modes.qa.groupIds.push(...groups.map((x) => x.id)); plan.modes.qa.questionIds.push(...ids);
  plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((x) => x.id)); return plan;
}
module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-14", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions,
  sessionMigrations: [{ fromVersion: "7c5e69af", toPackVersion: "2026-10-21.18", changedQuestionIds: addedQuestions.map((x) => x.id), changedMnemonicIds: mnemonics.map((x) => x.id), reason: "C5-14 新增汇率制度与汇率变动方向主题；既有会话保留。" }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
