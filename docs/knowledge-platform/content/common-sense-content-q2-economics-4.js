"use strict";

// Q2 经济第四批：市场失灵四因素总览、垄断导致市场失灵。
// 保留稳定 ID 与题量；总览退回完整术语提纲，垄断主题升级为可逆的机制链口诀。

const { ref } = require("./learning-authoring");

const overviewRef = ref("market-failure-factors", "market-failure-overview", "cs-23-30-p13-market-failure-factors-overview-list");
const monopolyRef = ref("market-failure-factors", "market-failure-monopoly", "cs-23-30-p13-market-failure-monopoly-list");
const externalityRef = ref("market-failure-factors", "market-failure-externality", "cs-23-30-p13-market-failure-externality-list");
const publicGoodsRef = ref("market-failure-factors", "market-failure-public-goods", "cs-23-30-p14-market-failure-public-goods-list");
const informationRef = ref("market-failure-factors", "market-failure-information", "cs-23-30-p14-market-failure-information-asymmetry-list");

const QUESTION_IDS = [
  "market-failure-factor-monopoly",
  "market-failure-factor-externality",
  "market-failure-factor-public-goods",
  "market-failure-factor-information",
  "market-failure-four-factors-full",
  "market-failure-monopoly-definition",
  "market-failure-monopoly-chain",
  "market-failure-monopoly-remedy",
  "market-failure-monopoly-full",
];

const replacementRows = {
  "market-failure-factor-monopoly": {
    objective: "由一个或少数大企业控制生产销售识别垄断因素",
    prompt: "某行业由一个大企业或少数几个大企业独占或联合控制产品生产和销售。这首先对应哪类市场失灵因素？",
    options: ["垄断", "公共物品", "信息不对称"],
    answer: 0,
    explanation: "一个大企业或少数几个大企业独占或联合控制相应产品的生产和销售，首先对应垄断因素。",
    boundary: "这里先完成四因素分类；垄断的作用链和治理方式在独立主题中继续学习。",
    refs: [overviewRef, monopolyRef],
  },
  "market-failure-factor-externality": {
    objective: "由经济活动影响无关第三方识别外部性因素",
    prompt: "某项经济活动给与该活动无关的第三方带来影响。这首先对应哪类市场失灵因素？",
    options: ["公共物品", "外部性", "垄断"],
    answer: 1,
    explanation: "经济活动给与该活动无关的第三方带来影响，首先对应外部性因素。",
    boundary: "本题只做因素分类；正外部性、负外部性及治理方式属于后续机制学习。",
    refs: [overviewRef, externalityRef],
  },
  "market-failure-factor-public-goods": {
    objective: "由非竞争性和非排他性识别公共物品因素",
    prompt: "某物品供公众使用，严格意义上同时具有非竞争性和非排他性。这首先对应哪类市场失灵因素？",
    options: ["公共物品", "信息不对称", "外部性"],
    answer: 0,
    explanation: "严格意义上的公共物品具有非竞争性和非排他性，属于市场失灵四因素之一。",
    boundary: "本题只定位因素名称，不展开纯公共物品、准公共物品、搭便车和政府供给。",
    refs: [overviewRef, publicGoodsRef],
  },
  "market-failure-factor-information": {
    objective: "由交易者掌握信息不同识别信息不对称因素",
    prompt: "交易中的个人掌握的信息不同，一方难以充分了解另一方。这首先对应哪类市场失灵因素？",
    options: ["生产销售垄断", "信息不对称", "公共物品供给"],
    answer: 1,
    explanation: "交易中的个人拥有的信息不同，首先对应信息不对称因素。",
    boundary: "本题只做因素分类，不展开逆向选择、道德风险和信息调控。",
    refs: [overviewRef, informationRef],
  },
  "market-failure-four-factors-full": {
    objective: "完整复辨市场失灵四类因素",
    prompt: "下列哪组完整列出四类主要市场失灵因素？",
    options: ["垄断、外部性、公共物品、信息不对称", "通货膨胀、失业、财政赤字、贸易逆差", "需求、供给、价格、市场竞争"],
    answer: 0,
    explanation: "四类主要因素是垄断、外部性、公共物品和信息不对称。",
    boundary: "完整名单只建立入口框架，不能替代四类因素各自条件和作用机制的学习。",
    refs: [overviewRef],
  },
  "market-failure-monopoly-definition": {
    objective: "识别垄断所要求的独占或联合控制条件",
    prompt: "下列哪种情形最符合垄断的核心含义？",
    options: ["一个或少数大企业独占或联合控制产品生产和销售", "许多企业自由进入市场并以同质产品开展充分竞争", "交易双方掌握的信息不同，一方更了解商品质量"],
    answer: 0,
    explanation: "垄断强调一个大企业或少数几个大企业对相应产品生产和销售的独占或联合控制。",
    boundary: "企业规模较大或商品价格较高，都不能单独替代生产和销售的控制条件。",
    refs: [monopolyRef],
  },
  "market-failure-monopoly-chain": {
    objective: "还原垄断控制供给到市场机制失灵的作用链",
    prompt: "哪条链路正确说明垄断可能导致市场机制失灵？",
    options: ["增加企业数量→充分竞争→信息更完整→机制失灵", "控制供给→调节产量→影响价格→市场机制失灵", "提高劳动效率→降低单位成本→消费者选择增加→机制失灵"],
    answer: 1,
    explanation: "垄断企业控制产品供给，通过调节产量在相当大程度上影响价格，进而使市场机制不能正常作用。",
    boundary: "链路起点是对供给的控制，不能看到高价就跳过控制供给和调节产量两个环节。",
    refs: [monopolyRef],
  },
  "market-failure-monopoly-remedy": {
    objective: "识别限制垄断的两项治理示例",
    prompt: "针对垄断，材料列举的治理方式是哪组？",
    options: ["扩大货币发行并统一行业工资", "取消市场交易并禁止企业经营", "限制垄断价格并制定反垄断法"],
    answer: 2,
    explanation: "材料列举政府限制垄断价格和制定反垄断法两种方式。",
    boundary: "这里识别治理示例，不判断具体案件是否构成垄断，也不处理现行法条适用。",
    refs: [monopolyRef],
  },
  "market-failure-monopoly-full": {
    objective: "综合判断垄断条件、作用链和治理示例",
    prompt: "关于垄断与市场失灵，下列哪项表述正确？",
    options: ["企业规模较大可替代生产销售控制条件，并据此推断市场失灵", "控供调量可影响价格；治理示例有价格限制和反垄断立法", "价格上涨发生在作用链起点，随后才出现供给控制和产量调节"],
    answer: 1,
    explanation: "垄断作用链从控制供给、调节产量到影响价格，治理示例包括限制垄断价格和制定反垄断法。",
    boundary: "规模大或价格上涨都不是充分条件，应回到生产销售控制及完整作用链判断。",
    refs: [monopolyRef],
  },
};

const distractorReasons = {
  "market-failure-factor-monopoly": { 1: "公共物品强调公共使用以及非竞争性、非排他性，不符合生产销售被控制的线索。", 2: "信息不对称强调交易者拥有的信息不同，不符合生产销售被一个或少数企业控制。" },
  "market-failure-factor-externality": { 0: "公共物品的核心线索是非竞争性和非排他性，不是对无关第三方的影响。", 2: "垄断强调一个或少数企业控制生产销售，不是经济活动对无关第三方的影响。" },
  "market-failure-factor-public-goods": { 1: "信息不对称强调交易者掌握的信息不同，不对应非竞争性和非排他性。", 2: "外部性强调经济活动对无关第三方的影响，不对应题干两个物品属性。" },
  "market-failure-factor-information": { 0: "垄断强调生产销售的独占或联合控制，不是交易者之间的信息差异。", 2: "公共物品强调非竞争性和非排他性，不是交易者掌握的信息不同。" },
  "market-failure-four-factors-full": { 1: "该组属于常见宏观经济现象或指标，没有完整列出四类市场失灵因素。", 2: "该组描述市场运行的一般要素，没有完整列出四类市场失灵因素。" },
  "market-failure-monopoly-definition": { 1: "众多企业自由进入且提供同质产品，属于竞争条件，不符合独占或联合控制。", 2: "交易者信息不同对应信息不对称，不等于企业控制生产和销售。" },
  "market-failure-monopoly-chain": { 0: "企业增加和充分竞争与垄断控制供给的起点相反，不能形成该作用链。", 2: "提高效率、降低成本和增加选择不构成垄断导致市场失灵的作用链。" },
  "market-failure-monopoly-remedy": { 0: "扩大货币发行和统一工资不是材料列举的限制垄断方式。", 1: "材料没有提出取消市场交易或禁止企业经营，而是限制垄断行为。" },
  "market-failure-monopoly-full": { 0: "企业规模大不能替代对生产销售的独占或联合控制，也不能直接推出市场失灵。", 2: "价格上涨可能有多种原因，不能跳过生产销售控制及调节产量等环节。" },
};

const cognitiveLevels = {
  "market-failure-factor-monopoly": "application",
  "market-failure-factor-externality": "application",
  "market-failure-factor-public-goods": "application",
  "market-failure-factor-information": "application",
  "market-failure-four-factors-full": "recall",
  "market-failure-monopoly-definition": "condition",
  "market-failure-monopoly-chain": "mapping",
  "market-failure-monopoly-remedy": "recall",
  "market-failure-monopoly-full": "synthesis",
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留稳定题目身份，改为考点线索分类、条件判断或因果链还原，并补齐逐项理由和适用边界。",
}));

const targetRows = {
  "cs-target-market-failure-monopoly-factor": {
    statement: "能由一个或少数大企业控制生产销售识别垄断这一市场失灵因素。",
    conclusion: "垄断属于四类主要市场失灵因素，其分类线索是生产销售被一个或少数大企业独占或联合控制。",
    conditions: ["先完成四因素分类，再进入垄断的具体作用机制。"],
    excludes: ["不以企业规模大或价格高直接认定垄断。"],
    refs: [overviewRef, monopolyRef],
  },
  "cs-target-market-failure-externality-factor": {
    statement: "能由经济活动影响无关第三方识别外部性这一市场失灵因素。",
    conclusion: "外部性属于四类主要市场失灵因素，基本线索是经济活动给无关第三方带来影响。",
    conditions: ["分类时保留无关第三方这一条件。"],
    excludes: ["不在本目标展开正负分类、征税和补贴。"],
    refs: [overviewRef, externalityRef],
  },
  "cs-target-market-failure-public-goods-factor": {
    statement: "能由非竞争性和非排他性识别公共物品这一市场失灵因素。",
    conclusion: "公共物品属于四类主要市场失灵因素，严格意义上的公共物品兼具非竞争性和非排他性。",
    conditions: ["分类时同时核对公共使用和两项物品属性。"],
    excludes: ["不在本目标展开纯公共物品、准公共物品、搭便车和供给方式。"],
    refs: [overviewRef, publicGoodsRef],
  },
  "cs-target-market-failure-information-factor": {
    statement: "能由交易者掌握的信息不同识别信息不对称这一市场失灵因素。",
    conclusion: "信息不对称属于四类主要市场失灵因素，指交易中的个人拥有的信息不同。",
    conditions: ["在交易语境中识别信息差异。"],
    excludes: ["不在本目标展开逆向选择、道德风险和信息调控。"],
    refs: [overviewRef, informationRef],
  },
  "cs-target-market-failure-monopoly-definition": {
    statement: "能识别垄断所要求的一个或少数大企业独占或联合控制生产销售。",
    conclusion: "垄断强调一个大企业或少数几个大企业对相应产品生产和销售的独占或联合控制。",
    conditions: ["判断核心是生产和销售的控制条件。"],
    excludes: ["不以企业规模大或价格高作为单独充分条件。"],
    refs: [monopolyRef],
  },
  "cs-target-market-failure-monopoly-chain": {
    statement: "能还原控制供给、调节产量、影响价格到市场机制失灵的作用链。",
    conclusion: "垄断企业控制供给并调节产量，从而影响价格，使市场机制不能正常作用。",
    conditions: ["按控制供给、调节产量、影响价格的顺序还原。"],
    excludes: ["不以单一高价跳过控制供给和调节产量两个环节。"],
    refs: [monopolyRef],
  },
  "cs-target-market-failure-monopoly-remedy": {
    statement: "能识别限制垄断价格和制定反垄断法两项治理示例。",
    conclusion: "限制垄断的治理示例包括限制垄断价格和制定反垄断法。",
    conditions: ["将两项内容理解为材料列举的治理方式。"],
    excludes: ["不判断具体案件，也不处理现行法条适用。"],
    refs: [monopolyRef],
  },
};

const variationRows = {
  "cs-target-market-failure-monopoly-factor": { directQuestionIds: ["market-failure-factor-monopoly"], variationQuestionIds: ["market-failure-four-factors-full"], processDifference: "直接题由生产销售控制线索识别垄断，变式题把垄断放回四因素完整清单，检验线索和总框架能否双向还原。" },
  "cs-target-market-failure-externality-factor": { directQuestionIds: ["market-failure-factor-externality"], variationQuestionIds: ["market-failure-four-factors-full"], processDifference: "直接题由无关第三方影响识别外部性，变式题要求在四因素总框架中稳定定位，避免只记首字。" },
  "cs-target-market-failure-public-goods-factor": { directQuestionIds: ["market-failure-factor-public-goods"], variationQuestionIds: ["market-failure-four-factors-full"], processDifference: "直接题由非竞争性和非排他性识别公共物品，变式题检验能否把规范名称还原到四因素清单。" },
  "cs-target-market-failure-information-factor": { directQuestionIds: ["market-failure-factor-information"], variationQuestionIds: ["market-failure-four-factors-full"], processDifference: "直接题由交易者信息不同识别信息不对称，变式题检验能否将规范术语放回完整四因素框架。" },
  "cs-target-market-failure-monopoly-definition": { directQuestionIds: ["market-failure-monopoly-definition"], variationQuestionIds: ["market-failure-monopoly-full"], processDifference: "直接题核对独占或联合控制条件，变式题把定义条件嵌入作用链和治理综合判断，防止仅凭规模或价格作答。" },
  "cs-target-market-failure-monopoly-chain": { directQuestionIds: ["market-failure-monopoly-chain"], variationQuestionIds: ["market-failure-monopoly-full"], processDifference: "直接题排序控制供给到市场失灵的因果链，变式题将作用链与定义边界、治理方式放在同一判断中。" },
  "cs-target-market-failure-monopoly-remedy": { directQuestionIds: ["market-failure-monopoly-remedy"], variationQuestionIds: ["market-failure-monopoly-full"], processDifference: "直接题识别两项治理示例，变式题要求在控制供给的完整机制后选出匹配治理，避免脱离问题类型死记。" },
};

const mnemonicDispositions = [
  { groupId: "market-failure-four-factors", decision: "study-outline-existing", resourceId: "market-failure-four-factors-memory", reason: "四项之间只有并列清单关系；首字压缩不能帮助还原机制，改为完整术语提纲并诚实标注适用范围。" },
  { groupId: "market-failure-monopoly-mechanism", decision: "structural-mnemonic-candidate", resourceId: "market-failure-monopoly-memory", reason: "控制供给、调节产量、影响价格到市场失灵具备稳定因果顺序，并可自然接续两项治理示例。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-market-failure" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-market-failure", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "market-failure-four-factors" ? { ...item, mnemonicDecision: "study-outline", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "market-failure-monopoly-mechanism" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "market-failure-four-factors-memory") {
      const phrases = {
        "market-failure-memory-monopoly": "垄断",
        "market-failure-memory-externality": "外部性",
        "market-failure-memory-public-goods": "公共物品",
        "market-failure-memory-information": "信息不对称",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "市场失灵四因素清单",
        text: "垄断、外部性；公共物品、信息不对称。",
        method: "两组完整术语对照：垄断与外部性，公共物品与信息不对称",
        learningForm: "study-outline",
        formLabel: "速记提纲",
        purpose: "用完整规范术语建立四因素入口清单，避免用单字或简称替代概念理解。",
        phrases: item.phrases.map((phrase) => ({
          ...phrase,
          phrase: phrases[phrase.id],
          coverageType: "complete-term-list",
          checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-failure" })),
        })),
      };
    }
    if (item.id === "market-failure-monopoly-memory") {
      const phrases = {
        "market-failure-monopoly-memory-chain": "控供、调量、影响价，市场机制失灵",
        "market-failure-monopoly-memory-remedy": "限价、立法来约束",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "控供—调量—影响价",
        text: "控供、调量、影响价，市场机制失灵；限价、立法来约束。",
        method: "先还原控制供给到影响价格的作用链，再接限制价格和反垄断立法两项治理示例",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "按控制供给、调节产量、影响价格、市场失灵的因果顺序还原垄断机制，并接续治理示例。",
        phrases: item.phrases.map((phrase) => ({
          ...phrase,
          phrase: phrases[phrase.id],
          coverageType: "structural-control-chain-and-remedy",
          checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-failure" })),
        })),
      };
    }
    return item;
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "market-failure-four-factors-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "用完整规范术语建立四因素入口清单，避免用单字或简称替代概念理解。",
  method: "两组完整术语对照：垄断与外部性，公共物品与信息不对称",
} : item.mnemonicId === "market-failure-monopoly-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "按控制供给、调节产量、影响价格、市场失灵的因果顺序还原垄断机制，并接续治理示例。",
  method: "先还原控制供给到影响价格的作用链，再接限制价格和反垄断立法两项治理示例",
} : item);

const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "market-failure-four-factors-memory" ? {
  ...item,
  coverageType: "complete-term-list",
} : item.mnemonicId === "market-failure-monopoly-memory" ? {
  ...item,
  coverageType: "structural-control-chain-and-remedy",
} : item);

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-4",
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
    fromVersion: "2026102378",
    toPackVersion: "2026-10-23.79",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["market-failure-four-factors-memory", "market-failure-monopoly-memory"],
    reason: "Q2 经济第四批重写市场失灵四因素总览和垄断机制九题；四因素改为完整术语提纲，垄断升级为可逆结构口诀。",
  }],
};
