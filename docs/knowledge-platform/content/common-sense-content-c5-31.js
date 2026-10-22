// C5-31: Three Kingdoms and the Western/Eastern Jin backbone.
const {ref,question}=require("./learning-authoring");
const three=ref("three-kingdoms-sui-tang","three-kingdoms","cs-1-9-p5-p6-three-kingdoms-list");
const jin=ref("three-kingdoms-sui-tang","two-jin","cs-1-9-p6-two-jin-list");
const groupThree="three-kingdoms-backbone",groupJin="two-jin-backbone";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文战争作用、政权和时间线配对。"],excludes:["补充典故与故事化细节",...excludes],refs});
const targets=[
  t("cs-target-guandu-battle",groupThree,"能把官渡之战、曹操与统一北方基础对应。","200年官渡之战中曹操大败袁绍，为曹操统一北方奠定基础。",[three]),
  t("cs-target-red-cliffs-battle",groupThree,"能把赤壁之战、孙刘联军与三国鼎立基础对应。","208年孙权、刘备联军在赤壁击败曹军，为三国鼎立局面的形成奠定基础。",[three]),
  t("cs-target-yiling-battle",groupThree,"能把夷陵之战、刘备与陆逊对应。","221年刘备攻打东吴，东吴陆逊在夷陵之战中击败刘备。",[three],["不考火烧连营等叙事细节。"]),
  t("cs-target-three-kingdoms-regimes",groupThree,"能把魏蜀吴的建立者、都城和年份分别对应。","220年曹丕建曹魏都洛阳；221年刘备建蜀汉都成都；229年孙权建东吴都建业。",[three]),
  t("cs-target-western-jin-founding",groupJin,"能把司马炎、265年、洛阳与西晋建立对应。","265年司马炎夺取魏政权，建立西晋，定都洛阳。",[jin]),
  t("cs-target-western-jin-fall",groupJin,"能识别316年西晋灭亡。","316年匈奴兵攻占长安，西晋灭亡。",[jin],["不以统一年数作为检测口径。"]),
  t("cs-target-eastern-jin-founding",groupJin,"能把司马睿、317年、建康与东晋建立对应。","317年司马睿在建康重建晋室，史称东晋。",[jin]),
  t("cs-target-two-jin-sequence",groupJin,"能排列西晋建立、西晋灭亡和东晋建立。","两晋主线依次为265年西晋建立、316年西晋灭亡、317年东晋建立。",[jin]),
];
const addedQuestions=[
  question("guandu-battle","humanities-history",groupThree,"识别官渡之战","为曹操统一北方奠定基础的是哪场战役？",["官渡之战","赤壁之战","淝水之战"],0,"200年官渡之战中曹操击败袁绍，为统一北方奠定基础。","不借典故判断战役。",[three]),
  question("red-cliffs-battle","humanities-history",groupThree,"识别赤壁之战","为三国鼎立局面的形成奠定基础的是哪场战役？",["赤壁之战","官渡之战","巨鹿之战"],0,"208年孙刘联军在赤壁击败曹军，为三国鼎立局面的形成奠定基础。","不考草船借箭等故事。",[three]),
  question("yiling-battle","humanities-history",groupThree,"识别夷陵之战","221年刘备攻打东吴，最终由哪位东吴将领率军击败？",["陆逊","周亚夫","谢安"],0,"正文把刘备攻吴、陆逊取胜与夷陵之战对应。","不考火烧连营的叙事细节。",[three]),
  question("three-kingdoms-regimes","humanities-history",groupThree,"区分魏蜀吴政权","下列三国政权配对正确的是？",["曹丕—曹魏—洛阳；刘备—蜀汉—成都；孙权—东吴—建业","曹操—蜀汉—成都；刘备—东吴—建业；孙权—曹魏—洛阳","司马炎—曹魏；司马睿—蜀汉；陆逊—东吴"],0,"正文分别把曹丕、刘备、孙权与曹魏、蜀汉、东吴及其都城对应。","不把参与前期战争的人物直接当作建国者。",[three]),
  question("three-kingdoms-full","humanities-history",groupThree,"综合复辨三国主线","下列哪一项完整正确？",["官渡助曹操统一北方；赤壁奠定鼎立；夷陵中陆逊胜刘备；曹丕、刘备、孙权分别建立魏蜀吴","官渡奠定三国鼎立；赤壁帮助司马炎建西晋；刘备建立东吴","淝水帮助曹操统一北方；陆逊建立蜀汉"],0,"该项正确串起三场战役的定位及魏蜀吴政权。","不加入典故和夸张数字。",[three]),
  question("western-jin-founding","humanities-history",groupJin,"识别西晋建立","265年夺取魏政权、建立西晋并定都洛阳的是谁？",["司马炎","司马睿","曹丕"],0,"265年司马炎建立西晋，定都洛阳。","不考宫廷政变细节。",[jin]),
  question("western-jin-fall","humanities-history",groupJin,"识别西晋灭亡","正文中西晋灭亡的年份是哪一年？",["316年","317年","383年"],0,"316年匈奴兵攻占长安，西晋灭亡。","317年对应东晋建立。",[jin]),
  question("eastern-jin-founding","humanities-history",groupJin,"识别东晋建立","317年在建康重建晋室、建立东晋的是谁？",["司马睿","司马炎","刘裕"],0,"317年司马睿在建康重建晋室，史称东晋。","刘裕建立的是南朝宋。",[jin]),
  question("two-jin-sequence","humanities-history",groupJin,"排列两晋节点","下列两晋时间线正确的是？",["265年司马炎建西晋—316年西晋亡—317年司马睿建东晋","317年司马炎建西晋—316年司马睿建东晋—383年西晋亡","220年司马睿建西晋—265年曹丕建东晋"],0,"两晋主线依次为西晋建立、西晋灭亡、东晋建立。","不以西晋统一持续年数作判断。",[jin]),
  question("two-jin-full","humanities-history",groupJin,"综合复辨两晋骨架","下列哪一项完整正确？",["司马炎建西晋都洛阳；316年西晋亡；次年司马睿在建康建东晋","司马睿建西晋都建康；316年东晋亡；司马炎建东晋","曹丕建西晋；刘备在洛阳建东晋"],0,"该项正确串联两晋的建立者、都城与更替节点。","不加入八王之乱和典故。",[jin]),
];
const specs=[
  ["guandu-battle",["cs-target-guandu-battle"],"battle-role",{1:"赤壁奠定三国鼎立格局的基础。",2:"淝水发生在东晋时期。"}],
  ["red-cliffs-battle",["cs-target-red-cliffs-battle"],"battle-role",{1:"官渡为曹操统一北方奠定基础。",2:"巨鹿属于秦末战争。"}],
  ["yiling-battle",["cs-target-yiling-battle"],"battle-pair",{1:"周亚夫与西汉七国之乱相关。",2:"谢安与淝水之战相关。"}],
  ["three-kingdoms-regimes",["cs-target-three-kingdoms-regimes"],"regime-pair",{1:"人物、政权和都城均错配。",2:"人物不对应三个政权的建立。"}],
  ["three-kingdoms-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"战役作用、朝代和建立者错误。",2:"战役与政权建立者错误。"}],
  ["western-jin-founding",["cs-target-western-jin-founding"],"founding",{1:"司马睿建立东晋。",2:"曹丕建立曹魏。"}],
  ["western-jin-fall",["cs-target-western-jin-fall"],"fall",{1:"317年对应东晋建立。",2:"383年对应淝水之战。"}],
  ["eastern-jin-founding",["cs-target-eastern-jin-founding"],"founding",{1:"司马炎建立西晋。",2:"刘裕建立南朝宋。"}],
  ["two-jin-sequence",["cs-target-two-jin-sequence"],"sequence",{1:"人物与年份顺序错误。",2:"人物、政权和年份均错误。"}],
  ["two-jin-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"建立者、都城和更替顺序错误。",2:"人物与政权错配。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-guandu-battle":"guandu-battle","cs-target-red-cliffs-battle":"red-cliffs-battle","cs-target-yiling-battle":"yiling-battle","cs-target-three-kingdoms-regimes":"three-kingdoms-regimes","cs-target-western-jin-founding":"western-jin-founding","cs-target-western-jin-fall":"western-jin-fall","cs-target-eastern-jin-founding":"eastern-jin-founding","cs-target-two-jin-sequence":"two-jin-sequence"};
const phrase={"cs-target-guandu-battle":"官渡曹操北方基","cs-target-red-cliffs-battle":"赤壁孙刘鼎立基","cs-target-yiling-battle":"夷陵陆逊胜刘备","cs-target-three-kingdoms-regimes":"丕魏洛、备蜀成、权吴建","cs-target-western-jin-founding":"二六五炎洛阳晋","cs-target-western-jin-fall":"三一六西晋亡","cs-target-eastern-jin-founding":"三一七睿建康东","cs-target-two-jin-sequence":"西建西亡东再建"};
const refs={"cs-target-guandu-battle":three,"cs-target-red-cliffs-battle":three,"cs-target-yiling-battle":three,"cs-target-three-kingdoms-regimes":three,"cs-target-western-jin-founding":jin,"cs-target-western-jin-fall":jin,"cs-target-eastern-jin-founding":jin,"cs-target-two-jin-sequence":jin};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"战役作用与政权时间线串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["补充典故与故事化细节","未纳入本组的南北朝内容"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("three-kingdoms-memory","三国战役与政权",groupThree,targets.slice(0,4),"three-kingdoms-full"),memory("two-jin-memory","两晋更替主线",groupJin,targets.slice(4),"two-jin-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupThree?"three-kingdoms-full":"two-jin-full"]}));
const groups=[{id:groupThree,title:"三国战役与鼎立政权",scope:"humanities-history",reason:"用三场战役和魏蜀吴政权建立三国骨架。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupJin,title:"西晋东晋更替",scope:"humanities-history",reason:"按西晋建立、灭亡与东晋建立串联两晋。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-three-kingdoms-two-jin",pointId:"three-kingdoms-sui-tang",tabIds:["three-kingdoms","two-jin"],status:"已建设",batch:"C5-31",scope:"三国战役政权与两晋更替；排除补充典故和争议性年数口径"},{candidateId:"history-northern-southern-economy",pointId:"three-kingdoms-sui-tang",tabIds:["northern-southern","three-kingdoms-economy"],status:"可建设",batch:"C5-31",scope:"南北朝关键节点与魏晋南北朝社会经济，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=37;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-31",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"259d91fb",toPackVersion:"2026-10-21.35",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-31 新增三国与两晋两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
