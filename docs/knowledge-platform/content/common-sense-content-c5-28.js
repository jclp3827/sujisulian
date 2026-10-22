// C5-28: Pre-Qin institutions and social economy.
const {ref,question}=require("./learning-authoring");
const institutions=ref("legendary-xia-shang","pre-qin-institutions","cs-1-9-p3-p4-pre-qin-institutions-list");
const economy=ref("legendary-xia-shang","pre-qin-economy","cs-1-9-p4-pre-qin-economy-list");
const groupInstitutions="pre-qin-institutions-core",groupEconomy="pre-qin-economy-core";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文基础配对。"],excludes:["故事化补充",...excludes],refs});
const targets=[
 t("cs-target-pre-qin-four-systems",groupInstitutions,"能完整识别西周四项制度。","分封制、宗法制、井田制、礼乐制合称正文所列西周四大制度。",[institutions]),
 t("cs-target-pre-qin-zongfa",groupInstitutions,"能识别宗法制中的嫡庶与嫡长子继承。","大宗称嫡、小宗称庶，王位和财产由嫡长子继承。",[institutions],["不扩展全部宗法等级。"]),
 t("cs-target-pre-qin-tax-mu",groupInstitutions,"能把初税亩与鲁国按亩征税对应。","初税亩是鲁国实行的按亩征税田赋制度。",[institutions],["不使用封建制度萌芽的补充标签。"]),
 t("cs-target-pre-qin-iron-ox",groupEconomy,"能把铁农具和牛耕与春秋战国农业对应。","春秋战国时期开始使用并逐渐推广铁农具和牛耕。",[economy]),
 t("cs-target-houmuwu-ding",groupEconomy,"能把后母戊鼎与河南安阳、商周青铜文化对应。","后母戊鼎出土于河南安阳，是商周青铜文化代表作。",[economy],["不使用最大最重等排名结论。"]),
 t("cs-target-pre-qin-water-pairs",groupEconomy,"能区分芍陂和郑国渠的主持者。","孙叔敖修芍陂，郑国为秦国设计郑国渠。",[economy]),
 t("cs-target-dujiangyan-libing",groupEconomy,"能把李冰、秦国蜀守与都江堰对应。","战国秦国蜀守李冰修都江堰。",[economy],["不使用世界最古老等绝对排名。"]),
];
const addedQuestions=[
 question("pre-qin-four-systems","humanities-history",groupInstitutions,"识别西周四制","下列哪一组完整属于正文列出的西周四大制度？",["分封、宗法、井田、礼乐","县制、科举、行省、郡国","禅让、察举、九品、科举"],0,"正文列出分封制、宗法制、井田制、礼乐制。","本题只检验制度集合。",[institutions]),
 question("pre-qin-zongfa","humanities-history",groupInstitutions,"识别宗法嫡庶","按正文宗法制表述，下列哪项正确？",["大宗称嫡，小宗称庶，实行嫡长子继承","大宗称庶，小宗称嫡，由幼子继承","嫡庶与继承完全无关"],0,"正文把大宗、嫡和嫡长子继承相连。","不扩展全部宗法等级。",[institutions]),
 question("pre-qin-tax-mu","humanities-history",groupInstitutions,"识别初税亩","鲁国实行的按亩征税田赋制度称为什么？",["初税亩","井田制","九品中正制"],0,"正文将鲁国按亩征税对应初税亩。","不使用补充标签出题。",[institutions]),
 question("pre-qin-institutions-full","humanities-history",groupInstitutions,"综合复辨先秦制度","下列哪一项完整正确？",["西周四制含分封宗法井田礼乐；宗法抓嫡庶和嫡长子；鲁国按亩征税称初税亩","西周四制含科举行省；宗法由幼子继承；初税亩属于秦汉","初税亩就是禅让制，和田赋无关"],0,"该项正确连接制度集合、宗法继承和初税亩。","不把后世制度混入。",[institutions]),
 question("pre-qin-iron-ox","humanities-history",groupEconomy,"识别农业进步","春秋战国农业生产力发展的正文线索是什么？",["铁农具和牛耕逐渐推广","只使用骨针","蒸汽机广泛应用"],0,"正文把铁农具和牛耕与春秋战国农业相连。","不推断具体产量。",[economy]),
 question("pre-qin-houmuwu-ding","humanities-history",groupEconomy,"识别后母戊鼎","后母戊鼎的正文配对正确的是？",["河南安阳出土，商周青铜文化代表作","河姆渡出土的水稻工具","战国李冰主持的水利工程"],0,"后母戊鼎出土于河南安阳，是商周青铜文化代表作。","不使用最大最重排名出题。",[economy]),
 question("pre-qin-water-pairs","humanities-history",groupEconomy,"区分芍陂郑国渠","下列水利工程与人物配对正确的是？",["孙叔敖—芍陂；郑国—郑国渠","孙叔敖—都江堰；李冰—芍陂","郑国—后母戊鼎；李冰—郑国渠"],0,"正文配对为孙叔敖修芍陂、郑国设计郑国渠。","不加入工程年代排序。",[economy]),
 question("pre-qin-dujiangyan","humanities-history",groupEconomy,"识别李冰都江堰","战国时期修建都江堰的秦国蜀守是谁？",["李冰","孙叔敖","商鞅"],0,"战国秦国蜀守李冰修都江堰。","不使用世界最古老等绝对排名。",[economy]),
 question("pre-qin-economy-full","humanities-history",groupEconomy,"综合复辨先秦经济","下列哪一项完整正确？",["农业抓铁农具牛耕；青铜抓安阳后母戊鼎；水利抓孙叔敖芍陂、郑国渠和李冰都江堰","农业抓蒸汽机；后母戊鼎是水利工程；李冰修芍陂","铁农具、青铜器和水利工程都与先秦正文无关"],0,"该项正确串起农业、青铜和水利三条线。","绝对排名和口诀数字不进入本组。",[economy]),
];
const specs=[
 ["pre-qin-four-systems",["cs-target-pre-qin-four-systems"],"four-systems",{1:"这些是后世制度。",2:"该项跨越多个时期且不是西周四制。"}],
 ["pre-qin-zongfa",["cs-target-pre-qin-zongfa"],"zongfa",{1:"嫡庶与继承关系反置。",2:"正文明确连接嫡庶与继承。"}],
 ["pre-qin-tax-mu",["cs-target-pre-qin-tax-mu"],"tax-mu",{1:"井田制不是此处按亩征税名称。",2:"九品中正制属于后世选官制度。"}],
 ["pre-qin-institutions-full",targets.slice(0,3).map(x=>x.id),"full-recheck",{1:"制度时期和继承关系均错误。",2:"初税亩不是禅让制。"}],
 ["pre-qin-iron-ox",["cs-target-pre-qin-iron-ox"],"iron-ox",{1:"骨针属于史前工具线索。",2:"蒸汽机属于近代工业。"}],
 ["pre-qin-houmuwu-ding",["cs-target-houmuwu-ding"],"ding",{1:"河姆渡水稻工具是骨耜。",2:"都江堰是水利工程。"}],
 ["pre-qin-water-pairs",["cs-target-pre-qin-water-pairs"],"water-pairs",{1:"孙叔敖和李冰的工程错配。",2:"器物和水利人物错配。"}],
 ["pre-qin-dujiangyan",["cs-target-dujiangyan-libing"],"dujiangyan",{1:"孙叔敖对应芍陂。",2:"商鞅对应变法。"}],
 ["pre-qin-economy-full",targets.slice(3).map(x=>x.id),"full-recheck",{1:"农业、器物和水利关系均错配。",2:"正文明确列出这些先秦线索。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-pre-qin-four-systems":"pre-qin-four-systems","cs-target-pre-qin-zongfa":"pre-qin-zongfa","cs-target-pre-qin-tax-mu":"pre-qin-tax-mu","cs-target-pre-qin-iron-ox":"pre-qin-iron-ox","cs-target-houmuwu-ding":"pre-qin-houmuwu-ding","cs-target-pre-qin-water-pairs":"pre-qin-water-pairs","cs-target-dujiangyan-libing":"pre-qin-dujiangyan"};
const phrase={"cs-target-pre-qin-four-systems":"分宗井礼四制度","cs-target-pre-qin-zongfa":"大宗嫡、小宗庶、嫡长继","cs-target-pre-qin-tax-mu":"鲁国按亩称初税亩","cs-target-pre-qin-iron-ox":"春秋战国铁牛推","cs-target-houmuwu-ding":"安阳后母戊鼎","cs-target-pre-qin-water-pairs":"孙芍陂、郑国渠","cs-target-dujiangyan-libing":"蜀守李冰都江堰"};
const refs={"cs-target-pre-qin-four-systems":institutions,"cs-target-pre-qin-zongfa":institutions,"cs-target-pre-qin-tax-mu":institutions,"cs-target-pre-qin-iron-ox":economy,"cs-target-houmuwu-ding":economy,"cs-target-pre-qin-water-pairs":economy,"cs-target-dujiangyan-libing":economy};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"制度集合与人物事物配对",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文基础关系记忆。"],excludes:["绝对排名","故事化补充"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("pre-qin-institutions-memory","西周四制与初税亩",groupInstitutions,targets.slice(0,3),"pre-qin-institutions-full"),memory("pre-qin-economy-memory","铁牛青铜三水利",groupEconomy,targets.slice(3),"pre-qin-economy-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupInstitutions?"pre-qin-institutions-full":"pre-qin-economy-full"]}));
const groups=[{id:groupInstitutions,title:"西周四制与初税亩",scope:"humanities-history",reason:"制度集合、宗法继承与田赋名称分层记忆。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupEconomy,title:"铁牛、青铜与三水利",scope:"humanities-history",reason:"按农业、器物和水利人物配对。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-pre-qin-institutions-economy",pointId:"legendary-xia-shang",tabIds:["pre-qin-institutions","pre-qin-economy"],status:"已建设",batch:"C5-28",scope:"西周四制、宗法初税亩与先秦农业青铜水利；排除绝对排名"},{candidateId:"history-qin-han-core",pointId:"qin-han",tabIds:["qin","western-han"],status:"可建设",batch:"C5-28",scope:"秦与西汉关键节点，下一批最多拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=34;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-28",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"66823d66",toPackVersion:"2026-10-21.32",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-28 新增先秦制度与社会经济两个主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
