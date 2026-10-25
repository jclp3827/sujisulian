from pathlib import Path
import json,hashlib
base=Path('/tmp/pfast20261025');a=[];s=[];checks={}
for kind,count,key in [('articles',5,'articles'),('system',8,'lessons')]:
 for i in range(1,count+1):
  p=base/'evidence'/f'{kind}-{i}.json';d=json.loads(p.read_text());assert d['status']=='passed-common-style-technical-checks',p;assert d['storageRestored'],p
  checks[p.stem]={'status':d['status'],'count':len(d[key])};(a if key=='articles' else s).extend(d[key])
assert len(a)==37 and len({x['id'] for x in a})==37
assert len(s)==77 and len({x['id'] for x in s})==77
for x in a+s:assert len(x['display'])==2
for name in ['flow-samples-flow','control-controls-runtime','relation-relations-runtime','quick-q1-runtime','quick-completion-actions']:
 p=base/'evidence'/(name+'.json');d=json.loads(p.read_text());assert d['status'].startswith('passed'),(name,d.get('error'));assert d['storageRestored'];checks[name]={'status':d['status']}
quick=json.loads((base/'evidence/quick-q1-runtime.json').read_text());assert len(quick['samples'])==5
plan=json.loads((base/'plan.json').read_text());assert {x['id'] for x in a}==set(plan['allArticles']);assert {x['id'] for x in s}==set(plan['allLessons'])
out={'status':'passed-full-common-style-coverage-technical-checks','counts':{'quick':5,'articles':37,'systematic':77,'total':119},'newlyCovered':106,'previousHumanAccepted':13,'humanAcceptance':'new full coverage awaits consolidated sampling; no per-small-batch gate','coveredIds':{'articles':[x['id'] for x in a],'systematic':[x['id'] for x in s]},'checks':checks,'unmappedSpecialContent':'deferred with readable existing layout','articleIdentityWaitRetry':'u025 first wait timed out; isolated diagnostic loaded same page normally with matching SDK/native IDs; full batch passed on repeat without production changes','release':False,'commit':False}
(base/'evidence/coverage-summary.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps(out['counts']),len(checks),'checks passed')
