"use strict";

// Q2 法律领域第二批：民法基本原则辨析、宪法章节定位。
// 保留稳定 ID 和题量，改写为可解释的应用/定位题，并完成记忆形式处置。

const QUESTION_IDS = [
  "civil-equality", "civil-voluntary", "civil-fairness",
  "constitution-first", "constitution-second", "constitution-fourth",
];

const verificationSources = {
  "constitution-locpg-2018": {
    title: "中华人民共和国宪法（2018年修正文本）",
    url: "https://www.locpg.gov.cn/fzfz/zhrmghgxf/index.htm",
    publisher: "中央人民政府驻香港特别行政区联络办公室",
    version: "根据2018年3月11日宪法修正案修正",
    checkedAt: "2026-10-22",
    retrieved: true,
  },
};

const civilVerification = {
  checkedAt: "2026-10-22",
  sourceIds: ["civil-code-cac-general-provisions"],
  locators: ["第4条", "第5条", "第6条", "第8条"],
};
const constitutionVerification = {
  checkedAt: "2026-10-22",
  sourceIds: ["constitution-locpg-2018"],
  locators: ["目录：序言、第一至四章", "第四章章名"],
};

const replacementRows = {
  "civil-equality": {
    objective: "在民事关系中识别主体法律地位平等",
    prompt: "甲因行政级别高，主张自己在与乙的普通买卖关系中当然享有更高法律地位。该主张首先违背哪项民法基本原则？",
    options: ["公平原则", "自愿原则", "平等原则"],
    answer: 2,
    explanation: "民事主体在民事活动中的法律地位一律平等，行政级别不会使一方在普通民事关系中当然取得更高法律地位。",
    boundary: "本题只辨认民事主体法律地位；平等原则不等于双方经济实力、权利义务内容必须完全相同。",
    verification: civilVerification,
  },
  "civil-voluntary": {
    objective: "在合法边界内识别意思自治所体现的自愿原则",
    prompt: "在不违反法律和公序良俗的前提下，双方自主决定是否订立合同并协商合同内容，主要体现哪项原则？",
    options: ["自愿原则", "平等原则", "诚信原则"],
    answer: 0,
    explanation: "民事主体按照自己的意思设立、变更、终止民事法律关系，体现自愿原则。",
    boundary: "自愿原则受法律和公序良俗约束，不能据此排除强制性规定。",
    verification: civilVerification,
  },
  "civil-fairness": {
    objective: "根据权利义务和风险的合理安排识别公平原则",
    prompt: "合同双方确定权利义务时兼顾彼此利益，并合理分配履约风险，主要体现哪项原则？",
    options: ["自愿原则", "公平原则", "平等原则"],
    answer: 1,
    explanation: "合理确定各方权利和义务、兼顾利益并合理分配风险，主要体现公平原则。",
    boundary: "复杂案件可能同时涉及多项原则；本题只根据题干给出的直接判断线索作答。",
    verification: civilVerification,
  },
  "constitution-first": {
    objective: "根据现行宪法目录识别序言之后的第一章",
    prompt: "根据现行宪法目录，序言之后列出的第一章是？",
    options: ["总纲", "国家机构", "公民的基本权利和义务"],
    answer: 0,
    explanation: "现行宪法先列序言，第一章为总纲。",
    boundary: "序言单列在各章之前，不计作第一章。",
    verification: constitutionVerification,
  },
  "constitution-second": {
    objective: "根据现行宪法目录定位公民基本权利和义务",
    prompt: "“公民的基本权利和义务”在现行宪法目录中列为哪一章？",
    options: ["第一章", "第二章", "第三章"],
    answer: 1,
    explanation: "第二章是公民的基本权利和义务，第三章是国家机构，章序与题干不符。",
    boundary: "本题只定位章节，不代替具体权利义务条文学习。",
    verification: constitutionVerification,
  },
  "constitution-fourth": {
    objective: "完整识别现行宪法第四章章名的四项内容",
    prompt: "哪组内容全部列入现行宪法第四章章名？",
    options: ["总纲、国旗、国徽、首都", "国旗、国务院、国徽、首都", "国旗、国歌、国徽、首都"],
    answer: 2,
    explanation: "第四章章名为“国旗、国歌、国徽、首都”。",
    boundary: "国家机构位于第三章；不能从第四章章名中删去国歌或国徽。",
    verification: constitutionVerification,
  },
};

const distractorReasons = {
  "civil-equality": { 0: "公平原则关注合理确定权利义务，不能解释行政级别带来的所谓民事地位优越。", 1: "自愿原则关注意思自治，题干争议直接指向双方民事法律地位。" },
  "civil-voluntary": { 1: "平等原则解决民事主体法律地位问题，不直接表达是否订约和如何约定。", 2: "诚信原则要求秉持诚实、恪守承诺，题干重点是自主决定和协商内容。" },
  "civil-fairness": { 0: "自愿原则强调意思自治，不能替代对权利义务与风险安排是否合理的判断。", 2: "平等原则强调主体法律地位平等，题干强调的是具体利益和风险安排。" },
  "constitution-first": { 1: "国家机构列在第三章，不是序言之后的第一章。", 2: "公民的基本权利和义务列在第二章。" },
  "constitution-second": { 0: "第一章是总纲，不是公民基本权利和义务。", 2: "第三章是国家机构，章序与题干不符。" },
  "constitution-fourth": { 0: "总纲是第一章章名，不属于第四章章名。", 1: "国务院属于第三章国家机构，不属于第四章章名。" },
};

const targetRows = {
  "q0b-target-civil-equality": ["能在普通民事关系中识别主体法律地位平等，并排除行政级别等身份造成的当然优越。", "民事主体在民事活动中的法律地位一律平等。", ["题干属于平等主体之间的普通民事关系。"], ["不把法律地位平等等同于经济实力或具体权利义务完全相同。"]],
  "q0b-target-civil-voluntary": ["能在合法与公序良俗边界内识别自主订约和协商内容体现自愿原则。", "民事主体按照自己的意思设立、变更、终止民事法律关系，体现自愿原则。", ["自主决定须在不违反法律和公序良俗的范围内。"], ["不把自愿理解为可以排除强制性规定。"]],
  "q0b-target-civil-fairness": ["能根据权利义务、利益和风险的合理安排识别公平原则。", "民事主体应当遵循公平原则，合理确定各方权利和义务。", ["题干直接呈现权利义务或风险的合理安排。"], ["不凭单个词给复杂案件作唯一原则归类。"]],
  "q0b-target-constitution-first": ["能根据现行宪法目录识别序言之后第一章为总纲。", "现行宪法目录先列序言，第一章为总纲。", ["按2018年修正文本目录判断。"], ["不把序言计作一个章。"]],
  "q0b-target-constitution-second": ["能根据现行宪法目录定位第二章公民的基本权利和义务、第三章国家机构。", "第二章为公民的基本权利和义务，第三章为国家机构。", ["按2018年修正文本目录判断。"], ["不以章节定位替代具体条文学习。"]],
  "q0b-target-constitution-fourth": ["能完整识别现行宪法第四章章名包含国旗、国歌、国徽和首都。", "第四章章名为国旗、国歌、国徽、首都。", ["按2018年修正文本目录判断。"], ["不把第三章的国家机构内容混入，不删去国歌或国徽。"]],
};

const cognitiveLevels = {
  "civil-equality": "application", "civil-voluntary": "application", "civil-fairness": "application",
  "constitution-first": "mapping", "constitution-second": "mapping", "constitution-fourth": "mapping",
};

const processDifferences = {
  "q0b-target-civil-equality": "直接题从身份差异情境判断法律地位；变式分别检验意思自治和权利义务合理安排。",
  "q0b-target-civil-voluntary": "直接题在合法边界内判断自主订约；变式分别检验主体地位与风险安排。",
  "q0b-target-civil-fairness": "直接题从利益和风险安排判断；变式分别检验法律地位和自主决定。",
  "q0b-target-constitution-first": "直接题从序言之后定位第一章；变式分别定位第二章和第四章。",
  "q0b-target-constitution-second": "直接题由章名反推第二章；变式分别从章序和第四章内容定位。",
  "q0b-target-constitution-fourth": "直接题从四组内容中排除跨章混项；变式分别核对第一章与第二章章名。",
};

const directByTarget = {
  "q0b-target-civil-equality": "civil-equality",
  "q0b-target-civil-voluntary": "civil-voluntary",
  "q0b-target-civil-fairness": "civil-fairness",
  "q0b-target-constitution-first": "constitution-first",
  "q0b-target-constitution-second": "constitution-second",
  "q0b-target-constitution-fourth": "constitution-fourth",
};
const groupQuestionIds = {
  "civil-principles-compare": QUESTION_IDS.slice(0, 3),
  "constitution-chapters": QUESTION_IDS.slice(3),
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId, decision: "rewrite",
  reason: "保留考点与稳定 ID，改写题干、干扰项、边界及当前官方核验信息。",
}));
const mnemonicDispositions = [
  { groupId: "civil-principles-compare", decision: "not-suitable", resourceId: null, reason: "原则判断依赖具体法律含义和案件条件，关键词口诀容易诱发机械套用；继续使用情境题与易混对照。" },
  { groupId: "constitution-chapters", decision: "structural-mnemonic-candidate", resourceId: "constitution-chapters-memory", reason: "章序和章名具有稳定的一至四顺序，可用短句双向还原；已具结构记忆价值，但尚无用户记忆试验证据。" },
];

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
    const groupId = QUESTION_IDS.slice(0, 3).includes(directId) ? "civil-principles-compare" : "constitution-chapters";
    return { targetId: decision.targetId, directQuestionIds: [directId],
      variationQuestionIds: groupQuestionIds[groupId].filter((id) => id !== directId),
      processDifference: processDifferences[decision.targetId] };
  });
}
function applyGroups(groups) {
  return groups.map((group) => {
    if (group.id === "civil-principles-compare") return { ...group, mnemonicDecision: "not-suitable", mnemonicReason: mnemonicDispositions[0].reason };
    if (group.id === "constitution-chapters") return {
      ...group,
      title: "宪法四章顺序",
      reason: "用章序与章名帮助快速定位现行宪法结构，并明确序言单列。",
      mnemonicDecision: "structural-mnemonic",
      mnemonicReason: mnemonicDispositions[1].reason,
    };
    return group;
  });
}
function applyMnemonics(mnemonics) {
  return mnemonics.map((mnemonic) => mnemonic.id === "constitution-chapters-memory" ? {
    ...mnemonic,
    revision: mnemonic.revision + 1,
    title: "宪法四章顺序",
    coverage: "现行宪法第一至四章的顺序与第四章四项内容。",
    text: "一总二权义，三机构，四旗歌徽都。",
    method: "顺序串联",
    learningForm: "structural-mnemonic",
    formLabel: "结构口诀",
    purpose: "用一至四的顺序短句双向还原宪法四章章名。",
    conditions: ["只用于现行宪法2018年修正文本的目录章序与章名定位。"],
    verification: constitutionVerification,
    phrases: mnemonic.phrases.map((phrase, index) => ({
      ...phrase,
      phrase: ["一总", "二权义，三机构", "四旗歌徽都"][index],
      meaning: ["第一章总纲；序言单列在各章之前。", "第二章公民的基本权利和义务，第三章国家机构。", "第四章国旗、国歌、国徽、首都。"][index],
      coverageType: "structural-sequence-recall",
      checks: phrase.checks.map((check) => ({ ...check, checkPurpose: `q2-${cognitiveLevels[check.questionId]}` })),
    })),
  } : mnemonic);
}
function applyMnemonicSpecifications(specifications) {
  return specifications.map((specification) => specification.mnemonicId === "constitution-chapters-memory" ? {
    ...specification,
    revision: specification.revision + 1,
    purpose: "用一至四的顺序短句双向还原宪法四章章名。",
    method: "顺序串联",
    conditionCount: 1,
  } : specification);
}
function applyMnemonicPhraseTargetRelations(relations) {
  return relations.map((relation) => relation.mnemonicId === "constitution-chapters-memory"
    ? { ...relation, coverageType: "structural-sequence-recall" }
    : relation);
}
function applyComparisons(comparisons) {
  return comparisons.map((comparison) => comparison.id === "civil-principles-comparison" ? {
    ...comparison,
    revision: comparison.revision + 1,
    verification: civilVerification,
  } : comparison);
}

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q2-law-2", status: "review",
  QUESTION_IDS, verificationSources, replacementRows, distractorReasons, targetRows, cognitiveLevels,
  processDifferences, questionDispositions, mnemonicDispositions,
  applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications,
  applyVariationDecisions, applyGroups, applyMnemonics, applyMnemonicSpecifications,
  applyMnemonicPhraseTargetRelations, applyComparisons,
  sessionMigrations: [{
    fromVersion: "2026102267", toPackVersion: "2026-10-22.68",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["constitution-chapters-memory"],
    changedComparisonIds: ["civil-principles-comparison"],
    reason: "Q2 法律第二批重写民法原则与宪法章序题，更新民法原则对照和宪法结构口诀；受影响会话按迁移规则重建。",
  }],
};
