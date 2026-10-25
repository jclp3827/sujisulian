// C5-34: Northern Song and Western Xia backbone.
const {ref,question}=require("./learning-authoring");
const song=ref("five-dynasties-yuan","northern-song","cs-1-9-p9-p10-northern-song-list");
const xia=ref("five-dynasties-yuan","western-xia","cs-1-9-p10-western-xia-list");
const groupSong="northern-song-backbone",groupXia="western-xia-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、人物、事件与政权配对。"],excludes:["轶事细节与超出本组的制度展开",...excludes],refs});
const targets=[
  t("cs-target-northern-song-founding",groupSong,"能把960年、赵匡胤、东京与北宋建立对应。","960年赵匡胤建立宋朝，定都东京（今开封），史称北宋。",[song],["不以黄袍加身故事作判断依据。"]),
  t("cs-target-chanyuan-treaty",groupSong,"能把1004年、宋真宗、辽与澶渊之盟对应。","1004年宋真宗时期宋辽签订澶渊之盟，标志宋辽战争结束。",[song],["不考岁币具体数额。"]),
  t("cs-target-qingli-reform",groupSong,"能识别庆历新政的人物和内容线索。","宋仁宗庆历年间，范仲淹、欧阳修等推行庆历新政，涉及官员考核、厚农桑、减徭役等。",[song]),
  t("cs-target-wang-anshi-reform",groupSong,"能识别王安石变法的时期、年份和目的。","宋神宗任用王安石，1069年开始变法，以富国强兵、改变积贫积弱为目的。",[song],["具体各法另作制度专题。"]),
  t("cs-target-northern-song-fall",groupSong,"能把1127年靖康之耻与北宋灭亡对应。","1127年金军攻破东京，俘虏宋徽宗、宋钦宗，北宋灭亡。",[song],["不考被俘人数。"]),
  t("cs-target-western-xia-identity",groupXia,"能识别西夏的民族背景与活动区域。","西夏由党项族建立，主要活动于宁夏、甘肃和陕西西北一带。",[xia]),
  t("cs-target-western-xia-founding",groupXia,"能把1038年、元昊与大夏国对应。","1038年元昊称大夏国皇帝，西夏政权建立。",[xia]),
  t("cs-target-song-xia-wars",groupXia,"能识别西夏建立后与北宋多次发生战争。","西夏建立后与北宋多次发生战争。",[xia]),
  t("cs-target-western-xia-fall",groupXia,"能把1227年西夏灭亡与蒙古对应。","1227年蒙古灭西夏。",[xia]),
];
const addedQuestions=[
  question("northern-song-founding","humanities-history",groupSong,"识别北宋建立","960年建立北宋并定都东京的是谁？",["赵匡胤","赵光义","元昊"],0,"960年赵匡胤建立宋朝，定都东京，史称北宋。","不以陈桥兵变的轶事细节作判断。",[song]),
  question("chanyuan-treaty","humanities-history",groupSong,"识别澶渊之盟","1004年宋真宗时期，北宋与哪个政权签订澶渊之盟？",["辽","西夏","金"],0,"宋辽签订澶渊之盟，标志宋辽战争结束。","不考岁币具体数额。",[song]),
  question("northern-song-reforms","humanities-history",groupSong,"区分北宋两次改革","下列改革配对正确的是？",["宋仁宗—范仲淹、欧阳修—庆历新政；宋神宗—王安石—1069年变法","宋真宗—王安石—庆历新政；宋仁宗—元昊—1069年变法","宋神宗—范仲淹—澶渊之盟；宋徽宗—王安石—陈桥兵变"],0,"庆历新政对应仁宗时期范仲淹、欧阳修等；王安石变法对应神宗时期并于1069年开始。","具体各法不在本题覆盖范围。",[song]),
  question("northern-song-fall","humanities-history",groupSong,"识别北宋灭亡","1127年金军攻破东京并导致北宋灭亡的事件称什么？",["靖康之耻","澶渊之盟","淝水之战"],0,"1127年靖康之耻后北宋灭亡。","不考被俘人数等细节。",[song]),
  question("northern-song-full","humanities-history",groupSong,"综合复辨北宋主线","下列哪一项完整正确？",["赵匡胤960年建北宋；1004年宋辽澶渊之盟；仁宗庆历新政、神宗王安石变法；1127年靖康后北宋亡","赵光义960年建北宋；宋夏签澶渊之盟；元昊推行王安石变法","北宋建都建康；澶渊之盟结束宋金战争；1227年北宋亡"],0,"该项正确串起建国、宋辽关系、两次改革和灭亡。","中央集权细分机构另作专题。",[song]),
  question("western-xia-identity","humanities-history",groupXia,"识别西夏背景","建立西夏政权的民族是？",["党项族","契丹族","女真族"],0,"西夏是党项族建立的政权。","本题不延伸民族迁徙史。",[xia]),
  question("western-xia-founding","humanities-history",groupXia,"识别西夏建立","1038年称大夏国皇帝、建立西夏政权的是谁？",["元昊","耶律阿保机","完颜阿骨打"],0,"1038年元昊称大夏国皇帝。","阿保机对应辽，阿骨打对应金。",[xia]),
  question("song-xia-wars","humanities-history",groupXia,"识别宋夏关系","西夏建立后与哪个政权多次发生战争？",["北宋","东晋","北魏"],0,"正文指出西夏建立后与北宋多次发生战争。","不扩展具体战役和条约。",[xia]),
  question("western-xia-fall","humanities-history",groupXia,"识别西夏灭亡","1227年灭亡西夏的是哪个政权或力量？",["蒙古","辽","北宋"],0,"1227年蒙古灭西夏。","不扩展战争过程。",[xia]),
  question("western-xia-full","humanities-history",groupXia,"综合复辨西夏主线","下列哪一项完整正确？",["党项族建立西夏；1038年元昊称帝；与北宋多次战争；1227年亡于蒙古","契丹族建立西夏；916年元昊称帝；亡于辽","女真族建立西夏；与东晋战争；1125年亡于北宋"],0,"该项正确串起民族、建立、宋夏关系和灭亡节点。","不扩展正文未列制度。",[xia]),
];
const specs=[
  ["northern-song-founding",["cs-target-northern-song-founding"],"founding",{1:"赵光义与979年灭北汉相关。",2:"元昊建立西夏。"}],
  ["chanyuan-treaty",["cs-target-chanyuan-treaty"],"treaty",{1:"澶渊之盟签于宋辽之间。",2:"澶渊之盟签于宋辽之间。"}],
  ["northern-song-reforms",["cs-target-qingli-reform","cs-target-wang-anshi-reform"],"reform-contrast",{1:"时期、人物和改革均错配。",2:"人物、事件和时期均错配。"}],
  ["northern-song-fall",["cs-target-northern-song-fall"],"fall",{1:"澶渊之盟是宋辽盟约。",2:"淝水之战发生在东晋。"}],
  ["northern-song-full",targets.slice(0,5).map(x=>x.id),"full-recheck",{1:"建立、盟约和改革均错配。",2:"都城、盟约双方和灭亡年份错误。"}],
  ["western-xia-identity",["cs-target-western-xia-identity"],"identity",{1:"契丹族建立辽。",2:"女真族建立金。"}],
  ["western-xia-founding",["cs-target-western-xia-founding"],"founding",{1:"耶律阿保机建立契丹国。",2:"完颜阿骨打建立金。"}],
  ["song-xia-wars",["cs-target-song-xia-wars"],"relation",{1:"正文对应北宋。",2:"正文对应北宋。"}],
  ["western-xia-fall",["cs-target-western-xia-fall"],"fall",{1:"正文记载蒙古灭西夏。",2:"正文记载蒙古灭西夏。"}],
  ["western-xia-full",targets.slice(5).map(x=>x.id),"full-recheck",{1:"民族、年份和灭亡对象错误。",2:"民族、交战对象和年份错误。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-northern-song-founding":"northern-song-founding","cs-target-chanyuan-treaty":"chanyuan-treaty","cs-target-qingli-reform":"northern-song-reforms","cs-target-wang-anshi-reform":"northern-song-reforms","cs-target-northern-song-fall":"northern-song-fall","cs-target-western-xia-identity":"western-xia-identity","cs-target-western-xia-founding":"western-xia-founding","cs-target-song-xia-wars":"song-xia-wars","cs-target-western-xia-fall":"western-xia-fall"};
const phrase={"cs-target-northern-song-founding":"九六零匡胤东京宋","cs-target-chanyuan-treaty":"一零零四宋辽盟","cs-target-qingli-reform":"仁宗范欧庆历新","cs-target-wang-anshi-reform":"神宗安石六九变","cs-target-northern-song-fall":"一一二七靖康亡","cs-target-western-xia-identity":"党项西北建西夏","cs-target-western-xia-founding":"一零三八元昊帝","cs-target-song-xia-wars":"西夏北宋多交战","cs-target-western-xia-fall":"一二二七蒙古灭"};
const refs={"cs-target-northern-song-founding":song,"cs-target-chanyuan-treaty":song,"cs-target-qingli-reform":song,"cs-target-wang-anshi-reform":song,"cs-target-northern-song-fall":song,"cs-target-western-xia-identity":xia,"cs-target-western-xia-founding":xia,"cs-target-song-xia-wars":xia,"cs-target-western-xia-fall":xia};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"年份、人物、改革与政权关系串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["轶事细节与超出本组的制度展开","未纳入本组的金、南宋和元内容"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("northern-song-memory","北宋建国改革与灭亡",groupSong,targets.slice(0,5),"northern-song-full"),memory("western-xia-memory","西夏四条主线",groupXia,targets.slice(5),"western-xia-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupSong?"northern-song-full":"western-xia-full"]}));
const groups=[{id:groupSong,title:"北宋建国改革与灭亡",scope:"humanities-history",reason:"按建国、宋辽关系、改革和灭亡构成北宋主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupXia,title:"西夏建立战争与灭亡",scope:"humanities-history",reason:"按民族、建立、宋夏关系和灭亡串联西夏。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-northern-song-western-xia",pointId:"five-dynasties-yuan",tabIds:["northern-song","western-xia"],status:"已建设",batch:"C5-34",scope:"北宋建国改革灭亡与西夏政权主线；中央集权细分另批"},{candidateId:"history-jin-southern-song",pointId:"five-dynasties-yuan",tabIds:["jin","southern-song"],status:"可建设",batch:"C5-34",scope:"金与南宋关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=40;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-34",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"b96afa86",toPackVersion:"2026-10-21.38",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-34 新增北宋与西夏两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
