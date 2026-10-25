// C4: two finite, source-backed emergency review topics. No frequency claim is made.
module.exports = function buildExamTopics(questions) {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
  const refsFor = (questionIds) => [...new Map(questionIds.flatMap((id) => byId[id].refs)
    .map((ref) => [ref.pointId + ":" + ref.tabId, ref])).values()];
  const topic = (data) => ({ ...data, revision: 1, status: "review", refs: refsFor(data.questionIds) });

  const examTopics = [
    topic({
      id: "sound-features-rescue", scope: "science-technology", groupId: "sound-features",
      title: "声音三特性基础补缺",
      task: "在一组题内分清音调、响度和音色，并识别响度判断所需的比较条件。",
      coverage: "声音三特性的基础对应关系，以及距离等其他条件相同时振幅与响度的比较。",
      excludes: ["不覆盖传播速度、超声与次声。", "不推导复杂听感，也不把本专题称为高频押题。"],
      inclusionReasons: ["三项概念在同一正文页签并列，适合集中区分。", "已有直接题、情境变式和条件题，可形成完整的判断与补缺链路。"],
      completionScope: "完成本组只表示已处理本专题 5 道题；答错、揭晓或标记内容进入个人待回顾。",
      targetIds: ["cs-target-sound-pitch-frequency", "cs-target-sound-loudness-amplitude", "cs-target-sound-timbre-identification"],
      mnemonicIds: ["sound-memory"], comparisonIds: ["sound-features-comparison"],
      questionIds: ["sound-pitch-timbre-scenario", "sound-loudness-condition", "sound-pitch", "sound-loudness", "sound-timbre"],
      questionSteps: [
        { questionId: "sound-pitch-timbre-scenario", role: "综合初判", reason: "声音三特性基础补缺 · 先分音调与音色" },
        { questionId: "sound-loudness-condition", role: "条件辨析", reason: "声音三特性基础补缺 · 检查响度条件" },
        { questionId: "sound-pitch", role: "直接补缺", reason: "声音三特性基础补缺 · 回到音调对应" },
        { questionId: "sound-loudness", role: "直接补缺", reason: "声音三特性基础补缺 · 回到响度对应" },
        { questionId: "sound-timbre", role: "情境复辨", reason: "声音三特性基础补缺 · 再辨音色用途" },
      ],
    }),
    topic({
      id: "history-genres-rescue", scope: "humanities-history", groupId: "history-genres",
      title: "三部史书分类补缺",
      task: "把叙述体例与记述范围分开判断，再完成《史记》《资治通鉴》《汉书》的配对。",
      coverage: "三部史书的纪传体或编年体，以及通史或断代史两个分类维度。",
      excludes: ["不覆盖作者生平、具体篇目、记载年代与成书经过。", "不扩展到全部史书体例，也不把本专题称为高频押题。"],
      inclusionReasons: ["两组分类词回答不同问题，集中对照可减少把它们当成互斥类别。", "已有整组对照题和单书直接题，可从综合判断回到具体缺口。"],
      completionScope: "完成本组只表示已处理本专题 5 道题；答错、揭晓或标记内容进入个人待回顾。",
      targetIds: ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope", "cs-target-history-tongjian-genre",
        "cs-target-history-tongjian-scope", "cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope"],
      mnemonicIds: ["history-genres-memory"], comparisonIds: ["history-genres-comparison"],
      questionIds: ["history-three-books-contrast", "history-hanshu-genre", "history-shiji", "history-tongjian", "history-hanshu"],
      questionSteps: [
        { questionId: "history-three-books-contrast", role: "综合初判", reason: "三部史书分类补缺 · 先做双维度配对" },
        { questionId: "history-hanshu-genre", role: "维度拆分", reason: "三部史书分类补缺 · 单独判断叙述体例" },
        { questionId: "history-shiji", role: "单书补缺", reason: "三部史书分类补缺 · 回看《史记》" },
        { questionId: "history-tongjian", role: "单书补缺", reason: "三部史书分类补缺 · 回看《资治通鉴》" },
        { questionId: "history-hanshu", role: "单书补缺", reason: "三部史书分类补缺 · 回看《汉书》" },
      ],
    }),
  ];
  return {
    schemaVersion: 1, revision: 1, examTopics,
    selectedExamTopicIds: examTopics.map((item) => item.id),
    dailyReuseQuestionIds: ["sound-loudness-condition", "history-hanshu-genre"],
    sessionMigrations: [{
      fromVersion: "4850e389", toPackVersion: "2026-10-21.4", changedQuestionIds: [], changedMnemonicIds: [], changedComparisonIds: [],
      changedExamTopicIds: examTopics.map((item) => item.id),
      reason: "C4 新增两个有限范围精选急救专题，并把两道已审核链路内的条件题显式复用于每日；既有未完成队列保持原顺序。",
    }],
  };
};
