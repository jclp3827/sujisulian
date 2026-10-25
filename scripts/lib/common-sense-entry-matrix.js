const { availableContent } = require("../../miniprogram/subpackages/common-sense/services/learning-content");
const { entryPlan, entryGroups, entryQuestions, entryMnemonics, entryComparisons, entryExamTopics } = require("../../miniprogram/subpackages/common-sense/services/learning-entry");
const TITLES = { qa: "一问一答", daily: "每日常识", mnemonic: "常识口诀", confusion: "易混辨析", exam: "考前急救" };
const STRATEGIES = { qa: "least-recent-question", daily: "due-review-then-new-theme", mnemonic: "least-recent-reading", confusion: "rotate-comparison", exam: "curated-or-personal-review" };
function validateEntryPlans(pack) {
  const plans = pack.entryPlans;
  const need = (ok, message) => { if (!ok) throw Error("入口编排：" + message); };
  need(plans && plans.schemaVersion === 1 && Number.isInteger(plans.revision) && plans.revision > 0 && plans.modes, "配置缺失或版本无效");
  need(Object.keys(plans.modes).length === 5, "学习方式不完整或含未知方式");
  const lists = (ids, items, label) => need(Array.isArray(ids) && new Set(ids).size === ids.length && ids.every((id) => items.some((item) => item.id === id)), label + "含重复/不存在的 ID");
  for (const [mode, strategy] of Object.entries(STRATEGIES)) {
    const plan = plans.modes[mode];
    need(plan && plan.strategy === strategy, mode + "方法不支持");
    need(typeof plan.coverage === "string" && plan.coverage.trim() && Array.isArray(plan.excludes) && plan.excludes.length && plan.excludes.every((s) => typeof s === "string" && s.trim()), mode + "覆盖或排除范围缺失");
    if (["qa", "daily"].includes(mode)) lists(plan.groupIds, pack.groups, mode);
    if (mode === "mnemonic") lists(plan.mnemonicIds, pack.mnemonics, mode);
    if (mode === "confusion") lists(plan.comparisonIds, pack.comparisons, mode);
    if (mode === "exam") { lists(plan.selectedGroupIds, pack.groups, "精选"); lists(plan.reviewGroupIds, pack.groups, "个人回顾");
      if (plans.revision >= 6 || (pack.examTopics || []).length) lists(plan.selectedExamTopicIds, pack.examTopics || [], "精选急救专题"); }
    const targets = (qids, gids) => {
      lists(qids, pack.questions, mode + "目标");
      if (gids) need(qids.every((id) => gids.includes(pack.questions.find((q) => q.id === id).group)), mode + "目标不在声明主题中");
    };
    if (mode === "exam") { targets(plan.selectedQuestionIds, plan.selectedGroupIds); targets(plan.reviewQuestionIds, plan.reviewGroupIds); }
    else targets(plan.questionIds, plan.groupIds);
    if (mode === "mnemonic") need(plan.mnemonicIds.every((id) => pack.mnemonics.find((m) => m.id === id).questionIds.every((q) => plan.questionIds.includes(q))), "口诀目标没有完整编入");
    if (mode === "confusion") need(plan.comparisonIds.every((id) => pack.comparisons.find((c) => c.id === id).questionIds.every((q) => plan.questionIds.includes(q))), "对照目标没有完整编入");
    if (["daily", "mnemonic"].includes(mode)) need(Number.isInteger(plan.maxItems) && plan.maxItems >= 1 && plan.maxItems <= 5, mode + "数量预算越界");
    if (mode === "daily") need(Number.isInteger(plan.maxReview) && plan.maxReview >= 0 && plan.maxReview <= 2 && plan.maxReview <= plan.maxItems, "每日回顾预算越界");
    if (mode === "daily") lists(plan.featuredQuestionIds || [], pack.questions, "每日显式复用");
  }
}
function buildEntryMatrix(pack, body) {
  const development = availableContent(body, pack, true), formal = availableContent(body, pack, false);
  const authored = { ...pack, scopeOrder: body.directory.map((p) => p.id) };
  const questionIds = (content, mode, variant) => entryQuestions(content, mode, "all", variant).map((q) => q.id);
  const count = (content, mode, variant) => {
    const questions = questionIds(content, mode, variant);
    return { questions: questions.length, groups: entryGroups(content, mode, "all", variant).length,
      mnemonics: mode === "mnemonic" ? entryMnemonics(content).length : 0,
      comparisons: mode === "confusion" ? entryComparisons(content).length : 0 };
  };
  const entries = Object.keys(TITLES).flatMap((mode) => (mode === "exam" ? ["selected", "review"] : ["selected"]).map((variant) => ({
    mode, title: TITLES[mode] + (mode === "exam" ? variant === "review" ? " · 个人待回顾" : " · 精选回看" : ""), variant,
    plan: entryPlan(authored, mode), questionIds: questionIds(authored, mode, variant),
    groupIds: entryGroups(authored, mode, "all", variant).map((g) => g.id),
    mnemonicIds: mode === "mnemonic" ? entryMnemonics(authored).map((m) => m.id) : [],
    comparisonIds: mode === "confusion" ? entryComparisons(authored).map((c) => c.id) : [],
    examTopicIds: mode === "exam" && variant === "selected" ? entryExamTopics(authored).map((topic) => topic.id) : [],
    counts: { declared: count(authored, mode, variant), developmentAvailable: count(development, mode, variant), publishable: count(formal, mode, variant) },
    personalFilter: mode === "exam" && variant === "review" ? "此处列可进入个人回顾的范围；实际题数还需本人再看记录，本清单不含用户数据。" : "",
    scopes: body.directory.map((p) => ({ scope: p.id, title: p.title, questions: entryQuestions(authored, mode, p.id, variant).length,
      developmentQuestions: entryQuestions(development, mode, p.id, variant).length,
      mnemonicCount: mode === "mnemonic" ? entryMnemonics(authored, p.id).length : 0,
      comparisonCount: mode === "confusion" ? entryComparisons(authored, p.id).length : 0 })),
  })));
  const targetModes = (id) => entries.filter((e) => e.questionIds.includes(id)).map((e) => e.mode + (e.mode === "exam" ? ":" + e.variant : ""));
  const inactive = {
    questions: pack.questions.filter((q) => q.status === "blocked" || q.lifecycle === "retired-alias").map((q) => q.id),
    mnemonics: pack.mnemonics.filter((m) => m.status === "blocked" || m.lifecycle === "retired-alias").map((m) => m.id),
  };
  const inactiveQuestionIds = new Set(inactive.questions), inactiveMnemonicIds = new Set(inactive.mnemonics);
  const unassigned = { questions: pack.questions.filter((q) => !inactiveQuestionIds.has(q.id) && !targetModes(q.id).length).map((q) => q.id),
    mnemonics: pack.mnemonics.filter((m) => !inactiveMnemonicIds.has(m.id) && !entries.some((e) => e.mnemonicIds.includes(m.id))).map((m) => m.id),
    comparisons: pack.comparisons.filter((c) => !entries.some((e) => e.comparisonIds.includes(c.id))).map((c) => c.id) };
  return { schemaVersion: 1, planRevision: pack.entryPlans.revision, contentVersion: pack.version,
    definitions: { counts: "声明数量、开发准入数量、正式准入数量分别计算；个人待回顾的声明池不是某位用户的错题数。",
      coverage: "目标/来源/记忆方法只覆盖既有声明；候选不等于批准、已学或完整考点覆盖。",
      sharing: "各入口引用同一目标 ID 与来源；答题和阅读仍使用既有状态，不复制平行知识正文。" },
    browse: { points: body.points.length, tabs: body.points.reduce((n, p) => n + p.tabs.length, 0), independentFromLearningEnrollment: true },
    entries, unassigned, inactive,
    themes: pack.groups.map((g) => ({ id: g.id, scope: g.scope, title: g.title, questionIds: g.questionIds,
      mnemonicDecision: g.mnemonicDecision || "authored", mnemonicReason: g.mnemonicReason || "只覆盖本组已声明目标。",
      entries: entries.filter((e) => e.groupIds.includes(g.id)).map((e) => e.mode + (e.mode === "exam" ? ":" + e.variant : "")) })),
    targets: pack.questions.map((q) => ({ id: q.id, groupId: q.group, objective: q.objective, boundary: q.boundary, status: q.status, entries: targetModes(q.id), refs: q.refs })),
    mnemonics: pack.mnemonics.map((m) => ({ id: m.id, method: m.method, coverage: m.coverage, excludes: m.excludes, status: m.status, questionIds: m.questionIds,
      phrases: m.phrases.map((p) => ({ phrase: p.phrase, meaning: p.meaning, questionIds: p.questionIds, refs: p.refs })) })),
    comparisons: pack.comparisons.map((c) => ({ id: c.id, coverage: c.coverage, excludes: c.excludes, status: c.status, questionIds: c.questionIds, refs: c.refs })),
    examTopics: (pack.examTopics || []).map((topic) => ({ id: topic.id, title: topic.title, task: topic.task, coverage: topic.coverage,
      excludes: topic.excludes, inclusionReasons: topic.inclusionReasons, completionScope: topic.completionScope,
      questionIds: topic.questionIds, targetIds: topic.targetIds, status: topic.status })),
    gaps: { atomicTargetInventoryComplete: false, uncompiledBodyUnitsRemain: true, heldTabs: pack.authoringConstraints || [],
      note: "完整正文可查，但尚未穷举全库原子目标。下一批逐主题扩编，不按入口凑数。" } };
}
const cell = (value) => String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
function entryMatrixReport(matrix) {
  const lines = ["# 常识学习入口内容编排矩阵", "", "入口配置是学习内容的显式清单，不代表内容人工批准或考频统计。", "",
    "## 入口范围与准入数量", "", "| 入口 | 声明问答 | 声明口诀 | 声明对照 | 开发可用问答 | 正式可用问答 |", "|---|---:|---:|---:|---:|---:|"];
  for (const e of matrix.entries) { const c = e.counts; lines.push(`| ${e.title} | ${c.declared.questions} | ${c.declared.mnemonics} | ${c.declared.comparisons} | ${c.developmentAvailable.questions} | ${c.publishable.questions} |`); }
  lines.push("", "开发可用不代表正式可发布。JSON 同时列出口诀/对照的开发和正式数量。个人回顾这一行是可选范围，实际仍须有本人再看记录。", "");
  for (const e of matrix.entries) lines.push(`### ${e.title}`, "", e.plan.coverage, "", ...e.plan.excludes.map((s) => "- " + s), "",
    "编排方法：" + e.plan.strategy + (e.mode === "daily" ? `；总预算 ${e.plan.maxItems}，到期回顾最多 ${e.plan.maxReview}` : e.mode === "mnemonic" ? `；每组最多 ${e.plan.maxItems} 条` : ""), "",
    "领域问答：" + e.scopes.map((s) => `${s.title} ${s.questions}`).join("；"), "");
  lines.push("## 主题与入口复用", "", "| 主题 | 目标 | 入口 | 口诀决定 |", "|---|---|---|---|");
  matrix.themes.forEach((g) => lines.push(`| ${g.title} | ${g.questionIds.join("、")} | ${g.entries.join("、")} | ${cell(g.mnemonicReason)} |`));
  lines.push("", "## 逐目标范围与来源", "");
  matrix.targets.forEach((q) => lines.push(`### ${q.id} · ${q.status}`, "", `目标：${q.objective}`, "", `边界：${q.boundary}`, "", `入口：${q.entries.join("、")}`, "", `来源：${q.refs.map((r) => `${r.pointId}/${r.tabId} (${r.sourceUnitIds.join("、")})`).join("；")}`, ""));
  lines.push("## 口诀记法与覆盖范围", "");
  matrix.mnemonics.forEach((m) => { lines.push(`### ${m.id} · ${m.status}`, "", `记法：${m.method}`, "", `覆盖：${m.coverage}`, "", `不覆盖：${m.excludes.join("；")}`, "");
    m.phrases.forEach((p) => lines.push(`- ${p.phrase}：${p.meaning}；目标 ${p.questionIds.join("、")}；来源 ${p.refs.map((r) => `${r.pointId}/${r.tabId}`).join("、")}`)); lines.push(""); });
  lines.push("## 对照覆盖范围", "");
  matrix.comparisons.forEach((c) => lines.push(`- ${c.id}（${c.status}）：${c.coverage} 不覆盖：${c.excludes.join("；")}；目标 ${c.questionIds.join("、")}`));
  lines.push("", "## 精选急救专题", "");
  matrix.examTopics.forEach((topic) => lines.push(`### ${topic.title} · ${topic.status}`, "", `任务：${topic.task}`, "", `纳入理由：${topic.inclusionReasons.join("；")}`, "", `覆盖：${topic.coverage}`, "", `不覆盖：${topic.excludes.join("；")}`, "", `完成边界：${topic.completionScope}`, "", `题目：${topic.questionIds.join("、")}`, ""));
  lines.push("", "## 尚未编排与全库缺口", "", `主题汇总独立提供 ${matrix.browse.points} 小节 / ${matrix.browse.tabs} 页签。`, "", matrix.gaps.note, "",
    `本包未分配入口：问答 ${matrix.unassigned.questions.length}，口诀 ${matrix.unassigned.mnemonics.length}，对照 ${matrix.unassigned.comparisons.length}。新增内容需显式选择入口。`, "",
    `已停用并保留兼容身份：问答 ${matrix.inactive.questions.length}，口诀 ${matrix.inactive.mnemonics.length}。`, "",
    ...matrix.gaps.heldTabs.map((h) => `- ${h.pointId}/${h.tabId}：${h.reason} ${h.requiredCheck}`), "");
  return lines.join("\n");
}
module.exports = { validateEntryPlans, buildEntryMatrix, entryMatrixReport };
