#!/usr/bin/env python3
"""Target-project technical trial only. Commits are confined to a temporary test clone."""
import argparse, copy, hashlib, json, os, pathlib, shutil, subprocess, sys
PROJECT=pathlib.Path(__file__).resolve().parents[2]
def run(argv,cwd,**kw):return subprocess.run(argv,cwd=cwd,capture_output=True,text=True,env=dict(os.environ,PYTHONPYCACHEPREFIX='/private/tmp/huasheng-test-pycache',GIT_OPTIONAL_LOCKS='0'),**kw)
def git(cwd,*args):
    r=run(['git',*args],cwd);assert r.returncode==0,r.stderr;return r.stdout.strip()
def sha(raw):return hashlib.sha256(raw).hexdigest()
def prepare(base):
    fixture=base/'source-fixture';assert not fixture.exists(),'do not overwrite existing fixture'
    base.mkdir(parents=True,exist_ok=True)
    git(PROJECT,'clone','--shared','--no-checkout',str(PROJECT),str(fixture))
    git(fixture,'checkout','--detach','7053fe35b51b34ed5309fce03b4fd3da217282af')
    files=['AGENTS.md','docs/knowledge-platform/README.md','docs/knowledge-platform/09-verification-and-rollout.md','docs/knowledge-platform/document-registry.json','scripts/check-documentation-consistency.py','scripts/documentation-context.py','.agents/skills/huasheng-knowledge/SKILL.md']
    files += [str(p.relative_to(PROJECT)) for p in (PROJECT/'scripts/knowledge').glob('*.py')]
    for rel in files:
        target=fixture/rel;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(PROJECT/rel,target)
    git(fixture,'add','--',*files)
    git(fixture,'-c','user.name=Isolated technical fixture','-c','user.email=fixture@invalid.local','commit','--quiet','-m','Technical fixture only; not a project approval or integration')
    commit=git(fixture,'rev-parse','HEAD');regpath='docs/knowledge-platform/document-registry.json';reg=json.loads((fixture/regpath).read_text())
    paths={d['path'] for d in reg['documents']}|set(files)
    manifest={'commit':commit,'files':{p:sha(subprocess.check_output(['git','-C',str(fixture),'show',commit+':'+p])) for p in sorted(paths)}}
    raw=json.dumps(manifest,sort_keys=True,ensure_ascii=False,indent=2).encode()
    config={'schema':1,'project':'huasheng-kaixiaozao','source_kind':'technical-fixture','source_commit':commit,'repository_anchor':git(fixture,'rev-list','--max-parents=0',commit).splitlines()[0],'registry_sha256':manifest['files'][regpath],'manifest_sha256':sha(raw),'manifest':manifest,'originProjectCommit':'7053fe35b51b34ed5309fce03b4fd3da217282af','approval':None,'warning':'Isolated test commit. Not approved current project knowledge.'}
    tools=fixture/'scripts/knowledge';(tools/'source.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n');(tools/'snapshot-manifest.json').write_bytes(raw)
    (base/'fixture-identity.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
    return fixture
def test(base,fixture):
    tools=fixture/'scripts/knowledge';cases=[]
    def call(tool,*args,cwd=None):return run([sys.executable,str(tools/tool),*map(str,args)],cwd or fixture)
    def expect(name,r,valid):
        ok=(r.returncode==0)==valid
        cases.append({'case':name,'passed':ok,'exit':r.returncode,'stdout':r.stdout[:1800],'stderr':r.stderr[:800]});assert ok,(name,r.stdout,r.stderr)
    r=call('search.py','--read-section','docs/knowledge-platform/README.md','文档权威顺序');expect('target scoped section retrieval',r,True)
    bundle=json.loads(r.stdout);e=next(x['evidence'] for x in bundle['evidence'] if x['verified']);record=base/'record.json';record.write_text(json.dumps(e,ensure_ascii=False));evidence=base/'evidence.json';evidence.write_text(r.stdout)
    expect('valid exact evidence',call('verify-citation.py',record),True)
    for field,value in [('start',0),('end',999999),('path','../README.md'),('path','README.md'),('commit','0'*40),('quote','篡改'),('sha256','0'*64),('registry_sha256','0'*64),('section',['伪造']),('id','Eunknown'),('source_kind','approved-project-source'),('registration',{})]:
        bad=copy.deepcopy(e);bad[field]=value;record.write_text(json.dumps(bad,ensure_ascii=False));expect('reject altered '+field+' '+str(value)[:20],call('verify-citation.py',record),False)
    record.write_text(json.dumps(e,ensure_ascii=False))
    answer=base/'answer.json';answer.write_text(json.dumps({'claims':[{'text':'这是固定资料中的历史层级说明。','kind':'historical','evidence_ids':[e['id']]}]},ensure_ascii=False));expect('verified renderer',call('check-answer.py',answer,evidence),True)
    for name,body in [
        ('unknown ID',{'claims':[{'text':'text','evidence_ids':['Eunknown']}]}),
        ('missing evidence',{'claims':[{'text':'text','evidence_ids':[]}]}),
        ('manual location',{'claims':[{'text':'see [x](fake.md)','evidence_ids':[e['id']]}]}),
        ('display bypass',{'claims':[{'text':'text','evidence_ids':[e['id']]}],'display':'fabricated current rule'}),
        ('claim display bypass',{'claims':[{'text':'text','evidence_ids':[e['id']],'display':'hidden unsupported'}]}),
        ('technical fixture grants current authority',{'claims':[{'text':'现行规则','kind':'current-rule','evidence_ids':[e['id']]}]})]:
        answer.write_text(json.dumps(body,ensure_ascii=False));expect('reject '+name,call('check-answer.py',answer,evidence),False)
    expect('reject cross-project',call('verify-citation.py',record,cwd=base),False)
    other=base/'other-worktree';git(fixture,'worktree','add','--detach',str(other),'HEAD')
    expect('reject same-repository other worktree',call('verify-citation.py',record,cwd=other),False)
    git(fixture,'worktree','remove',str(other))
    target=fixture/'docs/knowledge-platform/README.md';raw=target.read_bytes();target.write_bytes(raw+b'\nchanged source\n')
    expect('reject changed source',call('verify-citation.py',record),False);target.write_bytes(raw)
    target=tools/'source.json';raw=target.read_bytes();bad=json.loads(raw);bad['project']='another-project';target.write_text(json.dumps(bad))
    expect('reject wrong project config',call('verify-citation.py',record),False);target.write_bytes(raw)
    cache=run([sys.executable,'-c','import sys;sys.path.insert(0,"scripts/knowledge");import binding;print(binding.ROOT)'],fixture);assert cache.returncode==0,cache.stderr
    cached=pathlib.Path(cache.stdout.strip())/'docs/knowledge-platform/README.md';raw=cached.read_bytes();cached.write_bytes(b'corrupt')
    expect('reject corrupt cache',call('verify-citation.py',record),False)
    expect('explicit rebuild',call('rebuild.py'),True);expect('evidence after rebuild',call('verify-citation.py',record),True)
    # Governance failures must be detected without installing new product authority.
    checker=fixture/'scripts/check-documentation-consistency.py';regfile=fixture/'docs/knowledge-platform/document-registry.json';original=regfile.read_bytes()
    for name,change in [
        ('unapproved status',lambda d:d['documents'][0].update(lifecycle='approved-scoped')),
        ('missing section',lambda d:d['authorities'][0].update(sections=['不存在的章节'])),
        ('missing intake',lambda d:d['documents'][-1].pop('intake',None)),
        ('missing growth review',lambda d:d['governance'].update(growthReviews=[]))]:
        d=json.loads(original);change(d);regfile.write_text(json.dumps(d,ensure_ascii=False));expect('governance '+name,run([sys.executable,str(checker)],fixture),False)
    regfile.write_bytes(original)
    added=fixture/'docs/new-undeclared.md';added.write_text('# 未登记\n');expect('new document admission',run([sys.executable,str(checker)],fixture),False);added.unlink()
    for name,line in [('broken link','\n[x](new-missing.md)\n'),('broken anchor','\n[x](README.md#not-real-anchor)\n')]:
        p=fixture/'docs/knowledge-platform/README.md';raw=p.read_bytes();p.write_bytes(raw+line.encode());expect(name,run([sys.executable,str(checker)],fixture),False);p.write_bytes(raw)
    expect('reject out-of-scope section read',call('search.py','--read-section','docs/knowledge-platform/00-presentation-v2-master.md','2. 产品北极星'),False)
    expect('strict debt remains visible',run([sys.executable,str(checker),'--strict'],fixture),False)
    expect('normal scoped governance',run([sys.executable,str(checker)],fixture),True)
    (base/'technical-results.json').write_text(json.dumps({'source_kind':'technical-fixture','cases':cases,'passed':sum(c['passed'] for c in cases),'total':len(cases),'formalBindingApproved':False},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'passed':len(cases),'total':len(cases),'fixture':str(fixture),'source_commit':git(fixture,'rev-parse','HEAD'),'formalBindingApproved':False}))
def main():
    p=argparse.ArgumentParser();p.add_argument('--output',required=True,type=pathlib.Path);a=p.parse_args()
    fixture=prepare(a.output);test(a.output,fixture)
if __name__=='__main__':main()
