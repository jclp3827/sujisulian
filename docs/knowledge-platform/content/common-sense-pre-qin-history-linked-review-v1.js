const Q={
  "xia-erlitou": {
    "prompt": "河南偃师的哪一考古文化遗址，为探索夏文化提供了重要实物材料？",
    "explanation": "二里头遗址为探索夏文化提供重要材料；考古文化与史籍王朝的对应仍需综合研究。",
    "boundary": "不能仅凭地域和年代相近，就把全部遗存直接等同于史籍夏王朝。"
  },
  "shang-pangeng-yin": {
    "prompt": "商朝哪一迁都事件与今天河南安阳一带的殷相联系？",
    "explanation": "盘庚把都城迁到殷，商朝此后进入较稳定的发展阶段。",
    "boundary": "迁都后的发展涉及多种因素，不把稳定简单归结为迁都一项。"
  },
  "shang-muye": {
    "prompt": "周武王伐商、商朝灭亡所对应的著名战役是哪一场？",
    "explanation": "牧野之战中周武王击败商军，商朝灭亡，周朝建立。",
    "boundary": "本题识别战役与朝代更替，不以传说细节作为判断条件。"
  },
  "western-zhou-founding": {
    "boundary": "镐京是西周都城；洛邑也曾是西周经营东方的重要据点，不能把它只与东周相联系。"
  },
  "western-zhou-hezun": {
    "explanation": "何尊器内铭文中有“宅兹中国”的记载。",
    "boundary": "铭文中的“中国”有其当时的地域和政治含义，不等同于现代国家疆域。"
  },
  "transition-shangyang": {
    "options": [
      "在秦推行县制，并奖励军功和耕织",
      "建立科举并废除军功",
      "废除耕织并禁止县制"
    ],
    "explanation": "商鞅变法在秦推行县制、奖励军功和耕织，并推动土地制度等改革。",
    "boundary": "推行县制不等于商鞅首次发明县这一地方组织。"
  },
  "transition-divider": {
    "explanation": "三家分晋与田氏代齐反映春秋战国之际政治格局的变化。",
    "boundary": "它们是不同国家发生的政治变化，不是同一事件，也不能合并成同一年。"
  },
  "transition-full": {
    "options": [
      "平王东迁开启东周；三家分晋和田氏代齐反映政治格局变化；战国七雄含齐楚燕韩赵魏秦；商鞅在秦推行县制",
      "平王定都镐京开启西周；战国七雄不含秦；商鞅推行科举",
      "三家分晋发生于夏朝；商鞅废除耕织"
    ],
    "explanation": "正确项分别对应东周开端、春秋战国之际的政治变化、七雄名单和秦国变法。",
    "boundary": "三家分晋与田氏代齐不是同年同一事件，商鞅也不是县制的最初创立者。"
  },
  "pre-qin-zongfa": {
    "objective": "理解宗法血缘与相对层级",
    "prompt": "关于西周宗法制，下列哪项表述正确？",
    "options": [
      "以血缘关系为纽带，以嫡长子继承制为核心；大宗、小宗是相对层级",
      "所有嫡子都属于同一大宗，所有庶子都属于同一小宗",
      "宗法等级只按土地多少划分，与血缘继承无关"
    ],
    "explanation": "宗法制以血缘维系等级秩序，以嫡长子继承制为核心；大宗和小宗随所处层级而定。",
    "boundary": "同一支系对下可以是大宗，对上又是小宗，不能把全体嫡子、庶子各归成一个固定集团。"
  },
  "pre-qin-institutions-full": {
    "options": [
      "西周的重要制度包括分封、宗法、井田和礼乐；宗法以血缘关系和嫡长子继承为核心；鲁国按亩征税的改革称初税亩",
      "西周主要制度是科举和行省；宗法由幼子继承；初税亩属于秦汉",
      "初税亩就是禅让制"
    ],
    "explanation": "正确项区分了西周制度、宗法继承原则与鲁国田赋改革。",
    "boundary": "大宗、小宗是相对层级，不直接等于全体嫡子和全体庶子。"
  },
  "pre-qin-economy-full": {
    "options": [
      "春秋战国推广铁农具和牛耕；后母戊鼎出土于安阳；芍陂联系孙叔敖，郑国渠联系郑国，都江堰联系李冰",
      "农业使用蒸汽机；后母戊鼎是水利工程；李冰修芍陂",
      "铁农具、青铜器和水利工程都与先秦无关"
    ],
    "explanation": "铁农具和牛耕属于农业生产，后母戊鼎属于青铜手工业，芍陂、郑国渠和都江堰属于水利工程。",
    "boundary": "不以未限定的世界排名或不分季节的都江堰固定分水比例命题。"
  }
};
const T={
  "cs-target-xia-erlitou": {
    "statement": "能识别二里头遗址与夏文化研究的关系。",
    "conclusion": "二里头遗址为探索夏文化提供重要实物材料，不能仅凭时空相近直接完成王朝对应。"
  },
  "cs-target-shang-pangeng": {
    "conclusion": "盘庚迁都于殷，商朝此后进入较稳定的发展阶段；迁都不是解释发展的单一因素。"
  },
  "cs-target-shang-muye": {
    "conclusion": "牧野之战与周武王伐商、商朝灭亡相联系。"
  },
  "cs-target-hezun-zhongguo": {
    "conclusion": "何尊器内铭文有“宅兹中国”；其中“中国”须在当时历史语境下理解。"
  },
  "cs-target-shangyang-reform": {
    "conclusion": "商鞅在秦推行县制、奖励军功和耕织，推动土地制度改革；并非首次创立县。"
  },
  "cs-target-transition-divider": {
    "conclusion": "三家分晋、田氏代齐反映春秋战国之际的政治格局变化，是不同事件，不能合为同一年。"
  },
  "cs-target-pre-qin-zongfa": {
    "statement": "能理解宗法制的血缘纽带、嫡长子继承核心和相对层级。",
    "conclusion": "宗法制以血缘关系为纽带，以嫡长子继承制为核心；大宗、小宗是相对层级，不能把全体嫡子与庶子各看作一个固定集团。",
    "conditions": [
      "置于西周宗法等级与继承语境。"
    ],
    "excludes": [
      "不把相对宗族层级直接等同于全体嫡庶身份。"
    ]
  }
};
const M={
  "xia-dynasty-memory": {
    "phrasePatches": {
      "cs-target-xia-erlitou-memory": {
        "meaning": "二里头遗址是探索夏文化的重要实物材料，考古文化与史籍王朝的对应仍需研究。"
      }
    }
  },
  "shang-dynasty-memory": {
    "text": "商汤建商；盘庚迁殷；牧野武王伐纣商亡。",
    "phrasePatches": {
      "cs-target-shang-pangeng-memory": {
        "phrase": "盘庚迁殷",
        "meaning": "盘庚把都城迁到殷，商朝此后进入较稳定的发展阶段。"
      },
      "cs-target-shang-muye-memory": {
        "meaning": "牧野之战与周武王伐商、商朝灭亡相联系，不依赖传说细节判断。"
      }
    }
  },
  "western-zhou-memory": {
    "phrasePatches": {
      "cs-target-hezun-zhongguo-memory": {
        "meaning": "何尊器内铭文有“宅兹中国”，其中“中国”按当时历史语境理解。"
      }
    }
  },
  "spring-warring-memory": {
    "text": "平王洛邑启东周；齐楚燕韩赵魏秦；商鞅在秦推县、奖军功耕织；三家分晋与田氏代齐是不同政治变化。",
    "phrasePatches": {
      "cs-target-shangyang-reform-memory": {
        "phrase": "商鞅在秦推县、奖军功耕织",
        "meaning": "商鞅在秦推行县制、奖励军功和耕织，推动土地制度改革；并非首次创立县。"
      },
      "cs-target-transition-divider-memory": {
        "meaning": "三家分晋与田氏代齐反映春秋战国之际的政治格局变化，是不同国家的事件，不能合为同一年。"
      }
    }
  },
  "pre-qin-institutions-memory": {
    "text": "西周分封宗法井田礼乐；宗法血缘分层，以嫡长子继承为核心；鲁国按亩称初税亩。",
    "phrasePatches": {
      "cs-target-pre-qin-zongfa-memory": {
        "phrase": "宗法血缘分层，以嫡长子继承为核心",
        "meaning": "宗法制以血缘为纽带，以嫡长子继承为核心；大宗和小宗是相对层级，不能直接等同于所有嫡子与所有庶子。"
      }
    }
  }
};
const S={
  "pre-qin-zongfa": {
    "1": "把相对宗族层级误写为全体嫡子、庶子的固定分组。",
    "2": "宗法以血缘关系为纽带，不只按土地多少划分。"
  }
};
const AFFECTED={"questions":["xia-qi-hereditary","xia-erlitou","xia-mingtiao","xia-dynasty-full","shang-tang-founded","shang-pangeng-yin","shang-muye","shang-dynasty-full","western-zhou-founding","western-zhou-hezun","western-zhou-fall","western-zhou-full","transition-pingwang-east","transition-warring-seven","transition-shangyang","transition-divider","transition-full","pre-qin-four-systems","pre-qin-zongfa","pre-qin-tax-mu","pre-qin-institutions-full","pre-qin-iron-ox","pre-qin-houmuwu-ding","pre-qin-water-pairs","pre-qin-dujiangyan","pre-qin-economy-full"],"mnemonics":["xia-dynasty-memory","shang-dynasty-memory","western-zhou-memory","spring-warring-memory","pre-qin-institutions-memory","pre-qin-economy-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing pre-qin-history item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.10";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"2544510a","toPackVersion":"2026-10-24.10","changedQuestionIds":["xia-qi-hereditary","xia-erlitou","xia-mingtiao","xia-dynasty-full","shang-tang-founded","shang-pangeng-yin","shang-muye","shang-dynasty-full","western-zhou-founding","western-zhou-hezun","western-zhou-fall","western-zhou-full","transition-pingwang-east","transition-warring-seven","transition-shangyang","transition-divider","transition-full","pre-qin-four-systems","pre-qin-zongfa","pre-qin-tax-mu","pre-qin-institutions-full","pre-qin-iron-ox","pre-qin-houmuwu-ding","pre-qin-water-pairs","pre-qin-dujiangyan","pre-qin-economy-full"],"changedMnemonicIds":["xia-dynasty-memory","shang-dynasty-memory","western-zhou-memory","spring-warring-memory","pre-qin-institutions-memory","pre-qin-economy-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"4bd92f11","toPackVersion":"2026-10-24.10","changedQuestionIds":["xia-qi-hereditary","xia-erlitou","xia-mingtiao","xia-dynasty-full","shang-tang-founded","shang-pangeng-yin","shang-muye","shang-dynasty-full","western-zhou-founding","western-zhou-hezun","western-zhou-fall","western-zhou-full","transition-pingwang-east","transition-warring-seven","transition-shangyang","transition-divider","transition-full","pre-qin-four-systems","pre-qin-zongfa","pre-qin-tax-mu","pre-qin-institutions-full","pre-qin-iron-ox","pre-qin-houmuwu-ding","pre-qin-water-pairs","pre-qin-dujiangyan","pre-qin-economy-full"],"changedMnemonicIds":["xia-dynasty-memory","shang-dynasty-memory","western-zhou-memory","spring-warring-memory","pre-qin-institutions-memory","pre-qin-economy-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["xia-qi-hereditary","xia-erlitou","xia-mingtiao","xia-dynasty-full","shang-tang-founded","shang-pangeng-yin","shang-muye","shang-dynasty-full","western-zhou-founding","western-zhou-hezun","western-zhou-fall","western-zhou-full","transition-pingwang-east","transition-warring-seven","transition-shangyang","transition-divider","transition-full","pre-qin-four-systems","pre-qin-zongfa","pre-qin-tax-mu","pre-qin-institutions-full","pre-qin-iron-ox","pre-qin-houmuwu-ding","pre-qin-water-pairs","pre-qin-dujiangyan","pre-qin-economy-full"],"targets":["cs-target-xia-qi-hereditary","cs-target-xia-erlitou","cs-target-xia-mingtiao","cs-target-shang-tang","cs-target-shang-pangeng","cs-target-shang-muye","cs-target-western-zhou-founding","cs-target-hezun-zhongguo","cs-target-western-zhou-fall","cs-target-pingwang-east","cs-target-warring-seven","cs-target-shangyang-reform","cs-target-transition-divider","cs-target-pre-qin-four-systems","cs-target-pre-qin-zongfa","cs-target-pre-qin-tax-mu","cs-target-pre-qin-iron-ox","cs-target-houmuwu-ding","cs-target-pre-qin-water-pairs","cs-target-dujiangyan-libing"],"mnemonics":["xia-dynasty-memory","shang-dynasty-memory","western-zhou-memory","spring-warring-memory","pre-qin-institutions-memory","pre-qin-economy-memory"]};
module.exports.directIds={"questions":["xia-qi-hereditary","xia-erlitou","xia-mingtiao","xia-dynasty-full","shang-tang-founded","shang-pangeng-yin","shang-muye","shang-dynasty-full","western-zhou-founding","western-zhou-hezun","western-zhou-fall","western-zhou-full","transition-pingwang-east","transition-warring-seven","transition-shangyang","transition-divider","transition-full","pre-qin-four-systems","pre-qin-zongfa","pre-qin-tax-mu","pre-qin-institutions-full","pre-qin-iron-ox","pre-qin-houmuwu-ding","pre-qin-water-pairs","pre-qin-dujiangyan","pre-qin-economy-full"],"targets":["cs-target-xia-qi-hereditary","cs-target-xia-erlitou","cs-target-xia-mingtiao","cs-target-shang-tang","cs-target-shang-pangeng","cs-target-shang-muye","cs-target-western-zhou-founding","cs-target-hezun-zhongguo","cs-target-western-zhou-fall","cs-target-pingwang-east","cs-target-warring-seven","cs-target-shangyang-reform","cs-target-transition-divider","cs-target-pre-qin-four-systems","cs-target-pre-qin-zongfa","cs-target-pre-qin-tax-mu","cs-target-pre-qin-iron-ox","cs-target-houmuwu-ding","cs-target-pre-qin-water-pairs","cs-target-dujiangyan-libing"],"mnemonics":["xia-dynasty-memory","shang-dynasty-memory","western-zhou-memory","spring-warring-memory","pre-qin-institutions-memory","pre-qin-economy-memory"]};
module.exports.semanticChanges={"questions":["xia-erlitou","shang-pangeng-yin","shang-muye","western-zhou-founding","western-zhou-hezun","transition-shangyang","transition-divider","transition-full","pre-qin-zongfa","pre-qin-institutions-full","pre-qin-economy-full"],"targets":["cs-target-xia-erlitou","cs-target-shang-pangeng","cs-target-shang-muye","cs-target-hezun-zhongguo","cs-target-shangyang-reform","cs-target-transition-divider","cs-target-pre-qin-zongfa"],"mnemonics":["xia-dynasty-memory","shang-dynasty-memory","western-zhou-memory","spring-warring-memory","pre-qin-institutions-memory"]};
