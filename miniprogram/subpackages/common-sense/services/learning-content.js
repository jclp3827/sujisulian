// Portable deterministic drift fingerprint; not an approval or cryptographic signature.
function fingerprint(value) {
  const str = JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function displayOptionOrder(question, optionSeed) {
  const options = question && Array.isArray(question.options) ? question.options : [];
  const order = options.map((_, index) => index);
  const seed = `${optionSeed || ""}:${question && question.id || ""}:${question && question.revision || 1}`;
  for (let index = order.length - 1; index > 0; index -= 1) {
    const offset = Number.parseInt(fingerprint(`${seed}:${index}`), 16) % (index + 1);
    [order[index], order[offset]] = [order[offset], order[index]];
  }
  return order;
}

function findSource(body, ref) {
  const point = body.points.find((p) => p.id === ref.pointId);
  const tab = point && point.tabs.find((t) => t.id === ref.tabId);
  return { point, tab };
}

function sourceIds(value, found = []) {
  if (!value || typeof value !== "object") return found;
  if (Array.isArray(value.sourceUnitIds)) found.push(...value.sourceUnitIds);
  Object.keys(value).forEach((key) => {
    if (key !== "sourceUnitIds" && typeof value[key] === "object") sourceIds(value[key], found);
  });
  return found;
}

function itemRefs(item) {
  return item.refs || (item.phrases || []).reduce((refs, phrase) => refs.concat(phrase.refs || []), []);
}

function sourceValid(body, ref, development) {
  const { point, tab } = findSource(body, ref);
  if (!tab || fingerprint(tab) !== ref.fingerprint) return false;
  const ids = sourceIds(tab);
  if (!ref.sourceUnitIds.length || !ref.sourceUnitIds.every((id) => ids.includes(id))) return false;
  // No inferred promotion from ready-for-user-acceptance to publishable.
  return development || point.sourceAuditStatus === "approved";
}

function availableContent(body, pack, development, options = {}) {
  const reviewedContentVisible = development || options.publicReviewed === true;
  const allowed = (item) => (item.status === "approved" || (reviewedContentVisible && item.status === "review"))
    && itemRefs(item).length > 0
    && itemRefs(item).every((ref) => sourceValid(body, ref, reviewedContentVisible));
  const targets = (pack.targets || []).filter(allowed);
  const allowedTargetIds = new Set(targets.map((target) => target.id));
  const declaredRelations = pack.targetRelations || { questionTargets: [], mnemonicPhraseTargets: [], comparisonRowTargets: [] };
  const relationAvailable = (row) => [...(row.primaryTargetIds || []), ...(row.supportingTargetIds || []), ...(row.targetIds || [])]
    .every((id) => allowedTargetIds.has(id));
  const questionRelations = new Map((declaredRelations.questionTargets || []).map((row) => [row.questionId, row]));
  const questions = pack.questions.filter((q) => allowed(q) && (!questionRelations.has(q.id) || relationAvailable(questionRelations.get(q.id))));
  const questionIds = new Set(questions.map((q) => q.id));
  const mnemonicPhraseRelations = (declaredRelations.mnemonicPhraseTargets || []).filter(relationAvailable);
  const mnemonicRelationKeys = new Set(mnemonicPhraseRelations.map((row) => `${row.mnemonicId}:${row.phraseIndex}`));
  const declaredMnemonicKeys = new Set((declaredRelations.mnemonicPhraseTargets || []).map((row) => `${row.mnemonicId}:${row.phraseIndex}`));
  const mnemonics = pack.mnemonics.filter((m) => allowed(m) && m.questionIds.every((id) => questionIds.has(id)) &&
    m.phrases.every((_, index) => !declaredMnemonicKeys.has(`${m.id}:${index}`) || mnemonicRelationKeys.has(`${m.id}:${index}`)));
  const groups = pack.groups.map((g) => ({ ...g, questionIds: g.questionIds.filter((id) => questionIds.has(id)) }))
    .filter((g) => g.questionIds.length);
  const comparisonRowRelations = (declaredRelations.comparisonRowTargets || []).filter(relationAvailable);
  const comparisonRelationKeys = new Set(comparisonRowRelations.map((row) => `${row.comparisonId}:${row.rowIndex}`));
  const declaredComparisonKeys = new Set((declaredRelations.comparisonRowTargets || []).map((row) => `${row.comparisonId}:${row.rowIndex}`));
  const comparisons = (pack.comparisons || []).filter((c) => allowed(c) && c.questionIds.every((id) => questionIds.has(id)) &&
    c.rows.every((_, index) => !declaredComparisonKeys.has(`${c.id}:${index}`) || comparisonRelationKeys.has(`${c.id}:${index}`)) &&
    groups.some((g) => g.id === c.groupId && g.scope === c.scope && c.questionIds.every((id) => g.questionIds.includes(id))));
  const scopeOrder = body.directory.map((p) => p.id);
  const availableQuestionIds = new Set(questions.map((q) => q.id));
  const availableMnemonicIds = new Set(mnemonics.map((m) => m.id));
  const availableComparisonIds = new Set(comparisons.map((c) => c.id));
  const comparisonSpecifications = (pack.comparisonSpecifications || []).filter((spec) => availableComparisonIds.has(spec.comparisonId) &&
    spec.requiredQuestionIds.every((id) => availableQuestionIds.has(id)) && spec.requiredTargetIds.every((id) => allowedTargetIds.has(id)));
  const availableComparisonSpecificationIds = new Set(comparisonSpecifications.map((spec) => spec.comparisonId));
  const declaredComparisonSpecificationIds = new Set((pack.comparisonSpecifications || []).map((spec) => spec.comparisonId));
  const admittedComparisons = comparisons.filter((comparison) => !declaredComparisonSpecificationIds.has(comparison.id) ||
    availableComparisonSpecificationIds.has(comparison.id));
  const admittedComparisonIds = new Set(admittedComparisons.map((comparison) => comparison.id));
  const availableMnemonicIdsForTopics = new Set(mnemonics.map((mnemonic) => mnemonic.id));
  const examTopics = (pack.examTopics || []).filter((topic) => allowed(topic) &&
    topic.questionIds.every((id) => questionIds.has(id)) && topic.targetIds.every((id) => allowedTargetIds.has(id)) &&
    topic.mnemonicIds.every((id) => availableMnemonicIdsForTopics.has(id)) &&
    topic.comparisonIds.every((id) => admittedComparisonIds.has(id)) &&
    groups.some((group) => group.id === topic.groupId && group.scope === topic.scope && topic.questionIds.every((id) => group.questionIds.includes(id))));
  const targetRelations = {
    questionTargets: (declaredRelations.questionTargets || []).filter((row) => availableQuestionIds.has(row.questionId) && relationAvailable(row)),
    mnemonicPhraseTargets: mnemonicPhraseRelations.filter((row) => availableMnemonicIds.has(row.mnemonicId)),
    comparisonRowTargets: comparisonRowRelations.filter((row) => admittedComparisonIds.has(row.comparisonId)),
  };
  // Comparison revisions invalidate their own flow, without resetting unchanged question/reading queues.
  const version = fingerprint({ version: pack.version, questions, mnemonics, groups, scopeOrder });
  const sessionMigrations = (pack.sessionMigrations || [])
    .filter((migration) => !migration.toPackVersion || migration.toPackVersion === pack.version)
    .map((migration) => ({ ...migration, changedQuestionIds: migration.changedQuestionIds || [],
      changedMnemonicIds: migration.changedMnemonicIds || [], changedComparisonIds: migration.changedComparisonIds || [],
      changedExamTopicIds: migration.changedExamTopicIds || [], toVersion: version }));
  const questionSpecifications = (pack.questionSpecifications || []).filter((spec) => availableQuestionIds.has(spec.questionId));
  const mnemonicSpecifications = (pack.mnemonicSpecifications || []).filter((spec) => availableMnemonicIds.has(spec.mnemonicId));
  const mnemonicConceptBindings = (pack.mnemonicConceptBindings || []).filter((binding) =>
    availableMnemonicIds.has(binding.mnemonicId) && (pack.conceptFrames || []).some((frame) =>
      frame.id === binding.conceptFrameId && frame.revision === binding.conceptFrameRevision));
  const availableConceptFrameIds = new Set(mnemonicConceptBindings.map((binding) => binding.conceptFrameId));
  const conceptFrames = (pack.conceptFrames || []).filter((frame) => availableConceptFrameIds.has(frame.id));
  return { version,
    targetVersion: fingerprint({ targets, targetRelations }), targets, targetRelations,
    questions, questionSpecifications, mnemonicSpecifications, comparisonSpecifications, mnemonics, groups, scopeOrder,
    conceptFrames, mnemonicConceptBindings,
    comparisons: admittedComparisons, examTopics, entryPlans: pack.entryPlans || null,
    sessionMigrations };
}

function answerFeedback(question, specification, answer) {
  const empty = { feedback: "", answerSummary: "", correctAnswerText: "", selectedOptionText: "", distractorReason: "" };
  if (!question || !answer || !Array.isArray(question.options)) return empty;
  const correctAnswerText = question.options[question.answer] || "";
  const answerSummary = correctAnswerText ? `正确答案：${correctAnswerText}` : "";
  if (answer.type === "reveal") return { ...empty, correctAnswerText, answerSummary, feedback: "已揭晓，先理解判断依据" };
  if (answer.type !== "choice" || !Number.isInteger(answer.choice) || !question.options[answer.choice]) return empty;
  if (answer.choice === question.answer) {
    return { ...empty, correctAnswerText, answerSummary, feedback: "本次答对了" };
  }
  const reasons = specification && specification.questionId === question.id && specification.distractorReasons || {};
  return { ...empty, correctAnswerText, answerSummary, feedback: "这次选错了，先定位这项错在哪里",
    selectedOptionText: question.options[answer.choice],
    distractorReason: reasons[answer.choice] || "这项不符合题目的正确判断，请结合下方判断依据与范围边界核对。" };
}

function detailUrl(ref) {
  return `/subpackages/common-sense/detail/index?moduleId=common-sense&pointId=${encodeURIComponent(ref.pointId)}&tabId=${encodeURIComponent(ref.tabId)}`;
}

module.exports = { fingerprint, displayOptionOrder, findSource, sourceIds, itemRefs, sourceValid, availableContent, answerFeedback, detailUrl };
