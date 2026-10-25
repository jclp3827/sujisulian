// C5-38: Ming-Qing economy and the opening of modern invasion history.
const {ref,question}=require("./learning-authoring");
const economy=ref("ming-qing","ming-qing-economy","cs-1-9-p13-ming-qing-economy-list");
const humen=ref("late-qing-invasions","humen-opium-destruction","cs-1-9-p14-humen-opium-destruction-list");
const sanyuanli=ref("late-qing-invasions","sanyuanli-resistance","cs-1-9-p14-sanyuanli-resistance-list");
const nanjing=ref("late-qing-invasions","treaty-of-nanjing","cs-1-9-p14-treaty-of-nanjing-list");
const eyes=ref("late-qing-invasions","open-eyes-to-world","cs-1-9-p14-open-eyes-to-world-list");
const groupEconomy="ming-qing-economy",groupOpium="opium-war-opening";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文时期、人物、事物和条约对应。"],excludes:["正文未展开的争议评价和过密数字",...excludes],refs});
const targets=[
  t("cs-target-ming-qing-crops",groupEconomy,"能识别明中后期从美洲引入的主要作物。","明中后期从海外引入原产美洲的玉米、甘薯，并引入花生、烟草及南瓜、番茄、辣椒等。",[economy],["不要求一次背全所有作物。"]),
  t("cs-target-qing-ceramics",groupEconomy,"能把清代景德镇、瓷都与粉彩、珐琅彩对应。","清代景德镇仍是全国制瓷业最大中心，粉彩和珐琅彩尤为精美。",[economy],["不考全部瓷器种类的工艺差异。"]),
  t("cs-target-ming-capitalism-sprout",groupEconomy,"能识别明中后期资本主义萌芽的生产关系特征。","明中后期纺织业出现以商品生产为目的的机户，雇佣工人为其劳动，被视为资本主义萌芽。",[economy]),
  t("cs-target-humen-opium",groupOpium,"能把1839年、林则徐、广州虎门与销烟对应。","1839年林则徐在广州虎门销毁鸦片，是鸦片战争爆发的导火索和直接原因。",[humen],["国际禁毒日不作为战争因果题依据。"]),
  t("cs-target-sanyuanli-resistance",groupOpium,"能把1841年三元里抗英与民众自发抵抗对应。","1841年广州三元里百姓抗英，是近代史上第一次民众大规模自发抵抗外来侵略的战斗。",[sanyuanli]),
  t("cs-target-nanjing-treaty",groupOpium,"能识别1842年《南京条约》的性质与影响。","1842年中英签订近代史上第一个不平等条约《南京条约》，中国开始沦为半殖民地半封建社会。",[nanjing]),
  t("cs-target-nanjing-provisions",groupOpium,"能识别《南京条约》的核心条款与五口通商。","《南京条约》割让香港岛、开放广州厦门福州宁波上海、规定协定关税；五口可用“福广上下宁”辅助记忆。",[nanjing],["赔款具体数额不进入口诀。"]),
  t("cs-target-open-eyes-world",groupOpium,"能区分林则徐《四洲志》与魏源《海国图志》。","林则徐组织编写《四洲志》，被称为开眼看世界第一人；魏源编《海国图志》，提出师夷长技以制夷。",[eyes]),
];
const addedQuestions=[
  question("ming-qing-crops","humanities-history",groupEconomy,"识别明清农业","明中后期从海外引入、原产美洲的主要粮食作物是？",["玉米和甘薯","占城稻和小麦","水稻和粟"],0,"正文明确列出原产美洲的玉米和甘薯。","花生、烟草及蔬菜也有引入，但本题问主要粮食作物。",[economy]),
  question("qing-ceramics","humanities-history",groupEconomy,"识别清代制瓷","清代制瓷信息正确的是？",["景德镇仍是全国最大制瓷中心，粉彩和珐琅彩尤为精美","松江是最大制瓷中心，只烧白瓷","泉州是瓷都，哥窑始于清代"],0,"清代景德镇制瓷发达，粉彩和珐琅彩驰名。","不考全部瓷种工艺差异。",[economy]),
  question("ming-capitalism-sprout","humanities-history",groupEconomy,"识别资本主义萌芽","明中后期纺织业中，被视为资本主义萌芽的现象是？",["以商品生产为目的的机户雇佣工人劳动","官府把所有工匠编入军队","农户完全停止家庭纺织"],0,"机户以商品生产为目的并雇佣工人，体现新的生产关系。","只按正文纺织业表述判断。",[economy]),
  question("ming-qing-economy-full","humanities-history",groupEconomy,"综合复辨明清经济","下列哪一项完整正确？",["明中后期引入玉米甘薯；清代景德镇制瓷发达；明中后期纺织业出现机户雇工","明代从美洲引入占城稻；清代松江成为瓷都；机户只为自用生产","清代首次出现五大名窑；明代景德镇只生产珐琅彩；资本主义萌芽指八股取士"],0,"该项正确概括农业、手工业与生产关系变化。","不扩展全部经济作物和瓷器工艺。",[economy]),
  question("humen-opium","humanities-history",groupOpium,"识别虎门销烟","1839年在广州虎门销毁鸦片、成为鸦片战争直接原因的人物是？",["林则徐","魏源","洪秀全"],0,"1839年林则徐主持虎门销烟。","国际禁毒日不是本题判断重点。",[humen]),
  question("sanyuanli-resistance","humanities-history",groupOpium,"识别三元里抗英","1841年广州三元里抗英的突出性质是？",["近代史上第一次民众大规模自发抵抗外来侵略","清政府组织的第一次海军远征","近代第一个不平等条约的签订"],0,"三元里抗英体现民众大规模自发保卫家园。","不扩展战斗细节。",[sanyuanli]),
  question("nanjing-treaty","humanities-history",groupOpium,"识别南京条约","关于1842年《南京条约》，下列哪一项正确？",["近代第一个不平等条约；割香港岛、开五口、协定关税，中国开始沦为半殖民地半封建社会","中国第一个平等边界条约；开放北京一口通商","南宋与金的和议；确立宋金南北对峙"],0,"《南京条约》的性质、核心条款和影响均如第一项。","赔款数额不作为本题核心。",[nanjing]),
  question("open-eyes-world","humanities-history",groupOpium,"区分睁眼看世界人物","“睁眼看世界”人物与著作、思想配对正确的是？",["林则徐—《四洲志》；魏源—《海国图志》、师夷长技以制夷","林则徐—《海国图志》；魏源—《永乐大典》","魏源—《四洲志》；林则徐—八股取士"],0,"林则徐与《四洲志》对应，魏源与《海国图志》及相关主张对应。","不考著作覆盖国家的具体数量。",[eyes]),
  question("opium-war-opening-full","humanities-history",groupOpium,"综合复辨近代开端","下列哪一项完整正确？",["1839年林则徐虎门销烟；1841年三元里民众抗英；1842年《南京条约》；林则徐、魏源推动睁眼看世界","1839年魏源虎门销烟；1841年签《南京条约》；林则徐编《海国图志》","1842年《尼布楚条约》割香港岛；三元里抗英由郑和领导"],0,"该项正确串起禁烟、民众抗英、条约和思想启蒙线索。","条约具体赔款数额不在本组口诀范围。",[humen,sanyuanli,nanjing,eyes]),
];
const specs=[
  ["ming-qing-crops",["cs-target-ming-qing-crops"],"agriculture",{1:"占城稻在宋代由越南引入。",2:"水稻和粟不是正文所列明中后期美洲作物。"}],
  ["qing-ceramics",["cs-target-qing-ceramics"],"ceramics",{1:"松江对应棉纺，且清代瓷器不只白瓷。",2:"泉州是贸易港，五大名窑属于宋代。"}],
  ["ming-capitalism-sprout",["cs-target-ming-capitalism-sprout"],"production-relation",{1:"正文强调机户雇工与商品生产。",2:"正文没有该表述。"}],
  ["ming-qing-economy-full",targets.slice(0,3).map(x=>x.id),"full-recheck",{1:"作物、制瓷中心和生产目的均错。",2:"名窑时期、瓷器和资本主义萌芽含义均错。"}],
  ["humen-opium",["cs-target-humen-opium"],"event",{1:"魏源与《海国图志》相关。",2:"洪秀全与太平天国相关。"}],
  ["sanyuanli-resistance",["cs-target-sanyuanli-resistance"],"event-nature",{1:"三元里是民众自发抗英。",2:"条约签订不是三元里抗英的性质。"}],
  ["nanjing-treaty",["cs-target-nanjing-treaty","cs-target-nanjing-provisions"],"treaty",{1:"性质、口岸和条约类型均错。",2:"绍兴和议属于南宋与金。"}],
  ["open-eyes-world",["cs-target-open-eyes-world"],"figure-work",{1:"著作和人物均错配。",2:"著作、人物与制度均错配。"}],
  ["opium-war-opening-full",targets.slice(3).map(x=>x.id),"full-recheck",{1:"人物、年份和著作错配。",2:"条约、人物和事件均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-ming-qing-crops":"ming-qing-crops","cs-target-qing-ceramics":"qing-ceramics","cs-target-ming-capitalism-sprout":"ming-capitalism-sprout","cs-target-humen-opium":"humen-opium","cs-target-sanyuanli-resistance":"sanyuanli-resistance","cs-target-nanjing-treaty":"nanjing-treaty","cs-target-nanjing-provisions":"nanjing-treaty","cs-target-open-eyes-world":"open-eyes-world"};
const phrase={"cs-target-ming-qing-crops":"明中后美洲玉米甘薯","cs-target-qing-ceramics":"清瓷景德镇，粉彩珐琅精","cs-target-ming-capitalism-sprout":"机户商品雇工萌芽","cs-target-humen-opium":"一八三九林则徐虎门销烟","cs-target-sanyuanli-resistance":"一八四一三元里民众抗英","cs-target-nanjing-treaty":"一八四二南京首个不平等","cs-target-nanjing-provisions":"割港岛、协关税，五口福广上下宁","cs-target-open-eyes-world":"林四洲开眼，魏海国师夷"};
const refs={"cs-target-ming-qing-crops":economy,"cs-target-qing-ceramics":economy,"cs-target-ming-capitalism-sprout":economy,"cs-target-humen-opium":humen,"cs-target-sanyuanli-resistance":sanyuanli,"cs-target-nanjing-treaty":nanjing,"cs-target-nanjing-provisions":nanjing,"cs-target-open-eyes-world":eyes};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"时期、人物、事件、条约与产业线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["赔款数额、完整作物名单和瓷器工艺细节","未纳入本组的战争过程和后续运动"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("ming-qing-economy-memory","明清社会经济三线",groupEconomy,targets.slice(0,3),"ming-qing-economy-full"),memory("opium-war-opening-memory","鸦片战争前后关键节点",groupOpium,targets.slice(3),"opium-war-opening-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupEconomy?"ming-qing-economy-full":"opium-war-opening-full"]}));
const groups=[{id:groupEconomy,title:"明清社会经济三线",scope:"humanities-history",reason:"按农业、制瓷和生产关系变化构成经济主线。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupOpium,title:"鸦片战争前后关键节点",scope:"humanities-history",reason:"按禁烟、民众抗英、条约和睁眼看世界构成近代开端主线。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-ming-qing-economy-opium",pointId:"ming-qing",relatedPointIds:["late-qing-invasions"],tabIds:["ming-qing-economy","humen-opium-destruction","sanyuanli-resistance","treaty-of-nanjing","open-eyes-to-world"],status:"已建设",batch:"C5-38",scope:"明清农业手工业生产关系与鸦片战争前后禁烟、民众抗英、条约、思想；排除过密数字和工艺细节"},{candidateId:"history-taiping-second-opium",pointId:"taiping-heavenly-kingdom",relatedPointIds:["second-opium-war"],tabIds:["jintian-uprising","tianjing-incident","taiping-failure","heavenly-land-system","senior-words","second-opium-war-causes","second-opium-war-results","yuanmingyuan-aihun"],status:"可建设",batch:"C5-38",scope:"太平天国与第二次鸦片战争关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=44;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-38",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"87b960fa",toPackVersion:"2026-10-21.42",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-38 新增明清经济与鸦片战争前后两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
