// C5-26: bounded Xia and Shang dynasty transitions.
const {ref,question}=require("./learning-authoring");
const source=ref("legendary-xia-shang","dynasties","cs-1-9-p2-xia-list");
const shang=ref("legendary-xia-shang","dynasties","cs-1-9-p2-p3-shang-list");
const groupXia="xia-dynasty-core",groupShang="shang-dynasty-core";
const t=(id,groupId,statement,conclusion,refs)=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文朝代线索配对。"],excludes:["具体年代争议","补充人物逸事"],refs});
const targets=[
 t("cs-target-xia-qi-hereditary",groupXia,"能识别启继位与世袭制代替禅让制。","启继承王位标志正文所述公天下转为家天下。",[source]),
 t("cs-target-xia-erlitou",groupXia,"能把二里头文化与夏朝史籍时空对应线索关联。","河南偃师二里头遗址的地域和年代与史籍夏朝记载相符。",[source]),
 t("cs-target-xia-mingtiao",groupXia,"能把鸣条之战与商汤击败夏桀、夏亡对应。","鸣条之战连接商汤伐夏与夏朝灭亡。",[source]),
 t("cs-target-shang-tang",groupShang,"能识别商汤推翻夏朝、建立商朝。","商汤建商，正文记载初都亳城。",[shang]),
 t("cs-target-shang-pangeng",groupShang,"能把盘庚迁殷与商朝稳定对应。","盘庚把都城迁到殷，商朝此后稳定。",[shang]),
 t("cs-target-shang-muye",groupShang,"能把牧野之战与周武王伐纣、商亡对应。","牧野之战中商军倒戈，周武王攻入朝歌，商亡。",[shang]),
];
const addedQuestions=[
 question("xia-qi-hereditary","humanities-history",groupXia,"识别启与世袭制","正文中谁继承王位，使世袭制代替禅让制？",["启","商汤","周武王"],0,"禹的儿子启继承王位。","只识别正文朝代线索。",[source]),
 question("xia-erlitou","humanities-history",groupXia,"识别二里头文化","河南偃师宫殿遗址的地域和年代与史籍夏朝记载相符，这一文化代表称为什么？",["红山文化","二里头文化","龙山文化"],1,"正文称这一文化代表为二里头文化。","不扩展考古争议。",[source]),
 question("xia-mingtiao","humanities-history",groupXia,"识别鸣条之战","商汤击败夏桀、夏朝灭亡，对应哪场战事？",["牧野之战","阪泉之战","鸣条之战"],2,"鸣条之战连接商汤伐夏与夏亡。","牧野之战对应商周更替。",[source]),
 question("xia-dynasty-full","humanities-history",groupXia,"综合复辨夏朝线索","下列哪一项完整正确？",["启—世袭代禅让；二里头—夏朝时空线索；鸣条—商汤伐夏","启—盘庚迁殷；二里头—周朝；鸣条—周武王伐商","商汤—世袭代禅让；牧野—夏亡"],0,"该项正确连接夏朝三个关键线索。","不包含少康等补充内容。",[source]),
 question("shang-tang-founded","humanities-history",groupShang,"识别商汤建商","正文中推翻夏朝并建立商朝的是谁？",["商汤","盘庚","周幽王"],0,"商汤推翻夏朝并建立商朝。","不以辅佐人物作为本题考点。",[shang]),
 question("shang-pangeng-yin","humanities-history",groupShang,"识别盘庚迁殷","哪一事件与商朝迁都后趋于稳定直接对应？",["平王东迁","盘庚迁殷","烽火戏诸侯"],1,"盘庚把都城迁到殷，商朝稳定下来。","不考具体公元年份。",[shang]),
 question("shang-muye","humanities-history",groupShang,"识别牧野之战","周武王伐纣、商军倒戈并导致商亡，对应哪场战事？",["鸣条之战","涿鹿之战","牧野之战"],2,"牧野之战连接周武王伐纣与商亡。","鸣条之战对应夏商更替。",[shang]),
 question("shang-dynasty-full","humanities-history",groupShang,"综合复辨商朝线索","下列哪一项完整正确？",["商汤建商；盘庚迁殷；牧野之战后商亡","盘庚建夏；商汤迁殷；鸣条之战后商亡","周幽王建商；平王迁殷"],0,"该项按建立、迁都、灭亡串起商朝。","不加入武丁等补充线索。",[shang]),
];
const specs=[
 ["xia-qi-hereditary",["cs-target-xia-qi-hereditary"],"qi",{1:"商汤对应建商。",2:"周武王对应伐纣。"}],
 ["xia-erlitou",["cs-target-xia-erlitou"],"erlitou",{0:"红山文化不对应该宫殿遗址。",2:"龙山文化不对应该表述。"}],
 ["xia-mingtiao",["cs-target-xia-mingtiao"],"mingtiao",{0:"牧野对应商周更替。",1:"阪泉属于炎黄传说线索。"}],
 ["xia-dynasty-full",targets.slice(0,3).map(x=>x.id),"full-recheck",{1:"人物、文化与战事均错配。",2:"商汤和牧野的对应关系错误。"}],
 ["shang-tang-founded",["cs-target-shang-tang"],"tang",{1:"盘庚对应迁殷。",2:"周幽王属于西周末年。"}],
 ["shang-pangeng-yin",["cs-target-shang-pangeng"],"pangeng",{0:"平王东迁对应东周开始。",2:"烽火戏诸侯与西周末年相连。"}],
 ["shang-muye",["cs-target-shang-muye"],"muye",{0:"鸣条对应夏亡。",1:"涿鹿属于炎黄传说线索。"}],
 ["shang-dynasty-full",targets.slice(3).map(x=>x.id),"full-recheck",{1:"建立、迁都和灭亡线索错配。",2:"人物与朝代错误。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-xia-qi-hereditary":"xia-qi-hereditary","cs-target-xia-erlitou":"xia-erlitou","cs-target-xia-mingtiao":"xia-mingtiao","cs-target-shang-tang":"shang-tang-founded","cs-target-shang-pangeng":"shang-pangeng-yin","cs-target-shang-muye":"shang-muye"};
const phrase={"cs-target-xia-qi-hereditary":"启继位，世袭替禅让","cs-target-xia-erlitou":"偃师二里头连夏","cs-target-xia-mingtiao":"鸣条商汤灭夏","cs-target-shang-tang":"商汤建商","cs-target-shang-pangeng":"盘庚迁殷得稳定","cs-target-shang-muye":"牧野武王伐纣商亡"};
const refs={"cs-target-xia-qi-hereditary":source,"cs-target-xia-erlitou":source,"cs-target-xia-mingtiao":source,"cs-target-shang-tang":shang,"cs-target-shang-pangeng":shang,"cs-target-shang-muye":shang};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"建立、转折与灭亡时间线",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文关键节点串联。"],excludes:["具体年代争议","人物逸事"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("xia-dynasty-memory","夏朝三节点",groupXia,targets.slice(0,3),"xia-dynasty-full"),memory("shang-dynasty-memory","商朝三节点",groupShang,targets.slice(3),"shang-dynasty-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupXia?"xia-dynasty-full":"shang-dynasty-full"]}));
const groups=[{id:groupXia,title:"启、二里头与鸣条",scope:"humanities-history",reason:"用三个关键节点串起夏朝。",questionIds:addedQuestions.slice(0,4).map(q=>q.id)},{id:groupShang,title:"商汤、迁殷与牧野",scope:"humanities-history",reason:"按建立、迁都和灭亡串起商朝。",questionIds:addedQuestions.slice(4).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-xia-shang-core",pointId:"legendary-xia-shang",tabIds:["dynasties"],status:"已建设",batch:"C5-26",scope:"夏与商的建立、转折、灭亡节点；西周另批"},{candidateId:"history-western-zhou-core",pointId:"legendary-xia-shang",tabIds:["dynasties"],status:"可建设",batch:"C5-26",scope:"西周建立、镐京、何尊与西周灭亡，排除故事化细节"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=32;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-26",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"4350bde",toPackVersion:"2026-10-21.30",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-26 新增夏、商两个朝代关键节点主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
