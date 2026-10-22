// S4 batch: authored learning candidates. No automatic human approval.
const { ref, question, mnemonic } = require("./learning-authoring");
const questions = [], mnemonics = [], groups = [];
const verificationSources = {
  "civil-code-official": { title: "中华人民共和国民法典", url: "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_60fb3863b7364b759123a42d1df568ca.html", publisher: "国家市场监督管理总局", version: "2020年5月28日通过，2021年1月1日起施行", checkedAt: "2026-10-20", retrieved: true },
  "constitution-official": { title: "中华人民共和国宪法", url: "https://www.zlb.gov.cn/2018-03/22/c_1210379527.htm", publisher: "中央政府驻澳门联络办公室", version: "2018年修正文本目录", checkedAt: "2026-10-20", retrieved: true },
};
const civil = (locators) => ({ checkedAt: "2026-10-20", sourceIds: ["civil-code-official"], locators });
const constitution = { checkedAt: "2026-10-20", sourceIds: ["constitution-official"], locators: ["目录：正文第一至四章"] };

function theme(id, scope, title, reason, items, memory, verification, noMnemonicReason) {
  const qs = items.map((item) => ({ ...question(item[0], scope, id, ...item.slice(1)), ...(verification ? { verification } : {}) }));
  questions.push(...qs);
  groups.push({ id, scope, title, reason, questionIds: qs.map((q) => q.id),
    mnemonicDecision: memory ? "authored" : "not-suitable", mnemonicReason: memory ? "本组声明目标已有逐句记忆线索，未声明覆盖整个正文。" : noMnemonicReason });
  if (memory) {
    const phrases = memory.phrases.map(([phrase, meaning, indexes]) => ({ phrase, meaning,
      questionIds: indexes.map((i) => qs[i].id), refs: indexes.flatMap((i) => qs[i].refs) }));
    mnemonics.push({ ...mnemonic(id + "-memory", scope, title, memory.text, memory.coverage,
      memory.excludes, phrases, qs.map((q) => q.id)), method: memory.method || "对照记忆",
      ...(verification ? { verification } : {}) });
  }
}
const thought = ref("traditional-thought-ritual", "hundred-schools", "cs-10-15-p12-p13-hundred-schools-list");
theme("schools-pairing", "humanities-history", "道、墨、法怎么配", "只记三组代表人物与主张，不把百家思想混为一谈。", [
  ["school-lao", "老子与道家对应", "《道德经》及道家创始人的对应，哪组正确？", ["老子—道家", "墨子—道家", "韩非—道家"], 0, "正文将老子列为道家创始人，著有《道德经》。", "本题不涉及道教宗教史，也不穷举道家代表人物。", [thought]],
  ["school-mo", "兼爱非攻与墨子对应", "“兼爱、非攻”对应哪一家？", ["法家", "墨家", "名家"], 1, "墨子提出兼爱、非攻等主张。", "这两个词只是墨家部分主张，不能当作完整思想体系。", [thought]],
  ["school-fa", "法术势与法家对应", "“法、术、势相结合”在本节对应哪一家？", ["道家", "墨家", "法家"], 2, "正文把法术势相结合列在法家部分。", "这里辨认古代学派，不把古代法家直接等同于现代法治。", [thought]],
], { text: "老子道，墨兼非攻，法家法术势。", coverage: "老子与道家、墨家兼爱非攻、法家法术势三组对应。", excludes: ["百家所有代表人物", "思想的完整内涵与历史演变"], phrases: [["老子道", "老子对应道家。", [0]], ["墨兼非攻", "墨家主张兼爱、非攻。", [1]], ["法家法术势", "法家部分记住法、术、势的组合。", [2]]] });

const history = ref("fiction-history-modern-literature", "historiography-works", "cs-10-15-p9-historiography-table");
theme("history-genres", "humanities-history", "三部史书分体例", "把通史、断代史与纪传、编年两个维度分开。", [
  ["history-shiji", "史记为纪传体通史", "《史记》的体例与范围应如何配对？", ["编年体通史", "纪传体通史", "纪传体断代史"], 1, "《史记》是纪传体通史，作者司马迁。", "纪传或编年是叙述体例；通史或断代史是记述范围。", [history]],
  ["history-tongjian", "资治通鉴为编年体通史", "《资治通鉴》与哪组关键词对应？", ["司马迁—纪传体", "班固—断代史", "司马光—编年体通史"], 2, "北宋司马光主持编纂《资治通鉴》，正文将其列为编年体通史。", "与《史记》同为通史，但体例不同。", [history]],
  ["history-hanshu", "汉书为纪传体断代史", "《汉书》与《史记》的关键范围区别是什么？", ["《汉书》是断代史，《史记》是通史", "《汉书》不是纪传体", "两者都只记一年"], 0, "《汉书》为纪传体断代史，《史记》为纪传体通史。", "这里只比较体例与范围，不代替作者、朝代和篇目学习。", [history]],
], { text: "史记纪传通，通鉴编年通；汉书纪传断。", coverage: "《史记》《资治通鉴》《汉书》的体例与记述范围。", excludes: ["其他史书的作者和地位", "全书篇目、具体历史事件"], phrases: [["史记纪传通", "《史记》：纪传体、通史。", [0]], ["通鉴编年通", "《资治通鉴》：编年体、通史。", [1]], ["汉书纪传断", "《汉书》：纪传体、断代史。", [2]]] });

const light = ref("optics", "light-propagation", "cs-16-22-p11-p12-light-propagation-list");
theme("light-phenomena", "science-technology", "影子、倒影与折筷", "把生活现象对应到三种基本传播规律。", [
  ["light-shadow", "影子对应直线传播", "在同种均匀介质的通常情境下，影子的形成主要对应什么？", ["光的直线传播", "光的折射", "声音的反射"], 0, "正文把影子的形成列为光直线传播的应用。", "题干限定同种均匀介质，不把直线传播说成任何介质中都成立。", [light]],
  ["light-reflection", "水面倒影对应反射", "平静水面上的倒影，主要利用什么现象？", ["光的折射", "光的反射", "物体真的沉到水下"], 1, "平静水面的倒影属于光的反射。", "倒影与从水上看水底物体偏浅应分开。", [light]],
  ["light-refraction", "水中筷子看似弯折对应折射", "筷子斜插入水中，看起来在水面处弯折，主要是什么原因？", ["筷子一定发生形变", "光只能直线传播", "光从不同介质间传播发生折射"], 2, "正文将水中筷子看似弯折列为折射现象。", "是观察到的光学效果，不表示筷子实际折断。", [light]],
], { text: "影子直，倒影反；水中折筷看折射。", coverage: "影子、平静水面倒影、水中筷子看似弯折三个现象。", excludes: ["透镜成像公式", "散射、全反射与复杂复合现象"], phrases: [["影子直", "同种均匀介质中，影子对应直线传播。", [0]], ["倒影反", "水面倒影对应反射。", [1]], ["水中折筷看折射", "看似弯折来自折射。", [2]]] });

const heat = ref("thermodynamics", "heat-transfer", "cs-16-22-p13-heat-transfer-table");
theme("heat-mechanisms", "science-technology", "传热三种方式", "按传递机制区分传导、对流、辐射。", [
  ["heat-conduction", "热传导从高温向低温传递", "同一物体不同温度部分之间，热从高温部分向低温部分传递，属于哪种方式？", ["热对流", "热传导", "物态升华"], 1, "本节用高温向低温部分传递描述热传导。", "这里只辨机制，不用一个生活场景断定其中只有一种传热方式。", [heat]],
  ["heat-convection", "对流伴随冷热流体掺混", "冷热流体相互掺混引起的热量传递，属于什么？", ["热辐射", "热传导", "热对流"], 2, "流体的运动和掺混是本题辨认热对流的线索。", "流体运动是关键，不把所有传热都叫对流。", [heat]],
  ["heat-radiation", "辐射通过电磁辐射传热", "以电磁辐射形式向外发散热量，对应什么传热方式？", ["热辐射", "热对流", "热膨胀"], 0, "热辐射对应电磁辐射传热。", "不要求物体之间通过流体直接掺混。", [heat]],
], { text: "传导沿物传，对流随流动，辐射电磁送。", coverage: "三种传热方式的基本机制。", excludes: ["复杂场景的定量传热", "物态变化与保温装置的完整分析"], phrases: [["传导沿物传", "高温部分向低温部分传递。", [0]], ["对流随流动", "冷热流体运动掺混传热。", [1]], ["辐射电磁送", "以电磁辐射形式传热。", [2]]] });

const pure = ref("chemistry", "pure-substance", "cs-16-22-p16-pure-substance-list");
const mixture = ref("chemistry", "mixture", "cs-16-22-p16-mixture-list");
const simple = ref("chemistry", "simple-substance", "cs-16-22-p16-simple-substance-list");
const compound = ref("chemistry", "compound", "cs-16-22-p16-compound-list");
theme("substance-classification", "science-technology", "先分物质，再看元素", "纯净与混合看物质种类；单质与化合物在纯净物内看元素种类。", [
  ["substance-pure", "纯净物和混合物看物质种类", "只由一种物质组成，按本节定义应归为什么？", ["混合物", "一定是单质", "纯净物"], 2, "一种物质组成的是纯净物；两种或多种物质混合形成混合物。", "纯净物还可以分为单质和化合物，不能直接等同单质。", [pure, mixture]],
  ["substance-simple", "单质是同种元素构成的纯净物", "“由同种元素组成”还需满足什么条件，才符合单质定义？", ["属于纯净物", "属于混合物", "必须是金属"], 0, "单质定义包含同种元素和纯净物两个条件。", "不能省略纯净物条件；也不限定为金属。", [simple]],
  ["substance-compound", "化合物含多种元素且是纯净物", "二氧化碳在本节被列为哪类物质的例子？", ["金属单质", "化合物", "混合物"], 1, "正文将二氧化碳列为由多种元素组成的纯净物，即化合物的例子。", "这里不涉及有机与无机的进一步分类。", [compound]],
], { text: "纯混先数物质；纯净再分单化，单看一元，化看多元。", coverage: "纯净物/混合物的分类维度，以及单质/化合物的完整前提。", excludes: ["同素异形体的具体判断", "有机、无机及酸碱盐分类"], phrases: [["纯混先数物质", "一种物质为纯净物，多种物质混合为混合物。", [0]], ["纯净再分单化，单看一元", "单质必须是同种元素组成的纯净物。", [1]], ["化看多元", "化合物是多种元素组成的纯净物。", [2]]] });

const demand = ref("microeconomics", "demand-meaning", "cs-23-30-p8-demand-meaning-list");
const supply = ref("supply-theory", "supply-meaning", "cs-23-30-p10-supply-meaning-list");
theme("demand-supply-roles", "economics", "需求和供给先分角色", "把愿意、能够两个条件和买卖角色放在一起判断。", [
  ["demand-conditions", "需求同时要求愿意和能够购买", "按需求定义，消费者需要同时具备什么？", ["只愿意购买", "愿意且能够购买", "只觉得商品好看"], 1, "需求同时包含购买意愿和购买能力。", "还须结合一定时期和价格水平，不能把愿望总量直接当作需求量。", [demand]],
  ["supply-conditions", "供给由生产者愿意且能够出售构成", "供给定义中的行为主体与行为是哪一组？", ["消费者—想购买", "生产者—只想收藏", "生产者—愿意且能够提供出售"], 2, "供给关注生产者在一定时期、价格下愿意且能够提供出售的数量。", "生产了但不愿或不能出售，不直接等同于定义中的供给。", [supply]],
  ["demand-wish", "只有购买意愿不构成需求", "某人想买商品但在该价格下没有购买能力，只有这一愿望能否计作需求？", ["不能，还缺购买能力", "能，只要想买即可", "能，与价格和时期无关"], 0, "本题缺少能够购买这一条件。", "是按题设和定义判断，不评价个人真实消费情况。", [demand]],
], { text: "愿且能，才入门；买看需求，卖看供给。", coverage: "需求和供给的意愿/能力条件与买卖角色。", excludes: ["需求供给曲线移动", "价格弹性、均衡与特殊商品"], phrases: [["愿且能，才入门", "需求不能只有愿望，还需购买能力。", [0, 2]], ["买看需求，卖看供给", "需求从消费者购买看，供给从生产者出售看。", [1]]] });

const macro = ref("macro-control-goals-overview", "macro-goals-overview", "cs-23-30-p14-macro-goals-overview-list");
theme("macro-four-goals", "economics", "宏观目标四项对照", "记住四类目标，避免把国际收支与财政收支混同。", [
  ["macro-growth", "促进经济增长属于宏观目标", "哪项属于本节列出的宏观调控目标？", ["促进经济增长", "保证每件商品都涨价", "让所有企业利润相同"], 0, "促进经济增长是本节列出的目标之一。", "列出目标不表示所有目标在任何时期都能同时充分实现。", [macro]],
  ["macro-jobs-prices", "增加就业和稳定物价对应两类目标", "“两增一稳”中的另一增和一稳，分别指什么？", ["增加税收、稳定汇率", "增加就业、稳定物价", "增加库存、稳定利润"], 1, "本节口诀用两增指经济增长、增加就业，一稳指稳定物价。", "这是四项目标的记忆线索，不是当前政策取向判断。", [macro]],
  ["macro-balance", "国际收支平衡与财政收支不同", "四项目标中的“保平衡”对应什么？", ["每户家庭收支相等", "每家企业收支相等", "保持国际收支平衡"], 2, "这里的平衡指国际收支平衡。", "不能替换成政府财政收入与支出必须相等。", [macro]],
], { text: "增长、就业两项增，物价要稳，国际收支保平衡。", coverage: "经济增长、增加就业、稳定物价、国际收支平衡四个目标名称。", excludes: ["目标之间的权衡和定量指标", "具体年份政策及财政预算平衡"], phrases: [["增长", "促进经济增长。", [0]], ["就业两项增，物价要稳", "增加就业与稳定物价。", [1]], ["国际收支保平衡", "平衡所指为国际收支。", [2]]] });

const fiscal = ref("fiscal-policy", "fiscal-definition", "cs-23-30-p17-fiscal-policy-definition-list");
const monetary = ref("monetary-policy", "monetary-definition", "cs-23-30-p20-monetary-policy-definition-list");
const monetaryApplication = ref("monetary-policy", "monetary-application", "cs-23-30-p20-monetary-policy-application-table");
theme("fiscal-monetary", "economics", "财政与货币政策辨析", "先看实施主体和工具，再辨教材中的基本方向。", [
  ["policy-fiscal", "预算税收对应财政政策", "政府运用国家预算、税收等财政手段，主要对应哪类政策？", ["货币政策", "财政政策", "人口政策"], 1, "国家预算和税收是财政政策的识别线索。", "此题只辨类别，不把所有政策效果归于一种工具。", [fiscal]],
  ["policy-monetary", "央行调控货币供应量对应货币政策", "中央银行控制和调节货币供应量，对应什么政策？", ["企业分红政策", "政府采购计划", "货币政策"], 2, "本节以中央银行调节货币供应量定义货币政策。", "不是指某一时点的实际政策状态。", [monetary]],
  ["policy-bond-purchase", "央行买债对应基本扩张方向", "按教材的基本机制，央行在公开市场买入债券，列在哪一栏？", ["扩张性货币政策", "紧缩性货币政策", "必然减少货币供应"], 0, "正文政策运用表将公开市场买入债券列在扩张性一栏。", "是基础机制辨析，不据此推断某次实际操作的全部政策效果。", [monetaryApplication]],
], { text: "预算税收看财政，央行货币看货币；公开买债记扩张。", coverage: "财政/货币政策的两类识别线索和央行公开买债的教材方向。", excludes: ["现实货币政策框架全貌", "具体政策判断、投资建议与传导效果"], phrases: [["预算税收看财政", "国家预算、税收属于财政手段。", [0]], ["央行货币看货币", "央行调节货币供应量对应货币政策。", [1]], ["公开买债记扩张", "只记教材表中的基本方向。", [2]]] });

const capacity = ref("civil-subjects", "behavior-capacity", "cs-31-37-p6-p7-natural-person-behavior-capacity-table");
const rightsCapacity = ref("civil-subjects", "rights-capacity", "cs-31-37-p5-natural-person-rights-capacity-table");
theme("minor-capacity", "law", "未成年人行为能力三例", "用年龄与生活来源条件逐项判断，不只背数字。", [
  ["capacity-under-eight", "不满八周岁属于无民事行为能力", "只按年龄判断，7 周岁的未成年人属于哪类？", ["无民事行为能力人", "限制民事行为能力人", "完全民事行为能力人"], 0, "不满八周岁的未成年人为无民事行为能力人。", "民事行为能力与从出生起具有的民事权利能力是两个概念。", [capacity, rightsCapacity]],
  ["capacity-eight-plus", "八周岁以上未成年人原则上受限制", "已满 8 周岁、未满 18 周岁，能辨认自己行为且不满足劳动收入例外，通常属于哪类？", ["无民事行为能力人", "限制民事行为能力人", "完全民事行为能力人"], 1, "这类未成年人通常为限制民事行为能力人。", "不等于所有行为都无效；纯获利益或与年龄智力相适应的行为可独立实施。", [capacity]],
  ["capacity-labor", "十六周岁以上劳动收入例外", "17 周岁且能辨认自己行为，以自己劳动收入为主要生活来源，应如何判断？", ["只能是无民事行为能力人", "只要未满 18 岁就绝无例外", "视为完全民事行为能力人"], 2, "十六周岁以上的未成年人，满足以自己的劳动收入为主要生活来源条件的，视为完全民事行为能力人。", "偶尔有收入不自动满足主要生活来源条件；精神健康因素另行判断。", [capacity]],
], null, civil(["第13条", "第17—22条"]), "年龄、辨认能力、劳动收入及行为效力的条件不能压成一句数字口诀；本组采用三例辨析。");

const inheritance = ref("inheritance-methods", "statutory-inheritance", "cs-31-37-p21-p22-statutory-inheritance-table");
theme("inheritance-order", "law", "法定继承顺序与例外", "先分两顺序，再补丧偶姻亲的法定条件。", [
  ["inherit-first", "第一顺序的三类亲属", "法定继承的一般第一顺序是哪组？", ["兄弟姐妹、祖父母、外祖父母", "配偶、子女、父母", "朋友、同事、邻居"], 1, "一般第一顺序为配偶、子女、父母。", "这是一般列举；亲属定义、法定例外和其他继承方式应另看。", [inheritance]],
  ["inherit-second", "第二顺序的三类亲属", "法定继承的一般第二顺序是哪组？", ["配偶、子女、父母", "所有亲属同时继承", "兄弟姐妹、祖父母、外祖父母"], 2, "一般第二顺序为兄弟姐妹、祖父母、外祖父母。", "第一顺序有人继承时，第二顺序原则上不继承；此题不推算具体份额。", [inheritance]],
  ["inherit-inlaw", "丧偶姻亲尽主要赡养义务的特别规则", "丧偶儿媳对公婆尽了主要赡养义务，依法可作为什么顺序继承人？", ["第一顺序继承人", "只能是第二顺序继承人", "一概没有继承资格"], 0, "丧偶儿媳对公婆、丧偶女婿对岳父母，尽主要赡养义务的，作为第一顺序继承人。", "必须保留丧偶与尽主要赡养义务条件，不能泛化成所有儿媳女婿均属第一顺序。", [inheritance]],
], { text: "一顺配、子、父；二顺兄弟姐妹、祖与外祖；丧偶姻亲尽主要赡养，也作一顺。", coverage: "法定继承一般两顺序及丧偶儿媳/女婿的特定例外。", excludes: ["遗嘱、遗赠扶养协议及代位继承", "亲属定义、丧失继承权与遗产份额"], phrases: [["一顺配、子、父", "配偶、子女、父母。", [0]], ["二顺兄弟姐妹、祖与外祖", "兄弟姐妹、祖父母、外祖父母。", [1]], ["丧偶姻亲尽主要赡养，也作一顺", "完整条件见释义，不泛化所有姻亲。", [2]]] }, civil(["第1127条", "第1129条"]));

const equality = ref("civil-basic-principles", "civil-principle-1", "cs-31-37-p4-civil-principle-kp-1");
const voluntary = ref("civil-basic-principles", "civil-principle-2", "cs-31-37-p4-civil-principle-kp-2");
const fairness = ref("civil-basic-principles", "civil-principle-3", "cs-31-37-p4-civil-principle-kp-3");
const lawful = ref("civil-basic-principles", "civil-principle-5", "cs-31-37-p4-civil-principle-kp-5");
theme("civil-principles-compare", "law", "平等、自愿、公平怎么分", "按法条的直接表述区分，避免仅凭单词套复杂案例。", [
  ["civil-equality", "平等原则关涉法律地位", "民事主体的法律地位一律平等，直接对应什么原则？", ["公平原则", "自愿原则", "平等原则"], 2, "本题直接辨认民事主体法律地位平等的表述。", "平等与公平不是同一个词；现实案例可能同时涉及多项原则。", [equality]],
  ["civil-voluntary", "自愿原则关涉意思自治", "按自己的意思设立、变更、终止民事法律关系，直接对应什么？", ["自愿原则", "平等原则", "绿色原则"], 0, "自愿原则也称意思自治原则。", "自愿不意味着可以违反法律或公序良俗。", [voluntary, lawful]],
  ["civil-fairness", "公平原则关涉合理确定权利义务", "合理确定各方权利和义务，直接对应什么原则？", ["自愿原则", "公平原则", "绿色原则"], 1, "合理确定各方权利义务是公平原则的表述。", "不把具体案件的结论仅归因于某个关键词。", [fairness]],
], null, civil(["第4—6条", "第8条"]), "三项原则的边界更适合对照辨析；不编可能造成机械套用的关键词口诀。");

const structure = ref("constitution-structure", "constitution-structure", "cs-23-30-p25-constitution-structure-list");
theme("constitution-chapters", "law", "宪法正文四章顺序", "用章节归属帮助快速定位正文，不混淆序言与正文。", [
  ["constitution-first", "正文第一章为总纲", "我国宪法正文的第一章是什么？", ["总纲", "国家机构", "附则"], 0, "正文第一章为总纲；序言在正文之前。", "我国宪法有序言和正文，不把序言计为正文第一章。", [structure]],
  ["constitution-second", "正文第二章为公民基本权利义务", "公民的基本权利和义务位于正文哪一章？", ["第一章", "第二章", "第四章"], 1, "正文第二章是公民的基本权利和义务，第三章是国家机构。", "这里只定位章节，不代替具体权利义务条文学习。", [structure]],
  ["constitution-fourth", "正文第四章为国家标志与首都", "正文第四章的完整主题是哪组？", ["国家机构与选举制度", "只有国旗和首都", "国旗、国歌、国徽、首都"], 2, "第四章包括国旗、国歌、国徽和首都。", "不删去国歌或国徽；国家机构另在第三章。", [structure]],
], { text: "总纲在前，权义随后，国家机构第三，旗歌徽都第四。", coverage: "宪法正文四章的顺序与第四章的四个主题。", excludes: ["各章具体条文", "修宪历史、国家机构职权与国家标志设计史"], phrases: [["总纲在前", "正文第一章总纲，序言不计入章序。", [0]], ["权义随后，国家机构第三", "第二章公民基本权利义务，第三章国家机构。", [1]], ["旗歌徽都第四", "第四章国旗、国歌、国徽、首都。", [2]]] }, constitution);

module.exports = { questions, mnemonics, groups, verificationSources };
