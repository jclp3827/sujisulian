// C5-36: Yuan backbone and Song-Yuan social economy.
const {ref,question}=require("./learning-authoring");
const yuan=ref("five-dynasties-yuan","yuan","cs-1-9-p11-yuan-list");
const economy=ref("five-dynasties-yuan","five-dynasties-yuan-economy","cs-1-9-p11-five-dynasties-yuan-economy-list");
const groupYuan="yuan-backbone",groupEconomy="song-yuan-economy";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文时期、人物、制度、地区与事物配对。"],excludes:["正文未展开的争议评价和过细工艺词",...excludes],refs});
const targets=[
  t("cs-target-mongol-unification",groupYuan,"能把1206年、铁木真与蒙古统一对应。","1206年铁木真统一蒙古各部，建立蒙古政权，被尊称为成吉思汗。",[yuan]),
  t("cs-target-yuan-founding",groupYuan,"能把1271年、忽必烈、大元与大都对应。","1271年忽必烈建立大元，定都大都。",[yuan],["不把1206年蒙古政权建立等同于1271年元朝建立。"]),
  t("cs-target-yuan-fall",groupYuan,"能把1368年、朱元璋北伐军攻占大都与元亡对应。","1368年朱元璋北伐军攻占元大都，元朝灭亡。",[yuan]),
  t("cs-target-yuan-province-system",groupYuan,"能区分中央中书省与地方行中书省。","元朝中央设中书省总理全国政务，地方设行中书省；我国省级行政区设立始于元朝。",[yuan]),
  t("cs-target-yuan-penghu-office",groupYuan,"能把澎湖巡检司与澎湖、台湾管辖对应。","元政府设置澎湖巡检司，负责管辖澎湖和台湾。",[yuan]),
  t("cs-target-yuan-xuanzheng",groupYuan,"能把宣政院与佛教、西藏行政事务对应。","元朝设置宣政院，管理全国佛教事务和西藏地区行政事务。",[yuan]),
  t("cs-target-song-agriculture",groupEconomy,"能识别宋代农业中的苏湖粮仓与占城稻。","宋代有“苏湖熟，天下足”；从越南引入占城稻，水稻跃居粮食产量首位。",[economy],["不扩展棉花传播的全部地区顺序。"]),
  t("cs-target-song-kilns",groupEconomy,"能识别汝、官、哥、钧、定五大名窑及核心对应。","宋代五大名窑为汝、官、哥、钧、定；哥窑见金丝铁线，钧窑见蚯蚓走泥纹，定窑以白瓷为代表。",[economy],["不要求背诵全部胎釉鉴别术语。"]),
  t("cs-target-yuan-cotton-textile",groupEconomy,"能把元成宗时期黄道婆与松江棉纺织对应。","元成宗时期黄道婆带来棉纺织技术和工具，使松江棉纺织品声名远扬。",[economy]),
  t("cs-target-song-shipbuilding",groupEconomy,"能识别宋代造船业水平与集中地区。","宋代造船业水平先进，主要集中在东南沿海，广州、泉州、明州等地发达。",[economy]),
  t("cs-target-song-yuan-commerce",groupEconomy,"能识别交子、坊市变化和元代泉州。","北宋交子是中国最早由政府正式发行的纸币；宋代坊市和经营时间限制被打破；元代泉州是重要对外贸易港口。",[economy],["不把交子表述扩展为所有口径下无争议的世界第一。"]),
];
const addedQuestions=[
  question("yuan-founding-timeline","humanities-history",groupYuan,"区分蒙古统一与元朝建立","关于蒙古统一与元朝建立，下列哪一项正确？",["1206年铁木真统一蒙古；1271年忽必烈建大元、都大都","1206年忽必烈建大元；1271年铁木真统一蒙古","1271年元昊统一蒙古；1368年忽必烈建大元"],0,"1206年铁木真统一蒙古，1271年忽必烈建立大元并定都大都。","蒙古政权建立与元朝国号建立是两个节点。",[yuan]),
  question("yuan-fall","humanities-history",groupYuan,"识别元朝灭亡","1368年攻占元大都、导致元朝灭亡的北伐军以谁为首？",["朱元璋","赵构","完颜阿骨打"],0,"1368年朱元璋北伐军攻占元大都，元朝灭亡。","不扩展北伐过程。",[yuan]),
  question("yuan-province-system","humanities-history",groupYuan,"识别行省制度","元朝行省制度的机构对应正确的是？",["中央中书省总理政务，地方设行中书省","中央宣政院总理全部政务，地方设澎湖巡检司","中央行中书省管理佛教，地方中书省管台湾"],0,"元朝中央设中书省，地方设行中书省；省级行政区设立始于元朝。","不把边疆专门机构混入一般行政层级。",[yuan]),
  question("yuan-frontier-institutions","humanities-history",groupYuan,"区分元朝边疆机构","元朝边疆机构配对正确的是？",["澎湖巡检司—澎湖和台湾；宣政院—佛教与西藏行政事务","澎湖巡检司—西藏；宣政院—澎湖和台湾","中书省—只管台湾；行中书省—只管佛教"],0,"澎湖巡检司管辖澎湖和台湾；宣政院管理佛教及西藏行政事务。","只按正文所列机构职责判断。",[yuan]),
  question("yuan-full","humanities-history",groupYuan,"综合复辨元朝主线","下列哪一项完整正确？",["1206年铁木真统一蒙古；1271年忽必烈建元；地方设行中书省；澎湖巡检司管澎台、宣政院管西藏；1368年元亡","1271年铁木真建元；宣政院管澎台；1234年元亡","1206年忽必烈建元；行中书省只管佛教；1279年元亡"],0,"该项正确串起蒙古统一、建元、制度、边疆机构与灭亡。","不考等级排序和疆域最大评价。",[yuan]),
  question("song-agriculture","humanities-history",groupEconomy,"识别宋代农业","宋代农业信息配对正确的是？",["苏州、湖州成为粮仓；从越南引入占城稻","松江成为瓷都；从蒙古引入交子","泉州成为粮仓；从西藏引入白瓷"],0,"宋代有“苏湖熟，天下足”，并从越南引入占城稻。","不扩展作物传播的全部过程。",[economy]),
  question("song-kilns","humanities-history",groupEconomy,"识别宋代名窑","关于宋代五大名窑，下列哪一项正确？",["汝、官、哥、钧、定；哥窑有金丝铁线，钧窑有蚯蚓走泥纹，定窑以白瓷为代表","汝、官、景、越、定；钧窑有金丝铁线，哥窑只烧白瓷","汝、哥、松、泉、明；定窑有蚯蚓走泥纹"],0,"宋代五大名窑为汝、官、哥、钧、定，典型特征按正文对应。","不要求背诵全部胎釉鉴别词。",[economy]),
  question("song-yuan-industry","humanities-history",groupEconomy,"识别宋元手工业","宋元手工业配对正确的是？",["元代黄道婆推动松江棉纺；宋代造船业集中于东南沿海","宋代黄道婆推动大都棉纺；元代造船只集中于西北","元代黄道婆发明交子；宋代造船只在临安"],0,"黄道婆与元代松江棉纺相关；宋代造船业在东南沿海多地发达。","不扩展技术传播路线。",[economy]),
  question("song-yuan-commerce","humanities-history",groupEconomy,"识别宋元商业","宋元商业信息正确的是？",["北宋有政府正式发行的交子；宋代坊市与时间限制被打破；元代泉州是重要外贸港口","南宋首次发行交子；宋代坊市界限更严格；元代大都禁止外贸","元代首次发行交子；宋代只有日中为市；泉州是内陆粮仓"],0,"交子、坊市变化和元代泉州共同反映宋元商业发展。","不把交子的世界最早口径作为唯一判断条件。",[economy]),
  question("song-yuan-economy-full","humanities-history",groupEconomy,"综合复辨宋元经济","下列哪一项完整正确？",["宋代有苏湖粮仓、占城稻和五大名窑；元代黄道婆推动松江棉纺；北宋有交子，宋代坊市限制被打破，元代泉州外贸发达","宋代从蒙古引入占城稻；元代黄道婆烧制汝瓷；交子始于明朝","苏湖是元代都城；五大名窑均烧白瓷；宋代禁止早市夜市"],0,"该项正确概括农业、制瓷、棉纺和商业主线。","造船地点及瓷器细部仍以正文为准。",[economy]),
];
const specs=[
  ["yuan-founding-timeline",["cs-target-mongol-unification","cs-target-yuan-founding"],"founding-timeline",{1:"人物和两个年份节点互换。",2:"人物、年份和政权均错配。"}],
  ["yuan-fall",["cs-target-yuan-fall"],"fall",{1:"赵构建立南宋。",2:"完颜阿骨打建立金。"}],
  ["yuan-province-system",["cs-target-yuan-province-system"],"institution",{1:"宣政院与澎湖巡检司不是一般中央地方行政层级。",2:"中书省、行中书省和宣政院职责错配。"}],
  ["yuan-frontier-institutions",["cs-target-yuan-penghu-office","cs-target-yuan-xuanzheng"],"institution-contrast",{1:"两个机构职责互换。",2:"中书省、行中书省不是正文中的两类边疆专门机构。"}],
  ["yuan-full",targets.slice(0,6).map(x=>x.id),"full-recheck",{1:"建元人物、机构职责和灭亡年份错误。",2:"建元人物、机构职责和灭亡年份错误。"}],
  ["song-agriculture",["cs-target-song-agriculture"],"agriculture",{1:"松江棉纺、交子与题干农业对应错误。",2:"泉州、白瓷与题干农业对应错误。"}],
  ["song-kilns",["cs-target-song-kilns"],"ceramics",{1:"名窑名单和典型特征错配。",2:"名单与特征均不符合正文。"}],
  ["song-yuan-industry",["cs-target-yuan-cotton-textile","cs-target-song-shipbuilding"],"industry",{1:"时期、地区和造船分布错误。",2:"黄道婆与交子无关，造船地点也错误。"}],
  ["song-yuan-commerce",["cs-target-song-yuan-commerce"],"commerce",{1:"交子时期、坊市变化和贸易状态错误。",2:"交子时期、经营时间和泉州性质错误。"}],
  ["song-yuan-economy-full",targets.slice(6).map(x=>x.id),"full-recheck",{1:"作物来源、黄道婆行业和交子时期错误。",2:"苏湖、名窑特征和市场限制均错误。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-mongol-unification":"yuan-founding-timeline","cs-target-yuan-founding":"yuan-founding-timeline","cs-target-yuan-fall":"yuan-fall","cs-target-yuan-province-system":"yuan-province-system","cs-target-yuan-penghu-office":"yuan-frontier-institutions","cs-target-yuan-xuanzheng":"yuan-frontier-institutions","cs-target-song-agriculture":"song-agriculture","cs-target-song-kilns":"song-kilns","cs-target-yuan-cotton-textile":"song-yuan-industry","cs-target-song-shipbuilding":"song-yuan-industry","cs-target-song-yuan-commerce":"song-yuan-commerce"};
const phrase={"cs-target-mongol-unification":"一二零六铁木真蒙古统","cs-target-yuan-founding":"一二七一忽必烈大都元","cs-target-yuan-fall":"一三六八大都破元亡","cs-target-yuan-province-system":"中央中书地方行省","cs-target-yuan-penghu-office":"澎湖巡检管澎台","cs-target-yuan-xuanzheng":"宣政佛教兼西藏","cs-target-song-agriculture":"苏湖粮仓占城稻","cs-target-song-kilns":"汝官哥钧定，哥线钧纹定白瓷","cs-target-yuan-cotton-textile":"黄道婆松江棉纺","cs-target-song-shipbuilding":"宋船东南广泉明","cs-target-song-yuan-commerce":"交子破坊时，元泉州外贸"};
const refs=Object.fromEntries(targets.map(x=>[x.id,x.groupId===groupYuan?yuan:economy]));
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"年份、人物、制度、地区与产业线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["疆域最大评价、等级排序和过细工艺词","未纳入本组的政治轶事与产业全史"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("yuan-memory","元朝建立制度与灭亡",groupYuan,targets.slice(0,6),"yuan-full"),memory("song-yuan-economy-memory","宋元社会经济主线",groupEconomy,targets.slice(6),"song-yuan-economy-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupYuan?"yuan-full":"song-yuan-economy-full"]}));
const groups=[{id:groupYuan,title:"元朝建立制度与灭亡",scope:"humanities-history",reason:"按蒙古统一、建元、制度、边疆治理和灭亡构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupEconomy,title:"宋元社会经济主线",scope:"humanities-history",reason:"按农业、制瓷、棉纺、造船和商业构成经济主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-yuan-song-yuan-economy",pointId:"five-dynasties-yuan",tabIds:["yuan","five-dynasties-yuan-economy"],status:"已建设",batch:"C5-36",scope:"元朝建立制度灭亡与宋元农业手工业商业；排除争议评价和过细工艺词"},{candidateId:"history-ming-qing",pointId:"ming-qing",tabIds:["ming","qing"],status:"可建设",batch:"C5-36",scope:"明清关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=42;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-36",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"ae22c49e",toPackVersion:"2026-10-21.40",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-36 新增元朝与宋元社会经济两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
