// Preserve the immutable P3 evidence; issue an exact current implementation revalidation.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const old='docs/knowledge-platform/implementations/evidence/notes-memory-v5-p3-definition-close-20261022.json';
const closure=JSON.parse(fs.readFileSync(path.join(root,old),'utf8'));
const scripts=['scripts/validate-learning-bank-buffer.js','scripts/validate-learning-bank-clients.js','scripts/validate-public-learning-page-runtime.js','scripts/validate-learning-bank-lifecycle-s3.js'];
const checks=scripts.map(file=>{const stdout=cp.execFileSync(process.execPath,[file],{cwd:root,encoding:'utf8'});return{command:'node '+file,path:file,scriptSha256:sha(fs.readFileSync(path.join(root,file))),exitCode:0,stdout,stdoutSha256:sha(stdout)};});
const page=fs.readFileSync(path.join(root,'miniprogram/subpackages/note/memory/index.js'),'utf8');
const wxml=fs.readFileSync(path.join(root,'miniprogram/subpackages/note/memory/index.wxml'),'utf8');
assert(page.includes('createMemoryEngine')&&page.includes('createCardBuffer')&&page.includes('handleSource')&&page.includes('handleReveal'));
for(const result of ['remembered','fuzzy','missed','skipped'])assert(wxml.includes(result),'Four assessment actions preserved');
const files=closure.verifiedImplementationFiles.map(f=>({...f,historicalSha256:f.sha256,sha256:sha(fs.readFileSync(path.join(root,f.path)))}));
const receipt={schema:1,historicalClosureSha256:sha(fs.readFileSync(path.join(root,old))),files,checks,
 reasoning:['detail JS evolution is practice source exposure tracking and shared note rendering; source tab navigation remains',
 'memory JS moved from whole-body loading to B1 bounded cloud buffer/catalog with stable IDs, reveal/assessment/storage/source unchanged; B5 loading and failure guards retained; S3 rebootstrap verifies the frozen current ID and semantic version before reuse, otherwise explicitly expires without clearing ratings/events',
 'memory WXML/WXSS add loading/retry states and layout; shared blocks and four reveal-then-assess buttons preserved',
 'detail WXML historical hash remains equal; source semantic fixtures and frozen eight sample identities are not rewritten'],
 engineeringRevalidated:true,independentContentApproval:false,humanDeviceAcceptance:false};
const out=path.join(root,'docs/knowledge-platform/implementations/evidence/notes-memory-current-reuse-revalidation.json');
if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({passed:true,changedFiles:files.filter(f=>f.sha256!==f.historicalSha256).length,checks:checks.map(c=>c.command),written:process.argv.includes('--write')}));
