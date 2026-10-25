import asyncio,json
from pathlib import Path
BASE=Path('/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/lib/python3.14/site-packages/wechat_devtools_mcp/scripts')
async def main():
 a=json.loads(Path('/tmp/p38-ui-result.json').read_text());assert a['status']=='passed' and len(a['chunks'])==26
 Path('/tmp/p38-ui-spec.json').write_text(json.dumps({'index':26,'type':'navigation','caseIndex':0}));proc=await asyncio.create_subprocess_exec('node',str(BASE/'dist/daemon.bundle.js'),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,cwd=BASE,limit=20_000_000)
 try:
  assert json.loads((await proc.stdout.readline()).decode())['ready'];proc.stdin.write((json.dumps({'id':1,'script':'run_test_script','args':['--port','9423','--script','/tmp/p38-ui-navigation.js','--timeout','300']})+'\n').encode());await proc.stdin.drain();raw=json.loads((await asyncio.wait_for(proc.stdout.readline(),330)).decode());Path('/tmp/p38-navigation-tool.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2));assert raw.get('data',{}).get('success'),raw;print(json.dumps(raw['data']['script_result']))
 finally:proc.terminate();await proc.wait()
asyncio.run(main())
