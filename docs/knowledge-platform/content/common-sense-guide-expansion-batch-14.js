const PENDING_REVIEW = Object.freeze({admission:"expansion-candidate",sourceFidelity:"self-reviewed",noviceReadability:"pending-user-sampling",independentFactReview:"pending-independent-review"});
const card=(id,title,explanation,productionMode,learningGoal,sourceUnitIds,sourceEvidence)=>({id,title,explanation,productionMode,learningGoal,sourceUnitIds,sourceEvidence,semanticRevision:1,review:PENDING_REVIEW});
module.exports={
  schemaVersion:1,id:"common-sense-guide-expansion-batch-14",title:"知识导读扩库第 14 批：物质分类",status:"candidate",
  purpose:"按物质种类、元素种类和化合物类型建立分层分类链，重点解决纯净物与单质、有机物与含碳物质不能直接等同的问题。",
  groups:[{pointId:"chemistry",overview:"物质先按组成物质的种类分为纯净物和混合物；纯净物再按组成元素的种类分为单质和化合物。单质可分金属与非金属，化合物还可区分有机和无机。",relation:"hierarchy",cards:[
    card("classification-framework","物质分类的两级框架","第一层看由几种物质组成，区分纯净物和混合物；纯净物内部再看由几种元素组成，区分单质和化合物。两个层级的判断标准不同。","synthesized","说明物质分类两级框架及各自判断标准。",["cs-16-22-p16-pure-substance-list"],["正文分别按一种物质定义纯净物，并按同种元素组成的纯净物定义单质。"]),
    card("pure-substance-definition","纯净物的判断标准","纯净物由一种物质组成。判断时看物质种类是否单一，而不是看其中只含一种元素；由多种元素组成的化合物也可以是纯净物。","synthesized","判断一种材料是否满足纯净物定义。",["cs-16-22-p16-pure-substance-list"],["正文定义纯净物为由一种物质组成的物质。"]),
    card("pure-not-element-only","纯净物不等于只含一种元素","纯净物强调只含一种物质，单质才要求只含同种元素。因此纯净物既包括单质，也包括由多种元素组成的化合物。","synthesized","区分纯净物和单质的判断标准。",["cs-16-22-p16-pure-substance-list"],["正文以一种物质界定纯净物，后续另以同种元素组成界定单质。"]),
    card("mixture-definition","混合物的判断标准","混合物由两种或多种物质混合而成。混合后各成分共同存在，因此判断混合物要数物质种类，而不是只数元素种类。","light-edit","判断一种材料是否由多种物质构成。",["cs-16-22-p16-mixture-list"],["正文定义混合物为由两种或多种物质混合而成的物质。"]),
    card("pure-mixture-contrast","纯净物与混合物的区别","只含一种物质的是纯净物，含两种或多种物质的是混合物。二者的分界是组成物质的种类数，与材料看起来是否均匀无直接对应关系。","synthesized","比较纯净物和混合物的核心区别。",["cs-16-22-p16-pure-substance-list"],["正文用一种物质和两种或多种物质分别定义纯净物与混合物。"]),
    card("simple-substance-definition","单质必须同时满足两个条件","单质是由同种元素组成的纯净物。它必须同时满足元素种类只有一种、物质本身属于纯净物；只满足其中一个条件不能判为单质。","synthesized","说出单质定义中的元素和纯净物条件。",["cs-16-22-p16-simple-substance-list"],["正文定义单质为由同种元素组成的纯净物。"]),
    card("simple-within-pure","单质属于纯净物","单质是纯净物的下位类别。分类时应先确认材料只含一种物质，再判断它是否只由同种元素组成。","light-edit","说明单质与纯净物的包含关系。",["cs-16-22-p16-simple-substance-list"],["正文把单质定义为同种元素组成的纯净物。"]),
    card("compound-definition","化合物必须含多种元素","化合物是由两种或两种以上元素组成的纯净物。它与单质同属纯净物，但组成元素不少于两种。","light-edit","说出化合物定义中的元素和纯净物条件。",["cs-16-22-p16-compound-list"],["正文定义化合物为由两种或两种以上元素组成的纯净物。"]),
    card("compound-vs-mixture","化合物不等于混合物","化合物虽含多种元素，但只对应一种物质，所以属于纯净物；混合物则含多种物质。元素种类多不能直接推出是混合物。","synthesized","区分化合物的多元素组成与混合物的多物质组成。",["cs-16-22-p16-compound-list"],["正文以多种元素组成的纯净物定义化合物，以多种物质组成定义混合物。"]),
    card("carbon-dioxide-compound","二氧化碳属于化合物","二氧化碳由碳、氧两种元素组成，并可作为一种纯净物存在，因此属于化合物。它含碳但仍归入无机化合物的常见例外范围。","light-edit","说明二氧化碳的化合物与无机物归属。",["cs-16-22-p16-compound-list"],["正文把二氧化碳列为化合物，并将碳的氧化物排除在有机化合物之外。"]),
    card("sodium-bicarbonate-compound","碳酸氢钠属于化合物","碳酸氢钠由多种元素组成且是一种确定物质，因此属于化合物。正文也把碳酸氢盐列入无机化合物范围。","light-edit","说明碳酸氢钠的化合物和无机物归属。",["cs-16-22-p16-compound-list"],["正文把碳酸氢钠列为化合物，并把碳酸氢盐列入无机化合物。"]),
    card("metal-simple-definition","金属单质","金属单质是由同种金属元素形成的纯净物。判断时既要确认元素属于金属，也要确认样品只含这一种物质。","light-edit","说明金属单质的元素属性和纯净物条件。",["cs-16-22-p16-metal-simple-substance-list"],["正文定义金属单质为同种金属元素形成的纯净物。"]),
    card("metal-simple-examples","金属单质的代表","铜、锌、钠、钾、汞和镉是正文列出的金属单质代表。它们虽然物理状态和性质不同，但都属于金属元素形成的单质。","reuse","识别正文列出的金属单质代表。",["cs-16-22-p16-metal-simple-substance-list"],["正文列出铜、锌、钠、钾、汞、镉等金属单质。"]),
    card("nonmetal-simple-definition","非金属单质","非金属单质是由同种非金属元素形成的纯净物。它与金属单质都属于单质，区别在于组成元素的金属或非金属属性。","light-edit","区分金属单质和非金属单质。",["cs-16-22-p16-nonmetal-simple-substance-list"],["正文定义非金属单质为同种非金属元素形成的纯净物。"]),
    card("nonmetal-simple-examples","非金属单质的代表","氢、硼、碳、氮和氧是正文列出的非金属单质代表。分类依据是组成元素的属性，不能仅凭物质在常温下的状态判断。","reuse","识别正文列出的非金属单质代表。",["cs-16-22-p16-nonmetal-simple-substance-list"],["正文列出氢、硼、碳、氮、氧等非金属单质。"]),
    card("organic-core","有机化合物的基本范围","狭义有机化合物通常是含碳的化合物，并常含氢等元素。但含碳只是必要线索，不是充分条件，因为部分含碳化合物按传统分类属于无机物。","synthesized","判断含碳是否足以确定有机化合物。",["cs-16-22-p16-organic-compound-list"],["正文说明狭义有机化合物主要由碳、氢元素组成，同时列出多类含碳排除项。"]),
    card("organic-life-examples","生命体中的有机化合物","脂肪、氨基酸、蛋白质、糖、血红素、叶绿素、酶和激素是正文列出的有机化合物实例。它们可用于识别生命活动中的有机物类别。","reuse","识别正文列出的生命体有机化合物实例。",["cs-16-22-p16-organic-compound-list"],["正文列出脂肪、氨基酸、蛋白质、糖、血红素、叶绿素、酶、激素等有机化合物。"]),
    card("carbon-oxide-exception","碳的氧化物不是有机物","一氧化碳和二氧化碳都含碳，但按传统物质分类属于无机化合物。这个例外说明不能把含碳与有机物直接画等号。","light-edit","说明一氧化碳和二氧化碳的无机物归属。",["cs-16-22-p16-organic-compound-list"],["正文明确把一氧化碳、二氧化碳等碳的氧化物排除在有机化合物之外。"]),
    card("carbonate-exception","碳酸及其盐属于无机物","碳酸、碳酸氢盐和碳酸盐虽然都含碳，但按传统分类属于无机化合物。它们是判断含碳物质类别时的重要例外。","light-edit","识别碳酸、碳酸氢盐和碳酸盐的无机物归属。",["cs-16-22-p16-inorganic-compound-list"],["正文把碳酸及盐排除在有机物外，并将碳酸氢盐、碳酸盐列入无机物。"]),
    card("inorganic-core","无机化合物的基本范围","无机化合物通常指不属于有机化合物体系的化合物，多数不含碳，但也包括碳的氧化物、碳酸盐等传统无机含碳物质。","synthesized","概括无机化合物的一般范围和含碳例外。",["cs-16-22-p16-inorganic-compound-list"],["正文说明无机化合物通常不含碳，同时包括碳的氧化物、碳酸氢盐、碳酸盐、氰化物等。"]),
    card("water-inorganic","水属于无机化合物","水是与生命体密切相关的化合物，但仍属于无机化合物。这说明是否与生命体有关不能作为划分有机物和无机物的可靠标准。","synthesized","说明水的无机物归属并排除生命关联判断法。",["cs-16-22-p16-inorganic-compound-list"],["正文指出少数与机体有关的化合物也是无机化合物，并以水为例。"]),
    card("classification-sequence","物质分类的判断顺序","判断物质类别时，先看是一种物质还是多种物质；若为纯净物，再看由一种元素还是多种元素组成；若为化合物，再根据传统范围区分有机与无机。","synthesized","运用分层顺序完成物质类别判断。",["cs-16-22-p16-pure-substance-list"],["正文依次给出纯净物、混合物、单质、化合物以及有机和无机化合物定义。"]),
  ]}],
  exclusions:[
    ["organism-related-definition","以是否与机体有关定义无机物","有机和无机的现代分类不能按是否与生命体有关直接划分，正文自己也用水说明存在反例，作为定义会误导。","保留水属于无机物的具体结论，永久排除以机体关联作为分类定义的表述。",["cs-16-22-p16-inorganic-compound-list"]],
    ["all-life-organic-absolute","所有生命体都含有机化合物的绝对表述","该说法范围过大且对物质分类判断帮助有限，不适合作为需要独立记忆的公考知识卡。","只有在生物化学主题中明确生命定义与讨论范围时才重新评估。",["cs-16-22-p16-organic-compound-list"]],
    ["rare-carbon-exception-list","氰酸盐和金属碳化物等长例外清单","长尾例外缺少结构解释，直接罗列会增加记忆负担；基础导读保留碳氧化物和碳酸盐两组高价值例外即可。","在独立无机化学分类主题中按结构和成键规则解释后再评估。",["cs-16-22-p16-organic-compound-list"]],
  ].map(([id,title,reason,requiredEvidence,sourceUnitIds])=>({id,pointId:"chemistry",title,reason,requiredEvidence,sourceUnitIds}))
};
