const body = require("../models/note-common-sense");
const { buildDirectory } = require("../services/topic-directory");
const { detailUrl } = require("../services/learning-content");
const TOPIC_KEY = "common-sense-topic-position-v1";
Page({
  data: { parts: [], partId: "", chapterId: "", chapters: [], sections: [], count: 0 },
  onLoad(options = {}) {
    this.directory = buildDirectory(body);
    let saved = {};
    try { saved = wx.getStorageSync(TOPIC_KEY) || {}; } catch (_) { /* Navigation works without storage. */ }
    const part = this.directory.find((p) => p.id === options.partId) ||
      this.directory.find((p) => p.id === saved.partId) || this.directory[0];
    this.setData({ parts: this.directory.map((p) => ({ id: p.id, title: p.title })), count: body.points.length });
    this.select(part.id, saved.chapterId);
  },
  select(partId, chapterId) {
    const part = this.directory.find((p) => p.id === partId);
    const chapter = part.chapters.find((c) => c.id === chapterId) || part.chapters[0];
    this.setData({ partId, chapterId: chapter.id, chapters: part.chapters.map((c) => ({ id: c.id, title: c.title })),
      sections: chapter.sections });
    try { wx.setStorageSync(TOPIC_KEY, { partId, chapterId: chapter.id }); } catch (_) { /* No claimed saved state. */ }
  },
  handlePart(event) { this.select(event.currentTarget.dataset.id); },
  handleChapter(event) { this.select(this.data.partId, event.currentTarget.dataset.id); },
  handleToggle(event) {
    const id = event.currentTarget.dataset.id;
    this.setData({ sections: this.data.sections.map((s) => s.id === id ? { ...s, expanded: !s.expanded } : s) });
  },
  handlePoint(event) {
    const point = body.points.find((p) => p.id === event.currentTarget.dataset.id);
    wx.navigateTo({ url: detailUrl({ pointId: point.id, tabId: point.tabs[0].id }) });
  },
  handleTab(event) {
    const point = body.points.find((p) => p.id === event.currentTarget.dataset.id);
    const tab = point.tabs[Number(event.detail.value)];
    if (tab) wx.navigateTo({ url: detailUrl({ pointId: point.id, tabId: tab.id }) });
  },
  handleSearch() {
    wx.navigateTo({ url: `/subpackages/common-sense/search/index?moduleId=common-sense&partId=${encodeURIComponent(this.data.partId)}` });
  },
});
