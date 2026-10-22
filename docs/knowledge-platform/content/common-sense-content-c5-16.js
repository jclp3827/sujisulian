// C5-16: nine economic terms in two bounded review groups.
const { ref, question } = require("./learning-authoring");
const R = (tab, unit) => ref("economic-terms", tab, unit);
const refs = {
  nash: R("term-nash", "cs-23-30-p24-nash-equilibrium-list"), utility: R("term-marginal-utility", "cs-23-30-p24-diminishing-marginal-utility-list"),
  opportunity: R("term-opportunity-cost", "cs-23-30-p24-opportunity-cost-list"), sunk: R("term-sunk-cost", "cs-23-30-p24-sunk-cost-list"),
  black: R("term-black-swan", "cs-23-30-p24-black-swan-list"), gray: R("term-gray-rhino", "cs-23-30-p24-gray-rhino-list"),
  laffer: R("term-laffer", "cs-23-30-p24-laffer-curve-list"), liquidity: R("term-liquidity", "cs-23-30-p24-liquidity-preference-list"),
  phillips: R("term-phillips", "cs-23-30-p24-phillips-curve-list"),
};
const groupA = "economic-terms-choice-cost", groupB = "economic-terms-risk", groupC = "economic-terms-curve";
const defs = [
  ["nash", groupA, "纳什均衡", "任何参与人单独改变策略都不会获益", "策略组合和单方改变无益必须同时保留", "不等于所有参与人收益相同"],
  ["marginal-utility", groupA, "边际效用递减", "一定时间内连续增加消费时，每新增单位带来的效用增量递减", "强调新增单位和效用增量", "不说总效用必然下降"],
  ["opportunity-cost", groupA, "机会成本", "作出选择时放弃的其他机会中的最大收益或最大价值", "要取所放弃机会中的最大者", "不等于实际已经支付的全部金额"],
  ["sunk-cost", groupA, "沉没成本", "已经付出且不可收回的成本", "已付和不可收回缺一不可", "不把未来可避免成本算作沉没成本"],
  ["black-swan", groupB, "黑天鹅", "非常难预测且不寻常，并可能造成重大连锁影响", "难预测和不寻常是识别线索", "不等于已有明显迹象的大概率危机"],
  ["gray-rhino", groupB, "灰犀牛", "大概率、爆发前已有迹象但被忽视的危机", "大概率、有迹象、被忽视须同时保留", "不等于极难预测的罕见事件"],
  ["laffer", groupC, "拉弗曲线", "税率在限度内提高可增税收，超过限度继续提高反而可能使税收减少", "保留限度和非单调关系", "不推导具体最优税率"],
  ["liquidity", groupC, "流动偏好", "为保持货币使用灵活性，宁可牺牲利息而持有不生息货币", "货币灵活性与牺牲利息是线索", "不等于一般储蓄偏好"],
  ["phillips", groupC, "菲利普斯曲线", "正文所述失业率与通胀率短期反向，长期无效", "必须保留短期范围", "不作为长期恒定规律或现实预测"],
];
const refKey = { nash: "nash", "marginal-utility": "utility", "opportunity-cost": "opportunity", "sunk-cost": "sunk", "black-swan": "black", "gray-rhino": "gray", laffer: "laffer", liquidity: "liquidity", phillips: "phillips" };
const targets = defs.map(([key, groupId, name, meaning, condition, exclude]) => ({ id: `cs-target-term-${key}`, revision: 1, status: "review", scope: "economics", groupId, statement: `能识别${name}的正文定义。`, conclusion: meaning, conditions: [condition], excludes: [exclude], refs: [refs[refKey[key]]] }));
const directRows = [
  ["term-nash", "nash", "哪种局面是纳什均衡？", ["任何参与人单独改变策略都不会获益的策略组合", "所有参与人收益完全相同", "任何人都可以通过单方改变策略获益"], 0],
  ["term-marginal-utility", "marginal-utility", "连续增加某商品消费量时，每新增一单位带来的效用增量递减，称为什么？", ["边际效用递减", "规模效应", "挤出效应"], 0],
  ["term-opportunity-cost", "opportunity-cost", "为得到某种选择而放弃的其他机会中的最大价值，称为什么？", ["沉没成本", "机会成本", "固定成本"], 1],
  ["term-sunk-cost", "sunk-cost", "已经付出且不可收回的成本，称为什么？", ["机会成本", "边际成本", "沉没成本"], 2],
  ["term-black-swan", "black-swan", "非常难预测且不寻常，并可能引发重大连锁影响的事件，常称为什么？", ["灰犀牛", "黑天鹅", "马太效应"], 1],
  ["term-gray-rhino", "gray-rhino", "大概率、事前已有迹象却被忽视的危机，常称为什么？", ["灰犀牛", "黑天鹅", "棘轮效应"], 0],
  ["term-laffer", "laffer", "描述税率超过一定限度后继续提高，税收收入反而可能减少的曲线是？", ["菲利普斯曲线", "需求曲线", "拉弗曲线"], 2],
  ["term-liquidity", "liquidity", "为保持货币使用灵活性，宁可牺牲利息而持有货币的心理倾向是？", ["流动偏好", "机会成本", "规模效应"], 0],
  ["term-phillips", "phillips", "按正文，短期内失业率与通货膨胀率反向变动，描述这一关系的是？", ["拉弗曲线", "菲利普斯曲线", "洛伦兹曲线"], 1],
];
const byKey = Object.fromEntries(defs.map((row) => [row[0], row]));
const addedQuestions = directRows.map(([id, key, stem, options, answer]) => { const d = byKey[key]; return question(id, "economics", d[1], `识别${d[2]}`, stem, options, answer, d[3], d[5], [refs[refKey[key]]]); });
addedQuestions.splice(4, 0, question("economic-terms-choice-full", "economics", groupA, "综合复辨选择与成本", "下列哪一项完整正确？", ["纳什看单方改变无益；边际效用看新增效用递减；机会成本看放弃的最大价值；沉没成本看已付不可回收", "机会成本就是已付不可回收；沉没成本是放弃的最大价值", "边际效用递减表示总效用必然下降"], 0, "该项保留四个概念的不同识别线索。", "不能互换机会成本与沉没成本。", [refs.nash, refs.utility, refs.opportunity, refs.sunk]));
addedQuestions.push(question("economic-terms-risk-full", "economics", groupB, "综合复辨两类风险", "下列哪一项完整正确？", ["黑天鹅难预测且不寻常；灰犀牛大概率、有迹象却被忽视", "黑天鹅是已有迹象的大概率危机；灰犀牛极难预测", "二者都只表示普通日常波动"], 0, "该项保留黑天鹅与灰犀牛的识别边界。", "不把两个概念互换。", [refs.black, refs.gray]));
addedQuestions.push(question("economic-terms-curve-full", "economics", groupC, "综合复辨曲线与持币", "下列哪一项完整正确？", ["拉弗看税率税收非单调；流动偏好看牺牲利息持币；菲利普斯关系限于短期", "拉弗给出固定最优税率；流动偏好是一般储蓄；菲利普斯长期恒定", "三者都描述强弱分化"], 0, "该项保留三项概念的变量、动机和时间范围。", "不把教材关系外推为现实恒定结论。", [refs.laffer, refs.liquidity, refs.phillips]));
const directIds = Object.fromEntries(directRows.map(([id, key]) => [key, id]));
const questionSpecifications = directRows.map(([id, key, , options, answer]) => ({ questionId: id, primaryTargetIds: [`cs-target-term-${key}`], supportingTargetIds: [], checkPurpose: key, distractorReasons: Object.fromEntries(options.map((_, i) => i).filter((i) => i !== answer).map((i) => [i, `该选项不符合${byKey[key][2]}的正文定义。`])) }));
questionSpecifications.splice(4, 0, { questionId: "economic-terms-choice-full", primaryTargetIds: defs.filter((x) => x[1] === groupA).map((x) => `cs-target-term-${x[0]}`), supportingTargetIds: [], checkPurpose: "full-recheck", distractorReasons: { 1: "机会成本与沉没成本互换。", 2: "边际效用递减不等于总效用必然下降。" } });
questionSpecifications.push({ questionId: "economic-terms-risk-full", primaryTargetIds: defs.filter((x) => x[1] === groupB).map((x) => `cs-target-term-${x[0]}`), supportingTargetIds: [], checkPurpose: "full-recheck", distractorReasons: { 1: "黑天鹅与灰犀牛特征互换。", 2: "两者都不是普通日常波动的同义词。" } });
questionSpecifications.push({ questionId: "economic-terms-curve-full", primaryTargetIds: defs.filter((x) => x[1] === groupC).map((x) => `cs-target-term-${x[0]}`), supportingTargetIds: [], checkPurpose: "full-recheck", distractorReasons: { 1: "忽略限度、持币动机和短期范围。", 2: "强弱分化对应马太效应。" } });
const phrase = (key, text, fullId) => ({ id: `term-memory-${key}`, phrase: text, meaning: byKey[key][3], targetIds: [`cs-target-term-${key}`], coverageType: key, conditionRefs: [], refs: [refs[refKey[key]]], questionIds: [directIds[key], fullId], checks: [{ questionId: directIds[key], checkPurpose: key, reviewTarget: "phrase", reviewAnchorId: `term-memory-${key}` }, { questionId: fullId, checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: `term-memory-${key}` }] });
const mk = (id, title, text, keys, fullId, excludes) => ({ id, revision: 1, status: "review", scope: "economics", title, purpose: `帮助回忆${title}。`, text, method: "关键词串联", coverage: keys.map((k) => byKey[k][2]).join("、"), conditions: ["口诀只压缩正文定义。"], excludes, phrases: keys.map((k) => phrase(k, ({ nash: "纳什单改无益", "marginal-utility": "边效新增递减", "opportunity-cost": "机会放弃最大", "sunk-cost": "沉没已付不回", "black-swan": "黑天鹅难预测", "gray-rhino": "灰犀牛有迹象", laffer: "拉弗税率税收拐", liquidity: "流动偏好牺牲息持币", phillips: "菲利普斯短期反向" })[k], fullId)), questionIds: addedQuestions.filter((q) => q.group === byKey[keys[0]][1]).map((q) => q.id) });
const mnemonics = [
  mk("economic-terms-choice-memory", "选择与成本四概念", "纳什单改无益，边效新增递减；机会放弃最大，沉没已付不回。", ["nash", "marginal-utility", "opportunity-cost", "sunk-cost"], "economic-terms-choice-full", ["具体博弈解", "总效用走势"]),
  mk("economic-terms-risk-memory", "黑天鹅与灰犀牛", "黑天鹅难预测，灰犀牛有迹象。", ["black-swan", "gray-rhino"], "economic-terms-risk-full", ["具体事件风险结论"]),
  mk("economic-terms-curve-memory", "曲线与持币三概念", "拉弗税率税收拐，流动偏好牺牲息持币，菲利普斯短期反向。", ["laffer", "liquidity", "phillips"], "economic-terms-curve-full", ["具体最优税率", "长期通胀失业关系"]),
];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const variationDecisions = targets.map((x) => { const key = x.id.replace("cs-target-term-", ""); const fullId = x.groupId === groupA ? "economic-terms-choice-full" : x.groupId === groupB ? "economic-terms-risk-full" : "economic-terms-curve-full"; return { targetId: x.id, directQuestionIds: [directIds[key]], variationQuestionIds: [fullId] }; });
const groups = [{ id: groupA, title: "选择与成本四概念", scope: "economics", reason: "区分博弈、效用和两类成本。", questionIds: addedQuestions.filter((q) => q.group === groupA).map((q) => q.id) }, { id: groupB, title: "黑天鹅与灰犀牛", scope: "economics", reason: "按可预测性和事前迹象区分两类风险。", questionIds: addedQuestions.filter((q) => q.group === groupB).map((q) => q.id) }, { id: groupC, title: "曲线与持币三概念", scope: "economics", reason: "按变量关系、持币动机和时间范围区分三项概念。", questionIds: addedQuestions.filter((q) => q.group === groupC).map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "economic-terms-core", pointId: "economic-terms", tabIds: defs.map((x) => refs[refKey[x[0]]].tabId), status: "已建设", batch: "C5-16B", scope: "九个经济名词拆为选择与成本、风险与曲线持币两个批次建设" }, { candidateId: "resource-allocation-core", pointId: "market-economy", relatedPointIds: ["planned-allocation", "market-allocation"], tabIds: ["resource-allocation-overview"], status: "可建设", batch: "C5-16B", scope: "资源配置、计划配置和市场配置拆分核对" }];
const migration = { fromVersion: "39d67268", toPackVersion: "2026-10-21.20", changedQuestionIds: addedQuestions.map((x) => x.id), changedMnemonicIds: mnemonics.map((x) => x.id), reason: "C5-16 新增九个经济名词主题；既有会话保留。" };
function partition(batch, selectedGroupIds, smallThemes, includeDispositionAndMigration) {
  const selected = new Set(selectedGroupIds);
  const partQuestions = addedQuestions.filter((x) => selected.has(x.group));
  const questionIds = new Set(partQuestions.map((x) => x.id));
  const partTargets = targets.filter((x) => selected.has(x.groupId));
  const targetIds = new Set(partTargets.map((x) => x.id));
  const partGroups = groups.filter((x) => selected.has(x.id));
  const partMnemonics = mnemonics.filter((x) => x.questionIds.some((id) => questionIds.has(id)));
  const mnemonicIds = new Set(partMnemonics.map((x) => x.id));
  const partSpecifications = questionSpecifications.filter((x) => questionIds.has(x.questionId));
  const partRelations = mnemonicPhraseTargetRelations.filter((x) => mnemonicIds.has(x.mnemonicId));
  const partMnemonicSpecifications = mnemonicSpecifications.filter((x) => mnemonicIds.has(x.mnemonicId));
  const partVariationDecisions = variationDecisions.filter((x) => targetIds.has(x.targetId));
  function applyQuestions(items) { return items.concat(partQuestions); }
  function applyGroups(items) { return items.concat(partGroups); }
  function applyMnemonics(items) { return items.concat(partMnemonics); }
  function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = partQuestions.map((x) => x.id); plan.revision = 22; plan.modes.qa.groupIds.push(...partGroups.map((x) => x.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...partMnemonics.map((x) => x.id)); return plan; }
  return { schemaVersion: 1, revision: 2, batch, smallThemes, targets: partTargets, addedQuestions: partQuestions, questionSpecifications: partSpecifications, questionTargetRelations: partSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics: partMnemonics, mnemonicSpecifications: partMnemonicSpecifications, mnemonicPhraseTargetRelations: partRelations, variationDecisions: partVariationDecisions, groups: partGroups, sourceDispositions: includeDispositionAndMigration ? sourceDispositions : [], sessionMigrations: includeDispositionAndMigration ? [migration] : [], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
}
module.exports = partition("C5-16", [groupA], ["选择与成本四概念"], false);
module.exports.splitPart = partition("C5-16B", [groupB, groupC], ["黑天鹅与灰犀牛", "曲线与持币三概念"], true);
