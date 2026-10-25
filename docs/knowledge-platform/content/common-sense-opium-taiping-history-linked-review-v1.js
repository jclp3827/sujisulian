const Q={
  "humen-opium": {
    "prompt": "1839年在广东虎门主持销毁鸦片、开展禁烟行动的人物是谁？",
    "explanation": "林则徐主持虎门销烟；英国以中国禁烟为借口发动侵华战争，侵略责任不能归于中国正当禁烟。",
    "boundary": "区分侵略者的出兵借口与维护鸦片贸易利益、打开中国市场的目的。"
  },
  "sanyuanli-resistance": {
    "options": [
      "当地民众自发组织保卫家园、抵抗外来侵略",
      "清政府组织的第一次海军远征",
      "近代第一个不平等条约的签订"
    ],
    "explanation": "三元里抗英是鸦片战争期间地方民众自发抗击英军的代表性斗争。",
    "boundary": "地方抗争不等于清政府组织的海军远征，也不等于整场战争已经获胜。"
  },
  "heavenly-land-system": {
    "options": [
      "提出平均分配土地等理想，相关方案未真正实行",
      "主张发展资本主义并兴办铁路银行",
      "是清政府与英法签订的不平等条约"
    ],
    "explanation": "《天朝田亩制度》的平均分田等方案带有空想性，在战争环境等条件下未真正实行。",
    "boundary": "不能把纲领提出直接等同于已经完成全国土地分配。"
  },
  "taiping-full": {
    "options": [
      "1851年金田起义；1856年天京事变后转衰；1864年失败；《天朝田亩制度》的平均分田方案未真正实行；《资政新篇》主张学习西方",
      "1853年天京事变；《天朝田亩制度》主张发展资本主义；洪秀全提出《资政新篇》",
      "1864年金田起义；《资政新篇》强调平均主义且已全面实施"
    ],
    "explanation": "正确项区分起义、转折、失败三个阶段以及两部纲领的不同主张。",
    "boundary": "提出纲领与真正实施属于不同判断。"
  },
  "second-opium-treaties": {
    "prompt": "清政府在第二次鸦片战争期间分别签订的同名条约，与对方国家范围对应正确的是？",
    "explanation": "1858年分别与俄、美、英、法签订《天津条约》，1860年分别与英、法、俄签订《北京条约》。",
    "boundary": "同名条约是与各国分别签署的双边文本，不是一份共同签署的多边条约。"
  },
  "aihun-russia": {
    "options": [
      "由中俄签订，涉及黑龙江以北、外兴安岭以南的中国领土",
      "由中日签订，允许日本在口岸设厂",
      "由中英签订，是近代第一个不平等条约"
    ],
    "explanation": "1858年中俄《瑷珲条约》涉及黑龙江以北、外兴安岭以南的中国领土。",
    "boundary": "不把沙俄通过不同条约侵占的全部土地都归到《瑷珲条约》。"
  }
};
const T={
  "cs-target-humen-opium": {
    "conclusion": "1839年林则徐在广东虎门主持销毁鸦片；英国以中国禁烟为借口发动战争，目的在于维护鸦片贸易利益、打开中国市场。"
  },
  "cs-target-sanyuanli-resistance": {
    "conclusion": "1841年广州三元里及附近乡民自发组织抗击英军，是民众保卫家园、抵抗外来侵略的代表性斗争。"
  },
  "cs-target-heavenly-land-system": {
    "conclusion": "《天朝田亩制度》提出平均分配土地等理想，相关方案带有空想性，在战争环境等条件下未真正实行。"
  },
  "cs-target-senior-words": {
    "conclusion": "洪仁玕提出《资政新篇》，主张学习西方，发展工商业和铁路银行等；主张不等于全面实施。"
  },
  "cs-target-second-opium-treaties": {
    "conclusion": "1858年分别与俄美英法签订《天津条约》，1860年分别与英法俄签订《北京条约》；同名文本是不同双边条约。"
  },
  "cs-target-aihun-russia": {
    "conclusion": "1858年中俄《瑷珲条约》涉及黑龙江以北、外兴安岭以南的中国领土，不包括沙俄经其他条约侵占的全部土地。"
  }
};
const M={
  "opium-war-opening-memory": {
    "phrasePatches": {
      "cs-target-humen-opium-memory": {
        "meaning": "1839年林则徐在广东虎门主持销毁鸦片；英国以中国禁烟为借口发动战争，目的在于维护鸦片贸易利益、打开中国市场。"
      },
      "cs-target-sanyuanli-resistance-memory": {
        "meaning": "1841年广州三元里及附近乡民自发组织抗击英军，是民众保卫家园、抵抗外来侵略的代表性斗争。"
      }
    }
  },
  "taiping-memory": {
    "phrasePatches": {
      "cs-target-heavenly-land-system-memory": {
        "meaning": "《天朝田亩制度》提出平均分配土地等理想，相关方案带有空想性，在战争环境等条件下未真正实行。"
      },
      "cs-target-senior-words-memory": {
        "meaning": "洪仁玕提出《资政新篇》，主张学习西方，发展工商业和铁路银行等；主张不等于全面实施。"
      }
    }
  },
  "second-opium-memory": {
    "text": "英借亚罗，法借马神甫；天津英法俄美、北京英法俄各自签约；六零英法烧圆明；五八中俄瑷珲涉及黑龙江北。",
    "phrasePatches": {
      "cs-target-second-opium-treaties-memory": {
        "meaning": "1858年分别与俄美英法签订《天津条约》，1860年分别与英法俄签订《北京条约》；同名文本是不同双边条约。"
      },
      "cs-target-aihun-russia-memory": {
        "phrase": "五八中俄瑷珲涉及黑龙江北",
        "meaning": "1858年中俄《瑷珲条约》涉及黑龙江以北、外兴安岭以南的中国领土，不包括沙俄经其他条约侵占的全部土地。"
      }
    }
  }
};
const S={};
const AFFECTED={"questions":["humen-opium","sanyuanli-resistance","nanjing-treaty","open-eyes-world","opium-war-opening-full","taiping-founding","taiping-turn-failure","heavenly-land-system","senior-words","taiping-full","second-opium-causes","second-opium-treaties","yuanmingyuan","aihun-russia","second-opium-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"mnemonics":["opium-war-opening-memory","taiping-memory","second-opium-memory","q1-modern-treaty-contrast-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing opium-taiping-history item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.12";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"ef06ad3b","toPackVersion":"2026-10-24.12","changedQuestionIds":["humen-opium","sanyuanli-resistance","nanjing-treaty","open-eyes-world","opium-war-opening-full","taiping-founding","taiping-turn-failure","heavenly-land-system","senior-words","taiping-full","second-opium-causes","second-opium-treaties","yuanmingyuan","aihun-russia","second-opium-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"changedMnemonicIds":["opium-war-opening-memory","taiping-memory","second-opium-memory","q1-modern-treaty-contrast-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"2c3e4633","toPackVersion":"2026-10-24.12","changedQuestionIds":["humen-opium","sanyuanli-resistance","nanjing-treaty","open-eyes-world","opium-war-opening-full","taiping-founding","taiping-turn-failure","heavenly-land-system","senior-words","taiping-full","second-opium-causes","second-opium-treaties","yuanmingyuan","aihun-russia","second-opium-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"changedMnemonicIds":["opium-war-opening-memory","taiping-memory","second-opium-memory","q1-modern-treaty-contrast-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["humen-opium","sanyuanli-resistance","nanjing-treaty","open-eyes-world","opium-war-opening-full","taiping-founding","taiping-turn-failure","heavenly-land-system","senior-words","taiping-full","second-opium-causes","second-opium-treaties","yuanmingyuan","aihun-russia","second-opium-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"targets":["cs-target-humen-opium","cs-target-sanyuanli-resistance","cs-target-nanjing-treaty","cs-target-nanjing-provisions","cs-target-open-eyes-world","cs-target-taiping-founding","cs-target-tianjing-incident","cs-target-taiping-failure","cs-target-heavenly-land-system","cs-target-senior-words","cs-target-second-opium-causes","cs-target-second-opium-treaties","cs-target-yuanmingyuan","cs-target-aihun-russia","q1-target-nanjing-treaty"],"mnemonics":["opium-war-opening-memory","taiping-memory","second-opium-memory","q1-modern-treaty-contrast-memory"]};
module.exports.directIds={"questions":["humen-opium","sanyuanli-resistance","nanjing-treaty","open-eyes-world","opium-war-opening-full","taiping-founding","taiping-turn-failure","heavenly-land-system","senior-words","taiping-full","second-opium-causes","second-opium-treaties","yuanmingyuan","aihun-russia","second-opium-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"targets":["cs-target-humen-opium","cs-target-sanyuanli-resistance","cs-target-nanjing-treaty","cs-target-nanjing-provisions","cs-target-open-eyes-world","cs-target-taiping-founding","cs-target-tianjing-incident","cs-target-taiping-failure","cs-target-heavenly-land-system","cs-target-senior-words","cs-target-second-opium-causes","cs-target-second-opium-treaties","cs-target-yuanmingyuan","cs-target-aihun-russia","q1-target-nanjing-treaty"],"mnemonics":["opium-war-opening-memory","taiping-memory","second-opium-memory","q1-modern-treaty-contrast-memory"]};
module.exports.semanticChanges={"questions":["humen-opium","sanyuanli-resistance","heavenly-land-system","taiping-full","second-opium-treaties","aihun-russia"],"targets":["cs-target-humen-opium","cs-target-sanyuanli-resistance","cs-target-heavenly-land-system","cs-target-senior-words","cs-target-second-opium-treaties","cs-target-aihun-russia"],"mnemonics":["opium-war-opening-memory","taiping-memory","second-opium-memory"]};
