"use strict";

// Q2 经济第二批：宏观调控四项目标、财政与货币政策辨析。
// 保留稳定 ID 与题量，改为目标分组、主体工具和基础方向判断；两项记忆资源升级为可逆结构口诀。

const QUESTION_IDS = [
  "macro-growth", "macro-jobs-prices", "macro-balance",
  "policy-fiscal", "policy-monetary", "policy-bond-purchase",
];

const replacementRows = {
  "macro-growth": {
    objective: "识别宏观调控四项目标中的最主要目标",
    prompt: "宏观调控四项目标中，被明确为最主要目标的是哪一项？",
    options: ["促进经济增长", "增加就业机会", "保持国际收支平衡"],
    answer: 0,
    explanation: "相关内容列出四项目标，并明确促进经济增长是宏观调控最主要的目标。",
    boundary: "最主要不等于唯一目标，也不表示其他目标在任何时期都可以忽略。",
  },
  "macro-jobs-prices": {
    objective: "用两增一稳分组还原增长、就业和物价三项目标",
    prompt: "复习宏观调控目标时，“两增一稳”应怎样展开？",
    options: ["增加就业、增加税收、保持汇率稳定", "促进经济增长、增加就业、稳定物价", "增加投资、增加出口、保持利润稳定"],
    answer: 1,
    explanation: "两增分别指促进经济增长、增加就业，一稳指稳定物价。",
    boundary: "这是四项目标的分组线索，不代表某个时期的具体政策组合。",
  },
  "macro-balance": {
    objective: "区分宏观目标中的国际收支平衡与财政收支平衡",
    prompt: "某同学把第四项目标写成“保持财政收支平衡”，应如何纠正？",
    options: ["改为保持国际收支平衡", "改为保持家庭收支平衡", "无需修改，财政收支就是该目标"],
    answer: 0,
    explanation: "四项目标中的平衡专指保持国际收支平衡，不是财政、企业或家庭收支平衡。",
    boundary: "本题只辨目标名称，不判断现实中的国际收支状态或财政预算状况。",
  },
  "policy-fiscal": {
    objective: "由政府预算和税收工具识别财政政策",
    prompt: "政府通过调整国家预算支出和税收影响总供求。按实施主体和工具，这属于哪类政策？",
    options: ["财政政策", "货币政策", "产业政策"],
    answer: 0,
    explanation: "政府运用国家预算、税收等财政手段调节总供求，属于财政政策。",
    boundary: "这里只按主体和工具辨别政策类别，不推断一次措施的全部经济效果。",
  },
  "policy-monetary": {
    objective: "由中央银行和货币供应量工具识别货币政策",
    prompt: "中央银行为调节货币供应量而调整存款准备金率。首先应归入哪类政策？",
    options: ["财政政策", "货币政策", "产业政策"],
    answer: 1,
    explanation: "中央银行控制和调节货币供应量，属于货币政策；存款准备金率是其基础工具之一。",
    boundary: "政策类别由主体和工具识别，本题不判断具体调整幅度及现实传导效果。",
  },
  "policy-bond-purchase": {
    objective: "由央行买入债券和投放货币判断基础扩张方向",
    prompt: "按照教材基础机制，央行在公开市场买入债券并向市场投放基础货币，属于什么方向？",
    options: ["扩张性货币政策", "紧缩性财政政策", "紧缩性货币政策"],
    answer: 0,
    explanation: "央行买入债券会在基础机制中向市场投放货币，因此列入扩张性货币政策。",
    boundary: "这是教材中的基础方向判断，不据此概括某次操作的完整背景和最终效果。",
  },
};

const distractorReasons = {
  "macro-growth": {
    1: "增加就业属于四项目标之一，但正文没有把它表述为最主要目标。",
    2: "保持国际收支平衡也是四项目标之一，但不是正文所称的最主要目标。",
  },
  "macro-jobs-prices": {
    0: "税收和汇率不是“两增一稳”口诀在本节中对应的目标名称。",
    2: "投资、出口和利润不构成正文列出的“两增一稳”三项目标。",
  },
  "macro-balance": {
    1: "家庭收支不属于宏观调控四项目标中“平衡”的指向。",
    2: "财政收支平衡与国际收支平衡含义不同，不能直接互换。",
  },
  "policy-fiscal": {
    1: "货币政策主要由中央银行运用货币工具调节，不以政府预算和税收为识别线索。",
    2: "产业政策关注产业形成和发展，不是题干预算、税收手段对应的政策类别。",
  },
  "policy-monetary": {
    0: "财政政策以政府预算和税收等财政手段为线索，不由央行调节货币供应量。",
    2: "产业政策不是中央银行调整存款准备金率所属的政策类别。",
  },
  "policy-bond-purchase": {
    1: "题干主体是中央银行并使用公开市场业务，不属于财政政策。",
    2: "基础机制中卖出债券对应回笼货币，买入债券对应投放货币。",
  },
};

const cognitiveLevels = {
  "macro-growth": "recall",
  "macro-jobs-prices": "mapping",
  "macro-balance": "distinction",
  "policy-fiscal": "application",
  "policy-monetary": "application",
  "policy-bond-purchase": "application",
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留稳定题目身份，改为目标分组、主体工具或基础方向判断，并补齐逐项理由和适用边界。",
}));

const targetRows = {
  "q0b-target-macro-growth": {
    statement: "能识别促进经济增长是宏观调控四项目标中的最主要目标。",
    conclusion: "四项目标包括促进经济增长、增加就业、稳定物价和保持国际收支平衡，其中促进经济增长是最主要目标。",
    conditions: ["在正文列出的宏观调控四项目标范围内判断目标名称和主次。"],
    excludes: ["不把最主要理解为唯一，也不推断具体时期的政策优先级。"],
  },
  "q0b-target-macro-jobs-prices": {
    statement: "能用两增一稳分组还原经济增长、就业和物价三项目标。",
    conclusion: "两增指促进经济增长、增加就业，一稳指稳定物价。",
    conditions: ["在正文列出的宏观调控四项目标范围内使用分组线索。"],
    excludes: ["不把增加税收、出口或稳定汇率替换进该分组。"],
  },
  "q0b-target-macro-balance": {
    statement: "能区分宏观调控目标中的国际收支平衡与财政收支平衡。",
    conclusion: "四项目标中的平衡专指保持国际收支平衡。",
    conditions: ["先确认题目讨论的是宏观调控四项目标，再识别平衡的限定对象。"],
    excludes: ["不替换成财政、企业或家庭收支平衡，也不判断实时国际收支状态。"],
  },
  "q0b-target-policy-fiscal": {
    statement: "能由政府使用预算、税收等财政手段识别财政政策。",
    conclusion: "政府通过国家预算和税收等财政手段调节总供求，属于财政政策。",
    conditions: ["先辨实施主体，再辨预算、税收等工具。"],
    excludes: ["不把所有政府行为都归入财政政策，也不推断单项措施的全部效果。"],
  },
  "q0b-target-policy-monetary": {
    statement: "能由中央银行调节货币供应量及货币工具识别货币政策。",
    conclusion: "中央银行控制和调节货币供应量，属于货币政策。",
    conditions: ["先辨中央银行主体，再辨准备金率、利率或公开市场业务等货币工具。"],
    excludes: ["不把政府预算和税收混入货币政策，也不判断现实政策立场。"],
  },
  "q0b-target-policy-bond-purchase": {
    statement: "能由央行公开市场买入债券和投放货币判断基础扩张方向。",
    conclusion: "基础机制中，央行买入债券对应投放货币和扩张方向，卖出债券对应回笼货币和紧缩方向。",
    conditions: ["主体为中央银行，工具为公开市场业务，并按教材基础机制判断。"],
    excludes: ["不据此概括某次现实操作的背景、力度、传导和最终效果。"],
  },
};

const variationRows = {
  "q0b-target-macro-growth": {
    directQuestionIds: ["macro-growth"],
    variationQuestionIds: ["macro-jobs-prices"],
    processDifference: "直接题判断四项目标中的主次，变式题改用两增一稳分组，检验能否把增长放回完整目标结构。",
  },
  "q0b-target-macro-jobs-prices": {
    directQuestionIds: ["macro-jobs-prices"],
    variationQuestionIds: ["macro-growth"],
    processDifference: "直接题展开两增一稳，变式题从四项目标中识别增长的主次地位，检验分组和单项目标能否互相还原。",
  },
  "q0b-target-macro-balance": {
    directQuestionIds: ["macro-balance"],
    variationQuestionIds: ["macro-jobs-prices"],
    processDifference: "直接题纠正平衡对象的混淆，变式题先还原另外三项目标，要求在完整四项结构中保留国际收支边界。",
  },
  "q0b-target-policy-fiscal": {
    directQuestionIds: ["policy-fiscal"],
    variationQuestionIds: ["policy-monetary"],
    processDifference: "直接题由政府预算税收识别财政政策，变式题改用央行货币工具，检验能否按主体和工具排除财政政策。",
  },
  "q0b-target-policy-monetary": {
    directQuestionIds: ["policy-monetary"],
    variationQuestionIds: ["policy-fiscal"],
    processDifference: "直接题由央行和准备金率识别货币政策，变式题改用政府预算税收，检验能否稳定区分两类政策。",
  },
  "q0b-target-policy-bond-purchase": {
    directQuestionIds: ["policy-bond-purchase"],
    variationQuestionIds: ["policy-monetary"],
    processDifference: "直接题判断买入债券的扩张方向，变式题先识别央行货币政策类别，形成主体工具到操作方向的两层判断。",
  },
};

const mnemonicDispositions = [
  {
    groupId: "macro-four-goals",
    decision: "structural-mnemonic-candidate",
    resourceId: "macro-four-goals-memory",
    reason: "可用两增、一稳、一平衡的分组恢复四项目标，并单独标记增长最主要与国际收支边界。",
  },
  {
    groupId: "fiscal-monetary",
    decision: "structural-mnemonic-candidate",
    resourceId: "fiscal-monetary-memory",
    reason: "可先按政府与央行分流，再按预算税收或货币工具识别，最后用买债投放、卖债回笼判断基础方向。",
  },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-macro-policy" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-macro-policy", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "macro-four-goals" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "fiscal-monetary" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "macro-four-goals-memory") {
      const phrases = {
        "macro-four-goals-memory-phrase-1": "增长最主要",
        "macro-four-goals-memory-phrase-2": "增长就业两项增，物价一稳",
        "macro-four-goals-memory-phrase-3": "保国际收支平衡",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "两增一稳保国际",
        text: "增长最主要；增长就业两项增，物价一稳，国际收支保平衡。",
        method: "先用两增一稳一平衡恢复四项目标，再核对增长主次和国际收支边界",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "用二加一加一分组还原宏观调控四项目标，并避免把国际收支平衡误写成财政收支平衡。",
        phrases: item.phrases.map((phrase) => ({
          ...phrase,
          phrase: phrases[phrase.id],
          coverageType: "structural-grouping-with-boundary",
          checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-macro-policy" })),
        })),
      };
    }
    if (item.id === "fiscal-monetary-memory") {
      const phrases = {
        "fiscal-monetary-memory-phrase-1": "财归政府：预算税收",
        "fiscal-monetary-memory-phrase-2": "币归央行：调货币量",
        "fiscal-monetary-memory-phrase-3": "买债放、卖债收",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "财归政府、币归央行",
        text: "财归政府，币归央行：预算税收走财政，调币看央行；买债放、卖债收。",
        method: "先分政府与央行，再认预算税收或货币工具，最后用买放卖收判断基础方向",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "用主体、工具、方向三步区分财政政策和货币政策，并还原央行公开市场买卖债券的基础方向。",
        phrases: item.phrases.map((phrase) => ({
          ...phrase,
          phrase: phrases[phrase.id],
          coverageType: "structural-role-tool-direction",
          checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-macro-policy" })),
        })),
      };
    }
    return item;
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "macro-four-goals-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "用二加一加一分组还原宏观调控四项目标，并避免把国际收支平衡误写成财政收支平衡。",
  method: "先用两增一稳一平衡恢复四项目标，再核对增长主次和国际收支边界",
} : item.mnemonicId === "fiscal-monetary-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "用主体、工具、方向三步区分财政政策和货币政策，并还原央行公开市场买卖债券的基础方向。",
  method: "先分政府与央行，再认预算税收或货币工具，最后用买放卖收判断基础方向",
} : item);

const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "macro-four-goals-memory" ? {
  ...item,
  coverageType: "structural-grouping-with-boundary",
} : item.mnemonicId === "fiscal-monetary-memory" ? {
  ...item,
  coverageType: "structural-role-tool-direction",
} : item);

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-2",
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
    fromVersion: "2026102376",
    toPackVersion: "2026-10-23.77",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["macro-four-goals-memory", "fiscal-monetary-memory"],
    reason: "Q2 经济第二批重写宏观目标与财政货币政策六题；两项记忆资源升级为可逆结构口诀。",
  }],
};
