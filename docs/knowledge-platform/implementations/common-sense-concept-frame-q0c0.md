# 常识口诀概念框架 Q0-C0 实施记录

日期：2026-10-23  
状态：implemented / red-baseline-verified / learner-ui-not-started

## 本批目标

把“概念是什么”与“口诀怎么记”拆成两个稳定对象，建立失败关闭的概念框架契约。本批只建设 schema、校验器、负例夹具和存量红基线，不改学习页、题库、口诀、稳定 ID、进度、存储或判分协议。

## 契约边界

### 概念框架

每个 `conceptFrame` 必须登记：

- 稳定 ID、revision 与状态；
- `conceptTitle` 和至少两级 `parentPath`；
- 面向学习者的 `definition` 与公考 `examTask`；
- 一个主要 `relationType`；
- 一个根概念和至少一个关系节点；
- 节点的一句话含义、区分点和知识目标映射；
- 节点之间的关系边；
- 至少一个正文来源定位。

### 关系闭集

| 关系类型 | 必须出现的主要关系边 | 用途 |
|---|---|---|
| `classification` | `contains` 或 `distinguished-by` | 上位概念、类别和区分维度 |
| `causal-chain` | `causes` | 条件、机制、结果和治理方向 |
| `sequence` | `precedes` | 时间、流程和先后节点 |
| `contrast` | `contrasts-with` | 同一维度下的概念差异 |
| `conditional` | `applies-when` | 条件判断和分流 |
| `composition` | `part-of` | 整体和组成部分 |

一个框架可以混合辅助关系，但必须出现与主要关系类型对应的关系边，避免只登记标签而不表达知识结构。

### 口诀绑定

`mnemonicConceptBindings` 单独维护口诀与概念框架的联系：

- 每条现存口诀必须且只能绑定一个框架；
- 同时绑定口诀 revision 和框架 revision；
- 框架必须覆盖口诀逐句声明的全部 `targetIds`；
- `approved` 口诀只能依赖 `approved` 框架。

该方式无需修改现有口诀对象，也不会改变已有学习记录身份。

## 用户文案边界

`definition`、`examTask` 和节点 `plainMeaning` 不允许使用“帮助回忆”“用于记忆”“记住知识”等作者元语言。它们必须直接回答：

1. 这是什么概念；
2. 考试要求判断什么；
3. 子概念分别是什么意思；
4. 它们如何区分或关联。

`purpose`、`method`、`coverage` 继续作为口诀生产和审核元数据，本契约不把它们提升为概念说明。

## 失败关闭与退出机制

- 缺少概念框架绑定的口诀无法通过严格模式；
- 框架不能覆盖口诀知识目标时无法通过；
- 关系类型与关系边不一致时无法通过；
- 口诀不适合稳定反解时，后续批次应改为速记提纲、对照表、简明解释或撤回，不以补空泛文案强行通过；
- 概念框架完成不等于正式准入，学习页投影、新手理解和延迟记忆仍属于后续门槛。

## 红基线

当前 129 条口诀尚未迁移，预期结果为：

- 概念框架：0；
- 口诀绑定：0；
- `missing-concept-frame-binding`：129；
- 严格模式：失败；
- `--expect-red`：仅在口诀集合、内容摘要、authoring 摘要和缺口数量完全吻合时通过。

红基线通过只说明校验器准确识别存量缺口，不表示任何口诀已经完成概念先导改造。

## 验证结果

- 契约正反例：10/10 通过；
- 六类关系闭集：全部覆盖；
- 红基线：匹配；
- 严格模式：按设计失败，且仅产生 129 个 `missing-concept-frame-binding`；
- 现有常识学习回归：53/53 通过；
- JavaScript 语法及证据 JSON：通过。

## 本批文件

- `scripts/lib/common-sense-concept-frame-schema.js`
- `scripts/lib/validate-common-sense-concept-frames.js`
- `scripts/fixtures/common-sense-concept-frame-q0c0-fixtures.js`
- `scripts/test-common-sense-concept-frame-q0c0.js`
- `scripts/validate-common-sense-concept-frame-q0c0.js`
- `docs/knowledge-platform/content/common-sense-concept-frames-q0c0.js`
- `docs/knowledge-platform/implementations/common-sense-concept-frame-q0c0-red-baseline.json`
- `docs/knowledge-platform/implementations/common-sense-concept-frame-q0c0-validation.json`
- `docs/knowledge-platform/implementations/common-sense-concept-frame-q0c0.md`

本批全部为新增专属文件，没有改动现有内容包、页面、共享组件或公共业务接口。

## 下一自然批次

Q0-C1 只处理三个代表性主题：

1. 市场结构：分类关系；
2. 价格歧视：分级/区分关系；
3. 公共物品：属性、分类与因果链混合关系。

三个试点通过契约后，才进入学习页投影和存量迁移。
