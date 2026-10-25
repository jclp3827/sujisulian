Component({
  data: { expandedRelationAnchor: null, expandedFooterRelationId: null, expandedContrastRelationId: null, outlineExpanded: false, expandedRecallSources: false },
  properties: {
    card: { type: Object, value: null },
    recallView: { type: Object, value: null },
    displayPreferences: { type: Object, value: {} },
    activeBlockId: { type: String, value: "" },
    compact: { type: Boolean, value: false },
    readingUi: { type: Boolean, value: false },
    examMode: { type: Boolean, value: false },
    revealManaged: { type: Boolean, value: false },
    toolbarManaged: { type: Boolean, value: false },
    allowSkip: { type: Boolean, value: false },
    recallSourcesEnabled: { type: Boolean, value: false },
    showReadingReturn: { type: Boolean, value: true },
    taskReturnLabel: { type: String, value: "" },
    skin: { type: String, value: "" }
  },
  observers: { 'recallView.id': function() { this.setData({expandedRecallSources:false}); } },
  methods: {
    showReadingOutline() { this.setData({outlineExpanded:true},()=>this.triggerEvent("outlineshown")); },
    handleRecallSourcesToggle() { this.setData({expandedRecallSources:!this.data.expandedRecallSources}); },
    handleRecallSource(event) { this.triggerEvent('recallsource',{pointId:event.currentTarget.dataset.pointId,blockId:event.currentTarget.dataset.blockId}); },
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
    handleContrastToggle(event) {
      const relationId = event.currentTarget.dataset.relationId;
      this.setData({ expandedContrastRelationId: this.data.expandedContrastRelationId === relationId ? null : relationId });
    },
    handleFooterRelationToggle(event) {
      const relationId = event.currentTarget.dataset.relationId;
      this.setData({ expandedFooterRelationId: this.data.expandedFooterRelationId === relationId ? null : relationId });
    },
    handleOutlineToggle() { this.setData({ outlineExpanded: !this.data.outlineExpanded }); },
    handleOutlineTap(event) {
      this.setData({ outlineExpanded: false });
      this.triggerEvent("blockjump", { blockId: event.currentTarget.dataset.blockId });
    },
    handleStartRecall() { this.triggerEvent("startrecall"); },
    handleReveal() { this.triggerEvent("reveal"); },
    handleRecallResult(event) {
      this.triggerEvent("recallresult", { result: event.currentTarget.dataset.result });
    },
    handleBackToReading() { this.triggerEvent("backtoreading"); },
    handleDisplay() { this.triggerEvent("display"); },
    handleTaskReturn() { this.triggerEvent("taskreturn"); },
    handleSourceFeedback() { this.triggerEvent("sourcefeedback"); }
  }
});
