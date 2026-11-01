#!/usr/bin/env python3
# coding: utf-8
from pathlib import Path
import subprocess,json,hashlib,sys,datetime
before=json.loads(Path(sys.argv[1]).read_text());repo='/Users/jmac/WeChatProjects/miniprogram-1'
def git(root,*args):return subprocess.check_output(['git','--no-optional-locks','-C',root,*args])
def sha(x):return hashlib.sha256(x).hexdigest()
rows=[]
for old in before['worktrees']:
 root=old['root'];now={'root':root,'exists':Path(root).exists()}
 if now['exists']:
  now['head']=git(root,'rev-parse','HEAD').decode().strip();now['statusSha256']=sha(git(root,'status','--porcelain=v1','-z','--untracked-files=all'))
  idx=Path(git(root,'rev-parse','--git-path','index').decode().strip());idx=idx if idx.is_absolute() else Path(root)/idx;now['indexSha256']=sha(idx.read_bytes()) if idx.exists() else None
  paths=sorted(set(git(root,'ls-files','-z','--cached','--others','--exclude-standard').split(b'\0'))-{b''});total=hashlib.sha256();scope=hashlib.sha256()
  for f in paths:
   p=Path(root)/f.decode();h=hashlib.sha256()
   if p.is_symlink():h.update(str(p.readlink()).encode())
   elif p.is_file():
    with p.open('rb') as stream:
     for b in iter(lambda:stream.read(1048576),b''):h.update(b)
   else:h.update(b'MISSING')
   value=f+b'\0'+h.digest()+b'\0';total.update(value)
   if f.split(b'/')[0] in [b'miniprogram',b'cloudfunctions',b'assets-source']:scope.update(value)
  now.update(fileCount=len(paths),contentSha256=total.hexdigest(),productSha256=scope.hexdigest())
 now['changedFields']=[k for k,v in old.items() if k!='root' and v!=now.get(k)];now['unchanged']=not now['changedFields'];rows.append(now)
a=dict(x.split(' ',1) for x in before['refs']);b=dict(x.split(' ',1) for x in git(repo,'for-each-ref','--format=%(refname) %(objectname)').decode().splitlines());own={'refs/heads/codex/design-system-common-baseline-ds2.3','refs/heads/codex/ds2.3-onboarding-proof-20261028','refs/codex/design-system/adoptions/ds2.3-common-20261028'}
other=[{'ref':k,'before':a.get(k),'after':b.get(k)} for k in sorted(set(a)|set(b)) if k not in own and a.get(k)!=b.get(k)]
result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'protectedWorktrees':rows,'allProtectedUnchanged':all(x['unchanged'] for x in rows),'observedOtherRefChanges':other,'authorizedNewRefs':sorted(own),'limits':'Git-visible tracked and untracked bytes, index, status and HEAD for every original worktree; ignored caches are outside this comparison. Parallel changes, if any, are observed rather than reverted.'}
Path(sys.argv[2]).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'allProtectedUnchanged':result['allProtectedUnchanged'],'changedTrees':[{'root':x['root'],'fields':x['changedFields']} for x in rows if not x['unchanged']],'otherRefChanges':len(other)},ensure_ascii=False))
