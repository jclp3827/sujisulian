const Q={
  "effect-scale": {
    "prompt": "企业在各项投入都可调整的长期安排中扩大生产规模，专业分工等使一定范围内的长期平均成本下降。这体现什么？",
    "options": [
      "棘轮效应，消费水平向下调整存在黏性",
      "边际产出变化，固定其他投入时观察新增产出",
      "规模经济，长期规模扩大使平均成本在一定范围下降"
    ],
    "explanation": "规模经济观察长期各项投入可调整时的平均成本变化，不能只以短期固定设备下多分摊成本替代，也不保证规模无限扩大都有效。"
  },
  "effect-substitution": {
    "prompt": "咖啡相对茶变贵。在按分析方法补偿购买力或保持原满足等条件下，消费者减少咖啡并转向茶，这部分影响称为？",
    "explanation": "替代效应分离相对价格变化的作用，需保留补偿购买力或原满足等分析条件；未作分离的全部需求变化还可能包含收入效应。"
  },
  "economic-effects-price-full": {
    "options": [
      "在限定条件下，替代看相对价格，收入效应看购买力，挤出可看政府融资经利率影响私人投资",
      "替代看政府融资与投资，收入效应看强弱差距扩大，挤出看消费难下调",
      "替代看平均成本，收入效应看新增产出，挤出看既有优势累积"
    ],
    "explanation": "三种机制需要分清对象和条件：替代需分离购买力作用，收入效应依商品性质，挤出程度依资金供给和政策配合等。"
  }
};
const T={
  "cs-target-effect-scale": {
    "conclusion": "规模经济观察长期各项投入可调整时，规模扩大使平均成本在一定范围下降。",
    "conditions": [
      "不等同短期仅分摊固定成本，不保证无限扩张均有利。"
    ]
  },
  "cs-target-effect-marginal": {
    "conclusion": "固定技术及部分投入等条件时，可变投入继续增加，新增产出在一定阶段后可能递减。",
    "conditions": [
      "边际减少不等于总量已经下降，须看新增量是否仍为正。"
    ]
  },
  "cs-target-effect-substitution": {
    "conditions": [
      "分离购买力变化或保持原满足等条件，不能把全部价格效应归为替代。"
    ]
  },
  "cs-target-effect-income": {
    "conditions": [
      "正常品与低档品的收入效应方向可能不同，低档不等于质量低劣。"
    ]
  }
};
const M={
  "economic-effects-behavior-memory": {
    "conditions": [
      "新增量、平均量与总量分开；规模经济保留长期各投入可调整条件。"
    ],
    "phrasePatches": {
      "effect-memory-marginal": {
        "meaning": "固定技术和部分投入时观察新增产出；边际递减不等于总产出下降。"
      },
      "effect-memory-scale": {
        "meaning": "长期各项投入可调整时，规模扩大使平均成本在一定范围下降。"
      }
    }
  },
  "economic-effects-price-memory": {
    "text": "相对价格作用与购买力作用分开；政府借款经利率挤出私人投资是有条件的机制，不是全部结果。",
    "conditions": [
      "替代保留补偿条件，收入效应区分商品性质，挤出依资金与政策环境。"
    ],
    "phrasePatches": {
      "effect-memory-substitution": {
        "meaning": "按分析方法补偿购买力等后，分离相对价格变化引起的选择变化。"
      },
      "effect-memory-crowding": {
        "meaning": "其他资金条件不变时，政府融资可能经利率抑制私人投资，程度依政策配合。"
      }
    }
  },
  "economic-terms-choice-memory": {
    "conditions": [
      "纳什给定他人策略；边际与总量区分；机会取最佳可行替代，沉没看不可回收。"
    ],
    "phrasePatches": {
      "term-memory-nash": {
        "meaning": "给定其他参与者策略后，单独改变自身策略不能增加收益，不保证总收益最大。"
      }
    }
  },
  "economic-terms-curve-memory": {
    "conditions": [
      "拉弗峰值依税种制度和行为变化；流动偏好不等于陷阱；菲利普斯短期关系可因预期供给冲击移动。"
    ],
    "phrasePatches": {
      "term-memory-phillips": {
        "meaning": "预期等给定时短期可能反向，不能当作长期稳定交换或固定因果保证。"
      }
    }
  }
};
const S={
  "effect-scale": {
    "0": "消费黏性不是长期平均成本分析。",
    "1": "固定投入下新增产出与长期规模成本不同。"
  },
  "effect-substitution": {
    "0": "收入效应是购买力变化部分，题设已作补偿分离。",
    "2": "政府融资与私人投资不是消费者相对价格机制。"
  },
  "economic-effects-price-full": {
    "1": "三种机制的对象被交叉错配。",
    "2": "平均成本、新增产出和累积优势不对应题设机制。"
  }
};
const AFFECTED={"questions":["effect-ratchet","effect-marginal","effect-scale","economic-effects-behavior-full","effect-substitution","effect-income","effect-crowding-out","economic-effects-price-full","term-nash","term-marginal-utility","term-opportunity-cost","term-sunk-cost","economic-terms-choice-full","term-laffer","term-liquidity","term-phillips","economic-terms-curve-full"],"mnemonics":["economic-effects-behavior-memory","economic-effects-price-memory","economic-terms-choice-memory","economic-terms-curve-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing economic-models item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.7";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"1b7a3036","toPackVersion":"2026-10-24.7","changedQuestionIds":["effect-ratchet","effect-marginal","effect-scale","economic-effects-behavior-full","effect-substitution","effect-income","effect-crowding-out","economic-effects-price-full","term-nash","term-marginal-utility","term-opportunity-cost","term-sunk-cost","economic-terms-choice-full","term-laffer","term-liquidity","term-phillips","economic-terms-curve-full"],"changedMnemonicIds":["economic-effects-behavior-memory","economic-effects-price-memory","economic-terms-choice-memory","economic-terms-curve-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"1a9eac7","toPackVersion":"2026-10-24.7","changedQuestionIds":["effect-ratchet","effect-marginal","effect-scale","economic-effects-behavior-full","effect-substitution","effect-income","effect-crowding-out","economic-effects-price-full","term-nash","term-marginal-utility","term-opportunity-cost","term-sunk-cost","economic-terms-choice-full","term-laffer","term-liquidity","term-phillips","economic-terms-curve-full"],"changedMnemonicIds":["economic-effects-behavior-memory","economic-effects-price-memory","economic-terms-choice-memory","economic-terms-curve-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["effect-ratchet","effect-matthew","effect-marginal","effect-scale","economic-effects-behavior-full","effect-substitution","effect-income","effect-crowding-out","economic-effects-price-full","term-nash","term-marginal-utility","term-opportunity-cost","term-sunk-cost","economic-terms-choice-full","term-black-swan","term-gray-rhino","term-laffer","term-liquidity","term-phillips","economic-terms-risk-full","economic-terms-curve-full"],"targets":["cs-target-effect-ratchet","cs-target-effect-matthew","cs-target-effect-marginal","cs-target-effect-scale","cs-target-effect-substitution","cs-target-effect-income","cs-target-effect-crowding","cs-target-term-nash","cs-target-term-marginal-utility","cs-target-term-opportunity-cost","cs-target-term-sunk-cost","cs-target-term-black-swan","cs-target-term-gray-rhino","cs-target-term-laffer","cs-target-term-liquidity","cs-target-term-phillips"],"mnemonics":["economic-effects-behavior-memory","economic-effects-price-memory","economic-terms-choice-memory","economic-terms-risk-memory","economic-terms-curve-memory"]};
module.exports.directIds={"questions":["effect-ratchet","effect-marginal","effect-scale","economic-effects-behavior-full","effect-substitution","effect-income","effect-crowding-out","economic-effects-price-full","term-nash","term-marginal-utility","term-opportunity-cost","term-sunk-cost","economic-terms-choice-full","term-laffer","term-liquidity","term-phillips","economic-terms-curve-full"],"targets":["cs-target-effect-ratchet","cs-target-effect-marginal","cs-target-effect-scale","cs-target-effect-substitution","cs-target-effect-income","cs-target-effect-crowding","cs-target-term-nash","cs-target-term-marginal-utility","cs-target-term-opportunity-cost","cs-target-term-sunk-cost","cs-target-term-laffer","cs-target-term-liquidity","cs-target-term-phillips"],"mnemonics":["economic-effects-behavior-memory","economic-effects-price-memory","economic-terms-choice-memory","economic-terms-curve-memory"]};
module.exports.semanticChanges={"questions":["effect-scale","effect-substitution","economic-effects-price-full"],"targets":["cs-target-effect-scale","cs-target-effect-marginal","cs-target-effect-substitution","cs-target-effect-income"],"mnemonics":["economic-effects-behavior-memory","economic-effects-price-memory","economic-terms-choice-memory","economic-terms-curve-memory"]};
