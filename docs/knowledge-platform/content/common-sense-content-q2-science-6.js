"use strict";

// Q2 科技第六批：海市蜃楼、彩虹与霓。
// 保留稳定 ID 和题量，改为现象识别、条件判断与综合辨析；蜃景保留速记提纲，虹霓形成可逆结构口诀。

const QUESTION_IDS = [
  "mirage-alias-core", "mirage-cause-core", "mirage-image-core", "mirage-locations-core", "mirage-full",
  "rainbow-cause-core", "rainbow-order-core", "secondary-rainbow-core", "rainbow-sun-position-core", "rainbow-secondary-full",
];

const replacementRows = {
  "mirage-alias-core": { objective: "由大气折射形成的远景识别蜃景名称", prompt: "旅行者在远处看到实际位置并不存在的楼阁影像，这类海市蜃楼现象又称什么？", options: ["日晕", "丁达尔现象", "蜃景"], answer: 2, explanation: "海市蜃楼又称蜃景；它是大气光学现象，不是日晕或丁达尔现象。", boundary: "名称识别不等于说明具体大气分层和光路。" },
  "mirage-cause-core": { objective: "从空气层密度差异识别蜃景的光学机制", prompt: "炎热公路上方的空气密度分布不均，远处景物的光线传播方向连续改变。该现象主要涉及什么机制？", options: ["粗糙路面将景物光线漫反射到观察者眼中", "光在不同空气层中折射，特定条件下还可发生全反射", "远处物体受热后在空气中主动发出一幅新的可见影像"], answer: 1, explanation: "蜃景与光在密度不同的空气层中传播有关，主要涉及折射，并可在特定条件下出现全反射。", boundary: "这里只判断主要光学机制，不计算空气折射率或绘制光路。" },
  "mirage-image-core": { objective: "依据影像位置与物体位置的差异判断蜃景像的性质", prompt: "观察者看见远处景物仿佛悬在空中，但影像位置并没有对应实物。该影像应怎样判断？", options: ["物体反射光经大气折射形成的虚像", "景物移动到空中后形成的实像", "空气像屏幕一样在影像位置承接形成的实像"], answer: 0, explanation: "远处物体反射的光经大气折射后进入人眼，观察者沿光线反向延长看到虚像。", boundary: "看见影像不表示物体实际位于影像所在位置。" },
  "mirage-locations-core": { objective: "由环境特征识别蜃景常见地点", prompt: "下列哪组环境更符合蜃景常见地点的共同特征？", options: ["密闭地下室、金属容器或真空设备内部", "恒温室内与遮光隧道深处", "平静水面、雪原、沙漠或戈壁"], answer: 2, explanation: "平静海面、江湖水面、雪原、沙漠和戈壁均属于常见蜃景地点。", boundary: "地点只是常见环境线索，不能替代当时大气条件的判断。" },
  "mirage-full": { objective: "综合判断蜃景的名称、机制、像和常见环境", prompt: "某地在炎热天气中出现远处建筑倒影。下列分析完整正确的是？", options: ["该现象就是霓，主要由雨滴反射形成", "该现象可称蜃景，涉及大气折射并形成虚像，水面或沙漠等地较常见", "该影像说明建筑已经离开原处并移动到观察者所见影像所在的空中真实位置"], answer: 1, explanation: "蜃景是海市蜃楼的别称，主要涉及大气折射和特定条件下的全反射，观察到的是虚像。", boundary: "综合判断不延伸到具体气象预测或定量光路。" },
  "rainbow-cause-core": { objective: "从阳光与雨滴情境识别彩虹形成过程", prompt: "雨后阳光照射空气中的水滴，观察者看到彩色弧带。其主要光学过程是？", options: ["阳光进入水滴后发生折射和反射", "水滴吸收阳光后自行发出七色光", "阳光绕过水滴后保持原方向传播"], answer: 0, explanation: "阳光进入雨滴后发生折射和反射，不同颜色的光分开形成彩色弧带。", boundary: "这里只识别主要过程，不计算各色光的偏折角。" },
  "rainbow-order-core": { objective: "依据主虹内外方向判断色序", prompt: "观察一条清晰主虹，从弧带外侧向内侧记录颜色，正确顺序是？", options: ["紫、靛、蓝、绿、黄、橙、红", "红、黄、蓝、绿、橙、靛、紫", "红、橙、黄、绿、蓝、靛、紫"], answer: 2, explanation: "主虹由外到内依次为红、橙、黄、绿、蓝、靛、紫。", boundary: "副虹色序与主虹相反，不能直接套用主虹顺序。" },
  "secondary-rainbow-core": { objective: "根据位置、明暗和色序识别副虹", prompt: "主虹外侧还出现一条较暗的彩色弧带，色序与主虹相反。对此判断正确的是？", options: ["这是主虹在云层上的镜面倒影，形成过程与水滴无关", "这是副虹，也称霓，阳光在水滴中发生两次反射", "这是日晕，位置应在太阳同一方向附近"], answer: 1, explanation: "副虹又称霓，位于主虹外侧且较暗，由阳光在水滴中两次反射形成，色序与主虹相反。", boundary: "不展开水滴内部的完整光路或能量损失计算。" },
  "rainbow-sun-position-core": { objective: "利用太阳与虹相反方位判断观察方向", prompt: "雨后清晨太阳位于东方，若条件合适，观察者应主要向哪个方向寻找彩虹？", options: ["西方", "东方", "太阳正上方"], answer: 0, explanation: "太阳和彩虹通常位于观察者的相反方向；太阳在东时，彩虹在西。", boundary: "这里只判断基本相对方位，不推断彩虹出现的持续时间。" },
  "rainbow-secondary-full": { objective: "综合区分主虹、副虹及太阳方位", prompt: "关于雨后同时出现的主虹和副虹，下列记录完整正确的是？", options: ["主虹外紫内红；副虹位于主虹内侧且亮度更高；观察虹时太阳与虹处在同一方向", "主虹与副虹色序相同；副虹由空气尘埃散射形成；虹在太阳一侧", "主虹外红内紫；副虹位于外侧且较暗、色序相反；观察虹时太阳在身后"], answer: 2, explanation: "主虹外红内紫，副虹在主虹外侧且较暗、色序相反；太阳和虹位于相反方向。", boundary: "综合辨析不涉及波长、折射角或亮度的定量计算。" },
};

const distractorReasons = {
  "mirage-alias-core": { 0: "日晕是太阳周围的光学现象，不是海市蜃楼的别称。", 1: "丁达尔现象属于散射现象，不是海市蜃楼的别称。" },
  "mirage-cause-core": { 0: "单纯漫反射不能解释景物光线在不同空气层中连续改变方向。", 2: "蜃景来自景物反射光传播路径的改变，不是物体主动发出新影像。" },
  "mirage-image-core": { 1: "观察到的景物没有移动到影像位置，因此不是由景物移动形成的实像。", 2: "空气没有在影像位置充当承接光线的屏幕，该判断不符合虚像特征。" },
  "mirage-locations-core": { 0: "密闭地下室和金属内部不属于所列常见蜃景环境。", 1: "恒温室内与遮光隧道缺少题干所需的大气层差异线索。" },
  "mirage-full": { 0: "霓是副虹，形成于雨滴中的折射和反射，不能与蜃景互换。", 2: "蜃景是光路改变形成的虚像，不表示建筑实际移动。" },
  "rainbow-cause-core": { 1: "水滴没有吸收阳光后主动发出七色光，彩色弧带来自光路变化。", 2: "形成彩虹时阳光进入水滴并改变方向，不是保持原方向绕过水滴。" },
  "rainbow-order-core": { 0: "该顺序是主虹色序的反向排列，更接近副虹由外到内的方向。", 1: "该排列没有遵循主虹由外到内的连续色序。" },
  "secondary-rainbow-core": { 0: "副虹与水滴内两次反射有关，不是脱离水滴形成的镜面倒影。", 2: "日晕围绕太阳出现，题干描述的是主虹外侧的反色弧带。" },
  "rainbow-sun-position-core": { 1: "太阳与彩虹位于观察者相反方向，向东迎着太阳不符合该关系。", 2: "彩虹的基本方位关系是与太阳相反，不能仅凭题干判断在正上方。" },
  "rainbow-secondary-full": { 0: "主虹色序、副虹位置和明暗、太阳方位均被颠倒。", 1: "副虹与主虹色序相反，并非由尘埃散射形成。" },
};

const cognitiveLevels = {
  "mirage-alias-core": "recall", "mirage-cause-core": "application", "mirage-image-core": "application", "mirage-locations-core": "application", "mirage-full": "synthesis",
  "rainbow-cause-core": "application", "rainbow-order-core": "recall", "secondary-rainbow-core": "distinction", "rainbow-sun-position-core": "application", "rainbow-secondary-full": "synthesis",
};
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，改为观察情境、条件判断或综合辨析，并补齐逐项理由和边界。" }));

const targetRows = {
  "cs-target-mirage-alias": { statement: "能从大气折射形成的远景识别海市蜃楼又称蜃景。", conclusion: "海市蜃楼又称蜃景。", conditions: ["讨论由大气光路变化形成的远景影像。"], excludes: ["不与日晕、虹霓或丁达尔现象混同。"] },
  "cs-target-mirage-cause": { statement: "能从空气层密度差异判断蜃景涉及折射和特定条件下的全反射。", conclusion: "蜃景主要由光在不同空气层中的折射形成，特定条件下可伴随全反射。", conditions: ["空气层密度分布不均，使光的传播方向改变。"], excludes: ["不作折射率计算、光路作图或气象预测。"] },
  "cs-target-mirage-image": { statement: "能依据影像与物体实际位置分离判断蜃景是虚像。", conclusion: "物体反射光经大气折射进入人眼，形成与实物位置不同的虚像。", conditions: ["影像位置没有对应实物，观察者沿入眼光线反向判断位置。"], excludes: ["不把虚像误认为景物移动形成的实像。"] },
  "cs-target-mirage-locations": { statement: "能由水面、雪原、沙漠和戈壁等环境识别蜃景常见地点。", conclusion: "平静海面、江湖水面、雪原、沙漠和戈壁属于常见蜃景地点。", conditions: ["地点提供可能形成明显空气层差异的环境线索。"], excludes: ["出现于常见地点不表示一定形成蜃景。"] },
  "cs-target-rainbow-cause": { statement: "能从阳光进入雨滴的情境识别彩虹涉及折射和反射。", conclusion: "阳光进入雨滴后经折射和反射形成彩色弧带。", conditions: ["阳光、空气中的水滴和合适观察方向同时存在。"], excludes: ["不计算各色光偏折角或讨论完整光谱。"] },
  "cs-target-rainbow-order": { statement: "能按主虹由外到内的方向排列七色色序。", conclusion: "主虹由外到内为红、橙、黄、绿、蓝、靛、紫。", conditions: ["方向明确为主虹外侧到内侧。"], excludes: ["不把副虹的反向色序套用于主虹。"] },
  "cs-target-secondary-rainbow": { statement: "能由外侧、较暗、两次反射和反向色序识别副虹。", conclusion: "副虹又称霓，位于主虹外侧且较暗，由水滴内两次反射形成，色序与主虹相反。", conditions: ["与主虹同时比较位置、明暗、反射次数和色序。"], excludes: ["不把副虹与日晕或主虹镜面倒影混同。"] },
  "cs-target-rainbow-sun-position": { statement: "能利用太阳与虹方向相反判断观察方位。", conclusion: "太阳在东则虹在西，太阳在西则虹在东。", conditions: ["以观察者为参照比较太阳和虹的相对方向。"], excludes: ["不由方位关系推断持续时间或降雨强度。"] },
};

const direct = {
  "cs-target-mirage-alias": "mirage-alias-core", "cs-target-mirage-cause": "mirage-cause-core", "cs-target-mirage-image": "mirage-image-core", "cs-target-mirage-locations": "mirage-locations-core",
  "cs-target-rainbow-cause": "rainbow-cause-core", "cs-target-rainbow-order": "rainbow-order-core", "cs-target-secondary-rainbow": "secondary-rainbow-core", "cs-target-rainbow-sun-position": "rainbow-sun-position-core",
};
const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => [targetId, {
  directQuestionIds: [direct[targetId]],
  variationQuestionIds: [targetId.includes("mirage") ? "mirage-full" : "rainbow-secondary-full"],
  processDifference: "直接题从单一名称、机制、像、地点、色序或方位作判断；综合题把多项关系放入同一观察记录，要求排除跨现象错配。",
}]));

const mnemonicDispositions = [
  { groupId: "optics-mirage", decision: "retain-as-study-outline", resourceId: "mirage-memory", reason: "别称、成因、像和常见地点是四类异质信息，缺少自然可逆的单一画面；保留四栏核对提纲，避免关键词拼接。" },
  { groupId: "optics-rainbow-secondary", decision: "structural-mnemonic-candidate", resourceId: "rainbow-secondary-memory", reason: "以阳光进入雨滴为起点，串联主虹与副虹的反射、内外、明暗、色序及太阳相反方位，可从画面反向还原判断条件。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-life-phenomena" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-life-phenomena", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "optics-mirage" ? { ...item, mnemonicDecision: "study-outline", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "optics-rainbow-secondary" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);
function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "mirage-memory") {
      const phrases = {
        "cs-target-mirage-alias-memory": "名称：海市蜃楼又称蜃景",
        "cs-target-mirage-cause-memory": "成因：空气分层中折射，特定条件伴随全反射",
        "cs-target-mirage-image-memory": "像：物体反射光经大气折射形成虚像",
        "cs-target-mirage-locations-memory": "环境：水面、雪原、沙漠或戈壁较常见",
      };
      return { ...item, revision: item.revision + 1, title: "蜃景四项核对", text: "名称—海市蜃楼又称蜃景；成因—空气分层中的折射，特定条件伴随全反射；像—物体反射光形成虚像；环境—水面、雪原、沙漠或戈壁较常见。", method: "名称—成因—像—环境四栏对照", learningForm: "study-outline", formLabel: "速记提纲", purpose: "把蜃景的四类异质信息分栏核对，避免把地点或别称误当成形成机制。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "study-outline-reference", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-life-phenomena" })) })) };
    }
    if (item.id === "rainbow-secondary-memory") {
      const phrases = {
        "cs-target-rainbow-cause-memory": "日光进雨滴，折射反射成虹",
        "cs-target-rainbow-order-memory": "主虹外红内紫",
        "cs-target-secondary-rainbow-memory": "霓在虹外更暗，两次反射、颜色倒",
        "cs-target-rainbow-sun-position-memory": "太阳在背，虹在对面",
      };
      return { ...item, revision: item.revision + 1, title: "虹霓内外方位诀", text: "日光进雨滴，折射反射成虹；主虹外红内紫。霓在虹外更暗，两次反射、颜色倒；太阳在背，虹在对面。", method: "雨滴画面＋内外明暗对照＋相反方位", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "从阳光进入雨滴的画面出发，用内外、明暗、色序和相反方位还原主虹与副虹。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-scene-with-boundary", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-life-phenomena" })) })) };
    }
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "mirage-memory" ? { ...item, revision: item.revision + 1, purpose: "把蜃景的四类异质信息分栏核对，避免把地点或别称误当成形成机制。", method: "名称—成因—像—环境四栏对照" } : item.mnemonicId === "rainbow-secondary-memory" ? { ...item, revision: item.revision + 1, purpose: "从阳光进入雨滴的画面出发，用内外、明暗、色序和相反方位还原主虹与副虹。", method: "雨滴画面＋内外明暗对照＋相反方位" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "mirage-memory" ? { ...item, coverageType: "study-outline-reference" } : item.mnemonicId === "rainbow-secondary-memory" ? { ...item, coverageType: "structural-scene-with-boundary" } : item);

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q2-science-6", status: "review", QUESTION_IDS, replacementRows,
  distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions,
  applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions,
  applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{ fromVersion: "2026102273", toPackVersion: "2026-10-22.74", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["mirage-memory", "rainbow-secondary-memory"], reason: "Q2 科技第六批重写海市蜃楼、彩虹与霓十题；蜃景保留为四栏速记提纲，虹霓升级为结构口诀。" }],
};
