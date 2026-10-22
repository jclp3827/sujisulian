// C5-50: Liberation War negotiations, counteroffensive, decisive campaigns and transition.
const {ref,question}=require("./learning-authoring");
const R=(tab,unit)=>ref("liberation-war",tab,unit);
const cq=R("chongqing-negotiations","cs-1-9-p22-chongqing-negotiations-list"),counter=R("strategic-counteroffensive","cs-1-9-p22-strategic-counteroffensive-list"),campaigns=R("three-campaigns","cs-1-9-p22-three-campaigns-list"),plenum=R("seventh-central-second-plenum","cs-1-9-p23-seventh-central-second-plenum-list"),yangtze=R("yangtze-crossing-campaign","cs-1-9-p23-yangtze-crossing-campaign-list");
const gTurn="liberation-negotiation-counteroffensive",gDecision="liberation-decisive-transition";
const T=(id,g,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文年份、人物、文件、战役与会议成果对应。"],excludes:["正文未展开的战史争议、完整作战过程和过密数字",...excludes],refs});
const targets=[
 T("cs-target-chongqing-purpose",gTurn,"能识别重庆谈判的时间、目的和代表。","1945年抗战胜利后，为避免内战、争取和平，毛泽东、周恩来、王若飞等赴重庆谈判。",[cq]),
 T("cs-target-double-tenth",gTurn,"能识别重庆谈判结果与《双十协定》。","1945年10月10日国共签订《政府与中共代表会谈纪要》，即《双十协定》。",[cq],["谈判天数留在正文。"]),
 T("cs-target-counteroffensive-actors",gTurn,"能识别战略反攻的时间与领导人。","1947年6月底，刘伯承、邓小平率晋冀鲁豫解放军主力展开战略反攻。",[counter]),
 T("cs-target-counteroffensive-route",gTurn,"能识别战略反攻的路线标志。","刘邓大军渡过黄河、千里跃进大别山。",[counter]),
 T("cs-target-three-campaigns",gDecision,"能识别三大战役名称与时间范围。","1948年9月至1949年1月，辽沈、淮海、平津三大战役展开。",[campaigns]),
 T("cs-target-huaihai-feature",gDecision,"能识别淮海战役的群众支援表述与教材地位。","淮海战役被称为小推车推出来的胜利，并具有牺牲重、歼敌多、政治影响大、样式复杂等特点。",[campaigns],["具体伤亡和兵力不进入口诀。"]),
 T("cs-target-seventh-second-plenum",gDecision,"能识别七届二中全会的时间地点与主要决定。","1949年3月七届二中全会在西柏坡召开，决定工作重心由乡村转向城市并提出两个务必。",[plenum]),
 T("cs-target-yangtze-campaign",gDecision,"能识别渡江战役、南京解放与国民政府覆灭。","1949年4月21日渡江战役发起，4月23日南京解放，国民政府覆灭。",[yangtze],["后续进军细节留在正文。"]),
];
const addedQuestions=[
 question("chongqing-purpose","humanities-history",gTurn,"识别重庆谈判目的","重庆谈判的主要目的背景是？",["抗战胜利后避免内战、争取和平","形成第一次国共合作","制定全面抗战路线"],0,"1945年中共代表赴重庆为避免内战、争取和平。","另两项属于更早历史阶段。",[cq]),
 question("double-tenth-core","humanities-history",gTurn,"识别双十协定","《双十协定》是？",["1945年10月10日国共签订的《政府与中共代表会谈纪要》","1937年国共合作宣言","1949年渡江战役命令"],0,"重庆谈判结果之一是《双十协定》。","名称、日期与场景需对应。",[cq]),
 question("counteroffensive-actors","humanities-history",gTurn,"识别战略反攻人物","1947年战略反攻的主要领导人是？",["刘伯承、邓小平","林彪、罗荣桓","毛泽东、周恩来、王稼祥"],0,"刘伯承、邓小平率主力展开战略反攻。","另两组对应其他历史情境。",[counter]),
 question("counteroffensive-route","humanities-history",gTurn,"识别战略反攻路线","战略反攻的标志性路线是？",["渡过黄河，千里跃进大别山","四渡赤水，巧渡金沙江","渡过长江，占领南京"],0,"刘邓大军千里跃进大别山。","另两项对应长征与渡江战役。",[counter]),
 question("liberation-turn-full","humanities-history",gTurn,"综合复辨谈判与反攻","下列哪一项完整正确？",["1945年重庆谈判争取和平并签《双十协定》；1947年刘邓大军渡黄河、跃进大别山","重庆谈判形成第二次合作；1947年林彪率军四渡赤水","《双十协定》在1949年签订；战略反攻以占领南京开始"],0,"该项正确串起谈判结果和战略反攻。","谈判天数不进入口诀。",[cq,counter]),
 question("three-campaigns-core","humanities-history",gDecision,"识别三大战役","三大战役是？",["辽沈、淮海、平津","淞沪、太原、武汉","南昌、秋收、广州"],0,"三大战役为辽沈、淮海、平津。","不要与抗战会战或起义混淆。",[campaigns]),
 question("huaihai-feature","humanities-history",gDecision,"识别淮海战役特点","被称为“小推车推出来的胜利”的是？",["淮海战役","辽沈战役","平津战役"],0,"教材用该表述概括淮海战役的群众支援。","本题不要求兵力数字。",[campaigns]),
 question("seventh-second-plenum-core","humanities-history",gDecision,"识别七届二中全会","七届二中全会信息哪项正确？",["1949年西柏坡召开，工作重心由乡村转城市，提出两个务必","1945年延安召开，确立毛泽东思想","1935年遵义召开，成立三人军事小组"],0,"七届二中全会对应1949年西柏坡、重心转移和两个务必。","另两项对应中共七大、遵义会议。",[plenum]),
 question("yangtze-campaign-core","humanities-history",gDecision,"识别渡江战役","渡江战役及南京解放时间线正确的是？",["1949年4月21日发起，4月23日占领南京，国民政府覆灭","1948年9月发起，1949年1月在北平结束","1945年8月发起，9月3日南京解放"],0,"渡江战役于4月21日发起，两日后南京解放。","另两项混入三大战役与抗战胜利时间。",[yangtze]),
 question("liberation-decision-full","humanities-history",gDecision,"综合复辨决战与转折","下列哪一项完整正确？",["三大战役为辽淮平；淮海有小推车表述；七届二中全会在西柏坡决定重心转城市；渡江后南京解放","三大战役为淞太武；七届二中全会在遵义；渡江后北平解放","淮海由日军发动；两个务必在国民党一大提出；渡江发生于1937年"],0,"该项正确串起决战、建国准备与南京解放。","战役过程与兵力数字留在正文。",[campaigns,plenum,yangtze]),
];
const specs=[
 ["chongqing-purpose",["cs-target-chongqing-purpose"],"negotiation-purpose",{1:"第一次合作形成于1924年。",2:"全面抗战路线由洛川会议制定。"}],
 ["double-tenth-core",["cs-target-double-tenth"],"agreement",{1:"该项是统一战线正式形成线索。",2:"不是谈判协议。"}],
 ["counteroffensive-actors",["cs-target-counteroffensive-actors"],"counteroffensive-actors",{1:"该组人物对应辽沈等线索。",2:"该组人物对应遵义会议。"}],
 ["counteroffensive-route",["cs-target-counteroffensive-route"],"counteroffensive-route",{1:"该项属于长征。",2:"该项属于渡江战役。"}],
 ["liberation-turn-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"谈判意义、人物与路线均错。",2:"协议年份和反攻起点均错。"}],
 ["three-campaigns-core",["cs-target-three-campaigns"],"campaign-names",{1:"该项属于抗战会战。",2:"该项属于革命起义。"}],
 ["huaihai-feature",["cs-target-huaihai-feature"],"huaihai-feature",{1:"该表述不对应辽沈。",2:"该表述不对应平津。"}],
 ["seventh-second-plenum-core",["cs-target-seventh-second-plenum"],"plenum",{1:"该项对应中共七大。",2:"该项对应遵义会议。"}],
 ["yangtze-campaign-core",["cs-target-yangtze-campaign"],"yangtze-timeline",{1:"该项混入三大战役时段。",2:"该项混入抗战胜利时段。"}],
 ["liberation-decision-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"战役、地点与结果均错。",2:"主体、会议和年份均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-chongqing-purpose":"chongqing-purpose","cs-target-double-tenth":"double-tenth-core","cs-target-counteroffensive-actors":"counteroffensive-actors","cs-target-counteroffensive-route":"counteroffensive-route","cs-target-three-campaigns":"three-campaigns-core","cs-target-huaihai-feature":"huaihai-feature","cs-target-seventh-second-plenum":"seventh-second-plenum-core","cs-target-yangtze-campaign":"yangtze-campaign-core"};
const phrase={"cs-target-chongqing-purpose":"四五重庆谈和平","cs-target-double-tenth":"十月十日双十纪要","cs-target-counteroffensive-actors":"四七刘邓反攻","cs-target-counteroffensive-route":"渡黄河跃大别山","cs-target-three-campaigns":"辽淮平三大战役","cs-target-huaihai-feature":"淮海小推车","cs-target-seventh-second-plenum":"西柏坡重心进城两个务必","cs-target-yangtze-campaign":"四二一渡江，四二三南京"};
const refs={"cs-target-chongqing-purpose":cq,"cs-target-double-tenth":cq,"cs-target-counteroffensive-actors":counter,"cs-target-counteroffensive-route":counter,"cs-target-three-campaigns":campaigns,"cs-target-huaihai-feature":campaigns,"cs-target-seventh-second-plenum":plenum,"cs-target-yangtze-campaign":yangtze};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用年份、人物、文件和战役节点串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["完整战役过程和过密数字","正文未展开的战史争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("liberation-turn-memory","谈判到战略反攻",gTurn,targets.slice(0,4),"liberation-turn-full"),memory("liberation-decision-memory","决战到南京解放",gDecision,targets.slice(4),"liberation-decision-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gTurn?"liberation-turn-full":"liberation-decision-full"]}));
const groups=[{id:gTurn,title:"重庆谈判与战略反攻",scope:"humanities-history",reason:"按争取和平、双十协定与刘邓跃进大别山构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gDecision,title:"战略决战与南京解放",scope:"humanities-history",reason:"按三大战役、七届二中全会与渡江战役构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-liberation-war",pointId:"liberation-war",tabIds:["chongqing-negotiations","strategic-counteroffensive","three-campaigns","seventh-central-second-plenum","yangtze-crossing-campaign"],status:"已建设",batch:"C5-50",scope:"重庆谈判、战略反攻、三大战役、七届二中全会和渡江战役；排除战争过程和过密数字"},{candidateId:"history-new-china-construction",pointId:"new-china-reform",status:"可建设",batch:"C5-50",scope:"新中国成立与建设主线，下一批按来源页签拆分最多两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=56;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-50",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"a234c40e",toPackVersion:"2026-10-21.54",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-50 新增解放战争谈判反攻与决战、南京解放两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
