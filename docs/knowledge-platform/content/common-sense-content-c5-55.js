// C5-55: Five rites and six marriage rites.
const {ref,question}=require("./learning-authoring");
const five=ref("ritual-system","five-rites","cs-10-15-p13-five-rites-list"),auspicious=ref("ritual-system","auspicious-rite","cs-10-15-p13-auspicious-rite-list"),festive=ref("ritual-system","festive-rite","cs-10-15-p13-festive-rite-list"),marriage=ref("ritual-system","six-marriage-rites","cs-10-15-p13-six-marriage-rites-list");
const gFive="ritual-five-rites",gMarriage="ritual-six-marriage-rites";
const T=(id,g,statement,conclusion,refs)=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文礼名、适用事项和先后步骤对应。"],excludes:["礼仪历史演变、地区差异和正文未列的仪节"],refs});
const targets=[
 T("cs-target-five-rites-jia-ji",gFive,"能区分吉礼与嘉礼。","祭祀之事为吉礼；冠婚之事为嘉礼。",[five,auspicious,festive]),
 T("cs-target-five-rites-bin-jun",gFive,"能区分宾礼与军礼。","宾客之事为宾礼；军旅之事为军礼。",[five]),
 T("cs-target-five-rites-xiong",gFive,"能识别凶礼对应事项。","丧葬之事为凶礼。",[five]),
 T("cs-target-jia-ji-detail",gFive,"能识别吉礼与嘉礼的正文补充边界。","吉礼主要祭祀天神、地祇、人鬼；嘉礼用于和合人际，冠礼、笄礼、婚礼等属于嘉礼。",[auspicious,festive]),
 T("cs-target-marriage-nacai-wenming",gMarriage,"能识别纳采与问名。","纳采是媒人提亲；问名是问女方出生年月和姓名。",[marriage]),
 T("cs-target-marriage-naji-nazheng",gMarriage,"能识别纳吉与纳征。","纳吉指占卜；纳征指送聘礼。",[marriage]),
 T("cs-target-marriage-qingqi-qinying",gMarriage,"能识别请期与亲迎。","请期是男方择定婚期；亲迎是迎娶。",[marriage]),
 T("cs-target-marriage-order",gMarriage,"能识别婚礼六礼的完整顺序。","六礼顺序为纳采、问名、纳吉、纳征、请期、亲迎。",[marriage]),
];
const addedQuestions=[
 question("five-rites-jia-ji-core","humanities-history",gFive,"区分吉礼嘉礼","五礼对应正确的是？",["祭祀—吉礼，冠婚—嘉礼","祭祀—嘉礼，冠婚—军礼","祭祀—凶礼，冠婚—宾礼"],0,"祭祀属吉礼，冠婚属嘉礼。","吉礼、嘉礼的补充范围见原文。",[five,auspicious,festive]),
 question("five-rites-bin-jun-core","humanities-history",gFive,"区分宾礼军礼","宾客之事与军旅之事分别属于？",["宾礼、军礼","嘉礼、吉礼","凶礼、宾礼"],0,"宾客属宾礼，军旅属军礼。","按事项和礼名成对记忆。",[five]),
 question("five-rites-xiong-core","humanities-history",gFive,"识别凶礼","丧葬之事属于？",["凶礼","吉礼","嘉礼"],0,"丧葬之事为凶礼。","本题不展开丧礼等级称谓。",[five]),
 question("jia-ji-detail-core","humanities-history",gFive,"辨析吉礼嘉礼范围","下列哪项属于嘉礼而不是吉礼？",["笄礼","祭祀天神","祭祀地祇"],0,"笄礼属于用于和合人际的嘉礼；祭祀属于吉礼。","本题只按正文分类。",[auspicious,festive]),
 question("five-rites-full","humanities-history",gFive,"综合复辨五礼","下列哪一项完整正确？",["祭祀吉、冠婚嘉、宾客宾、军旅军、丧葬凶","祭祀嘉、冠婚吉、宾客军、军旅宾、丧葬凶","祭祀凶、冠婚宾、宾客嘉、军旅吉、丧葬军"],0,"该项正确对应五类事项。","礼仪演变和地区差异不在本组。",[five,auspicious,festive]),
 question("marriage-nacai-wenming-core","humanities-history",gMarriage,"识别纳采问名","纳采、问名分别是？",["媒人提亲；问女方出生年月和姓名","占卜；送聘礼","择定婚期；迎娶"],0,"纳采为提亲，问名为问出生年月和姓名。","另两项对应后续步骤。",[marriage]),
 question("marriage-naji-nazheng-core","humanities-history",gMarriage,"识别纳吉纳征","纳吉、纳征分别是？",["占卜；送聘礼","提亲；问名","择期；迎娶"],0,"纳吉为占卜，纳征为送聘礼。","不要仅凭现代字面理解。",[marriage]),
 question("marriage-qingqi-qinying-core","humanities-history",gMarriage,"识别请期亲迎","请期、亲迎分别是？",["男方择定婚期；迎娶","送聘礼；占卜","问名；提亲"],0,"请期是择定婚期，亲迎是迎娶。","两项位于六礼末段。",[marriage]),
 question("marriage-order-core","humanities-history",gMarriage,"识别六礼顺序","婚礼六礼顺序正确的是？",["纳采、问名、纳吉、纳征、请期、亲迎","问名、纳采、纳征、纳吉、亲迎、请期","纳吉、纳征、纳采、问名、请期、亲迎"],0,"正文顺序为纳采、问名、纳吉、纳征、请期、亲迎。","顺序题不扩展具体仪式。",[marriage]),
 question("marriage-six-full","humanities-history",gMarriage,"综合复辨婚礼六礼","下列哪一项完整正确？",["纳采提亲、问名问生辰姓名、纳吉占卜、纳征送聘、请期择日、亲迎迎娶","纳采占卜、问名送聘、纳吉提亲、纳征问名","请期提亲、亲迎占卜，二者位于六礼开头"],0,"该项正确对应六礼含义和顺序。","地区习俗差异不在本组。",[marriage]),
];
const specs=[
 ["five-rites-jia-ji-core",["cs-target-five-rites-jia-ji"],"jia-ji",{1:"吉嘉和军礼错配。",2:"三项均错配。"}],
 ["five-rites-bin-jun-core",["cs-target-five-rites-bin-jun"],"bin-jun",{1:"宾客军旅不属于嘉吉。",2:"两项均错配。"}],
 ["five-rites-xiong-core",["cs-target-five-rites-xiong"],"xiong",{1:"吉礼对应祭祀。",2:"嘉礼对应冠婚等。"}],
 ["jia-ji-detail-core",["cs-target-jia-ji-detail"],"jia-ji-detail",{1:"祭祀天神属吉礼。",2:"祭祀地祇属吉礼。"}],
 ["five-rites-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"四类礼名错配。",2:"五类礼名均错配。"}],
 ["marriage-nacai-wenming-core",["cs-target-marriage-nacai-wenming"],"nacai-wenming",{1:"该项对应纳吉纳征。",2:"该项对应请期亲迎。"}],
 ["marriage-naji-nazheng-core",["cs-target-marriage-naji-nazheng"],"naji-nazheng",{1:"该项对应纳采问名。",2:"该项对应请期亲迎。"}],
 ["marriage-qingqi-qinying-core",["cs-target-marriage-qingqi-qinying"],"qingqi-qinying",{1:"该项对应纳征纳吉。",2:"该项对应问名纳采。"}],
 ["marriage-order-core",["cs-target-marriage-order"],"marriage-order",{1:"多个步骤前后颠倒。",2:"开头四步顺序颠倒。"}],
 ["marriage-six-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"前四步含义错配。",2:"末两步含义和位置均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-five-rites-jia-ji":"five-rites-jia-ji-core","cs-target-five-rites-bin-jun":"five-rites-bin-jun-core","cs-target-five-rites-xiong":"five-rites-xiong-core","cs-target-jia-ji-detail":"jia-ji-detail-core","cs-target-marriage-nacai-wenming":"marriage-nacai-wenming-core","cs-target-marriage-naji-nazheng":"marriage-naji-nazheng-core","cs-target-marriage-qingqi-qinying":"marriage-qingqi-qinying-core","cs-target-marriage-order":"marriage-order-core"};
const phrase={"cs-target-five-rites-jia-ji":"祭祀吉，冠婚嘉","cs-target-five-rites-bin-jun":"宾客宾，军旅军","cs-target-five-rites-xiong":"丧葬凶","cs-target-jia-ji-detail":"吉祭天地鬼，嘉合冠笄婚","cs-target-marriage-nacai-wenming":"采提亲，名生姓","cs-target-marriage-naji-nazheng":"吉占卜，征聘礼","cs-target-marriage-qingqi-qinying":"期择日，迎迎娶","cs-target-marriage-order":"采名吉征期迎"};
const refFor=id=>id.startsWith("cs-target-marriage")?marriage:(id==="cs-target-five-rites-jia-ji"||id==="cs-target-jia-ji-detail"?festive:five);
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"按礼名与事项、步骤与含义成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文分类与顺序记忆，口诀只作检索线索。"],excludes:["礼仪演变、地区差异和未列仪节"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refFor(x.id)],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("five-rites-memory","五礼辨析",gFive,targets.slice(0,4),"five-rites-full"),memory("six-marriage-rites-memory","婚礼六礼",gMarriage,targets.slice(4),"marriage-six-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gFive?"five-rites-full":"marriage-six-full"]}));
const groups=[{id:gFive,title:"五礼辨析",scope:"humanities-history",reason:"按祭祀、冠婚、宾客、军旅和丧葬对应五礼。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gMarriage,title:"婚礼六礼",scope:"humanities-history",reason:"按六个步骤的顺序和含义构成完整记忆链。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"humanities-ritual-five-marriage",pointId:"ritual-system",tabIds:["five-rites","auspicious-rite","festive-rite","six-marriage-rites"],status:"已建设",batch:"C5-55",scope:"五礼分类、吉嘉礼边界与婚礼六礼；排除礼仪演变和地区差异"},{candidateId:"humanities-ritual-sacrifice-funeral",pointId:"ritual-system",tabIds:["grand-lesser-sacrifice","funeral-rite"],status:"可建设",batch:"C5-55",scope:"太牢少牢与丧礼等级称谓，下一批两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=61;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-55",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"9fc411f5",toPackVersion:"2026-10-21.59",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-55 新增五礼辨析与婚礼六礼两个礼仪主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
