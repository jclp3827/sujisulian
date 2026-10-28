# coding: utf-8
from pathlib import Path
import subprocess,hashlib,json,sys
scratch=Path('/private/tmp/peanut-ds2-preintegration-20261028');before=json.loads((scratch/'protected-before.json').read_text());rows=[];repo='/Users/jmac/WeChatProjects/miniprogram-1'
for old in before['worktrees']:
 root=old['root'];now={'root':root,'exists':Path(root).is_dir()}
 if now['exists']:
  def git(*a):return subprocess.check_output(['git','--no-optional-locks','-C',root,*a])
  s=git('status','--porcelain=v1','--untracked-files=all','-z');idx=Path(git('rev-parse','--path-format=absolute','--git-path','index').decode().strip());now.update(head=git('rev-parse','HEAD').decode().strip(),statusSha256=hashlib.sha256(s).hexdigest(),indexSha256=hashlib.sha256(idx.read_bytes()).hexdigest())
  if 'contentSha256' in old:
   h=hashlib.sha256();files=sorted(set(git('ls-files','-z','--cached','--others','--exclude-standard').split(b'\0'))-{b''})
   for f in files:
    p=Path(root)/f.decode();fh=hashlib.sha256()
    if p.is_symlink():fh.update(str(p.readlink()).encode())
    elif p.is_file():
     with p.open('rb') as data:
      for chunk in iter(lambda:data.read(1048576),b''):fh.update(chunk)
    else:fh.update(b'MISSING')
    h.update(f+b'\0'+fh.digest()+b'\0')
   now['contentSha256']=h.hexdigest();now['files']=len(files)
 keys=['exists','head','statusSha256','indexSha256']+(['contentSha256','files'] if 'contentSha256'in old else [])
 now['changedFields']=[k for k in keys if old.get(k)!=now.get(k)];now['unchanged']=not now['changedFields'];rows.append(now)
refs=subprocess.check_output(['git','--no-optional-locks','-C',repo,'for-each-ref','--format=%(refname) %(objectname)']).decode().splitlines();a=dict(x.split(' ',1) for x in before['refs']);b=dict(x.split(' ',1) for x in refs);own={'refs/heads/codex/design-system-ds2-corrections-20261028','refs/heads/codex/design-system-ds2-preintegration-20261028'};other=[{'ref':k,'before':a.get(k),'after':b.get(k)} for k in sorted(set(a)|set(b)) if k not in own and a.get(k)!=b.get(k)]
report={'beforeSource':'protected-before.json','protectedWorktrees':rows,'otherRefChangesObserved':other,'authorizedTaskRefsExcluded':sorted(own),'originalCommit':subprocess.check_output(['git','--no-optional-locks','-C',repo,'rev-parse','b32587f434d8fff93031ae731944c61b53039085']).decode().strip(),'coreProtectedUnchanged':all(x['unchanged'] for x in rows if 'contentSha256'in x),'allWorktreeMetadataUnchanged':all(x['unchanged'] for x in rows),'scope':'Git-visible files for main, release candidate and original DS tree; metadata for all existing protected registrations. Observed parallel changes are recorded, not reverted.'}
p=Path(sys.argv[1]);p.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'coreProtectedUnchanged':report['coreProtectedUnchanged'],'allMetadataUnchanged':report['allWorktreeMetadataUnchanged'],'changedTrees':[x['root'] for x in rows if not x['unchanged']],'otherRefs':len(other)},ensure_ascii=False))
