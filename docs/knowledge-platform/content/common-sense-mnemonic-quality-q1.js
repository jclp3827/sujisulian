"use strict";

// Q1 only specifies the two memory products examined by this pilot. The other
// active resources deliberately remain missing so the global gate stays red.
const q0a = require("./common-sense-mnemonic-quality-q0a");

module.exports = {
  schemaVersion: 1,
  qualitySchemaVersion: "q0a-mnemonic-quality-v1",
  mnemonicQualitySpecifications: [
    {
      mnemonicId: "q1-modern-treaty-contrast-memory",
      mnemonicRevision: 1,
      classification: "structural-mnemonic",
      anchorType: "structural",
      anchorText: "南港五关税，马辽台澎厂，辛馆驻兵。",
      orderRequired: true,
      hasAmbiguity: true,
      dispositionReason: "三段首字分别指向条约名，其余字块按时间顺序提示高辨识度条款；属于需结合三条约对照语境逐段反解的结构口诀，不主张自然联想，也不宣称脱离语境普遍有效。",
      decodeMap: [
        { anchorSpan: [0, 5], chunk: "南港五关税", targetId: "q1-target-nanjing-treaty", concept: "《南京条约》：香港岛、五口、协定关税", mappingType: "sequence", ambiguous: true, ambiguityNote: "“南”“港”“五”均省略完整名称或动作，只能在三条约对照主题中还原。" },
        { anchorSpan: [6, 11], chunk: "马辽台澎厂", targetId: "q1-target-shimonoseki-treaty", concept: "《马关条约》：辽东半岛、台湾、澎湖列岛、设厂", mappingType: "sequence", ambiguous: true, ambiguityNote: "“马”“厂”省略条约全名和设厂限定，只能在三条约对照主题中还原。" },
        { anchorSpan: [12, 16], chunk: "辛馆驻兵", targetId: "q1-target-boxer-protocol", concept: "《辛丑条约》：使馆界、驻兵", mappingType: "sequence", ambiguous: true, ambiguityNote: "“辛”“馆”省略条约全名和使馆界限定，只能在三条约对照主题中还原。" },
      ],
    },
    {
      mnemonicId: "market-failure-four-factors-memory",
      mnemonicRevision: 2,
      classification: "study-outline",
      anchorType: "semantic-outline",
      anchorText: "垄外公共信息差",
      orderRequired: false,
      hasAmbiguity: true,
      dispositionReason: "该短句是四类因素的首字和关键词压缩，没有独立自然联想；保留为速记提纲，不宣传为口诀。",
      decodeMap: [
        { anchorSpan: [0, 1], chunk: "垄", targetId: "cs-target-market-failure-monopoly-factor", concept: "垄断", mappingType: "semantic", ambiguous: false },
        { anchorSpan: [1, 2], chunk: "外", targetId: "cs-target-market-failure-externality-factor", concept: "外部性", mappingType: "semantic", ambiguous: true, ambiguityNote: "单字“外”可有多种含义，只能在四类因素提纲中还原为外部性。" },
        { anchorSpan: [2, 4], chunk: "公共", targetId: "cs-target-market-failure-public-goods-factor", concept: "公共物品", mappingType: "semantic", ambiguous: false },
        { anchorSpan: [4, 7], chunk: "信息差", targetId: "cs-target-market-failure-information-factor", concept: "信息不对称", mappingType: "semantic", ambiguous: false },
      ],
    },
  ],
  memoryTrials: [],
  mnemonicDispositionArchive: [],
  memoryTrialProtocols: q0a.memoryTrialProtocols,
};
