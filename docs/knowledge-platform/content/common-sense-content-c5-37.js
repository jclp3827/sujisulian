// C5-37: Ming and Qing backbone.
const {ref,question}=require("./learning-authoring");
const ming=ref("ming-qing","ming","cs-1-9-p11-p13-ming-list");
const qing=ref("ming-qing","qing","cs-1-9-p13-qing-list");
const groupMing="ming-backbone",groupQing="qing-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、人物、事件和制度配对。"],excludes:["传说、兵器细节和正文未展开的战争过程",...excludes],refs});
const targets=[
  t("cs-target-ming-founding",groupMing,"能把1368年、朱元璋、洪武与应天府对应。","1368年朱元璋建立明朝，建元洪武，建都应天府。",[ming]),
  t("cs-target-ming-yongle",groupMing,"能识别朱棣永乐时期的迁都、典籍与航海。","明成祖朱棣迁都北京，组织编写《永乐大典》，派郑和七下西洋。",[ming],["不考郑和每次航线和随行规模。"]),
  t("cs-target-ming-tumu",groupMing,"能把1449年土木之变与明朝由盛转衰对应。","1449年土木之变中明英宗被俘，是明朝由盛转衰的转折点。",[ming]),
  t("cs-target-ming-anti-wokou",groupMing,"能把戚继光、浙东台州与抗倭对应。","明朝中期戚继光训练戚家军抗倭，1561年在浙东台州九战九捷。",[ming],["不考鸳鸯阵和兵器构造。"]),
  t("cs-target-ming-fall",groupMing,"能把1644年李自成攻入北京与明亡对应。","1644年李自成农民军攻入北京，推翻明朝。",[ming]),
  t("cs-target-ming-institutions",groupMing,"能识别明代主要制度的基本对应。","明太祖废丞相、设锦衣卫；明成祖形成内阁并设东厂；张居正推行一条鞭法；明代以八股文取士。",[ming],["三司全称、西厂设立者和税法细节另作制度专题。"]),
  t("cs-target-qing-founding",groupQing,"能区分1616后金、1636改清与1644入关。","1616年努尔哈赤建后金；1636年皇太极改国号为清；1644年清军入关并迁都北京。",[qing]),
  t("cs-target-qing-taiwan",groupQing,"能区分郑成功收复台湾与清设台湾府。","1661年郑成功击败荷兰殖民者；1684年清政府正式设台湾府。",[qing],["不扩展具体海战过程。"]),
  t("cs-target-nerchinsk-treaty",groupQing,"能把1689年《尼布楚条约》与中俄边界对应。","1689年中俄经平等协商签订《尼布楚条约》，从法律上肯定相关地区属于中国。",[qing],["不考条约边界逐段原文。"]),
  t("cs-target-kangqian-prosperity",groupQing,"能识别康乾盛世涉及康熙、雍正、乾隆。","康熙、雍正、乾隆时期经济繁荣、国力强盛，史称康乾盛世。",[qing]),
  t("cs-target-qing-institutions",groupQing,"能识别清代主要制度的基本对应。","八旗制度源于努尔哈赤；雍正设军机处并推行摊丁入亩；理藩院管理蒙古、回部及西藏等事务。",[qing],["驻藏大臣隶属关系和闭关阶段另作制度专题。"]),
];
const addedQuestions=[
  question("ming-founding","humanities-history",groupMing,"识别明朝建立","1368年建立明朝、建元洪武并定都应天府的是谁？",["朱元璋","朱棣","李自成"],0,"1368年朱元璋建立明朝，建元洪武，建都应天府。","月饼传信属于传说，不作判断依据。",[ming]),
  question("ming-yongle","humanities-history",groupMing,"识别永乐活动","明成祖朱棣时期的活动配对正确的是？",["迁都北京、编《永乐大典》、派郑和下西洋","废除科举、定都临安、派戚继光下西洋","迁都应天、编《四库全书》、派施琅下西洋"],0,"朱棣永乐时期迁都北京、编纂《永乐大典》并派郑和下西洋。","不考航海规模和每次线路。",[ming]),
  question("ming-mid-events","humanities-history",groupMing,"区分土木之变与抗倭","明朝中期事件配对正确的是？",["1449年土木之变—明英宗被俘；1561年戚继光台州抗倭","1449年郑和下西洋；1561年朱元璋建明","1449年李自成入北京；1561年施琅设台湾府"],0,"土木之变与戚继光抗倭分别对应1449年和1561年。","不考兵器与作战阵法。",[ming]),
  question("ming-fall-institutions","humanities-history",groupMing,"识别明亡与制度","关于明朝灭亡和制度，下列哪一项正确？",["1644年李自成攻入北京；明太祖废丞相、设锦衣卫，明成祖时内阁出现并设东厂","1644年张居正攻入北京；明太祖设军机处，明成祖推行摊丁入亩","1684年李自成攻入北京；明太祖设宣政院，明成祖设澎湖巡检司"],0,"1644年李自成农民军推翻明朝；明代核心制度按正文人物对应。","三司全称和后续政权更替另作专题。",[ming]),
  question("ming-full","humanities-history",groupMing,"综合复辨明朝主线","下列哪一项完整正确？",["1368年朱元璋建明；朱棣迁都北京并派郑和下西洋；1449年土木之变；戚继光抗倭；1644年李自成推翻明朝","1368年朱棣建明；郑成功下西洋；1449年明亡","1616年朱元璋建明；施琅抗倭；1684年李自成推翻明朝"],0,"该项正确串起建国、永乐活动、中期事件与灭亡。","制度细项以直接题和正文为准。",[ming]),
  question("qing-founding","humanities-history",groupQing,"识别清朝建立节点","清朝建立时间线正确的是？",["1616年努尔哈赤建后金；1636年皇太极改国号为清；1644年清军入关","1616年皇太极建清；1636年努尔哈赤入关；1644年建后金","1636年朱元璋建清；1644年郑成功入关"],0,"后金建立、改国号为清和入关是三个不同节点。","不把后金建立直接等同于入关。",[qing]),
  question("qing-taiwan","humanities-history",groupQing,"区分台湾两节点","清初台湾相关事件配对正确的是？",["1661年郑成功击败荷兰殖民者；1684年清政府设台湾府","1661年施琅设台湾府；1684年郑成功击败荷兰殖民者","1689年郑成功签《尼布楚条约》；1644年设台湾府"],0,"郑成功收复台湾与清政府设台湾府是两个时间节点。","不扩展具体海战过程。",[qing]),
  question("nerchinsk-treaty","humanities-history",groupQing,"识别尼布楚条约","1689年中俄经平等协商签订的第一个边界条约是？",["《尼布楚条约》","《南京条约》","《绍兴和约》"],0,"1689年中俄签订《尼布楚条约》。","不考边界逐段原文。",[qing]),
  question("qing-reign-institutions","humanities-history",groupQing,"识别康乾时期与制度","关于康乾时期和清代制度，下列哪一项正确？",["康乾盛世涉及康熙、雍正、乾隆；努尔哈赤建八旗，雍正设军机处并推行摊丁入亩","康乾盛世涉及顺治、康熙、嘉庆；努尔哈赤建内阁，雍正推行一条鞭法","康乾盛世涉及雍正、乾隆、道光；皇太极设行省，军机处只管佛教"],0,"康乾盛世及八旗、军机处、摊丁入亩按正文人物对应。","理藩院职责仍在解析和口诀中保留。",[qing]),
  question("qing-full","humanities-history",groupQing,"综合复辨清朝主线","下列哪一项完整正确？",["努尔哈赤建后金、皇太极改清；郑成功收复台湾后清设台湾府；1689年《尼布楚条约》；雍正设军机处","皇太极建后金、努尔哈赤改清；郑和收复台湾；1689年《南京条约》","朱棣建清；施琅击败荷兰殖民者；军机处始于明太祖"],0,"该项正确串起建国、台湾、边界条约与制度节点。","具体战争过程和制度层级仍以正文为准。",[qing]),
];
const specs=[
  ["ming-founding",["cs-target-ming-founding"],"founding",{1:"朱棣为明成祖。",2:"李自成农民军推翻明朝。"}],
  ["ming-yongle",["cs-target-ming-yongle"],"reign-events",{1:"人物、都城和航海事件错配。",2:"典籍、都城和人物错配。"}],
  ["ming-mid-events",["cs-target-ming-tumu","cs-target-ming-anti-wokou"],"event-contrast",{1:"事件与年份人物均错。",2:"事件与人物均错配。"}],
  ["ming-fall-institutions",["cs-target-ming-fall","cs-target-ming-institutions"],"fall-institution",{1:"人物、军机处与摊丁入亩均错配。",2:"年份和元代机构均错配。"}],
  ["ming-full",targets.slice(0,6).map(x=>x.id),"full-recheck",{1:"建国人物、航海人物和灭亡节点错误。",2:"建国年份、人物和灭亡年份均错误。"}],
  ["qing-founding",["cs-target-qing-founding"],"founding-timeline",{1:"人物与三个节点互换。",2:"人物和政权均错。"}],
  ["qing-taiwan",["cs-target-qing-taiwan"],"taiwan-timeline",{1:"人物与年份互换。",2:"条约与设府年份错配。"}],
  ["nerchinsk-treaty",["cs-target-nerchinsk-treaty"],"treaty",{1:"《南京条约》属于近代不平等条约。",2:"《绍兴和约》是南宋与金的和议。"}],
  ["qing-reign-institutions",["cs-target-kangqian-prosperity","cs-target-qing-institutions"],"reign-institution",{1:"盛世人物、内阁和一条鞭法均错配。",2:"盛世人物、行省和军机处职责均错配。"}],
  ["qing-full",targets.slice(6).map(x=>x.id),"full-recheck",{1:"建国人物、台湾人物和条约均错。",2:"建国人物、台湾事件和军机处朝代均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-ming-founding":"ming-founding","cs-target-ming-yongle":"ming-yongle","cs-target-ming-tumu":"ming-mid-events","cs-target-ming-anti-wokou":"ming-mid-events","cs-target-ming-fall":"ming-fall-institutions","cs-target-ming-institutions":"ming-fall-institutions","cs-target-qing-founding":"qing-founding","cs-target-qing-taiwan":"qing-taiwan","cs-target-nerchinsk-treaty":"nerchinsk-treaty","cs-target-kangqian-prosperity":"qing-reign-institutions","cs-target-qing-institutions":"qing-reign-institutions"};
const phrase={"cs-target-ming-founding":"一三六八朱元璋洪武应天","cs-target-ming-yongle":"朱棣北京大典郑和航","cs-target-ming-tumu":"一四四九土木转衰","cs-target-ming-anti-wokou":"戚家台州九战捷","cs-target-ming-fall":"一六四四自成入京明亡","cs-target-ming-institutions":"太祖废相锦衣，成祖内阁东厂，张居正一条鞭","cs-target-qing-founding":"一六一六后金，三六改清，四四入关","cs-target-qing-taiwan":"六一成功复台，八四清设台湾府","cs-target-nerchinsk-treaty":"一六八九尼布楚","cs-target-kangqian-prosperity":"康雍乾三朝盛","cs-target-qing-institutions":"努尔哈赤八旗，雍正军机摊丁，理藩管边疆"};
const refs=Object.fromEntries(targets.map(x=>[x.id,x.groupId===groupMing?ming:qing]));
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"年份、人物、事件与制度线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["传说、兵器细节、战争过程和冗长制度全称","未纳入本组的明清社会经济"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("ming-memory","明朝建国盛衰与制度",groupMing,targets.slice(0,6),"ming-full"),memory("qing-memory","清朝建立治理与制度",groupQing,targets.slice(6),"qing-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupMing?"ming-full":"qing-full"]}));
const groups=[{id:groupMing,title:"明朝建国盛衰与制度",scope:"humanities-history",reason:"按建国、永乐活动、中期事件、灭亡和制度构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupQing,title:"清朝建立治理与制度",scope:"humanities-history",reason:"按建国、台湾、边界、盛世和制度构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-ming-qing",pointId:"ming-qing",tabIds:["ming","qing"],status:"已建设",batch:"C5-37",scope:"明清建国盛衰、对外关系与核心制度；排除传说、战争细节和冗长制度名单"},{candidateId:"history-ming-qing-economy-opium",pointId:"ming-qing",relatedPointIds:["late-qing-invasions"],tabIds:["ming-qing-economy","humen-opium-destruction","sanyuanli-resistance","treaty-of-nanjing","open-eyes-to-world"],status:"可建设",batch:"C5-37",scope:"明清社会经济与鸦片战争前后关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=43;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-37",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"4e364282",toPackVersion:"2026-10-21.41",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-37 新增明与清两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
