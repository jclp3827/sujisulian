// C5-2: add two bounded themes from previously un-enrolled body content.
// All authored material remains review-only until a separate human content review.
const { ref, question } = require("./learning-authoring");

const fourBooks = ref("ancient-prose", "four-books", "cs-1-9-p24-four-books-list");
const fiveClassics = ref("ancient-prose", "five-classics", "cs-1-9-p24-five-classics-list");
const sixClassics = ref("ancient-prose", "six-classics", "cs-1-9-p24-six-classics-list");
const siHeading = ref("physics-other", "international-units", "cs-16-22-p15-international-units-heading-list");
const siTable = ref("physics-other", "international-units", "cs-16-22-p15-si-base-units-table");
const siDerived = ref("physics-other", "international-units", "cs-16-22-p15-si-derived-units-list");

const target = (id, scope, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope, groupId, statement, conclusion, conditions, excludes, refs,
});

const targets = [
  target("cs-target-classics-four-books", "humanities-history", "classics-collections",
    "能识别四书的完整集合，并排除混入五经或六经的典籍。",
    "四书是《论语》《中庸》《大学》《孟子》。",
    ["问题只判断本批正文列出的四书集合。"],
    ["不判断各书作者、成书年代和篇章内容。", "不把《诗》《书》《礼》《易》《春秋》归入四书。"], [fourBooks]),
  target("cs-target-classics-five-classics", "humanities-history", "classics-collections",
    "能识别五经的完整集合，并判断《乐》不在本批五经集合内。",
    "五经是《诗》《书》《礼》《易》《春秋》。",
    ["问题使用正文列出的五经名称，不扩展简称争议。"],
    ["不判断孔子与各典籍的编订关系。", "不把《大学》《中庸》归入五经。"], [fiveClassics]),
  target("cs-target-classics-six-adds-music", "humanities-history", "classics-collections",
    "能比较五经与六经，判断六经在五经集合上增加《乐》。",
    "六经是《诗》《书》《礼》《易》《乐》《春秋》，比五经多《乐》。",
    ["比较口径限定为本批正文列出的五经与六经集合。"],
    ["不讨论《乐》的散佚、版本或经学史。", "不把《论语》或《大学》当作六经新增项。"], [fiveClassics, sixClassics]),
  target("cs-target-si-base-set", "science-technology", "si-base-units",
    "能判断国际单位制有七个基本单位，并把基本单位与瓦特等导出单位分开。",
    "七个基本单位是米、千克、秒、安培、开尔文、摩尔、坎德拉；瓦特属于导出单位。",
    ["问题按正文列出的国际单位制基本单位表判断。"],
    ["不覆盖全部导出单位。", "不把物理量符号与单位符号混为一组。"], [siHeading, siTable, siDerived]),
  target("cs-target-si-length-mass-time", "science-technology", "si-base-units",
    "能把长度、质量、时间与米、千克、秒及其单位符号对应。",
    "长度—米（m），质量—千克（kg），时间—秒（s）。",
    ["kg 是千克的单位符号，不写成 g。"],
    ["不覆盖长度、质量、时间的换算。", "不讨论物理量符号与单位符号的书写差异。"], [siTable]),
  target("cs-target-si-current-temperature", "science-technology", "si-base-units",
    "能把电流和热力学温度与安培、开尔文及其单位符号对应。",
    "电流—安培（A），热力学温度—开尔文（K）。",
    ["问题判断单位名称和单位符号的对应。"],
    ["不把伏特当作电流基本单位。", "不讨论摄氏温度与开尔文温度的换算。"], [siTable]),
  target("cs-target-si-amount-luminous", "science-technology", "si-base-units",
    "能把物质的量和发光强度与摩尔、坎德拉及其单位符号对应。",
    "物质的量—摩尔（mol），发光强度—坎德拉（cd）。",
    ["问题判断国际单位制基本单位表中的对应关系。"],
    ["不讨论物质的量计算。", "不把流明、勒克斯等其他光学单位纳入本批。"], [siTable]),
];

const addedQuestions = [
  question("classics-four-books-set", "humanities-history", "classics-collections", "识别四书完整集合",
    "下列哪一组全部属于四书？",
    ["《论语》《中庸》《大学》《孟子》", "《诗》《书》《礼》《易》《春秋》", "《论语》《孟子》《诗》《春秋》"], 0,
    "四书是《论语》《中庸》《大学》《孟子》。第二组是五经，第三组混合了四书和五经。",
    "本题只判断四书集合，不考查作者和篇章内容。", [fourBooks, fiveClassics]),
  question("classics-five-exclusion", "humanities-history", "classics-collections", "从五经中排除《乐》",
    "下列哪一部不属于本批正文列出的五经？",
    ["《乐》", "《易》", "《春秋》"], 0,
    "五经是《诗》《书》《礼》《易》《春秋》。《乐》列在六经中，是六经相对五经增加的一项。",
    "本题只比较正文中的五经和六经集合，不讨论《乐》的流传情况。", [fiveClassics, sixClassics]),
  question("classics-six-addition", "humanities-history", "classics-collections", "比较五经与六经的集合差异",
    "按照本批正文，六经与五经相比增加的是哪一部？",
    ["《大学》", "《乐》", "《论语》"], 1,
    "六经为《诗》《书》《礼》《易》《乐》《春秋》，在五经集合上增加《乐》。",
    "本题不扩展经学史和版本问题。", [fiveClassics, sixClassics]),
  question("classics-five-name", "humanities-history", "classics-collections", "由典籍集合判断合称",
    "《诗》《书》《礼》《易》《春秋》合称什么？",
    ["四书", "五经", "六经"], 1,
    "这五部典籍合称五经；六经还包括《乐》，四书则是《论语》《中庸》《大学》《孟子》。",
    "本题只依据正文中的集合名称作答。", [fourBooks, fiveClassics, sixClassics]),
  question("classics-cross-check", "humanities-history", "classics-collections", "同时辨认四书与五经六经差异",
    "下列关于四书、五经和六经的说法，哪一项正确？",
    ["四书包括《诗》《书》，五经比六经多《乐》", "五经包括《大学》《中庸》，六经不含《春秋》", "四书包括《论语》《孟子》，六经比五经多《乐》"], 2,
    "《论语》《孟子》属于四书；六经在五经《诗》《书》《礼》《易》《春秋》的基础上增加《乐》。",
    "本题只检查三组典籍的集合关系。", [fourBooks, fiveClassics, sixClassics]),
  question("si-base-count", "science-technology", "si-base-units", "记住国际单位制基本单位数量",
    "本批正文列出的国际单位制基本单位共有多少个？",
    ["5个", "7个", "8个"], 1,
    "国际单位制有七个基本单位：米、千克、秒、安培、开尔文、摩尔、坎德拉。",
    "本题只问基本单位数量，不把导出单位计入。", [siHeading, siTable]),
  question("si-length-mass-time", "science-technology", "si-base-units", "对应长度质量时间的基本单位",
    "下列物理量、单位名称和单位符号的对应，哪一项完整正确？",
    ["长度—米—m；质量—千克—kg；时间—秒—s", "长度—米—kg；质量—千克—m；时间—秒—s", "长度—秒—s；质量—米—m；时间—千克—kg"], 0,
    "长度的基本单位是米（m），质量是千克（kg），时间是秒（s）。",
    "本题不考查单位换算。", [siTable]),
  question("si-current-temperature", "science-technology", "si-base-units", "对应电流和热力学温度基本单位",
    "电流和热力学温度的基本单位分别是什么？",
    ["伏特（V）和摄氏度（℃）", "安培（A）和开尔文（K）", "欧姆（Ω）和焦耳（J）"], 1,
    "电流的基本单位是安培（A），热力学温度的基本单位是开尔文（K）。伏特、欧姆和焦耳不是这两个物理量的基本单位。",
    "本题不涉及温标换算和电路计算。", [siTable, siDerived]),
  question("si-amount-luminous", "science-technology", "si-base-units", "对应物质的量和发光强度基本单位",
    "物质的量和发光强度的基本单位分别是什么？",
    ["摩尔（mol）和坎德拉（cd）", "焦耳（J）和瓦特（W）", "赫兹（Hz）和帕斯卡（Pa）"], 0,
    "物质的量的基本单位是摩尔（mol），发光强度的基本单位是坎德拉（cd）。",
    "本题不扩展其他光学单位和导出单位。", [siTable, siDerived]),
  question("si-base-full-contrast", "science-technology", "si-base-units", "完整复辨七个基本单位与导出单位",
    "下列关于国际单位制基本单位的说法，哪一项正确？",
    ["米、克、秒、伏特、开尔文、摩尔、坎德拉是七个基本单位", "米、千克、秒、安培、开尔文、摩尔、坎德拉是七个基本单位，瓦特属于导出单位", "米、千克、小时、安培、摄氏度、摩尔、流明是七个基本单位"], 1,
    "七个基本单位是米、千克、秒、安培、开尔文、摩尔、坎德拉；瓦特是功率的导出单位。",
    "本题只区分正文列出的基本单位集合与瓦特这一导出单位。", [siHeading, siTable, siDerived]),
];

const questionSpecifications = [
  ["classics-four-books-set", ["cs-target-classics-four-books"], ["cs-target-classics-five-classics"], "direct-set", { 1: "该组是五经，不是四书。", 2: "该组混合了四书和五经。" }],
  ["classics-five-exclusion", ["cs-target-classics-five-classics"], ["cs-target-classics-six-adds-music"], "set-exclusion", { 1: "《易》属于五经。", 2: "《春秋》属于五经。" }],
  ["classics-six-addition", ["cs-target-classics-six-adds-music"], ["cs-target-classics-five-classics"], "direct-contrast", { 0: "《大学》属于四书，不是六经相对五经的新增项。", 2: "《论语》属于四书，不是六经相对五经的新增项。" }],
  ["classics-five-name", ["cs-target-classics-five-classics"], ["cs-target-classics-four-books", "cs-target-classics-six-adds-music"], "reverse-recall", { 0: "四书的集合不同，不含题干列出的全部五部典籍。", 2: "六经还包括《乐》，题干只列五经。" }],
  ["classics-cross-check", ["cs-target-classics-four-books", "cs-target-classics-six-adds-music"], ["cs-target-classics-five-classics"], "cross-set-recheck", { 0: "《诗》《书》属于五经和六经，且是六经比五经多《乐》。", 1: "《大学》《中庸》属于四书，六经包含《春秋》。" }],
  ["si-base-count", ["cs-target-si-base-set"], [], "direct-count", { 0: "国际单位制基本单位不是5个。", 2: "正文列出的基本单位是7个，不是8个。" }],
  ["si-length-mass-time", ["cs-target-si-length-mass-time"], [], "direct-mapping", { 1: "米的符号是m，千克的符号是kg，该项互换了符号。", 2: "秒、米、千克分别对应时间、长度、质量，该项错配物理量。" }],
  ["si-current-temperature", ["cs-target-si-current-temperature"], ["cs-target-si-base-set"], "direct-mapping", { 0: "伏特是电压单位，摄氏度也不是表中热力学温度的基本单位。", 2: "欧姆是电阻单位，焦耳是能量单位。" }],
  ["si-amount-luminous", ["cs-target-si-amount-luminous"], ["cs-target-si-base-set"], "direct-mapping", { 1: "焦耳和瓦特分别用于能量和功率，不对应物质的量与发光强度。", 2: "赫兹和帕斯卡分别用于频率和压强。" }],
  ["si-base-full-contrast", ["cs-target-si-base-set"], ["cs-target-si-length-mass-time", "cs-target-si-current-temperature", "cs-target-si-amount-luminous"], "full-set-recheck", { 0: "质量基本单位是千克，电流基本单位是安培；伏特不是基本单位。", 2: "时间基本单位是秒，热力学温度是开尔文，发光强度是坎德拉。" }],
].map(([questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons]) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons }));

const mnemonics = [
  {
    id: "classics-collections-memory", revision: 1, status: "review", scope: "humanities-history",
    title: "四书五经六经怎么分", purpose: "用三个短句记住四书与五经集合，并抓住六经比五经多《乐》。",
    text: "四书论中大孟；五经诗书礼易春秋；六经添乐。", method: "分组加差异记忆",
    coverage: "四书和五经的正文集合，以及六经相对五经增加《乐》的关系。",
    conditions: ["简称只用于记忆，作答时还原为完整书名。", "六经添乐指本批正文中六经比五经多《乐》。"],
    excludes: ["典籍作者、成书年代和篇章内容", "《乐》的流传、版本与经学史"],
    phrases: [
      {
        id: "classics-memory-four", phrase: "四书论中大孟", meaning: "四书是《论语》《中庸》《大学》《孟子》。",
        targetIds: ["cs-target-classics-four-books"], coverageType: "complete-set", conditionRefs: [], refs: [fourBooks],
        questionIds: ["classics-four-books-set", "classics-cross-check"], checks: [
          { questionId: "classics-four-books-set", checkPurpose: "direct-set", reviewTarget: "phrase", reviewAnchorId: "classics-memory-four" },
          { questionId: "classics-cross-check", checkPurpose: "cross-set-recheck", reviewTarget: "meaning", reviewAnchorId: "classics-memory-four" },
        ],
      },
      {
        id: "classics-memory-five", phrase: "五经诗书礼易春秋", meaning: "五经是《诗》《书》《礼》《易》《春秋》。",
        targetIds: ["cs-target-classics-five-classics"], coverageType: "complete-set", conditionRefs: [], refs: [fiveClassics],
        questionIds: ["classics-five-exclusion", "classics-five-name"], checks: [
          { questionId: "classics-five-exclusion", checkPurpose: "set-exclusion", reviewTarget: "meaning", reviewAnchorId: "classics-memory-five" },
          { questionId: "classics-five-name", checkPurpose: "reverse-recall", reviewTarget: "phrase", reviewAnchorId: "classics-memory-five" },
        ],
      },
      {
        id: "classics-memory-six", phrase: "六经添乐", meaning: "六经在五经集合上增加《乐》。",
        targetIds: ["cs-target-classics-six-adds-music"], coverageType: "set-difference",
        conditionRefs: [{ id: "classics-memory-six-condition", text: "比较口径限定为正文列出的五经和六经集合。" }], refs: [fiveClassics, sixClassics],
        questionIds: ["classics-six-addition"], checks: [
          { questionId: "classics-six-addition", checkPurpose: "direct-contrast", reviewTarget: "condition", reviewAnchorId: "classics-memory-six-condition" },
        ],
      },
    ],
    questionIds: ["classics-four-books-set", "classics-cross-check", "classics-five-exclusion", "classics-five-name", "classics-six-addition"],
  },
  {
    id: "si-base-units-memory", revision: 1, status: "review", scope: "science-technology",
    title: "七个基本单位", purpose: "按物理量顺序记住七个基本单位，并把瓦特等导出单位排除在外。",
    text: "七基米千秒，安开摩坎；瓦特是导出。", method: "分组顺序记忆",
    coverage: "七个国际单位制基本单位的名称、常用符号和瓦特的导出单位边界。",
    conditions: ["“米千秒”依次对应长度、质量、时间。", "“安开摩坎”依次对应电流、热力学温度、物质的量、发光强度。"],
    excludes: ["单位换算和公式计算", "除瓦特外的全部导出单位清单"],
    phrases: [
      {
        id: "si-memory-length-mass-time", phrase: "米千秒", meaning: "长度—米（m），质量—千克（kg），时间—秒（s）。",
        targetIds: ["cs-target-si-length-mass-time"], coverageType: "ordered-mapping",
        conditionRefs: [{ id: "si-memory-order-one", text: "顺序固定为长度、质量、时间。" }], refs: [siTable],
        questionIds: ["si-length-mass-time"], checks: [
          { questionId: "si-length-mass-time", checkPurpose: "direct-mapping", reviewTarget: "condition", reviewAnchorId: "si-memory-order-one" },
        ],
      },
      {
        id: "si-memory-other-four", phrase: "安开摩坎", meaning: "电流—安培（A），热力学温度—开尔文（K），物质的量—摩尔（mol），发光强度—坎德拉（cd）。",
        targetIds: ["cs-target-si-current-temperature", "cs-target-si-amount-luminous"], coverageType: "ordered-mapping",
        conditionRefs: [{ id: "si-memory-order-two", text: "顺序固定为电流、热力学温度、物质的量、发光强度。" }], refs: [siTable],
        questionIds: ["si-current-temperature", "si-amount-luminous"], checks: [
          { questionId: "si-current-temperature", checkPurpose: "direct-mapping", reviewTarget: "condition", reviewAnchorId: "si-memory-order-two" },
          { questionId: "si-amount-luminous", checkPurpose: "direct-mapping", reviewTarget: "meaning", reviewAnchorId: "si-memory-other-four" },
        ],
      },
      {
        id: "si-memory-boundary", phrase: "七基，瓦特是导出", meaning: "基本单位共有七个；瓦特是功率的导出单位，不属于七个基本单位。",
        targetIds: ["cs-target-si-base-set"], coverageType: "count-and-boundary", conditionRefs: [], refs: [siHeading, siTable, siDerived],
        questionIds: ["si-base-count", "si-base-full-contrast"], checks: [
          { questionId: "si-base-count", checkPurpose: "direct-count", reviewTarget: "phrase", reviewAnchorId: "si-memory-boundary" },
          { questionId: "si-base-full-contrast", checkPurpose: "full-set-recheck", reviewTarget: "meaning", reviewAnchorId: "si-memory-boundary" },
        ],
      },
    ],
    questionIds: ["si-length-mass-time", "si-current-temperature", "si-amount-luminous", "si-base-count", "si-base-full-contrast"],
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
  ["cs-target-classics-four-books", ["classics-four-books-set"], ["classics-five-name", "classics-cross-check"]],
  ["cs-target-classics-five-classics", ["classics-five-exclusion", "classics-five-name"], ["classics-cross-check"]],
  ["cs-target-classics-six-adds-music", ["classics-six-addition"], ["classics-five-exclusion", "classics-cross-check"]],
  ["cs-target-si-base-set", ["si-base-count"], ["si-base-full-contrast"]],
  ["cs-target-si-length-mass-time", ["si-length-mass-time"], ["si-base-full-contrast"]],
  ["cs-target-si-current-temperature", ["si-current-temperature"], ["si-base-full-contrast"]],
  ["cs-target-si-amount-luminous", ["si-amount-luminous"], ["si-base-full-contrast"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));

const groups = [
  { id: "classics-collections", title: "四书五经六经怎么分", scope: "humanities-history", reason: "先记三个集合，再抓住六经比五经多《乐》。", questionIds: addedQuestions.slice(0, 5).map((item) => item.id) },
  { id: "si-base-units", title: "七个国际单位制基本单位", scope: "science-technology", reason: "按物理量顺序记单位，并排除导出单位。", questionIds: addedQuestions.slice(5).map((item) => item.id) },
];

const sourceDispositions = [
  { candidateId: "classics-four-books", pointId: "ancient-prose", tabIds: ["four-books"], status: "已建设", batch: "C5-2", scope: "四书集合，不含作者与成书信息" },
  { candidateId: "classics-five-six", pointId: "ancient-prose", tabIds: ["five-classics", "six-classics"], status: "已建设", batch: "C5-2", scope: "五经、六经集合及《乐》的差异" },
  { candidateId: "si-seven-base-units", pointId: "physics-other", tabIds: ["international-units"], status: "已建设", batch: "C5-2", scope: "七个基本单位和瓦特的导出单位边界" },
  { candidateId: "si-named-derived-units", pointId: "physics-other", tabIds: ["international-units"], status: "可建设", batch: "C5-2", scope: "其余具名导出单位留待后续独立主题" },
];

function applyQuestions(questions) { return questions.concat(addedQuestions); }
function applyGroups(existing) { return existing.concat(groups); }
function applyMnemonics(existing) { return existing.concat(mnemonics); }
function applyEntryPlans(entryPlans) {
  const plan = JSON.parse(JSON.stringify(entryPlans));
  const questionIds = addedQuestions.map((item) => item.id);
  plan.revision = 8;
  plan.modes.qa.groupIds.push(...groups.map((item) => item.id));
  plan.modes.qa.questionIds.push(...questionIds);
  plan.modes.mnemonic.questionIds.push(...questionIds);
  plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map((item) => item.id));
  return plan;
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "C5-2", targets, addedQuestions, questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
    ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  mnemonics, mnemonicSpecifications, mnemonicPhraseTargetRelations, variationDecisions, groups, sourceDispositions,
  sessionMigrations: [{
    fromVersion: "b5b62081", toPackVersion: "2026-10-21.6",
    changedQuestionIds: addedQuestions.map((item) => item.id), changedMnemonicIds: mnemonics.map((item) => item.id),
    reason: "C5-2 新增四书五经六经和国际单位制基本单位两个独立学习组；既有会话不含这些新资源并继续保留，新主题从新学习包开始。",
  }],
  applyQuestions, applyGroups, applyMnemonics, applyEntryPlans,
};
