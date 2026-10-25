// C5-47: Long March, Zunyi Meeting and selected Long March poems.
const {ref,question}=require("./learning-authoring");
const march=ref("land-revolution","red-army-long-march","cs-1-9-p20-red-army-long-march-list");
const zunyi=ref("land-revolution","zunyi-meeting","cs-1-9-p20-zunyi-meeting-list");
const poems=ref("land-revolution","long-march-poems","cs-1-9-p20-p21-long-march-poems-list");
const gMarch="long-march-process",gCulture="zunyi-long-march-poems";
const T=(id,g,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文起止时间、路线节点、会议意义及作品时间对应。"],excludes:["正文未展开的党史争议、完整战役过程和诗词全文",...excludes],refs});
const targets=[
 T("cs-target-long-march-cause-start",gMarch,"能识别长征原因、出发时间与地点。","第五次反围剿失败后被迫长征；1934年10月中央红军从江西瑞金等地出发。",[march]),
 T("cs-target-long-march-finish",gMarch,"能识别长征胜利结束的时间与标志。","1936年10月红军三大主力会师，宣告二万五千里长征胜利结束。",[march]),
 T("cs-target-long-march-route-water",gMarch,"能按正文识别四渡、巧渡、强渡与飞夺节点。","路线关键动作为四渡赤水、巧渡金沙江、强渡大渡河、飞夺泸定桥。",[march]),
 T("cs-target-long-march-route-late",gMarch,"能识别翻雪山、过草地、陕北吴起镇至会师的后段路线。","后段经过雪山草地，到达陕北吴起镇，最终在甘肃会宁、将台堡会师。",[march]),
 T("cs-target-zunyi-time-team",gCulture,"能识别遵义会议时间及三人军事领导小组。","1935年初遵义会议成立毛泽东、周恩来、王稼祥三人军事领导小组。",[zunyi]),
 T("cs-target-zunyi-significance",gCulture,"能识别遵义会议的双重历史意义。","遵义会议是党史上生死攸关的转折点，标志党从幼年走向成熟。",[zunyi]),
 T("cs-target-long-march-poem-dates",gCulture,"能识别《七律·长征》《忆秦娥·娄山关》《清平乐·六盘山》的写作时间。","《忆秦娥·娄山关》作于1935年2月；《七律·长征》《清平乐·六盘山》作于1935年10月。",[poems]),
 T("cs-target-long-march-poem-lines",gCulture,"能把正文代表句与长征诗作对应。","红军不怕远征难对应《七律·长征》；雄关漫道真如铁对应《忆秦娥·娄山关》；不到长城非好汉对应《清平乐·六盘山》。",[poems],["不要求背诵诗词全文。"]),
];
const addedQuestions=[
 question("long-march-start","humanities-history",gMarch,"识别长征起点","红军长征开始的原因与时间地点是？",["第五次反围剿失败后，1934年10月从江西瑞金等地出发","北伐失败后，1927年从武汉出发","抗战胜利后，1945年从延安出发"],0,"正文把第五次反围剿失败、1934年10月和江西出发相连。","不展开具体战斗过程。",[march]),
 question("long-march-finish","humanities-history",gMarch,"识别长征结束","长征胜利结束的标志是？",["1936年10月红军三大主力会师","1935年初遵义会议召开","1931年中央苏区建立"],0,"三大主力会师宣告长征胜利结束。","遵义会议是长征中的转折节点。",[march]),
 question("long-march-route-water","humanities-history",gMarch,"识别渡河路线","长征渡河关键节点顺序正确的是？",["四渡赤水—巧渡金沙江—强渡大渡河—飞夺泸定桥","巧渡赤水—四渡金沙江—飞夺大渡河—强渡泸定桥","强渡赤水—飞夺金沙江—四渡大渡河—巧渡泸定桥"],0,"正文路线口诀抓四、巧、强、飞夺。","动词与地点需要对应。",[march]),
 question("long-march-route-late","humanities-history",gMarch,"识别后段路线","长征后段路线信息哪项正确？",["翻雪山、过草地、到陕北吴起镇，后在会宁、将台堡会师","过草地后回到瑞金并在上海会师","翻雪山后直接在遵义结束长征"],0,"正文后段依次包含雪山草地、吴起镇及甘肃会师线索。","本题不要求完整路线复述。",[march]),
 question("long-march-process-full","humanities-history",gMarch,"综合复辨长征进程","下列哪一项完整正确？",["1934年江西出发；四渡赤水、巧渡金沙江、强渡大渡河、飞夺泸定桥；1936年三大主力会师结束","1927年武汉出发；巧渡赤水、四渡金沙；1935年遵义会议即结束","1931年瑞金出发；未经过雪山草地；1945年会师"],0,"该项正确串起原因起点、关键路线与结束标志。","完整战役过程留在正文。",[march]),
 question("zunyi-team","humanities-history",gCulture,"识别遵义领导小组","遵义会议成立的三人军事领导小组是？",["毛泽东、周恩来、王稼祥","陈独秀、李大钊、毛泽东","孙中山、黄兴、宋教仁"],0,"三人军事领导小组为毛泽东、周恩来、王稼祥。","不要与其他历史人物组合混淆。",[zunyi]),
 question("zunyi-significance","humanities-history",gCulture,"识别遵义会议意义","遵义会议的历史意义是？",["生死攸关的转折点，标志党从幼年走向成熟","标志中国共产党成立","标志第一次国共合作正式形成"],0,"正文明确双重意义。","另两项对应中共一大和国民党一大。",[zunyi]),
 question("long-march-poem-dates","humanities-history",gCulture,"识别诗作时间","长征诗作与时间对应正确的是？",["《忆秦娥·娄山关》—1935年2月；《七律·长征》—1935年10月","《七律·长征》—1927年8月；《清平乐·六盘山》—1931年","《忆秦娥·娄山关》—1936年10月；《七律·长征》—1921年"],0,"正文给出娄山关二月、七律长征十月。","时间仅按正文识别。",[poems]),
 question("long-march-poem-lines","humanities-history",gCulture,"匹配代表诗句","代表句与作品对应正确的是？",["“雄关漫道真如铁”——《忆秦娥·娄山关》","“不到长城非好汉”——《七律·长征》","“红军不怕远征难”——《清平乐·六盘山》"],0,"雄关漫道真如铁出自《忆秦娥·娄山关》。","另两项作品错配。",[poems]),
 question("zunyi-poems-full","humanities-history",gCulture,"综合复辨遵义与诗作","下列哪一项完整正确？",["1935年初遵义会议成立毛周王三人小组并成为生死转折；《忆秦娥·娄山关》作于1935年2月，“不到长城非好汉”出自《清平乐·六盘山》","遵义会议标志建党；娄山关作于1921年；不到长城非好汉出自《七律·长征》","遵义会议标志第一次合作；三人小组含陈独秀；红军不怕远征难出自《十六字令》"],0,"该项正确串起会议人物意义、作品时间和代表句。","不要求背诵全文。",[zunyi,poems]),
];
const specs=[
 ["long-march-start",["cs-target-long-march-cause-start"],"cause-start",{1:"原因、年份和地点均错。",2:"历史阶段均错。"}],
 ["long-march-finish",["cs-target-long-march-finish"],"finish-marker",{1:"遵义会议不是结束标志。",2:"中央苏区建立早于长征。"}],
 ["long-march-route-water",["cs-target-long-march-route-water"],"route-water",{1:"动词与地点错配。",2:"动词与地点错配。"}],
 ["long-march-route-late",["cs-target-long-march-route-late"],"route-late",{1:"未回瑞金或在上海会师。",2:"遵义会议不是长征终点。"}],
 ["long-march-process-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"起点、路线和结束均错。",2:"年份、路线和结束均错。"}],
 ["zunyi-team",["cs-target-zunyi-time-team"],"leadership-team",{1:"陈独秀、李大钊不在该小组。",2:"该组合属于辛亥时期人物。"}],
 ["zunyi-significance",["cs-target-zunyi-significance"],"meeting-significance",{1:"建党标志对应中共一大。",2:"合作形成对应国民党一大。"}],
 ["long-march-poem-dates",["cs-target-long-march-poem-dates"],"poem-dates",{1:"两项时间均错。",2:"两项时间均错。"}],
 ["long-march-poem-lines",["cs-target-long-march-poem-lines"],"poem-lines",{1:"该句出自《清平乐·六盘山》。",2:"该句出自《七律·长征》。"}],
 ["zunyi-poems-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"会议意义、年份和作品均错。",2:"意义、人物和作品均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-long-march-cause-start":"long-march-start","cs-target-long-march-finish":"long-march-finish","cs-target-long-march-route-water":"long-march-route-water","cs-target-long-march-route-late":"long-march-route-late","cs-target-zunyi-time-team":"zunyi-team","cs-target-zunyi-significance":"zunyi-significance","cs-target-long-march-poem-dates":"long-march-poem-dates","cs-target-long-march-poem-lines":"long-march-poem-lines"};
const phrase={"cs-target-long-march-cause-start":"反围剿败，三四江西启程","cs-target-long-march-finish":"三六三军会师长征成","cs-target-long-march-route-water":"四赤巧金强大飞泸","cs-target-long-march-route-late":"雪山草地吴起，会宁将台会师","cs-target-zunyi-time-team":"三五遵义毛周王","cs-target-zunyi-significance":"生死转折，由幼成熟","cs-target-long-march-poem-dates":"娄山二月，七律六盘十月","cs-target-long-march-poem-lines":"远征七律，雄关娄山，不到长城六盘"};
const refs={"cs-target-long-march-cause-start":march,"cs-target-long-march-finish":march,"cs-target-long-march-route-water":march,"cs-target-long-march-route-late":march,"cs-target-zunyi-time-team":zunyi,"cs-target-zunyi-significance":zunyi,"cs-target-long-march-poem-dates":poems,"cs-target-long-march-poem-lines":poems};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用年份、路线动词、会议意义和作品线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整战役过程和诗词全文","正文未展开的党史争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("long-march-process-memory","长征起止与路线",gMarch,targets.slice(0,4),"long-march-process-full"),memory("zunyi-poems-memory","遵义会议与长征诗作",gCulture,targets.slice(4),"zunyi-poems-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gMarch?"long-march-process-full":"zunyi-poems-full"]}));
const groups=[{id:gMarch,title:"红军长征起止与路线",scope:"humanities-history",reason:"按原因起点、关键路线和会师结束构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gCulture,title:"遵义会议与长征诗作",scope:"humanities-history",reason:"按会议人物意义及诗作时间、代表句构成有限文化线索。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-long-march-zunyi",pointId:"land-revolution",tabIds:["red-army-long-march","zunyi-meeting","long-march-poems"],status:"已建设",batch:"C5-47",scope:"长征起止路线、遵义会议及诗作有限匹配；排除战役过程和诗词全文"},{candidateId:"history-anti-japanese-war",pointId:"anti-japanese-liberation",status:"可建设",batch:"C5-47",scope:"抗日战争主线，下一批按来源页签拆分最多两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=53;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-47",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"2b24a517",toPackVersion:"2026-10-21.51",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-47 新增长征进程与遵义会议、长征诗作两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
