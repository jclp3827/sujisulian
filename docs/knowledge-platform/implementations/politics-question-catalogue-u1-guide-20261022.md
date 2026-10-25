# 政治题目统一只读目录 U1

2026-10-22；本批完成。对应[分批方案](politics-practice-reliability-and-unified-bank-plan-20261022.md#u1实施结果)，[目录制品](evidence/politics-question-catalogue-u1-20261022.json)与[验证记录](evidence/politics-question-catalogue-u1-validation-20261022.json)。

## 目录解决什么

统一检索145张回忆卡、24道应用题与14组易混，共183条管理记录。保留原ID、类型、知识目标、来源块、原制品定位、版本和审核状态；不复制题干、答案、选项和解释。原生成链仍持有内容权威，各模块继续使用原运行库。目录在docs中，查询器在scripts中，小程序不加载它。

回忆卡的自评、应用题的选择正误、易混组的初判与复辨是三种事实，不能互相换算；183条记录也不等于183道选择题。当前目录版本为`catalogue-a740ecfb5dcd`，不改变原题库、课程或知识包版本。

## 查询

在本工作树根目录运行：

```sh
# 不带参数仅输出总量和来源版本
node scripts/inspect-politics-question-catalogue.js
# 查一个目标与每日练习的交集，本例返回3道应用题
node scripts/inspect-politics-question-catalogue.js --objective=pol-obj-found-03-1 --consumer=daily
# 按类型检索
node scripts/inspect-politics-question-catalogue.js --kind=recall
# 检查制品是否与当前原库一致
node scripts/build-politics-question-catalogue.js --check
node scripts/validate-politics-question-catalogue.js
```

还支持`--unit=原单元ID`、`--source=原来源块ID`及`--item=原题目ID`。多个筛选取交集；item单条查询不能与筛选混用。类型为recall/application/confusion；主要投放入口为exam/daily/qa/confusion。未知ID返回空结果或null，错误参数名直接报错，不静默展示全库。

Node调用：

```js
const { getPoliticsQuestionCatalogue } = require('./scripts/lib/politics-question-catalogue');
const catalogue = getPoliticsQuestionCatalogue();
const cards = catalogue.byObjective('pol-obj-found-03-1', { kind: 'recall' });
```

`get/list/byObjective/byUnit/bySource/objective/summary/versions/version`返回只读数据。读取器核对当前来源指纹和完整派生结果，来源变更但未重新生成也会拒绝读取。仅在原生成链更新并核验后运行`node scripts/build-politics-question-catalogue.js`重建；不要手改目录JSON。运行题库校验入口已包含目录一致性检查。

## 关联含义与限制

- objectiveBindings区分primary、supporting、left和right。辅助关联只来自原库显式登记；允许跨单元，保留来源单元与正式目标所属单元，不能据此推定用户已经掌握目标。
- unitId只表示单一主单元；易混使用primaryUnitIds。unitIds还包含来源块实际所属单元，按来源不遗漏跨单元证据。
- sourceBindings保留answer/pitfall/remedy、evidence或left/right/comparison/initial/retest用途；source定位可回到原制品、集合、字段和原ID。
- consumers的范围为primary-learning-entry，表示主要题型投放入口。正文与旧版兼容学习流程也有辅助回忆复用；本字段不是全部组件调用依赖图，不能单凭它声称改题影响已检查完整。U2需再核查实际消费链。
- 当前97个正式目标均可查询，其中90个有目录关联，7个保持空集合；24道应用题涉及的11个主目标均可找到既有回忆卡。关联不代表覆盖完整考试范围，也不自动推荐所有相关卡。

## 完成与下一批

9项相关检查通过，包括目录可重建性、16种错误拒绝、原运行库一致性、R1练习可靠性、考试目标对齐、应用库、系统学习与UI合同。仅新增开发管理能力，未改页面、判分、会话或用户记录，因此本批不重新编译或要求页面验收。

发布准备待办PKG-01：仓库主包静态统计为3,191,379字节（3.044MiB），超过本地1.5MiB预算。U1未增加小程序文件；此数值不是微信实际打包结果，不能据此直接判断平台上传结果。后续需核对真实打包与包含文件，再确定拆包或裁剪方案；不得提高预算掩盖问题，也不在U1删改原有内容。

下一批U2先实现来源/目标变更影响检查，再确定精确补救关联；保留原ID与原作答事实。产品内如需使用，只带最小投影并核对包体，完整管理目录不进运行包。U3每日回忆与应用混排仍属另行产品决策。无新来源不扩库，未提交、合并、上传或发布。

更新：2026-10-22 [U2影响检查与精确补救](politics-question-management-u2-guide-20261022.md)已完成，上文“下一批U2”为U1完成时点记录。原U1只读目录合同和版本不变。

更新：2026-10-23 [U3每日练习与一问一答共用回忆卡](politics-practice-reliability-and-unified-bank-plan-20261022.md#u3实施结果)已完成。当前可重建目录版本为catalogue-f47efb496831；145条recall的主要消费者更新为exam、daily、qa，24条application仍为daily、qa，14条confusion仍为confusion。条目version继续保存原回忆/考试内容版本，练习逐卡practiceVersion由运行适配器使用，两者不得混为同一版本。原U1验证JSON是U1完成时点快照，未改写为U3验收记录。
