const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {digest}=require('../../miniprogram/subpackages/note/services/learning-semantic');
const {RULE_VERSION,RULE_DIGEST}=require('../../miniprogram/subpackages/note/services/memory-admission');
const HISTORICAL_EVIDENCE='docs/knowledge-platform/implementations/evidence/notes-memory-v5-g0-validation.json';
const EVIDENCE='docs/knowledge-platform/implementations/evidence/notes-memory-v5-g0-source01-validation.json';
const ENGINE_FILES=[
 'miniprogram/subpackages/note/services/memory-content.js',
 'miniprogram/subpackages/note/services/memory-reference.js',
 'miniprogram/subpackages/note/services/memory-semantic.js',
 'miniprogram/subpackages/note/services/memory-admission.js',
 'miniprogram/subpackages/note/services/memory-session.js',
 'miniprogram/subpackages/note/services/learning-semantic.js',
 'miniprogram/subpackages/note/models/memory-version-compatibility.js',
 'docs/knowledge-platform/content/notes/memory-v5-version-compatibility.json',
 'scripts/lib/notes-memory-admission.js',
 'scripts/lib/notes-memory-g0-gate.js',
 'scripts/lib/notes-memory-expansion-v2.js',
 'scripts/build-notes-memory.js',
 'scripts/build-notes-memory-candidate-review.js',
 'scripts/register-notes-memory-candidate.js',
 'scripts/record-notes-memory-decision.js',
 'scripts/validate-notes-memory-g0.js',
 'scripts/lib/notes-memory-sample-source.js',
 'scripts/lib/notes-learning-source-compatibility.js',
 'miniprogram/subpackages/note/services/practice-session.js',
 'miniprogram/subpackages/note/models/learning-source-compatibility.js',
 'scripts/build-notes-learning.js',
 'scripts/build-notes-memory-review.js',
 'scripts/validate-notes-memory-source-rebinding.js',
];
const REQUIRED_CHECKS=['node scripts/validate-notes-memory-g0.js','node scripts/validate-notes-memory-v5.js','node scripts/validate-notes-memory-v5-continuity.js','node scripts/validate-notes-learning-pages.js','node scripts/build-notes-memory-review.js --check-only','node scripts/build-notes-memory.js --check-only','node scripts/build-notes-memory-candidate-review.js --check-only','node scripts/validate-notes-memory-source-rebinding.js'];
function verifyG0(root,override){
 if(override===undefined&&!fs.existsSync(path.join(root,EVIDENCE)))return null;
 const evidence=override===undefined?JSON.parse(fs.readFileSync(path.join(root,EVIDENCE),'utf8')):override;
 if(evidence?.schemaVersion!==1||evidence.batch!=='ME-G0'||evidence.status!=='engineering-passed'||evidence.ruleVersion!==RULE_VERSION||evidence.ruleDigest!==RULE_DIGEST)throw Error('ME-G0工程证据无效');
 const source=require('./notes-memory-sample-source'),migration=source.migration(root);
 if(!migration||evidence.phaseRevision!=='NOTE-G0-SOURCE-01'||evidence.sourceMigrationDigest!==source.MANIFEST_DIGEST)throw Error('来源修订G0版本无效');
 const oldBytes=fs.readFileSync(path.join(root,HISTORICAL_EVIDENCE));
 if(evidence.predecessor?.path!==HISTORICAL_EVIDENCE||evidence.predecessor.sha256!==migration.priorG0.sha256||crypto.createHash('sha256').update(oldBytes).digest('hex')!==migration.priorG0.sha256)throw Error('历史G0证明已变化');
 const previous=JSON.parse(oldBytes);
 if(previous.verifiedImplementationFiles.length!==migration.priorG0.engineSnapshots.length||!previous.verifiedImplementationFiles.every(f=>migration.priorG0.engineSnapshots.some(s=>s.originalPath===f.path&&s.sha256===f.sha256)))throw Error('历史G0实现快照不完整');
 const files=evidence.verifiedImplementationFiles;
 if(!Array.isArray(files)||files.length!==ENGINE_FILES.length||new Set(files.map(f=>f.path)).size!==files.length||!ENGINE_FILES.every(p=>files.some(f=>f.path===p)))throw Error('ME-G0实现证据集合不完整');
 for(const file of files){const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file.path))).digest('hex');if(actual!==file.sha256)throw Error('ME-G0实现证据已变化：'+file.path);}
 if(!Array.isArray(evidence.checks)||!evidence.checks.length||!evidence.checks.every(c=>c.exit_code===0)||!REQUIRED_CHECKS.every(cmd=>evidence.checks.some(c=>c.cmd===cmd)))throw Error('ME-G0定向检查证据不完整');
 const scenarios=JSON.parse(evidence.checks.find(c=>c.cmd===REQUIRED_CHECKS[0]).output);
 if(scenarios.passed!==true||scenarios.checks<33)throw Error('ME-G0专项用例证据不足');
 return {status:evidence.status,evidencePath:EVIDENCE,evidenceDigest:digest(evidence),ruleVersion:RULE_VERSION,ruleDigest:RULE_DIGEST};
}
module.exports={EVIDENCE,HISTORICAL_EVIDENCE,ENGINE_FILES,REQUIRED_CHECKS,verifyG0};
