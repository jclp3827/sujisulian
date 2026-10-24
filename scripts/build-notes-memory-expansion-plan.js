// V2 work-plan builder. V1 JSON and audit evidence remain historical snapshots.
const fs=require('fs'),path=require('path');
const {createContext,buildPlan}=require('./lib/notes-memory-expansion-v2');
const {augmentPlan}=require('./lib/notes-memory-preview');
const root=path.resolve(__dirname,'..'),plan=augmentPlan(root,buildPlan(createContext(root)));
const dest=path.join(root,'docs/knowledge-platform/implementations/notes-memory-v5-expansion-plan-v2.json'),out=JSON.stringify(plan,null,2)+'\n';
if(process.argv.includes('--check-only')){if(fs.readFileSync(dest,'utf8')!==out)throw Error('V2扩充清单已过期');}else fs.writeFileSync(dest,out);
console.log(JSON.stringify({passed:true,version:plan.version,sources:plan.sourceCount,knowledgeBlocks:plan.knowledgeBlockCount,targets:plan.designLedgerStats.targets,localHolds:plan.designLedgerStats.localTargetHolds,exampleMaterials:plan.applications.exampleMaterialCount,imageMaterials:plan.applications.imageMaterialCount,currentApplications:plan.applications.currentDevelopmentQuestions,developmentCards:plan.runtimeProgress.developmentTotal,newRuntimeCards:plan.newRuntimeCards,formalApproved:plan.formalApproved,checkOnly:process.argv.includes('--check-only')}));
