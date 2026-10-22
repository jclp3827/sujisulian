# V4 独立复审与核源清单

> 当前方向已更新为[笔记V5知识快闪卡产品定义](notes-memory-v5-product.md)及[V5实施步骤与批次](notes-memory-v5-batches.md)。本文件保留旧选择题方案、结果与回执复审历史；其后续扩充／旧EV7排期不作为当前执行指令。先完成原内容切片与重组审计、有限样板及产品定义，扩充方案与批次届时另建。此次仅更新文档，运行代码和历史数据未改。

日期：2026-10-22。状态：待独立复审。此清单是交接索引，不是新的内容或批准权威；实际题目以learning-v1为准，决定仅追加到exam-reviews。编写任务不得换一个评审名字自行接受本次22项草稿。

## EV7：按模块独立复审

| 批次 | 模块 | 具体版本数 | 当前接受 |
|---|---|---:|---:|
| EV7-logic | logic | 4 | 0 |
| EV7-graphic | graphic | 3 | 0 |
| EV7-verbal | verbal | 5 | 0 |
| EV7-quantity | quantity | 5 | 0 |
| EV7-data-analysis | data-analysis | 5 | 0 |

每片少于12；完整材料任务不得拆。每题检查考试调用价值、实际检测动作、答案及必要条件、主归属、来源语义与逐选项真实误用。两选项可用，不为凑三项制造荒谬干扰。来源框架或词表未核之处不整页过继。

| 模块／题目 | revision | 替代冻结旧题 |
|---|---:|---|
| logic / `notes-q-c05-logic-method-01` | 3 | `notes-q-c05-logic-method-01` |
| logic / `notes-q-v4-logic-basic-counterexample` | 1 | `notes-q-nq4-logic-method-checks` |
| logic / `notes-q-v4-logic-method-kind-part` | 1 | 独立补缺提案 |
| logic / `notes-q-v4-logic-method-matching-exclusion` | 1 | `notes-q-nq4-logic-method-table-trial` |
| graphic / `notes-q-nq6-graphic-method-operations` | 2 | `notes-q-nq6-graphic-method-operations` |
| graphic / `notes-q-v4-graphic-method-stroke-components` | 1 | 独立补缺提案 |
| graphic / `notes-q-v4-graphic-basic-mnemonic-chen` | 1 | 独立补缺提案 |
| verbal / `notes-q-v4-verbal-method-evade-decline` | 1 | `notes-q-nq5-verbal-method-objects` |
| verbal / `notes-q-v4-verbal-method-flashy-inconsistent` | 1 | `notes-q-c02-verbal-method-01` |
| verbal / `notes-q-v4-verbal-method-fragment-clue` | 1 | `notes-q-nq5-verbal-method-correspondence` |
| verbal / `notes-q-v4-verbal-basic-unpunctuated-trap` | 1 | 独立补缺提案 |
| verbal / `notes-q-v4-verbal-basic-polite-refusal` | 1 | 独立补缺提案 |
| quantity / `notes-q-v4-quantity-basic-work-relation` | 1 | `notes-q-nq3-quantity-basic-work` |
| quantity / `notes-q-v4-quantity-method-intermediate-return` | 1 | `notes-q-nq3-quantity-method-unknown` |
| quantity / `notes-q-v4-quantity-method-time-efficiency-ratio` | 1 | `notes-q-nq3-quantity-method-value` |
| quantity / `notes-q-v4-quantity-method-equal-distance-time` | 1 | 独立补缺提案 |
| quantity / `notes-q-v4-quantity-basic-positive-partition` | 1 | 独立补缺提案 |
| data-analysis / `notes-q-v4-da-method-share-rate-denominator` | 1 | `notes-q-da-method-0002`、`notes-q-c01-data-analysis-method-01` |
| data-analysis / `notes-q-v4-da-method-cross-term-zero` | 1 | `notes-q-nq2-da-method-cross-term` |
| data-analysis / `notes-q-v4-da-method-ratio-growth-factor` | 1 | `notes-q-nq2-da-method-denominator` |
| data-analysis / `notes-q-v4-da-basic-percentage-point` | 1 | 独立补缺提案 |
| data-analysis / `notes-q-v4-da-method-pulling-contribution` | 1 | 独立补缺提案 |

[精确摘要和依赖清单](../content/notes/exam-review-queue-v4.json)记录题目有效摘要、目标、知识原子、对照、来源页签／块及共享关系。22项均可完整解析依赖，但binding resolved不等于内容合格；当前仍未入entryPlans。

## 恢复步骤

1. 独立评审先核当前版本与完整依赖，不能仅看摘要或此前样板。逐条EXAM-01至10记录证据；口诀不适用须真实，不以自报true代替评审。
2. accept-candidate / rewrite / drop / hold都追加回执并显式接替head；冲突先hold。若题干、选项、解释、条件或目标实质变化，升版本后重新独立复审；新任务换ID，旧记录保留。
3. 当前有效接受且相关工程门通过后，才可将精确ID加入唯一entryPlans；review仍只供开发环境。来源关系接受不等于题目接受。
4. 构建、真实消费、依赖变化、旧会话、回源返回与相关内容检查通过，再交付本模块阶段结果。正式人工批准、设备、实际包体与发布仍分开。

## EV8：3道原应用的核源／选项说明

| 原应用 | 当前原因与恢复条件 |
|---|---|
| `notes-q-da-application-0001` r1 | 原结果11.1%已复算；现干扰解析全是通用不符模板，尚不能记录每个选项的实质理由，保留待核。 |
| `notes-q-da-application-0002` r1 | 原结果约40.9已复算；现干扰解析全是通用不符模板，需核各选项的具体误用与原题身份。 |
| `notes-q-c01-data-analysis-application-01` r1 | 原算式唯一结果50%已复算；但55%、60%对应干扰依据不足，原题身份也未核；原应用保留，待源与选项说明核验。 |

这些原题的数值解已复算；不将算对等同选项理由齐备。先核原任务和每一选项，再补可证的理由；不能为解释干扰编造考试来源或心理误用。题源无法核准时继续legacy-unverified，不能正式批准。实质修改后必须另版独立审。

来源账另列108条边界／核源事项，包含缺条件、措辞、配图未验和可能错误，不是108项确认错误。按来源身份及SHA追踪；先用原证据或独立推导分类，再提限定修正文稿和受影响目标清单。原50JSON此次保持不变；不得批量“修正”后复用旧回执。

## EV9与正式启用

同一构建的真机往返、320px、大字号和真实压缩包体另行验收。此次只有离线模板／样式编译；CLI帮助能力检查未启动登录、预览、上传或清缓存。没有正式批准时不生成正式练习包，检查已证明拒绝且运行包未被覆盖。不得由本清单自动触发提交、合并、上传或发布。
