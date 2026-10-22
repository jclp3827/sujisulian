// C5-8: market-failure meaning and GDP/GNP accounting boundaries.
const { ref, question } = require("./learning-authoring");
const failure = ref("market-failure-meaning", "market-failure-meaning", "cs-23-30-p12-market-failure-meaning-list");
const gdp = ref("economic-growth", "economic-growth-gdp", "cs-23-30-p15-gdp-list");
const gnp = ref("economic-growth", "economic-growth-gnp", "cs-23-30-p15-gnp-list");
const t = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-market-failure-meaning", "market-failure-meaning", "能识别市场机制不能实现资源有效配置这一市场失灵定义。", "通过市场机制不能实现资源的有效配置，即为市场失灵。", ["判断核心是市场机制未能实现资源有效配置。"], ["不把任何市场价格波动都称为市场失灵。"], [failure]),
  t("cs-target-gdp-definition", "gdp-gnp-boundaries", "能识别 GDP 是一定时期、一国或地区范围内生产的最终产品和劳务的市场价值。", "GDP 采用一定时期、地域范围、生产、最终产品与市场价值口径。", ["定义要素不能只保留其中一项。"], ["不计算具体 GDP 数值。"], [gdp]),
  t("cs-target-gdp-final-products", "gdp-gnp-boundaries", "能说明 GDP 只计最终产品而不重复计中间产品。", "中间产品价值不再单独计入 GDP，以避免重复计算。", ["题目按正文最终产品口径判断。"], ["不处理存货和增加值核算的复杂案例。"], [gdp]),
  t("cs-target-gdp-flow-production", "gdp-gnp-boundaries", "能识别 GDP 是计算期内生产的流量，不以当期是否售出为条件。", "GDP 是一定时期内生产的最终产品价值，属于流量。", ["区分一定时期与一定时点。"], ["不扩展实际 GDP、名义 GDP。"], [gdp]),
  t("cs-target-gdp-gnp-boundary", "gdp-gnp-boundaries", "能区分 GDP 的地域口径和 GNP 的国民口径。", "GDP 是地域概念；GNP 按常住居民拥有的生产要素形成国民概念。", ["比较使用正文口径。"], ["不计算境外要素收入。"], [gdp, gnp]),
];
const addedQuestions = [
  question("market-failure-meaning-direct", "economics", "market-failure-meaning", "直接识别市场失灵定义", "哪一项符合正文对市场失灵的定义？", ["市场机制不能实现资源的有效配置", "市场价格发生任何变化", "某一企业利润下降"], 0, "市场失灵是通过市场机制不能实现资源的有效配置。", "价格波动或单个企业利润变化本身不足以构成定义。", [failure]),
  question("market-failure-meaning-scenario", "economics", "market-failure-meaning", "情境复辨市场失灵", "某种情况下，单靠市场机制无法使资源得到有效配置。按正文应称为什么？", ["市场失灵", "充分就业", "国际收支平衡"], 0, "题干保留了市场机制不能实现资源有效配置这一核心。", "不据此判断具体失灵原因。", [failure]),
  question("gdp-definition-core", "economics", "gdp-gnp-boundaries", "识别 GDP 定义要素", "按正文，GDP 衡量的是什么？", ["一国或地区一定时期内生产的全部最终产品和劳务的市场价值", "某一时点全部资产的账面余额", "全球所有中间产品价值的简单相加"], 0, "GDP 采用地域、一定时期、生产、最终产品与市场价值口径。", "本题不计算数值。", [gdp]),
  question("gdp-final-intermediate", "economics", "gdp-gnp-boundaries", "区分最终产品与中间产品", "为什么 GDP 不把中间产品价值再次单独计入？", ["避免重复计算", "因为中间产品没有任何价值", "因为 GDP 只统计进口品"], 0, "GDP 测度最终产品价值，中间产品若再次单独计入会造成重复计算。", "不是说中间产品没有价值。", [gdp]),
  question("gdp-flow-produced", "economics", "gdp-gnp-boundaries", "识别流量和生产口径", "下列关于 GDP 的哪一项正确？", ["它是一定时点的存量，只计已经售出的产品", "它是一定时期内生产的最终产品价值，属于流量，不以当期售出为必要条件", "它只记录非市场家务劳动"], 1, "GDP 是计算期内生产的最终产品价值，属于流量，而不是时点存量。", "正文还指出一般仅指市场活动导致的价值。", [gdp]),
  question("gdp-gnp-territory-national", "economics", "gdp-gnp-boundaries", "区分地域与国民口径", "GDP 与 GNP 的口径区别，哪一项符合正文？", ["GDP 是地域概念，GNP 是国民概念", "GDP 是国民概念，GNP 是地域概念", "两者只按产品是否售出区分"], 0, "GDP 按一国或地区范围生产，是地域概念；GNP 按常住居民拥有的生产要素，是国民概念。", "本题不计算境外要素收入。", [gdp, gnp]),
  question("gdp-gnp-full", "economics", "gdp-gnp-boundaries", "综合复辨核算边界", "下列关于 GDP 的表述，哪一项完整正确？", ["计入全部中间产品并按某一时点统计", "按国民身份统计，且只计当期售出的产品", "按地域统计一定时期内生产的最终产品市场价值，属于流量；与按国民口径的 GNP 有别"], 2, "该项同时保留地域、时期、生产、最终产品、市场价值和流量口径，并正确区分 GNP。", "不扩展名义与实际 GDP。", [gdp, gnp]),
];
const rows = [
  ["market-failure-meaning-direct", ["cs-target-market-failure-meaning"], [], "definition", { 1: "价格变化本身不等于资源无法有效配置。", 2: "单个企业利润下降不构成定义。" }],
  ["market-failure-meaning-scenario", ["cs-target-market-failure-meaning"], [], "scenario-recheck", { 1: "充分就业是宏观目标，不是题干定义。", 2: "国际收支平衡是宏观目标。" }],
  ["gdp-definition-core", ["cs-target-gdp-definition"], [], "definition", { 1: "GDP 是时期流量，不是时点资产存量。", 2: "中间产品不能简单重复计入。" }],
  ["gdp-final-intermediate", ["cs-target-gdp-final-products"], [], "final-product", { 1: "中间产品有价值，只是不重复单独计入。", 2: "GDP 并非只统计进口品。" }],
  ["gdp-flow-produced", ["cs-target-gdp-flow-production"], [], "flow-production", { 0: "GDP 是时期流量，并按生产口径。", 2: "正文指出一般不计非市场家务劳动。" }],
  ["gdp-gnp-territory-national", ["cs-target-gdp-gnp-boundary"], [], "territory-national", { 1: "地域和国民口径被颠倒。", 2: "是否售出不是 GDP 与 GNP 的区分标准。" }],
  ["gdp-gnp-full", ["cs-target-gdp-definition", "cs-target-gdp-final-products", "cs-target-gdp-flow-production", "cs-target-gdp-gnp-boundary"], [], "full-recheck", { 0: "中间产品重复计入且把流量错为存量。", 1: "GDP 是地域口径且不以当期售出为必要条件。" }],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));
const mnemonics = [{ id: "gdp-gnp-boundaries-memory", revision: 1, status: "review", scope: "economics", title: "GDP 核算边界", purpose: "压缩 GDP 核算要素并区分 GNP。", text: "境内、当期、最终、市场值；流量看生产，GDP 地域、GNP 国民。", method: "边界词串联", coverage: "GDP 的地域、时期、最终产品、市场价值、流量生产口径及与 GNP 的区别。", conditions: ["“境内”用于提示地域口径，完整表述是一国或地区范围内。"], excludes: ["名义与实际 GDP", "增加值、存货及境外要素收入计算"], phrases: [
  { id: "gdp-memory-definition", phrase: "境内、当期、最终、市场值", meaning: "一国或地区一定时期内生产的最终产品和劳务的市场价值。", targetIds: ["cs-target-gdp-definition", "cs-target-gdp-final-products"], coverageType: "definition-boundaries", conditionRefs: [], refs: [gdp], questionIds: ["gdp-definition-core", "gdp-final-intermediate", "gdp-gnp-full"], checks: [{ questionId: "gdp-definition-core", checkPurpose: "definition", reviewTarget: "phrase", reviewAnchorId: "gdp-memory-definition" }, { questionId: "gdp-final-intermediate", checkPurpose: "final-product", reviewTarget: "meaning", reviewAnchorId: "gdp-memory-definition" }, { questionId: "gdp-gnp-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "gdp-memory-definition" }] },
  { id: "gdp-memory-flow", phrase: "流量看生产", meaning: "GDP 是一定时期内生产的流量，不以当期售出为必要条件。", targetIds: ["cs-target-gdp-flow-production"], coverageType: "flow-production", conditionRefs: [], refs: [gdp], questionIds: ["gdp-flow-produced", "gdp-gnp-full"], checks: [{ questionId: "gdp-flow-produced", checkPurpose: "flow-production", reviewTarget: "phrase", reviewAnchorId: "gdp-memory-flow" }, { questionId: "gdp-gnp-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "gdp-memory-flow" }] },
  { id: "gdp-memory-gdp-gnp", phrase: "GDP 地域、GNP 国民", meaning: "GDP 按地域，GNP 按常住居民生产要素的国民口径。", targetIds: ["cs-target-gdp-gnp-boundary"], coverageType: "territory-national", conditionRefs: [], refs: [gdp, gnp], questionIds: ["gdp-gnp-territory-national", "gdp-gnp-full"], checks: [{ questionId: "gdp-gnp-territory-national", checkPurpose: "territory-national", reviewTarget: "phrase", reviewAnchorId: "gdp-memory-gdp-gnp" }, { questionId: "gdp-gnp-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: "gdp-memory-gdp-gnp" }] },
], questionIds: addedQuestions.slice(2).map((x) => x.id) }];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const variationDecisions = [
  ["cs-target-market-failure-meaning", ["market-failure-meaning-direct"], ["market-failure-meaning-scenario"]], ["cs-target-gdp-definition", ["gdp-definition-core"], ["gdp-gnp-full"]], ["cs-target-gdp-final-products", ["gdp-final-intermediate"], ["gdp-gnp-full"]], ["cs-target-gdp-flow-production", ["gdp-flow-produced"], ["gdp-gnp-full"]], ["cs-target-gdp-gnp-boundary", ["gdp-gnp-territory-national"], ["gdp-gnp-full"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));
const groups = [
  { id: "market-failure-meaning", title: "什么是市场失灵", scope: "economics", reason: "用定义与情境两种问法确认有效配置边界。", questionIds: addedQuestions.slice(0, 2).map((x) => x.id), mnemonicDecision: "not-suitable", mnemonicReason: "单一定义较短，直接理解优于另造口诀。" },
  { id: "gdp-gnp-boundaries", title: "GDP 与 GNP 核算边界", scope: "economics", reason: "集中区分最终产品、流量生产及地域国民口径。", questionIds: addedQuestions.slice(2).map((x) => x.id) },
];
const sourceDispositions = [
  { candidateId: "market-failure-meaning", pointId: "market-failure-meaning", tabIds: ["market-failure-meaning"], status: "已建设", batch: "C5-8", scope: "市场机制不能实现资源有效配置的定义；不展开原因" },
  { candidateId: "gdp-gnp-boundaries", pointId: "economic-growth", tabIds: ["economic-growth-gdp", "economic-growth-gnp"], status: "已建设", batch: "C5-8", scope: "GDP 定义、最终产品、流量生产、地域口径与 GNP 国民口径" },
  { candidateId: "economic-growth-three-carriages", pointId: "economic-growth", tabIds: ["economic-growth-drivers"], status: "可建设", batch: "C5-8", scope: "投资、消费、出口及内需外需对应" },
  { candidateId: "full-employment-core", pointId: "full-employment", tabIds: ["employment-measure", "unemployment-meaning", "unemployment-types", "unemployment-concepts"], status: "可建设", batch: "C5-8", scope: "就业失业、充分就业、失业类型和失业率基本口径" },
];
function applyQuestions(q) { return q.concat(addedQuestions); } function applyGroups(g) { return g.concat(groups); } function applyMnemonics(m) { return m.concat(mnemonics); }
function applyEntryPlans(e) { const p=JSON.parse(JSON.stringify(e)), ids=addedQuestions.map((x)=>x.id); p.revision=14; p.modes.qa.groupIds.push(...groups.map((x)=>x.id)); p.modes.qa.questionIds.push(...ids); p.modes.mnemonic.questionIds.push(...mnemonics[0].questionIds); p.modes.mnemonic.mnemonicIds.push(mnemonics[0].id); return p; }
module.exports={schemaVersion:1,revision:1,batch:"C5-8",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"86c72273",toPackVersion:"2026-10-21.12",changedQuestionIds:addedQuestions.map((x)=>x.id),changedMnemonicIds:mnemonics.map((x)=>x.id),reason:"C5-8 新增市场失灵定义与 GDP/GNP 边界组；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
