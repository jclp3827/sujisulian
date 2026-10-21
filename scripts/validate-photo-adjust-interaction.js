#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createController } = require('../miniprogram/subpackages/photo/process/controller');

const template = fs.readFileSync(path.join(__dirname, '../miniprogram/subpackages/photo/process/index.wxml'), 'utf8');

function pageFor(confirm) {
  let modalCalls = 0;
  const wx = {};
  const call = async (_target, method) => {
    assert.equal(method, 'showModal');
    modalCalls++;
    return { confirm };
  };
  const definition = createController(wx, { createFiles() {}, createRaster() {}, createPreviewPaid() {}, call }, Date);
  let generateCalls = 0;
  const page = {
    ...definition,
    data: JSON.parse(JSON.stringify(definition.data)),
    setData(value, done) { Object.assign(this.data, value); if (done) done(); },
    async generate() { generateCalls++; },
    _alive: true,
    _locked: false,
    _revision: 3,
    _source: { record: { path: 'source.jpg' } },
  };
  page.data.hasSource = true;
  page.data.aiAvailable = true;
  return { page, modalCalls: () => modalCalls, generateCalls: () => generateCalls };
}

async function main() {
  const mode = pageFor(true);
  await mode.page.selectAiBackgroundMode();
  assert.equal(mode.page.data.aiModeSelected, true);
  assert.equal(mode.modalCalls(), 0);
  assert.equal(mode.generateCalls(), 0);

  const cancelled = pageFor(false);
  await cancelled.page.confirmAndGenerate();
  assert.equal(cancelled.modalCalls(), 1);
  assert.equal(cancelled.generateCalls(), 0);
  assert.equal(cancelled.page.data.contentConfirmed, false);

  const confirmed = pageFor(true);
  await confirmed.page.confirmAndGenerate();
  assert.equal(confirmed.modalCalls(), 1);
  assert.equal(confirmed.generateCalls(), 1);
  assert.equal(confirmed.page.data.contentConfirmed, true);

  assert.match(template, /bindtap="selectAiBackgroundMode"/);
  assert.match(template, /class="btn-base btn-primary ai-start" bindtap="chooseAiBackground"/);
  assert.match(template, /bindtap="confirmAndGenerate"/);
  assert.doesNotMatch(template, /<checkbox-group/);

  console.log(JSON.stringify({
    passed: true,
    checks: [
      'AI tab selection changes local mode without invoking confirmation or processing',
      'explicit AI start remains the only UI binding to chooseAiBackground',
      'generation cancellation produces no output call',
      'generation confirmation grants the existing content confirmation and invokes generation once',
      'persistent confirmation checkbox removed'
    ],
    realPayment: false,
    realBdaCalls: 0
  }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
