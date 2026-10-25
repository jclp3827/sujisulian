import asyncio,json,sys
from pathlib import Path
BASE=Path('/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/lib/python3.14/site-packages/wechat_devtools_mcp/scripts')
async def main():
 script=sys.argv[1];name=Path(script).stem
 p=await asyncio.create_subprocess_exec('node',str(BASE/'dist/daemon.bundle.js'),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,cwd=BASE,limit=20_000_000)
 try:
  assert json.loads((await p.stdout.readline()).decode())['ready'];p.stdin.write((json.dumps({'id':1,'script':'run_test_script','args':['--port','9440','--script',script,'--timeout','480']})+'\n').encode());await p.stdin.drain();r=json.loads((await asyncio.wait_for(p.stdout.readline(),510)).decode());Path('/tmp/politics-checkpoint-audit/runtime/'+name+'-tool.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print(json.dumps(r,ensure_ascii=False)[:6000]);assert r.get('data',{}).get('success'),r
 finally:p.terminate();await p.wait()
asyncio.run(main())
