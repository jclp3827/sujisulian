// C5-32: Northern/Southern Dynasties and period economy.
const {ref,question}=require("./learning-authoring");
const political=ref("three-kingdoms-sui-tang","northern-southern","cs-1-9-p6-five-hu-northern-southern-list");
const economy=ref("three-kingdoms-sui-tang","three-kingdoms-economy","cs-1-9-p6-three-kingdoms-northern-southern-economy-list");
const groupPolitical="northern-southern-backbone",groupEconomy="three-kingdoms-economy-core";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文政权演变、改革措施和产业配对。"],excludes:["补充典故与超出正文的评价",...excludes],refs});
const targets=[
  t("cs-target-feishui-battle",groupPolitical,"能把383年淝水之战的双方、人物和结果对应。","383年前秦苻坚讨伐东晋，东晋在谢安等领导下击败前秦，此役确立南北长期对峙局面。",[political],["不考风声鹤唳等典故。"]),
  t("cs-target-southern-dynasties",groupPolitical,"能识别南朝起点、四朝顺序和共同都城。","420年刘裕建立宋；南朝依次为宋、齐、梁、陈，均定都建康。",[political]),
  t("cs-target-northern-dynasties",groupPolitical,"能识别北魏及北朝政权演变。","386年拓跋珪建立北魏；北魏分为东魏和西魏，后分别被北齐和北周取代。",[political]),
  t("cs-target-xiaowen-reform",groupPolitical,"能识别北魏孝文帝改革的核心措施。","孝文帝改革包括均田令、494年迁都洛阳及改汉服、说汉话、采汉姓、通婚等。",[political]),
  t("cs-target-jiangnan-development",groupEconomy,"能概括江南农业开发范围和正文影响。","江南农业开发由江东扩至长江流域并波及岭南、闽江流域，推动南北经济趋向平衡，为经济重心南移奠基。",[economy]),
  t("cs-target-period-ceramics",groupEconomy,"能区分魏晋南北朝青瓷与北朝白瓷。","南北所烧青瓷各具特色，北朝可以烧出成熟白瓷。",[economy]),
  t("cs-target-caowei-textile",groupEconomy,"能把曹魏纺织机构与襄邑、洛阳对应。","曹魏在纺织业中心襄邑、洛阳等地设置专门制造机构。",[economy]),
  t("cs-target-wu-shu-textile",groupEconomy,"能把吴国八辈之蚕、蜀锦及其特点对应。","吴国八辈之蚕的缫丝质量很高，蜀锦行销吴、魏。",[economy]),
];
const addedQuestions=[
  question("feishui-battle","humanities-history",groupPolitical,"识别淝水之战","下列关于淝水之战的表述正确的是？",["383年前秦苻坚伐东晋，东晋在谢安等领导下获胜","曹操在官渡击败前秦，建立东晋","刘裕率北魏击败东吴"],0,"383年前秦苻坚讨伐东晋，东晋在谢安等领导下击败前秦。","不借相关典故判断。",[political]),
  question("southern-dynasties","humanities-history",groupPolitical,"识别南朝政权","下列哪项正确描述南朝？",["刘裕建立宋；此后为齐、梁、陈，均定都建康","拓跋珪建立宋；此后为东魏、西魏，均定都洛阳","司马炎建立齐；此后为梁、陈、北周"],0,"420年刘裕建立宋，南朝为宋齐梁陈，均定都建康。","不把北朝政权混入。",[political]),
  question("northern-dynasties","humanities-history",groupPolitical,"识别北朝演变","正文中的北朝政权演变是哪一项？",["北魏分为东魏、西魏，后分别被北齐、北周取代","北魏分为宋、齐，后分别被梁、陈取代","东晋分为曹魏、蜀汉，后被东吴取代"],0,"北魏分为东魏和西魏，后来分别被北齐和北周取代。","南朝和三国政权不混入。",[political]),
  question("xiaowen-reform","humanities-history",groupPolitical,"识别孝文帝改革","下列哪组属于北魏孝文帝改革措施？",["均田令、494年迁都洛阳、改汉服说汉话采汉姓并提倡通婚","推恩令、罢黜百家、设西域都护","三公九卿、郡县制、统一小篆"],0,"正文列出均田、迁都和一系列接受汉族文化的措施。","不把其他朝代制度混入。",[political]),
  question("northern-southern-full","humanities-history",groupPolitical,"综合复辨南北朝骨架","下列哪一项完整正确？",["淝水后南北长期对峙；南朝宋齐梁陈都建康；北魏后分东西魏并转为北齐北周；孝文帝迁洛阳并改汉俗","淝水由曹操对刘备；南朝由北魏、北齐构成；孝文帝颁推恩令","刘裕建立北魏；拓跋珪建立南朝宋；北魏迁都长安"],0,"该项正确串联战役、南北政权和孝文帝改革。","不加入战役典故。",[political]),
  question("jiangnan-development","humanities-history",groupEconomy,"识别江南开发","正文怎样概括魏晋南北朝江南农业开发的影响？",["推动南北经济趋向平衡，为以后经济重心南移奠定基础","当时已经完成全国经济重心南移","只影响江东，没有扩展到其他地区"],0,"正文表述为南北经济趋向平衡，并为以后经济重心南移奠定基础。","不能把“奠定基础”改成“已经完成”。",[economy]),
  question("period-ceramics","humanities-history",groupEconomy,"识别瓷器发展","下列关于魏晋南北朝瓷器的表述正确的是？",["南北青瓷各具特色，北朝可以烧出成熟白瓷","只有南方能烧青瓷，北方没有瓷器","成熟白瓷只在曹魏出现，北朝没有"],0,"正文指出南北青瓷各具特色，北朝可以烧出成熟白瓷。","不延伸工艺年代排名。",[economy]),
  question("caowei-textile","humanities-history",groupEconomy,"识别曹魏纺织","曹魏在哪些纺织业中心设置专门制造机构？",["襄邑、洛阳等地","成都、建业等地","咸阳、长安等地"],0,"正文把曹魏专门制造机构与襄邑、洛阳等纺织业中心对应。","不据此推断其他地区没有纺织业。",[economy]),
  question("wu-shu-textile","humanities-history",groupEconomy,"区分吴蜀纺织","下列配对正确的是？",["吴国八辈之蚕缫丝质量高；蜀锦行销吴、魏","蜀国八辈之蚕；吴锦只在蜀地流通","曹魏八辈之蚕；蜀锦只行销洛阳"],0,"正文分别记录吴国八辈之蚕和行销吴、魏的蜀锦。","不扩展未列出的产地与流通范围。",[economy]),
  question("three-kingdoms-economy-full","humanities-history",groupEconomy,"综合复辨时期经济","下列哪一项完整正确？",["江南开发为重心南移奠基；南北青瓷各具特色且北朝有成熟白瓷；曹魏设纺织机构；吴蚕与蜀锦各有特点","江南当时已完成重心南移；北朝没有白瓷；曹魏没有纺织机构","蜀锦只销蜀地；青瓷只产北方；江南开发只到江东"],0,"该项正确概括正文中的农业、瓷器和纺织业信息。","不把趋势表述成已经完成。",[economy]),
];
const specs=[
  ["feishui-battle",["cs-target-feishui-battle"],"battle",{1:"人物和战役错配。",2:"人物、政权和战役均错配。"}],
  ["southern-dynasties",["cs-target-southern-dynasties"],"southern",{1:"人物及政权体系错误。",2:"人物和政权顺序错误。"}],
  ["northern-dynasties",["cs-target-northern-dynasties"],"northern",{1:"把南朝政权混入北朝。",2:"把三国与东晋混为一体。"}],
  ["xiaowen-reform",["cs-target-xiaowen-reform"],"reform",{1:"属于西汉措施。",2:"属于秦朝制度与统一措施。"}],
  ["northern-southern-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"战役、政权和改革均错配。",2:"南北政权建立者和都城错配。"}],
  ["jiangnan-development",["cs-target-jiangnan-development"],"development",{1:"正文只说奠定基础，未说已经完成。",2:"正文还包括长江、岭南和闽江流域。"}],
  ["period-ceramics",["cs-target-period-ceramics"],"ceramics",{1:"正文明确南北均有青瓷。",2:"正文明确北朝可烧成熟白瓷。"}],
  ["caowei-textile",["cs-target-caowei-textile"],"textile",{1:"正文对应的是襄邑、洛阳等地。",2:"正文对应的是襄邑、洛阳等地。"}],
  ["wu-shu-textile",["cs-target-wu-shu-textile"],"textile",{1:"主体和流通范围错误。",2:"主体与流通范围错误。"}],
  ["three-kingdoms-economy-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"江南开发、白瓷和纺织机构表述错误。",2:"流通、瓷器和开发范围均错误。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-feishui-battle":"feishui-battle","cs-target-southern-dynasties":"southern-dynasties","cs-target-northern-dynasties":"northern-dynasties","cs-target-xiaowen-reform":"xiaowen-reform","cs-target-jiangnan-development":"jiangnan-development","cs-target-period-ceramics":"period-ceramics","cs-target-caowei-textile":"caowei-textile","cs-target-wu-shu-textile":"wu-shu-textile"};
const phrase={"cs-target-feishui-battle":"苻坚南下谢安胜","cs-target-southern-dynasties":"宋齐梁陈都建康","cs-target-northern-dynasties":"北魏分东西，齐周后来替","cs-target-xiaowen-reform":"均田迁洛改汉俗","cs-target-jiangnan-development":"江南扩展趋平衡","cs-target-period-ceramics":"南北青瓷北白瓷","cs-target-caowei-textile":"曹魏襄邑洛阳织","cs-target-wu-shu-textile":"吴蚕丝好蜀锦销"};
const refs={"cs-target-feishui-battle":political,"cs-target-southern-dynasties":political,"cs-target-northern-dynasties":political,"cs-target-xiaowen-reform":political,"cs-target-jiangnan-development":economy,"cs-target-period-ceramics":economy,"cs-target-caowei-textile":economy,"cs-target-wu-shu-textile":economy};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"政权演变与产业配对串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["补充典故与超出正文的评价","未纳入本组的三国两晋节点"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("northern-southern-memory","南北朝政权改革主线",groupPolitical,targets.slice(0,4),"northern-southern-full"),memory("three-kingdoms-economy-memory","魏晋南北朝经济线索",groupEconomy,targets.slice(4),"three-kingdoms-economy-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupPolitical?"northern-southern-full":"three-kingdoms-economy-full"]}));
const groups=[{id:groupPolitical,title:"南北朝政权与孝文改革",scope:"humanities-history",reason:"按淝水、南朝、北朝和孝文帝改革形成政治骨架。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupEconomy,title:"魏晋南北朝经济线索",scope:"humanities-history",reason:"按江南开发、瓷器与纺织建立经济线索。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-northern-southern-economy",pointId:"three-kingdoms-sui-tang",tabIds:["northern-southern","three-kingdoms-economy"],status:"已建设",batch:"C5-32",scope:"南北朝政权改革与时期经济；排除典故及超出正文的评价"},{candidateId:"history-five-dynasties-liao",pointId:"five-dynasties-yuan",tabIds:["five-dynasties","liao"],status:"可建设",batch:"C5-32",scope:"五代十国与辽关键节点，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=38;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-32",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"925ac417",toPackVersion:"2026-10-21.36",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-32 新增南北朝与时期社会经济两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
