module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-1",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答对象、事实关系和易混边界，不读取学习目标或原文。",
  cases: [
    {
      cardId: "prehistoric-civilization::paleolithic-tools-and-fire",
      question: "元谋人、北京人和山顶洞人在工具与用火方面分别发展到什么阶段？",
      requiredTermGroups: [["元谋人"], ["北京人"], ["保存火种"], ["山顶洞人"], ["人工取火"]],
    },
    {
      cardId: "prehistoric-civilization::abdication-system",
      question: "禅让制是什么，和父子世袭有什么区别？",
      requiredTermGroups: [["尧、舜、禹"], ["部落联盟"], ["推选"], ["不以父子世袭"]],
    },
    {
      cardId: "prehistoric-civilization::yu-flood-control-method",
      question: "大禹相较鲧改变了什么治水方法，相关典故表达什么？",
      requiredTermGroups: [["鲧"], ["堵水"], ["疏导"], ["三过家门而不入"]],
    },
    {
      cardId: "three-kingdoms-sui-tang::guandu-chibi-comparison",
      question: "官渡与赤壁两战的双方和历史作用如何区分？",
      requiredTermGroups: [["曹操"], ["袁绍"], ["统一北方"], ["孙刘联军"], ["三国鼎立"]],
    },
    {
      cardId: "three-kingdoms-sui-tang::three-kingdoms-foundation",
      question: "魏、蜀、吴分别由谁在何时建立并定都哪里？",
      requiredTermGroups: [["220年"], ["曹丕"], ["洛阳"], ["221年"], ["刘备"], ["成都"], ["229年"], ["孙权"], ["建业"]],
    },
    {
      cardId: "three-kingdoms-sui-tang::feishui-battle",
      question: "淝水之战的双方、结果和影响是什么？",
      requiredTermGroups: [["383年"], ["前秦"], ["东晋"], ["苻坚"], ["谢安"], ["南北长期对峙"]],
    },
    {
      cardId: "sui-tang::rent-yong-diao-and-two-tax",
      question: "租庸调三项分别是什么，两税法按什么征收？",
      requiredTermGroups: [["谷物"], ["绢布"], ["代替服役"], ["资产和田亩"], ["夏、秋"]],
    },
    {
      cardId: "sui-tang::three-provinces-six-ministries",
      question: "中书、门下、尚书三省分别负责什么？",
      requiredTermGroups: [["中书省"], ["草拟"], ["门下省"], ["审核"], ["尚书省"], ["执行"]],
    },
    {
      cardId: "sui-tang::jianzhen-japan-voyages",
      question: "鉴真东渡多少次，主要带来了什么影响？",
      requiredTermGroups: [["六次"], ["日本"], ["佛教"], ["文化交流"]],
    },
    {
      cardId: "five-dynasties-yuan::northern-song-reforms",
      question: "庆历新政和王安石变法的时期、人物和目标如何区分？",
      requiredTermGroups: [["宋仁宗"], ["范仲淹"], ["宋神宗"], ["王安石"], ["富国强兵"]],
    },
    {
      cardId: "five-dynasties-yuan::liao-foundation-and-fall",
      question: "辽由谁建立，何时改国号，又亡于谁？",
      requiredTermGroups: [["耶律阿保机"], ["916年"], ["947年"], ["1125年"], ["金"]],
    },
    {
      cardId: "five-dynasties-yuan::yuan-foundation-and-fall",
      question: "蒙古统一、元朝建立和元朝统治结束分别对应哪些节点？",
      requiredTermGroups: [["1206年"], ["铁木真"], ["1271年"], ["忽必烈"], ["1368年"], ["大都"]],
    },
  ],
};
