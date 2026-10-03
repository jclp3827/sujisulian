Component({
  data: { expandedRelationAnchor: null },
  properties: {
    card: { type: Object, value: null },
    recallView: { type: Object, value: null },
    displayPreferences: { type: Object, value: {} },
    compact: { type: Boolean, value: false },
    allowSkip: { type: Boolean, value: false },
    showReadingReturn: { type: Boolean, value: true }
  },
  methods: {
    handleBlockTap(event) {
      this.triggerEvent("blocktap", { blockId: event.currentTarget.dataset.blockId });
    },
    handleRelationTap(event) {
      this.triggerEvent("relationtap", { relationId: event.currentTarget.dataset.relationId });
    },
    handleInlineRelationsToggle(event) {
      const blockId = event.currentTarget.dataset.blockId;
      this.setData({ expandedRelationAnchor: this.data.expandedRelationAnchor === blockId ? null : blockId });
    },
    handleStartRecall() { this.triggerEvent("startrecall"); },
    handleReveal() { this.triggerEvent("reveal"); },
    handleRecallResult(event) {
      this.triggerEvent("recallresult", { result: event.currentTarget.dataset.result });
    },
    handleBackToReading() { this.triggerEvent("backtoreading"); },
    handleDisplay() { this.triggerEvent("display"); },
    handleSourceFeedback() { this.triggerEvent("sourcefeedback"); }
  }
});
