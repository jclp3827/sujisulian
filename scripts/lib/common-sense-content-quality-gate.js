"use strict";

const crypto = require("crypto");

const COGNITIVE_LEVELS = Object.freeze([
  "recall",
  "mapping",
  "distinction",
  "condition",
  "application",
  "synthesis",
]);
const ASSESSMENT_TYPES = Object.freeze(["learning-card", "exam-check"]);
const ORIGIN_TYPES = Object.freeze(["self-authored", "editor-selected", "official-exam", "exam-adapted"]);
const READY_SOURCE_STATUSES = new Set(["ready-for-user-acceptance", "approved", "verified"]);
const EDITORIAL_TOKENS = Object.freeze(["正文", "本批", "本节", "按教材", "原图", "源文"]);
const ABSOLUTE_TOKENS = Object.freeze(["永远", "完全", "全部", "所有", "只能", "必然", "一律", "任何", "绝不", "均不"]);

const RULES = Object.freeze([
  {
    id: "QG-PACK-001",
    title: "题库结构失败关闭",
    severity: "blocker",
    threshold: "questions、targets、targetRelations.questionTargets、questionSpecifications 必须存在、为数组且至少含 1 项。允许结构缺口数为 0。",
    failureExample: "questions 缺失、targets 不是数组，或题目关系/规格数组为空时，质量门必须直接保持红色。",
  },
  {
    id: "QG-REL-001",
    title: "题目—目标关系失败关闭",
    severity: "blocker",
    threshold: "每题必须且只能有 1 条 targetRelations.questionTargets；主要目标非空，所有目标存在且与题目领域、主题一致。允许缺口数为 0。",
    failureExample: "题目 q-1 不在 targetRelations.questionTargets 中，或 primaryTargetIds 指向不存在的目标。",
  },
  {
    id: "QG-SPEC-001",
    title: "题目规格失败关闭",
    severity: "blocker",
    threshold: "每题必须且只能有 1 条 questionSpecifications；目标、检测用途与关系记录一致，所有错误选项都有对应理由。允许缺口数为 0。",
    failureExample: "三选一题 q-1 没有规格，或 distractorReasons 缺少错误选项 2 的解释。",
  },
  {
    id: "QG-SOURCE-001",
    title: "来源状态失败关闭",
    severity: "blocker",
    threshold: "每题至少有 1 条来源引用；每条引用必须含 sourceUnitIds，auditStatus 只能为 ready-for-user-acceptance、approved 或 verified。允许缺口数为 0。",
    failureExample: "题目 q-1 的来源仍为 pending，或没有可定位的 sourceUnitIds。",
  },
  {
    id: "QG-PURPOSE-001",
    title: "检测用途与认知标签失败关闭",
    severity: "blocker",
    threshold: "关系和规格必须有相同的 checkPurpose；规格 cognitiveLevel 必须是 recall、mapping、distinction、condition、application、synthesis 之一。允许缺口数为 0。",
    failureExample: "规格只有自由文本 checkPurpose，没有 cognitiveLevel，无法统计它在检验回忆还是运用。",
  },
  {
    id: "QG-TYPE-001",
    title: "学习卡与考试检验类型失败关闭",
    severity: "blocker",
    threshold: "每题 assessmentType 必须明确为 learning-card 或 exam-check；exam-check 必须为四选一。允许缺口数为 0。",
    failureExample: "三选一题没有 assessmentType，却被直接计入四选一考试检验题。",
  },
  {
    id: "QG-EVIDENCE-001",
    title: "公考依据与展示称谓失败关闭",
    severity: "blocker",
    threshold: "每题必须有 examBasis。self-authored/editor-selected 只能展示为“自编学习题”/“编辑精选”；official-exam/exam-adapted 必须登记考试类型、年份、地区、试卷、题号、HTTPS 来源与核验日期。允许缺口数为 0。",
    failureExample: "题目显示为“公考真题”，但没有年份、试卷、题号或可核验来源。",
  },
  {
    id: "QG-POSITION-001",
    title: "答案位置分布",
    severity: "error",
    threshold: "全库或单领域样本不少于 20 题时，任一固定零基答案位置占比不得达到 50%。",
    failureExample: "同一领域 20 题中有 16 题答案都在第一个选项，用户可利用位置规律作答。",
  },
  {
    id: "QG-LENGTH-001",
    title: "正确项长度提示",
    severity: "warning",
    threshold: "逐题登记正确项严格长于所有错误项的候选；该规则是人工复核清单，不单独阻断准入。",
    failureExample: "两个错误项各 4 字，正确项为 22 字且是唯一完整陈述。",
  },
  {
    id: "QG-PROMPT-001",
    title: "重复通用题干",
    severity: "error",
    threshold: "去除空白后完全相同的题干不得在 5 题及以上重复使用。",
    failureExample: "“下列哪一项完整正确？”在 95 题中重复出现。",
  },
  {
    id: "QG-ABSOLUTE-001",
    title: "绝对化弱干扰项",
    severity: "warning",
    threshold: "错误选项命中“永远、完全、全部、所有、只能、必然、一律、任何、绝不、均不”即进入人工复核；该信号不单独证明选项错误。",
    failureExample: "错误项写成“任何情况下都完全相同”，用户可能只靠极端措辞排除。",
  },
  {
    id: "QG-EDITORIAL-001",
    title: "内部编辑语言外露",
    severity: "error",
    threshold: "prompt、options、explanation、boundary 中不得出现“正文、本批、本节、按教材、原图、源文”。允许命中题数为 0。",
    failureExample: "解析写成“按正文可知第一项正确”，没有向用户解释知识判断依据。",
  },
]);

const normalizePrompt = (value) => String(value || "").replace(/\s+/gu, "").trim();
const codePointLength = (value) => Array.from(String(value || "").trim()).length;
const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const validHttpsUrl = (value) => /^https:\/\//i.test(String(value || ""));

function validDate(value) {
  const text = String(value || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [year, month, day] = text.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

function canonicalValue(value) {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).filter((key) => value[key] !== undefined).sort()
      .map((key) => [key, canonicalValue(value[key])]));
  }
  return value;
}

function sha256(value) {
  return crypto.createHash("sha256").update(JSON.stringify(canonicalValue(value))).digest("hex");
}

function groupedBy(items, key) {
  const result = new Map();
  for (const item of items || []) {
    const value = item && item[key];
    if (!result.has(value)) result.set(value, []);
    result.get(value).push(item);
  }
  return result;
}

function addViolation(store, ruleId, entityId, message, evidence = undefined) {
  if (!store.has(ruleId)) store.set(ruleId, []);
  store.get(ruleId).push({ entityId, message, ...(evidence === undefined ? {} : { evidence }) });
}

function validateExamBasis(question) {
  const basis = question.examBasis;
  if (!basis || !ORIGIN_TYPES.includes(basis.originType) || !nonEmptyString(basis.displayLabel)) {
    return "缺少有效 examBasis.originType 或 displayLabel";
  }
  if (basis.originType === "self-authored" && basis.displayLabel !== "自编学习题") {
    return "self-authored 只能展示为“自编学习题”";
  }
  if (basis.originType === "editor-selected" && basis.displayLabel !== "编辑精选") {
    return "editor-selected 只能展示为“编辑精选”";
  }
  if (["official-exam", "exam-adapted"].includes(basis.originType)) {
    const evidence = basis.evidence;
    const checkedAtValid = evidence && validDate(evidence.checkedAt);
    const checkedAtYear = checkedAtValid ? Number(String(evidence.checkedAt).slice(0, 4)) : NaN;
    const examYearValid = evidence && Number.isInteger(evidence.year) && evidence.year >= 1994 && evidence.year <= checkedAtYear;
    if (!evidence || !nonEmptyString(evidence.examType) || !examYearValid ||
      !nonEmptyString(evidence.region) || !nonEmptyString(evidence.paper) ||
      !nonEmptyString(evidence.questionNumber) || !validHttpsUrl(evidence.sourceUrl) || !checkedAtValid) {
      return "official-exam/exam-adapted 缺少完整可核验考试依据";
    }
  }
  if (question.kind && question.kind !== basis.displayLabel) return "kind 与 examBasis.displayLabel 不一致";
  return "";
}

function auditPack(input) {
  const pack = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const questions = Array.isArray(pack.questions) ? pack.questions : [];
  const targets = Array.isArray(pack.targets) ? pack.targets : [];
  const relations = Array.isArray(pack.targetRelations?.questionTargets) ? pack.targetRelations.questionTargets : [];
  const specifications = Array.isArray(pack.questionSpecifications) ? pack.questionSpecifications : [];
  const targetsById = new Map(targets.map((target) => [target.id, target]));
  const relationsByQuestion = groupedBy(relations, "questionId");
  const specificationsByQuestion = groupedBy(specifications, "questionId");
  const violations = new Map(RULES.map((rule) => [rule.id, []]));

  for (const [entityId, value] of [
    ["pack.questions", pack.questions],
    ["pack.targets", pack.targets],
    ["pack.targetRelations.questionTargets", pack.targetRelations?.questionTargets],
    ["pack.questionSpecifications", pack.questionSpecifications],
  ]) {
    if (!Array.isArray(value) || value.length === 0) {
      addViolation(violations, "QG-PACK-001", entityId, "必需集合缺失、不是数组或为空", {
        actualType: Array.isArray(value) ? "array" : value === undefined ? "missing" : typeof value,
        length: Array.isArray(value) ? value.length : undefined,
      });
    }
  }

  for (const question of questions) {
    const questionId = question.id || "<missing-question-id>";
    const rows = relationsByQuestion.get(question.id) || [];
    const specs = specificationsByQuestion.get(question.id) || [];
    const relation = rows[0];
    const specification = specs[0];

    if (rows.length !== 1) {
      addViolation(violations, "QG-REL-001", questionId, `目标关系应为 1 条，实际 ${rows.length} 条`);
    } else {
      const targetIds = [...(relation.primaryTargetIds || []), ...(relation.supportingTargetIds || [])];
      const invalidTargets = targetIds.filter((targetId) => {
        const target = targetsById.get(targetId);
        return !target || target.scope !== question.scope || target.groupId !== question.group;
      });
      if (!(relation.primaryTargetIds || []).length || new Set(targetIds).size !== targetIds.length || invalidTargets.length) {
        addViolation(violations, "QG-REL-001", questionId, "主要目标为空、目标重复，或目标不存在/跨领域/跨主题", { invalidTargets });
      }
    }

    if (specs.length !== 1) {
      addViolation(violations, "QG-SPEC-001", questionId, `题目规格应为 1 条，实际 ${specs.length} 条`);
    } else {
      const incorrectIndexes = (question.options || []).map((_, index) => index).filter((index) => index !== question.answer).map(String).sort();
      const reasonIndexes = Object.keys(specification.distractorReasons || {}).sort();
      const reasonsComplete = JSON.stringify(incorrectIndexes) === JSON.stringify(reasonIndexes) &&
        Object.values(specification.distractorReasons || {}).every(nonEmptyString);
      const consistent = relation && (specification.primaryTargetIds || []).length > 0 &&
        specification.checkPurpose === relation.checkPurpose &&
        JSON.stringify(specification.primaryTargetIds || []) === JSON.stringify(relation.primaryTargetIds || []) &&
        JSON.stringify(specification.supportingTargetIds || []) === JSON.stringify(relation.supportingTargetIds || []);
      if (!reasonsComplete || !consistent) {
        addViolation(violations, "QG-SPEC-001", questionId, "规格与目标关系不一致，或逐错误选项理由不完整", { incorrectIndexes, reasonIndexes });
      }
    }

    const refs = Array.isArray(question.refs) ? question.refs : [];
    const invalidRefs = refs.filter((ref) => !(Array.isArray(ref.sourceUnitIds) && ref.sourceUnitIds.length) || !READY_SOURCE_STATUSES.has(ref.auditStatus));
    if (!refs.length || invalidRefs.length) {
      addViolation(violations, "QG-SOURCE-001", questionId, "来源引用为空、不可定位，或来源状态未达到可验收", {
        statuses: refs.map((ref) => ref.auditStatus || "<missing>"),
      });
    }

    if (!relation || !specification || !nonEmptyString(relation.checkPurpose) ||
      relation.checkPurpose !== specification.checkPurpose || !COGNITIVE_LEVELS.includes(specification.cognitiveLevel)) {
      addViolation(violations, "QG-PURPOSE-001", questionId, "检测用途缺失/不一致，或 cognitiveLevel 不在闭集内", {
        relationCheckPurpose: relation?.checkPurpose,
        specificationCheckPurpose: specification?.checkPurpose,
        cognitiveLevel: specification?.cognitiveLevel,
      });
    }

    if (!ASSESSMENT_TYPES.includes(question.assessmentType) ||
      (question.assessmentType === "exam-check" && (question.options || []).length !== 4)) {
      addViolation(violations, "QG-TYPE-001", questionId, "assessmentType 缺失/无效，或 exam-check 不是四选一", {
        assessmentType: question.assessmentType,
        optionCount: (question.options || []).length,
      });
    }

    const evidenceError = validateExamBasis(question);
    if (evidenceError) addViolation(violations, "QG-EVIDENCE-001", questionId, evidenceError);

    const lengths = (question.options || []).map(codePointLength);
    if (lengths.length && Number.isInteger(question.answer)) {
      const correct = lengths[question.answer];
      const wrong = lengths.filter((_, index) => index !== question.answer);
      if (wrong.length && wrong.every((length) => correct > length)) {
        addViolation(violations, "QG-LENGTH-001", questionId, "正确项是唯一最长项，进入人工复核", { optionLengths: lengths, answer: question.answer });
      }
    }

    const absoluteMatches = [];
    (question.options || []).forEach((option, index) => {
      if (index === question.answer) return;
      const tokens = ABSOLUTE_TOKENS.filter((token) => String(option).includes(token));
      if (tokens.length) absoluteMatches.push({ index, tokens });
    });
    if (absoluteMatches.length) {
      addViolation(violations, "QG-ABSOLUTE-001", questionId, "错误选项含绝对化词，进入人工复核", absoluteMatches);
    }

    const fields = {
      prompt: question.prompt,
      options: (question.options || []).join("｜"),
      explanation: question.explanation,
      boundary: question.boundary,
    };
    const editorialMatches = [];
    Object.entries(fields).forEach(([field, value]) => EDITORIAL_TOKENS.forEach((token) => {
      if (String(value || "").includes(token)) editorialMatches.push({ field, token });
    }));
    if (editorialMatches.length) {
      addViolation(violations, "QG-EDITORIAL-001", questionId, "面向用户的题目字段含内部编辑语言", editorialMatches);
    }
  }

  const populations = [{ id: "all", questions }];
  for (const [scope, rows] of groupedBy(questions, "scope")) populations.push({ id: `scope:${scope}`, questions: rows });
  for (const population of populations.filter((item) => item.questions.length >= 20)) {
    const counts = {};
    population.questions.forEach((question) => { counts[question.answer] = (counts[question.answer] || 0) + 1; });
    const [position, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
    const ratio = count / population.questions.length;
    if (ratio >= 0.5) {
      addViolation(violations, "QG-POSITION-001", population.id, "固定答案位置达到可利用风险阈值", {
        sampleSize: population.questions.length,
        dominantPosition: Number(position),
        dominantCount: count,
        ratio: Number(ratio.toFixed(4)),
      });
    }
  }

  const prompts = new Map();
  questions.forEach((question) => {
    const prompt = normalizePrompt(question.prompt);
    if (!prompts.has(prompt)) prompts.set(prompt, []);
    prompts.get(prompt).push(question.id);
  });
  for (const [prompt, questionIds] of prompts) {
    if (prompt && questionIds.length >= 5) {
      addViolation(violations, "QG-PROMPT-001", `prompt:${prompt}`, "完全相同题干达到重复阈值", {
        count: questionIds.length,
        questionIds,
      });
    }
  }

  const results = RULES.map((rule) => {
    const rows = violations.get(rule.id) || [];
    const entityIds = [...new Set(rows.map((row) => String(row.entityId)))].sort();
    return {
      ...rule,
      violationCount: rows.length,
      violationEntityCount: entityIds.length,
      violationEntitySetSha256: sha256(entityIds),
      sampleViolations: rows.slice(0, 20),
    };
  });
  const blocking = results.some((rule) => ["blocker", "error"].includes(rule.severity) && rule.violationCount > 0);
  return {
    schemaVersion: 1,
    gate: "common-sense-content-quality-q0a",
    packVersion: pack.version || "<unknown>",
    contentSha256: sha256(pack),
    questionCount: questions.length,
    status: blocking ? "red" : "green",
    blocking,
    allowedValues: {
      cognitiveLevels: COGNITIVE_LEVELS,
      assessmentTypes: ASSESSMENT_TYPES,
      examBasisOriginTypes: ORIGIN_TYPES,
      readySourceStatuses: [...READY_SOURCE_STATUSES],
    },
    rules: results,
  };
}

function baselineSignature(report) {
  return {
    schemaVersion: 1,
    gate: report.gate,
    packVersion: report.packVersion,
    questionCount: report.questionCount,
    contentSha256: report.contentSha256,
    expectedStatus: report.status,
    ruleViolationCounts: Object.fromEntries(report.rules.map((rule) => [rule.id, rule.violationCount])),
    ruleViolationEntitySetSha256: Object.fromEntries(report.rules.map((rule) => [rule.id, rule.violationEntitySetSha256])),
  };
}

module.exports = {
  ABSOLUTE_TOKENS,
  ASSESSMENT_TYPES,
  COGNITIVE_LEVELS,
  EDITORIAL_TOKENS,
  ORIGIN_TYPES,
  RULES,
  auditPack,
  baselineSignature,
  validateExamBasis,
};
