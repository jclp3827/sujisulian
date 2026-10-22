// C5-17: resource allocation and the core plan/market distinction.
const { ref, question } = require("./learning-authoring");
const overview = ref("market-economy", "resource-allocation-overview", "cs-23-30-p2-resource-allocation-overview-list");
const plannedDef = ref("planned-allocation", "planned-definition", "cs-23-30-p2-planned-allocation-definition-list");
const plannedMechanism = ref("planned-allocation", "planned-mechanism", "cs-23-30-p2-planned-mechanism-list");
const marketMeaning = ref("market-allocation", "market-meaning", "cs-23-30-p3-market-allocation-meaning-list");
const marketMechanism = ref("market-allocation", "market-mechanism", "cs-23-30-p3-market-mechanism-list");
const marketDefects = ref("market-allocation", "market-defects", "cs-23-30-p3-p4-market-defects-list");
const groupPlan = "resource-allocation-plan", groupMarket = "resource-allocation-market";
const t = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-resource-allocation-problem", groupPlan, "能识别经济生活中心问题是有效配置资源，以处理资源有限与需求无限的矛盾。", "中心问题和基本矛盾应成组理解。", ["必须同时保留资源有限、需求无限。"], ["不说资源或需求本身可以无限满足。"], [overview]),
  t("cs-target-resource-allocation-methods", groupPlan, "能识别现代经济中计划配置和市场配置两种主要方式。", "计划调节和市场调节是正文列出的两种方式。", ["按正文概述。"], ["不说两者彼此绝对排斥。"], [overview]),
  t("cs-target-planned-allocation-definition", groupPlan, "能识别计划配置由政府计划部门依据社会需要和可能，通过计划机制配置资源。", "主体、依据和机制是定义线索。", ["按正文基础定义。"], ["不扩展具体政策评价。"], [plannedDef]),
  t("cs-target-planned-allocation-mechanism", groupPlan, "能识别计划机制包括计划指标、经济杠杆和经济政策，属于事前调节。", "三个计划要素和事前调节必须同时保留。", ["不使用正文举例作恒定规则。"], ["暂不考“看得见的手”出处。"], [plannedMechanism]),
  t("cs-target-market-allocation-meaning", groupMarket, "能识别市场配置依靠市场机制和竞争配置资源，是价值规律实现形式并属于事后调节。", "市场竞争、价值规律和事后调节是核心线索。", ["按正文基础定义。"], ["暂不考“看不见的手”出处。"], [marketMeaning]),
  t("cs-target-market-mechanisms", groupMarket, "能识别市场机制包含供求、价格、竞争、风险等相互作用。", "价格、供求、竞争和风险构成正文机制范围。", ["只辨正文概括和核心线索。"], ["不要求死记所有长段定义。"], [marketMechanism]),
  t("cs-target-market-defects", groupMarket, "能区分市场调节的自发性、盲目性和滞后性。", "逐利倾向、信息分散和事后反应分别对应三类缺点。", ["按原因线索区分。"], ["不把市场失灵四因素与三缺点混为一组。"], [marketDefects]),
];
const addedQuestions = [
  question("resource-allocation-problem", "economics", groupPlan, "识别资源配置中心问题", "经济生活为什么要研究资源的有效配置？", ["要处理资源有限性与需求无限性之间的矛盾", "因为所有资源都取之不尽", "因为需求总是有限"], 0, "资源有限与需求无限形成需要有效配置的基本矛盾。", "不能反置资源和需求的有限性。", [overview]),
  question("resource-allocation-methods", "economics", groupPlan, "识别两种配置方式", "正文列出的现代经济两种主要资源配置方式是？", ["计划配置和市场配置", "只靠行政命令和随机选择", "只靠市场配置"], 0, "正文列出计划配置和市场配置两种主要方式。", "不说二者绝对排斥。", [overview]),
  question("planned-allocation-definition", "economics", groupPlan, "识别计划配置", "政府计划部门依据社会需要和可能，通过计划机制配置资源，属于什么方式？", ["市场配置", "计划配置", "风险机制"], 1, "该表述符合计划配置的正文定义。", "不扩展具体政策评价。", [plannedDef]),
  question("planned-allocation-mechanism", "economics", groupPlan, "识别计划机制", "哪一项符合正文对计划机制的概括？", ["由计划指标、经济杠杆和经济政策等要素作用，属于事前调节", "只由价格涨落事后调节", "只包含竞争和风险机制"], 0, "三个计划要素和事前调节是识别线索。", "本题不考具体举例和出处。", [plannedMechanism]),
  question("resource-allocation-plan-full", "economics", groupPlan, "综合复辨资源与计划", "下列哪一项完整正确？", ["资源有限与需求无限要求有效配置；方式主要有计划和市场；计划机制属于事前调节", "资源无限、需求有限，因此不需配置", "计划配置只依靠市场竞争，属于事后调节"], 0, "该项连接了基本矛盾、两种方式和计划调节时点。", "不评价具体制度优劣。", [overview, plannedDef, plannedMechanism]),
  question("market-allocation-meaning", "economics", groupMarket, "识别市场配置", "依靠市场机制和竞争实现资源配置、属于价值规律实现形式和事后调节的是？", ["计划配置", "市场配置", "行政许可"], 1, "该表述对应市场配置。", "暂不考相关名言出处。", [marketMeaning]),
  question("market-mechanisms", "economics", groupMarket, "识别市场机制组成", "正文概括的市场机制主要包含哪些相互作用要素？", ["供求、价格、竞争、风险", "只有工资和税收", "只有计划指标"], 0, "供求、价格、竞争和风险构成正文所列市场机制。", "不要求死记长段定义。", [marketMechanism]),
  question("market-defects", "economics", groupMarket, "区分市场调节缺点", "经营者信息分散，看到有利可图便一哄而上，主要体现市场调节的什么缺点？", ["自发性", "盲目性", "滞后性"], 1, "信息不全、分散决策和一哄而上是盲目性的线索。", "逐利不择手段偏自发性，价格变化后才调整偏滞后性。", [marketDefects]),
  question("resource-allocation-market-full", "economics", groupMarket, "综合复辨市场配置", "下列哪一项完整正确？", ["市场配置依靠市场机制并属事后调节；机制含供求价格竞争风险；缺点可分自发盲目滞后", "市场配置由政府计划部门事前制定，只含计划指标", "市场调节没有信息不全或反应滞后问题"], 0, "该项保留市场配置的方式、机制和三类缺点。", "不把市场失灵四因素混入三缺点。", [marketMeaning, marketMechanism, marketDefects]),
];
const specs = [
  ["resource-allocation-problem", ["cs-target-resource-allocation-problem"], "problem", { 1: "资源并非取之不尽。", 2: "正文强调需求无限性。" }],
  ["resource-allocation-methods", ["cs-target-resource-allocation-methods"], "methods", { 1: "正文未列随机选择。", 2: "正文同时列出计划配置。" }],
  ["planned-allocation-definition", ["cs-target-planned-allocation-definition"], "planned-definition", { 0: "市场配置依靠市场机制。", 2: "风险机制属于市场机制内容。" }],
  ["planned-allocation-mechanism", ["cs-target-planned-allocation-mechanism"], "planned-mechanism", { 1: "这是市场事后调节线索。", 2: "竞争和风险属于市场机制。" }],
  ["resource-allocation-plan-full", ["cs-target-resource-allocation-problem", "cs-target-resource-allocation-methods", "cs-target-planned-allocation-definition", "cs-target-planned-allocation-mechanism"], "full-recheck", { 1: "资源与需求关系反置。", 2: "计划与市场机制错配。" }],
  ["market-allocation-meaning", ["cs-target-market-allocation-meaning"], "market-meaning", { 0: "计划配置由政府计划部门通过计划机制实现。", 2: "行政许可不是资源配置方式名称。" }],
  ["market-mechanisms", ["cs-target-market-mechanisms"], "market-mechanisms", { 1: "工资和税收不能概括正文四机制。", 2: "计划指标属于计划机制。" }],
  ["market-defects", ["cs-target-market-defects"], "market-defects", { 0: "自发性核心线索是逐利倾向。", 2: "滞后性强调价格变化后才调整。" }],
  ["resource-allocation-market-full", ["cs-target-market-allocation-meaning", "cs-target-market-mechanisms", "cs-target-market-defects"], "full-recheck", { 1: "把市场配置误写为计划配置。", 2: "否认正文列出的市场调节缺点。" }],
];
const questionSpecifications = specs.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
function phrase(id, text, meaning, targetIds, coverageType, sourceRefs, directId, fullId) { return { id, phrase: text, meaning, targetIds, coverageType, conditionRefs: [], refs: sourceRefs, questionIds: [directId, fullId], checks: [{ questionId: directId, checkPurpose: coverageType, reviewTarget: "phrase", reviewAnchorId: id }, { questionId: fullId, checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: id }] }; }
const mnemonics = [
  { id: "resource-allocation-plan-memory", revision: 1, status: "review", scope: "economics", title: "资源与计划配置", purpose: "帮助回忆资源配置和计划机制。", text: "资源有限、需求无限；配置计划加市场，计划部门事前管。", method: "矛盾与时点串联", coverage: "资源配置中心问题、两种方式和计划机制。", conditions: ["只压缩正文基础关系。"], excludes: ["看得见的手出处", "计划要素具体举例"], phrases: [
    phrase("allocation-memory-problem", "资源有限、需求无限", "有效配置资源用于处理两者矛盾。", ["cs-target-resource-allocation-problem"], "problem", [overview], "resource-allocation-problem", "resource-allocation-plan-full"),
    phrase("allocation-memory-methods", "配置计划加市场", "现代经济主要有计划配置和市场配置。", ["cs-target-resource-allocation-methods"], "methods", [overview], "resource-allocation-methods", "resource-allocation-plan-full"),
    phrase("allocation-memory-plan-definition", "计划部门来配置", "政府计划部门通过计划机制配置资源。", ["cs-target-planned-allocation-definition"], "planned-definition", [plannedDef], "planned-allocation-definition", "resource-allocation-plan-full"),
    phrase("allocation-memory-plan-mechanism", "计划机制事前管", "计划指标、经济杠杆和经济政策相互作用，属于事前调节。", ["cs-target-planned-allocation-mechanism"], "planned-mechanism", [plannedMechanism], "planned-allocation-mechanism", "resource-allocation-plan-full"),
  ], questionIds: addedQuestions.slice(0, 5).map((q) => q.id) },
  { id: "resource-allocation-market-memory", revision: 1, status: "review", scope: "economics", title: "市场配置机制与缺点", purpose: "帮助回忆市场配置。", text: "市场竞争事后调，供价竞险四机制；逐利自发、信息盲目、反应滞后。", method: "机制与原因串联", coverage: "市场配置含义、四机制和三缺点。", conditions: ["只压缩正文基础关系。"], excludes: ["看不见的手出处", "市场失灵四因素"], phrases: [
    phrase("allocation-memory-market", "市场竞争事后调", "依靠市场机制和竞争配置资源，属于事后调节。", ["cs-target-market-allocation-meaning"], "market-meaning", [marketMeaning], "market-allocation-meaning", "resource-allocation-market-full"),
    phrase("allocation-memory-mechanisms", "供价竞险四机制", "供求、价格、竞争、风险相互作用。", ["cs-target-market-mechanisms"], "market-mechanisms", [marketMechanism], "market-mechanisms", "resource-allocation-market-full"),
    phrase("allocation-memory-defects", "逐利自发、信息盲目、反应滞后", "按原因区分自发性、盲目性和滞后性。", ["cs-target-market-defects"], "market-defects", [marketDefects], "market-defects", "resource-allocation-market-full"),
  ], questionIds: addedQuestions.slice(5).map((q) => q.id) },
];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const direct = { "cs-target-resource-allocation-problem": "resource-allocation-problem", "cs-target-resource-allocation-methods": "resource-allocation-methods", "cs-target-planned-allocation-definition": "planned-allocation-definition", "cs-target-planned-allocation-mechanism": "planned-allocation-mechanism", "cs-target-market-allocation-meaning": "market-allocation-meaning", "cs-target-market-mechanisms": "market-mechanisms", "cs-target-market-defects": "market-defects" };
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: [x.groupId === groupPlan ? "resource-allocation-plan-full" : "resource-allocation-market-full"] }));
const groups = [{ id: groupPlan, title: "资源为什么要配置", scope: "economics", reason: "从基本矛盾进入两种方式和计划机制。", questionIds: addedQuestions.slice(0, 5).map((q) => q.id) }, { id: groupMarket, title: "市场如何配置资源", scope: "economics", reason: "用含义、机制和三类缺点构成一个小组。", questionIds: addedQuestions.slice(5).map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "resource-allocation-core", pointId: "market-economy", relatedPointIds: ["planned-allocation", "market-allocation"], tabIds: ["resource-allocation-overview", "planned-definition", "planned-mechanism", "market-meaning", "market-mechanism", "market-defects"], status: "已建设", batch: "C5-17", scope: "资源配置基本矛盾、两种方式与计划市场核心机制" }, { candidateId: "planned-allocation-attribution-examples", pointId: "planned-allocation", tabIds: ["visible-hand", "planned-examples"], status: "待补依据", batch: "C5-17", scope: "名言出处与计划要素举例需独立核验后再开题" }, { candidateId: "market-definition-enterprise", pointId: "market-definition-elements", relatedPointIds: ["enterprise-organization"], tabIds: ["market-definition", "market-elements"], status: "可建设", batch: "C5-17", scope: "市场定义与三要素、企业定义和组织形式分组建设" }];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((q) => q.id); plan.revision = 23; plan.modes.qa.groupIds.push(...groups.map((g) => g.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((m) => m.id)); return plan; }
module.exports = { schemaVersion: 1, revision: 1, batch: "C5-17", targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "6e72df66", toPackVersion: "2026-10-21.21", changedQuestionIds: addedQuestions.map((q) => q.id), changedMnemonicIds: mnemonics.map((m) => m.id), reason: "C5-17 新增资源配置与计划市场核心主题；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
