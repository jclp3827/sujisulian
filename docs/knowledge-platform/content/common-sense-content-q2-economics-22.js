"use strict";

// Q2 经济第二十二批：关闭经济题库停止门。
// 处理汇率条件链、社会主义市场经济当前口径、重复宏观目标和 Q1 市场失灵试点身份。

const EXCHANGE_IDS = ["rate-direction-pair", "rate-import-effect", "rate-export-effect", "rate-capital-effect", "rate-effects-full"];
const SOCIALIST_IDS = ["socialist-market-meaning", "socialist-market-framework", "socialist-market-framework-full"];
const RETIRED_MACRO_IDS = ["macro-goals-list-c523", "macro-primary-goal-c523", "macro-goals-full-c523"];
const PROMOTED_Q1_IDS = ["q1-market-quick-recall", "q1-market-boundary", "q1-market-application"];
const QUESTION_IDS = EXCHANGE_IDS.concat(SOCIALIST_IDS, RETIRED_MACRO_IDS, PROMOTED_Q1_IDS);

const verificationSources = {
  "safe-exchange-risk-2026": {
    title: "国家外汇管理局上海市分局：汇率风险来源",
    version: "2026-04-09",
    url: "https://www.safe.gov.cn/shanghai/2026/0409/2417.html",
    checkedAt: "2026-10-23",
    retrieved: true,
  },
  "safe-capital-flow-2018": {
    title: "国家外汇管理局：跨境资本流动影响因素",
    version: "2018-07-24",
    url: "https://www.safe.gov.cn/hubei/2018/0724/587.html",
    checkedAt: "2026-10-23",
    retrieved: true,
  },
  "central-socialist-market-2020": {
    title: "中共中央 国务院关于新时代加快完善社会主义市场经济体制的意见",
    version: "2020-05-18",
    url: "https://www.mee.gov.cn/zcwj/zyygwj/202005/t20200519_779725.shtml",
    checkedAt: "2026-10-23",
    retrieved: true,
  },
};

const verification = (sourceIds, locators) => ({ checkedAt: "2026-10-23", sourceIds, locators });

const replacementRows = {
  "rate-direction-pair": {
    objective: "固定标价口径后识别本币升贬值",
    prompt: "以“1 单位外币可兑换多少本币”为观察口径，数值由 7.0 升至 7.2，其他条件不变。这表示？",
    options: ["本币贬值", "本币升值", "无法判断两种货币关系"],
    answer: 0,
    explanation: "同一口径下，1 单位外币能兑换更多本币，说明外币相对变贵、本币相对贬值。",
    boundary: "必须先固定标价对象和观察口径，不能只看到数字升降就判断本币升贬。",
  },
  "rate-import-effect": {
    objective: "由外币计价成本识别本币贬值对进口的基础影响",
    prompt: "某进口合同以美元计价，商品美元价格不变。人民币贬值后，进口商支付同额美元通常需要怎样变化？",
    options: ["支付更多人民币，进口成本上升", "支付更少人民币，进口成本下降", "人民币支付额保持不变，汇率变化只影响记账方式"],
    answer: 0,
    explanation: "本币贬值时，购买同额外币需要更多本币，因此外币计价进口的本币成本上升。",
    boundary: "这是其他条件不变时的直接换算效应；实际进口量还受需求、合同、替代品和时滞影响。",
    verification: verification(["safe-exchange-risk-2026"], ["交易风险", "人民币贬值时进口成本上升"]),
  },
  "rate-export-effect": {
    objective: "识别本币贬值对出口价格竞争力的条件性影响",
    prompt: "其他条件不变，某出口商品本币价格保持稳定。本币贬值可能首先带来哪种影响？",
    options: ["以外币衡量的价格竞争力增强，可能支持出口", "进口成本下降并由此直接扩大出口规模", "资本流入与出口数量固定同时发生"],
    answer: 0,
    explanation: "本币贬值可使本币定价商品折算成外币后的价格更有竞争力，从而可能支持出口。",
    boundary: "出口数量和贸易余额仍受需求弹性、定价方式、进口投入、关税和时滞等因素影响。",
    verification: verification(["safe-exchange-risk-2026"], ["经济风险", "人民币升值时出口竞争力有下滑风险"]),
  },
  "rate-capital-effect": {
    objective: "识别汇率与跨境资本流动之间不存在单因素必然关系",
    prompt: "观察到本币升值后，能否仅凭这一变化断定资本必然净流入？",
    options: ["不能，还要结合利差、经济前景、汇率预期、风险和管制等因素", "能，本币升值足以推出资本净流入，其他条件不影响结论", "能，资本流动方向只随汇率变化，不受投资前景与风险影响"],
    answer: 0,
    explanation: "跨境资本流动由多种因素共同影响，不能从一次汇率升贬值直接推出唯一的资本流向。",
    boundary: "题目否定单因素必然推断，不否认汇率预期可能影响资本流动。",
    verification: verification(["safe-capital-flow-2018"], ["利差影响需全面分析", "经济状况、投资前景和汇率预期等因素"]),
  },
  "rate-effects-full": {
    objective: "综合复辨标价口径、进口成本、出口竞争力和资本流动边界",
    prompt: "关于本币贬值的基础影响，下列判断最严谨的是？",
    options: ["先固定标价口径；外币计价进口成本通常上升，出口价格竞争力可能增强；资本流向不能由汇率单独决定", "本币贬值后，进口量、出口量和资本流向会立即按固定比例变化，不受合同与预期影响", "不区分标价口径也可判断，本币汇率数字上升或下降表示相同的货币方向"],
    answer: 0,
    explanation: "正确判断同时保留观察口径、进出口的条件性影响和资本流动的多因素边界。",
    boundary: "基础方向用于概念判断，不替代对具体国家、时期、商品和资本项目的实证分析。",
    verification: verification(["safe-exchange-risk-2026", "safe-capital-flow-2018"], ["进口成本与出口竞争力", "资本流动多因素判断"]),
  },
  "socialist-market-meaning": {
    objective: "识别有效市场与有为政府的统一关系",
    prompt: "关于社会主义市场经济中政府与市场的关系，下列概括正确的是？",
    options: ["充分发挥市场在资源配置中的决定性作用，更好发挥政府作用", "由政府直接配置资源取代市场机制，并压缩经营主体自主决策空间", "市场配置资源与政府履行宏观治理、公共服务和监管职责相互排斥"],
    answer: 0,
    explanation: "现行表述强调市场的决定性作用与更好发挥政府作用有机统一。",
    boundary: "市场起决定性作用不等于市场起全部作用，更好发挥政府作用也不等于更多直接配置资源。",
    verification: verification(["central-socialist-market-2020"], ["正确处理政府和市场关系"]),
  },
  "socialist-market-framework": {
    objective: "识别新时代社会主义市场经济体制的治理目标",
    prompt: "新时代完善社会主义市场经济体制所强调的经济体制状态是？",
    options: ["市场机制有效、微观主体有活力、宏观调控有度", "市场机制弱化、微观主体被动、宏观调控直接替代市场选择", "行政配置成为资源流动主渠道，市场竞争与主体活力不再作为目标"],
    answer: 0,
    explanation: "官方意见把市场机制有效、微观主体有活力、宏观调控有度作为重要体制目标。",
    boundary: "这是治理框架识别题，不展开具体年度政策和部门措施。",
    verification: verification(["central-socialist-market-2020"], ["市场机制有效、微观主体有活力、宏观调控有度"]),
  },
  "socialist-market-framework-full": {
    objective: "综合复辨市场作用、政府作用和治理目标",
    prompt: "下列哪项完整体现社会主义市场经济的当前稳定判断框架？",
    options: ["市场在资源配置中起决定性作用，政府更好发挥作用，推动市场机制有效、主体有活力、宏观调控有度", "市场和政府作用相互排斥，发挥市场作用意味着取消宏观治理与市场监管", "政府直接配置资源越多，越能同时证明市场机制有效和微观主体富有活力"],
    answer: 0,
    explanation: "正确项把市场和政府的关系与有效机制、主体活力、调控有度三个治理目标连成完整结构。",
    boundary: "常识模块负责经济机制辨析；理论沿革、制度论述和会议文件体系由政治理论模块承载。",
    verification: verification(["central-socialist-market-2020"], ["市场决定性作用与更好发挥政府作用", "经济体制目标"]),
  },
};

const distractorReasons = {
  "rate-direction-pair": { 1: "同一口径下，外币兑换更多本币表示本币相对贬值。", 2: "题干已经固定标价口径，可以判断相对升贬值。" },
  "rate-import-effect": { 1: "本币贬值会提高购买同额外币所需的本币数量。", 2: "外币价格不变时，本币支付额会随汇率换算变化。" },
  "rate-export-effect": { 1: "本币贬值通常提高外币计价进口成本，不会必然降低进口成本。", 2: "资本流向和出口数量都不能由本币贬值单独锁定。" },
  "rate-capital-effect": { 1: "资本流动还受利差、预期、风险和管制等因素影响。", 2: "汇率不是决定资本流向的唯一因素。" },
  "rate-effects-full": { 1: "进出口数量和资本流动不存在固定比例与立即变化的必然关系。", 2: "不同标价口径下数字变化的含义不同。" },
  "socialist-market-meaning": { 1: "政府不能取代市场配置全部资源。", 2: "市场起决定性作用与政府履行职责可以有机统一。" },
  "socialist-market-framework": { 1: "调控有度不等于无限，主体应保持活力。", 2: "完善体制要求发挥市场机制作用。" },
  "socialist-market-framework-full": { 1: "市场和政府不是排他的二选一关系。", 2: "政府直接配置增多不等于市场机制有效。" },
};

const targetRows = {
  "cs-target-rate-direction-pair": { statement: "能在固定标价口径后识别本币升贬值。", conclusion: "以一单位外币兑换本币数量为口径，数值上升表示本币贬值。", conditions: ["必须固定标价对象和比较时点。"], excludes: ["不依据脱离口径的数字升降判断。"] },
  "cs-target-rate-import-effect": { statement: "能由外币计价成本识别本币贬值对进口的直接影响。", conclusion: "其他条件不变，本币贬值使同额外币需要更多本币，进口成本上升。", conditions: ["进口合同以外币计价且外币价格不变。"], excludes: ["不直接推断实际进口量。"], verification: verification(["safe-exchange-risk-2026"], ["人民币贬值时进口成本上升"]) },
  "cs-target-rate-export-effect": { statement: "能识别本币贬值对出口价格竞争力的条件性影响。", conclusion: "其他条件不变，本币贬值可能增强本币定价商品的外币价格竞争力。", conditions: ["本币价格稳定并固定比较口径。"], excludes: ["不直接推断出口数量或贸易余额。"], verification: verification(["safe-exchange-risk-2026"], ["人民币升值时出口竞争力有下滑风险"]) },
  "cs-target-rate-capital-effect": { statement: "能识别资本流向不能由汇率升贬单独决定。", conclusion: "资本流动还受利差、经济前景、预期、风险和管制等因素影响。", conditions: ["区分影响因素与必然因果。"], excludes: ["不作单向资本流动预测。"], verification: verification(["safe-capital-flow-2018"], ["跨境资本流动影响因素"]) },
  "cs-target-socialist-market-meaning": { statement: "能识别市场决定性作用与更好发挥政府作用的统一关系。", conclusion: "充分发挥市场在资源配置中的决定性作用，更好发挥政府作用。", conditions: ["市场和政府作用须同时保留。"], excludes: ["不把市场决定性作用理解为全部作用。"], verification: verification(["central-socialist-market-2020"], ["正确处理政府和市场关系"]) },
  "cs-target-socialist-market-framework": { statement: "能识别新时代社会主义市场经济体制的治理目标。", conclusion: "推动市场机制有效、微观主体有活力、宏观调控有度。", conditions: ["三项完整识别。"], excludes: ["不沿用旧框架替代当前稳定口径。"], verification: verification(["central-socialist-market-2020"], ["经济体制目标"]) },
};

const direct = {
  "cs-target-rate-direction-pair": "rate-direction-pair",
  "cs-target-rate-import-effect": "rate-import-effect",
  "cs-target-rate-export-effect": "rate-export-effect",
  "cs-target-rate-capital-effect": "rate-capital-effect",
  "cs-target-socialist-market-meaning": "socialist-market-meaning",
  "cs-target-socialist-market-framework": "socialist-market-framework",
};

const variationRows = Object.fromEntries(Object.keys(direct).map((targetId) => [targetId, {
  targetId,
  directQuestionIds: [direct[targetId]],
  variationQuestionIds: [targetId.startsWith("cs-target-rate") ? "rate-effects-full" : "socialist-market-framework-full"],
  processDifference: targetId.startsWith("cs-target-rate")
    ? "直接题固定单一口径或因果边界，综合题同时检查标价、贸易影响和资本流动的多因素限制。"
    : "直接题识别市场政府关系或治理目标，综合题把两者连接为完整判断框架。",
}]));

const applyQuestions = (items) => items.map((item) => {
  if (replacementRows[item.id]) return { ...item, ...replacementRows[item.id], revision: item.revision + 1 };
  if (RETIRED_MACRO_IDS.includes(item.id)) return { ...item, revision: item.revision + 1, status: "blocked", lifecycle: "retired-alias", canonicalGroupId: "macro-four-goals" };
  if (PROMOTED_Q1_IDS.includes(item.id)) return { ...item, revision: item.revision + 1, qualityStage: "q2-candidate", pilotStatus: "promoted" };
  return item;
});

const applyTargets = (items) => items.map((item) => {
  if (targetRows[item.id]) return { ...item, ...targetRows[item.id], revision: item.revision + 1 };
  if (["cs-target-macro-goals-list-c523", "cs-target-macro-primary-goal-c523"].includes(item.id)) return { ...item, revision: item.revision + 1, status: "blocked", lifecycle: "retired-alias", canonicalGroupId: "macro-four-goals" };
  if (["q1-target-market-failure-four-factors", "q1-target-market-failure-external-cost", "q1-target-market-failure-adverse-selection"].includes(item.id)) return { ...item, revision: item.revision + 1, qualityStage: "q2-candidate", pilotStatus: "promoted" };
  return item;
});

const q1Purpose = "q2-economics-market-failure-fast-recall";
const applyQuestionTargetRelations = (items) => items.map((item) => EXCHANGE_IDS.includes(item.questionId)
  ? { ...item, checkPurpose: "q2-economics-exchange-effects-conditional" }
  : SOCIALIST_IDS.includes(item.questionId)
    ? { ...item, checkPurpose: "q2-economics-socialist-market-current" }
    : PROMOTED_Q1_IDS.includes(item.questionId) ? { ...item, checkPurpose: q1Purpose } : item);

const applyQuestionSpecifications = (items) => items.map((item) => {
  if (EXCHANGE_IDS.includes(item.questionId)) return { ...item, checkPurpose: "q2-economics-exchange-effects-conditional", cognitiveLevel: item.questionId.endsWith("full") ? "synthesis" : "application", distractorReasons: distractorReasons[item.questionId] };
  if (SOCIALIST_IDS.includes(item.questionId)) return { ...item, checkPurpose: "q2-economics-socialist-market-current", cognitiveLevel: item.questionId.endsWith("full") ? "synthesis" : "application", distractorReasons: distractorReasons[item.questionId] };
  if (PROMOTED_Q1_IDS.includes(item.questionId)) return { ...item, checkPurpose: q1Purpose, qualityStage: "q2-candidate" };
  return item;
});

const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? variationRows[item.targetId] : item);

const applyGroups = (items) => items.map((item) => {
  if (item.id === "exchange-rate-effects-core") return { ...item, title: "本币升贬的条件链", reason: "先固定标价口径，再判断进口成本和出口竞争力；资本流向保留多因素边界。", mnemonicDecision: "structural-mnemonic" };
  if (item.id === "socialist-market-framework-core") return { ...item, title: "有效市场与有为政府", reason: "常识模块只负责市场政府关系和经济治理目标；理论沿革归政治理论。", contentOwner: "common-sense-economics-mechanism", relatedOwner: "politics-theory-history" };
  if (item.id === "macro-control-goals-core") return { ...item, lifecycle: "retired-alias", entryStatus: "hidden", canonicalGroupId: "macro-four-goals", reason: "与宏观调控四目标正式候选组重复，保留旧 ID 仅用于历史会话识别。" };
  if (item.id === "q1-market-failure") return { ...item, title: "市场失灵快速辨析", qualityStage: "q2-candidate", pilotStatus: "promoted", reason: "保留原 ID，按四类因素、第三方成本、交易前信息差三步完成快速辨析。" };
  return item;
});

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "exchange-rate-effects-memory") {
      const phrases = {
        "rate-effects-memory-direction": "外币一单位，本币数增是本币贬",
        "rate-effects-memory-import": "进口外币价不变，本币成本升",
        "rate-effects-memory-export": "本币价稳，出口竞争可能添",
        "rate-effects-memory-capital": "资本别单推，还看利差、前景、预期、风险、管制",
      };
      return { ...item, revision: item.revision + 1, title: "外币作尺看本币，进口看成本，出口看竞争，资本别单推", text: "外币一单位，本币数增是本币贬；进口外币价不变，本币成本升；本币价稳，出口竞争可能添；资本别单推，还看利差、前景、预期、风险、管制。", method: "先固定标价口径，再沿进口成本、出口竞争力和资本多因素边界还原", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "用条件链判断汇率的基础影响，并阻止把资本流动写成单向必然关系。", excludes: ["不固定标价口径的数字判断", "实际进出口数量和贸易余额预测", "由单一汇率变化推断资本流向"], verification: verification(["safe-exchange-risk-2026", "safe-capital-flow-2018"], ["进口成本与出口竞争力", "资本流动多因素判断"]), phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], coverageType: "structural-exchange-conditional-chain", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-exchange-effects-conditional" })) })) };
    }
    if (item.id === "socialist-market-framework-memory") {
      const phrases = { "cs-target-socialist-market-meaning-memory": "市场决定，政府更好", "cs-target-socialist-market-framework-memory": "机制有效，主体有活力，宏调有度" };
      return { ...item, revision: item.revision + 1, title: "市场决定政府更好，机制有效主体活调控有度", text: "市场决定，政府更好；机制有效，主体有活力，宏调有度。", method: "先记市场与政府关系，再用有效、活力、有度还原治理目标", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "还原社会主义市场经济中的市场政府关系和三项治理目标。", coverage: "市场决定性作用、更好发挥政府作用；市场机制有效、微观主体有活力、宏观调控有度。", conditions: ["以当前官方稳定表述为准。"], excludes: ["理论沿革", "具体年度政策", "旧五层框架的机械背诵"], verification: verification(["central-socialist-market-2020"], ["政府和市场关系", "经济体制目标"]), phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], meaning: phrase.id.includes("meaning") ? "充分发挥市场在资源配置中的决定性作用，更好发挥政府作用。" : "推动市场机制有效、微观主体有活力、宏观调控有度。", coverageType: "structural-current-market-government-governance", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-socialist-market-current" })) })) };
    }
    if (item.id === "macro-control-goals-memory") return { ...item, revision: item.revision + 1, status: "blocked", lifecycle: "retired-alias", canonicalMnemonicId: "macro-four-goals-memory" };
    return item;
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => {
  if (item.mnemonicId === "exchange-rate-effects-memory") return { ...item, revision: item.revision + 1, purpose: "用条件链判断汇率的基础影响，并阻止把资本流动写成单向必然关系。", method: "先固定标价口径，再沿进口成本、出口竞争力和资本多因素边界还原" };
  if (item.mnemonicId === "socialist-market-framework-memory") return { ...item, revision: item.revision + 1, purpose: "还原社会主义市场经济中的市场政府关系和三项治理目标。", method: "先记市场与政府关系，再用有效、活力、有度还原治理目标" };
  if (item.mnemonicId === "macro-control-goals-memory") return { ...item, revision: item.revision + 1 };
  return item;
});

const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "exchange-rate-effects-memory"
  ? { ...item, coverageType: "structural-exchange-conditional-chain" }
  : item.mnemonicId === "socialist-market-framework-memory"
    ? { ...item, coverageType: "structural-current-market-government-governance" }
    : item);

function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  const retired = new Set(RETIRED_MACRO_IDS);
  plan.revision += 1;
  plan.modes.qa.groupIds = plan.modes.qa.groupIds.filter((id) => id !== "macro-control-goals-core");
  plan.modes.qa.questionIds = plan.modes.qa.questionIds.filter((id) => !retired.has(id));
  plan.modes.mnemonic.questionIds = plan.modes.mnemonic.questionIds.filter((id) => !retired.has(id));
  plan.modes.mnemonic.mnemonicIds = plan.modes.mnemonic.mnemonicIds.filter((id) => id !== "macro-control-goals-memory");
  return plan;
}

const decisions = [
  { gate: "exchange-rate-effects-core", decision: "rewrite-and-retain", outcome: "保留五题稳定 ID；资本题改为多因素边界，口诀删除单向资本结论。" },
  { gate: "socialist-market-framework-core", decision: "common-sense-owns-economic-mechanism", outcome: "常识保留市场政府关系和治理目标；政治理论承载理论沿革与文件体系。" },
  { gate: "macro-control-goals-core", decision: "retire-duplicate-entry", outcome: "隐藏重复入口，旧 ID 仅作兼容；macro-four-goals 为唯一学习组。" },
  { gate: "q1-market-failure", decision: "promote-in-place", outcome: "不迁移 ID，原组三题升级为 Q2 候选。" },
];

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-22",
  status: "review",
  QUESTION_IDS,
  EXCHANGE_IDS,
  SOCIALIST_IDS,
  RETIRED_MACRO_IDS,
  PROMOTED_Q1_IDS,
  verificationSources,
  replacementRows,
  distractorReasons,
  targetRows,
  variationRows,
  decisions,
  applyQuestions,
  applyTargets,
  applyQuestionTargetRelations,
  applyQuestionSpecifications,
  applyVariationDecisions,
  applyGroups,
  applyMnemonics,
  applyMnemonicSpecifications,
  applyMnemonicPhraseTargetRelations,
  applyEntryPlans,
  sessionMigrations: [{
    fromVersion: "2026102396",
    toPackVersion: "2026-10-23.97",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["exchange-rate-effects-memory", "socialist-market-framework-memory", "macro-control-goals-memory"],
    reason: "Q2 经济第二十二批关闭四项停止门：补齐汇率条件链、更新社会主义市场经济口径、隐藏重复宏观目标入口，并原 ID 升级市场失灵试点。",
  }],
};
