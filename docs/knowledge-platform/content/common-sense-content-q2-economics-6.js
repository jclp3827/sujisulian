"use strict";

// Q2 经济第六批：信息不对称机制与市场失灵定义。
// 保留稳定 ID 与题量，把简称复述改为交易条件、事前事后和行为链判断。

const QUESTION_IDS = [
  "information-asymmetry-definition",
  "adverse-selection-before",
  "moral-hazard-after",
  "information-asymmetry-remedy",
  "information-asymmetry-full",
  "market-failure-meaning-direct",
  "market-failure-meaning-scenario",
];

const replacementRows = {
  "information-asymmetry-definition": {
    objective: "由交易参与者掌握的信息不同识别信息不对称",
    prompt: "判断交易中是否存在信息不对称，最应核对哪项情况？",
    options: ["交易参与者掌握的信息存在差异", "同一商品价格随市场供求关系正常变化", "交易双方采用相同的结算方式"],
    answer: 0,
    explanation: "信息不对称又称信息不完全，核心是交易参与者掌握的信息不同。",
    boundary: "定义限于交易语境，不把一般知识差异或价格变化直接称为信息不对称。",
  },
  "adverse-selection-before": {
    objective: "由交易前信息差和差品挤出好品识别逆向选择",
    prompt: "交易前，卖方更了解商品质量；买方因难辨好坏只愿给出较低报价，优质商品逐渐退出。该现象属于什么？",
    options: ["道德风险", "逆向选择", "正外部性"],
    answer: 1,
    explanation: "交易前的信息不对称使差的商品挤出好的商品，属于逆向选择。",
    boundary: "不能只凭发生在交易前作答，还要保留信息不对称和差品挤出好品的机制。",
  },
  "moral-hazard-after": {
    objective: "由交易后隐藏行为利己损他识别道德风险",
    prompt: "合同成立后，一方利用另一方难以观察其行为的条件，为增加自身收益而采取提高对方风险的做法。该现象属于什么？",
    options: ["逆向选择", "道德风险", "公共物品供给不足"],
    answer: 1,
    explanation: "交易后存在信息不对称，行为者采取利己而不利他人的隐藏行动，属于道德风险。",
    boundary: "不能把所有交易后损失都称为道德风险，还需存在信息不对称和相应行为条件。",
  },
  "information-asymmetry-remedy": {
    objective: "识别材料列举的信息调控治理方向",
    prompt: "针对消费者和生产者掌握的信息不充分、不准确，材料列举的治理方向是？",
    options: ["由政府进行信息调控，帮助交易者获得充分、正确信息", "限制交易者接触商品质量、合同条件和风险变化等相关信息", "通过扩大货币发行直接消除交易信息差异"],
    answer: 0,
    explanation: "材料提出政府在信息方面进行调控，使消费者和生产者获得充分、正确的信息。",
    boundary: "这里只识别治理方向，不展开具体披露制度、监管程序和责任规则。",
  },
  "information-asymmetry-full": {
    objective: "综合区分逆向选择与道德风险的阶段和机制",
    prompt: "关于信息不对称引发的两类风险，下列对应正确的是？",
    options: ["逆向选择—交易后隐藏行为利己损他；道德风险—交易前差品挤出好品并退出市场", "逆向选择—交易前差品挤出好品；道德风险—交易后隐藏行为利己损他", "逆向选择与道德风险都只由商品价格正常波动造成"],
    answer: 1,
    explanation: "逆向选择通常发生在交易前，表现为差品挤出好品；道德风险多发生在交易后，表现为隐藏行为利己损他。",
    boundary: "事前和事后是通常阶段，还必须结合各自的信息条件和行为机制判断。",
  },
  "market-failure-meaning-direct": {
    objective: "识别市场失灵的资源配置定义",
    prompt: "下列哪项符合市场失灵的核心含义？",
    options: ["市场机制不能实现资源的有效配置", "某种商品价格在市场供求关系变化后相应调整", "个别企业某期经营利润出现下降"],
    answer: 0,
    explanation: "通过市场机制不能实现资源的有效配置，这种情况称为市场失灵。",
    boundary: "价格正常调整或个别企业利润变化本身不等于市场失灵。",
  },
  "market-failure-meaning-scenario": {
    objective: "由市场机制无法有效配置资源识别市场失灵",
    prompt: "某领域仅依靠市场机制时，资源持续无法得到有效配置。按定义应判断为？",
    options: ["市场失灵", "充分就业", "国际收支平衡"],
    answer: 0,
    explanation: "题干保留了市场机制不能实现资源有效配置这一核心，符合市场失灵定义。",
    boundary: "本题只识别定义，不据此判断具体由垄断、外部性、公共物品还是信息不对称造成。",
  },
};

const distractorReasons = {
  "information-asymmetry-definition": { 1: "价格随时间变化是市场现象，不说明交易参与者掌握的信息不同。", 2: "结算方式相同不代表双方掌握的商品质量、风险等信息相同。" },
  "adverse-selection-before": { 0: "道德风险多发生在交易后，并涉及难以观察的利己损他行为。", 2: "正外部性描述无关第三方受益，不解释交易前差品挤出好品。" },
  "moral-hazard-after": { 0: "逆向选择通常发生在交易前，核心是差品挤出好品，不是交易后隐藏行为。", 2: "公共物品供给不足源于非竞争、非排他和搭便车，不符合题干机制。" },
  "information-asymmetry-remedy": { 1: "限制质量和风险信息会扩大信息差异，不能形成材料列举的治理方向。", 2: "扩大货币发行不直接补足消费者和生产者的交易信息。" },
  "information-asymmetry-full": { 0: "该项把逆向选择与道德风险的通常阶段和行为机制相互颠倒。", 2: "两类风险以交易信息不对称为背景，并非由价格正常波动直接造成。" },
  "market-failure-meaning-direct": { 1: "价格随供求调整属于市场运行现象，本身不等于资源无法有效配置。", 2: "个别企业利润下降不能说明整个相关领域的资源配置失效。" },
  "market-failure-meaning-scenario": { 1: "充分就业是宏观调控目标，不是市场机制无法有效配置资源的定义。", 2: "国际收支平衡是宏观调控目标，不对应题干的资源配置状态。" },
};

const cognitiveLevels = {
  "information-asymmetry-definition": "condition",
  "adverse-selection-before": "application",
  "moral-hazard-after": "application",
  "information-asymmetry-remedy": "application",
  "information-asymmetry-full": "synthesis",
  "market-failure-meaning-direct": "recall",
  "market-failure-meaning-scenario": "application",
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留稳定题目身份，改为交易信息条件、事前事后机制或资源配置定义判断，并补齐逐项理由和边界。",
}));

const targetRows = {
  "cs-target-information-asymmetry-definition": { statement: "能由交易参与者掌握的信息不同识别信息不对称。", conclusion: "信息不对称又称信息不完全，指交易参与者掌握的信息不同。", conditions: ["定义发生在交易语境，并核对参与者之间的信息差异。"], excludes: ["不把一般知识差异、价格变化或结算方式差异直接归入。"] },
  "cs-target-adverse-selection-before": { statement: "能由交易前信息差和差品挤出好品识别逆向选择。", conclusion: "逆向选择通常发生在交易前，表现为信息不对称下差的商品挤出好的商品。", conditions: ["同时保留交易前、信息不对称和差品挤出好品三项线索。"], excludes: ["不采用来源中与该机制冲突的‘优汰劣胜’补述。"] },
  "cs-target-moral-hazard-after": { statement: "能由交易后信息差和隐藏的利己损他行为识别道德风险。", conclusion: "道德风险多发生在交易后，行为者利用信息不对称采取利己而不利他人的行动。", conditions: ["同时核对交易后信息差和行为机制。"], excludes: ["不把所有交易后损失或一般违约直接称为道德风险。"] },
  "cs-target-information-asymmetry-remedy": { statement: "能识别材料列举的信息调控治理方向。", conclusion: "政府在信息方面进行调控，使消费者和生产者获得充分、正确的信息。", conditions: ["答案限定为材料列举的治理方向。"], excludes: ["不展开具体披露制度、监管程序和责任规则。"] },
  "cs-target-market-failure-meaning": { statement: "能识别市场机制不能实现资源有效配置这一市场失灵定义。", conclusion: "通过市场机制不能实现资源的有效配置，即为市场失灵。", conditions: ["判断核心是市场机制未能实现资源有效配置。"], excludes: ["不把价格正常变化或个别企业利润下降直接称为市场失灵。"] },
};

const variationRows = {
  "cs-target-information-asymmetry-definition": { directQuestionIds: ["information-asymmetry-definition"], variationQuestionIds: ["information-asymmetry-full"], processDifference: "直接题核对交易参与者信息不同这一条件，变式题把信息条件放入逆向选择与道德风险的阶段和行为机制中。" },
  "cs-target-adverse-selection-before": { directQuestionIds: ["adverse-selection-before"], variationQuestionIds: ["information-asymmetry-full"], processDifference: "直接题由交易前差品挤出好品的情境识别逆向选择，变式题与交易后道德风险并列比较阶段和机制。" },
  "cs-target-moral-hazard-after": { directQuestionIds: ["moral-hazard-after"], variationQuestionIds: ["information-asymmetry-full"], processDifference: "直接题由交易后隐藏行为利己损他识别道德风险，变式题与交易前逆向选择并列比较阶段和机制。" },
  "cs-target-information-asymmetry-remedy": { directQuestionIds: ["information-asymmetry-remedy"], variationQuestionIds: ["information-asymmetry-full"], processDifference: "直接题从信息不足不准确选择治理方向，变式题先区分两类风险，再检验能否保留信息不对称背景。" },
  "cs-target-market-failure-meaning": { directQuestionIds: ["market-failure-meaning-direct"], variationQuestionIds: ["market-failure-meaning-scenario"], processDifference: "直接题从三个表述中识别资源有效配置定义，变式题从具体资源配置状态反推市场失灵，排除宏观目标。" },
};

const mnemonicDispositions = [
  { groupId: "market-failure-information-mechanism", decision: "structural-mnemonic-candidate", resourceId: "information-asymmetry-memory", reason: "可按交易信息差、交易前逆向选择、交易后道德风险和信息治理形成可逆判断链。" },
  { groupId: "market-failure-meaning", decision: "not-suitable", resourceId: null, reason: "单一定义本身短且必须完整保留资源有效配置条件，直接理解优于另造口诀。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: item.questionId.startsWith("market-failure-meaning") ? "q2-economics-market-failure-definition" : "q2-economics-information-asymmetry" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: item.questionId.startsWith("market-failure-meaning") ? "q2-economics-market-failure-definition" : "q2-economics-information-asymmetry", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "market-failure-information-mechanism" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "market-failure-meaning" ? { ...item, mnemonicDecision: "not-suitable", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id !== "information-asymmetry-memory") return item;
    const phrases = {
      "information-memory-definition": "交易信息不同",
      "information-memory-risks": "事前逆向选择，差品挤好品；事后道德风险，损他利自己",
      "information-memory-remedy": "治理补信息",
    };
    return {
      ...item,
      revision: item.revision + 1,
      title: "先看信息差，再分前后",
      text: "交易信息不同；事前逆向选择，差品挤好品；事后道德风险，损他利自己；治理补信息。",
      method: "先核对交易信息差，再按交易前后与行为机制区分两类风险，最后接信息治理方向",
      learningForm: "structural-mnemonic",
      formLabel: "结构口诀",
      purpose: "按交易信息条件、发生阶段、行为机制和治理方向还原信息不对称考点。",
      phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], coverageType: "structural-information-stage-behavior-remedy", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-information-asymmetry" })) })),
    };
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "information-asymmetry-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "按交易信息条件、发生阶段、行为机制和治理方向还原信息不对称考点。",
  method: "先核对交易信息差，再按交易前后与行为机制区分两类风险，最后接信息治理方向",
} : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "information-asymmetry-memory" ? { ...item, coverageType: "structural-information-stage-behavior-remedy" } : item);

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-6",
  status: "review",
  QUESTION_IDS,
  replacementRows,
  distractorReasons,
  cognitiveLevels,
  questionDispositions,
  targetRows,
  variationRows,
  mnemonicDispositions,
  applyQuestions,
  applyTargets,
  applyQuestionTargetRelations,
  applyQuestionSpecifications,
  applyVariationDecisions,
  applyGroups,
  applyMnemonics,
  applyMnemonicSpecifications,
  applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{
    fromVersion: "2026102380",
    toPackVersion: "2026-10-23.81",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["information-asymmetry-memory"],
    reason: "Q2 经济第六批重写信息不对称机制与市场失灵定义七题；信息不对称记忆资源升级为完整概念和阶段行为链结构口诀。",
  }],
};
