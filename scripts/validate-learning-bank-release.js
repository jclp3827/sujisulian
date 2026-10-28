// Validate a publish OR rollback artifact against CURRENT authority, never its own stale ledger.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {digest,binding,withdrawn,validateLedger}=require('./lib/learning-bank-admission');
function validateArtifact(directory,policy,ledger) {
  validateLedger(ledger);
  const manifest=JSON.parse(fs.readFileSync(path.join(directory,'data/manifest.json'),'utf8'));
  assert(manifest.admission && !manifest.admission.candidate,'Old/unauditable or candidate artifact is not a safe rollback');
  assert.equal(manifest.admission.policyDigest,digest(policy),'Current admission policy required');
  assert.equal(manifest.admission.withdrawalDigest,digest(ledger),'Current withdrawals required; rebuild this rollback');
  for(const [rel,sha]of Object.entries(manifest.files||{}))assert.equal(require('crypto').createHash('sha256').update(fs.readFileSync(path.join(directory,'data',rel))).digest('hex'),sha,'Incomplete or altered artifact '+rel);
  for(const[name,bank]of Object.entries(manifest.banks))for(const row of bank.index){
    assert(!withdrawn(name,row.id,row.contentRevision || row.version,ledger),'Withdrawn item in artifact');
    const shard=JSON.parse(fs.readFileSync(path.join(directory,'data',name,row.file+'.json'),'utf8'));
    const item=shard.find(x=>x.id===row.id);assert(item,'Missing indexed body');
    assert.equal(binding(name,item,require('../miniprogram/subpackages/common-sense/models/learning-pack')),row.admissionDigest,'Body/dependency binding mismatch');
    const historic=policy.historical[name]?.[row.id]===row.admissionDigest;
    const granted=policy.grants.some(b=>b.decision==='public-authorized'&&b.authorizedBy&&b.authorizedAt&&b.independentReviewReceipt&&b.humanSamplingReceipt&&b.bindings.some(x=>x.bank===name&&x.id===row.id&&x.digest===row.admissionDigest));
    assert(historic||granted,'Unapproved item in artifact');
    assert(bank.modes && bank.index.length===bank.count);
  }
  // A rollback must actually ship the withdrawal-aware handler and current sidecar.
  assert(fs.readFileSync(path.join(directory,'index.js'),'utf8').includes('effective-withdrawals.json'),'Unsafe legacy handler');
  assert.equal(digest(JSON.parse(fs.readFileSync(path.join(directory,'effective-withdrawals.json'),'utf8'))),digest(ledger));
  return manifest;
}
if(require.main===module){const root=path.resolve(__dirname,'..');validateArtifact(process.argv[2]||path.join(root,'cloudfunctions/learningBank'),require('../docs/knowledge-platform/content/learning-bank-public-admission.json'),require('../cloudfunctions/learningBank/effective-withdrawals.json'));console.log('Current publish/rollback authority, complete manifest and withdrawals passed');}
module.exports={validateArtifact};
