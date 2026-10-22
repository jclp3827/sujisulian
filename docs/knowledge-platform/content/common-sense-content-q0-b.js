"use strict";

// Q0-B closes the 33 legacy S4 relationship/specification gaps and records the
// first mnemonic-form dispositions. Everything remains review content.

const QUESTION_ROWS = {
  "school-lao": ["mapping", { 1: "墨子是墨家代表人物，不是道家创始人。", 2: "韩非是法家代表人物，不是道家创始人。" }],
  "school-mo": ["mapping", { 0: "法家在本组对应法、术、势，不对应兼爱、非攻。", 2: "兼爱、非攻是墨家主张，不是本组所列名家主张。" }],
  "school-fa": ["mapping", { 0: "道家在本组对应老子与《道德经》。", 1: "墨家在本组对应兼爱、非攻。" }],
  "light-shadow": ["mapping", { 1: "折射解释光跨介质传播时方向改变，不是影子形成的主要规律。", 2: "声音的反射属于声学现象，不能解释光形成影子。" }],
  "light-reflection": ["mapping", { 0: "折射用于解释跨介质观察偏折，平静水面倒影主要是反射。", 2: "倒影是光学成像，物体没有因此沉入水下。" }],
  "light-refraction": ["application", { 0: "看起来弯折是光学现象，不能据此判断筷子实际发生形变。", 1: "光从水和空气之间传播会改变方向，不能只套用同种均匀介质中的直线传播。" }],
  "heat-conduction": ["mapping", { 0: "热对流依靠流体的宏观运动和掺混传热。", 2: "升华是物态变化，不是这里所问的传热方式。" }],
  "heat-convection": ["mapping", { 0: "热辐射以电磁辐射传热，不以冷热流体掺混为特征。", 1: "热传导不以流体整体运动和掺混为必要特征。" }],
  "heat-radiation": ["mapping", { 1: "热对流依赖流体运动，题干给出的是电磁辐射形式。", 2: "热膨胀是受热后的尺寸变化，不是传热方式。" }],
  "substance-pure": ["distinction", { 0: "混合物由两种或多种物质混合形成。", 1: "纯净物还包括化合物，不能把纯净物都判成单质。" }],
  "substance-simple": ["condition", { 1: "混合物不是纯净物，不满足单质定义。", 2: "单质既可以是金属，也可以是非金属。" }],
  "substance-compound": ["mapping", { 0: "二氧化碳含碳、氧两种元素，不是金属单质。", 2: "纯二氧化碳是一种物质，按该层级不是混合物。" }],
  "demand-conditions": ["condition", { 0: "只有购买意愿、没有购买能力，不构成经济学定义中的需求。", 2: "觉得商品好看不能替代购买意愿和购买能力两个条件。" }],
  "supply-conditions": ["distinction", { 0: "供给考察生产者提供出售，不是消费者购买。", 1: "只想收藏没有提供出售的行为，不构成供给。" }],
  "demand-wish": ["condition", { 1: "只有想买而没有购买能力，仍缺少需求定义的必要条件。", 2: "需求还受一定时期和价格水平约束，不能脱离条件判断。" }],
  "macro-growth": ["mapping", { 1: "稳定物价不等于保证每件商品都涨价。", 2: "宏观调控不以让所有企业利润相同为目标。" }],
  "macro-jobs-prices": ["mapping", { 0: "本组的另一增是增加就业，一稳是稳定物价。", 2: "增加库存和稳定利润不属于题干所指的四项目标。" }],
  "macro-balance": ["distinction", { 0: "家庭收支不是宏观调控四项目标中的国际收支。", 1: "企业收支不是宏观调控四项目标中的国际收支。" }],
  "policy-fiscal": ["mapping", { 0: "货币政策主要通过中央银行和货币工具调节。", 2: "人口政策不是预算、税收等财政手段的政策分类。" }],
  "policy-monetary": ["mapping", { 0: "企业分红属于企业行为，不是中央银行的货币政策。", 1: "政府采购属于财政工具，不是题干所指的央行货币供应调节。" }],
  "policy-bond-purchase": ["application", { 1: "公开市场卖出债券才对应基础机制中的紧缩方向。", 2: "央行买入债券在基础机制中向市场投放流动性，不是减少货币供应。" }],
  "capacity-under-eight": ["condition", { 1: "不满八周岁的未成年人不按八周岁以上未成年人的一般规则处理。", 2: "仅凭七周岁不能认定为完全民事行为能力人。" }],
  "capacity-eight-plus": ["condition", { 0: "题干说明已满八周岁且能辨认行为，不属于仅按不满八周岁判断的情形。", 2: "未满十八周岁且不满足劳动收入例外，不能视为完全民事行为能力人。" }],
  "capacity-labor": ["application", { 0: "十六周岁以上并以劳动收入为主要生活来源时，不按无民事行为能力处理。", 1: "民法对十六周岁以上且以劳动收入为主要生活来源者设有例外。" }],
  "inherit-first": ["recall", { 0: "兄弟姐妹、祖父母、外祖父母属于一般第二顺序。", 2: "朋友、同事、邻居不在法定第一顺序的列举中。" }],
  "inherit-second": ["recall", { 0: "配偶、子女、父母属于一般第一顺序。", 1: "法定继承按顺序处理，不是所有亲属同时继承。" }],
  "inherit-inlaw": ["condition", { 1: "满足丧偶并尽主要赡养义务的条件时，依法作为第一顺序继承人。", 2: "题干已经给出法律规定所要求的特别条件，不能一概否定继承资格。" }],
  "civil-equality": ["mapping", { 0: "公平原则关注合理确定各方权利义务，不等同于法律地位平等。", 1: "自愿原则关注意思自治，不等同于法律地位平等。" }],
  "civil-voluntary": ["mapping", { 1: "平等原则处理民事主体法律地位，不是题干的意思自治表述。", 2: "绿色原则关注资源节约和生态环境保护，不是题干的意思自治表述。" }],
  "civil-fairness": ["mapping", { 0: "自愿原则关注按照自己的意思建立民事法律关系。", 2: "绿色原则关注资源节约和生态环境保护。" }],
  "constitution-first": ["recall", { 1: "国家机构位于宪法正文第三章。", 2: "我国现行宪法正文没有以附则作为第一章。" }],
  "constitution-second": ["recall", { 0: "第一章是总纲。", 2: "第四章规定国旗、国歌、国徽和首都。" }],
  "constitution-fourth": ["recall", { 0: "国家机构位于第三章，第四章不以选举制度为完整主题。", 1: "第四章还包括国歌和国徽，不能只保留国旗与首都。" }],
};

const GROUP_CONDITIONS = {
  "schools-pairing": "在老子与道家、墨家兼爱非攻、法家法术势三组对应关系内判断。",
  "light-phenomena": "根据同种均匀介质传播、反射和跨介质折射的基本条件判断。",
  "heat-mechanisms": "根据传导、对流、辐射各自的传递机制判断。",
  "substance-classification": "先按物质种类区分纯净物与混合物，再在纯净物内按元素种类区分单质与化合物。",
  "demand-supply-roles": "结合一定时期和价格条件，区分消费者购买与生产者提供出售。",
  "macro-four-goals": "在促进经济增长、增加就业、稳定物价和保持国际收支平衡四项目标内判断。",
  "fiscal-monetary": "先辨政策主体和工具，再按基础机制判断政策方向。",
  "minor-capacity": "同时保留年龄、辨认能力和劳动收入主要生活来源等条件。",
  "inheritance-order": "按法定继承的一般顺序及丧偶姻亲尽主要赡养义务的特别规则判断。",
  "civil-principles-compare": "按民法基本原则的直接规范含义判断，不用单个关键词替代具体案件分析。",
  "constitution-chapters": "只判断宪法序言与正文四章的章节归属。",
};

const PRIORITY_FORM_RISK_IDS = [
  "si-base-units-memory", "market-failure-four-factors-memory", "resource-allocation-market-memory",
  "market-definition-elements-memory", "socialist-market-framework-memory", "pre-qin-economy-memory",
  "western-han-memory", "qin-han-economy-memory", "yuan-memory", "song-yuan-economy-memory",
  "ming-memory", "qing-memory", "opium-war-opening-memory", "taiping-memory",
  "self-strengthening-memory", "sino-japanese-memory", "xinhai-process-memory", "cpc-first-memory",
  "national-cooperation-memory", "anti-later-memory", "new-china-consolidation-memory",
  "new-china-diplomacy-memory", "refraction-scattering-memory",
];

const LEGACY_STRUCTURE_IDS = [
  "schools-pairing-memory", "light-phenomena-memory", "heat-mechanisms-memory",
  "substance-classification-memory", "demand-supply-roles-memory", "macro-four-goals-memory",
  "fiscal-monetary-memory", "inheritance-order-memory", "constitution-chapters-memory",
];

const mnemonicDispositions = [...PRIORITY_FORM_RISK_IDS, ...LEGACY_STRUCTURE_IDS].map((mnemonicId) => ({
  mnemonicId,
  decision: "downgrade-to-study-outline",
  productLabel: "速记提纲",
  status: "review",
  reason: PRIORITY_FORM_RISK_IDS.includes(mnemonicId)
    ? "现有表达主要依靠关键词压缩、缩写或过长串联，尚无自然联想和用户记忆证据；先按速记提纲展示。"
    : "已补齐目标和自测结构，但现有表达仍以知识原词排列为主；在记忆试用证明有效前按速记提纲展示。",
}));

function uniqueRefs(questions) {
  const map = new Map();
  questions.flatMap((question) => question.refs || []).forEach((ref) => {
    const key = `${ref.pointId}:${ref.tabId}:${(ref.sourceUnitIds || []).join(",")}`;
    if (!map.has(key)) map.set(key, { pointId: ref.pointId, tabId: ref.tabId, sourceUnitIds: [...ref.sourceUnitIds] });
  });
  return [...map.values()];
}

function cognitiveLevelFor(specification) {
  if (specification.cognitiveLevel) return specification.cognitiveLevel;
  const purpose = String(specification.checkPurpose || "");
  if (/(scenario|application|mechanism-chain|effect|problem|methods|calculation|remedy)/.test(purpose)) return "application";
  if (/(condition|boundary|priority|rate|limits)/.test(purpose)) return "condition";
  if (/(contrast|distinction|classification|pair|roles|type|object|difference)/.test(purpose)) return "distinction";
  if (/(full|combined|cross|composition|integrated)/.test(purpose)) return "synthesis";
  if (/(mapping|meaning|definition|identification|relation)/.test(purpose)) return "mapping";
  return "recall";
}

function build(questions, mnemonics, existingMnemonicSpecifications) {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
  const missingQuestions = Object.keys(QUESTION_ROWS).map((id) => byId[id]);
  if (missingQuestions.some((question) => !question)) throw new Error("Q0-B 目标题目不存在");
  const groupQuestions = Object.fromEntries([...new Set(missingQuestions.map((question) => question.group))]
    .map((groupId) => [groupId, missingQuestions.filter((question) => question.group === groupId)]));
  const targets = missingQuestions.map((question) => ({
    id: `q0b-target-${question.id}`,
    revision: 1,
    status: "review",
    scope: question.scope,
    groupId: question.group,
    statement: `能${question.objective}。`,
    conclusion: question.explanation,
    conditions: [GROUP_CONDITIONS[question.group]],
    excludes: [question.boundary],
    refs: uniqueRefs(groupQuestions[question.group]),
    ...(question.verification ? { verification: question.verification } : {}),
  }));
  const targetByQuestion = Object.fromEntries(missingQuestions.map((question) => [question.id, `q0b-target-${question.id}`]));
  const relationFor = (question) => {
    const peers = groupQuestions[question.group];
    return {
      questionId: question.id,
      primaryTargetIds: [targetByQuestion[question.id]],
      supportingTargetIds: peers.filter((peer) => peer.id !== question.id).map((peer) => targetByQuestion[peer.id]),
      checkPurpose: `q0b-${QUESTION_ROWS[question.id][0]}`,
    };
  };
  const questionTargetRelations = missingQuestions.map(relationFor);
  const questionSpecifications = missingQuestions.map((question) => ({
    ...relationFor(question),
    cognitiveLevel: QUESTION_ROWS[question.id][0],
    distractorReasons: QUESTION_ROWS[question.id][1],
  }));
  const variationDecisions = missingQuestions.map((question) => ({
    targetId: targetByQuestion[question.id],
    directQuestionIds: [question.id],
    variationQuestionIds: groupQuestions[question.group].filter((peer) => peer.id !== question.id).map((peer) => peer.id),
  }));
  const comparisonRowTargetRelations = [
    ["minor-capacity-comparison", "capacity-under-eight"],
    ["minor-capacity-comparison", "capacity-eight-plus"],
    ["minor-capacity-comparison", "capacity-labor"],
    ["civil-principles-comparison", "civil-equality"],
    ["civil-principles-comparison", "civil-voluntary"],
    ["civil-principles-comparison", "civil-fairness"],
  ].map(([comparisonId, questionId], rowIndex) => ({
    comparisonId,
    rowIndex: rowIndex % 3,
    targetIds: [targetByQuestion[questionId]],
  }));

  const dispositionIds = new Set(mnemonicDispositions.map((item) => item.mnemonicId));
  const mappedMnemonics = mnemonics.map((mnemonic) => {
    const revision = dispositionIds.has(mnemonic.id) ? mnemonic.revision + 1 : mnemonic.revision;
    if (!LEGACY_STRUCTURE_IDS.includes(mnemonic.id)) {
      return dispositionIds.has(mnemonic.id)
        ? { ...mnemonic, revision, learningForm: "study-outline", formLabel: "速记提纲" }
        : mnemonic;
    }
    const phrases = mnemonic.phrases.map((phrase, index) => {
      const phraseId = phrase.id || `${mnemonic.id}-phrase-${index + 1}`;
      const targetIds = [...new Set(phrase.questionIds.flatMap((questionId) => {
        const relation = questionTargetRelations.find((item) => item.questionId === questionId);
        return relation ? relation.primaryTargetIds : [];
      }))];
      return { ...phrase, id: phraseId, targetIds, coverageType: "study-outline-recall", conditionRefs: [],
        checks: phrase.questionIds.map((questionId) => ({ questionId,
          checkPurpose: questionTargetRelations.find((item) => item.questionId === questionId).checkPurpose,
          reviewTarget: "phrase", reviewAnchorId: phraseId })) };
    });
    return { ...mnemonic, revision, learningForm: "study-outline", formLabel: "速记提纲",
      purpose: mnemonic.purpose || `用分组提纲回忆${mnemonic.coverage}`,
      conditions: mnemonic.conditions?.length ? mnemonic.conditions : [GROUP_CONDITIONS[byId[mnemonic.questionIds[0]].group]],
      phrases };
  });
  const mappedById = Object.fromEntries(mappedMnemonics.map((mnemonic) => [mnemonic.id, mnemonic]));
  const mnemonicPhraseTargetRelations = LEGACY_STRUCTURE_IDS.flatMap((mnemonicId) => mappedById[mnemonicId].phrases.map((phrase, phraseIndex) => ({
    mnemonicId, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
    coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
  })));
  const legacyMnemonicSpecifications = LEGACY_STRUCTURE_IDS.map((mnemonicId) => {
    const mnemonic = mappedById[mnemonicId];
    return { mnemonicId, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method,
      conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id),
      selfTestQuestionIds: mnemonic.questionIds };
  });
  const legacyIds = new Set(LEGACY_STRUCTURE_IDS);
  const mnemonicSpecifications = existingMnemonicSpecifications.map((specification) => ({
    ...specification,
    revision: mappedById[specification.mnemonicId]?.revision || specification.revision,
  })).filter((specification) => !legacyIds.has(specification.mnemonicId)).concat(legacyMnemonicSpecifications);

  return {
    questions: questions.map((question) => ({ ...question, assessmentType: "learning-card",
      examBasis: { originType: "self-authored", displayLabel: "自编学习题" } })),
    targets,
    questionTargetRelations,
    newQuestionSpecifications: questionSpecifications,
    variationDecisions,
    comparisonRowTargetRelations,
    mnemonics: mappedMnemonics,
    mnemonicSpecifications,
    mnemonicPhraseTargetRelations,
  };
}

function enrichQuestionSpecifications(specifications) {
  return specifications.map((specification) => ({ ...specification, cognitiveLevel: cognitiveLevelFor(specification) }));
}

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q0-B",
  QUESTION_ROWS,
  PRIORITY_FORM_RISK_IDS,
  LEGACY_STRUCTURE_IDS,
  mnemonicDispositions,
  cognitiveLevelFor,
  enrichQuestionSpecifications,
  build,
};
