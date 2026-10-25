from pathlib import Path
import subprocess,json,sys
base=Path('/tmp/pfast20261025')
for name in ['article-relations','quick-q1','quick-completion']:
 p=subprocess.run(['/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/bin/python',str(base/'run-sdk.py'),str(base/(name+'.js'))],capture_output=True,text=True)
 if p.returncode:
  print(name,'FAILED',p.stdout[-1700:],p.stderr[-700:],flush=True);sys.exit(p.returncode)
 d=json.loads((base/'evidence'/(name+'-tool.json')).read_text());print(name,json.dumps(d['data'].get('script_result'),ensure_ascii=False)[:800],flush=True)
