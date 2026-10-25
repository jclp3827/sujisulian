// C5-29: Qin and Western Han backbone.
const {ref,question}=require("./learning-authoring");
const qin=ref("qin-han","qin","cs-1-9-p4-qin-list");
const han=ref("qin-han","western-han","cs-1-9-p4-p5-western-han-list");
const groupQin="qin-dynasty-backbone",groupHan="western-han-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文关键节点配对。"],excludes:["故事化典故",...excludes],refs});
const targets=[
 t("cs-target-qin-founding",groupQin,"能把嬴政灭六国、建立秦朝与定都咸阳对应。","秦王嬴政灭六国后建立秦朝，定都咸阳。",[qin],["不使用封建国家性质标签出题。"]),
 t("cs-target-qin-governance",groupQin,"能识别秦朝政治制度骨架。","皇帝制度、三公九卿制和郡县制构成正文政治制度骨架。",[qin]),
 t("cs-target-qin-unification",groupQin,"能识别秦朝统一度量衡、货币和文字。","经济文化统一抓度量衡、圆形方孔钱和小篆。",[qin]),
 t("cs-target-qin-fall-wars",groupQin,"能区分大泽乡起义、巨鹿之战与楚汉战争的人物线索。","陈胜吴广起义于大泽乡；项羽对应巨鹿；秦亡后刘邦项羽进行楚汉战争。",[qin],["不使用第一次农民战争等绝对排名。"]),
 t("cs-target-western-han-founding",groupHan,"能把刘邦、长安和西汉建立对应。","刘邦称帝，定都长安，史称西汉。",[han]),
 t("cs-target-wenjing-rule",groupHan,"能把文帝景帝、无为而治与文景之治对应。","文帝、景帝实行无为而治，正文称文景之治。",[han]),
 t("cs-target-hanwu-measures",groupHan,"能把汉武帝时期思想、边疆、丝路和推恩令线索分别对应人物。","董仲舒与儒术、卫青霍去病与匈奴、张骞与西域丝路、主父偃与推恩令。",[han]),
 t("cs-target-western-han-late",groupHan,"能区分汉宣帝设西域都护与王莽建新。","汉宣帝时期始设西域都护；王莽废西汉末帝后建立新朝。",[han],["不使用疆域归属评价出题。"]),
];
const addedQuestions=[
 question("qin-founding","humanities-history",groupQin,"识别秦朝建立","灭六国后建立秦朝并定都咸阳的是谁？",["嬴政","刘邦","王莽"],0,"秦王嬴政灭六国后建立秦朝，定都咸阳。","不使用国家性质标签判断。",[qin]),
 question("qin-governance","humanities-history",groupQin,"识别秦朝政治制度","下列哪组属于正文列出的秦朝政治制度骨架？",["皇帝制度、三公九卿制、郡县制","禅让制、分封制、科举制","行省制、内阁制、军机处"],0,"正文政治部分列出皇帝制度、三公九卿制、郡县制。","后世制度不混入。",[qin]),
 question("qin-unification","humanities-history",groupQin,"识别秦朝统一措施","正文中秦朝经济文化统一措施包括什么？",["统一度量衡、圆形方孔钱和小篆","统一使用甲骨文并废除货币","只修长城，不统一度量衡"],0,"正文列出统一度量衡、货币和文字，小篆为文字线索。","本题不评价政策效果。",[qin]),
 question("qin-fall-wars","humanities-history",groupQin,"区分秦末三条线","下列人物与事件配对正确的是？",["陈胜吴广—大泽乡起义；项羽—巨鹿之战；刘邦项羽—楚汉战争","陈胜吴广—牧野之战；项羽—文景之治；刘邦—盘庚迁殷","王莽—大泽乡起义；张骞—巨鹿之战"],0,"正文依次连接大泽乡起义、巨鹿之战和楚汉战争。","典故和绝对排名不进入本题。",[qin]),
 question("qin-dynasty-full","humanities-history",groupQin,"综合复辨秦朝骨架","下列哪一项完整正确？",["嬴政建秦都咸阳；政治抓皇帝三公九卿郡县；统一度量衡货币文字；秦末区分大泽乡、巨鹿和楚汉战争","刘邦建秦都长安；秦朝实行科举；统一措施只有修长城","王莽建秦；项羽主持文景之治"],0,"该项正确串起建立、制度、统一与秦末战争。","不加入故事化典故。",[qin]),
 question("western-han-founding","humanities-history",groupHan,"识别西汉建立","正文中建立西汉、定都长安并称汉高祖的是谁？",["刘邦","汉武帝","王莽"],0,"刘邦称帝，定都长安，史称西汉。","本题只识别建立线索。",[han]),
 question("wenjing-rule","humanities-history",groupHan,"识别文景之治","文帝、景帝实行无为而治形成的治世称什么？",["文景之治","贞观之治","开元盛世"],0,"正文把文帝景帝无为而治对应文景之治。","不跨朝代混用治世名称。",[han]),
 question("hanwu-measures","humanities-history",groupHan,"识别汉武帝人物措施","下列哪组配对完整正确？",["董仲舒—儒术；卫青霍去病—匈奴；张骞—西域丝路；主父偃—推恩令","董仲舒—都江堰；张骞—初税亩；主父偃—盘庚迁殷","卫青霍去病—文景之治；张骞—三公九卿"],0,"该项按正文对应汉武帝时期四组人物线索。","河西四郡等补充内容不纳入。",[han]),
 question("western-han-late","humanities-history",groupHan,"区分西汉后期节点","下列哪项正确？",["汉宣帝时期始设西域都护；王莽建立新朝","汉景帝建立新朝；王莽始设西域都护","刘邦建立新朝；张骞废西汉末帝"],0,"西域都护对应汉宣帝时期，王莽建立新朝。","不使用疆域归属评价出题。",[han]),
 question("western-han-full","humanities-history",groupHan,"综合复辨西汉骨架","下列哪一项完整正确？",["刘邦都长安建西汉；文景无为而治；汉武帝人物措施各有对应；宣帝设西域都护，王莽建新","王莽建西汉；文景实行商鞅变法；张骞颁推恩令","刘邦设西域都护；汉宣帝建新朝"],0,"该项正确串联西汉建立、治世、汉武帝措施与后期节点。","不加入绝对疆域判断。",[han]),
];
const specs=[
 ["qin-founding",["cs-target-qin-founding"],"founding",{1:"刘邦建立西汉。",2:"王莽建立新朝。"}],
 ["qin-governance",["cs-target-qin-governance"],"governance",{1:"三项制度并非秦朝政治骨架。",2:"这些属于后世制度。"}],
 ["qin-unification",["cs-target-qin-unification"],"unification",{1:"正文不是这一表述。",2:"正文还列有度量衡、货币和文字统一。"}],
 ["qin-fall-wars",["cs-target-qin-fall-wars"],"fall-wars",{1:"人物与时代均错配。",2:"王莽、张骞不对应秦末两事件。"}],
 ["qin-dynasty-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"建立者、制度和统一内容错误。",2:"人物朝代错配。"}],
 ["western-han-founding",["cs-target-western-han-founding"],"founding",{1:"汉武帝不是西汉建立者。",2:"王莽建立新朝。"}],
 ["wenjing-rule",["cs-target-wenjing-rule"],"wenjing",{1:"贞观之治属于唐。",2:"开元盛世属于唐。"}],
 ["hanwu-measures",["cs-target-hanwu-measures"],"hanwu",{1:"人物与制度工程均错配。",2:"人物与历史阶段错配。"}],
 ["western-han-late",["cs-target-western-han-late"],"late",{1:"两项主体反置。",2:"人物与事件错误。"}],
 ["western-han-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"建立、治世和人物措施均错配。",2:"宣帝与王莽事件反置。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-qin-founding":"qin-founding","cs-target-qin-governance":"qin-governance","cs-target-qin-unification":"qin-unification","cs-target-qin-fall-wars":"qin-fall-wars","cs-target-western-han-founding":"western-han-founding","cs-target-wenjing-rule":"wenjing-rule","cs-target-hanwu-measures":"hanwu-measures","cs-target-western-han-late":"western-han-late"};
const phrase={"cs-target-qin-founding":"嬴政建秦都咸阳","cs-target-qin-governance":"皇帝三公郡县","cs-target-qin-unification":"度量衡钱文同","cs-target-qin-fall-wars":"陈吴起、项羽巨鹿、刘项楚汉","cs-target-western-han-founding":"刘邦长安建西汉","cs-target-wenjing-rule":"文景无为成治世","cs-target-hanwu-measures":"董儒卫霍匈张丝主推恩","cs-target-western-han-late":"宣帝都护王莽新"};
const refs={"cs-target-qin-founding":qin,"cs-target-qin-governance":qin,"cs-target-qin-unification":qin,"cs-target-qin-fall-wars":qin,"cs-target-western-han-founding":han,"cs-target-wenjing-rule":han,"cs-target-hanwu-measures":han,"cs-target-western-han-late":han};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"建立、制度与转折节点串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文骨架记忆。"],excludes:["故事化典故","绝对排名与疆域评价"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("qin-dynasty-memory","秦朝四条骨架",groupQin,targets.slice(0,4),"qin-dynasty-full"),memory("western-han-memory","西汉四段主线",groupHan,targets.slice(4),"western-han-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupQin?"qin-dynasty-full":"western-han-full"]}));
const groups=[{id:groupQin,title:"秦朝建立制度与秦末",scope:"humanities-history",reason:"按建立、制度、统一和秦末战争构成四条骨架。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupHan,title:"西汉建立治世与转折",scope:"humanities-history",reason:"按建立、文景、汉武与后期节点串联。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-qin-han-core",pointId:"qin-han",tabIds:["qin","western-han"],status:"已建设",batch:"C5-29",scope:"秦与西汉关键节点；排除典故、绝对排名与疆域评价"},{candidateId:"history-eastern-han-economy",pointId:"qin-han",tabIds:["eastern-han","qin-han-economy"],status:"可建设",batch:"C5-29",scope:"东汉关键节点与秦汉社会经济，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=35;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-29",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"53b37065",toPackVersion:"2026-10-21.33",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-29 新增秦与西汉两个历史骨架主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
