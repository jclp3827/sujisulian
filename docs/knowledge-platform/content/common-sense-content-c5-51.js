// C5-51: PRC founding and consolidation; peaceful coexistence and international relations.
const {ref,question}=require("./learning-authoring");
const R=(tab,unit)=>ref("new-china-reform",tab,unit);
const founding=R("prc-founding","cs-1-9-p23-prc-founding-list"),land=R("land-reform","cs-1-9-p23-land-reform-list"),korea=R("korean-war","cs-1-9-p23-korean-war-list"),peace=R("peaceful-coexistence","cs-1-9-p23-peaceful-coexistence-list"),un=R("un-seat-restoration","cs-1-9-p24-un-seat-restoration-list"),us=R("china-us-relations","cs-1-9-p24-china-us-relations-list");
const gConsolidation="new-china-founding-consolidation",gDiplomacy="new-china-diplomacy-relations";
const T=(id,g,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文日期、文件、人物、制度和外交节点对应。"],excludes:["正文未展开的政策过程、战争细节和国际关系评价",...excludes],refs});
const targets=[
 T("cs-target-prc-founding",gConsolidation,"能识别中华人民共和国成立时间和教材意义。","1949年10月1日中华人民共和国成立，标志我国新民主主义革命的基本胜利。",[founding]),
 T("cs-target-land-reform-law",gConsolidation,"能识别土地改革的法律、时间与所有制。","1950年6月公布《中华人民共和国土地改革法》，实行农民的土地所有制。",[land]),
 T("cs-target-land-reform-completion",gConsolidation,"能识别大陆土地改革基本完成的时间和范围边界。","到1952年底，除部分少数民族地区外，全国大陆基本完成土地改革。",[land]),
 T("cs-target-korean-war-line",gConsolidation,"能识别抗美援朝的出兵人物与结束节点。","1950年10月彭德怀率志愿军赴朝，1953年7月《朝鲜停战协定》签字。",[korea],["源文2025周年提示不进入稳定题库。"]),
 T("cs-target-peaceful-proposal",gDiplomacy,"能识别和平共处五项原则的首次提出。","1953年12月周恩来接见印度代表团时首次提出和平共处五项原则。",[peace]),
 T("cs-target-peaceful-content",gDiplomacy,"能识别和平共处五项原则的五项内容与万隆发展。","五项原则包括互相尊重主权和领土完整、互不侵犯、互不干涉内政、平等互利、和平共处；1955年万隆会议发展为十项原则。",[peace]),
 T("cs-target-un-seat-restoration",gDiplomacy,"能识别恢复联合国合法席位的时间和会议。","1971年10月25日，第26届联合国大会恢复中华人民共和国在联合国的一切合法权利，包括安理会常任理事国席位。",[un]),
 T("cs-target-china-us-nodes",gDiplomacy,"能区分尼克松访华与中美正式建交时间。","1972年2月尼克松访华，1979年1月中美正式建交。",[us]),
];
const addedQuestions=[
 question("prc-founding-core","humanities-history",gConsolidation,"识别新中国成立","中华人民共和国成立的时间和意义是？",["1949年10月1日，标志新民主主义革命基本胜利","1945年9月3日，标志社会主义制度建立","1956年底，标志抗美援朝结束"],0,"1949年10月1日中华人民共和国成立，标志新民主主义革命基本胜利。","社会主义制度基本建立对应1956年底三大改造完成。",[founding]),
 question("land-reform-law-core","humanities-history",gConsolidation,"识别土地改革法律与制度","1950年土地改革的核心信息是？",["公布《中华人民共和国土地改革法》，实行农民土地所有制","通过1954年宪法，实行国家土地所有制","提出和平共处原则，实行集体土地所有制"],0,"1950年6月公布土地改革法，实行农民土地所有制。","不要把后续宪法、外交或集体化线索混入。",[land]),
 question("land-reform-completion-core","humanities-history",gConsolidation,"识别土地改革完成节点","全国大陆土地改革基本完成的正文表述是？",["到1952年底，除部分少数民族地区外基本完成","1950年6月当天全部完成","1956年底包括所有地区完全完成"],0,"正文保留时间和范围边界：1952年底、除部分少数民族地区外。","“基本完成”不能改写为无例外的全部完成。",[land]),
 question("korean-war-line-core","humanities-history",gConsolidation,"识别抗美援朝时间线","抗美援朝时间线正确的是？",["1950年10月彭德怀率志愿军赴朝，1953年7月签署停战协定","1949年10月周恩来率军赴朝，1952年土地改革后结束","1953年12月尼克松赴朝，1955年万隆会议后结束"],0,"1950年10月彭德怀率志愿军赴朝，1953年7月停战协定签字。","源文周年提示具有时效性，不作为本题目标。",[korea]),
 question("new-china-consolidation-full","humanities-history",gConsolidation,"综合复辨成立与巩固","下列哪一项完整正确？",["1949年新中国成立；1950年土地改革法实行农民土地所有制；1952年底大陆土改基本完成；1950年10月彭德怀率志愿军赴朝","1949年完成三大改造；1950年实行资本主义工商业所有制；1952年中美建交","1956年新中国成立；土地改革由1954年宪法启动；周恩来率志愿军赴朝"],0,"该项正确串起成立、土地改革和抗美援朝节点。","本题不扩展土地改革过程或战争战役。",[founding,land,korea]),
 question("peaceful-proposal-core","humanities-history",gDiplomacy,"识别五项原则首次提出","和平共处五项原则首次提出的场景是？",["1953年12月周恩来接见印度代表团","1955年万隆会议由尼克松提出","1971年第26届联合国大会由彭德怀提出"],0,"1953年12月周恩来接见印度代表团时首次提出。","1955年万隆会议是发展为十项原则的节点。",[peace]),
 question("peaceful-content-core","humanities-history",gDiplomacy,"识别五项原则内容","下列哪项不属于和平共处五项原则？",["互不干涉内政","平等互利","结成军事同盟"],2,"五项原则强调主权、互不侵犯、互不干涉、平等互利、和平共处。","万隆会议的发展不改变本题对五项内容的辨认。",[peace]),
 question("un-seat-core","humanities-history",gDiplomacy,"识别联合国合法席位恢复","恢复中华人民共和国在联合国合法席位的节点是？",["1971年10月25日第26届联合国大会","1972年2月尼克松访华","1979年1月中美建交"],0,"1971年第26届联合国大会恢复中华人民共和国一切合法权利。","尼克松访华和正式建交是中美关系节点。",[un]),
 question("china-us-nodes-core","humanities-history",gDiplomacy,"区分中美关系节点","中美关系两个时间节点对应正确的是？",["1972年2月尼克松访华；1979年1月正式建交","1971年正式建交；1972年恢复联合国席位","1955年尼克松访华；1971年正式建交"],0,"1972年为尼克松访华，1979年为正式建交。","访问和建交不能合并为同一事件。",[us]),
 question("new-china-diplomacy-full","humanities-history",gDiplomacy,"综合复辨外交节点","下列哪一项完整正确？",["1953年周恩来向印度代表团首次提出五项原则；1955年万隆发展为十项原则；1971年恢复联合国合法席位；1972年尼克松访华、1979年正式建交","1953年中美建交；1955年恢复联合国席位；1971年首次提出五项原则","五项原则包含军事同盟；1972年中美正式建交；1979年尼克松首次访华"],0,"该项正确串起和平共处、联合国席位与中美关系。","国际关系评价和谈判过程留在正文外。",[peace,un,us]),
];
const specs=[
 ["prc-founding-core",["cs-target-prc-founding"],"founding",{1:"该项混入抗战胜利与社会主义制度。",2:"该项混入三大改造和抗美援朝。"}],
 ["land-reform-law-core",["cs-target-land-reform-law"],"land-law",{1:"1954年宪法不是土地改革启动文件。",2:"外交原则与土地改革无关。"}],
 ["land-reform-completion-core",["cs-target-land-reform-completion"],"land-completion",{1:"公布法律不等于当天全部完成。",2:"年份和无例外表述均错。"}],
 ["korean-war-line-core",["cs-target-korean-war-line"],"korean-war-line",{1:"人物和节点均错。",2:"人物、年份和会议均错。"}],
 ["new-china-consolidation-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"制度和外交年份错配。",2:"成立、土改和人物均错。"}],
 ["peaceful-proposal-core",["cs-target-peaceful-proposal"],"peaceful-proposal",{1:"万隆会议不是首次提出场景。",2:"会议、人物均错。"}],
 ["peaceful-content-core",["cs-target-peaceful-content"],"peaceful-content",{0:"互不干涉内政属于五项原则。",1:"平等互利属于五项原则。"}],
 ["un-seat-core",["cs-target-un-seat-restoration"],"un-seat",{1:"这是尼克松访华节点。",2:"这是中美正式建交节点。"}],
 ["china-us-nodes-core",["cs-target-china-us-nodes"],"china-us-nodes",{1:"联合国席位与建交年份错配。",2:"访华与建交年份均错。"}],
 ["new-china-diplomacy-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"三个外交节点均错配。",2:"原则内容与访问、建交节点均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-prc-founding":"prc-founding-core","cs-target-land-reform-law":"land-reform-law-core","cs-target-land-reform-completion":"land-reform-completion-core","cs-target-korean-war-line":"korean-war-line-core","cs-target-peaceful-proposal":"peaceful-proposal-core","cs-target-peaceful-content":"peaceful-content-core","cs-target-un-seat-restoration":"un-seat-core","cs-target-china-us-nodes":"china-us-nodes-core"};
const phrase={"cs-target-prc-founding":"四九十一起新中国","cs-target-land-reform-law":"五零土改法，农民土地有","cs-target-land-reform-completion":"五二年底大陆基本成","cs-target-korean-war-line":"五零十月彭赴朝，五三七月停战签","cs-target-peaceful-proposal":"五三周总见印度，首次提五项","cs-target-peaceful-content":"尊主权、互不犯、不干政、平互利、和共处","cs-target-un-seat-restoration":"七一二六大会复席位","cs-target-china-us-nodes":"七二访华，七九建交"};
const refs={"cs-target-prc-founding":founding,"cs-target-land-reform-law":land,"cs-target-land-reform-completion":land,"cs-target-korean-war-line":korea,"cs-target-peaceful-proposal":peace,"cs-target-peaceful-content":peace,"cs-target-un-seat-restoration":un,"cs-target-china-us-nodes":us};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"用年份、文件、人物和事件结果串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆，口诀只作检索线索。"],excludes:["政策过程、战争细节和国际关系评价"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("new-china-consolidation-memory","成立与政权巩固",gConsolidation,targets.slice(0,4),"new-china-consolidation-full"),memory("new-china-diplomacy-memory","和平共处与国际关系",gDiplomacy,targets.slice(4),"new-china-diplomacy-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gConsolidation?"new-china-consolidation-full":"new-china-diplomacy-full"]}));
const groups=[{id:gConsolidation,title:"新中国成立与政权巩固",scope:"humanities-history",reason:"按成立、土地改革和抗美援朝构成巩固主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gDiplomacy,title:"和平共处与国际关系",scope:"humanities-history",reason:"按五项原则、联合国席位和中美关系构成外交主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-new-china-consolidation-diplomacy",pointId:"new-china-reform",tabIds:["prc-founding","land-reform","korean-war","peaceful-coexistence","un-seat-restoration","china-us-relations"],status:"已建设",batch:"C5-51",scope:"新中国成立、土地改革、抗美援朝、和平共处、联合国席位和中美关系；排除过程细节和时效周年提示"},{candidateId:"history-new-china-industrialization-system",pointId:"new-china-reform",tabIds:["first-five-year-plan","constitution-1954","socialist-transformation"],status:"可建设",batch:"C5-51",scope:"一五计划、1954年宪法和三大改造，可拆为建设与制度两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=57;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-51",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"6910f02c",toPackVersion:"2026-10-21.55",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-51 新增新中国成立巩固与和平外交、国际关系两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
