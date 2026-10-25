"use strict";

const clone = (value) => JSON.parse(JSON.stringify(value));

const targetIds = ["curve", "symmetry", "whole", "closure"];
const mnemonic = {
  id: "shape-observation-memory",
  revision: 2,
  status: "review",
  title: "屈臣氏整风",
  text: "屈臣氏整风",
  phrases: targetIds.map((targetId) => ({ phrase: targetId, targetIds: [targetId] })),
};
const pack = {
  version: "fixture.1",
  mnemonics: [mnemonic],
  targets: targetIds.map((id) => ({ id })),
  groups: [{ id: "shape-observation", title: "图形观察维度" }],
};

const frame = {
  id: "shape-observation-frame",
  revision: 1,
  status: "review",
  conceptTitle: "图形观察维度",
  parentPath: ["判断推理", "图形推理", "图形观察维度"],
  definition: "图形观察维度是识别图形规律时用于分解视觉特征的一组观察角度。",
  examTask: "面对一组图形时，判断应从曲直、对称、整体或封闭性中的哪个维度寻找规律。",
  relationType: "classification",
  sourceRefs: [{ pointId: "shape-reasoning", tabId: "observation-dimensions" }],
  nodes: [
    { id: "root", role: "root", label: "图形观察维度", plainMeaning: "观察图形规律时可以依次检查的主要角度。", distinction: "", targetIds: [] },
    { id: "curve", role: "category", label: "曲直", plainMeaning: "观察线条由曲线还是直线构成。", distinction: "区分线条形态，不判断图形是否对称。", targetIds: ["curve"] },
    { id: "symmetry", role: "category", label: "对称", plainMeaning: "观察图形是否存在轴对称或中心对称。", distinction: "区分对称关系，不判断局部是否封闭。", targetIds: ["symmetry"] },
    { id: "whole", role: "category", label: "整体", plainMeaning: "把图形作为整体观察，而非只盯局部元素。", distinction: "区分整体与局部观察层级。", targetIds: ["whole"] },
    { id: "closure", role: "category", label: "封闭", plainMeaning: "观察线条是否围成封闭区域。", distinction: "区分开放与封闭区域。", targetIds: ["closure"] },
  ],
  edges: targetIds.map((id) => ({ from: "root", to: id, type: "contains" })),
};

const binding = {
  mnemonicId: mnemonic.id,
  mnemonicRevision: mnemonic.revision,
  conceptFrameId: frame.id,
  conceptFrameRevision: frame.revision,
};

const authoring = (frames = [frame], bindings = [binding]) => ({
  schemaVersion: 1,
  conceptFrameSchemaVersion: "q0c0-concept-frame-v1",
  conceptFrames: frames,
  mnemonicConceptBindings: bindings,
});

module.exports = { authoring, binding, clone, frame, mnemonic, pack, targetIds };
