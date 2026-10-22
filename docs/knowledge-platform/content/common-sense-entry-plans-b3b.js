// Explicit editorial enrollment. New content is not automatically assigned to an entry.
const groups = [
  "poet-titles", "sound-features", "fx-quotation", "schools-pairing", "history-genres",
  "light-phenomena", "heat-mechanisms", "substance-classification", "demand-supply-roles",
  "macro-four-goals", "fiscal-monetary", "minor-capacity", "inheritance-order",
  "civil-principles-compare", "constitution-chapters",
];
// Static target snapshots: adding questions to an existing theme does not enroll them.
const questions = [
  "poet-immortal", "poet-sage", "poet-history", "sound-pitch", "sound-loudness", "sound-timbre", "fx-direct", "fx-indirect", "fx-context",
  "school-lao", "school-mo", "school-fa", "history-shiji", "history-tongjian", "history-hanshu", "light-shadow", "light-reflection", "light-refraction",
  "heat-conduction", "heat-convection", "heat-radiation", "substance-pure", "substance-simple", "substance-compound",
  "demand-conditions", "supply-conditions", "demand-wish", "macro-growth", "macro-jobs-prices", "macro-balance",
  "policy-fiscal", "policy-monetary", "policy-bond-purchase", "capacity-under-eight", "capacity-eight-plus", "capacity-labor",
  "inherit-first", "inherit-second", "inherit-inlaw", "civil-equality", "civil-voluntary", "civil-fairness",
  "constitution-first", "constitution-second", "constitution-fourth",
];
const nonMnemonicQuestions = ["capacity-under-eight", "capacity-eight-plus", "capacity-labor", "civil-equality", "civil-voluntary", "civil-fairness"];
const comparisonQuestions = nonMnemonicQuestions.concat([
  "sound-pitch-timbre-scenario", "sound-loudness-condition", "sound-timbre",
  "history-three-books-contrast", "history-hanshu-genre", "history-tongjian",
]);
const c1bQuestions = require("./common-sense-questions-c1b").qaQuestionIds;
const c4DailyReuseQuestionIds = ["sound-loudness-condition", "history-hanshu-genre"];
const c4SelectedExamTopicIds = ["sound-features-rescue", "history-genres-rescue"];
module.exports = {
  schemaVersion: 1, revision: 6,
  modes: {
    qa: { strategy: "least-recent-question", groupIds: groups.slice(), questionIds: questions.concat(c1bQuestions),
      coverage: "已开放主题中的明确学习目标，可按领域或主题练习。",
      excludes: ["不代表全书全部考点。", "未编入本入口的新增主题不会自动出现。"] },
    daily: { strategy: "due-review-then-new-theme", groupIds: groups.slice(), questionIds: questions.concat(c4DailyReuseQuestionIds), maxItems: 5, maxReview: 2,
      featuredQuestionIds: c4DailyReuseQuestionIds.slice(),
      coverage: "从本批已编排主题中安排到期回顾与一组新知。",
      excludes: ["不因当天完成而无限追加新题。", "不以当日题数推定完整领域覆盖或掌握程度。"] },
    mnemonic: { strategy: "least-recent-reading", maxItems: 5,
      questionIds: questions.filter((id) => !nonMnemonicQuestions.includes(id)).concat(["sound-loudness-condition", "history-hanshu-genre"]),
      mnemonicIds: ["poet-memory", "sound-memory", "fx-memory", "schools-pairing-memory", "history-genres-memory",
        "light-phenomena-memory", "heat-mechanisms-memory", "substance-classification-memory", "demand-supply-roles-memory",
        "macro-four-goals-memory", "fiscal-monetary-memory", "inheritance-order-memory", "constitution-chapters-memory"],
      coverage: "每条口诀只覆盖自己的目标清单，逐句理解后可做对应自测。",
      excludes: ["不默认覆盖整节或整章。", "不适合口诀的目标保留对照学习，不硬凑记法。"] },
    confusion: { strategy: "rotate-comparison", comparisonIds: ["minor-capacity-comparison", "civil-principles-comparison", "sound-features-comparison", "history-genres-comparison"], questionIds: comparisonQuestions.slice(),
      coverage: "只学习已编排完整初判、差异对照和复辨的主题。",
      excludes: ["不把所有问答自动归为易混。", "只按各对照卡声明的条件与范围比较。"] },
    exam: { strategy: "curated-or-personal-review", selectedGroupIds: groups.slice(), reviewGroupIds: groups.slice(),
      selectedQuestionIds: questions.concat(c1bQuestions), reviewQuestionIds: questions.concat(c1bQuestions),
      selectedExamTopicIds: c4SelectedExamTopicIds.slice(),
      coverage: "精选回看只从两个已声明急救专题组题；个人待回顾只选本人答错、揭晓或标记再看的内容。",
      excludes: ["精选不代表高频、押题或完整考前范围。", "个人待回顾为空时不自动换成精选。"] },
  },
};
