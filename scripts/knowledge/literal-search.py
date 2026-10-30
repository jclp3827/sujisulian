#!/usr/bin/env python3
"""Registered snapshot search: ripgrep literal matching, not an authority oracle."""
import argparse, hashlib, json, pathlib, subprocess, sys
from binding import ROOT,COMMIT
p=argparse.ArgumentParser(description='Search registered snapshot documents; results require scope verification.')
p.add_argument('terms',nargs='+',help='literal Chinese or English search terms (OR)')
p.add_argument('--all',action='store_true',help='include historical, redirect, draft and unassessed documents')
p.add_argument('--limit',type=int,default=20)
a=p.parse_args()
manifest=json.loads((ROOT.parent/'snapshot-manifest.json').read_text())
if manifest['commit'] != COMMIT: sys.exit('FAIL: snapshot commit mismatch')
for path, expected in manifest['files'].items():
 file=ROOT/path
 if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest()!=expected: sys.exit('FAIL: snapshot integrity mismatch: '+path)
reg=json.loads((ROOT/'docs/knowledge-platform/document-registry.json').read_text())
docs={d['path']:d for d in reg['documents']}
# Do not infer approval from status; exclude clearly historical and unassessed entries by default.
allowed={'scope-reviewed','live-register'}
files=[str(ROOT/path) for path,d in docs.items() if (a.all or d.get('status') in allowed) and (ROOT/path).is_file() and pathlib.Path(path).suffix=='.md']
if not files:
 print(json.dumps({'commit':COMMIT,'query':a.terms,'matches':[],'notFound':True,'warning':'No registered documents admitted for this search mode.'},ensure_ascii=False));sys.exit(0)
cmd=['rg','--json','--fixed-strings','--ignore-case']
for term in a.terms: cmd += ['-e',term]
cmd += ['--']+files
proc=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
if proc.returncode not in (0,1): print(proc.stderr,file=sys.stderr);sys.exit(proc.returncode)
cache={}; results=[]
for raw in proc.stdout.splitlines():
 e=json.loads(raw)
 if e['type']!='match': continue
 data=e['data']; file=pathlib.Path(data['path']['text']); path=str(file.relative_to(ROOT)); line=data['line_number']; d=docs[path]
 if path not in cache:
  content=file.read_bytes(); lines=content.decode('utf-8').splitlines(); headings=[]
  for n,s in enumerate(lines,1):
   if s.startswith('#'):
    level=len(s)-len(s.lstrip('#'))
    if 1<=level<=6 and len(s)>level and s[level]==' ': headings.append((n,level,s[level+1:].strip()))
  cache[path]=(hashlib.sha256(content).hexdigest(),headings)
 sha,heads=cache[path]; stack=[]
 for n,level,title in heads:
  if n>line: break
  while stack and stack[-1][0]>=level: stack.pop()
  stack.append((level,title))
 auth=[{'key':x.get('key'),'scope':x.get('scope'),'limit':x.get('limit'),'sections':x.get('sections',[])} for x in reg.get('authorities',[]) if x.get('path')==path]
 results.append({'commit':COMMIT,'snapshot':'governed pinned snapshot; source_kind determines authority; implementation state is separate','path':path,'line':line,'section':' > '.join(x[1] for x in stack) or '(preamble)','sha256':sha,'role':d.get('role'),'status':d.get('status'),'lifecycle':d.get('lifecycle',reg['defaults']['lifecycle']),'scope':d.get('scope'),'maintenanceScope':d.get('maintenanceScope'),'usageLimit':d.get('usageLimit'),'authorityRoutes':auth,'authorityVerdict':'unverified: inspect matching section, applicable baseline, limits and supersession','text':data['lines']['text'].strip()})
 if len(results)>=max(1,a.limit): break
print(json.dumps({'commit':COMMIT,'query':a.terms,'mode':'all registered' if a.all else 'registered scope-reviewed/live-register only','warning':'Governed pinned snapshot; source_kind determines authority, not a claim of latest HEAD authority. Search hits and registry status do not approve out-of-scope rules. Verify applicability and supersession.','matches':results,'notFound':not bool(results)},ensure_ascii=False,indent=2))
