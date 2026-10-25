// C5-60: Primary colors and object colors.
const {ref,question}=require("./learning-authoring");
const life=ref("optics","life-optics","cs-16-22-p12-life-optical-phenomena-list");
const lightColors=ref("optics","life-optics","cs-16-22-p12-light-primary-colors-image");
const pigmentColors=ref("optics","life-optics","cs-16-22-p12-pigment-primary-colors-image");
const objectColors=ref("optics","life-optics","cs-16-22-p12-object-color-list");
const gPrimary="optics-primary-colors",gObject="optics-object-colors";
const T=(id,g,statement,conclusion,refs)=>({id,revision:1,status:"review",scope:"science-technology",groupId:g,statement,conclusion,conditions:["按正文文字和原图速记的颜色关系对应。"],excludes:["色彩空间、印刷模型和定量光谱分析"],refs});
const targets=[
 T("cs-target-light-primary-colors",gPrimary,"能识别光的三原色。","光的三原色是红、绿、蓝。",[life,lightColors]),
 T("cs-target-pigment-primary-colors",gPrimary,"能识别颜料的三原色。","颜料的三原色是红、黄、蓝。",[life,pigmentColors]),
 T("cs-target-light-color-mixing",gPrimary,"能识别三色光叠加关系。","红绿光叠加为黄，红蓝为品红，绿蓝为青，红绿蓝叠加为白。",[lightColors]),
 T("cs-target-pigment-color-mixing",gPrimary,"能识别三种颜料混合关系。","红黄颜料混合为橙，红蓝为紫，黄蓝为绿，三色混合为黑。",[pigmentColors]),
 T("cs-target-transparent-color",gObject,"能识别透明物体颜色的决定因素。","透明物体的颜色由透过它的色光颜色决定。",[objectColors]),
 T("cs-target-opaque-color",gObject,"能识别不透明物体颜色的决定因素。","不透明物体的颜色由它反射的色光颜色决定。",[objectColors]),
 T("cs-target-white-black-opaque",gObject,"能识别白色与黑色不透明物体对单色光的作用。","白色不透明物体反射所有单色光，黑色不透明物体吸收所有单色光。",[objectColors]),
 T("cs-target-red-clothes",gObject,"能解释正文中的红色衣服示例。","红色衣服反射红光并吸收其他色光。",[objectColors]),
];
const addedQuestions=[
 question("light-primary-colors-core","science-technology",gPrimary,"识别光的三原色","光的三原色是？",["红、绿、蓝","红、黄、蓝","青、品红、黄"],0,"光的三原色为红绿蓝。","不要与颜料三原色混淆。",[life,lightColors]),
 question("pigment-primary-colors-core","science-technology",gPrimary,"识别颜料三原色","颜料的三原色是？",["红、黄、蓝","红、绿、蓝","红、绿、黄"],0,"颜料三原色为红黄蓝。","不要套用三色光。",[life,pigmentColors]),
 question("light-color-mixing-core","science-technology",gPrimary,"识别色光叠加","三色光关系正确的是？",["红绿为黄，三色重叠为白","红黄为橙，三色重叠为黑","红蓝为紫，三色重叠为黑"],0,"原图显示红绿光叠加为黄，红绿蓝重叠为白。","橙紫绿与黑是颜料混合图的关系。",[lightColors]),
 question("pigment-color-mixing-core","science-technology",gPrimary,"识别颜料混合","三种颜料关系正确的是？",["红黄为橙，三色重叠为黑","红绿为黄，三色重叠为白","绿蓝为青，三色重叠为白"],0,"原图显示红黄颜料为橙，三色重叠为黑。","不要与色光叠加图混淆。",[pigmentColors]),
 question("primary-colors-full","science-technology",gPrimary,"综合复辨三原色","下列哪一项完整正确？",["色光三原色是红绿蓝，颜料三原色是红黄蓝；色光三色叠加为白，颜料三色混合为黑","两种三原色均为红黄蓝，混合结果均为白","色光三原色为青品红黄，颜料三色混合为白"],0,"该项正确区分两套三原色及混合结果。","本题只按正文与原图速记。",[life,lightColors,pigmentColors]),
 question("transparent-color-core","science-technology",gObject,"识别透明物体颜色","透明物体的颜色主要由什么决定？",["透过它的色光颜色","它吸收的全部色光","观察者衣服的颜色"],0,"透明物体颜色与透过色光相同。","本题按正文基础表述。",[objectColors]),
 question("opaque-color-core","science-technology",gObject,"识别不透明物体颜色","不透明物体的颜色主要由什么决定？",["它反射的色光颜色","透过它的色光颜色","它完全吸收的色光颜色"],0,"不透明物体颜色与反射色光相同。","不要套用透明物体的透过规则。",[objectColors]),
 question("white-black-opaque-core","science-technology",gObject,"识别白黑物体作用","关于白色和黑色不透明物体，正确的是？",["白色反射所有单色光，黑色吸收所有单色光","白色吸收所有单色光，黑色反射所有单色光","两者都只反射红光"],0,"正文补充给出白反射、黑吸收的关系。","本题限定不透明物体。",[objectColors]),
 question("red-clothes-core","science-technology",gObject,"解释红色衣服","白光下红色衣服呈红色，是因为它？",["反射红光并吸收其他色光","吸收红光并反射所有其他色光","让红光全部透过"],0,"红色衣服反射红光、吸收其他光。","衣服是不透明物体示例。",[objectColors]),
 question("object-colors-full","science-technology",gObject,"综合复辨物体颜色","下列哪一项完整正确？",["透明物体看透过光，不透明物体看反射光；白色不透明物体全反射，黑色不透明物体全吸收","透明和不透明物体都只由透过光决定","白色不透明物体全吸收，黑色不透明物体全反射"],0,"该项正确串起透明、不透明、白色和黑色规则。","本题只按正文基础规则。",[objectColors]),
];
const specs=[
 ["light-primary-colors-core",["cs-target-light-primary-colors"],"light-primary",{1:"该项是颜料三原色。",2:"正文未将该组列为色光三原色。"}],
 ["pigment-primary-colors-core",["cs-target-pigment-primary-colors"],"pigment-primary",{1:"该项是色光三原色。",2:"组合错误。"}],
 ["light-color-mixing-core",["cs-target-light-color-mixing"],"light-mixing",{1:"该项是颜料关系。",2:"紫和黑不是色光图关系。"}],
 ["pigment-color-mixing-core",["cs-target-pigment-color-mixing"],"pigment-mixing",{1:"该项是色光关系。",2:"该项是色光关系。"}],
 ["primary-colors-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"三原色与结果均错。",2:"两套模型错配。"}],
 ["transparent-color-core",["cs-target-transparent-color"],"transparent-color",{1:"透明物体看透过光。",2:"无关因素。"}],
 ["opaque-color-core",["cs-target-opaque-color"],"opaque-color",{1:"该规则属于透明物体。",2:"颜色由反射光决定。"}],
 ["white-black-opaque-core",["cs-target-white-black-opaque"],"white-black",{1:"白黑作用对调。",2:"两者不是都只反射红光。"}],
 ["red-clothes-core",["cs-target-red-clothes"],"red-clothes",{1:"反射吸收关系对调。",2:"衣服是不透明物体。"}],
 ["object-colors-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"透明与不透明规则不同。",2:"白黑作用对调。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-light-primary-colors":"light-primary-colors-core","cs-target-pigment-primary-colors":"pigment-primary-colors-core","cs-target-light-color-mixing":"light-color-mixing-core","cs-target-pigment-color-mixing":"pigment-color-mixing-core","cs-target-transparent-color":"transparent-color-core","cs-target-opaque-color":"opaque-color-core","cs-target-white-black-opaque":"white-black-opaque-core","cs-target-red-clothes":"red-clothes-core"};
const phrase={"cs-target-light-primary-colors":"光三原红绿蓝","cs-target-pigment-primary-colors":"颜三原红黄蓝","cs-target-light-color-mixing":"光三合白，红绿黄、红蓝品、绿蓝青","cs-target-pigment-color-mixing":"颜三合黑，红黄橙、红蓝紫、黄蓝绿","cs-target-transparent-color":"透明看透过","cs-target-opaque-color":"不透明看反射","cs-target-white-black-opaque":"白全反，黑全吸","cs-target-red-clothes":"红衣反红吸其他"};
const refsFor=id=>id.includes("transparent")||id.includes("opaque")||id.includes("clothes")?[objectColors]:id.includes("pigment")?[life,pigmentColors]:[life,lightColors];
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"science-technology",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"按颜色集合、混合结果或透过反射关系成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文文字和原图速记记忆，口诀只作检索线索。"],excludes:["色彩空间、印刷模型和定量光谱分析"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:refsFor(x.id),questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("primary-colors-memory","光与颜料三原色",gPrimary,targets.slice(0,4),"primary-colors-full"),memory("object-colors-memory","物体颜色",gObject,targets.slice(4),"object-colors-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gPrimary?"primary-colors-full":"object-colors-full"]}));
const groups=[{id:gPrimary,title:"光与颜料三原色",scope:"science-technology",reason:"区分两套三原色与正文原图所列混合结果。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gObject,title:"物体颜色",scope:"science-technology",reason:"按透过、反射、全反射和全吸收关系判断。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"science-optics-colors",pointId:"optics",tabIds:["life-optics"],status:"已建设",batch:"C5-60",scope:"光与颜料三原色、混合结果、透明与不透明物体颜色；排除专业色彩模型"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=66;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-60",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"e0c81ce1",toPackVersion:"2026-10-21.64",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-60 新增三原色与物体颜色两个科技主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
