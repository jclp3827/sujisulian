const loadBody = () => require("../models/note-common-sense-runtime");
const goldenGuideSample = require("../models/guide-golden-sample");
const { prepareExpansionContent } = require("../services/guide-preview-content");
const { availableContent, answerFeedback, detailUrl, displayOptionOrder } = require("../services/learning-content");
const { createEngine } = require("../services/learning-engine");
const { createGoldenGuideContent, createGuideContent } = require("../services/guide-content");
const { createGuideSession } = require("../services/guide-session");
const { presentGuideCard } = require("../services/guide-presentation");
const { loadPublicGuide, createGuideCardAdapter } = require("../services/cloud-guide-content");
const { createCardBuffer } = require("../../../services/knowledge-platform/card-buffer");
const { loadCommonContent, createCommonCardAdapter } = require("../services/cloud-learning-content");
const { MODE_TITLES } = require("../../../services/common-sense-progress");
const { getConfigSections, QUESTION_COUNT_PRESETS } = require("../../../models/train-config");
const { entryPlan, entryGroups, entryQuestions, entryMnemonics, entryExamTopics } = require("../services/learning-entry");
const publicLearningContent = require("../../../services/public-learning-content");

const RELATION_LABELS = {
  contains: "包含",
  "distinguished-by": "按此判断",
  causes: "导致",
  precedes: "之后",
  "contrasts-with": "对照",
  "applies-when": "适用于",
  "part-of": "属于",
};

const GOLDEN_SAMPLE_ROUTE = "golden-v1";
const EXPANSION_SAMPLE_ROUTE = "expansion-v1";

function sampleStorage(storage, sampleRoute) {
  const sampleKey = (key) => `${key}:${sampleRoute}`;
  return {
    getStorageSync(key) { return storage.getStorageSync(sampleKey(key)); },
    setStorageSync(key, value) { return storage.setStorageSync(sampleKey(key), value); },
  };
}

function projectConceptFrame(content, mnemonic) {
  if (!mnemonic) return null;
  const binding = (content.mnemonicConceptBindings || []).find((item) => item.mnemonicId === mnemonic.id && item.mnemonicRevision === mnemonic.revision);
  const frame = binding && (content.conceptFrames || []).find((item) =>
    item.id === binding.conceptFrameId && item.revision === binding.conceptFrameRevision);
  if (!frame) return null;
  const nodeById = Object.fromEntries(frame.nodes.map((node) => [node.id, node]));
  const sectionDefinitions = [
    { title: "先看判断维度", roles: ["criterion", "condition"] },
    { title: frame.relationType === "composition" ? "包含哪些部分" : "包含与区分", roles: ["category", "component"] },
    { title: frame.relationType === "sequence" ? "先后顺序" : "关系如何展开", roles: ["mechanism", "result", "step"] },
  ];
  const criteria = frame.nodes.filter((node) => ["criterion", "condition"].includes(node.role));
  const categories = frame.nodes.filter((node) => ["category", "component"].includes(node.role));
  const progression = frame.nodes.filter((node) => ["mechanism", "result", "step"].includes(node.role));
  const guides = [
    criteria.length ? { label: "判断维度", connector: "·", items: criteria.map((node) => node.label) } : null,
    categories.length ? { label: frame.relationType === "composition" ? "组成" : "分类", connector: "·", items: categories.map((node) => node.label) } : null,
    progression.length ? { label: frame.relationType === "sequence" ? "顺序" : "因果路径", connector: "→", items: progression.map((node) => node.label) } : null,
  ].filter(Boolean);
  return {
    ...frame,
    pathLabel: frame.parentPath.join(" · "),
    sections: sectionDefinitions.map((section) => ({ ...section,
      nodes: frame.nodes.filter((node) => section.roles.includes(node.role)) })).filter((section) => section.nodes.length)
      .map((section) => ({ ...section, layout: section.nodes.length >= 3 ? "grid" : "row",
        noteText: section.nodes.length >= 3 ? section.nodes.map((node) => node.distinction).filter(Boolean).join("；") : "" })),
    guides,
    relations: frame.edges.map((edge) => ({
      id: `${edge.from}-${edge.type}-${edge.to}`,
      from: nodeById[edge.from] && nodeById[edge.from].label,
      relation: RELATION_LABELS[edge.type] || edge.type,
      to: nodeById[edge.to] && nodeById[edge.to].label,
    })),
  };
}

Page({
  data: { title: "", mode: "daily", scope: "all", variant: "selected", count: 5, readingCount: 5, readingCountOptions: [1, 3, 5], footerHeight: 0, scopes: [],
    development: false, guideMode: false, goldenSample: false, candidatePreview: false, guidePreview: false, guidePreviewLabel: "", guidePreviewSummary: "", guideCard: null, guideGroup: null, guideScopeTitle: "", guideOverviewOpen: false, guideParagraphs: [], guideContextScopeTitle: "", guideProgressMeta: [], questionCount: 0, mnemonicCount: 0, mnemonics: [], groups: [],
    loadState: "loading", active: false, completed: false, reading: false, mnemonic: null, conceptFrame: null, card: null, error: "", notice: "",
    expandedId: "", settingsOpen: false, draft: {}, countOptions: [],
    index: 0, total: 0, progressPercent: 0, unit: "道", phase: "", phaseLabel: "", flowStep: 0, comparison: null, isComparison: false,
    coverageSummary: "", entryDescription: "", entryExcludes: [], reviewNotice: "", examTopics: [], examHeading: "", examCurrentTopics: [], examOverviewOpen: false },
  onLoad(options = {}) {
    this.questionDisposed = false;
    let development = false;
    try { development = wx.getAccountInfoSync().miniProgram.envVersion === "develop"; } catch (_) { /* fail closed */ }
    const legacyMnemonicRoute = options.mode === "mnemonic";
    const requestedMode = legacyMnemonicRoute ? "guide" : options.mode;
    const mode = Object.keys(MODE_TITLES).includes(requestedMode) ? requestedMode : "daily";
    if (mode === "guide") {
      if (development && [GOLDEN_SAMPLE_ROUTE, EXPANSION_SAMPLE_ROUTE].includes(options.sample))
        this.initializeGuide(options, development);
      else this.initializePublicGuide(options, development);
      return;
    }
    this.initializeQuestion(options, development, mode);
  },
  onUnload() {
    this.questionDisposed = true;
    this.questionBootstrapToken = null;
    this.guideDisposed = true;
    this.guideBootstrapToken = null;
    this.guideFetchToken = null;
    this.questionFetchToken = null;
    this.questionBuffer?.close();
    this.guideBuffer?.close();
  },
  async initializeQuestion(options, development, mode) {
    const bootstrapToken = this.questionBootstrapToken = {};
    this.questionLoadOptions = { ...options };
    try {
    this.setData({ mode, title: MODE_TITLES[mode], development, loadState: "loading", settingsOpen: false, notice: "" });
    const content = await loadCommonContent(wx, mode);
    if (this.questionDisposed || this.questionBootstrapToken !== bootstrapToken) return;
    this.questionBuffer?.close();
    this.content = content;
    this.engine = createEngine(this.content, wx);
    const questionAdapter = createCommonCardAdapter(wx, this.content, false);
    const mnemonicAdapter = createCommonCardAdapter(wx, this.content, true);
    this.questionBuffer = createCardBuffer({
      fetch: (ids, context) => (context.mode === "mnemonic-reading" ? mnemonicAdapter : questionAdapter).fetch(ids, context),
      onItems: (items) => items.forEach((item) => {
        if (this.questionBufferReading) this.engine.hydrateMnemonic(item);
        else this.engine.hydrateQuestion(item);
      }),
      onEvict: (ids) => ids.forEach((id) => {
        if (this.content.mnemonics.some((item) => item.id === id)) this.engine.evictMnemonic(id);
        else this.engine.evictQuestion(id);
      }),
      limits: { maxCards: 10, maxBytes: 48 * 1024, ahead: 4, behind: 0, refillAt: 2 },
    });
    const pref = this.engine.preferences(mode);
    const scope = options.scope ? (this.content.scopeOrder.includes(options.scope) ? options.scope : "all") : pref.scope;
    const count = [5, 10, 15].includes(Number(options.count)) ? Number(options.count) : pref.count;
    const variant = options.variant ? (options.variant === "review" ? "review" : "selected") : pref.variant;
    this.setData({ mode, scope, count, variant, title: MODE_TITLES[mode], development,
      countOptions: getConfigSections({}, { questionCountMode: "mini" }).questionCount.options.map((o) => ({ ...o, count: QUESTION_COUNT_PRESETS[o.value] })),
      scopes: [{ id: "all", title: "全部" }, ...this.content.scopes], loadState: "ready", notice: "" });
    wx.setNavigationBarTitle({ title: MODE_TITLES[mode] });
    this.refreshCoverage();
    if (options.groupId && !this.data.groups.some((g) => g.id === options.groupId)) {
      this.setData({ notice: "这个主题已更新或不在当前范围，请重新选择一个主题。" }); return;
    }
    if (options.mnemonicId && !entryMnemonics(this.content, scope).some((m) => m.id === options.mnemonicId)) {
      this.setData({ notice: "这条口诀已更新或不在当前范围，请重新选择。" }); return;
    }
    const explicit = options.scope || options.groupId || options.mnemonicId || options.count || options.variant;
    let sessionKey = "";
    try { sessionKey = decodeURIComponent(options.sessionKey || ""); } catch (_) { /* Fall back to validated route fields. */ }
    const resumed = options.resume === "1" && sessionKey ? this.engine.resume(mode, sessionKey) : !explicit && this.engine.resume(mode);
    if (resumed) this.acceptSession(resumed);
    else if (mode === "mnemonic" && !options.mnemonicId) this.beginReading();
    else this.begin(options.mnemonicId || "", options.groupId || (explicit ? "" : pref.groupId));
    } catch (error) {
      if (this.questionDisposed || this.questionBootstrapToken !== bootstrapToken) return;
      this.setData({ active: false, card: null, loadState: "error", notice: error.message || "题库暂时无法加载，请重试" });
    }
  },
  initializeGuide(options = {}, development = this.data.development) {
    const body = loadBody();
    const legacyMnemonicRoute = options.mode === "mnemonic";
    const sampleRoute = development && [GOLDEN_SAMPLE_ROUTE, EXPANSION_SAMPLE_ROUTE].includes(options.sample) ? options.sample : "";
    const goldenSample = sampleRoute === GOLDEN_SAMPLE_ROUTE;
    const candidatePreview = sampleRoute === EXPANSION_SAMPLE_ROUTE;
    const guidePreview = goldenSample || candidatePreview;
    const expansionGuideSample = !goldenSample && (candidatePreview || publicLearningContent.expandedCommonSenseGuideVisible)
      ? require("../models/guide-expansion-candidate-runtime") : null;
    const previewSample = goldenSample ? goldenGuideSample : candidatePreview ? expansionGuideSample : null;
    const guideTitle = goldenSample ? "知识导读样例" : candidatePreview ? "知识导读测试" : MODE_TITLES.guide;
    const scopes = [{ id: "all", title: "全部" }, ...body.directory.map((p) => ({ id: p.id, title: p.title.replace("常识", "") }))];
    this.guideLoadOptions = { ...options, mode: "guide" };
    this.setData({ mode: "guide", guideMode: true, goldenSample, candidatePreview, guidePreview,
      guidePreviewLabel: goldenSample ? "黄金样例" : candidatePreview ? "扩库候选" : "", guidePreviewSummary: "",
      title: guideTitle, development, scopes, loadState: "loading",
      countOptions: getConfigSections({}, { questionCountMode: "mini" }).questionCount.options.map((o) => ({ ...o, count: QUESTION_COUNT_PRESETS[o.value] })) });
    wx.setNavigationBarTitle({ title: guideTitle });
    try {
      this.guideContent = previewSample
        ? createGoldenGuideContent(body, candidatePreview ? prepareExpansionContent(previewSample) : previewSample)
        : publicLearningContent.expandedCommonSenseGuideVisible
          ? createGoldenGuideContent(body, prepareExpansionContent(expansionGuideSample))
          : createGuideContent(body);
      this.guideEngine = createGuideSession(this.guideContent, guidePreview ? sampleStorage(wx, sampleRoute) : wx);
      const pref = this.guideEngine.preferences();
      const requestedGroupId = legacyMnemonicRoute ? "" : options.groupId;
      const requestedGroup = requestedGroupId && this.guideContent.groupById[requestedGroupId];
      const scope = options.scope ? (body.directory.some((p) => p.id === options.scope) ? options.scope : "all") :
        requestedGroup ? requestedGroup.scope : pref.scope;
      const count = [5, 10, 15].includes(Number(options.count)) ? Number(options.count) : pref.count;
      const previewScopes = guidePreview ? scopes.filter((item) => item.id === "all" || this.guideContent.stats.scopes[item.id] > 0) : scopes;
      const guidePreviewSummary = guidePreview ? `${this.guideContent.stats.cards} 张候选卡 · ${this.guideContent.stats.holds} 项 HOLD · 与正式进度隔离` : "";
      this.setData({ mode: "guide", guideMode: true, goldenSample, candidatePreview, guidePreview,
        guidePreviewLabel: goldenSample ? "黄金样例" : candidatePreview ? "扩库候选" : "", guidePreviewSummary,
        scope, count, title: guideTitle, development,
        countOptions: getConfigSections({}, { questionCountMode: "mini" }).questionCount.options.map((o) => ({ ...o, count: QUESTION_COUNT_PRESETS[o.value] })),
        scopes: previewScopes });
      wx.setNavigationBarTitle({ title: guideTitle });
      const explicit = options.scope || requestedGroupId || options.count;
      let sessionKey = "";
      try { sessionKey = decodeURIComponent(options.sessionKey || ""); } catch (_) { /* Fall back to validated route fields. */ }
      const resumed = !legacyMnemonicRoute && options.resume === "1" && sessionKey ? this.guideEngine.resume(sessionKey) :
        !legacyMnemonicRoute && !explicit ? this.guideEngine.resume() : null;
      if (resumed) this.acceptGuideSession(resumed);
      else this.beginGuide({ scope, count, groupId: requestedGroupId === undefined ? pref.groupId : requestedGroupId });
      return true;
    } catch (_) {
      this.guideContent = null;
      this.guideEngine = null;
      this.guideSession = null;
      this.setData({ active: false, completed: false, settingsOpen: false, guideCard: null, guideGroup: null,
        error: "", loadState: "error", notice: "知识导读暂时无法加载，请重试。" });
      this.measureActions();
      return false;
    }
  },
  async initializePublicGuide(options = {}, development = this.data.development) {
    const bootstrapToken = this.guideBootstrapToken = {};
    this.guideBuffer?.close();
    this.guideLoadOptions = { ...options, mode: "guide" };
    this.setData({ mode: "guide", guideMode: true, goldenSample: false, candidatePreview: false,
      guidePreview: false, title: MODE_TITLES.guide, development, loadState: "loading", settingsOpen: false, notice: "",
      countOptions: getConfigSections({}, { questionCountMode: "mini" }).questionCount.options
        .map((item) => ({ ...item, count: QUESTION_COUNT_PRESETS[item.value] })) });
    wx.setNavigationBarTitle({ title: MODE_TITLES.guide });
    try {
      this.guideContent = await loadPublicGuide(wx);
      if (this.guideDisposed || this.guideBootstrapToken !== bootstrapToken) return;
      this.guidePrefetched = this.guideContent.prefetched;
      delete this.guideContent.prefetched;
      const stubs = Object.fromEntries(this.guideContent.cards.map((card) => [card.id, card]));
      this.guideContent.cardById = { ...stubs };
      this.guideEngine = createGuideSession(this.guideContent, wx);
      const adapter = createGuideCardAdapter(wx, this.guideContent);
      this.guideBuffer = createCardBuffer({
        fetch: (ids, context) => adapter.fetch(ids, context),
        onItems: (items) => items.forEach((item) => { this.guideContent.cardById[item.id] = item; }),
        onEvict: (ids) => ids.forEach((id) => { this.guideContent.cardById[id] = stubs[id]; }),
        limits: { maxCards: 10, maxBytes: 24 * 1024, ahead: 4, behind: 0, refillAt: 2 },
      });
      const scopes = [{ id: "all", title: "全部" }, ...this.guideContent.scopes];
      const pref = this.guideEngine.preferences();
      const requestedGroupId = options.groupId || "";
      const requestedGroup = this.guideContent.groupById[requestedGroupId];
      const scope = options.scope ? (scopes.some((item) => item.id === options.scope) ? options.scope : "all") :
        requestedGroup ? requestedGroup.scope : pref.scope;
      const count = [5, 10, 15].includes(Number(options.count)) ? Number(options.count) : pref.count;
      this.setData({ scope, count, scopes, notice: "" });
      const explicit = options.scope || requestedGroupId || options.count;
      let sessionKey = "";
      try { sessionKey = decodeURIComponent(options.sessionKey || ""); } catch (_) { /* use route fields */ }
      const resumed = options.resume === "1" && sessionKey ? this.guideEngine.resume(sessionKey) :
        !explicit ? this.guideEngine.resume() : null;
      if (resumed) this.acceptGuideSession(resumed);
      else this.beginGuide({ scope, count, groupId: requestedGroupId || pref.groupId });
    } catch (error) {
      if (this.guideDisposed || this.guideBootstrapToken !== bootstrapToken) return;
      this.guideBuffer?.close(); this.guideBuffer = null; this.guidePrefetched = null;
      this.guideContent = null; this.guideEngine = null; this.guideSession = null;
      this.setData({ active: false, completed: false, guideCard: null, guideGroup: null,
        loadState: "error", notice: error.message || "知识导读暂时无法加载，请重试" });
    }
  },
  beginGuide(options = {}, successNotice = "") {
    if (!this.guideEngine) return false;
    try {
      this.acceptGuideSession(this.guideEngine.start(options), successNotice);
      return true;
    } catch (_) {
      this.guideEngine = null;
      this.setData({ active: false, completed: false, guideCard: null, guideGroup: null, error: "",
        loadState: "error", notice: "知识导读暂时无法加载，请重试。" });
      this.measureActions();
      return false;
    }
  },
  acceptGuideSession(result, successNotice = "") {
    this.guideSession = result.session;
    const session = this.guideSession;
    const group = this.guideContent.groupById[session.groupId] || null;
    const scopeTitle = this.data.scopes.find((item) => item.id === session.scope)?.title || "全部";
    this.guideFetchToken = null;
    if (this.guideBuffer) {
      this.guideBufferRound = (this.guideBufferRound || 0) + 1;
      this.guideBuffer.configure({ roundId: `${session.key}:${this.guideBufferRound}`,
        version: this.guideContent.version, mode: "guide", scope: session.scope,
        ids: session.ids, index: session.index });
      const prefetched = (this.guidePrefetched || []).filter((card) => session.ids.includes(card.id) &&
        (!group || card.groupId === group.id) && (session.scope === "all" || card.scope === session.scope));
      this.guidePrefetched = [];
      if (prefetched.length) this.guideBuffer.seed(prefetched);
    }
    this.setData({ loadState: "ready", scope: session.scope, count: session.count, active: !!session.ids.length, settingsOpen: false,
      guideGroup: group, guideScopeTitle: scopeTitle,
      notice: result.invalidated ? "导读内容已更新，旧进度已失效，本次按新内容开始。" : successNotice });
    if (!session.ids.length) this.setData({ notice: "当前范围没有可用的知识导读卡，可调整学习范围或查看全部常识。" });
    this.renderGuideSession();
  },
  renderGuideSession() {
    const session = this.guideSession;
    if (this.guideBuffer) this.guideBuffer.configure({ roundId: `${session.key}:${this.guideBufferRound}`,
      version: this.guideContent.version, mode: "guide", scope: session.scope,
      ids: session.ids, index: session.index });
    const total = session.ids.length;
    const completed = !!total && session.index >= total;
    const guideCard = completed ? null : this.guideContent.cardById[session.ids[session.index]] || null;
    if (guideCard && !guideCard.content && !this.data.guidePreview) {
      const token = this.guideFetchToken = {};
      const id = session.ids[session.index];
      this.setData({ guideCard: null, guideParagraphs: [], loadState: "loading", notice: "" });
      this.guideBuffer.get(id).then(() => {
        if (this.guideFetchToken !== token || this.guideSession !== session || session.ids[session.index] !== id) return;
        this.renderGuideSession();
      }).catch((error) => { if (this.guideFetchToken === token && !this.guideDisposed)
        this.setData({ guideCard: null, loadState: "error", notice: error.message || "知识卡暂时无法加载，请重试" }); });
      return;
    }
    const guideGroup = this.guideContent.groupById[session.groupId] || null;
    const result = this.guideEngine.result(session);
    this.setData({ loadState: "ready", guideCard, guideGroup, guideContextScopeTitle: (this.data.scopes.find((item) => guideGroup && item.id === guideGroup.scope) || {}).title || this.data.guideScopeTitle, guideOverviewOpen: false, guideParagraphs: presentGuideCard(guideCard), reading: false, mnemonic: null, conceptFrame: null, card: null,
      index: Math.min(session.index + 1, total), total, unit: "张", completed,
      progressPercent: total ? Math.round((completed ? total : session.index + 1) * 100 / total) : 0,
      result, guideProgressMeta: [
        { label: "当前卡片", value: Math.min(session.index + 1, total) + " / " + total },
        { label: "已回顾", value: String(result.assessed) },
        { label: "记住了", value: String(result.remembered) },
      ], selfTest: false, flowStep: 0, isComparison: false, error: this.guideEngine.persistenceError() });
    if (guideCard && this.guideBuffer) this.guideBuffer.prefetch().catch(() => {});
    this.measureActions();
  },
  groupsFor(scope, variant = this.data.variant) {
    return entryGroups(this.content, this.data.mode, scope, variant)
      .map((g) => ({ ...g, count: g.questionIds.length, form: g.mnemonicDecision === "not-suitable" ? "辨析题" : "主题问答" }));
  },
  refreshCoverage() {
    const scope = this.data.scope, groups = this.groupsFor(scope);
    const questions = entryQuestions(this.content, this.data.mode, scope, this.data.variant);
    const mnemonics = entryMnemonics(this.content, scope);
    const examTopics = this.data.mode === "exam" && this.data.variant === "selected" ? entryExamTopics(this.content, scope) : [];
    const reviewCount = questions.filter((q) => this.engine.record(q.id) && this.engine.record(q.id).again).length;
    const plan = entryPlan(this.content, this.data.mode);
    const coverageSummary = this.data.mode === "mnemonic" ? mnemonics.length + " 条可用记忆材料，已区分口诀与速记提纲，自测只涉及对应目标。" :
      this.data.mode === "confusion" ? groups.length + " 组完整对照，" + questions.length + " 道初判与复辨题。" :
      this.data.mode === "exam" && this.data.variant === "review" ? questions.length + " 道已开放题中，" + reviewCount + " 道个人待回顾。" :
      this.data.mode === "exam" ? examTopics.length + " 个有限范围急救专题，按设置组成最多 " + this.data.count + " 道。" :
      groups.length + " 个已开放主题，" + questions.length + " 道可用问答。";
    // Keep full learning records in this.content. Page data crosses the JS/view bridge,
    // and the view only needs these small entry summaries.
    const groupSummaries = groups.map(({ id, title, scope, count, form }) => ({ id, title, scope, count, form }));
    this.setData({ questionCount: questions.length, mnemonicCount: mnemonics.length,
      mnemonics: mnemonics.map(({ id, title }) => ({ id, title })), groups: groupSummaries,
      reviewCount, coverageSummary, examTopics, entryDescription: plan && plan.coverage || "本入口尚未编排学习内容。", entryExcludes: plan && plan.excludes || [],
      error: this.engine.persistenceError() });
  },
  acceptSession(result) {
    this.session = result.session;
    this.questionFetchToken = null;
    this.pendingReturnReading = false;
    this.questionBufferRound = (this.questionBufferRound || 0) + 1;
    this.configureQuestionBuffer();
    this.setData({ loadState: "ready", scope: this.session.scope, variant: this.session.variant || "selected", count: this.session.count || 5,
      active: !!this.session.ids.length, settingsOpen: false,
      readingCount: this.session.readingCount || this.engine.preferences("mnemonic").readingCount,
      notice: result.invalidated ? "学习内容已更新，旧组已失效，本次按新内容开始。" : "" });
    this.refreshCoverage();
    if (!this.session.ids.length) this.setData({ notice: this.data.mode === "daily" && this.data.questionCount
      ? "今天暂没有新内容或到期回顾，也可以到一问一答自主练习。"
      : this.data.mode === "exam" && this.data.variant === "review" ? "当前范围没有待回顾内容。"
      : "当前范围没有可组成学习组的内容。可先查看全部常识。" });
    this.renderSession();
  },
  begin(mnemonicId = "", groupId = "", parentKey = "", refresh = false) {
    this.acceptSession(this.engine.start(this.data.mode, this.data.scope, this.data.variant, mnemonicId, groupId, this.data.count, parentKey, refresh));
  },
  beginReading(parentKey = "", refresh = false) {
    this.acceptSession(this.engine.startReading(this.data.scope, parentKey, "", this.data.readingCount, refresh));
  },
  configureQuestionBuffer() {
    if (!this.questionBuffer || !this.session) return;
    const reading = this.session.kind === "reading";
    this.questionBufferReading = reading;
    this.questionBuffer.configure({ roundId: `${this.session.key}:${this.questionBufferRound}`,
      version: this.content.version, mode: reading ? "mnemonic-reading" : this.session.mode,
      scope: this.session.scope, ids: this.session.ids, index: this.session.index });
  },
  renderSession() {
    const s = this.session, reading = s.kind === "reading";
    this.configureQuestionBuffer();
    const phase = s.flow && s.flow.phase || "", isComparison = phase === "compare";
    const currentId = s.ids[s.index];
    if (currentId && !isComparison) {
      const source = reading ? this.content.mnemonics : this.content.questions;
      const current = source.find((item) => item.id === currentId);
      if (current?.stub) {
        const token = this.questionFetchToken = {};
        this.setData({ card: null, mnemonic: null, loadState: "loading" });
        this.questionBuffer.get(currentId).then(() => {
          if (this.questionDisposed || this.questionFetchToken !== token || this.session !== s || s.ids[s.index] !== currentId) return;
          this.renderSession();
        }).catch((error) => { if (!this.questionDisposed && this.questionFetchToken === token && this.session === s)
          this.setData({ card: null, mnemonic: null, loadState: "error", notice: error.message || "内容暂时无法加载，请重试" }); });
        return;
      }
    }
    this.setData({ loadState: "ready" });
    const phaseLabel = { judge: "先判断", compare: "差异对照", recheck: "再辨一次", done: "本组完成" }[phase] || "";
    const q = !reading && !isComparison && this.content.questions.find((q) => q.id === s.ids[s.index]);
    const rawMnemonic = reading ? this.content.mnemonics.find((m) => m.id === s.ids[s.index]) || null : null;
    const reviewAnchors = rawMnemonic && s.reviewMnemonicId === rawMnemonic.id ? s.reviewAnchors || [] : [];
    const mnemonic = rawMnemonic ? { ...rawMnemonic, formLabel: rawMnemonic.formLabel || "口诀", phrases: rawMnemonic.phrases.map((phrase) => {
      const phraseAnchors = reviewAnchors.filter((anchor) => anchor.phraseId === phrase.id);
      return { ...phrase, review: !!phraseAnchors.length,
        reviewLabel: phraseAnchors.some((anchor) => anchor.reviewTarget === "condition") ? "重点回看条件" : "重点回看",
        conditionRefs: (phrase.conditionRefs || []).map((condition) => ({ ...condition,
          review: phraseAnchors.some((anchor) => anchor.reviewAnchorId === condition.id) })) };
    }) } : null;
    const conceptFrame = projectConceptFrame(this.content, rawMnemonic);
    const answer = q && s.answers[q.id];
    const optionOrder = q ? displayOptionOrder(q, s.optionSeed) : [];
    const card = q ? { ...q, displayAnswer: optionOrder.indexOf(q.answer), options: optionOrder.map((sourceIndex, displayIndex) => ({
      index: sourceIndex, displayIndex, text: q.options[sourceIndex], state: answer ? (sourceIndex === q.answer ? "correct" :
        answer.type === "choice" && answer.choice === sourceIndex ? "wrong" : "") : "" })) } : null;
    const specification = q && (q.specification || (this.content.questionSpecifications || []).find((item) => item.questionId === q.id));
    const answerDetails = answerFeedback(q, specification, answer);
    const sessionExamTopics = s.mode === "exam" && s.variant === "selected" ? (this.content.examTopics || [])
      .filter((topic) => (s.topicIds || []).includes(topic.id)) : [];
    const examCurrentTopics = s.mode === "exam" && s.variant === "selected" && q ? sessionExamTopics
      .filter((topic) => (topic.questionIds || []).includes(q.id)) : [];
    const examHeading = s.variant === "review" ? "个人待回顾" :
      examCurrentTopics.length === 1 ? examCurrentTopics[0].title : "精选回看";
    this.setData({ reading, mnemonic, conceptFrame, card, revealed: !!answer, ...answerDetails, phase, phaseLabel, isComparison, examTopics: sessionExamTopics,
      examHeading: s.mode === "exam" ? examHeading : "", examCurrentTopics, examOverviewOpen: false,
      comparison: s.mode === "confusion" ? this.engine.comparison(s) || null : null,
      flowStep: phase === "judge" ? 1 : phase === "compare" ? 2 : phase ? 3 : 0,
      remaining: s.ids.length - s.index,
      expandedId: mnemonic && s.expanded ? mnemonic.id : "", reviewNotice: reviewAnchors.length ? "根据本轮答题，先回看标记的记忆句。" : "",
      index: Math.min(s.index + 1, s.ids.length), total: s.ids.length, unit: reading ? "条" : "道",
      progressPercent: s.ids.length ? Math.round(s.index * 100 / s.ids.length) : 0,
      day: s.day, reason: q ? s.reasons[q.id] : "", completed: !!s.ids.length && s.index >= s.ids.length,
      result: this.engine.result(s), error: this.engine.persistenceError(),
      selfTest: s.mode === "mnemonic" && !reading,
      canStartToday: this.data.mode === "daily" && s.day !== this.engine.today() });
    if (currentId && !isComparison) this.questionBuffer?.prefetch().catch(() => {});
    this.measureActions();
  },
  onReady() { this.measureActions(); },
  onResize() { this.measureActions(); },
  measureActions() {
    if (!wx.createSelectorQuery) return;
    wx.nextTick(() => wx.createSelectorQuery().in(this).select(".learning-actions").boundingClientRect((rect) => {
      if (rect && Math.abs(this.data.footerHeight - rect.height - 20) > 1) this.setData({ footerHeight: Math.ceil(rect.height) + 20 });
    }).exec());
  },
  handleChoice(event) {
    if (!this.session || this.session.kind === "reading" || !this.data.card) return;
    this.engine.answer(this.session, Number(event.currentTarget.dataset.index)); this.renderSession();
  },
  handleReveal() { if (this.session && this.data.card) { this.engine.answer(this.session, null); this.renderSession(); } },
  handleNext(event) {
    if (!this.session || !this.data.card && !this.data.mnemonic && !this.data.isComparison && !this.data.completed) return;
    this.engine.advance(this.session, event.currentTarget.dataset.again === "yes"); this.renderSession();
  },
  handleGuideOverview() {
    if (!this.data.guideMode || !this.data.guideCard || this.data.settingsOpen) return;
    this.setData({ guideOverviewOpen: !this.data.guideOverviewOpen });
  },
  handleGuideAssess(event) {
    if (!this.guideSession || !this.data.guideCard) return;
    const status = event.currentTarget.dataset.result;
    if (!this.guideEngine.assess(this.guideSession, status)) return;
    this.renderGuideSession();
  },
  handleComparisonNext() { this.engine.continueComparison(this.session); this.renderSession(); },
  handleMnemonicTest(event) {
    const id = event.currentTarget.dataset.id || (this.data.mnemonic && this.data.mnemonic.id);
    if (!this.data.reading || !this.data.mnemonic || id !== this.data.mnemonic.id) return;
    this.begin(id, "", this.session.key);
  },
  async handleReturnReading() {
    const session = this.session, mnemonicId = session && session.mnemonicId;
    if (!session || !mnemonicId || this.returnReadingBusy) return;
    const token = this.questionFetchToken = {};
    this.returnReadingBusy = true;
    try {
      if (this.content.mnemonics.find((item) => item.id === mnemonicId)?.stub) {
        this.pendingReturnReading = true;
        this.setData({ loadState: "loading", notice: "" });
        this.questionBufferRound = (this.questionBufferRound || 0) + 1;
        this.questionBufferReading = true;
        this.questionBuffer.configure({ roundId: `${session.key}:review:${this.questionBufferRound}`,
          version: this.content.version, mode: "mnemonic-reading", scope: session.scope,
          ids: [mnemonicId], index: 0 });
        await this.questionBuffer.get(mnemonicId);
      }
      if (this.questionDisposed || this.questionFetchToken !== token || this.session !== session) return;
      const key = session.parentKey;
      const review = this.engine.mnemonicReview(session);
      const result = this.engine.startReading(this.data.scope, key || "", key ? "" : mnemonicId);
      this.engine.applyMnemonicReview(result.session, review);
      this.acceptSession(result);
    } catch (error) {
      if (!this.questionDisposed && this.questionFetchToken === token && this.session === session)
        this.setData({ loadState: "error", notice: error.message || "记忆材料暂时无法加载，请重试" });
    } finally { this.returnReadingBusy = false; }
  },
  handleExpand() {
    if (!this.session || this.session.kind !== "reading") return;
    this.engine.expandReading(this.session, !this.session.expanded); this.renderSession();
  },
  handleMenu() {
    if (!this.data.guideMode && !this.engine) { this.setData({ notice: "题库仍在加载，请稍后重试" }); return; }
    const pref = this.nextPreferences();
    this.setData({ settingsOpen: !this.data.settingsOpen, examOverviewOpen: false, draft: { ...pref, groupId: "" } });
    this.measureActions();
  },
  handleExamOverview() {
    if (this.data.mode !== "exam" || !this.data.active || this.data.completed || this.data.settingsOpen) return;
    this.setData({ examOverviewOpen: !this.data.examOverviewOpen });
  },
  handleScope(event) {
    const scope = event.currentTarget.dataset.id;
    if (!this.data.scopes.some((s) => s.id === scope)) return;
    this.setData({ draft: { ...this.data.draft, scope, groupId: "" } });
  },
  handleCount(event) {
    const count = Number(event.currentTarget.dataset.count);
    if ([5, 10, 15].includes(count)) this.setData({ draft: { ...this.data.draft, count } });
  },
  handleReadingCount(event) {
    const readingCount = Number(event.currentTarget.dataset.count);
    if ([1, 3, 5].includes(readingCount)) this.setData({ draft: { ...this.data.draft, readingCount } });
  },
  handleExamVariant(event) {
    const variant = event.currentTarget.dataset.id;
    if (this.data.mode !== "exam" || !["selected", "review"].includes(variant) || variant === this.data.variant) return;
    const pref = { ...this.nextPreferences(), variant, groupId: "" };
    this.engine.savePreferences("exam", pref);
    this.setData({ scope: pref.scope, count: pref.count, variant });
    this.begin();
  },
  handleSaveSettings() {
    if (this.data.guideMode) {
      if (!this.guideEngine) {
        const options = { ...this.guideLoadOptions, mode: "guide", scope: this.data.draft.scope, count: this.data.draft.count };
        if (this.data.guidePreview) this.initializeGuide(options, this.data.development);
        else this.initializePublicGuide(options, this.data.development);
        return;
      }
      this.guideEngine.savePreferences(this.data.draft);
      const error = this.guideEngine.persistenceError();
      if (error) {
        this.setData({ settingsOpen: true, error, notice: "设置暂未保存，请重试。" });
        this.measureActions(); return;
      }
      const pref = this.guideEngine.preferences();
      this.setData({ scope: pref.scope, count: pref.count, settingsOpen: false, error: "" });
      this.beginGuide({ scope: pref.scope, count: pref.count, groupId: "", refresh: true }, "导读卡已按新设置刷新。");
      return;
    }
    this.engine.savePreferences(this.data.mode, this.data.draft);
    const error = this.engine.persistenceError();
    if (error) {
      this.setData({ settingsOpen: true, error, notice: "设置暂未保存，请重试。" });
      this.measureActions(); return;
    }
    const pref = this.engine.preferences(this.data.mode);
    this.setData({ scope: pref.scope, count: pref.count, readingCount: pref.readingCount, variant: pref.variant,
      settingsOpen: false, error: "", notice: "题库已按新设置刷新。" });
    if (this.data.mode === "mnemonic") this.beginReading("", true);
    else this.begin("", pref.groupId, "", true);
  },
  handleNextGroup() {
    if (this.pendingReturnReading) { this.handleReturnReading(); return; }
    if (this.data.guideMode) {
      if (!this.guideEngine) {
        const options = { ...this.guideLoadOptions, mode: "guide", scope: this.data.scope, count: this.data.count };
        if (this.data.guidePreview) this.initializeGuide(options, this.data.development);
        else this.initializePublicGuide(options, this.data.development);
        return;
      }
      if (this.guideSession && this.guideSession.ids.length && !this.data.completed) {
        if (!this.data.guideCard) this.renderGuideSession();
        return;
      }
      const scope = this.guideSession && this.guideSession.scope || this.data.scope;
      const count = this.guideSession && this.guideSession.count || this.data.count;
      this.setData({ scope, count });
      this.beginGuide({ scope, count, groupId: "", refresh: true });
      return;
    }
    if (!this.engine) {
      this.initializeQuestion(this.questionLoadOptions || { mode: this.data.mode, scope: this.data.scope }, this.data.development, this.data.mode);
      return;
    }
    if (this.session && this.session.ids.length && !this.data.completed) {
      if (!this.data.card && !this.data.mnemonic && !this.data.isComparison) this.renderSession();
      return;
    }
    if (this.data.mode === "daily" && this.data.completed && !this.data.canStartToday) {
      this.setData({ notice: "今天这一组已完成，设置将在之后的新组生效。" }); return;
    }
    const pref = this.nextPreferences();
    this.setData({ scope: pref.scope, count: pref.count, readingCount: pref.readingCount, variant: pref.variant });
    if (this.data.mode === "mnemonic") this.beginReading();
    else this.begin("", pref.groupId);
  },
  handleStart() { this.handleNextGroup(); },
  nextPreferences() {
    if (this.data.guideMode) return { ...(this.guideEngine ? this.guideEngine.preferences() : {}),
      scope: this.data.scope || "all", count: this.data.count || 5, groupId: "" };
    return this.engine.state.preferences[this.data.mode] ? this.engine.preferences(this.data.mode) : {
      scope: this.data.scope, count: this.data.count, readingCount: this.data.readingCount, variant: this.data.variant,
      groupId: this.session && this.session.groupId || "" };
  },
  handleGroup(event) {
    // Compatibility for existing theme deep links; UI changes the next-group draft.
    if (this.session && this.session.ids.length && !this.data.completed) return;
    this.begin("", event.currentTarget.dataset.id);
  },
  handleRetrySave() {
    if (this.data.guideMode && !this.guideEngine) {
      const options = { ...this.guideLoadOptions, mode: "guide", scope: this.data.scope, count: this.data.count };
      if (this.data.guidePreview) this.initializeGuide(options, this.data.development);
      else this.initializePublicGuide(options, this.data.development);
      return;
    }
    const engine = this.data.guideMode ? this.guideEngine : this.engine;
    if (!engine) { this.handleNextGroup(); return; }
    engine.retrySave(); this.setData({ error: engine.persistenceError() });
  },
  handleSource(event) {
    const { point, tab } = event.currentTarget.dataset;
    wx.navigateTo({ url: detailUrl({ pointId: point, tabId: tab }) });
  },
  handleTopics() {
    wx.navigateTo({ url: "/subpackages/common-sense/topics/index?partId=" + encodeURIComponent(this.data.scope) });
  },
});
