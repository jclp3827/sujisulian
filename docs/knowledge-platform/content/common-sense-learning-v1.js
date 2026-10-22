// Authored candidates. Approval requires a separate human content review.
const { ref, question, mnemonic } = require("./learning-authoring");
const li = ref("pre-qin-poetry", "li-bai", "cs-10-15-p2-p3-li-bai-list");
const du = ref("pre-qin-poetry", "du-fu", "cs-10-15-p3-du-fu-list");
const sound = ref("acoustics", "sound-characteristics", "cs-16-22-p13-sound-characteristics-list");
const fx = ref("exchange-rate-quotation", "exchange-rate-quotation", "cs-23-30-p22-exchange-rate-quotation-list");
const firstBatch = {
  schemaVersion: 1,
  version: "2026-10-20.1",
  questions: [
    question("poet-immortal", "humanities-history", "poet-titles", "区分李白的诗仙称号",
      "“诗仙”通常指哪位诗人？", ["杜甫", "李白", "白居易"], 1,
      "李白被称为诗仙；杜甫被称为诗圣。", "此题只辨人物称号，不涉及全部作品和生平。", [li, du]),
    question("poet-sage", "humanities-history", "poet-titles", "区分杜甫的诗圣称号",
      "把人物与称号配对，哪一组正确？", ["李白—诗圣", "杜甫—诗仙", "杜甫—诗圣"], 2,
      "“诗圣”对应杜甫，“诗仙”对应李白。", "人物称号与诗歌评价要分开记。", [du, li]),
    question("poet-history", "humanities-history", "poet-titles", "区分诗史评价的对象",
      "“诗史”在这里评价的是什么？", ["杜甫的诗歌", "李白的字号", "杜甫的官职"], 0,
      "杜甫的诗歌被评价为“诗史”。“诗圣”称人，“诗史”评诗。", "不能把“诗史”当成官职或字号。", [du]),
    question("sound-pitch", "science-technology", "sound-features", "音调对应振动频率",
      "判断声音的音调高低，应看发声体振动的什么特征？", ["振幅", "频率", "外观颜色"], 1,
      "音调高低取决于振动频率；响度与振幅相关。", "“高音”和“大声”是不同描述。", [sound]),
    question("sound-loudness", "science-technology", "sound-features", "响度对应振幅",
      "其他条件相同，描述声音更响，主要对应发声体振动的哪个量？", ["振幅", "频率", "音色"], 0,
      "在其他条件相同的比较中，振幅对应响度。频率对应音调。", "这里只比较振幅；不据此排除距离等因素对听到的响度的影响。", [sound]),
    question("sound-timbre", "science-technology", "sound-features", "音色用于辨别声音特点",
      "辨认不同人的声音，主要利用声音的哪种特性？", ["响度", "音调", "音色"], 2,
      "不同的人声具有不同的音色，可据此辨认声音特点。", "不是说人的音调、响度永远相同。", [sound]),
    question("fx-direct", "economics", "fx-quotation", "直接标价固定外币基准",
      "以一定单位外国货币为基准，计算需要多少本国货币，属于什么标价法？", ["间接标价法", "直接标价法"], 1,
      "直接标价法固定外币单位，用本币表示其价格。", "先辨明本币和外币，不凭数字大小判断。", [fx]),
    question("fx-indirect", "economics", "fx-quotation", "间接标价固定本币基准",
      "以一定单位本国货币为基准，计算可兑换多少外国货币，属于什么标价法？", ["间接标价法", "直接标价法"], 0,
      "间接标价法固定本币单位，用外币表示其价格。", "本卡不讨论汇率升降对进出口的影响。", [fx]),
    question("fx-context", "economics", "fx-quotation", "判断标价法前先确认本外币",
      "看到“A 货币 1 单位 = B 货币若干单位”，要判断是直接还是间接标价，还需要知道什么？",
      ["兑换发生在上午还是下午", "数值是不是整数", "以哪个国家或地区的本币为观察口径"], 2,
      "直接、间接标价以本币和外币的关系区分；没有观察口径，不能仅凭货币排列断定。", "这是依据正文定义设计的辨析题，数值不是实际行情。", [fx]),
  ],
  mnemonics: [
    mnemonic("poet-memory", "humanities-history", "李杜称号怎么分",
      "李白诗仙，杜甫诗圣；诗史评诗，称号记人。",
      "李白与杜甫的两个称号，以及“诗史”的评价对象。",
      ["人物全部字号、生平", "作品清单、名句与文学史"],
      [
        { phrase: "李白诗仙", meaning: "诗仙对应李白。", questionIds: ["poet-immortal"], refs: [li] },
        { phrase: "杜甫诗圣", meaning: "诗圣对应杜甫。", questionIds: ["poet-sage"], refs: [du] },
        { phrase: "诗史评诗，称号记人", meaning: "诗史评价杜甫的诗歌，和诗圣这个人物称号分开。", questionIds: ["poet-history"], refs: [du] },
      ], ["poet-immortal", "poet-sage", "poet-history"]),
    mnemonic("sound-memory", "science-technology", "音调、响度、音色",
      "调高低，看频率；响大小，看振幅；辨声音，看音色。",
      "声音三种特性的基本对应关系。",
      ["传播速度、超声与次声", "距离等因素对实际听感的影响"],
      [
        { phrase: "调高低，看频率", meaning: "音调描述高低，对应发声体振动频率。", questionIds: ["sound-pitch"], refs: [sound] },
        { phrase: "响大小，看振幅", meaning: "其他条件相同时，振幅对应响度大小。", questionIds: ["sound-loudness"], refs: [sound] },
        { phrase: "辨声音，看音色", meaning: "音色帮助区分不同的人声和声响。", questionIds: ["sound-timbre"], refs: [sound] },
      ], ["sound-pitch", "sound-loudness", "sound-timbre"]),
    mnemonic("fx-memory", "economics", "直接、间接标价",
      "直接固定外币，间接固定本币；先认本外，再看标价。",
      "两种标价法固定的货币基准，以及判断前需要的观察口径。",
      ["汇率涨跌和货币升贬值的推导", "贸易、资本流动与实时汇率"],
      [
        { phrase: "直接固定外币", meaning: "一定单位外币作为基准，计算对应的本币数量。", questionIds: ["fx-direct"], refs: [fx] },
        { phrase: "间接固定本币", meaning: "一定单位本币作为基准，计算对应的外币数量。", questionIds: ["fx-indirect"], refs: [fx] },
        { phrase: "先认本外，再看标价", meaning: "先确认哪个是本币，才能根据基准判断标价法。", questionIds: ["fx-context"], refs: [fx] },
      ], ["fx-direct", "fx-indirect", "fx-context"]),
  ],
  groups: [
    { id: "poet-titles", title: "李杜称号辨析", scope: "humanities-history", reason: "把人物称号与诗歌评价放在一起区分。", questionIds: ["poet-immortal", "poet-sage", "poet-history"] },
    { id: "sound-features", title: "声音的三种特性", scope: "science-technology", reason: "用三个明确问题区分音调、响度和音色。", questionIds: ["sound-pitch", "sound-loudness", "sound-timbre"] },
    { id: "fx-quotation", title: "汇率标价先看基准", scope: "economics", reason: "先记定义，再检验本币与外币的观察口径。", questionIds: ["fx-direct", "fx-indirect", "fx-context"] },
  ],
};
const expansion = require("./common-sense-learning-s4");
const targetModel = require("./common-sense-targets-c1a");
const c1b = require("./common-sense-questions-c1b");
const c2 = require("./common-sense-mnemonics-c2");
const c5 = require("./common-sense-content-c5-1");
const c52 = require("./common-sense-content-c5-2");
const c53 = require("./common-sense-content-c5-3");
const c54 = require("./common-sense-content-c5-4");
const c55 = require("./common-sense-content-c5-5");
const c56 = require("./common-sense-content-c5-6");
const c57 = require("./common-sense-content-c5-7");
const c58 = require("./common-sense-content-c5-8");
const c59 = require("./common-sense-content-c5-9");
const c510 = require("./common-sense-content-c5-10");
const c511 = require("./common-sense-content-c5-11");
const c512 = require("./common-sense-content-c5-12");
const c513 = require("./common-sense-content-c5-13");
const c514 = require("./common-sense-content-c5-14");
const c515 = require("./common-sense-content-c5-15");
const c516 = require("./common-sense-content-c5-16");
const c516b = require("./common-sense-content-c5-16b");
const c517 = require("./common-sense-content-c5-17");
const c518 = require("./common-sense-content-c5-18");
const c519 = require("./common-sense-content-c5-19");
const c520 = require("./common-sense-content-c5-20");
const c521 = require("./common-sense-content-c5-21");
const c522 = require("./common-sense-content-c5-22");
const c523 = require("./common-sense-content-c5-23");
const c524 = require("./common-sense-content-c5-24");
const c525 = require("./common-sense-content-c5-25");
const c526 = require("./common-sense-content-c5-26");
const c527 = require("./common-sense-content-c5-27");
const c528 = require("./common-sense-content-c5-28");
const c529 = require("./common-sense-content-c5-29");
const c530 = require("./common-sense-content-c5-30");
const c531 = require("./common-sense-content-c5-31");
const c532 = require("./common-sense-content-c5-32");
const c533 = require("./common-sense-content-c5-33");
const c534 = require("./common-sense-content-c5-34");
const c535 = require("./common-sense-content-c5-35");
const c536 = require("./common-sense-content-c5-36");
const c537 = require("./common-sense-content-c5-37");
const c538 = require("./common-sense-content-c5-38");
const c539 = require("./common-sense-content-c5-39");
const c540 = require("./common-sense-content-c5-40");
const c541 = require("./common-sense-content-c5-41");
const c542 = require("./common-sense-content-c5-42");
const c543 = require("./common-sense-content-c5-43");
const c544 = require("./common-sense-content-c5-44");
const c545 = require("./common-sense-content-c5-45");
const c546 = require("./common-sense-content-c5-46");
const c547 = require("./common-sense-content-c5-47");
const c548 = require("./common-sense-content-c5-48");
const c549 = require("./common-sense-content-c5-49");
const c550 = require("./common-sense-content-c5-50");
const c551 = require("./common-sense-content-c5-51");
const c552 = require("./common-sense-content-c5-52");
const c553 = require("./common-sense-content-c5-53");
const c554 = require("./common-sense-content-c5-54");
const c555 = require("./common-sense-content-c5-55");
const c556 = require("./common-sense-content-c5-56");
const c557 = require("./common-sense-content-c5-57");
const c558 = require("./common-sense-content-c5-58");
const c559 = require("./common-sense-content-c5-59");
const c560 = require("./common-sense-content-c5-60");
const q0b = require("./common-sense-content-q0-b");
const q1 = require("./common-sense-content-q1");
const q2Law1 = require("./common-sense-content-q2-law-1");
const q2Law2 = require("./common-sense-content-q2-law-2");
const q2Science1 = require("./common-sense-content-q2-science-1");
const q2Science2 = require("./common-sense-content-q2-science-2");
const q2Science3 = require("./common-sense-content-q2-science-3");
const q2Science4 = require("./common-sense-content-q2-science-4");
const c5Batches = [c5, c52, c53, c54, c55, c56, c57, c58, c59, c510, c511, c512, c513, c514, c515, c516, c516b, c517, c518, c519, c520, c521, c522, c523, c524, c525, c526, c527, c528, c529, c530, c531, c532, c533, c534, c535, c536, c537, c538, c539, c540, c541, c542, c543, c544, c545, c546, c547, c548, c549, c550, c551, c552, c553, c554, c555, c556, c557, c558, c559, c560];
const baseQuestions = c5Batches.reduce((items, batch) => batch.applyQuestions(items), c1b.applyQuestions(firstBatch.questions.concat(expansion.questions)));
const groups = q2Science4.applyGroups(q2Science3.applyGroups(q2Science2.applyGroups(q2Science1.applyGroups(q2Law2.applyGroups(q2Law1.applyGroups(c5Batches.reduce((items, batch) => batch.applyGroups(items), c1b.applyGroups(firstBatch.groups.concat(expansion.groups))).concat(q1.groups)))))));
const baseMnemonics = c5Batches.reduce((items, batch) => batch.applyMnemonics(items), c2.applyMnemonics(firstBatch.mnemonics.concat(expansion.mnemonics)));
const baseMnemonicSpecifications = c2.mnemonicSpecifications.concat(...c5Batches.map((batch) => batch.mnemonicSpecifications));
const q0bContent = q0b.build(baseQuestions, baseMnemonics, baseMnemonicSpecifications);
const questions = q2Science4.applyQuestions(q2Science3.applyQuestions(q2Science2.applyQuestions(q2Science1.applyQuestions(
  q2Law2.applyQuestions(q2Law1.applyQuestions(q0bContent.questions.concat(q1.addedQuestions)))))));
const mnemonics = q2Science4.applyMnemonics(q2Science3.applyMnemonics(q2Science2.applyMnemonics(q2Science1.applyMnemonics(
  q2Law2.applyMnemonics(q2Law1.applyMnemonics(q0bContent.mnemonics.concat(q1.mnemonics)))))));
const c3 = require("./common-sense-comparisons-c3")(questions);
const c4 = require("./common-sense-exam-c4")(questions);
module.exports = { ...firstBatch, version: "2026-10-22.72",
  questions,
  mnemonics,
  groups,
  verificationSources: { ...expansion.verificationSources, ...q2Law1.verificationSources, ...q2Law2.verificationSources },
  comparisons: q2Law2.applyComparisons(
    require("./common-sense-comparisons-b3a").concat(c3.comparisons)),
  entryPlans: q1.applyEntryPlans(c5Batches.reduce((plan, batch) => batch.applyEntryPlans(plan), require("./common-sense-entry-plans-b3b"))),
  targets: q2Science4.applyTargets(q2Science3.applyTargets(q2Science2.applyTargets(q2Science1.applyTargets(q2Law2.applyTargets(q2Law1.applyTargets(targetModel.targets.concat(...c5Batches.map((batch) => batch.targets), q0bContent.targets, q1.targets))))))),
  targetRelations: { ...targetModel.relations, questionTargets: q2Science4.applyQuestionTargetRelations(q2Science3.applyQuestionTargetRelations(q2Science2.applyQuestionTargetRelations(q2Science1.applyQuestionTargetRelations(q2Law2.applyQuestionTargetRelations(q2Law1.applyQuestionTargetRelations(c1b.questionTargetRelations.concat(...c5Batches.map((batch) => batch.questionTargetRelations), q0bContent.questionTargetRelations, q1.questionTargetRelations))))))),
    mnemonicPhraseTargets: q2Science4.applyMnemonicPhraseTargetRelations(q2Science3.applyMnemonicPhraseTargetRelations(q2Science2.applyMnemonicPhraseTargetRelations(q2Science1.applyMnemonicPhraseTargetRelations(q2Law2.applyMnemonicPhraseTargetRelations(q2Law1.applyMnemonicPhraseTargetRelations(c2.mnemonicPhraseTargetRelations.concat(...c5Batches.map((batch) => batch.mnemonicPhraseTargetRelations), q0bContent.mnemonicPhraseTargetRelations, q1.mnemonicPhraseTargetRelations))))))),
    comparisonRowTargets: c3.comparisonRowTargetRelations.concat(q0bContent.comparisonRowTargetRelations) },
  questionSpecifications: q2Science4.applyQuestionSpecifications(q2Science3.applyQuestionSpecifications(q2Science2.applyQuestionSpecifications(q2Science1.applyQuestionSpecifications(q2Law2.applyQuestionSpecifications(q2Law1.applyQuestionSpecifications(q0b.enrichQuestionSpecifications(c1b.questionSpecifications.concat(
    ...c5Batches.map((batch) => batch.questionSpecifications), q0bContent.newQuestionSpecifications, q1.questionSpecifications)))))))),
  mnemonicSpecifications: q2Science4.applyMnemonicSpecifications(q2Science3.applyMnemonicSpecifications(q2Science2.applyMnemonicSpecifications(q2Science1.applyMnemonicSpecifications(q2Law2.applyMnemonicSpecifications(q2Law1.applyMnemonicSpecifications(q0bContent.mnemonicSpecifications.concat(q1.mnemonicSpecifications))))))),
  comparisonSpecifications: c3.comparisonSpecifications,
  examTopics: c4.examTopics,
  variationDecisions: q2Science4.applyVariationDecisions(q2Science3.applyVariationDecisions(q2Science2.applyVariationDecisions(q2Science1.applyVariationDecisions(q2Law2.applyVariationDecisions(q2Law1.applyVariationDecisions(c1b.variationDecisions.concat(...c5Batches.map((batch) => batch.variationDecisions), q0bContent.variationDecisions, q1.variationDecisions))))))),
  sessionMigrations: c1b.sessionMigrations.concat(c2.sessionMigrations, c3.sessionMigrations, c4.sessionMigrations, ...c5Batches.map((batch) => batch.sessionMigrations).flat(), q1.sessionMigrations, q2Law1.sessionMigrations, q2Law2.sessionMigrations, q2Science1.sessionMigrations, q2Science2.sessionMigrations, q2Science3.sessionMigrations, q2Science4.sessionMigrations),
  authoringConstraints: [
    { pointId: "microeconomics", tabId: "demand-factors", reason: "轻奢品与收入反向变化的分类表述待核，暂不由本页签派生学习卡。", requiredCheck: "补充经济学定义依据，并与劣等品、口红效应分别核对。" },
    { pointId: "microeconomics", tabId: "demand-income-elasticity", reason: "固定恩格尔系数阈值的机构归属与当前适用性待核。", requiredCheck: "核对统计机构的原始资料；不直接生成联合国固定分档的问答或口诀。" },
    { pointId: "thermodynamics", tabId: "phase-change", reason: "升华示例中的炒菜最后放盐与机制对应关系待核。", requiredCheck: "核对教材或科学教育机构解释；暂不选该页签派生卡。" },
  ],
};
