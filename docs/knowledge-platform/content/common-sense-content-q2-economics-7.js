"use strict";

// Q2 经济第七批：GDP/GNP 核算边界与经济增长三驾马车。
const QUESTION_IDS=["gdp-definition-core","gdp-final-intermediate","gdp-flow-produced","gdp-gnp-territory-national","gdp-gnp-full","growth-three-carriages","growth-internal-external-demand","growth-three-carriages-full"];
const replacementRows={
 "gdp-definition-core":{objective:"识别 GDP 定义的地域、时期、生产、最终产品和市场价值要素",prompt:"核对一项统计是否符合 GDP 定义，哪组要素必须同时保留？",options:["一国或地区、一定时期、生产的最终产品和劳务、市场价值","某一时点、居民持有的各类资产、已经售出商品、历史账面原值","全球范围、历年累计、中间产品、投入成本"],answer:0,explanation:"GDP 衡量一国或地区在一定时期内生产的最终产品和劳务的市场价值。",boundary:"本题识别定义要素，不计算名义 GDP、实际 GDP 或具体数值。"},
 "gdp-final-intermediate":{objective:"由避免重复计算理解 GDP 只计最终产品",prompt:"面粉被面包店购入制作面包。核算这批最终面包时，为什么不再把面粉价值单独重复加入 GDP？",options:["避免同一生产价值被重复计算","因为中间产品在生产中不产生价值","因为 GDP 只核算进口商品的市场价值"],answer:0,explanation:"GDP 测度最终产品价值；中间产品价值已进入最终产品，若再单独计入会重复计算。",boundary:"这里说明最终产品口径，不展开增加值核算、存货处理等复杂案例。"},
 "gdp-flow-produced":{objective:"识别 GDP 的时期流量和生产口径",prompt:"某最终产品在本期生产但尚未售出。仅按材料给出的 GDP 时间与生产口径，哪项判断正确？",options:["因尚未售出，本期不可能计入 GDP","GDP 看本期生产的最终产品价值，属于时期流量","GDP 是某一时点资产余额，侧重期末库存数量和账面价格"],answer:1,explanation:"GDP 统计一定时期内生产的最终产品价值，属于流量，不以本期已经售出为必要条件。",boundary:"本题只检验时期、生产和流量口径，不处理具体存货核算方法。"},
 "gdp-gnp-territory-national":{objective:"区分 GDP 地域口径与 GNP 国民口径",prompt:"区分 GDP 与 GNP 时，哪组观察口径正确？",options:["GDP 看生产发生的地域，GNP 看常住居民拥有的生产要素","GDP 看常住居民拥有的生产要素，GNP 看生产活动发生的地域范围","GDP 与 GNP 按最终产品是否售出和交易完成时间区分"],answer:0,explanation:"GDP 是地域概念；GNP 按常住居民拥有的生产要素形成国民概念。",boundary:"本题识别口径，不计算境外要素收入或两项指标差额。"},
 "gdp-gnp-full":{objective:"综合复辨 GDP 核算边界和 GNP 对照",prompt:"关于 GDP 与 GNP 的核算口径，下列说法正确的是？",options:["GDP 把中间产品再次单独计入，并按某一时点统计资产存量","GDP 按地域统计一定时期生产的最终产品市场价值，属于流量；GNP 采用国民口径","GDP 侧重已经售出的最终产品，GDP 与 GNP 按商品销售地点和成交对象共同判断"],answer:1,explanation:"正确表述同时保留 GDP 的地域、时期、生产、最终产品、市场价值和流量口径，并与 GNP 的国民口径区分。",boundary:"不扩展非市场活动、名义与实际 GDP 及复杂跨境核算。"},
 "growth-three-carriages":{objective:"识别拉动经济增长的三驾马车",prompt:"材料所称拉动经济增长的“三驾马车”包括哪三项？",options:["投资、消费、出口","税收、利率、汇率","进口、储蓄、库存"],answer:0,explanation:"投资、消费和出口被称为拉动经济增长的三驾马车。",boundary:"该称谓不表示三项在各时期贡献相同，也不用于判断现实排序。"},
 "growth-internal-external-demand":{objective:"区分三驾马车中的内需与外需",prompt:"对三驾马车按内需、外需分类，哪项正确？",options:["投资和消费属于内需，出口属于外需","出口和消费属于内需，投资属于外需","投资和出口属于内需，消费属于外需"],answer:0,explanation:"投资和消费合称内需，出口称为外需。",boundary:"本题只识别材料中的分类，不展开净出口核算和需求贡献率。"},
 "growth-three-carriages-full":{objective:"综合复辨三驾马车名单与内外需对应",prompt:"关于经济增长三驾马车及其内外需对应，下列说法正确的是？",options:["进口、税收、储蓄构成三驾马车，三项都属于内需","投资、消费、出口构成三驾马车；投资和消费为内需，出口为外需","投资、进口、库存构成三驾马车；出口不属于经济增长动力，消费也不在名单中"],answer:1,explanation:"三驾马车是投资、消费、出口，其中投资和消费属于内需，出口属于外需。",boundary:"不据这一基础分类推断某一时期的实际贡献大小。"},
};
const distractorReasons={
 "gdp-definition-core":{1:"GDP 是一定时期内的生产流量，不是某一时点居民全部资产的账面余额。",2:"GDP 不采用全球历年累计口径，也不把中间产品投入成本重复计入。"},
 "gdp-final-intermediate":{1:"中间产品具有价值，只是在最终产品价值中已经体现，不能再次单独计入。",2:"GDP 并非只核算进口商品，该项与避免中间产品重复计算无关。"},
 "gdp-flow-produced":{0:"材料明确 GDP 按本期生产而非本期售出判断，尚未售出不能直接排除。",2:"GDP 是一定时期内的流量，不是某一时点资产余额或库存数量。"},
 "gdp-gnp-territory-national":{1:"该项把 GDP 的地域口径与 GNP 的国民口径相互颠倒。",2:"是否售出不是 GDP 与 GNP 的区分标准，两者区别在地域和国民口径。"},
 "gdp-gnp-full":{0:"GDP 不重复单独计入中间产品，也不是某一时点的资产存量。",2:"GDP 按生产而非是否售出判断，GDP 与 GNP 也不按商品销售地共同划分。"},
 "growth-three-carriages":{1:"税收、利率和汇率属于政策或价格变量，不是材料列出的三驾马车。",2:"进口、储蓄和库存不符合材料所列投资、消费、出口三项。"},
 "growth-internal-external-demand":{1:"消费属于内需，投资也属于内需，出口才对应外需。",2:"出口属于外需，消费属于内需，该项把两者的分类颠倒。"},
 "growth-three-carriages-full":{0:"该项既没有列出投资、消费、出口，也错误地把三项都归为内需。",2:"该项遗漏消费、加入进口和库存，并错误否定出口的动力地位。"},
};
const cognitiveLevels={"gdp-definition-core":"condition","gdp-final-intermediate":"application","gdp-flow-produced":"application","gdp-gnp-territory-national":"distinction","gdp-gnp-full":"synthesis","growth-three-carriages":"recall","growth-internal-external-demand":"mapping","growth-three-carriages-full":"synthesis"};
const questionDispositions=QUESTION_IDS.map(questionId=>({questionId,decision:"rewrite",reason:"保留稳定题目身份，改为核算条件、生产情境或内外需映射判断，并补齐逐项理由和边界。"}));
const targetRows={
 "cs-target-gdp-definition":{statement:"能识别 GDP 定义的地域、时期、生产、最终产品和市场价值要素。",conclusion:"GDP 是一国或地区一定时期内生产的最终产品和劳务的市场价值。",conditions:["地域、时期、生产、最终产品和市场价值要素须同时保留。"],excludes:["不计算名义或实际 GDP。"]},
 "cs-target-gdp-final-products":{statement:"能由避免重复计算理解 GDP 只计最终产品。",conclusion:"中间产品价值已进入最终产品，不能再次单独计入 GDP。",conditions:["判断对象是同一生产链中的中间产品和最终产品。"],excludes:["不展开增加值和存货核算。"]},
 "cs-target-gdp-flow-production":{statement:"能识别 GDP 的时期流量和生产口径。",conclusion:"GDP 是一定时期内生产的最终产品价值，属于流量，不以当期售出为必要条件。",conditions:["区分一定时期与一定时点、生产与售出。"],excludes:["不处理具体存货核算方法。"]},
 "cs-target-gdp-gnp-boundary":{statement:"能区分 GDP 地域口径与 GNP 国民口径。",conclusion:"GDP 看生产发生的地域，GNP 看常住居民拥有的生产要素。",conditions:["比较使用材料中的地域与国民口径。"],excludes:["不计算境外要素收入。"]},
 "cs-target-growth-three-carriages":{statement:"能识别投资、消费和出口是拉动经济增长的三驾马车。",conclusion:"三驾马车是投资、消费和出口。",conditions:["使用材料中的基础名单。"],excludes:["不推断各时期贡献率和现实排序。"]},
 "cs-target-growth-internal-external-demand":{statement:"能区分投资和消费属于内需、出口属于外需。",conclusion:"投资、消费合称内需，出口称为外需。",conditions:["在三驾马车分类语境中判断。"],excludes:["不展开净出口核算。"]},
};
const variationRows={
 "cs-target-gdp-definition":{directQuestionIds:["gdp-definition-core"],variationQuestionIds:["gdp-gnp-full"],processDifference:"直接题核对 GDP 五项定义要素，变式题把这些要素与流量、最终产品和 GNP 国民口径放在一起综合复辨。"},
 "cs-target-gdp-final-products":{directQuestionIds:["gdp-final-intermediate"],variationQuestionIds:["gdp-gnp-full"],processDifference:"直接题用面粉和面包情境解释避免重复计算，变式题在完整核算口径中排除再次单独计入中间产品。"},
 "cs-target-gdp-flow-production":{directQuestionIds:["gdp-flow-produced"],variationQuestionIds:["gdp-gnp-full"],processDifference:"直接题从本期生产尚未售出判断生产和流量口径，变式题把时期流量与地域、最终产品等边界合并判断。"},
 "cs-target-gdp-gnp-boundary":{directQuestionIds:["gdp-gnp-territory-national"],variationQuestionIds:["gdp-gnp-full"],processDifference:"直接题对照地域与国民口径，变式题先还原 GDP 完整定义再与 GNP 口径区分。"},
 "cs-target-growth-three-carriages":{directQuestionIds:["growth-three-carriages"],variationQuestionIds:["growth-three-carriages-full"],processDifference:"直接题识别投资消费出口三项名单，变式题同时要求名单完整并与内需外需分类一致。"},
 "cs-target-growth-internal-external-demand":{directQuestionIds:["growth-internal-external-demand"],variationQuestionIds:["growth-three-carriages-full"],processDifference:"直接题完成投资消费出口的内外需映射，变式题先识别三驾马车再综合检查分类。"},
};
const mnemonicDispositions=[
 {groupId:"gdp-gnp-boundaries",decision:"study-outline-existing",resourceId:"gdp-gnp-boundaries-memory",reason:"五项核算边界与 GDP/GNP 对照适合有限清单回看，但缺少自然记忆钩子，应标为速记提纲。"},
 {groupId:"economic-growth-three-carriages",decision:"structural-mnemonic-candidate",resourceId:"growth-three-carriages-memory",reason:"可用‘投资消费在内、出口在外’的空间关系同时还原三项名单和内外需分类。"},
];
const applyQuestions=items=>items.map(item=>replacementRows[item.id]?{...item,...replacementRows[item.id],revision:item.revision+1}:item);
const applyTargets=items=>items.map(item=>targetRows[item.id]?{...item,...targetRows[item.id],revision:item.revision+1}:item);
const applyQuestionTargetRelations=items=>items.map(item=>QUESTION_IDS.includes(item.questionId)?{...item,checkPurpose:item.questionId.startsWith("growth-")?"q2-economics-growth-drivers":"q2-economics-gdp-boundaries"}:item);
const applyQuestionSpecifications=items=>items.map(item=>QUESTION_IDS.includes(item.questionId)?{...item,checkPurpose:item.questionId.startsWith("growth-")?"q2-economics-growth-drivers":"q2-economics-gdp-boundaries",cognitiveLevel:cognitiveLevels[item.questionId],distractorReasons:distractorReasons[item.questionId]}:item);
const applyVariationDecisions=items=>items.map(item=>variationRows[item.targetId]?{targetId:item.targetId,...variationRows[item.targetId]}:item);
const applyGroups=items=>items.map(item=>item.id==="gdp-gnp-boundaries"?{...item,mnemonicDecision:"study-outline",mnemonicReason:mnemonicDispositions[0].reason}:item.id==="economic-growth-three-carriages"?{...item,mnemonicDecision:"structural-mnemonic",mnemonicReason:mnemonicDispositions[1].reason}:item);
function applyMnemonics(items){return items.map(item=>{if(item.id==="gdp-gnp-boundaries-memory"){const phrases={"gdp-memory-definition":"地域、时期、生产、最终、市场价值","gdp-memory-flow":"时期流量看生产","gdp-memory-gdp-gnp":"GDP 看地域，GNP 看国民"};return{...item,revision:item.revision+1,title:"GDP 五项核算清单",text:"地域、时期、生产、最终、市场价值；时期流量看生产；GDP 看地域，GNP 看国民。",method:"五项定义边界—流量生产—地域国民三栏对照",learningForm:"study-outline",formLabel:"速记提纲",purpose:"有限回看 GDP 定义边界、流量生产口径及与 GNP 的区别。",phrases:item.phrases.map(p=>({...p,phrase:phrases[p.id],coverageType:"study-outline-accounting-boundaries",checks:p.checks.map(c=>({...c,checkPurpose:"q2-economics-gdp-boundaries"}))}))};}if(item.id==="growth-three-carriages-memory"){const phrases={"growth-memory-list":"投资、消费、出口，三驾拉增长","growth-memory-demand":"投资消费在内，出口在外"};return{...item,revision:item.revision+1,title:"投消在内，出口在外",text:"投资、消费、出口，三驾拉增长；投资消费在内，出口在外。",method:"先还原三项名单，再用内外空间关系映射内需和外需",learningForm:"structural-mnemonic",formLabel:"结构口诀",purpose:"用三项名单和内外空间关系还原三驾马车及内外需分类。",phrases:item.phrases.map(p=>({...p,phrase:phrases[p.id],coverageType:"structural-list-and-demand-mapping",checks:p.checks.map(c=>({...c,checkPurpose:"q2-economics-growth-drivers"}))}))};}return item;});}
const applyMnemonicSpecifications=items=>items.map(item=>item.mnemonicId==="gdp-gnp-boundaries-memory"?{...item,revision:item.revision+1,purpose:"有限回看 GDP 定义边界、流量生产口径及与 GNP 的区别。",method:"五项定义边界—流量生产—地域国民三栏对照"}:item.mnemonicId==="growth-three-carriages-memory"?{...item,revision:item.revision+1,purpose:"用三项名单和内外空间关系还原三驾马车及内外需分类。",method:"先还原三项名单，再用内外空间关系映射内需和外需"}:item);
const applyMnemonicPhraseTargetRelations=items=>items.map(item=>item.mnemonicId==="gdp-gnp-boundaries-memory"?{...item,coverageType:"study-outline-accounting-boundaries"}:item.mnemonicId==="growth-three-carriages-memory"?{...item,coverageType:"structural-list-and-demand-mapping"}:item);
module.exports={schemaVersion:1,revision:1,batch:"Q2-economics-7",status:"review",QUESTION_IDS,replacementRows,distractorReasons,cognitiveLevels,questionDispositions,targetRows,variationRows,mnemonicDispositions,applyQuestions,applyTargets,applyQuestionTargetRelations,applyQuestionSpecifications,applyVariationDecisions,applyGroups,applyMnemonics,applyMnemonicSpecifications,applyMnemonicPhraseTargetRelations,sessionMigrations:[{fromVersion:"2026102381",toPackVersion:"2026-10-23.82",changedQuestionIds:QUESTION_IDS,changedMnemonicIds:["gdp-gnp-boundaries-memory","growth-three-carriages-memory"],reason:"Q2 经济第七批重写 GDP/GNP 与三驾马车八题；GDP 资源退回完整术语提纲，三驾马车改为内外空间映射结构口诀。"}]};
