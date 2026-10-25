// C5-49: Nationwide resistance battles, victory, Yan'an Rectification and Seventh Congress.
const {ref,question}=require("./learning-authoring");
const nationwide=ref("anti-japanese-liberation","nationwide-resistance","cs-1-9-p21-p22-nationwide-resistance-list");
const gBattles="nationwide-resistance-battles",gLater="anti-japanese-later-victory";
const T=(id,g,statement,conclusion,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文战役、指挥者、历史地位、时间与会议成果对应。"],excludes:["正文未展开的战史争议、完整战役过程和过密数字",...excludes],refs:[nationwide]});
const targets=[
 T("cs-target-shanghai-battle",gBattles,"能识别淞沪会战的规模与战略作用。","淞沪会战是整个中日战争中规模最大、战斗最惨烈的战役，粉碎日本三个月灭亡中国的计划。"),
 T("cs-target-pingxingguan",gBattles,"能识别平型关大捷的指挥力量与历史地位。","林彪率一一五师取得平型关大捷，是抗战以来首次大捷，打破日军不可战胜神话。"),
 T("cs-target-taierzhuang",gBattles,"能识别台儿庄战役的指挥者与地位。","徐州会战中李宗仁指挥台儿庄战役，是抗战以来取得的最大胜利。"),
 T("cs-target-wuhan-battle",gBattles,"能把武汉会战结束与战略相持阶段对应。","武汉会战结束后，中国抗日战争进入战略相持阶段。"),
 T("cs-target-hundred-regiments",gLater,"能识别百团大战的时间、指挥者和地位。","1940年下半年彭德怀指挥百团大战，是抗战时期中国共产党独立发动的规模最大、持续时间最长、战果最丰富的战役。"),
 T("cs-target-war-victory",gLater,"能识别日本投降与抗战胜利纪念日时间线。","1945年8月15日日本宣布无条件投降，9月2日签署投降书，9月3日为抗战胜利纪念日，10月25日台湾回归。",["受降细节不进入口诀。"]),
 T("cs-target-yanan-rectification",gLater,"能识别延安整风的时间、主要报告与结束标志。","延安整风是党史首次大规模整风；1942年正式开始，1945年六届七中全会通过《关于若干历史问题的决议》后结束。",["三大历史决议清单不进入口诀。"]),
 T("cs-target-cpc-seventh",gLater,"能识别中共七大的时间地点、报告与思想成果。","1945年中共七大在延安举行，毛泽东作《论联合政府》，确立毛泽东思想为党的指导思想。",["三大优良作风留在正文。"]),
];
const addedQuestions=[
 question("shanghai-battle-core","humanities-history",gBattles,"识别淞沪会战","粉碎日本“三个月灭亡中国”计划的是？",["淞沪会战","武汉会战","百团大战"],0,"淞沪会战粉碎日本三个月灭亡中国的计划。","武汉会战后进入相持阶段。",[nationwide]),
 question("pingxingguan-core","humanities-history",gBattles,"识别平型关大捷","抗战以来首次大捷、打破日军不可战胜神话的是？",["平型关大捷","台儿庄战役","淞沪会战"],0,"林彪率一一五师取得平型关大捷。","台儿庄被正文称为抗战以来最大胜利。",[nationwide]),
 question("taierzhuang-core","humanities-history",gBattles,"识别台儿庄战役","李宗仁指挥、被称为抗战以来最大胜利的是？",["台儿庄战役","平型关大捷","武汉会战"],0,"徐州会战中的台儿庄战役由李宗仁指挥。","首次大捷对应平型关。",[nationwide]),
 question("wuhan-battle-core","humanities-history",gBattles,"识别战略相持阶段","哪场会战结束后抗战进入战略相持阶段？",["武汉会战","淞沪会战","徐州会战"],0,"武汉会战结束后抗战进入战略相持阶段。","其他会战的正文地位不同。",[nationwide]),
 question("resistance-battles-full","humanities-history",gBattles,"综合复辨抗战会战","下列哪一项完整正确？",["淞沪粉碎三个月计划；平型关为首次大捷；台儿庄为最大胜利；武汉会战后进入战略相持","淞沪为首次大捷；平型关为最大胜利；台儿庄后进入相持","武汉粉碎三个月计划；台儿庄由彭德怀指挥；平型关发生于1945年"],0,"该项正确区分四场会战的代表性地位。","战役过程与兵力数字留在正文。",[nationwide]),
 question("hundred-regiments-core","humanities-history",gLater,"识别百团大战","百团大战信息哪项正确？",["1940年下半年彭德怀指挥，是中共独立发动的规模最大等战役","1937年李宗仁指挥，是抗战首次大捷","1945年林彪指挥，标志抗战结束"],0,"百团大战由彭德怀于1940年下半年指挥。","首次大捷和最大胜利分别对应其他战役。",[nationwide]),
 question("war-victory-core","humanities-history",gLater,"识别抗战胜利时间线","抗战胜利时间线正确的是？",["8月15日日本宣布投降，9月2日签投降书，9月3日为胜利纪念日","7月7日日本投降，8月15日为胜利纪念日","9月18日签投降书，12月13日台湾回归"],0,"正文明确8月15日宣布、9月2日签字、9月3日纪念。","台湾于10月25日回归。",[nationwide]),
 question("yanan-rectification-core","humanities-history",gLater,"识别延安整风","延安整风信息哪项正确？",["党史首次大规模整风，1942年正式开始，1945年历史问题决议后结束","1935年在遵义开始，标志长征结束","1940年由国民政府发动，确立三民主义"],0,"1942年毛泽东相关报告推动整风正式开始，1945年决议后结束。","不混入遵义或国民党线索。",[nationwide]),
 question("cpc-seventh-core","humanities-history",gLater,"识别中共七大","中共七大的思想成果是？",["确立毛泽东思想为党的指导思想","首次提出反帝反封建最低纲领","确定土地革命和武装反抗总方针"],0,"1945年延安中共七大确立毛泽东思想为指导思想。","另两项对应中共二大和八七会议。",[nationwide]),
 question("anti-later-full","humanities-history",gLater,"综合复辨抗战后期","下列哪一项完整正确？",["彭德怀指挥百团大战；1945年8月15日日本宣布投降；延安整风以历史问题决议收束；七大确立毛泽东思想","李宗仁指挥百团大战；9月18日为胜利纪念日；七大提出三民主义","百团大战标志抗战结束；延安整风由国民政府发动；七大在南京召开"],0,"该项正确串起战役、胜利、整风和七大。","详细受降及历史决议清单留在正文。",[nationwide]),
];
const specs=[
 ["shanghai-battle-core",["cs-target-shanghai-battle"],"battle-effect",{1:"武汉会战对应相持阶段。",2:"百团大战地位不同。"}],
 ["pingxingguan-core",["cs-target-pingxingguan"],"first-victory",{1:"台儿庄为最大胜利。",2:"淞沪粉碎三个月计划。"}],
 ["taierzhuang-core",["cs-target-taierzhuang"],"largest-victory",{1:"平型关为首次大捷。",2:"武汉会战对应相持阶段。"}],
 ["wuhan-battle-core",["cs-target-wuhan-battle"],"stalemate-stage",{1:"淞沪地位不同。",2:"徐州会战地位不同。"}],
 ["resistance-battles-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"四场战役地位错配。",2:"作用、指挥者和时间均错。"}],
 ["hundred-regiments-core",["cs-target-hundred-regiments"],"hundred-regiments",{1:"人物、年份与地位均错。",2:"人物、年份与结果均错。"}],
 ["war-victory-core",["cs-target-war-victory"],"victory-timeline",{1:"七七不是投降日期。",2:"日期与事件均错。"}],
 ["yanan-rectification-core",["cs-target-yanan-rectification"],"rectification",{1:"时间、地点和意义均错。",2:"主体和思想均错。"}],
 ["cpc-seventh-core",["cs-target-cpc-seventh"],"seventh-congress",{1:"该项对应中共二大。",2:"该项对应八七会议。"}],
 ["anti-later-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"人物、纪念日和思想均错。",2:"战役、整风主体和地点均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-shanghai-battle":"shanghai-battle-core","cs-target-pingxingguan":"pingxingguan-core","cs-target-taierzhuang":"taierzhuang-core","cs-target-wuhan-battle":"wuhan-battle-core","cs-target-hundred-regiments":"hundred-regiments-core","cs-target-war-victory":"war-victory-core","cs-target-yanan-rectification":"yanan-rectification-core","cs-target-cpc-seventh":"cpc-seventh-core"};
const phrase={"cs-target-shanghai-battle":"淞沪粉碎三个月","cs-target-pingxingguan":"平型首次破神话","cs-target-taierzhuang":"徐州宗仁最大胜","cs-target-wuhan-battle":"武汉会后战略持","cs-target-hundred-regiments":"四零彭总百团党独立","cs-target-war-victory":"八一五投降，九二签字九三纪念","cs-target-yanan-rectification":"四二整风，四五决议收束","cs-target-cpc-seventh":"四五延安七大立毛思想"};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用战役地位、人物和时间线串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整战役过程、过密数字和决议清单"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[nationwide],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("resistance-battles-memory","四场抗战会战",gBattles,targets.slice(0,4),"resistance-battles-full"),memory("anti-later-memory","抗战后期与胜利",gLater,targets.slice(4),"anti-later-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gBattles?"resistance-battles-full":"anti-later-full"]}));
const groups=[{id:gBattles,title:"全民族抗战代表性会战",scope:"humanities-history",reason:"区分淞沪、平型关、台儿庄和武汉会战的正文地位。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gLater,title:"抗战后期、胜利与党内建设",scope:"humanities-history",reason:"按百团大战、胜利时间线、延安整风和七大构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-nationwide-resistance",pointId:"anti-japanese-liberation",tabIds:["nationwide-resistance"],status:"已建设",batch:"C5-49",scope:"代表性会战、百团大战、胜利时间线、延安整风和中共七大；排除战役过程和过密数字"},{candidateId:"history-liberation-war",pointId:"liberation-war",status:"可建设",batch:"C5-49",scope:"解放战争主线，下一批按来源页签拆分最多两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=55;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-49",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"cdcd7dda",toPackVersion:"2026-10-21.53",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-49 新增全民族抗战会战与抗战后期、胜利两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
