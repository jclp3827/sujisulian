const noteModules = [
  {
    id: "data-analysis",
    title: "资料分析",
    keywords: "增长、比重、分数、速算",
    description: "围绕资料分析常见公式、比较方法和速算技巧整理。",
    status: "ready",
    statusText: "可学习",
  },
  {
    id: "quantity",
    title: "数量关系",
    keywords: "数论、方程、工程、行程、排列组合",
    description: "围绕数量关系常考模型、公式和快速判断方法整理。",
    status: "ready",
    statusText: "可学习",
  },
  {
    id: "logic",
    title: "判断推理",
    keywords: "逻辑论证、定义判断、类比推理、图形推理",
    description: "围绕判断推理常见题型、识别信号和选项判断方法整理。",
    status: "ready",
    statusText: "可学习",
  },
  {
    id: "verbal",
    title: "言语理解",
    keywords: "片段阅读、逻辑填空、语句排序",
    description: "围绕言语理解常见题型、文段结构、选项陷阱和词语辨析整理。",
    status: "ready",
    statusText: "可学习",
  },
  {
    id: "graphic",
    title: "图形推理",
    keywords: "图推、定性分析、定量分析、位置分析、立体图形",
    description: "围绕图形推理常考规律、题型、快速判断方法整理。",
    status: "ready",
    statusText: "可学习",
  },
];

function getNoteStats(modules) {
  const readyCount = modules.filter((item) => item.status === "ready").length;
  return {
    readyCount,
    totalCount: modules.length,
  };
}

Page({
  data: {
    modules: noteModules,
    stats: getNoteStats(noteModules),
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: "花生笔记",
    });
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) {
      tabBar.setData({ selected: 1 });
    }
  },

  handleSearchTap() {
    wx.navigateTo({
      url: "/subpackages/note/search/index",
    });
  },

  handleModuleTap(event) {
    const { moduleId } = event.currentTarget.dataset;
    const module = this.data.modules.find((item) => item.id === moduleId);
    if (!module) return;

    if (module.status !== "ready") {
      wx.showToast({
        title: "该科目笔记整理中",
        icon: "none",
      });
      return;
    }

    wx.navigateTo({
      url: `/subpackages/note/module/index?moduleId=${moduleId}`,
    });
  },

  onShareAppMessage() {
    return { title: '花生笔记 - 行测知识点速查' };
  },
  onShareTimeline() {
    return { title: '花生笔记 - 行测知识点速查' };
  },
});
