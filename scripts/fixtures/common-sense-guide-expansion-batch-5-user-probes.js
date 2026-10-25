module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-5",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答制度对象、人物主张、礼仪分类和易混边界。",
  cases: [
    {cardId: "selection-thought-ritual::hereditary-office-rule", question: "世卿世禄制依据什么继承，承继哪些内容？", requiredTermGroups: [["血缘"], ["世袭"], ["政治职位", "权力"], ["经济特权"]]},
    {cardId: "selection-thought-ritual::zheng-bi-difference", question: "征与辟的共同点和区别是什么？", requiredTermGroups: [["聘任", "聘请"], ["皇帝"], ["官府"]]},
    {cardId: "selection-thought-ritual::nine-rank-operation", question: "九品中正制由谁考察，考察什么，如何分级？", requiredTermGroups: [["中正官"], ["出身"], ["品德"], ["九个品级", "九品"]]},
    {cardId: "selection-thought-ritual::imperial-exam-first-places", question: "院试、乡试、会试、殿试第一名分别叫什么？", requiredTermGroups: [["案首"], ["解元"], ["会元"], ["状元"]]},
    {cardId: "traditional-thought-ritual::confucius-identity-teachings", question: "孔子的身份和三项主要思想是什么？", requiredTermGroups: [["儒家"], ["仁者爱人"], ["以德治民"], ["克己复礼"]]},
    {cardId: "traditional-thought-ritual::three-bonds-five-constants", question: "三纲五常分别包括什么？", requiredTermGroups: [["君为臣纲"], ["父为子纲"], ["夫为妻纲"], ["仁", "义", "礼", "智", "信"]]},
    {cardId: "traditional-thought-ritual::strategists-alliance", question: "纵横家做什么，苏秦和张仪分别属于哪一派？", requiredTermGroups: [["游说诸侯", "政治外交"], ["苏秦"], ["合纵"], ["张仪"], ["连横"]]},
    {cardId: "traditional-thought-ritual::late-ming-three-thinkers", question: "明末清初三大思想家及其主要观点是什么？", requiredTermGroups: [["王夫之"], ["黄宗羲"], ["顾炎武"], ["经世致用"]]},
    {cardId: "ritual-system::five-rites-classification", question: "五礼有哪些，各自对应什么事务？", requiredTermGroups: [["吉礼"], ["嘉礼"], ["宾礼"], ["军礼"], ["凶礼"]]},
    {cardId: "ritual-system::festive-rite-scope", question: "嘉礼的用途是什么，哪些礼仪属于嘉礼？", requiredTermGroups: [["人际关系", "联络感情"], ["冠礼"], ["笄礼"], ["婚礼"]]},
    {cardId: "ritual-system::six-marriage-rites", question: "婚礼六礼按顺序是什么？", requiredTermGroups: [["纳采"], ["问名"], ["纳吉"], ["纳征"], ["请期"], ["亲迎"]]},
    {cardId: "ritual-system::funeral-rank-terms", question: "天子、诸侯、大夫、士和庶人的死亡称谓分别是什么？", requiredTermGroups: [["崩"], ["薨"], ["卒"], ["不禄"], ["死"]]},
  ],
};
