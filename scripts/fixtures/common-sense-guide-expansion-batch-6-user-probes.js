module.exports = {
  schemaVersion: 1,
  batchId: "common-sense-guide-expansion-batch-6",
  purpose: "只向测试者提供标题和卡片正文，检查其能否回答发明发展、著作人物、天文计时、地理方位和传统医学问题。",
  cases: [
    {cardId: "ancient-science-medicine::paper-before-cai-lun", question: "蔡伦以前是否已有纸，蔡伦的贡献是什么？", requiredTermGroups: [["西汉"], ["絮纸", "麻纤维纸"], ["改进造纸术"]]},
    {cardId: "ancient-science-medicine::bi-sheng-movable-type", question: "毕昇在什么时代完成了什么技术？", requiredTermGroups: [["北宋"], ["毕昇"], ["活字印刷术"]]},
    {cardId: "ancient-science-medicine::compass-development", question: "指南技术从战国到北宋如何发展？", requiredTermGroups: [["战国"], ["司南"], ["北宋"], ["磁针"], ["航海"]]},
    {cardId: "ancient-science-medicine::zhoubi-gougu", question: "《周髀算经》记载了什么勾股数值关系？", requiredTermGroups: [["勾三"], ["股四"], ["弦五"], ["直角三角形"]]},
    {cardId: "ancient-science-medicine::taichu-calendar", question: "《太初历》由谁在何时制定，有哪些变化？", requiredTermGroups: [["汉武帝"], ["邓平"], ["正月"], ["二十四节气"]]},
    {cardId: "ancient-science-medicine::zhang-heng-seismoscope", question: "地动仪能做什么，不能做什么？", requiredTermGroups: [["指示", "指明"], ["地震"], ["方位"], ["不能", "预测"]]},
    {cardId: "ancient-science-medicine::guo-shoujing-instruments", question: "简仪和圭表各自有什么用途？", requiredTermGroups: [["简仪"], ["观测天象"], ["圭表"], ["计时"]]},
    {cardId: "ancient-science-medicine::zi-hour-night", question: "子时对应什么时间，还有哪些名称？", requiredTermGroups: [["23"], ["1时"], ["夜半"], ["三更"]]},
    {cardId: "ancient-science-medicine::datang-xiyu-ji", question: "《大唐西域记》中玄奘和辩机分别做了什么？", requiredTermGroups: [["玄奘"], ["口述"], ["辩机"], ["撰文", "执笔"]]},
    {cardId: "ancient-science-medicine::mountain-water-yin-yang", question: "山水四个方位怎样区分阴阳？", requiredTermGroups: [["山的南面", "山南"], ["水的北岸", "水北"], ["阳"], ["山的北面", "山北"], ["水的南岸", "水南"], ["阴"]]},
    {cardId: "ancient-science-medicine::nongzheng-quanshu", question: "《农政全书》的作者、时代和内容是什么？", requiredTermGroups: [["明末"], ["徐光启"], ["农学"], ["欧洲水利"]]},
    {cardId: "ancient-science-medicine::hua-tuo-achievements", question: "华佗有哪些医学与健身成果？", requiredTermGroups: [["外科"], ["麻沸散"], ["五禽戏"], ["虎"], ["鹿"], ["熊"], ["猿"], ["鸟"]]},
  ],
};
