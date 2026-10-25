// C5-41: Hundred Days' Reform and Boxer Rebellion / Eight-Nation Alliance.
const {ref,question}=require("./learning-authoring");
const gongche=ref("hundred-days-reform","gongche-memorial","cs-1-9-p15-p16-gongche-memorial-list");
const reform=ref("hundred-days-reform","hundred-days-reform","cs-1-9-p16-hundred-days-reform-list");
const university=ref("hundred-days-reform","imperial-university","cs-1-9-p16-imperial-university-list");
const martyrs=ref("hundred-days-reform","six-martyrs","cs-1-9-p16-six-martyrs-list");
const boxer=ref("boxer-rebellion-eight-nation-alliance","boxer-rebellion","cs-1-9-p16-boxer-rebellion-list");
const alliance=ref("boxer-rebellion-eight-nation-alliance","eight-nation-alliance","cs-1-9-p16-eight-nation-alliance-list");
const protocol=ref("boxer-rebellion-eight-nation-alliance","boxer-protocol","cs-1-9-p16-boxer-protocol-list");
const groupReform="hundred-days-reform-flow",groupBoxer="boxer-alliance";
const t=(id,groupId,statement,conclusion,refs,excludes=[])=>({id,revision:1,status:"review",scope:"humanities-history",groupId,statement,conclusion,conditions:["按正文年份、人物、事件与条约对应。"],excludes:["正文未展开的政治争议、完整人物名单和过密数字",...excludes],refs});
const targets=[
  t("cs-target-gongche-memorial",groupReform,"能把1895年康有为、梁启超公车上书与戊戌变法序幕对应。","1895年康有为、梁启超等组织公车上书，揭开戊戌变法序幕。",[gongche],["公车词源只作正文补充。"]),
  t("cs-target-hundred-days-reform",groupReform,"能把1898年光绪帝、《定国是诏》和103天新政对应。","1898年光绪帝颁布《定国是诏》开始变法，新政持续103天，故称百日维新。",[reform]),
  t("cs-target-imperial-university",groupReform,"能识别京师大学堂的近代教育地位。","京师大学堂是中国近代第一所国立大学，也是近代国立高等教育的开端。",[university]),
  t("cs-target-six-martyrs",groupReform,"能识别戊戌六君子及谭嗣同《狱中题壁》。","戊戌六君子包括谭嗣同等六人；我自横刀向天笑等句出自谭嗣同《狱中题壁》。",[martyrs],["口诀不要求一次背全六人。"]),
  t("cs-target-boxer-rebellion",groupBoxer,"能识别义和团的时间、性质、口号和发动者。","义和团是19世纪末以扶清灭洋为口号的农民运动，正文把发动者与赵三多对应。",[boxer],["具体村址不进入口诀。"]),
  t("cs-target-eight-nation-alliance",groupBoxer,"能识别1900年八国联军侵华的国家组合和名义。","1900年英、法、德、奥、意、日、俄、美八国以保护使馆为名联合出兵镇压义和团。",[alliance]),
  t("cs-target-boxer-protocol-terms",groupBoxer,"能识别1901年《辛丑条约》的主要内容。","1901年清政府与11国签订《辛丑条约》，涉及巨额赔款、东交民巷使馆界及允许列强驻兵。",[protocol],["分期利息等数字留在正文。"]),
  t("cs-target-boxer-protocol-impact",groupBoxer,"能把《辛丑条约》与中国完全陷入半殖民地半封建社会对应。","《辛丑条约》使中国完全陷入半殖民地半封建社会的深渊。",[protocol]),
];
const addedQuestions=[
  question("gongche-memorial","humanities-history",groupReform,"识别公车上书","揭开戊戌变法序幕的事件是？",["1895年康有为、梁启超等组织公车上书","1898年八国联军入北京","1901年签订《辛丑条约》"],0,"1895年公车上书揭开戊戌变法序幕。","公车词源不影响本题事件判断。",[gongche]),
  question("hundred-days-reform","humanities-history",groupReform,"识别百日维新","百日维新信息对应正确的是？",["1898年光绪帝颁《定国是诏》，新政持续103天","1895年慈禧颁《马关条约》，新政持续一年","1900年孙中山颁《临时约法》，新政持续百日"],0,"1898年光绪帝颁《定国是诏》开始变法，此后103天称百日维新。","人物、年份和文件要同时对应。",[reform]),
  question("imperial-university","humanities-history",groupReform,"识别京师大学堂","戊戌变法相关教育成果中，被称为中国近代第一所国立大学的是？",["京师大学堂","京师同文馆","黄埔军校"],0,"京师大学堂是中国近代第一所国立大学。","京师同文馆属于洋务运动新式学堂。",[university]),
  question("six-martyrs","humanities-history",groupReform,"识别戊戌六君子","“我自横刀向天笑，去留肝胆两昆仑”及《狱中题壁》对应谁？",["谭嗣同","康有为","梁启超"],0,"该诗句出自戊戌六君子之一谭嗣同。","本题不要求背全六人名单。",[martyrs]),
  question("hundred-days-full","humanities-history",groupReform,"综合复辨戊戌变法","下列哪一项完整正确？",["1895年公车上书揭幕；1898年光绪帝颁《定国是诏》；京师大学堂是近代第一所国立大学；谭嗣同属戊戌六君子","1895年《辛丑条约》揭幕；1898年孙中山颁《临时约法》；京师同文馆由维新派建立","1900年公车上书；慈禧颁《定国是诏》；邓世昌属戊戌六君子"],0,"该项正确串起序幕、开始、教育成果和失败人物。","具体变法政令不在本组范围。",[gongche,reform,university,martyrs]),
  question("boxer-rebellion","humanities-history",groupBoxer,"识别义和团运动","义和团运动的性质和口号是？",["19世纪末农民运动，口号扶清灭洋","资产阶级维新运动，口号自强求富","资产阶级革命政党，纲领三民主义"],0,"义和团是19世纪末以扶清灭洋为口号的农民运动。","赵三多和村址保留在解析及正文。",[boxer]),
  question("eight-nation-alliance","humanities-history",groupBoxer,"识别八国联军","1900年八国联军的国家组合是？",["英、法、德、奥、意、日、俄、美","英、法、俄、美、西、比、荷、日","中、英、法、德、俄、美、日、意"],0,"八国为英法德奥意日俄美。","11国是《辛丑条约》签约国范围。",[alliance]),
  question("boxer-protocol-terms","humanities-history",groupBoxer,"识别辛丑条约内容","《辛丑条约》的核心内容包括？",["赔款、划东交民巷为使馆界、允许列强驻兵","割香港岛、开放五口、协定关税","割辽台澎、开沙重苏杭、允许日本设厂"],0,"赔款、使馆界和驻兵属于《辛丑条约》。","另两项分别对应《南京条约》和《马关条约》。",[protocol]),
  question("boxer-protocol-impact","humanities-history",groupBoxer,"识别辛丑条约影响","使中国完全陷入半殖民地半封建社会深渊的条约是？",["《辛丑条约》","《南京条约》","《尼布楚条约》"],0,"1901年《辛丑条约》对应这一社会影响。","《南京条约》对应开始沦为。",[protocol]),
  question("boxer-alliance-full","humanities-history",groupBoxer,"综合复辨义和团与八国联军","下列哪一项完整正确？",["义和团以扶清灭洋为口号；1900年八国联军出兵；1901年签《辛丑条约》并设使馆界，社会性质进一步恶化至完全陷入","义和团以自强求富为口号；1895年八国联军出兵；《马关条约》设使馆界","义和团是维新运动；八国联军不含日本；《南京条约》允许列强驻兵北京"],0,"该项正确串起运动、侵华和条约影响。","赔款分期利息不进入本组口诀。",[boxer,alliance,protocol]),
];
const specs=[
  ["gongche-memorial",["cs-target-gongche-memorial"],"opening-event",{1:"八国联军时间和事件均错。",2:"《辛丑条约》不是变法序幕。"}],
  ["hundred-days-reform",["cs-target-hundred-days-reform"],"reform-start",{1:"人物、文件与时长均错。",2:"人物、文件与事件均错。"}],
  ["imperial-university",["cs-target-imperial-university"],"education-status",{1:"京师同文馆是洋务新式学堂。",2:"黄埔军校不是近代第一所国立大学。"}],
  ["six-martyrs",["cs-target-six-martyrs"],"martyr-work",{1:"康有为不属于六君子。",2:"梁启超不属于六君子。"}],
  ["hundred-days-full",targets.slice(0,4).map(x=>x.id),"full-recheck",{1:"事件、人物、文件和学校均错配。",2:"年份、人物和六君子均错。"}],
  ["boxer-rebellion",["cs-target-boxer-rebellion"],"movement-nature",{1:"该项对应洋务运动。",2:"该项对应资产阶级革命。"}],
  ["eight-nation-alliance",["cs-target-eight-nation-alliance"],"countries",{1:"混入《辛丑条约》签约国。",2:"中国不是侵华联军成员。"}],
  ["boxer-protocol-terms",["cs-target-boxer-protocol-terms"],"treaty-terms",{1:"该项对应《南京条约》。",2:"该项对应《马关条约》。"}],
  ["boxer-protocol-impact",["cs-target-boxer-protocol-impact"],"treaty-impact",{1:"《南京条约》对应开始沦为。",2:"《尼布楚条约》为中俄边界条约。"}],
  ["boxer-alliance-full",targets.slice(4).map(x=>x.id),"full-recheck",{1:"口号、年份和条约均错。",2:"性质、国家组合和条约均错。"}],
];
const questionSpecifications=specs.map(([questionId,primaryTargetIds,checkPurpose,distractorReasons])=>({questionId,primaryTargetIds,supportingTargetIds:[],checkPurpose,distractorReasons}));
const direct={"cs-target-gongche-memorial":"gongche-memorial","cs-target-hundred-days-reform":"hundred-days-reform","cs-target-imperial-university":"imperial-university","cs-target-six-martyrs":"six-martyrs","cs-target-boxer-rebellion":"boxer-rebellion","cs-target-eight-nation-alliance":"eight-nation-alliance","cs-target-boxer-protocol-terms":"boxer-protocol-terms","cs-target-boxer-protocol-impact":"boxer-protocol-impact"};
const phrase={"cs-target-gongche-memorial":"九五公车康梁揭幕","cs-target-hundred-days-reform":"九八光绪定国是，百日一零三","cs-target-imperial-university":"国立首校京师大学堂","cs-target-six-martyrs":"六君子谭嗣同狱中题壁","cs-target-boxer-rebellion":"义和团农民扶清灭洋","cs-target-eight-nation-alliance":"一九零零英法德奥意日俄美","cs-target-boxer-protocol-terms":"辛丑赔款使馆界，列强驻兵","cs-target-boxer-protocol-impact":"辛丑完全陷入"};
const refs={"cs-target-gongche-memorial":gongche,"cs-target-hundred-days-reform":reform,"cs-target-imperial-university":university,"cs-target-six-martyrs":martyrs,"cs-target-boxer-rebellion":boxer,"cs-target-eight-nation-alliance":alliance,"cs-target-boxer-protocol-terms":protocol,"cs-target-boxer-protocol-impact":protocol};
function memory(id,title,groupId,list,fullId){return{id,revision:1,status:"review",scope:"humanities-history",title,purpose:`帮助回忆${title}。`,text:list.map(x=>phrase[x.id]).join("；")+"。",method:"年份、人物、事件与条约线索串联",coverage:list.map(x=>x.conclusion).join("；"),conditions:["按正文主线记忆。"],excludes:["完整人物和国家名单、赔款利息数字","正文未展开的政治争议"],phrases:list.map(x=>({id:`${x.id}-memory`,phrase:phrase[x.id],meaning:x.conclusion,targetIds:[x.id],coverageType:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,conditionRefs:[],refs:[refs[x.id]],questionIds:[direct[x.id],fullId],checks:[{questionId:direct[x.id],checkPurpose:questionSpecifications.find(s=>s.questionId===direct[x.id]).checkPurpose,reviewTarget:"phrase",reviewAnchorId:`${x.id}-memory`},{questionId:fullId,checkPurpose:"full-recheck",reviewTarget:"meaning",reviewAnchorId:`${x.id}-memory`}] })),questionIds:addedQuestions.filter(q=>q.group===groupId).map(q=>q.id)}};
const mnemonics=[memory("hundred-days-memory","戊戌变法四节点",groupReform,targets.slice(0,4),"hundred-days-full"),memory("boxer-alliance-memory","义和团到辛丑条约",groupBoxer,targets.slice(4),"boxer-alliance-full")];
const mnemonicPhraseTargetRelations=mnemonics.flatMap(m=>m.phrases.map((p,i)=>({mnemonicId:m.id,phraseIndex:i,phraseId:p.id,targetIds:p.targetIds,coverageType:p.coverageType,wrongAnswerReviewAnchor:p.id})));
const mnemonicSpecifications=mnemonics.map(m=>({mnemonicId:m.id,revision:m.revision,purpose:m.purpose,method:m.method,conditionCount:m.conditions.length,phraseIds:m.phrases.map(p=>p.id),selfTestQuestionIds:m.questionIds.slice()}));
const variationDecisions=targets.map(x=>({targetId:x.id,directQuestionIds:[direct[x.id]],variationQuestionIds:[x.groupId===groupReform?"hundred-days-full":"boxer-alliance-full"]}));
const groups=[{id:groupReform,title:"戊戌变法四节点",scope:"humanities-history",reason:"按序幕、开始、教育成果和失败人物构成主线。",questionIds:addedQuestions.slice(0,5).map(q=>q.id)},{id:groupBoxer,title:"义和团到辛丑条约",scope:"humanities-history",reason:"按运动、侵华、条约内容和影响构成主线。",questionIds:addedQuestions.slice(5).map(q=>q.id)}];
const sourceDispositions=[{candidateId:"history-hundred-days-boxer-alliance",pointId:"hundred-days-reform",relatedPointIds:["boxer-rebellion-eight-nation-alliance"],tabIds:["gongche-memorial","hundred-days-reform","imperial-university","six-martyrs","boxer-rebellion","eight-nation-alliance","boxer-protocol"],status:"已建设",batch:"C5-41",scope:"戊戌变法序幕与节点、义和团和八国联军至《辛丑条约》；排除过密数字和完整名单"},{candidateId:"history-xinhai-organization-republic",pointId:"revolution-and-may-fourth",tabIds:["xingzhonghui","tongmenghui","tongmenghui-platform","three-principles","wuchang-uprising","second-revolution","national-protection","republic-of-china","xinhai-result","xinhai-influence"],status:"可建设",batch:"C5-41",scope:"辛亥革命组织思想与革命进程，下一批拆成两个小主题"}];
function applyQuestions(items){return items.concat(addedQuestions)} function applyGroups(items){return items.concat(groups)} function applyMnemonics(items){return items.concat(mnemonics)}
function applyEntryPlans(entryPlans){const plan=JSON.parse(JSON.stringify(entryPlans)),ids=addedQuestions.map(q=>q.id);plan.revision=47;plan.modes.qa.groupIds.push(...groups.map(g=>g.id));plan.modes.qa.questionIds.push(...ids);plan.modes.mnemonic.questionIds.push(...ids);plan.modes.mnemonic.mnemonicIds.push(...mnemonics.map(m=>m.id));return plan}
module.exports={schemaVersion:1,revision:1,batch:"C5-41",targets,addedQuestions,questionSpecifications,questionTargetRelations:questionSpecifications.map(({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})=>({questionId,primaryTargetIds,supportingTargetIds,checkPurpose})),mnemonics,mnemonicSpecifications,mnemonicPhraseTargetRelations,variationDecisions,groups,sourceDispositions,sessionMigrations:[{fromVersion:"bb9be33c",toPackVersion:"2026-10-21.45",changedQuestionIds:addedQuestions.map(q=>q.id),changedMnemonicIds:mnemonics.map(m=>m.id),reason:"C5-41 新增戊戌变法与义和团、八国联军侵华两个历史主题；既有会话保留。"}],applyQuestions,applyGroups,applyMnemonics,applyEntryPlans};
