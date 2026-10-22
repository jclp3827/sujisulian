const assert = require("assert");
const pack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c0 = require("../docs/knowledge-platform/content/common-sense-content-c0");
const coverage = require("../docs/knowledge-platform/implementations/common-sense-learning-v1-coverage.json");

let checks = 0;
const check = (condition, message) => { assert(condition, message); checks += 1; };
const unique = (items) => new Set(items).size === items.length;

check(c0.decisions.questions.length === c0.baseline.questions, "C0 question baseline changed");
check(pack.mnemonics.length === c0.baseline.mnemonics, "C0 mnemonic baseline changed");
check(pack.comparisons.length === c0.baseline.comparisons, "C0 comparison baseline changed");
check(pack.groups.length === c0.baseline.groups, "C0 group baseline changed");
check(coverage.totals.detailUnits === c0.baseline.detailUnits, "detail-unit baseline changed");
check(coverage.totals.tabs === c0.baseline.tabs, "tab baseline changed");
check(coverage.entries.length === c0.baseline.detailUnits, "full directory was not retained");

for (const [kind, current] of [["questions", pack.questions], ["mnemonics", pack.mnemonics], ["comparisons", pack.comparisons]]) {
  const rows = c0.decisions[kind];
  check(rows.length === c0.baseline[kind], `${kind}: inventory is incomplete`);
  check(unique(rows.map((row) => row.id)), `${kind}: duplicate inventory id`);
  check(rows.every((row) => current.some((item) => row.id === item.id)), `${kind}: baseline item was removed`);
  check(rows.every((row) => ["retain-candidate", "revise-before-formal", "retire"].includes(row.recommendation) && row.reason && row.formalReady === false), `${kind}: invalid decision`);
}

check(c0.pilotGroupIds.length === 2 && c0.pilotGroupIds.every((id) => pack.groups.some((g) => g.id === id)), "pilot groups invalid");
check(c0.pilotTargets.length === 9 && unique(c0.pilotTargets.map((target) => target.id)), "pilot targets invalid");
for (const target of c0.pilotTargets) {
  check(target.statement && target.conclusion && target.conditions.length && target.excludes.length && target.refs.length, `${target.id}: incomplete target`);
  check(target.legacyQuestionIds.every((id) => pack.questions.some((q) => q.id === id)), `${target.id}: missing legacy question`);
  check(target.mnemonicPhraseIndexes.every(({ mnemonicId, phraseIndex }) => {
    const m = pack.mnemonics.find((item) => item.id === mnemonicId);
    return m && m.phrases[phraseIndex];
  }), `${target.id}: invalid mnemonic phrase link`);
  check(target.comparisonIds.every((id) => pack.comparisons.some((c) => c.id === id)), `${target.id}: invalid comparison link`);
}

const requiredTemplates = ["target", "question", "mnemonic", "mnemonicPhrase", "comparison", "emergencyTopic"];
check(requiredTemplates.every((name) => c0.templates[name]?.length), "authoring templates incomplete");
check(c0.blockedTabs.length === 3 && c0.blockedTabs.every((tab) => pack.authoringConstraints.some((item) => item.pointId === tab.pointId && item.tabId === tab.tabId)), "blocked tabs drifted");
check(c0.runtimeContentChanged === false, "C0 must not change runtime content");

console.log(`常识内容 C0 检查通过：${checks} 项；基线 ${c0.baseline.questions} 题 / ${c0.baseline.mnemonics} 口诀 / ${c0.baseline.comparisons} 对照已盘点，${c0.pilotTargets.length} 个试点目标。`);
