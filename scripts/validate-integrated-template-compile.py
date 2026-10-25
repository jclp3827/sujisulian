#!/usr/bin/env python3
"""Installed WCC/WCSC only. Not an IDE whole-package or visual acceptance."""
from pathlib import Path
import json,re,subprocess,tempfile,hashlib
ROOT=Path(__file__).resolve().parents[1]
MINI=ROOT/'miniprogram'
BIN=Path('/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec')
app=json.loads((MINI/'app.json').read_text())
bases=set(app['pages']+[p['root']+'/'+n for p in app['subPackages'] for n in p['pages']])
bases.add('custom-tab-bar/index')
def components(base):
    data=json.loads((MINI/(base+'.json')).read_text())
    for target in data.get('usingComponents',{}).values():
        if target.startswith('plugin://'):continue
        p=(MINI/target.lstrip('/') if target.startswith('/') else (MINI/base).parent/target).resolve()
        name=str(p.relative_to(MINI))
        if name not in bases:
            bases.add(name)
            components(name)
for base in list(bases):components(base)
def deps(source,ext,found=None):
    found={} if found is None else found
    pattern=r'@import\s+["\x27]([^"\x27]+)["\x27]' if ext=='wxss' else r'<(?:include|import)[^>]+src=["\x27]([^"\x27]+)["\x27]'
    for ref in re.findall(pattern,source.read_text()):
        target=(MINI/ref.lstrip('/') if ref.startswith('/') else source.parent/ref).resolve()
        rel=str(target.relative_to(MINI))
        if rel not in found:
            found[rel]=target
            deps(target,ext,found)
    return found
results=[]
with tempfile.TemporaryDirectory(prefix='integrated-template-') as tmp:
    for base in sorted(bases):
        for ext,tool in [('wxml','wcc'),('wxss','wcsc')]:
            rel=base+'.'+ext;src=MINI/rel;out=Path(tmp)/str(len(results))
            run=subprocess.run([str(BIN/tool),rel,*deps(src,ext),'-o',str(out)],cwd=MINI,capture_output=True,text=True,timeout=30)
            results.append({'file':rel,'passed':run.returncode==0 and out.is_file(),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'diagnostic':run.stderr.strip()})
    bad=Path(tmp)/'broken.wxml';bad.write_text('<view wx:if="{{unclosed"><text></view>')
    rejected=subprocess.run([str(BIN/'wcc'),str(bad),'-o',str(Path(tmp)/'bad')],capture_output=True,text=True).returncode!=0
passed=all(x['passed'] for x in results) and rejected
print(json.dumps({'passed':passed,'mode':'offline-integration-template-style','wholePackageIdeBuild':False,'visualOrDeviceAcceptance':False,'malformedRejected':rejected,'checks':len(results),'results':results},indent=2))
raise SystemExit(0 if passed else 1)
