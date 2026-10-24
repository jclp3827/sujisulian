# ME-APP-VE-02 独立工程复核

结论：**APPROVE**。本报告仅为独立工程复核，不等同设备、视觉或用户人工验收。

- 新增言语应用201–212共12题；既有200仅依赖重绑，题面、选项、答案、解释保持。
- 9处来源块修订：8处仅解析，211为选项A转录及解析纠正。逐字段确认没有题干、答案及其他选项漂移。
- 旧117资源中116个序列化完全一致；200 r2→r3精确依赖重绑。158条旧回执前缀保持，新增13条精确绑定回执。
- 9组兼容签名中原8组保持；新增1组精确对应200。234个旧会话场景恢复位置、来源token和既有结果；6类不兼容变更拒绝且无存储写入。
- 当前129开发资源、108应用、28言语应用、133记忆卡、正式资源0。记忆包字节未变化。
- 原文、运行时note-verbal双镜像、审计与inventory兼容摘要一致。无公共UI、schema、存储、判分运行逻辑或正式启用变化；必要构建期兼容与批次支持改动已列明。

本轮独立重跑5项且通过：

- `node scripts/validate-notes-application-ve02.js`（exit 0）
- `node scripts/build-notes-learning.js --check-only`（exit 0）
- `node scripts/build-note-runtime.js --notes-only --check-only`（exit 0）
- `node scripts/build-notes-memory-expansion-plan.js --check-only`（exit 0）
- `node scripts/validate-notes-memory-source-rebinding.js`（exit 0）

专项验证20项，来源兼容验证23项。当前proof记录17组均通过，27项实现和67项来源文件哈希对应；本轮未宣称独立重跑全部17组。最终再次核对25个绑定输入及proof，共26项哈希，全部一致。

Proof：`docs/knowledge-platform/implementations/evidence/ME-APP-VE-02-preview.json`，SHA-256 `5f74d519d306b245e23744811d8a942b8701723fae04de94a1bad3d6d2bfdfdf`。计划当前ME-APP-VE-02，下一批ME-APP-VE-03。

详细精确输入哈希、13条路由、133卡路径、逐项结果及兼容负例见同名JSON。本轮只写两份独立报告，未修改业务文件、manifest、源码或proof；未执行提交、推送、发布。
