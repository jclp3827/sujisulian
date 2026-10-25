"use strict";

const QUESTION_IDS = [
  "market-feature-legality",
  "market-feature-openness",
  "market-feature-limited-government",
  "market-features-order-full",
  "demand-meaning",
  "demand-price-elasticity",
  "supply-meaning",
  "supply-factors",
  "demand-supply-basic-full",
];

const replacementRows = {
  "market-feature-legality": {
    objective: "由规则约束与违法制裁识别行为法制性",
    prompt: "经营者订立合同、发布广告和参与竞争都须遵守法律；欺诈、垄断等违法行为会受到追究。这体现市场经济的？",
    options: ["行为的法制性", "体系的封闭性", "产权边界的不确定性"],
    answer: 0,
    explanation: "市场行为有法律规范，违法行为承担相应责任，体现行为法制性。",
    boundary: "法制性约束交易和竞争行为，不等于政府代替市场作经营决策。",
  },
  "market-feature-openness": {
    objective: "由要素和商品跨区域流动识别体系开放性",
    prompt: "商品、资本、技术和劳动力能够在不同地区之间流动，地方设置的市场壁垒逐步消除。这体现市场经济的？",
    options: ["活动的竞争性", "体系的开放性", "主体结果的一致性"],
    answer: 1,
    explanation: "要素和商品跨区域流动、减少市场分割，是市场体系开放性的判断线索。",
    boundary: "开放运行仍须遵守准入、交易和监管规则。",
  },
  "market-feature-limited-government": {
    objective: "由维护秩序权利识别政府作用边界",
    prompt: "政府制定规则、维护竞争秩序并保护合法权利，但不直接替企业决定每一笔生产和交易。这体现市场经济的？",
    options: ["政府作用有边界并服务市场秩序", "政府逐项替经营者决定交易", "市场运行不需要公共规则与权利保护"],
    answer: 0,
    explanation: "政府提供规则、秩序和权利保护，同时尊重经营主体决策空间，体现作用边界。",
    boundary: "作用有限不等于政府缺位，也不等于排除宏观调控。",
  },
  "market-features-order-full": {
    objective: "综合复辨行为体系与政府三个对象",
    prompt: "下列市场经济特征与判断线索的对应正确的是？",
    options: [
      "行为法制看守法与责任；体系开放看要素流动；政府边界看维护秩序权利而不替代经营决策",
      "行为法制看跨区流动；体系开放看行政分割；政府边界看逐笔指定企业产量价格和交易对象",
      "行为法制看权属归谁；体系开放看限制商品要素流动；政府边界看放弃规则和权利保护",
    ],
    answer: 0,
    explanation: "正确项分别把行为、体系、政府作用对应法律约束、跨区流动和秩序权利保障。",
    boundary: "法制、开放和政府边界是不同对象，不能相互替换。",
  },
  "demand-meaning": {
    objective: "由消费者愿买且能买识别需求",
    prompt: "某消费者喜欢一款商品，但在当前价格下没有支付能力。经济学意义上，这一愿望能否构成该价格下的有效需求？",
    options: ["不能，需求要求消费者既愿意购买又有购买能力", "能，只要消费者产生购买愿望，不需要考察当前价格下的支付能力", "能，因为需求定义取决于生产者是否愿意出售和能够提供商品"],
    answer: 0,
    explanation: "需求的主体是消费者，并须同时具备购买意愿和购买能力。",
    boundary: "本题只识别需求定义，不使用仍在待核的需求因素分类。",
  },
  "demand-price-elasticity": {
    objective: "由价格变动与需求量反应识别需求价格弹性",
    prompt: "甲商品价格下降 5% 后需求量明显增加，乙商品价格同幅下降后需求量变化较小。比较这两种反应，主要使用的概念是？",
    options: ["需求价格弹性", "供求均衡价格", "企业法人财产权"],
    answer: 0,
    explanation: "需求价格弹性衡量需求量对商品价格变化的反应程度。",
    boundary: "本题只作反应程度比较，不以未给出的数值计算弹性系数。",
  },
  "supply-meaning": {
    objective: "由生产者愿卖且能供识别供给",
    prompt: "某企业愿意以当前价格销售产品，但设备检修使其暂时无法提供产品。此时能否形成现实供给？",
    options: ["能，生产者表达出售意愿后即可形成现实供给，不必考察提供能力", "不能，供给要求生产者既愿意出售又有能力提供", "能，因为供给定义取决于消费者是否愿意购买并具备支付能力"],
    answer: 1,
    explanation: "供给的主体是生产者，并须同时满足愿意出售和能够提供。",
    boundary: "生产计划或出售意愿本身不等于已具备供给能力。",
  },
  "supply-factors": {
    objective: "识别本品价格成本相关品政策预期对供给的影响",
    prompt: "在产品售价和其他条件基本不变时，原材料成本明显上升。一般而言，该产品供给会怎样变化？",
    options: ["利润空间受压，供给倾向减少", "生产成本越高，供给倾向增加", "生产成本变化与供给决策没有关系"],
    answer: 0,
    explanation: "在其他条件基本不变时，成本上升压缩利润空间，生产者通常减少供给。",
    boundary: "这是一般方向判断；现实供给还受本品价格、相关品价格、政策和预期等影响。",
  },
  "demand-supply-basic-full": {
    objective: "综合复辨需求供给主体条件弹性和影响因素",
    prompt: "关于需求和供给，下列说法正确的是？",
    options: [
      "需求看消费者愿买且能买，供给看生产者愿卖且能供；需求价格弹性看需求量对价格的反应，成本会影响供给",
      "需求由生产者出售意愿决定，供给由消费者购买愿望决定；价格弹性只比较企业成本，成本上升推动供给增加",
      "需求有购买愿望即可，供给有生产意愿即可；需求量不受价格变化影响，生产成本也不进入供给判断",
    ],
    answer: 0,
    explanation: "正确项区分需求和供给主体及双重条件，并保留价格弹性和成本影响供给的关系。",
    boundary: "本组不纳入待核需求因素分类，也不预测具体商品的供给数量。",
  },
};

const distractorReasons = {
  "market-feature-legality": { 1: "题干强调守法与违法责任，并非封闭体系。", 2: "权属边界不是本题的行为规则线索。" },
  "market-feature-openness": { 0: "题干重点是跨区域流动和减少壁垒。", 2: "开放性不要求经营结果相同。" },
  "market-feature-limited-government": { 1: "逐项代替经营者决策超出题干所述边界。", 2: "政府仍需提供规则、秩序与权利保护。" },
  "market-features-order-full": { 1: "跨区流动属于开放性，行政分割和逐笔指定也与相应特征相反。", 2: "权属属于产权特征，限制流动和放弃规则也与本组特征相反。" },
  "demand-meaning": { 1: "有效需求还要求购买能力。", 2: "生产者愿意出售对应供给，不决定消费者需求。" },
  "demand-price-elasticity": { 1: "题干比较价格变化后需求量的反应，并未求供需相等时价格。", 2: "法人财产权与需求量价格反应无关。" },
  "supply-meaning": { 0: "供给还要求生产者有能力提供。", 2: "消费者购买意愿对应需求，不决定生产者供给定义。" },
  "supply-factors": { 1: "其他条件不变时，成本上升通常压缩供给意愿。", 2: "生产成本是供给决策的重要影响因素。" },
  "demand-supply-basic-full": { 1: "该项颠倒需求供给主体，并错写弹性与成本方向。", 2: "需求供给都须愿意与能够同时具备，价格和成本也会影响判断。" },
};

const cognitiveLevels = Object.fromEntries(QUESTION_IDS.map((id) => [id, id.endsWith("full") ? "synthesis" : "application"]));
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，以守法流动政府边界和买卖双方条件构成应用判断。" }));
const targetRows = {
  "cs-target-market-feature-legality": { statement: "能由守法义务和违法责任识别行为法制性。", conclusion: "市场行为受法律规范，违法行为承担相应责任。", conditions: ["关注交易竞争行为与规则责任。"], excludes: ["不等于政府代替经营决策。"] },
  "cs-target-market-feature-openness": { statement: "能由商品要素跨区域流动识别体系开放性。", conclusion: "开放市场减少分割，支持商品和要素跨区域流动。", conditions: ["仍须遵守准入交易和监管规则。"], excludes: ["不把开放理解为没有规则。"] },
  "cs-target-market-feature-limited-government": { statement: "能由秩序权利保障和经营自主识别政府作用边界。", conclusion: "政府维护规则秩序和合法权利，不替代经营主体逐项决策。", conditions: ["兼顾公共规则与主体决策空间。"], excludes: ["不等于政府缺位或排除宏观调控。"] },
  "cs-target-demand-meaning": { statement: "能由消费者愿意且有能力购买识别需求。", conclusion: "需求要求消费者在一定时期和价格下愿买且能买。", conditions: ["主体是消费者。"], excludes: ["不使用待核需求因素分类。"] },
  "cs-target-demand-price-elasticity": { statement: "能由价格变化后的需求量反应识别需求价格弹性。", conclusion: "需求价格弹性衡量需求量对价格变化的反应程度。", conditions: ["比较量变与价变的反应。"], excludes: ["不给定数据时不计算系数。"] },
  "cs-target-supply-meaning": { statement: "能由生产者愿意出售且有能力提供识别供给。", conclusion: "供给要求生产者愿卖且能供。", conditions: ["主体是生产者。"], excludes: ["不把出售意愿单独当成现实供给。"] },
  "cs-target-supply-factors": { statement: "能识别本品价格成本相关品政策预期对供给的影响。", conclusion: "其他条件不变时本品价格通常与供给同向，成本通常与供给反向。", conditions: ["按一般方向判断。"], excludes: ["不预测具体商品供给数量。"] },
};
const directMap = {
  "cs-target-market-feature-legality": "market-feature-legality",
  "cs-target-market-feature-openness": "market-feature-openness",
  "cs-target-market-feature-limited-government": "market-feature-limited-government",
  "cs-target-demand-meaning": "demand-meaning",
  "cs-target-demand-price-elasticity": "demand-price-elasticity",
  "cs-target-supply-meaning": "supply-meaning",
  "cs-target-supply-factors": "supply-factors",
};
const featureTarget = (id) => id.startsWith("cs-target-market-feature-");
const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => [targetId, {
  targetId,
  directQuestionIds: [directMap[targetId]],
  variationQuestionIds: [featureTarget(targetId) ? "market-features-order-full" : "demand-supply-basic-full"],
  processDifference: featureTarget(targetId)
    ? "直接题按具体情境识别单一特征，变式题综合复辨行为、体系和政府三个对象。"
    : "直接题识别单一主体条件或影响因素，变式题综合复辨需求供给和价格弹性。",
} ]));
const mnemonicDispositions = [
  { groupId: "market-features-order", decision: "structural-mnemonic-candidate", resourceId: "market-features-order-memory", reason: "用守法、开门、守边三个动作绑定行为、体系和政府对象。" },
  { groupId: "demand-supply-basic-core", decision: "structural-mnemonic-candidate", resourceId: "demand-supply-basic-memory", reason: "以买家厂家分主体，再用愿且能、量随价和五类供给因素形成判断流程。" },
];
const featureQuestions = new Set(["market-feature-legality", "market-feature-openness", "market-feature-limited-government", "market-features-order-full"]);
const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: featureQuestions.has(item.questionId) ? "q2-economics-market-features-order" : "q2-economics-demand-supply-basics" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: featureQuestions.has(item.questionId) ? "q2-economics-market-features-order" : "q2-economics-demand-supply-basics", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "market-features-order" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "demand-supply-basic-core" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "market-features-order-memory") {
      const phrases = {
        "cs-target-market-feature-legality-memory": "行为守法",
        "cs-target-market-feature-openness-memory": "市场开门",
        "cs-target-market-feature-limited-government-memory": "政府守边",
      };
      return { ...item, revision: item.revision + 1, title: "行为守法，市场开门，政府守边", text: "行为守法：交易竞争有规则，违法要担责；市场开门：商品要素跨区域流动；政府守边：维护秩序与权利，不替经营者逐项决策。", method: "用守法、开门、守边三个动作绑定行为、体系和政府对象", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "按三个对象及动作还原市场特征后三项。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-market-features-object-action", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-economics-market-features-order" })) })) };
    }
    if (item.id === "demand-supply-basic-memory") {
      const phrases = {
        "cs-target-demand-meaning-memory": "需求问买家：愿不愿、能不能",
        "cs-target-demand-price-elasticity-memory": "弹性问需求量：价格一变，量变多大",
        "cs-target-supply-meaning-memory": "供给问厂家：愿不愿卖、能不能供",
        "cs-target-supply-factors-memory": "供给再看本价、成本、相关价、政策、预期",
      };
      return { ...item, revision: item.revision + 1, title: "需求问买家，供给问厂家；都要愿且能，弹性看量跟价", text: "需求问买家：愿不愿、能不能；弹性问需求量：价格一变，量变多大；供给问厂家：愿不愿卖、能不能供；供给再看本价、成本、相关价、政策、预期。", method: "先分消费者和生产者，再查愿且能条件、量价反应和供给因素", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "按主体、双重条件、量价反应和供给因素还原需求供给基础。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-demand-supply-decision-flow", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-economics-demand-supply-basics" })) })) };
    }
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "market-features-order-memory" ? { ...item, revision: item.revision + 1, purpose: "按三个对象及动作还原市场特征后三项。", method: "用守法、开门、守边三个动作绑定行为、体系和政府对象" } : item.mnemonicId === "demand-supply-basic-memory" ? { ...item, revision: item.revision + 1, purpose: "按主体、双重条件、量价反应和供给因素还原需求供给基础。", method: "先分消费者和生产者，再查愿且能条件、量价反应和供给因素" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "market-features-order-memory" ? { ...item, coverageType: "structural-market-features-object-action" } : item.mnemonicId === "demand-supply-basic-memory" ? { ...item, coverageType: "structural-demand-supply-decision-flow" } : item);

module.exports = { schemaVersion: 1, revision: 1, batch: "Q2-economics-18", status: "review", QUESTION_IDS, replacementRows, distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions, applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions, applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations, sessionMigrations: [{ fromVersion: "2026102392", toPackVersion: "2026-10-23.93", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["market-features-order-memory", "demand-supply-basic-memory"], reason: "Q2 经济第十八批重写市场特征后三项与需求供给基础九题；两项资源升级为三动作和主体条件结构口诀。" }] };
