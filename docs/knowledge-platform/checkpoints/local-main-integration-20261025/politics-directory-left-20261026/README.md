# 全部知识目录：左图右文 checkpoint（2026-10-26）

保全交接时已完成的政治首页候选，本次接手未再调整视觉参数。目录卡采用左侧目录 SVG、中部现有标题与说明、右侧“进入”及箭头的三列栅格；移除图标透明度，保留原始颜色，image 外框为 52×52px，可见主体约 41×40px。图形列沿用 `var(--politics-glyph-size)`，最小 44px、最大 48px，水平光学校准为 -2.2px。

## 版本与修改范围

- 实际工作树：`/Users/jmac/WeChatProjects/miniprogram-ui-main-baseline-20261025`；分支：`codex/ui-main-baseline-20261025`。
- 接手 HEAD：`cd7c4ffb1adc2fc9ad084e4c02e9941725792db5`；main：`d5032323cdf4d61edfec6f93ee4e7c181c165c50`。
- 修改前恢复引用：`refs/codex/checkpoints/politics-directory-left-before-20261026`，指向上述接手 HEAD；暂存区原为空，原仅有下列两份产品文件的未提交修改。
- `miniprogram/pages/politics/index.wxml`：仅将目录图形节点放到文案前；保留“全部知识”“完整目录 · 按章节查找”、整卡 `handleTerrainTap`、role、aria 与业务行为。
- `miniprogram/pages/politics/index.wxss`：仅目录卡三列布局、图形列、52px 图标及文案内距。
- 每日理论、四张学习方式卡及学习图标 80% 缩放保持接手字节；JS、六份交付 SVG、其他模块、正文、题库、路由、调度、判分、进度、持久化和会话规则未改。本 checkpoint 另包含本目录证据与总 README 的一段索引。

[接手状态、两份产品及六份 SVG 的 SHA-256](source-state.json)和[原始产品差异](product.patch)绑定本候选。六份 SVG 均与接手 HEAD 逐字节一致；`all-knowledge.svg` SHA-256 为 `9f4e64a042efaa7a137980521c5e087919c87f3166a144bdf66fc648acf3d1da`。

## 真实界面证据与限制

[完整截图](after.png)、[目录原像素局部](after-directory.png)、[原始几何测量](after-grid.json)、[截图工具回执](after-screenshot.json)从交接目录逐字节复制保全，未重拍、缩放或修图。来源：`/Users/jmac/.codex/visualizations/2026/10/26/01a17616-5c7b-7ee1-82c4-1ca46da3675a/politics-directory-left/`；回执内保留原始绝对路径。本次接手实际查看整页及局部：图形完整、原色可识别，左图右文与最右“进入”清楚，无可见遮挡。

截图是微信开发者工具模拟器真实页面，非静态样张。截图像素为 674×1500；另一次原始几何读取返回 `route=pages/politics/index`、逻辑宽度 410px。两种尺寸口径及采集时点分别保留，不将截图像素当逻辑屏宽。

| 元素 | left（逻辑 px） | width | height |
|---|---:|---:|---:|
| 目录卡 | 13 | 384 | 69.742 |
| 图形列 | 29 | 45 | 39 |
| image 外框 | 23.305 | 52 | 52 |
| 文案区 | 82 | 251 | 47.742 |
| “进入”区 | 341 | 40 | 19.195 |

标题及副文案实际左边界为 86px。可见主体约 41×40px 是图形观察口径，52×52px 是 image 外框；二者不混用。

**修改前同设备截图采集因 automator 超时失败**，此情况来自交接记录；本目录没有失败原始日志，也没有伪造 before 图。此前 `../politics-icons-80-20261026/after.png` 为 366px 历史设备版本参考，不能构成同尺寸前后对比。当前仅有模拟器真实截图，未新增物理真机证据或用户视觉验收；不重新要求已取消的 320px 测试。

## 验证

交接原始日志 [interaction.txt](interaction.txt)、[home.txt](home.txt)、[offline-compile.txt](offline-compile.txt)保留原字节。接手后对相同产品字节复跑，均正常退出 0；本轮命令、退出码及北京时间写入 `recheck/*.json`：

| 检查 | 结果 | 本轮日志 |
|---|---|---|
| `node scripts/validate-module-home-interactions.js` | 25 项通过 | [interaction](recheck/interaction.txt) |
| `node scripts/validate-politics-home-reading.js` | 通过 | [home](recheck/home.txt) |
| `python3 scripts/validate-integrated-template-compile.py` | 92 项离线模板/样式编译通过 | [offline-compile](recheck/offline-compile.txt) |

这些检查分别提供控制器 stub/静态合同和离线编译证据，不等于当前 IDE 整包编译验收、六入口真实点击往返或真机验收。提交前执行工作区及选择性暂存差异空白检查；回执见 [validation.json](validation.json)。旧政治全树封印不在本批重跑或放宽。

## 恢复与核对

本目录随独立 commit 提交，可用 `git log -1 --format=%H -- docs/knowledge-platform/checkpoints/local-main-integration-20261025/politics-directory-left-20261026/README.md` 找到承载提交。在全新路径以该提交建立隔离工作树即可恢复完整候选；不要对现有 dirty 工作树执行 reset、checkout 覆盖、stash 或 clean。恢复引用保留修改前版本，`product.patch` 留存该版本到本候选的两文件差异。

`manifest.json` 记录本目录除自身外全部证据文件的 SHA-256，并绑定两份产品与六份 SVG。可从仓库根目录只读核验：

```sh
python3 - <<'PY'
from pathlib import Path
import hashlib, json
root = Path.cwd()
base = root / 'docs/knowledge-platform/checkpoints/local-main-integration-20261025/politics-directory-left-20261026'
manifest = json.loads((base / 'manifest.json').read_text())
for group, anchor in [('checkpoint_files', base), ('bound_source_files', root)]:
    for name, expected in manifest[group].items():
        assert hashlib.sha256((anchor / name).read_bytes()).hexdigest() == expected, name
print('checkpoint and bound source hashes verified')
PY
```

本次仅在隔离 UI 分支保存，不改 main、不合并、不推送、不发布；停在用户视觉确认处，不继续改其他卡片或推广笔记/常识。
