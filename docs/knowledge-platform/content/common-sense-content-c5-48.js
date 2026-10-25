// C5-48: Outbreak of resistance and formation of the anti-Japanese united front.
const {ref,question}=require("./learning-authoring");
const outbreak=ref("anti-japanese-liberation","anti-japanese-outbreak","cs-1-9-p21-anti-japanese-war-outbreak-list");
const front=ref("anti-japanese-liberation","anti-japanese-united-front","cs-1-9-p21-anti-japanese-united-front-list");
const gOut="anti-japanese-outbreak",gFront="anti-japanese-united-front";
const T=(id,g,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文事件、时间、性质和战线形成阶段对应。"],excludes:["正文未展开的战争争议、完整口号和伤亡细节",...excludes],refs});
const targets=[
 T("cs-target-september-18",gOut,"能识别九一八事变的时间与历史起点。","1931年9月18日九一八事变是日本武力征服中国的开端，也是中国抗日战争的起点。",[outbreak]),
 T("cs-target-december-9",gOut,"能识别一二九运动的背景、领导力量与地点。","华北事变后，1935年12月9日北平学生在中国共产党领导下开展抗日救亡运动。",[outbreak]),
 T("cs-target-july-7",gOut,"能把七七事变与全国抗战开始对应。","1937年7月7日卢沟桥事变爆发，全国抗日战争由此开始。",[outbreak]),
 T("cs-target-nanjing-massacre",gOut,"能识别南京大屠杀时间及国家公祭日。","1937年12月日军攻占南京并制造大屠杀；南京大屠杀死难者国家公祭日为12月13日。",[outbreak],["伤亡统计不进入口诀。"]),
 T("cs-target-wayaobao",gFront,"能识别瓦窑堡会议的统一战线方针。","1935年底瓦窑堡会议确定建立抗日民族统一战线的方针。",[front]),
 T("cs-target-xian-incident",gFront,"能识别西安事变和平解决的意义。","1936年12月12日西安事变和平解决，标志十年内战基本结束、抗日民族统一战线初步形成。",[front]),
 T("cs-target-luochuan",gFront,"能识别洛川会议制定的路线。","1937年8月洛川会议通过抗日救国十大纲领，制定全面抗战路线。",[front]),
 T("cs-target-united-front-formal",gFront,"能识别统一战线正式形成时间、第二次合作及部队改编。","1937年9月国共合作宣言发表及蒋介石谈话标志统一战线正式形成、第二次合作开始；红军改编为八路军，游击队改编为新四军。",[front]),
];
const addedQuestions=[
 question("september-18-core","humanities-history",gOut,"识别抗战起点","中国抗日战争的起点是？",["1931年九一八事变","1937年七七事变","1935年一二九运动"],0,"九一八事变是抗日战争起点。","七七事变对应全国抗战开始。",[outbreak]),
 question("december-9-core","humanities-history",gOut,"识别一二九运动","一二九运动信息哪项正确？",["华北事变后，1935年北平学生在中共领导下开展抗日救亡斗争","1937年上海工人发动北伐","1931年南京学生建立统一战线"],0,"一二九运动发生于1935年北平学生抗日救亡斗争。","背景、时间和主体需同时对应。",[outbreak]),
 question("july-7-core","humanities-history",gOut,"识别全面抗战开始","全国抗日战争开始的标志是？",["1937年七七事变","1931年九一八事变","1936年西安事变和平解决"],0,"七七事变标志全国抗战开始。","九一八是抗战起点，西安事变促成战线初步形成。",[outbreak]),
 question("nanjing-massacre-core","humanities-history",gOut,"识别南京大屠杀","南京大屠杀与国家公祭日对应正确的是？",["1937年12月；12月13日","1931年9月；9月18日","1937年7月；7月7日"],0,"正文把1937年12月南京大屠杀与12月13日国家公祭日相连。","不以伤亡数字作为本题考点。",[outbreak]),
 question("anti-outbreak-full","humanities-history",gOut,"综合复辨抗战爆发节点","下列哪一项完整正确？",["九一八是抗战起点；一二九为北平学生抗日救亡；七七标志全国抗战开始；南京大屠杀国家公祭日为12月13日","七七是抗战起点；九一八标志全国抗战开始；一二九发生在南京","西安事变是抗战起点；一二九由日军发动；公祭日为9月18日"],0,"该项正确区分起点、全国抗战开始和相关纪念日。","完整口号与伤亡细节留在正文。",[outbreak]),
 question("wayaobao-core","humanities-history",gFront,"识别瓦窑堡会议","确定建立抗日民族统一战线方针的是？",["瓦窑堡会议","洛川会议","遵义会议"],0,"1935年底瓦窑堡会议确定统一战线方针。","洛川会议制定全面抗战路线。",[front]),
 question("xian-incident-core","humanities-history",gFront,"识别西安事变意义","西安事变和平解决的意义是？",["十年内战基本结束，抗日民族统一战线初步形成","统一战线正式形成并立即取得抗战胜利","标志全国抗战由此开始"],0,"正文对应基本结束内战和战线初步形成。","正式形成在1937年9月。",[front]),
 question("luochuan-core","humanities-history",gFront,"识别洛川会议","洛川会议制定了什么路线？",["全面抗战路线","土地革命和武装反抗总方针","联俄联共扶助农工政策"],0,"1937年8月洛川会议制定全面抗战路线。","另两项对应八七会议和国民党一大。",[front]),
 question("united-front-formal","humanities-history",gFront,"识别战线正式形成","抗日民族统一战线正式形成的线索是？",["1937年9月国共合作宣言发表及蒋介石谈话，第二次国共合作开始","1936年西安事变发生即正式形成","1935年瓦窑堡会议召开即正式形成"],0,"1937年9月的宣言与谈话标志正式形成。","西安事变是初步形成，瓦窑堡是确定方针。",[front]),
 question("anti-front-full","humanities-history",gFront,"综合复辨统一战线形成","下列哪一项完整正确？",["瓦窑堡定方针；西安和平解决使战线初步形成；洛川定全面抗战路线；1937年9月战线正式形成并开始第二次合作","瓦窑堡标志正式形成；西安制定全面路线；洛川结束十年内战","遵义定统一战线方针；七七标志战线初步形成；红军改编为新四军"],0,"该项正确串起方针、初步形成、路线与正式形成。","皖南事变另留正文。",[front]),
];
const specs=[
 ["september-18-core",["cs-target-september-18"],"war-start",{1:"七七事变是全国抗战开始。",2:"一二九是学生抗日救亡运动。"}],
 ["december-9-core",["cs-target-december-9"],"student-movement",{1:"时间地点和事件均错。",2:"年份、地点和性质均错。"}],
 ["july-7-core",["cs-target-july-7"],"nationwide-start",{1:"九一八是抗战起点。",2:"西安事变促成初步形成。"}],
 ["nanjing-massacre-core",["cs-target-nanjing-massacre"],"memorial-date",{1:"该项对应九一八。",2:"该项对应七七事变。"}],
 ["anti-outbreak-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"起点与全面抗战开始倒置。",2:"事件主体、起点和日期均错。"}],
 ["wayaobao-core",["cs-target-wayaobao"],"front-policy",{1:"洛川制定全面抗战路线。",2:"遵义会议是党史转折。"}],
 ["xian-incident-core",["cs-target-xian-incident"],"front-initial",{1:"夸大为正式形成和胜利。",2:"七七标志全国抗战开始。"}],
 ["luochuan-core",["cs-target-luochuan"],"resistance-route",{1:"该项对应八七会议。",2:"该项对应国民党一大。"}],
 ["united-front-formal",["cs-target-united-front-formal"],"front-formal",{1:"西安事变对应初步形成。",2:"瓦窑堡会议对应确定方针。"}],
 ["anti-front-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"各会议作用均错配。",2:"会议、事件和改编均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-september-18":"september-18-core","cs-target-december-9":"december-9-core","cs-target-july-7":"july-7-core","cs-target-nanjing-massacre":"nanjing-massacre-core","cs-target-wayaobao":"wayaobao-core","cs-target-xian-incident":"xian-incident-core","cs-target-luochuan":"luochuan-core","cs-target-united-front-formal":"united-front-formal"};
const phrase={"cs-target-september-18":"九一八抗战起点","cs-target-december-9":"华北危，一二九北平学生救亡","cs-target-july-7":"七七卢沟全面抗战","cs-target-nanjing-massacre":"南京十二月，公祭十三日","cs-target-wayaobao":"瓦窑堡定战线方针","cs-target-xian-incident":"双十二和平，内战止战线初","cs-target-luochuan":"洛川全面抗战线","cs-target-united-front-formal":"九月宣言谈话，战线正式二次合作"};
const refs=Object.fromEntries(targets.map(x=>[x.id,x.groupId===gOut?outbreak:front]));
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用起点、运动、路线和战线阶段串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整口号、伤亡细节和战争争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("anti-outbreak-memory","抗战爆发四节点",gOut,targets.slice(0,4),"anti-outbreak-full"),memory("anti-front-memory","统一战线形成",gFront,targets.slice(4),"anti-front-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gOut?"anti-outbreak-full":"anti-front-full"]}));
const groups=[{id:gOut,title:"抗战起点与全国抗战",scope:"humanities-history",reason:"区分抗战起点、学生救亡、全国抗战开始和南京公祭日。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gFront,title:"抗日民族统一战线形成",scope:"humanities-history",reason:"按方针、初步形成、全面路线和正式形成构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-anti-japanese-war",pointId:"anti-japanese-liberation",tabIds:["anti-japanese-outbreak","anti-japanese-united-front"],status:"已建设",batch:"C5-48",scope:"抗战爆发与统一战线形成；全民族抗战战役和胜利另批"},{candidateId:"history-nationwide-resistance",pointId:"anti-japanese-liberation",tabIds:["nationwide-resistance"],status:"可建设",batch:"C5-48",scope:"全民族抗战战役、胜利、延安整风和中共七大，可拆成两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=54;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-48",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"eb0987bd",toPackVersion:"2026-10-21.52",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-48 新增抗战爆发与统一战线形成两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
