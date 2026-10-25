const Q={
  "fiscal-income-components": {
    "objective": "区分财政广义筹资与一般公共预算本级收入口径",
    "prompt": "“税、利、债、费”作为传统广义筹资来源的概括，能否直接等同现行一般公共预算本级收入分类？",
    "options": [
      "不能，需区分税收、非税收入与债务融资等口径",
      "能，债券发行额就是税收收入，二者没有偿还性质区别",
      "能，只要是政府筹到的资金，均可不分预算和融资性质合并"
    ],
    "explanation": "传统广义筹资概括不能直接当作一般公共预算本级收入分类。税收与非税收入、债务融资和资金调入等性质不同，需要明确预算与统计口径。",
    "boundary": "不因宽口径清单包含债就断言所有教材分类均错误，也不把债务融资混同非偿还性收入。"
  },
  "fiscal-policy-direction": {
    "objective": "在需求不足等条件下识别财政税支的基础扩张方向",
    "prompt": "在需求不足、其他条件相近且措施能够有效传导时，哪组税支变化通常具有支持需求的方向？",
    "options": [
      "增加税收、减少相关财政支出",
      "减少税收、增加有效财政支出",
      "仅增加债券发行量，不问用途、税支变化和到期接续"
    ],
    "explanation": "减税可能增加可支配收入或投资激励，增加有效支出可支持需求。发债还受用途和到期接续等影响，不能仅按发行量判断财政取向。",
    "boundary": "不把衰退等同通缩，不从工具方向直接保证政策成效或固定乘数。"
  },
  "fiscal-policy-full": {
    "options": [
      "政府运用税收和支出等工具；预算收入与债务融资需分清；购买与现金转移按支付时的交易性质区分；需求不足时可考虑减税增支",
      "中央银行运用预算税收；财政收入包括存贷汇保；没有商品劳务交换是政府购买；萧条时增税减支",
      "政府运用货币供应量；所有收费等同税收；有直接商品劳务交换是现金转移；只看发债量即可判断财政政策取向"
    ],
    "explanation": "财政政策需区分主体工具、预算与融资、支付时的交易性质以及适用情境。自动稳定器只是财政调节的一种机制，不能与财政政策整体互作同义词。",
    "boundary": "按税支和资金用途等分析取向，不以发债量、领域名称或固定经济状态标签直接下结论。"
  }
};
const T={
  "cs-target-fiscal-income": {
    "statement": "区分传统广义筹资来源与一般公共预算收入。",
    "conclusion": "广义筹资概括不等于一般公共预算本级收入分类，税收非税、融资和资金调入等须分清口径。",
    "conditions": [
      "不把债券发行额直接当作税收或一般公共预算本级收入。"
    ]
  },
  "cs-target-fiscal-direction": {
    "statement": "在限定条件下识别财政税支变化的方向。",
    "conclusion": "需求不足等情境下，减税和增加有效支出可支持需求；政策取向不能仅由发债量决定。",
    "conditions": [
      "需结合税种、传导、用途及经济条件，不把衰退与通缩等同。"
    ]
  }
};
const M={
  "fiscal-policy-core-memory": {
    "text": "预算税支认财政，自动机制与主动措施分开；收入融资分口径，购买转移看交易；税支用途看取向，不凭发债量定性。",
    "coverage": "财政工具、预算融资、交易分类和政策适用条件。",
    "conditions": [
      "广义筹资清单不是现行一般公共预算本级收入分类。",
      "需求不足与过强是分析情境，不是衰退通缩或过热通胀的等价定义。"
    ],
    "phrasePatches": {
      "fiscal-memory-income": {
        "phrase": "收入融资分口径",
        "meaning": "税收非税、债务融资及资金调入等须按相应预算口径分开。"
      },
      "fiscal-memory-direction": {
        "phrase": "税支用途看取向",
        "meaning": "减税增支可支持需求，但实际方向需结合传导与资金用途，不能只看发债量。"
      }
    }
  }
};
const S={
  "fiscal-income-components": {
    "1": "债务融资通常需依约偿还，不能等同税收收入。",
    "2": "筹集资金需要区分预算收入、融资和资金调入等口径。"
  },
  "fiscal-policy-direction": {
    "0": "题设需求不足且有效传导时，增税减支通常不是支持需求的基础方向。",
    "2": "发债量也受用途和到期接续等影响，不能单独判断取向。"
  },
  "fiscal-policy-full": {
    "1": "中央银行货币工具不等于政府预算税收，无直接交换不能据此判为购买。",
    "2": "收费不是税收，有直接对价的购买也不是现金转移；发债量不是政策定性的充分条件。"
  }
};
const IDS={
  "questions": [
    "policy-fiscal",
    "fiscal-definition",
    "fiscal-income-components",
    "fiscal-spending-types",
    "fiscal-policy-direction",
    "fiscal-policy-full",
    "policy-monetary",
    "policy-bond-purchase"
  ],
  "targets": [
    "cs-target-fiscal-definition",
    "cs-target-fiscal-income",
    "cs-target-fiscal-spending",
    "cs-target-fiscal-direction",
    "q0b-target-policy-fiscal",
    "q0b-target-policy-monetary",
    "q0b-target-policy-bond-purchase"
  ],
  "mnemonics": [
    "fiscal-monetary-memory",
    "fiscal-policy-core-memory"
  ]
};
const AFFECTED={
  "questions": [
    "policy-fiscal",
    "fiscal-definition",
    "fiscal-income-components",
    "fiscal-spending-types",
    "fiscal-policy-direction",
    "fiscal-policy-full"
  ],
  "targets": [
    "cs-target-fiscal-definition",
    "cs-target-fiscal-income",
    "cs-target-fiscal-spending",
    "cs-target-fiscal-direction",
    "q0b-target-policy-fiscal",
    "q0b-target-policy-monetary",
    "q0b-target-policy-bond-purchase"
  ],
  "mnemonics": [
    "fiscal-monetary-memory",
    "fiscal-policy-core-memory"
  ]
};
module.exports=function(pack){const prior=pack.version;const migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing reviewed fiscal item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.3";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"6591ba65","toPackVersion":"2026-10-24.3","changedQuestionIds":["policy-fiscal","fiscal-definition","fiscal-income-components","fiscal-spending-types","fiscal-policy-direction","fiscal-policy-full"],"changedMnemonicIds":["fiscal-monetary-memory","fiscal-policy-core-memory"],"reason":"财政来源及关联内容经复核；直接受影响会话重建，间接依赖且语义未变的单题及无关进度按既有协议保留。"},{"fromVersion":"d9a515ff","toPackVersion":"2026-10-24.3","changedQuestionIds":["policy-fiscal","fiscal-definition","fiscal-income-components","fiscal-spending-types","fiscal-policy-direction","fiscal-policy-full"],"changedMnemonicIds":["fiscal-monetary-memory","fiscal-policy-core-memory"],"reason":"财政来源及关联内容经复核；直接受影响会话重建，间接依赖且语义未变的单题及无关进度按既有协议保留。"}]);return pack;};
module.exports.reviewedIds=IDS;
module.exports.directIds=AFFECTED;
module.exports.semanticChanges={questions:Object.keys(Q),targets:Object.keys(T),mnemonics:Object.keys(M)};
