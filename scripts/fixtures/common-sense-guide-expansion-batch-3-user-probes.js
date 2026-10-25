module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-3",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答对象、事实关系和易混边界，不读取学习目标或原文。",
  cases: [
    {
      cardId: "poetry-ci-qu::li-yu-identity-and-theme",
      question: "李煜是什么身份，后期词主要写什么，代表作有哪些？",
      requiredTermGroups: [["南唐"], ["李后主"], ["故国之思"], ["《虞美人》"], ["《乌夜啼》"], ["《浪淘沙》"]],
    },
    {
      cardId: "poetry-ci-qu::li-yu-lines-and-works",
      question: "李煜的四组常见名句分别出自哪些作品？",
      requiredTermGroups: [["问君能有几多愁"], ["《虞美人》"], ["剪不断，理还乱"], ["《相见欢》"], ["流水落花春去也"], ["《浪淘沙》"], ["自是人生长恨水长东"], ["《乌夜啼》"]],
    },
    {
      cardId: "poetry-ci-qu::bold-ci-school-representatives",
      question: "豪放派的主要词风是什么，代表人物有哪些？",
      requiredTermGroups: [["恢弘雄放"], ["苏轼"], ["辛弃疾"], ["陈亮"], ["陆游"]],
    },
    {
      cardId: "poetry-ci-qu::su-shi-identity-and-works",
      question: "苏轼的字、号、家族合称和代表作是什么？",
      requiredTermGroups: [["子瞻"], ["东坡居士"], ["苏洵"], ["苏辙"], ["三苏"], ["《念奴娇》"], ["《水调歌头》"]],
    },
    {
      cardId: "poetry-ci-qu::zheng-guangzu-works",
      question: "郑光祖的两部代表作分别写哪些人物？",
      requiredTermGroups: [["《倩女离魂》"], ["张倩女"], ["王文举"], ["《虎牢关三战吕布》"], ["刘备"], ["关羽"], ["张飞"], ["吕布"]],
    },
    {
      cardId: "poetry-ci-qu::yuan-qu-four-masters-composition",
      question: "元曲四大家是谁，各有哪部代表作？",
      requiredTermGroups: [["关汉卿"], ["《窦娥冤》"], ["白朴"], ["《梧桐雨》"], ["马致远"], ["《汉宫秋》"], ["郑光祖"], ["《倩女离魂》"]],
    },
    {
      cardId: "poetry-ci-qu::bai-pu-works",
      question: "白朴的《梧桐雨》和《墙头马上》分别写哪些人物？",
      requiredTermGroups: [["唐明皇"], ["杨贵妃"], ["李千金"], ["裴少俊"]],
    },
    {
      cardId: "poetry-ci-qu::western-chamber-basic-facts",
      question: "《西厢记》的作者、人物和故事来源是什么？",
      requiredTermGroups: [["王实甫"], ["张生"], ["崔莺莺"], ["红娘"], ["《莺莺传》"]],
    },
    {
      cardId: "poetry-ci-qu::four-dreams-composition",
      question: "临川四梦由谁创作，包括哪四部作品，《牡丹亭》又叫什么？",
      requiredTermGroups: [["汤显祖"], ["《牡丹亭》"], ["《紫钗记》"], ["《南柯记》"], ["《邯郸记》"], ["《还魂记》"]],
    },
    {
      cardId: "poetry-ci-qu::peach-blossom-fan-basic-facts",
      question: "《桃花扇》的作者、时代和主题是什么？",
      requiredTermGroups: [["清初"], ["孔尚任"], ["离合"], ["兴亡"]],
    },
    {
      cardId: "poetry-ci-qu::four-famous-plays-composition",
      question: "四大名剧包括哪四部作品？",
      requiredTermGroups: [["《西厢记》"], ["《牡丹亭》"], ["《长生殿》"], ["《桃花扇》"]],
    },
    {
      cardId: "poetry-ci-qu::yuan-zaju-four-tragedies",
      question: "元杂剧四大悲剧包括哪四部作品？",
      requiredTermGroups: [["《窦娥冤》"], ["《汉宫秋》"], ["《梧桐雨》"], ["《赵氏孤儿》"]],
    },
  ],
};
