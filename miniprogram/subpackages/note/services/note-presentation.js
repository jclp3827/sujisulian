function isExampleTab(tab) { return tab?.id === 'example' || tab?.title === '例题讲解'; }
function getDisplayPoint(subjectId, point) {
  return subjectId === 'quantity' && point?.relatedTraining ? { ...point, relatedTraining: null } : point;
}
function getDisplayTabs(subjectId, point) {
  const tabs = point?.tabs || [];
  if (subjectId !== 'quantity') return tabs;
  const result = []; let examples = [];
  tabs.forEach((tab) => {
    if (isExampleTab(tab)) { examples.push(...(tab.blocks || [])); return; }
    const copy = { ...tab, blocks: [...(tab.blocks || [])] };
    if (examples.length) { (result[result.length - 1] || copy).blocks.push(...examples); examples = []; }
    result.push(copy);
  });
  if (examples.length) { const destination = result.find((tab) => tab.id === 'knowledge') || result[0]; if (destination) destination.blocks.push(...examples); }
  return result;
}
function resolveDisplayTab(subjectId, point, sourceTabId) {
  const tabs = getDisplayTabs(subjectId, point);
  if (!sourceTabId) return tabs[0] || null;
  const same = tabs.find((tab) => tab.id === sourceTabId); if (same) return same;
  const original = point.tabs.find((tab) => tab.id === sourceTabId); if (!original) return null;
  return tabs.find((tab) => original.blocks.some((block) => tab.blocks.includes(block))) || null;
}
function getDisplayTab(tabs, tabId) { return tabs.find((tab) => tab.id === tabId) || null; }
module.exports = { getDisplayPoint, getDisplayTabs, resolveDisplayTab, getDisplayTab };
