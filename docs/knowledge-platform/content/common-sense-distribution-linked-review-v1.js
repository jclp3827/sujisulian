const Q={
  "primary-industry": {
    "prompt": "按我国三次产业划分规定，哪项属于第一产业？",
    "options": [
      "种植农作物，不含农林牧渔专业及辅助性活动",
      "为农业提供专业及辅助性活动",
      "金属制品、机械和设备修理业"
    ],
    "explanation": "第一产业包括农林牧渔，但不含相应专业及辅助性活动；该类辅助活动和指定修理业划入第三产业。",
    "boundary": "按行业活动及统计规定判断，不能只看是否服务农业或涉及自然资源。"
  },
  "secondary-industry": {
    "prompt": "按我国三次产业划分规定，哪组属于第二产业的典型活动？",
    "options": [
      "农业专业辅助活动与金融服务",
      "制造业中的产品制造与建筑工程，不含规定划入第三产业的修理活动",
      "开采专业辅助活动与教育服务"
    ],
    "explanation": "第二产业包括规定范围的采矿、制造、电力热力燃气水生产供应与建筑。开采专业辅助及指定修理活动有明确例外。",
    "boundary": "不只按是否加工或是否涉及工业认定产业类别。"
  },
  "tertiary-industry": {
    "prompt": "关于我国第三产业的统计范围，下列说法正确的是？",
    "options": [
      "凡涉及农林牧渔的活动都排除在第三产业之外",
      "凡涉及采矿制造的辅助和修理活动都属于第二产业",
      "第三产业为第一、第二产业以外的其他行业，包含规定的专业辅助及修理活动"
    ],
    "explanation": "第三产业即服务业，除流通、金融、教育等，还包括规定的农林牧渔专业辅助、开采专业辅助及指定修理活动，不能用不生产物质产品替代完整分类规则。",
    "boundary": "服务业也创造经济价值，不按简单物质/非物质二分替代统计分类。"
  },
  "industrial-structure-full": {
    "options": [
      "产业政策以产业形成发展为对象；三次产业按统计规定分类，专业辅助活动等有明确例外",
      "第一产业是所有涉及自然资源的活动，第二产业是所有出现加工字样的活动",
      "第三产业没有经济产出，第一第二产业之外的行业都不创造价值"
    ],
    "explanation": "产业政策对象与产业统计分类需要分开识别，具体行业应按规定范围及例外判断，不能用名称或是否物质生产机械分类。"
  },
  "initial-distribution": {
    "prompt": "生产过程中，依据劳动、资本、土地、技术、数据等要素贡献形成收入，市场在资源配置中发挥决定性作用。这主要属于哪类分配？",
    "explanation": "初次分配主要依据生产要素贡献形成收入，不能只理解为企业内部工资分配，也不意味着不需要公平规则和政府制度保障。",
    "boundary": "与政府税收社保调节、自愿慈善公益区分，核算口径须明确。"
  },
  "income-distribution-full": {
    "options": [
      "收入政策关注水平与差距；初次分配依据要素贡献，再分配通过税收社保等调节，第三次分配强调自愿公益",
      "初次分配不需要任何公平规则；第三次分配可强制摊派并替代政府法定责任",
      "三次分配只按金额大小区分，与主体、机制及自愿性无关"
    ],
    "explanation": "三种机制协调配套，不能把初次分配等同企业内部工资分配，也不能将自愿公益变为强制摊派或替代政府法定责任。"
  }
};
const T={
  "cs-target-primary-industry": {
    "conclusion": "第一产业为农林牧渔，不含相应专业及辅助性活动。",
    "conditions": [
      "按现行统计规定及行业活动判断。"
    ]
  },
  "cs-target-secondary-industry": {
    "conclusion": "第二产业包括规定范围的采矿、制造、电力热力燃气水及建筑，辅助活动与指定修理业有例外。",
    "conditions": [
      "不以加工或工业字样替代统计范围。"
    ]
  },
  "cs-target-tertiary-industry": {
    "conclusion": "第三产业是第一、第二产业以外的其他行业，包含规定的专业辅助及修理活动。",
    "conditions": [
      "服务业也创造价值，物质产品二分不能替代分类规定。"
    ]
  },
  "cs-target-initial-distribution": {
    "conclusion": "初次分配主要依据生产要素贡献形成收入，市场在资源配置中发挥决定性作用。",
    "conditions": [
      "并非仅由企业内部进行，也不排除公平规则和制度保障。"
    ]
  }
};
const M={
  "industrial-structure-memory": {
    "text": "产业政策看发展对象；三次产业按规定分，农林牧渔及工业有例外，辅助修理核口径。",
    "conditions": [
      "按现行统计范围及例外，不用是否生产物质产品替代。"
    ],
    "phrasePatches": {
      "industry-memory-primary": {
        "phrase": "一产农林牧渔，专业辅助另分",
        "meaning": "农林牧渔专业及辅助性活动不属于第一产业。"
      },
      "industry-memory-secondary": {
        "phrase": "二产工业建筑，辅助修理有例外",
        "meaning": "采矿制造等按规定范围判断，专业辅助及指定修理活动另列第三产业。"
      },
      "industry-memory-tertiary": {
        "phrase": "三产其余行业，包含规定辅助修理",
        "meaning": "服务业为第一第二产业以外的其他行业，也创造价值。"
      }
    }
  },
  "income-distribution-core-memory": {
    "text": "收入政策关注水平差距；初次按要素贡献，再分税收社保调，三分自愿公益作补充。",
    "conditions": [
      "三种机制协调配套，初次不只限企业内部，第三次不能强制摊派。"
    ],
    "phrasePatches": {
      "income-memory-initial": {
        "phrase": "初次按要素贡献",
        "meaning": "根据要素贡献形成收入，市场在资源配置中发挥决定性作用。"
      }
    }
  }
};
const S={"primary-industry":{"1":"农林牧渔专业及辅助性活动划入第三产业，不因服务农业就归一产。","2":"金属制品、机械和设备修理业划入第三产业。"},"secondary-industry":{"0":"农业专业辅助与金融服务均不属题设二产范围。","2":"开采专业辅助与教育服务划入第三产业。"},"tertiary-industry":{"0":"农林牧渔专业辅助活动属于第三产业的明确例外。","1":"开采专业辅助和指定修理活动不能都归二产。"},"industrial-structure-full":{"1":"涉及资源或加工不足以判断产业分类，还须核对规定。","2":"服务业同样创造经济价值，不能以物质产品二分替代规定。"},"income-distribution-full":{"1":"初次分配仍需制度保障，第三次须自愿且不能替代法定责任。","2":"分配机制依主体、过程和自愿性区分，不以金额划分。"}};
const AFFECTED={"questions":["primary-industry","secondary-industry","tertiary-industry","industrial-structure-full","initial-distribution","redistribution","third-distribution","income-distribution-full"],"mnemonics":["industrial-structure-memory","income-distribution-core-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing distribution item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.5";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"363f680d","toPackVersion":"2026-10-24.5","changedQuestionIds":["primary-industry","secondary-industry","tertiary-industry","industrial-structure-full","initial-distribution","redistribution","third-distribution","income-distribution-full"],"changedMnemonicIds":["industrial-structure-memory","income-distribution-core-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"f12c1dbe","toPackVersion":"2026-10-24.5","changedQuestionIds":["primary-industry","secondary-industry","tertiary-industry","industrial-structure-full","initial-distribution","redistribution","third-distribution","income-distribution-full"],"changedMnemonicIds":["industrial-structure-memory","income-distribution-core-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["industrial-policy-definition","primary-industry","secondary-industry","tertiary-industry","industrial-structure-full","income-policy-overview","initial-distribution","redistribution","third-distribution","income-distribution-full"],"targets":["cs-target-industrial-policy-definition","cs-target-primary-industry","cs-target-secondary-industry","cs-target-tertiary-industry","cs-target-income-policy-overview","cs-target-initial-distribution","cs-target-redistribution","cs-target-third-distribution"],"mnemonics":["industrial-structure-memory","income-distribution-core-memory"]};
module.exports.directIds={"questions":["primary-industry","secondary-industry","tertiary-industry","industrial-structure-full","initial-distribution","redistribution","third-distribution","income-distribution-full"],"targets":["cs-target-primary-industry","cs-target-secondary-industry","cs-target-tertiary-industry","cs-target-initial-distribution","cs-target-redistribution","cs-target-third-distribution"],"mnemonics":["industrial-structure-memory","income-distribution-core-memory"]};
module.exports.semanticChanges={"questions":["primary-industry","secondary-industry","tertiary-industry","industrial-structure-full","initial-distribution","income-distribution-full"],"targets":["cs-target-primary-industry","cs-target-secondary-industry","cs-target-tertiary-industry","cs-target-initial-distribution"],"mnemonics":["industrial-structure-memory","income-distribution-core-memory"]};
