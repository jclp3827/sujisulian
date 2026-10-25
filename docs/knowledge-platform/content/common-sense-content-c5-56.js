// C5-56: Grand/lesser sacrifice and funeral rank terms.
const {ref,question}=require("./learning-authoring");
const sacrifice=ref("ritual-system","grand-lesser-sacrifice","cs-10-15-p13-grand-lesser-sacrifice-list"),funeral=ref("ritual-system","funeral-rite","cs-10-15-p13-funeral-rite-list");
const gSacrifice="ritual-grand-lesser-sacrifice",gFuneral="ritual-funeral-rank-terms";
const T=(id,g,statement,conclusion,refs)=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文祭祀主体、牲畜组合和身份称谓对应。"],excludes:["礼仪历史演变、祭祀程序和正文未列的身份称谓"],refs});
const targets=[
 T("cs-target-grand-sacrifice-animals",gSacrifice,"能识别太牢的牲畜组合。","牛、羊、豕三牲全备称太牢。",[sacrifice]),
 T("cs-target-grand-sacrifice-context",gSacrifice,"能识别太牢的正文使用情境。","正文以古代帝王祭祀社稷说明太牢。",[sacrifice]),
 T("cs-target-lesser-sacrifice-animals",gSacrifice,"能识别少牢的牲畜组合。","少牢用羊、豕，不含牛。",[sacrifice]),
 T("cs-target-lesser-sacrifice-context",gSacrifice,"能识别少牢的正文使用情境。","正文以古代诸侯、卿大夫祭祀宗庙说明少牢。",[sacrifice]),
 T("cs-target-funeral-emperor-lord",gFuneral,"能区分天子与诸侯死亡称谓。","天子死曰崩，诸侯曰薨。",[funeral]),
 T("cs-target-funeral-official-scholar",gFuneral,"能区分大夫与士死亡称谓。","大夫曰卒，士曰不禄。",[funeral]),
 T("cs-target-funeral-commoner",gFuneral,"能识别庶人死亡称谓。","庶人曰死。",[funeral]),
 T("cs-target-funeral-rank-order",gFuneral,"能按身份完整对应丧礼称谓。","天子崩、诸侯薨、大夫卒、士不禄、庶人死。",[funeral]),
];
const addedQuestions=[
 question("grand-sacrifice-animals-core","humanities-history",gSacrifice,"识别太牢组合","太牢三牲全备指？",["牛、羊、豕","羊、豕","牛、马、羊"],0,"太牢为牛羊豕三牲全备。","正文中的豕即猪。",[sacrifice]),
 question("grand-sacrifice-context-core","humanities-history",gSacrifice,"识别太牢情境","正文用哪种情境说明太牢？",["古代帝王祭祀社稷","士人举行冠礼","庶人办理丧礼"],0,"正文以帝王祭祀社稷、三牲全备说明太牢。","本题不扩展祭祀程序。",[sacrifice]),
 question("lesser-sacrifice-animals-core","humanities-history",gSacrifice,"识别少牢组合","少牢使用的牲畜组合是？",["羊、豕","牛、羊、豕","牛、豕"],0,"少牢用羊和豕，不含牛。","太牢才是三牲全备。",[sacrifice]),
 question("lesser-sacrifice-context-core","humanities-history",gSacrifice,"识别少牢情境","正文用哪种情境说明少牢？",["诸侯、卿大夫祭祀宗庙","帝王祭祀社稷且三牲全备","婚礼亲迎"],0,"正文以诸侯、卿大夫祭祀宗庙说明少牢。","不要只凭牲畜数量判断全部历史情境。",[sacrifice]),
 question("grand-lesser-sacrifice-full","humanities-history",gSacrifice,"综合复辨太牢少牢","下列哪一项完整正确？",["帝王祭社稷，牛羊豕全备为太牢；诸侯卿大夫祭宗庙，羊豕为少牢","帝王用羊豕称少牢；诸侯三牲全备称太牢","太牢少牢都是婚礼六礼中的步骤"],0,"该项正确对应主体、场景和牲畜组合。","祭祀程序和历史变迁不在本组。",[sacrifice]),
 question("funeral-emperor-lord-core","humanities-history",gFuneral,"区分天子诸侯称谓","天子、诸侯死亡称谓分别是？",["崩、薨","薨、卒","卒、不禄"],0,"天子死曰崩，诸侯曰薨。","按身份层级成对记忆。",[funeral]),
 question("funeral-official-scholar-core","humanities-history",gFuneral,"区分大夫士称谓","大夫、士死亡称谓分别是？",["卒、不禄","薨、卒","崩、死"],0,"大夫曰卒，士曰不禄。","不要与天子、诸侯称谓混淆。",[funeral]),
 question("funeral-commoner-core","humanities-history",gFuneral,"识别庶人称谓","庶人死亡在正文中称？",["死","崩","薨"],0,"庶人曰死。","本题只按正文等级称谓。",[funeral]),
 question("funeral-rank-order-core","humanities-history",gFuneral,"识别完整身份次序","从天子到庶人的称谓顺序正确的是？",["崩、薨、卒、不禄、死","薨、崩、不禄、卒、死","崩、卒、薨、死、不禄"],0,"完整顺序为崩、薨、卒、不禄、死。","顺序与身份必须同时匹配。",[funeral]),
 question("funeral-rank-full","humanities-history",gFuneral,"综合复辨丧礼称谓","下列哪一项完整正确？",["天子崩、诸侯薨、大夫卒、士不禄、庶人死","天子薨、诸侯崩、大夫不禄、士卒","天子卒、诸侯死、大夫崩、庶人薨"],0,"该项正确对应五个身份等级。","正文未列称谓不在本组。",[funeral]),
];
const specs=[
 ["grand-sacrifice-animals-core",["cs-target-grand-sacrifice-animals"],"grand-animals",{1:"羊豕为少牢。",2:"正文不是牛马羊。"}],
 ["grand-sacrifice-context-core",["cs-target-grand-sacrifice-context"],"grand-context",{1:"冠礼属于嘉礼。",2:"丧礼不对应太牢。"}],
 ["lesser-sacrifice-animals-core",["cs-target-lesser-sacrifice-animals"],"lesser-animals",{1:"三牲全备为太牢。",2:"正文少牢组合不是牛豕。"}],
 ["lesser-sacrifice-context-core",["cs-target-lesser-sacrifice-context"],"lesser-context",{1:"该项对应太牢。",2:"亲迎属于婚礼六礼。"}],
 ["grand-lesser-sacrifice-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"主体、组合和名称均错配。",2:"两者不是婚礼步骤。"}],
 ["funeral-emperor-lord-core",["cs-target-funeral-emperor-lord"],"emperor-lord",{1:"两项均下移错配。",2:"对应大夫与士。"}],
 ["funeral-official-scholar-core",["cs-target-funeral-official-scholar"],"official-scholar",{1:"对应诸侯与大夫。",2:"对应天子与庶人。"}],
 ["funeral-commoner-core",["cs-target-funeral-commoner"],"commoner",{1:"崩对应天子。",2:"薨对应诸侯。"}],
 ["funeral-rank-order-core",["cs-target-funeral-rank-order"],"rank-order",{1:"前四项顺序错配。",2:"多项身份错配。"}],
 ["funeral-rank-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"四个身份称谓错配。",2:"全部称谓错配。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-grand-sacrifice-animals":"grand-sacrifice-animals-core","cs-target-grand-sacrifice-context":"grand-sacrifice-context-core","cs-target-lesser-sacrifice-animals":"lesser-sacrifice-animals-core","cs-target-lesser-sacrifice-context":"lesser-sacrifice-context-core","cs-target-funeral-emperor-lord":"funeral-emperor-lord-core","cs-target-funeral-official-scholar":"funeral-official-scholar-core","cs-target-funeral-commoner":"funeral-commoner-core","cs-target-funeral-rank-order":"funeral-rank-order-core"};
const phrase={"cs-target-grand-sacrifice-animals":"太牢牛羊豕全备","cs-target-grand-sacrifice-context":"帝王社稷用太牢","cs-target-lesser-sacrifice-animals":"少牢羊豕不含牛","cs-target-lesser-sacrifice-context":"诸侯卿大夫宗庙少牢","cs-target-funeral-emperor-lord":"天子崩、诸侯薨","cs-target-funeral-official-scholar":"大夫卒、士不禄","cs-target-funeral-commoner":"庶人死","cs-target-funeral-rank-order":"崩薨卒不禄死"};
const refFor=id=>id.startsWith("cs-target-funeral")?funeral:sacrifice;
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"按主体、组合与身份层级成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文场景与称谓记忆，口诀只作检索线索。"],excludes:["礼仪演变、祭祀程序和未列称谓"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refFor(x.id)],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("grand-lesser-sacrifice-memory","太牢与少牢",gSacrifice,targets.slice(0,4),"grand-lesser-sacrifice-full"),memory("funeral-rank-memory","丧礼等级称谓",gFuneral,targets.slice(4),"funeral-rank-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gSacrifice?"grand-lesser-sacrifice-full":"funeral-rank-full"]}));
const groups=[{id:gSacrifice,title:"太牢与少牢",scope:"humanities-history",reason:"按祭祀主体、场景和牲畜组合区分。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gFuneral,title:"丧礼等级称谓",scope:"humanities-history",reason:"按天子至庶人身份层级完整对应称谓。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"humanities-ritual-sacrifice-funeral",pointId:"ritual-system",tabIds:["grand-lesser-sacrifice","funeral-rite"],status:"已建设",batch:"C5-56",scope:"太牢少牢的主体与牲畜组合、天子至庶人的丧礼称谓；排除仪程与演变"},{candidateId:"science-optics",pointId:"optics",status:"可建设",batch:"C5-56",scope:"光的本质、传播与生活光学，下一批按来源页签拆分最多两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=62;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-56",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"bc6ef2cf",toPackVersion:"2026-10-21.60",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-56 新增太牢少牢与丧礼等级称谓两个礼仪主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
