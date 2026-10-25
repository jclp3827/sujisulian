# 常识口诀概念学习质量门 Q0-C3

日期：2026-10-23  
状态：implemented / static-gate-passed / hold-independent-novice-retelling

## 已建立的门槛

每个试点必须同时满足：

1. **概念身份**：稳定绑定上位概念、revision 和正文来源；
2. **术语先解释**：口诀出现前，关键术语必须由概念节点解释；
3. **关系完整**：概念框架中的每条关系边都必须进入口诀反解；
4. **锚点可解码**：每个口诀片段只能通过已登记节点恢复完整结论，并覆盖原有知识目标；
5. **三层自测**：概念识别、关系理解和情境运用均有当前题目，且不超出声明的概念目标；
6. **无提示新手复述**：不能在问题中泄露口诀、提示或选项；复述必须包含根概念、足量节点和关系；
7. **独立证据**：每个主题至少 5 名未参与编写的新手，80% 以上达到节点、关系和逐句解码门槛；同作者观察和旧内容指纹均不计入。

## 三个试点的静态结果

- 概念学习规格：3；
- 结构有效：3；
- 结构错误：0；
- 已登记独立试用：0；
- 停止项：3 个 `missing-independent-novice-retelling`；
- `readyForExpansion=false`；
- 正式准入没有变化。

这意味着源码、映射和学习链路已经可供测试，但不能由编写者自行宣布“新手已经理解”。只有三个当前内容指纹的独立试用均达标，校验器才会把 `readyForExpansion` 改为 `true`。

## 自测范围

- 市场结构：5 题，覆盖分类身份、类别关系和情境判断；
- 价格歧视：5 题，覆盖定义前提、三级映射和具体情境；
- 公共物品：5 题，覆盖属性、纯/准区分、因果链与供给方向。

## 验证

- 质量门正反例：8/8 通过；
- 三个静态规格全部通过；
- 停止门内容、authoring 和具体 owner 集合已冻结；
- `--expect-hold` 通过；严格模式按设计失败；
- 伪造同作者证据或过期指纹会被拒绝。

## 停止门与下一步

当前必须停止批量迁移。下一步需要按登记问题分别招募至少 5 名独立新手测试三个主题，记录其复述节点、关系、逐句解码和错误扩展。三项均达到 80% 后，才进入 Q0-Cn 的下一小批迁移；未达标的主题先改概念框架、降级记忆形式或撤回口诀。

## 文件

- `scripts/lib/common-sense-concept-learning-schema.js`
- `scripts/lib/validate-common-sense-concept-learning.js`
- `docs/knowledge-platform/content/common-sense-concept-learning-q0c3.js`
- `scripts/test-common-sense-concept-learning-q0c3.js`
- `scripts/validate-common-sense-concept-learning-q0c3.js`
- `docs/knowledge-platform/implementations/common-sense-concept-learning-q0c3-validation.json`
