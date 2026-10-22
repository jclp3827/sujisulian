// C5-9: economic growth drivers and bounded employment concepts.
const { ref, question } = require("./learning-authoring");
const drivers = ref("economic-growth", "economic-growth-drivers", "cs-23-30-p15-economic-growth-drivers-list");
const employmentMeasure = ref("full-employment", "employment-measure", "cs-23-30-p15-full-employment-measure-list");
const unemploymentMeaning = ref("full-employment", "unemployment-meaning", "cs-23-30-p15-full-employment-unemployment-meaning-list");
const unemploymentTypes = ref("full-employment", "unemployment-types", "cs-23-30-p15-p16-full-employment-unemployment-types-list");
const unemploymentConcepts = ref("full-employment", "unemployment-concepts", "cs-23-30-p16-full-employment-concepts-list");
const target = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  target("cs-target-growth-three-carriages", "economic-growth-three-carriages", "能识别投资、消费和出口是拉动经济增长的三驾马车。", "三驾马车是投资、消费和出口。", ["只按正文名称对应。"], ["不推断某时期各项贡献率。"], [drivers]),
  target("cs-target-growth-internal-external-demand", "economic-growth-three-carriages", "能区分投资和消费属于内需，出口属于外需。", "投资、消费合称内需，出口称为外需。", ["不把进口加入正文三驾马车名单。"], ["不展开净出口核算。"], [drivers]),
  target("cs-target-unemployment-definition", "full-employment-core", "能识别失业需要有劳动能力、愿意就业而没有工作。", "失业主体须有劳动能力、愿意就业且没有工作。", ["正文还保留达到就业年龄与谋求工作语境。"], ["不把所有未工作人口都计为失业。"], [unemploymentMeaning]),
  target("cs-target-unemployment-types", "full-employment-core", "能按原因区分摩擦性、结构性、季节性和周期性失业。", "正常流动为摩擦性，供需结构不匹配为结构性，季节变化为季节性，衰退需求下降为周期性。", ["按导致失业的主要原因判断。"], ["不判断复杂现实个案的唯一归类。"], [unemploymentTypes]),
  target("cs-target-unemployment-rate", "full-employment-core", "能识别失业率是失业人口与劳动力人口之比。", "失业率等于失业人口与劳动力人口之比。", ["分母是劳动力人口，不是总人口。"], ["不计算统计口径调整。"], [employmentMeasure, unemploymentConcepts]),
  target("cs-target-full-employment-natural", "full-employment-core", "能理解自然失业通常包括摩擦性和结构性，充分就业不等于零失业。", "当实际失业率等于自然失业率时属于正文所述充分就业；充分就业不代表失业率为零。", ["不使用固定百分比作为普遍判断。"], ["不把季节性和周期性直接列入正文的自然失业组成。"], [unemploymentConcepts]),
];
const addedQuestions = [
  question("growth-three-carriages", "economics", "economic-growth-three-carriages", "识别三驾马车", "拉动经济增长的“三驾马车”是指什么？", ["投资、消费、出口", "税收、利率、汇率", "进口、储蓄、库存"], 0, "正文将投资、消费和出口称为拉动经济增长的三驾马车。", "不表示三者在所有时期贡献相同。", [drivers]),
  question("growth-internal-external-demand", "economics", "economic-growth-three-carriages", "区分内需外需", "按正文，内需与外需的对应正确的是哪一项？", ["投资和消费属于内需，出口属于外需", "出口属于内需，投资属于外需", "消费和出口都只属于外需"], 0, "投资和消费合称内需，出口称为外需。", "本题不扩展净出口计算。", [drivers]),
  question("growth-three-carriages-full", "economics", "economic-growth-three-carriages", "综合复辨三驾马车", "下列哪一项完整符合正文？", ["投资、消费、出口是三驾马车；投资和消费为内需，出口为外需", "进口、税收、储蓄是三驾马车；都属于内需", "投资、进口、库存是三驾马车；出口不影响经济增长"], 0, "该项同时正确列出三驾马车并区分内需、外需。", "只记正文分类，不推断现实贡献率。", [drivers]),
  question("unemployment-definition", "economics", "full-employment-core", "识别失业定义条件", "下列哪一组是正文列出的失业主体三个必要条件？", ["有劳动能力、愿意就业、没有工作", "没有工作、不愿就业、没有劳动能力", "有工作、愿意就业、收入较低"], 0, "失业主体须有劳动能力、愿意就业并且没有工作。", "未工作但无就业意愿者不能仅凭这一状态归入正文定义。", [unemploymentMeaning]),
  question("unemployment-types", "economics", "full-employment-core", "区分四种原因型失业", "经济衰退阶段因需求下降造成的失业，按正文属于哪一类？", ["摩擦性失业", "结构性失业", "周期性失业"], 2, "经济周期衰退或萧条阶段因需求下降造成的是周期性失业。", "正常流动对应摩擦性，供需结构不匹配对应结构性。", [unemploymentTypes]),
  question("unemployment-rate", "economics", "full-employment-core", "识别失业率口径", "正文中的失业率通常怎样计算？", ["失业人口与劳动力人口之比", "失业人口与总人口之比", "就业人口与总人口之比"], 0, "失业率是失业人口与劳动力人口之比。", "分母不是总人口。", [employmentMeasure, unemploymentConcepts]),
  question("full-employment-not-zero", "economics", "full-employment-core", "理解充分就业不等于零失业", "关于充分就业，哪一项符合正文？", ["充分就业意味着失业率必须为零", "实际失业率等于自然失业率时可称充分就业，且充分就业不代表零失业", "充分就业要求不存在摩擦性和结构性失业"], 1, "正文指出实际失业率等于自然失业率时属于充分就业，并明确充分就业不代表失业率为零。", "本题不采用固定百分比。", [unemploymentConcepts]),
  question("full-employment-full", "economics", "full-employment-core", "综合复辨就业概念", "下列哪一项完整正确？", ["失业率分母是总人口；充分就业等于零失业", "自然失业通常包括摩擦性和结构性；失业率以劳动力人口为分母；充分就业不等于零失业", "周期性失业属于自然失业的唯一组成"], 1, "正文把摩擦性和结构性列为自然失业的通常组成，以劳动力人口计算失业率，并说明充分就业不等于零失业。", "不使用固定百分比作为普遍标准。", [unemploymentMeaning, unemploymentTypes, employmentMeasure, unemploymentConcepts]),
];
const data = [
  ["growth-three-carriages", ["cs-target-growth-three-carriages"], "direct-list", {1:"该组是宏观政策变量，不是正文三驾马车。",2:"该组不符合正文名单。"}],
  ["growth-internal-external-demand", ["cs-target-growth-internal-external-demand"], "demand-classification", {1:"投资属于内需，出口属于外需。",2:"消费属于内需。"}],
  ["growth-three-carriages-full", ["cs-target-growth-three-carriages","cs-target-growth-internal-external-demand"], "full-recheck", {1:"名单与内外需分类均错误。",2:"名单遗漏消费、加入进口和库存。"}],
  ["unemployment-definition", ["cs-target-unemployment-definition"], "definition", {1:"该项缺少能力和意愿条件。",2:"已有工作不符合没有工作条件。"}],
  ["unemployment-types", ["cs-target-unemployment-types"], "type-classification", {0:"正常流动对应摩擦性。",1:"技能、产业等供需不匹配对应结构性。"}],
  ["unemployment-rate", ["cs-target-unemployment-rate"], "rate-boundary", {1:"分母应为劳动力人口。",2:"该项不是失业率定义。"}],
  ["full-employment-not-zero", ["cs-target-full-employment-natural"], "full-employment", {0:"充分就业不代表零失业。",2:"自然失业通常包括摩擦性和结构性。"}],
  ["full-employment-full", ["cs-target-unemployment-definition","cs-target-unemployment-types","cs-target-unemployment-rate","cs-target-full-employment-natural"], "full-recheck", {0:"失业率分母和充分就业含义均错误。",2:"周期性失业不是正文列出的自然失业唯一组成。"}],
];
const questionSpecifications=data.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const mnemonic = (id,title,text,coverage,excludes,phrases,questionIds) => ({id,revision:1,status:"review",scope:"economics",title,purpose:`帮助回忆${title}。`,text,method:"分类压缩",coverage,conditions:["口诀只压缩正文关系，答题时还原完整条件。"],excludes,phrases,questionIds});
const mnemonics=[
  mnemonic("growth-three-carriages-memory","三驾马车与内外需","投消出三驾车，投消内需、出口外需。","投资、消费、出口及内需外需对应。",["现实贡献率","净出口核算"],[
    {id:"growth-memory-list",phrase:"投消出三驾车",meaning:"投资、消费、出口。",targetIds:["cs-target-growth-three-carriages"],coverageType:"list",conditionRefs:[],refs:[drivers],questionIds:["growth-three-carriages","growth-three-carriages-full"],checks:[{questionId:"growth-three-carriages",checkPurpose:"direct-list",reviewTarget:"phrase",reviewAnchorId:"growth-memory-list"},{questionId:"growth-three-carriages-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"growth-memory-list"}]},
    {id:"growth-memory-demand",phrase:"投消内需、出口外需",meaning:"投资和消费合称内需，出口称为外需。",targetIds:["cs-target-growth-internal-external-demand"],coverageType:"classification",conditionRefs:[],refs:[drivers],questionIds:["growth-internal-external-demand","growth-three-carriages-full"],checks:[{questionId:"growth-internal-external-demand",checkPurpose:"demand-classification",reviewTarget:"phrase",reviewAnchorId:"growth-memory-demand"},{questionId:"growth-three-carriages-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"growth-memory-demand"}]},
  ],addedQuestions.slice(0,3).map(x=>x.id)),
  mnemonic("full-employment-memory","失业分类与充分就业","失业能愿无工作；流动摩擦、错配结构、季节随时、衰退周期；失业除劳力，充分不为零。","失业定义、四种原因型失业、失业率分母和充分就业边界。",["固定自然失业率数值","复杂现实个案唯一归类"],[
    {id:"employment-memory-definition",phrase:"失业能愿无工作",meaning:"有劳动能力、愿意就业、没有工作。",targetIds:["cs-target-unemployment-definition"],coverageType:"definition",conditionRefs:[],refs:[unemploymentMeaning,unemploymentTypes,unemploymentConcepts],questionIds:["unemployment-definition","full-employment-full"],checks:[{questionId:"unemployment-definition",checkPurpose:"definition",reviewTarget:"phrase",reviewAnchorId:"employment-memory-definition"},{questionId:"full-employment-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"employment-memory-definition"}]},
    {id:"employment-memory-types",phrase:"流动摩擦、错配结构、季节随时、衰退周期",meaning:"正常流动、结构错配、季节变化、周期衰退分别对应四类失业。",targetIds:["cs-target-unemployment-types"],coverageType:"types",conditionRefs:[],refs:[unemploymentTypes],questionIds:["unemployment-types","full-employment-full"],checks:[{questionId:"unemployment-types",checkPurpose:"type-classification",reviewTarget:"phrase",reviewAnchorId:"employment-memory-types"},{questionId:"full-employment-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"employment-memory-types"}]},
    {id:"employment-memory-rate",phrase:"失业除劳力",meaning:"失业率是失业人口与劳动力人口之比。",targetIds:["cs-target-unemployment-rate"],coverageType:"rate",conditionRefs:[],refs:[employmentMeasure,unemploymentConcepts],questionIds:["unemployment-rate","full-employment-full"],checks:[{questionId:"unemployment-rate",checkPurpose:"rate-boundary",reviewTarget:"phrase",reviewAnchorId:"employment-memory-rate"},{questionId:"full-employment-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"employment-memory-rate"}]},
    {id:"employment-memory-full",phrase:"充分不为零",meaning:"实际失业率等于自然失业率时属于充分就业，充分就业不等于零失业。",targetIds:["cs-target-full-employment-natural"],coverageType:"boundary",conditionRefs:[{id:"employment-memory-no-fixed-rate",text:"不使用固定百分比作为普遍标准。"}],refs:[unemploymentConcepts],questionIds:["full-employment-not-zero","full-employment-full"],checks:[{questionId:"full-employment-not-zero",checkPurpose:"full-employment",reviewTarget:"condition",reviewAnchorId:"employment-memory-no-fixed-rate"},{questionId:"full-employment-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"employment-memory-full"}]},
  ],addedQuestions.slice(3).map(x=>x.id)),
];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=[
  ["cs-target-growth-three-carriages",["growth-three-carriages"],["growth-three-carriages-full"]],["cs-target-growth-internal-external-demand",["growth-internal-external-demand"],["growth-three-carriages-full"]],
  ["cs-target-unemployment-definition",["unemployment-definition"],["full-employment-full"]],["cs-target-unemployment-types",["unemployment-types"],["full-employment-full"]],["cs-target-unemployment-rate",["unemployment-rate"],["full-employment-full"]],["cs-target-full-employment-natural",["full-employment-not-zero"],["full-employment-full"]],
].map(([targetId,directQuestionIds,variationQuestionIds])=>({targetId,directQuestionIds,variationQuestionIds}));
const groups=[{id:"economic-growth-three-carriages",title:"三驾马车与内外需",scope:"economics",reason:"把三项动力与内外需对应一次记清。",questionIds:addedQuestions.slice(0,3).map(x=>x.id)},{id:"full-employment-core",title:"失业类型与充分就业",scope:"economics",reason:"围绕定义、类型、比率和非零失业边界。",questionIds:addedQuestions.slice(3).map(x=>x.id)}];
const sourceDispositions=[
  {candidateId:"economic-growth-three-carriages",pointId:"economic-growth",tabIds:["economic-growth-drivers"],status:"已建设",batch:"C5-9",scope:"投资、消费、出口及内需外需对应"},
  {candidateId:"full-employment-core",pointId:"full-employment",tabIds:["employment-measure","unemployment-meaning","unemployment-types","unemployment-concepts"],status:"已建设",batch:"C5-9",scope:"失业定义、原因型失业、失业率与充分就业非零边界；排除固定百分比"},
  {candidateId:"stable-prices-core",pointId:"stable-prices",tabIds:["inflation-meaning-types","inflation-causes","inflation-effects","deflation","price-index"],status:"可建设",batch:"C5-9",scope:"通胀通缩、成因影响和价格指数基本口径；需排除时点数值"},
  {candidateId:"balance-of-payments-core",pointId:"balance-of-payments",tabIds:["balance-of-payments"],status:"可建设",batch:"C5-9",scope:"国际收支平衡基本含义"},
];
function applyQuestions(q){return q.concat(addedQuestions)} function applyGroups(g){return g.concat(groups)} function applyMnemonics(m){return m.concat(mnemonics)}
function applyEntryPlans(e){const p=JSON.parse(JSON.stringify(e)),ids=addedQuestions.map(x=>x.id);p.revision=15;p.modes.qa.groupIds.push(...groups.map(x=>x.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(x=>x.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-9",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"139a94c0",toPackVersion:"2026-10-21.13",changedQuestionIds:addedQuestions.map(x=>x.id),changedMnemonicIds:mnemonics.map(x=>x.id),reason:"C5-9 新增三驾马车与充分就业两个主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
