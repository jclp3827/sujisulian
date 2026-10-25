"use strict";

// Q2 经济第三批：四类市场结构与三级价格歧视。
// 保留稳定 ID 与题量，把分类表述改为条件识别和短情境应用；两项记忆资源升级为可逆结构口诀。

const QUESTION_IDS = [
  "market-structure-category-set",
  "market-perfect-competition-core",
  "market-monopolistic-competition-core",
  "market-oligopoly-core",
  "market-monopoly-core",
  "price-discrimination-definition",
  "price-discrimination-first-degree",
  "price-discrimination-second-degree",
  "price-discrimination-third-degree",
  "price-discrimination-three-levels",
];

const replacementRows = {
  "market-structure-category-set": {
    objective: "识别按厂商数量和竞争条件划分的四类市场结构",
    prompt: "按厂商数量、产品差别和进入条件划分市场结构时，哪组属于同一分类口径？",
    options: ["完全竞争、垄断竞争、寡头垄断、完全垄断", "商品市场、劳动力市场、金融市场、技术市场", "国内市场、国际市场、现货市场、期货市场"],
    answer: 0,
    explanation: "这一口径把市场结构分为完全竞争、垄断竞争、寡头垄断和完全垄断四类。",
    boundary: "分类名称只能先建立总框架；识别具体结构还要继续核对厂商数量、产品差别、进入条件和相互依存。",
  },
  "market-perfect-competition-core": {
    objective: "由众多参与者、产品同质和自由进入等条件识别完全竞争",
    prompt: "某市场买卖者众多，产品同质，资源可自由流动，信息充分，单个参与者不能左右价格。该市场最符合哪类结构？",
    options: ["垄断竞争市场", "完全竞争市场", "寡头垄断市场"],
    answer: 1,
    explanation: "众多买卖者、产品同质、资源自由流动和信息充分共同指向完全竞争，单个参与者只是价格接受者。",
    boundary: "现实市场通常只是接近这些条件，不能因某个农产品案例就断言其完全满足全部条件。",
  },
  "market-monopolistic-competition-core": {
    objective: "由企业众多、产品有差别且容易进入识别垄断竞争",
    prompt: "某行业企业众多，产品有差别但可以相互替代，进入退出相对容易。该行业最符合哪类结构？",
    options: ["垄断竞争市场", "买卖者众多、产品同质的市场", "寡头垄断市场"],
    answer: 0,
    explanation: "企业众多、同类产品存在差别但仍可替代、进入退出较容易，是垄断竞争的核心识别条件。",
    boundary: "本题按市场存在条件判断，不把广告、包装等具体竞争手段当成唯一依据。",
  },
  "market-oligopoly-core": {
    objective: "由少数厂商、进入较难和决策相互依存识别寡头垄断",
    prompt: "某行业只有少数几家厂商，新企业进入较难，每家调整产量或价格时都要考虑对手反应。该行业最符合哪类结构？",
    options: ["买卖者众多、产品同质的市场", "垄断竞争市场", "寡头垄断市场"],
    answer: 2,
    explanation: "少数厂商控制市场、进入较难且决策相互依存，共同指向寡头垄断。",
    boundary: "寡头产品可以同质，也可以有差别，不能仅凭产品差别排除寡头垄断。",
  },
  "market-monopoly-core": {
    objective: "由唯一卖者、无近似替代品和进入障碍识别完全垄断",
    prompt: "整个行业只有一个卖者，产品没有十分近似的替代品，并存在明显进入障碍。该行业最符合哪类结构？",
    options: ["完全垄断市场", "寡头垄断市场", "买卖者众多、产品同质的市场"],
    answer: 0,
    explanation: "唯一卖者、无十分近似替代品并存在进入障碍，共同构成完全垄断的核心识别条件。",
    boundary: "唯一卖者与少数卖者含义不同；价格歧视是另一主题，不能用来替代市场结构判断。",
  },
  "price-discrimination-definition": {
    objective: "保留同等级同质量前提识别价格歧视",
    prompt: "在其他条件不变时，哪种做法符合价格歧视的定义前提？",
    options: ["同等级同质量服务，向不同接受者采用不同价格", "服务内容和质量提高后，统一采用更高收费标准", "生产和配送成本上升后，对同一商品统一提高价格"],
    answer: 0,
    explanation: "价格歧视的这一识别口径要求商品或服务等级、质量相同，却对不同接受者采用不同价格。",
    boundary: "质量、成本或服务内容不同造成的价差不能直接套用该定义；本题也不评价具体行为是否合法。",
  },
  "price-discrimination-first-degree": {
    objective: "由逐单位按最高支付意愿定价识别一级价格歧视",
    prompt: "厂商试图对每位消费者购买的每一单位产品，都按其愿意支付的最高价格出售。这属于哪一级价格歧视？",
    options: ["一级价格歧视", "二级价格歧视", "三级价格歧视"],
    answer: 0,
    explanation: "逐消费者、逐单位按最高支付意愿定价，是一级价格歧视的识别标准。",
    boundary: "这里只识别分级标准，不讨论实现这种定价所需的信息条件及福利结果。",
  },
  "price-discrimination-second-degree": {
    objective: "由消费数量段差别定价识别二级价格歧视",
    prompt: "同一种商品按购买数量划分区间，不同数量段适用不同单价。这属于哪一级价格歧视？",
    options: ["一级价格歧视", "二级价格歧视", "三级价格歧视"],
    answer: 1,
    explanation: "按消费数量段规定不同价格，是二级价格歧视的识别标准。",
    boundary: "判断依据是数量段，不是逐单位探知个人最高支付意愿，也不是按市场或人群划分。",
  },
  "price-discrimination-third-degree": {
    objective: "由不同市场或消费群差别定价识别三级价格歧视",
    prompt: "同等级同质量的服务，针对可以区分的不同市场或消费群采用不同价格。这属于哪一级价格歧视？",
    options: ["一级价格歧视", "二级价格歧视", "三级价格歧视"],
    answer: 2,
    explanation: "按不同市场或不同消费群采用不同价格，是三级价格歧视的识别标准。",
    boundary: "市场或人群必须能被区分；本题不判断现实分组是否合理、合法或能够持续。",
  },
  "price-discrimination-three-levels": {
    objective: "综合还原一逐二量三人群的三级分法",
    prompt: "关于一级、二级、三级价格歧视的识别线索，哪组对应正确？",
    options: ["一级看数量段；二级看市场人群；三级逐单位看最高支付意愿", "一级逐单位看最高支付意愿；二级看数量段；三级看市场人群", "一级看产品质量；二级统一定价；三级看生产成本"],
    answer: 1,
    explanation: "一级逐单位看最高支付意愿，二级看消费数量段，三级看不同市场或消费群。",
    boundary: "三级划分须先保留同等级同质量而对不同接受者定价的定义前提。",
  },
};

const distractorReasons = {
  "market-structure-category-set": {
    1: "该组选项按交易对象区分市场，不是厂商数量和竞争条件意义上的市场结构分类。",
    2: "该组选项混合地域与交易方式口径，不属于同一市场结构分类框架。",
  },
  "market-perfect-competition-core": {
    0: "垄断竞争中企业众多、产品有差别但可替代，与题干产品同质不符。",
    2: "寡头垄断由少数厂商控制，厂商决策相互依存且进入较难。",
  },
  "market-monopolistic-competition-core": {
    1: "买卖者众多且产品同质更接近完全竞争，不符合题干产品有差别。",
    2: "寡头垄断只有少数厂商且决策相互依存，与题干企业众多不符。",
  },
  "market-oligopoly-core": {
    0: "买卖者众多且产品同质的结构，不符合少数厂商相互依存的条件。",
    1: "垄断竞争中企业众多且进入退出较容易，与少数厂商和高进入障碍不符。",
  },
  "market-monopoly-core": {
    1: "寡头垄断由少数厂商控制市场，不是整个行业只有一个卖者。",
    2: "买卖者众多且产品同质的结构，不符合唯一卖者与进入障碍。",
  },
  "price-discrimination-definition": {
    1: "质量不同造成的价格差异不满足同等级、同质量这一识别前提。",
    2: "成本变化后的统一提价没有体现对不同接受者采用不同价格。",
  },
  "price-discrimination-first-degree": {
    1: "二级价格歧视按不同消费数量段定价，不逐单位探知个人最高支付意愿。",
    2: "三级价格歧视按不同市场或消费群定价，不逐单位确定最高支付意愿。",
  },
  "price-discrimination-second-degree": {
    0: "一级价格歧视逐消费者、逐单位按其最高支付意愿定价。",
    2: "三级价格歧视按不同市场或消费群定价，不以购买数量段为依据。",
  },
  "price-discrimination-third-degree": {
    0: "一级价格歧视逐消费者、逐单位按其最高支付意愿定价。",
    1: "二级价格歧视按不同消费数量段定价，不按市场或消费群划分。",
  },
  "price-discrimination-three-levels": {
    0: "该项把逐单位、数量段和市场人群三项识别线索全部错配。",
    2: "产品质量、统一定价和生产成本不是三级价格歧视的对应分级标准。",
  },
};

const cognitiveLevels = {
  "market-structure-category-set": "mapping",
  "market-perfect-competition-core": "application",
  "market-monopolistic-competition-core": "application",
  "market-oligopoly-core": "application",
  "market-monopoly-core": "application",
  "price-discrimination-definition": "distinction",
  "price-discrimination-first-degree": "application",
  "price-discrimination-second-degree": "application",
  "price-discrimination-third-degree": "application",
  "price-discrimination-three-levels": "mapping",
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留稳定题目身份，改为分类条件、定义边界或短情境识别，并补齐逐项理由和适用边界。",
}));

const targetRows = {
  "cs-target-market-four-types": {
    statement: "能识别按厂商数量、产品差别和进入条件划分的四类市场结构。",
    conclusion: "四类市场结构是完全竞争、垄断竞争、寡头垄断和完全垄断。",
    conditions: ["先确认题目采用市场结构分类口径，再用具体条件区分四类。"],
    excludes: ["不混入交易对象、地域或交易方式等其他市场分类，也不展开数学模型。"],
  },
  "cs-target-market-perfect-competition": {
    statement: "能由众多买卖者、产品同质、资源自由流动和信息充分识别完全竞争。",
    conclusion: "完全竞争具有众多买卖者、产品同质、资源自由流动和信息充分等核心条件。",
    conditions: ["综合核对多个条件，并理解单个参与者是价格接受者。"],
    excludes: ["不把现实中接近完全竞争的市场说成完全满足全部条件，也不讨论价格形成模型。"],
  },
  "cs-target-market-monopolistic-competition": {
    statement: "能由企业众多、产品有差别但可替代、进入退出较容易识别垄断竞争。",
    conclusion: "垄断竞争兼有产品差别带来的垄断因素和企业众多、产品可替代带来的竞争因素。",
    conditions: ["按企业数量、产品差别及进入退出条件共同判断。"],
    excludes: ["不把垄断竞争理解成唯一卖者，也不以广告、包装等手段作为唯一依据。"],
  },
  "cs-target-market-oligopoly": {
    statement: "能由少数厂商、进入较难和决策相互依存识别寡头垄断。",
    conclusion: "寡头垄断由少数厂商控制，厂商决策相互依存，产品可以同质也可以有差别。",
    conditions: ["判断时优先核对厂商数量、进入条件和相互依存。"],
    excludes: ["不因产品有差别就排除寡头垄断，也不把少数厂商误写成唯一卖者。"],
  },
  "cs-target-market-monopoly": {
    statement: "能由唯一卖者、无十分近似替代品和进入障碍识别完全垄断。",
    conclusion: "完全垄断中整个行业只有一个卖者，产品无十分近似替代品，并存在进入障碍。",
    conditions: ["唯一卖者、替代品和进入障碍三个线索共同构成识别依据。"],
    excludes: ["不把少数厂商的寡头垄断当成完全垄断，也不以价格歧视替代结构判断。"],
  },
  "cs-target-price-discrimination-definition": {
    statement: "能保留同等级同质量和不同接受者两个关键条件识别价格歧视。",
    conclusion: "本节所称价格歧视是同等级、同质量的商品或服务对不同接受者采用不同价格。",
    conditions: ["判断时同时核对商品或服务等级质量相同，以及接受者和价格存在差异。"],
    excludes: ["不把质量、成本或服务内容差异造成的价差直接归入，也不评价具体行为是否合法。"],
  },
  "cs-target-price-discrimination-first-degree": {
    statement: "能由逐消费者、逐单位按最高支付意愿定价识别一级价格歧视。",
    conclusion: "一级价格歧视逐消费者、逐单位按其愿意支付的最高价格定价。",
    conditions: ["识别线索是逐单位和最高支付意愿同时出现。"],
    excludes: ["不把数量段定价归入一级，也不讨论实现条件和福利结果。"],
  },
  "cs-target-price-discrimination-second-degree": {
    statement: "能由不同消费数量段适用不同价格识别二级价格歧视。",
    conclusion: "二级价格歧视按不同消费数量段规定不同价格。",
    conditions: ["区分依据是购买或消费数量段。"],
    excludes: ["不把逐单位最高支付意愿或不同市场人群定价归入二级。"],
  },
  "cs-target-price-discrimination-third-degree": {
    statement: "能由不同市场或消费群采用不同价格识别三级价格歧视。",
    conclusion: "三级价格歧视按不同市场或不同消费群采用不同价格。",
    conditions: ["区分依据是可以识别的市场或消费群。"],
    excludes: ["不把数量段定价归入三级，也不判断现实分组的合理性、合法性和可持续性。"],
  },
};

const variationRows = {
  "cs-target-market-four-types": { directQuestionIds: ["market-structure-category-set"], variationQuestionIds: ["market-perfect-competition-core", "market-monopolistic-competition-core", "market-oligopoly-core", "market-monopoly-core"], processDifference: "直接题识别四类总集合，变式题分别给出存在条件，检验能否从分类名称进入具体结构判断。" },
  "cs-target-market-perfect-competition": { directQuestionIds: ["market-perfect-competition-core"], variationQuestionIds: ["market-structure-category-set"], processDifference: "直接题由完整条件识别完全竞争，变式题把它放回四类总框架，检验分类位置与条件能否双向还原。" },
  "cs-target-market-monopolistic-competition": { directQuestionIds: ["market-monopolistic-competition-core"], variationQuestionIds: ["market-structure-category-set"], processDifference: "直接题由多企业、产品有差别和易进入识别垄断竞争，变式题要求在四类总集合中稳定定位。" },
  "cs-target-market-oligopoly": { directQuestionIds: ["market-oligopoly-core"], variationQuestionIds: ["market-structure-category-set"], processDifference: "直接题由少数厂商和相互依存识别寡头，变式题把寡头放回四类总集合，防止与完全垄断混淆。" },
  "cs-target-market-monopoly": { directQuestionIds: ["market-monopoly-core"], variationQuestionIds: ["market-structure-category-set"], processDifference: "直接题由唯一卖者、无近似替代品和进入障碍识别完全垄断，变式题检验四类框架中的准确定位。" },
  "cs-target-price-discrimination-definition": { directQuestionIds: ["price-discrimination-definition"], variationQuestionIds: ["price-discrimination-three-levels"], processDifference: "直接题核对同等级同质量和不同接受者的定义前提，变式题在三级综合对应中要求继续保留该边界。" },
  "cs-target-price-discrimination-first-degree": { directQuestionIds: ["price-discrimination-first-degree"], variationQuestionIds: ["price-discrimination-three-levels"], processDifference: "直接题由逐单位最高支付意愿识别一级，变式题与数量段和市场人群并列比较，检验分级映射。" },
  "cs-target-price-discrimination-second-degree": { directQuestionIds: ["price-discrimination-second-degree"], variationQuestionIds: ["price-discrimination-three-levels"], processDifference: "直接题由数量段定价识别二级，变式题把数量段与逐单位、市场人群同时对照，检验边界稳定性。" },
  "cs-target-price-discrimination-third-degree": { directQuestionIds: ["price-discrimination-third-degree"], variationQuestionIds: ["price-discrimination-three-levels"], processDifference: "直接题由不同市场或消费群识别三级，变式题与一级和二级线索综合配对，检验能否反向还原。" },
};

const mnemonicDispositions = [
  { groupId: "market-structure-four-types", decision: "structural-mnemonic-candidate", resourceId: "market-structure-four-types-memory", reason: "可按厂商数量、产品差别、进入条件和相互依存形成递减结构，口诀能够反向恢复四类条件。" },
  { groupId: "monopoly-price-discrimination", decision: "structural-mnemonic-candidate", resourceId: "price-discrimination-levels-memory", reason: "可先保留同质不同价的定义前提，再用一逐、二量、三人群稳定区分三级。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-market-structure" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-economics-market-structure", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "market-structure-four-types" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "monopoly-price-discrimination" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);

function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "market-structure-four-types-memory") {
      const phrases = {
        "market-memory-four-types": "完竞、垄竞、寡头、完全垄断",
        "market-memory-perfect": "多同自由全，完全竞",
        "market-memory-monopolistic": "多而有差易进退，垄断竞",
        "market-memory-oligopoly": "少数互相看，寡头",
        "market-memory-monopoly": "独家无近替、进入难，完全垄断",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "多同、多异、少互、独无",
        text: "多同自由全，完全竞；多而有差易进退，垄断竞；少数互相看，寡头；独家无近替、进入难，完全垄断。",
        method: "先看厂商数量，再看产品差别和进入条件；少数厂商追加相互依存，独家追加近似替代品边界",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "按多、少、独的数量递减骨架，结合产品差别、进入条件和相互依存反向还原四类市场结构。",
        phrases: item.phrases.map((phrase) => ({
          ...phrase,
          phrase: phrases[phrase.id],
          coverageType: "structural-number-product-entry",
          checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-structure" })),
        })),
      };
    }
    if (item.id === "price-discrimination-levels-memory") {
      const phrases = {
        "price-discrimination-memory-definition": "同质不同价",
        "price-discrimination-memory-first": "一逐：逐单位看最高支付意愿",
        "price-discrimination-memory-second": "二量：看消费数量段",
        "price-discrimination-memory-third": "三人群：看市场或消费群",
      };
      return {
        ...item,
        revision: item.revision + 1,
        title: "一逐二量三人群",
        text: "同质不同价；一逐、二量、三人群：一级逐单位看最高支付意愿，二级看数量段，三级看市场或消费群。",
        method: "先核同等级同质量和不同接受者的定义前提，再按逐单位、数量段、市场人群三级映射",
        learningForm: "structural-mnemonic",
        formLabel: "结构口诀",
        purpose: "用一逐、二量、三人群反向还原三级价格歧视，同时保留同等级同质量而不同价的定义边界。",
        phrases: item.phrases.map((phrase) => ({
          ...phrase,
          phrase: phrases[phrase.id],
          coverageType: "structural-definition-level-mapping",
          checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-economics-market-structure" })),
        })),
      };
    }
    return item;
  });
}

const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "market-structure-four-types-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "按多、少、独的数量递减骨架，结合产品差别、进入条件和相互依存反向还原四类市场结构。",
  method: "先看厂商数量，再看产品差别和进入条件；少数厂商追加相互依存，独家追加近似替代品边界",
} : item.mnemonicId === "price-discrimination-levels-memory" ? {
  ...item,
  revision: item.revision + 1,
  purpose: "用一逐、二量、三人群反向还原三级价格歧视，同时保留同等级同质量而不同价的定义边界。",
  method: "先核同等级同质量和不同接受者的定义前提，再按逐单位、数量段、市场人群三级映射",
} : item);

const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "market-structure-four-types-memory" ? {
  ...item,
  coverageType: "structural-number-product-entry",
} : item.mnemonicId === "price-discrimination-levels-memory" ? {
  ...item,
  coverageType: "structural-definition-level-mapping",
} : item);

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-economics-3",
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
    fromVersion: "2026102377",
    toPackVersion: "2026-10-23.78",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["market-structure-four-types-memory", "price-discrimination-levels-memory"],
    reason: "Q2 经济第三批重写四类市场结构与三级价格歧视十题；两项记忆资源升级为可逆结构口诀。",
  }],
};
