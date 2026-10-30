#!/usr/bin/env python3
"""Evaluate observed sessions without forcing L0 or valid reuse to search."""
import argparse,json,pathlib,subprocess,sys

def check(record):
    errors=[];trace=pathlib.Path(record['trace_path'])
    events=[json.loads(x) for x in trace.read_text().splitlines()] if trace.exists() else []
    events=events[record.get('trace_start',0):record.get('trace_end',len(events))]
    queries=[e for e in events if e['tool']=='search.py']
    mode=record['mode'];environment=list(record.get('environment_failures',[]))
    if not record.get('completed'):environment.append('incomplete session')
    if mode in {'l0','reuse'} and queries:errors.append('unnecessary knowledge retrieval')
    if mode=='retrieve' and not queries:errors.append('required retrieval omitted')
    if mode=='reuse' and not any(e['tool'] in {'verify-citation.py','check-answer.py'} for e in events):errors.append('evidence reused without revalidation')
    evidence_valid=None;renderer_equal=None
    if record.get('answer_path'):
        project=pathlib.Path(record['project'])
        r=subprocess.run([sys.executable,str(project/'scripts/knowledge/check-answer.py'),record['answer_path'],record['evidence_path']],cwd=project,capture_output=True,text=True)
        try:
            rendered=json.loads(r.stdout)
            source_claims=bool(rendered.get('claims'))
            evidence_valid=rendered.get('valid',False) if source_claims else None
            final=json.loads(pathlib.Path(record['rendered_path']).read_text());renderer_equal=rendered==final
            if source_claims and not evidence_valid:errors.append('independent evidence checker rejected answer')
            if not source_claims and not record.get('refused'):errors.append('empty answer without explicit refusal')
            if not renderer_equal:errors.append('final differs from verified renderer')
        except Exception as ex:errors.append('invalid final rendering: '+str(ex))
    if mode=='invalid' and not record.get('refused'):errors.append('invalid environment/version was not refused')
    return {'completed':bool(record.get('completed')),'mode':mode,'retrieval_calls':len(queries),'necessary_retrieval_met':bool(queries) if mode=='retrieve' else None,'unnecessary_retrieval_calls':len(queries) if mode in {'l0','reuse'} else 0,'reuse_revalidated':not errors if mode=='reuse' else None,'evidence_valid':evidence_valid,'final_renderer_equal':renderer_equal,'semantic_support':'requires independent raw-source review','environment_failures':environment,'errors':errors,'passed':not errors and not environment}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('record');a=p.parse_args()
    result=check(json.load(open(a.record)));print(json.dumps(result,ensure_ascii=False,indent=2));raise SystemExit(not result['passed'])
