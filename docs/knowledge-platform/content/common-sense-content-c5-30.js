// C5-30: Eastern Han backbone and Qin-Han economy.
const {ref,question}=require("./learning-authoring");
const east=ref("qin-han","eastern-han","cs-1-9-p5-eastern-han-list");
const economy=ref("qin-han","qin-han-economy","cs-1-9-p5-qin-han-economy-list");
const groupEast="eastern-han-backbone",groupEconomy="qin-han-economy-core";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文人物、事件和技术用途配对。"],excludes:["补充典故与宣传性评价",...excludes],refs});
const targets=[
  t("cs-target-eastern-han-founding",groupEast,"能把刘秀、光武帝、洛阳与东汉建立对应。","公元25年刘秀即皇帝位，后定都洛阳，史称东汉。",[east]),
  t("cs-target-guangwu-revival",groupEast,"能识别光武中兴的帝王和基本含义。","刘秀称帝后采取安抚的统治方法，社会繁荣，史称光武中兴。",[east]),
  t("cs-target-yellow-turban",groupEast,"能把张角与东汉末年的黄巾起义对应。","东汉末年张角号召百姓起义，起义者头扎黄巾，史称黄巾起义。",[east],["不考口号原文。"]),
  t("cs-target-eastern-han-sequence",groupEast,"能按建立、治世、末年起义排列东汉主线。","主线顺序为刘秀建立东汉、光武中兴、张角发动黄巾起义。",[east]),
  t("cs-target-qin-han-agriculture",groupEconomy,"能识别秦汉农业技术的人物与名称。","赵过推广牛耕并创造耦犁；毕岚造龙骨水车，又叫翻车；代田法是汉代耕作技术突破。",[economy]),
  t("cs-target-qin-han-water-blast",groupEconomy,"能把杜诗、水排和水力鼓风冶铁对应。","东汉杜诗发明水排，利用水力鼓风冶铁。",[economy]),
  t("cs-target-qin-han-paper",groupEconomy,"能区分西汉麻纸与东汉蔡伦改进造纸术。","西汉时期已有麻纸，东汉蔡伦进一步改进造纸术。",[economy]),
  t("cs-target-lingqu",groupEconomy,"能把史禄、灵渠和秦统一后的开凿对应。","秦统一后，史禄主持开凿灵渠。",[economy],["不扩展征服岭南的评价。"]),
];
const addedQuestions=[
  question("eastern-han-founding","humanities-history",groupEast,"识别东汉建立","建立东汉、后定都洛阳的是谁？",["刘秀","刘邦","王莽"],0,"公元25年刘秀即皇帝位，后定都洛阳，史称东汉。","本题只识别建立者和都城。",[east]),
  question("guangwu-revival","humanities-history",groupEast,"识别光武中兴","刘秀称帝后采取安抚的统治方法，社会繁荣，史称什么？",["光武中兴","文景之治","开元盛世"],0,"这一东汉治世称光武中兴。","不把其他朝代治世名称混入。",[east]),
  question("yellow-turban","humanities-history",groupEast,"识别黄巾起义","东汉末年号召百姓发动黄巾起义的人物是谁？",["张角","张骞","主父偃"],0,"正文把张角与东汉末年黄巾起义对应。","不考起义口号原文。",[east]),
  question("eastern-han-sequence","humanities-history",groupEast,"排列东汉主线","下列东汉主线顺序正确的是？",["刘秀建东汉—光武中兴—张角黄巾起义","张角建东汉—文景之治—刘秀黄巾起义","王莽建东汉—开元盛世—张骞起义"],0,"正文主线依次为东汉建立、光武中兴和东汉末年黄巾起义。","不加入昆阳之战等补充细节。",[east]),
  question("eastern-han-full","humanities-history",groupEast,"综合复辨东汉骨架","下列哪一项完整正确？",["刘秀建东汉并定都洛阳；其治世称光武中兴；东汉末年张角发动黄巾起义","刘邦建东汉并定都长安；张角开创文景之治","王莽建东汉；刘秀发动黄巾起义"],0,"该项正确串联建立、治世和末年起义。","不加入口号和典故。",[east]),
  question("qin-han-agriculture","humanities-history",groupEconomy,"识别秦汉农业技术","下列秦汉农业技术配对正确的是？",["赵过—耦犁；毕岚—龙骨水车（翻车）；代田法—汉代耕作技术突破","杜诗—耦犁；蔡伦—翻车；灵渠—代田法","史禄—麻纸；赵过—水排；毕岚—小篆"],0,"正文分别把赵过与耦犁、毕岚与翻车、代田法与耕作技术突破对应。","不评价各技术的历史排名。",[economy]),
  question("qin-han-water-blast","humanities-history",groupEconomy,"识别水排用途","东汉杜诗发明的水排主要利用水力做什么？",["鼓风冶铁","灌溉农田","改进造纸"],0,"水排利用水力鼓风冶铁。","不要把水排与灌溉用翻车混淆。",[economy]),
  question("qin-han-paper","humanities-history",groupEconomy,"区分造纸节点","下列关于秦汉造纸的表述正确的是？",["西汉已有麻纸，东汉蔡伦进一步改进造纸术","蔡伦在西汉发明麻纸，东汉不再改进","东汉杜诗改进造纸术，蔡伦发明水排"],0,"正文区分西汉已有麻纸与东汉蔡伦改进造纸术。","不将改进表述为首次发明。",[economy]),
  question("lingqu","humanities-history",groupEconomy,"识别灵渠人物","秦统一后主持开凿灵渠的是谁？",["史禄","李冰","郑国"],0,"正文把史禄与秦统一后开凿灵渠对应。","不把先秦其他水利工程人物混入。",[economy]),
  question("qin-han-economy-full","humanities-history",groupEconomy,"综合复辨秦汉经济技术","下列哪一项完整正确？",["赵过耦犁、毕岚翻车；杜诗水排鼓风冶铁；西汉麻纸、东汉蔡伦改进造纸；史禄开灵渠","赵过水排、杜诗翻车；蔡伦开灵渠；史禄改进造纸","毕岚耦犁；杜诗麻纸；赵过开灵渠"],0,"该项正确串起农业、手工业、造纸与水利人物。","只覆盖正文列出的技术配对。",[economy]),
];
const specs=[
  ["eastern-han-founding",["cs-target-eastern-han-founding"],"founding",{1:"刘邦建立西汉。",2:"王莽建立新朝。"}],
  ["guangwu-revival",["cs-target-guangwu-revival"],"revival",{1:"文景之治属于西汉。",2:"开元盛世属于唐。"}],
  ["yellow-turban",["cs-target-yellow-turban"],"uprising",{1:"张骞不对应黄巾起义。",2:"主父偃不对应黄巾起义。"}],
  ["eastern-han-sequence",["cs-target-eastern-han-sequence"],"sequence",{1:"人物、治世和事件均错配。",2:"人物与朝代均错配。"}],
  ["eastern-han-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"建立者、都城和治世均错误。",2:"建立与起义人物反置。"}],
  ["qin-han-agriculture",["cs-target-qin-han-agriculture"],"agriculture",{1:"人物、技术和工程均错配。",2:"人物与技术错配。"}],
  ["qin-han-water-blast",["cs-target-qin-han-water-blast"],"water-blast",{1:"灌溉用翻车不等于水排。",2:"水排不是造纸工具。"}],
  ["qin-han-paper",["cs-target-qin-han-paper"],"paper",{1:"正文不是这一时间和人物关系。",2:"杜诗与水排相关，蔡伦与改进造纸术相关。"}],
  ["lingqu",["cs-target-lingqu"],"water-project",{1:"李冰对应都江堰。",2:"郑国对应郑国渠。"}],
  ["qin-han-economy-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"人物与技术全部错配。",2:"人物与技术、工程错配。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-eastern-han-founding":"eastern-han-founding","cs-target-guangwu-revival":"guangwu-revival","cs-target-yellow-turban":"yellow-turban","cs-target-eastern-han-sequence":"eastern-han-sequence","cs-target-qin-han-agriculture":"qin-han-agriculture","cs-target-qin-han-water-blast":"qin-han-water-blast","cs-target-qin-han-paper":"qin-han-paper","cs-target-lingqu":"lingqu"};
const phrase={"cs-target-eastern-han-founding":"刘秀洛阳建东汉","cs-target-guangwu-revival":"安抚治世光武兴","cs-target-yellow-turban":"张角黄巾东汉末","cs-target-eastern-han-sequence":"建立中兴到黄巾","cs-target-qin-han-agriculture":"赵耦毕翻代田法","cs-target-qin-han-water-blast":"杜诗水排助冶铁","cs-target-qin-han-paper":"西汉麻纸蔡伦改","cs-target-lingqu":"史禄灵渠秦统一"};
const refs={"cs-target-eastern-han-founding":east,"cs-target-guangwu-revival":east,"cs-target-yellow-turban":east,"cs-target-eastern-han-sequence":east,"cs-target-qin-han-agriculture":economy,"cs-target-qin-han-water-blast":economy,"cs-target-qin-han-paper":economy,"cs-target-lingqu":economy};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"人物、事件与技术配对串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["补充典故与宣传性评价","未列入正文的技术细节"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("eastern-han-memory","东汉三段主线",groupEast,targets.slice(0,4),"eastern-han-full"),memory("qin-han-economy-memory","秦汉生产技术配对",groupEconomy,targets.slice(4),"qin-han-economy-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupEast?"eastern-han-full":"qin-han-economy-full"]}));
const groups=[{id:groupEast,title:"东汉建立中兴与末年",scope:"humanities-history",reason:"按建立、治世和末年起义构成东汉主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupEconomy,title:"秦汉农业手工业与水利",scope:"humanities-history",reason:"按农业、冶铁、造纸和水利建立人物技术配对。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-eastern-han-economy",pointId:"qin-han",tabIds:["eastern-han","qin-han-economy"],status:"已建设",batch:"C5-30",scope:"东汉关键节点与秦汉社会经济；排除补充典故、口号原文与技术评价"},{candidateId:"history-three-kingdoms-two-jin",pointId:"three-kingdoms-sui-tang",tabIds:["three-kingdoms","two-jin"],status:"可建设",batch:"C5-30",scope:"三国与两晋关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=36;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-30",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"8164ab55",toPackVersion:"2026-10-21.34",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-30 新增东汉与秦汉社会经济两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
