// C5-25: bounded legendary-history associations from the restored body.
const {ref,question}=require("./learning-authoring");
const source=ref("prehistoric-civilization","prehistoric-3","cs-1-9-p2-flame-yellow-yao-shun-yu-list");
const groupBattles="prehistoric-legend-battles",groupRule="prehistoric-abdication-water";
const t=(id,groupId,statement,conclusion,conditions,excludes)=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions,excludes,refs:[source]});
const targets=[
 t("cs-target-yanhuang-ancestors",groupBattles,"能识别炎黄子孙与炎帝、黄帝的对应。","炎指炎帝，黄指黄帝，正文称二者为人文始祖。",["按正文传说时代口径。"],["不作考古年代断言。"]),
 t("cs-target-banquan-battle",groupBattles,"能把阪泉之战与黄帝战胜炎帝、部落融合对应。","阪泉之战后部落融合，正文据此连接华夏族。",["只记人物和结果。"],["不扩展具体战场细节。"]),
 t("cs-target-zhuolu-battle",groupBattles,"能把涿鹿之战与炎黄联合对蚩尤对应。","炎帝、黄帝部落联合与蚩尤部落战于涿鹿。",["与阪泉之战区分。"],["不使用指南车补充材料出题。"]),
 t("cs-target-abdication-system",groupRule,"能识别尧舜禹时期禅让制的推选含义。","各部落首领推选部落联盟首领称禅让制。",["按正文制度定义。"],["不等同世袭制。"]),
 t("cs-target-dayu-water-control",groupRule,"能识别大禹治水由堵改疏与三过家门不入。","大禹吸取鲧的失败教训，改用疏导并长期治水。",["按正文核心线索。"],["不扩展工程地理细节。"]),
];
const addedQuestions=[
 question("prehistoric-yanhuang","humanities-history",groupBattles,"识别炎黄含义","“炎黄子孙”中的“炎”和“黄”分别指谁？",["炎帝与黄帝","尧与舜","禹与鲧"],0,"炎指炎帝，黄指黄帝。","按正文传说时代口径识别。",[source]),
 question("prehistoric-banquan","humanities-history",groupBattles,"识别阪泉之战","正文中黄帝打败炎帝、随后部落融合对应哪场战事？",["涿鹿之战","阪泉之战","牧野之战"],1,"阪泉之战对应黄帝打败炎帝。","涿鹿之战对应炎黄联合对蚩尤。",[source]),
 question("prehistoric-zhuolu","humanities-history",groupBattles,"识别涿鹿之战","炎帝和黄帝部落联合对抗蚩尤，对应哪场战事？",["阪泉之战","鸣条之战","涿鹿之战"],2,"炎黄联合对蚩尤对应涿鹿之战。","不要和阪泉之战混淆。",[source]),
 question("prehistoric-legend-battles-full","humanities-history",groupBattles,"综合复辨炎黄两战","下列哪一项完整正确？",["炎黄指炎帝黄帝；阪泉是黄帝对炎帝；涿鹿是炎黄联合对蚩尤","阪泉是炎黄联合对蚩尤；涿鹿是黄帝对炎帝","炎黄指尧舜；两场战事都与蚩尤无关"],0,"该项正确区分人物称谓和两场战事。","不使用正文补充的指南车故事出题。",[source]),
 question("prehistoric-abdication","humanities-history",groupRule,"识别禅让制","尧舜禹时期，各部落首领推选部落联盟首领的制度称为什么？",["世袭制","禅让制","分封制"],1,"正文把推选部落联盟首领称为禅让制。","禅让制不等同世袭制。",[source]),
 question("prehistoric-dayu-water","humanities-history",groupRule,"识别大禹治水","大禹治水从鲧的失败中吸取教训，核心方法发生了什么变化？",["由堵改为疏导","由疏导改为只堵","完全停止治理"],0,"正文强调由堵改为疏导。","三过家门而不入用于连接其长期治水。",[source]),
 question("prehistoric-abdication-water-full","humanities-history",groupRule,"综合复辨禅让治水","下列哪一项正确？",["禅让制是推选联盟首领；大禹治水由堵改疏并有三过家门不入的故事","禅让制就是父子世袭；大禹只用堵水","禅让制与尧舜禹无关"],0,"该项正确连接制度含义和治水方法。","不扩展未列出的工程细节。",[source]),
];
const specs=[
 ["prehistoric-yanhuang",["cs-target-yanhuang-ancestors"],"yanhuang",{1:"尧舜不对应炎黄称谓。",2:"禹鲧不对应炎黄称谓。"}],
 ["prehistoric-banquan",["cs-target-banquan-battle"],"banquan",{0:"涿鹿对应炎黄联合对蚩尤。",2:"牧野之战属于商周更替。"}],
 ["prehistoric-zhuolu",["cs-target-zhuolu-battle"],"zhuolu",{0:"阪泉对应黄帝战胜炎帝。",1:"鸣条之战不属于本组。"}],
 ["prehistoric-legend-battles-full",targets.slice(0,3).map(x=>x.id),"full-recheck",{1:"阪泉与涿鹿人物关系反置。",2:"炎黄称谓和战事关系均错误。"}],
 ["prehistoric-abdication",["cs-target-abdication-system"],"abdication",{0:"世袭制不是推选联盟首领。",2:"分封制不是本处制度定义。"}],
 ["prehistoric-dayu-water",["cs-target-dayu-water-control"],"water-control",{1:"正文方向相反。",2:"正文记载持续治理。"}],
 ["prehistoric-abdication-water-full",targets.slice(3).map(x=>x.id),"full-recheck",{1:"禅让与治水方法均错误。",2:"正文明确把禅让与尧舜禹相连。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-yanhuang-ancestors":"prehistoric-yanhuang","cs-target-banquan-battle":"prehistoric-banquan","cs-target-zhuolu-battle":"prehistoric-zhuolu","cs-target-abdication-system":"prehistoric-abdication","cs-target-dayu-water-control":"prehistoric-dayu-water"};
const phrase={"cs-target-yanhuang-ancestors":"炎帝黄帝称炎黄","cs-target-banquan-battle":"阪泉黄帝胜炎帝","cs-target-zhuolu-battle":"涿鹿炎黄对蚩尤","cs-target-abdication-system":"首领推选叫禅让","cs-target-dayu-water-control":"大禹改疏三过不入"};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"人物、战事与制度线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文传说时代口径。"],excludes:["考古年代断言","指南车等补充故事"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[source],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("prehistoric-battles-memory","炎黄与阪泉涿鹿",groupBattles,targets.slice(0,3),"prehistoric-legend-battles-full"),memory("prehistoric-abdication-water-memory","禅让与大禹治水",groupRule,targets.slice(3),"prehistoric-abdication-water-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupBattles?"prehistoric-legend-battles-full":"prehistoric-abdication-water-full"]}));
const groups=[{id:groupBattles,title:"炎黄与阪泉涿鹿",scope:"humanities-history",reason:"按人物关系区分两场战事。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupRule,title:"禅让与大禹治水",scope:"humanities-history",reason:"制度定义与治水方法分开记忆。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-prehistoric-legends",pointId:"prehistoric-civilization",tabIds:["prehistoric-3"],status:"已建设",batch:"C5-25",scope:"炎黄称谓、阪泉涿鹿、禅让与大禹治水；排除补充故事"},{candidateId:"history-xia-shang-zhou-core",pointId:"legendary-xia-shang",tabIds:["dynasties"],status:"可建设",batch:"C5-25",scope:"夏商西周更替与关键节点，按朝代拆成小组"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=31;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-25",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"cc32da5c",toPackVersion:"2026-10-21.29",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-25 新增炎黄战事、禅让与大禹治水两个主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
