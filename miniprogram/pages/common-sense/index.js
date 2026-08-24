const commonSense = require("../../models/note-common-sense");

function entryStatus(entry) {
  return entry.status === "pending" ? "pending" : "ready";
}

function getReadingPrototypeItems() {
  return (commonSense.points || [])
    .filter((point) => point.readingMeta?.isPrototype)
    .map((point, index) => ({
      id: `reading-prototype-${point.id}`,
      order: `原型 ${index + 1}`,
      title: point.title,
      subtitle: point.readingMeta.takeaway,
      metaText: "阅读样稿",
      status: "ready",
      statusText: "查看样稿",
      targetType: "point",
      pointId: point.id,
      tabId: point.readingMeta.reviewTab || "",
    }));
}

Page({
  data: {
    module: null,
    level: "parts",
    eyebrow: "常识目录",
    title: "常识判断",
    description: "先选择篇目，再按章、节逐级进入知识卡。",
    breadcrumb: "常识目录",
    items: [],
    canGoBack: false,
    currentPartId: "",
    currentChapterIndex: -1,
  },

  onLoad() {
    this.showParts();
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 2 });
  },

  showParts() {
    const partItems = (commonSense.directory || []).map((part, index) => ({
      id: part.id,
      order: part.order || `${index + 1}`,
      title: part.title,
      subtitle: part.subtitle,
      metaText: `${(part.chapters || []).length} 章`,
      status: "ready",
      statusText: "进入篇目",
      targetType: "part",
      partId: part.id,
    }));
    const prototypeCount = getReadingPrototypeItems().length;
    const items = prototypeCount ? partItems.concat({
      id: "reading-prototypes",
      order: "体验",
      title: "阅读优化样例",
      subtitle: "六张代表详情页保留为特殊阅读样例，可集中查看。",
      metaText: `${prototypeCount} 张`,
      status: "ready",
      statusText: "进入样稿",
      targetType: "prototype-index",
      partId: "",
    }) : partItems;
    this.setData({
      module: commonSense.module,
      level: "parts",
      eyebrow: "知识地图",
      title: "常识判断",
      description: "按教材目录分为文史、科技、经济、法律四篇。",
      breadcrumb: "常识目录",
      items,
      canGoBack: false,
      currentPartId: "",
      currentChapterIndex: -1,
    });
    wx.setNavigationBarTitle({ title: "常识目录" });
  },

  showReadingPrototypes() {
    const items = getReadingPrototypeItems();
    this.setData({
      level: "prototypes",
      eyebrow: "阅读优化",
      title: "六张优化样例",
      description: "这里集中展示时间线、记忆卡等特殊呈现方式；正式教材目录保持原有篇—章—节结构。",
      breadcrumb: "常识目录 / 阅读优化样例",
      items,
      canGoBack: true,
      currentPartId: "",
      currentChapterIndex: -1,
    });
    wx.setNavigationBarTitle({ title: "阅读优化样例" });
  },

  showChapters(partId) {
    const part = (commonSense.directory || []).find((item) => item.id === partId);
    if (!part) return;
    const items = (part.chapters || []).map((chapter, index) => {
      const sectionCount = (chapter.sections || []).length;
      const readySectionCount = (chapter.sections || []).filter((section) => section.status !== "pending").length;
      return {
        id: `${part.id}-${index}`,
        order: chapter.order || `${index + 1}`,
        title: chapter.title,
        subtitle: chapter.subtitle || (sectionCount ? `包含 ${sectionCount} 个小节` : "进入本章知识卡"),
        metaText: sectionCount ? `${sectionCount} 节` : "知识卡",
        status: sectionCount ? "ready" : entryStatus(chapter),
        statusText: sectionCount && !readySectionCount ? "目录已建立" : (chapter.status === "pending" ? "待补全" : "可学习"),
        targetType: sectionCount ? "chapter" : (chapter.pointId ? "point" : "category"),
        partId: part.id,
        chapterIndex: index,
      pointId: chapter.pointId || "",
      categoryId: chapter.categoryId || "",
      tabId: chapter.tabId || "",
      };
    });
    this.setData({
      level: "chapters",
      eyebrow: part.order,
      title: part.title,
      description: part.subtitle,
      breadcrumb: `常识目录 / ${part.title}`,
      items,
      canGoBack: true,
      currentPartId: part.id,
      currentChapterIndex: -1,
    });
    wx.setNavigationBarTitle({ title: part.title });
  },

  showSections(partId, chapterIndex) {
    const part = (commonSense.directory || []).find((item) => item.id === partId);
    const chapter = part && part.chapters && part.chapters[chapterIndex];
    if (!chapter) return;
    const items = (chapter.sections || []).map((section, index) => ({
      id: `${part.id}-${chapterIndex}-${index}`,
      order: section.order || `${index + 1}`,
      title: section.title,
      subtitle: section.status === "pending" ? "该小节内容尚未处理" : "进入本节知识卡",
      metaText: section.status === "pending" ? "待整理" : "知识卡",
      status: entryStatus(section),
      statusText: section.status === "pending" ? "待补全" : "可学习",
      targetType: section.pointId ? "point" : (section.categoryId ? "category" : "pending"),
      pointId: section.pointId || "",
      categoryId: section.categoryId || "",
      tabId: section.tabId || "",
    }));
    this.setData({
      level: "sections",
      eyebrow: `${part.order} · ${chapter.order}`,
      title: chapter.title,
      description: chapter.subtitle || `按小节学习${chapter.title}`,
      breadcrumb: `常识目录 / ${part.title} / ${chapter.title}`,
      items,
      canGoBack: true,
      currentPartId: part.id,
      currentChapterIndex: chapterIndex,
    });
    wx.setNavigationBarTitle({ title: chapter.title });
  },

  handleItemTap(event) {
    const { targetType, partId, chapterIndex, pointId, categoryId, tabId, status } = event.currentTarget.dataset;
    if (status === "pending" || targetType === "pending") {
      wx.showToast({ title: "该章节待补全", icon: "none" });
      return;
    }
    if (targetType === "part") {
      this.showChapters(partId);
      return;
    }
    if (targetType === "prototype-index") {
      this.showReadingPrototypes();
      return;
    }
    if (targetType === "chapter") {
      this.showSections(partId, Number(chapterIndex));
      return;
    }
    if (targetType === "point" && pointId) {
      const tabQuery = tabId ? `&tabId=${encodeURIComponent(tabId)}` : "";
      wx.navigateTo({ url: `/subpackages/note/detail/index?moduleId=common-sense&pointId=${pointId}${tabQuery}` });
      return;
    }
    if (targetType === "category" && categoryId) {
      wx.navigateTo({ url: `/subpackages/note/category/index?moduleId=common-sense&categoryId=${categoryId}` });
    }
  },

  handleBackLevel() {
    if (this.data.level === "prototypes") {
      this.showParts();
      return;
    }
    if (this.data.level === "sections") {
      this.showChapters(this.data.currentPartId);
      return;
    }
    if (this.data.level === "chapters") this.showParts();
  },
});
