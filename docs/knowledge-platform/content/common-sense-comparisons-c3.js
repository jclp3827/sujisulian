// C3: formalize the two pilot comparisons around stable dimensions and distinct question roles.
// The underlying facts still come from the canonical body references; supplemental sources remain review evidence only.
module.exports = function buildPilotComparisons(questions) {
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
  const refsFor = (questionIds) => [...new Map(questionIds.flatMap((id) => byId[id].refs)
    .map((ref) => [ref.pointId + ":" + ref.tabId, ref])).values()];
  const row = (id, label, condition, distinction, dimensionValues, questionIds, targetIds) => ({
    id, label, condition, distinction, dimensionValues, questionIds, targetIds, refs: refsFor(questionIds),
  });
  const comparison = (data) => ({ ...data, revision: 2, status: "review", refs: refsFor(data.questionIds) });

  const comparisons = [
    comparison({
      id: "sound-features-comparison", scope: "science-technology", groupId: "sound-features",
      title: "音调、响度、音色分别辨什么",
      confusionReason: "三个词都用于描述声音，答题时容易把高低、强弱和声音特点混成同一判断维度。",
      evidenceBasis: { editorial: "现有正文把三项并列讲解，原题的干扰项也互相使用三项名称。", observedErrorData: null },
      coverage: "只比较声音三特性的基本对应关系，以及本组三题中的判断条件。",
      excludes: ["不覆盖传播速度、超声与次声。", "不把振幅当成实际听到响度的唯一影响因素，不推导复杂听感。"],
      dimensions: [
        { id: "sound-question-focus", label: "题目在问什么" },
        { id: "sound-corresponding-factor", label: "基础对应量或识别依据" },
        { id: "sound-required-condition", label: "成立条件" },
      ],
      questionIds: ["sound-pitch-timbre-scenario", "sound-loudness-condition", "sound-timbre"],
      initialQuestionId: "sound-pitch-timbre-scenario",
      recheckQuestionIds: ["sound-loudness-condition", "sound-timbre"],
      questionRoles: [
        { questionId: "sound-pitch-timbre-scenario", role: "initial-judgement", checkPurpose: "scenario-contrast",
          focus: "在同一情境中先区分音调与音色，并排除频率必然改变响度。",
          targetIds: ["cs-target-sound-pitch-frequency", "cs-target-sound-timbre-identification"] },
        { questionId: "sound-loudness-condition", role: "recheck", checkPurpose: "boundary-condition",
          focus: "改用受控比较，复辨响度与振幅关系的前提。", targetIds: ["cs-target-sound-loudness-amplitude"] },
        { questionId: "sound-timbre", role: "recheck", checkPurpose: "scenario",
          focus: "改用人物声音辨认，复辨音色的用途。", targetIds: ["cs-target-sound-timbre-identification"] },
      ],
      rows: [
        row("sound-row-pitch", "音调：高低", "关注发声体振动的频率。",
          "频率对应音调；高音不等于大声，不用振幅判断音调高低。",
          { "sound-question-focus": "声音高低", "sound-corresponding-factor": "发声体振动频率", "sound-required-condition": "基础对应关系" },
          ["sound-pitch-timbre-scenario"], ["cs-target-sound-pitch-frequency"]),
        row("sound-row-loudness", "响度：强弱", "在距离等其他条件相同时，比较发声体振动的振幅。",
          "振幅对应响度；实际听到的响度还受距离等因素影响，不能只凭更响断定频率更高。",
          { "sound-question-focus": "声音强弱", "sound-corresponding-factor": "发声体振幅", "sound-required-condition": "距离等其他影响听感的条件相同" },
          ["sound-loudness-condition"], ["cs-target-sound-loudness-amplitude"]),
        row("sound-row-timbre", "音色：声音特点", "需要辨认不同人或不同发声体的声音时，主要利用音色。",
          "区分声音特点，不等于不同声音的音调、响度永远相同。",
          { "sound-question-focus": "辨认声音特点或来源", "sound-corresponding-factor": "音色", "sound-required-condition": "问题关注声音特点或来源辨认" },
          ["sound-pitch-timbre-scenario", "sound-timbre"], ["cs-target-sound-timbre-identification"]),
      ],
      caution: "先看题目问高低、强弱还是声音特点；比较响度时要保留其他条件相同这一前提。",
      supplementalSources: [{ title: "清华大学出版社《Processing创意编程》第11章试读", url: "https://www.tup.tsinghua.edu.cn/upload/books/yz/067003-01.pdf",
        locator: "印刷页210，PDF第2页：声音三特性的基本关系", checkedAt: "2026-10-21", retrieved: true }],
    }),
    comparison({
      id: "history-genres-comparison", scope: "humanities-history", groupId: "history-genres",
      title: "三部史书：体例与范围分开看",
      confusionReason: "纪传体、编年体描述叙述方式，通史、断代史描述记述范围；两组词常被误当成互斥分类。",
      evidenceBasis: { editorial: "现有正文用同一张表呈现三部史书，原题会同时询问体例和范围。", observedErrorData: null },
      coverage: "只对照《史记》《资治通鉴》《汉书》的叙述体例与记述范围，不扩展本组三题的学习目标。",
      excludes: ["不覆盖作者生平、成书经过、具体篇目和记载年代。", "不覆盖国别体、纪事本末体等全部史书体例。"],
      dimensions: [
        { id: "history-narrative-form", label: "叙述体例（怎样叙述）" },
        { id: "history-coverage-range", label: "记述范围（写多长时期）" },
      ],
      questionIds: ["history-three-books-contrast", "history-hanshu-genre", "history-tongjian"],
      initialQuestionId: "history-three-books-contrast",
      recheckQuestionIds: ["history-hanshu-genre", "history-tongjian"],
      questionRoles: [
        { questionId: "history-three-books-contrast", role: "initial-judgement", checkPurpose: "cross-book-contrast",
          focus: "先完整判断三部史书在两个维度上的配对。",
          targetIds: ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope", "cs-target-history-tongjian-genre",
            "cs-target-history-tongjian-scope", "cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope"] },
        { questionId: "history-hanshu-genre", role: "recheck", checkPurpose: "direct",
          focus: "改为只问叙述体例，复辨《汉书》的纪传体属性。", targetIds: ["cs-target-history-hanshu-genre"] },
        { questionId: "history-tongjian", role: "recheck", checkPurpose: "combined-direct",
          focus: "改为单书双维度归类，复辨《资治通鉴》的编年体与通史。",
          targetIds: ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"] },
      ],
      rows: [
        row("history-row-shiji", "《史记》", "分别从叙述体例和记述范围判断。",
          "与《汉书》同为纪传体但范围不同；与《资治通鉴》同为通史但体例不同。",
          { "history-narrative-form": "纪传体", "history-coverage-range": "通史" },
          ["history-three-books-contrast"], ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope"]),
        row("history-row-tongjian", "《资治通鉴》", "分别从叙述体例和记述范围判断。",
          "编年与纪传比较叙述体例；通史与断代史比较记述范围，两个维度要分别判断。",
          { "history-narrative-form": "编年体", "history-coverage-range": "通史" },
          ["history-three-books-contrast", "history-tongjian"], ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"]),
        row("history-row-hanshu", "《汉书》", "分别从叙述体例和记述范围判断。",
          "不能因《汉书》为断代史就否定它属于纪传体，也不能把三部书都记成通史。",
          { "history-narrative-form": "纪传体", "history-coverage-range": "断代史" },
          ["history-three-books-contrast", "history-hanshu-genre"], ["cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope"]),
      ],
      caution: "先分清问的是怎样叙述还是记述范围，再做配对；不把纪传体与断代史当成互斥类别。",
      supplementalSources: [{ title: "商务印书馆《中国古代著名史籍》官方目录", url: "https://www.cp.com.cn/book/7-100-02159-6_16.html",
        locator: "目录第一部分第1、2项及第五部分：三部史书分类", checkedAt: "2026-10-21", retrieved: true }],
    }),
  ];

  const comparisonSpecifications = comparisons.map((item) => ({
    comparisonId: item.id, revision: item.revision,
    dimensionIds: item.dimensions.map((dimension) => dimension.id),
    rowIds: item.rows.map((comparisonRow) => comparisonRow.id),
    initialQuestionId: item.initialQuestionId, recheckQuestionIds: item.recheckQuestionIds.slice(),
    requiredQuestionIds: item.questionIds.slice(), requiredTargetIds: [...new Set(item.rows.flatMap((comparisonRow) => comparisonRow.targetIds))],
  }));
  const comparisonRowTargetRelations = comparisons.flatMap((item) => item.rows.map((comparisonRow, rowIndex) => ({
    comparisonId: item.id, rowIndex, rowId: comparisonRow.id, targetIds: comparisonRow.targetIds.slice(),
  })));
  return {
    schemaVersion: 1, revision: 1, comparisons, comparisonSpecifications, comparisonRowTargetRelations,
    changedComparisonIds: comparisons.map((item) => item.id),
    confusionQuestionIds: comparisons.flatMap((item) => item.questionIds),
    sessionMigrations: [{
      fromVersion: "4a61e724", toPackVersion: "2026-10-21.3", changedQuestionIds: [], changedMnemonicIds: [],
      changedComparisonIds: comparisons.map((item) => item.id),
      reason: "C3 重编两组试点易混题目职责与比较契约；无关问答、口诀和法律易混会话继续，旧试点易混流程按新三题组重建。",
    }],
  };
};
