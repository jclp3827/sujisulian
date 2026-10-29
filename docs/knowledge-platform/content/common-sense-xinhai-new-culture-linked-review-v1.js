const Q={
  "tongmenghui-core": {
    "prompt": "1905年在东京成立的中国第一个全国性资产阶级革命政党是？",
    "explanation": "中国同盟会1905年在东京成立，是全国性的资产阶级革命政党，与此前的兴中会等革命团体不同。"
  },
  "xinhai-organizations-full": {
    "options": [
      "1894年孙中山在檀香山成立兴中会；1905年东京成立全国性革命政党同盟会；纲领含创立民国、平均地权；三民主义以民权为核心",
      "兴中会1905年成立于东京；同盟会是新文化运动阵地；三民主义以科学为核心",
      "同盟会1894年成立于南京；纲领为自强求富；三民主义不含民生"
    ],
    "explanation": "正确项区分革命团体与全国性革命政党、纲领及三民主义。"
  },
  "second-protection-core": {
    "options": [
      "1913年二次革命讨袁失败；1915年底护国运动反对袁称帝，1916年袁被迫取消帝制",
      "二次革命反对清朝；护国运动支持袁称帝",
      "二次革命推翻袁世凯；护国运动发生在武昌起义之前"
    ],
    "explanation": "二次革命与护国运动处于不同阶段，护国运动反对袁世凯复辟帝制。",
    "boundary": "二十一条和称帝发生在1915年相关阶段，不能写成1914年。"
  },
  "new-culture-origin": {
    "options": [
      "1915年陈独秀在上海创办《青年杂志》，第二卷起改名《新青年》",
      "1919年胡适在北京创办《申报》",
      "1921年李大钊在嘉兴创办《新青年》"
    ],
    "explanation": "《青年杂志》第一卷仍用原名，第二卷起改名《新青年》，不是第二期。",
    "boundary": "卷与期是不同出版单位，不能混用。"
  },
  "new-culture-chen-cai": {
    "options": [
      "陈独秀创办刊物、倡导民主科学；蔡元培在北大倡导思想自由、兼容并包",
      "陈独秀撰写《文学改良刍议》；蔡元培是最早传播马克思主义者",
      "陈独秀提出三民主义；蔡元培提出自强求富"
    ],
    "explanation": "陈独秀与刊物和民主科学倡导相联系，蔡元培与北大开放学术环境相联系。",
    "boundary": "批判旧礼教不直接等于否定所有传统知识，人物贡献应落在具体活动。"
  },
  "new-culture-hu-li": {
    "options": [
      "胡适倡导白话文，李大钊是中国传播马克思主义的先驱",
      "胡适提出三民主义；李大钊创办兴中会",
      "胡适主张扶清灭洋；李大钊发动公车上书"
    ],
    "explanation": "胡适发表《文学改良刍议》并提倡白话文；李大钊与早期马克思主义传播相联系。",
    "boundary": "人物称号不替代具体文章、观点与活动。"
  },
  "may-fourth-nature": {
    "options": [
      "是彻底反帝反封建的爱国运动，工人阶级以独立政治力量登上历史舞台",
      "是扶清灭洋的农民运动，资产阶级开始登台",
      "是维新改良运动，封建君主专制由此结束"
    ],
    "explanation": "五四运动具有反帝反封建性质，工人阶级以独立政治力量发挥重要作用。",
    "boundary": "不等于此前从未有工人参与抗争。"
  }
};
const T={
  "cs-target-tongmenghui": {
    "conclusion": "中国同盟会1905年在东京成立，是全国性的资产阶级革命政党，与此前革命团体不同。"
  },
  "cs-target-second-protection": {
    "conclusion": "1913年二次革命讨袁失败；1915年底护国运动反对袁世凯称帝，1916年袁取消帝制，两个阶段不能合并。"
  },
  "cs-target-new-culture-origin": {
    "conclusion": "1915年陈独秀在上海创办《青年杂志》，第二卷起改名《新青年》，不是第二期；刊物与北大分别是思想阵地和活动基地。"
  },
  "cs-target-new-culture-chen-cai": {
    "conclusion": "陈独秀创办刊物、倡导民主科学并批判旧礼教，蔡元培在北大倡导思想自由、兼容并包。"
  },
  "cs-target-new-culture-hu-li": {
    "conclusion": "胡适发表《文学改良刍议》并提倡白话文，李大钊是中国传播马克思主义的先驱。"
  },
  "cs-target-may-fourth-nature": {
    "conclusion": "五四运动是彻底反帝反封建的爱国运动，工人阶级以独立政治力量登上历史舞台，不等于此前从未有工人抗争。"
  }
};
const M={
  "xinhai-organizations-memory": {
    "phrasePatches": {
      "cs-target-tongmenghui-memory": {
        "meaning": "中国同盟会1905年在东京成立，是全国性的资产阶级革命政党，与此前革命团体不同。"
      }
    }
  },
  "xinhai-process-memory": {
    "phrasePatches": {
      "cs-target-second-protection-memory": {
        "meaning": "1913年二次革命讨袁失败；1915年底护国运动反对袁世凯称帝，1916年袁取消帝制，两个阶段不能合并。"
      }
    }
  },
  "new-culture-memory": {
    "text": "一五独秀青年刊，第二卷起改新青；民主科学新德新文；陈办刊倡民主，蔡自由兼容；胡适白话，李大钊传马克思。",
    "phrasePatches": {
      "cs-target-new-culture-origin-memory": {
        "meaning": "1915年陈独秀在上海创办《青年杂志》，第二卷起改名《新青年》，不是第二期；刊物与北大分别是思想阵地和活动基地。"
      },
      "cs-target-new-culture-chen-cai-memory": {
        "phrase": "陈办刊倡民主，蔡自由兼容",
        "meaning": "陈独秀创办刊物、倡导民主科学并批判旧礼教，蔡元培在北大倡导思想自由、兼容并包。"
      },
      "cs-target-new-culture-hu-li-memory": {
        "phrase": "胡适白话，李大钊传马克思",
        "meaning": "胡适发表《文学改良刍议》并提倡白话文，李大钊是中国传播马克思主义的先驱。"
      }
    }
  },
  "may-fourth-memory": {
    "phrasePatches": {
      "cs-target-may-fourth-nature-memory": {
        "meaning": "五四运动是彻底反帝反封建的爱国运动，工人阶级以独立政治力量登上历史舞台，不等于此前从未有工人抗争。"
      }
    }
  }
};
const S={};
const AFFECTED={"questions":["xingzhonghui-core","tongmenghui-core","tongmenghui-platform","three-principles-core","xinhai-organizations-full","wuchang-uprising-core","republic-result-timeline","second-protection-core","xinhai-impact-boundary","xinhai-process-full","new-culture-origin","new-culture-propositions","new-culture-chen-cai","new-culture-hu-li","new-culture-full","may-fourth-trigger","may-fourth-forces","may-fourth-nature","may-fourth-significance","may-fourth-full"],"mnemonics":["xinhai-organizations-memory","xinhai-process-memory","new-culture-memory","may-fourth-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing xinhai-new-culture item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.14";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"556d743","toPackVersion":"2026-10-24.14","changedQuestionIds":["xingzhonghui-core","tongmenghui-core","tongmenghui-platform","three-principles-core","xinhai-organizations-full","wuchang-uprising-core","republic-result-timeline","second-protection-core","xinhai-impact-boundary","xinhai-process-full","new-culture-origin","new-culture-propositions","new-culture-chen-cai","new-culture-hu-li","new-culture-full","may-fourth-trigger","may-fourth-forces","may-fourth-nature","may-fourth-significance","may-fourth-full"],"changedMnemonicIds":["xinhai-organizations-memory","xinhai-process-memory","new-culture-memory","may-fourth-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"bbad4182","toPackVersion":"2026-10-24.14","changedQuestionIds":["xingzhonghui-core","tongmenghui-core","tongmenghui-platform","three-principles-core","xinhai-organizations-full","wuchang-uprising-core","republic-result-timeline","second-protection-core","xinhai-impact-boundary","xinhai-process-full","new-culture-origin","new-culture-propositions","new-culture-chen-cai","new-culture-hu-li","new-culture-full","may-fourth-trigger","may-fourth-forces","may-fourth-nature","may-fourth-significance","may-fourth-full"],"changedMnemonicIds":["xinhai-organizations-memory","xinhai-process-memory","new-culture-memory","may-fourth-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["xingzhonghui-core","tongmenghui-core","tongmenghui-platform","three-principles-core","xinhai-organizations-full","wuchang-uprising-core","republic-result-timeline","second-protection-core","xinhai-impact-boundary","xinhai-process-full","new-culture-origin","new-culture-propositions","new-culture-chen-cai","new-culture-hu-li","new-culture-full","may-fourth-trigger","may-fourth-forces","may-fourth-nature","may-fourth-significance","may-fourth-full"],"targets":["cs-target-xingzhonghui","cs-target-tongmenghui","cs-target-tongmenghui-platform","cs-target-three-principles","cs-target-wuchang-uprising","cs-target-republic-result","cs-target-second-protection","cs-target-xinhai-impact","cs-target-new-culture-origin","cs-target-new-culture-propositions","cs-target-new-culture-chen-cai","cs-target-new-culture-hu-li","cs-target-may-fourth-trigger","cs-target-may-fourth-forces","cs-target-may-fourth-nature","cs-target-may-fourth-significance"],"mnemonics":["xinhai-organizations-memory","xinhai-process-memory","new-culture-memory","may-fourth-memory"]};
module.exports.directIds={"questions":["xingzhonghui-core","tongmenghui-core","tongmenghui-platform","three-principles-core","xinhai-organizations-full","wuchang-uprising-core","republic-result-timeline","second-protection-core","xinhai-impact-boundary","xinhai-process-full","new-culture-origin","new-culture-propositions","new-culture-chen-cai","new-culture-hu-li","new-culture-full","may-fourth-trigger","may-fourth-forces","may-fourth-nature","may-fourth-significance","may-fourth-full"],"targets":["cs-target-xingzhonghui","cs-target-tongmenghui","cs-target-tongmenghui-platform","cs-target-three-principles","cs-target-wuchang-uprising","cs-target-republic-result","cs-target-second-protection","cs-target-xinhai-impact","cs-target-new-culture-origin","cs-target-new-culture-propositions","cs-target-new-culture-chen-cai","cs-target-new-culture-hu-li","cs-target-may-fourth-trigger","cs-target-may-fourth-forces","cs-target-may-fourth-nature","cs-target-may-fourth-significance"],"mnemonics":["xinhai-organizations-memory","xinhai-process-memory","new-culture-memory","may-fourth-memory"]};
module.exports.semanticChanges={"questions":["tongmenghui-core","xinhai-organizations-full","second-protection-core","new-culture-origin","new-culture-chen-cai","new-culture-hu-li","may-fourth-nature"],"targets":["cs-target-tongmenghui","cs-target-second-protection","cs-target-new-culture-origin","cs-target-new-culture-chen-cai","cs-target-new-culture-hu-li","cs-target-may-fourth-nature"],"mnemonics":["xinhai-organizations-memory","xinhai-process-memory","new-culture-memory","may-fourth-memory"]};
