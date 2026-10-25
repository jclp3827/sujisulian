module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-4",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答对象、事实关系和易混边界，不读取学习目标或原文。",
  cases: [
    {cardId: "classical-novels::water-margin-basic-facts", question: "《水浒传》的作者、语言、体裁和题材是什么？", requiredTermGroups: [["施耐庵"], ["古白话"], ["章回体"], ["农民起义"]]},
    {cardId: "classical-novels::four-marvelous-books", question: "明代四大奇书包括哪四部？", requiredTermGroups: [["《水浒传》"], ["《三国演义》"], ["《西游记》"], ["《金瓶梅》"]]},
    {cardId: "classical-novels::novel-groupings-difference", question: "四大奇书与四大名著有哪些共同作品，差别是哪两部？", requiredTermGroups: [["《水浒传》"], ["《三国演义》"], ["《西游记》"], ["《金瓶梅》"], ["《红楼梦》"]]},
    {cardId: "classical-novels::gold-jade-marriage", question: "金玉良缘指哪两个人，金和玉分别联系谁？", requiredTermGroups: [["贾宝玉"], ["薛宝钗"], ["玉"], ["金"]]},
    {cardId: "fiction-history-modern-literature::historiography-twin-works", question: "史学双璧是哪两部书，作者和体裁分别是什么？", requiredTermGroups: [["司马迁"], ["《史记》"], ["纪传体"], ["司马光"], ["《资治通鉴》"], ["编年体"]]},
    {cardId: "fiction-history-modern-literature::shiji-structure-counts", question: "《史记》五类篇目各有多少篇，总数是多少？", requiredTermGroups: [["十二本纪"], ["三十世家"], ["七十列传"], ["十表"], ["八书"], ["一百三十篇"]]},
    {cardId: "fiction-history-modern-literature::guoyu-basic-facts", question: "《国语》是什么体裁，与编年体的组织方式有何差别？", requiredTermGroups: [["国别体"], ["国家"], ["年代"]]},
    {cardId: "fiction-history-modern-literature::spring-autumn-three-commentaries", question: "《春秋》三传及其传统作者分别是谁？", requiredTermGroups: [["《春秋左氏传》"], ["左丘明"], ["《春秋公羊传》"], ["公羊高"], ["《春秋谷梁传》"], ["谷梁赤"]]},
    {cardId: "modern-literature::lu-xun-name-and-works", question: "鲁迅的原名、籍贯和主要小说作品是什么？", requiredTermGroups: [["周樟寿"], ["周树人"], ["绍兴"], ["《狂人日记》"], ["《呐喊》"], ["《彷徨》"]]},
    {cardId: "modern-literature::lu-xun-collection-types", question: "鲁迅四组作品集分别属于什么类型？", requiredTermGroups: [["《呐喊》"], ["小说集"], ["《朝花夕拾》"], ["散文集"], ["《野草》"], ["散文诗集"], ["《南腔北调集》"], ["杂文集"]]},
    {cardId: "modern-literature::lao-she-works", question: "老舍的称号和三部代表作是什么？", requiredTermGroups: [["人民艺术家"], ["《骆驼祥子》"], ["《四世同堂》"], ["《茶馆》"]]},
    {cardId: "modern-literature::mo-yan-name-award-works", question: "莫言的本名、籍贯、获奖年份和代表作是什么？", requiredTermGroups: [["管谟业"], ["山东高密"], ["2012年"], ["诺贝尔文学奖"], ["《红高粱家族》"], ["《蛙》"]]},
  ],
};
