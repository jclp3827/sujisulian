module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-2",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答对象、事实关系和易混边界，不读取学习目标或原文。",
  cases: [
    {
      cardId: "ming-qing::ming-foundation-and-fall",
      question: "明朝由谁在何时建立、定都哪里，又在何时因何结束全国统治？",
      requiredTermGroups: [["1368年"], ["朱元璋"], ["应天府"], ["1644年"], ["李自成"]],
    },
    {
      cardId: "ming-qing::ming-provincial-three-commissions",
      question: "明代地方三司分别负责哪些事务，隶属关系是什么？",
      requiredTermGroups: [["承宣布政使司"], ["行政"], ["提刑按察使司"], ["司法"], ["都指挥使司"], ["军政"], ["中央"]],
    },
    {
      cardId: "ming-qing::single-whip-reform",
      question: "一条鞭法由谁主持，把哪些赋役怎样征收？",
      requiredTermGroups: [["张居正"], ["田赋"], ["徭役"], ["杂税"], ["折成银两"], ["田亩"]],
    },
    {
      cardId: "ming-qing::qing-foundation-timeline",
      question: "后金建立、改国号为清和清军入关分别发生在何时，由哪些人物推动？",
      requiredTermGroups: [["1616年"], ["努尔哈赤"], ["1636年"], ["皇太极"], ["1644年"], ["入关"]],
    },
    {
      cardId: "ming-qing::grand-council",
      question: "军机处在何时设置，军机大臣听命于谁，主要作用是什么？",
      requiredTermGroups: [["雍正帝"], ["皇帝"], ["处理政务"], ["控制"]],
    },
    {
      cardId: "ming-qing::ming-capitalist-sprouts",
      question: "明代纺织业中的资本主义萌芽体现在哪种生产目的和劳动关系上？",
      requiredTermGroups: [["商品"], ["机户"], ["雇佣"], ["工人"]],
    },
    {
      cardId: "ancient-prose::shanhaijing-content",
      question: "《山海经》的内容大致形成于何时，主要包含哪两类内容？",
      requiredTermGroups: [["战国至汉代"], ["地理知识"], ["神话和寓言"]],
    },
    {
      cardId: "ancient-prose::four-books-composition",
      question: "四书包括哪些书？",
      requiredTermGroups: [["《论语》"], ["《孟子》"], ["《大学》"], ["《中庸》"]],
    },
    {
      cardId: "ancient-prose::five-classics-composition",
      question: "五经包括哪些经典，与六经相比少哪一部？",
      requiredTermGroups: [["《诗》"], ["《书》"], ["《礼》"], ["《易》"], ["《春秋》"], ["《乐》"]],
    },
    {
      cardId: "ancient-prose::huainanzi-basic-facts",
      question: "《淮南子》还有哪些名称，由谁组织编写，属于什么类型的著作？",
      requiredTermGroups: [["《淮南鸿烈》"], ["《刘安子》"], ["刘安"], ["门客"], ["哲学著作"]],
    },
    {
      cardId: "ancient-prose::eight-masters-composition",
      question: "唐宋八大家中的唐二家、宋六家和三苏分别是谁？",
      requiredTermGroups: [["韩愈"], ["柳宗元"], ["苏洵"], ["苏轼"], ["苏辙"], ["欧阳修"], ["曾巩"], ["王安石"]],
    },
    {
      cardId: "ancient-prose::ouyang-xiu-basic-facts",
      question: "欧阳修的字、号、谥号、代表作和六一居士的六一分别是什么？",
      requiredTermGroups: [["永叔"], ["醉翁"], ["文忠"], ["《醉翁亭记》"], ["藏书"], ["金石遗文"], ["琴"], ["棋"], ["酒"], ["老翁"]],
    },
  ],
};
