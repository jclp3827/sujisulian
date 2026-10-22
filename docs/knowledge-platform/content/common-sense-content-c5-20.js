// C5-20: market-economy meaning and three basic laws.
const { ref, question } = require("./learning-authoring");
const meaning = ref("market-economy-meaning", "market-economy-definition", "cs-23-30-p6-market-economy-meaning-list");
const value = ref("market-economy-laws", "value-law", "cs-23-30-p6-value-law-list");
const competition = ref("market-economy-laws", "competition-law", "cs-23-30-p6-competition-law-list");
const supplyDemand = ref("market-economy-laws", "supply-demand-law", "cs-23-30-p6-p7-supply-demand-law-list");
const groupId = "market-economy-meaning-laws";
const t = (id, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-market-economy-meaning", "能识别市场经济是由市场进行资源调配的经济运行形式。", "市场取向和市场配置资源是定义核心。", ["只按正文基础定义。"], ["不等于完全没有政府作用。"], [meaning]),
  t("cs-target-value-law", "能识别价值规律中社会必要劳动时间决定价值、以价值量为基础等价交换。", "价值决定和交换原则须成组保留。", ["按正文理论表述。"], ["不将个别劳动时间直接等同价值。"], [value]),
  t("cs-target-competition-law", "能识别竞争规律说明市场主体争夺经济利益具有必然性。", "主体、经济利益和必然性是识别线索。", ["按正文概括。"], ["不等于具体竞争手段。"], [competition]),
  t("cs-target-supply-demand-law", "能识别供求规律连接市场供给与有支付能力需求并趋向平衡，与价值和竞争规律共同作用。", "有支付能力的需求、价格波动调节和共同作用须保留。", ["按正文基础范围。"], ["不说供求规律孤立发挥作用。"], [supplyDemand]),
];
const addedQuestions = [
  question("market-economy-meaning", "economics", groupId, "识别市场经济定义", "市场经济又称市场取向的经济，其核心定义是？", ["由市场进行资源调配的经济运行形式", "资源只由计划部门配置", "任何交易都无需规则"], 0, "市场配置资源是市场经济定义的核心。", "不等于完全没有政府作用。", [meaning]),
  question("value-law", "economics", groupId, "识别价值规律", "哪一项符合正文对价值规律的表述？", ["商品价值由社会必要劳动时间决定，交换以价值量为基础实行等价交换", "商品价值只由个别劳动时间决定", "商品交换不以价值量为基础"], 0, "正文把社会必要劳动时间和等价交换连接起来。", "不要以个别劳动时间替代社会必要劳动时间。", [value]),
  question("competition-law", "economics", groupId, "识别竞争规律", "市场各主体争夺经济利益具有必然性，描述的是？", ["供求规律", "竞争规律", "棘轮效应"], 1, "该表述对应竞争规律。", "不等于具体竞争手段。", [competition]),
  question("supply-demand-law", "economics", groupId, "识别供求规律", "正文中的供求规律强调市场供给与哪类需求的内在联系和趋向平衡？", ["有支付能力的需求", "所有愿望的总和", "与价格完全无关的需求"], 0, "正文明确为有支付能力的需求。", "供求规律通过价格波动发挥调节作用。", [supplyDemand]),
  question("market-economy-laws-full", "economics", groupId, "综合复辨三规律", "下列哪一项完整正确？", ["市场经济由市场配置资源；价值规律看社会必要劳动时间和等价交换；竞争规律看主体争利；供求规律看供给与有效需求并趋平衡", "价值规律看个别劳动时间；竞争规律与经济利益无关；供求规律孤立作用", "市场经济只允许计划配置，不存在市场调节"], 0, "该项正确连接定义和三条基本规律。", "三条规律相互联系，不能孤立错配。", [meaning, value, competition, supplyDemand]),
];
const rows = [
  ["market-economy-meaning", ["cs-target-market-economy-meaning"], "meaning", { 1: "这是计划配置。", 2: "市场经济仍需要规则。" }],
  ["value-law", ["cs-target-value-law"], "value", { 1: "正文是社会必要劳动时间。", 2: "正文保留以价值量为基础的交换。" }],
  ["competition-law", ["cs-target-competition-law"], "competition", { 0: "供求规律连接供给与有效需求。", 2: "棘轮效应描述消费惯性。" }],
  ["supply-demand-law", ["cs-target-supply-demand-law"], "supply-demand", { 1: "正文要求有支付能力。", 2: "供求规律通过价格波动调节。" }],
  ["market-economy-laws-full", targets.map((x) => x.id), "full-recheck", { 1: "三条规律均被误写。", 2: "市场经济定义被反置。" }],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
const phrase = (id, text, meaningText, targetId, purpose, source, directId) => ({ id, phrase: text, meaning: meaningText, targetIds: [targetId], coverageType: purpose, conditionRefs: [], refs: [source], questionIds: [directId, "market-economy-laws-full"], checks: [{ questionId: directId, checkPurpose: purpose, reviewTarget: "phrase", reviewAnchorId: id }, { questionId: "market-economy-laws-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: id }] });
const mnemonics = [{ id: "market-economy-laws-memory", revision: 1, status: "review", scope: "economics", title: "市场经济三规律", purpose: "帮助回忆市场经济含义和三规律。", text: "市场调资源；价值社会时等价，竞争主体争利益，供求有效需趋平衡。", method: "定义与关键词串联", coverage: "市场经济含义、价值、竞争和供求规律。", conditions: ["口诀只压缩正文基础关系。"], excludes: ["价格形成全部机制", "具体竞争手段"], phrases: [
  phrase("market-laws-memory-meaning", "市场调资源", "由市场进行资源调配。", "cs-target-market-economy-meaning", "meaning", meaning, "market-economy-meaning"),
  phrase("market-laws-memory-value", "价值社会时等价", "社会必要劳动时间决定价值并以价值量为基础等价交换。", "cs-target-value-law", "value", value, "value-law"),
  phrase("market-laws-memory-competition", "竞争主体争利益", "市场主体争夺经济利益具有必然性。", "cs-target-competition-law", "competition", competition, "competition-law"),
  phrase("market-laws-memory-supply", "供求有效需趋平衡", "市场供给与有支付能力需求内在联系并趋向平衡。", "cs-target-supply-demand-law", "supply-demand", supplyDemand, "supply-demand-law"),
], questionIds: addedQuestions.map((q) => q.id) }];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const direct = { "cs-target-market-economy-meaning": "market-economy-meaning", "cs-target-value-law": "value-law", "cs-target-competition-law": "competition-law", "cs-target-supply-demand-law": "supply-demand-law" };
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: ["market-economy-laws-full"] }));
const groups = [{ id: groupId, title: "市场经济三规律", scope: "economics", reason: "先认市场配置资源，再区分价值、竞争与供求规律。", questionIds: addedQuestions.map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "market-economy-meaning-laws", pointId: "market-economy-meaning", relatedPointIds: ["market-economy-laws"], tabIds: ["market-economy-definition", "value-law", "competition-law", "supply-demand-law"], status: "已建设", batch: "C5-20", scope: "市场经济含义与价值、竞争、供求三规律" }, { candidateId: "market-economy-features-socialist", pointId: "market-economy-features", relatedPointIds: ["socialist-market-economy"], tabIds: ["market-feature-1", "market-feature-2", "market-feature-3", "market-feature-4", "market-feature-5", "market-feature-6"], status: "可建设", batch: "C5-20", scope: "市场经济六特征与社会主义市场经济定义框架分组建设" }];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((q) => q.id); plan.revision = 26; plan.modes.qa.groupIds.push(groupId); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(mnemonics[0].id); return plan; }
module.exports = { schemaVersion: 1, revision: 1, batch: "C5-20", targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "809af06c", toPackVersion: "2026-10-21.24", changedQuestionIds: addedQuestions.map((q) => q.id), changedMnemonicIds: mnemonics.map((m) => m.id), reason: "C5-20 新增市场经济定义和三规律主题；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
