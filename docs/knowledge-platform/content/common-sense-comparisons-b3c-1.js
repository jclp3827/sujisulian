// B3c-1: reuse the existing questions and their canonical body references.
// Supplemental reading is evidence for review, never content approval.
module.exports = function comparisons(questions) {
  const byId = Object.fromEntries(questions.map((q) => [q.id, q]));
  function comparison(id, groupId, title, coverage, excludes, items, caution, supplementalSources) {
    const rows = items.map(([questionId, label, condition, distinction]) => ({
      label, condition, distinction, questionIds: [questionId], refs: byId[questionId].refs,
    }));
    const questionIds = items.map((i) => i[0]);
    const refs = [...new Map(rows.flatMap((r) => r.refs).map((r) => [r.pointId + ":" + r.tabId, r])).values()];
    return { id, revision: 1, status: "review", scope: byId[questionIds[0]].scope, groupId, title, coverage, excludes, caution,
      questionIds, initialQuestionId: questionIds[0], recheckQuestionIds: questionIds.slice(1), rows, refs, supplementalSources };
  }
  return [
    comparison("sound-features-comparison", "sound-features", "音调、响度、音色分别辨什么", "只比较声音三特性的基本对应关系，以及本组三题中的判断条件。", [
      "不覆盖传播速度、超声与次声。", "不把振幅当成实际听到响度的唯一影响因素，不推导复杂听感。",
    ], [
      ["sound-pitch", "音调：高低", "关注发声体振动的频率。", "频率对应音调；高音不等于大声，不用振幅判断音调高低。"],
      ["sound-loudness", "响度：强弱", "在距离等其他条件相同时，比较发声体振动的振幅。", "振幅对应响度；实际听到的响度还受距离等因素影响，不能只凭更响断定频率更高。"],
      ["sound-timbre", "音色：声音特点", "需要辨认不同人的声音时，主要利用音色。", "区分声音特点，不等于不同人的音调、响度永远相同。"],
    ], "先看题目问高低、强弱还是声音特点；比较响度时要保留其他条件相同这一前提。", [
      { title: "清华大学出版社《Processing创意编程》第11章试读", url: "https://www.tup.tsinghua.edu.cn/upload/books/yz/067003-01.pdf",
        locator: "印刷页210，PDF第2页：声音三特性的基本关系", checkedAt: "2026-10-21", retrieved: true },
    ]),
    comparison("history-genres-comparison", "history-genres", "三部史书：体例与范围分开看", "只对照《史记》《资治通鉴》《汉书》的叙述体例与记述范围，不扩展本组三题的学习目标。", [
      "不覆盖作者生平、成书经过、具体篇目和记载年代。", "不覆盖国别体、纪事本末体等全部史书体例。",
    ], [
      ["history-shiji", "《史记》", "叙述体例为纪传体，记述范围为通史。", "与《汉书》同为纪传体，但记述范围不同；与《资治通鉴》同为通史，但叙述体例不同。"],
      ["history-tongjian", "《资治通鉴》", "叙述体例为编年体，记述范围为通史。", "编年与纪传比较叙述体例；通史与断代史比较记述范围，两个维度要分别判断。"],
      ["history-hanshu", "《汉书》", "叙述体例为纪传体，记述范围为断代史。", "不能因《汉书》为断代史就否定它属于纪传体，也不能把三部书都记成通史。"],
    ], "先分清问的是怎样叙述还是记述范围，再做配对；不把纪传体与断代史当成互斥类别。", [
      { title: "商务印书馆《中国古代著名史籍》官方目录", url: "https://www.cp.com.cn/book/7-100-02159-6_16.html",
        locator: "目录第一部分第1、2项及第五部分：三部史书分类", checkedAt: "2026-10-21", retrieved: true },
    ]),
  ];
};
