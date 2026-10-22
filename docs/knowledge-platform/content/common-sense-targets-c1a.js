// C1a pilot target model. Relations do not rewrite legacy questions or user records.
const soundRef = { pointId: "acoustics", tabId: "sound-characteristics", sourceUnitIds: ["cs-16-22-p13-sound-characteristics-list"] };
const historyRef = { pointId: "fiction-history-modern-literature", tabId: "historiography-works", sourceUnitIds: ["cs-10-15-p9-historiography-table"] };
const target = (id, scope, groupId, statement, conclusion, conditions, excludes, refs) => ({
  id, revision: 1, status: "review", scope, groupId, statement, conclusion, conditions, excludes, refs,
});

const targets = [
  target("cs-target-sound-pitch-frequency", "science-technology", "sound-features",
    "能判断音调描述声音的高低，并在基础比较中把音调与发声体振动频率对应。",
    "音调高低对应发声体振动频率。", ["讨论发声体振动与音调的基础对应关系。"],
    ["不把音调与响度等同。", "不覆盖超声、次声和传播速度。"], [soundRef]),
  target("cs-target-sound-loudness-amplitude", "science-technology", "sound-features",
    "能在距离等其他条件相同时，把响度强弱与发声体振幅大小对应。",
    "其他条件相同时，振幅越大，响度越大。", ["距离等其他影响实际听感的条件相同。"],
    ["不把振幅视为实际听到响度的唯一因素。", "不由更响推断频率更高。"], [soundRef]),
  target("cs-target-sound-timbre-identification", "science-technology", "sound-features",
    "能在辨认不同人或不同发声体的声音特点时选择音色这一特性。",
    "音色可用于辨别不同声音的特点。", ["问题关注声音特点或来源辨认。"],
    ["不表示不同声音的音调和响度永远相同。"], [soundRef]),
  ...[
    ["shiji", "《史记》", "纪传体", "通史"],
    ["tongjian", "《资治通鉴》", "编年体", "通史"],
    ["hanshu", "《汉书》", "纪传体", "断代史"],
  ].flatMap(([slug, book, genre, scopeType]) => [
    target(`cs-target-history-${slug}-genre`, "humanities-history", "history-genres",
      `能从叙述体例维度判断${book}属于${genre}。`, `${book}的叙述体例为${genre}。`, ["问题维度为叙述体例。"],
      ["不把纪传体/编年体与通史/断代史当成同一维度。", "不覆盖作者生平和全书篇目。"], [historyRef]),
    target(`cs-target-history-${slug}-scope`, "humanities-history", "history-genres",
      `能从记述范围维度判断${book}属于${scopeType}。`, `${book}的记述范围为${scopeType}。`, ["问题维度为记述范围。"],
      ["不把通史/断代史与纪传体/编年体当成同一维度。", "不覆盖具体记载年代和成书经过。"], [historyRef]),
  ]),
];

const questionTargets = [
  ["sound-pitch", ["cs-target-sound-pitch-frequency"], "direct"],
  ["sound-loudness", ["cs-target-sound-loudness-amplitude"], "direct-with-condition"],
  ["sound-timbre", ["cs-target-sound-timbre-identification"], "scenario"],
  ["history-shiji", ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope"], "combined-direct"],
  ["history-tongjian", ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"], "combined-cued"],
  ["history-hanshu", ["cs-target-history-hanshu-scope"], "direct"],
].map(([questionId, primaryTargetIds, checkPurpose]) => ({ questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose }));

const mnemonicPhraseTargets = [
  ["sound-memory", 0, ["cs-target-sound-pitch-frequency"], "complete-basic", "phrase-0"],
  ["sound-memory", 1, ["cs-target-sound-loudness-amplitude"], "conditional-basic", "phrase-1-condition"],
  ["sound-memory", 2, ["cs-target-sound-timbre-identification"], "complete-basic", "phrase-2"],
  ["history-genres-memory", 0, ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope"], "complete-basic", "phrase-0"],
  ["history-genres-memory", 1, ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"], "complete-basic", "phrase-1"],
  ["history-genres-memory", 2, ["cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope"], "complete-basic", "phrase-2"],
].map(([mnemonicId, phraseIndex, targetIds, coverageType, wrongAnswerReviewAnchor]) =>
  ({ mnemonicId, phraseIndex, targetIds, coverageType, wrongAnswerReviewAnchor }));

const comparisonRowTargets = [
  ["sound-features-comparison", 0, ["cs-target-sound-pitch-frequency"]],
  ["sound-features-comparison", 1, ["cs-target-sound-loudness-amplitude"]],
  ["sound-features-comparison", 2, ["cs-target-sound-timbre-identification"]],
  ["history-genres-comparison", 0, ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope"]],
  ["history-genres-comparison", 1, ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"]],
  ["history-genres-comparison", 2, ["cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope"]],
].map(([comparisonId, rowIndex, targetIds]) => ({ comparisonId, rowIndex, targetIds }));

module.exports = {
  schemaVersion: 1,
  revision: 1,
  targets,
  relations: { questionTargets, mnemonicPhraseTargets, comparisonRowTargets },
};
