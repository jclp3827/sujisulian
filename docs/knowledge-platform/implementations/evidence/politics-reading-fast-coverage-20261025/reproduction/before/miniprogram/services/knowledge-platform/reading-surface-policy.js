// Presentation admission only. Never dispatch learning events or copy content here.
const QUICK_IDS = Object.freeze(['J2V5-SEC-01','J2V5-SEC-02','J2V5-SEC-03','J2V5-SEC-04','J2V5-SEC-05']);
const SYSTEMATIC_IDS = Object.freeze(['TEN-01','FOUND-03','COGNITION-01','CAPITAL-01']);
const ARTICLE_IDS = Object.freeze(['politics-toc-v2-u003','politics-toc-v2-u002','politics-toc-v2-u007','politics-toc-v2-u024']);
const quickEnabled = id => QUICK_IDS.includes(id);
const systematicEnabled = view => Boolean(view && !view.closeout && SYSTEMATIC_IDS.includes(view.id));
const articleEnabled = (id, activity) => activity === 'reading' && ARTICLE_IDS.includes(id);
const moduleLeadMap = Object.freeze(Object.fromEntries(['b004','b015','b017','b018'].map(suffix=>['block:politics-toc-v2-u003:'+suffix,true])));
const emptyCapabilities = Object.freeze({outlineLayout:'list',primaryOutlineOnly:false,moduleLeadMap:{},relatedLinksDirect:false,relatedReasonToggle:false});
function articleCapabilities(id) {
  if (!ARTICLE_IDS.includes(id)) return emptyCapabilities;
  if (id === 'politics-toc-v2-u003') return {outlineLayout:'compact-grid',primaryOutlineOnly:true,moduleLeadMap,relatedLinksDirect:true,relatedReasonToggle:false};
  return {outlineLayout:'list',primaryOutlineOnly:true,moduleLeadMap:{},relatedLinksDirect:true,relatedReasonToggle:true};
}
module.exports={QUICK_IDS,SYSTEMATIC_IDS,ARTICLE_IDS,quickEnabled,systematicEnabled,articleEnabled,articleCapabilities,quickCompletionEnabled:true};
