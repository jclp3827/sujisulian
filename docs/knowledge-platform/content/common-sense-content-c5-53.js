// C5-53: Third Plenum and Hong Kong/Macao return.
const {ref,question}=require("./learning-authoring");
const plenum=ref("reform-opening-period","eleventh-central-third-plenum","cs-1-9-p24-eleventh-central-third-plenum-list"),returns=ref("reform-opening-period","hong-kong-macau-return","cs-1-9-p24-hong-kong-macau-return-list");
const gPlenum="reform-opening-third-plenum",gReturns="hong-kong-macao-return";
const T=(id,g,statement,conclusion,refs)=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文日期、地点、决策与回归对象对应。"],excludes:["会议完整议程、改革开放具体政策和港澳回归谈判过程"],refs});
const targets=[
 T("cs-target-third-plenum-time",gPlenum,"能识别十一届三中全会的时间地点。","1978年12月，十一届三中全会在北京举行。",[plenum]),
 T("cs-target-third-plenum-decision",gPlenum,"能识别十一届三中全会的核心历史决策。","会议作出把党和国家工作中心转移到经济建设上来、实行改革开放的历史性决策。",[plenum]),
 T("cs-target-hong-kong-return",gReturns,"能识别香港回归日期。","香港于1997年7月1日回归。",[returns]),
 T("cs-target-macao-return",gReturns,"能识别澳门回归日期。","澳门于1999年12月20日回归。",[returns]),
 T("cs-target-hong-kong-macao-order",gReturns,"能按时间先后区分港澳回归。","香港先于澳门回归，时间分别为1997年和1999年。",[returns]),
];
const addedQuestions=[
 question("third-plenum-time-core","humanities-history",gPlenum,"识别十一届三中全会时间地点","十一届三中全会的时间地点是？",["1978年12月，北京","1956年底，延安","1997年7月，香港"],0,"十一届三中全会于1978年12月在北京举行。","不扩展会议完整议程。",[plenum]),
 question("third-plenum-decision-core","humanities-history",gPlenum,"识别十一届三中全会决策","十一届三中全会作出的历史性决策是？",["工作中心转移到经济建设上来、实行改革开放","完成三大改造、建立社会主义制度","恢复联合国合法席位、推动中美建交"],0,"会议作出工作中心转移和改革开放的历史性决策。","另两项属于不同历史节点。",[plenum]),
 question("third-plenum-full","humanities-history",gPlenum,"综合复辨十一届三中全会","下列哪一项完整正确？",["1978年12月在北京举行，决定工作中心转向经济建设并实行改革开放","1956年在西柏坡举行，决定完成土地改革","1997年在香港举行，决定恢复联合国席位"],0,"该项正确对应会议的时间、地点和决策。","改革开放具体政策不在本组。",[plenum]),
 question("hong-kong-return-core","humanities-history",gReturns,"识别香港回归","香港回归日期是？",["1997年7月1日","1999年12月20日","1978年12月18日"],0,"香港于1997年7月1日回归。","1999年日期对应澳门。",[returns]),
 question("macao-return-core","humanities-history",gReturns,"识别澳门回归","澳门回归日期是？",["1999年12月20日","1997年7月1日","1979年1月1日"],0,"澳门于1999年12月20日回归。","1997年日期对应香港。",[returns]),
 question("hong-kong-macao-order-core","humanities-history",gReturns,"区分港澳回归顺序","港澳回归先后顺序正确的是？",["香港1997年，澳门1999年","澳门1997年，香港1999年","香港和澳门均在1978年"],0,"香港先于澳门回归。","记忆时把对象和年份成对保留。",[returns]),
 question("hong-kong-macao-full","humanities-history",gReturns,"综合复辨港澳回归","下列哪一项完整正确？",["香港1997年7月1日回归；澳门1999年12月20日回归","香港1999年12月20日回归；澳门1997年7月1日回归","港澳均在1979年中美建交时回归"],0,"该项正确对应两地日期与先后顺序。","谈判与制度安排不在本组。",[returns]),
];
const specs=[
 ["third-plenum-time-core",["cs-target-third-plenum-time"],"plenum-time",{1:"时间地点均错。",2:"该项混入香港回归。"}],
 ["third-plenum-decision-core",["cs-target-third-plenum-decision"],"plenum-decision",{1:"该项对应三大改造。",2:"该项对应外交节点。"}],
 ["third-plenum-full",targets.slice(0,2).map(x=>x.id),"full-recheck",{1:"年份、地点和决策均错。",2:"会议与决策均错。"}],
 ["hong-kong-return-core",["cs-target-hong-kong-return"],"hong-kong-date",{1:"该日期对应澳门。",2:"该项不是回归日期。"}],
 ["macao-return-core",["cs-target-macao-return"],"macao-date",{1:"该日期对应香港。",2:"该项对应中美建交年份。"}],
 ["hong-kong-macao-order-core",["cs-target-hong-kong-macao-order"],"return-order",{1:"港澳年份对调。",2:"年份均错。"}],
 ["hong-kong-macao-full",targets.slice(2).map(x=>x.id),"full-recheck",{1:"港澳日期对调。",2:"事件和年份均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-third-plenum-time":"third-plenum-time-core","cs-target-third-plenum-decision":"third-plenum-decision-core","cs-target-hong-kong-return":"hong-kong-return-core","cs-target-macao-return":"macao-return-core","cs-target-hong-kong-macao-order":"hong-kong-macao-order-core"};
const phrase={"cs-target-third-plenum-time":"七八十二月北京会","cs-target-third-plenum-decision":"中心转经济，决策改革开","cs-target-hong-kong-return":"九七七一香港归","cs-target-macao-return":"九九十二二十澳门归","cs-target-hong-kong-macao-order":"九七香港先，九九澳门后"};
const refs={"cs-target-third-plenum-time":plenum,"cs-target-third-plenum-decision":plenum,"cs-target-hong-kong-return":returns,"cs-target-macao-return":returns,"cs-target-hong-kong-macao-order":returns};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用日期、地点和事件结果成对记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["会议议程、政策过程和回归谈判"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("third-plenum-memory","十一届三中全会",gPlenum,targets.slice(0,2),"third-plenum-full"),memory("hong-kong-macao-memory","港澳回归",gReturns,targets.slice(2),"hong-kong-macao-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gPlenum?"third-plenum-full":"hong-kong-macao-full"]}));
const groups=[{id:gPlenum,title:"十一届三中全会",scope:"humanities-history",reason:"来源只含时间地点与两项核心决策，采用三题短组避免重复改写。",questionIds:addedQuestions.slice(0,3).map(q=>q.id)},{id:gReturns,title:"香港与澳门回归",scope:"humanities-history",reason:"按两地日期和先后顺序构成四题短组。",questionIds:addedQuestions.slice(3).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-reform-opening-period",pointId:"reform-opening-period",tabIds:["eleventh-central-third-plenum","hong-kong-macau-return"],status:"已建设",batch:"C5-53",scope:"十一届三中全会时间地点与决策、港澳回归日期顺序；按来源容量使用三题和四题短组"},{candidateId:"humanities-book-records",pointId:"book-records",status:"可建设",batch:"C5-53",scope:"书籍之最表格，下一批先拆分有限集合并核对适合的记忆形式"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=59;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-53",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"900f85a9",toPackVersion:"2026-10-21.57",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-53 新增十一届三中全会与港澳回归两个有限历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
