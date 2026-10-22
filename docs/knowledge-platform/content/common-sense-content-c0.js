// C0 inventory and authoring contract. This file is planning evidence, not runtime content.
// No recommendation in this file changes the review status of the existing pack.
const pack = require("./common-sense-learning-v1");

const reviseQuestions = {
  "poet-sage": "与 poet-immortal 的对应识别高度重合；C1b 应改成不依赖镜像选项的变式题。",
  "school-lao": "题目可保留，但解析中的“创始人”表述需要先按可靠来源核准或改为本节对应关系。",
  "history-tongjian": "选项同时混入作者和体例，未分别检测体例、范围两个目标；试点中重写。",
  "history-hanshu": "现题只直接检测通史/断代史，却把纪传体并入目标；试点中拆分目标并补直接检测。",
  "light-shadow": "“声音的反射”是跨领域弱干扰项；补同领域、可解释的有效干扰项。",
  "light-reflection": "“物体真的沉到水下”不是同层级概念；改为能区分反射与折射的有效干扰项。",
  "heat-conduction": "物态升华属于明显异类干扰项；题目应检验传导、对流、辐射的机制差异。",
  "substance-compound": "题目只检测二氧化碳示例，不能完整代表“多种元素组成的纯净物”目标；补定义检测。",
  "demand-conditions": "题干未包含一定时期和价格水平，关键限定仅放在边界说明；正式题应把条件写进检测。",
  "supply-conditions": "题干未包含一定时期和价格水平，关键限定仅放在解析；正式题应把条件写进检测。",
  "macro-growth": "两个干扰项明显失真，几乎不产生有效判断；重编为同层级宏观概念。",
  "macro-jobs-prices": "题干依赖候选口诀中的“两增一稳”，容易测成补口诀原句；改为直接检测两个目标。",
  "macro-balance": "家庭和企业收支是过弱干扰项；应区分国际收支、财政收支等相近概念。",
  "policy-fiscal": "人口政策是跨层级弱干扰项；补能区分财政与货币工具的有效选项。",
  "policy-monetary": "企业分红、政府采购与题干层级不一致；补同层级政策工具辨析。",
  "policy-bond-purchase": "保留教材基础机制，但须补适用条件和权威来源，避免外推为现实政策或投资判断。",
};

const reviseMnemonics = {
  "schools-pairing-memory": "“老子道”过度压缩且易被理解为宗教或作者关系；提高可还原性。",
  "light-phenomena-memory": "“影子直”含义不自明；改写后应能直接还原直线传播、反射、折射。",
  "heat-mechanisms-memory": "“传导沿物传”容易误导为只在固体或单一物体内发生；按机制重新表述。",
  "substance-classification-memory": "“数物质”“一元/多元”可能与元素、组分概念混淆；重写分类步骤。",
  "demand-supply-roles-memory": "“才入门”没有知识含义，且未体现时期和价格条件；补足可还原信息。",
  "fiscal-monetary-memory": "“公开买债记扩张”需保留基础机制的条件与用途边界，避免现实政策机械套用。",
  "inheritance-order-memory": "内容准确性待继续审核，但句子过长；拆分一般顺序与附条件例外。",
  "constitution-chapters-memory": "“权义”“旗歌徽都”简称需要额外解码；改为更直接、可还原的表达。",
};

const ordinaryReason = {
  question: "题干、答案、解析、边界及正文引用可作为下一阶段候选基础；仍需正常事实与教学审核，并按目标补变式或记录不适用理由。",
  mnemonic: "已有逐句释义、覆盖/排除范围和配套题关系，可进入 C2 复核；保留候选状态，不视为正式口诀。",
  comparison: "比较维度、适用条件、排除范围和三题流程完整，可进入后续复核；现有 review 状态不变。",
};
const postC0QuestionIds = new Set([
  "sound-pitch-timbre-scenario", "sound-loudness-condition", "history-hanshu-genre", "history-three-books-contrast",
]);

function decision(kind, item) {
  const revisions = kind === "question" ? reviseQuestions : kind === "mnemonic" ? reviseMnemonics : {};
  return {
    id: item.id,
    kind,
    groupId: item.group || item.groupId || pack.groups.find((g) => g.questionIds.includes(item.questionIds?.[0]))?.id || "",
    scope: item.scope,
    currentStatus: item.status,
    recommendation: revisions[item.id] ? "revise-before-formal" : "retain-candidate",
    reason: revisions[item.id] || ordinaryReason[kind],
    formalReady: false,
  };
}

const pilotTargets = [
  {
    id: "cs-target-sound-pitch-frequency",
    revision: 1,
    scope: "science-technology",
    groupId: "sound-features",
    statement: "能判断音调描述声音的高低，并在基础比较中把音调与发声体振动频率对应。",
    conclusion: "音调高低对应发声体振动频率。",
    conditions: ["讨论发声体振动与音调的基础对应关系。"],
    excludes: ["不把音调与响度等同。", "不覆盖超声、次声和传播速度。"],
    refs: [{ pointId: "acoustics", tabId: "sound-characteristics", sourceUnitIds: ["cs-16-22-p13-sound-characteristics-list"] }],
    legacyQuestionIds: ["sound-pitch"],
    mnemonicPhraseIndexes: [{ mnemonicId: "sound-memory", phraseIndex: 0 }],
    comparisonIds: ["sound-features-comparison"],
    plannedChecks: ["direct", "scenario-or-contrast"],
  },
  {
    id: "cs-target-sound-loudness-amplitude",
    revision: 1,
    scope: "science-technology",
    groupId: "sound-features",
    statement: "能在距离等其他条件相同时，把响度强弱与发声体振幅大小对应。",
    conclusion: "其他条件相同时，振幅越大，响度越大。",
    conditions: ["距离等其他影响实际听感的条件相同。"],
    excludes: ["不把振幅视为实际听到响度的唯一因素。", "不由更响推断频率更高。"],
    refs: [{ pointId: "acoustics", tabId: "sound-characteristics", sourceUnitIds: ["cs-16-22-p13-sound-characteristics-list"] }],
    legacyQuestionIds: ["sound-loudness"],
    mnemonicPhraseIndexes: [{ mnemonicId: "sound-memory", phraseIndex: 1 }],
    comparisonIds: ["sound-features-comparison"],
    plannedChecks: ["direct", "boundary"],
  },
  {
    id: "cs-target-sound-timbre-identification",
    revision: 1,
    scope: "science-technology",
    groupId: "sound-features",
    statement: "能在辨认不同人或不同发声体的声音特点时选择音色这一特性。",
    conclusion: "音色可用于辨别不同声音的特点。",
    conditions: ["问题关注声音特点或来源辨认。"],
    excludes: ["不表示不同声音的音调和响度永远相同。"],
    refs: [{ pointId: "acoustics", tabId: "sound-characteristics", sourceUnitIds: ["cs-16-22-p13-sound-characteristics-list"] }],
    legacyQuestionIds: ["sound-timbre"],
    mnemonicPhraseIndexes: [{ mnemonicId: "sound-memory", phraseIndex: 2 }],
    comparisonIds: ["sound-features-comparison"],
    plannedChecks: ["direct", "scenario"],
  },
  ...[
    ["shiji", "《史记》", "纪传体", "通史", "history-shiji", 0],
    ["tongjian", "《资治通鉴》", "编年体", "通史", "history-tongjian", 1],
    ["hanshu", "《汉书》", "纪传体", "断代史", "history-hanshu", 2],
  ].flatMap(([slug, book, genre, scopeType, questionId, phraseIndex]) => [
    {
      id: `cs-target-history-${slug}-genre`, revision: 1, scope: "humanities-history", groupId: "history-genres",
      statement: `能从叙述体例维度判断${book}属于${genre}。`, conclusion: `${book}的叙述体例为${genre}。`,
      conditions: ["问题维度为叙述体例。"], excludes: ["不把纪传体/编年体与通史/断代史当成同一维度。", "不覆盖作者生平和全书篇目。"],
      refs: [{ pointId: "fiction-history-modern-literature", tabId: "historiography-works", sourceUnitIds: ["cs-10-15-p9-historiography-table"] }],
      legacyQuestionIds: [questionId], mnemonicPhraseIndexes: [{ mnemonicId: "history-genres-memory", phraseIndex }],
      comparisonIds: ["history-genres-comparison"], plannedChecks: ["direct", "cross-book-contrast"],
    },
    {
      id: `cs-target-history-${slug}-scope`, revision: 1, scope: "humanities-history", groupId: "history-genres",
      statement: `能从记述范围维度判断${book}属于${scopeType}。`, conclusion: `${book}的记述范围为${scopeType}。`,
      conditions: ["问题维度为记述范围。"], excludes: ["不把通史/断代史与纪传体/编年体当成同一维度。", "不覆盖具体记载年代和成书经过。"],
      refs: [{ pointId: "fiction-history-modern-literature", tabId: "historiography-works", sourceUnitIds: ["cs-10-15-p9-historiography-table"] }],
      legacyQuestionIds: [questionId], mnemonicPhraseIndexes: [{ mnemonicId: "history-genres-memory", phraseIndex }],
      comparisonIds: ["history-genres-comparison"], plannedChecks: ["direct", "cross-book-contrast"],
    },
  ]),
];

const templates = {
  target: ["id", "revision", "scope", "groupId", "statement", "conclusion", "conditions", "excludes", "refs", "status"],
  question: ["id", "revision", "scope", "groupId", "prompt", "options", "answer", "explanation", "distractorReasons", "primaryTargetIds", "supportingTargetIds", "checkPurpose", "refs", "kind", "status"],
  mnemonic: ["id", "revision", "scope", "title", "purpose", "text", "method", "coverage", "conditions", "excludes", "phrases", "selfTestQuestionIds", "refs", "status"],
  mnemonicPhrase: ["id", "text", "meaning", "targetIds", "coverageType", "conditionRefs", "questionIds", "wrongAnswerReviewAnchor"],
  comparison: ["id", "revision", "scope", "groupId", "title", "confusionReason", "coverage", "conditions", "excludes", "rows", "initialQuestionId", "recheckQuestionIds", "refs", "status"],
  emergencyTopic: ["id", "revision", "title", "purpose", "scope", "targetIds", "reviewItems", "questionIds", "inclusionReasons", "excludes", "status"],
};

module.exports = {
  schemaVersion: 1,
  registeredAt: "2026-10-21",
  runtimeContentChanged: false,
  baseline: { questions: 45, mnemonics: 13, comparisons: 4, groups: 15, detailUnits: 170, tabs: 581 },
  decisions: {
    questions: pack.questions.filter((item) => !postC0QuestionIds.has(item.id)).map((item) => decision("question", item)),
    mnemonics: pack.mnemonics.map((item) => decision("mnemonic", item)),
    comparisons: pack.comparisons.map((item) => decision("comparison", item)),
  },
  pilotGroupIds: ["sound-features", "history-genres"],
  pilotTargets,
  templates,
  blockedTabs: [
    { pointId: "microeconomics", tabId: "demand-factors" },
    { pointId: "microeconomics", tabId: "demand-income-elasticity" },
    { pointId: "thermodynamics", tabId: "phase-change" },
  ],
};
