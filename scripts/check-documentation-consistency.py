#!/usr/bin/env python3
"""Scoped document admission; inventory and location checks never approve products."""
from __future__ import annotations
import argparse, collections, hashlib, json, os, re, subprocess
from pathlib import Path, PurePosixPath
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / 'docs/knowledge-platform/document-registry.json'
EXCLUDED = {'.git', 'node_modules', 'miniprogram_npm', 'vendor', '__pycache__'}
LINK = re.compile(r'!?\[[^\]]*\]\((<[^>]+>|[^)]+)\)')

def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args], env=dict(os.environ, GIT_OPTIONAL_LOCKS='0'))

def digest(raw): return hashlib.sha256(raw).hexdigest()

def safe_path(path):
    p = PurePosixPath(path)
    return bool(path) and not p.is_absolute() and '..' not in p.parts and str(p) == path

def first_party_markdown():
    names = set(git('ls-files', '-c', '-o', '--exclude-standard', '-z').decode().split('\0'))
    return sorted(ROOT / p for p in names if p.endswith('.md') and not set(PurePosixPath(p).parts) & EXCLUDED)

def relative(path): return Path(path).relative_to(ROOT).as_posix()

def document_sections(content):
    """Adapted reference parser: fence-aware, reject ambiguous duplicate titles."""
    lines = content.splitlines(); headings = []; fence = None
    for n, line in enumerate(lines, 1):
        m = re.match(r'^\s*(`{3,}|~{3,})', line)
        if m:
            token = m[1]
            if fence is None: fence = token
            elif token[0] == fence[0] and len(token) >= len(fence): fence = None
            continue
        if fence: continue
        m = re.match(r'^(#{1,6})\s+(.+?)\s*#*\s*$', line)
        if m: headings.append((n, len(m[1]), m[2]))
    counts = collections.Counter(h[2] for h in headings); result = {}
    for i, (start, level, title) in enumerate(headings):
        end = next((n - 1 for n, depth, _ in headings[i+1:] if depth <= level), len(lines))
        if counts[title] == 1: result[title] = (start, end)
    result['$preamble'] = (1, next((n for n, level, _ in headings if level > 1), len(lines)+1)-1)
    return result

def links(text, source):
    fence = None
    for number, line in enumerate(text.splitlines(), 1):
        m = re.match(r'^\s*(`{3,}|~{3,})', line)
        if m:
            if fence is None: fence = m[1]
            elif m[1][0] == fence[0] and len(m[1]) >= len(fence): fence = None
            continue
        if fence: continue
        for m in LINK.finditer(line):
            raw = m[1].strip().strip('<>')
            if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', raw): continue
            target, _, anchor = raw.partition('#'); target = unquote(target.split('?', 1)[0])
            # Absolute local evidence links remain external dependencies, not scanned content.
            if target.startswith('/'): yield number, raw, None, anchor; continue
            normalized = os.path.normpath(str(PurePosixPath(source).parent / target)) if target else source
            yield number, raw, normalized, unquote(anchor)

def snapshot(commit):
    rows = git('ls-tree', '-r', '-z', commit).split(b'\0'); blobs = {}; allpaths = set()
    for row in rows:
        if not row: continue
        meta, rawpath = row.split(b'\t', 1); path = rawpath.decode(); allpaths.add(path)
        if path.endswith('.md') and not set(PurePosixPath(path).parts) & EXCLUDED: blobs[path] = meta.split()[2].decode()
    proc = subprocess.run(['git','-C',str(ROOT),'cat-file','--batch'],input=('\n'.join(blobs.values())+'\n').encode(),capture_output=True,check=True)
    cursor = 0; texts = {}
    for path in blobs:
        end = proc.stdout.index(b'\n', cursor); size = int(proc.stdout[cursor:end].split()[2]); cursor = end+1
        texts[path] = proc.stdout[cursor:cursor+size]; cursor += size+1
    return allpaths, texts

def slug(title):
    return re.sub(r'[^\w\- ]','',title.lower()).replace(' ','-')

def existing_target(target, paths):
    return target in paths or any(p.startswith(target.rstrip('/')+'/') for p in paths)

def validate(data, strict=False):
    errors=[]; warnings=[]; historical=[]; external=[]
    if data.get('project') != 'huasheng-kaixiaozao' or data.get('schema') != 1: errors.append('wrong project/schema')
    commit=data['inventoryCommit']; git('merge-base','--is-ancestor',commit,'HEAD')
    baseline_paths, baseline=snapshot(commit)
    actual={relative(p):p for p in first_party_markdown()}
    records={}
    required=('role','status','lifecycle','owner','maintainer','appliesTo','maintenanceScope','usageLimit')
    for d in data.get('documents',[]):
        path=d.get('path','')
        if path in records: errors.append('duplicate document: '+path)
        records[path]=d
        if not safe_path(path) or path not in actual: errors.append('missing/unsafe registered path: '+path);continue
        if not (ROOT/path).resolve().is_relative_to(ROOT.resolve()):errors.append('outside checkout: '+path);continue
        if any(not isinstance(d.get(k),str) or not d[k].strip() for k in required): errors.append('missing maintenance fields: '+path)
        if d.get('status') not in {'scope-reviewed','live-register','needs-review','historical','draft'}:errors.append('invalid status: '+path)
        if d.get('role') not in {'governance','navigation','contract','plan','evidence','proposal','reference','tool-guide'}:errors.append('invalid role: '+path)
        if d.get('status') in {'scope-reviewed','live-register'} and not d.get('reviewEvidence'):errors.append('missing semantic scope review: '+path)
        if d.get('lifecycle')=='approved-scoped' and not all(d.get(k) for k in ['approvalReference','approvedBy','approvalCommit']):errors.append('missing approval: '+path)
        if path not in baseline:
            intake=d.get('intake',{})
            if any(not intake.get(k) for k in ['purpose','whySeparate','maintainer','exitWhen','appliesTo']):errors.append('new document missing intake: '+path)
    # Git verifies historical existence; old inventory has no reading/admission authority.
    for path,p in actual.items():
        if path not in records:
            if path not in baseline or p.read_bytes()!=baseline[path]:errors.append('new/changed document needs intake and scope assessment: '+path)
            else:warnings.append({'path':path,'status':'unassessed historical inventory; not admitted'})
    routes=data.get('authorities',[]); keys=set()
    for route in routes:
        key=route.get('key');path=route.get('path');d=records.get(path,{})
        if not key or key in keys:errors.append('duplicate/empty route key')
        keys.add(key)
        if d.get('status') not in {'scope-reviewed','live-register'} or not route.get('limit'):errors.append('unreviewed route: '+str(key))
        if path not in actual:continue
        ranges=document_sections(actual[path].read_text())
        if not route.get('sections') or any(s not in ranges for s in route['sections']):errors.append('missing/ambiguous section: '+str(key))
        if route.get('scope')!=d.get('scope'):errors.append('scope mismatch: '+str(key))
    for topic,selected in data.get('readingRoutes',{}).items():
        if not selected or len(selected)!=len(set(selected)) or any(k not in keys for k in selected):errors.append('invalid reading route: '+topic)
    for relation in data.get('relations',[]):
        if any(relation.get(k) not in records for k in ['from','to','basis']) or not relation.get('scope') or relation['from']==relation['to']:errors.append('invalid replacement relation')
    policy=data.get('governance',{})
    for key in ['rules','execution']:
        item=policy.get(key,{})
        if item.get('path') not in records or item.get('section') not in document_sections((ROOT/item.get('path','')).read_text()):errors.append('missing existing '+key+' owner route')
    capability_paths={'docs/knowledge-platform/document-registry.json','scripts/check-documentation-consistency.py','scripts/documentation-context.py'}
    capability_paths.update(relative(p) for p in (ROOT/'scripts/knowledge').glob('*.py'))
    for path in capability_paths:
        intake=policy.get('artifactIntake',{}).get(path,{})
        if any(not intake.get(k) for k in ['purpose','whySeparate','maintainer','exitWhen','appliesTo']):errors.append('new capability artifact missing intake: '+path)
    for key in ['rules','execution']:
        if policy.get(key,{}).get('path')!='docs/knowledge-platform/09-verification-and-rollout.md':errors.append('parallel governance/plan owner refused')
    for path,budget in policy.get('entryBudgets',{}).items():
        text=(ROOT/path).read_text()
        if len(text.splitlines())>budget['lines'] or len(text)>budget['characters']:errors.append('entry budget exceeded: '+path)
    for path,d in records.items():
        if path not in baseline or path not in actual:continue
        current=actual[path].read_bytes();old=baseline[path];delta=len(current.decode())-len(old.decode())
        if delta>0:
            review=next((r for r in policy.get('growthReviews',[]) if r.get('path')==path and r.get('baselineSHA256')==digest(old) and r.get('currentSHA256')==digest(current) and r.get('reason') and r.get('reviewer')),None)
            if review is None:errors.append('document growth requires scoped review: '+path)
    old_edges=collections.Counter();old_external=collections.Counter()
    for path,raw in baseline.items():
        for _,link,target,anchor in links(raw.decode(),path):
            if target is None:old_external[(path,link)]+=1;continue
            missing=not existing_target(target,baseline_paths)
            if not missing and anchor and target in baseline:
                missing=anchor not in {slug(s) for s in document_sections(baseline[target].decode()) if not s.startswith('$')}
            if missing:old_edges[(path,link)]+=1
    used=collections.Counter();used_external=collections.Counter()
    for path,p in actual.items():
        for line,link,target,anchor in links(p.read_text(),path):
            if target is None:
                edge=(path,link);used_external[edge]+=1
                location=unquote(link.split('#',1)[0].split('?',1)[0]);location=re.sub(r':\d+$','',location)
                exists=Path(location).exists()
                external.append({'path':path,'line':line,'target':link,'exists':exists,'authority':'external dependency only; not scanned or admitted as knowledge'})
                if not exists:
                    if used_external[edge]<=old_external[edge]:historical.append({'path':path,'line':line,'target':link,'baselineCommit':commit,'baselineSHA256':digest(baseline[path]),'kind':'historical external dependency missing'})
                    else:errors.append(f'new missing external target: {path}:{line}: {link}')
                continue
            f=ROOT/target
            outside=not f.resolve().is_relative_to(ROOT.resolve())
            missing=outside or not f.exists()
            if not missing and anchor and f.suffix=='.md':
                titles=document_sections(f.read_text());missing=anchor not in {slug(s) for s in titles if not s.startswith('$')}
            if missing:
                edge=(path,link);used[edge]+=1
                if used[edge]<=old_edges[edge]:historical.append({'path':path,'line':line,'target':link,'baselineCommit':commit,'baselineSHA256':digest(baseline[path])})
                else:errors.append(f'new missing target/anchor: {path}:{line}: {link}')
    if strict and (historical or warnings):errors.append('strict requires historical link debt and inventory review to be resolved')
    return {'valid':not errors,'project':data.get('project'),'inventoryCommit':commit,'formalSourceApproved':False,'registered':len(records),'inventoryUnassessed':warnings,'knownHistoricalLinkDebt':historical,'externalDependencies':external,'errors':errors,'notApplicable':['Swift codec/currentSchemaVersion','AluminumDesigner required product documents','iPad placement protocols'],'boundaries':'candidate scope/location checks only; no product approval; unchanged inventory is not admitted knowledge'}

def main():
    p=argparse.ArgumentParser();p.add_argument('--strict',action='store_true');a=p.parse_args()
    try:result=validate(json.loads(REGISTRY_PATH.read_text()),a.strict)
    except Exception as e:result={'valid':False,'errors':[str(e)]}
    print(json.dumps(result,ensure_ascii=False,indent=2));return 0 if result['valid'] else 1
if __name__=='__main__':raise SystemExit(main())
