import asyncio,json,hashlib,sys
from pathlib import Path
ROOT=Path('/Users/jmac/.codex/worktrees/politics-quick-reading/miniprogram-1');COPY=Path('/private/tmp/politics-applied-confusion-final-20261025');BASE=Path('/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/lib/python3.14/site-packages/wechat_devtools_mcp/scripts');OUT=Path('/tmp/p38-ui-result.json')
async def run(script,port=9423,timeout=480):
 proc=await asyncio.create_subprocess_exec('node',str(BASE/'dist/daemon.bundle.js'),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,cwd=BASE,limit=20_000_000)
 try:
  assert json.loads((await proc.stdout.readline()).decode())['ready'];proc.stdin.write((json.dumps({'id':1,'script':'run_test_script','args':['--port',str(port),'--script',str(script),'--timeout',str(timeout)]})+'\n').encode());await proc.stdin.drain();return json.loads((await asyncio.wait_for(proc.stdout.readline(),timeout+30)).decode())
 finally:proc.terminate();await proc.wait()
def equal_source(manifest):
 for p in manifest['sourceFiles']:
  assert hashlib.sha256((ROOT/p['path']).read_bytes()).hexdigest()==p['sha256'],p['path']+' original source changed'
  assert hashlib.sha256((COPY/p['path']).read_bytes()).hexdigest()==p['sha256'],p['path']+' isolated source changed'
async def main():
 manifest=json.loads(Path('/tmp/p38-isolated-manifest.json').read_text());equal_source(manifest)
 f=json.loads(Path('/tmp/p38-ui-fixtures.json').read_text());cases=[{'index':i,'type':'qa','caseIndex':i} for i in range(8)]+[{'index':8,'type':'daily','caseIndex':0}]+[{'index':9+i,'type':'confusion','caseIndex':i,'correct':False} for i in range(14)]+[{'index':23+i,'type':'confusion','caseIndex':c,'correct':True} for i,c in enumerate([4,10])]+[{'index':25,'type':'recovery','caseIndex':0}]
 if OUT.exists():a=json.loads(OUT.read_text());assert all(c['success'] for c in a['chunks'])
 else:
  baseline={}
  for port in [9420,9423]:
   raw=await run('/tmp/p38-readonly.js',port,60);Path('/tmp/p38-readonly-before-'+str(port)+'.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2));assert raw.get('data',{}).get('success'),raw;baseline[str(port)]=raw['data']['script_result']
  assert baseline['9423']['politicalKeys']==0,'isolated project storage must be separate'
  a={'status':'running','synthetic':True,'project':str(ROOT),'isolatedProject':str(COPY),'port':9423,'bankVersion':f['bankVersion'],'applicationVersion':f['applicationVersion'],'packageVersion':f['packageVersion'],'baseline':baseline,'chunks':[],'rows':[]};OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2))
 for spec in cases:
  if any(c['spec']['index']==spec['index'] for c in a['chunks']):continue
  equal_source(manifest);Path('/tmp/p38-ui-spec.json').write_text(json.dumps(spec));script=Path('/tmp/p38-ui-case-'+str(spec['index'])+'.js');script.write_text(Path('/tmp/p38-ui-case.js').read_text());raw=await run(script);tool=Path('/tmp/p38-ui-tool-'+str(spec['index'])+'.json');tool.write_text(json.dumps(raw,ensure_ascii=False,indent=2));chunkPath=Path('/tmp/p38-ui-chunk-'+str(spec['index'])+'.json');chunk=json.loads(chunkPath.read_text());data=raw.get('data',{});assert data.get('success') and chunk['status']=='passed' and chunk['storage']['byteEquivalent'],{'spec':spec,'raw':raw,'chunkError':chunk.get('error'),'operation':chunk.get('operation')};assert not data['summary']['errors'] and not data['summary']['exceptions']
  a['chunks'].append({'spec':spec,'success':True,'summary':data['summary'],'script':str(script),'tool':str(tool),'chunk':str(chunkPath),'storage':chunk['storage']});a['rows'].extend(chunk['rows']);OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));print(json.dumps({'passedChunks':len(a['chunks']),'totalChunks':26,'applicationFaces':sum(r['kind']=='application' for r in a['rows']),'confusionFlows':sum(r['kind']=='confusion' for r in a['rows']),'sourceVisits':sum(len(r.get('sourceVisits',[])) for r in a['rows']),'restored':True}),flush=True)
  if '--smoke' in sys.argv:return
 assert len(a['chunks'])==26;assert len({r['id'] for r in a['rows'] if r['kind']=='application' and r['mode']=='qa'})==24;assert len({r['id'] for r in a['rows'] if r['kind']=='confusion'})==14
 for port in [9420,9423]:
  raw=await run('/tmp/p38-readonly.js',port,60);Path('/tmp/p38-readonly-after-'+str(port)+'.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2));
  if port==9420 and not raw.get('data',{}).get('success'):
   a.setdefault('finalStorage',{})[str(port)]={'status':'unavailable','reason':'Original window automation connection is no longer available; tests did not reconnect or write to it.'};continue
  assert raw.get('data',{}).get('success'),raw;a.setdefault('finalStorage',{})[str(port)]=raw['data']['script_result']
 assert a['finalStorage']['9423']['politicalKeys']==0;assert a['finalStorage']['9423']['politicalStorageSha256']==a['baseline']['9423']['politicalStorageSha256'];a['originalStorageChangedDuringTests']=(a['finalStorage']['9420'].get('politicalStorageSha256')!=a['baseline']['9420']['politicalStorageSha256']) if a['finalStorage']['9420'].get('politicalStorageSha256') else None;a['originalProjectWrittenByTests']=False;a['status']='passed';equal_source(manifest);OUT.write_text(json.dumps(a,ensure_ascii=False,indent=2));print(json.dumps({'status':'passed','chunks':26,'applicationUnique':24,'confusionUnique':14}),flush=True)
asyncio.run(main())
