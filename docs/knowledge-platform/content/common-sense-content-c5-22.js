// C5-22: stable demand/supply basics and equilibrium; constrained demand tabs stay excluded.
const { ref, question } = require("./learning-authoring");
const demandMeaning = ref("microeconomics", "demand-meaning", "cs-23-30-p8-demand-meaning-list");
const demandElasticity = ref("microeconomics", "demand-price-elasticity", "cs-23-30-p9-demand-price-elasticity-list");
const supplyMeaning = ref("supply-theory", "supply-meaning", "cs-23-30-p10-supply-meaning-list");
const supplyFactors = ref("supply-theory", "supply-factors", "cs-23-30-p10-supply-factors-list");
const equilibriumMeaning = ref("supply-demand-equilibrium", "equilibrium-meaning", "cs-23-30-p10-equilibrium-meaning-list");
const equilibriumPQ = ref("supply-demand-equilibrium", "equilibrium-price-quantity", "cs-23-30-p10-equilibrium-price-quantity-list");
const equilibriumLimits = ref("supply-demand-equilibrium", "equilibrium-application", "cs-23-30-p10-equilibrium-application-list");
const groupCore = "demand-supply-basic-core", groupEq = "supply-demand-equilibrium-core";
const t = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-demand-meaning", groupCore, "能识别需求要求消费者在一定时期和价格水平下愿意且能够购买。", "愿意与能够缺一不可。", ["主体是消费者。"], ["不引用待核需求因素页签。"], [demandMeaning]),
  t("cs-target-demand-price-elasticity", groupCore, "能识别需求价格弹性衡量需求量对价格变化的反应程度。", "富有弹性时需求量变动程度大于价格变动程度，缺乏弹性时相反。", ["按正文基础比较。"], ["不以固定数值边界外推。"], [demandElasticity]),
  t("cs-target-supply-meaning", groupCore, "能识别供给要求生产者愿意且能够提供出售。", "主体是生产者，愿意与能够缺一不可。", ["一定时期和各种可能价格。"], ["不与需求主体混淆。"], [supplyMeaning]),
  t("cs-target-supply-factors", groupCore, "能识别本品价格、生产成本、相关品价格、政策和预期影响供给。", "本品价格通常与供给量同向，成本上升通常压低供给。", ["按正文一般情况。"], ["不预测具体商品供给。"], [supplyFactors]),
  t("cs-target-equilibrium-meaning", groupEq, "能识别供求均衡是供给与需求达到平衡。", "均衡强调供需相等状态。", ["按正文定义。"], ["不等于价格永远不变。"], [equilibriumMeaning]),
  t("cs-target-equilibrium-price-quantity", groupEq, "能区分均衡价格与均衡数量。", "前者是供需量相等时价格，后者是该价格下相等的数量。", ["价格与数量维度分开。"], ["不把二者互换。"], [equilibriumPQ]),
  t("cs-target-equilibrium-price-limits", groupEq, "能识别最高限价通常低于均衡价用于抑价，最低限价通常高于均衡价用于扶持。", "最高与最低限价的位置和目的方向相反。", ["按正文一般情况。"], ["不推断具体政策后果。"], [equilibriumLimits]),
];
const addedQuestions = [
  question("demand-meaning", "economics", groupCore, "识别需求含义", "经济学中的需求必须同时满足什么？", ["消费者愿意并且能够购买", "消费者只愿意购买", "生产者能够提供"], 0, "需求中的愿意与能够缺一不可。", "主体是消费者。", [demandMeaning]),
  question("demand-price-elasticity", "economics", groupCore, "识别需求价格弹性", "需求价格弹性衡量什么？", ["需求量变动对商品价格变动的反应程度", "供给量与成本完全相等", "企业是否具有法人资格"], 0, "价格弹性衡量需求量对价格变化的反应。", "不使用固定数值外推。", [demandElasticity]),
  question("supply-meaning", "economics", groupCore, "识别供给含义", "经济学中的供给要求生产者怎样？", ["愿意且能够提供出售", "只愿意生产但不能出售", "只表达消费者购买意愿"], 0, "供给要求生产者愿意且能够提供出售。", "主体不是消费者。", [supplyMeaning]),
  question("supply-factors", "economics", groupCore, "识别供给因素", "本品价格不变时，生产成本上升通常如何影响供给？", ["利润受压，供给减少", "供给必然增加", "供给完全不受影响"], 0, "正文指出成本上升压缩利润并使供给减少。", "只作一般方向判断。", [supplyFactors]),
  question("demand-supply-basic-full", "economics", groupCore, "综合复辨需求供给", "下列哪一项完整正确？", ["需求主体是消费者且须愿意能够；供给主体是生产者且须愿意能够；价格弹性看需求量对价格变化反应", "需求和供给主体都是政府；弹性只看成本", "需求只要愿意，供给只要能够"], 0, "该项区分主体、双重条件和价格弹性。", "待核需求因素未纳入本组。", [demandMeaning, demandElasticity, supplyMeaning, supplyFactors]),
  question("equilibrium-meaning", "economics", groupEq, "识别供求均衡", "供求均衡指什么状态？", ["供给与需求达到平衡", "价格永远不变", "供给永远大于需求"], 0, "供求均衡是供给与需求达到平衡。", "不等于价格永远不变。", [equilibriumMeaning]),
  question("equilibrium-price-quantity", "economics", groupEq, "区分均衡价格数量", "市场需求量和供给量相等时的价格称为什么？", ["均衡数量", "均衡价格", "最高限价"], 1, "供需量相等时的价格是均衡价格。", "均衡数量是该价格下相等的供求数量。", [equilibriumPQ]),
  question("equilibrium-price-limits", "economics", groupEq, "区分最高最低限价", "按正文一般情况，最高限价和最低限价分别位于均衡价的哪一侧？", ["最高限价低于均衡价，最低限价高于均衡价", "二者都低于均衡价", "最高高于、最低低于"], 0, "最高限价通常低于均衡价，最低限价通常高于均衡价。", "不推断具体政策后果。", [equilibriumLimits]),
  question("supply-demand-equilibrium-full", "economics", groupEq, "综合复辨供求均衡", "下列哪一项完整正确？", ["均衡是供需相等；均衡价格是相等时价格；最高限价通常低于均衡价，最低限价通常高于均衡价", "均衡数量就是价格；最高限价通常高于均衡价", "均衡意味着供给永远大于需求"], 0, "该项正确连接均衡状态、价格数量和限价位置。", "不扩展具体政策效果。", [equilibriumMeaning, equilibriumPQ, equilibriumLimits]),
];
const rows = [
  ["demand-meaning", ["cs-target-demand-meaning"], "demand", { 1: "只有愿意不构成有效需求。", 2: "生产者提供对应供给。" }],
  ["demand-price-elasticity", ["cs-target-demand-price-elasticity"], "elasticity", { 1: "这不是需求价格弹性定义。", 2: "法人资格与价格弹性无关。" }],
  ["supply-meaning", ["cs-target-supply-meaning"], "supply", { 1: "仅愿意而不能提供不构成供给。", 2: "消费者购买意愿对应需求。" }],
  ["supply-factors", ["cs-target-supply-factors"], "supply-factors", { 1: "成本上升通常不会使供给增加。", 2: "生产成本是供给影响因素。" }],
  ["demand-supply-basic-full", targets.slice(0, 4).map((x) => x.id), "full-recheck", { 1: "主体和弹性含义错配。", 2: "愿意和能够均须同时满足。" }],
  ["equilibrium-meaning", ["cs-target-equilibrium-meaning"], "equilibrium", { 1: "均衡不等于价格永远不变。", 2: "均衡是供需平衡。" }],
  ["equilibrium-price-quantity", ["cs-target-equilibrium-price-quantity"], "price-quantity", { 0: "均衡数量是数量维度。", 2: "最高限价是政策价格。" }],
  ["equilibrium-price-limits", ["cs-target-equilibrium-price-limits"], "limits", { 1: "最低限价通常高于均衡价。", 2: "最高最低方向反置。" }],
  ["supply-demand-equilibrium-full", targets.slice(4).map((x) => x.id), "full-recheck", { 1: "价格数量与限价方向错配。", 2: "均衡不是供给永远大于需求。" }],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
const direct = { "cs-target-demand-meaning": "demand-meaning", "cs-target-demand-price-elasticity": "demand-price-elasticity", "cs-target-supply-meaning": "supply-meaning", "cs-target-supply-factors": "supply-factors", "cs-target-equilibrium-meaning": "equilibrium-meaning", "cs-target-equilibrium-price-quantity": "equilibrium-price-quantity", "cs-target-equilibrium-price-limits": "equilibrium-price-limits" };
const sourceByTarget = { "cs-target-demand-meaning": demandMeaning, "cs-target-demand-price-elasticity": demandElasticity, "cs-target-supply-meaning": supplyMeaning, "cs-target-supply-factors": supplyFactors, "cs-target-equilibrium-meaning": equilibriumMeaning, "cs-target-equilibrium-price-quantity": equilibriumPQ, "cs-target-equilibrium-price-limits": equilibriumLimits };
const textByTarget = { "cs-target-demand-meaning": "需求消费愿且能", "cs-target-demand-price-elasticity": "弹性看量对价反应", "cs-target-supply-meaning": "供给生产愿且能", "cs-target-supply-factors": "价同向、成本反向", "cs-target-equilibrium-meaning": "供需相等是均衡", "cs-target-equilibrium-price-quantity": "相等时价与量", "cs-target-equilibrium-price-limits": "最高低、最低高" };
function makeMnemonic(id, title, groupId, targetList) { const fullId = groupId === groupCore ? "demand-supply-basic-full" : "supply-demand-equilibrium-full"; return { id, revision: 1, status: "review", scope: "economics", title, purpose: `帮助回忆${title}。`, text: targetList.map((x) => textByTarget[x.id]).join("；") + "。", method: "主体与方向串联", coverage: targetList.map((x) => x.conclusion).join("；"), conditions: ["只压缩正文稳定内容。"], excludes: ["待核需求因素与恩格尔阈值", "具体政策后果"], phrases: targetList.map((x) => ({ id: `${x.id}-memory`, phrase: textByTarget[x.id], meaning: x.conclusion, targetIds: [x.id], coverageType: questionSpecifications.find((s) => s.questionId === direct[x.id]).checkPurpose, conditionRefs: [], refs: [sourceByTarget[x.id]], questionIds: [direct[x.id], fullId], checks: [{ questionId: direct[x.id], checkPurpose: questionSpecifications.find((s) => s.questionId === direct[x.id]).checkPurpose, reviewTarget: "phrase", reviewAnchorId: `${x.id}-memory` }, { questionId: fullId, checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: `${x.id}-memory` }] })), questionIds: addedQuestions.filter((q) => q.group === groupId).map((q) => q.id) }; }
const mnemonics = [makeMnemonic("demand-supply-basic-memory", "需求供给基础", groupCore, targets.slice(0, 4)), makeMnemonic("supply-demand-equilibrium-memory", "均衡价格与限价", groupEq, targets.slice(4))];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: [x.groupId === groupCore ? "demand-supply-basic-full" : "supply-demand-equilibrium-full"] }));
const groups = [{ id: groupCore, title: "需求供给先分主体", scope: "economics", reason: "只使用稳定定义、价格弹性和供给因素。", questionIds: addedQuestions.slice(0, 5).map((q) => q.id) }, { id: groupEq, title: "均衡价格与限价", scope: "economics", reason: "把均衡状态、价格数量和限价方向放在一组。", questionIds: addedQuestions.slice(5).map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "demand-supply-core", pointId: "microeconomics", relatedPointIds: ["supply-theory", "supply-demand-equilibrium"], tabIds: ["demand-meaning", "demand-price-elasticity", "supply-meaning", "supply-factors", "equilibrium-meaning", "equilibrium-price-quantity", "equilibrium-application"], status: "已建设", batch: "C5-22", scope: "需求供给稳定定义、价格弹性、供给因素与供求均衡；排除受约束需求页签" }, { candidateId: "supply-demand-law-macro-goals", pointId: "supply-demand-law", relatedPointIds: ["macro-control-goals-overview"], tabIds: ["supply-demand-law", "buyer-seller-market"], status: "可建设", batch: "C5-22", scope: "供求法则、买卖方市场与宏观调控四目标" }];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((q) => q.id); plan.revision = 28; plan.modes.qa.groupIds.push(...groups.map((g) => g.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((m) => m.id)); return plan; }
module.exports = { schemaVersion: 1, revision: 1, batch: "C5-22", targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "7a5816c1", toPackVersion: "2026-10-21.26", changedQuestionIds: addedQuestions.map((q) => q.id), changedMnemonicIds: mnemonics.map((m) => m.id), reason: "C5-22 新增需求供给稳定内容与均衡主题；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
