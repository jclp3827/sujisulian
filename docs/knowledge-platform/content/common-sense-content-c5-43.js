// C5-43: New Culture Movement and May Fourth Movement.
const {ref,question}=require("./learning-authoring");
const culture=ref("new-culture-may-fourth","new-culture-movement","cs-1-9-p17-new-culture-movement-list");
const may=ref("new-culture-may-fourth","may-fourth-movement","cs-1-9-p17-may-fourth-movement-list");
const groupCulture="new-culture-core",groupMay="may-fourth-core";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文时间、阵地、人物、主张、力量和意义对应。"],excludes:["正文未展开的思想史争议、完整文章与人物名单",...excludes],refs});
const targets=[
  t("cs-target-new-culture-origin",groupCulture,"能识别新文化运动兴起的时间、人物、刊物和基地。","1915年陈独秀在上海创办《青年杂志》，第二期改名《新青年》；《新青年》是主要阵地，北京大学是主要活动基地。",[culture]),
  t("cs-target-new-culture-propositions",groupCulture,"能识别新文化运动三组基本主张。","新文化运动提倡科学与民主、新道德、新文学，分别反对愚昧与专制、旧道德、旧文学。",[culture]),
  t("cs-target-new-culture-chen-cai",groupCulture,"能把陈独秀、蔡元培及其主张对应。","陈独秀提出打倒孔家店；蔡元培主张思想自由、兼容并包。",[culture],["对儒家学说的完整评价留在正文。"]),
  t("cs-target-new-culture-hu-li",groupCulture,"能把胡适、李大钊及其贡献对应。","胡适发表《文学改良刍议》并倡白话文；李大钊最早传播马克思主义。",[culture],["李大钊文章清单不进入口诀。"]),
  t("cs-target-may-fourth-trigger",groupMay,"能识别五四运动的导火索。","1919年巴黎和会上中国外交失败是五四运动的导火索。",[may]),
  t("cs-target-may-fourth-forces",groupMay,"能区分五四运动中的先锋与后期主力。","青年学生发挥先锋作用，工人阶级在运动后期发挥主力军作用。",[may]),
  t("cs-target-may-fourth-nature",groupMay,"能识别五四运动的性质和工人阶级政治地位变化。","五四运动是彻底反帝反封建的爱国运动，中国工人阶级开始登上政治舞台。",[may]),
  t("cs-target-may-fourth-significance",groupMay,"能识别五四运动对思想传播和革命阶段的意义。","五四运动促进马克思主义传播，是中国新民主主义革命的开端。",[may]),
];
const addedQuestions=[
  question("new-culture-origin","humanities-history",groupCulture,"识别新文化运动兴起","新文化运动兴起信息哪项正确？",["1915年陈独秀在上海创办《青年杂志》，第二期改名《新青年》","1919年胡适在北京创办《申报》","1921年李大钊在嘉兴创办《新青年》"],0,"1915年陈独秀在上海创办《青年杂志》，第二期改名《新青年》。","《新青年》是主要阵地，北京大学是主要活动基地。",[culture]),
  question("new-culture-propositions","humanities-history",groupCulture,"识别三组主张","新文化运动三组基本主张是？",["科学与民主、新道德、新文学","自强与求富、旧道德、旧文学","民族与民权、实业与教育、尊孔复古"],0,"基本主张围绕科学与民主、新道德、新文学展开。","对应反对愚昧专制、旧道德和旧文学。",[culture]),
  question("new-culture-chen-cai","humanities-history",groupCulture,"对应陈独秀与蔡元培","人物与主张对应正确的是？",["陈独秀—打倒孔家店；蔡元培—思想自由、兼容并包","陈独秀—文学改良刍议；蔡元培—最早传播马克思主义","陈独秀—三民主义；蔡元培—自强求富"],0,"陈独秀与蔡元培分别对应上述主张。","胡适对应《文学改良刍议》，李大钊传播马克思主义。",[culture]),
  question("new-culture-hu-li","humanities-history",groupCulture,"对应胡适与李大钊","胡适与李大钊的贡献对应正确的是？",["胡适倡导白话文；李大钊最早传播马克思主义","胡适提出三民主义；李大钊创办兴中会","胡适主张扶清灭洋；李大钊发动公车上书"],0,"胡适发表《文学改良刍议》倡白话文，李大钊最早传播马克思主义。","人物贡献不要与近代其他运动错配。",[culture]),
  question("new-culture-full","humanities-history",groupCulture,"综合复辨新文化运动","下列哪一项完整正确？",["1915年陈独秀创办《青年杂志》；《新青年》为主要阵地，北大为主要活动基地；提倡科学民主、新道德和新文学；胡适倡白话文，李大钊传播马克思主义","1919年蔡元培创办《新青年》；上海大学为主要基地；主张自强求富","1905年胡适创办《青年杂志》；陈独秀提出三民主义；李大钊倡导旧文学"],0,"该项正确串起兴起、阵地、主张和代表人物。","完整文章清单不在本组。",[culture]),
  question("may-fourth-trigger","humanities-history",groupMay,"识别五四导火索","五四运动的导火索是？",["1919年巴黎和会上中国外交失败","《辛丑条约》签订","武昌起义爆发"],0,"巴黎和会上中国外交失败是导火索。","其他两项分属不同历史事件。",[may]),
  question("may-fourth-forces","humanities-history",groupMay,"区分先锋与主力","五四运动中的先锋和后期主力分别是？",["青年学生；工人阶级","工人阶级；青年学生","资产阶级；农民阶级"],0,"青年学生是先锋，工人阶级在后期成为主力军。","顺序不能倒置。",[may]),
  question("may-fourth-nature","humanities-history",groupMay,"识别性质与力量变化","关于五四运动，哪项正确？",["是彻底反帝反封建的爱国运动，工人阶级开始登上政治舞台","是扶清灭洋的农民运动，资产阶级开始登台","是维新改良运动，封建君主专制由此结束"],0,"正文明确其反帝反封建性质及工人阶级登台。","不要与义和团或戊戌变法混淆。",[may]),
  question("may-fourth-significance","humanities-history",groupMay,"识别历史意义","五四运动的思想与革命阶段意义是？",["促进马克思主义传播，是新民主主义革命的开端","促进三民主义产生，是旧民主主义革命开端","阻止马克思主义传播，完成反帝反封建任务"],0,"五四运动促进马克思主义传播，并标志新民主主义革命开端。","不表述为完成全部革命任务。",[may]),
  question("may-fourth-full","humanities-history",groupMay,"综合复辨五四运动","下列哪一项完整正确？",["巴黎和会外交失败为导火索；学生先锋、工人后期主力；运动彻底反帝反封建；促进马克思主义传播并成为新民主主义革命开端","《辛丑条约》为导火索；工人先锋、学生后期主力；运动主张扶清灭洋","武昌起义为导火索；资产阶级是唯一力量；运动完成反帝反封建任务"],0,"该项正确串起导火索、力量、性质和意义。","口号和人物名单保留在正文。",[may]),
];
const specs=[
  ["new-culture-origin",["cs-target-new-culture-origin"],"origin",{1:"年份、人物和刊物均错。",2:"年份、地点和事件均错。"}],
  ["new-culture-propositions",["cs-target-new-culture-propositions"],"propositions",{1:"混入洋务口号且方向相反。",2:"混入三民主义和尊孔复古。"}],
  ["new-culture-chen-cai",["cs-target-new-culture-chen-cai"],"figure-ideas",{1:"胡适与李大钊贡献错配给二人。",2:"混入其他运动主张。"}],
  ["new-culture-hu-li",["cs-target-new-culture-hu-li"],"figure-contributions",{1:"两项均属其他人物和组织。",2:"两项均属其他近代运动。"}],
  ["new-culture-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"年份、创办者、基地和主张均错。",2:"年份、人物与主张均错。"}],
  ["may-fourth-trigger",["cs-target-may-fourth-trigger"],"trigger",{1:"《辛丑条约》不是五四导火索。",2:"武昌起义不是五四导火索。"}],
  ["may-fourth-forces",["cs-target-may-fourth-forces"],"forces",{1:"先锋与后期主力倒置。",2:"正文没有这样划分。"}],
  ["may-fourth-nature",["cs-target-may-fourth-nature"],"nature",{1:"该项对应义和团且阶级错。",2:"该项混入戊戌变法与辛亥影响。"}],
  ["may-fourth-significance",["cs-target-may-fourth-significance"],"significance",{1:"思想与革命阶段均错。",2:"与正文意义相反并夸大结果。"}],
  ["may-fourth-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"导火索、力量与性质均错。",2:"导火索、力量和结果均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-new-culture-origin":"new-culture-origin","cs-target-new-culture-propositions":"new-culture-propositions","cs-target-new-culture-chen-cai":"new-culture-chen-cai","cs-target-new-culture-hu-li":"new-culture-hu-li","cs-target-may-fourth-trigger":"may-fourth-trigger","cs-target-may-fourth-forces":"may-fourth-forces","cs-target-may-fourth-nature":"may-fourth-nature","cs-target-may-fourth-significance":"may-fourth-significance"};
const phrase={"cs-target-new-culture-origin":"一五独秀青年刊，新青阵地北大站","cs-target-new-culture-propositions":"科学民主，新德新文","cs-target-new-culture-chen-cai":"陈打孔店，蔡容自由","cs-target-new-culture-hu-li":"胡适白话，李钊马列","cs-target-may-fourth-trigger":"一九巴黎外交败","cs-target-may-fourth-forces":"学生先锋，工人后主","cs-target-may-fourth-nature":"彻底反帝反封建，工人登台","cs-target-may-fourth-significance":"传播马克思，新民主开端"};
const refs=Object.fromEntries(targets.map(x=>[x.id,x.groupId===groupCulture?culture:may]));
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用时间、人物、主张、力量和意义串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整文章、口号和人物名单","正文未展开的思想史争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("new-culture-memory","新文化运动主线",groupCulture,targets.slice(0,4),"new-culture-full"),memory("may-fourth-memory","五四运动主线",groupMay,targets.slice(4),"may-fourth-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupCulture?"new-culture-full":"may-fourth-full"]}));
const groups=[{id:groupCulture,title:"新文化运动兴起与主张",scope:"humanities-history",reason:"按兴起、主张和人物贡献构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupMay,title:"五四运动力量与意义",scope:"humanities-history",reason:"按导火索、力量、性质和意义构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-new-culture-may-fourth",pointId:"new-culture-may-fourth",tabIds:["new-culture-movement","may-fourth-movement"],status:"已建设",batch:"C5-43",scope:"新文化运动兴起主张和人物、五四运动导火索力量性质意义；排除完整文章口号名单"},{candidateId:"history-cpc-birth",pointId:"communist-revolution",tabIds:["cpc-foundations","cpc-first-congress","cpc-second-congress"],status:"可建设",batch:"C5-43",scope:"中国共产党成立基础、中共一大与中共二大，可拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=49;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-43",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"dfd14eb6",toPackVersion:"2026-10-21.47",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-43 新增新文化运动与五四运动两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
