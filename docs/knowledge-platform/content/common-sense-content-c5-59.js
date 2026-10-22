// C5-59: Mirage, rainbow and secondary rainbow.
const {ref,question}=require("./learning-authoring");
const life=ref("optics","life-optics","cs-16-22-p12-life-optical-phenomena-list");
const gMirage="optics-mirage",gRainbow="optics-rainbow-secondary";
const T=(id,g,statement,conclusion)=>({id,revision:1,status:"review",scope:"science-technology",groupId:g,statement,conclusion,conditions:["按正文成因、像的性质、色序和方位关系对应。"],excludes:["大气分层计算、气象预测和光路作图"],refs:[life]});
const targets=[
 T("cs-target-mirage-alias",gMirage,"能识别海市蜃楼的别称。","海市蜃楼又称蜃景。"),
 T("cs-target-mirage-cause",gMirage,"能识别海市蜃楼的光学成因。","海市蜃楼由光的折射和全反射形成。"),
 T("cs-target-mirage-image",gMirage,"能识别海市蜃楼所成像的性质。","地球上物体反射的光经大气折射形成虚像。"),
 T("cs-target-mirage-locations",gMirage,"能识别海市蜃楼常见地点。","平静海面、大江江面、湖面、雪原、沙漠或戈壁是正文所列常见地点。"),
 T("cs-target-rainbow-cause",gRainbow,"能识别彩虹的形成过程。","阳光照射雨点，经折射和反射形成拱形七彩光谱。"),
 T("cs-target-rainbow-order",gRainbow,"能识别主虹由外到内色序。","主虹由外到内为红、橙、黄、绿、蓝、靛、紫。"),
 T("cs-target-secondary-rainbow",gRainbow,"能识别副虹的形成和色序。","副虹又称霓，较暗，位于主虹外侧，由阳光在水滴中两次反射形成，色序与主虹相反。"),
 T("cs-target-rainbow-sun-position",gRainbow,"能识别太阳与彩虹方位关系。","雨后太阳在东则彩虹在西，太阳在西则彩虹在东。"),
];
const addedQuestions=[
 question("mirage-alias-core","science-technology",gMirage,"识别蜃景别称","海市蜃楼又称？",["蜃景","霓","丁达尔现象"],0,"海市蜃楼又称蜃景。","霓是副虹。",[life]),
 question("mirage-cause-core","science-technology",gMirage,"识别蜃景成因","海市蜃楼主要由什么形成？",["光的折射和全反射","只由漫反射","光沿直线传播且不改变方向"],0,"正文将其归于折射和全反射。","不作大气分层计算。",[life]),
 question("mirage-image-core","science-technology",gMirage,"识别蜃景像的性质","关于海市蜃楼所成像，正确的是？",["物体反射光经大气折射形成的虚像","由物体本身移动形成的实像","由镜面直接投射出的实物"],0,"蜃景是经大气折射形成的虚像。","看到影像不代表物体位于影像处。",[life]),
 question("mirage-locations-core","science-technology",gMirage,"识别蜃景地点","哪组均是正文所列海市蜃楼常见地点？",["海面、湖面、雪原、沙漠","密闭地下室、金属内部、真空容器","仅城市室内和隧道"],0,"正文列出水面、雪原、沙漠和戈壁等地。","本题只按正文列举。",[life]),
 question("mirage-full","science-technology",gMirage,"综合复辨海市蜃楼","下列哪一项完整正确？",["蜃景由折射和全反射形成，是经大气折射形成的虚像，常见于海面或沙漠等地","蜃景就是霓，只由镜面反射形成","蜃景是物体实际悬浮形成的实像"],0,"该项正确串起名称、成因、像和地点。","不涉及具体气象条件。",[life]),
 question("rainbow-cause-core","science-technology",gRainbow,"识别彩虹成因","彩虹形成的正文表述是？",["阳光进入雨点后发生折射和反射","月光只发生漫反射","阳光不进入水滴而沿直线传播"],0,"阳光在雨点中经折射和反射形成彩虹。","本题不展开色散计算。",[life]),
 question("rainbow-order-core","science-technology",gRainbow,"识别主虹色序","主虹由外到内的颜色顺序是？",["红橙黄绿蓝靛紫","紫靛蓝绿黄橙红","红黄蓝绿橙靛紫"],0,"正文给出的主虹由外到内是红橙黄绿蓝靛紫。","不要把副虹的反向色序套入。",[life]),
 question("secondary-rainbow-core","science-technology",gRainbow,"识别副虹","关于副虹（霓），正确的是？",["位于主虹外侧、较暗，由两次反射形成，色序与主虹相反","位于主虹内侧且更亮，色序相同","只由直线传播形成，不经过水滴"],0,"正文列出位置、明暗、两次反射和反向色序。","不展开水滴内完整光路。",[life]),
 question("rainbow-sun-position-core","science-technology",gRainbow,"识别虹与太阳方位","雨后太阳在东边时，彩虹通常在？",["西边","东边","正上方且与太阳同向"],0,"正文指出太阳与彩虹分处相反方向。","只考正文东西方位关系。",[life]),
 question("rainbow-secondary-full","science-technology",gRainbow,"综合复辨虹霓","下列哪一项完整正确？",["主虹外红内紫；霓位于外侧且较暗、色序相反；太阳和彩虹方向相反","主虹外紫内红；霓更亮且色序相同","彩虹只由反射形成，太阳和彩虹方向相同"],0,"该项正确对应主虹、霓和方位关系。","不涉及光谱波长计算。",[life]),
];
const specs=[
 ["mirage-alias-core",["cs-target-mirage-alias"],"mirage-alias",{1:"霓是副虹。",2:"丁达尔现象属于散射。"}],
 ["mirage-cause-core",["cs-target-mirage-cause"],"mirage-cause",{1:"成因不止漫反射。",2:"蜃景涉及方向改变。"}],
 ["mirage-image-core",["cs-target-mirage-image"],"mirage-image",{1:"不是物体移动形成的实像。",2:"影像不是实物。"}],
 ["mirage-locations-core",["cs-target-mirage-locations"],"mirage-locations",{1:"正文未列这些地点。",2:"正文并非仅列室内。"}],
 ["mirage-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"霓、反射与蜃景错配。",2:"蜃景不是实物悬浮。"}],
 ["rainbow-cause-core",["cs-target-rainbow-cause"],"rainbow-cause",{1:"正文主体和过程均错。",2:"彩虹需水滴中的方向变化。"}],
 ["rainbow-order-core",["cs-target-rainbow-order"],"rainbow-order",{1:"该项为反向色序。",2:"颜色次序错误。"}],
 ["secondary-rainbow-core",["cs-target-secondary-rainbow"],"secondary-rainbow",{1:"位置、明暗和色序均错。",2:"霓形成需水滴内反射。"}],
 ["rainbow-sun-position-core",["cs-target-rainbow-sun-position"],"sun-position",{1:"太阳与彩虹方向相反。",2:"正文不是同向关系。"}],
 ["rainbow-secondary-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"主虹与霓的色序、明暗均错。",2:"形成过程和方位均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-mirage-alias":"mirage-alias-core","cs-target-mirage-cause":"mirage-cause-core","cs-target-mirage-image":"mirage-image-core","cs-target-mirage-locations":"mirage-locations-core","cs-target-rainbow-cause":"rainbow-cause-core","cs-target-rainbow-order":"rainbow-order-core","cs-target-secondary-rainbow":"secondary-rainbow-core","cs-target-rainbow-sun-position":"rainbow-sun-position-core"};
const phrase={"cs-target-mirage-alias":"海市蜃楼又叫蜃景","cs-target-mirage-cause":"折射全反成蜃景","cs-target-mirage-image":"大气折出物体虚像","cs-target-mirage-locations":"水面雪原沙漠见","cs-target-rainbow-cause":"阳光入雨滴，折射又反射","cs-target-rainbow-order":"主虹外红内紫","cs-target-secondary-rainbow":"霓在外、较暗、两反、色序反","cs-target-rainbow-sun-position":"太阳东虹西，太阳西虹东"};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"science-technology",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"按成因、像或色序与方位成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文光学过程和相对关系记忆，口诀只作检索线索。"],excludes:["光路作图、大气分层计算和气象预测"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[life],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("mirage-memory","海市蜃楼",gMirage,targets.slice(0,4),"mirage-full"),memory("rainbow-secondary-memory","彩虹与霓",gRainbow,targets.slice(4),"rainbow-secondary-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gMirage?"mirage-full":"rainbow-secondary-full"]}));
const groups=[{id:gMirage,title:"海市蜃楼",scope:"science-technology",reason:"按别称、成因、虚像和常见地点建立完整判断。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gRainbow,title:"彩虹与霓",scope:"science-technology",reason:"按形成过程、色序、明暗与太阳方位区分。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"science-optics-life",pointId:"optics",tabIds:["life-optics"],status:"已拆分",batch:"C5-59",scope:"拆为海市蜃楼与虹霓、三原色与物体颜色"},{candidateId:"science-optics-life-phenomena",pointId:"optics",tabIds:["life-optics"],status:"已建设",batch:"C5-59",scope:"海市蜃楼、彩虹与副虹的成因、色序和方位；排除定量光路"},{candidateId:"science-optics-colors",pointId:"optics",tabIds:["life-optics"],status:"可建设",batch:"C5-59",scope:"光与颜料三原色、透明和不透明物体颜色，下一批建设"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=65;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-59",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"cc75c7fb",toPackVersion:"2026-10-21.63",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-59 新增海市蜃楼、彩虹与霓两个生活光学主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
