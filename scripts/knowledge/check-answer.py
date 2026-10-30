#!/usr/bin/env python3
import argparse,json,re,sys
try:
 from evidence import verify,ROOT
except Exception as ex:
 print(json.dumps(dict(valid=False,errors=[str(ex)])));sys.exit(1)
p=argparse.ArgumentParser();p.add_argument('answer');p.add_argument('evidence');a=p.parse_args()
try:
 answer=json.load(open(a.answer));bundle=json.load(open(a.evidence));records={r['evidence']['id']:r['evidence'] for r in bundle['evidence']};errors=[];sources=[]
 if set(answer)!={'claims'}:errors.append('unexpected final display fields; use verified claims only')
 claims=answer['claims']
 if not claims:errors.append('empty claims')
 for c in claims:
  if not isinstance(c,dict) or set(c)-{'text','evidence_ids','kind'} or not isinstance(c.get('text'),str):errors.append('invalid claim fields');continue
  if not c.get('evidence_ids'):errors.append('claim lacks evidence')
  for id in c.get('evidence_ids',[]):
   e=records.get(id)
   if e is None:errors.append('unknown evidence '+id);continue
   ok,why=verify(e)
   if not ok:errors.extend(why);continue
   if c.get('kind')=='current-rule' and (e['source_kind']!='approved-project-source' or e['registration'].get('lifecycle')!='approved-scoped' or not e['authority_routes']):errors.append('current authority not approved for this claim');continue
   sources.append(dict(id=id,commit=e['commit'],source_kind=e['source_kind'],project=e['project'],path=e['path'],sha256=e['sha256'],start=e['start'],end=e['end'],section=e['section'],scope=e['scope_verdict']))
  if re.search(r'\]\(|:\d+|https?://',c.get('text','')):errors.append('model-supplied location prohibited; use evidence IDs')
 print(json.dumps(dict(valid=not errors,errors=errors,claims=claims,sources=sources,semantic_support='requires independent review'),ensure_ascii=False,indent=2));sys.exit(bool(errors))
except Exception as ex:print(json.dumps(dict(valid=False,errors=[str(ex)])));sys.exit(1)
