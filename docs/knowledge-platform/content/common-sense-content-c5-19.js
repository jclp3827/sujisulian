// C5-19: market-system classification and its three pillars.
const { ref, question } = require("./learning-authoring");
const overview = ref("market-system-composition", "market-system-overview", "cs-23-30-p6-market-system-overview-list");
const commodity = ref("market-system-composition", "commodity-market", "cs-23-30-p6-commodity-market-list");
const factor = ref("market-system-composition", "factor-market", "cs-23-30-p6-factor-market-list");
const pillars = ref("market-system-composition", "market-pillars", "cs-23-30-p6-market-pillars-list");
const groupId = "market-system-core";
const t = (id, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-market-system-overview", "能识别市场体系主要分为商品市场和生产要素市场。", "分类依据是市场客体在社会再生产中的作用。", ["按正文两大类。"], ["不把三大支柱当成完整分类。"], [overview]),
  t("cs-target-commodity-market", "能识别商品市场包括消费品市场和生产资料市场。", "商品市场正文范围只有这两类。", ["按正文范围。"], ["不把资本市场列入商品市场。"], [commodity]),
  t("cs-target-factor-market", "能识别生产要素市场包括资本、劳动力、技术、信息和房地产市场。", "五类要素市场应完整辨认。", ["按正文列表。"], ["不把消费品市场列入要素市场。"], [factor]),
  t("cs-target-market-system-pillars", "能识别市场体系三大支柱是商品、资本和劳动力市场。", "三大支柱不等于两大分类，也不是全部要素市场。", ["三项须完整。"], ["不加入技术或信息市场。"], [pillars]),
];
const addedQuestions = [
  question("market-system-overview", "economics", groupId, "识别市场体系两大类", "按市场客体在社会再生产中的作用，市场体系主要分为？", ["商品市场和生产要素市场", "消费市场和政府部门", "计划市场和随机市场"], 0, "正文将市场体系主要分为商品市场和生产要素市场。", "不要与三大支柱混淆。", [overview]),
  question("commodity-market", "economics", groupId, "识别商品市场", "商品市场主要包括什么？", ["资本市场和劳动力市场", "消费品市场和生产资料市场", "技术市场和信息市场"], 1, "商品市场包括消费品市场和生产资料市场。", "资本、劳动、技术和信息属于要素市场范围。", [commodity]),
  question("factor-market", "economics", groupId, "识别要素市场", "下列哪一组完整属于正文列出的生产要素市场？", ["资本、劳动力、技术、信息、房地产", "消费品、生产资料", "商品、资本、劳动力三大支柱"], 0, "正文列出五类生产要素市场。", "三大支柱不是要素市场完整清单。", [factor]),
  question("market-system-pillars", "economics", groupId, "识别三大支柱", "市场体系三大支柱是？", ["商品、资本、劳动力市场", "消费品、技术、信息市场", "商品、生产资料、房地产市场"], 0, "三大支柱是商品市场、资本市场和劳动力市场。", "不把所有要素市场都列为支柱。", [pillars]),
  question("market-system-full", "economics", groupId, "综合复辨市场体系", "下列哪一项完整正确？", ["市场体系分商品与要素市场；商品市场含消费品和生产资料；要素市场含资本劳动技术信息房地产；三大支柱是商品资本劳动", "商品市场含资本劳动，三大支柱是全部五类要素市场", "市场体系只包含有固定交易场所的市场"], 0, "该项分别保留分类、子类和三大支柱。", "分类层级不能混用。", [overview, commodity, factor, pillars]),
];
const rows = [
  ["market-system-overview", ["cs-target-market-system-overview"], "overview", { 1: "政府部门不是正文第二大类。", 2: "正文无随机市场分类。" }],
  ["commodity-market", ["cs-target-commodity-market"], "commodity", { 0: "资本和劳动属于要素市场。", 2: "技术和信息属于要素市场。" }],
  ["factor-market", ["cs-target-factor-market"], "factor", { 1: "这是商品市场两类。", 2: "这是三大支柱而非要素市场完整清单。" }],
  ["market-system-pillars", ["cs-target-market-system-pillars"], "pillars", { 1: "技术信息不是正文三大支柱组合。", 2: "生产资料房地产不是三大支柱组合。" }],
  ["market-system-full", targets.map((x) => x.id), "full-recheck", { 1: "分类层级和范围错配。", 2: "市场不以固定场所为必要条件。" }],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
function p(id, text, meaning, targetId, purpose, source, directId) { return { id, phrase: text, meaning, targetIds: [targetId], coverageType: purpose, conditionRefs: [], refs: [source], questionIds: [directId, "market-system-full"], checks: [{ questionId: directId, checkPurpose: purpose, reviewTarget: "phrase", reviewAnchorId: id }, { questionId: "market-system-full", checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: id }] }; }
const mnemonics = [{ id: "market-system-core-memory", revision: 1, status: "review", scope: "economics", title: "市场体系分类", purpose: "帮助回忆市场体系层级。", text: "市场商品加要素；商品消与产，要素资劳技信房；三柱商品资劳。", method: "分类树压缩", coverage: "两大类、两类商品、五类要素和三大支柱。", conditions: ["按正文分类层级记忆。"], excludes: ["兼具特征的知识链接", "具体市场监管制度"], phrases: [
  p("market-system-memory-overview", "市场商品加要素", "两大类是商品市场和生产要素市场。", "cs-target-market-system-overview", "overview", overview, "market-system-overview"),
  p("market-system-memory-commodity", "商品消与产", "商品市场含消费品和生产资料市场。", "cs-target-commodity-market", "commodity", commodity, "commodity-market"),
  p("market-system-memory-factor", "要素资劳技信房", "要素市场含资本、劳动力、技术、信息、房地产。", "cs-target-factor-market", "factor", factor, "factor-market"),
  p("market-system-memory-pillars", "三柱商品资劳", "三大支柱是商品、资本、劳动力市场。", "cs-target-market-system-pillars", "pillars", pillars, "market-system-pillars"),
], questionIds: addedQuestions.map((q) => q.id) }];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const direct = { "cs-target-market-system-overview": "market-system-overview", "cs-target-commodity-market": "commodity-market", "cs-target-factor-market": "factor-market", "cs-target-market-system-pillars": "market-system-pillars" };
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: ["market-system-full"] }));
const groups = [{ id: groupId, title: "市场体系看分类层级", scope: "economics", reason: "一次区分两大类、内部成员和三大支柱。", questionIds: addedQuestions.map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "market-system-core", pointId: "market-system-composition", tabIds: ["market-system-overview", "commodity-market", "factor-market", "market-pillars"], status: "已建设", batch: "C5-19", scope: "市场体系两大类、内部成员和三大支柱" }, { candidateId: "market-economy-meaning-laws", pointId: "market-economy-meaning", relatedPointIds: ["market-economy-laws"], tabIds: ["market-economy-definition"], status: "可建设", batch: "C5-19", scope: "市场经济含义与价值、竞争、供求三规律" }];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((q) => q.id); plan.revision = 25; plan.modes.qa.groupIds.push(groupId); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(mnemonics[0].id); return plan; }
module.exports = { schemaVersion: 1, revision: 1, batch: "C5-19", targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "39c3555d", toPackVersion: "2026-10-21.23", changedQuestionIds: addedQuestions.map((q) => q.id), changedMnemonicIds: mnemonics.map((m) => m.id), reason: "C5-19 新增市场体系分类主题；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
