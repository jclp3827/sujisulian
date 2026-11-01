#!/usr/bin/env python3
# coding: utf-8
from pathlib import Path
import subprocess,json,hashlib
root=Path.cwd();base='90b56f784c865c3d24b1a05c17ce7edf71d28897';candidate='771fb922f3c0b12ad2bc55b3c2c8ed9de08cc69f';target='refs/heads/codex/design-system-common-baseline-ds2.3';ref='refs/codex/design-system/adoptions/ds2.3-common-20261028'
def git(*a):return subprocess.check_output(['git','--no-optional-locks',*a])
def ancestor(a,b):return subprocess.run(['git','--no-optional-locks','merge-base','--is-ancestor',a,b],capture_output=True).returncode==0
reg=json.loads((root/'docs/design-system/registry.json').read_text());policy=json.loads((root/'docs/design-system/activation-policy.json').read_text());receipt=json.loads(git('show',ref+':docs/design-system/adoption-approval.json'));adopted=receipt['adoptedCommit'];sha=git('rev-parse','HEAD').decode().strip();authority=git('rev-parse',ref).decode().strip()
assert reg['designSystemVersion']==receipt['version']=='1.0.0-ds2.3';assert reg['activation']['state']=='adopted-common-baseline';assert receipt['status']=='approved';assert reg['activation']['adoptionRef']==ref
assert policy['formalAdoptionGate']['targetRef']==receipt['targetRef']==target
assert receipt['authorizationId']==policy['formalAdoptionAuthorization']['id']==reg['activation']['authorizationId']
assert ancestor(candidate,adopted) and ancestor(adopted,target) and ancestor(adopted,'HEAD') and ancestor(adopted,authority)
assert git('rev-parse','main').decode().strip()==base;assert not ancestor(adopted,'main')
scopes=['miniprogram','cloudfunctions','assets-source'];assert not git('diff','--name-only',base,'--',*scopes).strip();assert not git('ls-files','--others','--exclude-standard','--',*scopes).strip()
original=json.loads(git('show',candidate+':docs/design-system/registry.json'));current=dict(reg);current.pop('activation');original.pop('activation');assert current==original
assert git('show',candidate+':docs/design-system/contracts.md')==(root/'docs/design-system/contracts.md').read_bytes()
history=git('ls-tree','-r','--name-only',candidate,'--','docs/design-system/evidence').decode().splitlines()
for path in history:assert git('show',candidate+':'+path)==(root/path).read_bytes(),path
report={'ok':True,'version':reg['designSystemVersion'],'state':reg['activation']['state'],'head':sha,'adoptedCommit':adopted,'authorityCommit':authority,'authorityRef':ref,'targetRef':target,'targetContainsAdoption':True,'currentContainsAdoption':True,'approvedCandidateIsAncestor':True,'main':base,'mainContainsAdoption':False,'productDelta':[],'registryExceptActivationUnchanged':True,'contractsUnchanged':True,'historicalEvidenceFilesPreserved':len(history),'limits':'Governance/source/ancestry checks only; no product UI, device or release acceptance.'}
print(json.dumps(report,ensure_ascii=False,indent=2))
