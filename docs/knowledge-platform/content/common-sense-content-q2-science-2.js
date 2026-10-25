"use strict";

// Q2 科技领域第二批：传热三种方式、物质分类两步法。
// 保留稳定 ID 和题量，用生活/实验情境重写六题，并把两项记忆资源改造成可逆的结构口诀。

const QUESTION_IDS = [
  "heat-conduction", "heat-convection", "heat-radiation",
  "substance-pure", "substance-simple", "substance-compound",
];

const replacementRows = {
  "heat-conduction": {
    objective: "由金属内部相邻部分传热识别热传导",
    prompt: "金属勺一端浸在热汤中，过一会儿露在外面的勺柄也变热，勺子没有整体移动。主要是哪种传热方式？",
    options: ["金属内部相邻部分传递热量", "冷热流体整体运动传递热量", "电磁辐射跨越空间传递热量"],
    answer: 0,
    explanation: "热量沿金属由高温部分向低温部分传递，且勺子没有整体移动，主要属于热传导。",
    boundary: "实际场景可能同时存在多种传热方式，本题只判断勺柄变热这一主要过程。",
  },
  "heat-convection": {
    objective: "由冷热流体循环运动识别热对流",
    prompt: "锅中水受热后，下部热水上升、上部冷水下沉，持续循环使整锅水升温。主要是哪种传热方式？",
    options: ["材料内部相邻部分传递热量", "冷热水整体循环传递热量", "电磁辐射跨越空间传递热量"],
    answer: 1,
    explanation: "冷热水发生整体循环运动并相互掺混，主要通过热对流传递热量。",
    boundary: "对流要求流体发生宏观运动；锅体内部的传导不是本题所问的水中主要过程。",
  },
  "heat-radiation": {
    objective: "由真空仍能传热识别热辐射",
    prompt: "太阳与地球之间大部分是真空，太阳仍能把能量传到地球。主要依靠哪种传热方式？",
    options: ["相邻物质直接接触的热传导", "流体整体运动形成的热对流", "电磁辐射跨越空间的热辐射"],
    answer: 2,
    explanation: "真空中没有可供传导或对流的物质，太阳能主要以电磁辐射形式传到地球。",
    boundary: "热辐射不要求两物体直接接触，也不要求存在流体介质。",
  },
  "substance-pure": {
    objective: "按物质种类区分纯净物与混合物",
    prompt: "蒸馏水只含H₂O一种物质，空气含氮气、氧气等多种物质。哪项分类正确？",
    options: ["蒸馏水是纯净物，空气是混合物", "蒸馏水是混合物，空气是纯净物", "蒸馏水与空气均按混合物处理"],
    answer: 0,
    explanation: "判断纯净物和混合物先看物质种类：蒸馏水只含一种物质，空气由多种物质组成。",
    boundary: "本层分类看物质种类，不以所含元素种类多少直接判断纯净或混合。",
  },
  "substance-simple": {
    objective: "在纯净物内由同种元素组成识别单质",
    prompt: "一瓶纯氧气只含O₂一种物质，且只由氧元素组成。在纯净物内部进一步分类，应归为？",
    options: ["由多种元素组成的化合物", "由同种元素组成的单质", "由多种物质组成的混合物"],
    answer: 1,
    explanation: "纯氧气先满足纯净物条件，又只由氧这一种元素组成，因此属于单质。",
    boundary: "单质可以是金属或非金属；只含一种元素但混有多种物质时仍不是单质。",
  },
  "substance-compound": {
    objective: "在纯净物内由多种元素组成识别化合物",
    prompt: "一瓶纯二氧化碳只含CO₂一种物质，但其中含碳、氧两种元素。在纯净物内部进一步分类，应归为？",
    options: ["由同种元素组成的单质", "由多种物质组成的混合物", "由多种元素组成的化合物"],
    answer: 2,
    explanation: "纯二氧化碳只含一种物质，属于纯净物；它由碳、氧两种元素组成，因此属于化合物。",
    boundary: "本题只判断纯净物内部的单质与化合物，不继续区分有机物和无机物。",
  },
};

const distractorReasons = {
  "heat-conduction": { 1: "题干没有冷热流体的整体循环运动，不能把勺柄变热判为对流。", 2: "辐射可跨空间传热，但金属勺内部由热端向冷端传递主要是传导。" },
  "heat-convection": { 0: "题干强调冷热水整体循环，不是只描述材料相邻部分之间的传递。", 2: "题干的主要线索是水的上升、下沉和循环，不是电磁辐射。" },
  "heat-radiation": { 0: "传导需要物质内部或直接接触的相邻传递，不能跨越大段真空。", 1: "对流依赖流体的整体运动，真空中没有流体可形成对流。" },
  "substance-pure": { 1: "蒸馏水只含H₂O一种物质，应为纯净物；空气含多种气体，应为混合物。", 2: "蒸馏水只含一种物质，不能与空气一起判为混合物。" },
  "substance-simple": { 0: "氧气只含氧一种元素，不满足化合物由多种元素组成的条件。", 2: "题干已限定纯氧气只含O₂一种物质，不是由多种物质组成的混合物。" },
  "substance-compound": { 0: "二氧化碳含碳、氧两种元素，不满足单质只由同种元素组成的条件。", 1: "纯二氧化碳只含CO₂一种物质，不属于由多种物质组成的混合物。" },
};

const cognitiveLevels = {
  "heat-conduction": "application",
  "heat-convection": "application",
  "heat-radiation": "application",
  "substance-pure": "distinction",
  "substance-simple": "condition",
  "substance-compound": "application",
};

const targetRows = {
  "q0b-target-heat-conduction": {
    statement: "能从固体内部由热端向冷端传递、物体不发生整体运动的情境识别热传导。",
    conclusion: "热传导使热量由高温部分向低温部分传递，不要求物质整体移动。",
    conditions: ["材料内部存在温度差，或不同物体直接接触并发生相邻传热。"],
    excludes: ["不把传导限定为只发生在固体。", "复杂情境可能同时存在对流和辐射。"],
  },
  "q0b-target-heat-convection": {
    statement: "能从冷热流体上升、下沉、循环或掺混的情境识别热对流。",
    conclusion: "热对流依靠流体的宏观运动和掺混传递热量。",
    conditions: ["传热介质是能够发生整体运动的液体或气体。"],
    excludes: ["不把任何发生在液体或气体中的传热都直接判为对流。"],
  },
  "q0b-target-heat-radiation": {
    statement: "能从真空或无需直接接触的传热情境识别热辐射。",
    conclusion: "热辐射以电磁辐射形式传递能量，可以跨越真空。",
    conditions: ["题目以电磁辐射或无物质介质仍能传热为主要线索。"],
    excludes: ["不要求物体之间直接接触或存在流体。"],
  },
  "q0b-target-substance-pure": {
    statement: "能先按物质种类数区分纯净物与混合物。",
    conclusion: "只含一种物质的是纯净物；由两种或多种物质组成的是混合物。",
    conditions: ["先判断样品实际含有几种物质，再进入下一层分类。"],
    excludes: ["不按元素种类数直接判断纯净物与混合物。", "纯净物不等同于单质。"],
  },
  "q0b-target-substance-simple": {
    statement: "能在纯净物内部，根据只由同种元素组成识别单质。",
    conclusion: "单质是由同种元素组成的纯净物。",
    conditions: ["先确认样品只含一种物质，再判断元素种类。"],
    excludes: ["不能省略纯净物条件。", "单质既可以是金属，也可以是非金属。"],
  },
  "q0b-target-substance-compound": {
    statement: "能在纯净物内部，根据由两种或两种以上元素组成识别化合物。",
    conclusion: "化合物是由两种或两种以上元素组成的纯净物。",
    conditions: ["先确认样品只含一种物质，再判断元素种类。"],
    excludes: ["含多种元素不等于含多种物质。", "本目标不继续区分有机物与无机物。"],
  },
};

const variationRows = {
  "q0b-target-heat-conduction": {
    directQuestionIds: ["heat-conduction"], variationQuestionIds: ["heat-convection", "heat-radiation"],
    processDifference: "直接题由金属勺内部传热识别传导；组内变式改用流体循环和真空传热，检验能否排除对流、辐射。",
  },
  "q0b-target-heat-convection": {
    directQuestionIds: ["heat-convection"], variationQuestionIds: ["heat-conduction", "heat-radiation"],
    processDifference: "直接题由冷热水循环识别对流；组内变式改用固体内部传递和真空传热，检验流体宏观运动边界。",
  },
  "q0b-target-heat-radiation": {
    directQuestionIds: ["heat-radiation"], variationQuestionIds: ["heat-conduction", "heat-convection"],
    processDifference: "直接题由太阳能跨越真空识别辐射；组内变式分别要求抓住相邻传递和流体循环机制。",
  },
  "q0b-target-substance-pure": {
    directQuestionIds: ["substance-pure"], variationQuestionIds: ["substance-simple", "substance-compound"],
    processDifference: "直接题比较蒸馏水与空气的物质种类；组内变式进入纯净物内部，再按元素种类完成二级分类。",
  },
  "q0b-target-substance-simple": {
    directQuestionIds: ["substance-simple"], variationQuestionIds: ["substance-pure", "substance-compound"],
    processDifference: "直接题用纯氧气同时核对纯净物和同种元素两个条件；组内变式分别检验第一层分类与多元素化合物。",
  },
  "q0b-target-substance-compound": {
    directQuestionIds: ["substance-compound"], variationQuestionIds: ["substance-pure", "substance-simple"],
    processDifference: "直接题用纯二氧化碳区分一种物质与多种元素；组内变式分别检验纯混层级和同种元素单质。",
  },
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留稳定 ID 和考点，改为需要识别传递机制或执行两步分类的具体情境，并补齐逐项干扰理由。",
}));

const mnemonicDispositions = [
  {
    groupId: "heat-mechanisms",
    decision: "structural-mnemonic-candidate",
    resourceId: "heat-mechanisms-memory",
    reason: "用“热量搬家”形成统一画面，再以挨着递、流体搬、电磁送三条路线反解传导、对流、辐射；具备结构和联想价值，但尚无用户记忆试验证据。",
  },
  {
    groupId: "substance-classification",
    decision: "structural-mnemonic-candidate",
    resourceId: "substance-classification-memory",
    reason: "按“先数物质、再数元素”的决策顺序，用一种/多种的对偶压缩完整分类树；能够双向还原，但尚无用户记忆试验证据。",
  },
];

function applyQuestions(questions) {
  return questions.map((question) => replacementRows[question.id]
    ? { ...question, ...replacementRows[question.id], revision: question.revision + 1 }
    : question);
}

function applyTargets(targets) {
  return targets.map((target) => targetRows[target.id]
    ? { ...target, ...targetRows[target.id], revision: target.revision + 1 }
    : target);
}

function applyQuestionTargetRelations(relations) {
  return relations.map((relation) => QUESTION_IDS.includes(relation.questionId)
    ? { ...relation, checkPurpose: "q2-application" }
    : relation);
}

function applyQuestionSpecifications(specifications) {
  return specifications.map((specification) => QUESTION_IDS.includes(specification.questionId)
    ? {
      ...specification,
      checkPurpose: "q2-application",
      cognitiveLevel: cognitiveLevels[specification.questionId],
      distractorReasons: distractorReasons[specification.questionId],
    }
    : specification);
}

function applyVariationDecisions(decisions) {
  return decisions.map((decision) => variationRows[decision.targetId]
    ? { targetId: decision.targetId, ...variationRows[decision.targetId] }
    : decision);
}

function applyGroups(groups) {
  return groups.map((group) => {
    const disposition = mnemonicDispositions.find((item) => item.groupId === group.id);
    return disposition ? { ...group, mnemonicDecision: "structural-mnemonic", mnemonicReason: disposition.reason } : group;
  });
}

function applyMnemonics(mnemonics) {
  return mnemonics.map((mnemonic) => {
    if (mnemonic.id === "heat-mechanisms-memory") return {
      ...mnemonic,
      revision: mnemonic.revision + 1,
      title: "热量搬家三条路",
      text: "热量搬家看路线：挨着递是传导，流体搬是对流，电磁送是辐射。",
      method: "情境联想＋平行对应",
      coverage: "传导、对流、辐射三种传热方式的主要机制和辨认线索。",
      excludes: ["复杂场景中多种方式的定量占比", "物态变化与保温装置的完整分析"],
      learningForm: "structural-mnemonic",
      formLabel: "结构口诀",
      purpose: "用“热量搬家”的统一画面，把相邻传递、流体运动和电磁辐射三条路线映射到三种传热方式。",
      conditions: ["口诀用于识别主要传热机制；复杂情境可能同时存在多种传热方式。"],
      phrases: mnemonic.phrases.map((phrase, index) => ({
        ...phrase,
        phrase: ["挨着递是传导", "流体搬是对流", "电磁送是辐射"][index],
        meaning: [
          "材料内部相邻部分或直接接触物体之间由高温向低温传递热量。",
          "液体或气体通过整体运动和掺混传递热量。",
          "热量以电磁辐射形式传递，不要求直接接触或存在流体。",
        ][index],
        coverageType: "structural-correspondence-with-boundary",
        checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-application" })),
      })),
    };
    if (mnemonic.id === "substance-classification-memory") return {
      ...mnemonic,
      revision: mnemonic.revision + 1,
      title: "物质分类两步诀",
      text: "先数物质：一种纯，多种混；纯里数元素：一种单，多种化。",
      method: "两步决策＋对偶压缩",
      coverage: "纯净物/混合物与单质/化合物的两层分类顺序和完整条件。",
      excludes: ["有机物与无机物的分类", "同素异形体和具体混合物的复杂判断"],
      learningForm: "structural-mnemonic",
      formLabel: "结构口诀",
      purpose: "用先数物质、再数元素的固定顺序和一种/多种的对偶关系还原两层分类树。",
      conditions: ["第二步只在已经确认属于纯净物后进行，不能省略纯净物前提。"],
      phrases: mnemonic.phrases.map((phrase, index) => ({
        ...phrase,
        phrase: ["先数物质：一种纯，多种混", "纯里数元素：一种单", "纯里数元素：多种化"][index],
        meaning: [
          "只含一种物质的是纯净物；含两种或多种物质的是混合物。",
          "在纯净物内部，只由同种元素组成的是单质。",
          "在纯净物内部，由两种或两种以上元素组成的是化合物。",
        ][index],
        coverageType: index === 0 ? "structural-decision-step" : "structural-decision-step-with-prerequisite",
        checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-application" })),
      })),
    };
    return mnemonic;
  });
}

function applyMnemonicSpecifications(specifications) {
  return specifications.map((specification) => {
    if (specification.mnemonicId === "heat-mechanisms-memory") return {
      ...specification,
      revision: specification.revision + 1,
      purpose: "用“热量搬家”的统一画面，把相邻传递、流体运动和电磁辐射三条路线映射到三种传热方式。",
      method: "情境联想＋平行对应",
    };
    if (specification.mnemonicId === "substance-classification-memory") return {
      ...specification,
      revision: specification.revision + 1,
      purpose: "用先数物质、再数元素的固定顺序和一种/多种的对偶关系还原两层分类树。",
      method: "两步决策＋对偶压缩",
    };
    return specification;
  });
}

function applyMnemonicPhraseTargetRelations(relations) {
  return relations.map((relation) => {
    if (relation.mnemonicId === "heat-mechanisms-memory") return {
      ...relation,
      coverageType: "structural-correspondence-with-boundary",
    };
    if (relation.mnemonicId === "substance-classification-memory") return {
      ...relation,
      coverageType: relation.phraseIndex === 0 ? "structural-decision-step" : "structural-decision-step-with-prerequisite",
    };
    return relation;
  });
}

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-science-2",
  status: "review",
  QUESTION_IDS,
  replacementRows,
  distractorReasons,
  cognitiveLevels,
  targetRows,
  variationRows,
  questionDispositions,
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
    fromVersion: "2026102269",
    toPackVersion: "2026-10-22.70",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["heat-mechanisms-memory", "substance-classification-memory"],
    reason: "Q2 科技第二批重写传热与物质分类六题，并把两项提纲升级为可逆结构口诀；受影响会话按迁移规则重建。",
  }],
};
