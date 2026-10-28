// Remove the known source hold before building either preview or public guide cards.
const SOURCE_HOLDS = [{
  id: "football-kickoff-choice",
  pointId: "sports",
  title: "足球开球与进攻方向",
  reason: "旧文遗漏掷币获胜队可以选择开球的权利，待按IFAB第8条修正正文与内容源。",
  requiredEvidence: "同步修正正文和候选源、重建生成包并核验版本后，再单独解除预览HOLD。",
  sourceUnitIds: ["cs-10-15-p25-football-list"],
}];

const UNAVAILABLE = new Set(['HOLD', 'hold', 'blocked', 'withdrawn', 'retired']);
function prepareExpansionContent(sample, { requireKnownSourceHold = true } = {}) {
  const applicableSourceHolds = SOURCE_HOLDS.filter(hold => sample.groups.some(group => group.pointId === hold.pointId && group.cards.some(card => card.id === hold.id)));
  const declared = [...(sample.holds || []), ...applicableSourceHolds];
  const holds = [...new Map(declared.map(item => [JSON.stringify([item.pointId, item.id || item.cardId || '', item.sourceUnitIds || []]), item])).values()];
  const seenKnown = new Set();
  const matches = (hold, group, card) => {
    const full = `${group.pointId}::${card.id}`, target = hold.cardId || hold.id;
    if (hold.pointId && hold.pointId !== group.pointId) return false;
    return target ? target === full || target === card.id :
      (Array.isArray(hold.sourceUnitIds) && hold.sourceUnitIds.some(id => (card.sourceUnitIds || []).includes(id)));
  };
  const forbidden = value => value && (UNAVAILABLE.has(value.status) || value.localHold ||
    UNAVAILABLE.has(value.review?.status) || UNAVAILABLE.has(value.review?.admission));
  const groups = sample.groups.map(group => ({ ...group, cards: group.cards.filter(card => {
    for (const known of SOURCE_HOLDS) if (known.pointId === group.pointId && known.id === card.id) seenKnown.add(`${group.pointId}::${card.id}`);
    if (forbidden(group) || forbidden(card)) return false;
    return !holds.some(hold => matches(hold, group, card));
  }) })).filter(group => group.cards.length);
  if (requireKnownSourceHold && seenKnown.size !== SOURCE_HOLDS.length)
    throw new Error('知识导读HOLD与候选内容不对应，请先核对来源修正状态。');
  return { ...sample, groups, holds };
}
module.exports = { prepareExpansionContent, prepareExpansionPreview: prepareExpansionContent };
