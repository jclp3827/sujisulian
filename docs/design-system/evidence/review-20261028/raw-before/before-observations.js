const fs=require('node:fs');
const root='/private/tmp/miniprogram-design-system-ds2-20261028';const reg=JSON.parse(fs.readFileSync(root+'/docs/design-system/registry.json','utf8'));const {validate}=require(root+'/scripts/validate-design-system');
const actions=reg.entries.find(e=>e.id==='PAT-ACTIONS');const outside=actions.consumers.filter(c=>!actions.applicablePages.includes(c.page)).map(c=>c.page);
const fake=JSON.parse(JSON.stringify(reg));fake.sourceBaseline='f'.repeat(40);
console.log(JSON.stringify({immutableOriginal:'b32587f434d8fff93031ae731944c61b53039085',photoOutsideApplicable:outside,oldValidatorAcceptedExistingScopeOmission:validate(root).ok,oldValidatorAcceptedUnresolvableSourceBaseline:validate(root,{registry:fake}).ok,notes:'Read-only original validator, in-memory temporary data; no worktree mutation'},null,2));
