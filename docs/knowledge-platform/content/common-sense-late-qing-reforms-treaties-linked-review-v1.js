const Q={
  "self-strengthening-thought": {
    "options": [
      "维护原有统治秩序并学习西方技术；前期侧重自强，后来兴办民用企业求富",
      "前期求富、后期自强；中体西用由孙中山提出",
      "全程扶清灭洋；师夷长技以制夷由张之洞提出"
    ],
    "explanation": "中体西用强调维护原有统治秩序、学习西方技术；自强与求富有侧重变化，不是互相排斥。",
    "boundary": "不将思想探索简化为某人独自创立所有洋务政策。"
  },
  "self-strengthening-support-outcome": {
    "options": [
      "晚清逐步形成北洋、南洋、福建、广东等舰队；京师同文馆属于洋务教育；甲午失败表明富强目标未达成",
      "只建北洋一支海军；京师大学堂是洋务新式学堂；火烧圆明园标志运动破产",
      "福建舰队实力最强；新式学堂为黄埔军校；戊戌政变标志运动破产"
    ],
    "explanation": "晚清舰队包括广东，不能把三支简列当全部；同文馆与大学堂不同，甲午失败也不能抹去技术教育的历史作用。",
    "boundary": "建设计划、分期简列和实际形成的舰队范围不同。"
  },
  "self-strengthening-full": {
    "options": [
      "洋务派有奕䜣及曾李左张等；自强与求富推动军用民用企业和新式教育；海军包括北洋等舰队；甲午失败表明富强目标未实现",
      "中央孙中山、地方六君子；前期求富后期自强；威海卫之战后运动开始",
      "洋务派以扶清灭洋为口号；只创办民用企业；八国联军侵华标志运动破产"
    ],
    "explanation": "正确项区分人物、建设领域和运动目标，结局不等于全部建设无作用。"
  },
  "sino-japanese-sea-control": {
    "objective": "区分黄海与威海卫战役阶段",
    "prompt": "关于黄海海战与后来的威海卫之战，下列哪项正确？",
    "options": [
      "它们是不同战役，不能将黄海海战当天直接写成北洋舰队已全部覆灭",
      "黄海海战后北洋舰队立即攻占东京",
      "两者都是福建海军在中法战争中的战役"
    ],
    "explanation": "黄海海战与邓世昌牺牲相联系，后来的威海卫之战与北洋海军覆灭相联系。",
    "boundary": "区分战役发生与后来败亡，不将战后战略变化压成同一时点。"
  },
  "triple-intervention": {
    "explanation": "俄、德、法干涉迫使日本放弃辽东半岛，清政府另付赎辽费。",
    "boundary": "原条约确实列有辽东；后来还辽不等于台湾、澎湖也同时归还。"
  },
  "sino-japanese-full": {
    "options": [
      "黄海海战邓世昌牺牲，威海卫之战丁汝昌牺牲、北洋覆灭；1895年签《马关条约》；俄德法随后干涉还辽",
      "黄海丁汝昌、威海卫邓世昌；1842年签《马关条约》；英美干涉还辽",
      "林则徐率北洋水师黄海获胜；《辛丑条约》允许日本设厂"
    ],
    "explanation": "正确项区分战役人物、北洋覆灭、条约签订及后来还辽的不同阶段。"
  },
  "imperial-university": {
    "prompt": "1898年维新期间设立、后来成为北京大学前身的国立综合性大学是？",
    "explanation": "京师大学堂创办于1898年，是北京大学前身，与1862年创办的京师同文馆区分。",
    "boundary": "大学的性质、创办时间与后来机构合并分别判断，不用缺少类型限定的首校排名。"
  },
  "hundred-days-full": {
    "options": [
      "1895年公车上书推动维新；1898年光绪帝宣布变法；京师大学堂为北京大学前身；谭嗣同属于戊戌六君子",
      "1895年《辛丑条约》揭幕；1898年孙中山颁《临时约法》；京师同文馆由维新派建立",
      "1900年公车上书；慈禧颁《定国是诏》；邓世昌属戊戌六君子"
    ],
    "explanation": "正确项区分维新政治行动、变法实施、教育成果与被杀害的维新人士。"
  },
  "boxer-rebellion": {
    "options": [
      "近代反抗列强侵略的群众运动，相关口号为扶清灭洋",
      "资产阶级维新运动，口号自强求富",
      "资产阶级革命政党，纲领三民主义"
    ],
    "explanation": "义和团在山东、直隶等地民间结社与抗争中发展，具有反侵略诉求，也有笼统排外等局限。",
    "boundary": "不把跨地区运动简化为一个人在一次事件中独自建立全部组织。"
  }
};
const T={
  "cs-target-self-strengthening-thought": {
    "conclusion": "洋务派维护原有统治秩序并学习西方技术；前期侧重自强，后来以求富兴办民用企业，两者不互相排斥。"
  },
  "cs-target-self-strengthening-industry": {
    "conclusion": "曾国藩联系安庆内军械所，李鸿章联系江南制造总局及轮船招商局，张之洞联系汉阳铁厂；分别区分军械制造与民用企业，不用无限定规模排名。"
  },
  "cs-target-self-strengthening-navy": {
    "conclusion": "晚清逐步形成北洋、南洋、福建、广东等舰队，建设计划与实际形成范围不同；北洋海军在甲午威海卫之战覆灭。"
  },
  "cs-target-self-strengthening-outcome": {
    "conclusion": "甲午战争北洋覆灭表明洋务运动未能达到富强与有效抵御外侮的目标，不等于工业、技术和教育建设没有历史作用。"
  },
  "cs-target-sino-japanese-sea-control": {
    "statement": "能区分黄海海战与威海卫之战的不同阶段。",
    "conclusion": "黄海海战与后来威海卫之战不同，不能把黄海海战当天直接写成北洋舰队已全部覆灭。"
  },
  "cs-target-triple-intervention": {
    "conclusion": "俄德法干涉迫使日本放弃辽东半岛，清政府另付赎辽费；原条约列辽东，后来还辽不包括台湾、澎湖。"
  },
  "cs-target-imperial-university": {
    "conclusion": "京师大学堂创办于1898年维新时期，是北京大学前身，与京师同文馆不同；后者后来并入不等于最初同一机构。"
  },
  "cs-target-boxer-rebellion": {
    "conclusion": "义和团在山东、直隶等地的民间结社与抗争中发展，以扶清灭洋为相关口号，具有反侵略诉求及笼统排外等局限。"
  }
};
const M={
  "self-strengthening-memory": {
    "text": "中央奕䜣，地方曾李左张；自强求富中体西用；曾安庆、李江南轮船、张汉阳；海军北洋南洋福建广东；新式学堂同文馆；甲午失败，富强目标未达成。",
    "phrasePatches": {
      "cs-target-self-strengthening-thought-memory": {
        "meaning": "洋务派维护原有统治秩序并学习西方技术；前期侧重自强，后来以求富兴办民用企业，两者不互相排斥。"
      },
      "cs-target-self-strengthening-industry-memory": {
        "meaning": "曾国藩联系安庆内军械所，李鸿章联系江南制造总局及轮船招商局，张之洞联系汉阳铁厂；分别区分军械制造与民用企业，不用无限定规模排名。"
      },
      "cs-target-self-strengthening-navy-memory": {
        "phrase": "海军北洋南洋福建广东",
        "meaning": "晚清逐步形成北洋、南洋、福建、广东等舰队，建设计划与实际形成范围不同；北洋海军在甲午威海卫之战覆灭。"
      },
      "cs-target-self-strengthening-outcome-memory": {
        "phrase": "甲午失败，富强目标未达成",
        "meaning": "甲午战争北洋覆灭表明洋务运动未能达到富强与有效抵御外侮的目标，不等于工业、技术和教育建设没有历史作用。"
      }
    }
  },
  "sino-japanese-memory": {
    "text": "黄海邓世昌，威海丁汝昌；黄海非当日全军覆灭；马关割辽台澎，开沙重苏杭，口岸可设厂；俄法德干涉还辽。",
    "phrasePatches": {
      "cs-target-sino-japanese-sea-control-memory": {
        "phrase": "黄海非当日全军覆灭",
        "meaning": "黄海海战与后来威海卫之战不同，不能把黄海海战当天直接写成北洋舰队已全部覆灭。"
      },
      "cs-target-triple-intervention-memory": {
        "meaning": "俄德法干涉迫使日本放弃辽东半岛，清政府另付赎辽费；原条约列辽东，后来还辽不包括台湾、澎湖。"
      }
    }
  },
  "hundred-days-memory": {
    "text": "九五公车康梁揭幕；九八光绪定国是，百日一零三；京师大学堂为北大前身；六君子谭嗣同狱中题壁。",
    "phrasePatches": {
      "cs-target-imperial-university-memory": {
        "phrase": "京师大学堂为北大前身",
        "meaning": "京师大学堂创办于1898年维新时期，是北京大学前身，与京师同文馆不同；后者后来并入不等于最初同一机构。"
      }
    }
  },
  "boxer-alliance-memory": {
    "phrasePatches": {
      "cs-target-boxer-rebellion-memory": {
        "meaning": "义和团在山东、直隶等地的民间结社与抗争中发展，以扶清灭洋为相关口号，具有反侵略诉求及笼统排外等局限。"
      }
    }
  }
};
const S={
  "sino-japanese-sea-control": {
    "1": "把黄海海战虚构成占领东京。",
    "2": "把甲午中日战争与中法战争、福建海军混同。"
  }
};
const AFFECTED={"questions":["self-strengthening-faction","self-strengthening-thought","self-strengthening-industry","self-strengthening-support-outcome","self-strengthening-full","sino-japanese-battles","sino-japanese-sea-control","shimonoseki-treaty","triple-intervention","sino-japanese-full","gongche-memorial","hundred-days-reform","imperial-university","six-martyrs","hundred-days-full","boxer-rebellion","eight-nation-alliance","boxer-protocol-terms","boxer-protocol-impact","boxer-alliance-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"mnemonics":["self-strengthening-memory","sino-japanese-memory","hundred-days-memory","boxer-alliance-memory","q1-modern-treaty-contrast-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing late-qing-reforms-treaties item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-24.13";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"c5c8effa","toPackVersion":"2026-10-24.13","changedQuestionIds":["self-strengthening-faction","self-strengthening-thought","self-strengthening-industry","self-strengthening-support-outcome","self-strengthening-full","sino-japanese-battles","sino-japanese-sea-control","shimonoseki-treaty","triple-intervention","sino-japanese-full","gongche-memorial","hundred-days-reform","imperial-university","six-martyrs","hundred-days-full","boxer-rebellion","eight-nation-alliance","boxer-protocol-terms","boxer-protocol-impact","boxer-alliance-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"changedMnemonicIds":["self-strengthening-memory","sino-japanese-memory","hundred-days-memory","boxer-alliance-memory","q1-modern-treaty-contrast-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"51845d0d","toPackVersion":"2026-10-24.13","changedQuestionIds":["self-strengthening-faction","self-strengthening-thought","self-strengthening-industry","self-strengthening-support-outcome","self-strengthening-full","sino-japanese-battles","sino-japanese-sea-control","shimonoseki-treaty","triple-intervention","sino-japanese-full","gongche-memorial","hundred-days-reform","imperial-university","six-martyrs","hundred-days-full","boxer-rebellion","eight-nation-alliance","boxer-protocol-terms","boxer-protocol-impact","boxer-alliance-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"changedMnemonicIds":["self-strengthening-memory","sino-japanese-memory","hundred-days-memory","boxer-alliance-memory","q1-modern-treaty-contrast-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["self-strengthening-faction","self-strengthening-thought","self-strengthening-industry","self-strengthening-support-outcome","self-strengthening-full","sino-japanese-battles","sino-japanese-sea-control","shimonoseki-treaty","triple-intervention","sino-japanese-full","gongche-memorial","hundred-days-reform","imperial-university","six-martyrs","hundred-days-full","boxer-rebellion","eight-nation-alliance","boxer-protocol-terms","boxer-protocol-impact","boxer-alliance-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"targets":["cs-target-self-strengthening-faction","cs-target-self-strengthening-thought","cs-target-self-strengthening-industry","cs-target-self-strengthening-navy","cs-target-self-strengthening-school","cs-target-self-strengthening-outcome","cs-target-sino-japanese-battles","cs-target-sino-japanese-sea-control","cs-target-shimonoseki-treaty","cs-target-triple-intervention","cs-target-gongche-memorial","cs-target-hundred-days-reform","cs-target-imperial-university","cs-target-six-martyrs","cs-target-boxer-rebellion","cs-target-eight-nation-alliance","cs-target-boxer-protocol-terms","cs-target-boxer-protocol-impact","q1-target-shimonoseki-treaty","q1-target-boxer-protocol"],"mnemonics":["self-strengthening-memory","sino-japanese-memory","hundred-days-memory","boxer-alliance-memory","q1-modern-treaty-contrast-memory"]};
module.exports.directIds={"questions":["self-strengthening-faction","self-strengthening-thought","self-strengthening-industry","self-strengthening-support-outcome","self-strengthening-full","sino-japanese-battles","sino-japanese-sea-control","shimonoseki-treaty","triple-intervention","sino-japanese-full","gongche-memorial","hundred-days-reform","imperial-university","six-martyrs","hundred-days-full","boxer-rebellion","eight-nation-alliance","boxer-protocol-terms","boxer-protocol-impact","boxer-alliance-full","q1-treaty-quick-recall","q1-treaty-boundary","q1-treaty-material"],"targets":["cs-target-self-strengthening-faction","cs-target-self-strengthening-thought","cs-target-self-strengthening-industry","cs-target-self-strengthening-navy","cs-target-self-strengthening-school","cs-target-self-strengthening-outcome","cs-target-sino-japanese-battles","cs-target-sino-japanese-sea-control","cs-target-shimonoseki-treaty","cs-target-triple-intervention","cs-target-gongche-memorial","cs-target-hundred-days-reform","cs-target-imperial-university","cs-target-six-martyrs","cs-target-boxer-rebellion","cs-target-eight-nation-alliance","cs-target-boxer-protocol-terms","cs-target-boxer-protocol-impact","q1-target-shimonoseki-treaty","q1-target-boxer-protocol"],"mnemonics":["self-strengthening-memory","sino-japanese-memory","hundred-days-memory","boxer-alliance-memory","q1-modern-treaty-contrast-memory"]};
module.exports.semanticChanges={"questions":["self-strengthening-thought","self-strengthening-support-outcome","self-strengthening-full","sino-japanese-sea-control","triple-intervention","sino-japanese-full","imperial-university","hundred-days-full","boxer-rebellion"],"targets":["cs-target-self-strengthening-thought","cs-target-self-strengthening-industry","cs-target-self-strengthening-navy","cs-target-self-strengthening-outcome","cs-target-sino-japanese-sea-control","cs-target-triple-intervention","cs-target-imperial-university","cs-target-boxer-rebellion"],"mnemonics":["self-strengthening-memory","sino-japanese-memory","hundred-days-memory","boxer-alliance-memory"]};
