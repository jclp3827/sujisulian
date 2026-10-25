"use strict";

// Q2 科技第五批：直线传播与反射、折射/全反射与散射。
// 保留稳定 ID 和题量，改为场景判断；传播反射形成可逆结构口诀，异质的折射主题保留为速记提纲。

const QUESTION_IDS = [
  "light-straight-condition-core", "light-straight-examples-core", "light-reflection-definition-core", "specular-diffuse-core", "propagation-reflection-full",
  "light-refraction-definition-core", "lens-mirror-functions-core", "total-reflection-core", "light-scattering-core", "refraction-scattering-full",
];

const replacementRows = {
  "light-straight-condition-core": { objective: "在给定介质条件下判断光能否按直线传播", prompt: "激光在成分和密度处处相同的透明介质中传播。忽略边界影响时，光路应怎样判断？", options: ["在介质中随机改变方向", "沿直线传播", "会形成闭合曲线"], answer: 1, explanation: "光在同种均匀介质中沿直线传播；题干同时给出了“同种”和“均匀”两个条件。", boundary: "结论不能扩大为光在任意不均匀介质或跨介质界面时都沿直线传播。" },
  "light-straight-examples-core": { objective: "从遮挡和准直情境识别光的直线传播", prompt: "下列哪组现象主要用光在同种均匀介质中沿直线传播解释？", options: ["平面镜成像、水中筷子偏折、蓝天", "影子、小孔成像、日食", "光纤通信、海市蜃楼、潜望镜"], answer: 1, explanation: "影子、小孔成像和日食都与光沿直线传播及遮挡关系有关。", boundary: "本题只识别主要机制；不展开日月食轨道或小孔成像的定量关系。" },
  "light-reflection-definition-core": { objective: "由返回原介质识别光的反射", prompt: "一束光从空气射到镜面后改变方向，仍回到空气中传播。这一过程属于？", options: ["折射", "散射", "反射"], answer: 2, explanation: "光到达两种物质的分界面后改变方向并返回原来介质，属于反射。", boundary: "若光进入另一透明介质并在交界处改变方向，应按折射判断。" },
  "specular-diffuse-core": { objective: "根据表面和反射方向区分镜面反射与漫反射", prompt: "电影院银幕表面并非像镜子一样光滑，多个方向的观众仍能看到画面。主要原因是？", options: ["粗糙表面使反射光射向多个方向", "银幕不反射光，只自行发光", "平行入射光经银幕后仍只沿一个方向反射"], answer: 0, explanation: "粗糙表面使反射光射向多个方向，属于漫反射，因此不同位置的观众可以看到画面。", boundary: "漫反射仍遵循反射规律；区别在于表面微观方向不同造成反射光分散。" },
  "propagation-reflection-full": { objective: "综合区分直线传播、反射定义和两类反射", prompt: "某同学整理“直线传播与反射”卡片。下列哪张卡片完整正确？", options: ["同种均匀介质—直线传播；到界面后回原介质—反射；光滑面常见镜面反射", "跨透明介质改变方向—直线传播；回原介质—折射；粗糙面只向一个方向反射", "影子—散射；镜中像—折射；漫反射不遵循反射规律"], answer: 0, explanation: "同种均匀介质中的直线传播、返回原介质的反射和光滑面的镜面反射三项对应均正确。", boundary: "综合题只辨认主要机制和条件，不作光路角度计算。" },
  "light-refraction-definition-core": { objective: "由跨透明介质改变方向识别折射", prompt: "光从水中斜射进入空气，在水面处改变传播方向。该现象属于？", options: ["折射", "反射", "同种介质中的直线传播"], answer: 0, explanation: "光从一种透明介质斜射入另一种透明介质，并在交界处改变方向，属于折射。", boundary: "题干强调光进入另一介质；若返回原介质，应按反射判断。" },
  "lens-mirror-functions-core": { objective: "在生活器件中区分透镜与面镜的基础作用", prompt: "下列器件与基础光学作用的对应，哪一项正确？", options: ["汽车后视镜常用凹面镜，借助会聚作用扩大视野", "放大镜利用凹透镜的发散作用形成放大的实像", "手电筒反光罩用凹面镜，汽车后视镜用凸面镜"], answer: 2, explanation: "凹面镜可会聚光线，常作反光罩；凸面镜能扩大视野，常作汽车后视镜。凸透镜会聚、凹透镜发散。", boundary: "这里只识别基础光学作用和常见用途，不讨论具体成像公式。" },
  "total-reflection-core": { objective: "利用介质方向和临界角条件判断全反射", prompt: "光纤芯的折射率高于包层。要在芯与包层界面发生全反射，还必须满足什么条件？", options: ["光从低折射率一侧射向高折射率一侧", "入射角超过相应临界角", "光线必须垂直射向界面"], answer: 1, explanation: "全反射要求光从较高折射率介质进入较低折射率介质，并且入射角超过临界角。", boundary: "本题不计算临界角，只判断介质方向和角度条件是否同时具备。" },
  "light-scattering-core": { objective: "从可见光束情境识别散射", prompt: "阳光穿过有细小尘埃的室内时，光束路径变得清晰可见。主要原因是？", options: ["尘埃使部分光偏离原方向并进入人眼", "光被尘埃大量吸收，并停止向前传播", "光线在每粒尘埃表面都发生全反射现象"], answer: 0, explanation: "光通过含尘埃等不均匀介质时，部分光偏离原方向形成散射，使侧面的观察者也能看到光束。", boundary: "本题仅识别散射机制，不讨论粒径与波长的定量关系。" },
  "refraction-scattering-full": { objective: "综合区分折射、全反射和散射的条件与现象", prompt: "下列三组现象与主要机制的对应，哪一组完整正确？", options: ["水中筷子看似偏折—反射；光纤传光—散射；尘埃中光束可见—直线传播", "水中筷子看似偏折—折射；光纤传光—全反射；尘埃中光束可见—散射", "水中筷子看似偏折—全反射；光纤传光—折射；尘埃中光束可见—镜面反射"], answer: 1, explanation: "跨水和空气造成的视位置变化属于折射，光纤主要利用全反射，含尘介质使光束可见属于散射。", boundary: "本题只判断主要机制，不表示相关场景不存在次要反射或折射。" },
};

const distractorReasons = {
  "light-straight-condition-core": { 0: "同种均匀介质不会使光路随机改变，题干没有给出扰动或不均匀条件。", 2: "基础直线传播条件不能推出闭合曲线，光路仍按直线判断。" },
  "light-straight-examples-core": { 0: "三项主要机制依次涉及反射、折射和散射，不是同一组直线传播现象。", 2: "光纤主要利用全反射，海市蜃楼涉及折射，潜望镜利用反射。" },
  "light-reflection-definition-core": { 0: "折射要求光进入另一透明介质，题干明确光返回空气。", 1: "散射指部分光在不均匀介质中偏离原方向，不符合镜面返回原介质的情境。" },
  "specular-diffuse-core": { 1: "银幕需要把光反射到观众眼中，并非完全不反射或自行发光。", 2: "只向一个方向反射更接近光滑表面的镜面反射，不能解释多方向观众都可见。" },
  "propagation-reflection-full": { 1: "跨介质改变方向、返回原介质和粗糙面方向分布三项均被错配。", 2: "影子、镜中像和漫反射规律三项均不符合基础光学对应。" },
  "light-refraction-definition-core": { 1: "反射会使光返回原介质，题干明确光从水进入空气。", 2: "题干涉及两种介质的交界面，不属于同种均匀介质中的直线传播。" },
  "lens-mirror-functions-core": { 0: "汽车后视镜常用凸面镜扩大视野，而不是用凹面镜缩小视野。", 1: "放大镜通常利用凸透镜的会聚和成像作用，不是凹透镜发散。" },
  "total-reflection-core": { 0: "全反射要求从较高折射率介质射向较低折射率介质，方向相反。", 2: "垂直入射的入射角为零，不满足超过临界角的条件。" },
  "light-scattering-core": { 1: "光仍在空气中传播，只是部分光被散射后进入侧面观察者眼中。", 2: "含尘空气中的可见光束主要由散射形成，不要求所有光发生全反射。" },
  "refraction-scattering-full": { 0: "三项机制均被错配：筷子现象是折射，光纤利用全反射，光束可见是散射。", 2: "筷子、光纤和含尘光束三项的主要机制都没有正确对应。" },
};

const cognitiveLevels = Object.fromEntries(QUESTION_IDS.map((id) => [id, id.endsWith("full") ? "synthesis" : (id === "total-reflection-core" ? "condition" : "application")]));
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，改为可观察场景或完整条件判断，补齐逐项理由、能力层级和边界。" }));

const targetRows = {
  "cs-target-light-straight-condition": { statement: "能在介质种类和均匀性明确时判断光是否按直线传播。", conclusion: "光在同种均匀介质中沿直线传播。", conditions: ["介质为同一种且均匀，判断中忽略边界影响。"], excludes: ["不扩大到不均匀介质或跨介质传播。"] },
  "cs-target-light-straight-examples": { statement: "能从遮挡、孔径或准直情境识别直线传播现象。", conclusion: "影子、小孔成像、日食、月食和激光准直属于正文列出的直线传播现象。", conditions: ["按现象的主要光学机制判断。"], excludes: ["不展开天体轨道、小孔成像比例或激光器结构。"] },
  "cs-target-light-reflection-definition": { statement: "能用光到达界面后返回原介质识别反射。", conclusion: "光到达两种物质分界面后改变方向并返回原来物质，属于反射。", conditions: ["方向改变发生在分界面，光返回原介质。"], excludes: ["不把进入另一透明介质后的方向改变视为反射。"] },
  "cs-target-specular-diffuse": { statement: "能根据表面状态和反射光方向分布区分镜面反射与漫反射。", conclusion: "光滑面使平行入射光仍规则反射，粗糙面使反射光射向多个方向。", conditions: ["比较同一束平行入射光在不同表面的方向分布。"], excludes: ["漫反射仍遵循反射规律，不表示没有反射。"] },
  "cs-target-light-refraction-definition": { statement: "能从光斜射跨越两种透明介质的情境识别折射。", conclusion: "光从一种透明介质斜射入另一种透明介质，在交界处改变传播方向。", conditions: ["光进入另一透明介质，并在交界处改变方向。"], excludes: ["不把返回原介质的过程视为折射。"] },
  "cs-target-lens-mirror-functions": { statement: "能在生活器件中区分凸凹透镜和凸凹面镜的基础作用。", conclusion: "凸透镜会聚、凹透镜发散；凸面镜常作后视镜，凹面镜常作反光罩。", conditions: ["按正文列出的基础作用和常见用途判断。"], excludes: ["不讨论成像公式、焦距计算或具体器件参数。"] },
  "cs-target-total-reflection": { statement: "能同时使用介质方向和临界角条件判断全反射。", conclusion: "光从较高折射率介质进入较低折射率介质且入射角超过临界角时发生全反射，光纤利用该现象。", conditions: ["从高折射率介质射向低折射率介质，且入射角超过临界角。"], excludes: ["不要求计算临界角或分析光纤结构参数。"] },
  "cs-target-light-scattering": { statement: "能从不均匀介质使部分光偏离原方向的情境识别散射。", conclusion: "光通过不均匀介质时部分光偏离原方向；蓝天、雾中朦胧和丁达尔现象属于正文示例。", conditions: ["介质存在使光发生方向分散的不均匀成分。"], excludes: ["不讨论粒径、波长和散射强度的定量关系。"] },
};

const direct = {
  "cs-target-light-straight-condition": "light-straight-condition-core",
  "cs-target-light-straight-examples": "light-straight-examples-core",
  "cs-target-light-reflection-definition": "light-reflection-definition-core",
  "cs-target-specular-diffuse": "specular-diffuse-core",
  "cs-target-light-refraction-definition": "light-refraction-definition-core",
  "cs-target-lens-mirror-functions": "lens-mirror-functions-core",
  "cs-target-total-reflection": "total-reflection-core",
  "cs-target-light-scattering": "light-scattering-core",
};
const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => [targetId, {
  directQuestionIds: [direct[targetId]],
  variationQuestionIds: [targetId.includes("straight") || targetId.includes("reflection-definition") || targetId.includes("specular") ? "propagation-reflection-full" : "refraction-scattering-full"],
  processDifference: "直接题用单一介质、界面、器件或现象判断一个关系；综合题把该关系放进三项对照，要求排除跨机制错配。",
}]));

const mnemonicDispositions = [
  { groupId: "optics-propagation-reflection", decision: "structural-mnemonic-candidate", resourceId: "propagation-reflection-memory", reason: "用“同匀—直线、遇界—返回、光滑—排队、粗糙—散开”的连续画面形成可逆结构，并保留影子、小孔、日月食和准直的现象锚点。" },
  { groupId: "optics-refraction-scattering", decision: "retain-as-study-outline", resourceId: "refraction-scattering-memory", reason: "折射定义、四类器件、全反射条件和散射现象属于四种不同关系，强行压成一句会增加错配；保留按条件与应用分栏的速记提纲。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-mechanism-application" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-mechanism-application", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "optics-propagation-reflection" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "optics-refraction-scattering" ? { ...item, mnemonicDecision: "study-outline", mnemonicReason: mnemonicDispositions[1].reason } : item);
function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "propagation-reflection-memory") {
      const phrases = {
        "cs-target-light-straight-condition-memory": "同种均匀，光走直线",
        "cs-target-light-straight-examples-memory": "影子小孔、日月食，激光准直一线穿",
        "cs-target-light-reflection-definition-memory": "遇到界面，返回原边",
        "cs-target-specular-diffuse-memory": "光滑排队返，粗糙散开来",
      };
      return { ...item, revision: item.revision + 1, title: "直行返回画面诀", text: "同种均匀，光走直线；影子小孔、日月食，激光准直一线穿。遇到界面，返回原边；光滑排队返，粗糙散开来。", method: "连续画面＋表面对照", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "用光先直行、再遇界返回的连续画面记住传播与反射，再用排队和散开的视觉对照区分表面。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-scene-with-boundary", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-mechanism-application" })) })) };
    }
    if (item.id === "refraction-scattering-memory") {
      const phrases = {
        "cs-target-light-refraction-definition-memory": "折射：斜入另一透明介质，在界面改变方向",
        "cs-target-lens-mirror-functions-memory": "器件：凸透会聚、凹透发散；凸面后视、凹面反光",
        "cs-target-total-reflection-memory": "全反射：高折到低折，入射角超过临界角；光纤应用",
        "cs-target-light-scattering-memory": "散射：不均匀介质使光偏离；蓝天、雾和丁达尔",
      };
      return { ...item, revision: item.revision + 1, title: "折射相关四栏对照", text: "折射—斜入另一透明介质；器件—凸透会聚、凹透发散，凸面后视、凹面反光；全反射—高折到低折且超过临界角；散射—不均匀介质使光偏离。", method: "条件—器件—应用四栏对照", learningForm: "study-outline", formLabel: "速记提纲", purpose: "按定义、器件、全反射条件和散射现象分栏回看，避免把四种不同关系压成关键词串。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "study-outline-reference", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-mechanism-application" })) })) };
    }
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "propagation-reflection-memory" ? { ...item, revision: item.revision + 1, purpose: "用光先直行、再遇界返回的连续画面记住传播与反射，再用排队和散开的视觉对照区分表面。", method: "连续画面＋表面对照" } : item.mnemonicId === "refraction-scattering-memory" ? { ...item, revision: item.revision + 1, purpose: "按定义、器件、全反射条件和散射现象分栏回看，避免把四种不同关系压成关键词串。", method: "条件—器件—应用四栏对照" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "propagation-reflection-memory" ? { ...item, coverageType: "structural-scene-with-boundary" } : item.mnemonicId === "refraction-scattering-memory" ? { ...item, coverageType: "study-outline-reference" } : item);

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q2-science-5", status: "review", QUESTION_IDS, replacementRows,
  distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions,
  applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions,
  applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{ fromVersion: "2026102272", toPackVersion: "2026-10-22.73", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["propagation-reflection-memory", "refraction-scattering-memory"], reason: "Q2 科技第五批重写直线传播、反射、折射、全反射与散射十题；传播反射升级为结构口诀，异质折射主题保留为速记提纲。" }],
};
