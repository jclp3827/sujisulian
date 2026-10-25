const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0,12);
function applyRevision(cards, revision, before) {
  const original = new Map(before.recallCards.map(card=>[card.cardId,card]));
  assert.equal(before.bankVersion,revision.baselineBankVersion);
  const removed = new Map(revision.retirements.map(item=>[item.id,item]));
  const additions = new Map(revision.retirements.map(item=>[item.id,revision.additions.filter(card=>card.parentCardId===item.id)]));
  const result = [];
  for(const card of cards) {
    const previous=original.get(card.cardId);assert.ok(previous,card.cardId+' not in baseline');
    if(removed.has(card.cardId)) {
      for(const child of additions.get(card.cardId))result.push({...card,...child,sourceRecallItemId:null,replacesRecallItemId:card.cardId,origin:'shared-recall-quality-p1',answerCharacterCount:child.answer.length,recallVersion:'recall-v2-'+digest(child)});
      continue;
    }
    const patch=revision.patches[card.cardId];
    result.push({...card,...patch,answerCharacterCount:(patch?.answer||card.answer).length,
      recallVersion:patch?.assessmentChanged ? 'recall-v2-'+digest(patch) : previous.recallVersion || `${before.bankVersion}:${card.cardId}`,
      preservedPracticeVersion:!patch?.assessmentChanged ? previous.practiceVersion : null,
    });
  }
  assert.equal(new Set(result.map(c=>c.cardId)).size,result.length);
  for(const record of revision.retirements)for(const id of record.replacementIds)assert.ok(result.some(c=>c.cardId===id),'missing replacement '+id);
  return result;
}
module.exports={applyRevision};
