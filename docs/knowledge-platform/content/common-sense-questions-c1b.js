// C1b authored question batch. These candidates only extend the Q&A entry.
const { ref, question } = require("./learning-authoring");

const sound = ref("acoustics", "sound-characteristics", "cs-16-22-p13-sound-characteristics-list");
const history = ref("fiction-history-modern-literature", "historiography-works", "cs-10-15-p9-historiography-table");

const replacementQuestions = [
  {
    ...question("history-tongjian", "humanities-history", "history-genres", "资治通鉴为编年体通史",
      "只从叙述体例和记述范围看，《资治通鉴》应如何归类？",
      ["纪传体通史", "编年体通史", "编年体断代史"], 1,
      "《资治通鉴》的叙述体例是编年体，记述范围是通史；两个维度合起来是编年体通史。",
      "本题不借作者信息提示答案，也不扩展到具体记载年代和成书经过。", [history]),
    revision: 2,
  },
];

const addedQuestions = [
  question("sound-pitch-timbre-scenario", "science-technology", "sound-features", "在同一情境中区分音调与音色",
    "甲、乙两件乐器以相同响度演奏同一音调，人仍能分辨乐器；若提高甲发声体的振动频率，哪项判断正确？",
    ["分辨乐器主要靠音色，甲的音调会升高", "分辨乐器主要靠响度，甲的音调不变", "分辨乐器主要靠频率，甲的响度一定增大"], 0,
    "辨认不同乐器的声音特点主要利用音色；发声体振动频率提高，对应音调升高。",
    "题干已把初始响度和音调设为相同；结论不表示频率提高会使响度必然增大。", [sound]),
  question("sound-loudness-condition", "science-technology", "sound-features", "识别响度与振幅关系的比较条件",
    "比较发声体振幅与响度的关系时，哪种设置最能支持“振幅越大，响度越大”的判断？",
    ["距离等其他条件相同，只改变振幅", "同时改变振幅和听者距离", "只知道其中一个声音的音调更高"], 0,
    "要比较振幅与响度的基础对应关系，应保持距离等其他影响听感的条件相同，只改变振幅。",
    "实际听到的响度还可能受距离等因素影响；不能在多个条件同时变化时只归因于振幅。", [sound]),
  question("history-hanshu-genre", "humanities-history", "history-genres", "直接判断汉书的叙述体例",
    "只问叙述体例，《汉书》属于哪一类？", ["纪传体", "编年体", "国别体"], 0,
    "《汉书》的叙述体例是纪传体；它的记述范围另属于断代史。",
    "纪传体回答怎样叙述，断代史回答记述范围，二者不是互斥选项。", [history]),
  question("history-three-books-contrast", "humanities-history", "history-genres", "对照三部史书的体例与范围",
    "哪组把三部史书的叙述体例和记述范围都配对正确？",
    [
      "《史记》—纪传体通史；《资治通鉴》—编年体通史；《汉书》—纪传体断代史",
      "《史记》—编年体通史；《资治通鉴》—纪传体通史；《汉书》—纪传体断代史",
      "《史记》—纪传体断代史；《资治通鉴》—编年体断代史；《汉书》—纪传体通史",
    ], 0,
    "《史记》是纪传体通史，《资治通鉴》是编年体通史，《汉书》是纪传体断代史。先判断体例，再判断范围。",
    "本题只对照三部史书的两个分类维度，不检测作者、篇目、记载年代或成书经过。", [history]),
];

const spec = (questionId, primaryTargetIds, checkPurpose, distractorReasons, supportingTargetIds = []) =>
  ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose, distractorReasons });

const questionSpecifications = [
  spec("sound-pitch", ["cs-target-sound-pitch-frequency"], "direct", {
    0: "振幅对应响度大小，不决定音调高低。", 2: "外观颜色不是正文所列声音特性与振动量的对应关系。",
  }),
  spec("sound-loudness", ["cs-target-sound-loudness-amplitude"], "direct-with-condition", {
    1: "频率对应音调高低。", 2: "音色用于辨别不同声音的特点，不是发声体振动量。",
  }),
  spec("sound-timbre", ["cs-target-sound-timbre-identification"], "scenario", {
    0: "响度描述声音强弱。", 1: "音调描述声音高低。",
  }),
  spec("sound-pitch-timbre-scenario", ["cs-target-sound-pitch-frequency", "cs-target-sound-timbre-identification"], "scenario-contrast", {
    1: "辨别乐器主要利用音色；频率提高时音调会变化。", 2: "频率对应音调，不能由频率提高推出响度一定增大。",
  }),
  spec("sound-loudness-condition", ["cs-target-sound-loudness-amplitude"], "boundary-condition", {
    1: "距离与振幅同时变化，无法只把响度差异归因于振幅。", 2: "音调高低对应频率，不能替代振幅与响度的受控比较。",
  }),
  spec("history-shiji", ["cs-target-history-shiji-genre", "cs-target-history-shiji-scope"], "combined-direct", {
    0: "编年体通史对应《资治通鉴》，不是《史记》。", 2: "纪传体断代史对应《汉书》，《史记》的范围是通史。",
  }),
  spec("history-tongjian", ["cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope"], "combined-direct", {
    0: "纪传体通史对应《史记》，《资治通鉴》的体例是编年体。", 2: "《资治通鉴》是通史，不是断代史。",
  }),
  spec("history-hanshu", ["cs-target-history-hanshu-scope"], "direct", {
    1: "《汉书》本身属于纪传体；该选项也没有回答通史与断代史的范围区别。", 2: "断代史并不等于只记录一年。",
  }),
  spec("history-hanshu-genre", ["cs-target-history-hanshu-genre"], "direct", {
    1: "《汉书》不是编年体。", 2: "《汉书》不是国别体。",
  }),
  spec("history-three-books-contrast", [
    "cs-target-history-shiji-genre", "cs-target-history-shiji-scope",
    "cs-target-history-tongjian-genre", "cs-target-history-tongjian-scope",
    "cs-target-history-hanshu-genre", "cs-target-history-hanshu-scope",
  ], "cross-book-contrast", {
    1: "该项把《史记》和《资治通鉴》的叙述体例对调。", 2: "该项把三部史书的记述范围配错。",
  }),
];

const variationDecisions = [
  ["cs-target-sound-pitch-frequency", ["sound-pitch"], ["sound-pitch-timbre-scenario"]],
  ["cs-target-sound-loudness-amplitude", ["sound-loudness"], ["sound-loudness-condition"]],
  ["cs-target-sound-timbre-identification", ["sound-timbre"], ["sound-pitch-timbre-scenario"]],
  ["cs-target-history-shiji-genre", ["history-shiji"], ["history-three-books-contrast"]],
  ["cs-target-history-shiji-scope", ["history-shiji"], ["history-three-books-contrast"]],
  ["cs-target-history-tongjian-genre", ["history-tongjian"], ["history-three-books-contrast"]],
  ["cs-target-history-tongjian-scope", ["history-tongjian"], ["history-three-books-contrast"]],
  ["cs-target-history-hanshu-genre", ["history-hanshu-genre"], ["history-three-books-contrast"]],
  ["cs-target-history-hanshu-scope", ["history-hanshu"], ["history-three-books-contrast"]],
].map(([targetId, directQuestionIds, variationQuestionIds]) => ({ targetId, directQuestionIds, variationQuestionIds }));

const additionsByGroup = {
  "sound-features": ["sound-pitch-timbre-scenario", "sound-loudness-condition"],
  "history-genres": ["history-hanshu-genre", "history-three-books-contrast"],
};

function applyQuestions(questions) {
  const replacements = new Map(replacementQuestions.map((item) => [item.id, item]));
  return questions.map((item) => replacements.get(item.id) || item).concat(addedQuestions);
}

function applyGroups(groups) {
  return groups.map((group) => additionsByGroup[group.id]
    ? { ...group, questionIds: group.questionIds.concat(additionsByGroup[group.id]) }
    : group);
}

module.exports = {
  schemaVersion: 1,
  revision: 1,
  replacementQuestions,
  addedQuestions,
  questionSpecifications,
  questionTargetRelations: questionSpecifications.map(({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose }) =>
    ({ questionId, primaryTargetIds, supportingTargetIds, checkPurpose })),
  variationDecisions,
  qaQuestionIds: addedQuestions.map((item) => item.id),
  sessionMigrations: [{
    fromVersion: "c2e0d622",
    toPackVersion: "2026-10-21.1",
    changedQuestionIds: ["history-tongjian"],
    reason: "C1b 仅重写《资治通鉴》题干与选项；新增题不插入既有未完成队列。",
  }],
  applyQuestions,
  applyGroups,
};
