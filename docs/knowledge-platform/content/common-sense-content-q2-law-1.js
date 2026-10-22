"use strict";

// Q2 法律领域第一批：在不扩充题量的前提下，重写两个既有小主题，
// 补齐当前官方来源、可解释干扰项、变式过程和记忆形式处置。

const QUESTION_IDS = [
  "capacity-under-eight", "capacity-eight-plus", "capacity-labor",
  "inherit-first", "inherit-second", "inherit-inlaw",
];

const verificationSources = {
  "civil-code-cac-general-provisions": {
    title: "中华人民共和国民法典（总则编）",
    url: "https://www.cac.gov.cn/2020-06/01/c_1592561777268319.htm",
    publisher: "中央网络安全和信息化委员会办公室",
    version: "2020年5月28日通过，2021年1月1日起施行",
    checkedAt: "2026-10-22",
    retrieved: true,
  },
  "civil-code-cac-inheritance": {
    title: "中华人民共和国民法典（继承编）",
    url: "https://www.cac.gov.cn/2020-06/01/c_15925617772683195.htm",
    publisher: "中央网络安全和信息化委员会办公室",
    version: "2020年5月28日通过，2021年1月1日起施行",
    checkedAt: "2026-10-22",
    retrieved: true,
  },
};

const replacementRows = {
  "capacity-under-eight": {
    objective: "根据八周岁年龄界限判断无民事行为能力",
    prompt: "只考虑年龄且无其他特殊情形，7周岁的未成年人属于哪类民事行为能力人？",
    options: ["无民事行为能力人", "限制民事行为能力人", "完全民事行为能力人"],
    answer: 0,
    explanation: "《民法典》第二十条规定，不满八周岁的未成年人为无民事行为能力人，由法定代理人代理实施民事法律行为。",
    boundary: "这里只判断民事行为能力；自然人的民事权利能力始于出生，二者不能混同。",
    verification: { checkedAt: "2026-10-22", sourceIds: ["civil-code-cac-general-provisions"], locators: ["第13条", "第20条"] },
  },
  "capacity-eight-plus": {
    objective: "根据年龄、辨认能力和劳动收入例外判断限制民事行为能力",
    prompt: "一名10周岁、能够辨认自己行为的未成年人，不满足劳动收入例外。其民事行为能力通常如何认定？",
    options: ["按无民事行为能力人处理", "属于限制民事行为能力人", "视为完全民事行为能力人"],
    answer: 1,
    explanation: "八周岁以上的未成年人通常为限制民事行为能力人，可以独立实施纯获利益或与其年龄、智力相适应的民事法律行为。",
    boundary: "限制民事行为能力不等于所有行为都无效；题干也未满足十六周岁以上且以劳动收入为主要生活来源的例外。",
    verification: { checkedAt: "2026-10-22", sourceIds: ["civil-code-cac-general-provisions"], locators: ["第18条", "第19条"] },
  },
  "capacity-labor": {
    objective: "在情境中识别十六周岁以上未成年人的劳动收入例外",
    prompt: "17周岁的小周能够辨认自己的行为，并以自己的劳动收入为主要生活来源。依法应如何认定？",
    options: ["仍按限制民事行为能力人处理", "因有收入而直接成为成年人", "视为完全民事行为能力人"],
    answer: 2,
    explanation: "十六周岁以上的未成年人，以自己的劳动收入为主要生活来源的，视为完全民事行为能力人。",
    boundary: "“视为完全民事行为能力人”不等于年龄上成为成年人；偶尔取得收入也不等于以劳动收入为主要生活来源。",
    verification: { checkedAt: "2026-10-22", sourceIds: ["civil-code-cac-general-provisions"], locators: ["第17条", "第18条"] },
  },
  "inherit-first": {
    objective: "完整识别法定继承第一顺序的三类继承人",
    prompt: "配偶、子女、父母在法定继承中一般属于哪一顺序？",
    options: ["第二顺序继承人", "第一顺序继承人", "继承人以外酌情分得遗产的人"],
    answer: 1,
    explanation: "《民法典》第一千一百二十七条规定，第一顺序为配偶、子女、父母。",
    boundary: "这是法定继承的一般顺序；子女、父母的法定范围及遗嘱、遗赠扶养协议等另行判断。",
    verification: { checkedAt: "2026-10-22", sourceIds: ["civil-code-cac-inheritance"], locators: ["第1127条"] },
  },
  "inherit-second": {
    objective: "完整识别法定继承第二顺序的三类继承人",
    prompt: "兄弟姐妹、祖父母、外祖父母在法定继承中一般属于哪一顺序？",
    options: ["第一顺序继承人", "继承人以外酌情分得遗产的人", "第二顺序继承人"],
    answer: 2,
    explanation: "第二顺序为兄弟姐妹、祖父母、外祖父母；有第一顺序继承人继承时，第二顺序一般不继承。",
    boundary: "本题只判断一般顺序，不据此计算具体份额，也不展开代位继承。",
    verification: { checkedAt: "2026-10-22", sourceIds: ["civil-code-cac-inheritance"], locators: ["第1127条"] },
  },
  "inherit-inlaw": {
    objective: "依据丧偶和尽主要赡养义务两个条件判断姻亲的特别顺序",
    prompt: "丧偶儿媳对公婆尽了主要赡养义务，依法应如何处理其法定继承顺序？",
    options: ["作为第一顺序继承人", "作为第二顺序继承人", "仅可按继承人以外人员酌情分得遗产"],
    answer: 0,
    explanation: "丧偶儿媳对公婆、丧偶女婿对岳父母尽了主要赡养义务的，作为第一顺序继承人。",
    boundary: "必须同时保留丧偶和尽主要赡养义务两个条件，不能泛化为所有儿媳、女婿都属于第一顺序。",
    verification: { checkedAt: "2026-10-22", sourceIds: ["civil-code-cac-inheritance"], locators: ["第1129条"] },
  },
};

const distractorReasons = {
  "capacity-under-eight": { 1: "限制民事行为能力的一般年龄起点是八周岁，题干人物尚未达到。", 2: "完全民事行为能力不能仅凭能够辨认日常行为或接近八周岁认定。" },
  "capacity-eight-plus": { 0: "题干人物已满八周岁且能辨认自己的行为，不属于仅按不满八周岁处理的情形。", 2: "题干未达到成年人年龄，也不满足十六周岁以上劳动收入主要生活来源的例外。" },
  "capacity-labor": { 0: "题干同时满足十六周岁以上和劳动收入为主要生活来源，不再按一般限制行为能力规则处理。", 1: "有收入不会改变未成年人的年龄身份；法律效果是视为完全民事行为能力人。" },
  "inherit-first": { 0: "配偶、子女、父母属于第一顺序，不是第二顺序。", 2: "三类人员均是法定继承人，不适用继承人以外人员酌情分得遗产的规则。" },
  "inherit-second": { 0: "第一顺序为配偶、子女、父母，不包括题干列举的三类。", 1: "兄弟姐妹、祖父母、外祖父母属于法定继承人，并非继承人以外人员。" },
  "inherit-inlaw": { 1: "符合第1129条条件时直接作为第一顺序继承人，不进入第二顺序。", 2: "题干给出了第1129条的特别条件，不仅是继承人以外人员酌情分得遗产。" },
};

const targetRows = {
  "q0b-target-capacity-under-eight": ["能区分民事权利能力与民事行为能力，并按不满八周岁条件判断无民事行为能力。", "不满八周岁的未成年人为无民事行为能力人，由法定代理人代理实施民事法律行为。", ["只按题干给出的年龄和辨认能力判断。"], ["不把从出生起享有的民事权利能力混入行为能力分类。"]],
  "q0b-target-capacity-eight-plus": ["能结合八周岁以上、未满十八周岁、辨认能力和劳动收入例外判断限制民事行为能力。", "八周岁以上的未成年人通常为限制民事行为能力人，并保留纯获利益或与年龄、智力相适应行为的独立实施范围。", ["题干不满足十六周岁以上劳动收入主要生活来源的例外。"], ["不把限制民事行为能力理解为所有行为都无效。"]],
  "q0b-target-capacity-labor": ["能在情境中同时识别十六周岁以上和劳动收入为主要生活来源两个条件。", "同时满足两个条件的未成年人视为完全民事行为能力人。", ["十六周岁以上；以自己的劳动收入为主要生活来源。"], ["不把偶尔有收入等同于主要生活来源，不把视为完全民事行为能力人等同于年龄上成年。"]],
  "q0b-target-inherit-first": ["能完整识别配偶、子女、父母属于法定继承第一顺序。", "法定继承第一顺序为配偶、子女、父母。", ["按法定继承的一般顺序判断。"], ["不在本题展开三类亲属的法定范围、份额及其他继承方式。"]],
  "q0b-target-inherit-second": ["能完整识别兄弟姐妹、祖父母、外祖父母属于法定继承第二顺序。", "法定继承第二顺序为兄弟姐妹、祖父母、外祖父母；第一顺序有人继承时第二顺序一般不继承。", ["按法定继承的一般顺序判断。"], ["不在本题展开代位继承和具体遗产份额。"]],
  "q0b-target-inherit-inlaw": ["能根据丧偶和尽主要赡养义务两个条件识别姻亲的第一顺序继承资格。", "丧偶儿媳对公婆、丧偶女婿对岳父母尽主要赡养义务的，作为第一顺序继承人。", ["丧偶；对相应父母尽了主要赡养义务。"], ["不泛化到所有儿媳、女婿或其他姻亲。"]],
};

const cognitiveLevels = {
  "capacity-under-eight": "condition", "capacity-eight-plus": "condition", "capacity-labor": "application",
  "inherit-first": "mapping", "inherit-second": "mapping", "inherit-inlaw": "condition",
};

const processDifferences = {
  "q0b-target-capacity-under-eight": "直接题核对不满八周岁；变式分别加入八周岁以上的一般规则和十六周岁以上劳动收入例外。",
  "q0b-target-capacity-eight-plus": "直接题同时排除不满八周岁与劳动收入例外；变式分别回到年龄下界和劳动收入例外。",
  "q0b-target-capacity-labor": "直接题在生活情境中同时核对年龄与主要生活来源；变式检验缺少例外条件时的通常分类。",
  "q0b-target-inherit-first": "直接题完整识别第一顺序三类；变式分别检验第二顺序及丧偶姻亲特别规则。",
  "q0b-target-inherit-second": "直接题完整识别第二顺序三类；变式分别检验第一顺序和第一顺序特别规则。",
  "q0b-target-inherit-inlaw": "直接题核对丧偶与主要赡养两个条件；变式回到一般第一、第二顺序清单。",
};

const directByTarget = {
  "q0b-target-capacity-under-eight": "capacity-under-eight",
  "q0b-target-capacity-eight-plus": "capacity-eight-plus",
  "q0b-target-capacity-labor": "capacity-labor",
  "q0b-target-inherit-first": "inherit-first",
  "q0b-target-inherit-second": "inherit-second",
  "q0b-target-inherit-inlaw": "inherit-inlaw",
};

const groupQuestionIds = {
  "minor-capacity": QUESTION_IDS.slice(0, 3),
  "inheritance-order": QUESTION_IDS.slice(3),
};

const mnemonicDispositions = [
  { groupId: "minor-capacity", decision: "not-suitable", resourceId: null, reason: "判断依赖年龄、辨认能力、主要生活来源及行为效力边界；数字压缩会丢失决定性条件，采用三例辨析。" },
  { groupId: "inheritance-order", decision: "retain-as-study-outline", resourceId: "inheritance-order-memory", reason: "现有内容按两顺序和特别规则分组，便于快速回看，但主要仍是法律原词压缩，尚无记忆增益试验证据，不标为正式口诀。" },
];

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留考点与稳定 ID，重写题干、干扰项、逐项理由及当前官方核验信息。",
}));

function replaceById(items, rows, mapper) {
  return items.map((item) => rows[item.id] ? mapper(item, rows[item.id]) : item);
}

function applyQuestions(questions) {
  return replaceById(questions, replacementRows, (question, row) => ({ ...question, ...row, revision: question.revision + 1 }));
}

function applyTargets(targets) {
  return replaceById(targets, targetRows, (target, row) => ({
    ...target, revision: target.revision + 1, statement: row[0], conclusion: row[1], conditions: row[2], excludes: row[3],
    verification: replacementRows[directByTarget[target.id]].verification,
  }));
}

function relationFor(questionId, previous) {
  return { ...previous, checkPurpose: `q2-${cognitiveLevels[questionId]}` };
}

function applyQuestionTargetRelations(relations) {
  return relations.map((relation) => QUESTION_IDS.includes(relation.questionId) ? relationFor(relation.questionId, relation) : relation);
}

function applyQuestionSpecifications(specifications) {
  return specifications.map((specification) => QUESTION_IDS.includes(specification.questionId) ? {
    ...relationFor(specification.questionId, specification),
    cognitiveLevel: cognitiveLevels[specification.questionId],
    distractorReasons: distractorReasons[specification.questionId],
  } : specification);
}

function applyVariationDecisions(decisions) {
  return decisions.map((decision) => {
    const directId = directByTarget[decision.targetId];
    if (!directId) return decision;
    const groupId = QUESTION_IDS.slice(0, 3).includes(directId) ? "minor-capacity" : "inheritance-order";
    return {
      targetId: decision.targetId,
      directQuestionIds: [directId],
      variationQuestionIds: groupQuestionIds[groupId].filter((id) => id !== directId),
      processDifference: processDifferences[decision.targetId],
    };
  });
}

function applyGroups(groups) {
  return groups.map((group) => {
    if (group.id === "minor-capacity") return { ...group, mnemonicDecision: "not-suitable", mnemonicReason: mnemonicDispositions[0].reason };
    if (group.id === "inheritance-order") return { ...group, mnemonicDecision: "study-outline", mnemonicReason: mnemonicDispositions[1].reason };
    return group;
  });
}

function applyMnemonics(mnemonics) {
  return mnemonics.map((mnemonic) => mnemonic.id === "inheritance-order-memory" ? {
    ...mnemonic,
    revision: mnemonic.revision + 1,
    learningForm: "study-outline",
    formLabel: "速记提纲",
    verification: {
      checkedAt: "2026-10-22",
      sourceIds: ["civil-code-cac-inheritance"],
      locators: ["第1127条", "第1129条"],
    },
    phrases: mnemonic.phrases.map((phrase) => ({
      ...phrase,
      checks: phrase.checks.map((check) => ({
        ...check,
        checkPurpose: `q2-${cognitiveLevels[check.questionId]}`,
      })),
    })),
  } : mnemonic);
}

function applyMnemonicSpecifications(specifications) {
  return specifications.map((specification) => specification.mnemonicId === "inheritance-order-memory"
    ? { ...specification, revision: specification.revision + 1 }
    : specification);
}

function applyMnemonicPhraseTargetRelations(relations) {
  return relations.map((relation) => relation.mnemonicId === "inheritance-order-memory"
    ? { ...relation, coverageType: "study-outline-recall" }
    : relation);
}

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-law-1",
  status: "review",
  QUESTION_IDS,
  verificationSources,
  replacementRows,
  distractorReasons,
  targetRows,
  cognitiveLevels,
  processDifferences,
  questionDispositions,
  mnemonicDispositions,
  applyQuestions,
  applyTargets,
  applyQuestionTargetRelations,
  applyQuestionSpecifications,
  applyVariationDecisions,
  applyGroups,
  applyMnemonics,
  applyMnemonicSpecifications,
  applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{
    fromVersion: "2026102266",
    toPackVersion: "2026-10-22.67",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["inheritance-order-memory"],
    reason: "Q2 法律第一批重写两主题的题干、干扰项、边界与官方核验信息；既有会话按迁移规则失效后使用新版资源重建。",
  }],
};
