// C5-35: Jin and Southern Song backbone.
const {ref,question}=require("./learning-authoring");
const jin=ref("five-dynasties-yuan","jin","cs-1-9-p10-jin-list");
const song=ref("five-dynasties-yuan","southern-song","cs-1-9-p10-southern-song-list");
const groupJin="jin-backbone",groupSong="southern-song-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、人物、地点、政权和事件配对。"],excludes:["人物轶事、战争过程和正文未展开的制度细节",...excludes],refs});
const targets=[
  t("cs-target-jin-identity-founding",groupJin,"能把女真族、完颜阿骨打、1115年与金朝建立对应。","金朝由女真族建立；完颜阿骨打统一女真诸部后，于1115年建立大金。",[jin]),
  t("cs-target-jin-region",groupJin,"能识别金朝主要统治区域。","金朝是统治中国东北和华北地区的封建王朝。",[jin]),
  t("cs-target-jin-capital-name",groupJin,"能把会宁府与大金国号对应。","完颜阿骨打于会宁府建都立国，国号大金。",[jin],["不考会宁府的现代行政区完整名称。"]),
  t("cs-target-jin-fall",groupJin,"能把1234年金朝灭亡与南宋、蒙古夹击对应。","1234年，金朝在南宋和蒙古南北夹击之下灭亡。",[jin],["不扩展灭亡战争的具体过程。"]),
  t("cs-target-southern-song-founding",groupSong,"能把1127年、赵构、应天与南宋建立对应。","1127年赵构在应天称帝，史称南宋。",[song]),
  t("cs-target-southern-song-capital",groupSong,"能识别南宋后来定都临安。","南宋建立后定都临安，即今杭州。",[song]),
  t("cs-target-shaoxing-treaty",groupSong,"能把1141年绍兴和议、宋高宗、金与宋金对峙对应。","1141年宋高宗与金签订绍兴和约，宋金南北对峙局面最后确立。",[song],["不考每年纳银、纳绢的具体数额。"]),
  t("cs-target-jiading-treaty",groupSong,"能把1208年嘉定和议与宋金对应。","1208年南宋与金签订嘉定和约。",[song],["不考伯侄称谓、赔款和银绢数额。"]),
  t("cs-target-southern-song-fall",groupSong,"能区分1276年临安失守与1279年南宋最终覆灭。","1276年蒙古军攻入临安；1279年崖山海战后南宋覆灭。",[song],["人物事迹只作正文背景，不单独考轶事。"]),
];
const addedQuestions=[
  question("jin-founding","humanities-history",groupJin,"识别金朝建立","1115年统一女真诸部并建立大金的是谁？",["完颜阿骨打","耶律阿保机","元昊"],0,"女真族首领完颜阿骨打于1115年建立大金。","阿保机对应辽，元昊对应西夏。",[jin]),
  question("jin-region","humanities-history",groupJin,"识别金朝区域","正文所述金朝主要统治中国哪些地区？",["东北和华北","江南和岭南","西北和青藏"],0,"正文将金朝概括为统治中国东北和华北地区的王朝。","只按本页正文的主要区域判断。",[jin]),
  question("jin-capital-name","humanities-history",groupJin,"识别金朝都城国号","完颜阿骨打建都立国时的都城与国号配对正确的是？",["会宁府—大金","临安—大夏","应天—大辽"],0,"完颜阿骨打于会宁府建都立国，国号大金。","不考会宁府现代行政区全称。",[jin]),
  question("jin-fall","humanities-history",groupJin,"识别金朝灭亡","1234年金朝在谁的南北夹击下灭亡？",["南宋和蒙古","北宋和辽","西夏和蒙古"],0,"1234年金朝在南宋和蒙古南北夹击之下灭亡。","不扩展战争过程。",[jin]),
  question("jin-full","humanities-history",groupJin,"综合复辨金朝主线","下列哪一项完整正确？",["女真族建立金；1115年完颜阿骨打于会宁府建大金；统治东北、华北；1234年亡于南宋与蒙古夹击","契丹族建立金；1038年元昊建国；都临安；亡于北宋","党项族建立金；916年阿保机建国；统治江南；1227年亡于辽"],0,"该项正确串起金朝的民族、建立、区域、都城国号和灭亡。","不扩展正文未列制度。",[jin]),
  question("southern-song-founding","humanities-history",groupSong,"识别南宋建立与都城","关于南宋建立，下列哪一项正确？",["1127年赵构在应天称帝，后来定都临安","1115年赵构在会宁府称帝，定都东京","1279年赵匡胤在临安称帝，定都应天"],0,"1127年赵构在应天称帝，后来定都临安，史称南宋。","应天是称帝地点，临安是后来都城。",[song]),
  question("shaoxing-treaty","humanities-history",groupSong,"识别绍兴和议","1141年南宋与金签订、使宋金南北对峙局面最后确立的和议是？",["绍兴和议","嘉定和议","澶渊之盟"],0,"1141年宋高宗与金签订绍兴和约，宋金南北对峙局面最后确立。","不考银绢具体数额。",[song]),
  question("jiading-treaty","humanities-history",groupSong,"识别嘉定和议","1208年南宋与金签订的和议是？",["嘉定和议","绍兴和议","澶渊之盟"],0,"1208年南宋与金签订嘉定和约。","不考伯侄称谓、赔款和银绢数额。",[song]),
  question("southern-song-fall","humanities-history",groupSong,"识别南宋灭亡","南宋灭亡时间线正确的是？",["1276年蒙古军攻入临安，1279年崖山海战后南宋覆灭","1276年金军攻入应天，1279年北宋覆灭","1208年蒙古军攻入临安，1234年南宋覆灭"],0,"1276年蒙古军攻入临安；1279年崖山海战后南宋覆灭。","人物事迹不作为本题判断条件。",[song]),
  question("southern-song-full","humanities-history",groupSong,"综合复辨南宋主线","下列哪一项完整正确？",["1127年赵构在应天称帝、后都临安；1141年绍兴和议；1208年嘉定和议；1279年崖山后南宋亡","1127年赵匡胤在临安建南宋；1141年嘉定和议；1234年崖山后亡","1115年赵构建南宋；1208年绍兴和议；1276年南宋已最终覆灭"],0,"该项正确串起南宋建立、两次宋金和议与灭亡。","不记和议中的具体银绢数额。",[song]),
];
const specs=[
  ["jin-founding",["cs-target-jin-identity-founding"],"founding",{1:"耶律阿保机建立契丹国。",2:"元昊建立西夏。"}],
  ["jin-region",["cs-target-jin-region"],"region",{1:"正文所述主要区域为东北和华北。",2:"正文所述主要区域为东北和华北。"}],
  ["jin-capital-name",["cs-target-jin-capital-name"],"capital-name",{1:"临安是南宋都城，大夏是西夏国号。",2:"应天与南宋建立相关，大辽是辽国号。"}],
  ["jin-fall",["cs-target-jin-fall"],"fall",{1:"1234年夹击金朝的是南宋和蒙古。",2:"1234年夹击金朝的是南宋和蒙古。"}],
  ["jin-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"民族、人物、都城和灭亡对象均错配。",2:"民族、人物、区域和年份均错配。"}],
  ["southern-song-founding",["cs-target-southern-song-founding","cs-target-southern-song-capital"],"founding-capital",{1:"年份、地点和都城均错配。",2:"年份、人物和地点均错配。"}],
  ["shaoxing-treaty",["cs-target-shaoxing-treaty"],"treaty",{1:"嘉定和议签于1208年。",2:"澶渊之盟是北宋与辽的和议。"}],
  ["jiading-treaty",["cs-target-jiading-treaty"],"treaty",{1:"绍兴和议对应1141年。",2:"澶渊之盟是北宋与辽的和议。"}],
  ["southern-song-fall",["cs-target-southern-song-fall"],"fall-timeline",{1:"进攻者、地点关联和政权均错。",2:"年份和灭亡政权错误。"}],
  ["southern-song-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"人物、和议和灭亡年份均错配。",2:"建立年份、和议年份和最终覆灭年份均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-jin-identity-founding":"jin-founding","cs-target-jin-region":"jin-region","cs-target-jin-capital-name":"jin-capital-name","cs-target-jin-fall":"jin-fall","cs-target-southern-song-founding":"southern-song-founding","cs-target-southern-song-capital":"southern-song-founding","cs-target-shaoxing-treaty":"shaoxing-treaty","cs-target-jiading-treaty":"jiading-treaty","cs-target-southern-song-fall":"southern-song-fall"};
const phrase={"cs-target-jin-identity-founding":"女真阿骨打一一一五金","cs-target-jin-region":"东北华北是金域","cs-target-jin-capital-name":"会宁建都号大金","cs-target-jin-fall":"一二三四宋蒙夹","cs-target-southern-song-founding":"一一二七赵构应天立","cs-target-southern-song-capital":"后来临安作宋都","cs-target-shaoxing-treaty":"一一四一绍兴议","cs-target-jiading-treaty":"一二零八嘉定议","cs-target-southern-song-fall":"临安七六崖山七九亡"};
const refs=Object.fromEntries(targets.map(x=>[x.id,x.groupId===groupJin?jin:song]));
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"民族、人物、年份、地点与政权关系串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["和议银绢数额、战争过程和人物轶事","未纳入本组的北宋、西夏、元朝制度内容"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("jin-memory","金朝建立区域与灭亡",groupJin,targets.slice(0,4),"jin-full"),memory("southern-song-memory","南宋建立和议与灭亡",groupSong,targets.slice(4),"southern-song-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupJin?"jin-full":"southern-song-full"]}));
const groups=[{id:groupJin,title:"金朝建立区域与灭亡",scope:"humanities-history",reason:"按民族、建立、区域、都城国号和灭亡构成金朝主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupSong,title:"南宋建立和议与灭亡",scope:"humanities-history",reason:"按建立定都、宋金和议和灭亡时间线构成南宋主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-jin-southern-song",pointId:"five-dynasties-yuan",tabIds:["jin","southern-song"],status:"已建设",batch:"C5-35",scope:"金朝建立区域灭亡与南宋建立和议灭亡；排除和议数额和战争细节"},{candidateId:"history-yuan-song-yuan-economy",pointId:"five-dynasties-yuan",tabIds:["yuan","five-dynasties-yuan-economy"],status:"可建设",batch:"C5-35",scope:"元朝关键节点与宋元社会经济，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=41;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-35",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"35154dc1",toPackVersion:"2026-10-21.39",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-35 新增金与南宋两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
