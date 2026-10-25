// C5-18: stable market elements and enterprise concepts; changing company-law details stay excluded.
const { ref, question } = require("./learning-authoring");
const marketDef = ref("market-definition-elements", "market-definition", "cs-23-30-p4-market-meaning-list");
const marketElements = ref("market-definition-elements", "market-elements", "cs-23-30-p4-market-elements-list");
const enterpriseMeaning = ref("enterprise-organization", "enterprise-meaning", "cs-23-30-p4-enterprise-meaning-list");
const enterpriseForms = ref("enterprise-organization", "enterprise-forms", "cs-23-30-p4-p5-enterprise-forms-list");
const groupMarket = "market-definition-elements-core", groupEnterprise = "enterprise-organization-core";
const t = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-market-definition", groupMarket, "能识别市场是交换关系的总和，不以固定场所为必要条件。", "有无固定场所都可能存在市场，关键是交换关系。", ["按正文基础定义。"], ["不把市场等同于实体场地。"], [marketDef]),
  t("cs-target-market-four-elements", groupMarket, "能识别市场由主体、客体、行为和秩序四项构成。", "四要素回答谁交换、交换什么、如何行动、如何规范。", ["四项须完整。"], ["不与市场机制四项混淆。"], [marketElements]),
  t("cs-target-market-element-roles", groupMarket, "能区分主体、客体与行为的正文含义。", "主体是参与者，客体是商品服务，行为包括购买销售竞争。", ["只按正文范围。"], ["不把企业当作唯一主体。"], [marketElements]),
  t("cs-target-market-order-rules", groupMarket, "能识别市场秩序依靠市场规则维持，规则含准入、竞争和交易规则。", "秩序是行为规范化的条件，规则提供共同准则。", ["按正文三类规则。"], ["不扩展具体监管法律。"], [marketElements]),
  t("cs-target-enterprise-definition", groupEnterprise, "能识别企业以盈利为目的、运用生产要素提供商品服务，并自主经营、自负盈亏、独立核算。", "盈利、要素、供给和经营责任是定义线索。", ["按正文概括。"], ["不把企业限定为公司法人。"], [enterpriseMeaning]),
  t("cs-target-enterprise-three-forms", groupEnterprise, "能识别个人业主制、合伙制和公司制三类组织形式。", "三类形式按出资经营和组织责任区分。", ["只辨正文列举形式。"], ["不考当前登记程序。"], [enterpriseForms]),
  t("cs-target-enterprise-legal-status", groupEnterprise, "能识别正文中个人业主制和合伙制不是法人，公司制是企业法人。", "法人资格是区分组织形式的基础线索。", ["仅按正文一般概括。"], ["不展开特殊合伙或穿透责任。"], [enterpriseForms]),
  t("cs-target-company-two-forms", groupEnterprise, "能识别公司制的两种主要形式是有限责任公司和股份有限公司。", "两种公司形式名称可以直接辨认。", ["只考形式名称。"], ["不考股东人数、股份转让和现行程序。"], [enterpriseForms]),
];
const addedQuestions = [
  question("market-definition", "economics", groupMarket, "识别市场含义", "关于市场的基础含义，哪一项正确？", ["市场是交换关系的总和，不一定有固定场所", "市场必须有固定实体场所", "市场只指政府举办的交易会"], 0, "市场关键是交换关系，不以固定场所为必要条件。", "不把市场等同于实体场地。", [marketDef]),
  question("market-four-elements", "economics", groupMarket, "识别市场四要素", "正文列出的市场构成四要素是？", ["主体、客体、行为、秩序", "价格、供求、竞争、风险", "土地、劳动、资本、技术"], 0, "市场构成四要素是主体、客体、行为和秩序。", "价格供求竞争风险属于市场机制范围。", [marketElements]),
  question("market-element-roles", "economics", groupMarket, "区分市场要素角色", "商品和服务在市场四要素中属于什么？", ["市场主体", "市场客体", "市场秩序"], 1, "市场客体是作为交换对象的商品和服务。", "参与交易的组织个人才是主体。", [marketElements]),
  question("market-order-rules", "economics", groupMarket, "识别市场规则", "维持正常市场秩序的规则，正文分为哪三类？", ["准入、竞争、交易规则", "财政、货币、产业政策", "计划、价格、工资指标"], 0, "正文列出市场准入、竞争和交易规则。", "不扩展具体监管法律。", [marketElements]),
  question("market-definition-elements-full", "economics", groupMarket, "综合复辨市场构成", "下列哪一项完整正确？", ["市场是交换关系总和；四要素为主体客体行为秩序；客体是商品服务；秩序依靠市场规则", "市场必须有固定场所；四要素只有价格供求", "市场客体是参与者，市场主体是商品服务"], 0, "该项把市场定义和四要素角色正确连接。", "不要把构成要素与运行机制混淆。", [marketDef, marketElements]),
  question("enterprise-definition", "economics", groupEnterprise, "识别企业含义", "哪一项符合正文对企业的基础概括？", ["以盈利为目的，运用生产要素提供商品服务，自主经营、自负盈亏、独立核算", "只要有固定场所就是企业", "企业只能是股份有限公司"], 0, "该项保留企业定义中的目的、要素、供给和经营责任。", "企业不限于股份有限公司。", [enterpriseMeaning]),
  question("enterprise-three-forms", "economics", groupEnterprise, "识别企业组织形式", "正文列出的企业三类组织形式是？", ["个人业主制、合伙制、公司制", "计划制、市场制、混合制", "初次分配、再分配、第三次分配"], 0, "正文列出个人业主、合伙和公司三类形式。", "不考登记程序。", [enterpriseForms]),
  question("enterprise-legal-status", "economics", groupEnterprise, "识别法人资格", "仅按正文一般概括，哪一项正确？", ["个人业主制和合伙制不是法人，公司制是企业法人", "三类形式一律都是法人", "公司制不是法人"], 0, "正文以法人资格区分三类组织形式。", "不展开特殊情形。", [enterpriseForms]),
  question("company-two-forms", "economics", groupEnterprise, "识别公司主要形式", "公司制企业的两种主要形式是？", ["有限责任公司和股份有限公司", "个人业主制和普通合伙", "计划部门和行业协会"], 0, "正文列出有限责任公司与股份有限公司。", "不考股东人数和转让程序。", [enterpriseForms]),
  question("enterprise-organization-full", "economics", groupEnterprise, "综合复辨企业组织", "下列哪一项完整正确？", ["企业以盈利为目的并自主经营；形式有个人业主、合伙、公司；公司制主要含有限责任和股份有限公司", "企业只能是股份有限公司；个人业主制是公司法人", "企业是否成立只看有无固定交易场所"], 0, "该项保留企业定义和组织形式的稳定概念层。", "动态公司法细节未纳入本组。", [enterpriseMeaning, enterpriseForms]),
];
const rows = [
  ["market-definition", ["cs-target-market-definition"], "definition", { 1: "固定场所不是市场成立的必要条件。", 2: "市场不限于政府交易会。" }],
  ["market-four-elements", ["cs-target-market-four-elements"], "four-elements", { 1: "这是市场机制要素。", 2: "这是生产要素示例。" }],
  ["market-element-roles", ["cs-target-market-element-roles"], "roles", { 0: "主体是参与交易的组织个人。", 2: "秩序用于规范市场行为。" }],
  ["market-order-rules", ["cs-target-market-order-rules"], "rules", { 1: "这是宏观政策分类。", 2: "这不是正文三类市场规则。" }],
  ["market-definition-elements-full", ["cs-target-market-definition", "cs-target-market-four-elements", "cs-target-market-element-roles", "cs-target-market-order-rules"], "full-recheck", { 1: "把市场限定为固定场所并遗漏要素。", 2: "主体和客体角色互换。" }],
  ["enterprise-definition", ["cs-target-enterprise-definition"], "enterprise-definition", { 1: "固定场所不能定义企业。", 2: "企业不限于股份有限公司。" }],
  ["enterprise-three-forms", ["cs-target-enterprise-three-forms"], "three-forms", { 1: "这是资源配置方式。", 2: "这是分配阶段。" }],
  ["enterprise-legal-status", ["cs-target-enterprise-legal-status"], "legal-status", { 1: "正文并未把三类都列为法人。", 2: "公司制是企业法人。" }],
  ["company-two-forms", ["cs-target-company-two-forms"], "company-forms", { 1: "个人业主和合伙不是两类公司形式。", 2: "计划部门和协会不是公司形式。" }],
  ["enterprise-organization-full", ["cs-target-enterprise-definition", "cs-target-enterprise-three-forms", "cs-target-enterprise-legal-status", "cs-target-company-two-forms"], "full-recheck", { 1: "错误限定企业并混淆法人资格。", 2: "固定场所不是企业定义标准。" }],
];
const questionSpecifications = rows.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons }));
function phrase(id, text, meaning, targetIds, purpose, refs, directId, fullId) { return { id, phrase: text, meaning, targetIds, coverageType: purpose, conditionRefs: [], refs, questionIds: [directId, fullId], checks: [{ questionId: directId, checkPurpose: purpose, reviewTarget: "phrase", reviewAnchorId: id }, { questionId: fullId, checkPurpose: "full-recheck", reviewTarget: "meaning", reviewAnchorId: id }] }; }
const mnemonics = [
  { id: "market-definition-elements-memory", revision: 1, status: "review", scope: "economics", title: "市场四要素", purpose: "帮助回忆市场含义和构成。", text: "市场关系不拘场；主体客体行为秩序，秩序靠准竞交规则。", method: "四要素串联", coverage: "市场定义、四要素角色和三类规则。", conditions: ["只压缩正文概念。"], excludes: ["具体监管法律", "市场机制长段定义"], phrases: [
    phrase("market-elements-memory-definition", "市场关系不拘场", "市场是交换关系总和，不以固定场所为必要条件。", ["cs-target-market-definition"], "definition", [marketDef], "market-definition", "market-definition-elements-full"),
    phrase("market-elements-memory-four", "主体客体行为秩序", "四项构成要素及基本角色。", ["cs-target-market-four-elements", "cs-target-market-element-roles"], "four-elements", [marketElements], "market-four-elements", "market-definition-elements-full"),
    phrase("market-elements-memory-rules", "秩序靠准竞交规则", "秩序依靠准入、竞争和交易规则。", ["cs-target-market-order-rules"], "rules", [marketElements], "market-order-rules", "market-definition-elements-full"),
  ], questionIds: addedQuestions.slice(0, 5).map((q) => q.id) },
  { id: "enterprise-organization-memory", revision: 1, status: "review", scope: "economics", title: "企业与三种形式", purpose: "帮助回忆企业稳定概念层。", text: "企业盈利用要素，自主自负独核算；业主合伙公司三，公司有有限与股份。", method: "定义与形式串联", coverage: "企业定义、三类形式、法人资格和两类公司。", conditions: ["只考稳定概念层。"], excludes: ["股东人数", "股份转让与设立程序", "特殊合伙责任"], phrases: [
    phrase("enterprise-memory-definition", "企业盈利用要素，自主自负独核算", "企业以盈利为目的、运用要素提供商品服务并自主经营、自负盈亏、独立核算。", ["cs-target-enterprise-definition"], "enterprise-definition", [enterpriseMeaning], "enterprise-definition", "enterprise-organization-full"),
    phrase("enterprise-memory-forms", "业主合伙公司三", "三类组织形式，正文中前两类不是法人、公司制是企业法人。", ["cs-target-enterprise-three-forms", "cs-target-enterprise-legal-status"], "three-forms", [enterpriseForms], "enterprise-three-forms", "enterprise-organization-full"),
    phrase("enterprise-memory-company", "公司有有限与股份", "公司制两种主要形式。", ["cs-target-company-two-forms"], "company-forms", [enterpriseForms], "company-two-forms", "enterprise-organization-full"),
  ], questionIds: addedQuestions.slice(5).map((q) => q.id) },
];
// Include the second direct checks in the phrases that carry two targets.
mnemonics[0].phrases[1].questionIds.splice(1, 0, "market-element-roles"); mnemonics[0].phrases[1].checks.splice(1, 0, { questionId: "market-element-roles", checkPurpose: "roles", reviewTarget: "meaning", reviewAnchorId: "market-elements-memory-four" });
mnemonics[1].phrases[1].questionIds.splice(1, 0, "enterprise-legal-status"); mnemonics[1].phrases[1].checks.splice(1, 0, { questionId: "enterprise-legal-status", checkPurpose: "legal-status", reviewTarget: "meaning", reviewAnchorId: "enterprise-memory-forms" });
const mnemonicPhraseTargetRelations = mnemonics.flatMap((m) => m.phrases.map((p, i) => ({ mnemonicId: m.id, phraseIndex: i, phraseId: p.id, targetIds: p.targetIds, coverageType: p.coverageType, wrongAnswerReviewAnchor: p.id })));
const mnemonicSpecifications = mnemonics.map((m) => ({ mnemonicId: m.id, revision: m.revision, purpose: m.purpose, method: m.method, conditionCount: m.conditions.length, phraseIds: m.phrases.map((p) => p.id), selfTestQuestionIds: m.questionIds.slice() }));
const direct = { "cs-target-market-definition": "market-definition", "cs-target-market-four-elements": "market-four-elements", "cs-target-market-element-roles": "market-element-roles", "cs-target-market-order-rules": "market-order-rules", "cs-target-enterprise-definition": "enterprise-definition", "cs-target-enterprise-three-forms": "enterprise-three-forms", "cs-target-enterprise-legal-status": "enterprise-legal-status", "cs-target-company-two-forms": "company-two-forms" };
const variationDecisions = targets.map((x) => ({ targetId: x.id, directQuestionIds: [direct[x.id]], variationQuestionIds: [x.groupId === groupMarket ? "market-definition-elements-full" : "enterprise-organization-full"] }));
const groups = [{ id: groupMarket, title: "市场不只是一处场地", scope: "economics", reason: "用定义、四要素与规则构成一个小组。", questionIds: addedQuestions.slice(0, 5).map((q) => q.id) }, { id: groupEnterprise, title: "企业与组织形式", scope: "economics", reason: "只学习稳定定义、三类形式和两类公司名称。", questionIds: addedQuestions.slice(5).map((q) => q.id) }];
const sourceDispositions = [{ candidateId: "market-definition-enterprise", pointId: "market-definition-elements", relatedPointIds: ["enterprise-organization"], tabIds: ["market-definition", "market-elements", "enterprise-meaning", "enterprise-forms"], status: "已建设", batch: "C5-18", scope: "市场定义四要素与企业稳定概念层；排除动态公司法细节" }, { candidateId: "enterprise-dynamic-company-law", pointId: "enterprise-organization", tabIds: ["enterprise-forms"], status: "待补依据", batch: "C5-18", scope: "股东人数、股份转让、责任与设立程序需按现行公司法逐项核验" }, { candidateId: "market-system-core", pointId: "market-system-composition", tabIds: ["market-system-overview", "commodity-market", "factor-market", "market-pillars"], status: "可建设", batch: "C5-18", scope: "市场体系构成、商品市场、要素市场与三大支柱" }];
function applyQuestions(items) { return items.concat(addedQuestions); } function applyGroups(items) { return items.concat(groups); } function applyMnemonics(items) { return items.concat(mnemonics); }
function applyEntryPlans(entryPlans) { const plan = JSON.parse(JSON.stringify(entryPlans)); const ids = addedQuestions.map((q) => q.id); plan.revision = 24; plan.modes.qa.groupIds.push(...groups.map((g) => g.id)); plan.modes.qa.questionIds.push(...ids); plan.modes.mnemonic.questionIds.push(...ids); plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((m) => m.id)); return plan; }
module.exports = { schemaVersion: 1, revision: 1, batch: "C5-18", targets, addedQuestions, questionSpecifications, questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) => ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })), mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions, sessionMigrations: [{ fromVersion: "65d30fe6", toPackVersion: "2026-10-21.22", changedQuestionIds: addedQuestions.map((q) => q.id), changedMnemonicIds: mnemonics.map((m) => m.id), reason: "C5-18 新增市场四要素与企业稳定概念主题；既有会话保留。" }], applyQuestions, applyGroups, applyMnemonics, applyEntryPlans };
