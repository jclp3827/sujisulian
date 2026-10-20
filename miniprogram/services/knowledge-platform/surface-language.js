const platformSurfaceCopy = Object.freeze({
  actions: Object.freeze({
    view: "查看",
    expand: "展开",
    collapse: "收起",
    start: "开始",
    continue: "继续",
    return: "返回",
    contrast: "对照",
    recall: "回忆",
    reveal: "揭晓",
    review: "回看",
    adjust: "调整",
    submit: "提交",
  }),
  trust: Object.freeze({
    entry: "来源与反馈",
    reviewing: "内容校订中",
    reviewed: "已核对",
  }),
  atomRoles: Object.freeze({
    definition: "定义",
    conclusion: "结论",
    reason: "原因",
    hierarchy: "层次",
    sequence: "顺序",
    condition: "条件",
    exception: "边界与例外",
    contrast: "对照",
    evidence: "依据",
  }),
});

const recoveryCopy = Object.freeze({
  "relations-missing": { message: "这条知识暂无需要展开的相关知识", action: { id: "continue-reading", label: "继续查看完整内容" } },
  "recall-missing": { message: "这条知识暂未提供回忆卡", action: { id: "return-reading", label: "回看完整内容" } },
  "anchor-missing": { message: "当前没有可直接到达的原文位置", action: { id: "open-full", label: "查看这条知识的完整内容" } },
  "route-expired": { message: "学习内容已更新，请重新开始。", action: { id: "rebuild-route", label: "重新开始" } },
  "focus-invalid": { message: "上次查看的内容已调整", action: { id: "return-overview", label: "返回知识全景" } },
  "data-unavailable": { message: "这部分内容暂时无法打开", action: { id: "return-previous", label: "返回上一位置" } },
  "content-unavailable": { message: "快速导读暂时无法打开，请重试。", action: { id: "rebuild-route", label: "重新打开导读" } },
});

function projectSurfaceRecovery(reason) {
  return recoveryCopy[reason] || recoveryCopy["data-unavailable"];
}

function projectContextTools(knowledgePackage, options = {}) {
  const { surfaceState, card, recallResponse } = options;
  if (surfaceState === "recall") {
    return card?.recall && ["fuzzy", "missed"].includes(recallResponse)
      ? [{ id: "recall-source", label: "回看原文", role: "primary", mutatesKnowledgeState: true }]
      : [];
  }
  if (surfaceState !== "full" || !card) return [];
  const tools = [
    { id: "display", label: "显示", role: "secondary", mutatesKnowledgeState: false },
    { id: "source-feedback", label: platformSurfaceCopy.trust.entry, role: "trust", mutatesKnowledgeState: false },
  ];
  const recallAvailable = card.recall && knowledgePackage.moduleProfile.capabilities.activities.some((item) => item.id === "recall" && item.dataStatus === "available");
  const relationsAvailable = card.relationContext?.length && knowledgePackage.moduleProfile.capabilities.activities.some((item) => item.id === "relations" && item.dataStatus === "available");
  if (recallAvailable) tools.push({ id: "recall", label: "回忆一下", role: "primary", mutatesKnowledgeState: true });
  if (relationsAvailable) tools.push({ id: "relations", label: "查看相关知识", role: recallAvailable ? "secondary" : "primary", mutatesKnowledgeState: true });
  return tools;
}

function projectSurfaceLanguage(knowledgePackage, options = {}) {
  const card = options.card || null;
  const surfaceState = options.surfaceState || "overview";
  const primaryByState = {
    overview: { id: "open-branch", label: "展开这个区域" },
    branch: { id: "open-full", label: "查看完整内容" },
    full: card?.recall ? { id: "start-recall", label: "回忆一下" } : { id: "return-space", label: "返回知识空间" },
    recall: { id: "reveal", label: "揭晓答案" },
  };
  return {
    canonical: card ? {
      title: card.identity.title,
      summary: card.identity.summary,
      content: card.content,
    } : null,
    guide: {
      location: card?.identity.pathText || knowledgePackage.moduleProfile.title,
      primaryAction: primaryByState[surfaceState] || null,
    },
    trust: card ? {
      statusLabel: card.identity.statusLabel,
      notice: card.identity.statusLabel === platformSurfaceCopy.trust.reviewed
        ? platformSurfaceCopy.trust.reviewed
        : knowledgePackage.moduleProfile.surfaceCopy.contentNotice,
      entryLabel: platformSurfaceCopy.trust.entry,
      sources: card.sources,
    } : null,
    diagnostic: null,
    contextTools: projectContextTools(knowledgePackage, { surfaceState, card }),
  };
}

module.exports = {
  platformSurfaceCopy,
  projectContextTools,
  projectSurfaceLanguage,
  projectSurfaceRecovery,
};
