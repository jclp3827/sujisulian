"use strict";

const QUESTION_IDS = [
  "market-economy-meaning",
  "value-law",
  "competition-law",
  "supply-demand-law",
  "market-economy-laws-full",
  "market-feature-property",
  "market-feature-equality",
  "market-feature-competition",
  "market-features-foundation-full",
];

const replacementRows = {
  "market-economy-meaning": {
    objective: "由资源协调方式识别市场经济",
    prompt: "某经济运行中，生产者根据价格、供求和竞争信号调整产量，消费者通过购买选择影响资源流向。这主要体现哪种资源配置方式？",
    options: [
      "主要通过市场机制协调资源配置",
      "主要由行政机关逐项确定产量、价格和交易对象",
      "把社会资源配置等同于企业内部排班与库存管理",
    ],
    answer: 0,
    explanation: "价格、供求和竞争信号共同影响生产与消费决策，体现市场机制对资源配置的协调作用。",
    boundary: "市场配置资源并不排除必要的宏观调控和规则约束。",
  },
  "value-law": {
    objective: "区分社会必要劳动时间与个别劳动时间",
    prompt: "甲企业生产同类商品耗时明显高于社会通常生产条件，但希望按自己的高耗时提高商品价值。按价值规律，判断正确的是？",
    options: [
      "商品价值主要由社会必要劳动时间决定，不随单个企业低效率同比增加",
      "商品价值主要由该企业实际耗费的个别劳动时间决定，耗时越久价值越高",
      "商品价值与劳动时间无关，交换也不需要以价值量为基础",
    ],
    answer: 0,
    explanation: "价值规律以社会必要劳动时间决定商品价值量，个别企业耗时偏高不能据此抬高商品价值。",
    boundary: "本题考查价值决定依据，不展开市场价格围绕价值波动的全部机制。",
  },
  "competition-law": {
    objective: "由主体争取经济利益识别竞争规律",
    prompt: "多家经营者为争取顾客，持续改进质量、控制成本并调整服务。这一现象首先体现市场经济中的？",
    options: [
      "供求规律对有效需求与供给关系的调节",
      "市场主体围绕经济利益展开竞争的规律",
      "消费水平上升后难以迅速下降的棘轮效应",
    ],
    answer: 1,
    explanation: "题干核心是多个市场主体为争取顾客和经济利益展开竞争。",
    boundary: "竞争规律说明竞争关系，不代表具体竞争行为都符合法律规范。",
  },
  "supply-demand-law": {
    objective: "识别有效需求与价格调节的供求关系",
    prompt: "某商品短期供不应求，价格上升后生产者扩大供给，部分消费者减少购买，供求逐步调整。该过程主要说明？",
    options: [
      "价值规律只看经营者自己的劳动耗时",
      "竞争规律要求各经营者采用相同技术、成本结构和定价方式",
      "供给与有支付能力的需求通过价格变化相互调节",
    ],
    answer: 2,
    explanation: "题干同时出现供给、有效需求和价格变化，体现供求双方经价格信号趋向调整。",
    boundary: "供求趋向平衡是动态过程，现实价格还受成本、预期等因素影响。",
  },
  "market-economy-laws-full": {
    objective: "综合区分市场经济含义与三条基本规律",
    prompt: "关于市场经济及其基本规律，下列对应正确的是？",
    options: [
      "市场机制协调资源；价值看社会必要劳动时间和等价交换；竞争看主体争利；供求看供给与有效需求的调节",
      "市场配置等同企业排班；价值由个别企业实际耗时决定；竞争排除经济利益；供求不受价格和支付能力影响",
      "市场经济依赖逐项行政指令配置社会资源；价值不受劳动时间影响；竞争与供求分别孤立运行且互不影响",
    ],
    answer: 0,
    explanation: "正确项依次保留资源配置方式、价值决定与交换、主体竞争和供求价格调节四组关系。",
    boundary: "三条规律在市场运行中相互联系，题目只检验基础概念与识别线索。",
  },
  "market-feature-property": {
    objective: "由权属边界识别产权确定性",
    prompt: "公司章程和登记资料清楚区分出资者权利与公司法人财产权，使经营责任和收益归属有明确边界。这体现市场经济的？",
    options: [
      "产权的确定性",
      "体系的开放性",
      "政府干预范围的有限性",
    ],
    answer: 0,
    explanation: "权利归属、财产权边界和责任收益能够明确识别，体现产权确定性。",
    boundary: "本题识别权属边界，不评价某一具体企业制度安排。",
  },
  "market-feature-equality": {
    objective: "由自愿协商识别主体平等性",
    prompt: "两家企业地位对等，自愿决定是否交易，并共同协商价格、交付和违约责任。这体现市场经济的？",
    options: [
      "活动的竞争性",
      "主体的平等性",
      "行为的法制性",
    ],
    answer: 1,
    explanation: "地位对等、自愿交易和共同议定条件，是主体平等性的直接线索。",
    boundary: "主体平等指市场地位和交易自主，不表示经营能力或结果相同。",
  },
  "market-feature-competition": {
    objective: "由优胜劣汰识别活动竞争性",
    prompt: "同一行业的经营者通过技术、质量和服务争取客户，经营不善者可能退出市场。这体现市场经济的？",
    options: [
      "产权的确定性",
      "主体的平等性",
      "活动的竞争性",
    ],
    answer: 2,
    explanation: "经营者争取客户并发生生存、发展或退出，体现市场活动的竞争性。",
    boundary: "竞争应在法律和市场秩序规则内进行。",
  },
  "market-features-foundation-full": {
    objective: "综合复辨产权主体和活动三个对象",
    prompt: "下列市场经济特征与判断线索的对应正确的是？",
    options: [
      "产权确定看权属边界；主体平等看自愿协商；活动竞争看争取客户与优胜劣汰",
      "产权确定看要素跨区流动；主体平等看行政命令；活动竞争看经营者退出市场受到禁止",
      "产权确定看价格涨跌；主体平等看经营结果一致；活动竞争看交易双方地位从属",
    ],
    answer: 0,
    explanation: "正确项把产权、主体、活动三个对象分别对应权属明确、自愿协商和竞争选择。",
    boundary: "三个对象不能互换；平等不等于结果一致，竞争也须受规则约束。",
  },
};

const distractorReasons = {
  "market-economy-meaning": { 1: "题干由价格、供求和竞争信号协调，并非逐项行政指令。", 2: "社会资源配置范围超出企业内部管理。" },
  "value-law": { 1: "个别企业低效率增加的耗时不能直接决定商品价值。", 2: "价值规律保留劳动时间与价值量的关系。" },
  "competition-law": { 0: "题干重点是多主体争取顾客，并非供给与有效需求的数量关系。", 2: "棘轮效应描述消费惯性，不是经营者争夺利益。" },
  "supply-demand-law": { 0: "价值规律依据社会必要劳动时间，不以个别耗时为准。", 1: "竞争不要求生产方式相同。" },
  "market-economy-laws-full": { 1: "该项错配市场配置范围、价值依据、竞争动因和供求信号。", 2: "市场经济并非逐项指令配置，三条规律也会共同作用。" },
  "market-feature-property": { 1: "开放性关注要素和商品跨区域流动。", 2: "题干直接描述权利归属与财产权边界。" },
  "market-feature-equality": { 0: "题干没有强调经营者争夺客户或优胜劣汰。", 2: "题干核心是对等自愿协商，而非违法制裁与规则执行。" },
  "market-feature-competition": { 0: "题干没有讨论财产权属边界。", 1: "题干重点是经营者争取客户和退出压力。" },
  "market-features-foundation-full": { 1: "要素流动属于开放性，行政命令和禁止退出也与相应特征不符。", 2: "价格涨跌、结果一致和地位从属均不能对应这三项特征。" },
};

const cognitiveLevels = Object.fromEntries(QUESTION_IDS.map((id) => [id, id.endsWith("full") ? "synthesis" : "application"]));
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，用资源协调、经营交易和企业竞争情境形成可运用的判断链。" }));

const targetRows = {
  "cs-target-market-economy-meaning": { statement: "能由价格供求竞争信号协调资源流向识别市场经济。", conclusion: "市场经济主要通过市场机制协调资源配置。", conditions: ["以价格、供求和竞争信号作为判断线索。"], excludes: ["不排除必要宏观调控和规则约束。"] },
  "cs-target-value-law": { statement: "能区分社会必要劳动时间与个别劳动时间。", conclusion: "商品价值量由社会必要劳动时间决定，交换以价值量为基础。", conditions: ["同类商品的社会通常生产条件是判断基准。"], excludes: ["不把单个企业低效率耗时直接计入价值。"] },
  "cs-target-competition-law": { statement: "能由多主体争取顾客和经济利益识别竞争规律。", conclusion: "市场主体围绕经济利益展开竞争。", conditions: ["存在多个主体和利益争夺。"], excludes: ["不代表具体竞争行为都合法。"] },
  "cs-target-supply-demand-law": { statement: "能由有效需求供给和价格变化识别供求规律。", conclusion: "供给与有支付能力的需求通过价格变化相互调节。", conditions: ["需求须具备支付能力。"], excludes: ["不把趋向平衡理解为静止不变。"] },
  "cs-target-market-feature-property": { statement: "能由权属责任收益边界识别产权确定性。", conclusion: "财产权利归属和责任收益边界明确。", conditions: ["能区分出资者权利与法人财产权。"], excludes: ["不评价具体制度优劣。"] },
  "cs-target-market-feature-equality": { statement: "能由地位对等自愿协商识别主体平等性。", conclusion: "市场主体地位平等、自愿交易并共同议定条件。", conditions: ["关注市场地位与交易自主。"], excludes: ["不等于经营能力和结果相同。"] },
  "cs-target-market-feature-competition": { statement: "能由争取客户与优胜劣汰识别活动竞争性。", conclusion: "市场主体在规则内竞争并发生生存发展或退出。", conditions: ["存在争取交易机会的竞争过程。"], excludes: ["不支持违法竞争行为。"] },
};

const directMap = {
  "cs-target-market-economy-meaning": "market-economy-meaning",
  "cs-target-value-law": "value-law",
  "cs-target-competition-law": "competition-law",
  "cs-target-supply-demand-law": "supply-demand-law",
  "cs-target-market-feature-property": "market-feature-property",
  "cs-target-market-feature-equality": "market-feature-equality",
  "cs-target-market-feature-competition": "market-feature-competition",
};
const lawsTarget = (id) => ["cs-target-market-economy-meaning", "cs-target-value-law", "cs-target-competition-law", "cs-target-supply-demand-law"].includes(id);
const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => [targetId, {
  targetId,
  directQuestionIds: [directMap[targetId]],
  variationQuestionIds: [lawsTarget(targetId) ? "market-economy-laws-full" : "market-features-foundation-full"],
  processDifference: lawsTarget(targetId)
    ? "直接题按单一关系识别，变式题综合复辨资源配置与价值、竞争、供求三规律。"
    : "直接题按具体情境识别单一特征，变式题综合复辨产权、主体和活动三个对象。",
}]));

const mnemonicDispositions = [
  { groupId: "market-economy-meaning-laws", decision: "structural-mnemonic-candidate", resourceId: "market-economy-laws-memory", reason: "以资源配置为入口，再按决定依据、竞争对象和有效需求还原三规律。" },
  { groupId: "market-features-foundation", decision: "structural-mnemonic-candidate", resourceId: "market-features-foundation-memory", reason: "用押韵短句把产权、主体、活动三个对象与判断动作绑定。" },
];

const lawsQuestions = new Set(["market-economy-meaning", "value-law", "competition-law", "supply-demand-law", "market-economy-laws-full"]);
const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: lawsQuestions.has(item.questionId) ? "q2-economics-market-laws" : "q2-economics-market-features-foundation" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: lawsQuestions.has(item.questionId) ? "q2-economics-market-laws" : "q2-economics-market-features-foundation", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "market-economy-meaning-laws" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "market-features-foundation" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "market-economy-laws-memory") {
      const phrases = {
        "market-laws-memory-meaning": "市场配资源",
        "market-laws-memory-value": "价值看社时，交换按价值",
        "market-laws-memory-competition": "主体争利益",
        "market-laws-memory-supply": "供求问付得起，价格来调节",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "市场配资源，价值看社时；主体争利益，供求问付得起",
        text: "市场经济主要靠市场配资源；价值规律看社会必要劳动时间，交换以价值量为基础；竞争规律看主体争利益；供求规律先问需求付不付得起，再看价格调节供需。",
        method: "先认资源配置方式，再用决定依据、竞争对象和有效需求区分三规律",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "按四个判断问题还原市场经济含义与三条基本规律。",
        phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], coverageType: "structural-market-economy-four-relations", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-laws" })) })),
      };
    }
    if (item.id === "market-features-foundation-memory") {
      const phrases = {
        "cs-target-market-feature-property-memory": "权要明",
        "cs-target-market-feature-equality-memory": "人要平",
        "cs-target-market-feature-competition-memory": "市场竞争凭本领",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "权要明，人要平，市场竞争凭本领",
        text: "权要明：产权归属、责任收益有边界；人要平：主体对等、自愿协商；市场竞争凭本领：靠技术质量服务争取客户，在规则内优胜劣汰。",
        method: "用明、平、凭本领的押韵动作绑定产权、主体和活动三个对象",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "用可复述短句还原市场特征前三项及判断线索。",
        phrases: item.phrases.map((phrase) => ({ ...phrase, phrase: phrases[phrase.id], coverageType: "structural-market-features-object-action", checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-features-foundation" })) })),
      };
    }
    return item;
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "market-economy-laws-memory" ? { ...item, revision: item.revision + 1, purpose: "按四个判断问题还原市场经济含义与三条基本规律。", method: "先认资源配置方式，再用决定依据、竞争对象和有效需求区分三规律" } : item.mnemonicId === "market-features-foundation-memory" ? { ...item, revision: item.revision + 1, purpose: "用可复述短句还原市场特征前三项及判断线索。", method: "用明、平、凭本领的押韵动作绑定产权、主体和活动三个对象" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "market-economy-laws-memory" ? { ...item, coverageType: "structural-market-economy-four-relations" } : item.mnemonicId === "market-features-foundation-memory" ? { ...item, coverageType: "structural-market-features-object-action" } : item);

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-17",
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
  sessionMigrations: [{ fromVersion: "2026102391", toPackVersion: "2026-10-23.92", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["market-economy-laws-memory", "market-features-foundation-memory"], reason: "Q2 经济第十七批重写市场经济三规律与市场特征前三项九题；两项资源升级为关系判断和押韵动作结构口诀。" }],
};
