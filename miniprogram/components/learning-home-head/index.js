// Home-only display/event contract, selectively reused from ce7d634.
Component({
  properties: { title: String, description: String, searchHint: String },
  methods: { handleSearch(event) { this.triggerEvent('search', { physical: event?.type === 'tap' }); } },
});
