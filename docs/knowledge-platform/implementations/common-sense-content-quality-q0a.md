# 常识内容 Q0-A：公考题目质量门

实施日期：2026-10-22

状态：`implemented / expected-red-verified`

本文件只覆盖 Q0-A 的题目质量门子范围：建立字段契约、失败样例和当前红色基线，不在这个子范围修改页面、运行时服务或任何题目内容。Q0-A 总批次还包含口诀质量门和答错逐项理由 UI，统一范围见 [Q0-A 总登记](common-sense-content-q0-a.md)。现有 600 题仍是 `review`，`--expect-red` 通过只表示已准确识别既有缺口，不表示内容通过正式准入。

## 1. 执行入口

```bash
node scripts/validate-common-sense-content-quality-q0a.js --expect-red
```

该命令必须同时满足：

1. 完整合规 fixture 为绿色；
2. 12 条规则各自的失败 fixture 能命中对应规则，实际命中集合必须与 fixture 声明的目标规则和共现规则完全一致；
3. 当前包为红色；
4. 包版本、题量、完整内容 SHA-256、每条规则的命中数和违规实体集合 SHA-256 与冻结基线完全一致；即使命中数量不变，替换任何内容或违规实体也会失败。

不带参数时执行严格模式。当前库必须以非零退出码结束；修复批次最终只能以严格模式绿色作为自动门槛。红色基线发生任何变化时，`--expect-red` 都会失败，不能用“仍然有一些红项”代替对基线漂移的审查。

## 2. 新字段契约

字段先由质量门定义，Q0-B/Q1 回修时再写入正式内容：

| 位置 | 字段 | 闭集或要求 |
|---|---|---|
| `questionSpecifications[]` | `cognitiveLevel` | `recall`、`mapping`、`distinction`、`condition`、`application`、`synthesis` |
| `questions[]` | `assessmentType` | `learning-card` 或 `exam-check`；后者必须四选一 |
| `questions[]` | `examBasis.originType` | `self-authored`、`editor-selected`、`official-exam`、`exam-adapted` |
| `questions[]` | `examBasis.displayLabel` | 无可核验考试依据时，只能为“自编学习题”或“编辑精选” |
| `questions[].examBasis` | `evidence` | `official-exam`/`exam-adapted` 必须提供考试类型、年份、地区、试卷、题号、HTTPS 来源与核验日期 |
| `questions[].refs[]` | `auditStatus` | 仅接受 `ready-for-user-acceptance`、`approved`、`verified`，并要求可定位的 `sourceUnitIds` |

`checkPurpose` 继续表达具体检测用途，`cognitiveLevel` 用来形成稳定的认知层级统计。两者不能互相代替。

## 3. 规则、阈值与当前基线

运行时代码中的每条规则都登记了 `severity`、`threshold` 和 `failureExample`，并有独立失败 fixture。当前命中如下：

| 规则 | 严重度 | 当前命中 | 阈值摘要 |
|---|---|---:|---|
| `QG-PACK-001` 题库结构 | blocker | 0 | 题目、目标、题目关系和题目规格集合必须存在、为数组且非空；允许 0 个缺口 |
| `QG-REL-001` 题目—目标关系 | blocker | 33 | 每题恰好一条关系，主要目标非空且不跨领域/主题；允许 0 个缺口 |
| `QG-SPEC-001` 题目规格 | blocker | 33 | 每题恰好一条规格，目标与关系一致，所有错误项都有理由；允许 0 个缺口 |
| `QG-SOURCE-001` 来源状态 | blocker | 0 | 每题来源可定位且状态已就绪；允许 0 个缺口 |
| `QG-PURPOSE-001` 检测用途与认知标签 | blocker | 600 | `checkPurpose` 一致且 `cognitiveLevel` 属于闭集；允许 0 个缺口 |
| `QG-TYPE-001` 学习卡/考试检验 | blocker | 600 | 类型必填，`exam-check` 必须四选一；允许 0 个缺口 |
| `QG-EVIDENCE-001` 公考依据与称谓 | blocker | 600 | 依据类型必填；真题/改编称谓必须有完整证据；允许 0 个缺口 |
| `QG-POSITION-001` 答案位置 | error | 4 个统计人口 | 全库或单领域至少 20 题时，任一位置占比不得达到 50% |
| `QG-LENGTH-001` 正确项长度 | warning | 311 | 正确项严格长于全部错误项即登记人工复核，不单独阻断 |
| `QG-PROMPT-001` 重复通用题干 | error | 1 组 | 标准化后相同题干不得重复 5 次及以上 |
| `QG-ABSOLUTE-001` 绝对化弱干扰项 | warning | 76 | 仅扫描错误项，命中闭集极端词即登记人工复核，不单独阻断 |
| `QG-EDITORIAL-001` 内部编辑语言 | error | 255 | 用户可见题干、选项、解析和边界不得命中闭集内部词 |

`QG-POSITION-001` 的四个命中是全库、文史、科技、经济四个统计人口；法律只有 12 题，未达到 20 题的统计阈值。`QG-LENGTH-001` 与 `QG-ABSOLUTE-001` 是启发式复核清单，不能单独判定具体题目内容错误。

公考依据中的 `checkedAt` 必须是实际存在的公历日期，例如 `2026-02-30` 无效；考试年份必须为整数，范围为 1994 年至核验日期所在年份，不能把未来考试写成已经核验的历史依据。

当前完整内容指纹为 `c74658b99c05c496666ab9a5e3a511533e052696fac52d616a98e44803bffbff`。冻结基线还保存 12 条规则各自的违规实体集合哈希；规则计数相同但实体被替换时，`--expect-red` 仍会失败。

本门对绝对化词只扫描错误选项，因此当前 76 题与此前宽口径审计的“至少 93 题”不是同一分母；内部编辑词新增扫描选项，因此当前 255 题也与此前只扫描题干、解析和边界的 251 题不同。规则定义和冻结计数一起保存，避免后续把口径变化误写成内容改善。

## 4. 失败样例覆盖

[fixture](../../../scripts/fixtures/common-sense-content-quality-q0a-fixtures.js)包含 26 个失败用例：对题目、目标、题目关系和题目规格分别覆盖“缺失、非数组、空数组”12 种包结构；另覆盖单题缺少关系、单题缺少规格、来源未就绪、缺少认知标签、缺少题型、真题称谓缺证、非法日历日期、考试年份越界、固定答案位置、正确项唯一最长、通用题干重复、错误项使用绝对化措辞和面向用户的文案出现内部编辑词。

完整合规 fixture 同时包含合规的自编学习卡和带完整依据的四选一真题检验，证明规则存在可通过路径，不把质量门实现成永久红色。每个失败 fixture 声明允许共现的规则集合，校验器要求实际命中集合精确相等，避免一个坏样例因顺带触发别的规则而被误认为隔离测试通过。校验器还对当前内容制造一个只改变空格、规则计数通常不变的漂移，确认完整内容指纹仍能拒绝它。fixture 只验证结构和扫描行为，不替代领域专家对题目内容正确性的审核。

## 5. 退出结果与下一批

Q0-A 的脚本、字段契约、阈值、严重度、失败样例和红色基线均已建立。当前基线仍有 blocker/error，正式准入保持阻断。

下一批 Q0-B 按以下顺序处理：

1. 先补 33 题关系与规格缺口，法律 12 题优先；
2. 为全部题登记认知标签、学习卡/考试检验类型和公考依据对象；
3. 用稳定展示层洗牌消除答案位置提示，并验证答案和逐错误项理由的索引同步；
4. 登记重复题干、长度提示、绝对化错误项和内部编辑词的逐题处置，不通过放宽规则获得绿色；
5. 严格模式仍红或新增回归时触发既定停止门。

验证证据见 [Q0-A validation](common-sense-content-quality-q0a-validation.json)，冻结基线见 [Q0-A red baseline](common-sense-content-quality-q0a-red-baseline.json)。
