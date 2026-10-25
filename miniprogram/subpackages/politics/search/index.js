const knowledgePackage = require("../../../models/politics-p3-v2-preview");

const suggestions = ["中国式现代化", "高质量发展", "马克思主义", "物质意识", "剩余价值"];

function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function getPoint(pointId) {
  return knowledgePackage.points.find((point) => point.id === pointId);
}

function relationCount(point) {
  if (!point.relationItems) {
    return Object.values(point.relations || {}).reduce((total, ids) => total + ids.length, 0);
  }
  return new Set(
    [...point.relationItems, ...(point.reverseRelations || [])]
      .map((item) => `${item.type}|${item.targetId}`),
  ).size;
}

function excerpt(text, keyword) {
  const clean = String(text || "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  const index = normalize(clean).indexOf(keyword);
  if (index < 0) return clean.slice(0, 84);
  const start = Math.max(0, index - 24);
  const end = Math.min(clean.length, index + keyword.length + 54);
  return `${start > 0 ? "…" : ""}${clean.slice(start, end)}${end < clean.length ? "…" : ""}`;
}

function matchMeta(point, keyword) {
  if (normalize(point.title).includes(keyword)) return { label: "标题命中", text: point.title, score: 100 };
  const alias = (point.aliases || []).find((item) => normalize(item).includes(keyword));
  if (alias) return { label: "别名命中", text: alias, score: 80 };
  if (normalize(point.confusion).includes(keyword)) {
    return { label: "辨析命中", text: excerpt(point.confusion, keyword), score: 60 };
  }
  if (normalize(`${point.card.prompt} ${point.card.answer} ${point.card.pitfall}`).includes(keyword)) {
    return { label: "回忆卡命中", text: excerpt(`${point.card.prompt} ${point.card.answer}`, keyword), score: 50 };
  }
  return { label: "正文命中", text: excerpt(point.content, keyword), score: 40 };
}

function searchPoints(value) {
  const keyword = normalize(value);
  if (!keyword) return [];
  const tokens = keyword.split(" ").filter(Boolean);
  return (knowledgePackage.searchIndex || [])
    .filter((item) => tokens.every((token) => item.indexText.includes(token)))
    .map((item) => {
      const point = getPoint(item.id);
      const match = matchMeta(point, keyword);
      return {
        id: point.id,
        title: point.title,
        category: point.category,
        pathLabel: (point.hierarchyTitles || [point.category, point.title]).slice(0, -1).join(" › "),
        summary: point.summary,
        matchLabel: match.label,
        matchText: match.text,
        score: match.score,
        relationCount: relationCount(point),
        mapDepth: point.mapDepth || 0,
        statusLabel: point.publishable ? "已审核" : "待校对",
        publishable: point.publishable,
        riskLabel: point.riskPages?.length ? `风险页 ${point.riskPages.join("、")}` : "",
      };
    })
    .sort((left, right) => right.score - left.score || left.mapDepth - right.mapDepth);
}

Page({
  data: {
    module: knowledgePackage.module,
    keyword: "",
    results: [],
    hasQuery: false,
    inputFocused: true,
    suggestions,
  },

  onLoad(options) {
    wx.setNavigationBarTitle({ title: "政治知识搜索" });
    if (options.q) this.runSearch(decodeURIComponent(options.q));
  },

  runSearch(value) {
    const keyword = String(value || "");
    this.setData({
      keyword,
      results: searchPoints(keyword),
      hasQuery: Boolean(keyword.trim()),
    });
  },

  handleInput(event) {
    this.runSearch(event.detail.value);
  },

  handleSuggestionTap(event) {
    this.runSearch(event.currentTarget.dataset.keyword);
  },

  handleClear() {
    this.setData({ keyword: "", results: [], hasQuery: false, inputFocused: true });
  },

  handleResultTap(event) {
    this.openPoint(event.currentTarget.dataset.pointId, "reading");
  },

  handleResultModeTap(event) {
    const { pointId, mode } = event.currentTarget.dataset;
    this.openPoint(pointId, mode);
  },

  openPoint(pointId, mode) {
    if (!getPoint(pointId)) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=${mode || "reading"}&origin=search`,
    });
  },

  onShareAppMessage() {
    return { title: "政治理论知识搜索" };
  },
});
