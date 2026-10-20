# 政治正文连续分层阅读实施记录

> 本文保留首轮历史。用户反馈后已完成[第二轮调试](./politics-knowledge-body-reading-v2-20261019.md)，当前实现与证据以第二轮为准；下文重点开关、旧包版本及缺少模拟器截图的描述不再代表当前状态。

日期：2026-10-19\
目标工作树：`/Users/jmac/.codex/worktrees/politics-body-home-optimization/miniprogram-1`\
分支：`codex/politics-body-home-optimization`\
状态：R0 至 R3 工程实现与自动验证完成；R4 四篇同构建阅读体验待用户验收；R5 其余 33 篇尚未开始。

本轮把已接受的[连续分层阅读与辅助信息治理方案](./politics-knowledge-body-reading-plan-20261019.md)落实为四篇候选实现。政治内容继续保持 `candidate / review / release=0`，没有提交、推送、合并或发布，也没有把自动检查当成真机阅读验收。

## 1. 批次状态

| 批次 | 状态 | 本轮结果 |
|---|---|---|
| R0 基线与归属 | 完成工程基线 | 核验目标工作树、分支和当前包；保留工作树中全部既有未提交资产；定位四篇的目录、标签、关系与入口问题 |
| R1 解析与内容合同 | 完成 | 构建器支持 `reading_schema: 1` 与单条 `kp:reading` 注释；精确校验标题、强调、关系位置和同篇比较；旧包继续完整降级 |
| R2 四篇内容与共用正文 | 完成自动部分 | 四篇完成复核标注和一处语义纠正；共享正文实际消费章节、句内强调与比较；泛化语义胶囊撤出正文 |
| R3 跨入口与辅助信息 | 完成自动部分 | compact 不再隐藏目录；本地边界、跨篇比较、背景关系按阅读职责出场；独立正文与路线正文共用显示偏好 |
| R4 四篇阅读体验验收 | 待用户 | 需要在同一候选构建完成 320px、大字号、独立正文、系统学习、搜索回返及 READ-12 阅读问题 |
| R5 全量推广 | 未开始 | 按方案退出门，四篇通过 R4 前不处理其余 33 篇 |

## 2. 已实现的产品行为

1. **章节来自人工确认的结构。** 目录只消费正式 Markdown 标题或 `reading.heading`，不再拿 definition、hierarchy 等语义类型猜章节。u003 为四部分，u024 为四主题及其子节，u025 为三个小节，u007 保留三大节和真实子节层级。
2. **重点落在原句内部。** 精确选择器生成 `textRuns`、列表项和表格单元格片段；`key` 可随显示菜单里的“重点”开关显示或关闭，`boundary` 始终可读；片段重新拼接必须与原文逐字符一致。
3. **标签按业务意义治理。** definition、conclusion、hierarchy 等数据仍保留在运行时，但正文不再显示通用类型胶囊。条件、范围和判断边界通过原句与强调表达；审核状态、协议、哈希等管理信息不进入普通正文。
4. **易混与关联按用途出现。** 本篇判断边界可在论述组末出现；跨篇比较和背景关系进入“相关知识 · 按需查看”，入口使用“对照理解、理解前置、继续了解、查看区别、延伸阅读”等自然说明。u024 的“主要矛盾／矛盾主要方面”增加同篇原文对照，未创建第二份答案。
5. **不同入口共用正文能力。** 系统学习的 compact 只压缩宿主装饰，不再移除正文目录；重点偏好使用既有全局显示设置，独立正文与路线正文一致。
6. **无标注内容安全降级。** 其余 33 篇和旧包仍显示完整原文，不猜标题、不猜重点、不产生空比较；未知可选运行时标注也回退为完整原文。

## 3. 四篇内容记录

| 知识 | 内容版本 | 阅读标注 | 关键结果 |
|---|---:|---:|---|
| u025 量变质变规律 | 5 | 8 / 10 块；3 个标题；11 处强调；1 个关系位置 | “区分标志、辩证关系、方法论”完整；b007 从 `condition` 定向纠正为 `conclusion`；跨篇关系收于文末 |
| u024 对立统一规律 | 5 | 15 / 25 块；11 个标题；15 处强调；1 组同篇比较 | 四主题完整；“主要矛盾／矛盾主要方面”按“讨论对象、决定什么”对照；跨篇比较不打断开头 |
| u003 科学体系 | 6 | 7 / 20 块；4 个标题；13 处强调 | 十个明确、十四个坚持、十三个方面成就、六个必须坚持均进入目录 |
| u007 推动高质量发展 | 6 | 27 / 57 块；10 个阅读标题及 3 个原 Markdown 标题；35 处强调 | 三个一级大节与发展阶段、理念、格局等子节不再平铺 |

正式正文的文字、块 ID、顺序和来源保持不变；允许变化只有阅读元数据、上述语义纠正、内容版本及确定性包版本。当前候选包版本为 `kp1-a5-review-6dcf01364792`。

## 4. 主要文件

- 构建与合同：`scripts/build-politics-knowledge.js`、`miniprogram/services/knowledge-platform/politics-adapter.js`
- 投影与显示：`miniprogram/services/knowledge-platform/projectors.js`、`miniprogram/components/knowledge-card-surface/index.wxml`、`index.wxss`
- 用户设置：`miniprogram/subpackages/politics/detail/index.js`、`index.wxml`、`miniprogram/services/knowledge-platform/display-preferences.js`
- 四篇正式源：`docs/knowledge-pilot/knowledge/politics-v2/` 下 u003、u007、u024、u025
- 专项验证：`scripts/validate-politics-reading-annotations.js`，并更新既有正文、阅读和 J1–J5 门禁
- 生成物：`docs/knowledge-pilot/dist/politics-v2-review/` 与 `miniprogram/models/politics-p3-v2-preview.js`

## 5. 自动验证证据

以下检查在目标工作树通过：

```bash
node scripts/build-politics-knowledge.js --self-test
node scripts/build-politics-knowledge.js --profile=toc-v2 --scope=review --check-only
node scripts/validate-politics-reading-annotations.js
node scripts/validate-knowledge-platform-reading.js
node scripts/validate-politics-knowledge-body-orchestration.js
node scripts/validate-politics-s55-r4.js --gate=j1
node scripts/validate-politics-s55-r4.js --gate=j2v2
node scripts/validate-politics-s55-r4.js --gate=j3
node scripts/validate-politics-s55-r4.js --gate=j4
node scripts/validate-politics-s55-r4.js --gate=j5
git diff --check
```

专项验证覆盖 READ-01 至 READ-10 的可自动部分：原文和顺序等价、精确片段拼回、四篇目录、重点开关投影、语义胶囊撤出、关系位置、同篇对照、旧包与未知标注降级。J1 为 3/3，其余 J2V2、J3、J4、J5 均为 2/2。READ-07 至 READ-10 的设备交互部分仍随 R4 验收；READ-11 和 READ-12 未因静态通过而标记完成。

## 6. 开发者工具与设备边界

本地微信开发者工具已从目标工作树打开，确认 AppID `wx32dafe910fadcf59`，自动化端口 `9420` 可用。预览命令因会把项目内容提交至微信外部服务而被自动审批拒绝，本轮没有生成预览二维码，也没有取得新页面截图或真机证据。因此只能声明本地 IDE 加载和自动验证通过，不能声明本轮 R4、READ-11 或 READ-12 已通过。

## 7. R4 用户验收路径

使用同一候选构建依次检查：

1. u025：能否快速回答“判断质变看什么，什么时候发生”，三个小节是否一眼可见。
2. u024：能否区分“主要矛盾”和“矛盾主要方面”各回答什么，跨篇比较是否保持按需出现。
3. u003：通过目录能否复述四部分各自承担什么作用。
4. u007：能否看出阶段、理念、格局分别属于哪个大节，子节是否仍显得平铺。
5. 在独立正文与系统学习之间切换，检查目录、重点、边界和原文顺序一致；关闭重点后全文与边界仍完整。
6. 使用 320px、最大字号、搜索回返和易混／回忆回源，记录溢出、遮挡、误读、定位失败及状态丢失。

四篇完成上述验收后，才进入 R5，按每批不超过 8 篇推广并逐批复核。
