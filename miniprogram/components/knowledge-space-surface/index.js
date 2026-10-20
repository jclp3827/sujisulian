Component({
  properties: {
    space: { type: Object, value: null },
    compact: { type: Boolean, value: false }
  },
  methods: {
    handleRangeToggle() { this.triggerEvent("rangetoggle"); },
    handleDirectoryRowTap(event) {
      const id = event.currentTarget.dataset.nodeId;
      const row = this.data.space?.branch?.directoryRows.find((item) => item.id === id);
      if (row?.collapsible) return this.triggerEvent("chaptertoggle", { nodeId: id });
      this.handlePointTap(event);
    },
    handleRegionTap(event) {
      this.triggerEvent("regiontap", { nodeId: event.currentTarget.dataset.nodeId });
    },
    handlePointTap(event) {
      const { nodeId, pointId, domId } = event.currentTarget.dataset;
      if (pointId) this.triggerEvent("pointtap", { nodeId, pointId, anchorId: domId });
    }
  }
});
