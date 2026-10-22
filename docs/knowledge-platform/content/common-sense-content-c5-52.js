// C5-52: First Five-Year Plan, 1954 Constitution and socialist transformation.
const {ref,question}=require("./learning-authoring");
const R=(tab,unit)=>ref("new-china-reform",tab,unit);
const plan=R("first-five-year-plan","cs-1-9-p24-first-five-year-plan-list"),constitution=R("constitution-1954","cs-1-9-p24-constitution-1954-list"),transformation=R("socialist-transformation","cs-1-9-p24-socialist-transformation-list");
const gPlan="new-china-industrialization-plan",gSystem="new-china-constitution-transformation";
const T=(id,g,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文年份、名称、制度性质和改造对象对应。"],excludes:["正文未列的一五计划项目、宪法条文和改造过程",...excludes],refs});
const targets=[
 T("cs-target-first-plan-years",gPlan,"能识别第一个五年计划的起止年份。","第一个五年计划为1953年至1957年。",[plan]),
 T("cs-target-plan-planning-name",gPlan,"能区分五年计划与五年规划的名称节点。","从十一五时期开始，五年计划改称五年规划。",[plan]),
 T("cs-target-one-industrialization",gPlan,"能识别一化三改中的一化。","一化指社会主义工业化。",[transformation]),
 T("cs-target-three-transformations",gPlan,"能识别三改的三个对象。","三改指对农业、手工业和资本主义工商业的社会主义改造。",[transformation]),
 T("cs-target-constitution-1954-date",gSystem,"能识别1954年宪法的通过时间。","《中华人民共和国宪法》于1954年9月通过。",[constitution]),
 T("cs-target-constitution-1954-status",gSystem,"能识别1954年宪法的教材定位。","1954年宪法是新中国第一部宪法，属于社会主义类型宪法。",[constitution]),
 T("cs-target-transformation-completion",gSystem,"能识别三大改造完成时间。","三大改造于1956年底完成。",[transformation]),
 T("cs-target-transformation-significance",gSystem,"能识别三大改造完成的制度意义。","三大改造完成标志着社会主义制度在我国基本上建立起来。",[transformation]),
];
const addedQuestions=[
 question("first-plan-years-core","humanities-history",gPlan,"识别一五计划年份","第一个五年计划的时间是？",["1953—1957年","1949—1953年","1956—1960年"],0,"第一个五年计划从1953年到1957年。","本题不考正文未列出的项目名单。",[plan]),
 question("plan-planning-name-core","humanities-history",gPlan,"区分计划与规划名称","从哪个时期开始，“五年计划”改称“五年规划”？",["十一五时期","一五时期","十四五时期"],0,"正文明确从十一五时期开始改称五年规划。","名称变更不等于五年安排从此才出现。",[plan]),
 question("one-industrialization-core","humanities-history",gPlan,"识别一化","“一化三改”中的“一化”是？",["社会主义工业化","农业机械化","国防现代化"],0,"一化指社会主义工业化。","不要用其他现代化表述替代正文概念。",[transformation]),
 question("three-transformations-core","humanities-history",gPlan,"识别三改对象","“三改”的对象是？",["农业、手工业、资本主义工商业","农业、交通业、金融业","工业、商业、国防"],0,"三改对应农业、手工业和资本主义工商业。","本题只辨对象，不展开改造形式。",[transformation]),
 question("industrialization-plan-full","humanities-history",gPlan,"综合复辨一五与一化三改","下列哪一项完整正确？",["一五计划为1953—1957年；十一五起改称五年规划；一化指工业化；三改对应农业、手工业和资本主义工商业","一五计划从1949年开始；十四五才改称规划；一化指农业机械化","一五计划到1956年结束；三改对应工业、商业和国防"],0,"该项正确串起一五计划名称和一化三改。","项目清单和改造过程不在本组。",[plan,transformation]),
 question("constitution-1954-date-core","humanities-history",gSystem,"识别1954年宪法时间","新中国第一部宪法通过于？",["1954年9月","1949年10月","1956年底"],0,"《中华人民共和国宪法》于1954年9月通过。","1949年和1956年对应其他现代史节点。",[constitution]),
 question("constitution-1954-status-core","humanities-history",gSystem,"识别1954年宪法定位","1954年宪法的教材定位是？",["新中国第一部宪法，属于社会主义类型宪法","中国历史上第一部成文宪法","仅是一份土地改革文件"],0,"正文定位为新中国第一部宪法、社会主义类型宪法。","“新中国第一部”不能扩大为中国历史第一部。",[constitution]),
 question("transformation-completion-core","humanities-history",gSystem,"识别三大改造完成时间","三大改造完成于？",["1956年底","1953年初","1978年底"],0,"三大改造于1956年底完成。","不要与一五计划起点或改革开放节点混淆。",[transformation]),
 question("transformation-significance-core","humanities-history",gSystem,"识别三大改造意义","三大改造完成标志着？",["社会主义制度在我国基本上建立起来","新民主主义革命基本胜利","改革开放正式开始"],0,"三大改造完成标志社会主义制度基本建立。","新中国成立和十一届三中全会对应另两个选项。",[transformation]),
 question("constitution-transformation-full","humanities-history",gSystem,"综合复辨宪法与改造","下列哪一项完整正确？",["1954年9月通过新中国第一部宪法；1956年底三大改造完成，社会主义制度基本建立","1949年通过1954年宪法；1953年三大改造完成，改革开放开始","1956年通过土地改革法；1978年三大改造完成，新民主主义革命胜利"],0,"该项正确对应宪法定位、改造时间和制度意义。","宪法条文和改造形式留在正文。",[constitution,transformation]),
];
const specs=[
 ["first-plan-years-core",["cs-target-first-plan-years"],"plan-years",{1:"年份早于一五计划。",2:"起止年份均错。"}],
 ["plan-planning-name-core",["cs-target-plan-planning-name"],"plan-name",{1:"一五仍称计划。",2:"名称变更早于十四五。"}],
 ["one-industrialization-core",["cs-target-one-industrialization"],"one-industrialization",{1:"正文不是农业机械化。",2:"正文不是国防现代化。"}],
 ["three-transformations-core",["cs-target-three-transformations"],"three-transformations",{1:"交通和金融不构成正文三改集合。",2:"该集合不对应三改。"}],
 ["industrialization-plan-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"年份、名称和一化均错。",2:"年份和三改对象均错。"}],
 ["constitution-1954-date-core",["cs-target-constitution-1954-date"],"constitution-date",{1:"这是新中国成立时间。",2:"这是三大改造完成节点。"}],
 ["constitution-1954-status-core",["cs-target-constitution-1954-status"],"constitution-status",{1:"正文限定新中国第一部。",2:"宪法不是土改文件。"}],
 ["transformation-completion-core",["cs-target-transformation-completion"],"transformation-completion",{1:"这是一五计划起点年份。",2:"这是改革开放节点。"}],
 ["transformation-significance-core",["cs-target-transformation-significance"],"transformation-significance",{1:"该意义对应新中国成立。",2:"该意义对应十一届三中全会。"}],
 ["constitution-transformation-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"宪法、改造和改革开放节点均错。",2:"文件、年份和意义均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-first-plan-years":"first-plan-years-core","cs-target-plan-planning-name":"plan-planning-name-core","cs-target-one-industrialization":"one-industrialization-core","cs-target-three-transformations":"three-transformations-core","cs-target-constitution-1954-date":"constitution-1954-date-core","cs-target-constitution-1954-status":"constitution-1954-status-core","cs-target-transformation-completion":"transformation-completion-core","cs-target-transformation-significance":"transformation-significance-core"};
const phrase={"cs-target-first-plan-years":"一五五三到五七","cs-target-plan-planning-name":"十一五起计划改规划","cs-target-one-industrialization":"一化是工业化","cs-target-three-transformations":"三改农、手、资本工商业","cs-target-constitution-1954-date":"五四九月宪法过","cs-target-constitution-1954-status":"新中国第一部、社会主义类型","cs-target-transformation-completion":"五六年底三改成","cs-target-transformation-significance":"制度基本建起来"};
const refs={"cs-target-first-plan-years":plan,"cs-target-plan-planning-name":plan,"cs-target-one-industrialization":transformation,"cs-target-three-transformations":transformation,"cs-target-constitution-1954-date":constitution,"cs-target-constitution-1954-status":constitution,"cs-target-transformation-completion":transformation,"cs-target-transformation-significance":transformation};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用年份、名称、对象与制度意义串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["项目名单、宪法条文和改造过程"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("industrialization-plan-memory","一五计划与一化三改",gPlan,targets.slice(0,4),"industrialization-plan-full"),memory("constitution-transformation-memory","1954宪法与三大改造",gSystem,targets.slice(4),"constitution-transformation-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gPlan?"industrialization-plan-full":"constitution-transformation-full"]}));
const groups=[{id:gPlan,title:"一五计划与一化三改",scope:"humanities-history",reason:"把工业化计划、名称变化和过渡时期总路线基本概念放在一起。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gSystem,title:"1954年宪法与三大改造",scope:"humanities-history",reason:"按宪法定位、改造完成时间和制度意义构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-new-china-industrialization-system",pointId:"new-china-reform",tabIds:["first-five-year-plan","constitution-1954","socialist-transformation"],status:"已建设",batch:"C5-52",scope:"一五计划、计划改规划、一化三改、1954年宪法和社会主义制度基本建立；排除项目与过程细节"},{candidateId:"history-reform-opening-period",pointId:"reform-opening-period",status:"可建设",batch:"C5-52",scope:"改革开放和社会主义现代化建设新时期，下一批按来源页签拆分最多两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=58;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-52",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"dab66c46",toPackVersion:"2026-10-21.56",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-52 新增一五计划、一化三改与1954年宪法、制度建立两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
