const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const SOURCE = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const RUNTIME = 'miniprogram/models/politics-systematic-units-runtime.js';
const EVIDENCE = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3b-20261023.json';
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

function main() {
  const source = JSON.parse(fs.readFileSync(path.join(root, SOURCE), 'utf8'));
  const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
  const evidence = JSON.parse(fs.readFileSync(path.join(root, EVIDENCE), 'utf8'));
  const banned = /怎样|放在一起|放回|回看|混成|日常争吵|材料怎样用|先看|先读|先抓住|先知道|先明确|再看|再读|一起理解|分别看什么|各管什么|各讲什么/;
  assert.equal(source.lessons.length, 72);
  assert.equal(evidence.changedLessons.length, 49);
  validateUserComprehensionLineage(root, evidence.batchId);
  assert.equal(evidence.progressCompatible, true);
  assert.equal(evidence.stableLessonIds, true);
  assert.equal(evidence.orderChanged, false);
  for (const lesson of source.lessons) {
    const surfaces = [lesson.title, lesson.question, ...lesson.sections.map(item => item.label), lesson.boundary.label, lesson.reflection.prompt];
    assert.ok(surfaces.every(value => !banned.test(value)), `${lesson.id} still contains conversational or editorial phrasing`);
  }
  const expectedTitles = { 'TEN-01':'十个明确·一至三','TEN-02':'十个明确·四至六','TEN-03':'十个明确·七','TEN-04':'十个明确·八至十',
    'SYS-02':'十四个坚持·一至七','SYS-03':'十四个坚持·八至十四','SYS-04':'六个必须坚持·一至三','SYS-05':'六个必须坚持·四至六' };
  for (const [id,title] of Object.entries(expectedTitles)) assert.equal(source.lessons.find(item=>item.id===id).title,title);
  console.log(JSON.stringify({status:'passed',batch:evidence.batchId,lessons:72,changedLessons:49,disallowedSurfacePhrases:0,
    curriculumVersion:runtime.curriculumVersion,progressCompatible:true,realUserAcceptance:evidence.realUserAcceptance}));
}

main();
