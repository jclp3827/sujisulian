const Q={
  "gdp-definition-core": {
    "prompt": "按我国核算口径，下列哪组要素符合GDP定义？",
    "options": [
      "一国或地区常住单位、一定时期、生产的最终产品和服务、按核算价格口径计量的价值",
      "某一时点、居民持有的各类资产、已经售出商品、历史账面原值",
      "全球范围、历年累计、中间产品、投入成本"
    ],
    "explanation": "GDP核算一国或地区常住单位一定时期生产的最终产品和服务价值。常住按经济利益中心判断，规定范围内的非市场产出也可估算计入。",
    "boundary": "不按公民国籍或是否直接发生买卖简单判断GDP生产范围。"
  },
  "gdp-gnp-territory-national": {
    "prompt": "GNI原称GNP。区分GDP与GNI时，下列口径正确的是？",
    "options": [
      "GDP看常住单位生产成果，GNI看常住单位初次收入分配结果",
      "GDP按公民国籍统计，GNI只看境内商品销售地点",
      "GDP与GNI按产品是否售出区分，二者与跨境初次收入没有关系"
    ],
    "explanation": "GNI原称GNP，等于GDP加来自国外的初次分配收入净额。两个指标都涉及常住单位，不能把国民直接等同公民国籍。",
    "boundary": "常住单位按经济利益中心判断，不单凭生产者或所有者国籍判断。"
  },
  "gdp-gnp-full": {
    "options": [
      "GDP把中间产品再次单独计入，并按某一时点统计资产存量",
      "GDP核算常住单位一定时期的最终生产成果，是流量；GNI原称GNP，关注常住单位初次收入",
      "GDP侧重已经售出的商品，GNI只统计本国公民收入，二者均排除全部非市场产出"
    ],
    "explanation": "GDP是生产和时期流量指标，GNI原称GNP，是常住单位初次收入指标；二者都不能简单按国籍或是否直接交易判断。",
    "boundary": "中间产品不重复计入，自给性货物、自有住房服务等按核算边界处理。"
  },
  "unemployment-definition": {
    "prompt": "某人处于相应调查范围，参考周没有工作，近期找过工作且有合适工作能立即开始。按我国劳动力调查口径应判断为？",
    "options": [
      "满足调查失业人口的条件",
      "因正在求职，所以不属于失业",
      "只要没有工作，无论是否求职或能否开始工作都属于失业"
    ],
    "explanation": "调查失业人口须同时满足没有工作、近期寻找工作及能够开始工作等条件。只有一般工作意愿而无相应求职或可开始工作的条件，不一定计为失业。",
    "boundary": "区分就业、失业和非劳动力，不把全部未就业者都计入失业。"
  },
  "unemployment-rate": {
    "prompt": "在同一调查范围内计算调查失业率，分子和分母分别是？",
    "options": [
      "失业人口与就业人口加失业人口",
      "失业人口与居民总人口",
      "就业人口与达到就业年龄人口"
    ],
    "explanation": "调查失业率等于失业人口除以就业人口与失业人口之和，分母是劳动力人口，包括就业者，不能只算积极求职者。",
    "boundary": "分子分母须采用一致的年龄、地区和调查口径。"
  },
  "full-employment-not-zero": {
    "prompt": "在常用理论模型中，周期性失业消失、实际失业率处于自然失业率附近。哪项判断合理？",
    "explanation": "常用理论模型用自然失业率附近的状态说明充分就业，摩擦性和结构性失业仍可能存在，因此不等于零失业。",
    "boundary": "不把自然失业率视作固定百分比，也不由此推断所有其他资源均被充分利用。"
  },
  "full-employment-full": {
    "options": [
      "失业率以总人口为分母，充分就业要求失业率降为零，摩擦性失业也应消失",
      "自然失业只包括季节性和周期性，充分就业要求没有人员流动且结构性失业不存在",
      "调查失业率分母为就业与失业人口之和；常用模型的自然失业包括摩擦与结构性，充分就业不等于零失业"
    ],
    "explanation": "统计失业率分母包括就业人口和失业人口。充分就业与自然失业率属于理论分析口径，不意味着零失业，也没有跨地区跨时期统一固定的自然失业率。"
  },
  "inflation-definition": {
    "prompt": "下列哪种价格变化符合通货膨胀的基本表现？",
    "options": [
      "一般价格水平在一段时间内持续上涨，可能由需求扩张、成本上升或供给冲击等推动",
      "某种蔬菜单日涨价，其他价格稳定，一般物价没有持续上涨",
      "一般价格水平持续下降"
    ],
    "explanation": "通胀是一般价格水平持续上涨，不是个别商品一次涨价；成因可涉及需求、成本或供给冲击，不能只用货币超发或单一供求口号定义。"
  },
  "price-indices": {
    "options": [
      "CPI观察居民消费价格，PPI通常观察工业产品出厂价格，购进价格另有指标；WPI观察批发价格",
      "CPI看原材料和中间投入，PPI看居民消费价格，WPI看劳动者工资与收入",
      "CPI、出厂PPI和购进价格指数观察对象相同，只是名称不同"
    ],
    "explanation": "我国CPI观察居民消费商品和服务价格，通常所称PPI为工业生产者出厂价格指数，另有购进价格指数观察原材料等投入；WPI观察批发价格。"
  },
  "inflation-redistribution": {
    "prompt": "通胀高于订约时预期，合同约定固定名义偿还额且未充分指数化。其他条件不变时，谁可能因偿还额实际价值下降而相对受益？",
    "options": [
      "持有该固定名义债权的债权人",
      "承担该固定名义债务的债务人",
      "债权人和债务人实际得到的价值一定都不变"
    ],
    "explanation": "在题设合同和预期条件下，偿还额的实际购买力下降，可能使债务人相对受益、债权人相对受损；不据此断言所有变动收入者都能获益。",
    "boundary": "通胀若已被利率、指数化或其他条款充分补偿，或资产负债结构不同，结果可能改变。"
  },
  "deflation-definition": {
    "options": [
      "一般价格水平在一段时间内持续下降",
      "某商店短期促销使一种商品降价",
      "通胀率由较高正值降为较低正值，价格水平仍上涨"
    ],
    "explanation": "通缩是一般价格水平持续下降。个别商品降价，或正通胀率下降但价格仍涨，都不能仅凭这一点判定通缩。"
  },
  "stable-prices-full": {
    "options": [
      "个别商品一次涨价即可判定通胀，通胀总会使债权人获益",
      "通胀是一般价格水平持续上涨；CPI观察居民消费价格；通缩是一般价格水平持续下降",
      "CPI、出厂PPI与购进价格指数对象相同；通胀和通缩都表示价格持续上涨"
    ],
    "explanation": "判断通胀通缩需要一般价格水平和持续性条件；CPI、出厂和购进价格观察对象不同，不能用固定涨幅阈值或个别商品价格替代定义。"
  },
  "bop-balance": {
    "prompt": "某简化统计中净出口为120亿元、两类资产购买交易的净流出也为120亿元。仅凭这两项能否判定完整国际收支已实现经济上的外部均衡？",
    "options": [
      "不能，尚需考虑其他经常账户、资本金融交易及经济条件",
      "能，两项相等就保证所有跨境收入、转移和金融交易均为零",
      "能，复式记账借贷相等就意味着任何经济体都不存在外部失衡"
    ],
    "explanation": "净出口和简化资产购买净额只包含部分交易；国际收支表内记账平衡不等于经济上的外部均衡，二者相等不能替代完整账户分析。",
    "boundary": "纠正旧题将简化恒等关系当作完整国际收支均衡定义的错误；保留题目ID并递增语义修订。"
  },
  "net-capital-outflow": {
    "prompt": "仅考虑本国居民购买外国资产80亿元与非居民购买本国资产55亿元，不含出售、偿还等其他交易。按此简化口径，净资本流出是多少？",
    "explanation": "在题设仅包含两类资产购买交易的条件下，净资本流出为80减55，即25亿元；这个净额不代表完整金融账户或国际收支均衡。",
    "boundary": "资产交易可涉及购入、出售及偿还等其他方向，本题明确排除这些交易后才使用简化算式。"
  },
  "bop-full": {
    "options": [
      "净出口按进口减出口计算；只要两类资产购买净额与净出口相等，就能证明全部国际收支不存在失衡",
      "净出口按出口减进口计算；简化资产购买净流出需限定交易范围，二者相等不自动证明完整国际收支均衡",
      "国际收支的经常账户只包括商品出口，复式记账的借贷相等就是所有跨境交易均为零"
    ],
    "explanation": "净出口只覆盖货物服务贸易，简化资产净流出只覆盖题设交易。国际收支还含其他收入转移、资本金融等交易，表内平衡与经济外部均衡需要区分。",
    "boundary": "不以净出口与简化净流出的差额为零作为完整国际收支均衡的充分条件。"
  }
};
const T={
  "cs-target-gdp-definition": {
    "statement": "说清GDP常住单位、生产和时期口径。",
    "conclusion": "GDP核算常住单位一定时期生产的最终产品和服务价值，规定范围内的非市场产出也可估算计入。",
    "conditions": [
      "不按公民国籍或是否直接买卖简单判断。"
    ]
  },
  "cs-target-gdp-gnp-boundary": {
    "statement": "区分GDP生产与GNI初次收入口径。",
    "conclusion": "GNI原称GNP，是常住单位初次收入分配结果，等于GDP加来自国外的初次分配收入净额。",
    "conditions": [
      "常住不等于国籍。"
    ]
  },
  "cs-target-unemployment-definition": {
    "statement": "识别调查失业人口的无工作、求职和可开始工作条件。",
    "conclusion": "调查失业须同时满足参考周无工作、近期求职及能立即开始工作等条件。",
    "conditions": [
      "无工作和一般工作意愿本身不充分。"
    ]
  },
  "cs-target-unemployment-rate": {
    "statement": "说清调查失业率分子与分母。",
    "conclusion": "分子为失业人口，分母为同口径就业人口与失业人口之和。",
    "conditions": [
      "不是总人口，也不是仅含求职者。"
    ]
  },
  "cs-target-full-employment-natural": {
    "statement": "区分充分就业与零失业。",
    "conclusion": "在常用理论模型中，充分就业仍可有摩擦性与结构性失业，实际失业率处于自然失业率附近。",
    "conditions": [
      "自然失业率不是普遍固定值，不替代现行调查口径。"
    ]
  },
  "cs-target-inflation-definition": {
    "statement": "识别一般价格水平持续上涨的表现。",
    "conclusion": "通胀是一般价格水平持续上涨，其成因可涉及需求、成本或供给冲击等。",
    "conditions": [
      "不由个别商品一次涨价认定，不限于单一原因。"
    ]
  },
  "cs-target-price-indices": {
    "statement": "区分居民消费、工业出厂、购进及批发价格。",
    "conclusion": "CPI看居民消费，PPI通常看工业出厂价格，购进价格另有指标，WPI看批发价格。",
    "conditions": [
      "明确指标对象、范围与比较期。"
    ]
  },
  "cs-target-inflation-redistribution": {
    "statement": "说明未预期通胀对固定名义债务的条件影响。",
    "conclusion": "固定名义且未充分指数化债务，在通胀高于预期时偿还额实际价值下降，债务人可能相对受益。",
    "conditions": [
      "不推广为所有债务或所有变动收入者受益。"
    ]
  },
  "cs-target-deflation-definition": {
    "statement": "区分通缩与涨速放缓。",
    "conclusion": "通缩是一般价格水平持续下降；正通胀率降低但价格仍涨不是通缩。",
    "conditions": [
      "区分价格水平和变动率、一般与个别、持续与短期。"
    ]
  },
  "cs-target-bop-balance": {
    "statement": "区分国际收支表内平衡与经济外部均衡。",
    "conclusion": "复式记账的表内平衡不意味着没有外部失衡；净出口与简化资产净流出相等不足以判断完整均衡。",
    "conditions": [
      "核对完整经常账户及资本金融交易等，不以部分净额代替全部账户。"
    ]
  },
  "cs-target-net-capital-outflow": {
    "statement": "在限定交易范围内计算资产购买净流出。",
    "conclusion": "只含居民购买国外资产与非居民购买本国资产时，可用前者减后者计算简化净流出。",
    "conditions": [
      "明确排除其他出售偿还等交易，不代表完整金融账户。"
    ]
  }
};
const M={
  "gdp-gnp-boundaries-memory": {
    "text": "GDP看常住单位生产成果，时期流量不以售出为必要；GNI原称GNP，看常住单位初次收入，常住不按国籍。",
    "phrasePatches": {
      "gdp-memory-definition": {
        "phrase": "常住单位、时期生产、最终价值",
        "meaning": "按核算范围计量常住单位一定时期的最终生产成果，也可包括规定范围非市场产出。"
      },
      "gdp-memory-gdp-gnp": {
        "phrase": "GDP生产，GNI收入",
        "meaning": "GNI原称GNP，关注常住单位初次收入，国民不能直接解释为国籍。"
      }
    }
  },
  "full-employment-memory": {
    "text": "调查失业需无工作、近期求职、能开始工作；分母为就业加失业人口；理论充分就业不等于零失业，自然失业率不固定。",
    "conditions": [
      "统计口径与理论模型分开。"
    ],
    "phrasePatches": {
      "employment-memory-definition": {
        "phrase": "无工作、近期求职、能开始",
        "meaning": "在相应调查范围同时满足无工作、求职与可开始工作的条件。"
      },
      "employment-memory-rate": {
        "phrase": "失业除以就业加失业",
        "meaning": "分母为同口径就业与失业人口之和。"
      },
      "employment-memory-full": {
        "phrase": "充分就业仍可有自然失业",
        "meaning": "常用理论模型中摩擦和结构性失业仍可存在，不采用统一固定自然失业率。"
      }
    }
  },
  "stable-prices-memory": {
    "text": "通胀普涨，通缩普降，放缓不等于降；CPI看消费，出厂PPI与购进价格分开；成因与合同影响依条件判断。",
    "conditions": [
      "不以单一供求或货币原因替代价格表现，不采用无依据固定阈值。"
    ],
    "phrasePatches": {
      "stable-memory-inflation": {
        "phrase": "一般价格持续上涨",
        "meaning": "通胀成因可涉及需求、成本或供给冲击等，不限于单一原因。"
      },
      "stable-memory-deflation": {
        "phrase": "一般价格持续下降",
        "meaning": "通缩不是正通胀率放缓，也不是某商品短期降价。"
      },
      "stable-memory-indices": {
        "phrase": "消费、出厂、购进、批发分开",
        "meaning": "CPI看消费，PPI通常指出厂价格，购进价格另有指标，WPI看批发。"
      }
    }
  },
  "balance-of-payments-memory": {
    "text": "净出口为出口减进口，资产净流出算式须限定交易；表内借贷平衡，不等于经济外部均衡。",
    "conditions": [
      "简化资产购买算式不代表完整金融账户，净出口不覆盖全部经常账户。"
    ],
    "phrasePatches": {
      "bop-memory-capital": {
        "phrase": "限定交易再算资产净流出",
        "meaning": "仅含两类资产购买时，可用居民购买国外资产减非居民购买本国资产。"
      },
      "bop-memory-balance": {
        "phrase": "表内平衡与外部均衡分开",
        "meaning": "部分净额相等或复式记账借贷相等，不能直接证明不存在经济外部失衡。"
      }
    }
  }
};
const S={
  "gdp-definition-core": {
    "1": "该项不满足本题的常住单位与时期生产条件。",
    "2": "该项不满足本题的常住单位与时期生产条件。"
  },
  "gdp-gnp-territory-national": {
    "1": "该项不满足本题的常住单位生产与初次收入条件。",
    "2": "该项不满足本题的常住单位生产与初次收入条件。"
  },
  "gdp-gnp-full": {
    "0": "该项不满足本题的生产流量与收入区别条件。",
    "2": "该项不满足本题的生产流量与收入区别条件。"
  },
  "unemployment-definition": {
    "1": "该项不满足本题的无工作、近期求职和可开始工作条件。",
    "2": "该项不满足本题的无工作、近期求职和可开始工作条件。"
  },
  "unemployment-rate": {
    "1": "该项不满足本题的就业加失业的分母条件。",
    "2": "该项不满足本题的就业加失业的分母条件。"
  },
  "full-employment-not-zero": {
    "1": "该项不满足本题的自然失业仍存在条件。",
    "2": "该项不满足本题的自然失业仍存在条件。"
  },
  "full-employment-full": {
    "0": "该项不满足本题的统计分母和理论充分就业条件。",
    "1": "该项不满足本题的统计分母和理论充分就业条件。"
  },
  "inflation-definition": {
    "1": "该项不满足本题的一般价格水平持续上涨条件。",
    "2": "该项不满足本题的一般价格水平持续上涨条件。"
  },
  "price-indices": {
    "1": "该项不满足本题的消费、出厂、购进与批发的观察对象条件。",
    "2": "该项不满足本题的消费、出厂、购进与批发的观察对象条件。"
  },
  "inflation-redistribution": {
    "0": "该项不满足本题的固定名义且未充分指数化合同下的实际偿还价值条件。",
    "2": "该项不满足本题的固定名义且未充分指数化合同下的实际偿还价值条件。"
  },
  "deflation-definition": {
    "1": "该项不满足本题的一般价格水平持续下降条件。",
    "2": "该项不满足本题的一般价格水平持续下降条件。"
  },
  "stable-prices-full": {
    "0": "该项不满足本题的价格持续性与指标观察范围条件。",
    "2": "该项不满足本题的价格持续性与指标观察范围条件。"
  },
  "bop-balance": {
    "1": "该项不满足本题的完整账户与表内平衡区别条件。",
    "2": "该项不满足本题的完整账户与表内平衡区别条件。"
  },
  "net-capital-outflow": {
    "1": "该项不满足本题的限定资产购买交易的方向条件。",
    "2": "该项不满足本题的限定资产购买交易的方向条件。"
  },
  "bop-full": {
    "0": "该项不满足本题的净额范围及统计与经济均衡区别条件。",
    "2": "该项不满足本题的净额范围及统计与经济均衡区别条件。"
  }
};
const IDS={
  "questions": [
    "gdp-definition-core",
    "gdp-final-intermediate",
    "gdp-flow-produced",
    "gdp-gnp-territory-national",
    "gdp-gnp-full",
    "growth-three-carriages",
    "growth-internal-external-demand",
    "growth-three-carriages-full",
    "unemployment-definition",
    "unemployment-types",
    "unemployment-rate",
    "full-employment-not-zero",
    "full-employment-full",
    "inflation-definition",
    "price-indices",
    "inflation-redistribution",
    "deflation-definition",
    "stable-prices-full",
    "bop-balance",
    "net-exports",
    "net-capital-outflow",
    "bop-full"
  ],
  "targets": [
    "cs-target-gdp-definition",
    "cs-target-gdp-final-products",
    "cs-target-gdp-flow-production",
    "cs-target-gdp-gnp-boundary",
    "cs-target-growth-three-carriages",
    "cs-target-growth-internal-external-demand",
    "cs-target-unemployment-definition",
    "cs-target-unemployment-types",
    "cs-target-unemployment-rate",
    "cs-target-full-employment-natural",
    "cs-target-inflation-definition",
    "cs-target-price-indices",
    "cs-target-inflation-redistribution",
    "cs-target-deflation-definition",
    "cs-target-bop-balance",
    "cs-target-net-exports",
    "cs-target-net-capital-outflow"
  ],
  "mnemonics": [
    "gdp-gnp-boundaries-memory",
    "growth-three-carriages-memory",
    "full-employment-memory",
    "stable-prices-memory",
    "balance-of-payments-memory"
  ]
};
module.exports=function(pack){const previousVersion=pack.version;const previousMigrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===previousVersion);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const item=pack[kind].find(x=>x.id===id);if(!item)throw Error("Missing macro item "+id);const {phrasePatches,...fields}=delta;Object.assign(item,fields,{revision:item.revision+1});if(phrasePatches)item.phrases=item.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.2";pack.sessionMigrations=pack.sessionMigrations.concat(previousMigrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...IDS.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...IDS.mnemonics])]})),[{"fromVersion":"8e43c8d","toPackVersion":"2026-10-24.2","changedQuestionIds":["gdp-definition-core","gdp-final-intermediate","gdp-flow-produced","gdp-gnp-territory-national","gdp-gnp-full","growth-three-carriages","growth-internal-external-demand","growth-three-carriages-full","unemployment-definition","unemployment-types","unemployment-rate","full-employment-not-zero","full-employment-full","inflation-definition","price-indices","inflation-redistribution","deflation-definition","stable-prices-full","bop-balance","net-exports","net-capital-outflow","bop-full"],"changedMnemonicIds":["gdp-gnp-boundaries-memory","growth-three-carriages-memory","full-employment-memory","stable-prices-memory","balance-of-payments-memory"],"reason":"宏观统计正文与关联旧题已逐项复核，受影响会话失效，其余依既有协议延续。"},{"fromVersion":"e18c9dc4","toPackVersion":"2026-10-24.2","changedQuestionIds":["gdp-definition-core","gdp-final-intermediate","gdp-flow-produced","gdp-gnp-territory-national","gdp-gnp-full","growth-three-carriages","growth-internal-external-demand","growth-three-carriages-full","unemployment-definition","unemployment-types","unemployment-rate","full-employment-not-zero","full-employment-full","inflation-definition","price-indices","inflation-redistribution","deflation-definition","stable-prices-full","bop-balance","net-exports","net-capital-outflow","bop-full"],"changedMnemonicIds":["gdp-gnp-boundaries-memory","growth-three-carriages-memory","full-employment-memory","stable-prices-memory","balance-of-payments-memory"],"reason":"宏观统计正文与关联旧题已逐项复核，受影响会话失效，其余依既有协议延续。"}]);return pack;};
module.exports.reviewedIds=IDS;
module.exports.semanticChanges={questions:Object.keys(Q),targets:Object.keys(T),mnemonics:Object.keys(M)};
