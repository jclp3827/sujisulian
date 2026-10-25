// Presentation-only rollout: accepted knowledge and learning records remain authoritative.
const { DISPLAY_PREFERENCE_STORAGE_KEY, DISPLAY_PREFERENCE_DEFAULTS } = require('./display-preferences');
const QUICK = Object.freeze(['J2V5-SEC-02', 'J2V5-SEC-04']);
const LESSONS = Object.freeze(['TEN-01', 'COGNITION-01', 'CAPITAL-01']);
const ARTICLES = Object.freeze(['politics-toc-v2-u003', 'politics-toc-v2-u007', 'politics-toc-v2-u034']);
const PARAGRAPH_ENDS = Object.freeze({
  'COGNITION-01-body-1': ['具有直接现实性、自觉能动性和社会历史性。'],
  'CAPITAL-01-body-1': ['能够支配自己的劳动力；', '需要出卖劳动力。'],
  'CAPITAL-01-body-2': ['劳动是劳动力的实际使用。'],
  'CAPITAL-01-body-3': ['超过这一部分的是剩余劳动时间。'],
  'CAPITAL-01-body-4': ['在必要劳动时间不变时延长劳动日；', '相应延长剩余劳动时间。', '从而缩短必要劳动时间。'],
});
const quickEnabled = id => QUICK.includes(id);
const lessonEnabled = view => Boolean(view && !view.closeout && LESSONS.includes(view.id));
const articleEnabled = (id, activity) => ARTICLES.includes(id) && activity === 'reading';

function splitRuns(runs, ends) {
  const text = runs.map(run => run.text).join('');
  const cuts = []; let after = 0;
  for (const end of ends) {
    const at = text.indexOf(end, after);
    if (at < 0) return null;
    const cut = at + end.length;
    if (cut <= after || cut >= text.length) return null;
    cuts.push(cut); after = cut;
  }
  const bounds = [0, ...cuts, text.length];
  return bounds.slice(0,-1).map((start, index) => {
    const finish = bounds[index + 1]; let offset = 0; const projected = [];
    for (const run of runs) {
      const end = offset + run.text.length;
      const left = Math.max(start, offset), right = Math.min(finish, end);
      if (left < right) projected.push({...run,text:run.text.slice(left-offset,right-offset)});
      offset = end;
    }
    return projected;
  });
}
function projectReadingLesson(view) {
  if (!lessonEnabled(view)) return view;
  const parts = view.parts.map(part => {
    const ends = PARAGRAPH_ENDS[part.id] || (part.kind === 'recap'
      ? (part.text.match(/[^；]+；/g) || []).slice(0,part.text.endsWith('；')?-1:undefined) : []);
    const paragraphs = ends.length ? splitRuns(part.runs,ends) : null;
    return paragraphs ? {...part,paragraphs:paragraphs.map((runs,index)=>({id:part.id+'-reading-'+index,runs}))} : part;
  });
  const separator = view.title.lastIndexOf('·');
  return {...view,parts,readingTitle:separator<0?view.title:view.title.slice(0,separator),
    readingOrdinal:separator<0?'':view.title.slice(separator)};
}
function saveReaderPreferences(field, value) {
  const valid = field === 'fontScale' ? ['default','large','extraLarge']
    : field === 'lineSpacing' ? ['normal','relaxed'] : [];
  if (!valid.includes(value)) return {ok:false};
  try {
    const current = wx.getStorageSync(DISPLAY_PREFERENCE_STORAGE_KEY);
    if (current && (typeof current !== 'object' || Array.isArray(current))) return {ok:false};
    const preferences = {...DISPLAY_PREFERENCE_DEFAULTS,...(current || {}),[field]:value};
    wx.setStorageSync(DISPLAY_PREFERENCE_STORAGE_KEY,preferences);
    return {ok:true,preferences};
  } catch (error) { return {ok:false}; }
}
// Restore the visible semantic block after a display change; never dispatch a learning event.
function applyReaderPreferences(page, preferences, options = {}) {
  const generation = page.readerDisplayGeneration = (page.readerDisplayGeneration || 0) + 1;
  const identity = () => JSON.stringify([page.data?.screen,page.data?.reviewing,page.data?.view?.id || page.data?.route?.experience?.quickPrimer?.currentSectionId || page.data?.cardSurface?.identity?.pointId || page.data?.cardSurface?.identity?.id]);
  const originalIdentity = identity();
  const pageActive = () => typeof getCurrentPages !== 'function' || getCurrentPages().slice(-1)[0] === page;
  const current = () => generation === page.readerDisplayGeneration && pageActive() && identity() === originalIdentity;
  const apply = callback => { if(pageActive() && generation === page.readerDisplayGeneration)page.setData({displayPreferences:preferences},callback); };
  if (!wx.createSelectorQuery) return apply();
  const scope = options.component || page;
  const before = wx.createSelectorQuery().in(scope);
  before.selectAll(options.selector || '.unit-part').boundingClientRect().selectViewport().scrollOffset().exec(result => {
    const rows = result?.[0] || [], scrollTop = result?.[1]?.scrollTop || 0;
    const guard = options.topInset || page.headerHeight || 80;
    const visible = rows.filter(row=>row.id && row.height>0 && row.bottom>guard);
    const anchor = visible[0];
    apply(() => {
      if (!anchor || !current()) return;
      wx.nextTick(() => {
        wx.createSelectorQuery().in(scope).select('#'+anchor.id).boundingClientRect().exec(([rect]) => {
          if (!rect || !current()) return;
          const target = Math.max(0,scrollTop+rect.top-anchor.top);
          wx.pageScrollTo({scrollTop:target,duration:0});
          if (options.onLayout) options.onLayout();
        });
      });
    });
  });
}
module.exports = {QUICK,LESSONS,ARTICLES,PARAGRAPH_ENDS,quickEnabled,lessonEnabled,articleEnabled,splitRuns,projectReadingLesson,saveReaderPreferences,applyReaderPreferences};
