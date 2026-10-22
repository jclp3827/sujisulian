#!/usr/bin/env python3
"""Offline template/style validation only; no IDE state, preview, or upload."""
import hashlib,json,re,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; MINI=ROOT/'miniprogram'
BIN=Path('/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec')
PAGES=['pages/note/index/index']+['subpackages/note/'+p+'/index' for p in ['directory','search','detail','practice','memory'] if (MINI/'subpackages/note'/p/'index.wxml').exists()]
def imports(source,found=None):
 found={} if found is None else found
 for name in re.findall(r'@import\s+["\']([^"\']+)["\']|<(?:include|import)\s+src=["\']([^"\']+)["\']',source.read_text()):
  name=next(v for v in name if v)
  target=(MINI/name.lstrip('/') if name.startswith('/') else source.parent/name).resolve();rel=str(target.relative_to(MINI))
  if rel not in found:found[rel]=target;imports(target,found)
 return found
def main():
 results=[]
 with tempfile.TemporaryDirectory(prefix='notes-compile-') as temp:
  for page in PAGES:
   for ext,tool in [('wxml','wcc'),('wxss','wcsc')]:
    rel=page+'.'+ext;source=MINI/rel;dest=Path(temp)/str(len(results));deps=imports(source)
    run=subprocess.run([str(BIN/tool),rel,*deps,'-o',str(dest)],cwd=MINI,capture_output=True,text=True,timeout=30)
    results.append({'file':rel,'passed':run.returncode==0 and dest.is_file(),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'diagnostic':run.stderr.strip()})
  broken=Path(temp)/'broken.wxml';broken.write_text('<view wx:if="{{unclosed"><text></view>')
  bad=subprocess.run([str(BIN/'wcc'),str(broken),'-o',str(Path(temp)/'bad')],capture_output=True,text=True,timeout=30)
 passed=all(r['passed'] for r in results) and bad.returncode!=0
 print(json.dumps({'passed':passed,'mode':'offline-template-style','wholePackageBuild':False,'uploaded':False,'malformedTemplateRejected':bad.returncode!=0,'files':results},ensure_ascii=False,indent=2))
 return 0 if passed else 1
if __name__=='__main__':raise SystemExit(main())
