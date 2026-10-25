const Q={
  "fixed-rate-system": {
    "prompt": "货币当局承诺把本币与某外币或货币篮子维持既定平价或规定区间，并为此采取措施。这主要体现哪类安排？",
    "options": [
      "固定或盯住汇率安排",
      "仅以市场供求为主且不承诺维持平价的浮动汇率安排",
      "只调节政府税收支出的财政制度"
    ],
    "explanation": "固定或盯住安排的核心是维持既定平价或区间的机制，不是每一笔报价永远不变，也不是只看政府是否公布某个价格。",
    "boundary": "按制度机制和相应时点判断，不仅凭单次干预或中间价公告分类。"
  },
  "exchange-rate-system-full": {
    "options": [
      "汇率反映两币兑换价格；固定或盯住安排维持既定平价或区间；浮动以市场供求为主但可管理",
      "汇率是银行借款利率；任何干预都足以证明实施固定汇率制",
      "固定汇率表示任何时点和交易的价格永久不变，浮动则不能采取任何管理"
    ],
    "explanation": "区分汇率概念和汇率形成维持机制，固定不等于每笔报价不变，浮动也不等于完全没有管理。"
  }
};
const T={
  "cs-target-fixed-rate-system": {
    "statement": "依据维持既定平价或区间的机制识别固定或盯住安排。",
    "conclusion": "固定或盯住安排通常由货币当局维持相对特定外币或篮子的平价或区间。",
    "conditions": [
      "不能只根据一次政府报价、干预或日内价格不变推断制度。"
    ]
  }
};
const M={
  "exchange-rate-system-memory": {
    "text": "汇率是两币价格；固定盯住看维持平价或区间，浮动以市场供求为主也可管理；我国为市场供求基础、参考一篮子货币的有管理浮动。",
    "conditions": [
      "依机制、时点和分类口径判断，不凭一次报价或干预定性。"
    ],
    "phrasePatches": {
      "rate-system-memory-fixed": {
        "phrase": "固定盯住维持平价或区间",
        "meaning": "承诺维持机制是关键，不是每笔报价永远不变或政府公布就算固定。"
      }
    }
  },
  "exchange-rate-effects-memory": {
    "phrasePatches": {
      "rate-effects-memory-direction": {
        "meaning": "固定同一报价方向判断本币相对升贬，不能脱离本外币观察口径。"
      },
      "rate-effects-memory-import": {
        "meaning": "外币合同价不变且未对冲时，本币贬值通常提高本币支付成本，数量变化另看弹性和时滞。"
      },
      "rate-effects-memory-export": {
        "meaning": "本币价格稳定时，本币贬值可能降低折算外币价格，不保证出口数量或差额立即改善。"
      },
      "rate-effects-memory-capital": {
        "meaning": "资本流向还受利差、前景、预期、风险和管制影响，不能由汇率单独决定。"
      }
    }
  }
};
const S={
  "fixed-rate-system": {
    "1": "该项未承诺维持既定平价或区间，不符合题设固定盯住机制。",
    "2": "财政税收支出不是汇率形成维持机制。"
  },
  "exchange-rate-system-full": {
    "1": "汇率是两币价格，单次干预不足以识别制度。",
    "2": "固定不排除规定幅度波动，浮动也可管理。"
  }
};
const AFFECTED={"questions":["fx-direct","fx-indirect","fx-context","fx-direct-scenario","fx-indirect-scenario","trade-composition","trade-surplus","trade-deficit","international-trade-full","exchange-rate-meaning","fixed-rate-system","floating-rate-system","managed-floating-system","exchange-rate-system-full","rate-direction-pair","rate-import-effect","rate-export-effect","rate-capital-effect","rate-effects-full"],"mnemonics":["fx-memory","international-trade-core-memory","exchange-rate-system-memory","exchange-rate-effects-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing international item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.6";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"ac551faf","toPackVersion":"2026-10-24.6","changedQuestionIds":["fx-direct","fx-indirect","fx-context","fx-direct-scenario","fx-indirect-scenario","trade-composition","trade-surplus","trade-deficit","international-trade-full","exchange-rate-meaning","fixed-rate-system","floating-rate-system","managed-floating-system","exchange-rate-system-full","rate-direction-pair","rate-import-effect","rate-export-effect","rate-capital-effect","rate-effects-full"],"changedMnemonicIds":["fx-memory","international-trade-core-memory","exchange-rate-system-memory","exchange-rate-effects-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"a022235","toPackVersion":"2026-10-24.6","changedQuestionIds":["fx-direct","fx-indirect","fx-context","fx-direct-scenario","fx-indirect-scenario","trade-composition","trade-surplus","trade-deficit","international-trade-full","exchange-rate-meaning","fixed-rate-system","floating-rate-system","managed-floating-system","exchange-rate-system-full","rate-direction-pair","rate-import-effect","rate-export-effect","rate-capital-effect","rate-effects-full"],"changedMnemonicIds":["fx-memory","international-trade-core-memory","exchange-rate-system-memory","exchange-rate-effects-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["fx-direct","fx-indirect","fx-context","fx-direct-scenario","fx-indirect-scenario","trade-composition","trade-surplus","trade-deficit","international-trade-full","exchange-rate-meaning","fixed-rate-system","floating-rate-system","managed-floating-system","exchange-rate-system-full","rate-direction-pair","rate-import-effect","rate-export-effect","rate-capital-effect","rate-effects-full"],"targets":["cs-target-fx-direct-base","cs-target-fx-indirect-base","cs-target-fx-observer-context","cs-target-trade-composition","cs-target-trade-surplus","cs-target-trade-deficit","cs-target-exchange-rate-meaning","cs-target-fixed-rate-system","cs-target-floating-rate-system","cs-target-managed-floating","cs-target-rate-direction-pair","cs-target-rate-import-effect","cs-target-rate-export-effect","cs-target-rate-capital-effect"],"mnemonics":["fx-memory","international-trade-core-memory","exchange-rate-system-memory","exchange-rate-effects-memory"]};
module.exports.directIds={"questions":["fx-direct","fx-indirect","fx-context","fx-direct-scenario","fx-indirect-scenario","trade-composition","trade-surplus","trade-deficit","international-trade-full","exchange-rate-meaning","fixed-rate-system","floating-rate-system","managed-floating-system","exchange-rate-system-full","rate-direction-pair","rate-import-effect","rate-export-effect","rate-capital-effect","rate-effects-full"],"targets":["cs-target-fx-direct-base","cs-target-fx-indirect-base","cs-target-fx-observer-context","cs-target-trade-composition","cs-target-trade-surplus","cs-target-trade-deficit","cs-target-exchange-rate-meaning","cs-target-fixed-rate-system","cs-target-floating-rate-system","cs-target-managed-floating","cs-target-rate-direction-pair","cs-target-rate-import-effect","cs-target-rate-export-effect","cs-target-rate-capital-effect"],"mnemonics":["fx-memory","international-trade-core-memory","exchange-rate-system-memory","exchange-rate-effects-memory"]};
module.exports.semanticChanges={"questions":["fixed-rate-system","exchange-rate-system-full"],"targets":["cs-target-fixed-rate-system"],"mnemonics":["exchange-rate-system-memory","exchange-rate-effects-memory"]};
