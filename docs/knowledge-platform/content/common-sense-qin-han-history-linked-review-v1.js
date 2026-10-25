const Q={
  "qin-dynasty-full": {
    "options": [
      "嬴政统一后建秦都咸阳；实行皇帝制和郡县制；统一度量衡、货币和文字；秦末起义及巨鹿之战后，秦亡进入楚汉之争",
      "刘邦建秦都长安；秦朝实行科举；统一措施只有修长城",
      "王莽建秦；项羽主持文景之治"
    ],
    "explanation": "正确项区分秦朝建立与制度、秦末反秦战争和秦亡后的楚汉之争。",
    "boundary": "楚汉之争发生在秦亡以后，不把它写成秦朝统治期间的战争。"
  },
  "wenjing-rule": {
    "prompt": "西汉文帝、景帝继续实行休养生息、减轻赋役等政策，形成的治世称什么？",
    "explanation": "文景之治与文帝、景帝时期休养生息、减轻赋役和经济恢复发展相联系。"
  },
  "western-han-full": {
    "options": [
      "刘邦建西汉都长安；文景休养生息；武帝加强集权并经营边疆；宣帝设西域都护，王莽代汉建新",
      "王莽建西汉；文景实行商鞅变法；张骞颁推恩令",
      "刘邦设西域都护；汉宣帝建新朝"
    ],
    "explanation": "正确项区分西汉建立、文景恢复、武帝措施与后期政权更替。"
  },
  "guangwu-revival": {
    "prompt": "刘秀建立东汉后，调整政策、缓和矛盾，恢复生产与社会秩序，这一恢复局面史称什么？",
    "explanation": "光武中兴指东汉光武帝刘秀时期恢复生产与社会秩序的局面。"
  },
  "qin-han-agriculture": {
    "options": [
      "赵过推广代田法及耦犁；东汉末毕岚有制造翻车的记载",
      "杜诗推广耦犁；蔡伦制造翻车；灵渠就是代田法",
      "史禄制造麻纸；赵过制作水排；毕岚统一小篆"
    ],
    "explanation": "赵过推广代田法及配套农具，毕岚与东汉末翻车制造的记载相联系。",
    "boundary": "推广耦犁不等于首次发明牛耕，也不把后来翻车的发展全部归于一人。"
  },
  "qin-han-economy-full": {
    "options": [
      "赵过推广代田法及耦犁，毕岚制造翻车；杜诗水排鼓风冶铁；蔡伦改进造纸；史禄主持灵渠",
      "赵过制造水排，杜诗制造翻车；蔡伦开凿灵渠；史禄改进造纸",
      "毕岚推广耦犁；杜诗制造麻纸；赵过开凿灵渠"
    ],
    "explanation": "正确项区分农耕推广、提水、冶铁鼓风、造纸改进和运河工程。",
    "boundary": "区分技术的推广、改进和制造，不统称某人首次发明。"
  }
};
const T={
  "cs-target-wenjing-rule": {
    "conclusion": "文帝、景帝继续实行休养生息、减轻赋役等政策，促进经济恢复发展，形成文景之治。"
  },
  "cs-target-guangwu-revival": {
    "conclusion": "刘秀建立东汉后调整政策、缓和矛盾，恢复生产和社会秩序，出现光武中兴。"
  },
  "cs-target-qin-han-agriculture": {
    "conclusion": "赵过推广代田法及耦犁等配套技术，东汉末毕岚有制造翻车的记载；不能把技术推广写成单人首次发明。"
  }
};
const M={
  "western-han-memory": {
    "text": "刘邦长安建西汉；文景休养生息；董儒卫霍匈张丝主推恩；宣帝都护王莽新。",
    "phrasePatches": {
      "cs-target-wenjing-rule-memory": {
        "phrase": "文景休养生息",
        "meaning": "文帝、景帝继续休养生息、减轻赋役，促进经济恢复发展，形成文景之治。"
      }
    }
  },
  "eastern-han-memory": {
    "text": "刘秀洛阳建东汉；恢复生产光武兴；张角黄巾东汉末；建立中兴到黄巾。",
    "phrasePatches": {
      "cs-target-guangwu-revival-memory": {
        "phrase": "恢复生产光武兴",
        "meaning": "刘秀建立东汉后调整政策、缓和矛盾，恢复生产和社会秩序，出现光武中兴。"
      }
    }
  },
  "qin-han-economy-memory": {
    "phrasePatches": {
      "cs-target-qin-han-agriculture-memory": {
        "meaning": "赵过推广代田法及耦犁等配套技术；东汉末毕岚有制造翻车的记载，不将长期发展等同于某人首次发明。"
      }
    }
  }
};
const S={};
const AFFECTED={"questions":["qin-founding","qin-governance","qin-unification","qin-fall-wars","qin-dynasty-full","western-han-founding","wenjing-rule","hanwu-measures","western-han-late","western-han-full","eastern-han-founding","guangwu-revival","yellow-turban","eastern-han-sequence","eastern-han-full","qin-han-agriculture","qin-han-water-blast","qin-han-paper","lingqu","qin-han-economy-full"],"mnemonics":["qin-dynasty-memory","western-han-memory","eastern-han-memory","qin-han-economy-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing qin-han-history item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.11";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"33f3622c","toPackVersion":"2026-10-24.11","changedQuestionIds":["qin-founding","qin-governance","qin-unification","qin-fall-wars","qin-dynasty-full","western-han-founding","wenjing-rule","hanwu-measures","western-han-late","western-han-full","eastern-han-founding","guangwu-revival","yellow-turban","eastern-han-sequence","eastern-han-full","qin-han-agriculture","qin-han-water-blast","qin-han-paper","lingqu","qin-han-economy-full"],"changedMnemonicIds":["qin-dynasty-memory","western-han-memory","eastern-han-memory","qin-han-economy-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"65f18f30","toPackVersion":"2026-10-24.11","changedQuestionIds":["qin-founding","qin-governance","qin-unification","qin-fall-wars","qin-dynasty-full","western-han-founding","wenjing-rule","hanwu-measures","western-han-late","western-han-full","eastern-han-founding","guangwu-revival","yellow-turban","eastern-han-sequence","eastern-han-full","qin-han-agriculture","qin-han-water-blast","qin-han-paper","lingqu","qin-han-economy-full"],"changedMnemonicIds":["qin-dynasty-memory","western-han-memory","eastern-han-memory","qin-han-economy-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["qin-founding","qin-governance","qin-unification","qin-fall-wars","qin-dynasty-full","western-han-founding","wenjing-rule","hanwu-measures","western-han-late","western-han-full","eastern-han-founding","guangwu-revival","yellow-turban","eastern-han-sequence","eastern-han-full","qin-han-agriculture","qin-han-water-blast","qin-han-paper","lingqu","qin-han-economy-full"],"targets":["cs-target-qin-founding","cs-target-qin-governance","cs-target-qin-unification","cs-target-qin-fall-wars","cs-target-western-han-founding","cs-target-wenjing-rule","cs-target-hanwu-measures","cs-target-western-han-late","cs-target-eastern-han-founding","cs-target-guangwu-revival","cs-target-yellow-turban","cs-target-eastern-han-sequence","cs-target-qin-han-agriculture","cs-target-qin-han-water-blast","cs-target-qin-han-paper","cs-target-lingqu"],"mnemonics":["qin-dynasty-memory","western-han-memory","eastern-han-memory","qin-han-economy-memory"]};
module.exports.directIds={"questions":["qin-founding","qin-governance","qin-unification","qin-fall-wars","qin-dynasty-full","western-han-founding","wenjing-rule","hanwu-measures","western-han-late","western-han-full","eastern-han-founding","guangwu-revival","yellow-turban","eastern-han-sequence","eastern-han-full","qin-han-agriculture","qin-han-water-blast","qin-han-paper","lingqu","qin-han-economy-full"],"targets":["cs-target-qin-founding","cs-target-qin-governance","cs-target-qin-unification","cs-target-qin-fall-wars","cs-target-western-han-founding","cs-target-wenjing-rule","cs-target-hanwu-measures","cs-target-western-han-late","cs-target-eastern-han-founding","cs-target-guangwu-revival","cs-target-yellow-turban","cs-target-eastern-han-sequence","cs-target-qin-han-agriculture","cs-target-qin-han-water-blast","cs-target-qin-han-paper","cs-target-lingqu"],"mnemonics":["qin-dynasty-memory","western-han-memory","eastern-han-memory","qin-han-economy-memory"]};
module.exports.semanticChanges={"questions":["qin-dynasty-full","wenjing-rule","western-han-full","guangwu-revival","qin-han-agriculture","qin-han-economy-full"],"targets":["cs-target-wenjing-rule","cs-target-guangwu-revival","cs-target-qin-han-agriculture"],"mnemonics":["western-han-memory","eastern-han-memory","qin-han-economy-memory"]};
