// C5-21: six market-economy features and the socialist-market framework.
const { ref, question } = require("./learning-authoring");
const featureDefs = [
  ["property", "market-feature-1", "cs-23-30-p7-market-feature-property-list", "产权确定", "最终所有权与法人财产权划分明确"],
  ["equality", "market-feature-2", "cs-23-30-p7-market-feature-equality-list", "主体平等", "主体地位平等、自愿交易并共同议定条件"],
  ["competition", "market-feature-3", "cs-23-30-p7-market-feature-competition-list", "活动竞争", "市场主体自由竞争并生存发展或淘汰"],
  ["legality", "market-feature-4", "cs-23-30-p7-market-feature-legality-list", "行为法制", "市场主体按规则行事，违反者受法规制裁"],
  ["openness", "market-feature-5", "cs-23-30-p7-market-feature-openness-list", "体系开放", "行业地区开放、要素流动、统一市场并连接世界市场"],
  ["limited-government", "market-feature-6", "cs-23-30-p7-market-feature-limited-government-list", "政府有限", "政府保障有序运行、促进竞争、维护主体权利"],
];
const groupA = "market-features-foundation", groupB = "market-features-order", groupC = "socialist-market-framework-core";
const featureRefs = Object.fromEntries(featureDefs.map(([key, tab, unit]) => [key, ref("market-economy-features", tab, unit)]));
const socialistMeaning = ref("socialist-market-economy", "socialist-market-meaning", "cs-23-30-p7-socialist-market-meaning-list");
const socialistFramework = ref("socialist-market-economy", "socialist-market-framework", "cs-23-30-p7-socialist-market-framework-list");
const targets = featureDefs.map(([key, , , name, meaning], index) => ({ id: `cs-target-market-feature-${key}`, revision: 1, status: "review", scope: "economics", groupId: index < 3 ? groupA : groupB, statement: `能识别市场经济的${name}特征。`, conclusion: meaning, conditions: ["按正文对象与特征对应。"], excludes: ["不扩展具体制度评价。"], refs: [featureRefs[key]] }));
targets.push(
  { id: "cs-target-socialist-market-meaning", revision: 1, status: "review", scope: "economics", groupId: groupC, statement: "能识别正文所述社会主义市场经济含义。", conclusion: "积极有效宏观调控下，市场对资源配置起决定性作用，并兼顾效率与公平。", conditions: ["三个要点须完整。"], excludes: ["不推断现实政策成效。"], refs: [socialistMeaning] },
  { id: "cs-target-socialist-market-framework", revision: 1, status: "review", scope: "economics", groupId: groupC, statement: "能识别社会主义市场经济体制五项基本框架。", conclusion: "现代企业、统一开放竞争有序市场、间接宏调、按劳为主多种分配、多层次社保。", conditions: ["按正文五层框架。"], excludes: ["不扩展政策细节。"], refs: [socialistFramework] },
);
const prompts = {
  property: ["最终所有权与法人财产权的划分应确定明确，体现什么特征？", ["产权的确定性", "体系的开放性", "活动的竞争性"], 0],
  equality: ["主体地位平等、交易自愿、条件共同议定，体现什么特征？", ["主体的平等性", "政府干预无限性", "产权不确定性"], 0],
  competition: ["市场主体在自由竞争中生存发展或淘汰，体现什么特征？", ["行为法制性", "活动竞争性", "主体封闭性"], 1],
  legality: ["市场主体按规则行事，违反者受法规制裁，体现什么特征？", ["行为法制性", "体系封闭性", "产权模糊性"], 0],
  openness: ["行业地区开放、要素流动、统一市场连接世界市场，体现什么特征？", ["体系开放性", "主体不平等", "活动无竞争"], 0],
  "limited-government": ["政府作用着重保障有序运行、促进竞争和维护主体权利，体现什么特征？", ["政府干预有限性", "政府干预无限性", "市场规则缺失"], 0],
};
const addedQuestions = featureDefs.map(([key, , , name, meaning], index) => { const [stem, options, answer] = prompts[key]; return question(`market-feature-${key}`, "economics", index < 3 ? groupA : groupB, `识别${name}`, stem, options, answer, meaning, "只按正文对象与特征对应。", [featureRefs[key]]); });
addedQuestions.splice(3, 0, question("market-features-foundation-full", "economics", groupA, "综合复辨前三特征", "下列哪一项对应完整正确？", ["产权—权属明确；平等—自愿议定；竞争—生存发展或淘汰", "产权—要素流动；平等—法规制裁；竞争—政府无限干预", "三项都只描述市场场所"], 0, "该项正确对应产权、主体与活动。", "对象和特征不能错配。", [featureRefs.property, featureRefs.equality, featureRefs.competition]));
addedQuestions.splice(7, 0, question("market-features-order-full", "economics", groupB, "综合复辨后三特征", "下列哪一项对应完整正确？", ["法制—按规则；开放—要素流动；有限政府—保障秩序竞争权利", "法制—无需规则；开放—区域封锁；有限政府—取代市场", "三项都只描述产权归属"], 0, "该项正确对应行为、体系与政府。", "不把对象层级混用。", [featureRefs.legality, featureRefs.openness, featureRefs["limited-government"]]));
addedQuestions.push(
  question("socialist-market-meaning", "economics", groupC, "识别社会主义市场经济含义", "按正文，社会主义市场经济的核心组合是？", ["有效宏观调控、市场配置资源起决定性作用、兼顾效率与公平", "只靠计划配置且排除市场", "完全取消宏观调控"], 0, "正文同时保留有效宏调、市场决定性作用和效率公平。", "不推断现实政策成效。", [socialistMeaning]),
  question("socialist-market-framework", "economics", groupC, "识别五项基本框架", "下列哪一项属于正文五项基本框架？", ["统一开放竞争有序的市场体系", "取消社会保障制度", "只保留单一分配方式"], 0, "统一开放竞争有序市场体系是五项框架之一。", "正文还包括企业、宏调、分配和社保。", [socialistFramework]),
  question("socialist-market-framework-full", "economics", groupC, "综合复辨定义与框架", "下列哪一项完整正确？", ["市场起决定性作用并有有效宏调；框架涵盖企业、市场、宏调、分配、社保", "市场不起资源配置作用；框架只含企业制度", "框架要求取消多种分配和社会保障"], 0, "该项保留定义三要点和五层框架。", "不扩展具体政策细节。", [socialistMeaning, socialistFramework]),
);
const specs = [];
for (const [key, , , name] of featureDefs) { const q = addedQuestions.find((x) => x.id === `market-feature-${key}`); specs.push({ questionId: q.id, primaryTargetIds: [`cs-target-market-feature-${key}`], supportingTargetIds: [], checkPurpose: key, distractorReasons: Object.fromEntries(q.options.map((_, i) => i).filter((i) => i !== q.answer).map((i) => [i, `该项不符合${name}的正文线索。`])) }); }
specs.push(
  { questionId: "market-features-foundation-full", primaryTargetIds: targets.slice(0, 3).map((x) => x.id), supportingTargetIds: [], checkPurpose: "full-recheck", distractorReasons: { 1: "三个对象与特征全部错配。", 2: "三项并非只描述场所。" } },
  { questionId: "market-features-order-full", primaryTargetIds: targets.slice(3, 6).map((x) => x.id), supportingTargetIds: [], checkPurpose: "full-recheck", distractorReasons: { 1: "法制、开放和政府边界均反置。", 2: "三项并非只描述产权。" } },
  { questionId: "socialist-market-meaning", primaryTargetIds: ["cs-target-socialist-market-meaning"], supportingTargetIds: [], checkPurpose: "socialist-meaning", distractorReasons: { 1: "正文保留市场的决定性作用。", 2: "正文保留积极有效宏观调控。" } },
  { questionId: "socialist-market-framework", primaryTargetIds: ["cs-target-socialist-market-framework"], supportingTargetIds: [], checkPurpose: "socialist-framework", distractorReasons: { 1: "正文要求多层次社保。", 2: "正文是按劳为主、多种并存。" } },
  { questionId: "socialist-market-framework-full", primaryTargetIds: ["cs-target-socialist-market-meaning", "cs-target-socialist-market-framework"], supportingTargetIds: [], checkPurpose: "full-recheck", distractorReasons: { 1: "否认市场作用并遗漏框架。", 2: "分配和保障方向反置。" } },
);
const questionSpecifications = specs;
const fullFor = (groupId) => groupId === groupA ? "market-features-foundation-full" : groupId === groupB ? "market-features-order-full" : "socialist-market-framework-full";
const direct = Object.fromEntries(featureDefs.map(([key]) => [`cs-target-market-feature-${key}`, `market-feature-${key}`])); direct["cs-target-socialist-market-meaning"] = "socialist-market-meaning"; direct["cs-target-socialist-market-framework"] = "socialist-market-framework";
function phrase(target, text, source, purpose) { const d = direct[target.id], full = fullFor(target.groupId); return { id: `${target.id}-memory`, phrase: text, meaning: target.conclusion, targetIds: [target.id], coverageType: purpose, conditionRefs: [], refs: [source], questionIds: [d, full], checks: [{ questionId: d, checkPurpose: purpose, reviewTarget: "phrase", reviewAnchorId: `${target.id}-memory` }, { questionId: full, checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: `${target.id}-memory` }] }; }
const featureText = { property: "产权确定", equality: "主体平等", competition: "活动竞争", legality: "行为法制", openness: "体系开放", "limited-government": "政府有限" };
function featureMnemonic(id, title, keys, groupId) { const qs = addedQuestions.filter((q) => q.group === groupId); return { id, revision: 1, status: "review", scope: "economics", title, purpose: `帮助回忆${title}。`, text: keys.map((k) => featureText[k]).join("，") + "。", method: "对象与特征配对", coverage: keys.map((k) => featureText[k]).join("、"), conditions: ["按正文六对象顺序。"], excludes: ["具体制度评价"], phrases: keys.map((k) => phrase(targets.find((t) => t.id === `cs-target-market-feature-${k}`), featureText[k], featureRefs[k], k)), questionIds: qs.map((q) => q.id) }; }
const mnemonics = [featureMnemonic("market-features-foundation-memory", "市场特征前三项", ["property", "equality", "competition"], groupA), featureMnemonic("market-features-order-memory", "市场特征后三项", ["legality", "openness", "limited-government"], groupB), { id: "socialist-market-framework-memory", revision: 1, status: "review", scope: "economics", title: "定义与五层框架", purpose: "帮助回忆社会主义市场经济定义和框架。", text: "有效宏调、市场决定、效率公平；企业市场宏调分配社保五层。", method: "三要点五层框架", coverage: "定义三要点和基本框架五层。", conditions: ["只压缩正文表述。"], excludes: ["具体政策细节", "现实成效评价"], phrases: [phrase(targets[6], "有效宏调、市场决定、效率公平", socialistMeaning, "socialist-meaning"), phrase(targets[7], "企业市场宏调分配社保五层", socialistFramework, "socialist-framework")], questionIds: addedQuestions.filter((q) => q.group === groupC).map((q) => q.id) }];
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: [fullFor(x.groupId)] }));
const groups = [{ id: groupA, title: "产权主体活动三特征", scope: "economics", reason: "按产权、主体、活动三个对象配对。", questionIds: addedQuestions.filter((q) => q.group === groupA).map((q) => q.id) }, { id: groupB, title: "行为体系政府三特征", scope: "economics", reason: "按行为、体系、政府三个对象配对。", questionIds: addedQuestions.filter((q) => q.group === groupB).map((q) => q.id) }, { id: groupC, title: "社会主义市场经济框架", scope: "economics", reason: "用三要点和五层框架快速定位。", questionIds: addedQuestions.filter((q) => q.group === groupC).map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "market-economy-features-socialist", pointId: "market-economy-features", relatedPointIds: ["socialist-market-economy"], tabIds: featureDefs.map((x) => x[1]).concat(["socialist-market-meaning", "socialist-market-framework"]), status: "已建设", batch: "C5-21", scope: "市场经济六特征与社会主义市场经济定义、五层框架" }, { candidateId: "demand-supply-core", pointId: "microeconomics", relatedPointIds: ["supply-theory", "supply-demand-equilibrium", "supply-demand-law"], tabIds: ["demand-meaning", "demand-factors", "demand-price-elasticity", "demand-income-elasticity"], status: "可建设", batch: "C5-21", scope: "需求供给、均衡与供求法则分批建设；受约束页签先排除疑点" }];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((q) => q.id); plan.revision = 27; plan.modes.qa.groupIds.push(...groups.map((g) => g.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((m) => m.id)); return plan; }
module.exports = { schemaVersion: 1, revision: 2, batch: "C5-21", smallThemes: ["市场经济六特征", "社会主义市场经济框架"], targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "4a1e9e60", toPackVersion: "2026-10-21.25", changedQuestionIds: addedQuestions.map((q) => q.id), changedMnemonicIds: mnemonics.map((m) => m.id), reason: "C5-21 新增市场经济六特征与社会主义市场框架；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
