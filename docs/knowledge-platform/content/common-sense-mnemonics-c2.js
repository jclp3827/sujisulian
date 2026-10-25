// C2 mnemonic learning-package pilot. Existing facts stay within the C1a target boundary.
const { ref } = require("./learning-authoring");

const sound = ref("acoustics", "sound-characteristics", "cs-16-22-p13-sound-characteristics-list");
const history = ref("fiction-history-modern-literature", "historiography-works", "cs-10-15-p9-historiography-table");

const replacements = [
  {
    id: "sound-memory", revision: 2, status: "review", scope: "science-technology",
    title: "音调、响度、音色", purpose: "用三个稳定对应关系区分声音的高低、强弱和辨识特点。",
    text: "调高低，看频率；响大小，看振幅；辨声音，看音色。", method: "对应记忆",
    coverage: "声音三种特性的基本对应关系，以及响度比较所需的其他条件相同。",
    conditions: ["比较振幅与响度时，距离等其他影响听感的条件相同。", "辨声音指辨认不同人或发声体的声音特点。"],
    excludes: ["传播速度、超声与次声", "把振幅视为实际听到响度的唯一因素"],
    phrases: [
      {
        id: "sound-memory-pitch", phrase: "调高低，看频率", meaning: "音调描述声音的高低，对应发声体振动频率。",
        targetIds: ["cs-target-sound-pitch-frequency"], coverageType: "complete-basic", conditionRefs: [], refs: [sound],
        questionIds: ["sound-pitch"], checks: [
          { questionId: "sound-pitch", checkPurpose: "direct", reviewTarget: "phrase", reviewAnchorId: "sound-memory-pitch" },
        ],
      },
      {
        id: "sound-memory-loudness", phrase: "响大小，看振幅", meaning: "其他条件相同时，振幅越大，响度越大。",
        targetIds: ["cs-target-sound-loudness-amplitude"], coverageType: "conditional-basic",
        conditionRefs: [{ id: "sound-memory-loudness-condition", text: "距离等其他影响听感的条件相同。" }], refs: [sound],
        questionIds: ["sound-loudness", "sound-loudness-condition"], checks: [
          { questionId: "sound-loudness", checkPurpose: "direct-with-condition", reviewTarget: "phrase", reviewAnchorId: "sound-memory-loudness" },
          { questionId: "sound-loudness-condition", checkPurpose: "boundary-condition", reviewTarget: "condition", reviewAnchorId: "sound-memory-loudness-condition" },
        ],
      },
      {
        id: "sound-memory-timbre", phrase: "辨声音，看音色", meaning: "音色帮助区分不同的人声和发声体的声音特点。",
        targetIds: ["cs-target-sound-timbre-identification"], coverageType: "complete-basic", conditionRefs: [], refs: [sound],
        questionIds: ["sound-timbre"], checks: [
          { questionId: "sound-timbre", checkPurpose: "scenario", reviewTarget: "meaning", reviewAnchorId: "sound-memory-timbre" },
        ],
      },
    ],
    questionIds: ["sound-pitch", "sound-loudness", "sound-loudness-condition", "sound-timbre"],
  },
  {
    id: "history-genres-memory", revision: 2, status: "review", scope: "humanities-history",
    title: "三部史书分体例", purpose: "把叙述体例和记述范围分成两个维度，再记三部史书的对应关系。",
    text: "史记纪传通，通鉴编年通；汉书纪传断。", method: "分类归纳",
    coverage: "《史记》《资治通鉴》《汉书》的叙述体例与记述范围。",
    conditions: ["纪传体、编年体回答叙述体例。", "通史、断代史回答记述范围。"],
    excludes: ["其他史书的作者和地位", "全书篇目、具体历史事件与成书经过"],
    phrases: [
      {
        id: "history-memory-shiji", phrase: "史记纪传通", meaning: "《史记》：叙述体例是纪传体，记述范围是通史。",
        targetIds: ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope"], coverageType: "complete-basic",
        conditionRefs: [], refs: [history], questionIds: ["history-shiji"], checks: [
          { questionId: "history-shiji", checkPurpose: "combined-direct", reviewTarget: "phrase", reviewAnchorId: "history-memory-shiji" },
        ],
      },
      {
        id: "history-memory-tongjian", phrase: "通鉴编年通", meaning: "《资治通鉴》：叙述体例是编年体，记述范围是通史。",
        targetIds: ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"], coverageType: "complete-basic",
        conditionRefs: [], refs: [history], questionIds: ["history-tongjian"], checks: [
          { questionId: "history-tongjian", checkPurpose: "combined-direct", reviewTarget: "phrase", reviewAnchorId: "history-memory-tongjian" },
        ],
      },
      {
        id: "history-memory-hanshu", phrase: "汉书纪传断", meaning: "《汉书》：叙述体例是纪传体，记述范围是断代史。",
        targetIds: ["cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope"], coverageType: "complete-basic",
        conditionRefs: [], refs: [history], questionIds: ["history-hanshu", "history-hanshu-genre"], checks: [
          { questionId: "history-hanshu", checkPurpose: "direct", reviewTarget: "meaning", reviewAnchorId: "history-memory-hanshu" },
          { questionId: "history-hanshu-genre", checkPurpose: "direct", reviewTarget: "phrase", reviewAnchorId: "history-memory-hanshu" },
        ],
      },
    ],
    questionIds: ["history-shiji", "history-tongjian", "history-hanshu", "history-hanshu-genre"],
  },
];

const mnemonicPhraseTargetRelations = replacements.flatMap((mnemonic) => mnemonic.phrases.map((phrase, phraseIndex) => ({
  mnemonicId: mnemonic.id, phraseIndex, phraseId: phrase.id, targetIds: phrase.targetIds,
  coverageType: phrase.coverageType, wrongAnswerReviewAnchor: phrase.id,
})));

const mnemonicSpecifications = replacements.map((mnemonic) => ({
  mnemonicId: mnemonic.id, revision: mnemonic.revision, purpose: mnemonic.purpose, method: mnemonic.method,
  conditionCount: mnemonic.conditions.length, phraseIds: mnemonic.phrases.map((phrase) => phrase.id),
  selfTestQuestionIds: mnemonic.questionIds.slice(),
}));

function applyMnemonics(mnemonics) {
  const byId = new Map(replacements.map((item) => [item.id, item]));
  return mnemonics.map((item) => byId.get(item.id) || item);
}

module.exports = {
  schemaVersion: 1, revision: 1, replacements, mnemonicSpecifications, mnemonicPhraseTargetRelations,
  addedSelfTestQuestionIds: ["sound-loudness-condition", "history-hanshu-genre"],
  sessionMigrations: [{
    fromVersion: "8dec2e48", toPackVersion: "2026-10-21.2", changedQuestionIds: [],
    changedMnemonicIds: replacements.map((item) => item.id),
    reason: "C2 修订两条试点口诀及其自测映射；无关问答队列继续，旧口诀阅读与自测按新学习包重建。",
  }],
  applyMnemonics,
};
