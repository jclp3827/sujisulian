const commonSense = require("../models/note-common-sense");

function entryStatus(entry) {
  return entry.status === "pending" ? "pending" : "ready";
}

function uniquePointIds(ids) {
  return [...new Set((ids || []).filter(Boolean))];
}

function getCategory(categoryId) {
  return (commonSense.categories || []).find((item) => item.id === categoryId);
}

function getPoint(pointId) {
  return (commonSense.points || []).find((item) => item.id === pointId);
}

function getCategoryPointIds(categoryId) {
  if (!categoryId) return [];
  const category = getCategory(categoryId);
  if (category?.pointIds?.length) return category.pointIds;
  return (commonSense.points || []).filter((point) => point.categoryId === categoryId).map((point) => point.id);
}

function sentence(text, lead = "本节涵盖") {
  const content = String(text || "")
    .trim()
    .replace(/[。；;]+$/, "")
    .replace("：", "的");
  return content ? `${lead}${content}。` : "本节内容正在整理。";
}

function getSectionSubtitle(section) {
  if (section.subtitle) return sentence(section.subtitle);
  const category = getCategory(section.categoryId);
  if (category?.subtitle) return sentence(category.subtitle);
  const point = getPoint(section.pointId);
  if (point?.summary) {
    const summary = point.summary.replace(/^源文节下无独立小节标题，沿用节名建立单一小节；/, "");
    return sentence(summary, "");
  }
  if (point?.preview) return sentence(point.preview, "本节梳理");
  return "本节内容正在整理。";
}

function getEntryPointIds(entry) {
  if (!entry) return [];
  return uniquePointIds([entry.pointId, ...getCategoryPointIds(entry.categoryId)]);
}

function getChapterPointIds(chapter) {
  return uniquePointIds([
    ...getEntryPointIds(chapter),
    ...(chapter?.sections || []).flatMap(getEntryPointIds),
  ]);
}

function getPartPointIds(part) {
  return uniquePointIds((part?.chapters || []).flatMap(getChapterPointIds));
}

Page({
  data: {
    module: commonSense.module,
    level: "chapters",
    eyebrow: "常识目录",
    title: "常识判断",
    description: "",
    items: [],
    showSearch: false,
    titlePointCount: 0,
    currentPartId: "",
  },

  onLoad(options) {
    if (!options.partId) {
      wx.showToast({ title: "篇目不存在", icon: "none" });
      return;
    }
    if (options.chapterIndex !== undefined) {
      this.showSections(options.partId, Number(options.chapterIndex));
      return;
    }
    this.showChapters(options.partId);
  },

  handleSearchTap() {
    if (!this.data.currentPartId) return;
    wx.navigateTo({
      url: `/subpackages/common-sense/search/index?moduleId=common-sense&partId=${encodeURIComponent(this.data.currentPartId)}`,
    });
  },

  showChapters(partId) {
    const part = (commonSense.directory || []).find((item) => item.id === partId);
    if (!part) {
      wx.showToast({ title: "篇目不存在", icon: "none" });
      return;
    }
    const items = (part.chapters || []).map((chapter, index) => {
      const sectionCount = (chapter.sections || []).length;
      const readySectionCount = (chapter.sections || []).filter((section) => section.status !== "pending").length;
      return {
        id: `${part.id}-${index}`,
        order: chapter.order || `${index + 1}`,
        title: chapter.title,
        subtitle: chapter.subtitle || (sectionCount ? `包含 ${sectionCount} 个小节` : "进入本章知识卡"),
        metaText: sectionCount ? `${sectionCount} 节` : "知识卡",
        pointCount: getChapterPointIds(chapter).length,
        hasChildren: sectionCount > 0 || (!chapter.pointId && Boolean(chapter.categoryId)),
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
      items,
      showSearch: true,
      titlePointCount: getPartPointIds(part).length,
      currentPartId: part.id,
    });
    wx.setNavigationBarTitle({ title: part.title });
  },

  showSections(partId, chapterIndex) {
    const part = (commonSense.directory || []).find((item) => item.id === partId);
    const chapter = part?.chapters?.[chapterIndex];
    if (!part || !chapter) {
      wx.showToast({ title: "章节不存在", icon: "none" });
      return;
    }
    const items = (chapter.sections || []).map((section, index) => ({
      id: `${part.id}-${chapterIndex}-${index}`,
      order: section.order || `${index + 1}`,
      title: section.title,
      subtitle: section.status === "pending" ? "该小节内容尚未处理" : getSectionSubtitle(section),
      metaText: section.status === "pending" ? "待整理" : "知识卡",
      pointCount: getEntryPointIds(section).length,
      hasChildren: !section.pointId && Boolean(section.categoryId),
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
      items,
      showSearch: false,
      titlePointCount: getChapterPointIds(chapter).length,
      currentPartId: part.id,
    });
    wx.setNavigationBarTitle({ title: chapter.title });
  },

  handleItemTap(event) {
    const { targetType, partId, chapterIndex, pointId, categoryId, tabId, status } = event.currentTarget.dataset;
    if (status === "pending" || targetType === "pending") {
      wx.showToast({ title: "该章节待补全", icon: "none" });
      return;
    }
    if (targetType === "chapter") {
      wx.navigateTo({
        url: `/subpackages/common-sense/level/index?partId=${encodeURIComponent(partId)}&chapterIndex=${chapterIndex}`,
      });
      return;
    }
    if (targetType === "point" && pointId) {
      const tabQuery = tabId ? `&tabId=${encodeURIComponent(tabId)}` : "";
      wx.navigateTo({ url: `/subpackages/common-sense/detail/index?moduleId=common-sense&pointId=${pointId}${tabQuery}` });
      return;
    }
    if (targetType === "category" && categoryId) {
      wx.navigateTo({ url: `/subpackages/common-sense/category/index?moduleId=common-sense&categoryId=${categoryId}` });
    }
  },
});
