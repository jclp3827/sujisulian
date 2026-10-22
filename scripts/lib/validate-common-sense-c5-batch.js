const assert = require("assert/strict");
const body = require("../../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../../docs/knowledge-platform/content/common-sense-learning-v1");
const ledger = require("../../docs/knowledge-platform/implementations/common-sense-content-c5-ledger.json");
const { compile } = require("../build-common-sense-learning");
const { availableContent } = require("../../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions } = require("../../miniprogram/subpackages/common-sense/services/learning-entry");
function validate(batch, expected = {}) {
  const content = availableContent(body, pack, true), formal = availableContent(body, pack, false);
  const qids = batch.addedQuestions.map((x) => x.id), tids = batch.targets.map((x) => x.id), mids = batch.mnemonics.map((x) => x.id);
  assert.deepEqual(compile(source, body), pack);
  qids.forEach((id) => { const q=pack.questions.find((x)=>x.id===id), s=pack.questionSpecifications.find((x)=>x.questionId===id); assert.ok(q&&s); assert.deepEqual(Object.keys(s.distractorReasons).map(Number).sort(),q.options.map((_,i)=>i).filter((i)=>i!==q.answer)); assert.ok(pack.entryPlans.modes.qa.questionIds.includes(id)); assert.ok(!formal.questions.some((x)=>x.id===id)); });
  tids.forEach((id)=>{const d=pack.variationDecisions.find((x)=>x.targetId===id); assert.ok(d&&d.directQuestionIds.length&&d.variationQuestionIds.length); assert.ok(!formal.targets.some((x)=>x.id===id));});
  mids.forEach((id)=>{const m=pack.mnemonics.find((x)=>x.id===id); assert.ok(m&&m.conditions.length&&m.excludes.length); m.phrases.forEach((p)=>assert.deepEqual(p.questionIds,p.checks.map((c)=>c.questionId))); assert.ok(!formal.mnemonics.some((x)=>x.id===id));});
  batch.sourceDispositions.filter((x)=>x.status==="已建设").forEach((row)=>assert.ok(ledger.entries.some((e)=>e.candidateId===row.candidateId&&e.status==="已建设")));
  assert.equal(entryQuestions(content,"daily").length,47); assert.equal(entryQuestions(content,"confusion").length,12); assert.equal(entryQuestions(content,"exam","all","selected").length,49);
  if(expected.version) assert.equal(pack.version,expected.version); if(expected.questions) assert.equal(pack.questions.length,expected.questions); if(expected.groups) assert.equal(pack.groups.length,expected.groups); if(expected.targets) assert.equal(pack.targets.length,expected.targets); if(expected.mnemonics) assert.equal(pack.mnemonics.length,expected.mnemonics);
  return {passed:true,batch:batch.batch,questions:qids.length,targets:tids.length,mnemonics:mids.length,contentVersion:content.version};
}
module.exports={validate};
