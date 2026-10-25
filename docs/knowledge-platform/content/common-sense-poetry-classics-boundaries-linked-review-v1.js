const Q={
  "shuowen-status-core": {
    "prompt": "系统分析汉字字形、考究字源并按部首编排的字书是？",
    "explanation": "《说文解字》以字形字源为主要研究对象，并按部首编排，区别于文学理论著作和类书。"
  },
  "wenxin-status-core": {
    "prompt": "南朝刘勰系统讨论文学创作与批评的理论专著是？",
    "explanation": "《文心雕龙》研究文学创作与批评，不是字典或汇集多部典籍的丛书。"
  },
  "yongle-author-core": {
    "prompt": "下列哪位人物与明代大型类书《永乐大典》的纂修相关？",
    "explanation": "姚广孝、解缙等主持纂修《永乐大典》，不是把全部修纂阶段归为一人独作。",
    "boundary": "区分明代类书纂修与清代四库全书编修。"
  },
  "yongle-status-core": {
    "prompt": "分类纂辑古代文献资料、便于查找征引的大型类书是？",
    "explanation": "《永乐大典》是类书，按门类辑集资料；《四库全书》则是汇集多种典籍的丛书。",
    "boundary": "区分类书与丛书体例，不以没有比较范围的最大直接辨认。"
  },
  "siku-author-status-core": {
    "options": [
      "清代纪昀等参与纂修，按经史子集分类的大型丛书",
      "明代解缙主持，按门类辑集资料的大型类书",
      "南朝刘勰创作的文学理论专著"
    ],
    "explanation": "《四库全书》为清代大型丛书，经史子集是典籍分类，不是四位作者或仅四部书。"
  },
  "book-collections-full": {
    "options": [
      "姚广孝、解缙等纂修明代类书《永乐大典》；纪昀等参与清代丛书《四库全书》纂修，后者分经史子集",
      "纪昀总纂《永乐大典》，两书均为字典",
      "许慎主编《四库全书》，分礼乐射御四部"
    ],
    "explanation": "正确项区分编者、朝代与类书丛书体例，不把四部分误解为四部书。"
  }
};
const T={
  "cs-target-shuowen-status": {
    "conclusion": "《说文解字》系统分析汉字字形、考究字源，按部首编排，是研究汉字的重要字书。"
  },
  "cs-target-wenxin-status": {
    "conclusion": "《文心雕龙》为刘勰系统讨论文学创作与批评的理论专著，不是解释汉字的字典。"
  },
  "cs-target-yongle-author": {
    "conclusion": "明代姚广孝、解缙等主持纂修《永乐大典》，修纂具有多个阶段，不是一人独作。"
  },
  "cs-target-yongle-status": {
    "conclusion": "《永乐大典》是分类纂辑文献资料、便于征引查找的大型类书，区别于汇集多部典籍的丛书。"
  },
  "cs-target-siku-author-status": {
    "conclusion": "清代纪昀等参与纂修《四库全书》，它是按经史子集分类的大型丛书，体例不同于类书。"
  }
};
const M={
  "book-lexicon-theory-memory": {
    "phrasePatches": {
      "cs-target-shuowen-status-memory": {
        "meaning": "《说文解字》系统分析汉字字形、考究字源，按部首编排，是研究汉字的重要字书。"
      },
      "cs-target-wenxin-status-memory": {
        "meaning": "《文心雕龙》为刘勰系统讨论文学创作与批评的理论专著，不是解释汉字的字典。"
      }
    }
  },
  "book-collections-memory": {
    "text": "明代姚广孝解缙等纂永乐类书；清代纪昀等纂四库丛书；经史子集为分类。",
    "phrasePatches": {
      "cs-target-yongle-author-memory": {
        "phrase": "明代姚广孝解缙等纂永乐",
        "meaning": "明代姚广孝、解缙等主持纂修《永乐大典》，修纂具有多个阶段，不是一人独作。"
      },
      "cs-target-yongle-status-memory": {
        "phrase": "永乐分类纂辑文献",
        "meaning": "《永乐大典》是分类纂辑文献资料、便于征引查找的大型类书，区别于汇集多部典籍的丛书。"
      },
      "cs-target-siku-author-status-memory": {
        "phrase": "清代纪昀等纂四库丛书",
        "meaning": "清代纪昀等参与纂修《四库全书》，它是按经史子集分类的大型丛书，体例不同于类书。"
      }
    }
  }
};
const S={
  "shuowen-status-core": {
    "1": "《文心雕龙》研究文学理论，不是分析字形字源的字书。",
    "2": "《永乐大典》是类书，不是字形字源字书。"
  },
  "wenxin-status-core": {
    "1": "《说文解字》是字书，不是文学创作批评理论专著。",
    "2": "《四库全书》是汇集典籍的丛书，不是刘勰的理论专著。"
  },
  "yongle-status-core": {
    "1": "《四库全书》汇集多种典籍，属于丛书。",
    "2": "《文心雕龙》是文学理论专著。"
  },
  "siku-author-status-core": {
    "1": "该项描述的是明代《永乐大典》。",
    "2": "该项描述的是南朝《文心雕龙》。"
  }
};
const AFFECTED={"questions":["poet-immortal","poet-sage","poet-history","poet-titles-cross","poet-sage-history-object","shuowen-author-core","shuowen-status-core","wenxin-author-core","wenxin-status-core","book-lexicon-theory-full","yongle-author-core","yongle-status-core","siku-author-status-core","siku-four-parts-core","book-collections-full"],"mnemonics":["poet-memory","book-lexicon-theory-memory","book-collections-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing poetry-classics-boundaries item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-25.1";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"872d353c","toPackVersion":"2026-10-25.1","changedQuestionIds":["poet-immortal","poet-sage","poet-history","poet-titles-cross","poet-sage-history-object","shuowen-author-core","shuowen-status-core","wenxin-author-core","wenxin-status-core","book-lexicon-theory-full","yongle-author-core","yongle-status-core","siku-author-status-core","siku-four-parts-core","book-collections-full"],"changedMnemonicIds":["poet-memory","book-lexicon-theory-memory","book-collections-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"1eb6058a","toPackVersion":"2026-10-25.1","changedQuestionIds":["poet-immortal","poet-sage","poet-history","poet-titles-cross","poet-sage-history-object","shuowen-author-core","shuowen-status-core","wenxin-author-core","wenxin-status-core","book-lexicon-theory-full","yongle-author-core","yongle-status-core","siku-author-status-core","siku-four-parts-core","book-collections-full"],"changedMnemonicIds":["poet-memory","book-lexicon-theory-memory","book-collections-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["poet-immortal","poet-sage","poet-history","poet-titles-cross","poet-sage-history-object","shuowen-author-core","shuowen-status-core","wenxin-author-core","wenxin-status-core","book-lexicon-theory-full","yongle-author-core","yongle-status-core","siku-author-status-core","siku-four-parts-core","book-collections-full"],"targets":["cs-target-poet-li-bai-title","cs-target-poet-du-fu-title","cs-target-poet-du-fu-poetry-history","cs-target-shuowen-author","cs-target-shuowen-status","cs-target-wenxin-author","cs-target-wenxin-status","cs-target-yongle-author","cs-target-yongle-status","cs-target-siku-author-status","cs-target-siku-four-parts"],"mnemonics":["poet-memory","book-lexicon-theory-memory","book-collections-memory"]};
module.exports.directIds={"questions":["poet-immortal","poet-sage","poet-history","poet-titles-cross","poet-sage-history-object","shuowen-author-core","shuowen-status-core","wenxin-author-core","wenxin-status-core","book-lexicon-theory-full","yongle-author-core","yongle-status-core","siku-author-status-core","siku-four-parts-core","book-collections-full"],"targets":["cs-target-poet-du-fu-title","cs-target-poet-du-fu-poetry-history","cs-target-shuowen-author","cs-target-shuowen-status","cs-target-wenxin-author","cs-target-wenxin-status","cs-target-yongle-author","cs-target-yongle-status","cs-target-siku-author-status","cs-target-siku-four-parts"],"mnemonics":["poet-memory","book-lexicon-theory-memory","book-collections-memory"]};
module.exports.semanticChanges={"questions":["shuowen-status-core","wenxin-status-core","yongle-author-core","yongle-status-core","siku-author-status-core","book-collections-full"],"targets":["cs-target-shuowen-status","cs-target-wenxin-status","cs-target-yongle-author","cs-target-yongle-status","cs-target-siku-author-status"],"mnemonics":["book-lexicon-theory-memory","book-collections-memory"]};
