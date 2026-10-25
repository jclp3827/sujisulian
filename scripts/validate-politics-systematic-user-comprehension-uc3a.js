const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const SOURCE = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const RUNTIME = 'miniprogram/models/politics-systematic-units-runtime.js';
const EVIDENCE = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3a-20261023.json';
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

function main() {
  const source = JSON.parse(fs.readFileSync(path.join(root, SOURCE), 'utf8'));
  const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
  const evidence = JSON.parse(fs.readFileSync(path.join(root, EVIDENCE), 'utf8'));
  const currentPath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3d-20261023.json');
  const banned = /怎样|放在一起|放回|混成|日常争吵|材料怎样用|先读|再读|回看/;
  assert.equal(evidence.changedLessons.length, 12);
  validateUserComprehensionLineage(root, evidence.batchId);
  assert.equal(evidence.progressCompatible, true);
  assert.equal(evidence.stableLessonIds, true);
  assert.equal(evidence.orderChanged, false);
  for (const record of evidence.changedLessons) {
    const lesson = source.lessons.find(item => item.id === record.id);
    assert.ok(lesson, `missing ${record.id}`);
    if (!fs.existsSync(currentPath)) {
      assert.equal(lesson.title, record.after.title);
      assert.equal(lesson.question, record.after.question);
      assert.deepEqual(lesson.sections.map(item => item.label), record.after.sectionLabels);
      assert.equal(lesson.boundary.label, record.after.boundaryLabel);
      assert.equal(lesson.reflection.prompt, record.after.reflectionPrompt);
    }
    const visible = [lesson.title, lesson.question, ...lesson.sections.map(item => item.label), lesson.boundary.label, lesson.reflection.prompt].join('\n');
    assert.ok(!banned.test(visible), `${record.id} still contains conversational or editorial phrasing`);
  }
  for (const id of ['TEN-01', 'TEN-02', 'TEN-03', 'TEN-04', 'SYS-02', 'SYS-03', 'SYS-04', 'SYS-05']) {
    assert.match(source.lessons.find(item => item.id === id).title, /·/);
  }
  console.log(JSON.stringify({ status: 'passed', batch: evidence.batchId, changedLessons: 12,
    curriculumVersion: runtime.curriculumVersion, progressCompatible: true, realUserAcceptance: evidence.realUserAcceptance }));
}

main();
