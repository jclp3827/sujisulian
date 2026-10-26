// Entry taps and native-page display restoration only. No storage or learning decisions.
function withEntryTapGuard(definition, names, clock = Date.now) {
  for (const name of names) {
    const action = definition[name];
    if (typeof action !== 'function') throw new Error('Unknown entry action: ' + name);
    definition[name] = function(event, ...args) {
      const physical = event?.type === 'tap' || (event?.type === 'search' && event.detail?.physical === true);
      const dataset = event?.currentTarget?.dataset || {};
      const key = name + ':' + JSON.stringify(Object.keys(dataset).sort().map(k => [k,dataset[k]]));
      if (physical) {
        const now = clock(), times = this._entryTapTimes || (this._entryTapTimes = {}), last = times[key];
        if (Number.isFinite(last) && now >= last && now - last < 300) return;
        times[key] = now;
      }
      try { return action.call(this,event,...args); }
      catch (error) { if (physical) delete this._entryTapTimes[key]; throw error; }
    };
  }
  return definition;
}
function rememberSearchScroll(page, event) {
  const value = Number(event?.scrollTop);
  page._searchViewScrollTop = Number.isFinite(value) ? Math.max(0,value) : 0;
}
function markSearchReturn(page) { page._searchViewReturnPending = true; }
function resetSearchScroll(page) { page._searchViewScrollTop = 0; page._searchViewReturnPending = false; }
function restoreSearchScroll(page, platform) {
  if (!page._searchViewReturnPending) return;
  page._searchViewReturnPending = false;
  const apply = () => platform.pageScrollTo({scrollTop:page._searchViewScrollTop || 0,duration:0});
  if (typeof platform.pageScrollTo !== 'function') return;
  if (typeof platform.nextTick === 'function') platform.nextTick(apply); else apply();
}
module.exports = { withEntryTapGuard, rememberSearchScroll, markSearchReturn, resetSearchScroll, restoreSearchScroll };
