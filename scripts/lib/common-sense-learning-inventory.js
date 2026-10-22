const { sourceIds, itemRefs } = require("../../miniprogram/subpackages/common-sense/services/learning-content");
const { buildDirectory } = require("../../miniprogram/subpackages/common-sense/services/topic-directory");

function buildInventory(pack, body) {
  const byId = Object.fromEntries(body.points.map((p) => [p.id, p]));
  const entries = [];
  for (const part of buildDirectory(body)) for (const chapter of part.chapters) for (const section of chapter.sections) for (const row of section.points) {
    const point = byId[row.id];
    const qs = pack.questions.filter((q) => q.refs.some((r) => r.pointId === point.id));
    const ms = pack.mnemonics.filter((m) => itemRefs(m).some((r) => r.pointId === point.id));
    const tabs = point.tabs.map((tab) => {
      const questions = qs.filter((q) => q.refs.some((r) => r.pointId === point.id && r.tabId === tab.id));
      const mnemonics = ms.filter((m) => itemRefs(m).some((r) => r.pointId === point.id && r.tabId === tab.id));
      const hold = (pack.authoringConstraints || []).find((h) => h.pointId === point.id && h.tabId === tab.id);
      const mapped = new Set(questions.flatMap((q) => q.refs.filter((r) => r.pointId === point.id && r.tabId === tab.id).flatMap((r) => r.sourceUnitIds)));
      return { tabId: tab.id, title: tab.title, sourceUnitIds: [...new Set(sourceIds(tab))],
        questionIds: questions.map((q) => q.id), mnemonicIds: mnemonics.map((m) => m.id),
        mappedSourceUnitIds: [...mapped], targetInventoryComplete: false,
        status: hold ? "blocked-source-review" : questions.length ? "candidate-partial" : "needs-target-triage",
        ...(hold ? { issue: hold.reason, requiredCheck: hold.requiredCheck } : {}) };
    });
    const groupIds = new Set(qs.map((q) => q.group));
    entries.push({ pointId: point.id, title: point.title, partId: part.id, part: part.title,
      chapter: chapter.title, section: section.title, sourceAuditStatus: point.sourceAuditStatus,
      tabCount: tabs.length, questionCount: qs.length, mnemonicCount: ms.length,
      targetInventoryComplete: false, tabs,
      mnemonicDecisions: pack.groups.filter((g) => groupIds.has(g.id)).map((g) => ({ groupId: g.id,
        decision: g.mnemonicDecision || "authored", reason: g.mnemonicReason || "仅覆盖已声明目标。" })) });
  }
  return { schemaVersion: 1, contentVersion: pack.version, definitions: {
    candidatePartial: "只表示至少有一个派生目标，不能推定该小节或源单元全部覆盖。",
    targetInventoryComplete: "本轮尚未逐句穷举所有原子目标，所有小节均保持 false。",
    mnemonicNotSuitable: "仅对指定主题组的本批目标作决定，不代表整章不适合口诀。",
  }, totals: { detailUnits: entries.length, tabs: entries.reduce((n, e) => n + e.tabCount, 0),
    mappedDetailUnits: entries.filter((e) => e.questionCount).length,
    mappedTabs: entries.flatMap((e) => e.tabs).filter((t) => t.questionIds.length).length,
    blockedTabs: entries.flatMap((e) => e.tabs).filter((t) => t.status === "blocked-source-review").length,
    questionTargets: pack.questions.length, mnemonics: pack.mnemonics.length,
    approvedMnemonics: pack.mnemonics.filter((m) => m.status === "approved").length,
    noMnemonicGroups: pack.groups.filter((g) => g.mnemonicDecision === "not-suitable").length,
  }, entries };
}

function inventoryReport(inventory) {
  const t = inventory.totals;
  const lines = ["# 常识派生内容覆盖与缺口清单", "",
    `正文 ${t.detailUnits} 个小节、${t.tabs} 个页签；${t.mappedDetailUnits} 个小节的部分目标已编排，涉及 ${t.mappedTabs} 个页签。`, "",
    `候选问答 ${t.questionTargets} 道，口诀 ${t.mnemonics} 条，已批准口诀 ${t.approvedMnemonics} 条。另有 ${t.noMnemonicGroups} 个主题组明确采用辨析题。`, "",
    "分母是正文小节和页签，尚无全库原子考点总量；不输出‘考点已覆盖百分比’。每个小节都还需逐目标盘点，候选数量不等于已批准数量。", "",
    "## 编排前需核对的来源项", ""];
  for (const e of inventory.entries) for (const tab of e.tabs.filter((t) => t.issue)) lines.push(
    `- ${e.title} / ${tab.title}：${tab.issue} ${tab.requiredCheck}（${e.pointId}/${tab.tabId}）`);
  lines.push("", "## 全部小节", "", "| 领域 / 章 | 小节 | 页签 | 问答 | 口诀 | 下一步 |", "|---|---|---:|---:|---:|---|");
  inventory.entries.forEach((e) => lines.push(`| ${e.part} / ${e.chapter} | ${e.title} | ${e.tabCount} | ${e.questionCount} | ${e.mnemonicCount} | ${e.tabs.some((t) => t.issue) ? "含待核来源；其余逐目标盘点" : e.questionCount ? "已编部分候选，继续盘点" : "提取目标并判断适合的学习形式"} |`));
  lines.push("", "## 采用辨析题的主题", "");
  const seen = new Set();
  inventory.entries.forEach((e) => e.mnemonicDecisions.filter((d) => d.decision === "not-suitable").forEach((d) => {
    if (!seen.has(d.groupId)) { seen.add(d.groupId); lines.push(`- ${d.groupId}：${d.reason}`); }
  }));
  lines.push("", "## 扩充顺序", "", "1. 先处理已确认来源中的有限主题，每组 3–5 个明确目标。", "2. 每题同时核对解释、干扰项和边界；每条口诀核对所有分句与目标。", "3. 待核来源先解决问题并修订正文，再解除派生限制；不通过移除限制或修改状态强行放行。", "4. 各批审核与版本分别记录；医学、急救、安全及变化较快的法律/科技材料，先补相应权威核验资料。", "");
  return lines.join("\n");
}
module.exports = { buildInventory, inventoryReport };
