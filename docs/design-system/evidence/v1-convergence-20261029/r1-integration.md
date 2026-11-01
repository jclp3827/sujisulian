# I0：R1 展示配方精确接入记录

状态：**独立 V1.0 整合候选中的 draft 实现**。本记录不代表正式共同分支、产品视觉或真机批准。

## 来源、范围与回退

- 实施前计划 checkpoint：`a59f82a4c775c729a4eb75fd712a1e2b6439a309`；产品来源 `main c935e7de13b271d36b543dbaf32ee87346a577d0`。
- R1 实现来源：`56442332150732b96e442202c33b81efa0375542`；其展示增量相对 `0e5847905ff42a164b995051936d911568cb95cc` 提取。目标基线在这八个路径上的原内容与该父提交相同。
- [逐文件身份](r1-identity.json)由 [校验脚本](verify-r1-integration.py)产生。八个产品文件与 R1 来源逐字节相同：`miniprogram/styles/ds3-r1-results.wxss`、`miniprogram/templates/learning-progress.wxml`，以及笔记 practice、常识 learning、政治 practice 各自的 `index.wxml` 和 `index.wxss`。
- 实际页面范围：笔记 application，常识 daily/guide，政治 qa。原页面的业务 JS、评分、记录、题库、云函数、资源树均未被此 I0 修改。模板调用和样式导入登记于 `PAT-PROGRESS`、`PAT-CHOICE`。政治回忆、自评和主动揭晓保持独立语义。
- 本 I0 独立提交可完整撤回上述八个产品文件与两条 draft 登记更新；正式共同分支及原 R1 树不随本候选改变。

## 自动检查与原始记录

在本整合工作树运行 `python3 docs/design-system/evidence/v1-convergence-20261029/verify-r1-integration.py`：通过，精确产品文件集合为八个，云函数和资源零差异。`node scripts/validate-design-system.js`：通过；四项现存提示不是硬错误。`git diff --check`：通过。原始运行输出与文件散列见 `r1-identity.json`。

以下命令均在本整合工作树以 `node scripts/<名称>.js` 运行，原始 stdout/stderr 保存在 [r1-tests](r1-tests/)；结果不得用业务替身测试等同真实页面验收。

| 检查 | 本候选 | 基线对照 | 判断 |
| --- | --- | --- | --- |
| `validate-learning-bank-buffer` | PASS | — | 受影响缓冲/恢复控制器通过 |
| `validate-learning-bank-clients` | PASS | — | 学习客户端控制器通过 |
| `validate-learning-bank-practice-buffer` | PASS | — | practice 缓冲及返回通过 |
| `validate-politics-practice-reliability` | PASS | — | 政治记录与跨页可靠性替身通过 |
| `validate-public-learning-page-runtime` | PASS | — | 公共学习页替身通过 |
| `validate-notes-learning-pages` | FAIL | 同一断言 FAIL | `loading` 与旧测试期望 `question` 不同；原基线亦如此，不能记作通过 |
| `test-common-sense-guide-page` | FAIL | 同一断言 FAIL | 当前入口无旧测试期望的 `sample=expansion-v1`；原基线亦如此 |
| `validate-ui-tokens` | FAIL | 同一断言 FAIL | 阅读控件 `--pr-muted`、`--pr-divider` 在原基线亦被脚本报未定义；本 I0 未改阅读控件 |

三项基线复测在干净的 `c935e7d` 已提交产品树进行；断言的 actual/expected 与本候选相同，绝不将历史失败升级为 PASS，也不为获得全绿改业务或无关页面。自动检查可说明源码身份、静态关系和控制器行为，不能证明真实渲染与触摸。新的同源码模拟器多状态截图、375/390/428 宽度、长内容和真机触摸/安全区仍待分别补证；旧 R1 图不冒充本候选图。

## 契约与消费者

`DS-SEM-004`、`DS-PAT-006` 为三页/四模式限定 approved **产品规则**，六个结果色值只批准该范围；`DS-EXP-004` 不主动跟随系统动态字号。结果配方只消费业务给出的正确/错误状态，不重算答案；进度模板只消费调用方给出的显示值、比例或纯数字，不计算分母/完成。组件实现仍为 draft，新增消费者必须核对当前源码和作用域。当前接入不扩大行测速练、照片、搜索、阅读正文等消费者。
