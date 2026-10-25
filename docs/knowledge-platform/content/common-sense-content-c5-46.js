// C5-46: Early Land Revolution, army building and revolutionary bases.
const {ref,question}=require("./learning-authoring");
const R=(tab,unit)=>ref("land-revolution",tab,unit);
const nanchang=R("nanchang-uprising","cs-1-9-p19-nanchang-uprising-list"),aug7=R("august-seventh-meeting","cs-1-9-p19-august-seventh-meeting-list"),autumn=R("autumn-harvest-uprising","cs-1-9-p19-autumn-harvest-uprising-list"),sanwan=R("sanwan-reorganization","cs-1-9-p19-sanwan-reorganization-list"),jinggang=R("jinggangshan-base","cs-1-9-p19-jinggangshan-base-list"),sixth=R("cpc-sixth-congress","cs-1-9-p19-cpc-sixth-congress-list"),gutian=R("gutian-meeting","cs-1-9-p19-gutian-meeting-list"),soviet=R("central-soviet","cs-1-9-p20-central-soviet-list");
const groupStart="land-revolution-uprisings",groupBuild="land-revolution-army-bases";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、事件、建军节点和根据地地位对应。"],excludes:["正文未展开的党史争议、完整战斗过程和过密数字",...excludes],refs});
const targets=[
 t("cs-target-nanchang-uprising",groupStart,"能识别南昌起义的时间、第一枪和历史开端。","1927年8月1日南昌起义打响武装反抗国民党的第一枪，是党独立领导革命战争、创建人民军队和武装夺取政权的开端。",[nanchang]),
 t("cs-target-august-seventh",groupStart,"能识别八七会议的时间地点、方针与转折意义。","1927年8月7日汉口八七会议确定土地革命和武装反抗国民党的总方针，毛泽东提出政权由枪杆子中取得。",[aug7]),
 t("cs-target-autumn-harvest",groupStart,"能识别秋收起义的时间、领导者和旗号意义。","1927年9月毛泽东领导湘赣边界秋收起义，党第一次在武装斗争中公开打出工农革命军旗号。",[autumn]),
 t("cs-target-jinggangshan-base",groupStart,"能识别井冈山革命根据地的时间和地位。","1927年10月毛泽东创建井冈山革命根据地，是第一个农村革命根据地。",[jinggang]),
 t("cs-target-sanwan",groupBuild,"能识别三湾改编的建军意义与要点。","三湾改编从政治和组织上保证党对军队绝对领导，主要内容包括支部建在连上、官兵平等。",[sanwan]),
 t("cs-target-gutian",groupBuild,"能识别古田会议的时间地点和建军原则。","1929年福建上杭古田会议确立人民军队建设基本原则，提出建设无产阶级领导的新型人民军队。",[gutian]),
 t("cs-target-cpc-sixth",groupBuild,"能识别中共六大的时间地点和中心工作。","1928年中共六大在莫斯科举行，讨论社会与革命性质、形势与任务，强调群众工作、积蓄力量。",[sixth]),
 t("cs-target-central-soviet",groupBuild,"能识别中央苏区的基础、地位和临时中央政府线索。","1931年以赣南、闽西为基础建立全国最大的中央革命根据地；同年瑞金成立中华苏维埃共和国临时中央政府。",[soviet],["委员会人数不进入口诀。"]),
];
const addedQuestions=[
 question("nanchang-uprising-core","humanities-history",groupStart,"识别南昌起义","南昌起义的历史地位是？",["打响武装反抗国民党的第一枪，是独立领导革命战争和创建人民军队的开端","第一次提出反帝反封建最低纲领","标志第一次国共合作正式形成"],0,"1927年8月1日南昌起义对应第一枪和建军开端。","另两项对应中共二大、国民党一大。",[nanchang]),
 question("august-seventh-core","humanities-history",groupStart,"识别八七会议","八七会议确定的总方针是？",["土地革命和武装反抗国民党","联俄联共扶助农工","停止武装斗争并专做议会活动"],0,"八七会议确定土地革命和武装反抗国民党的总方针。","毛泽东提出枪杆子中取得政权。",[aug7]),
 question("autumn-harvest-core","humanities-history",groupStart,"识别秋收起义","秋收起义的重要标志是？",["党第一次在武装斗争中公开打出工农革命军旗号","打响武装反抗国民党的第一枪","建立全国最大的革命根据地"],0,"秋收起义第一次公开打出工农革命军旗号。","第一枪对应南昌起义，最大根据地对应中央苏区。",[autumn]),
 question("jinggangshan-core","humanities-history",groupStart,"识别井冈山根据地","中国第一个农村革命根据地是？",["井冈山革命根据地","中央苏区","陕甘宁边区"],0,"1927年毛泽东创建井冈山革命根据地。","中央苏区是全国最大革命根据地。",[jinggang]),
 question("land-uprisings-full","humanities-history",groupStart,"综合复辨土地革命早期节点","下列哪一项完整正确？",["南昌第一枪；八七定土地革命与武装反抗；秋收公开打出工农革命军旗号；井冈山为首个农村根据地","南昌提出最低纲领；八七形成第一次合作；秋收建立中央苏区","南昌发生于1935年；八七停止武装；井冈山是全国最大根据地"],0,"该项正确串起四个早期节点。","战斗过程不在本组。",[nanchang,aug7,autumn,jinggang]),
 question("sanwan-core","humanities-history",groupBuild,"识别三湾改编","三湾改编的核心建军意义是？",["从政治和组织上保证党对军队的绝对领导","标志共产党成立","提出最高和最低纲领"],0,"三湾改编保证党对军队绝对领导。","支部建在连上、官兵平等是主要内容。",[sanwan]),
 question("gutian-core","humanities-history",groupBuild,"识别古田会议","古田会议的主要成果是？",["确立人民军队建设基本原则，提出建设无产阶级领导的新型人民军队","决定个人身份加入国民党","确定土地革命和武装反抗总方针"],0,"1929年古田会议确立人民军队建设基本原则。","另两项对应中共三大和八七会议。",[gutian]),
 question("cpc-sixth-core","humanities-history",groupBuild,"识别中共六大","中共六大信息哪项正确？",["1928年在莫斯科举行，强调群众工作、积蓄力量","1927年在武汉召开，标志合作破裂","1931年在瑞金召开，成立临时中央政府"],0,"中共六大于1928年在莫斯科举行。","另两项混入中共五大和中央苏区。",[sixth]),
 question("central-soviet-core","humanities-history",groupBuild,"识别中央苏区","关于中央苏区，正确的是？",["1931年以赣南、闽西为基础建立，是全国最大的革命根据地；瑞金成立临时中央政府","1927年在井冈山建立，是第一个资产阶级革命团体","1935年在遵义建立，标志长征结束"],0,"中央苏区以赣南闽西为基础并为全国最大革命根据地。","不要与井冈山或遵义会议混淆。",[soviet]),
 question("land-building-full","humanities-history",groupBuild,"综合复辨建军与根据地","下列哪一项完整正确？",["三湾保证党对军队领导；古田确立建军原则；六大在莫斯科强调群众工作；中央苏区以赣南闽西为基础且为全国最大根据地","三湾标志建党；古田决定国共合作；六大在南京召开","三湾建立中央苏区；古田提出三民主义；中央苏区是第一个资产阶级团体"],0,"该项正确串起建军发展、六大和中央苏区。","过密组织数字留在正文。",[sanwan,gutian,sixth,soviet]),
];
const specs=[
 ["nanchang-uprising-core",["cs-target-nanchang-uprising"],"uprising-status",{1:"该项对应中共二大。",2:"该项对应国民党一大。"}],
 ["august-seventh-core",["cs-target-august-seventh"],"meeting-policy",{1:"该项对应国民党一大。",2:"与会议方针相反。"}],
 ["autumn-harvest-core",["cs-target-autumn-harvest"],"flag-status",{1:"第一枪对应南昌起义。",2:"最大根据地对应中央苏区。"}],
 ["jinggangshan-core",["cs-target-jinggangshan-base"],"first-rural-base",{1:"中央苏区为全国最大根据地。",2:"不属于正文第一个农村根据地。"}],
 ["land-uprisings-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"会议与事件意义均错配。",2:"年份、方针和根据地地位均错。"}],
 ["sanwan-core",["cs-target-sanwan"],"army-leadership",{1:"建党标志对应中共一大。",2:"纲领对应中共二大。"}],
 ["gutian-core",["cs-target-gutian"],"army-principles",{1:"该项对应中共三大。",2:"该项对应八七会议。"}],
 ["cpc-sixth-core",["cs-target-cpc-sixth"],"sixth-congress",{1:"地点和意义错配。",2:"该项对应中央苏区。"}],
 ["central-soviet-core",["cs-target-central-soviet"],"soviet-base",{1:"地点、地位与组织性质均错。",2:"时间、地点和事件均错。"}],
 ["land-building-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"各会议地点与作用均错。",2:"事件、思想和组织性质均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-nanchang-uprising":"nanchang-uprising-core","cs-target-august-seventh":"august-seventh-core","cs-target-autumn-harvest":"autumn-harvest-core","cs-target-jinggangshan-base":"jinggangshan-core","cs-target-sanwan":"sanwan-core","cs-target-gutian":"gutian-core","cs-target-cpc-sixth":"cpc-sixth-core","cs-target-central-soviet":"central-soviet-core"};
const phrase={"cs-target-nanchang-uprising":"八一南昌第一枪","cs-target-august-seventh":"八七汉口定土革武装","cs-target-autumn-harvest":"九月秋收举工农旗","cs-target-jinggangshan-base":"十月井冈首农村","cs-target-sanwan":"三湾支部连上党领军","cs-target-gutian":"古田确立建军原则","cs-target-cpc-sixth":"六大莫斯科群众积力量","cs-target-central-soviet":"赣南闽西中央苏区全国最大"};
const refs={"cs-target-nanchang-uprising":nanchang,"cs-target-august-seventh":aug7,"cs-target-autumn-harvest":autumn,"cs-target-jinggangshan-base":jinggang,"cs-target-sanwan":sanwan,"cs-target-gutian":gutian,"cs-target-cpc-sixth":sixth,"cs-target-central-soviet":soviet};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用时间、第一项、建军节点和根据地地位串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整战斗过程和组织数字","正文未展开的党史争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("land-uprisings-memory","土地革命早期四节点",groupStart,targets.slice(0,4),"land-uprisings-full"),memory("land-building-memory","建军与根据地",groupBuild,targets.slice(4),"land-building-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupStart?"land-uprisings-full":"land-building-full"]}));
const groups=[{id:groupStart,title:"土地革命早期起义与转折",scope:"humanities-history",reason:"按南昌、八七、秋收与井冈山构成时间主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupBuild,title:"建军原则与革命根据地",scope:"humanities-history",reason:"按三湾、古田、中共六大和中央苏区构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-land-revolution",pointId:"land-revolution",tabIds:["nanchang-uprising","august-seventh-meeting","autumn-harvest-uprising","sanwan-reorganization","jinggangshan-base","cpc-sixth-congress","gutian-meeting","central-soviet"],status:"已建设",batch:"C5-46",scope:"土地革命早期起义、建军原则和革命根据地；长征与诗作另批"},{candidateId:"history-long-march-zunyi",pointId:"land-revolution",tabIds:["red-army-long-march","zunyi-meeting","long-march-poems"],status:"可建设",batch:"C5-46",scope:"红军长征起止路线、遵义会议及长征诗作，可拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=52;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-46",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"eb494be4",toPackVersion:"2026-10-21.50",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-46 新增土地革命早期起义与建军、根据地两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
