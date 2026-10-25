module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-9",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答年龄称谓、谦敬辞、代称和成语出处问题。",
  cases: [
    {cardId:"classical-language-allusions::childhood-age-titles",question:"始龀、垂髫和总角分别指什么年龄？",requiredTermGroups:[["七八岁"],["三四岁"],["八九岁"],["十三四岁"]]},
    {cardId:"classical-language-allusions::youth-gender-titles",question:"束发、豆蔻和及笄如何区分？",requiredTermGroups:[["十五岁"],["女子十三四岁"],["女子十五岁"]]},
    {cardId:"classical-language-allusions::sixty-to-hundred",question:"花甲、古稀、耄耋和期颐分别对应多少岁？",requiredTermGroups:[["六十岁"],["七十岁"],["八九十岁"],["一百岁"]]},
    {cardId:"classical-language-allusions::reign-temple-posthumous",question:"年号、庙号和谥号的设置时间及用途有何区别？",requiredTermGroups:[["在位"],["纪年"],["去世后","死后"],["庙号"],["谥号"]]},
    {cardId:"classical-language-allusions::zhiyin-jingjiao",question:"知音之交和刎颈之交分别对应谁？",requiredTermGroups:[["伯牙"],["子期"],["廉颇"],["蔺相如"]]},
    {cardId:"classical-language-allusions::humble-words",question:"谦辞对谁使用，有哪些常见字和例词？",requiredTermGroups:[["自己"],["鄙"],["敝"],["家严"],["家慈"],["舍弟"]]},
    {cardId:"classical-language-allusions::respectful-words",question:"敬辞对谁使用，有哪些常见字和例词？",requiredTermGroups:[["别人","对方"],["令"],["贤"],["令尊"],["令堂"],["令郎"]]},
    {cardId:"classical-language-allusions::cultural-metonyms",question:"杜康、丹青、社稷和丝竹分别代指什么？",requiredTermGroups:[["酒"],["绘画"],["国家"],["音乐"]]},
    {cardId:"classical-language-allusions::event-metonyms",question:"于归、秦晋之好、弄璋和弄瓦是什么意思？",requiredTermGroups:[["女子出嫁"],["婚姻"],["生儿子"],["生女儿"]]},
    {cardId:"classical-language-allusions::xiang-yu-idioms",question:"项羽相关的两个成语是什么，各表示什么？",requiredTermGroups:[["四面楚歌"],["围困","孤立"],["破釜沉舟"],["断绝退路","决心"]]},
    {cardId:"classical-language-allusions::effort-study-idioms",question:"五个勤学典故分别对应谁？",requiredTermGroups:[["匡衡"],["苏秦"],["孙敬"],["车胤"],["孙康"]]},
    {cardId:"classical-language-allusions::colors-weapons-road",question:"皂、干戈和阳关大道原指什么？",requiredTermGroups:[["黑色"],["武器"],["阳关"],["西域"]]},
  ],
};
