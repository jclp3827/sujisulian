"""Project-specific fail-closed Git source adapter; no source is installed by migration."""
import hashlib, json, os, pathlib, re, subprocess, tempfile, sys, time
BASE=pathlib.Path(__file__).resolve().parent
PROJECT=BASE.parent.parent
REGISTRY='docs/knowledge-platform/document-registry.json'
PROJECT_ID='huasheng-kaixiaozao'
def git(*args,cwd=PROJECT):
    return subprocess.check_output(['git','-C',str(cwd),*args],stderr=subprocess.PIPE,env=dict(os.environ,GIT_OPTIONAL_LOCKS='0'))
def sha(raw):return hashlib.sha256(raw).hexdigest()
def common(cwd):return pathlib.Path(git('rev-parse','--path-format=absolute','--git-common-dir',cwd=cwd).decode().strip()).resolve()
def load_config():
    trace=os.environ.get('HS_KNOWLEDGE_TRACE')
    if trace:
        destination=pathlib.Path(trace).resolve()
        if destination.is_relative_to(PROJECT):raise ValueError('trace must be outside project')
        with destination.open('a') as log:log.write(json.dumps({'tool':pathlib.Path(sys.argv[0]).name,'argv':sys.argv[1:],'time':time.time()},ensure_ascii=False)+'\n')
    file=BASE/'source.json'
    if not file.is_file():raise ValueError('No approved source binding. Migration candidate is not a formal knowledge base; only isolated fixture tests may install a technical source.')
    config=json.loads(file.read_text());commit=config.get('source_commit','')
    if config.get('project')!=PROJECT_ID or config.get('schema')!=1 or not re.fullmatch('[0-9a-f]{40}',commit):raise ValueError('invalid project/source binding')
    if common(pathlib.Path.cwd())!=common(PROJECT):raise ValueError('cross-project invocation refused')
    caller=pathlib.Path(git('rev-parse','--show-toplevel',cwd=pathlib.Path.cwd()).decode().strip()).resolve()
    if caller!=PROJECT:raise ValueError('cross-worktree capability not integrated; invoke only the reviewed tool checkout')
    root_commits=git('rev-list','--max-parents=0',commit).decode().splitlines()
    if config.get('repository_anchor') not in root_commits:raise ValueError('repository identity mismatch')
    subprocess.run(['git','-C',str(PROJECT),'merge-base','--is-ancestor',commit,'HEAD'],check=True,capture_output=True)
    if config.get('source_kind') not in {'technical-fixture','approved-project-source'}:raise ValueError('unrecognized source kind')
    manifest=config['manifest'];raw=json.dumps(manifest,ensure_ascii=False,sort_keys=True,indent=2).encode()
    if sha(raw)!=config['manifest_sha256'] or manifest.get('commit')!=commit:raise ValueError('binding manifest mismatch')
    if manifest['files'].get(REGISTRY)!=config['registry_sha256']:raise ValueError('registry binding mismatch')
    required={REGISTRY,'scripts/check-documentation-consistency.py','scripts/knowledge/binding.py','scripts/knowledge/evidence.py','scripts/knowledge/check-answer.py','scripts/knowledge/verify-citation.py','scripts/knowledge/search.py','scripts/knowledge/literal-search.py'}
    if not required.issubset(manifest['files']):raise ValueError('incomplete source/tool manifest')
    overlays=config.get('compatible_overlays',{})
    for path,expected in manifest['files'].items():
        relative=pathlib.PurePosixPath(path)
        if relative.is_absolute() or '..' in relative.parts or str(relative)!=path:raise ValueError('unsafe source path')
        if sha(git('show',commit+':'+path))!=expected:raise ValueError('fixed Git content mismatch: '+path)
        live=PROJECT/path
        if not live.is_file() or not live.resolve().is_relative_to(PROJECT):raise ValueError('missing/escaping source: '+path)
        permitted={expected}
        if path in overlays:
            item=overlays[path]
            if path not in {REGISTRY,'AGENTS.md'} or not isinstance(item,dict) or not item.get('reviewReference') or not re.fullmatch('[0-9a-f]{64}',item.get('sha256','')):raise ValueError('unreviewed overlay')
            permitted.add(item['sha256'])
        if sha(live.read_bytes()) not in permitted:raise ValueError('source/tool changed; explicitly review and rebind: '+path)
    reg=json.loads(git('show',commit+':'+REGISTRY))
    import runpy
    checker=runpy.run_path(str(PROJECT/'scripts/check-documentation-consistency.py'))
    result=checker['validate'](reg)
    if result['errors']:raise ValueError('source governance rejected: '+str(result['errors'][:5]))
    if config['source_kind']=='approved-project-source':
        approval=config.get('approval',{})
        if approval.get('registry_sha256')!=config['registry_sha256'] or approval.get('source_commit')!=commit or not approval.get('reviewReference') or not approval.get('approvedBy'):raise ValueError('formal source lacks exact approval')
        if not reg.get('formalBindingApproval'):raise ValueError('registry has no approved formal binding scope')
    return config,raw

CONFIG,RAW_MANIFEST=load_config()
COMMIT=CONFIG['source_commit'];REGSHA=CONFIG['registry_sha256'];MANIFEST_SHA=CONFIG['manifest_sha256'];MANIFEST=CONFIG['manifest'];V1=BASE
ROOT=pathlib.Path(tempfile.gettempdir())/'HuashengKnowledge'/sha(str(common(PROJECT)).encode())/COMMIT/'snapshot'
def rebuild():
    blobs={}
    for path,expected in MANIFEST['files'].items():
        raw=git('show',COMMIT+':'+path)
        if sha(raw)!=expected:raise ValueError('source mismatch during rebuild')
        blobs[path]=raw
    for path,raw in blobs.items():
        target=ROOT/path;target.parent.mkdir(parents=True,exist_ok=True)
        if target.is_symlink() or not target.resolve().is_relative_to(ROOT.resolve()):raise ValueError('unsafe cache path')
        target.write_bytes(raw)
    (ROOT.parent/'snapshot-manifest.json').write_bytes(RAW_MANIFEST)
if os.environ.get('HS_REBUILD_ONLY')!='1':
    if not ROOT.exists():rebuild()
    if (ROOT.parent/'snapshot-manifest.json').read_bytes()!=RAW_MANIFEST:raise ValueError('cache manifest changed; explicitly rebuild')
    for path,expected in MANIFEST['files'].items():
        file=ROOT/path
        if not file.is_file() or file.is_symlink() or sha(file.read_bytes())!=expected:raise ValueError('cache corruption; explicitly rebuild: '+path)
    if (BASE/'snapshot-manifest.json').read_bytes()!=RAW_MANIFEST:raise ValueError('packaged manifest mismatch')
