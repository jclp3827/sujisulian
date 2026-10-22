// C5-45: National Revolution, cooperation, mass movements and rupture.
const {ref,question}=require("./learning-authoring");
const third=ref("national-revolution","cpc-third-congress","cs-1-9-p18-cpc-third-congress-list");
const kmt=ref("national-revolution","kmt-first-congress","cs-1-9-p19-kmt-first-congress-list");
const fourth=ref("national-revolution","cpc-fourth-congress","cs-1-9-p19-cpc-fourth-congress-list");
const may30=ref("national-revolution","may-thirtieth-movement","cs-1-9-p19-may-thirtieth-movement-list");
const strike=ref("national-revolution","canton-hong-kong-strike","cs-1-9-p19-canton-hong-kong-strike-list");
const expedition=ref("national-revolution","northern-expedition","cs-1-9-p19-northern-expedition-list");
const rupture=ref("national-revolution","first-cooperation-break","cs-1-9-p19-first-cooperation-break-list");
const fifth=ref("national-revolution","cpc-fifth-congress","cs-1-9-p19-cpc-fifth-congress-list");
const groupCoop="national-revolution-cooperation",groupEnd="national-revolution-expedition-rupture";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文会议、年份、政策、运动与结果对应。"],excludes:["正文未展开的党史争议、完整人物名单和战争过程",...excludes],refs});
const targets=[
 t("cs-target-cpc-third",groupCoop,"能识别中共三大的时间地点与合作方式。","1923年中共三大在广州召开，决定共产党员以个人身份加入国民党实现合作，同时保持政治、思想和组织独立。",[third]),
 t("cs-target-kmt-first",groupCoop,"能识别国民党一大的政策和合作意义。","1924年国民党一大确立联俄、联共、扶助农工三大政策，发展新三民主义，标志第一次国共合作正式形成。",[kmt]),
 t("cs-target-cpc-fourth",groupCoop,"能识别中共四大的时间地点与主要议题。","1925年中共四大在上海召开，提出无产阶级领导权和农民同盟军问题，并规定党员3人以上可成立党支部。",[fourth]),
 t("cs-target-may30-strike",groupCoop,"能把五卅运动、省港大罢工与工人反帝运动高潮对应。","1925年五卅运动以工人阶级为主力掀起反帝爱国运动高潮，其中省港大罢工影响最大且持续1年零4个月。",[may30,strike],["镇压过程和具体伤亡不进入口诀。"]),
 t("cs-target-northern-expedition",groupEnd,"能识别北伐时间和主要对象。","1926年国民政府出师北伐，主要对象为吴佩孚、孙传芳和张作霖。",[expedition]),
 t("cs-target-cooperation-coups",groupEnd,"能识别第一次国共合作破裂的两次政变。","蒋介石、汪精卫先后发动四一二和七一五反革命政变。",[rupture]),
 t("cs-target-cooperation-break",groupEnd,"能把南京国民政府建立与第一次国共合作全面破裂对应。","政变后南京国民政府建立，第一次国共合作全面破裂。",[rupture]),
 t("cs-target-cpc-fifth",groupEnd,"能识别中共五大的时间地点和主要讨论。","1927年中共五大在武汉召开，讨论土地革命和革命发展方向，并批评陈独秀报告中的错误。",[fifth]),
];
const addedQuestions=[
 question("cpc-third-core","humanities-history",groupCoop,"识别中共三大","中共三大关于国共合作的决定是？",["共产党员以个人身份加入国民党，同时保持政治、思想和组织独立","共产党整体并入国民党并取消独立组织","拒绝任何形式的国共合作"],0,"三大决定以个人身份加入国民党实现合作并保持独立性。","整体并入或拒绝合作都不符合正文。",[third]),
 question("kmt-first-core","humanities-history",groupCoop,"识别国民党一大","国民党一大信息哪项正确？",["1924年确立联俄、联共、扶助农工政策，标志第一次国共合作正式形成","1923年提出反帝反封建最低纲领","1927年发动四一二和七一五政变"],0,"国民党一大确立三大政策并标志第一次合作形成。","另两项混入中共二大和合作破裂。",[kmt]),
 question("cpc-fourth-core","humanities-history",groupCoop,"识别中共四大","中共四大提出的核心问题包括？",["无产阶级领导权和农民同盟军","最高纲领与最低纲领","联俄联共扶助农工"],0,"中共四大明确提出领导权和农民同盟军问题。","另两项对应二大与国民党一大。",[fourth]),
 question("may30-strike-core","humanities-history",groupCoop,"识别五卅与省港罢工","五卅运动与省港大罢工的关系哪项正确？",["五卅运动形成以工人为主力的反帝高潮，省港大罢工影响最大并持续1年零4个月","五卅运动以军阀为主力，省港大罢工仅持续一天","省港大罢工早于五四运动且与五卅无关"],0,"省港大罢工是五卅运动高潮中影响最大的罢工。","本题只抓性质、关系和时长。",[may30,strike]),
 question("national-cooperation-full","humanities-history",groupCoop,"综合复辨合作形成与群众运动","下列哪一项完整正确？",["三大决定个人身份入国民党；国民党一大标志合作正式形成；四大提出领导权和农民同盟军；五卅形成工人反帝高潮","三大取消共产党独立；国民党一大标志合作破裂；四大提出最低纲领","三大在武汉召开；国民党一大没有扶助农工；五卅以军阀为主力"],0,"该项正确串起合作决定、正式形成、领导权问题和群众运动。","完整代表与镇压过程留在正文。",[third,kmt,fourth,may30,strike]),
 question("northern-expedition-core","humanities-history",groupEnd,"识别北伐","1926年北伐的主要对象是？",["吴佩孚、孙传芳、张作霖","袁世凯、段祺瑞、曹汝霖","康有为、梁启超、谭嗣同"],0,"北伐主要对象是吴佩孚、孙传芳、张作霖三个军阀。","不要与其他时期人物混淆。",[expedition]),
 question("cooperation-coups","humanities-history",groupEnd,"识别合作破裂政变","导致第一次国共合作破裂的两次政变是？",["四一二和七一五反革命政变","九一八和七七事变","武昌起义和护国运动"],0,"蒋介石、汪精卫先后发动四一二和七一五政变。","另两项属于其他历史阶段。",[rupture]),
 question("cooperation-break-core","humanities-history",groupEnd,"识别合作破裂结果","第一次国共合作全面破裂的结果线索是？",["反革命政变后南京国民政府建立，合作全面破裂","国民党一大召开，合作正式形成","中共三大召开，拒绝合作"],0,"南京国民政府建立与第一次国共合作全面破裂相连。","国民党一大对应合作形成。",[rupture]),
 question("cpc-fifth-core","humanities-history",groupEnd,"识别中共五大","中共五大信息哪项正确？",["1927年武汉召开，讨论土地革命和革命方向并批评陈独秀报告错误","1925年上海召开，首次提出最高最低纲领","1924年广州召开，标志第一次合作形成"],0,"1927年武汉中共五大讨论土地革命等问题。","另两项混入二大与国民党一大。",[fifth]),
 question("national-end-full","humanities-history",groupEnd,"综合复辨北伐与合作破裂","下列哪一项完整正确？",["1926年北伐针对吴佩孚等军阀；四一二、七一五政变后合作破裂；1927年中共五大在武汉讨论土地革命等问题","北伐针对康梁；九一八导致合作破裂；五大在东京召开","北伐发生于1911年；南京国民政府标志合作形成；五大提出三民主义"],0,"该项正确串起北伐、政变、合作破裂和中共五大。","战争过程不在本组。",[expedition,rupture,fifth]),
];
const specs=[
 ["cpc-third-core",["cs-target-cpc-third"],"cooperation-form",{1:"正文强调保持独立。",2:"三大决定实现合作。"}],
 ["kmt-first-core",["cs-target-kmt-first"],"cooperation-formation",{1:"最低纲领对应中共二大。",2:"政变发生在1927年。"}],
 ["cpc-fourth-core",["cs-target-cpc-fourth"],"leadership-alliance",{1:"该项对应中共二大。",2:"该项对应国民党一大。"}],
 ["may30-strike-core",["cs-target-may30-strike"],"workers-movement",{1:"主力和时长均错。",2:"时间关系和性质均错。"}],
 ["national-cooperation-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"独立性、合作节点和会议内容均错。",2:"地点、政策和运动主力均错。"}],
 ["northern-expedition-core",["cs-target-northern-expedition"],"expedition-targets",{1:"人物不属于北伐三大对象。",2:"人物属于戊戌变法。"}],
 ["cooperation-coups",["cs-target-cooperation-coups"],"rupture-coups",{1:"该项属于抗战阶段。",2:"该项属于辛亥及反袁阶段。"}],
 ["cooperation-break-core",["cs-target-cooperation-break"],"rupture-result",{1:"国民党一大标志合作形成。",2:"中共三大决定实现合作。"}],
 ["cpc-fifth-core",["cs-target-cpc-fifth"],"fifth-congress",{1:"年份和内容错配。",2:"该项对应国民党一大。"}],
 ["national-end-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"人物、事件和地点均错。",2:"年份、合作结果和思想均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-cpc-third":"cpc-third-core","cs-target-kmt-first":"kmt-first-core","cs-target-cpc-fourth":"cpc-fourth-core","cs-target-may30-strike":"may30-strike-core","cs-target-northern-expedition":"northern-expedition-core","cs-target-cooperation-coups":"cooperation-coups","cs-target-cooperation-break":"cooperation-break-core","cs-target-cpc-fifth":"cpc-fifth-core"};
const phrase={"cs-target-cpc-third":"三大个人入党合作，三独立","cs-target-kmt-first":"国一联俄联共扶农工，合作成","cs-target-cpc-fourth":"四大领导工农忙，三人成支部","cs-target-may30-strike":"五卅工人反帝潮，省港一年四月","cs-target-northern-expedition":"二六北伐吴孙张","cs-target-cooperation-coups":"四一二七一五政变","cs-target-cooperation-break":"南京政府立，合作全面裂","cs-target-cpc-fifth":"二七武汉五大，土地方向批陈误"};
const refs={"cs-target-cpc-third":third,"cs-target-kmt-first":kmt,"cs-target-cpc-fourth":fourth,"cs-target-may30-strike":may30,"cs-target-northern-expedition":expedition,"cs-target-cooperation-coups":rupture,"cs-target-cooperation-break":rupture,"cs-target-cpc-fifth":fifth};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用会议、政策、运动、战争和破裂节点串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整人物名单和战争镇压过程","正文未展开的党史争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("national-cooperation-memory","合作形成与群众运动",groupCoop,targets.slice(0,4),"national-cooperation-full"),memory("national-end-memory","北伐与合作破裂",groupEnd,targets.slice(4),"national-end-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupCoop?"national-cooperation-full":"national-end-full"]}));
const groups=[{id:groupCoop,title:"国共合作形成与群众运动",scope:"humanities-history",reason:"按三大、国民党一大、四大与五卅运动构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupEnd,title:"北伐与第一次合作破裂",scope:"humanities-history",reason:"按北伐、反革命政变、合作破裂和中共五大构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-national-revolution",pointId:"national-revolution",tabIds:["cpc-third-congress","kmt-first-congress","cpc-fourth-congress","may-thirtieth-movement","canton-hong-kong-strike","northern-expedition","first-cooperation-break","cpc-fifth-congress"],status:"已建设",batch:"C5-45",scope:"国共合作形成、群众运动、北伐与合作破裂；排除完整人物名单和战争镇压过程"},{candidateId:"history-land-revolution",pointId:"land-revolution",tabIds:["nanchang-uprising","august-seventh-meeting","autumn-harvest-uprising","sanwan-reorganization","jinggangshan-base","cpc-sixth-congress","gutian-meeting","central-soviet","red-army-long-march","zunyi-meeting","long-march-poems"],status:"可建设",batch:"C5-45",scope:"土地革命战争初期起义、建军、根据地与长征遵义会议，后续按早期与长征继续拆批"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=51;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-45",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"26cdb9d2",toPackVersion:"2026-10-21.49",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-45 新增国共合作形成与国民大革命进程两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
