const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const evidenceFiles = [
  'politics-systematic-user-comprehension-uc2-runtime-20261023.json',
  'politics-systematic-user-comprehension-uc3a-20261023.json',
  'politics-systematic-user-comprehension-uc3b-20261023.json',
  'politics-systematic-user-comprehension-uc3c-20261023.json',
  'politics-systematic-user-comprehension-uc3d-20261023.json',
  'politics-systematic-user-comprehension-uc5a-20261023.json',
  'politics-systematic-user-comprehension-uc5b-20261023.json',
  'politics-systematic-user-comprehension-uc5c-20261023.json',
  'politics-systematic-user-comprehension-uc5d-20261023.json',
  'politics-systematic-user-comprehension-uc6-20261023.json',
  'politics-systematic-user-comprehension-uc7a-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p0-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p1-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p1r1-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p2-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p2r1-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p2r2-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p2r3-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p3-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p4-20261023.json',
  'politics-systematic-user-comprehension-uc7b-p4r1-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p5-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p5r1-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p6-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p6r1-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p7-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p8-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p9-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p10-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p10r1-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p11-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p12-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p13-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p14-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p15-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p16-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p17-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p18-20261024.json',
  'politics-systematic-user-comprehension-uc7b-p19-20261024.json',
  'politics-systematic-package-sync-quick-repair-20261024.json',
  'politics-systematic-package-sync-quick-overview-v5-20261024.json',
  'politics-systematic-package-sync-quick-user-view-20261024.json',
  'politics-systematic-package-sync-recall-p1-20261025.json',
  'politics-systematic-package-sync-recall-c1-20261025.json',
  'politics-systematic-package-sync-recall-c2-20261025.json',
  'politics-systematic-package-sync-recall-c3-20261025.json',
  'politics-systematic-package-sync-recall-c4-20261025.json',
  'politics-systematic-package-sync-recall-c5-20261025.json',
  'politics-systematic-package-sync-recall-c6-20261025.json',
  'politics-systematic-package-sync-recall-c7-20261025.json',
  'politics-systematic-package-sync-recall-c7-version-fix-20261025.json',
  'politics-systematic-package-sync-recall-p3-20261025.json',
  'politics-systematic-package-sync-applied-confusion-20261025.json',
];

function digest(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function validateUserComprehensionLineage(root, fromBatchId) {
  const evidenceRoot = path.join(root, 'docs/knowledge-platform/implementations/evidence');
  const records = evidenceFiles
    .map(file => path.join(evidenceRoot, file))
    .filter(file => fs.existsSync(file))
    .map(file => JSON.parse(fs.readFileSync(file, 'utf8')));
  const start = records.findIndex(record => record.batchId === fromBatchId);
  assert.ok(start >= 0, `missing lineage batch ${fromBatchId}`);
  for (let index = start + 1; index < records.length; index += 1) {
    assert.equal(records[index].previousCurriculumVersion, records[index - 1].curriculumVersion,
      `${records[index].batchId} does not descend from ${records[index - 1].batchId}`);
    assert.equal(records[index].stableLessonIds, true);
    assert.equal(records[index].orderChanged, false);
    assert.equal(records[index].progressCompatible, true);
  }
  const latest = records[records.length - 1];
  const runtimePath = path.join(root, latest.runtimePath);
  const sourcePath = path.join(root, latest.sourcePath);
  const runtime = require(runtimePath);
  assert.equal(latest.curriculumVersion, runtime.curriculumVersion);
  assert.equal(digest(sourcePath), latest.sourceSha256, 'current candidate source hash drift');
  assert.equal(digest(runtimePath), latest.runtimeSha256, 'current candidate runtime hash drift');
  return { latest, records: records.slice(start) };
}

module.exports = { validateUserComprehensionLineage };
