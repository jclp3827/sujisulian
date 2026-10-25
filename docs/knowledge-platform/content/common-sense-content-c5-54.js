// C5-54: Chinese book records.
const {ref,question}=require("./learning-authoring");
const books=ref("book-records","book-records-table","cs-10-15-p9-p10-book-records-table");
const gLexicon="book-records-lexicon-theory",gCollections="book-records-collections";
const T=(id,g,statement,conclusion,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId:g,statement,conclusion,conditions:["按正文书名、时代作者与地位成组对应。"],excludes:["作品全文、编纂过程和正文未列的版本学争议",...excludes],refs:[books]});
const targets=[
 T("cs-target-shuowen-author",gLexicon,"能识别《说文解字》的作者时代。","《说文解字》由东汉许慎撰写。"),
 T("cs-target-shuowen-status",gLexicon,"能识别《说文解字》的教材地位。","《说文解字》是我国第一部系统分析汉字字形、考究字源的字书，也是第一部按部首编排的汉语字典。"),
 T("cs-target-wenxin-author",gLexicon,"能识别《文心雕龙》的作者时代。","《文心雕龙》由南朝刘勰创作。"),
 T("cs-target-wenxin-status",gLexicon,"能识别《文心雕龙》的教材地位。","《文心雕龙》是中国文学理论批评史上第一部有严密体系的文学理论专著。"),
 T("cs-target-yongle-author",gCollections,"能识别《永乐大典》的总纂修与时代。","《永乐大典》由明代解缙总纂修。"),
 T("cs-target-yongle-status",gCollections,"能识别《永乐大典》的教材地位。","《永乐大典》是我国最大的一部类书。"),
 T("cs-target-siku-author-status",gCollections,"能识别《四库全书》的主编与教材地位。","《四库全书》由清代纪昀等主编，是我国最大的一部丛书。"),
 T("cs-target-siku-four-parts",gCollections,"能识别《四库全书》的四部分法。","《四库全书》分经、史、子、集四部。",["四部具体收录范围留在正文。"]),
];
const addedQuestions=[
 question("shuowen-author-core","humanities-history",gLexicon,"识别说文作者","《说文解字》的作者是？",["东汉许慎","南朝刘勰","明代解缙"],0,"《说文解字》由东汉许慎撰写。","不要把作者与另外两部书错配。",[books]),
 question("shuowen-status-core","humanities-history",gLexicon,"识别说文地位","哪部书是我国第一部系统分析汉字字形、考究字源的字书，并按部首编排？",["《说文解字》","《文心雕龙》","《永乐大典》"],0,"该地位对应《说文解字》。","正文另补《尔雅》为第一部词典，不能混同。",[books]),
 question("wenxin-author-core","humanities-history",gLexicon,"识别文心作者","《文心雕龙》的作者是？",["南朝刘勰","东汉许慎","清代纪昀"],0,"《文心雕龙》由南朝刘勰创作。","作者与时代成对记忆。",[books]),
 question("wenxin-status-core","humanities-history",gLexicon,"识别文心地位","中国文学理论批评史上第一部有严密体系的文学理论专著是？",["《文心雕龙》","《说文解字》","《四库全书》"],0,"该地位对应《文心雕龙》。","字书和丛书的地位不同。",[books]),
 question("book-lexicon-theory-full","humanities-history",gLexicon,"综合复辨字书与理论著作","下列哪一项完整正确？",["东汉许慎《说文解字》系统析字并按部首编排；南朝刘勰《文心雕龙》是严密体系文学理论专著","刘勰写《说文解字》；许慎总纂《永乐大典》","纪昀写《文心雕龙》；解缙主编《四库全书》"],0,"该项正确对应两部书的作者与地位。","作品内容和版本史不在本组。",[books]),
 question("yongle-author-core","humanities-history",gCollections,"识别永乐大典编者","《永乐大典》的总纂修是？",["明代解缙","清代纪昀","东汉许慎"],0,"《永乐大典》由明代解缙总纂修。","纪昀对应《四库全书》。",[books]),
 question("yongle-status-core","humanities-history",gCollections,"识别永乐大典地位","我国最大的一部类书是？",["《永乐大典》","《四库全书》","《文心雕龙》"],0,"《永乐大典》是我国最大的一部类书。","类书与丛书需区分。",[books]),
 question("siku-author-status-core","humanities-history",gCollections,"识别四库主编与地位","《四库全书》的主编和地位对应正确的是？",["清代纪昀等；我国最大的一部丛书","明代解缙；我国最大的一部类书","南朝刘勰；第一部文学理论专著"],0,"《四库全书》由清代纪昀等主编，是我国最大的一部丛书。","另两项对应其他书。",[books]),
 question("siku-four-parts-core","humanities-history",gCollections,"识别四库四部","《四库全书》分为哪四部？",["经、史、子、集","诗、书、礼、乐","礼、乐、射、御"],0,"《四库全书》分经史子集四部。","本题只辨分部名称。",[books]),
 question("book-collections-full","humanities-history",gCollections,"综合复辨类书与丛书","下列哪一项完整正确？",["明代解缙总纂《永乐大典》，为最大类书；清代纪昀等主编《四库全书》，为最大丛书并分经史子集","纪昀总纂《永乐大典》，两书均为字典","许慎主编《四库全书》，分礼乐射御四部"],0,"该项正确区分两部大型书籍的编者、类型和分部。","编纂过程和具体收录范围留在正文。",[books]),
];
const specs=[
 ["shuowen-author-core",["cs-target-shuowen-author"],"shuowen-author",{1:"刘勰对应《文心雕龙》。",2:"解缙对应《永乐大典》。"}],
 ["shuowen-status-core",["cs-target-shuowen-status"],"shuowen-status",{1:"该书为文学理论专著。",2:"该书为类书。"}],
 ["wenxin-author-core",["cs-target-wenxin-author"],"wenxin-author",{1:"许慎对应《说文解字》。",2:"纪昀对应《四库全书》。"}],
 ["wenxin-status-core",["cs-target-wenxin-status"],"wenxin-status",{1:"该书为字书。",2:"该书为丛书。"}],
 ["book-lexicon-theory-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"作者与书名错配。",2:"作者与书名均错配。"}],
 ["yongle-author-core",["cs-target-yongle-author"],"yongle-author",{1:"纪昀对应《四库全书》。",2:"许慎对应《说文解字》。"}],
 ["yongle-status-core",["cs-target-yongle-status"],"yongle-status",{1:"《四库全书》是丛书。",2:"《文心雕龙》是理论专著。"}],
 ["siku-author-status-core",["cs-target-siku-author-status"],"siku-status",{1:"该项对应《永乐大典》。",2:"该项对应《文心雕龙》。"}],
 ["siku-four-parts-core",["cs-target-siku-four-parts"],"siku-parts",{1:"该项不是四库分部。",2:"该项属于六艺线索。"}],
 ["book-collections-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"编者与书籍类型均错。",2:"作者和分部均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-shuowen-author":"shuowen-author-core","cs-target-shuowen-status":"shuowen-status-core","cs-target-wenxin-author":"wenxin-author-core","cs-target-wenxin-status":"wenxin-status-core","cs-target-yongle-author":"yongle-author-core","cs-target-yongle-status":"yongle-status-core","cs-target-siku-author-status":"siku-author-status-core","cs-target-siku-four-parts":"siku-four-parts-core"};
const phrase={"cs-target-shuowen-author":"东汉许慎说文","cs-target-shuowen-status":"析字源、按部首","cs-target-wenxin-author":"南朝刘勰文心","cs-target-wenxin-status":"文学理论严体系","cs-target-yongle-author":"明代解缙永乐典","cs-target-yongle-status":"最大类书","cs-target-siku-author-status":"清代纪昀四库，最大丛书","cs-target-siku-four-parts":"经史子集四部分"};
function memory(id,title,g,list,full){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"把书名、作者时代与教材地位成组记忆",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文表格记忆，口诀只作检索线索。"],excludes:["作品全文、编纂过程和版本学争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[books],questionIds:[direct[x.id],full],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:full,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}]})),questionIds:addedQuestions.filter(q=>q.group===g).map(q=>q.id)}};
const mnemonics=[memory("book-lexicon-theory-memory","字书与文学理论",gLexicon,targets.slice(0,4),"book-lexicon-theory-full"),memory("book-collections-memory","类书与丛书",gCollections,targets.slice(4),"book-collections-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===gLexicon?"book-lexicon-theory-full":"book-collections-full"]}));
const groups=[{id:gLexicon,title:"字书与文学理论之最",scope:"humanities-history",reason:"按书名、作者和教材地位区分《说文解字》《文心雕龙》。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:gCollections,title:"类书与丛书之最",scope:"humanities-history",reason:"区分《永乐大典》和《四库全书》的编者、类型与分部。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"humanities-book-records",pointId:"book-records",tabIds:["book-records-table"],status:"已建设",batch:"C5-54",scope:"《说文解字》《文心雕龙》《永乐大典》《四库全书》的作者、地位与分部；排除编纂和版本细节"},{candidateId:"humanities-ritual-system",pointId:"ritual-system",status:"可建设",batch:"C5-54",scope:"五礼、六礼与祭祀礼仪，下一批按来源页签拆分最多两个小主题"}];
function applyQuestions(x){return x.concat(addedQuestions)} function applyGroups(x){return x.concat(groups)} function applyMnemonics(x){return x.concat(mnemonics)}
function applyEntryPlans(x){const p=JSON.parse(JSON.stringify(x)),ids=addedQuestions.map(q=>q.id);p.revision=60;p.modes.qa.groupIds.push(...groups.map(g=>g.id));p.modes.qa.questionIds.push(...ids);p.modes.mnemonic.questionIds.push(...ids);p.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return p}
module.exports={schemaVersion:1,revision:1,batch:"C5-54",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"408e0e4a",toPackVersion:"2026-10-21.58",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-54 新增书籍之最的字书理论与类书丛书两个主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
