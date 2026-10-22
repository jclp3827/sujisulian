const body = require("../models/note-common-sense");
const pack = require("../models/learning-pack");
const { availableContent, answerFeedback, detailUrl, displayOptionOrder } = require("../services/learning-content");
const { createEngine } = require("../services/learning-engine");
const { MODE_TITLES } = require("../../../services/common-sense-progress");
const { getConfigSections, QUESTION_COUNT_PRESETS } = require("../../../models/train-config");
const { entryPlan, entryGroups, entryQuestions, entryMnemonics, entryExamTopics } = require("../services/learning-entry");

Page({
  data: { title: "", mode: "daily", scope: "all", variant: "selected", count: 5, readingCount: 5, readingCountOptions: [1, 3, 5], footerHeight: 0, scopes: [],
    development: false, questionCount: 0, mnemonicCount: 0, mnemonics: [], groups: [],
    active: false, completed: false, reading: false, mnemonic: null, card: null, error: "", notice: "",
    expandedId: "", settingsOpen: false, draft: {}, countOptions: [],
    index: 0, total: 0, progressPercent: 0, unit: "道", phase: "", phaseLabel: "", flowStep: 0, comparison: null, isComparison: false,
    coverageSummary: "", entryDescription: "", entryExcludes: [], reviewNotice: "", examTopics: [] },
  onLoad(options = {}) {
    let development = false;
    try { development = wx.getAccountInfoSync().miniProgram.envVersion === "develop"; } catch (_) { /* fail closed */ }
    const mode = Object.keys(MODE_TITLES).includes(options.mode) ? options.mode : "daily";
    this.content = availableContent(body, pack, development);
    this.engine = createEngine(this.content, wx);
    const pref = this.engine.preferences(mode);
    const scope = options.scope ? (body.directory.some((p) => p.id === options.scope) ? options.scope : "all") : pref.scope;
    const count = [5, 10, 15].includes(Number(options.count)) ? Number(options.count) : pref.count;
    const variant = options.variant ? (options.variant === "review" ? "review" : "selected") : pref.variant;
    this.setData({ mode, scope, count, variant, title: MODE_TITLES[mode], development,
      countOptions: getConfigSections({}, { questionCountMode: "mini" }).questionCount.options.map((o) => ({ ...o, count: QUESTION_COUNT_PRESETS[o.value] })),
      scopes: [{ id: "all", title: "全部" }, ...body.directory.map((p) => ({ id: p.id, title: p.title.replace("常识", "") }))] });
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
    this.setData({ questionCount: questions.length, mnemonicCount: mnemonics.length, mnemonics, groups,
      reviewCount, coverageSummary, examTopics, entryDescription: plan && plan.coverage || "本入口尚未编排学习内容。", entryExcludes: plan && plan.excludes || [],
      error: this.engine.persistenceError() });
  },
  acceptSession(result) {
    this.session = result.session;
    this.setData({ scope: this.session.scope, variant: this.session.variant || "selected", count: this.session.count || 5,
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
  renderSession() {
    const s = this.session, reading = s.kind === "reading";
    const phase = s.flow && s.flow.phase || "", isComparison = phase === "compare";
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
    const answer = q && s.answers[q.id];
    const optionOrder = q ? displayOptionOrder(q, s.optionSeed) : [];
    const card = q ? { ...q, displayAnswer: optionOrder.indexOf(q.answer), options: optionOrder.map((sourceIndex, displayIndex) => ({
      index: sourceIndex, displayIndex, text: q.options[sourceIndex], state: answer ? (sourceIndex === q.answer ? "correct" :
        answer.type === "choice" && answer.choice === sourceIndex ? "wrong" : "") : "" })) } : null;
    const specification = q && (this.content.questionSpecifications || []).find((item) => item.questionId === q.id);
    const answerDetails = answerFeedback(q, specification, answer);
    const sessionExamTopics = s.mode === "exam" && s.variant === "selected" ? (this.content.examTopics || [])
      .filter((topic) => (s.topicIds || []).includes(topic.id)) : [];
    this.setData({ reading, mnemonic, card, revealed: !!answer, ...answerDetails, phase, phaseLabel, isComparison, examTopics: sessionExamTopics,
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
    if (!this.session || this.session.kind === "reading") return;
    this.engine.answer(this.session, Number(event.currentTarget.dataset.index)); this.renderSession();
  },
  handleReveal() { if (this.session) { this.engine.answer(this.session, null); this.renderSession(); } },
  handleNext(event) {
    if (!this.session) return;
    this.engine.advance(this.session, event.currentTarget.dataset.again === "yes"); this.renderSession();
  },
  handleComparisonNext() { this.engine.continueComparison(this.session); this.renderSession(); },
  handleMnemonicTest(event) {
    const id = event.currentTarget.dataset.id || (this.data.mnemonic && this.data.mnemonic.id);
    if (!this.data.reading || !this.data.mnemonic || id !== this.data.mnemonic.id) return;
    this.begin(id, "", this.session.key);
  },
  handleReturnReading() {
    const key = this.session && this.session.parentKey;
    const review = this.engine.mnemonicReview(this.session);
    const result = this.engine.startReading(this.data.scope, key || "", key ? "" : this.session.mnemonicId);
    this.engine.applyMnemonicReview(result.session, review);
    this.acceptSession(result);
  },
  handleExpand() {
    if (!this.session || this.session.kind !== "reading") return;
    this.engine.expandReading(this.session, !this.session.expanded); this.renderSession();
  },
  handleMenu() {
    const pref = this.nextPreferences();
    this.setData({ settingsOpen: !this.data.settingsOpen, draft: { ...pref, groupId: "" } });
    this.measureActions();
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
    if (this.session && this.session.ids.length && !this.data.completed) return;
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
    return this.engine.state.preferences[this.data.mode] ? this.engine.preferences(this.data.mode) : {
      scope: this.data.scope, count: this.data.count, readingCount: this.data.readingCount, variant: this.data.variant,
      groupId: this.session && this.session.groupId || "" };
  },
  handleGroup(event) {
    // Compatibility for existing theme deep links; UI changes the next-group draft.
    if (this.session && this.session.ids.length && !this.data.completed) return;
    this.begin("", event.currentTarget.dataset.id);
  },
  handleRetrySave() { this.engine.retrySave(); this.setData({ error: this.engine.persistenceError() }); },
  handleSource(event) {
    const { point, tab } = event.currentTarget.dataset;
    wx.navigateTo({ url: detailUrl({ pointId: point, tabId: tab }) });
  },
  handleTopics() {
    wx.navigateTo({ url: "/subpackages/common-sense/topics/index?partId=" + encodeURIComponent(this.data.scope) });
  },
});
