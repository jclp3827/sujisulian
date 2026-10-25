"use strict";

// Q2 经济第一批：汇率直接/间接标价、需求与供给的角色和双重条件。
// 保留稳定 ID 与题量，改为观察口径、报价结构和买卖角色条件判断；两项记忆资源形成可逆结构口诀。

const QUESTION_IDS = [
  "fx-direct", "fx-indirect", "fx-context", "fx-direct-scenario", "fx-indirect-scenario",
  "demand-conditions", "supply-conditions", "demand-wish",
];

const replacementRows = {
  "fx-direct": { objective: "由固定外币基准判断直接标价法", prompt: "以我国居民为观察口径，人民币是本币。报价“1 美元＝若干人民币”应怎样判断？", options: ["按固定本币的间接标价法", "按固定外币的直接标价法", "缺少交易时点，暂时无法判断"], answer: 1, explanation: "报价固定一单位外币美元，用本币人民币表示外币价格，属于直接标价法。", boundary: "判断依赖本币观察口径与固定基准，不凭数值大小或交易时点判断。" },
  "fx-indirect": { objective: "由固定本币基准判断间接标价法", prompt: "以我国居民为观察口径，人民币是本币。报价“1 人民币＝若干美元”应怎样判断？", options: ["按固定外币的直接标价法", "要比较两个数值大小后再判断", "按固定本币的间接标价法"], answer: 2, explanation: "报价固定一单位本币人民币，用外币美元表示本币价格，属于间接标价法。", boundary: "判断依赖本币观察口径与固定基准，不讨论汇率升降或实际行情。" },
  "fx-context": { objective: "识别判断标价法前必须明确本币观察口径", prompt: "只看到“A 货币 1 单位＝B 货币若干单位”，但不知道观察者所在国家或地区，能否直接判断标价法？", options: ["不能，须先确定观察口径中的本币", "可以，等号左边的货币天然就是外币", "可以，数值较大的货币就是本国货币"], answer: 0, explanation: "直接和间接标价以本币、外币及固定基准区分；未明确观察口径时不能仅凭排列或数值判断。", boundary: "货币在等号哪一边以及数值大小，都不能替代本币身份信息。" },
  "fx-direct-scenario": { objective: "在明确本外币身份的报价中运用直接标价规则", prompt: "甲国居民以甲币为本币、乙币为外币。某报价固定 1 单位乙币，并用甲币标出其价格。该报价属于？", options: ["固定本币的间接标价法", "固定外币的直接标价法", "没有说明数值大小，不能判断"], answer: 1, explanation: "乙币是外币，报价固定一单位乙币并用本币甲币表示其价格，因此属于直接标价法。", boundary: "甲币、乙币只是角色代号；结论不代表真实货币行情。" },
  "fx-indirect-scenario": { objective: "在明确本外币身份的报价中运用间接标价规则", prompt: "甲国居民以甲币为本币、乙币为外币。某报价固定 1 单位甲币，并用乙币标出其价格。该报价属于？", options: ["固定外币的直接标价法", "缺少兑换时点，不能判断标价法", "固定本币的间接标价法"], answer: 2, explanation: "甲币是本币，报价固定一单位甲币并用外币乙币表示其价格，因此属于间接标价法。", boundary: "标价法由本外币身份和固定基准决定，与报价发生在何时无关。" },
  "demand-conditions": { objective: "在一定时期和价格条件下识别需求的双重条件", prompt: "某商品价格给定。下列哪种情形符合经济学中需求的基本条件？", options: ["消费者愿意购买，但没有相应支付能力", "消费者在该价格下愿意购买且具备支付能力", "生产者在该价格下愿意出售并能够提供商品"], answer: 1, explanation: "需求从消费者购买一侧判断，并同时要求购买意愿和购买能力。", boundary: "还须结合一定时期与价格条件，不能把单纯愿望或生产者出售行为算作需求。" },
  "supply-conditions": { objective: "在一定时期和价格条件下识别供给的主体和双重条件", prompt: "某商品价格给定。下列哪种情形符合经济学中供给的基本条件？", options: ["消费者在该价格下愿意购买并具备支付能力", "生产者计划保留商品，并不向市场提供出售", "生产者在该价格下愿意并能够提供出售"], answer: 2, explanation: "供给从生产者出售一侧判断，并同时要求愿意和能够提供出售。", boundary: "已经生产但不愿或不能出售，不直接构成定义中的供给。" },
  "demand-wish": { objective: "运用需求双重条件排除只有购买愿望的情形", prompt: "某人在当前价格下很想购买一件商品，但没有相应支付能力。该愿望能否计入需求？", options: ["不计入，缺少在该价格下购买的能力", "计入，因为购买愿望可以替代支付能力", "计入，因为需求判断不涉及时期和价格"], answer: 0, explanation: "购买意愿和购买能力必须同时具备；只有愿望而没有相应支付能力，不构成需求。", boundary: "本题只判断经济学概念，不评价个人消费选择或信用状况。" },
};

const distractorReasons = {
  "fx-direct": { 0: "间接标价固定本币单位，而题干固定的是外币美元。", 2: "交易时点不决定标价法，本外币身份与固定基准已经足够判断。" },
  "fx-indirect": { 0: "直接标价固定外币单位，而题干固定的是本币人民币。", 1: "报价数值大小不决定直接或间接标价，比较数值不能替代本币口径。" },
  "fx-context": { 1: "等号左边只表示报价基准，未必天然属于观察口径中的外币。", 2: "货币数值大小不决定哪一种货币属于本币，也不决定标价方法。" },
  "fx-direct-scenario": { 0: "题干固定的是外币乙币而不是本币甲币，不符合间接标价规则。", 2: "本外币身份和固定基准已经给出，不需要依据数值大小判断。" },
  "fx-indirect-scenario": { 0: "题干固定的是本币甲币而不是外币乙币，不符合直接标价规则。", 1: "兑换时点不决定标价方法，题干条件已经足以识别间接标价。" },
  "demand-conditions": { 0: "只有购买意愿而没有支付能力，缺少需求的必要条件。", 2: "该项描述的是生产者提供出售，属于供给一侧而不是需求一侧。" },
  "supply-conditions": { 0: "该项描述消费者购买，属于需求一侧而不是生产者供给。", 1: "保留商品而不提供出售，缺少供给定义中的出售意愿和行为。" },
  "demand-wish": { 1: "购买愿望不能替代支付能力，两项条件必须同时满足。", 2: "需求需要结合一定时期和价格条件，不能脱离条件判断。" },
};

const cognitiveLevels = {
  "fx-direct": "application", "fx-indirect": "application", "fx-context": "condition",
  "fx-direct-scenario": "application", "fx-indirect-scenario": "application",
  "demand-conditions": "application", "supply-conditions": "application", "demand-wish": "application",
};
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，改为观察口径、报价结构或买卖角色情境，并补齐逐项理由和适用边界。" }));

const targetRows = {
  "cs-target-fx-direct-base": { statement: "能在明确本币观察口径后，由固定外币基准判断直接标价法。", conclusion: "直接标价法固定外币单位，用本币表示外币价格。", conditions: ["先明确哪个国家或地区的货币是本币，再识别报价固定的货币。"], excludes: ["不凭货币排列、数值大小或交易时点判断，不推导汇率升降。"] },
  "cs-target-fx-indirect-base": { statement: "能在明确本币观察口径后，由固定本币基准判断间接标价法。", conclusion: "间接标价法固定本币单位，用外币表示本币价格。", conditions: ["先明确哪个国家或地区的货币是本币，再识别报价固定的货币。"], excludes: ["不凭货币排列、数值大小或交易时点判断，不推导汇率升降。"] },
  "cs-target-fx-observer-context": { statement: "能识别判断标价法前必须先明确本币观察口径。", conclusion: "没有本币观察口径，不能只凭兑换式的排列或数值判断标价法。", conditions: ["同一货币对会随观察主体不同而改变本币和外币身份。"], excludes: ["不讨论实时行情、汇率制度、贸易或资本流动。"] },
  "q0b-target-demand-conditions": { statement: "能在一定时期和价格条件下识别需求同时要求消费者愿意且能够购买。", conclusion: "需求从消费者购买一侧判断，并同时包含购买意愿和购买能力。", conditions: ["商品、时期和价格条件明确，判断主体为消费者。"], excludes: ["不把单纯愿望或生产者出售行为计作需求。"] },
  "q0b-target-supply-conditions": { statement: "能在一定时期和价格条件下识别供给同时要求生产者愿意且能够提供出售。", conclusion: "供给从生产者出售一侧判断，并同时包含出售意愿和提供能力。", conditions: ["商品、时期和价格条件明确，判断主体为生产者。"], excludes: ["不把消费者购买或生产后保留的商品计作供给。"] },
  "q0b-target-demand-wish": { statement: "能运用需求双重条件排除只有购买愿望而无支付能力的情形。", conclusion: "只有购买意愿、没有相应购买能力，不构成需求。", conditions: ["在给定时期和价格下判断购买意愿与购买能力。"], excludes: ["不评价个人消费选择、收入水平或信用状况。"] },
};

const direct = {
  "cs-target-fx-direct-base": "fx-direct", "cs-target-fx-indirect-base": "fx-indirect", "cs-target-fx-observer-context": "fx-context",
  "q0b-target-demand-conditions": "demand-conditions", "q0b-target-supply-conditions": "supply-conditions", "q0b-target-demand-wish": "demand-wish",
};
const variationRows = {
  "cs-target-fx-direct-base": { directQuestionIds: ["fx-direct"], variationQuestionIds: ["fx-direct-scenario"], processDifference: "直接题使用熟悉货币识别固定外币规则，变式题改用甲乙货币角色，要求脱离具体币种应用同一判断顺序。" },
  "cs-target-fx-indirect-base": { directQuestionIds: ["fx-indirect"], variationQuestionIds: ["fx-indirect-scenario"], processDifference: "直接题使用熟悉货币识别固定本币规则，变式题改用甲乙货币角色，要求脱离具体币种应用同一判断顺序。" },
  "cs-target-fx-observer-context": { directQuestionIds: ["fx-context"], variationQuestionIds: ["fx-direct-scenario", "fx-indirect-scenario"], processDifference: "边界题判断信息是否足够，两个变式题先给出本币身份，再分别应用固定外币和固定本币规则。" },
  "q0b-target-demand-conditions": { directQuestionIds: ["demand-conditions"], variationQuestionIds: ["demand-wish"], processDifference: "直接题同时比较消费者、生产者和双重条件，变式题撤去购买能力，要求识别需求条件缺失。" },
  "q0b-target-supply-conditions": { directQuestionIds: ["supply-conditions"], variationQuestionIds: ["demand-conditions"], processDifference: "直接题判断生产者出售条件，关联题对照消费者购买条件，检验能否先分买卖角色再判断。" },
  "q0b-target-demand-wish": { directQuestionIds: ["demand-wish"], variationQuestionIds: ["demand-conditions"], processDifference: "直接题给出有意愿无能力的缺项情境，关联题提供完整需求条件，形成缺项与完整条件对照。" },
};

const mnemonicDispositions = [
  { groupId: "fx-quotation", decision: "structural-mnemonic-candidate", resourceId: "fx-memory", reason: "可先确定本外币，再判断固定基准；固定外币对应直接、固定本币对应间接，步骤可从题目情境反向还原。" },
  { groupId: "demand-supply-roles", decision: "structural-mnemonic-candidate", resourceId: "demand-supply-roles-memory", reason: "可先锁定时期与价格，再按消费者购买或生产者出售分流，最后核对意愿和能力，形成稳定判断链。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-role-condition" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-role-condition", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "fx-quotation" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "demand-supply-roles" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);
function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "fx-memory") {
      const phrases = {
        "fx-memory-direct": "固定外币是直接",
        "fx-memory-indirect": "固定本币是间接",
        "fx-memory-context": "先认本外，再看固定",
      };
      return { ...item, revision: item.revision + 1, title: "本外基准判断诀", text: "先认本外，再看固定：固定外币是直接，固定本币是间接。", method: "先确定本外币身份，再按固定基准分流", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "用本外币身份和固定基准两步还原直接、间接标价法，避免凭排列或数值猜测。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-decision-with-boundary", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-economics-role-condition" })) })) };
    }
    if (item.id === "demand-supply-roles-memory") {
      const phrases = {
        "demand-supply-roles-memory-phrase-1": "消费者愿买且能买，才是需求",
        "demand-supply-roles-memory-phrase-2": "生产者愿卖且能卖，才是供给",
      };
      return { ...item, revision: item.revision + 1, title: "买卖双条件判断诀", text: "一定时期和价格下：消费者愿买且能买，才是需求；生产者愿卖且能卖，才是供给。", method: "先锁时期价格，再分买卖角色，最后核对意愿和能力", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "沿时期价格、买卖角色和意愿能力三步，区分需求与供给并排除只有愿望的情形。", conditions: ["在一定时期和价格条件下，消费者对应购买，生产者对应提供出售。"], phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-role-and-condition", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-economics-role-condition" })) })) };
    }
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "fx-memory" ? { ...item, revision: item.revision + 1, purpose: "用本外币身份和固定基准两步还原直接、间接标价法，避免凭排列或数值猜测。", method: "先确定本外币身份，再按固定基准分流" } : item.mnemonicId === "demand-supply-roles-memory" ? { ...item, revision: item.revision + 1, purpose: "沿时期价格、买卖角色和意愿能力三步，区分需求与供给并排除只有愿望的情形。", method: "先锁时期价格，再分买卖角色，最后核对意愿和能力" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "fx-memory" ? { ...item, coverageType: "structural-decision-with-boundary" } : item.mnemonicId === "demand-supply-roles-memory" ? { ...item, coverageType: "structural-role-and-condition" } : item);

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q2-economics-1", status: "review", QUESTION_IDS, replacementRows,
  distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions,
  applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions,
  applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{ fromVersion: "2026102275", toPackVersion: "2026-10-23.76", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["fx-memory", "demand-supply-roles-memory"], reason: "Q2 经济第一批重写汇率标价与需求供给八题；两项记忆资源升级为可逆结构口诀。" }],
};
