Component({
  properties: {
    space: { type: Object, value: null },
    projectionLabel: { type: String, value: "完整目录" },
    compact: { type: Boolean, value: false }
  },
  methods: {
    handleProjectionToggle() {
      this.triggerEvent("projectiontoggle");
    },
    handleRegionTap(event) {
      this.triggerEvent("regiontap", { nodeId: event.currentTarget.dataset.nodeId });
    },
    handlePointTap(event) {
      const { nodeId, pointId, domId } = event.currentTarget.dataset;
      if (pointId) this.triggerEvent("pointtap", { nodeId, pointId, anchorId: domId });
    },
    handleBack() {
      this.triggerEvent("surfaceback");
    }
  }
});
