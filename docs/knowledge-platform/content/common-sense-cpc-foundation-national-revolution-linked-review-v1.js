const Q={
  "cpc-first-delegates": {
    "options": [
      "陈独秀、李大钊未出席；现行正式叙述的13名中国代表包含陈独秀派遣的包惠僧",
      "陈独秀、李大钊均作为正式代表出席",
      "毛泽东、董必武均未出席"
    ],
    "explanation": "现行正式党史记一大13名中国代表，包含包惠僧，陈独秀、李大钊本人未出席。",
    "boundary": "地方组织推举12人与另有委派1人的讨论须说明统计对象，不直接断言一大只有12名代表。"
  },
  "cpc-second-low-program": {
    "options": [
      "反帝反封建：打倒军阀、摆脱帝国主义压迫，实现民族独立并建立民主共和国",
      "直接以实现共产主义替代当时民主革命任务",
      "仅提出同盟会的平均地权纲领"
    ],
    "explanation": "最低纲领针对当时半殖民地半封建社会的民主革命任务，不是最低程度减少目标。",
    "boundary": "区别当时阶段任务与最高纲领的长远目标。"
  },
  "may30-strike-core": {
    "options": [
      "五卅运动引发反帝爱国高潮，1925年至1926年的省港大罢工与之相联系",
      "五卅运动以军阀为主力，省港大罢工仅持续一天",
      "省港大罢工早于五四运动且与五卅无关"
    ],
    "explanation": "五卅运动后形成广泛反帝抗争，广州、香港工人开展持续一年多的省港大罢工。",
    "boundary": "不以缺少比较范围的世界最长或影响最大代替地点、参与者和诉求。"
  },
  "cooperation-break-core": {
    "prompt": "第一次国共合作在1927年全面破裂的过程，哪项正确？",
    "options": [
      "四一二政变后蒋在南京建政，随后汪在武汉发动七一五政变，合作全面破裂",
      "国民党一大召开，合作正式形成",
      "中共三大召开，拒绝合作"
    ],
    "explanation": "南京建政与武汉七一五政变是不同地点、不同事件；不能把南京建政单独等同于合作全面破裂的全部过程。",
    "boundary": "区分1927年4月与7月的不同阶段。"
  }
};
const T={
  "cs-target-cpc-first-delegates": {
    "conclusion": "现行正式党史记中共一大13名中国代表，其中含受陈独秀派遣的包惠僧；陈独秀、李大钊本人未出席。"
  },
  "cs-target-cpc-second-low-program": {
    "conclusion": "最低纲领针对当时民主革命任务，要求打倒军阀、摆脱帝国主义压迫、实现民族独立并建立民主共和国。"
  },
  "cs-target-cpc-fourth": {
    "conclusion": "1925年上海中共四大提出无产阶级领导权和工农联盟问题，规定以支部为基本组织；三人以上等历史表述不直接替代全部现行成立程序。"
  },
  "cs-target-may30-strike": {
    "conclusion": "五卅运动引发反帝爱国高潮，广州和香港工人在1925年至1926年开展持续一年多的省港大罢工。"
  },
  "cs-target-cooperation-break": {
    "conclusion": "1927年四一二政变后蒋介石在南京建政，随后汪精卫在武汉发动七一五政变，第一次国共合作全面破裂。"
  }
};
const M={
  "cpc-first-memory": {
    "text": "早期组织、思想阶级与外助；二一上海转南湖，一大立党；陈李未到，十三含包；定名定性、目标任务与统一纪律。",
    "phrasePatches": {
      "cs-target-cpc-first-delegates-memory": {
        "phrase": "陈李未到，十三含包",
        "meaning": "现行正式党史记中共一大13名中国代表，其中含受陈独秀派遣的包惠僧；陈独秀、李大钊本人未出席。"
      }
    }
  },
  "cpc-second-memory": {
    "phrasePatches": {
      "cs-target-cpc-second-low-program-memory": {
        "meaning": "最低纲领针对当时民主革命任务，要求打倒军阀、摆脱帝国主义压迫、实现民族独立并建立民主共和国。"
      }
    }
  },
  "national-cooperation-memory": {
    "text": "三大个人合作保持独立；国民党一大合作形成；四大领导权工农联盟与支部建设；五卅反帝，省港工人长期罢工。",
    "phrasePatches": {
      "cs-target-cpc-fourth-memory": {
        "meaning": "1925年上海中共四大提出无产阶级领导权和工农联盟问题，规定以支部为基本组织；三人以上等历史表述不直接替代全部现行成立程序。"
      },
      "cs-target-may30-strike-memory": {
        "phrase": "五卅反帝，省港工人长期罢工",
        "meaning": "五卅运动引发反帝爱国高潮，广州和香港工人在1925年至1926年开展持续一年多的省港大罢工。"
      }
    }
  },
  "national-end-memory": {
    "text": "二六北伐吴孙张；四一二蒋在南京建政，七一五汪在武汉政变，合作全面破裂；二七武汉五大讨论土地革命。",
    "phrasePatches": {
      "cs-target-cooperation-break-memory": {
        "phrase": "南京建政、武汉政变，合作全面破裂",
        "meaning": "1927年四一二政变后蒋介石在南京建政，随后汪精卫在武汉发动七一五政变，第一次国共合作全面破裂。"
      }
    }
  }
};
const S={};
const AFFECTED={"questions":["cpc-foundations","cpc-first-time-place","cpc-first-delegates","cpc-first-content","cpc-first-full","cpc-second-time-place","cpc-second-high-program","cpc-second-low-program","cpc-second-significance","cpc-second-full","cpc-third-core","kmt-first-core","cpc-fourth-core","may30-strike-core","national-cooperation-full","northern-expedition-core","cooperation-coups","cooperation-break-core","cpc-fifth-core","national-end-full"],"mnemonics":["cpc-first-memory","cpc-second-memory","national-cooperation-memory","national-end-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing cpc-foundation-national-revolution item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.15";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"3c824485","toPackVersion":"2026-10-24.15","changedQuestionIds":["cpc-foundations","cpc-first-time-place","cpc-first-delegates","cpc-first-content","cpc-first-full","cpc-second-time-place","cpc-second-high-program","cpc-second-low-program","cpc-second-significance","cpc-second-full","cpc-third-core","kmt-first-core","cpc-fourth-core","may30-strike-core","national-cooperation-full","northern-expedition-core","cooperation-coups","cooperation-break-core","cpc-fifth-core","national-end-full"],"changedMnemonicIds":["cpc-first-memory","cpc-second-memory","national-cooperation-memory","national-end-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"43912397","toPackVersion":"2026-10-24.15","changedQuestionIds":["cpc-foundations","cpc-first-time-place","cpc-first-delegates","cpc-first-content","cpc-first-full","cpc-second-time-place","cpc-second-high-program","cpc-second-low-program","cpc-second-significance","cpc-second-full","cpc-third-core","kmt-first-core","cpc-fourth-core","may30-strike-core","national-cooperation-full","northern-expedition-core","cooperation-coups","cooperation-break-core","cpc-fifth-core","national-end-full"],"changedMnemonicIds":["cpc-first-memory","cpc-second-memory","national-cooperation-memory","national-end-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["cpc-foundations","cpc-first-time-place","cpc-first-delegates","cpc-first-content","cpc-first-full","cpc-second-time-place","cpc-second-high-program","cpc-second-low-program","cpc-second-significance","cpc-second-full","cpc-third-core","kmt-first-core","cpc-fourth-core","may30-strike-core","national-cooperation-full","northern-expedition-core","cooperation-coups","cooperation-break-core","cpc-fifth-core","national-end-full"],"targets":["cs-target-cpc-foundations","cs-target-cpc-first-time-place","cs-target-cpc-first-delegates","cs-target-cpc-first-content","cs-target-cpc-second-time-place","cs-target-cpc-second-high-program","cs-target-cpc-second-low-program","cs-target-cpc-second-significance","cs-target-cpc-third","cs-target-kmt-first","cs-target-cpc-fourth","cs-target-may30-strike","cs-target-northern-expedition","cs-target-cooperation-coups","cs-target-cooperation-break","cs-target-cpc-fifth"],"mnemonics":["cpc-first-memory","cpc-second-memory","national-cooperation-memory","national-end-memory"]};
module.exports.directIds={"questions":["cpc-foundations","cpc-first-time-place","cpc-first-delegates","cpc-first-content","cpc-first-full","cpc-second-time-place","cpc-second-high-program","cpc-second-low-program","cpc-second-significance","cpc-second-full","cpc-third-core","kmt-first-core","cpc-fourth-core","may30-strike-core","national-cooperation-full","northern-expedition-core","cooperation-coups","cooperation-break-core","cpc-fifth-core","national-end-full"],"targets":["cs-target-cpc-foundations","cs-target-cpc-first-time-place","cs-target-cpc-first-delegates","cs-target-cpc-first-content","cs-target-cpc-second-time-place","cs-target-cpc-second-high-program","cs-target-cpc-second-low-program","cs-target-cpc-second-significance","cs-target-cpc-third","cs-target-kmt-first","cs-target-cpc-fourth","cs-target-may30-strike","cs-target-northern-expedition","cs-target-cooperation-coups","cs-target-cooperation-break","cs-target-cpc-fifth"],"mnemonics":["cpc-first-memory","cpc-second-memory","national-cooperation-memory","national-end-memory"]};
module.exports.semanticChanges={"questions":["cpc-first-delegates","cpc-second-low-program","may30-strike-core","cooperation-break-core"],"targets":["cs-target-cpc-first-delegates","cs-target-cpc-second-low-program","cs-target-cpc-fourth","cs-target-may30-strike","cs-target-cooperation-break"],"mnemonics":["cpc-first-memory","cpc-second-memory","national-cooperation-memory","national-end-memory"]};
