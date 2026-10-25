const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const revisionPath = 'docs/knowledge-pilot/sources/politics/politics-applied-confusion-revision-v1.json';
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fileHash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
function validateSection(name, patches, reviews, readFile = p => fs.readFileSync(path.join(root,p),'utf8')) {
  const roles = ['independent-ai-subject-expert','independent-ai-first-learner'];
  assert.equal(reviews.length, 2, name + ': missing independent review');
  assert.deepEqual(reviews.map(r=>r.role).sort(), roles.slice().sort());
  for (const reference of reviews) {
    const report = JSON.parse(readFile(reference.reviewPath)), inputText = readFile(reference.inputPath), input = JSON.parse(inputText);
    assert.equal(report.role, reference.role); assert.equal(report.status, 'passed');
    assert.equal(report.inputSha256, crypto.createHash('sha256').update(inputText).digest('hex'));
    assert.equal(report.sectionSha256, digest(patches)); assert.equal(input.sectionSha256, report.sectionSha256);
    const key = name === 'applied' ? 'questionId' : 'itemId';
    assert.deepEqual(report.rows.map(row=>row[key]).sort(), Object.keys(patches).sort());
    assert.ok(report.rows.every(row=>row.decision==='pass' && !(row.findings || []).length), name+': unresolved findings');
  }
}
function loadQualityRevision() {
  if (!fs.existsSync(path.join(root,revisionPath))) return null;
  const revision = JSON.parse(fs.readFileSync(path.join(root,revisionPath),'utf8'));
  assert.equal(revision.status, 'two-independent-ai-roles-reviewed-candidate');
  for (const name of ['applied','confusion']) validateSection(name, revision[name+'Patches'], revision.reviews[name]);
  const associationReport = JSON.parse(fs.readFileSync(path.join(root,revision.associationReview.reviewPath),'utf8'));
  const associationInput = fs.readFileSync(path.join(root,revision.associationReview.inputPath),'utf8');
  assert.equal(associationReport.role, 'independent-ai-subject-expert');
  assert.equal(associationReport.status,'passed');
  assert.equal(associationReport.inputSha256,crypto.createHash('sha256').update(associationInput).digest('hex'));
  assert.deepEqual(associationReport.rows.map(row=>row.questionId).sort(),Object.keys(revision.appliedPatches).sort());
  for (const row of associationReport.rows) {
    assert.equal(row.decision,'pass');
    assert.deepEqual(revision.appliedAssociations[row.questionId],row.recommendedAssociation);
  }
  const source = require('../../miniprogram/models/politics-p3-v2-runtime');
  const pkg = require('../../miniprogram/services/knowledge-platform/politics-adapter').createPoliticsAdapter(source).buildPackage();
  const blocks = new Map(pkg.knowledgeUnits.flatMap(unit=>unit.blocks.map(block=>[block.id,block])));
  for (const evidence of revision.sourceEvidence) {
    assert.equal(blocks.get(evidence.blockId)?.fallbackText,evidence.text,evidence.blockId+': source drift');
    assert.equal(crypto.createHash('sha256').update(evidence.text).digest('hex'),evidence.textSha256);
    if (blocks.get(evidence.blockId).publishable === false) {
      const binding = revision.candidateSourceBindings.find(row=>row.blockId===evidence.blockId);
      assert.ok(binding && binding.publishable===false, 'Unqualified candidate source');
      assert.equal(fileHash(binding.registry),binding.registrySha256);
      const registry=JSON.parse(fs.readFileSync(path.join(root,binding.registry),'utf8'));
      assert.equal(registry.curriculumExpansionApproval,'user-approved-20261024');
      assert.ok(registry.revalidationSourceSupplementApproval);
      assert.ok(registry.blocks.some(row=>'block:'+row.unitId+':'+row.id===evidence.blockId && row.text===evidence.text && row.publishable===false));
      const lessons=require('../../miniprogram/models/politics-systematic-units-runtime').lessons;
      assert.ok(lessons.some(lesson=>lesson.parts.some(part=>part.sourceBlockIds?.includes(evidence.blockId))), 'Candidate source outside accepted curriculum');
    }
  }
  return revision;
}
module.exports = { loadQualityRevision, validateSection, digest, fileHash, revisionPath };
