# 常识内容 Q0-A：质量门与答错反馈闭环

实施日期：2026-10-22

状态：`implemented / exact-expected-red-verified / release-blocked`

Q0-A 已完成题目质量门、口诀质量门和答错后逐项理由展示三条交付。本批建立的是内容进入正式状态之前的失败关闭机制，并把已经存在的逐错误项理由接到真实学习页面；没有批量修复或批准存量内容。当前 600 道题和 128 条口诀继续保持 `review`，正式准入仍被阻断。

## 1. 三条交付

| 交付 | 已建立能力 | 当前状态 |
|---|---|---|
| 题目质量门 | 题目—目标关系、题目规格、来源、认知标签、题型、公考依据、答案位置、正确项长度、重复题干、绝对化错误项和内部编辑语言共 12 条规则；每条登记严重度、阈值、失败样例与可通过 fixture | 精确预期红已复现；严格模式失败关闭 |
| 口诀质量门 | `natural-mnemonic`、`structural-mnemonic`、`study-outline`、`not-suitable` 四类；锚点逐块反解、目标覆盖、多义标记、revision 和独立 `memoryTrial` 绑定；内容、锚点、解码或 revision 变化会使旧证据失效 | 128 条口诀均缺少新质量规格；严格模式失败关闭 |
| 答错逐项理由 | 页面按用户实际选择的选项索引读取 `questionSpecifications.distractorReasons`，同时展示正确答案；查看原文和缓存恢复后仍保持所选项、正确项与理由 | 自动回归和一次真实开发者工具页面链通过 |

`--expect-red` 返回成功只说明当前红色缺口与冻结基线完全一致。它不表示题目或口诀已通过内容审核，也不表示这些治理阈值已经证明口诀对一般人群有效。两个严格命令当前退出 `1` 是预期的失败关闭结果，不是测试故障。

## 2. 当前精确红基线

题目包版本为 `2026-10-21.64`，题量为 600。关键命中如下：

| 规则 | 命中 |
|---|---:|
| 题目—目标关系缺口 `QG-REL-001` | 33 |
| 题目规格缺口 `QG-SPEC-001` | 33 |
| 认知标签缺口 `QG-PURPOSE-001` | 600 |
| 学习卡/考试检验类型缺口 `QG-TYPE-001` | 600 |
| 公考依据对象缺口 `QG-EVIDENCE-001` | 600 |
| 答案位置异常统计人口 `QG-POSITION-001` | 4 |
| 正确项唯一最长人工复核 `QG-LENGTH-001` | 311 |
| 重复通用题干组 `QG-PROMPT-001` | 1 |
| 绝对化弱干扰项人工复核 `QG-ABSOLUTE-001` | 76 |
| 面向用户字段含内部编辑语言 `QG-EDITORIAL-001` | 255 |

题库结构和来源状态规则当前均为 0 个命中。长度和绝对化词是人工复核清单，不能单独判定内容错误；其余 blocker/error 仍使正式准入保持阻断。

口诀包版本同为 `2026-10-21.64`，口诀数为 128；质量规格、记忆试用和有效批准证据均为 0，当前精确错误为 128 条 `missing-quality-specification`。

## 3. 两类 SHA 身份

红基线同时冻结内容身份和门禁范围/authoring 身份，不能只比较数量：

- 题目完整内容 SHA-256：`c74658b99c05c496666ab9a5e3a511533e052696fac52d616a98e44803bffbff`；12 条规则还分别保存违规实体集合 SHA-256，完整值见[题目红基线](common-sense-content-quality-q0a-red-baseline.json)。
- 口诀与目标内容 SHA-256：`02c31ece018e8b32d8ee402a95676ec70fbd57daa1e91d48037b2c0a58380476`。
- 口诀质量 authoring SHA-256：`fcd918b88a2302e2dbf1b30c05861ea6f31cbb4219cef1e2ac1fc63f94804bbc`。

因此，即使命中数、题量或口诀数保持不变，替换内容、违规实体、协议或质量 authoring 也会使 `--expect-red` 失败并要求重新审查。

## 4. 执行命令与结果语义

| 命令 | 本批结果 | 含义 |
|---|---|---|
| `node scripts/validate-common-sense-content-quality-q0a.js --expect-red` | 退出 0；28 项 fixture/漂移检查通过，精确红基线匹配 | 题目门正确识别当前缺口 |
| `node scripts/validate-common-sense-content-quality-q0a.js` | 退出 1 | blocker/error 仍存在，按设计阻断准入 |
| `node scripts/test-common-sense-mnemonic-quality-q0a.js` | 退出 0；13 项检查通过 | 口诀 schema、证据与失效规则通过单元验证 |
| `node scripts/validate-common-sense-mnemonic-quality-q0a.js --expect-red` | 退出 0；精确复现 128 条缺规格 | 口诀门正确识别当前缺口 |
| `node scripts/validate-common-sense-mnemonic-quality-q0a.js` | 退出 1 | 128 条口诀尚未具备正式准入规格 |
| `node scripts/validate-common-sense-learning.js` | 退出 0；52 项回归通过 | 逐项理由、正确答案和恢复状态的运行时链路通过 |
| `python3 scripts/validate-common-sense-learning-compile.py` | 退出 0 | 页面模板/样式离线检查通过；不等同整包构建或上传 |

口诀门中的 30 人、短时 80%、延迟 60% 和错误扩展不高于 10% 是当前产品治理地板，用来阻止弱证据进入批准状态。它们不是一般人群记忆有效性的结论，Q3 仍需目标用户抽样、对照设计、认知访谈和领域人工审核。

## 5. 真实微信开发者工具证据

同一 Q0-A 实施轮次曾在已经连接的本地微信开发者工具 `develop` 环境、自动化端口 `9421` 运行：

```bash
python3 scripts/validate-common-sense-learning-devtools.py --port 9421
```

该次运行通过了实际页面链：从常识首页进入一问一答，选择错误项“杜甫”后，页面实际展示所选项理由“诗圣对应杜甫。”和正确答案“李白”；随后进入李白正文并返回学习页，当前卡、已选“杜甫”和对应逐项理由均保持；退出再进入时缓存恢复正确。脚本结束后恢复了两项常识测试缓存，`uploaded` 为 `false`，未上传、未部署，也未形成真机体验通过结论。

在上述成功运行之后，根任务尝试重新连接端口 `9421` 时连接失败，原因是开发者工具自动化会话/窗口生命周期已经结束。该连接失败不能篡改此前已经取得的成功证据，也不应写成产品回归；同时本登记不声称完成了第二次真实复跑。

## 6. 子文档与下一批

- [题目质量门](common-sense-content-quality-q0a.md)
- [口诀质量契约与记忆证据门](common-sense-content-q0-a-mnemonic-quality.md)
- [统一结构化验证](common-sense-content-q0-a-validation.json)

下一批为 Q0-B：先补齐 33 道题的关系和规格缺口，法律 12 题优先；再为题目建立认知标签、学习卡/考试检验类型和公考依据，并按审计优先级处置口诀规格。不得通过放宽规则、改写冻结基线或把 expected-red 解释成准入通过来取得绿色。
