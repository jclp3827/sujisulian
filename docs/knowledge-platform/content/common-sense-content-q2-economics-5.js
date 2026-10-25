"use strict";

// Q2 经济第五批：外部性与公共物品两类市场失灵机制。
// 保留稳定 ID 与题量，改为第三方影响、正负配对和公共物品供给链的情境判断。

const QUESTION_IDS = [
  "market-failure-externality-definition",
  "market-failure-externality-types",
  "market-failure-negative-externality",
  "market-failure-positive-externality",
  "market-failure-externality-full",
  "public-goods-features",
  "public-private-goods-contrast",
  "pure-quasi-public-goods",
  "public-goods-free-rider-remedy",
  "public-goods-full",
];

const replacementRows = {
  "market-failure-externality-definition": {
    objective: "由经济活动影响无关第三方识别外部性",
    prompt: "判断一项影响是否属于外部性，最应核对哪项条件？",
    options: ["经济活动影响了与该活动无关的第三方", "交易双方已把相关成本和收益写入合同", "市场价格随供求关系变化并影响交易双方"],
    answer: 0,
    explanation: "外部性是某种经济活动给与该活动无关的第三方带来的影响，第三方和无关是关键条件。",
    boundary: "交易双方已经约定并承担的成本收益，不能仅因存在影响就直接称为外部性。",
  },
  "market-failure-externality-types": {
    objective: "按无关第三方获得利益或承担成本区分正负外部性",
    prompt: "甲活动使无关第三方获得利益，乙活动使无关第三方承担成本。甲、乙依次属于？",
    options: ["负外部性、正外部性", "正外部性、负外部性", "公共物品、信息不对称"],
    answer: 1,
    explanation: "给无关第三方带来利益是正外部性，给无关第三方带来成本是负外部性。",
    boundary: "正负依据第三方实际获得的利益或承担的成本判断，不依据行为者的主观动机。",
  },
  "market-failure-negative-externality": {
    objective: "由未补偿第三方成本识别负外部性及征税方向",
    prompt: "某生产活动使周边居民承担额外成本，却没有给予补偿。按材料列举的治理方向，应怎样处理？",
    options: ["给予生产者补贴，把外部收益转回生产者", "向生产者征税，把外部成本转回生产者", "由居民承担成本，并把它归为正外部性"],
    answer: 1,
    explanation: "未补偿的第三方成本属于负外部性；材料列举向行为者征税，使外部成本转回行为者。",
    boundary: "本题只识别治理方向，不计算税额，也不判断现实案件中的责任和程序。",
  },
  "market-failure-positive-externality": {
    objective: "由第三方受益而行为者未获收益识别正外部性及补贴方向",
    prompt: "某项活动使周边居民受益，但行为者没有获得相应收益。按材料列举的治理方向，应怎样处理？",
    options: ["给予行为者补贴，把外部收益转回行为者", "向行为者征税，把未补偿成本转回行为者", "把第三方获得的利益改称为行为者私人成本"],
    answer: 0,
    explanation: "第三方受益而行为者未获相应收益属于正外部性；材料列举给予补贴，使外部收益转回行为者。",
    boundary: "本题只识别治理方向，不计算补贴额，也不把所有社会受益情形都直接归入正外部性。",
  },
  "market-failure-externality-full": {
    objective: "综合复辨第三方条件、正负分类与治理方向",
    prompt: "关于外部性及其治理方向，下列对应正确的是？",
    options: ["第三方受益—负外部性—征税；第三方受损—正外部性—补贴", "第三方受益—正外部性—补贴；第三方承担未补偿成本—负外部性—征税", "交易双方成本收益变化—正外部性—补贴；市场价格正常变化—负外部性—征税"],
    answer: 1,
    explanation: "无关第三方受益对应正外部性和补贴方向；无关第三方承担未补偿成本对应负外部性和征税方向。",
    boundary: "必须先满足影响无关第三方的定义条件，再判断利益或成本以及对应治理方向。",
  },
  "public-goods-features": {
    objective: "识别严格意义公共物品的非竞争性和非排他性",
    prompt: "严格意义上的公共物品同时具备哪两项特征？",
    options: ["竞争性和排他性", "非竞争性和非排他性", "竞争性和较强非排他性"],
    answer: 1,
    explanation: "严格意义上的公共物品同时具有非竞争性和非排他性。",
    boundary: "两项特征需要同时保留；不能仅凭物品名称或公共机构提供就直接判断。",
  },
  "public-private-goods-contrast": {
    objective: "对照严格公共物品与私人物品的两项属性",
    prompt: "关于严格公共物品与私人物品的特征，哪组对应正确？",
    options: ["公共物品—非竞争、非排他；私人物品—竞争、排他", "公共物品—竞争、排他；私人物品—非竞争、非排他", "公共物品—竞争、非排他；私人物品—非竞争、排他"],
    answer: 0,
    explanation: "严格公共物品具有非竞争性和非排他性，私人物品具有竞争性和排他性。",
    boundary: "这里采用严格公共物品与私人物品的基本对照，不扩展公共资源、俱乐部物品等其他类型。",
  },
  "pure-quasi-public-goods": {
    objective: "由两项特征是否完整区分纯公共物品与准公共物品",
    prompt: "怎样区分纯公共物品与准公共物品？",
    options: ["纯公共物品兼具两项特征；准公共物品一项成立，另一项表现不充分", "纯公共物品只具有非排他性、不具非竞争性；准公共物品同时具有竞争性和排他性", "纯公共物品与准公共物品都完整具有竞争性和排他性"],
    answer: 0,
    explanation: "纯公共物品兼具非竞争性和非排他性；准公共物品只有其中一项，另一项表现不充分。",
    boundary: "本题只识别分类规则，不判断存在争议的具体物品应归入哪一类。",
  },
  "public-goods-free-rider-remedy": {
    objective: "还原公共物品搭便车、市场供给不足到政府提供的链路",
    prompt: "公共物品可以不购买仍消费，生产者因此缺乏充分供给意愿。材料给出的主要解决方向是？",
    options: ["主要由政府提供公共物品", "由消费者分别决定公共物品价格", "减少信息披露并等待市场自动补足"],
    answer: 0,
    explanation: "搭便车使公共物品难以进入正常市场交易，生产者缺乏供给意愿，材料指出主要由政府提供。",
    boundary: "这里识别主要供给方向，不讨论政府供给的筹资方式、效率或具体制度设计。",
  },
  "public-goods-full": {
    objective: "综合判断公共物品属性、分类和供给不足机制",
    prompt: "关于公共物品及其供给机制，下列说法正确的是？",
    options: ["严格公共物品具有两项非特征，搭便车可能造成市场供给不足，主要由政府提供", "公共物品具有竞争性和排他性，购买者越多越容易形成充分市场供给和有效配置", "准公共物品与纯公共物品的两项特征强度相同，因此不需要区分"],
    answer: 0,
    explanation: "非竞争性和非排他性可能引发搭便车和市场供给不足，材料指出公共物品主要由政府提供。",
    boundary: "综合判断仍须区分纯公共物品和准公共物品，不据名称裁定具体物品归类。",
  },
};

const distractorReasons = {
  "market-failure-externality-definition": { 1: "交易双方已纳入合同的成本属于交易内部安排，不符合无关第三方这一关键条件。", 2: "价格随供求变化是市场运行现象，不等于经济活动影响了无关第三方。" },
  "market-failure-externality-types": { 0: "利益对应正外部性、成本对应负外部性，该项把正负顺序颠倒。", 2: "公共物品和信息不对称是其他市场失灵因素，不是按第三方利损划分的外部性类型。" },
  "market-failure-negative-externality": { 0: "补贴用于材料列举的正外部性治理，不对应第三方承担未补偿成本。", 2: "第三方承担未补偿成本属于负外部性，不能改称正外部性并由第三方继续承担。" },
  "market-failure-positive-externality": { 1: "征税对应材料列举的负外部性治理，不对应第三方受益而行为者未获收益。", 2: "第三方获得的利益属于外部收益，不能改称行为者的私人成本。" },
  "market-failure-externality-full": { 0: "该项把第三方受益、受损与正负类型及补贴、征税方向全部错配。", 2: "交易双方成本和市场价格变化没有保留无关第三方条件，不能直接套用外部性分类。" },
  "public-goods-features": { 0: "竞争性和排他性是私人物品的基本特征，不是严格公共物品的两项特征。", 2: "严格公共物品还必须具有非竞争性，不能只保留非排他性。" },
  "public-private-goods-contrast": { 1: "该项把严格公共物品与私人物品的两项特征完全颠倒。", 2: "严格公共物品应同时非竞争、非排他，私人物品应同时竞争、排他。" },
  "pure-quasi-public-goods": { 1: "纯公共物品须兼具非竞争性和非排他性，准公共物品也不是完整的私人物品属性。", 2: "竞争性和排他性是私人物品特征，不能同时用于解释纯公共物品和准公共物品。" },
  "public-goods-free-rider-remedy": { 1: "分别定价不能处理不购买仍可消费造成的搭便车和供给不足。", 2: "减少信息披露与公共物品两项属性无关，也不能形成材料列举的解决方向。" },
  "public-goods-full": { 1: "该项颠倒公共物品属性，也不能由此推出充分市场供给。", 2: "准公共物品有一项特征表现不充分，与纯公共物品存在程度差异。" },
};

const cognitiveLevels = {
  "market-failure-externality-definition": "condition",
  "market-failure-externality-types": "mapping",
  "market-failure-negative-externality": "application",
  "market-failure-positive-externality": "application",
  "market-failure-externality-full": "synthesis",
  "public-goods-features": "recall",
  "public-private-goods-contrast": "distinction",
  "pure-quasi-public-goods": "distinction",
  "public-goods-free-rider-remedy": "application",
  "public-goods-full": "synthesis",
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留稳定题目身份，改为第三方条件、正负治理配对或公共物品供给链判断，并补齐逐项理由和边界。",
}));

const targetRows = {
  "cs-target-market-failure-externality-definition": { statement: "能由经济活动影响无关第三方识别外部性。", conclusion: "外部性是某种经济活动给与该活动无关的第三方带来的影响。", conditions: ["同时核对第三方和与活动无关两个条件。"], excludes: ["不把交易双方已纳入安排的成本收益直接称为外部性。"] },
  "cs-target-market-failure-externality-types": { statement: "能按无关第三方获得利益或承担成本区分正负外部性。", conclusion: "无关第三方受益是正外部性，承担成本是负外部性。", conditions: ["以第三方实际利损判断正负。"], excludes: ["不按行为者主观动机判断正负。"] },
  "cs-target-market-failure-negative-externality": { statement: "能由未补偿第三方成本识别负外部性及征税方向。", conclusion: "负外部性使外部成本由社会承担，材料列举征税使成本转回行为者。", conditions: ["保留第三方承担成本且未获补偿的条件。"], excludes: ["不计算税额，也不判断现实案件责任。"] },
  "cs-target-market-failure-positive-externality": { statement: "能由第三方受益而行为者未获收益识别正外部性及补贴方向。", conclusion: "正外部性使社会收益高于私人收益，材料列举补贴使收益转回行为者。", conditions: ["保留第三方受益而行为者未获相应收益的条件。"], excludes: ["不计算补贴额，也不把一般社会受益直接归入。"] },
  "cs-target-public-goods-features": { statement: "能识别严格公共物品的非竞争性和非排他性。", conclusion: "严格意义上的公共物品兼具非竞争性和非排他性。", conditions: ["两项特征须同时保留。"], excludes: ["不依据名称或提供主体直接判断具体物品。"] },
  "cs-target-public-private-goods-contrast": { statement: "能对照严格公共物品与私人物品的两项属性。", conclusion: "严格公共物品非竞争、非排他，私人物品竞争、排他。", conditions: ["采用严格公共物品与私人物品的基本对照口径。"], excludes: ["不扩展公共资源和俱乐部物品等其他类型。"] },
  "cs-target-pure-quasi-public-goods": { statement: "能由两项特征是否完整区分纯公共物品与准公共物品。", conclusion: "纯公共物品兼具两项特征，准公共物品一项成立、另一项表现不充分。", conditions: ["按两项特征的完整程度判断。"], excludes: ["不裁定存在争议的具体物品分类。"] },
  "cs-target-public-goods-failure-remedy": { statement: "能还原两项属性、搭便车、市场供给不足到主要由政府提供的链路。", conclusion: "非竞争和非排他可能导致搭便车与市场供给不足，材料指出主要由政府提供公共物品。", conditions: ["保留不购买仍可消费与生产者缺乏供给意愿的链路。"], excludes: ["不讨论政府供给的筹资方式、效率和具体制度。"] },
};

const variationRows = {
  "cs-target-market-failure-externality-definition": { directQuestionIds: ["market-failure-externality-definition"], variationQuestionIds: ["market-failure-externality-full"], processDifference: "直接题核对无关第三方条件，变式题在正负类型和治理配对中继续要求先满足定义，防止只凭利损词作答。" },
  "cs-target-market-failure-externality-types": { directQuestionIds: ["market-failure-externality-types"], variationQuestionIds: ["market-failure-externality-full"], processDifference: "直接题由第三方得利或受损映射正负类型，变式题进一步把类型与补贴、征税方向综合配对。" },
  "cs-target-market-failure-negative-externality": { directQuestionIds: ["market-failure-negative-externality"], variationQuestionIds: ["market-failure-externality-full"], processDifference: "直接题从未补偿第三方成本选择征税方向，变式题与正外部性并列比较，检验成本、类型和治理能否稳定对应。" },
  "cs-target-market-failure-positive-externality": { directQuestionIds: ["market-failure-positive-externality"], variationQuestionIds: ["market-failure-externality-full"], processDifference: "直接题从第三方受益而行为者未获收益选择补贴方向，变式题与负外部性并列比较并保留定义条件。" },
  "cs-target-public-goods-features": { directQuestionIds: ["public-goods-features"], variationQuestionIds: ["public-goods-full"], processDifference: "直接题回忆严格公共物品两项属性，变式题把属性放入搭便车、供给不足和政府提供的完整机制中。" },
  "cs-target-public-private-goods-contrast": { directQuestionIds: ["public-private-goods-contrast"], variationQuestionIds: ["public-goods-full"], processDifference: "直接题对照公共与私人物品属性，变式题只沿公共物品属性继续推导供给机制，检验对照后能否正确应用。" },
  "cs-target-pure-quasi-public-goods": { directQuestionIds: ["pure-quasi-public-goods"], variationQuestionIds: ["public-goods-full"], processDifference: "直接题按两项属性完整程度区分纯与准，变式题要求在综合机制中继续保留二者并非完全相同的边界。" },
  "cs-target-public-goods-failure-remedy": { directQuestionIds: ["public-goods-free-rider-remedy"], variationQuestionIds: ["public-goods-full"], processDifference: "直接题由不购买仍消费和生产者缺乏意愿选择主要供给方向，变式题从两项属性开始还原整条因果链。" },
};

const mnemonicDispositions = [
  { groupId: "market-failure-externality-mechanism", decision: "structural-mnemonic-candidate", resourceId: "market-failure-externality-memory", reason: "先核无关第三方，再按得利或受损区分正负，最后配对补贴或征税，具备稳定判断顺序。" },
  { groupId: "market-failure-public-goods-mechanism", decision: "structural-mnemonic-candidate", resourceId: "public-goods-mechanism-memory", reason: "两项属性、纯准分类、搭便车、市场供给不足和政府提供可以形成可逆的因果与分类结构。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-market-failure-mechanisms" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-market-failure-mechanisms", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "market-failure-externality-mechanism" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "market-failure-public-goods-mechanism" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "market-failure-externality-memory") {
      const phrases = {
        "market-failure-externality-memory-types": "先看无关第三方：得利为正，受损为负",
        "market-failure-externality-memory-remedies": "正补贴，负征税",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "先看第三方，正补负税",
        text: "先看无关第三方：得利为正，受损为负；正补贴，负征税。",
        method: "先核对无关第三方，再判断其得利或受损，最后配对补贴或征税方向",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "按第三方条件、正负分类和治理方向三步还原外部性判断。",
        phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], coverageType: "structural-third-party-sign-remedy", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-failure-mechanisms" })) })),
      };
    }
    if (item.id === "public-goods-mechanism-memory") {
      const phrases = {
        "public-goods-memory-features": "公共两非，私人竞争排他",
        "public-goods-memory-types": "纯品两非全，准品一项弱",
        "public-goods-memory-remedy": "两非可搭车，市场供不够，主要政府供",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "两非—搭车—政府供",
        text: "公共两非，私人竞争排他；纯品两非全，准品一项弱；两非可搭车，市场供不够，主要政府供。",
        method: "先对照两项属性，再区分纯与准，最后沿搭便车、市场供给不足还原主要供给方向",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "用属性对照、纯准分类和供给因果链还原公共物品知识结构。",
        phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], coverageType: "structural-features-types-supply", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-failure-mechanisms" })) })),
      };
    }
    return item;
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "market-failure-externality-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "按第三方条件、正负分类和治理方向三步还原外部性判断。",
  method: "先核对无关第三方，再判断其得利或受损，最后配对补贴或征税方向",
} : item.mnemonicId === "public-goods-mechanism-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "用属性对照、纯准分类和供给因果链还原公共物品知识结构。",
  method: "先对照两项属性，再区分纯与准，最后沿搭便车、市场供给不足还原主要供给方向",
} : item);

const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "market-failure-externality-memory" ? {
  ...item,
  coverageType: "structural-third-party-sign-remedy",
} : item.mnemonicId === "public-goods-mechanism-memory" ? {
  ...item,
  coverageType: "structural-features-types-supply",
} : item);

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-5",
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
    fromVersion: "2026102379",
    toPackVersion: "2026-10-23.80",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["market-failure-externality-memory", "public-goods-mechanism-memory"],
    reason: "Q2 经济第五批重写外部性与公共物品十题；两项记忆资源升级为可逆的条件、分类和因果链结构口诀。",
  }],
};
