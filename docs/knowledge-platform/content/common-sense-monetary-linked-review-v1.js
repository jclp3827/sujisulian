const Q={
  "monetary-definition": {
    "objective": "由中央银行与流动性利率工具识别货币政策",
    "prompt": "中央银行运用工具影响流动性、货币信贷和利率等金融条件，以影响经济运行。这属于什么政策？",
    "options": [
      "政府运用预算税收的财政政策",
      "中央银行实施的货币政策",
      "政府调整产业结构的产业政策"
    ],
    "explanation": "货币政策由中央银行运用相关工具影响流动性、利率和信贷条件，不能只把数量调节当作全部框架。",
    "boundary": "识别主体与工具；目标、传导及效果要分别判断。"
  },
  "monetary-expansion": {
    "objective": "在其他条件不变时判断支持流动性的工具方向",
    "prompt": "在需求不足、其他条件不变且没有反向对冲的基础分析中，哪组措施通常具有支持流动性或降低融资成本的方向？",
    "options": [
      "提高相关准备金比例和央行融资利率，并现券卖出债券",
      "下调相关准备金比例和央行融资利率，并现券买入债券",
      "只因央行买入债券，就保证所有贷款利率立即等幅下降"
    ],
    "explanation": "降准、降低相关央行融资利率、现券买入债券分别可支持流动性或降低融资成本。这是限定条件下的方向比较，不要求各工具每次同时调整，也不保证固定经济效果。",
    "boundary": "准备金率是比例而非借款利率，衰退与通缩不能等同。"
  },
  "monetary-contraction": {
    "objective": "在其他条件不变时判断收紧方向及政策条件",
    "prompt": "在总需求过强、其他条件不变且没有反向对冲的基础分析中，哪组措施通常具有收紧方向？",
    "options": [
      "提高相关准备金比例和央行融资利率，并现券卖出债券",
      "下调相关准备金比例和央行融资利率，并现券买入债券",
      "只要物价上涨，不论供给冲击或需求变化都同时上调各工具"
    ],
    "explanation": "在给定条件下，上调相关准备金比例或融资利率、现券卖出债券可具有收紧方向；这不意味着每次操作都要同步，通胀也不能一概归因于需求过热。",
    "boundary": "本题比较工具的局部机制，不据此认定某次现实整体政策立场。"
  },
  "monetary-full": {
    "prompt": "关于货币政策工具及其传导，下列说法正确的是？",
    "options": [
      "主体为央行；准备金率是比例约束；现券买入通常投放基础货币；工具不必每次同时同幅调整",
      "主体为政府财政部门；公开市场操作就是调整税收；所有通胀都源于需求过热",
      "主体为普通企业；准备金率就是客户贷款利率；只要降准就保证信贷按固定倍数增加"
    ],
    "explanation": "应区分央行主体、比例与资金价格、交易方向和传导条件。政策利率不等于全部市场或合同利率，工具组合与实际效果也不能由简化表格机械推出。",
    "boundary": "结合经济条件、交易类型与其他对冲，不把三率同向比较当作普遍强制规律。"
  }
};
const T={
  "cs-target-monetary-definition": {
    "statement": "识别央行通过流动性与利率等渠道实施货币政策。",
    "conclusion": "货币政策影响流动性、货币信贷和利率等金融条件，不能只按数量调节概括。",
    "conditions": [
      "我国目标是保持货币币值稳定，并以此促进经济增长；传导间接且有时滞。"
    ]
  },
  "cs-target-monetary-expansion": {
    "statement": "在给定条件下识别工具支持流动性或降低成本的方向。",
    "conclusion": "其他条件不变时，降准、降低相关央行融资利率、现券买入可分别支持流动性或融资条件。",
    "conditions": [
      "不要求每次同时同幅调整，不保证信贷或需求固定倍增。"
    ]
  },
  "cs-target-monetary-contraction": {
    "statement": "在给定条件下识别工具收紧方向。",
    "conclusion": "其他条件不变时，上调相关准备金比例或融资利率、现券卖出可具有收紧方向。",
    "conditions": [
      "通胀不一定源于需求过强，需区分局部工具机制与整体政策立场。"
    ]
  },
  "q0b-target-policy-monetary": {
    "statement": "由央行主体和流动性、利率等工具识别货币政策。",
    "conclusion": "央行影响流动性、货币信贷和利率等金融条件，属于货币政策分析。",
    "conditions": [
      "不能把政府预算税收混入货币工具，也不把数量渠道概括为全部框架。"
    ]
  }
};
const M={
  "fiscal-monetary-memory": {
    "text": "预算税支认财政，流动性与利率认央行；现券买入放、卖出收，须看条件和其他对冲。",
    "coverage": "财政与货币工具识别和现券买卖基础方向。",
    "conditions": [
      "央行主体与相关工具共同识别；现券方向不是所有操作或最终效果。"
    ],
    "phrasePatches": {
      "fiscal-monetary-memory-phrase-2": {
        "phrase": "币归央行：流动性与利率",
        "meaning": "央行影响流动性、利率和货币信贷条件，不仅是数量调节。"
      },
      "fiscal-monetary-memory-phrase-3": {
        "phrase": "现券买放、卖收",
        "meaning": "其他条件不变时，央行现券买入投放基础货币，卖出回笼；整体效果还要看其他操作。"
      }
    }
  },
  "monetary-policy-core-memory": {
    "title": "货币工具的机制与条件",
    "purpose": "保留旧数据身份并纠正工具无条件同向的表述。",
    "text": "央行影响流动性与利率；准备金是比例，融资利率是价格；现券买放卖收，工具配合看条件。",
    "method": "区分工具对象与交易方向，再结合经济情境及传导条件判断。",
    "coverage": "货币政策主体、数量价格工具及有条件的方向判断。",
    "conditions": [
      "准备金比例与不同资金价格不能混同。",
      "工具不要求每次同时同幅变化，局部方向不保证整体效果。"
    ],
    "phrasePatches": {
      "monetary-memory-definition": {
        "phrase": "央行影响流动性与利率",
        "meaning": "中央银行影响流动性、货币信贷和利率等金融条件。"
      },
      "monetary-memory-directions": {
        "phrase": "比例与价格分清，现券买放卖收，工具配合看条件",
        "meaning": "其他条件不变时比较工具方向，不要求所有工具每次同时同幅变化。"
      }
    }
  }
};
const S={
  "monetary-definition": {
    "0": "预算税收是财政工具，不是题设央行工具。",
    "2": "产业结构政策不等于央行对金融条件的调节。"
  },
  "monetary-expansion": {
    "0": "这些措施的基础机制通常具有收紧方向。",
    "2": "一次现券买入不能保证全部合同利率立即等幅下降。"
  },
  "monetary-contraction": {
    "1": "这些措施基础上支持流动性或降低融资成本。",
    "2": "通胀成因与经济情境不同，不能机械同步上调。"
  },
  "monetary-full": {
    "1": "财政工具与央行工具不同，通胀也并非都由需求过热引起。",
    "2": "准备金比例不是客户贷款利率，信贷变化还受需求与风险等约束。"
  }
};
const IDS={
  "questions": [
    "policy-monetary",
    "policy-bond-purchase",
    "monetary-definition",
    "monetary-tools",
    "monetary-expansion",
    "monetary-contraction",
    "monetary-full",
    "policy-fiscal"
  ],
  "targets": [
    "cs-target-monetary-definition",
    "cs-target-monetary-tools",
    "cs-target-monetary-expansion",
    "cs-target-monetary-contraction",
    "q0b-target-policy-fiscal",
    "q0b-target-policy-monetary",
    "q0b-target-policy-bond-purchase"
  ],
  "mnemonics": [
    "fiscal-monetary-memory",
    "monetary-policy-core-memory"
  ]
};
const AFFECTED={
  "questions": [
    "policy-monetary",
    "policy-bond-purchase",
    "monetary-definition",
    "monetary-tools",
    "monetary-expansion",
    "monetary-contraction",
    "monetary-full"
  ],
  "targets": [
    "cs-target-monetary-definition",
    "cs-target-monetary-tools",
    "cs-target-monetary-expansion",
    "cs-target-monetary-contraction",
    "q0b-target-policy-fiscal",
    "q0b-target-policy-monetary",
    "q0b-target-policy-bond-purchase"
  ],
  "mnemonics": [
    "fiscal-monetary-memory",
    "monetary-policy-core-memory"
  ]
};
module.exports=function(pack){const prior=pack.version;const migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing reviewed monetary item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.4";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"f61ac0f7","toPackVersion":"2026-10-24.4","changedQuestionIds":["policy-monetary","policy-bond-purchase","monetary-definition","monetary-tools","monetary-expansion","monetary-contraction","monetary-full"],"changedMnemonicIds":["fiscal-monetary-memory","monetary-policy-core-memory"],"reason":"货币来源整体复核；直接受影响会话重建，间接关联未改语义的单题记录和其他进度依旧协议保留。"},{"fromVersion":"ad1dea60","toPackVersion":"2026-10-24.4","changedQuestionIds":["policy-monetary","policy-bond-purchase","monetary-definition","monetary-tools","monetary-expansion","monetary-contraction","monetary-full"],"changedMnemonicIds":["fiscal-monetary-memory","monetary-policy-core-memory"],"reason":"货币来源整体复核；直接受影响会话重建，间接关联未改语义的单题记录和其他进度依旧协议保留。"}]);return pack;};
module.exports.reviewedIds=IDS;
module.exports.directIds=AFFECTED;
module.exports.semanticChanges={questions:Object.keys(Q),targets:Object.keys(T),mnemonics:Object.keys(M)};
