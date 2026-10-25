module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-7",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答书法分类、画家作品、剧种特征、脸谱和植物意象问题。",
  cases: [
    {cardId: "traditional-arts::three-national-essences", question: "中国三大国粹是什么，各属哪个领域？", requiredTermGroups: [["京剧"], ["国画"], ["中医"], ["戏曲"], ["绘画"], ["传统医学"]]},
    {cardId: "traditional-arts::seven-script-sequence", question: "正文列出的汉字七体顺序是什么？", requiredTermGroups: [["甲骨文"], ["金文"], ["小篆"], ["隶书"], ["楷书"], ["草书"], ["行书"]]},
    {cardId: "traditional-arts::regular-script-four-masters", question: "楷书四大家和对应书体是什么？", requiredTermGroups: [["欧阳询"], ["颜真卿"], ["柳公权"], ["赵孟頫"], ["欧体"], ["颜体"], ["柳体"], ["赵体"]]},
    {cardId: "traditional-arts::four-treasures", question: "文房四宝及常见产地代表是什么？", requiredTermGroups: [["笔"], ["墨"], ["纸"], ["砚"], ["湖笔"], ["徽墨"], ["宣纸"], ["端砚"]]},
    {cardId: "traditional-arts::yan-liben-buniantu", question: "《步辇图》的作者、时代和画面事件是什么？", requiredTermGroups: [["阎立本"], ["唐"], ["禄东赞"], ["唐太宗"]]},
    {cardId: "traditional-arts::zhang-zeduan-qingming", question: "《清明上河图》的作者和描绘地点是什么？", requiredTermGroups: [["张择端"], ["北宋"], ["东京", "汴京"], ["开封"]]},
    {cardId: "traditional-arts::huang-gongwang-fuchun", question: "《富春山居图》的作者、地点和两部分名称是什么？", requiredTermGroups: [["黄公望"], ["富春江"], ["剩山图"], ["无用师卷"]]},
    {cardId: "traditional-arts::peking-opera-roles", question: "京剧四大行当是什么，各有什么特点？", requiredTermGroups: [["生"], ["旦"], ["净"], ["丑"], ["男性"], ["女性"], ["脸谱"], ["喜剧"]]},
    {cardId: "traditional-arts::four-famous-dan", question: "京剧四大名旦是谁？", requiredTermGroups: [["梅兰芳"], ["尚小云"], ["程砚秋"], ["荀慧生"]]},
    {cardId: "traditional-arts::ping-opera", question: "评剧在哪里形成，早期叫什么，有哪些代表剧目？", requiredTermGroups: [["河北滦县"], ["唐山落子"], ["花为媒"], ["杨三姐告状"]]},
    {cardId: "traditional-arts::red-white-face", question: "红脸和白脸分别表示什么，代表谁？", requiredTermGroups: [["忠贞", "英勇"], ["关羽"], ["阴险", "疑诈"], ["曹操"]]},
    {cardId: "traditional-arts::four-gentlemen-plants", question: "四君子是什么，分别对应什么品质？", requiredTermGroups: [["梅"], ["兰"], ["竹"], ["菊"], ["傲"], ["幽"], ["坚"], ["淡"]]},
  ],
};
