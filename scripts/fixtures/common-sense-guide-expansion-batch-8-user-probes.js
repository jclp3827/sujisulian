module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-8",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答节日、诗句、教育、织绣和饮食分类问题。",
  cases: [
    {cardId: "daily-life-language::spring-festival", question: "春节是哪一天，有哪些别称和习俗？", requiredTermGroups: [["正月初一"], ["元日"], ["元旦"], ["拜年"], ["爆竹"]]},
    {cardId: "daily-life-language::cold-food-festival", question: "寒食节与清明是什么时间关系，有什么习俗？", requiredTermGroups: [["清明前"], ["禁火"], ["冷食", "寒食"], ["融合"]]},
    {cardId: "daily-life-language::four-major-festivals", question: "正文列出的四大传统节日是什么？", requiredTermGroups: [["春节"], ["清明节"], ["端午节"], ["中秋节"]]},
    {cardId: "daily-life-language::lantern-poems", question: "两组元宵名句分别出自谁的什么作品？", requiredTermGroups: [["欧阳修"], ["生查子·元夕"], ["辛弃疾"], ["青玉案·元夕"]]},
    {cardId: "daily-life-language::qingming-coldfood-poems", question: "清明与寒食两句诗分别是谁写的？", requiredTermGroups: [["杜牧"], ["清明"], ["韩翃"], ["寒食"]]},
    {cardId: "daily-life-language::school-name-history", question: "夏商周学校分别叫什么，庠序是什么意思？", requiredTermGroups: [["夏"], ["校"], ["商", "殷"], ["序"], ["周"], ["庠"], ["学校"]]},
    {cardId: "daily-life-language::six-arts-education", question: "古代教育六艺是什么，各自涉及什么？", requiredTermGroups: [["礼"], ["乐"], ["射"], ["御"], ["书"], ["数"], ["礼仪"], ["音乐"], ["射箭"], ["驾车"], ["书写"], ["计算"]]},
    {cardId: "daily-life-language::song-four-academies", question: "正文中的四大书院名单及另一说差别是什么？", requiredTermGroups: [["白鹿洞"], ["岳麓"], ["应天府"], ["嵩阳"], ["石鼓"]]},
    {cardId: "daily-life-language::four-famous-brocades", question: "四大名锦及产地是什么？", requiredTermGroups: [["南京云锦"], ["四川蜀锦"], ["苏州宋锦"], ["广西壮锦"]]},
    {cardId: "daily-life-language::four-famous-embroideries", question: "四大名绣及地区是什么？", requiredTermGroups: [["广东粤绣"], ["湖南湘绣"], ["四川蜀绣"], ["江苏苏绣"]]},
    {cardId: "daily-life-language::four-major-cuisines", question: "四大菜系是什么，淮扬菜与苏菜是什么关系？", requiredTermGroups: [["鲁菜"], ["川菜"], ["粤菜"], ["淮扬菜"], ["苏菜"]]},
    {cardId: "daily-life-language::four-exam-banquets", question: "科举四宴分别对应什么场合？", requiredTermGroups: [["会武宴"], ["武科殿试"], ["鹿鸣宴"], ["乡试"], ["鹰扬宴"], ["武科乡试"], ["琼林宴"], ["新科进士"]]},
  ],
};
