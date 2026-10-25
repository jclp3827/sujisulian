const { normalizeKnowledgeContext, availableActivities } = require("./context");
const { getRolloutStage } = require("./rollout");

function projectFoundationViewModel(knowledgePackage, rawContext) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const unit = context.focus
    ? knowledgePackage.knowledgeUnits.find((item) => item.id === context.focus.pointId)
    : null;
  const navigationById = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const sourceById = new Map(knowledgePackage.sourceReferences.map((item) => [item.id, item]));

  return {
    module: {
      id: knowledgePackage.moduleProfile.id,
      title: knowledgePackage.moduleProfile.title,
      rolloutStage: getRolloutStage(knowledgePackage.moduleProfile.id),
      buildTarget: knowledgePackage.buildTarget,
      packageVersion: knowledgePackage.packageVersion,
    },
    counts: {
      navigationNodes: knowledgePackage.navigationNodes.length,
      knowledgeUnits: knowledgePackage.knowledgeUnits.length,
      relations: knowledgePackage.relations.length,
      recallItems: knowledgePackage.recallItems.length,
    },
    context: {
      hasFocus: Boolean(unit),
      activity: context.activity,
      relationMode: context.relationMode,
      availableActivities: availableActivities(knowledgePackage, unit?.id || null),
      origin: context.origin,
      trailLength: context.explorationTrail.length,
    },
    focus: unit ? {
      pointId: unit.id,
      title: unit.title,
      navigationNodeId: unit.navigationNodeId,
      path: unit.navigationPathIds.map((id) => {
        const node = navigationById.get(id);
        return { id, title: node?.title || "" };
      }),
      contentVersion: unit.contentVersion,
      summary: unit.summary,
      status: unit.status,
      reviewState: unit.reviewState,
      riskFlags: [...unit.riskFlags],
      relationCount: unit.relationIds.length,
      recallItemCount: unit.recallItemIds.length,
      sources: unit.sourceRefIds.map((id) => sourceById.get(id)).filter(Boolean).map((source) => ({
        id: source.id,
        sourceType: source.sourceType,
        locator: source.locator,
        reviewerState: source.reviewerState,
      })),
    } : null,
  };
}

module.exports = {
  projectFoundationViewModel,
};
