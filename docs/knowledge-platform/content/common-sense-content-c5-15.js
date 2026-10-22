// C5-15: seven textbook economic effects, split into two bounded review groups.
const { ref, question } = require("./learning-authoring");
const refs = {
  ratchet: ref("economic-effects", "effect-ratchet", "cs-23-30-p23-ratchet-effect-list"),
  matthew: ref("economic-effects", "effect-matthew", "cs-23-30-p23-matthew-effect-list"),
  marginal: ref("economic-effects", "effect-marginal", "cs-23-30-p23-marginal-effect-list"),
  scale: ref("economic-effects", "effect-scale", "cs-23-30-p23-scale-effect-list"),
  substitution: ref("economic-effects", "effect-substitution", "cs-23-30-p23-substitution-effect-list"),
  income: ref("economic-effects", "effect-income", "cs-23-30-p23-income-effect-list"),
  crowding: ref("economic-effects", "effect-crowding-out", "cs-23-30-p23-p24-crowding-out-effect-list"),
};
const t = (id, groupId, statement, conclusion, conditions, excludes, source) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs: [source] });
const targets = [
  t("cs-target-effect-ratchet", "economic-effects-behavior", "能识别消费习惯易向上、难向下调整的棘轮效应。", "棘轮效应强调消费惯性和向下调整困难。", ["限于正文消费习惯语境。"], ["不泛化为所有行为不可逆。"], refs.ratchet),
  t("cs-target-effect-matthew", "economic-effects-behavior", "能识别强者愈强、弱者愈弱和两极分化的马太效应。", "强弱差距继续扩大是马太效应的识别线索。", ["按正文概念辨认。"], ["不评价具体社会群体。"], refs.matthew),
  t("cs-target-effect-marginal", "economic-effects-behavior", "能识别投入超过一定水平后新增单位投入产出下降的边际效应。", "边际看新增一单位投入带来的新增产出。", ["必须保留超过一定水平。"], ["不说总产出必然下降。"], refs.marginal),
  t("cs-target-effect-scale", "economic-effects-behavior", "能识别一定产量范围内产量增加、平均成本下降的规模效应。", "规模效应关注产量与平均成本。", ["必须保留一定产量范围。"], ["不说成本在任何规模都下降。"], refs.scale),
  t("cs-target-effect-substitution", "economic-effects-price-fiscal", "能识别相对价格变化使消费者转向替代品的替代效应。", "替代效应的直接线索是相对价格和替代选择。", ["由商品价格变化引起。"], ["不把实际购买力变化当成替代效应。"], refs.substitution),
  t("cs-target-effect-income", "economic-effects-price-fiscal", "能识别价格变化通过实际收入或购买力变化影响需求的收入效应。", "收入效应的直接线索是实际收入水平变化。", ["货币收入可保持不变。"], ["不把转向替代品当成收入效应。"], refs.income),
  t("cs-target-effect-crowding", "economic-effects-price-fiscal", "能识别政府发债筹措赤字资金、推高利率并压低私人投资支出的挤出效应。", "正文链路为政府发债、利率上升、私人投资支出下降。", ["按正文基础链路。"], ["不判断具体财政政策净效果。"], refs.crowding),
];
const addedQuestions = [
  question("effect-ratchet", "economics", "economic-effects-behavior", "识别棘轮效应", "消费习惯形成后容易向上调整、难以向下调整，属于什么效应？", ["棘轮效应", "马太效应", "挤出效应"], 0, "消费易上难下是棘轮效应。", "不泛化为所有行为不可逆。", [refs.ratchet]),
  question("effect-matthew", "economics", "economic-effects-behavior", "识别马太效应", "“强者愈强、弱者愈弱”的两极分化现象称为什么？", ["规模效应", "马太效应", "收入效应"], 1, "强弱差距继续扩大是马太效应。", "不评价具体群体。", [refs.matthew]),
  question("effect-marginal", "economics", "economic-effects-behavior", "识别边际效应", "投入超过一定水平后，每新增一单位投入换来的产出量下降，属于什么效应？", ["边际效应", "规模效应", "替代效应"], 0, "该表述关注新增单位投入带来的产出下降。", "不等于总产出必然下降。", [refs.marginal]),
  question("effect-scale", "economics", "economic-effects-behavior", "识别规模效应", "在一定产量范围内，产量增加而平均成本降低，属于什么效应？", ["棘轮效应", "挤出效应", "规模效应"], 2, "产量增加、平均成本下降是正文的规模效应。", "不能去掉一定产量范围。", [refs.scale]),
  question("economic-effects-behavior-full", "economics", "economic-effects-behavior", "综合复辨四类效应", "下列哪一组对应完整正确？", ["棘轮—消费易上难下；马太—强弱分化；边际—新增产出下降；规模—一定范围内平均成本下降", "棘轮—政府发债；马太—相对价格；边际—平均成本；规模—消费惯性", "四类效应都只描述价格上涨"], 0, "该项按四种不同作用路径正确对应。", "各概念不能只靠“下降”一词混记。", [refs.ratchet, refs.matthew, refs.marginal, refs.scale]),
  question("effect-substitution", "economics", "economic-effects-price-fiscal", "识别替代效应", "某商品变贵后，消费者转向相对便宜的其他物品，主要体现什么效应？", ["收入效应", "替代效应", "挤出效应"], 1, "相对价格改变并转向替代品是替代效应。", "不要与实际购买力变化混淆。", [refs.substitution]),
  question("effect-income", "economics", "economic-effects-price-fiscal", "识别收入效应", "货币收入不变而商品涨价，使实际购买力下降并减少消费，主要体现什么效应？", ["收入效应", "替代效应", "规模效应"], 0, "实际收入或购买力变化影响需求是收入效应。", "转向替代品才是替代效应线索。", [refs.income]),
  question("effect-crowding-out", "economics", "economic-effects-price-fiscal", "识别挤出效应", "按正文，政府发债筹措赤字资金，市场利率上升、私人投资和支出下降，称为什么？", ["马太效应", "棘轮效应", "挤出效应"], 2, "该因果链对应挤出效应。", "不判断具体财政政策净效果。", [refs.crowding]),
  question("economic-effects-price-full", "economics", "economic-effects-price-fiscal", "综合复辨三类效应", "下列哪一项完整正确？", ["替代效应看相对价格和替代选择；收入效应看实际购买力；挤出效应看发债、利率与私人投资", "替代效应看政府发债；收入效应看强弱分化；挤出效应看消费惯性", "三类效应都由平均成本下降引起"], 0, "该项区分了三条不同的作用路径。", "不把结果词相似当成同一机制。", [refs.substitution, refs.income, refs.crowding]),
];
const rows = [
  ["effect-ratchet", ["cs-target-effect-ratchet"], "ratchet", {1: "强弱分化是马太效应。", 2: "发债压低私人投资是挤出效应。"}],
  ["effect-matthew", ["cs-target-effect-matthew"], "matthew", {0: "规模效应看平均成本。", 2: "收入效应看实际购买力。"}],
  ["effect-marginal", ["cs-target-effect-marginal"], "marginal", {1: "规模效应看平均成本。", 2: "替代效应看相对价格。"}],
  ["effect-scale", ["cs-target-effect-scale"], "scale", {0: "棘轮效应看消费惯性。", 1: "挤出效应看发债和私人投资。"}],
  ["economic-effects-behavior-full", ["cs-target-effect-ratchet", "cs-target-effect-matthew", "cs-target-effect-marginal", "cs-target-effect-scale"], "full-recheck", {1: "四条机制全部错配。", 2: "四类效应并非都描述价格上涨。"}],
  ["effect-substitution", ["cs-target-effect-substitution"], "substitution", {0: "收入效应看实际购买力。", 2: "挤出效应看政府发债和私人投资。"}],
  ["effect-income", ["cs-target-effect-income"], "income", {1: "转向替代品是替代效应。", 2: "规模效应看平均成本。"}],
  ["effect-crowding-out", ["cs-target-effect-crowding"], "crowding", {0: "马太效应看强弱分化。", 1: "棘轮效应看消费惯性。"}],
  ["economic-effects-price-full", ["cs-target-effect-substitution", "cs-target-effect-income", "cs-target-effect-crowding"], "full-recheck", {1: "三条机制全部错配。", 2: "平均成本下降只对应规模效应。"}],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
const mk = (id, title, text, coverage, excludes, phrases, questionIds) => ({ id, revision: 1, status: "review", scope: "economics", title, purpose: `帮助回忆${title}。`, text, method: "机制线索压缩", coverage, conditions: ["口诀只用于区分正文机制。"], excludes, phrases, questionIds });
function phrase(id, text, meaning, targetIds, coverageType, source, directId, fullId) { return { id, phrase: text, meaning, targetIds, coverageType, conditionRefs: [], refs: [source], questionIds: [directId, fullId], checks: [{ questionId: directId, checkPurpose: coverageType, reviewTarget: "phrase", reviewAnchorId: id }, { questionId: fullId, checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: id }] }; }
const mnemonics = [
  mk("economic-effects-behavior-memory", "四类效应看线索", "棘轮消费难下，马太强弱分化；边际新增产出降，规模平均成本降。", "棘轮、马太、边际和规模效应。", ["适用范围外推", "总产出必然下降"], [
    phrase("effect-memory-ratchet", "棘轮消费难下", "消费习惯难向下调整。", ["cs-target-effect-ratchet"], "ratchet", refs.ratchet, "effect-ratchet", "economic-effects-behavior-full"),
    phrase("effect-memory-matthew", "马太强弱分化", "强者更强、弱者更弱。", ["cs-target-effect-matthew"], "matthew", refs.matthew, "effect-matthew", "economic-effects-behavior-full"),
    phrase("effect-memory-marginal", "边际新增产出降", "超过一定水平后新增单位投入的产出下降。", ["cs-target-effect-marginal"], "marginal", refs.marginal, "effect-marginal", "economic-effects-behavior-full"),
    phrase("effect-memory-scale", "规模平均成本降", "一定范围内产量增加、平均成本下降。", ["cs-target-effect-scale"], "scale", refs.scale, "effect-scale", "economic-effects-behavior-full"),
  ], addedQuestions.slice(0, 5).map((x) => x.id)),
  mk("economic-effects-price-memory", "替代收入挤出", "替代看相对价，收入看购买力，挤出看发债利率压投资。", "替代、收入和挤出效应。", ["现实政策净效果", "具体需求弹性"], [
    phrase("effect-memory-substitution", "替代看相对价", "相对价格变化使消费者转向替代品。", ["cs-target-effect-substitution"], "substitution", refs.substitution, "effect-substitution", "economic-effects-price-full"),
    phrase("effect-memory-income", "收入看购买力", "价格变化通过实际收入影响需求。", ["cs-target-effect-income"], "income", refs.income, "effect-income", "economic-effects-price-full"),
    phrase("effect-memory-crowding", "挤出看发债利率压投资", "政府发债推高利率，私人投资和支出下降。", ["cs-target-effect-crowding"], "crowding", refs.crowding, "effect-crowding-out", "economic-effects-price-full"),
  ], addedQuestions.slice(5).map((x) => x.id)),
];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const direct = { "cs-target-effect-ratchet": "effect-ratchet", "cs-target-effect-matthew": "effect-matthew", "cs-target-effect-marginal": "effect-marginal", "cs-target-effect-scale": "effect-scale", "cs-target-effect-substitution": "effect-substitution", "cs-target-effect-income": "effect-income", "cs-target-effect-crowding": "effect-crowding-out" };
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: [x.groupId === "economic-effects-behavior" ? "economic-effects-behavior-full" : "economic-effects-price-full"] }));
const groups = [
  { id: "economic-effects-behavior", title: "四类效应辨线索", scope: "economics", reason: "用消费、强弱、新增产出和平均成本区分四类效应。", questionIds: addedQuestions.slice(0, 5).map((x) => x.id) },
  { id: "economic-effects-price-fiscal", title: "替代收入与挤出", scope: "economics", reason: "按相对价格、实际购买力和财政链路区分三类效应。", questionIds: addedQuestions.slice(5).map((x) => x.id) },
];
const sourceDispositions = [
  { candidateId: "economic-effects-core", pointId: "economic-effects", tabIds: Object.keys(refs).map((key) => refs[key].tabId), status: "已建设", batch: "C5-15", scope: "七类经济效应按两组机制线索建设；保留条件，不外推现实结论" },
  { candidateId: "economic-terms-core", pointId: "economic-terms", tabIds: ["term-nash", "term-marginal-utility", "term-opportunity-cost", "term-sunk-cost", "term-black-swan", "term-gray-rhino", "term-laffer", "term-liquidity", "term-phillips"], status: "可建设", batch: "C5-15", scope: "九个经济名词拆成概念成本、风险曲线两批核对建设" },
];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((x) => x.id); plan.revision = 21; plan.modes.qa.groupIds.push(...groups.map((x) => x.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((x) => x.id)); return plan; }
module.exports = { schemaVersion: 1, revision: 1, batch: "C5-15", targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "e4d4808e", toPackVersion: "2026-10-21.19", changedQuestionIds: addedQuestions.map((x) => x.id), changedMnemonicIds: mnemonics.map((x) => x.id), reason: "C5-15 新增七类经济效应主题；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
