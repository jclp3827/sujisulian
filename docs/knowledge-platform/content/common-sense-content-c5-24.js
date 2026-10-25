// C5-24: two bounded prehistory themes built from the restored body.
const { ref, question } = require("./learning-authoring");
const oldStone = ref("prehistoric-civilization","prehistoric-1","cs-1-9-p1-old-stone-table");
const newStone = ref("prehistoric-civilization","prehistoric-2","cs-1-9-p1-p2-new-stone-table");
const groupOld="prehistoric-old-stone-core",groupNew="prehistoric-new-stone-core";
const t=(id,groupId,statement,conclusion,conditions,excludes,refs)=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions,excludes,refs});
const targets=[
 t("cs-target-prehistoric-yuanmou",groupOld,"能把元谋人与云南元谋、制造工具和用火对应。","元谋人在云南元谋发现，正文记载其会制造工具并知道用火。",["只按正文表格配对。"],["不据此扩展人类演化结论。"],[oldStone]),
 t("cs-target-prehistoric-peking",groupOld,"能把北京人与天然火、保存火种对应。","北京人会使用天然火并保存火种。",["与山顶洞人的人工取火区分。"],["不比较未列出的考古细节。"],[oldStone]),
 t("cs-target-prehistoric-caveman",groupOld,"能把山顶洞人与磨光钻孔、骨针、人工取火对应。","山顶洞人在打制石器基础上掌握磨光钻孔，制作骨针并会人工取火。",["按正文列举成果。"],["不扩展骨针的绝对年代断言。"],[oldStone]),
 t("cs-target-hemudu-rice",groupNew,"能把河姆渡文化与水稻、骨耜对应。","河姆渡文化位于长江流域下游以南，水稻种植工具抓骨耜。",["按正文地域与成果配对。"],["不使用最早等绝对排名。"],[newStone]),
 t("cs-target-hongshan-yangshao",groupNew,"能区分红山玉猪龙与仰韶粟黍、半坡。","红山抓玉猪龙，仰韶抓黄河中游、粟黍和半坡遗址。",["只做文化成果配对。"],["不扩展氏族社会阶段判断。"],[newStone]),
 t("cs-target-dawenkou-longshan",groupNew,"能区分大汶口丝织与龙山黑陶。","大汶口抓黑白陶与养蚕缫丝，龙山又称黑陶文化。",["按正文对照。"],["不推断两文化先后关系。"],[newStone]),
 t("cs-target-new-stone-regions",groupNew,"能按南北地域区分河姆渡与仰韶。","河姆渡在长江流域下游以南，仰韶在黄河中游。",["地域仅用于本组对照。"],["不覆盖全部新石器文化分布。"],[newStone]),
];
const addedQuestions=[
 question("prehistoric-yuanmou","humanities-history",groupOld,"识别元谋人","正文把云南元谋、会制造工具并知道用火对应哪类古人类？",["北京人","元谋人","山顶洞人"],1,"该组线索对应元谋人。","只按正文表格识别。",[oldStone]),
 question("prehistoric-peking-fire","humanities-history",groupOld,"识别北京人用火","会使用天然火并保存火种，对应哪类古人类？",["北京人","山顶洞人","河姆渡人"],0,"北京人的用火线索是天然火和保存火种。","山顶洞人对应人工取火。",[oldStone]),
 question("prehistoric-caveman-tech","humanities-history",groupOld,"识别山顶洞人技术","磨光、钻孔、骨针和人工取火共同指向哪类古人类？",["元谋人","北京人","山顶洞人"],2,"这些成果在正文中对应山顶洞人。","不扩展绝对年代结论。",[oldStone]),
 question("prehistoric-old-stone-full","humanities-history",groupOld,"综合复辨旧石器线索","下列配对哪一项完整正确？",["元谋人—云南元谋；北京人—保存天然火；山顶洞人—骨针和人工取火","元谋人—骨耜；北京人—玉猪龙；山顶洞人—黑陶文化","北京人—人工取火；山顶洞人—只会天然火"],0,"该项正确串联三类古人类的正文线索。","新石器文化成果不混入本组。",[oldStone]),
 question("prehistoric-hemudu","humanities-history",groupNew,"识别河姆渡文化","水稻与骨耜在正文中对应哪一文化？",["河姆渡文化","红山文化","龙山文化"],0,"河姆渡文化抓水稻与骨耜。","不使用绝对排名表述。",[newStone]),
 question("prehistoric-hongshan-yangshao","humanities-history",groupNew,"区分红山与仰韶","下列配对哪一项正确？",["红山—玉猪龙；仰韶—粟黍和半坡","红山—骨耜；仰韶—黑陶文化","红山—半坡；仰韶—玉猪龙"],0,"红山对应玉猪龙，仰韶对应粟黍和半坡。","只做正文成果配对。",[newStone]),
 question("prehistoric-dawenkou-longshan","humanities-history",groupNew,"区分大汶口与龙山","正文如何区分大汶口与龙山文化？",["大汶口抓养蚕缫丝，龙山抓黑陶文化","大汶口抓骨耜，龙山抓玉猪龙","二者都只对应水稻"],0,"大汶口与丝织线索相连，龙山又称黑陶文化。","不推断先后关系。",[newStone]),
 question("prehistoric-new-stone-region","humanities-history",groupNew,"区分南北地域","河姆渡文化与仰韶文化的地域配对正确的是？",["河姆渡—长江流域下游以南；仰韶—黄河中游","河姆渡—黄河中游；仰韶—长江流域下游以南","二者都只分布在山东"],0,"正文把河姆渡和仰韶分别放在长江流域下游以南与黄河中游。","不覆盖全部文化分布。",[newStone]),
 question("prehistoric-new-stone-full","humanities-history",groupNew,"综合复辨新石器文化","下列哪一项完整正确？",["河姆渡—水稻骨耜；红山—玉猪龙；仰韶—粟黍半坡；大汶口—丝织；龙山—黑陶","河姆渡—玉猪龙；仰韶—水稻骨耜；龙山—丝织","五种文化的代表成果完全相同"],0,"该项按正文正确配对五种文化。","不加入绝对最早等需独立核验的断言。",[newStone]),
];
const specs=[
 ["prehistoric-yuanmou",["cs-target-prehistoric-yuanmou"],"yuanmou",{0:"天然火与保存火种对应北京人。",2:"骨针与人工取火对应山顶洞人。"}],
 ["prehistoric-peking-fire",["cs-target-prehistoric-peking"],"peking",{1:"山顶洞人对应人工取火。",2:"河姆渡属于新石器文化。"}],
 ["prehistoric-caveman-tech",["cs-target-prehistoric-caveman"],"caveman",{0:"元谋人未对应这些成组技术。",1:"北京人的突出用火线索是天然火与保存火种。"}],
 ["prehistoric-old-stone-full",targets.slice(0,3).map(x=>x.id),"full-recheck",{1:"把新石器文化成果错配给古人类。",2:"北京人与山顶洞人的用火线索反置。"}],
 ["prehistoric-hemudu",["cs-target-hemudu-rice"],"hemudu",{1:"红山抓玉猪龙。",2:"龙山抓黑陶。"}],
 ["prehistoric-hongshan-yangshao",["cs-target-hongshan-yangshao"],"hongshan-yangshao",{1:"骨耜对应河姆渡，黑陶对应龙山。",2:"两项成果反置。"}],
 ["prehistoric-dawenkou-longshan",["cs-target-dawenkou-longshan"],"dawenkou-longshan",{1:"骨耜和玉猪龙分别对应河姆渡与红山。",2:"水稻不是二者共同唯一线索。"}],
 ["prehistoric-new-stone-region",["cs-target-new-stone-regions"],"regions",{1:"两处地域反置。",2:"正文并未如此表述。"}],
 ["prehistoric-new-stone-full",targets.slice(3).map(x=>x.id),"full-recheck",{1:"多项文化成果错配。",2:"各文化有不同代表线索。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-prehistoric-yuanmou":"prehistoric-yuanmou","cs-target-prehistoric-peking":"prehistoric-peking-fire","cs-target-prehistoric-caveman":"prehistoric-caveman-tech","cs-target-hemudu-rice":"prehistoric-hemudu","cs-target-hongshan-yangshao":"prehistoric-hongshan-yangshao","cs-target-dawenkou-longshan":"prehistoric-dawenkou-longshan","cs-target-new-stone-regions":"prehistoric-new-stone-region"};
const text={"cs-target-prehistoric-yuanmou":"元谋工具知用火","cs-target-prehistoric-peking":"北京天然存火种","cs-target-prehistoric-caveman":"山顶磨钻骨针人工火","cs-target-hemudu-rice":"河姆渡水稻骨耜","cs-target-hongshan-yangshao":"红山玉龙，仰韶粟半坡","cs-target-dawenkou-longshan":"大汶口丝，龙山黑陶","cs-target-new-stone-regions":"河姆渡长江，仰韶黄河"};
const refs={"cs-target-prehistoric-yuanmou":oldStone,"cs-target-prehistoric-peking":oldStone,"cs-target-prehistoric-caveman":oldStone,"cs-target-hemudu-rice":newStone,"cs-target-hongshan-yangshao":newStone,"cs-target-dawenkou-longshan":newStone,"cs-target-new-stone-regions":newStone};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>text[x.id]).join("；")+"。",method:"人物或文化与特征配对",coverage:list.map(x=>x.conclusion).join("；"),conditions:["只压缩正文明确配对。"],excludes:["绝对最早排名","未列考古争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:text[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("prehistoric-old-stone-memory","元谋北京山顶洞",groupOld,targets.slice(0,3),"prehistoric-old-stone-full"),memory("prehistoric-new-stone-memory","五种新石器文化",groupNew,targets.slice(3),"prehistoric-new-stone-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupOld?"prehistoric-old-stone-full":"prehistoric-new-stone-full"]}));
const groups=[{id:groupOld,title:"元谋、北京、山顶洞",scope:"humanities-history",reason:"按工具和用火线索区分三类古人类。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupNew,title:"五种新石器文化",scope:"humanities-history",reason:"按地域和代表成果配对，排除绝对最早断言。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-prehistoric-old-new",pointId:"prehistoric-civilization",tabIds:["prehistoric-1","prehistoric-2"],status:"已建设",batch:"C5-24",scope:"旧石器人物技术线索与新石器五文化配对；排除绝对最早断言"},{candidateId:"history-prehistoric-legends",pointId:"prehistoric-civilization",tabIds:["prehistoric-3"],status:"可建设",batch:"C5-24",scope:"炎黄、阪泉涿鹿、禅让与大禹治水，需继续按稳定事实拆组"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=30;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-24",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"d471226c",toPackVersion:"2026-10-21.28",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-24 新增史前时代两个边界明确主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
