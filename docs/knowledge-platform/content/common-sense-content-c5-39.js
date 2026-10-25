// C5-39: Taiping Heavenly Kingdom and the Second Opium War.
const {ref,question}=require("./learning-authoring");
const jintian=ref("taiping-heavenly-kingdom","jintian-uprising","cs-1-9-p14-jintian-uprising-list");
const incident=ref("taiping-heavenly-kingdom","tianjing-incident","cs-1-9-p14-tianjing-incident-list");
const failure=ref("taiping-heavenly-kingdom","taiping-failure","cs-1-9-p14-taiping-failure-list");
const land=ref("taiping-heavenly-kingdom","heavenly-land-system","cs-1-9-p14-heavenly-land-system-list");
const senior=ref("taiping-heavenly-kingdom","senior-words","cs-1-9-p14-senior-words-list");
const causes=ref("second-opium-war","second-opium-war-causes","cs-1-9-p14-second-opium-war-causes-list");
const results=ref("second-opium-war","second-opium-war-results","cs-1-9-p14-second-opium-war-results-list");
const yuanmingyuan=ref("second-opium-war","yuanmingyuan-aihun","cs-1-9-p14-yuanmingyuan-aihun-list");
const groupTaiping="taiping-heavenly-kingdom",groupSecond="second-opium-war";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、人物、事件、纲领和条约对应。"],excludes:["正文未展开的战役过程、争议评价和过密数字",...excludes],refs});
const targets=[
  t("cs-target-taiping-founding",groupTaiping,"能把1851年金田起义、洪秀全、建号太平天国与1853年定都天京对应。","1851年洪秀全在广西金田起义并建号太平天国；1853年攻克南京，改名天京并定都。",[jintian]),
  t("cs-target-tianjing-incident",groupTaiping,"能把1856年天京事变与太平天国由盛而衰对应。","1856年天京事变严重削弱领导和军事力量，是太平天国由盛而衰的分水岭。",[incident],["不要求记忆事变全部过程。"]),
  t("cs-target-taiping-failure",groupTaiping,"能把1864年洪秀全病故、天京失守与运动失败对应。","1864年洪秀全病故，随后天京被湘军攻破，太平天国运动失败。",[failure]),
  t("cs-target-heavenly-land-system",groupTaiping,"能识别《天朝田亩制度》的平均主义表述、空想性和未实现结局。","《天朝田亩制度》强调平均主义，但具有空想性，最终没有实现。",[land]),
  t("cs-target-senior-words",groupTaiping,"能把洪仁玕、《资政新篇》与学习西方、发展资本主义对应。","洪仁玕提出《资政新篇》，主张学习西方，是近代中国最早提出的发展资本主义近代化纲领。",[senior],["不要求背诵全部设施清单。"]),
  t("cs-target-second-opium-causes",groupSecond,"能区分英国借亚罗号事件、法国借马神甫事件发动战争。","第二次鸦片战争中，英国借口亚罗号事件，法国借口马神甫事件，趁太平天国运动发动侵华战争。",[causes]),
  t("cs-target-second-opium-treaties",groupSecond,"能区分《天津条约》和《北京条约》的签约国范围。","清政府陆续签订《天津条约》（英法俄美）和《北京条约》（英法俄）。",[results],["不扩展各约全部条款。"]),
  t("cs-target-yuanmingyuan",groupSecond,"能把1860年英法联军与火烧圆明园对应。","1860年10月英法联军抢劫、焚烧圆明园。",[yuanmingyuan]),
  t("cs-target-aihun-russia",groupSecond,"能把1858年《瑷珲条约》和沙俄侵占中国领土对应。","1858年中俄签订《瑷珲条约》；正文同时指出沙俄是近代侵占中国领土面积最多的国家。",[yuanmingyuan],["具体面积只作原文查阅，不进入口诀。"]),
];
const addedQuestions=[
  question("taiping-founding","humanities-history",groupTaiping,"识别太平天国建立","太平天国早期进程对应正确的是？",["1851年洪秀全金田起义并建号；1853年攻克南京、改名天京并定都","1851年洪仁玕在北京起义；1853年定都广州","1856年金田起义；1864年改南京为天京"],0,"1851年金田起义建号，1853年定都天京。","地点、人物和年份须同时对应。",[jintian]),
  question("taiping-turn-failure","humanities-history",groupTaiping,"区分转折与失败","太平天国由盛而衰的分水岭和最终失败节点依次是？",["1856年天京事变；1864年天京被湘军攻破","1853年定都天京；1856年金田起义","1842年《南京条约》；1860年火烧圆明园"],0,"1856年天京事变是由盛而衰的分水岭，1864年天京失守、运动失败。","不以全部人物遭遇替代两个关键节点。",[incident,failure]),
  question("heavenly-land-system","humanities-history",groupTaiping,"识别天朝田亩制度","关于《天朝田亩制度》的表述正确的是？",["强调平均主义，但具有空想性，最终没有实现","主张发展资本主义并兴办铁路银行","是清政府与英法签订的不平等条约"],0,"该制度有平均主义理想，但具有空想性且未实现。","《资政新篇》才对应学习西方和发展资本主义。",[land]),
  question("senior-words","humanities-history",groupTaiping,"识别资政新篇","洪仁玕提出、主张学习西方并发展资本主义的近代化纲领是？",["《资政新篇》","《天朝田亩制度》","《海国图志》"],0,"《资政新篇》是近代中国较早明确提出发展资本主义的近代化纲领。","不要求背诵正文列举的全部设施。",[senior]),
  question("taiping-full","humanities-history",groupTaiping,"综合复辨太平天国","下列哪一项完整正确？",["1851年金田起义；1856年天京事变为转衰分水岭；1864年运动失败；《天朝田亩制度》未实现；《资政新篇》主张学习西方","1853年天京事变；《天朝田亩制度》主张发展资本主义；洪秀全提出《资政新篇》","1864年金田起义；《资政新篇》强调平均主义且已全面实施"],0,"该项正确串起太平天国的时间节点和两份纲领。","人物、时间与纲领性质都要分别核对。",[jintian,incident,failure,land,senior]),
  question("second-opium-causes","humanities-history",groupSecond,"区分战争借口","第二次鸦片战争中，英法两国的借口对应正确的是？",["英国—亚罗号事件；法国—马神甫事件","英国—马神甫事件；法国—亚罗号事件","英国—虎门销烟；法国—三元里抗英"],0,"英国借亚罗号事件，法国借马神甫事件。","虎门销烟和三元里抗英属于第一次鸦片战争前后。",[causes]),
  question("second-opium-treaties","humanities-history",groupSecond,"区分两项条约","第二次鸦片战争后相关条约与签约国范围对应正确的是？",["《天津条约》—英法俄美；《北京条约》—英法俄","《天津条约》—中日；《北京条约》—英美日","《南京条约》—英法俄美；《尼布楚条约》—英法俄"],0,"正文用英法俄美与英法俄区分《天津条约》和《北京条约》。","本题不扩展各约全部条款。",[results]),
  question("yuanmingyuan","humanities-history",groupSecond,"识别圆明园事件","1860年10月抢劫并焚烧圆明园的是？",["英法联军","八国联军","湘军"],0,"1860年英法联军抢劫、焚烧圆明园。","八国联军侵华发生在更晚时期。",[yuanmingyuan]),
  question("aihun-russia","humanities-history",groupSecond,"识别瑷珲条约","关于1858年《瑷珲条约》的表述正确的是？",["由中俄签订；正文同时指出沙俄是近代侵占中国领土面积最多的国家","由中日签订，允许日本在口岸设厂","由中英签订，是近代第一个不平等条约"],0,"《瑷珲条约》与沙俄侵占中国领土相联系。","面积数字保留在原文查阅，不作为口诀要求。",[yuanmingyuan]),
  question("second-opium-full","humanities-history",groupSecond,"综合复辨第二次鸦片战争","下列哪一项完整正确？",["英借亚罗号、法借马神甫；清政府签《天津条约》《北京条约》；英法联军火烧圆明园；沙俄借机侵占领土","法借亚罗号、英借马神甫；八国联军在1858年火烧圆明园","战争以虎门销烟为直接原因；清政府只与日本签订《北京条约》"],0,"该项正确概括战争借口、条约、暴行和沙俄侵地线索。","不把第一次鸦片战争和八国联军侵华事件混入本组。",[causes,results,yuanmingyuan]),
];
const specs=[
  ["taiping-founding",["cs-target-taiping-founding"],"founding-timeline",{1:"人物、地点均错。",2:"年份和事件顺序均错。"}],
  ["taiping-turn-failure",["cs-target-tianjing-incident","cs-target-taiping-failure"],"turn-failure",{1:"定都不是转衰，金田起义年份也错。",2:"所列事件属于鸦片战争相关线索。"}],
  ["heavenly-land-system",["cs-target-heavenly-land-system"],"program-nature",{1:"该表述对应《资政新篇》。",2:"该制度不是对外条约。"}],
  ["senior-words",["cs-target-senior-words"],"program-figure",{1:"《天朝田亩制度》强调平均主义。",2:"《海国图志》由魏源编写。"}],
  ["taiping-full",targets.slice(0,5).map(x=>x.id),"full-recheck",{1:"年份、纲领性质和提出者均错。",2:"年份和两份纲领性质均错。"}],
  ["second-opium-causes",["cs-target-second-opium-causes"],"cause-contrast",{1:"两国借口被互换。",2:"所列事件属于第一次鸦片战争前后。"}],
  ["second-opium-treaties",["cs-target-second-opium-treaties"],"treaty-contrast",{1:"条约与国家均错配。",2:"两项条约不属于第二次鸦片战争结果。"}],
  ["yuanmingyuan",["cs-target-yuanmingyuan"],"event",{1:"八国联军侵华发生在1900年前后。",2:"湘军攻破的是天京。"}],
  ["aihun-russia",["cs-target-aihun-russia"],"treaty-country",{1:"该项对应《马关条约》相关内容。",2:"该项对应《南京条约》。"}],
  ["second-opium-full",targets.slice(5).map(x=>x.id),"full-recheck",{1:"两国借口、侵略者和年份均错。",2:"混入第一次鸦片战争且签约国错误。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-taiping-founding":"taiping-founding","cs-target-tianjing-incident":"taiping-turn-failure","cs-target-taiping-failure":"taiping-turn-failure","cs-target-heavenly-land-system":"heavenly-land-system","cs-target-senior-words":"senior-words","cs-target-second-opium-causes":"second-opium-causes","cs-target-second-opium-treaties":"second-opium-treaties","cs-target-yuanmingyuan":"yuanmingyuan","cs-target-aihun-russia":"aihun-russia"};
const phrase={"cs-target-taiping-founding":"五一金田建号，五三南京改天京","cs-target-tianjing-incident":"五六天京事变转衰","cs-target-taiping-failure":"六四洪亡天京破","cs-target-heavenly-land-system":"田亩求平均，空想未实行","cs-target-senior-words":"洪仁玕资政新篇学西方","cs-target-second-opium-causes":"英借亚罗，法借马神甫","cs-target-second-opium-treaties":"天津英法俄美，北京英法俄","cs-target-yuanmingyuan":"六零英法烧圆明","cs-target-aihun-russia":"五八瑷珲，沙俄侵地最多"};
const refs={"cs-target-taiping-founding":jintian,"cs-target-tianjing-incident":incident,"cs-target-taiping-failure":failure,"cs-target-heavenly-land-system":land,"cs-target-senior-words":senior,"cs-target-second-opium-causes":causes,"cs-target-second-opium-treaties":results,"cs-target-yuanmingyuan":yuanmingyuan,"cs-target-aihun-russia":yuanmingyuan};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"年份、人物、事件、纲领与条约线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["赔款、领土面积和人物遭遇等过密数字","未纳入本组的后续晚清运动"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("taiping-memory","太平天国时间与纲领",groupTaiping,targets.slice(0,5),"taiping-full"),memory("second-opium-memory","第二次鸦片战争主线",groupSecond,targets.slice(5),"second-opium-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupTaiping?"taiping-full":"second-opium-full"]}));
const groups=[{id:groupTaiping,title:"太平天国时间与纲领",scope:"humanities-history",reason:"按起义、转折、失败和两份纲领构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupSecond,title:"第二次鸦片战争主线",scope:"humanities-history",reason:"按借口、条约、圆明园和沙俄侵地构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-taiping-second-opium",pointId:"taiping-heavenly-kingdom",relatedPointIds:["second-opium-war"],tabIds:["jintian-uprising","tianjing-incident","taiping-failure","heavenly-land-system","senior-words","second-opium-war-causes","second-opium-war-results","yuanmingyuan-aihun"],status:"已建设",batch:"C5-39",scope:"太平天国关键节点与纲领、第二次鸦片战争借口条约暴行和沙俄侵地；排除过密数字和战役过程"},{candidateId:"history-self-strengthening-sino-japanese",pointId:"self-strengthening-movement",relatedPointIds:["first-sino-japanese-war"],tabIds:["self-strengthening-faction","self-strengthening-thought","self-strengthening-industry","modern-navy","new-school","self-strengthening-outcome","first-sino-japanese-war-battles","treaty-of-shimonoseki"],status:"可建设",batch:"C5-39",scope:"洋务运动与甲午中日战争主线，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=45;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-39",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"45ab6fe2",toPackVersion:"2026-10-21.43",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-39 新增太平天国与第二次鸦片战争两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
