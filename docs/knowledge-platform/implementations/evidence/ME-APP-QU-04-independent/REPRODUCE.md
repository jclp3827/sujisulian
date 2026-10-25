# ME-APP-QU-04 独立复核复跑

这些脚本绑定本报告的QU04源码/内容版本，不能用后续批次的变化冒充该版本重现。

先把本独立证据目录完整复制到新的临时输出目录；将 `NOTE_REVIEW_ROOT` 设为待核的同版本仓库，将 `NOTE_REVIEW_OUT` 设为该临时证据副本。独立的 `review-baseline.json` 来自本批前的工作树SHA捕获，含425个受保护小程序文件及G0引擎/合同文件摘要；无需依赖原 `/private/tmp/.../baseline.json`。

依次运行：

1. `node scripts/validate-notes-application-qu04.js`，保留结果到证据副本的 `application-validator-initial.json`。
2. 证据副本中的 `engineering-negative-review.js`、`proof-closure-negative-review.js`、`protected-negative-review.js`。
3. `historical-v2-fixture.js`，结果保存到 `historical-v2-fixture-result.json`。它仅隔离历史12题选择，不能用于证明当前71应用数量。
4. `scripts/build-notes-learning.js --check-only`、`scripts/build-notes-memory.js --check-only`、`scripts/build-notes-memory-candidate-review.js --check-only`。
5. `finalize-review.js` 对照当前哈希、12份回执、packet和复跑结果生成报告。

默认路径仍指向本批隔离工作区；指定环境变量可改用同版本副本。所有负例是内存中的依赖/文件读取覆写，不写业务文件或学习存储。`finalize-review.js`、测试脚本只写独立证据输出目录。数学脚本默认写原独立临时目录，可复制后调整其输出目录再复跑。

旧 `validate-notes-memory-expansion-v2.js` 直接运行产生 `71 !== 12` 是历史数量断言，不记作当前通过；真实失败及历史fixture边界已经单独登记。
