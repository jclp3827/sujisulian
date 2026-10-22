// C5-57: Light basics, infrared and ultraviolet.
const {ref,question}=require("./learning-authoring");
const light=ref("optics","light-nature","cs-16-22-p10-p11-light-nature-list");
const gBasic="optics-light-basics",gInvisible="optics-infrared-ultraviolet";
const T=(id,g,statement,conclusion)=>({id,revision:1,status:"review",scope:"science-technology",groupId:g,statement,conclusion,conditions:["按正文物理量、波长关系和典型应用对应。"],excludes:["电磁波完整频谱、精密数值计算和医学安全建议"],refs:[light]});
const targets=[
 T("cs-target-light-electromagnetic",gBasic,"能识别光的本质。","光是一种电磁波。"),
 T("cs-target-light-year",gBasic,"能识别光年的物理量和定义。","光年是长度单位，指光在宇宙真空中沿直线传播一年经过的距离。"),
 T("cs-target-visible-light",gBasic,"能识别可见光定义。","可见光是电磁波谱中人眼可以感知的部分。"),
 T("cs-target-visible-order",gBasic,"能识别可见光波长与频率变化。","红橙黄绿青蓝紫按波长递减排列，频率递增。"),
 T("cs-target-infrared-wavelength",gInvisible,"能识别红外线的可见性与波长关系。","红外线波长比可见光长，人眼不能看到。"),
 T("cs-target-infrared-applications",gInvisible,"能识别红外线典型应用。","红外探测、遥控、热成像和加热干燥属于正文所列红外应用。"),
 T("cs-target-ultraviolet-wavelength",gInvisible,"能识别紫外线的可见性、波长和吸收。","紫外线波长比可见光短，人眼不能看到；太阳紫外线会被臭氧吸收。"),
 T("cs-target-ultraviolet-applications",gInvisible,"能识别紫外线典型应用。","杀菌、验钞和促进人体合成维生素D属于正文所列紫外应用。"),
];
const addedQuestions=[
 question("light-electromagnetic-core","science-technology",gBasic,"识别光的本质","光的本质是？",["电磁波","机械波","声波"],0,"光是一种电磁波。","本题不展开完整电磁波谱。",[light]),
 question("light-year-core","science-technology",gBasic,"识别光年","关于光年，正确的是？",["长度单位，表示光在真空中一年经过的距离","时间单位，等于一年","速度单位，表示光速"],0,"光年是长度单位。","名称含“年”不代表时间单位。",[light]),
 question("visible-light-core","science-technology",gBasic,"识别可见光","可见光是？",["电磁波谱中人眼可感知的部分","所有人眼不可见电磁波","只包含红外线和紫外线"],0,"可见光以人眼能够感知为边界。","红外和紫外均不可见。",[light]),
 question("visible-order-core","science-technology",gBasic,"识别可见光排列","红橙黄绿青蓝紫的变化关系是？",["波长递减、频率递增","波长和频率都递减","波长递增、频率递增"],0,"按红到紫，波长递减、频率递增。","本题只考正文给出的相对关系。",[light]),
 question("light-basics-full","science-technology",gBasic,"综合复辨光学基础","下列哪一项完整正确？",["光是电磁波；光年是长度单位；可见光人眼可感知；红到紫波长递减频率递增","光是机械波；光年是时间单位；红到紫波长递增","可见光人眼不可见；光年表示光速"],0,"该项正确串起四个基础目标。","不涉及精密数值换算。",[light]),
 question("infrared-wavelength-core","science-technology",gInvisible,"识别红外线波长","红外线的特点是？",["波长比可见光长，人眼不可见","波长比可见光短，人眼可见","与可见光波长完全相同"],0,"红外线波长较长且不可见。","不要与紫外线错配。",[light]),
 question("infrared-applications-core","science-technology",gInvisible,"识别红外应用","哪项是正文所列红外线应用？",["热成像仪","验钞","杀菌"],0,"热成像属于红外应用；验钞、杀菌属于紫外应用。","不作设备使用建议。",[light]),
 question("ultraviolet-wavelength-core","science-technology",gInvisible,"识别紫外线特点","紫外线特点正确的是？",["波长比可见光短，人眼不可见，部分被臭氧吸收","波长更长且人眼可见","只能由人工光源产生"],0,"紫外线较短、不可见，太阳是主要自然光源，臭氧可吸收。","本题不讨论暴露剂量。",[light]),
 question("ultraviolet-applications-core","science-technology",gInvisible,"识别紫外应用","哪组均为正文所列紫外线应用？",["杀菌、验钞、促进合成维生素D","遥控、热成像、加热干燥","潜望镜、后视镜、光纤"],0,"三项均属于正文所列紫外应用。","另两组分别属于红外或传播现象。",[light]),
 question("infrared-ultraviolet-full","science-technology",gInvisible,"综合复辨红外紫外","下列哪一项完整正确？",["红外波长较长，可用于热成像；紫外波长较短，可用于杀菌验钞，太阳紫外线会被臭氧吸收","红外较短用于验钞；紫外较长用于遥控","红外和紫外均为人眼可见光"],0,"该项正确区分波长关系和典型应用。","医学安全与剂量不在本组。",[light]),
];
const specs=[
 ["light-electromagnetic-core",["cs-target-light-electromagnetic"],"light-nature",{1:"光不是机械波。",2:"声波不是光。"}],
 ["light-year-core",["cs-target-light-year"],"light-year",{1:"光年不是时间单位。",2:"光年不是速度单位。"}],
 ["visible-light-core",["cs-target-visible-light"],"visible-light",{1:"该项定义不可见光。",2:"红外紫外均不可见。"}],
 ["visible-order-core",["cs-target-visible-order"],"visible-order",{1:"频率方向错误。",2:"波长方向错误。"}],
 ["light-basics-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"本质、单位和波长方向均错。",2:"可见性与单位均错。"}],
 ["infrared-wavelength-core",["cs-target-infrared-wavelength"],"infrared-wavelength",{1:"波长和可见性均错。",2:"波长关系错误。"}],
 ["infrared-applications-core",["cs-target-infrared-applications"],"infrared-app",{1:"验钞为紫外应用。",2:"杀菌为紫外应用。"}],
 ["ultraviolet-wavelength-core",["cs-target-ultraviolet-wavelength"],"ultraviolet-wavelength",{1:"波长和可见性均错。",2:"太阳是主要自然紫外光源。"}],
 ["ultraviolet-applications-core",["cs-target-ultraviolet-applications"],"ultraviolet-app",{1:"该组为红外应用。",2:"该组属于其他光学现象。"}],
 ["infrared-ultraviolet-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"波长与应用对调。",2:"两者均不可见。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-light-electromagnetic":"light-electromagnetic-core","cs-target-light-year":"light-year-core","cs-target-visible-light":"visible-light-core","cs-target-visible-order":"visible-order-core","cs-target-infrared-wavelength":"infrared-wavelength-core","cs-target-infrared-applications":"infrared-applications-core","cs-target-ultraviolet-wavelength":"ultraviolet-wavelength-core","cs-target-ultraviolet-applications":"ultraviolet-applications-core"};
const phrase={"cs-target-light-electromagnetic":"光是电磁波","cs-target-light-year":"光年是长度","cs-target-visible-light":"可见是人眼感知","cs-target-visible-order":"红到紫波减频增","cs-target-infrared-wavelength":"红外长而不可见","cs-target-infrared-applications":"探测遥控热成像加热","cs-target-ultraviolet-wavelength":"紫外短而不可见，臭氧吸","cs-target-ultraviolet-applications":"杀菌验钞维D"};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"science-technology",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"按物理量、波长关系和应用成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文基础关系记忆，口诀只作检索线索。"],excludes:["完整频谱、精密计算和医学安全建议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[light],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("light-basics-memory","光与可见光基础",gBasic,targets.slice(0,4),"light-basics-full"),memory("infrared-ultraviolet-memory","红外线与紫外线",gInvisible,targets.slice(4),"infrared-ultraviolet-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gBasic?"light-basics-full":"infrared-ultraviolet-full"]}));
const groups=[{id:gBasic,title:"光与可见光基础",scope:"science-technology",reason:"区分光的本质、光年、可见光和波长频率关系。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gInvisible,title:"红外线与紫外线",scope:"science-technology",reason:"按波长、可见性和典型应用对照。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"science-optics-nature-invisible",pointId:"optics",tabIds:["light-nature"],status:"已建设",batch:"C5-57",scope:"光的本质、光年、可见光、红外与紫外；排除完整频谱和医学建议"},{candidateId:"science-optics-propagation-life",pointId:"optics",tabIds:["light-propagation","life-optics"],status:"可建设",batch:"C5-57",scope:"光的传播与生活光学，后续按最多两个小主题继续拆分"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=63;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-57",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"72dc184f",toPackVersion:"2026-10-21.61",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-57 新增光学基础与红外紫外两个科技主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
