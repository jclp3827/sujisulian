const {prepareExpansionContent}=require('./guide-preview-content');
const {guideIdentity}=require('./learning-identity');
const { fingerprint } = require("./learning-content");

class GuideContentError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "GuideContentError";
    this.code = "GUIDE_CONTENT_INVALID";
    this.details = details;
  }
}

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value, label, details) {
  if (typeof value !== "string" || !value.trim()) throw new GuideContentError(`${label}不能为空`, details);
  return value.trim();
}

function uniqueSourceUnitIds(value, details) {
  if (!Array.isArray(value) || !value.length) throw new GuideContentError("知识卡缺少来源单元", details);
  const ids = value.map((id) => nonEmptyString(id, "来源单元", details));
  if (new Set(ids).size !== ids.length) throw new GuideContentError("知识卡来源单元重复", { ...details, sourceUnitIds: ids });
  return ids;
}

function collectSourceUnitIds(value, found = []) {
  if (!value || typeof value !== "object") return found;
  if (Array.isArray(value.sourceUnitIds)) found.push(...value.sourceUnitIds);
  Object.keys(value).forEach((key) => {
    if (key !== "sourceUnitIds" && value[key] && typeof value[key] === "object") {
      collectSourceUnitIds(value[key], found);
    }
  });
  return found;
}

function collectDirectoryPointIds(node, categories, found = new Set()) {
  if (!node || typeof node !== "object") return found;
  if (typeof node.pointId === "string" && node.pointId) found.add(node.pointId);
  if (typeof node.categoryId === "string" && node.categoryId) {
    const category = categories[node.categoryId];
    if (!category) throw new GuideContentError("目录引用了不存在的分类", { categoryId: node.categoryId });
    if (!Array.isArray(category.pointIds)) throw new GuideContentError("分类缺少知识组列表", { categoryId: node.categoryId });
    category.pointIds.forEach((pointId) => found.add(pointId));
  }
  Object.keys(node).forEach((key) => {
    const value = node[key];
    if (Array.isArray(value)) value.forEach((item) => collectDirectoryPointIds(item, categories, found));
    else if (isObject(value)) collectDirectoryPointIds(value, categories, found);
  });
  return found;
}

function buildPointScopeIndex(body) {
  if (!Array.isArray(body.directory) || !body.directory.length) throw new GuideContentError("常识目录为空");
  const categories = Object.fromEntries((body.categories || []).map((category) => [category.id, category]));
  const memberships = {};
  const scopeOrder = [];
  body.directory.forEach((entry) => {
    const scope = nonEmptyString(entry.id, "领域标识", {});
    if (scopeOrder.includes(scope)) throw new GuideContentError("领域标识重复", { scope });
    scopeOrder.push(scope);
    collectDirectoryPointIds(entry, categories).forEach((pointId) => {
      if (!memberships[pointId]) memberships[pointId] = [];
      if (!memberships[pointId].includes(scope)) memberships[pointId].push(scope);
    });
  });
  const pointScope = {};
  (body.points || []).forEach((point) => {
    const scopes = memberships[point.id] || [];
    if (scopes.length !== 1) throw new GuideContentError("知识组必须且只能属于一个领域", { pointId: point.id, scopes });
    pointScope[point.id] = scopes[0];
  });
  return { pointScope, scopeOrder };
}

function cardIdFor(pointId, sourceUnitIds) {
  const normalizedPointId = nonEmptyString(pointId, "知识组标识", {});
  const normalizedSourceIds = uniqueSourceUnitIds(sourceUnitIds, { pointId: normalizedPointId });
  return `${normalizedPointId}::${normalizedSourceIds.join("+")}`;
}

function explicitCardIdFor(pointId, cardId) {
  const normalizedPointId = nonEmptyString(pointId, "知识组标识", {});
  const normalizedCardId = nonEmptyString(cardId, "知识卡标识", { pointId: normalizedPointId });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedCardId)) {
    throw new GuideContentError("知识卡标识必须是稳定的小写英文短横线标识", { pointId: normalizedPointId, cardId: normalizedCardId });
  }
  return `${normalizedPointId}::${normalizedCardId}`;
}

function sourceDetailUrl(pointId, tabId) {
  return `/subpackages/common-sense/detail/index?moduleId=common-sense&pointId=${encodeURIComponent(pointId)}&tabId=${encodeURIComponent(tabId)}`;
}

function resolveFocusTab(point, focus, focusIndex) {
  const details = { pointId: point.id, focusIndex, focusLabel: focus && focus.label };
  const sourceUnitIds = uniqueSourceUnitIds(focus && focus.sourceUnitIds, details);
  if (!Array.isArray(point.tabs) || !point.tabs.length) throw new GuideContentError("知识组没有可定位的正文页签", details);
  const wanted = new Set(sourceUnitIds);
  const matches = point.tabs.filter((tab) => collectSourceUnitIds(tab).some((id) => wanted.has(id)));
  if (matches.length === 1) return { tab: matches[0], sourceUnitIds, mapping: "source-overlap" };
  if (!matches.length && point.tabs.length === 1) {
    return { tab: point.tabs[0], sourceUnitIds, mapping: "single-tab-fallback" };
  }
  throw new GuideContentError(matches.length ? "知识卡来源同时命中多个正文页签" : "知识卡来源无法唯一定位正文页签", {
    ...details,
    sourceUnitIds,
    matchedTabIds: matches.map((tab) => tab.id),
    availableTabIds: point.tabs.map((tab) => tab.id),
  });
}

function createGuideContent(body) {
  if (!isObject(body) || !Array.isArray(body.points)) throw new GuideContentError("常识正文结构无效");
  const { pointScope, scopeOrder } = buildPointScopeIndex(body);
  const groups = [];
  const cards = [];
  const cardIds = new Set();
  const groupIds = new Set();
  const mapping = { sourceOverlap: 0, singleTabFallback: 0 };

  body.points.forEach((point) => {
    const pointId = nonEmptyString(point.id, "知识组标识", {});
    if (groupIds.has(pointId)) throw new GuideContentError("知识组标识重复", { pointId });
    groupIds.add(pointId);
    const readingMeta = point.readingMeta;
    if (!isObject(readingMeta) || !Array.isArray(readingMeta.focus) || !readingMeta.focus.length) {
      throw new GuideContentError("知识组缺少学习导读卡片", { pointId });
    }
    const scope = pointScope[pointId];
    const groupTitle = nonEmptyString(point.title, "知识组标题", { pointId });
    const groupTakeaway = nonEmptyString(readingMeta.takeaway, "学习导读", { pointId });
    const groupCards = readingMeta.focus.map((focus, focusIndex) => {
      const resolved = resolveFocusTab(point, focus, focusIndex);
      const id = cardIdFor(pointId, resolved.sourceUnitIds);
      if (cardIds.has(id)) throw new GuideContentError("知识卡稳定标识重复", { pointId, focusIndex, cardId: id });
      cardIds.add(id);
      const title = nonEmptyString(focus.label, "知识卡标题", { pointId, focusIndex });
      const content = nonEmptyString(focus.note, "知识卡内容", { pointId, focusIndex });
      const tabId = nonEmptyString(resolved.tab.id, "正文页签标识", { pointId, focusIndex });
      const core = {
        id,
        scope,
        groupId: pointId,
        groupTitle,
        groupTakeaway,
        title,
        content,
        label: title,
        note: content,
        pointId,
        tabId,
        sourceUnitIds: resolved.sourceUnitIds,
        sourceUrl: sourceDetailUrl(pointId, tabId),
        mapping: resolved.mapping,
      };
      const card = { ...core, signature: fingerprint(core), learningSignature: guideIdentity(core) };
      if (resolved.mapping === "source-overlap") mapping.sourceOverlap += 1;
      else mapping.singleTabFallback += 1;
      cards.push(card);
      return card;
    });
    const groupCore = {
      id: pointId,
      scope,
      title: groupTitle,
      takeaway: groupTakeaway,
      cardIds: groupCards.map((card) => card.id),
      cardSignatures: groupCards.map((card) => card.signature),
    };
    groups.push({ ...groupCore, signature: fingerprint(groupCore) });
  });

  const groupById = Object.fromEntries(groups.map((group) => [group.id, group]));
  const cardById = Object.fromEntries(cards.map((card) => [card.id, card]));
  const scopeCounts = Object.fromEntries(scopeOrder.map((scope) => [scope, cards.filter((card) => card.scope === scope).length]));
  const version = fingerprint({
    schema: 1,
    scopeOrder,
    groups: groups.map((group) => ({ id: group.id, signature: group.signature })),
  });
  return {
    schema: 1,
    version,
    scopeOrder,
    groups,
    cards,
    groupById,
    cardById,
    stats: {
      groups: groups.length,
      cards: cards.length,
      scopes: scopeCounts,
      mapping,
    },
  };
}

function createGoldenGuideContent(body, sample) {
  if (!isObject(body) || !Array.isArray(body.points)) throw new GuideContentError("常识正文结构无效");
  if (!isObject(sample) || sample.schemaVersion !== 1 || !Array.isArray(sample.groups) || !sample.groups.length) {
    throw new GuideContentError("黄金样例结构无效");
  }
  sample=prepareExpansionContent(sample,{requireKnownSourceHold:false});
  const { pointScope, scopeOrder } = buildPointScopeIndex(body);
  const pointById = Object.fromEntries(body.points.map((point) => [point.id, point]));
  const groups = [];
  const cards = [];
  const groupIds = new Set();
  const cardIds = new Set();
  const productionModes = { reuse: 0, "light-edit": 0, synthesized: 0 };

  sample.groups.forEach((candidate, groupIndex) => {
    const pointId = nonEmptyString(candidate.pointId, "知识组标识", { groupIndex });
    const point = pointById[pointId];
    if (!point) throw new GuideContentError("黄金样例引用了不存在的知识组", { pointId, groupIndex });
    if (groupIds.has(pointId)) throw new GuideContentError("黄金样例知识组重复", { pointId, groupIndex });
    groupIds.add(pointId);
    if (!Array.isArray(candidate.cards) || !candidate.cards.length) {
      throw new GuideContentError("黄金样例知识组没有可预览卡片", { pointId, groupIndex });
    }
    const scope = pointScope[pointId];
    const groupTitle = nonEmptyString(point.title, "知识组标题", { pointId });
    const overview = nonEmptyString(candidate.overview, "知识组导读", { pointId });
    const groupCards = candidate.cards.map((candidateCard, cardIndex) => {
      const details = { pointId, cardIndex, cardId: candidateCard && candidateCard.id };
      const id = explicitCardIdFor(pointId, candidateCard && candidateCard.id);
      if (cardIds.has(id)) throw new GuideContentError("黄金样例知识卡标识重复", { ...details, id });
      cardIds.add(id);
      const productionMode = nonEmptyString(candidateCard.productionMode, "知识卡生产方式", details);
      if (!Object.prototype.hasOwnProperty.call(productionModes, productionMode)) {
        throw new GuideContentError("黄金样例知识卡生产方式无效", { ...details, productionMode });
      }
      const resolved = resolveFocusTab(point, {
        label: candidateCard.title,
        sourceUnitIds: candidateCard.sourceUnitIds,
      }, cardIndex);
      const title = nonEmptyString(candidateCard.title, "知识卡标题", details);
      const content = nonEmptyString(candidateCard.explanation, "知识卡内容", details);
      const learningGoal = nonEmptyString(candidateCard.learningGoal, "知识卡学习目标", details);
      const semanticRevision = Number(candidateCard.semanticRevision);
      if (!Number.isInteger(semanticRevision) || semanticRevision < 1) {
        throw new GuideContentError("知识卡语义版本无效", { ...details, semanticRevision });
      }
      const tabId = nonEmptyString(resolved.tab.id, "正文页签标识", details);
      const core = {
        id,
        scope,
        groupId: pointId,
        groupTitle,
        groupTakeaway: overview,
        title,
        content,
        label: title,
        note: content,
        learningGoal,
        productionMode,
        productionLabel: { reuse: "直接复用", "light-edit": "轻度整理", synthesized: "综合总结" }[productionMode],
        semanticRevision,
        pointId,
        tabId,
        sourceUnitIds: resolved.sourceUnitIds,
        sourceUrl: sourceDetailUrl(pointId, tabId),
        mapping: resolved.mapping,
        review: candidateCard.review || null,
      };
      const card = { ...core, signature: fingerprint(core), learningSignature: guideIdentity(core) };
      productionModes[productionMode] += 1;
      cards.push(card);
      return card;
    });
    const groupCore = {
      id: pointId,
      scope,
      title: groupTitle,
      takeaway: overview,
      relation: nonEmptyString(candidate.relation, "知识组关系", { pointId }),
      cardIds: groupCards.map((card) => card.id),
      cardSignatures: groupCards.map((card) => card.signature),
    };
    groups.push({ ...groupCore, signature: fingerprint(groupCore) });
  });

  const groupById = Object.fromEntries(groups.map((group) => [group.id, group]));
  const cardById = Object.fromEntries(cards.map((card) => [card.id, card]));
  const scopeCounts = Object.fromEntries(scopeOrder.map((scope) => [scope, cards.filter((card) => card.scope === scope).length]));
  const version = fingerprint({
    schema: 2,
    sampleId: sample.id,
    scopeOrder,
    groups: groups.map((group) => ({ id: group.id, signature: group.signature })),
  });
  return {
    schema: 2,
    profile: "golden-sample",
    sampleId: sample.id,
    version,
    scopeOrder,
    groups,
    cards,
    groupById,
    cardById,
    holds: Array.isArray(sample.holds) ? sample.holds.slice() : [],
    stats: {
      groups: groups.length,
      cards: cards.length,
      holds: Array.isArray(sample.holds) ? sample.holds.length : 0,
      scopes: scopeCounts,
      productionModes,
    },
  };
}

module.exports = {
  GuideContentError,
  cardIdFor,
  collectSourceUnitIds,
  createGuideContent,
  createGoldenGuideContent,
  explicitCardIdFor,
  sourceDetailUrl,
};
