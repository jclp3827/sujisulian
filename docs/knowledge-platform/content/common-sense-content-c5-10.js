// C5-10: stable prices and balance-of-payments accounting.
const { ref, question } = require("./learning-authoring");
const inflation=ref("stable-prices","stable-prices-inflation","cs-23-30-p16-stable-prices-inflation-list");
const indicators=ref("stable-prices","stable-prices-indicators","cs-23-30-p16-stable-prices-indicators-list");
const redistribution=ref("stable-prices","stable-prices-redistribution","cs-23-30-p17-stable-prices-redistribution-list");
const deflation=ref("stable-prices","stable-prices-deflation","cs-23-30-p17-stable-prices-deflation-list");
const bop=ref("balance-of-payments","balance-of-payments-meaning","cs-23-30-p17-balance-of-payments-meaning-list");
const t=(id,groupId,statement,conclusion,conditions,excludes,refs)=>({id,revision:1,status:"review",scope:"economics",groupId,statement,conclusion,conditions,excludes,refs});
const targets=[
 t("cs-target-inflation-definition","stable-prices-core","能识别通货膨胀要求一段时间内商品和劳务价格持续且普遍上涨。","通货膨胀的价格表现是持续、普遍上涨，实质是社会总需求大于社会总供给。",["不能用个别商品一次涨价代替定义。"],["不使用固定 CPI 阈值作为普遍判断。"],[inflation]),
 t("cs-target-price-indices","stable-prices-core","能区分 CPI、PPI 和 WPI 的正文统计对象。","CPI 关注居民生活产品和劳务，PPI 关注原材料和中间投入品等，WPI 反映批发价格变动。",["只按正文基本对象区分。"],["不使用时点指数值或固定阈值。"],[indicators]),
 t("cs-target-inflation-redistribution","stable-prices-core","能识别正文列出的通胀再分配基本方向。","通胀不利于固定货币收入者和债权人，相对有利于变动收入者和债务人。",["答案限定为正文一般方向。"],["不判断具体合同、利率和指数化安排。"],[redistribution]),
 t("cs-target-deflation-definition","stable-prices-core","能识别通货紧缩是一般物价水平持续下降且总供给大于总需求。","通货紧缩表现为一般物价水平持续下降，实质是社会总供给大于社会总需求。",["保留一般物价水平和持续下降。"],["不把个别商品降价等同通缩。"],[deflation]),
 t("cs-target-bop-balance","balance-of-payments-core","能识别国际收支平衡的正文净额关系。","国际收支净额即净出口与净资本流出的差额为零。",["按正文差额为零口径。"],["不扩展国际收支账户全表。"],[bop]),
 t("cs-target-net-exports","balance-of-payments-core","能计算正文中的净出口方向。","净出口等于出口减进口。",["保持出口减进口顺序。"],["不计算具体汇率影响。"],[bop]),
 t("cs-target-net-capital-outflow","balance-of-payments-core","能识别净资本流出的正文计算方向。","净资本流出等于本国居民购买外国资产减外国人购买本国资产。",["保持两个资产购买方向。"],["不扩展资本与金融账户分类。"],[bop]),
];
const addedQuestions=[
 question("inflation-definition","economics","stable-prices-core","识别通胀定义","哪种现象符合正文对通货膨胀价格表现的描述？",["一段时间内商品和劳务价格持续且普遍上涨","某一种蔬菜某天涨价","所有商品价格永远不变"],0,"通胀要求一段时间内价格持续且普遍上涨。","个别商品一次涨价不足以构成定义。",[inflation]),
 question("price-indices","economics","stable-prices-core","区分三类价格指数","下列对应哪一项符合正文？",["CPI—居民生活相关产品和劳务；PPI—原材料和中间投入品；WPI—批发价格变动","CPI—只统计原材料；PPI—只统计居民服务；WPI—只统计工资","三者统计对象完全相同"],0,"正文分别给出居民消费、生产投入和批发价格三个基本观察对象。","不使用固定阈值。",[indicators]),
 question("inflation-redistribution","economics","stable-prices-core","识别通胀再分配方向","仅按正文一般方向，通货膨胀相对有利于哪一方？",["债权人和固定货币收入者","债务人和变动收入者","所有人同等受益"],1,"正文指出通胀不利于固定货币收入者和债权人，相对有利于变动收入者和债务人。","具体合同安排可能改变结果，本题只按正文一般方向。",[redistribution]),
 question("deflation-definition","economics","stable-prices-core","识别通缩定义","哪一项符合正文对通货紧缩的描述？",["一般物价水平持续下降，社会总供给大于社会总需求","个别商品短期促销降价","价格持续普遍上涨且总需求大于总供给"],0,"通缩是一般物价水平持续下降，实质为总供给大于总需求。","个别商品促销不等同通缩。",[deflation]),
 question("stable-prices-full","economics","stable-prices-core","综合复辨通胀通缩","下列哪一项完整正确？",["通胀只是个别商品一次涨价，且通常有利于债权人；通缩是任何商品降价","通胀表现为持续普遍上涨，CPI 观察居民生活相关价格，正文一般方向上不利于债权人；通缩表现为一般物价持续下降","CPI、PPI、WPI 的统计对象完全相同，通胀和通缩都表现为普遍上涨"],1,"该项同时保留通胀的持续普遍上涨、CPI 基本对象、正文再分配方向和通缩的一般物价持续下降。","不使用固定 CPI 阈值，也不据此判断具体合同结果。",[inflation,indicators,redistribution,deflation]),
 question("bop-balance","economics","balance-of-payments-core","识别国际收支平衡关系","按正文，国际收支平衡意味着什么？",["净出口与净资本流出的差额为零","出口必须为零","本国居民不得购买外国资产"],0,"正文将国际收支平衡表述为净出口与净资本流出的差额为零。","不扩展账户全表。",[bop]),
 question("net-exports","economics","balance-of-payments-core","识别净出口公式","净出口怎样计算？",["进口减出口","出口减进口","出口加进口"],1,"净出口等于出口减进口。","保持计算方向。",[bop]),
 question("net-capital-outflow","economics","balance-of-payments-core","识别净资本流出公式","净资本流出怎样计算？",["本国居民购买外国资产减外国人购买本国资产","外国人购买本国资产减本国居民购买外国资产","两者相加"],0,"正文按本国居民购买外国资产减外国人购买本国资产计算。","不扩展资本账户分类。",[bop]),
 question("bop-full","economics","balance-of-payments-core","综合复辨国际收支公式","下列哪一项完整正确？",["净出口=进口—出口；净资本流出=外国人购买本国资产—本国居民购买外国资产","净出口=出口—进口；净资本流出=本国居民购买外国资产—外国人购买本国资产；二者差额为零时符合正文平衡口径","国际收支平衡要求出口和进口都为零"],1,"该项正确保留两个计算方向和平衡关系。","不扩展国际收支账户全表。",[bop]),
];
const rows=[
 ["inflation-definition",["cs-target-inflation-definition"],"inflation-definition",{1:"个别商品一次涨价不满足持续、普遍条件。",2:"价格不变不是通胀。"}],
 ["price-indices",["cs-target-price-indices"],"indices",{1:"三类指数对象被错配。",2:"三类指数对象并不完全相同。"}],
 ["inflation-redistribution",["cs-target-inflation-redistribution"],"redistribution",{0:"正文一般方向与该项相反。",2:"正文没有表述所有人同等受益。"}],
 ["deflation-definition",["cs-target-deflation-definition"],"deflation-definition",{1:"个别商品短期降价不满足一般物价持续下降。",2:"该项描述通胀方向。"}],
 ["stable-prices-full",["cs-target-inflation-definition","cs-target-price-indices","cs-target-inflation-redistribution","cs-target-deflation-definition"],"full-recheck",{0:"把个别价格变化误作通胀通缩，并颠倒债权人方向。",2:"三类指数对象不同，通缩也不是普遍上涨。"}],
 ["bop-balance",["cs-target-bop-balance"],"balance",{1:"平衡不要求出口为零。",2:"正文没有禁止资产购买。"}],
 ["net-exports",["cs-target-net-exports"],"net-exports",{0:"计算顺序颠倒。",2:"净出口不是两者相加。"}],
 ["net-capital-outflow",["cs-target-net-capital-outflow"],"net-capital",{1:"计算顺序颠倒。",2:"净资本流出不是两者相加。"}],
 ["bop-full",["cs-target-bop-balance","cs-target-net-exports","cs-target-net-capital-outflow"],"full-recheck",{0:"两个计算方向均颠倒。",2:"平衡不要求进出口都为零。"}],
];
const questionSpecifications=rows.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const makeMnemonic=(id,title,text,coverage,excludes,phrases,questionIds)=>({id,revision:1,status:"review",scope:"economics",title,purpose:`帮助回忆${title}。`,text,method:"对照压缩",coverage,conditions:["口诀只压缩正文关系，不替代完整定义。"],excludes,phrases,questionIds});
const mnemonics=[
 makeMnemonic("stable-prices-memory","通胀通缩与三类指数","通胀普涨总需大，通缩普降总供大；CPI 看生活，PPI 看投入，WPI 看批发。","通胀通缩基本定义和三类价格指数对象。",["固定 CPI 阈值","具体合同的通胀再分配结果"],[
  {id:"stable-memory-inflation",phrase:"通胀普涨总需大",meaning:"持续普遍上涨，社会总需求大于总供给。",targetIds:["cs-target-inflation-definition"],coverageType:"inflation",conditionRefs:[],refs:[inflation],questionIds:["inflation-definition","stable-prices-full"],checks:[{questionId:"inflation-definition",checkPurpose:"inflation-definition",reviewTarget:"phrase",reviewAnchorId:"stable-memory-inflation"},{questionId:"stable-prices-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"stable-memory-inflation"}]},
  {id:"stable-memory-deflation",phrase:"通缩普降总供大",meaning:"一般物价持续下降，社会总供给大于总需求。",targetIds:["cs-target-deflation-definition"],coverageType:"deflation",conditionRefs:[],refs:[deflation],questionIds:["deflation-definition","stable-prices-full"],checks:[{questionId:"deflation-definition",checkPurpose:"deflation-definition",reviewTarget:"phrase",reviewAnchorId:"stable-memory-deflation"},{questionId:"stable-prices-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"stable-memory-deflation"}]},
  {id:"stable-memory-indices",phrase:"CPI 看生活，PPI 看投入，WPI 看批发",meaning:"分别对应居民生活产品劳务、原材料中间投入品和批发价格。",targetIds:["cs-target-price-indices"],coverageType:"indices",conditionRefs:[{id:"stable-memory-no-threshold",text:"不记固定 CPI 阈值。"}],refs:[indicators],questionIds:["price-indices","stable-prices-full"],checks:[{questionId:"price-indices",checkPurpose:"indices",reviewTarget:"condition",reviewAnchorId:"stable-memory-no-threshold"},{questionId:"stable-prices-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"stable-memory-indices"}]},
 ],["inflation-definition","price-indices","deflation-definition","stable-prices-full"]),
 makeMnemonic("balance-of-payments-memory","国际收支三步式","净出口出减进；净流出内买外减外买内；二者差为零。","净出口、净资本流出和平衡关系。",["国际收支账户全表","汇率变化推导"],[
  {id:"bop-memory-export",phrase:"净出口出减进",meaning:"出口减进口。",targetIds:["cs-target-net-exports"],coverageType:"formula",conditionRefs:[],refs:[bop],questionIds:["net-exports","bop-full"],checks:[{questionId:"net-exports",checkPurpose:"net-exports",reviewTarget:"phrase",reviewAnchorId:"bop-memory-export"},{questionId:"bop-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"bop-memory-export"}]},
  {id:"bop-memory-capital",phrase:"净流出内买外减外买内",meaning:"本国居民购买外国资产减外国人购买本国资产。",targetIds:["cs-target-net-capital-outflow"],coverageType:"formula",conditionRefs:[],refs:[bop],questionIds:["net-capital-outflow","bop-full"],checks:[{questionId:"net-capital-outflow",checkPurpose:"net-capital",reviewTarget:"phrase",reviewAnchorId:"bop-memory-capital"},{questionId:"bop-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"bop-memory-capital"}]},
  {id:"bop-memory-balance",phrase:"二者差为零",meaning:"净出口与净资本流出的差额为零。",targetIds:["cs-target-bop-balance"],coverageType:"balance",conditionRefs:[],refs:[bop],questionIds:["bop-balance","bop-full"],checks:[{questionId:"bop-balance",checkPurpose:"balance",reviewTarget:"phrase",reviewAnchorId:"bop-memory-balance"},{questionId:"bop-full",checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:"bop-memory-balance"}]},
 ],addedQuestions.slice(5).map(x=>x.id)),
];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=[
 ["cs-target-inflation-definition",["inflation-definition"],["stable-prices-full"]],["cs-target-price-indices",["price-indices"],["stable-prices-full"]],["cs-target-inflation-redistribution",["inflation-redistribution"],["stable-prices-full"]],["cs-target-deflation-definition",["deflation-definition"],["stable-prices-full"]],
 ["cs-target-bop-balance",["bop-balance"],["bop-full"]],["cs-target-net-exports",["net-exports"],["bop-full"]],["cs-target-net-capital-outflow",["net-capital-outflow"],["bop-full"]],
].map(([targetId,directQuestionIds,variationQuestionIds])=>({targetId,directQuestionIds,variationQuestionIds}));
const groups=[{id:"stable-prices-core",title:"通胀、通缩与价格指数",scope:"economics",reason:"用持续普遍变化、供求方向和指数对象划清边界。",questionIds:addedQuestions.slice(0,5).map(x=>x.id)},{id:"balance-of-payments-core",title:"国际收支三步计算",scope:"economics",reason:"依次确认净出口、净资本流出和平衡关系。",questionIds:addedQuestions.slice(5).map(x=>x.id)}];
const sourceDispositions=[
 {candidateId:"stable-prices-core",pointId:"stable-prices",tabIds:["stable-prices-inflation","stable-prices-indicators","stable-prices-redistribution","stable-prices-deflation"],status:"已建设",batch:"C5-10",scope:"通胀通缩、价格指数和再分配一般方向；排除固定阈值"},
 {candidateId:"balance-of-payments-core",pointId:"balance-of-payments",tabIds:["balance-of-payments-meaning"],status:"已建设",batch:"C5-10",scope:"净出口、净资本流出和平衡差额"},
 {candidateId:"macro-control-measures",pointId:"macro-control-measures",tabIds:["macro-control-measures"],status:"可建设",batch:"C5-10",scope:"经济、法律、行政三类宏观调控手段"},
 {candidateId:"fiscal-policy-core",pointId:"fiscal-policy",tabIds:["fiscal-definition","fiscal-income","fiscal-spending","fiscal-application"],status:"可建设",batch:"C5-10",scope:"财政政策定义、收入支出工具与扩张紧缩基本方向"},
];
function applyQuestions(q){return q.concat(addedQuestions)}function applyGroups(g){return g.concat(groups)}function applyMnemonics(m){return m.concat(mnemonics)}function applyEntryPlans(e){const p=JSON.parse(JSON.stringify(e)),ids=addedQuestions.map(x=>x.id);p.revision=16;p.modes.qa.groupIds.push(...groups.map(x=>x.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...mnemonics.flatMap(m=>m.questionIds));p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(x=>x.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-10",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"a841f422",toPackVersion:"2026-10-21.14",changedQuestionIds:addedQuestions.map(x=>x.id),changedMnemonicIds:mnemonics.map(x=>x.id),reason:"C5-10 新增稳定物价与国际收支两个主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
