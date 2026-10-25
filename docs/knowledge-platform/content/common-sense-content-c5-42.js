// C5-42: Xinhai Revolution organizations, thought, process and outcome.
const {ref,question}=require("./learning-authoring");
const xing=ref("revolution-and-may-fourth","xingzhonghui","cs-1-9-p16-xingzhonghui-list");
const alliance=ref("revolution-and-may-fourth","tongmenghui","cs-1-9-p16-tongmenghui-list");
const platform=ref("revolution-and-may-fourth","tongmenghui-platform","cs-1-9-p16-tongmenghui-platform-list");
const principles=ref("revolution-and-may-fourth","three-principles","cs-1-9-p16-three-principles-list");
const wuchang=ref("revolution-and-may-fourth","wuchang-uprising","cs-1-9-p16-wuchang-uprising-list");
const second=ref("revolution-and-may-fourth","second-revolution","cs-1-9-p16-second-revolution-list");
const protection=ref("revolution-and-may-fourth","national-protection","cs-1-9-p16-p17-national-protection-list");
const republic=ref("revolution-and-may-fourth","republic-of-china","cs-1-9-p17-republic-of-china-list");
const result=ref("revolution-and-may-fourth","xinhai-result","cs-1-9-p17-xinhai-result-list");
const influence=ref("revolution-and-may-fourth","xinhai-influence","cs-1-9-p17-xinhai-influence-list");
const groupOrg="xinhai-organizations-thought",groupProcess="xinhai-process-outcome";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文组织、年份、纲领、事件与影响对应。"],excludes:["正文未展开的史学争议、完整人物名单和战争细节",...excludes],refs});
const targets=[
  t("cs-target-xingzhonghui",groupOrg,"能识别兴中会的成立时间、人物、地点和组织地位。","1894年孙中山在檀香山成立兴中会，是中国第一个资产阶级革命团体。",[xing],["其他革命团体人物名单不进入口诀。"]),
  t("cs-target-tongmenghui",groupOrg,"能识别同盟会的成立时间、地点和政党地位。","1905年中国同盟会在东京成立，是中国第一个资产阶级革命政党。",[alliance]),
  t("cs-target-tongmenghui-platform",groupOrg,"能识别同盟会四项纲领。","同盟会纲领为驱除鞑虏、恢复中华、创立民国、平均地权。",[platform]),
  t("cs-target-three-principles",groupOrg,"能识别三民主义三项内容及核心。","三民主义包括民族、民权、民生，其中民权主义是核心。",[principles]),
  t("cs-target-wuchang-uprising",groupProcess,"能把1911年10月10日武昌起义与辛亥革命爆发对应。","1911年10月10日武昌起义打响第一枪，次日湖北军政府成立。",[wuchang],["黄花岗起义日期留在正文。"]),
  t("cs-target-republic-result",groupProcess,"能识别中华民国成立与革命果实转移的时间线。","1912年1月1日中华民国在南京成立，孙中山任临时大总统；2月清帝退位，3月袁世凯就任临时大总统。",[republic,result],["国旗和纪年等信息保留在正文。"]),
  t("cs-target-second-protection",groupProcess,"能区分二次革命与护国运动的触发和结果。","1913年二次革命讨袁失败；袁世凯复辟帝制后爆发护国运动，并于1916年被迫取消帝制。",[second,protection],["二十一条年份与各省独立过程不进入口诀。"]),
  t("cs-target-xinhai-impact",groupProcess,"能区分辛亥革命的历史影响与未完成任务。","辛亥革命推翻清王朝、结束封建君主专制并传播民主共和观念，但未完成反帝反封建任务，社会性质未根本改变。",[result,influence]),
];
const addedQuestions=[
  question("xingzhonghui-core","humanities-history",groupOrg,"识别兴中会","中国第一个资产阶级革命团体是？",["1894年孙中山在檀香山成立的兴中会","1905年在东京成立的同盟会","1912年在南京成立的中华民国"],0,"1894年孙中山在檀香山成立兴中会。","同盟会是第一个资产阶级革命政党。",[xing]),
  question("tongmenghui-core","humanities-history",groupOrg,"识别同盟会","中国第一个资产阶级革命政党是？",["兴中会","中国同盟会","华兴会"],1,"1905年在东京成立的中国同盟会是第一个资产阶级革命政党。","兴中会是革命团体。",[alliance]),
  question("tongmenghui-platform","humanities-history",groupOrg,"识别同盟会纲领","下列哪组是同盟会纲领？",["驱除鞑虏、恢复中华、创立民国、平均地权","民主、科学、新道德、新文学","自强、求富、师夷长技"],0,"四项依次为驱除鞑虏、恢复中华、创立民国、平均地权。","不要与新文化运动主张或洋务口号混淆。",[platform]),
  question("three-principles-core","humanities-history",groupOrg,"识别三民主义","三民主义的内容和核心是？",["民族、民权、民生，民权为核心","民主、民权、民生，民主为核心","民族、科学、民生，科学为核心"],0,"三民主义包括民族、民权、民生，核心是民权主义。","三项名称和核心需同时正确。",[principles]),
  question("xinhai-organizations-full","humanities-history",groupOrg,"综合复辨革命组织与思想","下列哪一项完整正确？",["1894年兴中会是首个资产阶级革命团体；1905年同盟会是首个资产阶级革命政党；纲领含创立民国、平均地权；三民主义以民权为核心","兴中会1905年成立于东京；同盟会是新文化运动阵地；三民主义以科学为核心","同盟会1894年成立于南京；纲领为自强求富；三民主义不含民生"],0,"该项正确串起两个组织、四项纲领和三民主义核心。","完整人物名单不在本组。",[xing,alliance,platform,principles]),
  question("wuchang-uprising-core","humanities-history",groupProcess,"识别武昌起义","辛亥革命爆发的标志性事件是？",["1911年10月10日武昌起义","1895年公车上书","1919年五四运动"],0,"1911年10月10日武昌起义打响第一枪。","次日湖北军政府成立。",[wuchang]),
  question("republic-result-timeline","humanities-history",groupProcess,"识别民国成立与结果","辛亥革命后的时间线哪项正确？",["1912年1月南京成立中华民国，2月清帝退位，3月袁世凯任临时大总统","1911年1月北京成立中华民国，2月孙中山退位，3月清帝即位","1913年1月南京成立中华民国，2月袁世凯退位，3月清朝覆灭"],0,"1912年1月建国、2月清帝退位、3月袁世凯就任。","胜利果实随后落入袁世凯手中。",[republic,result]),
  question("second-protection-core","humanities-history",groupProcess,"区分二次革命与护国运动","二次革命和护国运动对应正确的是？",["1913年二次革命讨袁失败；袁复辟帝制后护国运动兴起，1916年被迫取消帝制","二次革命反对清朝；护国运动支持袁称帝","二次革命推翻袁世凯；护国运动发生在武昌起义之前"],0,"二次革命讨袁失败；护国运动反对复辟帝制。","两场运动都置于辛亥革命后的袁世凯统治线索中。",[second,protection]),
  question("xinhai-impact-boundary","humanities-history",groupProcess,"区分影响与局限","关于辛亥革命影响与局限，正确的是？",["推翻清王朝并结束封建君主专制、传播民主共和观念，但未完成反帝反封建任务","彻底改变半殖民地半封建社会性质并完成反帝反封建任务","没有结束君主专制，也没有形成共和观念"],0,"辛亥革命有制度与思想影响，同时存在未完成任务的局限。","影响与局限需要同时把握。",[result,influence]),
  question("xinhai-process-full","humanities-history",groupProcess,"综合复辨辛亥革命进程","下列哪一项完整正确？",["武昌起义引发革命；1912年中华民国成立；二次革命讨袁失败；护国运动反对复辟；辛亥革命未根本改变社会性质","公车上书标志辛亥革命爆发；中华民国在北京成立；二次革命推翻袁世凯","武昌起义发生于1919年；护国运动支持帝制；辛亥革命完成反帝反封建任务"],0,"该项正确串起爆发、建国、反袁运动以及影响边界。","战争过程与过密日期不进入本组。",[wuchang,republic,result,second,protection,influence]),
];
const specs=[
  ["xingzhonghui-core",["cs-target-xingzhonghui"],"organization-status",{1:"同盟会是首个资产阶级革命政党。",2:"中华民国不是革命团体。"}],
  ["tongmenghui-core",["cs-target-tongmenghui"],"party-status",{0:"兴中会是革命团体。",2:"华兴会不是首个资产阶级革命政党。"}],
  ["tongmenghui-platform",["cs-target-tongmenghui-platform"],"platform",{1:"该项混入新文化运动主张。",2:"该项混入洋务运动口号。"}],
  ["three-principles-core",["cs-target-three-principles"],"thought-core",{1:"内容与核心均错。",2:"科学不属于三民主义三项内容。"}],
  ["xinhai-organizations-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"组织时间、性质与思想均错配。",2:"时间、地点、纲领与内容均错。"}],
  ["wuchang-uprising-core",["cs-target-wuchang-uprising"],"uprising-marker",{1:"公车上书是戊戌变法序幕。",2:"五四运动不是辛亥革命爆发标志。"}],
  ["republic-result-timeline",["cs-target-republic-result"],"republic-timeline",{1:"建国地点和人物均错。",2:"年份与事件顺序均错。"}],
  ["second-protection-core",["cs-target-second-protection"],"anti-yuan-movements",{1:"对象和性质均错。",2:"两场运动结果与顺序均错。"}],
  ["xinhai-impact-boundary",["cs-target-xinhai-impact"],"impact-boundary",{1:"夸大为彻底完成任务。",2:"否定正文明确的制度与思想影响。"}],
  ["xinhai-process-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"爆发标志、建国地点和结果均错。",2:"年份、护国性质与历史局限均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-xingzhonghui":"xingzhonghui-core","cs-target-tongmenghui":"tongmenghui-core","cs-target-tongmenghui-platform":"tongmenghui-platform","cs-target-three-principles":"three-principles-core","cs-target-wuchang-uprising":"wuchang-uprising-core","cs-target-republic-result":"republic-result-timeline","cs-target-second-protection":"second-protection-core","cs-target-xinhai-impact":"xinhai-impact-boundary"};
const phrase={"cs-target-xingzhonghui":"九四檀香山兴中团体","cs-target-tongmenghui":"零五东京同盟政党","cs-target-tongmenghui-platform":"驱恢创平四纲领","cs-target-three-principles":"民族民权民生，民权为核","cs-target-wuchang-uprising":"双十武昌第一枪","cs-target-republic-result":"一二一月民国立，二月退位三月袁","cs-target-second-protection":"一三二次讨袁败，复辟护国一六停","cs-target-xinhai-impact":"倒清止帝制，共和入人心；任务未完性质未改"};
const refs={"cs-target-xingzhonghui":xing,"cs-target-tongmenghui":alliance,"cs-target-tongmenghui-platform":platform,"cs-target-three-principles":principles,"cs-target-wuchang-uprising":wuchang,"cs-target-republic-result":republic,"cs-target-second-protection":second,"cs-target-xinhai-impact":influence};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用年份、组织、事件和影响边界串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整人物名单、战争过程和过密日期","正文未展开的史学争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("xinhai-organizations-memory","辛亥组织与思想",groupOrg,targets.slice(0,4),"xinhai-organizations-full"),memory("xinhai-process-memory","辛亥进程与影响",groupProcess,targets.slice(4),"xinhai-process-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupOrg?"xinhai-organizations-full":"xinhai-process-full"]}));
const groups=[{id:groupOrg,title:"辛亥革命组织与思想",scope:"humanities-history",reason:"按革命团体、革命政党、纲领和三民主义构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupProcess,title:"辛亥革命进程与影响",scope:"humanities-history",reason:"按爆发、建国、反袁运动及影响局限构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-xinhai-organization-republic",pointId:"revolution-and-may-fourth",tabIds:["xingzhonghui","tongmenghui","tongmenghui-platform","three-principles","wuchang-uprising","second-revolution","national-protection","republic-of-china","xinhai-result","xinhai-influence"],status:"已建设",batch:"C5-42",scope:"辛亥革命组织思想、革命进程、民国成立、反袁运动及影响局限；排除完整名单和战争过程"},{candidateId:"history-new-culture-may-fourth",pointId:"new-culture-may-fourth",tabIds:["new-culture-movement","may-fourth-movement"],status:"可建设",batch:"C5-42",scope:"新文化运动兴起主张人物与五四运动导火索力量意义，可拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=48;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-42",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"f4ce2529",toPackVersion:"2026-10-21.46",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-42 新增辛亥革命组织思想与革命进程、结果两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
