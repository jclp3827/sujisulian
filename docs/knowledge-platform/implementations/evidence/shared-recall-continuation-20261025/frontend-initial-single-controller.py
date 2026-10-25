import asyncio,json,hashlib
from pathlib import Path
ROOT=Path('/Users/jmac/.codex/worktrees/politics-quick-reading/miniprogram-1');BASE=Path('/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/lib/python3.14/site-packages/wechat_devtools_mcp/scripts');OUT=Path('/tmp/rc-ui-final-sdk-probe.json')
PATHS=['miniprogram/subpackages/politics/detail/index.js','miniprogram/components/knowledge-card-surface/index.js','miniprogram/components/knowledge-card-surface/index.wxml','miniprogram/subpackages/politics/practice/index.js','miniprogram/subpackages/politics/practice/index.wxml','miniprogram/subpackages/politics/route/guided-route.js','miniprogram/subpackages/politics/route/guided-route.wxml','miniprogram/services/knowledge-platform/learning.js','miniprogram/services/knowledge-platform/projectors.js','miniprogram/models/politics-learning-banks-runtime.js']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
async def run(script):
 proc=await asyncio.create_subprocess_exec('node',str(BASE/'dist/daemon.bundle.js'),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,cwd=BASE,limit=20_000_000)
 try:
  assert json.loads((await proc.stdout.readline()).decode())['ready']
  proc.stdin.write((json.dumps({'id':1,'script':'run_test_script','args':['--port','9420','--script',str(script),'--timeout','180']})+'\n').encode());await proc.stdin.drain();return json.loads((await asyncio.wait_for(proc.stdout.readline(),200)).decode())
 finally:proc.terminate();await proc.wait()
async def main():
 fixture=json.loads(Path('/tmp/rc-ui-fixtures.json').read_text());fingerprints={p:sha(ROOT/p) for p in PATHS};raw=json.loads(Path('/tmp/rc-sdk-anchor-fixed-exam0-v2-result.json').read_text());r=raw['data'];chunk=json.loads(Path('/tmp/rc-sdk-chunk-6001.json').read_text());assert r['success'] and chunk['status']=='passed' and chunk['rows'][0]['assessedResponse']=='fuzzy'
 a={'status':'running','bankVersion':fixture['bankVersion'],'packageVersion':fixture['packageVersion'],'method':'isolated actual rendered card, real component source/return controls, native exact target geometry and frozen session equality; current compiled anchor-readiness fix','frontendHashes':fingerprints,'rows':chunk['rows'],'chunks':[{'spec':{'mode':'exam','start':0,'end':1,'index':6001},'success':True,'summary':r['summary'],'script_error':None,'progressProtection':chunk['progressProtection'],'rawResponsePreserved':True,'toolResponsePath':'/tmp/rc-sdk-anchor-fixed-exam0-v2-result.json'}]};OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));todo=[]
 for mode,key in [('qa','qaCases'),('exam','examCases')]:
  for position in range(sum(len(e['ids']) for e in fixture[key])):
   if mode=='exam' and position==0:continue
   todo.append({'mode':mode,'start':position,'end':position+1,'index':6500+len(todo)})
 for spec in todo:
  assert fingerprints=={p:sha(ROOT/p) for p in PATHS},'Compiled frontend changed during final run'
  for attempt in range(2):
   Path('/tmp/rc-ui-spec.json').write_text(json.dumps(spec));script=Path('/tmp/rc-sdk-final-current-'+str(spec['index'])+'-'+str(attempt)+'.js');script.write_text(Path('/tmp/rc-sdk-full-probe-v15.js').read_text());raw=await run(script);tool=Path('/tmp/rc-current-ui-run-'+str(spec['index'])+'.json');tool.write_text(json.dumps(raw,ensure_ascii=False,indent=2));r=raw.get('data',{});chunk=json.loads(Path('/tmp/rc-sdk-chunk-'+str(spec['index'])+'.json').read_text())
   if r.get('success'):break
   failure={'spec':spec,'attempt':attempt,'raw':raw,'error':chunk.get('error'),'failureOperation':chunk.get('failureOperation'),'progressProtection':chunk.get('progressProtection')};Path('/tmp/rc-current-ui-retry-'+str(spec['index'])+'-'+str(attempt)+'.json').write_text(json.dumps(failure,ensure_ascii=False,indent=2));assert chunk.get('progressProtection',{}).get('byteEquivalent') and 'timeout' in (r.get('script_error',{}).get('message','')),'Nontransient failure '+json.dumps(failure)
  a['chunks'].append({'spec':spec,'success':r.get('success'),'summary':r.get('summary'),'script_error':r.get('script_error'),'progressProtection':chunk.get('progressProtection'),'rawResponsePreserved':True,'toolResponsePath':str(tool)});a['rows'].extend(chunk['rows']);OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));assert r.get('success') and chunk['status']=='passed' and chunk['progressProtection']['byteEquivalent'],{'spec':spec,'raw':raw,'error':chunk.get('error')}
  print(json.dumps({'phase':'final-compiled-frontend','qaRows':sum(r['mode']=='qa' for r in a['rows']),'examRows':sum(r['mode']=='exam' for r in a['rows']),'completedFaces':len(a['rows']),'totalFaces':362,'restored':True}),flush=True)
 for mode in ['qa','exam']:
  rows=[r for r in a['rows'] if r['mode']==mode];assert {r['id'] for r in rows}==set(fixture['requestedIds']);seen={}
  for row in rows:
   if row['id'] in seen:assert row['view']==seen[row['id']]['view']
   seen[row['id']]=row
  assert len(rows)==(178 if mode=='qa' else 184)
 a['status']='passed';a['allProgressRestored']=all(c['progressProtection']['byteEquivalent'] for c in a['chunks']);a['uniqueCardFaces']=356;a['wrappedRepeatedFaces']=6;OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));print(json.dumps({'status':'passed','rows':len(a['rows']),'sourceVisits':sum(len(r['sourceVisits']) for r in a['rows'])}),flush=True)
asyncio.run(main())
