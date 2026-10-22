# 常识内容 Q0-A：口诀质量契约与记忆证据门

日期：2026-10-22
状态：`implemented-red-baseline`
范围：authoring schema、校验器、测试与证据失效规则；本批不改写 128 条口诀，不改页面。

## 本批结论

Q0-A 已把“口诀”从一个自由文本字段改成可审查的候选类型。当前 128 条存量口诀都没有新质量规格，因此严格模式必须失败；`--expect-red` 仅在口诀数量、包版本、缺失 ID 集合、错误计数、完整口诀/目标内容摘要，以及除 `redBaseline` 自身之外的质量 authoring 摘要均与登记基线完全一致时返回成功。只保留相同 ID 和数量但修改口诀文本、目标或协议，同样会使红基线失配。该成功只表示红基线被准确复现，不表示内容质量通过。

## 四种分类

| classification | 产品含义 | 约束 |
|---|---|---|
| `natural-mnemonic` | 自然口诀 | 使用自然短语、谐音、意象或故事锚点；有效字符原则上不超过 16 个 |
| `structural-mnemonic` | 结构口诀 | 依靠节奏、对照或稳定结构帮助还原 |
| `study-outline` | 速记提纲 | 明确标记为语义提纲，不冒充自然联想口诀 |
| `not-suitable` | 不适合口诀 | 必须登记理由；若资源仍留在口诀库，严格模式继续阻止准入 |

`pack.mnemonics` 与 `pack.targets` 缺失、不是数组或为空时，严格模式直接失败。口诀自身的 `revision` 与质量规格的 `mnemonicRevision` 都必须是正整数且完全一致。每条质量规格还必须登记 `anchorType`、`anchorText`、`orderRequired`、`hasAmbiguity` 和 `decodeMap`。每个 `decodeMap` 行均包含：

- `anchorSpan`：锚点中的起止位置；
- `chunk`：该位置的原文块；
- `targetId` 与 `concept`：能反解的知识目标与具体概念；
- `mappingType`：谐音、形似、意象、故事、节奏、语义、顺序或对照；
- `ambiguous`：是否多义；为真时必须写 `ambiguityNote`。

校验器要求锚点中的全部文字或数字都被解释，口诀声明的全部 target 都能由锚点反解。默认最多四块；超过四块必须记录人工理由。

## 独立 memoryTrial

记忆试用证据不写回口诀内容。每份 `memoryTrial` 独立绑定：

- `mnemonicId`、`mnemonicRevision`；
- `protocolVersion`；
- `contentFingerprint`；
- 样本人群、人数、招募方式；
- 协议要求的时间点、各时间点实测人数、锚点回忆、逐块解码与错误扩展结果；
- 实测日期。

协议的 `requiredMetrics` 只能取 `anchorRecall`、`decode`、`orderRecall`、`falseExtensionCount` 闭集，并至少包含锚点、解码和错误扩展。每个预期时间点同时声明 `delayMinutes` 与 `toleranceMinutes`；实测时间点不能使用相同延迟，也不能超出容差。基线容差必须为零，其他容差不得大于预期延迟的 25%。不存在的日期和未来日期均拒绝。

`contentFingerprint` 覆盖除工作流状态外的完整口诀内容，以及分类、锚点、解码关系、顺序和多义标记。任一内容、anchor、decode 或 revision 改变，旧证据会被判定为 `memory-trial-stale`，不会被批准状态继续复用。

探索证据与批准证据严格分开：当前 5 人协议的 `evidenceLevel` 是 `exploratory`，即使误把协议状态写成 `approved`，也不能支持口诀批准。未来批准协议至少需要：

- `evidenceLevel: approval` 且协议状态为 `approved`；
- 声明样本和每个评估时间点的实测样本均不少于 30 人；
- 同时测量闭集中的四项指标；
- 至少一个短时和一个不早于 24 小时的延迟评估；
- 短时锚点、解码、顺序正确率下限均不低于 80%，延迟下限均不低于 60%；
- 错误扩展率上限不高于 10%。

协议阈值不能低于以上固定地板，实际试用结果也必须逐项达到协议阈值。全零结果、只满足数据形状、样本声明足够但时间点严重流失，均不能产生批准资格。`approved` 口诀必须同时具备有效质量规格和当前指纹的正式达标证据。

30 人、80%、60% 和 10% 是当前产品治理地板，用来阻止少量样本、全零表现或可任意放宽的弱证据进入批准链路。它们不是“适合一般人的记忆规律”的统计结论，不能单独证明口诀对一般人群有效，也不能替代 Q3 的目标用户抽样、对照设计、认知访谈、领域人工审核与最终准入判断。

## 不适合口诀的撤回档案

仍在 active 口诀库中的 `not-suitable` 规格会继续阻断严格模式。完成撤回后，删除 active 资源及对应质量规格，并把处置写入独立 `mnemonicDispositionArchive`；档案至少登记合法 `mnemonicId`、正整数 `mnemonicRevision`、`disposition: retired`、可审查理由和非未来撤回日期。撤回档案与 active ID 冲突时仍失败，因而既能保留历史决定，也不会让仍在产品中的口诀绕过门槛。

## 命令和结果语义

```bash
node scripts/test-common-sense-mnemonic-quality-q0a.js
node scripts/validate-common-sense-mnemonic-quality-q0a.js --expect-red
node scripts/validate-common-sense-mnemonic-quality-q0a.js
```

- 单元测试必须为绿色；它覆盖空包、所有字段、多义标记、目标反解、revision、闭集指标、样本、时间点延迟、未来日期、正式阈值、撤回档案和四类证据失效。
- `--expect-red` 当前应为绿色，并报告 128 条 `missing-quality-specification`。
- 无参数命令是严格模式；当前应非零退出。这是预期的失败关闭。

## Q0-B 接口

Q0-B 不应一次把 128 条口诀机械补齐为绿色。按质量审计优先级逐条建立规格：先处置 D 级 8 条、超长 15 条、旧结构缺口 9 条；每条只能选择保留、改写、降级为速记提纲或撤回。每次内容或锚点调整都提升口诀 revision，已有试用证据随之失效。全部存量规格完成且严格模式转绿前，口诀不得进入正式准入。
