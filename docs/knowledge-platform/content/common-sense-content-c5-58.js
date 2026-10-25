// C5-58: Straight propagation/reflection and refraction/total reflection/scattering.
const {ref,question}=require("./learning-authoring");
const propagation=ref("optics","light-propagation","cs-16-22-p11-p12-light-propagation-list");
const gReflection="optics-propagation-reflection",gRefraction="optics-refraction-scattering";
const T=(id,g,statement,conclusion)=>({id,revision:1,status:"review",scope:"science-technology",groupId:g,statement,conclusion,conditions:["按正文定义、介质条件和典型现象对应。"],excludes:["光路作图、定量角度计算和仪器结构推导"],refs:[propagation]});
const targets=[
 T("cs-target-light-straight-condition",gReflection,"能识别光沿直线传播的条件。","光在同种均匀介质中沿直线传播。"),
 T("cs-target-light-straight-examples",gReflection,"能识别直线传播现象。","影子、小孔成像、日食、月食和激光准直属于正文所列直线传播现象。"),
 T("cs-target-light-reflection-definition",gReflection,"能识别光的反射定义。","光在两种物质分界面改变传播方向，又返回原来物质。"),
 T("cs-target-specular-diffuse",gReflection,"能区分镜面反射和漫反射。","光滑面使平行入射光仍平行反射；粗糙面使光向各方向反射。"),
 T("cs-target-light-refraction-definition",gRefraction,"能识别光的折射定义。","光从一种透明介质斜射入另一种透明介质，在交界处改变传播方向。"),
 T("cs-target-lens-mirror-functions",gRefraction,"能区分正文所列透镜与面镜功能。","凸透镜会聚、凹透镜发散；凸面镜常作后视镜，凹面镜常作反光罩。"),
 T("cs-target-total-reflection",gRefraction,"能识别全反射条件和应用。","光从较高折射率介质进入较低折射率介质且入射角超过临界角时发生全反射，光纤利用该现象。"),
 T("cs-target-light-scattering",gRefraction,"能识别散射定义和典型现象。","光通过不均匀介质时部分光偏离原方向；蓝天、雾中朦胧和丁达尔现象属于正文示例。"),
];
const addedQuestions=[
 question("light-straight-condition-core","science-technology",gReflection,"识别直线传播条件","光沿直线传播的正文条件是？",["同种均匀介质中","任何介质和界面中","只在真空中"],0,"光在同种均匀介质中沿直线传播。","条件不能省略。",[propagation]),
 question("light-straight-examples-core","science-technology",gReflection,"识别直线传播现象","哪组均属于正文所列光的直线传播现象？",["影子、小孔成像、日食","水中筷子弯折、海市蜃楼、光纤","镜中像、潜望镜、倒影"],0,"三项均由直线传播解释。","另两组分别偏向折射、全反射或反射。",[propagation]),
 question("light-reflection-definition-core","science-technology",gReflection,"识别反射定义","光的反射是指？",["光在分界面改变方向并返回原物质","光斜射入另一透明介质后改变方向","光通过不均匀介质时偏离原方向"],0,"返回原来物质是反射的关键。","不要与折射、散射混淆。",[propagation]),
 question("specular-diffuse-core","science-technology",gReflection,"区分镜面漫反射","关于镜面反射与漫反射，正确的是？",["光滑面常形成同向平行反射，粗糙面使光向各方向反射","两者都要求粗糙表面","漫反射不会使人看到物体"],0,"表面是否光滑决定反射方向分布。","漫反射仍遵循反射规律。",[propagation]),
 question("propagation-reflection-full","science-technology",gReflection,"综合复辨传播与反射","下列哪一项完整正确？",["影子体现直线传播；光返回原物质属于反射；光滑面常见镜面反射","小孔成像属于折射；光进入另一介质才叫反射","粗糙面只向一个方向反射；潜望镜属于散射"],0,"该项正确串起传播条件与两类反射。","本题不作光路角度计算。",[propagation]),
 question("light-refraction-definition-core","science-technology",gRefraction,"识别折射定义","光的折射是指？",["光从一种透明介质斜射入另一透明介质时在交界处改变方向","光在原物质中返回","光在同种均匀介质中始终弯曲"],0,"斜射、透明介质和交界处改变方向是核心。","不要与反射混淆。",[propagation]),
 question("lens-mirror-functions-core","science-technology",gRefraction,"区分透镜面镜功能","哪组对应正确？",["凸透镜会聚、凹透镜发散、凸面镜常作汽车后视镜","凸透镜发散、凹透镜会聚、凹面镜常作后视镜","凸面镜会聚、凹面镜发散、两种透镜作用相同"],0,"正文分别列出透镜的会聚发散和面镜应用。","本题只考正文所列基础对应。",[propagation]),
 question("total-reflection-core","science-technology",gRefraction,"识别全反射","关于全反射，正确的是？",["从较高折射率介质进入较低折射率介质且入射角超过临界角，光纤可利用它","任何两介质间都会发生，潜望镜利用它","只要进入高折射率介质就会发生"],0,"介质方向与临界角条件必须同时满足。","不展开临界角计算。",[propagation]),
 question("light-scattering-core","science-technology",gRefraction,"识别散射","哪项属于正文所列光的散射现象？",["晴天天空呈蓝色","水中筷子看似弯折","镜中形成像"],0,"蓝天是正文所列散射应用。","另两项分别属于折射和反射。",[propagation]),
 question("refraction-scattering-full","science-technology",gRefraction,"综合复辨折射全反射散射","下列哪一项完整正确？",["水中筷子弯折属折射；光纤利用全反射；丁达尔现象属散射","水中筷子弯折属反射；光纤利用漫反射；丁达尔现象属直线传播","后视镜使用凹透镜；蓝天只由镜面反射形成"],0,"该项正确对应三类传播现象。","不涉及定量光路。",[propagation]),
];
const specs=[
 ["light-straight-condition-core",["cs-target-light-straight-condition"],"straight-condition",{1:"忽略同种均匀条件。",2:"光也可在其他同种均匀介质中直线传播。"}],
 ["light-straight-examples-core",["cs-target-light-straight-examples"],"straight-examples",{1:"该组主要是折射或全反射。",2:"该组主要是反射。"}],
 ["light-reflection-definition-core",["cs-target-light-reflection-definition"],"reflection-definition",{1:"该项是折射。",2:"该项是散射。"}],
 ["specular-diffuse-core",["cs-target-specular-diffuse"],"reflection-types",{1:"两类表面条件不同。",2:"漫反射使不同方向可见物体。"}],
 ["propagation-reflection-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"现象和定义错配。",2:"表面与现象错配。"}],
 ["light-refraction-definition-core",["cs-target-light-refraction-definition"],"refraction-definition",{1:"该项是反射。",2:"同种均匀介质中沿直线传播。"}],
 ["lens-mirror-functions-core",["cs-target-lens-mirror-functions"],"lens-mirror",{1:"会聚发散和后视镜均错。",2:"透镜与面镜功能错配。"}],
 ["total-reflection-core",["cs-target-total-reflection"],"total-reflection",{1:"全反射有介质和角度条件，潜望镜属反射应用。",2:"介质方向和角度条件不完整。"}],
 ["light-scattering-core",["cs-target-light-scattering"],"scattering",{1:"该项是折射。",2:"该项是反射。"}],
 ["refraction-scattering-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"三类现象均错配。",2:"器件和蓝天成因均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-light-straight-condition":"light-straight-condition-core","cs-target-light-straight-examples":"light-straight-examples-core","cs-target-light-reflection-definition":"light-reflection-definition-core","cs-target-specular-diffuse":"specular-diffuse-core","cs-target-light-refraction-definition":"light-refraction-definition-core","cs-target-lens-mirror-functions":"lens-mirror-functions-core","cs-target-total-reflection":"total-reflection-core","cs-target-light-scattering":"light-scattering-core"};
const phrase={"cs-target-light-straight-condition":"同种均匀走直线","cs-target-light-straight-examples":"影孔日月准直线","cs-target-light-reflection-definition":"碰界返回是反射","cs-target-specular-diffuse":"光滑同向粗糙散","cs-target-light-refraction-definition":"斜入异透介质折","cs-target-lens-mirror-functions":"凸透聚凹透散，凸面后视凹面罩","cs-target-total-reflection":"高到低、过临界，光纤全反射","cs-target-light-scattering":"介质不匀光偏行，蓝天雾朦丁达尔"};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"science-technology",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"按传播条件、方向变化和典型现象成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文条件与现象对应，口诀只作检索线索。"],excludes:["光路作图、角度计算和仪器结构推导"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[propagation],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("propagation-reflection-memory","直线传播与反射",gReflection,targets.slice(0,4),"propagation-reflection-full"),memory("refraction-scattering-memory","折射、全反射与散射",gRefraction,targets.slice(4),"refraction-scattering-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gReflection?"propagation-reflection-full":"refraction-scattering-full"]}));
const groups=[{id:gReflection,title:"直线传播与反射",scope:"science-technology",reason:"按传播条件、返回原介质和表面特征区分。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gRefraction,title:"折射、全反射与散射",scope:"science-technology",reason:"按介质条件、方向变化和典型现象区分。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"science-optics-propagation",pointId:"optics",tabIds:["light-propagation"],status:"已建设",batch:"C5-58",scope:"直线传播、反射、折射、透镜面镜、全反射与散射；排除定量光路"},{candidateId:"science-optics-life",pointId:"optics",tabIds:["life-optics"],status:"可建设",batch:"C5-58",scope:"海市蜃楼、虹霓、三原色和物体颜色，后续继续拆分"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=64;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-58",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"a0bf0ebc",toPackVersion:"2026-10-21.62",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-58 新增直线传播与反射、折射全反射与散射两个科技主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
