// C5-44: Foundations and early congresses of the Communist Party of China.
const {ref,question}=require("./learning-authoring");
const foundations=ref("communist-revolution","cpc-foundations","cs-1-9-p17-p18-cpc-foundations-list");
const first=ref("communist-revolution","cpc-first-congress","cs-1-9-p18-cpc-first-congress-list");
const delegates=ref("communist-revolution","cpc-first-congress","cs-1-9-p18-cpc-first-congress-delegates-table");
const firstContent=ref("communist-revolution","cpc-first-congress","cs-1-9-p18-cpc-first-congress-content-list");
const second=ref("communist-revolution","cpc-second-congress","cs-1-9-p18-cpc-second-congress-list");
const groupFirst="cpc-foundations-first-congress",groupSecond="cpc-second-congress-program";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文时间、地点、会议内容和纲领层级对应。"],excludes:["正文未展开的党史争议、完整代表名单和组织细节",...excludes],refs});
const targets=[
  t("cs-target-cpc-foundations",groupFirst,"能识别中国共产党成立的组织、思想、阶级和外部基础。","组织基础是各地共产党早期组织，思想基础是马克思主义传播，阶级基础是工人阶级壮大，外部因素是共产国际帮助。",[foundations]),
  t("cs-target-cpc-first-time-place",groupFirst,"能识别中共一大的时间、地点和成立标志。","中共一大于1921年7月23日在上海召开，后转移至浙江嘉兴南湖；大会召开标志中国共产党成立。",[first]),
  t("cs-target-cpc-first-delegates",groupFirst,"能识别一大代表的基本边界。","毛泽东、李达、李汉俊、张国焘、董必武等出席；陈独秀、李大钊未出席，包惠僧受陈独秀派遣出席但不属于正式党代表。",[first,delegates],["不要求一次背全正式代表。"]),
  t("cs-target-cpc-first-content",groupFirst,"能概括中共一大关于名称、性质、目标、任务与组织的主要内容。","一大确定中国共产党名称和无产阶级政党性质，提出奋斗目标、组织工人阶级的基本任务及统一组织纪律。",[firstContent],["五项原文细节保留在正文。"]),
  t("cs-target-cpc-second-time-place",groupSecond,"能识别中共二大的时间和地点。","中共二大于1922年7月在上海召开。",[second]),
  t("cs-target-cpc-second-high-program",groupSecond,"能识别中共二大最高纲领。","中共二大的最高纲领是实现共产主义。",[second]),
  t("cs-target-cpc-second-low-program",groupSecond,"能识别中共二大最低纲领。","中共二大的最低纲领是反帝反封建。",[second]),
  t("cs-target-cpc-second-significance",groupSecond,"能识别中共二大民主革命纲领的历史地位。","中共二大在中国近代史上第一次明确提出彻底反帝反封建的民主革命纲领。",[second]),
];
const addedQuestions=[
  question("cpc-foundations","humanities-history",groupFirst,"识别成立基础","中国共产党成立的四类基础对应正确的是？",["早期组织、马克思主义传播、工人阶级壮大、共产国际帮助","同盟会、三民主义、资产阶级壮大、八国联军帮助","北洋政府、新文化、农民军、巴黎和会帮助"],0,"四类线索分别对应组织、思想、阶级和外部因素。","不要把其他历史组织和事件拼入。",[foundations]),
  question("cpc-first-time-place","humanities-history",groupFirst,"识别一大时地与标志","中共一大信息哪项正确？",["1921年7月23日在上海召开，后转移至嘉兴南湖；标志中国共产党成立","1922年7月在北京召开；标志第一次国共合作","1924年在广州召开；提出最低纲领"],0,"1921年上海至嘉兴南湖的一大标志中国共产党成立。","二大制定纲领，国民党一大标志第一次合作。",[first]),
  question("cpc-first-delegates","humanities-history",groupFirst,"识别一大代表边界","关于中共一大出席情况，正确的是？",["陈独秀、李大钊未出席；包惠僧受陈独秀派遣出席，但不属于正式党代表","陈独秀、李大钊均作为正式代表出席","毛泽东、董必武均未出席"],0,"正文明确陈、李未出席，包惠僧受派遣出席但非正式党代表。","无需背全代表名单即可判断。",[first,delegates]),
  question("cpc-first-content","humanities-history",groupFirst,"识别一大主要内容","下列属于中共一大主要内容的是？",["确定党名和无产阶级政党性质，提出奋斗目标、组织工人阶级任务及统一纪律","提出联俄联共扶助农工并形成第一次国共合作","制定反帝反封建的最低纲领"],0,"这些是正文归纳的一大五项内容。","另两项分别对应国民党一大和中共二大。",[firstContent]),
  question("cpc-first-full","humanities-history",groupFirst,"综合复辨成立基础与一大","下列哪一项完整正确？",["马克思主义传播和工人阶级壮大等构成成立条件；1921年一大由上海转至嘉兴南湖并标志建党；陈独秀、李大钊未出席","共产国际是思想基础；1922年一大在北京举行；陈独秀、李大钊均出席","同盟会是组织基础；1924年一大提出新三民主义；包惠僧未出席"],0,"该项正确串起成立基础、会议时地、成立标志及代表边界。","完整名单和五项细目留在正文。",[foundations,first,delegates,firstContent]),
  question("cpc-second-time-place","humanities-history",groupSecond,"识别二大时地","中共二大于何时何地召开？",["1922年7月，上海","1921年7月，嘉兴南湖","1923年6月，广州"],0,"中共二大于1922年7月在上海召开。","另两项对应一大地点线索和三大。",[second]),
  question("cpc-second-high-program","humanities-history",groupSecond,"识别最高纲领","中共二大的最高纲领是？",["实现共产主义","反帝反封建","联俄联共扶助农工"],0,"最高纲领是实现共产主义。","反帝反封建是最低纲领。",[second]),
  question("cpc-second-low-program","humanities-history",groupSecond,"识别最低纲领","中共二大的最低纲领是？",["反帝反封建","实现共产主义","平均地权"],0,"最低纲领是反帝反封建。","实现共产主义是最高纲领。",[second]),
  question("cpc-second-significance","humanities-history",groupSecond,"识别二大历史地位","中共二大的重要历史地位是？",["近代史上第一次明确提出彻底反帝反封建的民主革命纲领","第一次提出三民主义","标志第一次国共合作正式形成"],0,"正文将这一历史地位与中共二大对应。","另两项对应辛亥思想和国民党一大。",[second]),
  question("cpc-second-full","humanities-history",groupSecond,"综合复辨二大纲领","下列哪一项完整正确？",["1922年7月二大在上海召开；最高纲领为实现共产主义，最低纲领为反帝反封建；首次明确提出彻底反帝反封建民主革命纲领","1921年二大在嘉兴召开；最高纲领反帝反封建，最低纲领实现共产主义","1924年二大在广州召开；提出联俄联共扶助农工并形成第一次国共合作"],0,"该项正确串起会议时地、纲领层级和历史地位。","本组不扩展后续会议。",[second]),
];
const specs=[
  ["cpc-foundations",["cs-target-cpc-foundations"],"foundations",{1:"组织、思想、阶级与外部因素均错配。",2:"各项均非正文四类基础。"}],
  ["cpc-first-time-place",["cs-target-cpc-first-time-place"],"first-congress-marker",{1:"年份、地点和意义均错。",2:"年份、地点和内容均错。"}],
  ["cpc-first-delegates",["cs-target-cpc-first-delegates"],"delegate-boundary",{1:"陈独秀、李大钊未出席。",2:"毛泽东、董必武均出席。"}],
  ["cpc-first-content",["cs-target-cpc-first-content"],"first-congress-content",{1:"该项对应国民党一大。",2:"该项对应中共二大。"}],
  ["cpc-first-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"基础、年份、地点和出席情况均错。",2:"组织、会议和代表情况均错。"}],
  ["cpc-second-time-place",["cs-target-cpc-second-time-place"],"second-congress-time-place",{1:"该项对应一大线索。",2:"该项对应中共三大。"}],
  ["cpc-second-high-program",["cs-target-cpc-second-high-program"],"high-program",{1:"反帝反封建是最低纲领。",2:"该项对应国民党一大政策。"}],
  ["cpc-second-low-program",["cs-target-cpc-second-low-program"],"low-program",{1:"实现共产主义是最高纲领。",2:"平均地权是同盟会纲领。"}],
  ["cpc-second-significance",["cs-target-cpc-second-significance"],"program-significance",{1:"三民主义不是中共二大首次提出。",2:"第一次合作形成对应国民党一大。"}],
  ["cpc-second-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"年份、地点和纲领层级均错。",2:"会议、政策和意义均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-cpc-foundations":"cpc-foundations","cs-target-cpc-first-time-place":"cpc-first-time-place","cs-target-cpc-first-delegates":"cpc-first-delegates","cs-target-cpc-first-content":"cpc-first-content","cs-target-cpc-second-time-place":"cpc-second-time-place","cs-target-cpc-second-high-program":"cpc-second-high-program","cs-target-cpc-second-low-program":"cpc-second-low-program","cs-target-cpc-second-significance":"cpc-second-significance"};
const phrase={"cs-target-cpc-foundations":"组织思想阶级外助四基础","cs-target-cpc-first-time-place":"二一上海转南湖，一大立党","cs-target-cpc-first-delegates":"陈李未到，包代非正式","cs-target-cpc-first-content":"定名定性，目标任务统一纪律","cs-target-cpc-second-time-place":"二二上海二大","cs-target-cpc-second-high-program":"最高共产主义","cs-target-cpc-second-low-program":"最低反帝反封","cs-target-cpc-second-significance":"首次明确彻底民主革命纲领"};
const refs={"cs-target-cpc-foundations":foundations,"cs-target-cpc-first-time-place":first,"cs-target-cpc-first-delegates":delegates,"cs-target-cpc-first-content":firstContent,"cs-target-cpc-second-time-place":second,"cs-target-cpc-second-high-program":second,"cs-target-cpc-second-low-program":second,"cs-target-cpc-second-significance":second};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用基础、会议、代表边界和纲领层级串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整代表名单与会议细目","正文未展开的党史争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("cpc-first-memory","建党基础与一大",groupFirst,targets.slice(0,4),"cpc-first-full"),memory("cpc-second-memory","中共二大纲领",groupSecond,targets.slice(4),"cpc-second-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupFirst?"cpc-first-full":"cpc-second-full"]}));
const groups=[{id:groupFirst,title:"建党基础与中共一大",scope:"humanities-history",reason:"按成立基础、一大时地、代表边界和主要内容构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupSecond,title:"中共二大与革命纲领",scope:"humanities-history",reason:"按二大时地、最高最低纲领及历史地位构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-cpc-birth",pointId:"communist-revolution",tabIds:["cpc-foundations","cpc-first-congress","cpc-second-congress"],status:"已建设",batch:"C5-44",scope:"中国共产党成立基础、中共一大与二大纲领；排除完整代表名单和会议细目"},{candidateId:"history-national-revolution",pointId:"national-revolution",tabIds:["cpc-third-congress","kmt-first-congress","cpc-fourth-congress","may-thirtieth-movement","canton-hong-kong-strike","northern-expedition","first-cooperation-break","cpc-fifth-congress"],status:"可建设",batch:"C5-44",scope:"国共合作形成与国民大革命进程，可拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=50;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-44",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"35236fb6",toPackVersion:"2026-10-21.48",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-44 新增建党基础与中共一大、二大纲领两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
