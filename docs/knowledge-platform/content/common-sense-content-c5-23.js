// C5-23: supply-demand directions, buyer/seller markets and macro-control goals.
const { ref, question } = require("./learning-authoring");
const law = ref("supply-demand-law", "supply-demand-law", "cs-23-30-p11-supply-demand-law-list");
const market = ref("supply-demand-law", "buyer-seller-market", "cs-23-30-p11-buyer-seller-market-list");
const macro = ref("macro-control-goals-overview", "macro-goals-overview", "cs-23-30-p14-macro-goals-overview-list");
const groupLaw = "supply-demand-direction-core", groupMacro = "macro-control-goals-core";
const t = (id, groupId, statement, conclusion, conditions, excludes, refs) => ({ id, revision: 1, status: "review", scope: "economics", groupId, statement, conclusion, conditions, excludes, refs });
const targets = [
  t("cs-target-supply-demand-direction", groupLaw, "能根据需求与供给的大小判断价格变化方向。", "需求大于供给时价格上升，需求小于供给时价格下降。", ["按正文一般方向判断。"], ["不预测具体商品价格和幅度。"], [law]),
  t("cs-target-buyer-market", groupLaw, "能识别供给大于需求时的买方市场。", "供给大于需求、价格趋降，买方有利。", ["供需关系与交易地位同时判断。"], ["不把买方市场理解为需求更大。"], [market]),
  t("cs-target-seller-market", groupLaw, "能识别供给小于需求时的卖方市场。", "供给小于需求、价格趋涨，卖方有利。", ["供需关系与交易地位同时判断。"], ["不把卖方市场理解为供给更多。"], [market]),
  t("cs-target-macro-goals-list-c523", groupMacro, "能完整识别宏观调控四项目标。", "促进经济增长、增加就业、稳定物价、保持国际收支平衡。", ["按正文目标总览。"], ["不扩展具体政策工具。"], [macro]),
  t("cs-target-macro-primary-goal-c523", groupMacro, "能识别宏观调控最主要目标。", "促进经济增长是最主要目标。", ["按正文表述。"], ["不把其他三项目标排除在外。"], [macro]),
];
const addedQuestions = [
  question("supply-demand-direction", "economics", groupLaw, "判断供求价格方向", "按正文的一般规律，需求大于供给时价格通常怎样变化？", ["上升", "下降", "必然不变"], 0, "需求大于供给时价格上升。", "这里只判断一般方向，不预测具体幅度。", [law]),
  question("buyer-market", "economics", groupLaw, "识别买方市场", "供给大于需求、价格有下降趋势时，通常属于哪种市场？", ["卖方市场", "买方市场", "供需完全无关的市场"], 1, "供给大于需求时买方在交易中较有利。", "买方市场并不是需求大于供给。", [market]),
  question("seller-market", "economics", groupLaw, "识别卖方市场", "供给小于需求、价格有上涨趋势时，谁在交易中通常更有利？", ["买方", "卖方", "双方地位必然完全相同"], 1, "供给小于需求时形成卖方市场，卖方较有利。", "只按正文一般关系判断。", [market]),
  question("supply-demand-market-full", "economics", groupLaw, "综合复辨供求与交易地位", "下列哪一项完整正确？", ["需求大于供给时价格趋升；供给大于需求时为买方市场；供给小于需求时为卖方市场", "需求大于供给时价格趋降；供给大于需求时卖方有利", "买方市场和卖方市场与供求关系无关"], 0, "该项正确连接价格方向和买卖双方地位。", "不延伸到具体商品价格预测。", [law, market]),
  question("macro-goals-list-c523", "economics", groupMacro, "识别宏观调控四目标", "下列哪一组完整属于正文列出的宏观调控四项目标？", ["经济增长、增加就业、稳定物价、国际收支平衡", "提高所有商品价格、减少就业、贸易顺差", "只追求经济增长，不考虑其他目标"], 0, "四项目标可概括为“两增一稳保平衡”。", "本题不涉及实现目标的政策工具。", [macro]),
  question("macro-primary-goal-c523", "economics", groupMacro, "识别最主要目标", "正文所说宏观调控最主要的目标是什么？", ["保持国际收支平衡", "促进经济增长", "稳定所有商品的绝对价格"], 1, "促进经济增长是宏观调控最主要的目标。", "其他目标仍属于四项目标。", [macro]),
  question("macro-goals-full-c523", "economics", groupMacro, "综合复辨宏观调控目标", "关于宏观调控目标，下列哪一项正确？", ["四项目标是两增一稳保平衡，促进经济增长是最主要目标", "只有增加就业一个目标", "国际收支平衡不属于宏观调控目标"], 0, "该项完整保留四项目标及最主要目标。", "不据此判断具体政策选择。", [macro]),
];
const specs = [
  ["supply-demand-direction", ["cs-target-supply-demand-direction"], "direction", {1:"供不应求时价格通常上升。",2:"供求变化会影响价格方向。"}],
  ["buyer-market", ["cs-target-buyer-market"], "buyer-market", {0:"供给大于需求时买方更有利。",2:"供求关系决定交易地位。"}],
  ["seller-market", ["cs-target-seller-market"], "seller-market", {0:"供给小于需求时卖方更有利。",2:"正文并未说双方地位必然相同。"}],
  ["supply-demand-market-full", targets.slice(0,3).map(x=>x.id), "full-recheck", {1:"价格方向与交易地位均反置。",2:"买卖方市场按供求关系区分。"}],
  ["macro-goals-list-c523", ["cs-target-macro-goals-list-c523"], "four-goals", {1:"该项不是正文四目标。",2:"正文还包含就业、物价和国际收支目标。"}],
  ["macro-primary-goal-c523", ["cs-target-macro-primary-goal-c523"], "primary-goal", {0:"它是四目标之一，但不是正文所称最主要目标。",2:"正文要求稳定物价，不是绝对固定。"}],
  ["macro-goals-full-c523", targets.slice(3).map(x=>x.id), "full-recheck", {1:"宏观调控共有四项目标。",2:"国际收支平衡属于四目标。"}],
];
const questionSpecifications = specs.map(([questionId, primaryTargetIds, checkPurpose, distractorReasons]) => ({questionId, primaryTargetIds, supportingTargetIds: [], checkPurpose, distractorReasons}));
const direct = {"cs-target-supply-demand-direction":"supply-demand-direction","cs-target-buyer-market":"buyer-market","cs-target-seller-market":"seller-market","cs-target-macro-goals-list-c523":"macro-goals-list-c523","cs-target-macro-primary-goal-c523":"macro-primary-goal-c523"};
const refByTarget = {"cs-target-supply-demand-direction":law,"cs-target-buyer-market":market,"cs-target-seller-market":market,"cs-target-macro-goals-list-c523":macro,"cs-target-macro-primary-goal-c523":macro};
const phraseByTarget = {"cs-target-supply-demand-direction":"需多价升，供多价降","cs-target-buyer-market":"供大需，买方利","cs-target-seller-market":"供小需，卖方利","cs-target-macro-goals-list-c523":"两增一稳保平衡","cs-target-macro-primary-goal-c523":"增长是主要目标"};
function makeMnemonic(id, title, groupId, list, fullId) { return {id,revision:1,status:"review",scope:"economics",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phraseByTarget[x.id]).join("；")+"。",method:"方向与角色串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["只压缩正文明确结论。"],excludes:["具体商品价格预测","具体宏观政策工具"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phraseByTarget[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refByTarget[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}; }
const mnemonics = [makeMnemonic("supply-demand-market-memory","供求方向与买卖方",groupLaw,targets.slice(0,3),"supply-demand-market-full"),makeMnemonic("macro-control-goals-memory","宏观调控四目标",groupMacro,targets.slice(3),"macro-goals-full-c523")];
const mnemonicPhraseTargetRelations = mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications = mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions = targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupLaw?"supply-demand-market-full":"macro-goals-full-c523"]}));
const groups = [{id:groupLaw,title:"供求方向与买卖方",scope:"economics",reason:"把价格方向和交易有利方合并辨析。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupMacro,title:"两增一稳保平衡",scope:"economics",reason:"四项目标与最主要目标同组复辨。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions = [{candidateId:"supply-demand-law-macro-goals",pointId:"supply-demand-law",relatedPointIds:["macro-control-goals-overview"],tabIds:["supply-demand-law","buyer-seller-market","macro-goals-overview"],status:"已建设",batch:"C5-23",scope:"供求价格方向、买卖方市场与宏观调控四目标"},{candidateId:"history-next-stable-topics",pointId:"ancient-history",relatedPointIds:[],tabIds:[],status:"待盘点",batch:"C5-23",scope:"转入文史正文，按小主题继续盘点稳定事实与边界"}];
function applyQuestions(items){return items.concat(addedQuestions);} function applyGroups(items){return items.concat(groups);} function applyMnemonics(items){return items.concat(mnemonics);}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=29;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan;}
module.exports={schemaVersion:1,revision:1,batch:"C5-23",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"f93b499",toPackVersion:"2026-10-21.27",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-23 新增供求方向、买卖方市场与宏观调控目标；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
