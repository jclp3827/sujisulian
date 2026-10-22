#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = path.resolve(__dirname, "..");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const { fingerprint, findSource, sourceIds, itemRefs } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { buildInventory, inventoryReport } = require("./lib/common-sense-learning-inventory");
const { validateEntryPlans, buildEntryMatrix, entryMatrixReport } = require("./lib/common-sense-entry-matrix");

function compile(source, material) {
  const pack = JSON.parse(JSON.stringify(source));
  const ids = new Set();
  const scopes = new Set(material.directory.map((p) => p.id));
  const directory = require("../miniprogram/subpackages/common-sense/services/topic-directory").buildDirectory(material);
  const scopePoints = Object.fromEntries(directory.map((p) => [p.id, new Set(p.chapters.flatMap((c) => c.sections.flatMap((s) => s.points.map((p) => p.id))))]));
  const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
  const byQuestion = Object.fromEntries(pack.questions.map((q) => [q.id, q]));
  pack.comparisons = pack.comparisons || [];
  pack.targets = pack.targets || [];
  pack.questionSpecifications = pack.questionSpecifications || [];
  pack.mnemonicSpecifications = pack.mnemonicSpecifications || [];
  pack.comparisonSpecifications = pack.comparisonSpecifications || [];
  pack.examTopics = pack.examTopics || [];
  pack.variationDecisions = pack.variationDecisions || [];
  pack.sessionMigrations = pack.sessionMigrations || [];
  pack.targetRelations = pack.targetRelations || { questionTargets: [], mnemonicPhraseTargets: [], comparisonRowTargets: [] };
  const byTarget = Object.fromEntries(pack.targets.map((target) => [target.id, target]));
  for (const hold of pack.authoringConstraints || []) {
    requireValue(findSource(material, hold).tab && hold.reason && hold.requiredCheck, "来源待核项无效");
  }
  for (const item of [...pack.questions, ...pack.mnemonics, ...pack.groups, ...pack.comparisons, ...pack.targets, ...pack.examTopics]) {
    requireValue(item.id && !ids.has(item.id), `重复/缺失 ID: ${item.id}`);
    ids.add(item.id);
    requireValue(scopes.has(item.scope), `${item.id}: 领域无效`);
  }
  for (const item of [...pack.questions, ...pack.mnemonics, ...pack.comparisons, ...pack.targets, ...pack.examTopics]) {
    requireValue(Number.isInteger(item.revision) && item.revision > 0, `${item.id}: revision 无效`);
    requireValue(["review", "approved", "blocked"].includes(item.status), `${item.id}: 状态无效`);
    requireValue(itemRefs(item).length, `${item.id}: 来源为空`);
    if (item.scope === "law" || item.verification) {
      const v = item.verification;
      requireValue(v && /^\d{4}-\d{2}-\d{2}$/.test(v.checkedAt) && v.sourceIds?.length && v.locators?.length, `${item.id}: 法律核验资料缺失`);
      const sources = v.sourceIds.map((id) => pack.verificationSources?.[id]);
      requireValue(sources.every((s) => s && s.retrieved === true && s.checkedAt === v.checkedAt && s.title && s.version &&
        /^https:\/\/[a-z0-9.-]+\.(gov|court|npc)\.cn\//i.test(s.url)), `${item.id}: 核验来源或日期无效`);
      item.verificationLabel = `${sources.map((s) => s.title).join("、")} · ${v.locators.join("、")} · 核验 ${v.checkedAt}`;
    }
    for (const ref of itemRefs(item)) {
      const { point, tab } = findSource(material, ref);
      requireValue(tab, `${item.id}: 来源不存在`);
      requireValue(scopePoints[item.scope].has(point.id), `${item.id}: 来源跨领域`);
      requireValue(!(pack.authoringConstraints || []).some((h) => h.pointId === ref.pointId && h.tabId === ref.tabId), `${item.id}: 引用了待核来源页签`);
      requireValue(ref.sourceUnitIds && ref.sourceUnitIds.length && ref.sourceUnitIds.every((id) => sourceIds(tab).includes(id)), `${item.id}: 源单元无效`);
      ref.fingerprint = fingerprint(tab);
      ref.label = `${point.title} · ${tab.title}`;
      ref.auditStatus = point.sourceAuditStatus;
    }
  }
  for (const q of pack.questions) {
    requireValue(q.objective && q.prompt && q.explanation && q.boundary, `${q.id}: 内容缺失`);
    requireValue(q.options.length >= 2 && q.options.every((s) => typeof s === "string" && s.trim()) &&
      new Set(q.options).size === q.options.length && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${q.id}: 选项/答案无效`);
    const group = pack.groups.find((g) => g.id === q.group);
    requireValue(group && group.scope === q.scope && group.questionIds.includes(q.id), `${q.id}: 主题组不一致`);
  }
  for (const target of pack.targets) {
    const group = pack.groups.find((g) => g.id === target.groupId);
    requireValue(group && group.scope === target.scope, `${target.id}: 目标主题不一致`);
    requireValue(target.statement && target.conclusion && target.conditions?.length && target.excludes?.length, `${target.id}: 目标内容或边界缺失`);
  }
  for (const m of pack.mnemonics) {
    requireValue(m.title && m.text && m.coverage && m.excludes.length && m.phrases.length, `${m.id}: 口诀范围缺失`);
    const mapped = new Set();
    for (const phrase of m.phrases) {
      requireValue(phrase.phrase && phrase.meaning && phrase.refs.length && phrase.questionIds.length, `${m.id}: 逐句映射缺失`);
      phrase.questionIds.forEach((id) => {
        const q = byQuestion[id];
        requireValue(q && q.scope === m.scope && m.questionIds.includes(id), `${m.id}: 跨范围目标`);
        requireValue(q.refs.some((r) => phrase.refs.some((p) => r.pointId === p.pointId && r.tabId === p.tabId)), `${m.id}: 目标与来源不一致`);
        mapped.add(id);
      });
    }
    requireValue(m.questionIds.length && m.questionIds.every((id) => mapped.has(id)), `${m.id}: 目标没有逐句覆盖`);
  }
  for (const g of pack.groups) {
    if (g.mnemonicDecision === "not-suitable") {
      requireValue(g.mnemonicReason && !pack.mnemonics.some((m) => m.questionIds.some((id) => g.questionIds.includes(id))), `${g.id}: 不适用口诀的决定与内容冲突`);
    }
    requireValue(g.questionIds.length && g.questionIds.length <= 5 && new Set(g.questionIds).size === g.questionIds.length, `${g.id}: 学习组范围无效`);
    requireValue(g.questionIds.every((id) => byQuestion[id] && byQuestion[id].scope === g.scope && byQuestion[id].group === g.id), `${g.id}: 题目不存在/不在本组`);
  }
  requireValue(pack.targetRelations && ["questionTargets", "mnemonicPhraseTargets", "comparisonRowTargets"].every((key) =>
    Array.isArray(pack.targetRelations[key])), "目标关系结构无效");
  const relationTargets = (ids, owner, scope, groupId, refs) => {
    requireValue(ids?.length && new Set(ids).size === ids.length, `${owner}: 目标关系为空/重复`);
    ids.forEach((id) => {
      const target = byTarget[id];
      requireValue(target && target.scope === scope && target.groupId === groupId, `${owner}: 目标不存在或跨主题`);
      requireValue(itemRefs(target).some((t) => refs.some((ref) => t.pointId === ref.pointId && t.tabId === ref.tabId)), `${owner}: 目标与来源不一致`);
    });
  };
  const questionRelations = new Set();
  const relationByQuestion = new Map();
  for (const row of pack.targetRelations.questionTargets) {
    const q = byQuestion[row.questionId];
    requireValue(q && !questionRelations.has(q.id) && row.checkPurpose, `${row.questionId}: 题目目标关系无效/重复`);
    questionRelations.add(q.id);
    relationByQuestion.set(q.id, row);
    relationTargets([...(row.primaryTargetIds || []), ...(row.supportingTargetIds || [])], q.id, q.scope, q.group, q.refs);
  }
  const targetGroups = new Set(pack.targets.map((target) => target.groupId));
  requireValue(pack.questions.filter((q) => targetGroups.has(q.group)).every((q) => questionRelations.has(q.id)), "试点题目缺少目标关系");
  const specificationIds = new Set();
  for (const spec of pack.questionSpecifications) {
    const q = byQuestion[spec.questionId], relation = relationByQuestion.get(spec.questionId);
    requireValue(q && targetGroups.has(q.group) && !specificationIds.has(q.id), `${spec.questionId}: 题目编写规格无效/重复`);
    specificationIds.add(q.id);
    requireValue(spec.checkPurpose === relation.checkPurpose &&
      JSON.stringify(spec.primaryTargetIds) === JSON.stringify(relation.primaryTargetIds) &&
      JSON.stringify(spec.supportingTargetIds || []) === JSON.stringify(relation.supportingTargetIds || []), `${q.id}: 题目规格与目标关系不一致`);
    const distractorIndexes = q.options.map((_, index) => index).filter((index) => index !== q.answer).map(String);
    requireValue(spec.distractorReasons && JSON.stringify(Object.keys(spec.distractorReasons).sort()) === JSON.stringify(distractorIndexes.sort()) &&
      Object.values(spec.distractorReasons).every((reason) => typeof reason === "string" && reason.trim()), `${q.id}: 干扰项理由不完整`);
  }
  requireValue(pack.questions.filter((q) => targetGroups.has(q.group)).every((q) => specificationIds.has(q.id)), "试点题目缺少完整编写规格");
  const variationTargets = new Set();
  for (const decision of pack.variationDecisions) {
    requireValue(byTarget[decision.targetId] && !variationTargets.has(decision.targetId), `${decision.targetId}: 变式决定无效/重复`);
    variationTargets.add(decision.targetId);
    requireValue(decision.directQuestionIds?.length && new Set(decision.directQuestionIds).size === decision.directQuestionIds.length &&
      decision.variationQuestionIds?.length && new Set(decision.variationQuestionIds).size === decision.variationQuestionIds.length &&
      !decision.directQuestionIds.some((id) => decision.variationQuestionIds.includes(id)), `${decision.targetId}: 直接检测或变式缺失`);
    for (const id of decision.directQuestionIds.concat(decision.variationQuestionIds)) {
      const relation = relationByQuestion.get(id);
      requireValue(relation && [...(relation.primaryTargetIds || []), ...(relation.supportingTargetIds || [])].includes(decision.targetId), `${decision.targetId}: 检测题未映射目标`);
    }
  }
  requireValue(pack.targets.every((target) => variationTargets.has(target.id)), "试点目标缺少直接检测或变式决定");
  for (const migration of pack.sessionMigrations) {
    const changedQuestionIds = migration.changedQuestionIds || [], changedMnemonicIds = migration.changedMnemonicIds || [];
    const changedComparisonIds = migration.changedComparisonIds || [];
    const changedExamTopicIds = migration.changedExamTopicIds || [];
    requireValue(/^[0-9a-f]+$/.test(migration.fromVersion) && migration.reason && migration.toPackVersion &&
      changedQuestionIds.length + changedMnemonicIds.length + changedComparisonIds.length + changedExamTopicIds.length > 0 &&
      new Set(changedQuestionIds).size === changedQuestionIds.length &&
      new Set(changedMnemonicIds).size === changedMnemonicIds.length &&
      new Set(changedComparisonIds).size === changedComparisonIds.length &&
      new Set(changedExamTopicIds).size === changedExamTopicIds.length &&
      changedQuestionIds.every((id) => byQuestion[id]) &&
      changedMnemonicIds.every((id) => pack.mnemonics.some((mnemonic) => mnemonic.id === id)) &&
      changedComparisonIds.every((id) => pack.comparisons.some((comparison) => comparison.id === id)) &&
      changedExamTopicIds.every((id) => pack.examTopics.some((topic) => topic.id === id)), "会话迁移声明无效");
  }

  const examTopicIds = new Set();
  for (const topic of pack.examTopics) {
    const group = pack.groups.find((item) => item.id === topic.groupId && item.scope === topic.scope);
    requireValue(group && !examTopicIds.has(topic.id), `${topic.id}: 急救专题缺少主题或重复`);
    examTopicIds.add(topic.id);
    requireValue(topic.title && topic.task && topic.coverage && topic.completionScope &&
      topic.inclusionReasons?.length >= 1 && topic.excludes?.length >= 1 &&
      topic.questionIds?.length >= 1 && topic.questionIds.length <= 5 &&
      topic.questionSteps?.length === topic.questionIds.length &&
      JSON.stringify(topic.questionSteps.map((step) => step.questionId)) === JSON.stringify(topic.questionIds),
    `${topic.id}: 急救专题范围、理由或题目步骤缺失`);
    requireValue(topic.questionIds.every((id) => group.questionIds.includes(id)) &&
      topic.questionSteps.every((step) => step.role && step.reason), `${topic.id}: 急救专题题目跨主题或缺少理由`);
    requireValue(topic.targetIds?.length && topic.targetIds.every((id) => byTarget[id] && byTarget[id].groupId === topic.groupId),
      `${topic.id}: 急救专题目标无效`);
    requireValue(topic.mnemonicIds?.length && topic.mnemonicIds.every((id) => pack.mnemonics.some((item) => item.id === id && item.scope === topic.scope)) &&
      topic.comparisonIds?.length && topic.comparisonIds.every((id) => pack.comparisons.some((item) => item.id === id && item.groupId === topic.groupId)),
    `${topic.id}: 急救专题复习材料缺失`);
  }

  const phraseRelations = new Set();
  for (const row of pack.targetRelations.mnemonicPhraseTargets) {
    const m = pack.mnemonics.find((item) => item.id === row.mnemonicId), phrase = m && m.phrases[row.phraseIndex];
    const key = `${row.mnemonicId}:${row.phraseIndex}`;
    const group = phrase && pack.groups.find((g) => phrase.questionIds.every((id) => g.questionIds.includes(id)));
    requireValue(m && phrase && group && !phraseRelations.has(key) && row.coverageType && row.wrongAnswerReviewAnchor, `${key}: 口诀句目标关系无效/重复`);
    phraseRelations.add(key);
    relationTargets(row.targetIds, key, m.scope, group.id, phrase.refs);
  }
  for (const m of pack.mnemonics) {
    if (!m.questionIds.some((id) => targetGroups.has(byQuestion[id]?.group))) continue;
    requireValue(m.phrases.every((_, index) => phraseRelations.has(`${m.id}:${index}`)), `${m.id}: 试点口诀句缺少目标关系`);
  }

  const mnemonicSpecificationIds = new Set();
  for (const spec of pack.mnemonicSpecifications) {
    const mnemonic = pack.mnemonics.find((item) => item.id === spec.mnemonicId);
    requireValue(mnemonic && !mnemonicSpecificationIds.has(mnemonic.id) && spec.revision === mnemonic.revision,
      `${spec.mnemonicId}: 口诀学习包规格无效/重复`);
    mnemonicSpecificationIds.add(mnemonic.id);
    requireValue(mnemonic.purpose && mnemonic.method && mnemonic.conditions?.length && mnemonic.questionIds.length <= 5 &&
      spec.purpose === mnemonic.purpose && spec.method === mnemonic.method && spec.conditionCount === mnemonic.conditions.length &&
      JSON.stringify(spec.phraseIds) === JSON.stringify(mnemonic.phrases.map((phrase) => phrase.id)) &&
      JSON.stringify(spec.selfTestQuestionIds) === JSON.stringify(mnemonic.questionIds), `${mnemonic.id}: 口诀目的、条件或自测规格不一致`);
    const phraseIds = new Set();
    for (const [phraseIndex, phrase] of mnemonic.phrases.entries()) {
      requireValue(phrase.id && !phraseIds.has(phrase.id) && phrase.targetIds?.length && phrase.coverageType &&
        Array.isArray(phrase.conditionRefs) && phrase.checks?.length &&
        JSON.stringify(phrase.questionIds) === JSON.stringify(phrase.checks.map((check) => check.questionId)),
      `${mnemonic.id}:${phraseIndex}: 口诀句学习映射不完整`);
      phraseIds.add(phrase.id);
      const relation = pack.targetRelations.mnemonicPhraseTargets.find((row) =>
        row.mnemonicId === mnemonic.id && row.phraseIndex === phraseIndex);
      requireValue(relation && relation.phraseId === phrase.id && relation.coverageType === phrase.coverageType &&
        relation.wrongAnswerReviewAnchor === phrase.id && JSON.stringify(relation.targetIds) === JSON.stringify(phrase.targetIds),
      `${mnemonic.id}:${phrase.id}: 口诀句与目标关系不一致`);
      for (const check of phrase.checks) {
        const questionRelation = relationByQuestion.get(check.questionId);
        const relatedTargetIds = questionRelation && [...(questionRelation.primaryTargetIds || []), ...(questionRelation.supportingTargetIds || [])];
        const conditionAnchors = phrase.conditionRefs.map((condition) => condition.id);
        requireValue(mnemonic.questionIds.includes(check.questionId) && questionRelation && check.checkPurpose === questionRelation.checkPurpose &&
          phrase.targetIds.some((targetId) => relatedTargetIds.includes(targetId)) &&
          (["phrase", "meaning"].includes(check.reviewTarget) ? check.reviewAnchorId === phrase.id :
            check.reviewTarget === "condition" && conditionAnchors.includes(check.reviewAnchorId)),
        `${mnemonic.id}:${check.questionId}: 自测或错后回看映射无效`);
      }
      for (const targetId of phrase.targetIds) {
        requireValue(phrase.checks.some((check) => {
          const relation = relationByQuestion.get(check.questionId);
          return relation && [...(relation.primaryTargetIds || []), ...(relation.supportingTargetIds || [])].includes(targetId);
        }), `${mnemonic.id}:${targetId}: 声明目标没有配套检测`);
      }
    }
  }

  const comparisonRelations = new Set();
  for (const row of pack.targetRelations.comparisonRowTargets) {
    const c = pack.comparisons.find((item) => item.id === row.comparisonId), comparisonRow = c && c.rows[row.rowIndex];
    const key = `${row.comparisonId}:${row.rowIndex}`;
    requireValue(c && comparisonRow && !comparisonRelations.has(key) && (!row.rowId || row.rowId === comparisonRow.id), `${key}: 易混行目标关系无效/重复`);
    comparisonRelations.add(key);
    relationTargets(row.targetIds, key, c.scope, c.groupId, comparisonRow.refs);
  }
  for (const c of pack.comparisons) {
    if (!targetGroups.has(c.groupId)) continue;
    requireValue(c.rows.every((_, index) => comparisonRelations.has(`${c.id}:${index}`)), `${c.id}: 试点易混行缺少目标关系`);
  }
  const relatedTargets = new Set([
    ...pack.targetRelations.questionTargets.flatMap((row) => [...(row.primaryTargetIds || []), ...(row.supportingTargetIds || [])]),
    ...pack.targetRelations.mnemonicPhraseTargets.flatMap((row) => row.targetIds || []),
    ...pack.targetRelations.comparisonRowTargets.flatMap((row) => row.targetIds || []),
  ]);
  requireValue(pack.targets.every((target) => relatedTargets.has(target.id)), "存在未使用的试点目标");
  const comparisonSpecificationIds = new Set();
  const comparisonSpecificationById = new Map();
  for (const spec of pack.comparisonSpecifications) {
    const c = pack.comparisons.find((item) => item.id === spec.comparisonId);
    requireValue(c && !comparisonSpecificationIds.has(c.id) && spec.revision === c.revision,
      `${spec.comparisonId}: 易混学习包规格无效/重复`);
    comparisonSpecificationIds.add(c.id); comparisonSpecificationById.set(c.id, spec);
    requireValue(JSON.stringify(spec.dimensionIds) === JSON.stringify(c.dimensions?.map((dimension) => dimension.id)) &&
      JSON.stringify(spec.rowIds) === JSON.stringify(c.rows.map((row) => row.id)) &&
      spec.initialQuestionId === c.initialQuestionId &&
      JSON.stringify(spec.recheckQuestionIds) === JSON.stringify(c.recheckQuestionIds) &&
      JSON.stringify(spec.requiredQuestionIds) === JSON.stringify(c.questionIds), `${c.id}: 易混维度、行或题目规格不一致`);
  }
  const comparedGroups = new Set();
  for (const c of pack.comparisons) {
    const group = pack.groups.find((g) => g.id === c.groupId && g.scope === c.scope);
    requireValue(group && !comparedGroups.has(c.groupId), `${c.id}: 对照主题缺失/重复`);
    comparedGroups.add(c.groupId);
    if (c.supplementalSources) {
      requireValue(Array.isArray(c.supplementalSources) && c.supplementalSources.length && c.supplementalSources.every((s) =>
        s.title && s.locator && s.retrieved === true && /^https:\/\/[^\s]+$/.test(s.url) && /^\d{4}-\d{2}-\d{2}$/.test(s.checkedAt)), `${c.id}: 补核资料缺失或无效`);
    }
    requireValue(c.title && c.coverage && c.caution && c.excludes?.length && c.excludes.every((s) => typeof s === "string" && s.trim()), `${c.id}: 对照范围或边界缺失`);
    requireValue(c.questionIds?.length >= 2 && new Set(c.questionIds).size === c.questionIds.length &&
      c.questionIds.every((id) => group.questionIds.includes(id)), `${c.id}: 对照题目与主题不一致`);
    requireValue(c.initialQuestionId === c.questionIds[0] && c.recheckQuestionIds?.length === c.questionIds.length - 1 &&
      c.recheckQuestionIds.every((id, i) => id === c.questionIds[i + 1]), `${c.id}: 初判/复辨顺序无效`);
    requireValue(c.rows?.length >= 2, `${c.id}: 比较对象不足`);
    const covered = new Set(), spec = comparisonSpecificationById.get(c.id);
    const dimensionIds = c.dimensions?.map((dimension) => dimension.id) || [];
    requireValue(!(c.questionRoles || c.dimensions) || spec, `${c.id}: 易混学习包缺少规格`);
    if (spec) {
      requireValue(c.confusionReason && c.evidenceBasis?.editorial && c.evidenceBasis.observedErrorData === null &&
        c.questionIds.length === 3 && dimensionIds.length && new Set(dimensionIds).size === dimensionIds.length &&
        c.dimensions.every((dimension) => dimension.label), `${c.id}: 混淆理由、依据或比较维度缺失`);
      requireValue(c.questionRoles?.length === 3 && c.questionRoles[0].role === "initial-judgement" &&
        c.questionRoles.slice(1).every((role) => role.role === "recheck") &&
        JSON.stringify(c.questionRoles.map((role) => role.questionId)) === JSON.stringify(c.questionIds), `${c.id}: 初判与复辨职责无效`);
      for (const role of c.questionRoles) {
        const relation = relationByQuestion.get(role.questionId);
        const relatedTargetIds = relation && [...(relation.primaryTargetIds || []), ...(relation.supportingTargetIds || [])];
        requireValue(role.focus && role.checkPurpose === relation?.checkPurpose && role.targetIds?.length &&
          role.targetIds.every((targetId) => relatedTargetIds.includes(targetId)), `${c.id}:${role.questionId}: 题目职责与目标关系不一致`);
      }
    }
    for (const row of c.rows) {
      requireValue(row.label && row.condition && row.distinction && row.refs?.length && row.questionIds?.length, `${c.id}: 对照行或来源缺失`);
      if (spec) {
        const relation = pack.targetRelations.comparisonRowTargets.find((item) => item.comparisonId === c.id && item.rowId === row.id);
        requireValue(row.id && row.targetIds?.length && relation && JSON.stringify(row.targetIds) === JSON.stringify(relation.targetIds) &&
          row.dimensionValues && JSON.stringify(Object.keys(row.dimensionValues).sort()) === JSON.stringify(dimensionIds.slice().sort()) &&
          Object.values(row.dimensionValues).every((value) => typeof value === "string" && value.trim()), `${c.id}:${row.id}: 对照维度或目标映射不完整`);
      }
      for (const id of row.questionIds) {
        requireValue(c.questionIds.includes(id) && byQuestion[id].refs.some((q) => row.refs.some((ref) => ref.pointId === q.pointId && ref.tabId === q.tabId)), `${c.id}: 对照行跨目标或无共同来源`);
        covered.add(id);
      }
      row.refs = row.refs.map((ref) => {
        const canonical = c.refs.find((r) => r.pointId === ref.pointId && r.tabId === ref.tabId &&
          JSON.stringify(r.sourceUnitIds) === JSON.stringify(ref.sourceUnitIds));
        requireValue(canonical, `${c.id}: 对照行来源未声明`);
        return canonical;
      });
    }
    requireValue(c.questionIds.every((id) => covered.has(id)), `${c.id}: 对照行漏目标`);
    if (spec) {
      const rowTargetIds = [...new Set(c.rows.flatMap((row) => row.targetIds))];
      const roleTargetIds = new Set(c.questionRoles.flatMap((role) => role.targetIds));
      requireValue(JSON.stringify(spec.requiredTargetIds) === JSON.stringify(rowTargetIds) &&
        spec.requiredTargetIds.every((targetId) => roleTargetIds.has(targetId)), `${c.id}: 必需目标未被对照行或三题流程完整覆盖`);
    }
  }
  validateEntryPlans(pack);
  return pack;
}

function report(pack, material) {
  const sha = crypto.createHash("sha256").update(JSON.stringify(material)).digest("hex");
  const covered = new Set(pack.questions.flatMap((q) => q.refs.map((r) => r.pointId)));
  const lines = [
    "# 常识学习 V1 候选内容验收单", "",
    "这是待人工审核的样本，不代表全量正文已审核。修改候选源后运行构建器；`--check` 不写文件。", "",
    `正文：${material.points.length} 个详情单元；本批映射 ${covered.size} 个详情单元、${pack.questions.length} 道候选问答、${pack.targets.length} 个已建独立目标、${pack.mnemonics.length} 条口诀、${pack.examTopics.length} 个急救专题。`,
    `已审核口诀：${pack.mnemonics.filter((m) => m.status === "approved").length}/${pack.mnemonics.length}；其余正文目标尚未逐条盘点，不能据此计算全库考点覆盖率。`, "",
    `易混对照：${pack.comparisons.length} 组；已审核 ${pack.comparisons.filter((c) => c.status === "approved").length} 组。仅覆盖各组声明目标，不增加全库覆盖率。`, "",
    `源数据 SHA-256：\`${sha}\`。运行时使用 tab 指纹检查漂移，不把指纹视为审核签名。`, "",
    "逐小节待办、已映射页签及待核来源见同目录的 `common-sense-learning-v1-coverage.md` 与 JSON 清单。", "",
    "## 领域覆盖", "",
    "| 领域 | 问答 | 口诀 | 处理状态 |", "|---|---:|---:|---|",
    ...material.directory.map((p) => `| ${p.title} | ${pack.questions.filter((q) => q.scope === p.id).length} | ${pack.mnemonics.filter((m) => m.scope === p.id).length} | ${pack.questions.some((q) => q.scope === p.id) ? "样本待审核，其余待盘点" : "派生内容待建设，正文可查"} |`),
    "", "## 主题编排", "", "| 主题 | 题数 | 学习形式 |", "|---|---:|---|",
    ...pack.groups.map((g) => `| ${g.title} | ${g.questionIds.length} | ${g.mnemonicDecision === "not-suitable" ? "辨析题；" + g.mnemonicReason : "主题问答与口诀"} |`),
    "", "## 问答逐条验收", "",
  ];
  pack.questions.forEach((q) => lines.push(`### ${q.id} · ${q.status}`, "", `目标：${q.objective}`, "", q.prompt, "",
    ...q.options.map((o, i) => `${i + 1}. ${o}${i === q.answer ? "（正确）" : ""}`), "",
    `解释：${q.explanation}`, "", `边界：${q.boundary}`, "",
    ...(pack.questionSpecifications.find((spec) => spec.questionId === q.id) ? [
      `检测用途：${pack.questionSpecifications.find((spec) => spec.questionId === q.id).checkPurpose}`,
      `干扰项：${Object.entries(pack.questionSpecifications.find((spec) => spec.questionId === q.id).distractorReasons).map(([index, reason]) => `${Number(index) + 1}.${reason}`).join("；")}`, "",
    ] : []),
    `来源：${q.refs.map((r) => `${r.label} / ${r.sourceUnitIds.join(", ")}`).join("；")}`, ...(q.verificationLabel ? ["", `核验：${q.verificationLabel}`] : []), ""));
  lines.push("## 口诀逐条验收", "");
  pack.mnemonics.forEach((m) => {
    lines.push(`### ${m.title} · ${m.status}`, "", m.text, "", ...(m.purpose ? [`记忆目的：${m.purpose}`, ""] : []),
      `记法：${m.method}`, "", `覆盖：${m.coverage}`, "", ...(m.conditions?.length ? [`适用条件：${m.conditions.join("；")}`, ""] : []),
      `不覆盖：${m.excludes.join("；")}`, "");
    m.phrases.forEach((p) => lines.push(`- **${p.id ? p.id + " · " : ""}${p.phrase}**：${p.meaning}` +
      `；目标 ${p.targetIds?.join("、") || p.questionIds.join("、")}` +
      `；自测 ${(p.checks || []).map((check) => `${check.questionId}→${check.reviewTarget}/${check.reviewAnchorId}`).join("、") || p.questionIds.join("、")}` +
      `；来源 ${p.refs.map((r) => `${r.pointId}/${r.tabId}`).join("、")}`));
    if (m.verificationLabel) lines.push("", `核验：${m.verificationLabel}`);
    lines.push("");
  });
  lines.push("## 易混对照逐组验收", "");
  pack.comparisons.forEach((c) => {
    lines.push(`### ${c.title} · ${c.status}`, "", ...(c.confusionReason ? [`混淆理由：${c.confusionReason}`, ""] : []),
      ...(c.dimensions?.length ? [`比较维度：${c.dimensions.map((dimension) => dimension.label).join("；")}`, ""] : []),
      `覆盖：${c.coverage}`, "", `不覆盖：${c.excludes.join("；")}`, "",
      `初判：${c.initialQuestionId}；再辨：${c.recheckQuestionIds.join("、")}`, "");
    c.rows.forEach((row) => lines.push(`- **${row.id ? row.id + " · " : ""}${row.label}**：${row.condition}；区别：${row.distinction}；目标 ${(row.targetIds || row.questionIds).join("、")}；题目 ${row.questionIds.join("、")}；来源 ${row.refs.map((ref) => `${ref.pointId}/${ref.tabId}`).join("、")}`));
    lines.push("", `提醒：${c.caution}`, ...(c.verificationLabel ? ["", `核验：${c.verificationLabel}`] : []));
    (c.supplementalSources || []).forEach((s) => lines.push("", `补核资料：[${s.title}](${s.url})；${s.locator}；查阅 ${s.checkedAt}（仍待人工内容审核）。`));
    lines.push("");
  });
  lines.push("## 考前急救专题逐组验收", "");
  pack.examTopics.forEach((topic) => lines.push(`### ${topic.title} · ${topic.status}`, "", `任务：${topic.task}`, "",
    `纳入理由：${topic.inclusionReasons.join("；")}`, "", `覆盖：${topic.coverage}`, "", `不覆盖：${topic.excludes.join("；")}`, "",
    `完成边界：${topic.completionScope}`, "", `题目：${topic.questionSteps.map((step) => `${step.questionId}（${step.role}：${step.reason}）`).join("；")}`, "",
    `配套口诀：${topic.mnemonicIds.join("、")}；配套对照：${topic.comparisonIds.join("、")}`, ""));
  lines.push("## 外部核验来源", "");
  Object.values(pack.verificationSources || {}).forEach((s) => lines.push(`- [${s.title}](${s.url})：${s.version}；本轮读取日期 ${s.checkedAt}。仅用于已声明条目核验，不宣称已核验所有修法与司法解释。`));
  lines.push("", "## 审核记录", "", "候选表达为本轮原创整理；依据为现有正文。尚无人工审核人、结论或批准日期。", "",
    "复核每项答案、干扰项、口诀释义和适用条件；来源变动先复核正文，再修订 revision 并重建。不得仅为让发布校验通过改成 approved。", "");
  return lines.join("\n");
}

if (require.main === module) {
  const pack = compile(authored, body);
  const inventory = buildInventory(pack, body);
  const entryMatrix = buildEntryMatrix(pack, body);
  if (process.argv.includes("--release")) {
    const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
    const ready = availableContent(body, pack, false);
    if (ready.questions.length !== pack.questions.length || ready.mnemonics.length !== pack.mnemonics.length || ready.comparisons.length !== pack.comparisons.length ||
      ready.examTopics.length !== pack.examTopics.length) {
      throw new Error("发布阻止：候选或其正文来源尚未审核通过。");
    }
  }
  const outputs = [
    ["miniprogram/subpackages/common-sense/models/learning-pack.js", "// Generated by scripts/build-common-sense-learning.js.\nmodule.exports = " + JSON.stringify(pack, null, 2) + ";\n"],
    ["docs/knowledge-platform/implementations/common-sense-learning-v1-content-review.md", report(pack, body)],
    ["docs/knowledge-platform/implementations/common-sense-learning-v1-coverage.json", JSON.stringify(inventory, null, 2) + "\n"],
    ["docs/knowledge-platform/implementations/common-sense-learning-v1-coverage.md", inventoryReport(inventory)],
    ["docs/knowledge-platform/implementations/common-sense-entry-matrix.json", JSON.stringify(entryMatrix, null, 2) + "\n"],
    ["docs/knowledge-platform/implementations/common-sense-entry-matrix.md", entryMatrixReport(entryMatrix)],
  ];
  for (const [file, value] of outputs) {
    const target = path.join(root, file);
    if (process.argv.includes("--check")) {
      if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== value) throw new Error(`构建产物过期：${file}`);
    } else fs.writeFileSync(target, value);
  }
  console.log(`常识学习内容${process.argv.includes("--check") ? "检查" : "构建"}通过：${pack.questions.length} 问答 / ${pack.mnemonics.length} 口诀 / ${pack.comparisons.length} 对照 / ${pack.examTopics.length} 急救专题；均为候选。`);
}
module.exports = { compile, report, buildInventory, buildEntryMatrix };
