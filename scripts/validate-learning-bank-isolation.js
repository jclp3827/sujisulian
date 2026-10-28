const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const snapshots=require('../docs/knowledge-platform/lifecycle-s1-s3-20261028/protected-before.json');
const rows=[];
for(const before of snapshots){
 const run=args=>cp.execFileSync('git',args,{cwd:before.path,encoding:'utf8'});
 const head=run(['rev-parse','HEAD']).trim(),status=run(['status','--porcelain=v1','-uall']);
 assert.equal(head,before.head,'Protected HEAD changed: '+before.path);assert.equal(status,before.status,'Protected index/worktree status changed: '+before.path);
 for(const[relative,sha]of Object.entries(before.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(before.path,relative))).digest('hex'),sha,'Protected file changed: '+before.path+'/'+relative);
 const current=[...new Set(run(['ls-files','-co','--exclude-standard','-z']).split('\0').filter(Boolean))].sort();
 assert.deepEqual(current,Object.keys(before.files).sort(),'Protected file inventory changed');
 assert.notEqual(fs.realpathSync(root),fs.realpathSync(before.path));
 rows.push({path:before.path,head,verifiedFiles:current.length,headUnchanged:true,statusUnchanged:true,allSha256Unchanged:true});
}
assert.equal(cp.execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim(),'codex/learning-bank-lifecycle-s1-s3');
console.log(JSON.stringify({passed:true,worktree:root,protected:rows,onlySharedAdministrativeChanges:'new worktree registration, isolated branch commits and explicit checkpoint refs'}));
