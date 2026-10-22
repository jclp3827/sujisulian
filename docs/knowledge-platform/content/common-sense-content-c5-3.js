// C5-3: add two bounded themes from audited body content.
// All authored material remains review-only until a separate human content review.
const { ref, question } = require("./learning-authoring");

const siDerived = ref("physics-other", "international-units", "cs-16-22-p15-si-derived-units-list");
const marketOverview = ref("market-structure-overview", "market-structure-classification", "cs-23-30-p11-market-structure-overview-list");
const perfectConditions = ref("perfect-competition-market", "perfect-competition-conditions", "cs-23-30-p11-perfect-competition-conditions-list");
const monopolisticConditions = ref("monopolistic-competition-market", "monopolistic-conditions", "cs-23-30-p11-monopolistic-competition-conditions-list");
const oligopolyMeaning = ref("oligopoly-market", "oligopoly-meaning", "cs-23-30-p12-oligopoly-meaning-list");
const oligopolyConditions = ref("oligopoly-market", "oligopoly-conditions", "cs-23-30-p12-oligopoly-conditions-list");
const monopolyMeaning = ref("monopoly-market", "monopoly-meaning", "cs-23-30-p12-monopoly-meaning-list");
const monopolyConditions = ref("monopoly-market", "monopoly-conditions", "cs-23-30-p12-monopoly-conditions-list");

const target = (id, scope, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope, groupId, statement, conclusion, conditions, excludes, refs,
});

const targets = [
  target("cs-target-si-derived-frequency-force", "science-technology", "si-named-derived-units",
    "能把频率、力分别与赫兹（Hz）、牛顿（N）对应。",
    "频率—赫兹（Hz）；力—牛顿（N）。",
    ["问题按正文列出的物理量、单位名称和符号判断。"],
    ["不考查单位定义式。", "不考查单位命名人物的生平和发现过程。"], [siDerived]),
  target("cs-target-si-derived-pressure-energy", "science-technology", "si-named-derived-units",
    "能把压强、能量分别与帕斯卡（Pa）、焦耳（J）对应。",
    "压强—帕斯卡（Pa）；能量—焦耳（J）。",
    ["问题按正文列出的导出单位表判断。"],
    ["不进行压强或能量计算。", "不扩展其他同量纲单位。"], [siDerived]),
  target("cs-target-si-derived-power-charge", "science-technology", "si-named-derived-units",
    "能把功率、电量分别与瓦特（W）、库仑（C）对应。",
    "功率—瓦特（W）；电量—库仑（C）。",
    ["电量沿用本批正文用语。"],
    ["不推导电功率公式。", "不把安培这一基本单位混入导出单位配对。"], [siDerived]),
  target("cs-target-si-derived-voltage-resistance", "science-technology", "si-named-derived-units",
    "能把电压、电阻分别与伏特（V）、欧姆（Ω）对应。",
    "电压—伏特（V）；电阻—欧姆（Ω）。",
    ["问题只识别物理量、单位名称和符号。"],
    ["不计算1Ω=1V/A。", "不考查伏打、欧姆的生平。"], [siDerived]),
  target("cs-target-market-four-types", "economics", "market-structure-four-types",
    "能识别正文列出的四类市场结构。",
    "四类市场结构是完全竞争、垄断竞争、寡头垄断和完全垄断。",
    ["本批以正文的四类划分为口径。"],
    ["不讨论市场结构的数学模型。", "不把市场失灵或宏观调控类型混入分类。"], [marketOverview]),
  target("cs-target-market-perfect-competition", "economics", "market-structure-four-types",
    "能根据买卖者众多、产品同质、资源自由流动、信息完全识别完全竞争市场。",
    "完全竞争的核心条件包括无数买卖者、商品同质、资源完全流动和信息完全。",
    ["现实中只把一些农产品市场看成比较接近完全竞争，正文明确现实中不存在完全竞争市场。"],
    ["不把接近完全竞争的例子说成完全满足全部条件。", "不讨论价格形成模型。"], [perfectConditions]),
  target("cs-target-market-monopolistic-competition", "economics", "market-structure-four-types",
    "能根据企业多、同种产品有差别且可替代、进入退出较容易识别垄断竞争市场。",
    "垄断竞争同时包含产品差别带来的垄断因素和替代、企业众多带来的竞争因素。",
    ["本批只使用存在条件识别，不纳入非价格竞争手段。"],
    ["不把垄断竞争理解为只有一个卖者。", "不覆盖广告、包装等竞争方式。"], [monopolisticConditions]),
  target("cs-target-market-oligopoly", "economics", "market-structure-four-types",
    "能根据厂商极少、进入较难、厂商相互依存识别寡头垄断市场。",
    "寡头垄断由少数厂商控制，产品可同质也可有差别，决策时须考虑对手反应。",
    ["产品是否同质不能单独排除寡头垄断。"],
    ["不讨论寡头厂商的价格或非价格竞争手段。", "不把少数厂商误写成唯一厂商。"], [oligopolyMeaning, oligopolyConditions]),
  target("cs-target-market-monopoly", "economics", "market-structure-four-types",
    "能根据唯一卖者、无十分近似替代品和进入障碍识别完全垄断市场。",
    "完全垄断中整个行业只有一个卖者，产品没有十分近似替代品，并存在进入障碍。",
    ["正文中的“垄断市场”对应四类划分里的完全垄断市场。"],
    ["不纳入三级价格歧视。", "不把厂商极少的寡头垄断当作唯一卖者。"], [monopolyMeaning, monopolyConditions]),
];

const addedQuestions = [
  question("si-derived-frequency-force", "science-technology", "si-named-derived-units", "对应频率和力的导出单位",
    "频率和力的单位分别是什么？",
    ["赫兹（Hz）和牛顿（N）", "帕斯卡（Pa）和焦耳（J）", "伏特（V）和欧姆（Ω）"], 0,
    "频率的单位是赫兹（Hz），力的单位是牛顿（N）。",
    "本题只判断物理量、单位名称和符号的对应。", [siDerived]),
  question("si-derived-pressure-energy", "science-technology", "si-named-derived-units", "对应压强和能量的导出单位",
    "压强和能量的单位分别是什么？",
    ["牛顿（N）和瓦特（W）", "帕斯卡（Pa）和焦耳（J）", "赫兹（Hz）和库仑（C）"], 1,
    "压强的单位是帕斯卡（Pa），能量的单位是焦耳（J）。",
    "本题不涉及公式和数值换算。", [siDerived]),
  question("si-derived-power-charge", "science-technology", "si-named-derived-units", "对应功率和电量的导出单位",
    "功率和电量的单位分别是什么？",
    ["焦耳（J）和安培（A）", "伏特（V）和欧姆（Ω）", "瓦特（W）和库仑（C）"], 2,
    "功率的单位是瓦特（W），电量的单位是库仑（C）。安培是电流的基本单位，不是本题电量的答案。",
    "本题沿用正文的“电量”表述，不推导电学公式。", [siDerived]),
  question("si-derived-voltage-resistance", "science-technology", "si-named-derived-units", "对应电压和电阻的导出单位",
    "电压和电阻的单位分别是什么？",
    ["库仑（C）和安培（A）", "伏特（V）和欧姆（Ω）", "瓦特（W）和焦耳（J）"], 1,
    "电压的单位是伏特（V），电阻的单位是欧姆（Ω）。",
    "本题不要求使用1Ω=1V/A进行计算。", [siDerived]),
  question("si-derived-full-contrast", "science-technology", "si-named-derived-units", "综合复辨八个具名导出单位",
    "下列物理量与单位的对应，哪一项全部正确？",
    ["频率—牛顿；力—赫兹；功率—焦耳；能量—瓦特", "压强—焦耳；能量—帕斯卡；电压—欧姆；电阻—伏特", "频率—赫兹；压强—帕斯卡；功率—瓦特；电阻—欧姆"], 2,
    "频率—赫兹、压强—帕斯卡、功率—瓦特、电阻—欧姆均对应正确；其余选项把相邻单位互换。",
    "综合题只复核本批列出的八个单位，不扩展其他导出单位。", [siDerived]),
  question("market-structure-category-set", "economics", "market-structure-four-types", "识别四类市场结构完整集合",
    "按照正文，下列哪一组完整列出了四类市场结构？",
    ["完全竞争、垄断竞争、寡头垄断、完全垄断", "商品市场、劳动力市场、金融市场、技术市场", "国内市场、国际市场、现货市场、期货市场"], 0,
    "正文把市场结构划分为完全竞争、垄断竞争、寡头垄断和完全垄断四类。",
    "本题只确认市场结构分类，不讨论其他市场分类口径。",
    [marketOverview, perfectConditions, monopolisticConditions, oligopolyMeaning, oligopolyConditions, monopolyMeaning, monopolyConditions]),
  question("market-perfect-competition-core", "economics", "market-structure-four-types", "根据核心条件识别完全竞争",
    "哪一组条件最符合完全竞争市场？",
    ["唯一卖者、无近似替代品、进入受阻", "无数买卖者、商品同质、资源完全流动、信息完全", "少数厂商、相互依存、进入较难"], 1,
    "完全竞争的条件包括无数买卖者、商品同质、资源完全流动和信息完全，各参与者是价格接受者。",
    "现实中一些农产品市场只是比较接近完全竞争，不等于现实中存在完全竞争市场。", [marketOverview, perfectConditions]),
  question("market-monopolistic-competition-core", "economics", "market-structure-four-types", "根据核心条件识别垄断竞争",
    "哪一项最能识别垄断竞争市场？",
    ["大量企业生产有差别但可相互替代的同种产品，进入退出较容易", "只有一个卖者，产品没有十分近似的替代品", "厂商数量极少，每家决策都要特别考虑对手反应"], 0,
    "垄断竞争市场中企业数量多，生产有差别但互为替代的同种产品，厂商规模较小，进入退出较容易。",
    "本题只考存在条件，不把广告、包装等非价格竞争手段纳入判断。", [marketOverview, monopolisticConditions]),
  question("market-oligopoly-core", "economics", "market-structure-four-types", "根据核心条件识别寡头垄断",
    "某行业只有少数几家厂商，进入较难，各厂商决策时必须考虑竞争对手反应。这更符合哪类市场？",
    ["完全竞争市场", "垄断竞争市场", "寡头垄断市场"], 2,
    "寡头垄断由少数几家厂商控制，厂商相互依存，新的厂商进入较难；产品可以同质，也可以有差别。",
    "本题不讨论寡头厂商的具体竞争手段。", [marketOverview, oligopolyMeaning, oligopolyConditions]),
  question("market-monopoly-core", "economics", "market-structure-four-types", "根据核心条件识别完全垄断",
    "整个行业只有一个卖者，产品没有十分近似的替代品，并存在进入障碍。这属于哪类市场？",
    ["完全垄断市场", "寡头垄断市场", "完全竞争市场"], 0,
    "完全垄断市场只有一个卖者，控制整个行业供给，产品没有十分近似的替代品，并存在进入障碍。",
    "本题不扩展价格歧视及公共事业案例。", [marketOverview, monopolyMeaning, monopolyConditions]),
];

const questionSpecifications = [
  ["si-derived-frequency-force", ["cs-target-si-derived-frequency-force"], [], "direct-mapping", { 1: "帕斯卡和焦耳分别对应压强和能量。", 2: "伏特和欧姆分别对应电压和电阻。" }],
  ["si-derived-pressure-energy", ["cs-target-si-derived-pressure-energy"], [], "direct-mapping", { 0: "牛顿对应力，瓦特对应功率。", 2: "赫兹对应频率，库仑对应电量。" }],
  ["si-derived-power-charge", ["cs-target-si-derived-power-charge"], [], "direct-mapping", { 0: "焦耳对应能量；安培是电流的基本单位。", 1: "伏特和欧姆分别对应电压和电阻。" }],
  ["si-derived-voltage-resistance", ["cs-target-si-derived-voltage-resistance"], [], "direct-mapping", { 0: "库仑对应电量，安培对应电流。", 2: "瓦特和焦耳分别对应功率和能量。" }],
  ["si-derived-full-contrast", ["cs-target-si-derived-frequency-force", "cs-target-si-derived-pressure-energy", "cs-target-si-derived-power-charge", "cs-target-si-derived-voltage-resistance"], [], "full-set-recheck", { 0: "赫兹对应频率、牛顿对应力，焦耳对应能量、瓦特对应功率，该项全部互换。", 1: "帕斯卡对应压强、焦耳对应能量，伏特对应电压、欧姆对应电阻，该项全部互换。" }],
  ["market-structure-category-set", ["cs-target-market-four-types"], ["cs-target-market-perfect-competition", "cs-target-market-monopolistic-competition", "cs-target-market-oligopoly", "cs-target-market-monopoly"], "direct-set", { 1: "该组列的是按交易对象区分的若干市场，不是正文的四类市场结构。", 2: "该组混合地域、交易方式等口径，不是正文的四类市场结构。" }],
  ["market-perfect-competition-core", ["cs-target-market-perfect-competition"], ["cs-target-market-four-types"], "condition-identification", { 0: "唯一卖者、无近似替代和进入障碍属于完全垄断。", 2: "少数厂商、相互依存和进入较难属于寡头垄断。" }],
  ["market-monopolistic-competition-core", ["cs-target-market-monopolistic-competition"], ["cs-target-market-four-types"], "condition-identification", { 1: "唯一卖者且无近似替代品属于完全垄断。", 2: "少数厂商且相互依存属于寡头垄断。" }],
  ["market-oligopoly-core", ["cs-target-market-oligopoly"], ["cs-target-market-four-types"], "scenario-identification", { 0: "完全竞争中买卖者众多，单个厂商不能控制价格。", 1: "垄断竞争中企业众多且产品有差别，进入退出较容易。" }],
  ["market-monopoly-core", ["cs-target-market-monopoly"], ["cs-target-market-four-types"], "scenario-identification", { 1: "寡头垄断是少数厂商控制市场，不是唯一卖者。", 2: "完全竞争有无数买卖者、商品同质且信息完全。" }],
].map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));

const mnemonics = [
  {
    id: "si-named-derived-memory", revision: 1, status: "review", scope: "science-technology",
    title: "八个具名导出单位", purpose: "按物理量成对记住正文列出的八个具名导出单位。",
    text: "赫频牛力，帕压焦能；瓦功库电量，伏压欧电阻。", method: "成对映射记忆",
    coverage: "频率、力、压强、能量、功率、电量、电压、电阻及其单位名称和符号。",
    conditions: ["口诀中的“压”在“帕压”处指压强，在“伏压”处指电压。", "作答时须还原完整物理量、单位名称和符号。"],
    excludes: ["单位命名人物的生平与发现", "单位定义式、换算和计算", "正文未列出的其他导出单位"],
    phrases: [
      { id: "si-derived-memory-frequency-force", phrase: "赫频牛力", meaning: "频率—赫兹（Hz），力—牛顿（N）。", targetIds: ["cs-target-si-derived-frequency-force"], coverageType: "ordered-mapping", conditionRefs: [], refs: [siDerived], questionIds: ["si-derived-frequency-force", "si-derived-full-contrast"], checks: [
        { questionId: "si-derived-frequency-force", checkPurpose: "direct-mapping", reviewTarget: "phrase", reviewAnchorId: "si-derived-memory-frequency-force" },
        { questionId: "si-derived-full-contrast", checkPurpose: "full-set-recheck", reviewTarget: "meaning", reviewAnchorId: "si-derived-memory-frequency-force" },
      ] },
      { id: "si-derived-memory-pressure-energy", phrase: "帕压焦能", meaning: "压强—帕斯卡（Pa），能量—焦耳（J）。", targetIds: ["cs-target-si-derived-pressure-energy"], coverageType: "ordered-mapping", conditionRefs: [{ id: "si-derived-memory-pressure-condition", text: "此处“压”指压强。" }], refs: [siDerived], questionIds: ["si-derived-pressure-energy", "si-derived-full-contrast"], checks: [
        { questionId: "si-derived-pressure-energy", checkPurpose: "direct-mapping", reviewTarget: "condition", reviewAnchorId: "si-derived-memory-pressure-condition" },
        { questionId: "si-derived-full-contrast", checkPurpose: "full-set-recheck", reviewTarget: "meaning", reviewAnchorId: "si-derived-memory-pressure-energy" },
      ] },
      { id: "si-derived-memory-power-charge", phrase: "瓦功库电量", meaning: "功率—瓦特（W），电量—库仑（C）。", targetIds: ["cs-target-si-derived-power-charge"], coverageType: "ordered-mapping", conditionRefs: [], refs: [siDerived], questionIds: ["si-derived-power-charge", "si-derived-full-contrast"], checks: [
        { questionId: "si-derived-power-charge", checkPurpose: "direct-mapping", reviewTarget: "phrase", reviewAnchorId: "si-derived-memory-power-charge" },
        { questionId: "si-derived-full-contrast", checkPurpose: "full-set-recheck", reviewTarget: "meaning", reviewAnchorId: "si-derived-memory-power-charge" },
      ] },
      { id: "si-derived-memory-voltage-resistance", phrase: "伏压欧电阻", meaning: "电压—伏特（V），电阻—欧姆（Ω）。", targetIds: ["cs-target-si-derived-voltage-resistance"], coverageType: "ordered-mapping", conditionRefs: [{ id: "si-derived-memory-voltage-condition", text: "此处“压”指电压。" }], refs: [siDerived], questionIds: ["si-derived-voltage-resistance", "si-derived-full-contrast"], checks: [
        { questionId: "si-derived-voltage-resistance", checkPurpose: "direct-mapping", reviewTarget: "condition", reviewAnchorId: "si-derived-memory-voltage-condition" },
        { questionId: "si-derived-full-contrast", checkPurpose: "full-set-recheck", reviewTarget: "meaning", reviewAnchorId: "si-derived-memory-voltage-resistance" },
      ] },
    ],
    questionIds: ["si-derived-frequency-force", "si-derived-pressure-energy", "si-derived-power-charge", "si-derived-voltage-resistance", "si-derived-full-contrast"],
  },
  {
    id: "market-structure-four-types-memory", revision: 1, status: "review", scope: "economics",
    title: "四类市场结构", purpose: "先记四类总集合，再用厂商数量、产品差别、进入条件和相互依存识别每一类。",
    text: "完竞多同自由全；垄竞多差进退易；寡头少而相依；完全垄断唯一、无近替、进入难。", method: "递减厂商数量加条件辨析",
    coverage: "四类市场结构，以及各类用于快速识别的正文核心条件。",
    conditions: ["“多”在完全竞争处指无数买卖者，在垄断竞争处指大量企业。", "寡头产品可以同质，也可以有差别，不能只靠产品差别判断。"],
    excludes: ["非价格竞争和价格竞争手段", "三级价格歧视", "市场结构的数学模型和现实行业的绝对归类"],
    phrases: [
      { id: "market-memory-four-types", phrase: "完竞、垄竞、寡头、完全垄断", meaning: "正文列出的四类市场结构。", targetIds: ["cs-target-market-four-types"], coverageType: "complete-set", conditionRefs: [], refs: [marketOverview], questionIds: ["market-structure-category-set"], checks: [
        { questionId: "market-structure-category-set", checkPurpose: "direct-set", reviewTarget: "phrase", reviewAnchorId: "market-memory-four-types" },
      ] },
      { id: "market-memory-perfect", phrase: "完竞多同自由全", meaning: "完全竞争有无数买卖者、商品同质、资源完全流动、信息完全。", targetIds: ["cs-target-market-perfect-competition"], coverageType: "core-conditions", conditionRefs: [{ id: "market-memory-perfect-condition", text: "现实中不存在完全竞争市场，一些农产品市场只是比较接近。" }], refs: [perfectConditions], questionIds: ["market-perfect-competition-core"], checks: [
        { questionId: "market-perfect-competition-core", checkPurpose: "condition-identification", reviewTarget: "condition", reviewAnchorId: "market-memory-perfect-condition" },
      ] },
      { id: "market-memory-monopolistic", phrase: "垄竞多差进退易", meaning: "垄断竞争有大量企业、差别化但可替代的同种产品，进入退出较容易。", targetIds: ["cs-target-market-monopolistic-competition"], coverageType: "core-conditions", conditionRefs: [], refs: [monopolisticConditions], questionIds: ["market-monopolistic-competition-core"], checks: [
        { questionId: "market-monopolistic-competition-core", checkPurpose: "condition-identification", reviewTarget: "meaning", reviewAnchorId: "market-memory-monopolistic" },
      ] },
      { id: "market-memory-oligopoly", phrase: "寡头少而相依", meaning: "寡头垄断厂商极少、进入较难，厂商决策相互依存。", targetIds: ["cs-target-market-oligopoly"], coverageType: "core-conditions", conditionRefs: [{ id: "market-memory-oligopoly-condition", text: "寡头产品可以同质，也可以有差别。" }], refs: [oligopolyMeaning, oligopolyConditions], questionIds: ["market-oligopoly-core"], checks: [
        { questionId: "market-oligopoly-core", checkPurpose: "scenario-identification", reviewTarget: "condition", reviewAnchorId: "market-memory-oligopoly-condition" },
      ] },
      { id: "market-memory-monopoly", phrase: "完全垄断唯一、无近替、进入难", meaning: "完全垄断只有一个卖者，产品无十分近似替代品，并存在进入障碍。", targetIds: ["cs-target-market-monopoly"], coverageType: "core-conditions", conditionRefs: [], refs: [monopolyMeaning, monopolyConditions], questionIds: ["market-monopoly-core"], checks: [
        { questionId: "market-monopoly-core", checkPurpose: "scenario-identification", reviewTarget: "meaning", reviewAnchorId: "market-memory-monopoly" },
      ] },
    ],
    questionIds: ["market-structure-category-set", "market-perfect-competition-core", "market-monopolistic-competition-core", "market-oligopoly-core", "market-monopoly-core"],
  },
];

const mnemonicPhraseTargetRelations = mnemonics.flatMap((mnemonic) => mnemonic.phrases.map((phrase, phraseIndex) => ({
  mnemonicId: mnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
  coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
})));

const mnemonicSpecifications = mnemonics.map((mnemonic) => ({
  mnemonicId: mnemonic.id, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method,
  conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id),
  selfTestQuestionIds: mnemonic.questionIds.slice(),
}));

const variationDecisions = [
  ["cs-target-si-derived-frequency-force", ["si-derived-frequency-force"], ["si-derived-full-contrast"]],
  ["cs-target-si-derived-pressure-energy", ["si-derived-pressure-energy"], ["si-derived-full-contrast"]],
  ["cs-target-si-derived-power-charge", ["si-derived-power-charge"], ["si-derived-full-contrast"]],
  ["cs-target-si-derived-voltage-resistance", ["si-derived-voltage-resistance"], ["si-derived-full-contrast"]],
  ["cs-target-market-four-types", ["market-structure-category-set"], ["market-perfect-competition-core", "market-monopolistic-competition-core", "market-oligopoly-core", "market-monopoly-core"]],
  ["cs-target-market-perfect-competition", ["market-perfect-competition-core"], ["market-structure-category-set"]],
  ["cs-target-market-monopolistic-competition", ["market-monopolistic-competition-core"], ["market-structure-category-set"]],
  ["cs-target-market-oligopoly", ["market-oligopoly-core"], ["market-structure-category-set"]],
  ["cs-target-market-monopoly", ["market-monopoly-core"], ["market-structure-category-set"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));

const groups = [
  { id: "si-named-derived-units", title: "八个具名导出单位", scope: "science-technology", reason: "按物理量成对记单位，最后综合复辨。", questionIds: addedQuestions.slice(0, 5).map((item) => item.id) },
  { id: "market-structure-four-types", title: "四类市场结构怎么分", scope: "economics", reason: "先看完整分类，再抓厂商数量、产品和进入条件。", questionIds: addedQuestions.slice(5).map((item) => item.id) },
];

const sourceDispositions = [
  { candidateId: "si-named-derived-units", pointId: "physics-other", tabIds: ["international-units"], status: "已建设", batch: "C5-3", scope: "正文列出的八个具名导出单位与物理量、符号对应" },
  { candidateId: "market-structure-four-types", pointId: "market-structure-overview", relatedPointIds: ["perfect-competition-market", "monopolistic-competition-market", "oligopoly-market", "monopoly-market"], tabIds: ["market-structure-classification"], status: "已建设", batch: "C5-3", scope: "四类市场结构及用于识别的核心存在条件，不含竞争手段和价格歧视" },
  { candidateId: "market-competition-methods", pointId: "monopolistic-competition-market", relatedPointIds: ["oligopoly-market"], tabIds: ["monopolistic-methods"], status: "待补依据", batch: "C5-3", scope: "垄断竞争与寡头垄断的竞争手段另作独立主题；补充表述核清后重开" },
];

function applyQuestions(questions) { return questions.concat(addedQuestions); }
function applyGroups(existing) { return existing.concat(groups); }
function applyMnemonics(existing) { return existing.concat(mnemonics); }
function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  const questionIds = addedQuestions.map((item) => item.id);
  plan.revision = 9;
  plan.modes.qa.groupIds.push(...groups.map((item) => item.id));
  plan.modes.qa.questionIds.push(...questionIds);
  plan.modes.mnemonic.questionIds.push(...questionIds);
  plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((item) => item.id));
  return plan;
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-3", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
    ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions,
  sessionMigrations: [{
    fromVersion: "e63570f2", toPackVersion: "2026-10-21.7",
    changedQuestionIds: addedQuestions.map((item) => item.id), changedMnemonicIds: mnemonics.map((item) => item.id),
    reason: "C5-3 新增具名导出单位和四类市场结构两个独立学习组；既有会话继续保留，新主题从新的五题学习组开始。",
  }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
