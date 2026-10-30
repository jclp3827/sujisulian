"""Exact evidence records regenerated from governed Git bytes, never live line numbers."""
import hashlib,json,runpy
from binding import BASE,V1,ROOT,COMMIT,REGSHA,MANIFEST_SHA,CONFIG,REGISTRY
def digest(raw):return hashlib.sha256(raw).hexdigest()
def registry():
    raw=(ROOT/REGISTRY).read_bytes()
    if digest(raw)!=REGSHA:raise ValueError('registry integrity mismatch')
    return json.loads(raw)
def make(path,start,end):
    reg=registry();mraw=(V1/'snapshot-manifest.json').read_bytes()
    if digest(mraw)!=MANIFEST_SHA:raise ValueError('manifest mismatch')
    manifest=json.loads(mraw);file=(ROOT/path).resolve()
    if not file.is_relative_to(ROOT.resolve()) or path not in manifest['files']:raise ValueError('outside fixed snapshot')
    raw=file.read_bytes();sha=digest(raw)
    if sha!=manifest['files'][path]:raise ValueError('snapshot content changed')
    doc=next((d for d in reg['documents'] if d['path']==path),None)
    if doc is None:raise ValueError('unregistered source')
    lines=raw.decode().splitlines()
    if type(start)!=int or type(end)!=int or not 1<=start<=end<=len(lines):raise ValueError('invalid lines')
    checker=ROOT/'scripts/check-documentation-consistency.py'
    if digest(checker.read_bytes())!=manifest['files']['scripts/check-documentation-consistency.py']:raise ValueError('section parser changed')
    ranges=runpy.run_path(str(checker))['document_sections'](raw.decode())
    admitted=reg['authorities']+reg.get('readingPolicy',{}).get('base',[])+[x for v in reg.get('readingPolicy',{}).get('dependencies',{}).values() for x in v]
    routes=[x for x in admitted if x['path']==path and any(s in ranges and ranges[s][0]<=start<=end<=ranges[s][1] for s in x.get('sections',[]))]
    # Crossing a heading is never a single clause, even inside an admitted parent.
    if any(repr_line.lstrip().startswith(('# ', '## ', '### ', '#### ')) for repr_line in lines[start:end]):raise ValueError('cross-section range')
    section=[title for title,(s,e) in ranges.items() if s<=start<=e and not title.startswith('$')]
    historical=doc['status'] in {'historical','needs-review','draft'}
    scope='historical-or-unreviewed-only' if historical else ('scoped-source; semantic applicability review required' if routes else 'scope-unverified')
    e=dict(commit=COMMIT,source_kind=CONFIG['source_kind'],project=CONFIG['project'],path=path,sha256=sha,start=start,end=end,section=section or ['$preamble'],quote='\n'.join(lines[start-1:end]),registry_sha256=REGSHA,registration=doc,authority_routes=routes,scope_verdict=scope)
    e['id']='E'+digest(json.dumps(e,sort_keys=True,ensure_ascii=False).encode())[:24]
    return e
def verify(e):
    try:
        actual=make(e['path'],e['start'],e['end'])
        if actual!=e:return False,['evidence differs from fixed project snapshot']
        if e['scope_verdict']=='scope-unverified':return False,['section outside admitted scope']
        return True,[]
    except Exception as ex:return False,[str(ex)]
