# 09. 政治理论试点｜素材接入日志（第一轮）

时间：2026-08-27
目标：启动政治理论模块试点工作流 P0/P1，并形成可追溯的第一轮接入记录。

## 1. 源文件登记（P0）

- 源文件：`政治理论/政治理论.pdf`
- 页数：`72`
- SHA-256：`437d11b5402ec46944f452692e0562e57793d556ba5e085df064287d8adc8b7b`
- 文件大小：`3,689,470` 字节
- 供应来源：用户本地提供

## 2. 执行动作（P1）

### 2.1 版式抽样与可视化检查
- 使用 `pdftoppm` 渲染全部 72 页到图片：
  - 目录：`/tmp/politics-pilot-pages/all`
- 结果：72 张图片均成功生成（`page-01.png` 到 `page-72.png`）。

### 2.2 风险抽样（基于图像统计）
用图像的非白像素比例进行快速扫描，仅用于排定优先复核页：
- 内容密度较高（优先审阅）：
  - `5,7,8,9,10,17,21,30,49,69`
- 可能偏空白/空页（排除或复检）：
  - `1,3,13,14,45,48,55,56,59,72`

### 2.3 OCR/文字抽取尝试
- 尝试复用仓库现有脚本 `scripts/extract-common-sense-pdf.py`：
  - 失败原因：Python 运行时缺少 `pdfplumber` 依赖（`ModuleNotFoundError`）。
- 备选 `tesseract + chi_sim`：
  - 当前环境仅有 `eng/snum/osd` 三类语言，缺失中文语言模型 `chi_sim`，中文识别不可用。
- 备选 `scripts/vision-ocr.swift`：
  - 编译在当前沙箱环境可达但调用时报 `nilError`，未产出稳定 OCR 结果。

## 3. 阶段结论

第一轮 P1 已建立“接入骨架”，并完成文本链路可执行化。当前可继续进入首批结构化审计，但中文 OCR 回退仍有环境风险，需并行修复：

1. 可用中文 OCR（推荐）：
   - 本地安装可行的中文 OCR 引擎（例如可用的 `tesseract chi_sim` 或替代服务）。
2. 视野内补齐本机 Vision 回退执行链路：让 `vision-ocr` 可稳定返回文字。
   - 以便复跑 `--ocr all/auto` 并补齐可疑页再校验。

## 4. 下一步（可直接执行）

- 1-1 首轮页级输出：已完成（`--ocr none`）。
  - 输出：`tmp/pdfs/political-pilot-20260827` 与报告 `docs/knowledge-pilot/political-source-quality-ocr-none-20260827.md`。
- 继续推进 `political` 试点管线：
  - 风险页优先切分
  - 结构化知识点草稿
  - 人工抽检 + 建议采纳
- 计划同时补一个并行动作：
  - 修复 Vision OCR 多路回退后复跑 `--ocr all`，补齐中文低置信度与疑难页对照。
- 当前建议先保持“非侵入试点”：继续把已有小程序知识模块不改动，仅在本地完成政治模块的 `source -> evidence -> draft` 链路验证。

## 2.4 2026-08-27 追加：文本链路成功执行结果

- 成功路径：`python3 scripts/extract-common-sense-pdf.py '政治理论/政治理论.pdf' --ocr none --dpi 220`
- 关键产物：
  - 质量报告：`docs/knowledge-pilot/political-source-quality-ocr-none-20260827.md`
  - 输出目录：`tmp/pdfs/political-pilot-20260827`
- 质量摘要：
  - CID 乱码页：`0`
  - OCR 回退页：`0`（本次未触发 OCR 回退）
  - 表格页：`7,15,16,17,20,21,36,49,57,70`
  - 正文插图候选：`3,4`

## 2.5 2026-08-27 追加：P2A/P2B 全量化草稿生成结果

- 执行方式：`python3 scripts/generate-political-p2a-p2b.py --resolved tmp/pdfs/political-pilot-20260827/resolved-text.md --manifest tmp/pdfs/political-pilot-20260827/manifest.json --output-dir docs/knowledge-pilot/sources/politics/01-raw --report docs/knowledge-pilot/political-batch-p2a-p2b-summary-20260827.md --audit docs/knowledge-pilot/political-p2a-p2b-audit-20260827.json --run-id 20260827 --overwrite`
- 结果：
  - 全量草稿数：`25`
  - 覆盖页码：`4-72`（1-3 为目录页未进入草稿）
  - 风险页：`4,7,15,16,17,20,21,36,49,57,70`
  - 草稿目录：`docs/knowledge-pilot/sources/politics/01-raw`
  - 汇总与审计文件：
  - `docs/knowledge-pilot/political-batch-p2a-p2b-summary-20260827.md`
  - `docs/knowledge-pilot/political-p2a-p2b-audit-20260827.json`
- 说明：当前处于“全量起草完成、待人工抽样复核”阶段；页面 4、7、15、16、17、20、21、36、49、57、70、3、4（插图）仍为高风险关注点。

## 2.6 2026-08-27 追加：P2B 草稿清洗

- 执行动作：对 `docs/knowledge-pilot/sources/politics/01-raw` 全量 25 篇 Markdown 做“去广告清洗”：
  - 移除 `抖音关注公考...时政要点即时学` 结构化广告句；
  - 将 `【小黑母题特训】` 统一替换为 `母体特训`；
  - 去除 `小黑` 人名相关短语；
  - 删除冗余广告空行并校验无残留命中。
- 结果：未检出上述广告字段残留，文本可直接进入下一步校验与试阅流程。
- 影响范围：本次清洗仅作用于 01-raw 中 25 个 P2A/P2B 草稿文件。

## 2.7 2026-08-27 追加：规则修正（恢复后替换）

- 因先前已清理过导致 `【小黑母题特训】` 无法按要求替换，已执行回滚重生成：
  - 重新执行 P2A/P2B 全量草稿生成（`--overwrite`）还原原始草稿
  - 本轮清洗规则更新为：
    - 删除 `抖音关注公考...时政要点即时学` 行；
    - `【小黑母题特训】` 统一替换为 `母体特训`；
- 结果校验：
  - `小黑` / `抖音关注` / `时政要点即时学` / `小黑母题特训` 在 01-raw 中均未出现；
  - `母体特训` 共计 39 处，均在已替换位置。
- 影响范围：`docs/knowledge-pilot/sources/politics/01-raw`（25篇）
