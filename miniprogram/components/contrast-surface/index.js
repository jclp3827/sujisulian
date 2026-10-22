Component({
  properties: {
    contrastPair: { type: Object, value: null },
    evidenceSides: { type: Array, value: [] },
    sourceTitle: { type: String, value: "" },
    targetTitle: { type: String, value: "" },
    stage: { type: String, value: "judgment" },
    // Structured judgments and legacy self-reports both remain valid inputs.
    judgment: { type: null, value: null },
    retest: { type: null, value: null },
    evidenceViewed: { type: Object, value: null },
    comparisonPrompt: { type: String, value: "" },
    sourceBlockIds: { type: Array, value: [] },
    sourceRefIds: { type: Array, value: [] },
  },
  methods: {
    handleChange() { this.triggerEvent("change"); },
    handleJudgment(event) {
      const answerUnitId = event.currentTarget.dataset.unitId;
      this.triggerEvent("judgment", answerUnitId ? { answerUnitId } : { result: event.currentTarget.dataset.result });
    },
    handleNext() { this.triggerEvent("next"); },
    handleEvidence(event) { this.triggerEvent("evidence", { side: event.currentTarget.dataset.side }); },
    handleRetest(event) {
      const answerUnitId = event.currentTarget.dataset.unitId;
      this.triggerEvent("retest", answerUnitId ? { answerUnitId } : { result: event.currentTarget.dataset.result });
    },
  },
});
