// C5-27: Western Zhou and the Spring-Autumn/Warring-States backbone.
const {ref,question}=require("./learning-authoring");
const zhou=ref("legendary-xia-shang","dynasties","cs-1-9-p3-western-zhou-list");
const transition=ref("legendary-xia-shang","transition","cs-1-9-p3-spring-autumn-warring-states-list");
const groupZhou="western-zhou-core",groupTransition="spring-warring-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文关键节点配对。"],excludes:["故事化补充",...excludes],refs});
const targets=[
 t("cs-target-western-zhou-founding",groupZhou,"能识别周武王建周、定都镐京。","周武王建立周朝，定都镐京，史称西周。",[zhou]),
 t("cs-target-hezun-zhongguo",groupZhou,"能把何尊铭文与宅兹中国对应。","正文把何尊底部铭文概括为宅兹中国。",[zhou],["不扩展铭文释读争议。"]),
 t("cs-target-western-zhou-fall",groupZhou,"能把前771年犬戎攻周与西周灭亡对应。","犬戎攻周、周幽王被杀，正文记为西周灭亡。",[zhou],["不考褒姒等人物细节。"]),
 t("cs-target-pingwang-east",groupTransition,"能把平王东迁洛邑与东周开始对应。","平王迁都洛邑，开始东周历史。",[transition]),
 t("cs-target-warring-seven",groupTransition,"能识别战国七雄集合。","齐楚燕韩赵魏秦合称战国七雄。",[transition]),
 t("cs-target-shangyang-reform",groupTransition,"能识别商鞅变法的四项正文要点。","废井田开阡陌、奖励军功、建立县制、奖励耕织。",[transition],["不评价具体制度后果。"]),
 t("cs-target-transition-divider",groupTransition,"能识别三家分晋与田氏代齐的分水岭作用。","正文把三家分晋、田氏代齐列为春秋战国分水岭。",[transition]),
];
const addedQuestions=[
 question("western-zhou-founding","humanities-history",groupZhou,"识别西周建立","周武王建立周朝后定都何处，史称西周？",["镐京","洛邑","殷"],0,"周武王定都镐京。","洛邑用于后续东周线索。",[zhou]),
 question("western-zhou-hezun","humanities-history",groupZhou,"识别何尊铭文","正文中何尊底部与“中国”二字相连的铭文是什么？",["宅兹中国","三过家门","尊王攘夷"],0,"正文记载何尊铭文为“宅兹中国”。","不扩展铭文释读争议。",[zhou]),
 question("western-zhou-fall","humanities-history",groupZhou,"识别西周灭亡","正文把犬戎攻周、周幽王被杀与哪一结果对应？",["商朝建立","西周灭亡","东汉建立"],1,"该事件对应西周灭亡。","不考故事化补充。",[zhou]),
 question("western-zhou-full","humanities-history",groupZhou,"综合复辨西周节点","下列哪一项完整正确？",["周武王定都镐京；何尊有宅兹中国；犬戎攻周后西周灭亡","周武王定都殷；何尊记三过家门；牧野之后西周灭亡","平王定都镐京并建立商朝"],0,"该项正确连接建立、铭文与灭亡节点。","不加入人物逸事。",[zhou]),
 question("transition-pingwang-east","humanities-history",groupTransition,"识别平王东迁","平王迁都洛邑，正文据此进入哪一历史阶段？",["东周","商朝","西汉"],0,"平王东迁洛邑，开始东周。","不考具体护卫诸侯。",[transition]),
 question("transition-warring-seven","humanities-history",groupTransition,"识别战国七雄","下列哪组是正文列出的战国七雄？",["齐楚燕韩赵魏秦","夏商周秦汉晋宋","吴越宋鲁郑卫曹"],0,"战国七雄是齐楚燕韩赵魏秦。","本题只检验集合。",[transition]),
 question("transition-shangyang","humanities-history",groupTransition,"识别商鞅变法","下列哪项属于正文列出的商鞅变法内容？",["建立县制并奖励军功、耕织","恢复禅让制并取消军功","只迁都，不改变其他制度"],0,"正文列有建立县制、奖励军功和奖励耕织等。","不评价具体制度后果。",[transition]),
 question("transition-divider","humanities-history",groupTransition,"识别春秋战国分水岭","正文把哪两件事并列为春秋战国分水岭？",["三家分晋、田氏代齐","阪泉之战、涿鹿之战","鸣条之战、牧野之战"],0,"三家分晋与田氏代齐并列为分水岭。","不以单一公元年份判断。",[transition]),
 question("transition-full","humanities-history",groupTransition,"综合复辨春秋战国骨架","下列哪一项完整正确？",["平王东迁开启东周；三家分晋和田氏代齐为分水岭；战国七雄含齐楚燕韩赵魏秦；商鞅变法建县制","平王东迁开启西汉；战国七雄包括夏商周；商鞅恢复禅让","三家分晋发生于史前，且与战国无关"],0,"该项正确串起东周、分水岭、七雄和变法。","春秋五霸与战役典故留待后续独立主题。",[transition]),
];
const specs=[
 ["western-zhou-founding",["cs-target-western-zhou-founding"],"founding",{1:"洛邑对应平王东迁。",2:"殷对应商朝迁都。"}],
 ["western-zhou-hezun",["cs-target-hezun-zhongguo"],"hezun",{1:"这是大禹故事线索。",2:"这是春秋争霸口号。"}],
 ["western-zhou-fall",["cs-target-western-zhou-fall"],"fall",{0:"商朝建立早于西周。",2:"东汉与本事件无关。"}],
 ["western-zhou-full",targets.slice(0,3).map(x=>x.id),"full-recheck",{1:"都城、铭文和灭亡节点均错配。",2:"人物和朝代关系错误。"}],
 ["transition-pingwang-east",["cs-target-pingwang-east"],"east",{1:"商朝早于东周。",2:"西汉晚于东周。"}],
 ["transition-warring-seven",["cs-target-warring-seven"],"seven",{1:"这是跨朝代名称集合。",2:"不是正文战国七雄。"}],
 ["transition-shangyang",["cs-target-shangyang-reform"],"reform",{1:"正文没有恢复禅让制。",2:"正文列有多项改革。"}],
 ["transition-divider",["cs-target-transition-divider"],"divider",{1:"这是史前传说战事。",2:"这是夏商、商周更替战事。"}],
 ["transition-full",targets.slice(3).map(x=>x.id),"full-recheck",{1:"阶段、七雄与变法均错误。",2:"分水岭不属于史前。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-western-zhou-founding":"western-zhou-founding","cs-target-hezun-zhongguo":"western-zhou-hezun","cs-target-western-zhou-fall":"western-zhou-fall","cs-target-pingwang-east":"transition-pingwang-east","cs-target-warring-seven":"transition-warring-seven","cs-target-shangyang-reform":"transition-shangyang","cs-target-transition-divider":"transition-divider"};
const phrase={"cs-target-western-zhou-founding":"武王镐京建西周","cs-target-hezun-zhongguo":"何尊宅兹中国","cs-target-western-zhou-fall":"犬戎攻周西周亡","cs-target-pingwang-east":"平王洛邑启东周","cs-target-warring-seven":"齐楚燕韩赵魏秦","cs-target-shangyang-reform":"废井田、奖军功、建县、奖耕织","cs-target-transition-divider":"三家分晋田氏代齐"};
const refs={"cs-target-western-zhou-founding":zhou,"cs-target-hezun-zhongguo":zhou,"cs-target-western-zhou-fall":zhou,"cs-target-pingwang-east":transition,"cs-target-warring-seven":transition,"cs-target-shangyang-reform":transition,"cs-target-transition-divider":transition};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"朝代节点与集合串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文骨架记忆。"],excludes:["故事化补充","具体战役典故"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("western-zhou-memory","西周三节点",groupZhou,targets.slice(0,3),"western-zhou-full"),memory("spring-warring-memory","春秋战国骨架",groupTransition,targets.slice(3),"transition-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupZhou?"western-zhou-full":"transition-full"]}));
const groups=[{id:groupZhou,title:"西周建立与灭亡",scope:"humanities-history",reason:"建立、何尊与灭亡三个节点。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupTransition,title:"春秋战国骨架",scope:"humanities-history",reason:"只取阶段、分水岭、七雄与商鞅变法骨架。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-western-zhou-core",pointId:"legendary-xia-shang",tabIds:["dynasties"],status:"已建设",batch:"C5-27",scope:"西周建立、何尊与灭亡；排除故事化细节"},{candidateId:"history-spring-warring-backbone",pointId:"legendary-xia-shang",tabIds:["transition"],status:"已建设",batch:"C5-27",scope:"东周开启、分水岭、七雄与商鞅变法骨架"},{candidateId:"history-pre-qin-institutions-economy",pointId:"legendary-xia-shang",tabIds:["pre-qin-institutions","pre-qin-economy"],status:"可建设",batch:"C5-27",scope:"西周四制与先秦农业青铜水利，继续拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=33;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-27",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"e116bbc6",toPackVersion:"2026-10-21.31",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-27 新增西周与春秋战国骨架两个主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
