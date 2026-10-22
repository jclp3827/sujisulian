// Q0-A authoring registry. This file deliberately does not retrofit the 128
// existing mnemonics: the red baseline must stay explicit until Q0-B reviews
// each item and authors a quality specification.
module.exports = {
  schemaVersion: 1,
  qualitySchemaVersion: "q0a-mnemonic-quality-v1",
  mnemonicQualitySpecifications: [],
  memoryTrials: [],
  mnemonicDispositionArchive: [],
  memoryTrialProtocols: [
    {
      version: "q3-exploratory-pilot-v1",
      status: "review",
      evidenceLevel: "exploratory",
      audience: "公考备考用户",
      minimumSampleSize: 5,
      requiredTimepoints: [
        { id: "baseline", delayMinutes: 0, toleranceMinutes: 0 },
        { id: "10m", delayMinutes: 10, toleranceMinutes: 2 },
        { id: "24h", delayMinutes: 1440, toleranceMinutes: 120 },
      ],
      requiredMetrics: ["anchorRecall", "decode", "falseExtensionCount"],
      note: "探索性预试验协议；不能单独把口诀升级为 approved。",
    },
  ],
  redBaseline: {
    packVersion: "2026-10-21.64",
    mnemonicCount: 128,
    expectedErrorCounts: { "missing-quality-specification": 128 },
    missingMnemonicIdsSha256: "85129fb5868fef7848c8b671b27262849deb49cd1403a4cb07adccadfd81a036",
    mnemonicTargetContentSha256: "02c31ece018e8b32d8ee402a95676ec70fbd57daa1e91d48037b2c0a58380476",
    qualityAuthoringSha256: "fcd918b88a2302e2dbf1b30c05861ea6f31cbb4219cef1e2ac1fc63f94804bbc",
    reason: "Q0-A 先建立失败关闭的质量契约；Q0-B 再逐条处置存量口诀。",
  },
};
