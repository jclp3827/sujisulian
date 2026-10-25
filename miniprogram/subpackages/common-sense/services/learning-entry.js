// Entry membership is an intersection with already admitted content, never a publication gate override.
function entryPlan(content, mode) {
  const plans = content.entryPlans;
  return plans && plans.schemaVersion === 1 && plans.modes && plans.modes[mode] || null;
}
function resolveIds(ids, items) {
  if (!Array.isArray(ids)) return [];
  const byId = new Map(items.map((item) => [item.id, item]));
  return [...new Set(ids)].map((id) => byId.get(id)).filter(Boolean);
}
function inScope(item, scope) { return scope === "all" || item.scope === scope; }
function targetIds(plan, mode, variant) {
  return plan && (mode === "exam" ? variant === "review" ? plan.reviewQuestionIds : plan.selectedQuestionIds : plan.questionIds) || [];
}
function entryMnemonics(content, scope = "all") {
  const plan = entryPlan(content, "mnemonic");
  return resolveIds(plan && plan.mnemonicIds, content.mnemonics).filter((m) => inScope(m, scope) &&
    m.questionIds.every((id) => targetIds(plan, "mnemonic").includes(id)));
}
function entryComparisons(content, scope = "all") {
  const plan = entryPlan(content, "confusion");
  return resolveIds(plan && plan.comparisonIds, content.comparisons || [])
    .filter((c) => inScope(c, scope) && c.questionIds.every((id) => targetIds(plan, "confusion").includes(id)) && content.groups.some((g) => g.id === c.groupId &&
      c.questionIds.every((id) => g.questionIds.includes(id))));
}
function entryExamTopics(content, scope = "all") {
  const plan = entryPlan(content, "exam");
  const selectedQuestions = new Set(targetIds(plan, "exam", "selected"));
  return resolveIds(plan && plan.selectedExamTopicIds, content.examTopics || [])
    .filter((topic) => inScope(topic, scope) && (plan.selectedGroupIds || []).includes(topic.groupId) &&
      topic.questionIds.every((id) => selectedQuestions.has(id)));
}
function entryGroups(content, mode, scope = "all", variant = "selected") {
  const plan = entryPlan(content, mode);
  if (!plan) return [];
  let ids = plan.groupIds;
  if (mode === "exam") ids = variant === "review" ? plan.reviewGroupIds : plan.selectedGroupIds;
  if (mode === "confusion") ids = entryComparisons(content, scope).map((c) => c.groupId);
  if (mode === "mnemonic") {
    const questions = new Set(entryMnemonics(content, scope).flatMap((m) => m.questionIds));
    ids = content.questions.filter((q) => questions.has(q.id)).map((q) => q.group);
  }
  return resolveIds(ids, content.groups).filter((g) => inScope(g, scope))
    .map((g) => ({ ...g, questionIds: g.questionIds.filter((id) => targetIds(plan, mode, variant).includes(id)) }))
    .filter((g) => g.questionIds.length);
}
function entryQuestions(content, mode, scope = "all", variant = "selected") {
  const ids = mode === "mnemonic" ? entryMnemonics(content, scope).flatMap((m) => m.questionIds) :
    entryGroups(content, mode, scope, variant).flatMap((g) => g.questionIds);
  return resolveIds(ids, content.questions).filter((q) => inScope(q, scope));
}
function confusionGroups(content, scope = "all") { return entryGroups(content, "confusion", scope); }
module.exports = { entryPlan, entryMnemonics, entryComparisons, entryExamTopics, entryGroups, entryQuestions, confusionGroups };
