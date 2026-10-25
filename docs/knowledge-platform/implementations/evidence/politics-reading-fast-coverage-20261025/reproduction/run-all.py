from pathlib import Path
import subprocess,json,sys
base=Path('/tmp/pfast20261025'); scripts=[base/f'articles-{i}.js' for i in range(4,6)]+[base/f'system-{i}.js' for i in range(1,9)]
for script in scripts:
 p=subprocess.run(['/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/bin/python',str(base/'run-sdk.py'),str(script)],capture_output=True,text=True)
 if p.returncode:
  print(script.name,'FAILED',p.stdout[-2000:],p.stderr[-700:],flush=True);sys.exit(p.returncode)
 d=json.loads((base/'evidence'/f'{script.stem}-tool.json').read_text());print(script.name,json.dumps(d['data'].get('script_result'),ensure_ascii=False),flush=True)
