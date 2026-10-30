#!/usr/bin/env python3
import argparse,json,subprocess,sys
from evidence import V1,ROOT,make,verify,registry,COMMIT
p=argparse.ArgumentParser(add_help=False);p.add_argument('--read-section',nargs=2,metavar=('PATH','SECTION'));opt,rest=p.parse_known_args()
reg=registry();out=[];follow=[]
def add(e):
 ok,errors=verify(e);out.append(dict(evidence=e,verified=ok,errors=errors))
 # A located historical line does not establish the document's complete timeline.
 for auth in reg['authorities']:
  if auth['path']==e['path'] and '$preamble' in auth.get('sections',[]):
   item=dict(path=auth['path'],section='$preamble',limit=auth.get('limit'),source_key=auth['key'],reason='document scope and historical notices; revalidate applicability before a state/supersession conclusion')
   if item not in follow:follow.append(item)
if opt.read_section:
 path,section=opt.read_section
 admitted=reg['authorities']+reg.get('readingPolicy',{}).get('base',[])+[a for group in reg.get('readingPolicy',{}).get('dependencies',{}).values() for a in group]
 if not any(x['path']==path and section in x.get('sections',[]) for x in admitted):sys.exit('section not admitted by fixed registry')
 # make() verifies the manifest, path, registration and actual heading ancestry.
 import runpy,hashlib
 raw=(ROOT/path).read_bytes()
 # Reuse the existing project heading/fence/duplicate handling.
 make(path,1,1)
 ranges=runpy.run_path(str(ROOT/'scripts/check-documentation-consistency.py'))['document_sections'](raw.decode())
 if section not in ranges:sys.exit('registered section missing or ambiguous')
 start,end=ranges[section];lines=raw.decode().splitlines()
 count=0
 for i in range(start-1,end):
  if lines[i].strip():add(make(path,i+1,i+1));count+=1
  if count>=80:
   follow.append(dict(path=path,section=section,remaining_after_line=i+1,reason='section longer than output budget; not silently considered fully read'));break
 query=['registered section',path,section];notfound=not out
else:
 r=subprocess.run([sys.executable,str(V1/'literal-search.py')]+rest,capture_output=True,text=True,check=True);d=json.loads(r.stdout)
 for hit in d['matches']:
  e=make(hit['path'],hit['line'],hit['line']);add(e)
  if not out[-1]['verified']:
   for auth in reg['authorities']:
    if auth['path']==hit['path']:
     for section in auth.get('sections',[]):
      item=dict(path=auth['path'],section=section,limit=auth.get('limit'),source_key=auth['key'],reason='admitted section in the matched file; location only, not an answer')
      if item not in follow:follow.append(item)
     for dep in reg.get('readingPolicy',{}).get('dependencies',{}).get(auth['key'],[]):
      for section in dep.get('sections',[]):
       item=dict(path=dep['path'],section=section,limit=dep.get('limit'),source_key=auth['key'])
       if item not in follow:follow.append(item)
 query=d['query'];notfound=d['notFound']
print(json.dumps(dict(query=query,commit=COMMIT,evidence=out,notFound=notfound,scope_followups=follow,available_topics=list(reg.get('readingRoutes',{})),warning='No literal match is not proof that no applicable rule exists; use registered topic/section navigation when needed.'),ensure_ascii=False,indent=2))
