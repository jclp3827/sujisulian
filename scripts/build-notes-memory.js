const fs=require('fs'),path=require('path');
const {resolveCard}=require('../miniprogram/subpackages/note/services/memory-content');
const {evaluateEnrollment}=require('../miniprogram/subpackages/note/services/memory-admission');
const {digest}=require('../miniprogram/subpackages/note/services/learning-semantic');
const {compatibilityOutput,loadInputs,enrollmentFor,reviewPacket,persistReviewPacket}=require('./lib/notes-memory-admission');
const root=path.resolve(__dirname,'..'),checkOnly=process.argv.includes('--check-only');
if(process.argv.slice(2).some(a=>a!=='--check-only'))throw Error('未知构建参数');
const compatibilityPath=path.join(root,'miniprogram/subpackages/note/models/memory-version-compatibility.js');
if(fs.readFileSync(compatibilityPath,'utf8')!==compatibilityOutput(root))throw Error('冻结学习版本兼容包不一致');
const inputs=loadInputs(root),samples=inputs.context.samples,ids=new Set();
for(const card of samples.cards){if(ids.has(card.id))throw Error('重复样板卡片');ids.add(card.id);if(card.subjectId==='graphic'&&card.kind!=='method')throw Error('图推必须在方法判断');resolveCard(card,inputs.context.body);}
persistReviewPacket(root,reviewPacket(inputs),true);
const enrollment=enrollmentFor(inputs),result=evaluateEnrollment(enrollment,inputs.context.body);enrollment.version=digest(enrollment);
const pack={...samples,version:samples.version+'-'+enrollment.version.slice(0,12),formalApproved:result.formal.length,enrollment};
const output='// Generated from exact source, registration, review and enablement ledgers. Not an approval action.\nmodule.exports='+JSON.stringify(pack)+';\n';
const destination=path.join(root,'miniprogram/subpackages/note/models/memory-pack.js');
if(checkOnly){if(fs.readFileSync(destination,'utf8')!==output)throw Error('记忆卡包不一致');}else fs.writeFileSync(destination,output);
console.log(JSON.stringify({passed:true,finiteSamples:samples.cards.length,registeredPreviews:result.development.length,formalApproved:result.formal.length,excluded:result.excluded,checkOnly}));
