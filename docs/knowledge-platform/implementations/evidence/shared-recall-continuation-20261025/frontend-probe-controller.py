import asyncio,json,hashlib
from pathlib import Path
ROOT=Path('/Users/jmac/.codex/worktrees/politics-quick-reading/miniprogram-1');BASE=Path('/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/lib/python3.14/site-packages/wechat_devtools_mcp/scripts');OUT=Path('/tmp/rc-ui-final-sdk-probe.json')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
async def run(script):
 proc=await asyncio.create_subprocess_exec('node',str(BASE/'dist/daemon.bundle.js'),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,cwd=BASE,limit=20_000_000)
 try:
  assert json.loads((await proc.stdout.readline()).decode())['ready'];proc.stdin.write((json.dumps({'id':1,'script':'run_test_script','args':['--port','9421','--script',str(script),'--timeout','480']})+'\n').encode());await proc.stdin.drain();return json.loads((await asyncio.wait_for(proc.stdout.readline(),500)).decode())
 finally:proc.terminate();await proc.wait()
async def main():
 f=json.loads(Path('/tmp/rc-ui-fixtures.json').read_text());a=json.loads(OUT.read_text());assert all(c['success'] for c in a['chunks']);fingerprints=a['frontendHashes'];assert fingerprints=={p:sha(ROOT/p) for p in fingerprints};
 if not any(c['spec']['index']==10000 for c in a['chunks']):
  raw=json.loads(Path('/tmp/rc-sdk-group-diagnostic-result.json').read_text());r=raw['data'];chunk=json.loads(Path('/tmp/rc-sdk-chunk-10000.json').read_text());assert r['success'] and chunk['status']=='passed' and len(chunk['rows'])==4;a['chunks'].append({'spec':{'mode':'qa','start':128,'end':132,'index':10000},'success':True,'summary':r['summary'],'script_error':None,'progressProtection':chunk['progressProtection'],'rawResponsePreserved':True,'toolResponsePath':'/tmp/rc-sdk-group-diagnostic-result.json','naturalInGroupAdvance':True,'environmentId':'isolated-9421'});[r.update({'environmentId':'isolated-9421'}) for r in chunk['rows']];a['rows'].extend(chunk['rows']);OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2))
 done={(c['spec']['mode'],position) for c in a['chunks'] for position in range(c['spec']['start'],c['spec']['end'])};todo=[]
 for mode,key in [('qa','qaCases'),('exam','examCases')]:
  offset=0
  for entry in f[key]:
   end=offset+len(entry['ids']);position=offset
   while position<end:
    if (mode,position) in done:position+=1;continue
    stop=position+1
    while stop<min(end,position+4) and (mode,stop) not in done:stop+=1
    todo.append({'mode':mode,'start':position,'end':stop,'index':max(c['spec']['index'] for c in a['chunks'])+1+len(todo)});position=stop
   offset=end
 for spec in todo:
  assert fingerprints=={p:sha(ROOT/p) for p in fingerprints},'Original frontend changed during final run';assert fingerprints=={p:sha(Path('/private/tmp/politics-recall-isolated-final-20261025')/p) for p in fingerprints},'Isolated frontend differs';Path('/tmp/rc-ui-spec.json').write_text(json.dumps(spec));script=Path('/tmp/rc-sdk-isolated-single-return-group-'+str(spec['index'])+'.js');script.write_text(Path('/tmp/rc-sdk-isolated-group.js').read_text());raw=await run(script);tool=Path('/tmp/rc-current-ui-group-'+str(spec['index'])+'.json');tool.write_text(json.dumps(raw,ensure_ascii=False,indent=2));r=raw.get('data',{});chunk=json.loads(Path('/tmp/rc-sdk-chunk-'+str(spec['index'])+'.json').read_text());assert r.get('success') and chunk['status']=='passed' and chunk['progressProtection']['byteEquivalent'],{'spec':spec,'raw':raw,'error':chunk.get('error'),'operation':chunk.get('failureOperation')}
  a['chunks'].append({'spec':spec,'success':True,'summary':r['summary'],'script_error':None,'progressProtection':chunk['progressProtection'],'rawResponsePreserved':True,'toolResponsePath':str(tool),'naturalInGroupAdvance':True,'environmentId':'isolated-9421'});[r.update({'environmentId':'isolated-9421'}) for r in chunk['rows']];a['rows'].extend(chunk['rows']);OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));print(json.dumps({'phase':'final-compiled-frontend','qaRows':sum(r['mode']=='qa' for r in a['rows']),'examRows':sum(r['mode']=='exam' for r in a['rows']),'completedFaces':len(a['rows']),'totalFaces':362,'restored':True,'naturalGroup':True}),flush=True)
 for mode in ['qa','exam']:
  rows=[r for r in a['rows'] if r['mode']==mode];assert {r['id'] for r in rows}==set(f['requestedIds']);seen={}
  for row in rows:
   if row['id'] in seen:assert row['view']==seen[row['id']]['view']
   seen[row['id']]=row
  assert len(rows)==(178 if mode=='qa' else 184)
 a['status']='passed';a['allProgressRestored']=all(c['progressProtection']['byteEquivalent'] for c in a['chunks']);a['uniqueCardFaces']=356;a['wrappedRepeatedFaces']=6;OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));print(json.dumps({'status':'passed','rows':len(a['rows']),'sourceVisits':sum(len(r['sourceVisits']) for r in a['rows'])}),flush=True)
asyncio.run(main())
