# 14 政治理论目录优先第二轮审计

> 批次：`20260827-toc-v2`
>
> 状态：PDF 重新提取、目录结构审计、正文边界校对、新旧迁移和 37 篇结构化加工已完成；内容事实与风险页专项校对继续进行

## 为什么重跑

第一轮生成器虽然记录了章、节上下文，但只在遇到正文“知识点”标题时创建新单元，同时跳过了 PDF 目录页。结果是目录中的“节”没有成为知识边界：

- 原 `politics-kp-004` 吞入第二章第一节、第二节。
- 原 `politics-kp-007` 吞入第二章第四节至第十五节。
- 25 篇加工稿最终只形成 3 个扁平分类，不能代表原资料结构。

因此不在旧稿上局部打补丁，而是从同一 PDF、同一来源哈希重新建立独立审计批次。

## 第二轮流水线

```text
政治理论.pdf
  → 72 页重新渲染与原生文本提取
  → 第 1–2 页目录解析
  → 目录节点与正文标题逐一匹配
  → 按“节 / 知识点”重新切分正文
  → 37 篇隔离审计草稿
  → 风险页映射、视觉边界复核、新旧 ID 迁移分析
```

本轮不覆盖第一轮 `01-raw`、当前 `knowledge/politics`、正式构建包或现有小程序模型；V2 使用独立知识目录、校对包和试验模型。

## 审计结果

- PDF：72 页，来源哈希与第一轮一致。
- 目录页：PDF 第 1–2 页。
- 目录节点：42 个。
  - 部分：1。
  - 篇：2。
  - 章：2。
  - 节：15。
  - 目录知识点：22。
- 主要内容单元：37 个。
  - 第一篇第一章：4 个知识点。
  - 第一篇第二章：15 个节；第三节内部 3 个知识点先保留为正文子结构。
  - 第二篇：18 个知识点。
- 目录标题与正文起始页匹配：42 / 42。
- 正文覆盖：PDF 第 4–72 页，无页面缺口。
- 内容风险页：4、7、15、16、17、20、21、36、49、57、70。
- PDF 第 3 页为部分封面，插图风险保留在页级证据，但不形成学习单元。

## 视觉校对

已查看：

- PDF 第 1–2 页完整目录。
- 37 个内容单元的全部起始页。
- 11 个命中表格或插图风险的内容页。
- 第一篇第二章、第二篇开始等关键跨层边界。

结论：目录标题、正文标题、起始页和单元切分一致；没有发现标题错配或跨节吞并。表格、插图和固定表述风险仍保持开放，必须进入后续内容专项校对。

## 新旧迁移

- 一对一：21 个旧单元，后续可以保留稳定知识 ID。
- 拆分重分配：2 个。
  - `politics-kp-004` → 中国式现代化、第一节、第二节。
  - `politics-kp-007` → 第三节至第十五节。
- 并入目录节：2 个。
  - `politics-kp-005`、`politics-kp-006` → 第三节“推动高质量发展”的内部子结构。

完整机器可读迁移表见 `political-toc-migration-20260827-v2.json`。

## 可重复执行

```text
python3 scripts/extract-common-sense-pdf.py 政治理论/政治理论.pdf \
  --output-dir tmp/pdfs/political-toc-audit-20260827-v2 \
  --report docs/knowledge-pilot/political-source-quality-toc-audit-20260827-v2.md \
  --ocr none --dpi 220

python3 scripts/generate-political-toc-audit-v2.py \
  --resolved tmp/pdfs/political-toc-audit-20260827-v2/resolved-text.md \
  --manifest tmp/pdfs/political-toc-audit-20260827-v2/manifest.json \
  --output-dir docs/knowledge-pilot/sources/politics/02-toc-audit-v2 \
  --structure docs/knowledge-pilot/political-toc-structure-20260827-v2.json \
  --audit docs/knowledge-pilot/political-toc-audit-20260827-v2.json \
  --report docs/knowledge-pilot/political-toc-audit-summary-20260827-v2.md \
  --old-audit docs/knowledge-pilot/political-p2a-p2b-audit-20260827.json \
  --migration docs/knowledge-pilot/political-toc-migration-20260827-v2.json

node scripts/validate-political-toc-audit-v2.js
```

## 后续门禁

1. 37 篇第二轮草稿已加工为摘要、完整内容、辨析和速记卡，保持 `review` 与 `pending_final`。
2. 已建立 `parent_id`、`node_type`、`toc_order` 和完整路径字段，并生成 42 节点树形校对包。
3. 11 个内容风险页继续执行页面图专项核对，固定政治表述继续事实校对。
4. 第二轮内容审核通过后才允许替换正式运行数据；P3 可先使用独立 V2 试验模型进行树形展现联调。
5. 当前 25 篇 P3 数据只保留为展示组件回归夹具，不再作为知识架构验收基线。

结构化加工与隔离构建的维护方式见 [15-政治目录 V2 内容加工与构建](./15-political-toc-v2-content-build.md)。
