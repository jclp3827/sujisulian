"use strict";

// Q2 科技第三批：七个 SI 基本单位、八个具名导出单位。
// 保留稳定 ID 和题量，强化物理量—单位名称—符号映射；两项资源均按速记提纲展示。

const QUESTION_IDS = [
  "si-base-count", "si-length-mass-time", "si-current-temperature", "si-amount-luminous", "si-base-full-contrast",
  "si-derived-frequency-force", "si-derived-pressure-energy", "si-derived-power-charge", "si-derived-voltage-resistance", "si-derived-full-contrast",
];

const replacementRows = {
  "si-base-count": { objective: "识别国际单位制七个基本单位的数量", prompt: "国际单位制（SI）设有几个基本单位？", options: ["5个基本单位", "7个基本单位", "8个基本单位"], answer: 1, explanation: "国际单位制设有七个基本单位。", boundary: "这里只问基本单位数量，不把赫兹、牛顿、瓦特等导出单位计入。" },
  "si-length-mass-time": { objective: "把长度、质量、时间与基本单位名称及符号对应", prompt: "实验记录依次写杆长2 m、砝码质量3 kg、过程用时5 s。哪组物理量与单位符号对应正确？", options: ["长度—m；质量—kg；时间—s", "长度—kg；质量—m；时间—s", "长度—s；质量—kg；时间—m"], answer: 0, explanation: "长度的基本单位符号是m，质量是kg，时间是s。", boundary: "本题识别单位符号，不进行单位换算。" },
  "si-current-temperature": { objective: "把电流、热力学温度与安培、开尔文对应", prompt: "某记录写“电流2 A、热力学温度300 K”。A和K分别表示哪两个基本单位？", options: ["伏特和摄氏度", "安培和开尔文", "欧姆和焦耳"], answer: 1, explanation: "A是安培的单位符号，对应电流；K是开尔文的单位符号，对应热力学温度。", boundary: "不把电压单位伏特当作电流单位，也不讨论摄氏温度与开尔文温度换算。" },
  "si-amount-luminous": { objective: "把物质的量、发光强度与摩尔、坎德拉对应", prompt: "化学记录使用mol表示物质的量，光学记录使用cd表示发光强度。两个单位名称依次是？", options: ["摩尔和坎德拉", "焦耳和瓦特", "赫兹和帕斯卡"], answer: 0, explanation: "mol表示摩尔，cd表示坎德拉，分别对应物质的量和发光强度。", boundary: "本题只识别两个基本单位，不扩展流明、勒克斯等光学单位。" },
  "si-base-full-contrast": { objective: "完整复辨七个基本单位并排除导出单位", prompt: "下列哪组只包含国际单位制的七个基本单位？", options: ["米、千克、秒、安培、开尔文、摩尔、坎德拉", "米、千克、秒、伏特、开尔文、摩尔、坎德拉", "米、克、秒、安培、摄氏度、摩尔、坎德拉"], answer: 0, explanation: "七个基本单位是米、千克、秒、安培、开尔文、摩尔、坎德拉。", boundary: "伏特属于导出单位；质量基本单位是千克，热力学温度基本单位是开尔文。" },
  "si-derived-frequency-force": { objective: "把频率、力与赫兹、牛顿对应", prompt: "设备标注振动频率50 Hz、拉力20 N。Hz和N对应的单位名称依次是？", options: ["赫兹和牛顿", "帕斯卡和焦耳", "伏特和欧姆"], answer: 0, explanation: "Hz表示赫兹，对应频率；N表示牛顿，对应力。", boundary: "本题只识别物理量、单位名称和符号，不考查定义式。" },
  "si-derived-pressure-energy": { objective: "把压强、能量与帕斯卡、焦耳对应", prompt: "气压记录使用Pa，能量记录使用J。两个具名导出单位依次是？", options: ["牛顿和千瓦时", "帕斯卡和焦耳", "赫兹和千瓦时"], answer: 1, explanation: "Pa表示帕斯卡，对应压强；J表示焦耳，对应能量。", boundary: "本题不进行压强或能量计算。" },
  "si-derived-power-charge": { objective: "把功率、电量与瓦特、库仑对应", prompt: "用电器功率标为W，电量标为C。两个具名导出单位依次是？", options: ["焦耳和安培", "伏特和欧姆", "瓦特和库仑"], answer: 2, explanation: "W表示瓦特，对应功率；C表示库仑，对应电量。", boundary: "安培对应电流，是基本单位；本题不推导电学公式。" },
  "si-derived-voltage-resistance": { objective: "把电压、电阻与伏特、欧姆对应", prompt: "电路表给出电压12 V、电阻6 Ω。V和Ω对应的单位名称依次是？", options: ["库仑和安培", "伏特和欧姆", "瓦特和焦耳"], answer: 1, explanation: "V表示伏特，对应电压；Ω表示欧姆，对应电阻。", boundary: "本题只识别单位对应，不进行欧姆定律计算。" },
  "si-derived-full-contrast": { objective: "综合复辨八个具名导出单位", prompt: "下列哪组物理量与具名导出单位的对应全部正确？", options: ["频率—牛顿；力—赫兹；功率—焦耳；能量—瓦特", "压强—焦耳；能量—帕斯卡；电压—欧姆；电阻—伏特", "频率—赫兹；压强—帕斯卡；功率—瓦特；电阻—欧姆"], answer: 2, explanation: "频率—赫兹、压强—帕斯卡、功率—瓦特、电阻—欧姆均对应正确。", boundary: "综合题只复核本主题列出的八个具名导出单位。" },
};

const distractorReasons = {
  "si-base-count": { 0: "5个少于国际单位制规定的七个基本单位。", 2: "8个把基本单位数量多算了一项。" },
  "si-length-mass-time": { 1: "m对应长度、kg对应质量，该项把二者互换。", 2: "s对应时间、m对应长度，该项错配长度和时间。" },
  "si-current-temperature": { 0: "伏特对应电压；摄氏度不是热力学温度的SI基本单位。", 2: "欧姆对应电阻，焦耳对应能量。" },
  "si-amount-luminous": { 1: "焦耳对应能量，瓦特对应功率。", 2: "赫兹对应频率，帕斯卡对应压强。" },
  "si-base-full-contrast": { 1: "伏特是电压的导出单位，不属于七个基本单位。", 2: "质量基本单位是千克，热力学温度基本单位是开尔文。" },
  "si-derived-frequency-force": { 1: "帕斯卡对应压强，焦耳对应能量。", 2: "伏特对应电压，欧姆对应电阻。" },
  "si-derived-pressure-energy": { 0: "牛顿对应力；千瓦时可表示能量，但二者都不是Pa、J的单位名称。", 2: "赫兹对应频率；千瓦时可表示能量，但二者都不是Pa、J的单位名称。" },
  "si-derived-power-charge": { 0: "焦耳对应能量；安培对应电流而不是电量。", 1: "伏特对应电压，欧姆对应电阻。" },
  "si-derived-voltage-resistance": { 0: "库仑对应电量，安培对应电流。", 2: "瓦特对应功率，焦耳对应能量。" },
  "si-derived-full-contrast": { 0: "赫兹对应频率、牛顿对应力，焦耳对应能量、瓦特对应功率，该项成对互换。", 1: "帕斯卡对应压强、焦耳对应能量，伏特对应电压、欧姆对应电阻，该项成对互换。" },
};

const cognitiveLevels = Object.fromEntries(QUESTION_IDS.map((id) => [id, id.endsWith("full-contrast") ? "synthesis" : id === "si-base-count" ? "recall" : "application"]));

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留既有题目身份和覆盖范围，改写为公考常识所需的物理量—单位名称—符号判断，并补齐干扰项理由与适用边界。",
}));

const targetRows = {
  "cs-target-si-base-set": { statement: "能识别七个国际单位制基本单位，并排除伏特、瓦特等导出单位。", conclusion: "七个基本单位是米、千克、秒、安培、开尔文、摩尔、坎德拉。", conditions: ["判断对象是国际单位制基本单位，不是全部常用单位。"], excludes: ["不覆盖全部导出单位。"] },
  "cs-target-si-length-mass-time": { statement: "能把长度、质量、时间与米m、千克kg、秒s对应。", conclusion: "长度—米（m），质量—千克（kg），时间—秒（s）。", conditions: ["识别单位名称和单位符号。"], excludes: ["不覆盖单位换算。"] },
  "cs-target-si-current-temperature": { statement: "能把电流、热力学温度与安培A、开尔文K对应。", conclusion: "电流—安培（A），热力学温度—开尔文（K）。", conditions: ["识别基本单位名称和符号。"], excludes: ["不讨论摄氏温度与开尔文温度换算。"] },
  "cs-target-si-amount-luminous": { statement: "能把物质的量、发光强度与摩尔mol、坎德拉cd对应。", conclusion: "物质的量—摩尔（mol），发光强度—坎德拉（cd）。", conditions: ["识别基本单位名称和符号。"], excludes: ["不扩展其他光学单位。"] },
  "cs-target-si-derived-frequency-force": { statement: "能把频率、力与赫兹Hz、牛顿N对应。", conclusion: "频率—赫兹（Hz）；力—牛顿（N）。", conditions: ["识别具名导出单位名称和符号。"], excludes: ["不考查单位定义式。"] },
  "cs-target-si-derived-pressure-energy": { statement: "能把压强、能量与帕斯卡Pa、焦耳J对应。", conclusion: "压强—帕斯卡（Pa）；能量—焦耳（J）。", conditions: ["识别具名导出单位名称和符号。"], excludes: ["不进行公式计算。"] },
  "cs-target-si-derived-power-charge": { statement: "能把功率、电量与瓦特W、库仑C对应。", conclusion: "功率—瓦特（W）；电量—库仑（C）。", conditions: ["电量沿用当前内容用语。"], excludes: ["不把安培混作电量单位。"] },
  "cs-target-si-derived-voltage-resistance": { statement: "能把电压、电阻与伏特V、欧姆Ω对应。", conclusion: "电压—伏特（V）；电阻—欧姆（Ω）。", conditions: ["识别具名导出单位名称和符号。"], excludes: ["不进行欧姆定律计算。"] },
};

const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => {
  const current = {
    "cs-target-si-base-set": ["si-base-count", "si-base-full-contrast"],
    "cs-target-si-length-mass-time": ["si-length-mass-time", "si-base-full-contrast"],
    "cs-target-si-current-temperature": ["si-current-temperature", "si-base-full-contrast"],
    "cs-target-si-amount-luminous": ["si-amount-luminous", "si-base-full-contrast"],
    "cs-target-si-derived-frequency-force": ["si-derived-frequency-force", "si-derived-full-contrast"],
    "cs-target-si-derived-pressure-energy": ["si-derived-pressure-energy", "si-derived-full-contrast"],
    "cs-target-si-derived-power-charge": ["si-derived-power-charge", "si-derived-full-contrast"],
    "cs-target-si-derived-voltage-resistance": ["si-derived-voltage-resistance", "si-derived-full-contrast"],
  }[targetId];
  return [targetId, { directQuestionIds: [current[0]], variationQuestionIds: [current[1]], processDifference: "直接题在测量记录或符号情境中识别对应；综合题把该单位放入完整集合，与相邻单位交叉复辨。" }];
}));

const mnemonicDispositions = [
  { groupId: "si-base-units", decision: "retain-as-study-outline", resourceId: "si-base-units-memory", reason: "“米千秒、安开摩坎”仍主要依靠名称首字压缩，缺少稳定的自然联想和独立还原线索；保留有序速记提纲，不包装成口诀。" },
  { groupId: "si-named-derived-units", decision: "retain-as-study-outline", resourceId: "si-named-derived-memory", reason: "八组内容本质是物理量与单位的成对清单，强造谐音容易增加歧义；保留四组对照提纲，不包装成口诀。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-unit-application" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-unit-application", cognitiveLevel: cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => {
  const disposition = mnemonicDispositions.find((row) => row.groupId === item.id);
  return disposition ? { ...item, mnemonicDecision: "study-outline", mnemonicReason: disposition.reason } : item;
});
function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "si-base-units-memory") return { ...item, revision: item.revision + 1, title: "七个基本单位顺序表", text: "长质时：米、千克、秒；流温量光：安培、开尔文、摩尔、坎德拉。", method: "物理量分组对照", learningForm: "study-outline", formLabel: "速记提纲", purpose: "按物理量分组回看七个基本单位，避免只背单位首字却不能还原对应关系。", phrases: item.phrases.map((p) => ({ ...p, coverageType: "study-outline-reference", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-unit-application" })) })) };
    if (item.id === "si-named-derived-memory") return { ...item, revision: item.revision + 1, title: "八个具名导出单位对照", text: "频率—赫兹，力—牛顿；压强—帕斯卡，能量—焦耳；功率—瓦特，电量—库仑；电压—伏特，电阻—欧姆。", method: "四组对照", learningForm: "study-outline", formLabel: "速记提纲", purpose: "按四组物理量—单位对照回看八个具名导出单位，避免首字串造成压强与电压混淆。", phrases: item.phrases.map((p) => ({ ...p, coverageType: "study-outline-reference", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-unit-application" })) })) };
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "si-base-units-memory" ? { ...item, revision: item.revision + 1, purpose: "按物理量分组回看七个基本单位，避免只背单位首字却不能还原对应关系。", method: "物理量分组对照" } : item.mnemonicId === "si-named-derived-memory" ? { ...item, revision: item.revision + 1, purpose: "按四组物理量—单位对照回看八个具名导出单位，避免首字串造成压强与电压混淆。", method: "四组对照" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => ["si-base-units-memory", "si-named-derived-memory"].includes(item.mnemonicId) ? { ...item, coverageType: "study-outline-reference" } : item);

module.exports = { schemaVersion: 1, revision: 1, batch: "Q2-science-3", status: "review", QUESTION_IDS, replacementRows, distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions, applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions, applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{ fromVersion: "2026102270", toPackVersion: "2026-10-22.71", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["si-base-units-memory", "si-named-derived-memory"], reason: "Q2 科技第三批重写两组 SI 单位题，并把两项首字串资源改为明确的对照提纲；受影响会话按迁移规则重建。" }] };
