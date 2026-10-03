# 政治 P3 V2 — S0 实施基线

> 状态：Complete — 2026-08-28自动基线已记录
>
> 依据：SHIP-001至SHIP-005、SHIP-011至SHIP-014
>
> 本阶段不改变页面、运行包或内容发布状态

## 1. 回归点

- Git：detached `HEAD`，基准提交 `c71de6b60bf5d62a6010826e8b56f2c9095428eb`。
- 工作区：139项未提交路径，其中82项已跟踪修改、57项未跟踪；按顶层为 `docs=98`、`miniprogram=20`、`scripts=20`、`政治理论=1`。
- 这些修改是此前内容审计、政治P3、常识恢复和用户既有工作的共同现场；S1不得重置、覆盖或把无关文件纳入修复。
- 小程序：项目名“行测速练”，`miniprogramRoot=miniprogram/`，基础库配置2.20.1。

## 2. 路由与模块基线

- 自定义主导航共4项：笔记、训练、常识、政治理论。
- 政治主页面：`pages/politics/index`。
- 政治分包：`map/index`、`search/index`、`detail/index`。
- 常识分包：`level/index`、`category/index`、`search/index`、`detail/index`。
- 笔记分包：`module/index`、`category/index`、`search/index`、`detail/index`。
- S1只新增未被页面引用的通用服务；政治现有页面仍为当前可运行基线，常识和笔记保持 `legacy`。

## 3. 政治 review 包基线

| 项目 | 基线 |
|---|---|
| schema / package | v3 / `review-526a57847b9c` |
| buildScope | `review` |
| 正式导航节点 | 42 |
| 知识单元 | 37 |
| 正式正向关系 | 39；前置DAG；最大度数5 |
| 内容与易混块 | 643 |
| 搜索索引 | 37 |
| 状态 | 37 review、0 publishable |
| 风险页 | 4、7、15、16、17、20、21、36、49、57、70 |

关键哈希：

```text
politics-p3-v2-preview.js        5eb275c07b99a0c275d1fdfa9778db78c37b52718defbfa8b6da077c31a5e23f
politics-v2-review-preview.json  e12b3ae6449baf481379b1c08601cf37f2c7db0b604ae56f3878c9c22527f559
political-relations-v2 JSON      1991892132ceba2b2048e913ab26a380d21fb9eee013644f94090b6a668e74bd
political-toc-structure JSON     9bd77b3fe061e2b31a7bdbc5dfc3c71467280a77cded88f256b8a84165f59878
app.json                         5e842b06ec88ad6fc82ffc653634a4faec7c2851528a0e570282717b546cad72
theme.wxss                       ff35b108d7ba6e6e1f25f3ae27d6cf12e1f21af73d5d8f52f48b44b3df18b1d4
ui.wxss                          d9047522bcef69817ad1db440fc6b58feaba963a469d572240fb9c5db39a09a0
```

哈希用于识别实施期间的变化，不代表内容发布批准。

## 4. 自动校验结果

### 通过

- 政治目录第二轮审计：42节点、37单元、25迁移、11风险页。
- 政治旧内容隔离：25 review-scope、6 runtime、11风险页保留。
- 政治V2内容：37 review、42目录、0可发布。
- 政治关系：39条、DAG、最大度数5。
- 政治现有展现：37点、schema v3。
- 政治 builder self-test通过。
- 政治 `toc-v2/review --check-only` 连续两次通过，均报告37/37。
- 常识数量：170；人文38、科技36、经济40、法律56。
- 常识源文审计：0问题。
- 常识现行法双层审计：163个知识点，0问题。
- 笔记/训练主校验：数据分析33、数量44、判断30、言语19、图形36、常识170，0错误。

### 已有失败，不属于政治S1回归

`validate-common-sense-knowledge-point-tabs.js` 当前退出1：170张卡、653个源文知识点，共273项问题，其中：

- 页签标题与源文知识点标题不一致：187。
- 源文知识点未映射独立页签：82。
- 单页签承载多个源文知识点：4。

该校验器及其相关常识修改在S0前已存在。政治S1不得修改常识数据来消除它，也不得增加273的数量；它将在常识独立迁移前作为基线债务处理。

笔记主校验另有32项“搜索元数据不完整”warning，当前不阻塞且不得因S1增加。

## 5. S0结论

- 政治数据、关系、隔离发布和现有P3展现可作为S1真实夹具。
- 运行端未发现对Obsidian、社区插件、`.base`或`.canvas`知识文件的依赖。
- S1可以开始，但只能增加通用纯逻辑、自动门禁和阶段配置；不得改变现有页面视觉或内容发布资格。
- S1通过标准：政治现有5项校验继续通过，常识/笔记主校验不退化，常识独立页签问题仍为273且不增加。
