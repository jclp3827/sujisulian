"use strict";

// Q2 科技第四批：光与可见光基础、红外线与紫外线。
// 保留稳定 ID 和题量，改为情境判断；两项记忆资源用方向与空间位置形成可逆锚点。

const QUESTION_IDS = [
  "light-electromagnetic-core", "light-year-core", "visible-light-core", "visible-order-core", "light-basics-full",
  "infrared-wavelength-core", "infrared-applications-core", "ultraviolet-wavelength-core", "ultraviolet-applications-core", "infrared-ultraviolet-full",
];

const replacementRows = {
  "light-electromagnetic-core": { objective: "识别光的电磁波属性", prompt: "光信号能穿过真空传播。按基础物理分类，光属于哪一类波？", options: ["横向机械波", "电磁波", "纵向声波"], answer: 1, explanation: "光是一种电磁波，传播不以物质介质为必要条件。", boundary: "本题按基础光学识别光的属性，不展开波粒二象性。" },
  "light-year-core": { objective: "在天文距离情境中识别光年的物理量", prompt: "天文资料写某恒星距地球约4.2光年。这里的“光年”用于衡量什么？", options: ["距离", "时间", "速度"], answer: 0, explanation: "光年是长度单位，表示光在真空中一年传播的距离。", boundary: "“年”出现在定义中，不改变光年属于长度单位。" },
  "visible-light-core": { objective: "从电磁波中识别人眼可直接感知的可见光", prompt: "红外相机能接收人眼看不见的辐射。电磁波谱中，人眼可以直接感知的是？", options: ["红外线", "紫外线", "可见光"], answer: 2, explanation: "可见光是电磁波谱中人眼能够感知的部分；红外线和紫外线均不可见。", boundary: "这里只按普通人眼的可见范围判断，不讨论仪器探测。" },
  "visible-order-core": { objective: "判断可见光由红到紫时波长与频率的变化", prompt: "把可见光按红、橙、黄、绿、青、蓝、紫排列。由红端走向紫端时，波长和频率怎样变化？", options: ["波长增大，频率减小", "波长减小，频率增大", "波长和频率都增大"], answer: 1, explanation: "由红到紫，波长逐渐减小，频率逐渐增大。", boundary: "本题只判断相对变化方向，不要求计算具体数值。" },
  "light-basics-full": { objective: "综合运用光的属性、光年、可见范围和红紫方向", prompt: "某同学整理光学基础卡片。下列哪张卡片的四项对应都正确？", options: ["光—机械波；光年—时间；可见光—人眼不可见；红到紫—波长增大", "光—电磁波；光年—速度；可见光—只含紫光；红到紫—频率减小", "光—电磁波；光年—长度；可见光—人眼可感知；红到紫—波长减小"], answer: 2, explanation: "光是电磁波，光年衡量长度，可见光可被人眼感知，红到紫波长减小。", boundary: "综合题不涉及光年换算和完整电磁波谱。" },
  "infrared-wavelength-core": { objective: "利用光谱位置识别红外线的波长与可见性", prompt: "红外线位于可见光红端之外。与可见光相比，红外线通常具有哪组特征？", options: ["波更长，人眼不可见", "波长更短，人眼可见", "波长相同，人眼可见"], answer: 0, explanation: "红外线位于红端之外，波长比可见光长，人眼不能直接看到。", boundary: "本题只比较波长和可见性，不扩展完整电磁波谱。" },
  "infrared-applications-core": { objective: "从设备用途识别红外线应用", prompt: "夜间救援要根据物体热辐射形成图像。下列设备最符合这一用途的是？", options: ["紫外消毒灯", "验钞灯", "热成像仪"], answer: 2, explanation: "红外热成像仪利用红外辐射形成热分布图像；消毒和验钞常用紫外线。", boundary: "本题识别典型应用，不讨论设备操作或医学用途。" },
  "ultraviolet-wavelength-core": { objective: "利用光谱位置识别紫外线的波长、可见性和臭氧吸收", prompt: "太阳辐射中的一种光位于可见光紫端之外，人眼看不见，并会被大气臭氧吸收。它是？", options: ["红外线", "紫外线", "可见红光"], answer: 1, explanation: "紫外线位于紫端之外，波长比可见光短，人眼不可见，太阳紫外线会被臭氧吸收。", boundary: "本题不讨论紫外暴露剂量和防护建议。" },
  "ultraviolet-applications-core": { objective: "从生活用途识别紫外线应用", prompt: "银行验钞灯和部分消毒灯利用的是哪一种电磁波？", options: ["紫外线", "红外线", "无线电波"], answer: 0, explanation: "紫外线可用于验钞和杀菌；红外线常用于遥控、探测和热成像。", boundary: "本题只识别验钞和杀菌两类典型用途。" },
  "infrared-ultraviolet-full": { objective: "综合区分红外线与紫外线的波长、可见性和用途", prompt: "下列对红外线和紫外线的比较，哪一项正确？", options: ["红外波长较短且用于验钞；紫外波长较长且用于遥控", "红外和紫外都能被人眼直接看到；臭氧会增强太阳紫外线", "红外较长用于热成像；紫外较短用于杀菌验钞"], answer: 2, explanation: "红外线波长较长且常用于热成像；紫外线波长较短且常用于杀菌、验钞。两者均不可见。", boundary: "综合题不讨论精确波段、剂量和医学安全。" },
};

const distractorReasons = {
  "light-electromagnetic-core": { 0: "机械波传播通常需要介质，不是基础光学对光的分类。", 2: "声波属于机械波，不能替代光的电磁波属性。" },
  "light-year-core": { 1: "“年”参与定义，但光年表达的是光传播的距离。", 2: "光速是速度，光年是用光速和一年时间定义出的长度。" },
  "visible-light-core": { 0: "红外线可由仪器探测，但普通人眼不能直接感知。", 1: "紫外线也在人眼可见范围之外。" },
  "visible-order-core": { 0: "由红到紫时波长减小、频率增大，该项两个方向都相反。", 2: "由红到紫时频率增大，但波长不会同时增大。" },
  "light-basics-full": { 0: "光的属性、光年的物理量、可见性和红紫方向均不正确。", 1: "光是电磁波正确，但光年不是速度，可见光不只含紫光，红到紫频率增大。" },
  "infrared-wavelength-core": { 1: "红外线波长比可见光长，而且人眼不可见。", 2: "红外线与可见光波长范围不同，人眼也不能直接看到红外线。" },
  "infrared-applications-core": { 0: "紫外消毒灯利用紫外线的杀菌作用。", 1: "验钞灯常利用紫外线激发荧光，不是红外热成像用途。" },
  "ultraviolet-wavelength-core": { 0: "红外线位于红端之外，波长比可见光长，不符合臭氧吸收线索。", 2: "可见红光能被人眼看到，也不位于紫端之外。" },
  "ultraviolet-applications-core": { 1: "红外线常用于遥控、探测和热成像，不是验钞消毒的对应项。", 2: "无线电波不对应正文所列的验钞和杀菌用途。" },
  "infrared-ultraviolet-full": { 0: "红外、紫外的波长关系和典型用途都被对调。", 1: "红外线与紫外线均不可见，臭氧会吸收而不是增强太阳紫外线。" },
};

const cognitiveLevels = Object.fromEntries(QUESTION_IDS.map((id) => [id, id.endsWith("full") ? "synthesis" : "application"]));
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，改为生活或光谱位置情境，补齐干扰项理由、能力层级和边界。" }));

const targetRows = {
  "cs-target-light-electromagnetic": { statement: "能在传播或通信情境中识别光的电磁波属性。", conclusion: "光是一种电磁波。", conditions: ["按基础光学分类判断。"], excludes: ["不展开波粒二象性。"] },
  "cs-target-light-year": { statement: "能在天文距离表述中判断光年衡量长度。", conclusion: "光年是长度单位，表示光在真空中一年传播的距离。", conditions: ["“年”参与定义，不代表物理量是时间。"], excludes: ["不要求数值换算。"] },
  "cs-target-visible-light": { statement: "能从电磁波中识别人眼可以直接感知的可见光。", conclusion: "可见光是电磁波谱中人眼可以感知的部分。", conditions: ["按普通人眼范围判断。"], excludes: ["不讨论仪器探测范围。"] },
  "cs-target-visible-order": { statement: "能判断可见光由红到紫时波长减小、频率增大。", conclusion: "红橙黄绿青蓝紫按波长递减排列，频率递增。", conditions: ["方向是由红端到紫端。"], excludes: ["不要求具体频率或波长数值。"] },
  "cs-target-infrared-wavelength": { statement: "能借助红端之外的位置判断红外线波长较长且不可见。", conclusion: "红外线波长比可见光长，人眼不能看到。", conditions: ["比较对象是可见光。"], excludes: ["不扩展完整电磁波谱。"] },
  "cs-target-infrared-applications": { statement: "能从探测、遥控、热成像和加热干燥识别红外线应用。", conclusion: "红外探测、遥控、热成像和加热干燥是典型红外应用。", conditions: ["按正文列出的典型应用判断。"], excludes: ["不讨论设备操作和医学用途。"] },
  "cs-target-ultraviolet-wavelength": { statement: "能借助紫端之外的位置判断紫外线波长较短、不可见并会被臭氧吸收。", conclusion: "紫外线波长比可见光短，人眼不能看到；太阳紫外线会被臭氧吸收。", conditions: ["比较对象是可见光，臭氧线索针对太阳紫外线。"], excludes: ["不讨论暴露剂量。"] },
  "cs-target-ultraviolet-applications": { statement: "能从杀菌、验钞和促进合成维生素D识别紫外线应用。", conclusion: "杀菌、验钞和促进人体合成维生素D是正文列出的紫外应用。", conditions: ["按正文列出的典型应用判断。"], excludes: ["不作医学建议。"] },
};

const direct = {
  "cs-target-light-electromagnetic": "light-electromagnetic-core",
  "cs-target-light-year": "light-year-core",
  "cs-target-visible-light": "visible-light-core",
  "cs-target-visible-order": "visible-order-core",
  "cs-target-infrared-wavelength": "infrared-wavelength-core",
  "cs-target-infrared-applications": "infrared-applications-core",
  "cs-target-ultraviolet-wavelength": "ultraviolet-wavelength-core",
  "cs-target-ultraviolet-applications": "ultraviolet-applications-core",
};
const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => [targetId, {
  directQuestionIds: [direct[targetId]],
  variationQuestionIds: [targetId.includes("infrared") || targetId.includes("ultraviolet") ? "infrared-ultraviolet-full" : "light-basics-full"],
  processDifference: "直接题从传播、天文、感知、光谱位置或设备用途识别单一关系；综合题把该关系放入完整对照，要求排除跨概念错配。",
}]));

const mnemonicDispositions = [
  { groupId: "optics-light-basics", decision: "structural-mnemonic-candidate", resourceId: "light-basics-memory", reason: "“光年量长途”用路程意象解除年=时间的干扰，“红到紫，波短频高”提供单向变化锚点；四句均能反向还原目标。" },
  { groupId: "optics-infrared-ultraviolet", decision: "structural-mnemonic-candidate", resourceId: "infrared-ultraviolet-memory", reason: "“红外在红外、紫外在紫外”用可见光两端建立空间锚点，再以长/短、用途和臭氧形成平行对照，能反向还原而非仅抽取首字。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-application" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-application", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => {
  const disposition = mnemonicDispositions.find((row) => row.groupId === item.id);
  return disposition ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: disposition.reason } : item;
});
function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "light-basics-memory") {
      const phrases = {
        "cs-target-light-electromagnetic-memory": "光是电磁波",
        "cs-target-light-year-memory": "光年量长途",
        "cs-target-visible-light-memory": "人眼见七色",
        "cs-target-visible-order-memory": "红到紫：波越短、频越高",
      };
      return { ...item, revision: item.revision + 1, title: "光学基础四步诀", text: "光是电磁波，光年量长途；人眼见七色，红到紫：波越短、频越高。", method: "长途意象＋方向对照", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "用长途意象区分光年与时间，用红到紫的单向变化还原波长和频率关系。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-correspondence-with-boundary", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-application" })) })) };
    }
    if (item.id === "infrared-ultraviolet-memory") {
      const phrases = {
        "cs-target-infrared-wavelength-memory": "红外在红外：长波不见",
        "cs-target-infrared-applications-memory": "红外探测、遥控、热成像和加热",
        "cs-target-ultraviolet-wavelength-memory": "紫外在紫外：短波不见，臭氧拦",
        "cs-target-ultraviolet-applications-memory": "紫外杀菌、验钞、维D",
      };
      return { ...item, revision: item.revision + 1, title: "红紫两端对照诀", text: "红外在红外：长波不见，探测、遥控、热成像和加热；紫外在紫外：短波不见，杀菌、验钞、维D，臭氧拦。", method: "光谱位置＋双边对照", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "用红端和紫端之外的空间位置锚定长短关系，再用平行结构区分用途与臭氧吸收。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-correspondence-with-boundary", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-application" })) })) };
    }
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "light-basics-memory" ? { ...item, revision: item.revision + 1, purpose: "用长途意象区分光年与时间，用红到紫的单向变化还原波长和频率关系。", method: "长途意象＋方向对照" } : item.mnemonicId === "infrared-ultraviolet-memory" ? { ...item, revision: item.revision + 1, purpose: "用红端和紫端之外的空间位置锚定长短关系，再用平行结构区分用途与臭氧吸收。", method: "光谱位置＋双边对照" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => ["light-basics-memory", "infrared-ultraviolet-memory"].includes(item.mnemonicId) ? { ...item, coverageType: "structural-correspondence-with-boundary" } : item);

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q2-science-4", status: "review", QUESTION_IDS, replacementRows,
  distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions,
  applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions,
  applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{ fromVersion: "2026102271", toPackVersion: "2026-10-22.72", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["light-basics-memory", "infrared-ultraviolet-memory"], reason: "Q2 科技第四批重写光学基础与红外紫外十题，并以空间和方向锚点重写两项结构口诀；受影响会话按迁移规则重建。" }],
};
