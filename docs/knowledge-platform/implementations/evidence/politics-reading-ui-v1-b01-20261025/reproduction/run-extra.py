from pathlib import Path
import subprocess,json,sys
base=Path('/tmp/pui1');py='/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/bin/python'
for i in range(8,12):
 (base/'spec.json').write_text(json.dumps({'index':i}));(base/'evidence/active-extra.json').write_text(json.dumps({'index':i,'status':'running'}));p=subprocess.run([py,str(base/'run-sdk.py'),str(base/'extra-ui.js')],capture_output=True,text=True);(base/f'evidence/ui-{i}-transport.log').write_text(p.stdout+p.stderr)
 if (base/'evidence/extra-ui-tool.json').exists():(base/f'evidence/ui-{i}-tool.json').write_bytes((base/'evidence/extra-ui-tool.json').read_bytes())
 d=json.loads((base/f'evidence/ui-{i}.json').read_text());print(json.dumps({'index':i,'status':d['status'],'error':d.get('error',{}).get('message'),'operation':d.get('failureOperation'),'storage':d.get('storage')},ensure_ascii=False),flush=True)
 if p.returncode or d['status']!='passed':sys.exit(1)
(base/'evidence/active-extra.json').write_text(json.dumps({'status':'all-extras-passed'}))
