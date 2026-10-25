"use strict";

// Q2 科技第七批：光与颜料三原色、物体颜色。
// 保留稳定 ID 和题量，改为设备选色、混色结果与生活观察判断；三原色保留对照提纲，物体颜色形成可逆判断口诀。

const QUESTION_IDS = [
  "light-primary-colors-core", "pigment-primary-colors-core", "light-color-mixing-core", "pigment-color-mixing-core", "primary-colors-full",
  "transparent-color-core", "opaque-color-core", "white-black-opaque-core", "red-clothes-core", "object-colors-full",
];

const replacementRows = {
  "light-primary-colors-core": { objective: "从舞台灯光合成情境识别色光三原色", prompt: "舞台需要用三束基础色光合成多种颜色，应选择哪一组作为色光三原色？", options: ["红、黄、蓝", "红、绿、蓝", "青、品红、黄"], answer: 1, explanation: "色光三原色是红、绿、蓝；红、黄、蓝属于颜料三原色。", boundary: "这里只按基础色光模型识别，不扩展到专业色彩空间。" },
  "pigment-primary-colors-core": { objective: "从绘画调色情境识别颜料三原色", prompt: "绘画课准备三种基础颜料调配其他颜色，应选择哪一组作为颜料三原色？", options: ["红、绿、蓝", "青、品红、黄", "红、黄、蓝"], answer: 2, explanation: "颜料三原色是红、黄、蓝；红、绿、蓝属于色光三原色。", boundary: "本题依据基础颜料模型，不讨论印刷或工业色彩体系。" },
  "light-color-mixing-core": { objective: "依据灯光重叠结果判断色光叠加关系", prompt: "舞台上两束色光重叠，并继续加入第三束基础色光。下列记录符合色光叠加关系的是？", options: ["红绿光叠加为黄，红绿蓝三色叠加为白", "红黄光叠加为橙，红黄蓝三色叠加为黑", "红蓝光叠加为紫，红黄蓝三色叠加为白"], answer: 0, explanation: "色光中红绿叠加为黄，红绿蓝三色叠加为白；橙、紫和三色黑属于颜料混合关系。", boundary: "这里只判断所列基础色光叠加结果，不推导亮度或光谱。" },
  "pigment-color-mixing-core": { objective: "依据颜料调配结果判断颜料混合关系", prompt: "美术课先混合两种基础颜料，再将三种基础颜料混合。下列记录正确的是？", options: ["红绿颜料混合为黄，三色混合为白", "红黄颜料混合为橙，三色混合为黑", "红蓝颜料混合为品红，三色混合为白"], answer: 1, explanation: "颜料中红黄混合为橙，红黄蓝三色混合为黑；不能套用色光叠加关系。", boundary: "这里只识别所列基础颜料混合结果，不讨论实际颜料纯度差异。" },
  "primary-colors-full": { objective: "综合区分两套三原色及两色与三色结果", prompt: "技术人员同时检查舞台灯光方案和绘画配色方案。下列说明完整正确的是？", options: ["色光和颜料都以红黄蓝为三原色，三色混合后都得到白色", "色光以青品红黄为三原色，颜料以红绿蓝为三原色，三色结果相同", "色光为红绿蓝、三色合白；颜料为红黄蓝、三色合黑"], answer: 2, explanation: "色光三原色为红绿蓝，三色叠加为白；颜料三原色为红黄蓝，三色混合为黑。", boundary: "综合辨析仍限于基础模型，不延伸到显示器、印刷或光谱参数。" },
  "transparent-color-core": { objective: "从彩色透明片观察情境判断颜色来源", prompt: "白光通过一张彩色透明片后，观察者看到透明片呈现特定颜色。该颜色主要由什么决定？", options: ["透过透明片的色光颜色", "透明片吸收后未透过的色光颜色", "观察者周围物体反射的颜色"], answer: 0, explanation: "透明物体的颜色主要由透过它的色光颜色决定。", boundary: "题干讨论透明物体，不套用不透明物体的反射规则。" },
  "opaque-color-core": { objective: "从彩色纸片观察情境判断不透明物体颜色来源", prompt: "光照在一张不透明彩色纸片上，观察者看到纸片呈现特定颜色。该颜色主要由什么决定？", options: ["穿过不透明纸片到达其背面的色光颜色", "纸片吸收而未反射的色光颜色", "纸片反射到观察者眼中的色光颜色"], answer: 2, explanation: "不透明物体的颜色主要由它反射到人眼的色光颜色决定。", boundary: "题干讨论不透明物体，不套用透明物体的透过规则。" },
  "white-black-opaque-core": { objective: "比较白色与黑色不透明物体对单色光的作用", prompt: "在基础光学模型中，用不同单色光依次照射白色和黑色不透明物体。下列判断正确的是？", options: ["白色主要吸收单色光，黑色主要反射单色光", "白色反射所有单色光，黑色吸收所有单色光", "白色和黑色都只反射红色的单色光"], answer: 1, explanation: "白色不透明物体反射所有单色光，黑色不透明物体吸收所有单色光。", boundary: "结论限定于所学基础模型，不讨论材料表面的实际反射率。" },
  "red-clothes-core": { objective: "用不透明物体反射规则解释红色衣服", prompt: "白光照在红色衣服上，观察者看到衣服呈红色。对此解释正确的是？", options: ["衣服反射红光，并吸收其他色光", "衣服吸收红光，并反射其余入射色光", "衣服让红光透过到背面，并阻挡其他色光"], answer: 0, explanation: "红色衣服是不透明物体，它反射红光并吸收其他色光，因此在白光下呈红色。", boundary: "本题不讨论光源缺少红光时的综合色彩变化。" },
  "object-colors-full": { objective: "综合运用透过、反射和白黑物体规则", prompt: "关于透明物体和不透明物体的颜色判断，下列归纳完整正确的是？", options: ["透明与不透明物体都只看透过光，白色物体主要吸收各类单色光", "透明与不透明物体都只看反射光，黑色物体主要反射各类单色光", "透明物体看透过光，不透明物体看反射光；白全反、黑全吸"], answer: 2, explanation: "透明物体的颜色看透过光，不透明物体的颜色看反射光；白色不透明物体全反射，黑色不透明物体全吸收。", boundary: "归纳仅覆盖基础规则和所列不透明物体情境。" },
};

const distractorReasons = {
  "light-primary-colors-core": { 0: "红黄蓝属于颜料三原色，不能用于替代色光三原色。", 2: "青品红黄不是本题所采用的基础色光三原色组合。" },
  "pigment-primary-colors-core": { 0: "红绿蓝属于色光三原色，不能直接套用到基础颜料模型。", 1: "青品红黄不是本题正文所列的基础颜料三原色组合。" },
  "light-color-mixing-core": { 1: "红黄得橙和三色得黑属于颜料混合关系，不是色光叠加。", 2: "该项混入颜料中的紫色结果，并把三色原色集合也写错。" },
  "pigment-color-mixing-core": { 0: "该项混用了色光红绿得黄、三色得白的叠加关系。", 2: "基础颜料中红蓝混合为紫，三色混合也不得到白色。" },
  "primary-colors-full": { 0: "两套三原色并不相同，颜料三色混合结果也不是白色。", 1: "该项把两套三原色互换，并错误认为三色结果相同。" },
  "transparent-color-core": { 1: "透明物体呈现的颜色依据透过光判断，不依据被吸收光判断。", 2: "周围物体反射颜色不是题干中透明片自身颜色的决定规则。" },
  "opaque-color-core": { 0: "不透明纸片不以透过背面的色光来决定观察到的颜色。", 1: "被吸收的色光没有进入观察者眼睛，不能据此直接判断颜色。" },
  "white-black-opaque-core": { 0: "该项把白色的反射作用与黑色的吸收作用完全对调。", 2: "白色和黑色对单色光的作用不限定为只反射红光。" },
  "red-clothes-core": { 1: "该项把红光与其他色光的反射、吸收关系完全对调。", 2: "衣服属于不透明物体，不能用透明物体的透过规则解释。" },
  "object-colors-full": { 0: "透明与不透明物体分别依据透过光和反射光，白色也不是全吸收。", 1: "两类物体不能统一只看反射光，黑色不透明物体也不是全反射。" },
};

const cognitiveLevels = {
  "light-primary-colors-core": "application", "pigment-primary-colors-core": "application", "light-color-mixing-core": "application", "pigment-color-mixing-core": "application", "primary-colors-full": "synthesis",
  "transparent-color-core": "application", "opaque-color-core": "application", "white-black-opaque-core": "distinction", "red-clothes-core": "application", "object-colors-full": "synthesis",
};
const questionDispositions = QUESTION_IDS.map((questionId) => ({ questionId, decision: "rewrite", reason: "保留稳定题目身份，改为设备、调色或生活观察情境，并补齐逐项理由和适用边界。" }));

const targetRows = {
  "cs-target-light-primary-colors": { statement: "能从灯光合成情境识别色光三原色。", conclusion: "色光三原色是红、绿、蓝。", conditions: ["讨论基础色光叠加模型。"], excludes: ["不延伸到专业色彩空间、显示器参数或定量光谱。"] },
  "cs-target-pigment-primary-colors": { statement: "能从绘画调色情境识别颜料三原色。", conclusion: "颜料三原色是红、黄、蓝。", conditions: ["讨论正文所列基础颜料混合模型。"], excludes: ["不延伸到印刷、工业颜料或实际纯度差异。"] },
  "cs-target-light-color-mixing": { statement: "能依据两束与三束色光叠加结果判断基础配色关系。", conclusion: "红绿光叠加为黄，红蓝为品红，绿蓝为青，红绿蓝叠加为白。", conditions: ["使用红、绿、蓝三种基础色光。"], excludes: ["不计算亮度、能量或光谱分布。"] },
  "cs-target-pigment-color-mixing": { statement: "能依据两种与三种颜料混合结果判断基础配色关系。", conclusion: "红黄颜料混合为橙，红蓝为紫，黄蓝为绿，三色混合为黑。", conditions: ["使用红、黄、蓝三种基础颜料。"], excludes: ["不讨论颜料比例、材质和纯度造成的综合色差。"] },
  "cs-target-transparent-color": { statement: "能从彩色透明片情境判断透明物体颜色由透过光决定。", conclusion: "透明物体的颜色由透过它的色光颜色决定。", conditions: ["物体允许部分色光透过并进入观察者眼睛。"], excludes: ["不套用不透明物体的反射规则。"] },
  "cs-target-opaque-color": { statement: "能从彩色纸片情境判断不透明物体颜色由反射光决定。", conclusion: "不透明物体的颜色由它反射的色光颜色决定。", conditions: ["物体不透明，观察者接收到其反射光。"], excludes: ["不套用透明物体的透过规则。"] },
  "cs-target-white-black-opaque": { statement: "能比较白色与黑色不透明物体对单色光的作用。", conclusion: "白色不透明物体反射所有单色光，黑色不透明物体吸收所有单色光。", conditions: ["按基础光学模型讨论不透明物体。"], excludes: ["不讨论真实材料表面的反射率或吸收率差异。"] },
  "cs-target-red-clothes": { statement: "能用不透明物体反射规则解释白光下红色衣服呈红色。", conclusion: "红色衣服反射红光并吸收其他色光。", conditions: ["光源为包含红光的白光，衣服作为不透明物体。"], excludes: ["不延伸到缺少红光的特殊光源情境。"] },
};

const direct = {
  "cs-target-light-primary-colors": "light-primary-colors-core", "cs-target-pigment-primary-colors": "pigment-primary-colors-core",
  "cs-target-light-color-mixing": "light-color-mixing-core", "cs-target-pigment-color-mixing": "pigment-color-mixing-core",
  "cs-target-transparent-color": "transparent-color-core", "cs-target-opaque-color": "opaque-color-core",
  "cs-target-white-black-opaque": "white-black-opaque-core", "cs-target-red-clothes": "red-clothes-core",
};
const variationRows = Object.fromEntries(Object.keys(targetRows).map((targetId) => [targetId, {
  directQuestionIds: [direct[targetId]],
  variationQuestionIds: [targetId.includes("primary") || targetId.includes("mixing") ? "primary-colors-full" : "object-colors-full"],
  processDifference: "直接题从单一原色、混合结果或物体颜色规则作判断；综合题把多条规则放入同一方案，要求排除色光、颜料与透反关系错配。",
}]));

const mnemonicDispositions = [
  { groupId: "optics-primary-colors", decision: "retain-as-study-outline", resourceId: "primary-colors-memory", reason: "两套原色与六组混色结果属于并列映射，缺少自然且可逆的语义画面；保留三栏对照，避免制造生硬谐音。" },
  { groupId: "optics-object-colors", decision: "structural-mnemonic-candidate", resourceId: "object-colors-memory", reason: "可以先按透明性分流，再用透过或反射判断，并用白黑与红衣实例反向核对，具备稳定决策顺序。" },
];

const applyQuestions = (items) => items.map((item) => replacementRows[item.id] ? { ...item, ...replacementRows[item.id], revision: item.revision + 1 } : item);
const applyTargets = (items) => items.map((item) => targetRows[item.id] ? { ...item, ...targetRows[item.id], revision: item.revision + 1 } : item);
const applyQuestionTargetRelations = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-color-application" } : item);
const applyQuestionSpecifications = (items) => items.map((item) => QUESTION_IDS.includes(item.questionId) ? { ...item, checkPurpose: "q2-optics-color-application", cognitiveLevel: cognitiveLevels[item.id] || cognitiveLevels[item.questionId], distractorReasons: distractorReasons[item.questionId] } : item);
const applyVariationDecisions = (items) => items.map((item) => variationRows[item.targetId] ? { targetId: item.targetId, ...variationRows[item.targetId] } : item);
const applyGroups = (items) => items.map((item) => item.id === "optics-primary-colors" ? { ...item, mnemonicDecision: "study-outline", mnemonicReason: mnemonicDispositions[0].reason } : item.id === "optics-object-colors" ? { ...item, mnemonicDecision: "structural-mnemonic", mnemonicReason: mnemonicDispositions[1].reason } : item);
function applyMnemonics(items) {
  return items.map((item) => {
    if (item.id === "primary-colors-memory") {
      const phrases = {
        "cs-target-light-primary-colors-memory": "色光原色：红、绿、蓝",
        "cs-target-pigment-primary-colors-memory": "颜料原色：红、黄、蓝",
        "cs-target-light-color-mixing-memory": "色光叠加：红绿黄、红蓝品、绿蓝青，三色白",
        "cs-target-pigment-color-mixing-memory": "颜料混合：红黄橙、红蓝紫、黄蓝绿，三色黑",
      };
      return { ...item, revision: item.revision + 1, title: "光与颜料配色对照", text: "原色—色光红绿蓝，颜料红黄蓝；两色—色光红绿黄、红蓝品、绿蓝青，颜料红黄橙、红蓝紫、黄蓝绿；三色—色光合白，颜料合黑。", method: "原色集合—两色结果—三色结果三栏对照", learningForm: "study-outline", formLabel: "速记提纲", purpose: "按原色、两色结果和三色结果对照两套模型，避免把色光与颜料关系互换。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "study-outline-reference", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-color-application" })) })) };
    }
    if (item.id === "object-colors-memory") {
      const phrases = {
        "cs-target-transparent-color-memory": "透明先看透过光",
        "cs-target-opaque-color-memory": "不透明改看反射光",
        "cs-target-white-black-opaque-memory": "白全反，黑全吸",
        "cs-target-red-clothes-memory": "红衣反红、吸其他",
      };
      return { ...item, revision: item.revision + 1, title: "透反判断诀", text: "透明先看透过光，不透明改看反射光；白全反，黑全吸；红衣反红、吸其他。", method: "先分透明性，再按透过或反射判断，最后核对白黑与红衣", learningForm: "structural-mnemonic", formLabel: "结构口诀", purpose: "沿透明性分流，把观察到的颜色还原到透过或反射路径，再用白黑和红衣实例核对。", phrases: item.phrases.map((p) => ({ ...p, phrase: phrases[p.id], coverageType: "structural-decision-with-boundary", checks: p.checks.map((c) => ({ ...c, checkPurpose: "q2-optics-color-application" })) })) };
    }
    return item;
  });
}
const applyMnemonicSpecifications = (items) => items.map((item) => item.mnemonicId === "primary-colors-memory" ? { ...item, revision: item.revision + 1, purpose: "按原色、两色结果和三色结果对照两套模型，避免把色光与颜料关系互换。", method: "原色集合—两色结果—三色结果三栏对照" } : item.mnemonicId === "object-colors-memory" ? { ...item, revision: item.revision + 1, purpose: "沿透明性分流，把观察到的颜色还原到透过或反射路径，再用白黑和红衣实例核对。", method: "先分透明性，再按透过或反射判断，最后核对白黑与红衣" } : item);
const applyMnemonicPhraseTargetRelations = (items) => items.map((item) => item.mnemonicId === "primary-colors-memory" ? { ...item, coverageType: "study-outline-reference" } : item.mnemonicId === "object-colors-memory" ? { ...item, coverageType: "structural-decision-with-boundary" } : item);

module.exports = {
  schemaVersion: 1, revision: 1, batch: "Q2-science-7", status: "review", QUESTION_IDS, replacementRows,
  distractorReasons, cognitiveLevels, questionDispositions, targetRows, variationRows, mnemonicDispositions,
  applyQuestions, applyTargets, applyQuestionTargetRelations, applyQuestionSpecifications, applyVariationDecisions,
  applyGroups, applyMnemonics, applyMnemonicSpecifications, applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{ fromVersion: "2026102274", toPackVersion: "2026-10-22.75", changedQuestionIds: QUESTION_IDS, changedMnemonicIds: ["primary-colors-memory", "object-colors-memory"], reason: "Q2 科技第七批重写三原色与物体颜色十题；三原色保留三栏对照提纲，物体颜色升级为透反判断结构口诀。" }],
};
