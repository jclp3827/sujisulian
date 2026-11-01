#!/usr/bin/env node
// Page-handler dispatch only. Local VM, fake engine, no onLoad, wx cloud or real Storage.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
function page(rel) {
  const file = path.join(process.env.DS_MINI_ROOT || path.join(__dirname, '../miniprogram'), rel);
  let definition;
  vm.compileFunction(fs.readFileSync(file, 'utf8'), ['require', 'Page', 'wx'], { filename: file })(
    createRequire(file), value => { definition = value; },
    { getStorageSync() { throw Error('real Storage forbidden'); }, setStorageSync() { throw Error('real Storage forbidden'); }, cloud: { callFunction() { throw Error('real cloud forbidden'); } } });
  return { ...definition, data: { ...definition.data }, setData(values) { Object.assign(this.data, values); } };
}
const event = dataset => ({ currentTarget: { dataset } });
const note = page('subpackages/note/practice/index.js');
const noteCalls = [];
note.data = { ...note.data, sessionId: 'fixture', answer: {}, draftValue: 'B' };
note.runtime = { engine: {
  selection(_id, value) { noteCalls.push(['selection', value]); return { marker: 'draft' }; },
  submit() { noteCalls.push(['submit']); return { marker: 'result' }; },
} };
note.render = value => noteCalls.push(['render', value.marker]);
note.handleChoice(event({ key: 'B' }));
assert.deepEqual(noteCalls, [['selection', 'B'], ['render', 'draft']]);
note.handleSubmit();
assert.deepEqual(noteCalls.slice(2), [['selection', 'B'], ['submit'], ['render', 'result']]);
const common = page('subpackages/common-sense/learning/index.js');
const commonCalls = [];
common.session = { kind: 'qa' }; common.data.card = { id: 'fixture' };
common.engine = { answer(_session, choice) { commonCalls.push(['answer', choice]); } };
common.renderSession = () => commonCalls.push(['render']);
common.handleChoice(event({ index: 2 }));
assert.deepEqual(commonCalls, [['answer', 2], ['render']]);
common.handleReveal();
assert.deepEqual(commonCalls.slice(2), [['answer', null], ['render']]);
common.guideSession = { id: 'guide' }; common.data.guideCard = { id: 'card' };
common.guideEngine = { assess(_session, status) { commonCalls.push(['assess', status]); return true; } };
common.renderGuideSession = () => commonCalls.push(['renderGuide']);
common.handleGuideAssess(event({ result: 'remembered' }));
assert.deepEqual(commonCalls.slice(4), [['assess', 'remembered'], ['renderGuide']]);
const politics = page('subpackages/politics/practice/index.js');
const politicsCalls = [];
politics.data.interactionState = 'prompt'; politics.session = { id: 'qa' };
politics.engine = {
  answer(_session, choice) { politicsCalls.push(['answer', choice]); },
  reveal() { politicsCalls.push(['reveal']); },
  assessRecall(_session, result) { politicsCalls.push(['recall', result]); },
  skipRevealedRecall() { politicsCalls.push(['recall-skip']); },
};
politics.render = () => { politicsCalls.push(['render']); politics.data.interactionState = 'answered'; };
politics.handleOptionTap(event({ index: 1 }));
politics.handleOptionTap(event({ index: 1 }));
assert.deepEqual(politicsCalls, [['answer', 1], ['render']]);
politics.handleReveal();
assert.deepEqual(politicsCalls.slice(2), [['reveal'], ['render']]);
politics.handleRecallResult({ detail: { result: 'remembered' } });
politics.handleRecallResult({ detail: { result: 'skipped' } });
assert.deepEqual(politicsCalls.slice(4), [['recall', 'remembered'], ['render'], ['recall-skip'], ['render']]);
process.stdout.write(JSON.stringify({ passed: 4, scope: 'note confirm; common immediate choice/reveal/guide; politics immediate choice lock/reveal/recall dispatch', cloudCalls: 0, realStorageCalls: 0 }) + '\n');
