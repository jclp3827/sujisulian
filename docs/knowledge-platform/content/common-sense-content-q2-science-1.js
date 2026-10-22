"use strict";

// Q2 科技领域第一批：声音三特性、影子/倒影/折筷。
// 保留稳定 ID 和题量，增强情境判断、控制变量与三类光现象的机制辨析。

const QUESTION_IDS = [
  "sound-pitch", "sound-loudness", "sound-timbre",
  "sound-pitch-timbre-scenario", "sound-loudness-condition",
  "light-shadow", "light-reflection", "light-refraction",
];

const replacementRows = {
  "sound-pitch": {
    objective: "由振动频率变化判断音调变化",
    prompt: "同一根琴弦的振动频率由每秒200次提高到每秒400次，其他条件不讨论。可以直接判断声音发生哪项变化？",
    options: ["音调升高", "响度增大", "音色改变"],
    answer: 0,
    explanation: "发声体振动频率提高，对应音调升高；仅凭频率变化不能推出响度或音色改变。",
    boundary: "本题只判断频率与音调的基础对应关系，不讨论振幅、传播距离等其他条件。",
  },
  "sound-loudness": {
    objective: "在其他条件相同时由振幅变化判断响度",
    prompt: "同一音箱与听者距离不变，只增大发声体的振幅。根据基础对应关系，声音主要会怎样变化？",
    options: ["音调升高", "响度增大", "音色改变"],
    answer: 1,
    explanation: "距离等其他条件相同时，发声体振幅增大，对应响度增大。",
    boundary: "实际听到的响度还会受距离等因素影响，本题已限定这些条件不变。",
  },
  "sound-timbre": {
    objective: "在音调和响度相同时识别音色的辨声作用",
    prompt: "钢琴和小提琴以相同音调、相同响度演奏，人仍能分辨两种乐器，主要依据什么差别？",
    options: ["由频率不同造成的音调差别", "由振幅不同造成的响度差别", "由发声特点造成的音色差别"],
    answer: 2,
    explanation: "题干已经排除音调和响度差异，仍能辨认不同乐器主要利用音色。",
    boundary: "音色用于辨认声音特点，不表示不同乐器在任何情况下音调和响度都相同。",
  },
  "sound-pitch-timbre-scenario": {
    objective: "在同一情境中区分音调、响度与音色",
    prompt: "两件乐器以相同响度演奏同一音调，人仍能分辨乐器；随后提高甲的振动频率。哪项判断正确？",
    options: ["辨乐器看音色，甲的音调会升高", "辨乐器看响度，甲的响度会增大", "辨乐器看音调，甲的音色会消失"],
    answer: 0,
    explanation: "辨认不同乐器主要利用音色；提高发声体振动频率，对应音调升高。",
    boundary: "提高频率不能直接推出响度增大，音色也不会因此消失。",
  },
  "sound-loudness-condition": {
    objective: "用控制变量识别振幅与响度关系的比较条件",
    prompt: "研究振幅变化是否影响响度，哪组实验最能排除其他因素干扰？",
    options: ["固定距离和音调，只改变振幅", "固定振幅，同时改变听者距离", "固定距离和振幅，只改变频率"],
    answer: 0,
    explanation: "保持距离、音调等其他条件相同，只改变振幅，才能把响度差异与振幅变化对应。",
    boundary: "同时改变距离或只改变频率，不能单独检验振幅对响度的影响。",
  },
  "light-shadow": {
    objective: "由遮挡形成影子的情境识别直线传播",
    prompt: "手电筒的光被不透明纸板挡住，纸板后方出现清晰影子。主要用哪条光学规律解释？",
    options: ["光在同种均匀介质中直线传播", "光在物质分界面返回原来介质", "光斜射进入另一介质发生偏折"],
    answer: 0,
    explanation: "光在同种均匀介质中沿直线传播，不透明物体遮挡光线后形成影子。",
    boundary: "本题限定通常的同种均匀介质情境，不把直线传播表述扩大到所有传播条件。",
  },
  "light-reflection": {
    objective: "由平静水面倒影识别光的反射",
    prompt: "岸边景物在平静水面形成倒影，主要发生了哪种光学过程？",
    options: ["光进入水中后改变传播方向", "光在水面改变方向返回空气", "景物的位置移动到水面下方"],
    answer: 1,
    explanation: "景物发出或反射的光到达平静水面后返回空气并进入人眼，形成倒影，属于光的反射。",
    boundary: "倒影与从空气观察水底物体产生的视位置变化不是同一种现象。",
  },
  "light-refraction": {
    objective: "由水中筷子看似偏折识别光的折射",
    prompt: "从空气中观察斜插水中的筷子，水下部分看似偏折。主要原因是？",
    options: ["筷子进入水中后实际发生弯曲", "部分光在水面反射回水中传播", "光从水中进入空气时发生折射"],
    answer: 2,
    explanation: "来自水下筷子的光由水进入空气时传播方向改变，人眼据此形成的视位置与实际位置不同。",
    boundary: "这是跨介质传播产生的视觉现象，不表示筷子实际弯曲或折断。",
  },
};

const distractorReasons = {
  "sound-pitch": { 1: "响度主要与振幅有关，题干只改变频率。", 2: "音色用于辨认声音特点，不能由频率翻倍直接推出音色改变。" },
  "sound-loudness": { 0: "音调主要对应频率，题干只改变振幅。", 2: "音色反映声音特点，不能由振幅增大直接推出音色改变。" },
  "sound-timbre": { 0: "题干明确两种乐器音调相同，不能用音调差别解释辨认结果。", 1: "题干明确两种乐器响度相同，不能用响度差别解释辨认结果。" },
  "sound-pitch-timbre-scenario": { 1: "辨认乐器主要依据音色，且频率提高不能直接推出响度增大。", 2: "辨认乐器主要依据音色；提高频率不会使音色消失。" },
  "sound-loudness-condition": { 1: "振幅和距离同时变化，无法把响度差异单独归因于振幅。", 2: "只改变频率检验的是音调关系，不能检验振幅对响度的影响。" },
  "light-shadow": { 1: "返回原介质描述反射，不能解释遮挡后形成影子的主要机制。", 2: "跨介质偏折描述折射，题干没有给出光斜射进入另一介质的条件。" },
  "light-reflection": { 0: "进入另一介质并改变方向描述折射，倒影主要由水面反射形成。", 2: "倒影是光线反射形成的像，不表示景物实际移动到水下。" },
  "light-refraction": { 0: "看似偏折是视觉现象，不能据此判断筷子实际发生弯曲。", 1: "水面确有部分反射光，但观察水下筷子偏折的主要机制是跨介质折射。" },
};

const cognitiveLevels = {
  "sound-pitch": "application",
  "sound-loudness": "condition",
  "sound-timbre": "application",
  "sound-pitch-timbre-scenario": "application",
  "sound-loudness-condition": "condition",
  "light-shadow": "application",
  "light-reflection": "application",
  "light-refraction": "application",
};

const targetRows = {
  "cs-target-sound-pitch-frequency": {
    statement: "能根据发声体振动频率的变化判断音调变化，并与响度、音色区分。",
    conclusion: "振动频率越高，音调越高。",
    conditions: ["讨论同一发声体或可比较发声体的振动频率与音调关系。"],
    excludes: ["不由频率提高推出响度增大或音色消失。", "不覆盖超声、次声和传播速度。"],
  },
  "cs-target-sound-loudness-amplitude": {
    statement: "能在距离等其他条件相同时，根据发声体振幅变化判断响度变化。",
    conclusion: "其他条件相同时，振幅越大，响度越大。",
    conditions: ["距离、音调等其他影响判断的条件相同。"],
    excludes: ["不把振幅视为实际听到响度的唯一因素。", "不由更响推断频率更高。"],
  },
  "cs-target-sound-timbre-identification": {
    statement: "能在音调和响度相同的情境中，用音色辨认不同人或发声体的声音特点。",
    conclusion: "音色可用于辨别不同声音的特点和来源。",
    conditions: ["问题关注不同人或发声体的声音特点辨认。"],
    excludes: ["不表示不同声音在任何情况下音调和响度都相同。"],
  },
  "q0b-target-light-shadow": {
    statement: "能从不透明物体遮挡光线形成影子的情境识别光的直线传播。",
    conclusion: "同种均匀介质中，光沿直线传播；遮挡光线可以形成影子。",
    conditions: ["光在通常的同种均匀介质中传播，并受到不透明物体遮挡。"],
    excludes: ["不把该结论扩大为光在所有介质和条件下都沿直线传播。"],
  },
  "q0b-target-light-reflection": {
    statement: "能从平静水面的倒影识别光返回原介质的反射过程。",
    conclusion: "平静水面倒影主要由光的反射形成。",
    conditions: ["景物光线到达较平静水面后返回空气并进入人眼。"],
    excludes: ["不与跨介质观察造成的视位置变化混淆。"],
  },
  "q0b-target-light-refraction": {
    statement: "能从水中筷子看似偏折识别光跨水和空气传播时的折射。",
    conclusion: "光斜射跨越水和空气的分界面时改变传播方向，可使筷子看似偏折。",
    conditions: ["来自水下物体的光跨越水和空气的分界面进入人眼。"],
    excludes: ["不把视觉偏折判断为物体实际弯曲或折断。"],
  },
};

const directByTarget = {
  "cs-target-sound-pitch-frequency": "sound-pitch",
  "cs-target-sound-loudness-amplitude": "sound-loudness",
  "cs-target-sound-timbre-identification": "sound-timbre",
  "q0b-target-light-shadow": "light-shadow",
  "q0b-target-light-reflection": "light-reflection",
  "q0b-target-light-refraction": "light-refraction",
};

const variationRows = {
  "cs-target-sound-pitch-frequency": {
    directQuestionIds: ["sound-pitch"],
    variationQuestionIds: ["sound-pitch-timbre-scenario"],
    processDifference: "直接题由频率数值变化判断音调；变式在乐器辨认情境中同时排除响度与音色混淆。",
  },
  "cs-target-sound-loudness-amplitude": {
    directQuestionIds: ["sound-loudness"],
    variationQuestionIds: ["sound-loudness-condition"],
    processDifference: "直接题给定其他条件不变判断响度；变式要求主动选择控制距离和频率的实验设置。",
  },
  "cs-target-sound-timbre-identification": {
    directQuestionIds: ["sound-timbre"],
    variationQuestionIds: ["sound-pitch-timbre-scenario"],
    processDifference: "直接题在音调、响度相同条件下辨认乐器；变式同时加入频率变化，要求分离音色和音调。",
  },
  "q0b-target-light-shadow": {
    directQuestionIds: ["light-shadow"],
    variationQuestionIds: ["light-reflection", "light-refraction"],
    processDifference: "直接题识别遮挡形成影子的机制；组内变式改用水面倒影和跨介质偏折，检验能否排除相邻光学机制。",
  },
  "q0b-target-light-reflection": {
    directQuestionIds: ["light-reflection"],
    variationQuestionIds: ["light-shadow", "light-refraction"],
    processDifference: "直接题由倒影识别返回原介质；组内变式分别给出遮挡和跨介质条件，检验反射边界。",
  },
  "q0b-target-light-refraction": {
    directQuestionIds: ["light-refraction"],
    variationQuestionIds: ["light-shadow", "light-reflection"],
    processDifference: "直接题由筷子视位置变化识别跨介质偏折；组内变式分别给出直线传播与反射情境，检验机制区分。",
  },
};

const questionDispositions = QUESTION_IDS.map((questionId) => ({
  questionId,
  decision: "rewrite",
  reason: "保留考点与稳定 ID，改写为条件明确的公考学习情境，并补齐有效干扰项理由。",
}));

const mnemonicDispositions = [
  {
    groupId: "sound-features",
    decision: "structural-mnemonic-candidate",
    resourceId: "sound-memory",
    reason: "三句采用相同句式把题目维度与对应量成对编码，可逐句反解；具备结构记忆价值，但尚无用户记忆试验证据。",
  },
  {
    groupId: "light-phenomena",
    decision: "retain-as-study-outline",
    resourceId: "light-phenomena-memory",
    reason: "三项内容主要是现象名与机制名的直接对应，缺少独立联想机制；保留为三现象速记提纲，不包装成口诀。",
  },
];

function applyQuestions(questions) {
  return questions.map((question) => replacementRows[question.id]
    ? { ...question, ...replacementRows[question.id], revision: question.revision + 1 }
    : question);
}

function applyTargets(targets) {
  return targets.map((target) => targetRows[target.id]
    ? { ...target, ...targetRows[target.id], revision: target.revision + 1 }
    : target);
}

function applyQuestionTargetRelations(relations) {
  return relations.map((relation) => QUESTION_IDS.includes(relation.questionId)
    ? { ...relation, checkPurpose: relation.questionId.startsWith("light-") ? "q2-application" : relation.checkPurpose }
    : relation);
}

function applyQuestionSpecifications(specifications) {
  return specifications.map((specification) => QUESTION_IDS.includes(specification.questionId)
    ? {
      ...specification,
      checkPurpose: specification.questionId.startsWith("light-") ? "q2-application" : specification.checkPurpose,
      cognitiveLevel: cognitiveLevels[specification.questionId],
      distractorReasons: distractorReasons[specification.questionId],
    }
    : specification);
}

function applyVariationDecisions(decisions) {
  return decisions.map((decision) => variationRows[decision.targetId]
    ? { targetId: decision.targetId, ...variationRows[decision.targetId] }
    : decision);
}

function applyGroups(groups) {
  return groups.map((group) => {
    if (group.id === "sound-features") return {
      ...group,
      mnemonicDecision: "structural-mnemonic",
      mnemonicReason: mnemonicDispositions[0].reason,
    };
    if (group.id === "light-phenomena") return {
      ...group,
      mnemonicDecision: "study-outline",
      mnemonicReason: mnemonicDispositions[1].reason,
    };
    return group;
  });
}

function applyMnemonics(mnemonics) {
  return mnemonics.map((mnemonic) => {
    if (mnemonic.id === "sound-memory") return {
      ...mnemonic,
      revision: mnemonic.revision + 1,
      text: "调高低，看频率；响强弱，看振幅；辨来源，看音色。",
      method: "平行对应",
      learningForm: "structural-mnemonic",
      formLabel: "结构口诀",
      purpose: "用相同句式把声音的高低、强弱、来源辨认与频率、振幅、音色逐项对应。",
      phrases: mnemonic.phrases.map((phrase, index) => ({
        ...phrase,
        phrase: ["调高低，看频率", "响强弱，看振幅", "辨来源，看音色"][index],
        meaning: [
          "音调描述声音高低，对应发声体振动频率。",
          "其他条件相同时，响度描述声音强弱，对应发声体振幅。",
          "辨认不同人或发声体的声音特点和来源，主要看音色。",
        ][index],
        coverageType: index === 1 ? "structural-correspondence-with-condition" : "structural-correspondence",
      })),
    };
    if (mnemonic.id === "light-phenomena-memory") return {
      ...mnemonic,
      revision: mnemonic.revision + 1,
      title: "三类光现象对照",
      text: "影子看直线，倒影看反射，折筷看折射。",
      method: "对照提纲",
      learningForm: "study-outline",
      formLabel: "速记提纲",
      purpose: "用三项对照快速回看影子、平静水面倒影和水中筷子看似偏折的主要光学机制。",
      phrases: mnemonic.phrases.map((phrase, index) => ({
        ...phrase,
        phrase: ["影子看直线", "倒影看反射", "折筷看折射"][index],
        meaning: [
          "同种均匀介质中，不透明物体遮挡光线形成影子。",
          "平静水面倒影主要由光的反射形成。",
          "水中筷子看似偏折，主要由光跨水和空气传播时发生折射形成。",
        ][index],
        coverageType: "study-outline-reference",
        checks: phrase.checks.map((check) => ({ ...check, checkPurpose: "q2-application" })),
      })),
    };
    return mnemonic;
  });
}

function applyMnemonicSpecifications(specifications) {
  return specifications.map((specification) => {
    if (specification.mnemonicId === "sound-memory") return {
      ...specification,
      revision: specification.revision + 1,
      purpose: "用相同句式把声音的高低、强弱、来源辨认与频率、振幅、音色逐项对应。",
      method: "平行对应",
    };
    if (specification.mnemonicId === "light-phenomena-memory") return {
      ...specification,
      revision: specification.revision + 1,
      purpose: "用三项对照快速回看影子、平静水面倒影和水中筷子看似偏折的主要光学机制。",
      method: "对照提纲",
    };
    return specification;
  });
}

function applyMnemonicPhraseTargetRelations(relations) {
  return relations.map((relation) => {
    if (relation.mnemonicId === "sound-memory") return {
      ...relation,
      coverageType: relation.phraseIndex === 1 ? "structural-correspondence-with-condition" : "structural-correspondence",
    };
    if (relation.mnemonicId === "light-phenomena-memory") return {
      ...relation,
      coverageType: "study-outline-reference",
    };
    return relation;
  });
}

module.exports = {
  schemaVersion: 1,
  revision: 1,
  batch: "Q2-science-1",
  status: "review",
  QUESTION_IDS,
  replacementRows,
  distractorReasons,
  cognitiveLevels,
  targetRows,
  variationRows,
  questionDispositions,
  mnemonicDispositions,
  directByTarget,
  applyQuestions,
  applyTargets,
  applyQuestionTargetRelations,
  applyQuestionSpecifications,
  applyVariationDecisions,
  applyGroups,
  applyMnemonics,
  applyMnemonicSpecifications,
  applyMnemonicPhraseTargetRelations,
  sessionMigrations: [{
    fromVersion: "2026102268",
    toPackVersion: "2026-10-22.69",
    changedQuestionIds: QUESTION_IDS,
    changedMnemonicIds: ["sound-memory", "light-phenomena-memory"],
    reason: "Q2 科技第一批重写声音三特性与三类光现象题，并更新声音结构口诀和光现象速记提纲；受影响会话按迁移规则重建。",
  }],
};
