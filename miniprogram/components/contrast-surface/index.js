Component({
  properties: {
    contrastPair: { type: Object, value: null },
    sourceTitle: { type: String, value: "" },
    targetTitle: { type: String, value: "" },
    stage: { type: String, value: "judgment" },
    judgment: { type: String, value: "" },
    retest: { type: String, value: "" },
    evidenceViewed: { type: Object, value: null },
    comparisonPrompt: { type: String, value: "" },
    sourceBlockIds: { type: Array, value: [] },
    sourceRefIds: { type: Array, value: [] },
  },
  methods: {
    handleJudgment(event) { this.triggerEvent("judgment", { result: event.currentTarget.dataset.result }); },
    handleNext() { this.triggerEvent("next"); },
    handleEvidence(event) { this.triggerEvent("evidence", { side: event.currentTarget.dataset.side }); },
    handleRetest(event) { this.triggerEvent("retest", { result: event.currentTarget.dataset.result }); },
  },
});
