"use strict";

// Q0-C0 establishes the concept-first contract without retrofitting the
// existing mnemonic inventory. Q0-C1 will add three independently reviewable
// pilot frames before any learner-facing projection is changed.
module.exports = {
  schemaVersion: 1,
  conceptFrameSchemaVersion: "q0c0-concept-frame-v1",
  conceptFrames: [],
  mnemonicConceptBindings: [],
  redBaseline: {
    packVersion: "2026-10-23.97",
    mnemonicCount: 129,
    conceptFrameCount: 0,
    bindingCount: 0,
    expectedErrorCounts: { "missing-concept-frame-binding": 129 },
    missingMnemonicIdsSha256: "51683a50cff86da2fc30db5124b4a845633027a37635c845482a7c1ec1737fdc",
    conceptInputSha256: "6da1a739337aac17c22a50e542527d4e670f565c691172cd937dc8854e2307b4",
    conceptAuthoringSha256: "758c0560a7e8150617d3ff2a21c14d479ca54cdce8bcd510fbc6f2792378cd20",
    reason: "Q0-C0 先建立失败关闭的概念框架契约；Q0-C1 再以三个主题验证学习链路。",
  },
};
