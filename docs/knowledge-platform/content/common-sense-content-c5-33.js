// C5-33: Five Dynasties/Ten Kingdoms and Liao backbone.
const {ref,question}=require("./learning-authoring");
const five=ref("five-dynasties-yuan","five-dynasties","cs-1-9-p9-five-dynasties-list");
const liao=ref("five-dynasties-yuan","liao","cs-1-9-p9-liao-list");
const groupFive="five-dynasties-backbone",groupLiao="liao-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、政权和人物配对。"],excludes:["补充典故与存在多种说法的叙事",...excludes],refs});
const targets=[
  t("cs-target-five-dynasties-start",groupFive,"能把907年、朱温建立后梁与五代时期起点对应。","907年朱全忠（朱温）废唐建立后梁，五代更替由此开始。",[five]),
  t("cs-target-five-dynasties-sequence",groupFive,"能识别五代的五个朝代及顺序。","黄河流域的五代依次为后梁、后唐、后晋、后汉、后周。",[five]),
  t("cs-target-ten-kingdoms",groupFive,"能识别十国的区域和并存性质。","十国是南方各地及北方山西出现的十个割据政权，存在交替并存。",[five]),
  t("cs-target-five-dynasties-end",groupFive,"能把979年、赵光义灭北汉与时期结束对应。","979年北宋赵光义灭北汉，五代十国时期结束。",[five],["不考王位继承传说。"]),
  t("cs-target-khitan-identity",groupLiao,"能识别契丹与辽政权的民族背景。","契丹是我国北方古老的少数民族，耶律阿保机统一契丹各部。",[liao]),
  t("cs-target-liao-founding",groupLiao,"能把耶律阿保机、916年和契丹国建立对应。","916年耶律阿保机称帝，建立契丹国。",[liao]),
  t("cs-target-liao-rename",groupLiao,"能识别947年契丹改国号为辽。","947年契丹改国号为辽。",[liao]),
  t("cs-target-liao-fall",groupLiao,"能把1125年辽亡与金国对应。","1125年辽被金国灭亡。",[liao]),
];
const addedQuestions=[
  question("five-dynasties-start","humanities-history",groupFive,"识别五代起点","907年废唐、建立后梁的人物是谁？",["朱全忠（朱温）","赵光义","耶律阿保机"],0,"907年朱全忠建立后梁，五代时期开始。","不考相关人物典故。",[five]),
  question("five-dynasties-sequence","humanities-history",groupFive,"识别五代顺序","五代按正文顺序排列正确的是？",["后梁、后唐、后晋、后汉、后周","后唐、后梁、后周、后晋、后汉","后梁、北宋、辽、西夏、金"],0,"黄河流域五代依次为后梁、后唐、后晋、后汉、后周。","不把并行政权混入五代序列。",[five]),
  question("ten-kingdoms","humanities-history",groupFive,"识别十国范围","正文中的“十国”主要指什么？",["南方各地及北方山西出现、交替并存的十个割据政权","黄河流域依次更替的五个朝代","辽境内同时存在的十个部落"],0,"十国分布在南方各地及北方山西，属于交替并存的割据政权。","与黄河流域的五代更替区分。",[five]),
  question("five-dynasties-end","humanities-history",groupFive,"识别时期结束","979年哪一事件标志正文所述五代十国时期结束？",["北宋赵光义灭北汉","朱温建立后梁","耶律阿保机建立契丹国"],0,"979年赵光义灭北汉，五代十国时期结束。","不借烛影斧声等传说判断。",[five]),
  question("five-dynasties-full","humanities-history",groupFive,"综合复辨五代十国","下列哪一项完整正确？",["907年朱温建后梁；五代为后梁唐晋汉周；十国多在南方及山西并存；979年赵光义灭北汉","907年赵光义建后梁；五代包含辽金；979年朱温灭北汉","十国只在黄河流域依次更替；916年五代十国结束"],0,"该项正确串起时期起止、五代序列和十国范围。","不加入王位继承传说。",[five]),
  question("khitan-identity","humanities-history",groupLiao,"识别契丹背景","统一契丹各部并建立契丹国的人物是谁？",["耶律阿保机","完颜阿骨打","元昊"],0,"辽太祖耶律阿保机统一契丹各部。","本题只识别辽的建立主线。",[liao]),
  question("liao-founding","humanities-history",groupLiao,"识别辽政权建立","916年耶律阿保机称帝时建立的国号是什么？",["契丹国","辽","金"],0,"916年耶律阿保机称帝，建立契丹国。","947年才改国号为辽。",[liao]),
  question("liao-rename","humanities-history",groupLiao,"识别改号辽","契丹改国号为辽发生在哪一年？",["947年","916年","1125年"],0,"947年契丹改国号为辽。","916年是建立契丹国，1125年是辽灭亡。",[liao]),
  question("liao-fall","humanities-history",groupLiao,"识别辽灭亡","1125年辽被哪个政权灭亡？",["金国","北宋","西夏"],0,"1125年辽被金国灭亡。","不扩展辽金战争过程。",[liao]),
  question("liao-full","humanities-history",groupLiao,"综合复辨辽主线","下列哪一项完整正确？",["耶律阿保机统一契丹；916年建契丹国；947年改号辽；1125年亡于金","完颜阿骨打统一契丹；916年建辽；947年亡于北宋","元昊建契丹国；1125年改号辽"],0,"该项正确串起人物、建国、改号和灭亡节点。","不扩展未列入正文的制度。",[liao]),
];
const specs=[
  ["five-dynasties-start",["cs-target-five-dynasties-start"],"start",{1:"赵光义与979年灭北汉相关。",2:"耶律阿保机建立契丹国。"}],
  ["five-dynasties-sequence",["cs-target-five-dynasties-sequence"],"sequence",{1:"五代次序错误。",2:"混入宋辽夏金。"}],
  ["ten-kingdoms",["cs-target-ten-kingdoms"],"scope",{1:"这是五代的更替形态。",2:"正文没有这一表述。"}],
  ["five-dynasties-end",["cs-target-five-dynasties-end"],"end",{1:"这是时期起点。",2:"这是辽政权主线。"}],
  ["five-dynasties-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"人物、朝代范围和结束事件错误。",2:"十国范围和结束年份错误。"}],
  ["khitan-identity",["cs-target-khitan-identity"],"founder",{1:"完颜阿骨打建立金。",2:"元昊建立西夏。"}],
  ["liao-founding",["cs-target-liao-founding"],"founding",{1:"947年才改国号为辽。",2:"金不是阿保机916年建立的政权。"}],
  ["liao-rename",["cs-target-liao-rename"],"rename",{1:"916年建立契丹国。",2:"1125年辽亡。"}],
  ["liao-fall",["cs-target-liao-fall"],"fall",{1:"正文记载辽亡于金。",2:"正文记载辽亡于金。"}],
  ["liao-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"人物、国号和灭亡对象错误。",2:"人物、年份和事件错误。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-five-dynasties-start":"five-dynasties-start","cs-target-five-dynasties-sequence":"five-dynasties-sequence","cs-target-ten-kingdoms":"ten-kingdoms","cs-target-five-dynasties-end":"five-dynasties-end","cs-target-khitan-identity":"khitan-identity","cs-target-liao-founding":"liao-founding","cs-target-liao-rename":"liao-rename","cs-target-liao-fall":"liao-fall"};
const phrase={"cs-target-five-dynasties-start":"九零七朱温后梁起","cs-target-five-dynasties-sequence":"梁唐晋汉周五代","cs-target-ten-kingdoms":"南方山西十国并","cs-target-five-dynasties-end":"九七九北汉亡期止","cs-target-khitan-identity":"阿保机统一契丹","cs-target-liao-founding":"九一六契丹国建","cs-target-liao-rename":"九四七改号辽","cs-target-liao-fall":"一一二五金灭辽"};
const refs={"cs-target-five-dynasties-start":five,"cs-target-five-dynasties-sequence":five,"cs-target-ten-kingdoms":five,"cs-target-five-dynasties-end":five,"cs-target-khitan-identity":liao,"cs-target-liao-founding":liao,"cs-target-liao-rename":liao,"cs-target-liao-fall":liao};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"年份、人物和政权顺序串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["补充典故与存在多种说法的叙事","未纳入本组的宋夏金元内容"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("five-dynasties-memory","五代十国起止与范围",groupFive,targets.slice(0,4),"five-dynasties-full"),memory("liao-memory","辽政权四节点",groupLiao,targets.slice(4),"liao-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupFive?"five-dynasties-full":"liao-full"]}));
const groups=[{id:groupFive,title:"五代十国起止与范围",scope:"humanities-history",reason:"按时期起止、五代序列与十国范围构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupLiao,title:"契丹到辽的四节点",scope:"humanities-history",reason:"按统一、建国、改号和灭亡串联辽政权。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-five-dynasties-liao",pointId:"five-dynasties-yuan",tabIds:["five-dynasties","liao"],status:"已建设",batch:"C5-33",scope:"五代十国起止范围与辽政权主线；排除典故和多说叙事"},{candidateId:"history-northern-song-western-xia",pointId:"five-dynasties-yuan",tabIds:["northern-song","western-xia"],status:"可建设",batch:"C5-33",scope:"北宋与西夏关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=39;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-33",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"7fbdc0c8",toPackVersion:"2026-10-21.37",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-33 新增五代十国与辽两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
