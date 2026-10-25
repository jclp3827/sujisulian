// Development preview enrollment only; canonical content and formal admission stay unchanged.
const SOURCE_HOLDS = [{
  id: "football-kickoff-choice",
  pointId: "sports",
  title: "足球开球与进攻方向",
  reason: "旧文遗漏掷币获胜队可以选择开球的权利，待按IFAB第8条修正正文与内容源。",
  requiredEvidence: "同步修正正文和候选源、重建生成包并核验版本后，再单独解除预览HOLD。",
  sourceUnitIds: ["cs-10-15-p25-football-list"],
}];

function prepareExpansionPreview(sample) {
  const held = new Set(SOURCE_HOLDS.map(item => `${item.pointId}::${item.id}`));
  let removed = 0;
  const groups = sample.groups.map(group => ({
    ...group,
    cards: group.cards.filter(card => {
      if (!held.has(`${group.pointId}::${card.id}`)) return true;
      removed++;
      return false;
    }),
  }));
  if (removed !== held.size) throw new Error("知识导读预览HOLD与候选内容不对应，请先核对来源修正状态。");
  return { ...sample, groups, holds: [...(sample.holds || []), ...SOURCE_HOLDS] };
}

module.exports = { prepareExpansionPreview };
